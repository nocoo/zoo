import asyncio
import hashlib
import json
from pathlib import Path
import subprocess

import edge_tts

ROOT = Path(__file__).resolve().parents[1]


async def main():
    items = json.loads(subprocess.check_output([
        'node', '--experimental-strip-types', '--input-type=module', '-e',
        "import {pictures} from './src/content.ts'; import {audioTranscript} from './src/audio.ts';"
        "console.log(JSON.stringify(pictures.map(p=>({...p,text:audioTranscript(p)}))))",
    ], cwd=ROOT))
    jobs = []
    for item in items:
        for language in ['zh', 'en']:
            if language == 'zh' and (ROOT / f"design/audio/{item['id']}.json").exists():
                continue
            if item['category'] == 'letters' and language == 'zh':
                continue
            jobs.append((item, language))
    semaphore = asyncio.Semaphore(2)

    async def generate(item, language):
        async with semaphore:
            identifier = item['id']
            folder = ROOT / f'design/audio-edge/{language}'
            output = ROOT / f'public/audio-edge/{language}'
            folder.mkdir(parents=True, exist_ok=True)
            output.mkdir(parents=True, exist_ok=True)
            path = output / f'{identifier}.mp3'
            record = folder / f'{identifier}.json'
            info = {'provider': 'edge-tts', 'voice': 'zh-CN-XiaoxiaoNeural' if language == 'zh' else 'en-US-JennyNeural',
                    'text': item['text'] if language == 'zh' else item['english'], 'rate': '+10%' if language == 'zh' else '+0%'}
            if record.exists():
                metadata = json.loads(record.read_text())
                assert all(metadata[k] == v for k, v in info.items()), f'{identifier} request changed'
                assert hashlib.sha256(path.read_bytes()).hexdigest() == metadata['sha256']
                return
            assert not path.exists(), f'{path} exists without provenance; inspect before retry'
            temporary = path.with_suffix('.tmp.mp3')
            await edge_tts.Communicate(info['text'], info['voice'], rate=info['rate']).save(str(temporary))
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(temporary), '-f', 'null', '-'], check=True, capture_output=True)
            metadata = {**info, 'sha256': hashlib.sha256(temporary.read_bytes()).hexdigest(), 'bytes': temporary.stat().st_size}
            temporary.replace(path)
            record.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
            print(f'完成临时录音：{language}/{identifier}', flush=True)
            await asyncio.sleep(0.5)

    for start in range(0, len(jobs), 2):
        await asyncio.gather(*(generate(*job) for job in jobs[start:start + 2]))
    print('临时中英文录音补齐，Gemini 文件未改动。', flush=True)


if __name__ == '__main__':
    asyncio.run(main())
