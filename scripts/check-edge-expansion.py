import asyncio
import hashlib
import importlib.util
import json
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import AsyncMock, patch
import subprocess

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('edge', Path(__file__).with_name('generate-edge-audio.py'))
edge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(edge)
assert 'edge_tts' not in sys.modules

expansion_batch = {'cards': 'expansionCategories', 'cards_expected': 77, 'jobs_expected': 154}
expansion_items = edge.load_cards(expansion_batch)
active_items = edge.load_cards(None)
expansion_jobs = edge.jobs_for(expansion_items, expansion_batch)
active_jobs = edge.jobs_for(active_items, None)
assert 'edge_tts' not in sys.modules

assert len(expansion_items) == 77
assert len(expansion_jobs) == 154
assert [item['id'] for item in expansion_items] == [
    *[f'transport-{index:02d}' for index in range(1, 11)],
    *[f'vegetables-{index:02d}' for index in range(1, 10)],
    *[f'food-{index:02d}' for index in range(1, 11)],
    *[f'places-{index:02d}' for index in range(1, 9)],
    *[f'objects-{index:02d}' for index in range(21, 32)],
    *[f'animals-{index:02d}' for index in range(21, 30)],
    *[f'phrases-{index:02d}' for index in range(21, 30)],
    *[f'weather-{index:02d}' for index in range(21, 26)],
    *[f'fruits-{index:02d}' for index in range(21, 27)],
]
assert [(item['id'], language) for item, language in expansion_jobs] == [
    pair for item in expansion_items for pair in ((item['id'], 'zh'), (item['id'], 'en'))
]
assert expansion_jobs[0][0]['text'] == '小汽车。小汽车有四个轮子，载着我们出门。'
assert expansion_jobs[1][0]['english'] == 'Car. A car has four wheels and can take us out.'
assert expansion_jobs[-2][1] == 'zh' and expansion_jobs[-1][1] == 'en'
assert expansion_jobs[-1][0]['id'] == 'fruits-26'
assert expansion_jobs[-1][0]['english'] == 'Bayberry. A bayberry is red with a bumpy surface, and it tastes sweet and tart.'
assert len(active_items) == 296
active_by_id = {item['id']: item for item in active_items}
assert all(item == active_by_id[item['id']] for item in expansion_items)

lion = next(item for item in active_items if item['id'] == 'animals-01')
assert lion['english'] == 'Lion'
assert lion['text'].startswith('狮子。')
active_zh = {item['id'] for item, language in active_jobs if language == 'zh'}
active_en = {item['id'] for item, language in active_jobs if language == 'en'}
assert 'animals-01' not in active_zh
assert 'animals-01' not in active_en
assert 'letters-A' not in active_zh
assert 'letters-A' in active_en
expansion_ids = {item['id'] for item in expansion_items}
assert active_zh & expansion_ids == {identifier for identifier in expansion_ids if not (ROOT / f'design/audio/{identifier}.json').exists()}
assert active_en & expansion_ids == {identifier for identifier in expansion_ids if not (ROOT / f'design/audio/en/{identifier}.json').exists()}
with TemporaryDirectory() as temporary:
    with patch.object(edge, 'ROOT', Path(temporary)):
        assert edge.jobs_for(expansion_items, None) == expansion_jobs
        saved = Path(temporary) / f'design/audio/{expansion_items[0]["id"]}.json'
        saved.parent.mkdir(parents=True)
        saved.write_text('{}')
        assert edge.jobs_for(expansion_items, None) == expansion_jobs[1:]
        assert edge.jobs_for(expansion_items, expansion_batch) == expansion_jobs
for item, language in active_jobs:
    if item['id'] in expansion_ids:
        assert edge.info_for(item, language) == edge.info_for(next(card for card in expansion_items if card['id'] == item['id']), language)
assert edge.info_for(lion, 'en')['text'] == 'Lion'


def write_recording(item, language, *, text=None, empty=False, missing=None):
    info = edge.info_for(item, language)
    if text is not None:
        info['text'] = text
    record, path = edge.paths_for(item, language)
    record.parent.mkdir(parents=True, exist_ok=True)
    path.parent.mkdir(parents=True, exist_ok=True)
    data = b'' if empty else b'ID3fake-audio'
    metadata = {**info, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}
    if missing != 'json':
        record.write_text(json.dumps(metadata, ensure_ascii=False) + '\n')
    if missing != 'mp3':
        path.write_bytes(data)
    return data, record, path


