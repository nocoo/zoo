import hashlib
import io
import json
import os
import struct
import subprocess
import sys
import threading
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))
import generate as gen
import process as proc

source = (HERE / 'generate.py').read_text()
assert 'AZURE_OPENAI' not in source
assert 'urllib' not in source
assert 'generate_azure.py' in source
assert 'subprocess.Popen' in source
assert gen.SPACING == 40 and gen.WORKERS == 3
assert gen.ROOT == gen.HERE.parents[2]
assert gen.HELPER == gen.HERE.parent / 'hd/2026-10-10/generate_azure.py'
assert gen.HELPER.is_file()
assert gen.REQUIRED <= {'id', 'category', 'subject', 'references', 'note'}
assert len(gen.APPROVED_IDS) == len(set(gen.APPROVED_IDS)) == 77
assert gen.APPROVED_IDS == (
    tuple(f'transport-{index:02d}' for index in range(1, 11))
    + tuple(f'vegetables-{index:02d}' for index in range(1, 10))
    + tuple(f'food-{index:02d}' for index in range(1, 11))
    + tuple(f'places-{index:02d}' for index in range(1, 9))
    + tuple(f'objects-{index:02d}' for index in range(21, 32))
    + tuple(f'animals-{index:02d}' for index in range(21, 30))
    + tuple(f'phrases-{index:02d}' for index in range(21, 30))
    + tuple(f'weather-{index:02d}' for index in range(21, 26))
    + tuple(f'fruits-{index:02d}' for index in range(21, 27))
)

buffer = io.BytesIO()
Image.new('RGB', (2048, 1792), (250, 246, 232)).save(buffer, 'PNG')
NATIVE = buffer.getvalue()
assert NATIVE[:8] == b'\x89PNG\r\n\x1a\n'
assert struct.unpack('>II', NATIVE[16:24]) == (2048, 1792)


