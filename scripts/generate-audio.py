import argparse
import base64
import fcntl
import hashlib
import io
import json
from pathlib import Path
import shutil
import subprocess
import time
import urllib.error
import urllib.request
import wave

ROOT = Path(__file__).resolve().parents[1]
MODEL = "gemini-3.8-flash-tts"
VOICE = "Sulafat"
NEXT_REQUEST = 0.0
STYLE = (
    "A gentle, warm adult female voice reading a picture book to a toddler. "
    "Use clear, standard Mainland Chinese Putonghua with precise four tones, "
    "natural neutral tones, and clear zh/ch/sh versus z/c/s. "
    "No Taiwanese Mandarin, Hong Kong or Cantonese accent, no exaggerated erhua. "
    "Calm and affectionate, lightly smiling, never whispery, breathy, theatrical or babyish. "
    "Use a natural conversational pace, about 4 Chinese syllables per second, "
    "roughly 25 percent faster than a slow bedtime reading. Keep syllables connected and crisp; "
    "do not stretch vowels or leave long pauses between phrases. "
    "Pause only 150 to 200 milliseconds after the animal name. "
    "Read the text verbatim, no extra words, music or effects."
)
ENGLISH_STYLE = (
    "The same gentle, warm adult female voice introducing an alphabet letter to a toddler. "
    "Pronounce only the single written letter's standard American English alphabet name, "
    "not its phonics sound or a word. Use a natural conversational pace and clear articulation. "
    "Do not spell words, add explanations, repeat the letter, whisper, stretch vowels or sing. "
    "No extra words, music or effects."
)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def wav_info(data):
    with wave.open(io.BytesIO(data)) as wav:
        duration = wav.getnframes() / wav.getframerate()
        if not 0 < duration <= 60 or wav.getsampwidth() != 2 or wav.getnchannels() != 1 or wav.getframerate() != 24000:
            raise ValueError("语音格式或时长异常")
        frames = wav.readframes(wav.getnframes())
        if len(frames) != wav.getnframes() * 2 or not any(frames):
            raise ValueError("语音数据截断或静音")
        return duration


def atomic_write(path, data):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_bytes(data)
    temporary.replace(path)


def generate(item, key, check_only):
    global NEXT_REQUEST
    identifier = item['id']
    archive = ROOT / 'design/audio'
    output = ROOT / 'public/audio'
    wav_path = archive / f'{identifier}.wav'
    meta_path = archive / f'{identifier}.json'
    mp3_path = output / f'{identifier}.mp3'
    style = ENGLISH_STYLE if item['category'] == 'letters' else STYLE
    request_info = {'model': MODEL, 'voice': VOICE, 'text': item['text'], 'style': style}
    if meta_path.exists():
        metadata = json.loads(meta_path.read_text())
        if any(metadata.get(k) != v for k, v in request_info.items()):
            raise ValueError(f'{identifier} 文本或配置已变化，请先归档该条旧 WAV、JSON、MP3 再重跑')
        audio = wav_path.read_bytes()
        if metadata['wav_sha256'] != sha(audio):
            raise ValueError(f'{identifier} 原始音频校验失败')
    else:
        if check_only:
            raise ValueError(f'{identifier} 缺少生成记录')
        preview = ROOT / f'design/voice-preview/v2/{identifier}.json'
        if preview.exists():
            previous = json.loads(preview.read_text())
            if any(previous.get(k) != v for k, v in request_info.items()):
                raise ValueError(f'{identifier} 与已批准试听不一致')
            audio = (ROOT / f'public/voice-preview/v2/{identifier}.wav').read_bytes()
            interaction_id = previous['interaction_id']
            origin = 'approved-v2-preview'
        else:
            payload = {
                'model': MODEL,
                'input': [{'type': 'user_input', 'content': [{
                    'type': 'text', 'text': item['text'],
                    'annotations': [{'type': 'speech_metadata', 'style': style}],
                }]}],
                'response_format': {'type': 'audio', 'mime_type': 'audio/wav', 'sample_rate': 24000},
                'generation_config': {'speech_config': [{'voice': VOICE}]},
            }
            request = urllib.request.Request(
                'https://generativelanguage.googleapis.com/v1beta/interactions',
                data=json.dumps(payload).encode(),
                headers={'x-goog-api-key': key, 'Content-Type': 'application/json'},
            )
            time.sleep(max(0, NEXT_REQUEST - time.monotonic()))
            NEXT_REQUEST = time.monotonic() + 20
            try:
                with urllib.request.urlopen(request, timeout=180) as response:
                    raw = response.read(16 * 1024 * 1024 + 1)
                    if len(raw) > 16 * 1024 * 1024:
                        raise ValueError(f'{identifier} 响应超出大小限制')
                    result = json.loads(raw)
            except urllib.error.HTTPError as error:
                try:
                    detail = json.loads(error.read(16384)).get('error', {}).get('message', '')
                    detail = detail.replace(key, '[REDACTED]')[:1500]
                except (ValueError, AttributeError):
                    detail = ''
                raise ValueError(f'{identifier} Gemini HTTP {error.code}；未自动重试或切换模型\n{detail}') from None
            except (urllib.error.URLError, TimeoutError):
                raise ValueError(f'{identifier} Gemini 网络失败；可稍后重跑续传') from None
            blocks = [content for step in result.get('steps', []) if step.get('type') == 'model_output'
                      for content in step.get('content', []) if content.get('type') == 'audio']
            if len(blocks) != 1:
                raise ValueError(f'{identifier} 未返回唯一完整音频')
            audio = base64.b64decode(blocks[0]['data'], validate=True)
            interaction_id = result.get('id')
            origin = 'generated'
        duration = wav_info(audio)
        metadata = {**request_info, 'duration_seconds': duration, 'interaction_id': interaction_id,
                    'origin': origin, 'wav_sha256': sha(audio)}
        atomic_write(wav_path, audio)
        atomic_write(meta_path, (json.dumps(metadata, ensure_ascii=False, indent=2) + '\n').encode())
    wav_info(audio)
    if not mp3_path.exists():
        if check_only:
            raise ValueError(f'{identifier} 缺少 MP3')
        temporary = mp3_path.with_suffix('.tmp.mp3')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav_path), '-map_metadata', '-1',
                        '-codec:a', 'libmp3lame', '-b:a', '96k', str(temporary)], check=True, capture_output=True)
        temporary.replace(mp3_path)
    digest = sha(mp3_path.read_bytes())
    if metadata.get('mp3_sha256') not in (None, digest):
        raise ValueError(f'{identifier} MP3 校验失败')
    if check_only and 'mp3_sha256' not in metadata:
        raise ValueError(f'{identifier} 缺少 MP3 校验记录')
    if not check_only:
        metadata['mp3_sha256'] = digest
        atomic_write(meta_path, (json.dumps(metadata, ensure_ascii=False, indent=2) + '\n').encode())
        print(f"完成 {identifier}：{metadata['duration_seconds']:.2f} 秒", flush=True)
    return identifier, f'/audio/{identifier}.mp3?v={digest[:12]}'


