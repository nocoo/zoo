import argparse
import asyncio
import fcntl
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
VOICES = {
    'zh': ('zh-CN-XiaoxiaoNeural', '+10%'),
    'en': ('en-US-JennyNeural', '+0%'),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def load_cards():
    source = (
        "import {pictures} from './src/content.ts';"
        "import {audioTranscript,edgeEnglishAudioTranscript} from './src/audio.ts';"
        "console.log(JSON.stringify(pictures.map(p=>({...p,text:audioTranscript(p),english:edgeEnglishAudioTranscript(p)}))))"
    )
    return json.loads(subprocess.check_output([
        'node', '--experimental-strip-types', '--input-type=module', '-e', source,
    ], cwd=ROOT))


def jobs_for(items):
    jobs = []
    for item in items:
        for language in ('zh', 'en'):
            if item.get('category') == 'letters' and language == 'zh':
                continue
            gemini_id = f"en/{item['id']}" if language == 'en' and item.get('category') != 'letters' else item['id']
            if (ROOT / f'design/audio/{gemini_id}.json').exists():
                continue
            jobs.append((item, language))
    return jobs


def info_for(item, language):
    voice, rate = VOICES[language]
    return {
        'provider': 'edge-tts',
        'voice': voice,
        'text': item['text'] if language == 'zh' else item['english'],
        'rate': rate,
    }


def paths_for(item, language):
    identifier = item['id']
    return (
        ROOT / f'design/audio-edge/{language}/{identifier}.json',
        ROOT / f'public/audio-edge/{language}/{identifier}.mp3',
    )


def inspect_recording(item, language):
    record, path = paths_for(item, language)
    info = info_for(item, language)
    if record.exists() and path.exists():
        metadata = json.loads(record.read_text())
        if any(metadata.get(key) != value for key, value in info.items()):
            raise ValueError(f'{item["id"]}/{language} 请求记录与当前文案或声音不一致')
        data = path.read_bytes()
        if not data or metadata.get('bytes') != len(data) or metadata.get('sha256') != sha(data):
            raise ValueError(f'{item["id"]}/{language} 音频校验失败')
        return 'ok'
    if record.exists() or path.exists():
        raise ValueError(f'{item["id"]}/{language} 存在孤立录音文件，请先检查再重跑')
    return 'missing'


async def generate(item, language, communicate=None):
    if inspect_recording(item, language) == 'ok':
        return 'skipped'
    record, path = paths_for(item, language)
    info = info_for(item, language)
    record.parent.mkdir(parents=True, exist_ok=True)
    path.parent.mkdir(parents=True, exist_ok=True)
    if communicate is None:
        import edge_tts
        communicate = edge_tts.Communicate
    temporary = path.with_suffix('.tmp.mp3')
    await communicate(info['text'], info['voice'], rate=info['rate']).save(str(temporary))
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(temporary), '-f', 'null', '-'], check=True, capture_output=True)
    data = temporary.read_bytes()
    if not data:
        raise ValueError(f'{item["id"]}/{language} 生成了空音频')
    metadata = {**info, 'sha256': sha(data), 'bytes': len(data)}
    temporary.replace(path)
    record.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
    print(f'完成临时录音：{language}/{item["id"]}', flush=True)
    await asyncio.sleep(0.5)
    return 'wrote'


async def run_jobs(jobs, check_only, communicate=None):
    if check_only:
        for item, language in jobs:
            if inspect_recording(item, language) != 'ok':
                raise ValueError(f'{item["id"]}/{language} 录音缺失')
        return
    semaphore = asyncio.Semaphore(2)

    async def bound(item, language):
        async with semaphore:
            return await generate(item, language, communicate)

    for start in range(0, len(jobs), 2):
        results = await asyncio.gather(*(bound(*job) for job in jobs[start:start + 2]), return_exceptions=True)
        for result in results:
            if isinstance(result, BaseException):
                raise result


def with_lock(action):
    runtime = ROOT / 'artifacts/audio-schedule'
    runtime.mkdir(parents=True, exist_ok=True)
    with (runtime / 'generation.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print('已有语音生成进程在运行，本轮不重复启动。', flush=True)
            return False
        action()
        return True


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='Validate existing files without network, writes or edge_tts')
    args = parser.parse_args(argv)
    jobs = jobs_for(load_cards())
    if args.check:
        asyncio.run(run_jobs(jobs, True))
        print('检查通过：数字与字母的临时录音与文案一致。', flush=True)
        return

    def action():
        asyncio.run(run_jobs(jobs, False))
        print('数字与字母的临时录音已补齐，Gemini 文件未改动。', flush=True)

    with_lock(action)


if __name__ == '__main__':
    try:
        main()
    except ValueError as error:
        raise SystemExit(str(error)) from None
