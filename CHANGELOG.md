# Changelog

## v1.6.0 - 2026-10-30

- Add three basic-cognition categories for 25 new cards, bringing the library to 321 cards across 15: 认识颜色 (红黄蓝绿橙紫粉黑白棕), 认识形状 (圆形、正方形、三角形、长方形、椭圆形、星形、心形、菱形) and 我的家人 (妈妈、爸爸、爷爷、奶奶、宝宝、哥哥、姐姐). They sit before 汉字宝宝 so number, letter, color, shape and family recognition read as one foundation group.
- Draw all 25 illustrations with the approved `gpt-image-2.5-sunburst` reference-edit pipeline at native 2048 x 1792 plus 640 x 560 thumbnails, delivered to `public/art/foundations/` with map `src/foundations-art.json`. The owner reviewed one sample per category before the fan-out. White carries a warm-grey outline so it stays visible on the cream paper, and each shape card pairs the geometric hero with one real object of that shape.
- Add 50 recordings, one Mandarin and one English per card. 11 are Gemini/Sulafat; the other 39 were filled with Edge TTS after the provider returned HTTP 429 (Tier 1, 100 requests/day) for the shared quota and then HTTP 400 for the current egress region. The Edge takes stay temporary and can be replaced by Gemini later without changing transcripts.
- Extend the content, audio, art and check tooling to the new categories: category icons, the Gemini job order, the Edge English transcript set, the art-map validation and the exact-count assertions. `process.py` gains `--dir` and now restores paper corners on native-size full images, which previously skipped LANCZOS resampling.
- Give `/art/expansion/` and `/art/foundations/` the same one-year immutable cache rule that `/art/hd/` already had.

## v1.5.1 - 2026-10-29

- Replace the last 91 temporary Edge narrations with approved-style Gemini/Sulafat recordings: the 43 Mandarin and 43 English clips for the cards added on 2026-10-23, plus `en/places-04`..`08`. Eligible Gemini coverage reaches 480/480 with no pending slot.
- The authorized run used plain `--bilingual-day` under the existing 100-attempt daily ceiling, completed 91 of 100 requests with 20-second spacing, hit no provider error and emptied the queue before the cap. No retry, model fallback, credential change or timer was involved.
- Delete 521 obsolete Edge clips and their metadata, freeing 9.5 MiB. Keep only the 86 recordings still referenced: `numbers-1..30` in both languages and `en/letters-A..Z`, which have no Gemini equivalent. Remove `src/expansion-media.json`, its build step and `scripts/check-edge-expansion.py`; `scripts/generate-edge-audio.py` now covers the number and alphabet gap only.
- Keep every Gemini original WAV, metadata file and MP3 unchanged, along with all illustrations and playback interactions.

## v1.5.0 - 2026-10-23

- Add 43 picture cards across the eight noun categories, bringing the library to 296 cards: fish, frog, crab, sheep, deer and hedgehog; mushroom, green beans, spinach and onion; meat, fish, soup, crackers, cake and candy; balloon, kite, crayon, key, pillow and broom; police car, motorcycle, water truck, garbage truck and hot-air balloon; zoo, seaside, restaurant and hair salon; the four seasons; and eight everyday phrases for greetings, manners and self-care.
- Draw all 43 illustrations with the approved reference-guided Azure `gpt-image-2.5-sunburst` pipeline at native 2048 x 1792 plus 640 x 560 thumbnails, keeping every prompt, reference, request record and native original under `design/art/expansion/2026-10-23/`.
- Add 86 bilingual Edge TTS recordings, one Mandarin and one English clip per card, narrated as name plus full description and served through `src/media.json`. No Gemini request, timer or quota change was involved.
- Extend the illustration and audio tooling to address dated batches (`--run`, `--art`, `--additions`) while keeping the 2026-10-14 expansion batch, its delivery map and every earlier recording unchanged.

## v1.4.2 - 2026-10-23

- Replace 94 Edge narrations with approved-style Gemini/Sulafat recordings: the 22 remaining Mandarin clips (vegetables, food and places) and 72 expansion English clips. Reach 389/394 eligible Gemini recordings; the last five English places recordings keep complete Edge playback.
- The authorized run stopped on HTTP 429 at `en/places-04` when the shared provider Tier 1 limit of 100 requests/day was exhausted. No retry, timer, model fallback or credential change followed.
- Raise the local daily request ceiling from 90 to 100 and read the provider credential from the gitignored repository `.env`. Retain every earlier WAV, metadata file and MP3 unchanged.

## v1.4.1 - 2026-10-15

- Replace 55 new Mandarin Edge narrations with approved-style Gemini/Sulafat recordings: animals, fruits, weather, everyday objects, phrases, transport and the first five vegetables.
- Reach 295/394 eligible Gemini recordings. The batch stops on HTTP 429 at attempt 56; the remaining 22 Mandarin and 77 English recordings retain complete Edge playback. Preserve the provider cooldown without retries or timers.
- Retain all new WAV originals, metadata and MP3 deliveries, with all 1,777 pre-run audio/archive files unchanged. Keep existing transcripts, illustrations and playback interactions intact.