with TemporaryDirectory() as temporary:
    root = Path(temporary)
    sample = expansion_jobs[0][0]
    communicate = AsyncMock()
    with patch.object(edge, 'ROOT', root):
        data, record, path = write_recording(sample, 'zh')
        assert asyncio.run(edge.generate(sample, 'zh', communicate)) == 'skipped'
        communicate.assert_not_called()
        assert path.read_bytes() == data
        record.write_text(json.dumps({**json.loads(record.read_text()), 'text': '错文案'}) + '\n')
        try:
            asyncio.run(edge.generate(sample, 'zh', communicate))
            raise AssertionError('mismatch must fail')
        except ValueError as error:
            assert '不一致' in str(error)
        communicate.assert_not_called()
        assert path.read_bytes() == data
        record.unlink()
        try:
            asyncio.run(edge.generate(sample, 'zh', communicate))
            raise AssertionError('orphan mp3 must fail')
        except ValueError as error:
            assert '孤立' in str(error)
        communicate.assert_not_called()
        path.unlink()
        write_recording(sample, 'zh', missing='mp3')
        try:
            asyncio.run(edge.generate(sample, 'zh', communicate))
            raise AssertionError('orphan json must fail')
        except ValueError as error:
            assert '孤立' in str(error)
        communicate.assert_not_called()
        edge.paths_for(sample, 'zh')[0].unlink()
        write_recording(sample, 'zh', empty=True)
        try:
            asyncio.run(edge.generate(sample, 'zh', communicate))
            raise AssertionError('empty audio must fail')
        except ValueError as error:
            assert '校验失败' in str(error)
        communicate.assert_not_called()
        edge.paths_for(sample, 'zh')[0].unlink()
        edge.paths_for(sample, 'zh')[1].unlink()
        write_recording(sample, 'zh')
        asyncio.run(edge.run_jobs([(sample, 'zh')], True))
        communicate.assert_not_called()
        assert 'edge_tts' not in sys.modules
        edge.paths_for(sample, 'zh')[0].unlink()
        edge.paths_for(sample, 'zh')[1].unlink()
        try:
            asyncio.run(edge.run_jobs([(sample, 'zh')], True))
            raise AssertionError('missing must fail check')
        except ValueError as error:
            assert '缺失' in str(error)
        assert list(root.rglob('*.mp3')) == []
        assert 'edge_tts' not in sys.modules

        class FakeCommunicate:
            def __init__(self, text, voice, rate):
                self.args = (text, voice, rate)

            async def save(self, destination):
                Path(destination).write_bytes(b'ID3ok')

        ffmpeg = []

        def fake_ffmpeg(command, **kwargs):
            ffmpeg.append(command)
            assert Path(command[4]).exists()
            return subprocess.CompletedProcess(command, 0)

        with patch.object(edge.subprocess, 'run', fake_ffmpeg):
            assert asyncio.run(edge.generate(sample, 'en', FakeCommunicate)) == 'wrote'
        assert ffmpeg and ffmpeg[0][:3] == ['ffmpeg', '-v', 'error']
        assert edge.inspect_recording(sample, 'en') == 'ok'
        communicate.assert_not_called()
        assert 'edge_tts' not in sys.modules