def run_batch(items, key, check_only, max_new):
    manifest = {}
    generated = 0
    for item in items:
        missing = not (ROOT / f"design/audio/{item['id']}.json").exists()
        if missing and not check_only and generated >= max_new:
            continue
        identifier, path = generate(item, key, check_only)
        manifest[identifier] = path
        generated += int(missing)
    if len(manifest) != len(items):
        print(f'本轮完成，已校验 {len(manifest)}/{len(items)} 条；剩余留待下一轮。', flush=True)
        return False
    path = ROOT / 'src/audio-manifest.json'
    if check_only:
        if json.loads(path.read_text()) != manifest:
            raise ValueError('音频清单与文件不一致')
    else:
        atomic_write(path, (json.dumps(manifest, indent=2) + '\n').encode())
    print(f'全部 {len(manifest)} 条录音校验通过。', flush=True)
    return True


def scheduled_run(action, state_path, now):
    state = json.loads(state_path.read_text()) if state_path.exists() else {}
    if state.get('status') == 'complete' or now < state.get('next_run_after', 0):
        print('定时任务无需运行：已完成或仍处于冷却期。', flush=True)
        return
    state = {'status': 'running', 'started_at': now, 'next_run_after': now + 23 * 3600}
    atomic_write(state_path, (json.dumps(state, indent=2) + '\n').encode())
    try:
        state['status'] = 'complete' if action() else 'waiting'
    except Exception:
        state['status'] = 'failed'
        raise
    finally:
        state['finished_at'] = time.time()
        atomic_write(state_path, (json.dumps(state, indent=2) + '\n').encode())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='Validate existing files without credentials or writes')
    parser.add_argument('--scheduled', action='store_true', help='Generate up to 90 missing clips, once per 23 hours')
    args = parser.parse_args()
    if args.check and args.scheduled:
        parser.error('--check and --scheduled cannot be combined')
    items = json.loads(subprocess.check_output([
        'node', '--experimental-strip-types', '--input-type=module', '-e',
        "import {pictures} from './src/content.ts'; import {audioTranscript} from './src/audio.ts'; "
        "console.log(JSON.stringify(pictures.map(p=>({id:p.id,category:p.category,text:audioTranscript(p)}))))",
    ], cwd=ROOT))
    if args.check:
        run_batch(items, None, True, 0)
        return

    def action():
        if not shutil.which('ffmpeg'):
            raise ValueError('请先安装 ffmpeg。')
        config = json.loads((Path.home() / '.config/his.fm/config.json').read_text())
        key = config.get('speechKeys', {}).get('gemini')
        if not key:
            raise ValueError('his.fm 未配置 Gemini Key。')
        (ROOT / 'design/audio').mkdir(parents=True, exist_ok=True)
        (ROOT / 'public/audio').mkdir(parents=True, exist_ok=True)
        return run_batch(items, key, False, 90 if args.scheduled else len(items))

    runtime = ROOT / 'artifacts/audio-schedule'
    runtime.mkdir(parents=True, exist_ok=True)
    with (runtime / 'generation.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print('已有语音生成进程在运行，本轮不重复启动。', flush=True)
            return
        if args.scheduled:
            scheduled_run(action, runtime / 'state.json', time.time())
        else:
            action()


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        if isinstance(error, ValueError):
            raise SystemExit(str(error)) from None
        raise SystemExit('生成或文件处理失败；已完成条目保留，可重跑续传。') from None
