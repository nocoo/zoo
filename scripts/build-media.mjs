import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { pictures } from '../src/content.ts';
import { audioTranscript, englishAudioTranscript } from '../src/audio.ts';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const images = {};
for (const name of await readdir('public/art/hd')) {
  const path = `/art/hd/${name}`;
  images[path] = `${path}?v=${hash(await readFile(`public${path}`)).slice(0, 16)}`;
}
const audio = {};
for (const picture of pictures) {
  audio[picture.id] = {};
  for (const language of ['zh', 'en']) {
    const geminiId = language === 'en' && picture.category !== 'letters' ? `en/${picture.id}` : picture.id;
    const useGemini = existsSync(`design/audio/${geminiId}.json`);
    const sourceLanguage = picture.category === 'letters' ? 'en' : language;
    const metadataPath = useGemini ? `design/audio/${geminiId}.json` : `design/audio-edge/${sourceLanguage}/${picture.id}.json`;
    const path = useGemini ? `/audio/${geminiId}.mp3` : `/audio-edge/${sourceLanguage}/${picture.id}.mp3`;
    const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
    const text = useGemini && language === 'en' ? englishAudioTranscript(picture) : useGemini || sourceLanguage === 'zh' ? audioTranscript(picture) : picture.english;
    if (metadata.text !== text) throw new Error(`Narration text differs: ${metadataPath}`);
    const digest = hash(await readFile(`public${path}`));
    if (digest !== (useGemini ? metadata.mp3_sha256 : metadata.sha256)) throw new Error(`Audio checksum differs: ${path}`);
    audio[picture.id][language] = `${path}?v=${digest.slice(0, 16)}`;
  }
}
await writeFile('src/media.json', JSON.stringify({ images, audio }, null, 2) + '\n');
console.log('媒体清单已生成：图片内容版本号、Gemini 优先的中英文静态录音。');