pair_a = {'id': 'a', 'text': '甲。甲。', 'english': 'A. A.'}
pair_b = {'id': 'b', 'text': '乙。乙。', 'english': 'B. B.'}
pair_jobs = [(pair_a, 'zh'), (pair_a, 'en'), (pair_b, 'zh'), (pair_b, 'en')]

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    calls = []

    class PairCommunicate:
        def __init__(self, text, voice, rate):
            self.text = text

        async def save(self, destination):
            calls.append(self.text)
            if self.text == 'A. A.':
                raise RuntimeError('provider fail')
            await asyncio.sleep(0.05)
            Path(destination).write_bytes(b'ID3ok')

    def pair_ffmpeg(command, **kwargs):
        assert Path(command[4]).exists()
        return subprocess.CompletedProcess(command, 0)

    with patch.object(edge, 'ROOT', root), patch.object(edge.subprocess, 'run', pair_ffmpeg):
        try:
            asyncio.run(edge.run_jobs(pair_jobs, False, PairCommunicate))
            raise AssertionError('failure must stop later pairs')
        except RuntimeError:
            pass
        assert edge.inspect_recording(pair_a, 'zh') == 'ok'
        assert edge.inspect_recording(pair_a, 'en') == 'missing'
        assert edge.inspect_recording(pair_b, 'zh') == 'missing'
        assert edge.inspect_recording(pair_b, 'en') == 'missing'
    assert '甲。甲。' in calls and 'A. A.' in calls
    assert '乙。乙。' not in calls and 'B. B.' not in calls
    assert 'edge_tts' not in sys.modules

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    with patch.object(edge, 'ROOT', root), patch.object(edge.fcntl, 'flock', side_effect=BlockingIOError):
        ran = []
        assert edge.with_lock(lambda: ran.append(True)) is False
        assert ran == []
        assert not (root / 'artifacts/audio-schedule/state.json').exists()

missing_card = {'id': 'transport-01', 'text': '小汽车。出门。', 'english': 'Car. We go out.'}
with TemporaryDirectory() as temporary:
    root = Path(temporary)
    with patch.object(edge, 'ROOT', root), patch.object(edge, 'load_cards', return_value=[missing_card]), patch.object(edge, 'jobs_for', return_value=[(missing_card, 'zh'), (missing_card, 'en')]):
        try:
            edge.main(['--check', '--expansion'])
            raise AssertionError('missing recordings must fail --check')
        except ValueError as error:
            assert '缺失' in str(error)
        assert list(root.rglob('*.mp3')) == []
        assert list(root.rglob('*.json')) == []
assert 'edge_tts' not in sys.modules


def node_expansion_audio(root):
    script = (
        "import { expansionAudio } from './scripts/build-media.mjs';"
        f"const audio = await expansionAudio({json.dumps(root)});"
        "console.log(JSON.stringify(audio));"
    )
    return subprocess.run(
        ['node', '--experimental-strip-types', '--input-type=module', '-e', script],
        cwd=ROOT, capture_output=True, text=True,
    )


with TemporaryDirectory() as temporary:
    root = str(Path(temporary))
    empty = node_expansion_audio(root)
    assert empty.returncode == 0, empty.stderr
    assert json.loads(empty.stdout) == {}
    card = expansion_items[0]
    info = {
        'provider': 'edge-tts',
        'voice': 'zh-CN-XiaoxiaoNeural',
        'text': card['text'],
        'rate': '+10%',
    }
    data = b'ID3fake-audio'
    meta = Path(root) / 'design/audio-edge/zh' / f'{card["id"]}.json'
    mp3 = Path(root) / 'public/audio-edge/zh' / f'{card["id"]}.mp3'
    meta.parent.mkdir(parents=True)
    mp3.parent.mkdir(parents=True)
    mp3.write_bytes(data)
    meta.write_text(json.dumps({**info, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}) + '\n')
    ok = node_expansion_audio(root)
    assert ok.returncode == 0, ok.stderr
    payload = json.loads(ok.stdout)
    assert set(payload) == {card['id']}
    assert set(payload[card['id']]) == {'zh'}
    assert payload[card['id']]['zh'].startswith(f'/audio-edge/zh/{card["id"]}.mp3?v=')
    meta.write_text(json.dumps({**info, 'text': '错', 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}) + '\n')
    mismatch = node_expansion_audio(root)
    assert mismatch.returncode != 0
    assert 'Expansion narration differs' in mismatch.stderr
    meta.unlink()
    orphan = node_expansion_audio(root)
    assert orphan.returncode != 0
    assert 'Orphan expansion audio' in orphan.stderr

manifest = json.loads((ROOT / 'src/expansion-media.json').read_text())
assert set(manifest) == {'audio'}
assert set(manifest['audio']) == {item['id'] for item in expansion_items}
for identifier, entry in manifest['audio'].items():
    assert identifier in {item['id'] for item in expansion_items}
    assert set(entry) == {'zh', 'en'}
    for language, url in entry.items():
        assert url.startswith(f'/audio-edge/{language}/{identifier}.mp3?v=')

print('检查通过：扩展 77/154 范围、双语全文、正式合同保留、离线校验与失败停排。')