## v1.4.0 - 2026-10-15

- Add 77 approved cards for 253 cards across 12 categories: introduce transport, vegetables, table food and places to visit, and expand animals, everyday objects, phrases, weather and fruits.
- Deliver all 77 new illustrations as 640 x 560 thumbnails and 2048 x 1792 full-size WebP, retaining generation originals and authorized retry provenance.
- Add 154 full name-plus-description Mandarin and English recordings using Edge TTS 7.3.1. Preserve the original 176 cards, media URLs and 1,469 existing audio/archive files unchanged.
- Integrate the additions into browsing, animal groups, favorites and explicit bilingual playback; remove the completed draft review UI. Extend the Mandarin-first Gemini replacement queue to all ten eligible categories without changing quota safeguards or enabling timers.

## v1.3.0 - 2026-10-14

- Complete the remaining 40 English name-plus-explanation recordings for Chinese characters and everyday phrases with the approved Gemini model and Sulafat voice.
- Reach 240/240 eligible Gemini recordings: all 120 picture, character and phrase cards now have full Mandarin and English narration with matching captions. Numbers and alphabet recordings remain excluded and retain Edge playback.
- Preserve all earlier recordings and generation archives unchanged; retain the forty new original WAVs, request metadata, hashes and MP3 deliveries. Generation completed without errors or retries, and no automatic speech task is installed.

## v1.2.1 - 2026-10-12

- Complete the object category's English name-plus-explanation recordings with 11 new Gemini clips, bringing verified coverage to 200 unique recordings. Keep all earlier audio unchanged and retain Edge playback for the 40 remaining eligible English items.
- Allow an explicitly approved bilingual continuation beyond the conservative local request cap while retaining the request ledger, number/alphabet exclusions and immediate stop on the first provider error. The default daily cap is unchanged; this run stopped on HTTP 429 without retrying.

## v1.2.0 - 2026-10-12

- Add complete bilingual descriptions for all 176 cards and 90 new Gemini recordings, bringing coverage to 189 unique clips: all 120 non-number Mandarin narrations and 69 English name-plus-explanation narrations. Preserve existing recordings and temporary Edge playback for unfinished items.
- Reveal the exact recorded transcript only after a language-button click, with whole-caption animation and reserved space that keeps the illustration and controls stable. Place pinyin above Chinese and use equal-height, single-line playback pills.
- Shuffle the entire filtered collection for each random browsing session, keeping forward/backward navigation and neighboring-image preloads in the same shuffled order.
- Remove number subgroup controls and show all 30 number cards together, including sequential and random browsing.
- Add explicit five-card Mandarin review batches and a Mandarin-first bilingual queue with a persistent 90-attempt daily safety budget. Exclude numbers and letters from the current generation queue, stop on errors, and remove the automatic speech timer.

## v1.1.1 - 2026-10-11

- Limit number learning to 1-30 in three ten-card pages, with 176 active cards across all eight categories.
- Replace native-text number and alphabet artwork with 56 matching paper-textured illustrations: retain the four approved samples and add 52 native 2048 x 1792 images with 640 x 560 thumbnails.
- Pair numbers with exact matching object counts and uppercase/lowercase letters with familiar English associations; keep glyphs prominent in the immersive viewer.
- Extend versioned image delivery and adjacent-image preloading to every number and letter, and remove the obsolete text-and-dot renderer.
- Preserve all recorded audio and generation provenance; future scheduled Gemini runs follow the active 1-30 number range without regenerating archived clips.

## v1.1.0 - 2026-10-10

- Add English labels and separate Mandarin/English playback controls across all 246 cards, with pinyin and Chinese number names in the immersive viewer.
- Replace browser speech synthesis with static MP3 playback. Preserve all 99 completed Gemini recordings and supply 121 temporary Mandarin and 246 English Edge recordings without changing the daily Gemini schedule.
- Keep opening and switching cards silent; stop active narration on navigation, closing or backgrounding.
- Preload the two previous and two next full-size illustrations in the current collection, and version image URLs by content with one-year browser/CDN cache headers.
- Validate recording transcripts and checksums during builds, exclude temporary audio from PWA precaching, and document local generation and Gemini-first selection.

## v1.0.1 - 2026-10-10

- Adopt the approved Zoo picture-card identity across the header, favicon, Apple Touch Icon and PWA icons while preserving existing illustrations and offline behavior.
- Add the Hexly project archive entry and complete Chinese and English documentation.
- Publish build-generated deployment health at `/api/live` with package version, source revision and `Cache-Control: no-store`; exclude health requests from service-worker caching.
- Add isolated local Worker health checks alongside existing content and PWA checks.
