# Bilingual Gemini Narration

Status: the owner-approved 2026-10-12 daily batch is complete and stopped. All 84 new recordings succeeded; with six earlier requests, today's conservative Zoo budget of 90 requests is exhausted. No timer, push or deployment occurred. Further generation needs renewed authorization and available quota.

## Reading Contract

[Review all 176 bilingual cards and their local status](02-bilingual-copy.md). `src/content.ts` owns the copy. Existing Chinese names, pinyin, descriptions, English labels and the approved lion explanation are unchanged.

- 120 picture/character/phrase cards: each language reads the name plus the full explanation.
- 30 numbers: Mandarin retains number-name-only narration; English targets name plus counting explanation. Both languages are excluded from current generation.
- 26 letters: one American English alphabet-name clip is shared by both playback entries. Descriptions are editorial, not narration. Letters are excluded from current generation.
- Total full-coverage target: 326 unique recordings, not 352. Current eligible scope: 240 recordings for 120 non-number/non-alphabet cards.
- Captions always match the selected recording. Pending English Edge clips still read and caption only their names, not unrecorded explanations.

## Verified Local Inventory

Updated after the 2026-10-12 continuation. Completed recordings match their target transcript, model, Sulafat voice, style and WAV/MP3 hashes. `src/media.json` selects these local recordings.

| Category | Mandarin complete | Mandarin pending | English complete | English pending | Shared alphabet pending |
| --- | ---: | ---: | ---: | ---: | ---: |
| Animals | 20 | 0 | 20 | 0 | 0 |
| Fruit | 20 | 0 | 20 | 0 | 0 |
| Weather | 20 | 0 | 20 | 0 | 0 |
| Objects | 20 | 0 | 9 | 11 | 0 |
| Chinese characters | 20 | 0 | 0 | 20 | 0 |
| Phrases | 20 | 0 | 0 | 20 | 0 |
| Numbers 1-30 (excluded) | 0 | 30 | 0 | 30 | 0 |
| Alphabet A-Z (excluded) | 0 | 0 | 0 | 0 | 26 |
| Total | 120 | 30 | 69 | 81 | 26 |

189/326 unique Gemini targets are complete locally; 137 remain across the full catalogue. Within the currently eligible scope, 189/240 are complete and only 51 English replacements remain. Every pending item already has Edge playback; this is provider/transcript replacement coverage, not a count of missing playable files.

These numbers are local, not deployed coverage. The last separately verified production baseline was v1.1.1 with 99 Gemini recordings. This batch did not deploy or re-audit production coverage.

## Completed On 2026-10-12

1. Approved lion English sample: one request, retained unchanged.
2. Five-clip Mandarin review: `hanzi-19`, `phrases-01` through `phrases-04`. The owner listened and approved before continuation.
3. Daily continuation: 84 successful requests, with no retries or provider errors:

| Scope | IDs | New clips |
| --- | --- | ---: |
| Mandarin phrases | phrases-05 through phrases-20 | 16 |
| English animals | animals-02 through animals-20 | 19 |
| English fruit | fruits-01 through fruits-20 | 20 |
| English weather | weather-01 through weather-20 | 20 |
| English objects | objects-01 through objects-09 | 9 |
| Total continuation | Mandarin first, then English | 84 |

The continuation preserved all 1,050 pre-existing audio/archive files byte-for-byte and added exactly 84 WAV/JSON/MP3 sets. Every new MP3 decoded fully with FFmpeg. Content and production-build checks passed. Local browser checks sample every newly generated category, silent navigation, exact language URLs and full captions; automated checks do not establish pronunciation quality of every sentence.

## Next Queue, Not Yet Authorized

Numbers and letters remain excluded. After fresh approval and available quota, resume English only in this order:

1. `objects-10` through `objects-20`: 11.
2. `hanzi-01` through `hanzi-20`: 20.
3. `phrases-01` through `phrases-20`: 20.

These 51 fit within one fully available conservative quota round, but shared usage and provider failures can shorten a run. Do not start automatically tomorrow, restart a timer, regenerate completed clips or fill the remaining budget with excluded categories.

## Execution And Budget

- Approved provider/model: Gemini Interactions API, `gemini-3.8-flash-tts`; voice: `Sulafat`. Preserve the approved faster Mainland Mandarin style and natural American English explanation style in `scripts/generate-audio.py`.
- Authorized daily continuation: `python3 scripts/generate-audio.py --bilingual-day`. This constructs all eligible Mandarin jobs before English, in category order animals, fruits, weather, objects, hanzi, phrases. Existing matching recordings are validated without rewriting them; only pending jobs use the provider. Number and alphabet jobs are never included.
- Offline inventory/queue check: `python3 scripts/generate-audio.py --check --bilingual-day`. No keys, network, writes or full-coverage requirement; missing eligible jobs are reported as pending. This is not a pronunciation review.
- Generation is sequential, with at least 20 seconds between request starts, under the existing exclusive filesystem lock. Each result is saved immediately. Any provider/file error stops the run; there is no automatic retry, fallback model, key rotation or billing change.
- `artifacts/audio-schedule/request-budget.json` records a conservative local-calendar-day maximum of 90 attempts across all generator modes. Each request is reserved before network access, so failed attempts count. The first entry for a date seeds known successes from that day's generated WAV modification dates; on 2026-10-12 six were verified before the ledger began. Preserve the ledger and old cooldown history.
- This ledger is not a provider quota meter: historical errors reported 100 requests/day on Tier 1, shared with His.fm. File timestamps cannot reveal other-device/shared usage or failed requests before the ledger existed. The local date boundary is not a provider reset contract. Respect actual provider errors/reset instructions.
- The daily mode does not use the obsolete all-catalogue completion flag or write a partial `src/audio-manifest.json`. `scripts/build-media.mjs` selects exact-transcript, hash-validated Gemini files independently by language and writes `src/media.json` for dev/build. Builds never invoke a speech provider.
- Originals remain in `design/audio/<id>.wav|json`, with English under `design/audio/en/`; MP3 delivery follows the same structure in `public/audio/`. Keep all Edge files and prior approved takes. Archive old WAV/JSON/MP3 together before any separately authorized changed-text replacement.
- Credentials remain private in the existing His.fm configuration. Never print or copy the key into code, documentation, arguments, metadata, browser assets or logs.

## Timer And Publication Boundary

The owner removed the old `ai.hexly.zoo.audio` LaunchAgent on 2026-10-12. It was unloaded and both installed and repository plist files were removed. Keep it disabled. The dormant legacy `--scheduled` CLI is not a registered task and is not part of the daily continuation.

Speech authorization does not authorize publication. No automatic commits, push or deployment are performed by the generator; source/media changes are reviewed and committed separately. Future generation requires a fresh instruction even after the daily counter resets.
