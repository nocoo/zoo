# Complete Gemini Narration In Both Languages

Status: copy and execution plan prepared on 2026-10-12; awaiting owner approval. This pass does not authorize or execute speech generation, schedule repair, publication or deployment.

## Copy Approval

[Review all 176 bilingual cards](02-bilingual-copy.md). `src/content.ts` contains every Chinese and English description. Existing Chinese names, pinyin, descriptions, English labels and the approved lion English explanation are unchanged.

- 120 picture/character/phrase cards: each language reads its name followed by its full explanation.
- 30 numbers: Mandarin keeps its existing number-name-only contract. English reads the number name plus its counting explanation. The Chinese explanation remains editorial copy unless the owner explicitly changes this contract.
- 26 letters: retain a single American English alphabet-name recording, shared by both playback entries. Both descriptions are editorial copy only; do not generate phonics, explanations or a second alphabet recording.
- Total: 326 unique recordings for 176 cards, not 352. No numbers above 30.
- Temporary English Edge files still read only their names. Runtime captions must continue to show the exact selected recording transcript, not new unrecorded draft explanations.

## Verified Local Inventory

Audited on 2026-10-12 after the copy pass, without provider calls. Every completed file matches its target transcript, Gemini model, Sulafat voice, WAV SHA-256 and MP3 SHA-256; the committed media URLs select those files. All original Chinese/Edge recordings and the lion English take remain unchanged.

| Category | Mandarin complete | Mandarin pending | English complete | English pending | Shared alphabet pending |
| --- | ---: | ---: | ---: | ---: | ---: |
| Animals | 20 | 0 | 1 | 19 | 0 |
| Fruit | 20 | 0 | 0 | 20 | 0 |
| Weather | 20 | 0 | 0 | 20 | 0 |
| Objects | 20 | 0 | 0 | 20 | 0 |
| Chinese characters | 19 | 1 | 0 | 20 | 0 |
| Phrases | 0 | 20 | 0 | 20 | 0 |
| Numbers 1-30 | 0 | 30 | 0 | 30 | 0 |
| Alphabet A-Z | 0 | 0 | 0 | 0 | 26 |
| Total | 99 | 51 | 1 | 149 | 26 |

100 unique Gemini recordings are complete locally; 226 remain. Lion English is local only. The last separately verified production baseline was v1.1.1 with 99 Gemini recordings; this pass neither rechecks nor changes production. Do not describe local coverage as deployed coverage.

## Mandarin-First Queue

Content drafting can fan out; provider requests must remain sequential under one shared lock and budget. After approval, use this deterministic queue, skipping any already validated recording:

1. Mandarin `hanzi-19` (cow): 1 clip.
2. Mandarin `phrases-01` through `phrases-20`: 20 clips.
3. Mandarin `numbers-1` through `numbers-30`, numeric order: 30 clips.
4. English `animals-02` through `animals-20`: 19 clips; retain the approved lion take.
5. English fruit, weather, objects, Chinese characters and phrases: 20 clips per category, ID order.
6. English numbers 1-30, numeric order: 30 clips.
7. Shared alphabet A-Z: 26 clips, each letter once.

This completes all 51 missing Mandarin recordings before any new English request. If the owner wants to review Mandarin before English begins, stop after step 3 even when quota remains.

## Estimated Rounds

At most 90 new clips per scheduled attempt; at least 20 seconds between request starts and at least 23 hours between scheduled attempts. The observed provider limit was 100 requests per day, shared with other His.fm usage. Respect the actual error/reset response; do not rotate keys, retry automatically, change models or upgrade billing to bypass limits.

| Round | Planned work | New clips |
| --- | --- | ---: |
| 1 | 51 Mandarin, 19 animal English, 20 fruit English | 90 |
| 2 | 20 weather English, 20 object English, 20 character English, 20 phrase English, English numbers 1-10 | 90 |
| 3 | English numbers 11-30 and shared alphabet A-Z | 46 |

These are at least three fully available quota rounds, not a promise of three calendar days. Network failures, remaining shared quota, approval pauses and incomplete earlier rounds change the boundaries. Recount successful files and resume at the first pending queue item; never regenerate a completed take merely to fill a batch. A successful model-list connectivity check does not establish generation quota.

## Implementation Required After Approval

The current generator still has a legacy Mandarin/alphabet scheduled batch and an isolated `--english-card` command; the complete bilingual queue and round allocation above are a plan, not an implemented scheduler.

1. Enumerate explicit unique language jobs from the approved source. Keep Mandarin/alphabet paths unchanged and English originals in `design/audio/en/<id>.wav|json`, delivery in `public/audio/en/<id>.mp3`. Forbid duplicate alphabet jobs through the English-card command.
2. Keep `gemini-3.8-flash-tts`, `Sulafat`, the exact approved Mandarin style and the lion's natural American English style. No runtime TTS. Record exact text/style/language, interaction ID, duration and hashes without secrets.
3. Replace legacy completion detection with actual coverage of all 326 unique jobs. Use the same lock and shared daily budget across languages. Preserve cooldown state; do not let an old 176-item completion flag hide pending English work.
4. Media selection already supports independent English Gemini clips and exact selected transcripts. Preserve all existing Gemini and Edge files. If approved copy changes an existing recording, archive its old WAV/JSON/MP3 together before generating a replacement; never silently overwrite it.
5. Validate the queue order, shared-letter deduplication, preservation, cooldown, per-run ceiling and stale completion handling with local/mocked checks before provider access. Run the existing content, build, player and schedule checks; no new comprehensive test framework is required.
6. Generate only within a fresh explicit approval, retain successful outputs immediately, stop on provider errors and report generated/selected/deployed coverage separately. Commit and deploy only through separately authorized work.

## Existing Timer And Approval Boundary

Read-only inspection on 2026-10-12 found `ai.hexly.zoo.audio` still loaded for 08:30 daily, with zero active instances, one recorded launch and last exit code 78 (`EX_CONFIG`). Its JSON state still records the earlier failed attempt; logs include a previous daily-quota 429 and a later network failure. This does not prove a current quota limit, and the exact launch failure cause is not yet established.

No timer, cooldown, credential or generation configuration was changed in this pass. A loaded timer is not a reliable approval hold: before leaving generation unattended, obtain authorization to suspend the legacy job while awaiting copy approval. Do not repair/re-enable it or manually trigger a batch as part of this planning task. After explicit approval, inspect its launch failure and install the approved bilingual queue without bypassing cooldown.

Credentials stay in the existing private His.fm configuration. Never copy or print the key in code, documentation, process arguments, logs or browser assets.

## Current Viewer And Sample

The owner approved the stable subtitle layout and requested whole-caption motion only. Captions appear on a language click above pinyin in reserved space; the entire line fades/slides in gently without moving the illustration or controls. Both pill buttons share a row and height. Reduced-motion preference disables the caption animation. There is no word highlighting or timing estimation.

The retained lion English sample reads: `Lion. The lion has a fluffy mane around his neck, like a little scarf.` Duration: 6.80 seconds; model: `gemini-3.8-flash-tts`; voice: `Sulafat`. Validate offline with `python3 scripts/generate-audio.py --check --english-card animals-01`.
