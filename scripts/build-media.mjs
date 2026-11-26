import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pictures } from "../src/content.ts";
import {
  audioTranscript,
  englishAudioTranscript,
  edgeEnglishAudioTranscript,
} from "../src/audio.ts";
import { getTrackedPublicFiles, verifyArtMaps } from "./media-utils.ts";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function validateSparseMedia() {
  const media = JSON.parse(await readFile("src/media.json", "utf8"));
  const trackedPublicFiles = getTrackedPublicFiles();
  if (Object.keys(media.images).length !== pictures.length * 2) {
    throw new Error(`Expected ${pictures.length * 2} image entries in src/media.json`);
  }
  if (
    Object.keys(media.audio).length !== pictures.length ||
    Object.keys(media.transcripts).length !== pictures.length
  ) {
    throw new Error(`Expected ${pictures.length} audio/transcript entries in src/media.json`);
  }
  for (const picture of pictures) {
    for (const path of [picture.image, picture.imageLarge]) {
      if (!trackedPublicFiles.has(`public${path}`)) {
        throw new Error(`Missing tracked image: public${path}`);
      }
      if (!media.images[path]?.startsWith(`${path}?v=`)) {
        throw new Error(`Invalid media image entry: ${path}`);
      }
    }
    for (const language of ["zh", "en"]) {
      const url = media.audio[picture.id]?.[language];
      if (!url) throw new Error(`Missing media audio entry: ${picture.id}/${language}`);
      const audioPath = url.split("?")[0];
      if (!trackedPublicFiles.has(`public${audioPath}`)) {
        throw new Error(`Missing tracked audio: public${audioPath}`);
      }
      const expectedTranscript =
        language === "zh"
          ? audioTranscript(picture)
          : audioPath.startsWith("/audio/")
            ? englishAudioTranscript(picture)
            : edgeEnglishAudioTranscript(picture);
      if (media.transcripts[picture.id]?.[language] !== expectedTranscript) {
        throw new Error(`Narration text differs: ${picture.id}/${language}`);
      }
    }
  }
  await verifyArtMaps(media.images);
  console.log("媒体清单校验通过（ZOO_CI_SPARSE_MEDIA=1）：复用已提交的 src/media.json。");
}

async function buildActive() {
  const images = {};
  for (const path of pictures.flatMap((picture) => [picture.image, picture.imageLarge]).sort()) {
    images[path] = `${path}?v=${hash(await readFile(`public${path}`)).slice(0, 16)}`;
  }
  await verifyArtMaps(images);
  const audio = {};
  const transcripts = {};
  for (const picture of pictures) {
    audio[picture.id] = {};
    transcripts[picture.id] = {};
    for (const language of ["zh", "en"]) {
      const geminiId =
        language === "en" && picture.category !== "letters" ? `en/${picture.id}` : picture.id;
      const useGemini = existsSync(`design/audio/${geminiId}.json`);
      const sourceLanguage = picture.category === "letters" ? "en" : language;
      const metadataPath = useGemini
        ? `design/audio/${geminiId}.json`
        : `design/audio-edge/${sourceLanguage}/${picture.id}.json`;
      const path = useGemini
        ? `/audio/${geminiId}.mp3`
        : `/audio-edge/${sourceLanguage}/${picture.id}.mp3`;
      const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
      const text =
        useGemini && language === "en"
          ? englishAudioTranscript(picture)
          : useGemini || sourceLanguage === "zh"
            ? audioTranscript(picture)
            : edgeEnglishAudioTranscript(picture);
      if (metadata.text !== text) throw new Error(`Narration text differs: ${metadataPath}`);
      const digest = hash(await readFile(`public${path}`));
      if (digest !== (useGemini ? metadata.mp3_sha256 : metadata.sha256))
        throw new Error(`Audio checksum differs: ${path}`);
      audio[picture.id][language] = `${path}?v=${digest.slice(0, 16)}`;
      transcripts[picture.id][language] = metadata.text;
    }
  }
  await writeFile("src/media.json", `${JSON.stringify({ images, audio, transcripts }, null, 2)}\n`);
  console.log(
    "媒体清单已生成：图片内容版本号、Gemini 优先的中英文静态录音，数字与字母保留 Edge 录音。",
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  if (process.env.ZOO_CI_SPARSE_MEDIA === "1") {
    await validateSparseMedia();
  } else {
    await buildActive();
  }
}
