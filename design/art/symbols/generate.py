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

ROOT = Path(__file__).resolve().parents[3]
RUN = Path(__file__).parent / '2026-10-10'
STUDY = ROOT / 'design/art/symbol-studies/2026-10-10-162535'
LOCK = threading.Lock()
NEXT = 0.0
FAILED = threading.Event()


def complete(folder):
    response = folder / 'response.json'
    if not response.exists():
        if (folder / 'request.json').exists():
            raise ValueError(f'Outcome unknown: {folder}; inspect before another request')
        return False
    record = json.loads(response.read_text())
    assert record['status'] == 'succeeded', f'Inspect rejected request: {folder}'
    raw = (folder / 'raw/generated.png').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == record['output']['sha256']
    assert struct.unpack('>II', raw[16:24]) == (2048, 1792)
    return True


def generate(item):
    global NEXT
    folder = ROOT / item['source']
    with LOCK:
        time.sleep(max(0, NEXT - time.monotonic()))
        if FAILED.is_set():
            return
        NEXT = time.monotonic() + 40
    references = ['numbers-1', 'numbers-2'] if item['id'].startswith('numbers-') else ['letters-A', 'letters-B']
    command = [sys.executable, str(ROOT / 'design/art/hd/2026-10-10/generate_azure.py'),
               '--run-dir', str(folder), '--model', 'gpt-image-2.5-sunburst', '--size', '2048x1792']
    for reference in references:
        command += ['--image', str(STUDY / reference / 'raw/generated.png')]
    try:
        with (folder / 'generation.log').open('w') as log:
            subprocess.run(command, stdout=log, stderr=subprocess.STDOUT, check=True)
        assert complete(folder)
        print(f"完成原图：{item['id']}", flush=True)
    except Exception:
        FAILED.set()
        raise


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    items = json.loads((RUN / 'manifest.json').read_text())
    assert len(items) == 56 and sum(item['approved'] for item in items) == 4
    pending = []
    for item in items:
        exists = complete(ROOT / item['source'])
        assert exists or not item['approved'], 'Never regenerate an approved sample'
        if not exists:
            pending.append(item)
    print(f'原图完成 {len(items) - len(pending)}/56；待生成 {len(pending)}。', flush=True)
    if args.check:
        return
    with (RUN / '.generation.lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        with ThreadPoolExecutor(max_workers=3) as executor:
            for start in range(0, len(pending), 3):
                jobs = [executor.submit(generate, item) for item in pending[start:start + 3]]
                for job in jobs:
                    job.result()


if __name__ == '__main__':
    main()