def write_png(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(NATIVE)


def write_success(folder, item, root):
    folder.mkdir(parents=True, exist_ok=True)
    folder = folder.resolve()
    write_png(folder / 'raw/generated.png')
    prompt = (folder / 'prompt.txt').read_text()
    images = []
    for index, relative in enumerate(item['references'], 1):
        full = (root / relative).resolve()
        data = full.read_bytes()
        images.append({
            'index': index,
            'path': os.path.relpath(full, folder),
            'sha256': hashlib.sha256(data).hexdigest(),
        })
    (folder / 'request.json').write_text(json.dumps({
        'parameters': {'model': gen.MODEL, 'size': gen.SIZE, 'quality': gen.QUALITY},
        'promptFile': 'prompt.txt',
        'promptSha256': hashlib.sha256(prompt.encode()).hexdigest(),
        'images': images,
    }) + '\n')
    digest = hashlib.sha256(NATIVE).hexdigest()
    (folder / 'response.json').write_text(json.dumps({
        'status': 'succeeded',
        'output': {'sha256': digest, 'width': 2048, 'height': 1792},
    }) + '\n')


def write_generated(command):
    folder = Path(command[command.index('--run-dir') + 1]).resolve()
    refs = [command[index + 1] for index, part in enumerate(command) if part == '--image']
    write_png(folder / 'raw/generated.png')
    prompt = (folder / 'prompt.txt').read_text()
    images = []
    for index, path in enumerate(refs, 1):
        data = Path(path).read_bytes()
        images.append({
            'index': index,
            'path': os.path.relpath(path, folder),
            'sha256': hashlib.sha256(data).hexdigest(),
        })
    (folder / 'request.json').write_text(json.dumps({
        'parameters': {'model': gen.MODEL, 'size': gen.SIZE, 'quality': gen.QUALITY},
        'promptFile': 'prompt.txt',
        'promptSha256': hashlib.sha256(prompt.encode()).hexdigest(),
        'images': images,
    }) + '\n')
    digest = hashlib.sha256(NATIVE).hexdigest()
    (folder / 'response.json').write_text(json.dumps({
        'status': 'succeeded',
        'output': {'sha256': digest, 'width': 2048, 'height': 1792},
    }) + '\n')


def popen_ok(command, **kwargs):
    class Proc:
        def wait(self):
            write_generated(command)
            return 0
    return Proc()


def snapshot(path):
    return {str(p.relative_to(path)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in path.rglob('*') if p.is_file()}


def record(identifier, category, subject='subject'):
    return {
        'id': identifier,
        'category': category,
        'subject': subject,
        'references': ['refs/style.png'],
    }


def tree(root, ids, *, prompts=True):
    run = root / 'dated'
    run.mkdir(parents=True)
    write_png(root / 'refs/style.png')
    (root / 'src').mkdir()
    (root / 'src/expansion-art.json').write_text(json.dumps({'images': {}}, indent=2) + '\n')
    items = [record(identifier, identifier.split('-')[0]) for identifier in ids]
    (run / 'manifest.json').write_text(json.dumps(items, indent=2) + '\n')
    if prompts:
        for identifier in ids:
            folder = run / identifier
            folder.mkdir()
            (folder / 'prompt.txt').write_text(f'Redraw {identifier} in the established style.\n')
    return run, items


def patched(root, run, ids):
    return patch.multiple(gen, ROOT=root, RUN=run, APPROVED_IDS=tuple(ids), LOCK_PATH=root / 'expansion.lock')


ids2 = ('transport-01', 'transport-02')
ids5 = ('transport-01', 'transport-02', 'transport-03', 'vegetables-01', 'vegetables-02')

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    with patched(root, run, ids2):
        loaded = gen.load_items()
        assert [item['id'] for item in loaded] == list(ids2)
        assert gen.pending_items(loaded) == loaded
        assert gen.select(loaded, '') == loaded
        assert [item['id'] for item in gen.select(loaded, 'transport-02,transport-01')] == ['transport-02', 'transport-01']
        try:
            gen.select(loaded, 'nope-01')
            raise AssertionError('invented --ids must fail')
        except ValueError as error:
            assert 'Unknown id' in str(error)
        try:
            gen.select(loaded, 'transport-01,transport-01')
            raise AssertionError('duplicate --ids must fail')
        except ValueError as error:
            assert 'Invalid --ids' in str(error)
        extra = json.loads((run / 'manifest.json').read_text())
        extra[0]['note'] = 'extra-key'
        (run / 'manifest.json').write_text(json.dumps(extra, indent=2) + '\n')
        assert gen.load_items()[0]['note'] == 'extra-key'
        del extra[0]['subject']
        (run / 'manifest.json').write_text(json.dumps(extra, indent=2) + '\n')
        try:
            gen.load_items()
            raise AssertionError('missing required field must fail')
        except ValueError as error:
            assert 'missing fields' in str(error)
        (run / 'manifest.json').write_text(json.dumps(items[:1], indent=2) + '\n')
        try:
            gen.load_items()
            raise AssertionError('short manifest must fail')
        except ValueError as error:
            assert 'approved' in str(error) and 'source order' in str(error)

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    before = snapshot(root)
    with patched(root, run, ids2), patch.object(gen.subprocess, 'Popen') as launcher, patch.object(sys, 'argv', ['generate.py', '--check']):
        gen.main()
        launcher.assert_not_called()
        assert gen.pending_items(items) == items
        assert snapshot(root) == before
        assert not (root / 'expansion.lock').exists()

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    with patched(root, run, ids2):
        write_success(run / 'transport-01', items[0], root)
        assert gen.complete(items[0]) is True
        (run / 'transport-02/request.json').write_text('{}\n')
        try:
            gen.complete(items[1])
            raise AssertionError('request without response must block')
        except ValueError as error:
            assert 'Outcome unknown' in str(error) or 'mismatch' in str(error) or 'Prompt changed' in str(error)
        (run / 'transport-02/request.json').unlink()
        (run / 'transport-02/response.json').write_text(json.dumps({'status': 'failed'}) + '\n')
        try:
            gen.complete(items[1])
            raise AssertionError('failed response must block')
        except ValueError as error:
            assert 'Orphan' in str(error) or 'rejected' in str(error)
        (run / 'transport-02/response.json').unlink()
        (run / 'transport-02/raw-review.json').write_text('{}\n')
        try:
            gen.complete(items[1])
            raise AssertionError('orphan review must fail')
        except ValueError as error:
            assert 'Orphan' in str(error)
        (run / 'transport-02/raw-review.json').unlink()
        write_png(run / 'transport-02/raw/generated.png')
        try:
            gen.complete(items[1])
            raise AssertionError('orphan raw must fail')
        except ValueError as error:
            assert 'Orphan' in str(error)
        (run / 'transport-01/prompt.txt').write_text('changed prompt\n')
        try:
            gen.complete(items[0])
            raise AssertionError('changed prompt must not reuse the image')
        except ValueError as error:
            assert 'Prompt changed' in str(error)
        (run / 'transport-01/prompt.txt').write_text('Redraw transport-01 in the established style.\n')
        write_png(root / 'refs/other.png')
        other = dict(items[0], references=['refs/other.png'])
        try:
            gen.complete(other)
            raise AssertionError('reference path change must fail')
        except ValueError as error:
            assert 'Reference' in str(error)
        changed = io.BytesIO()
        Image.new('RGB', (2048, 1792), (250, 240, 232)).save(changed, 'PNG')
        (root / 'refs/style.png').write_bytes(changed.getvalue())
        try:
            gen.complete(items[0])
            raise AssertionError('reference hash change must fail')
        except ValueError as error:
            assert 'Reference' in str(error)
        write_png(root / 'refs/style.png')
        request = json.loads((run / 'transport-01/request.json').read_text())
        request['parameters']['quality'] = 'low'
        (run / 'transport-01/request.json').write_text(json.dumps(request) + '\n')
        try:
            gen.complete(items[0])
            raise AssertionError('quality mismatch must fail')
        except ValueError as error:
            assert 'model/size/quality' in str(error)

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    write_png(root / 'refs/b.png')
    items[0] = dict(items[0], references=['refs/style.png', 'refs/b.png'])
    with patched(root, run, ids2):
        write_success(run / 'transport-01', items[0], root)
        assert gen.complete(items[0]) is True
        try:
            gen.complete(dict(items[0], references=['refs/b.png', 'refs/style.png']))
            raise AssertionError('reference order must fail')
        except ValueError as error:
            assert 'Reference' in str(error)

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    with patched(root, run, ids2):
        write_success(run / 'transport-01', items[0], root)
        original = (run / 'transport-01/raw/generated.png').read_bytes()
        calls = []

        def skip_complete(command, **kwargs):
            calls.append(command)
            raise AssertionError('complete natives must not be requested')

        with patch.object(gen.subprocess, 'Popen', skip_complete):
            gen.run([items[0]])
            assert calls == []
            assert (run / 'transport-01/raw/generated.png').read_bytes() == original

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    with patched(root, run, ids2):
        write_success(run / 'transport-01', items[0], root)
        (run / 'transport-01/response.json').unlink()
        (run / 'transport-01/raw/generated.png').unlink()
        assert gen.outcome(items[0]) == 'blocked'
        assert gen.complete(items[0]) is False
        try:
            gen.pending_items([items[0]])
            raise AssertionError('in-flight request must not be queued')
        except ValueError as error:
            assert 'Outcome unknown' in str(error)
        before = snapshot(root)
        with patch.object(gen.subprocess, 'Popen') as launcher, patch.object(sys, 'argv', ['generate.py', '--check']):
            gen.main()
            launcher.assert_not_called()
        assert snapshot(root) == before
        with patch.object(gen.subprocess, 'Popen') as launcher:
            try:
                gen.generate(items[0])
                raise AssertionError('in-flight must not call the helper')
            except ValueError as error:
                assert 'Outcome unknown' in str(error)
            launcher.assert_not_called()
        records = proc.collect(items, True)
        assert records == []
        assert not (root / 'public/art/expansion').exists()

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    sleeps = []
    clock = [1000.0]

    def fake_sleep(seconds):
        assert gen.LOCK.locked()
        sleeps.append(seconds)
        clock[0] += seconds

    with patched(root, run, ids2), patch.object(gen, 'WORKERS', 1), \
            patch.object(gen.subprocess, 'Popen', popen_ok), \
            patch.object(gen.time, 'monotonic', lambda: clock[0]), \
            patch.object(gen.time, 'sleep', fake_sleep):
        gen.run(items)
        assert sleeps == [0, 40]

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    launches = []
    clock = [1000.0]
    slow = {'done': False}
    original_resolve = gen.resolve_ref

    def slow_resolve(path):
        full = original_resolve(path)
        if not slow['done']:
            clock[0] += 10
            slow['done'] = True
        return full

    def fake_popen(command, **kwargs):
        launches.append(clock[0])
        return popen_ok(command)

    def fake_sleep(seconds):
        assert gen.LOCK.locked()
        clock[0] += seconds

    with patched(root, run, ids2), patch.object(gen, 'WORKERS', 1), \
            patch.object(gen.subprocess, 'Popen', fake_popen), \
            patch.object(gen, 'resolve_ref', slow_resolve), \
            patch.object(gen.time, 'monotonic', lambda: clock[0]), \
            patch.object(gen.time, 'sleep', fake_sleep):
        gen.run(items)
        assert launches == [1010.0, 1050.0]

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    captured = []

    def capture(cmd, **kwargs):
        captured.append(cmd)
        return popen_ok(cmd)

    with patched(root, run, ids2), patch.object(gen.subprocess, 'Popen', capture):
        gen.FAILED.clear()
        gen.NEXT = 0.0
        gen.generate(items[0])
        command = captured[0]
        assert command[command.index('--model') + 1] == 'gpt-image-2.5-sunburst'
        assert command[command.index('--size') + 1] == '2048x1792'
        assert command[command.index('--image') + 1].endswith('refs/style.png')
        assert (root / 'refs/style.png').read_bytes() == NATIVE

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids5)
    calls = []
    barrier = threading.Barrier(3)

    def fake_popen(command, **kwargs):
        folder = Path(command[command.index('--run-dir') + 1])
        calls.append(folder.name)

        class Proc:
            def wait(self):
                barrier.wait(timeout=2)
                if folder.name == 'transport-01':
                    return 1
                write_generated(command)
                return 0
        return Proc()

    with patched(root, run, ids5), patch.object(gen, 'SPACING', 0), patch.object(gen.subprocess, 'Popen', fake_popen):
        try:
            gen.run(items)
            raise AssertionError('first error must stop the run')
        except subprocess.CalledProcessError:
            pass
        assert 1 <= len(calls) <= 3
        assert 'vegetables-01' not in calls and 'vegetables-02' not in calls
        assert (root / 'refs/style.png').read_bytes() == NATIVE

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    ran = []
    with patched(root, run, ids2), patch.object(gen.fcntl, 'flock', side_effect=BlockingIOError):
        try:
            gen.with_lock(lambda: ran.append(True))
            raise AssertionError('busy lock must fail')
        except BlockingIOError:
            pass
        assert ran == []

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    assert json.loads((root / 'src/expansion-art.json').read_text()) == {'images': {}}
    before = (root / 'src/expansion-art.json').read_bytes()
    with patched(root, run, ids2):
        records = proc.collect(items, True)
        assert records == []
        assert not (root / 'public/art/expansion').exists()
        assert (root / 'src/expansion-art.json').read_bytes() == before

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    with patched(root, run, ids2):
        write_success(run / 'transport-01', items[0], root)
        records = proc.collect(items, False)
        assert len(records) == 1
        full = root / 'public/art/expansion/transport-01-full.webp'
        thumb = root / 'public/art/expansion/transport-01-thumb.webp'
        with Image.open(full) as image:
            assert image.size == (2048, 1792)
        with Image.open(thumb) as image:
            assert image.size == (640, 560)
        art = json.loads((root / 'src/expansion-art.json').read_text())
        digest_thumb = hashlib.sha256(thumb.read_bytes()).hexdigest()[:16]
        digest_full = hashlib.sha256(full.read_bytes()).hexdigest()[:16]
        assert art == {'images': {'transport-01': {
            'image': f'/art/expansion/transport-01-thumb.webp?v={digest_thumb}',
            'imageLarge': f'/art/expansion/transport-01-full.webp?v={digest_full}',
        }}}
        assert (run / 'transport-contact.jpg').is_file()
        assert not (root / 'public/art/expansion/transport-02-full.webp').exists()

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    run, items = tree(root, ids2)
    with patched(root, run, ids2):
        write_success(run / 'transport-01', items[0], root)
        native = Image.new('RGB', (2048, 1792), proc.atlas.PAPER)
        ImageDraw.Draw(native).rectangle((2000, 1744, 2046, 1790), fill=(10, 200, 30))
        for point in ((0, 0), (2047, 0), (0, 1791), (2047, 1791)):
            native.putpixel(point, proc.atlas.PAPER)
        source = run / 'transport-01/raw/generated.png'
        native.save(source, 'PNG')
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        (run / 'transport-01/response.json').write_text(json.dumps({
            'status': 'succeeded',
            'output': {'sha256': digest, 'width': 2048, 'height': 1792},
        }) + '\n')
        with Image.open(source) as raw:
            image = proc.atlas.normalize_paper(raw.convert('RGB'), tolerance=8)
            drifted = image.resize((640, 560), Image.Resampling.LANCZOS)
            corner = drifted.getpixel((639, 559))
            assert corner != proc.atlas.PAPER
            assert max(abs(corner[i] - proc.atlas.PAPER[i]) for i in range(3)) > 8
            again = proc.atlas.normalize_paper(drifted, tolerance=8)
            assert again.getpixel((639, 559)) != proc.atlas.PAPER
            restored = proc.resample(image, (640, 560))
            for point in ((0, 0), (639, 0), (0, 559), (639, 559)):
                assert restored.getpixel(point) == proc.atlas.PAPER
        records = proc.collect(items, False)
        assert len(records) == 1
        thumb = root / 'public/art/expansion/transport-01-thumb.webp'
        with Image.open(thumb) as saved:
            saved = saved.convert('RGB')
            for point in ((0, 0), (639, 0), (0, 559), (639, 559)):
                assert saved.getpixel(point) == proc.atlas.PAPER
        again = proc.collect(items, True)
        assert len(again) == 1
        (root / 'public/art/expansion/orphan.webp').write_bytes(b'nope')
        try:
            proc.collect(items, True)
            raise AssertionError('orphan must fail')
        except ValueError as error:
            assert 'Orphan' in str(error)
        (root / 'public/art/expansion/orphan.webp').unlink()
        (run / 'transport-02/delivery.json').write_text('{}\n')
        try:
            proc.collect(items, True)
            raise AssertionError('delivery without native must fail')
        except ValueError as error:
            assert 'Conflict' in str(error)

lock = gen.LOCK_PATH
art = gen.ROOT / 'src/expansion-art.json'
before_lock = lock.exists()
before_art = art.read_bytes()
with patch.object(sys, 'argv', ['generate.py', '--check']), patch.object(gen.subprocess, 'Popen') as launcher:
    gen.main()
    launcher.assert_not_called()
assert lock.exists() == before_lock
assert art.read_bytes() == before_art
with patch.object(sys, 'argv', ['process.py', '--check']):
    proc.main()
assert lock.exists() == before_lock
assert art.read_bytes() == before_art

samples = {item['id']: item for item in gen.load_items()}
arrived = []
for identifier in ('transport-01', 'vegetables-01', 'phrases-21'):
    result = gen.outcome(samples[identifier])
    assert result in ('done', 'pending', 'blocked')
    if result == 'done':
        arrived.append(identifier)
        assert gen.complete(samples[identifier]) is True
assert set(arrived) <= {'transport-01', 'vegetables-01', 'phrases-21'}

print('expansion illustration checks passed', flush=True)
