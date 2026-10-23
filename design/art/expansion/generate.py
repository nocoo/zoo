import argparse
from concurrent.futures import ThreadPoolExecutor
import fcntl
import hashlib
import json
from pathlib import Path
import struct
import subprocess
import sys
import threading
import time

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
RUN = HERE / '2026-10-14'
HELPER = HERE.parent / 'hd/2026-10-10/generate_azure.py'
LOCK_PATH = HERE / '.generation.lock'
SPACING = 40
WORKERS = 3
MODEL = 'gpt-image-2.5-sunburst'
SIZE = '2048x1792'
QUALITY = 'high'
NATIVE = (2048, 1792)
PNG = b'\x89PNG\r\n\x1a\n'
REQUIRED = {'id', 'category', 'subject', 'references'}
APPROVED_IDS = (
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
ADDITION_IDS = (
    tuple(f'animals-{index:02d}' for index in range(30, 36))
    + tuple(f'vegetables-{index:02d}' for index in range(10, 14))
    + tuple(f'food-{index:02d}' for index in range(11, 17))
    + tuple(f'objects-{index:02d}' for index in range(32, 38))
    + tuple(f'transport-{index:02d}' for index in range(11, 16))
    + tuple(f'places-{index:02d}' for index in range(9, 13))
    + tuple(f'weather-{index:02d}' for index in range(26, 30))
    + tuple(f'phrases-{index:02d}' for index in range(30, 38))
)
RUN_IDS = {'2026-10-14': APPROVED_IDS, '2026-10-23': ADDITION_IDS}
APPROVED = APPROVED_IDS


def set_run(name):
    global RUN, APPROVED
    if name not in RUN_IDS:
        raise ValueError(f'Unknown run: {name}')
    RUN = HERE / name
    APPROVED = RUN_IDS[name]
LOCK = threading.Lock()
NEXT = 0.0
FAILED = threading.Event()


def folder_for(item):
    return RUN / item['id']


def png_size(path):
    with path.open('rb') as handle:
        header = handle.read(24)
    if header[:8] != PNG:
        raise ValueError(f'Not a PNG: {path}')
    return struct.unpack('>II', header[16:24])


def resolve_ref(path):
    relative = Path(path)
    if relative.is_absolute() or '..' in relative.parts:
        raise ValueError(f'Invalid reference path: {path}')
    full = (ROOT / relative).resolve()
    try:
        full.relative_to(ROOT.resolve())
    except ValueError as error:
        raise ValueError(f'Invalid reference path: {path}') from error
    if not full.is_file():
        raise ValueError(f'Missing reference: {path}')
    if png_size(full) != NATIVE:
        raise ValueError(f'Reference is not a native 2048x1792 PNG: {path}')
    return full


def outcome(item):
    folder = folder_for(item).resolve()
    request_path = folder / 'request.json'
    response_path = folder / 'response.json'
    raw = folder / 'raw/generated.png'
    review = folder / 'raw-review.json'
    if not any(path.exists() for path in (request_path, response_path, raw, review)):
        return 'pending'
    if not request_path.exists():
        raise ValueError(f'Orphan generation artifact: {folder.name}; inspect before another request')
    request = json.loads(request_path.read_text())
    prompt = (folder / 'prompt.txt').read_text().encode()
    if request.get('promptSha256') != hashlib.sha256(prompt).hexdigest():
        raise ValueError(f'Prompt changed after request: {item["id"]}')
    params = request.get('parameters') or {}
    if params.get('model') != MODEL or params.get('size') != SIZE or params.get('quality') != QUALITY:
        raise ValueError(f'Request model/size/quality mismatch: {item["id"]}')
    recorded = request.get('images') or []
    refs = item['references']
    if len(recorded) != len(refs):
        raise ValueError(f'Reference count mismatch: {item["id"]}')
    for image, path in zip(recorded, refs):
        expected = resolve_ref(path)
        stored = Path(image.get('path') or '')
        actual = stored.resolve() if stored.is_absolute() else (folder / stored).resolve()
        if actual != expected or image.get('sha256') != hashlib.sha256(expected.read_bytes()).hexdigest():
            raise ValueError(f'Reference path or hash mismatch: {item["id"]}')
    if not response_path.exists():
        return 'blocked'
    record = json.loads(response_path.read_text())
    if record.get('status') != 'succeeded' or 'output' not in record:
        return 'blocked'
    if not raw.exists():
        return 'blocked'
    data = raw.read_bytes()
    if hashlib.sha256(data).hexdigest() != record['output']['sha256']:
        raise ValueError(f'Native hash mismatch: {folder.name}')
    if data[:8] != PNG or struct.unpack('>II', data[16:24]) != NATIVE:
        raise ValueError(f'Native dimensions mismatch: {folder.name}')
    return 'done'


def complete(item):
    return outcome(item) == 'done'


def load_items():
    path = RUN / 'manifest.json'
    items = json.loads(path.read_text())
    if not isinstance(items, list):
        raise ValueError('Manifest must be an array of approved records')
    ids = tuple(item['id'] for item in items)
    if ids != tuple(APPROVED):
        raise ValueError(f'Manifest IDs must be the approved {len(APPROVED)} cards in source order')
    for item in items:
        if not REQUIRED <= set(item):
            raise ValueError(f'Manifest record missing fields: {item.get("id")}')
        if item['category'] != item['id'].split('-')[0] or not str(item['subject']).strip():
            raise ValueError(f'Invalid category or subject: {item["id"]}')
        refs = item['references']
        if not isinstance(refs, list) or not refs or not all(isinstance(path, str) and path for path in refs):
            raise ValueError(f'Invalid references: {item["id"]}')
        for path in refs:
            resolve_ref(path)
    return items


def require_prompt(item):
    path = folder_for(item) / 'prompt.txt'
    if not path.is_file() or not path.read_text().strip():
        raise ValueError(f'Missing prompt: {item["id"]}')


def select(items, ids_arg):
    if not ids_arg:
        return list(items)
    selected = [part.strip() for part in ids_arg.split(',') if part.strip()]
    if not selected or len(selected) != len(set(selected)):
        raise ValueError('Invalid --ids')
    known = {item['id'] for item in items}
    for identifier in selected:
        if identifier not in known:
            raise ValueError(f'Unknown id: {identifier}')
    by_id = {item['id']: item for item in items}
    return [by_id[identifier] for identifier in selected]


def pending_items(items):
    pending = []
    for item in items:
        result = outcome(item)
        if result == 'blocked':
            raise ValueError(f'Outcome unknown: {item["id"]}; inspect before another request')
        if result == 'pending':
            pending.append(item)
    return pending


def generate(item):
    global NEXT
    folder = folder_for(item)
    result = outcome(item)
    if result == 'done':
        return
    if result == 'blocked':
        raise ValueError(f'Outcome unknown: {item["id"]}; inspect before another request')
    if FAILED.is_set():
        return
    log = None
    try:
        command = [sys.executable, str(HELPER), '--run-dir', str(folder),
                   '--model', MODEL, '--size', SIZE]
        for path in item['references']:
            command += ['--image', str(resolve_ref(path))]
        log = (folder / 'generation.log').open('w')
        with LOCK:
            if FAILED.is_set():
                return
            time.sleep(max(0, NEXT - time.monotonic()))
            if FAILED.is_set():
                return
            process = subprocess.Popen(command, stdout=log, stderr=subprocess.STDOUT)
            NEXT = time.monotonic() + SPACING
        code = process.wait()
        if code != 0:
            raise subprocess.CalledProcessError(code, command)
        if outcome(item) != 'done':
            raise ValueError(f'{item["id"]} 生成未完成，请检查 response.json')
        print(f"完成原图：{item['id']}", flush=True)
    except Exception:
        FAILED.set()
        raise
    finally:
        if log is not None:
            log.close()


def with_lock(action):
    # ponytail: one exclusive flock for the whole run; split only if two providers appear
    with LOCK_PATH.open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return action()


def run(pending):
    global NEXT
    FAILED.clear()
    NEXT = 0.0
    if not pending:
        return

    def work():
        jobs = []
        error = None
        with ThreadPoolExecutor(max_workers=WORKERS) as executor:
            for item in pending:
                if FAILED.is_set():
                    break
                jobs.append(executor.submit(generate, item))
            for job in jobs:
                try:
                    job.result()
                except Exception as caught:
                    FAILED.set()
                    if error is None:
                        error = caught
        if error:
            raise error

    with_lock(work)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='Read-only validation; no writes or provider requests')
    parser.add_argument('--run', default='2026-10-14')
    parser.add_argument('--ids', default='')
    args = parser.parse_args()
    if not HELPER.is_file():
        raise ValueError('Missing unchanged helper design/art/hd/2026-10-10/generate_azure.py')
    set_run(args.run)
    items = load_items()
    chosen = select(items, args.ids)
    if args.check:
        done = pending = blocked = 0
        blocked_ids = []
        for item in items:
            require_prompt(item)
            result = outcome(item)
            if result == 'done':
                done += 1
            elif result == 'pending':
                pending += 1
            else:
                blocked += 1
                blocked_ids.append(item['id'])
        print(f'原图完成 {done}/{len(items)}；待生成 {pending}。', flush=True)
        if blocked_ids:
            print('未完成请求：' + ','.join(blocked_ids), flush=True)
        return
    for item in chosen:
        require_prompt(item)
    pending = pending_items(chosen)
    done = sum(1 for item in items if complete(item))
    print(f'原图完成 {done}/{len(items)}；本次待生成 {len(pending)}。', flush=True)
    run(pending)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, AssertionError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error)) from None
