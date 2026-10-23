import base64
import io
import json
from pathlib import Path
import urllib.error
import urllib.request
import wave

ROOT = Path(__file__).resolve().parents[1]
MODEL = "gemini-3.8-flash-tts"
VOICE = "Sulafat"
TAKE = "v2"
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
SAMPLES = [
    ("animals-01", "狮子。狮子有一圈蓬松的鬃毛，像戴着小围巾。"),
    ("animals-02", "熊猫。熊猫穿着黑白衣服，最爱吃竹子。"),
    ("animals-03", "兔子。兔子的耳朵长长的，蹦蹦跳跳真可爱。"),
]


def gemini_key():
    for line in (ROOT / ".env").read_text().splitlines():
        name, _, value = line.partition("=")
        if name.strip() == "GEMINI_API_KEY" and value.strip():
            return value.strip().strip('"').strip("'")
    raise SystemExit("项目 .env 未配置 GEMINI_API_KEY。")


def main():
    key = gemini_key()
    output = ROOT / "public/voice-preview" / TAKE
    archive = ROOT / "design/voice-preview" / TAKE
    output.mkdir(parents=True, exist_ok=True)
    archive.mkdir(parents=True, exist_ok=True)
    for identifier, text in SAMPLES:
        path = output / f"{identifier}.wav"
        if path.exists():
            print(f"保留已有试听：{identifier}", flush=True)
            continue
        payload = {
            "model": MODEL,
            "input": [{"type": "user_input", "content": [{
                "type": "text", "text": text,
                "annotations": [{"type": "speech_metadata", "style": STYLE}],
            }]}],
            "response_format": {"type": "audio", "mime_type": "audio/wav", "sample_rate": 24000},
            "generation_config": {"speech_config": [{"voice": VOICE}]},
        }
        request = urllib.request.Request(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            data=json.dumps(payload).encode(),
            headers={"x-goog-api-key": key, "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                raw = response.read(16 * 1024 * 1024 + 1)
                if len(raw) > 16 * 1024 * 1024:
                    raise SystemExit("语音响应超出大小限制。")
                result = json.loads(raw)
        except urllib.error.HTTPError as error:
            raise SystemExit(f"Gemini 试听请求失败：HTTP {error.code}，未切换模型或重试。") from None
        except urllib.error.URLError:
            raise SystemExit("Gemini 试听请求网络失败，未切换模型或重试。") from None
        blocks = [content for step in result.get("steps", []) if step.get("type") == "model_output"
                  for content in step.get("content", []) if content.get("type") == "audio"]
        if len(blocks) != 1:
            raise SystemExit("Gemini 未返回唯一完整音频。")
        audio = base64.b64decode(blocks[0]["data"], validate=True)
        with wave.open(io.BytesIO(audio)) as wav:
            duration = wav.getnframes() / wav.getframerate()
            if not 0 < duration <= 60 or wav.getsampwidth() != 2:
                raise SystemExit("试听音频格式或时长异常。")
        path.write_bytes(audio)
        (archive / f"{identifier}.json").write_text(json.dumps({
            "model": MODEL, "voice": VOICE, "take": TAKE, "text": text, "style": STYLE,
            "duration_seconds": duration, "interaction_id": result.get("id"),
            "approval": "pending",
        }, ensure_ascii=False, indent=2) + "\n")
        print(f"已生成 {identifier}：{VOICE}，{duration:.2f} 秒。", flush=True)


if __name__ == "__main__":
    main()
