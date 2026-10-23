import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pictures } from '../src/content.ts';
import { audioTranscript, englishAudioTranscript, edgeEnglishAudioTranscript } from '../src/audio.ts';
import { expansionCategories } from '../src/expansion.ts';
import { additionCategories } from '../src/additions.ts';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const EDGE_VOICE = { zh: ['zh-CN-XiaoxiaoNeural', '+10%'], en: ['en-US-JennyNeural', '+0%'] };

export function expansionTranscript(card, language) {
  return language === 'zh' ? `${card.name}。${card.description}` : `${card.english}. ${card.englishDescription}`;
}

export async function expansionAudio(root = '.') {
  const audio = {};
  for (const card of expansionCategories.flatMap(category => category.cards)) {
    const entry = {};
    for (const language of ['zh', 'en']) {
      const metadataPath = `${root}/design/audio-edge/${language}/${card.id}.json`;
      const filePath = `${root}/public/audio-edge/${language}/${card.id}.mp3`;
      const hasMeta = existsSync(metadataPath);
      const hasFile = existsSync(filePath);
      if (!hasMeta && !hasFile) continue;
      if (hasMeta !== hasFile) throw new Error(`Orphan expansion audio: ${language}/${card.id}`);
      const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
      const [voice, rate] = EDGE_VOICE[language];
      const text = expansionTranscript(card, language);
      if (metadata.provider !== 'edge-tts' || metadata.voice !== voice || metadata.rate !== rate || metadata.text !== text) {
        throw new Error(`Expansion narration differs: ${metadataPath}`);
      }
      const bytes = await readFile(filePath);
      if (!bytes.length || bytes.length !== metadata.bytes) throw new Error(`Expansion audio size differs: ${filePath}`);
      const digest = hash(bytes);
      if (digest !== metadata.sha256) throw new Error(`Audio checksum differs: ${filePath}`);
      entry[language] = `/audio-edge/${language}/${card.id}.mp3?v=${digest.slice(0, 16)}`;
    }
    if (Object.keys(entry).length) audio[card.id] = entry;
  }
  return audio;
}

async function buildActive() {
  const images = {};
  for (const path of pictures.flatMap(picture => [picture.image, picture.imageLarge]).sort()) {
    images[path] = `${path}?v=${hash(await readFile(`public${path}`)).slice(0, 16)}`;
  }
  for (const [map, groups] of [['src/expansion-art.json', expansionCategories], ['src/additions-art.json', additionCategories]]) {
    const approved = JSON.parse(await readFile(map, 'utf8')).images;
    for (const card of groups.flatMap(category => category.cards)) {
      const picture = pictures.find(picture => picture.id === card.id);
      for (const field of ['image', 'imageLarge']) {
        if (images[picture[field]] !== approved[card.id]?.[field]) {
          throw new Error(`Illustration differs: ${card.id}/${field} (${map})`);
        }
      }
    }
  }
  const audio = {};
  const transcripts = {};
  for (const picture of pictures) {
    audio[picture.id] = {};
    transcripts[picture.id] = {};
    for (const language of ['zh', 'en']) {
      const geminiId = language === 'en' && picture.category !== 'letters' ? `en/${picture.id}` : picture.id;
      const useGemini = existsSync(`design/audio/${geminiId}.json`);
      const sourceLanguage = picture.category === 'letters' ? 'en' : language;
      const metadataPath = useGemini ? `design/audio/${geminiId}.json` : `design/audio-edge/${sourceLanguage}/${picture.id}.json`;
      const path = useGemini ? `/audio/${geminiId}.mp3` : `/audio-edge/${sourceLanguage}/${picture.id}.mp3`;
      const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
      const text = useGemini && language === 'en' ? englishAudioTranscript(picture) : useGemini || sourceLanguage === 'zh' ? audioTranscript(picture) : edgeEnglishAudioTranscript(picture);
      if (metadata.text !== text) throw new Error(`Narration text differs: ${metadataPath}`);
      const digest = hash(await readFile(`public${path}`));
      if (digest !== (useGemini ? metadata.mp3_sha256 : metadata.sha256)) throw new Error(`Audio checksum differs: ${path}`);
      audio[picture.id][language] = `${path}?v=${digest.slice(0, 16)}`;
      transcripts[picture.id][language] = metadata.text;
    }
  }
  await writeFile('src/media.json', JSON.stringify({ images, audio, transcripts }, null, 2) + '\n');
  console.log('媒体清单已生成：图片内容版本号、Gemini 优先的中英文静态录音。');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await buildActive();
  const audio = await expansionAudio();
  await writeFile('src/expansion-media.json', JSON.stringify({ audio }, null, 2) + '\n');
  console.log('扩展录音清单已写入 src/expansion-media.json。');
}
