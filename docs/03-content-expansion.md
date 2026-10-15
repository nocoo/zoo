# Content Expansion Drafts

Status: owner approved bilingual copy at commit `c6344b5` on 2026-10-14. Expansion illustration generation is complete: 77/77 natives and 154 exported deliveries (`src/expansion-art.json` has 77 entries). Owner authorized all 77 on 2026-10-14 (Workflow Azure `gpt-image-2.5-sunburst`, native 2048 × 1792, existing-card style, at most three in-flight, 40 seconds between starts, no automatic retries). That first batch stopped at 46/77. On 2026-10-15 the owner authorized the 30 never-requested images, then one manual retry each of timeout `places-05` and `animals-22` plus the remaining 11. 2026-10-15 added 31 new originals; the retry-13 run exited 0. Failed timeout records are under `design/art/expansion/attempts/2026-10-15-authorized-retry` with original paths and SHA-256. No pending or outcome-unknown active cards. No further image API is authorized. All 77 generated is not owner art approval; recorded defects remain. Phase 3 Edge recordings remain 0/154 and are deferred; do not rerun without a fresh grant. Playable `src/content.ts` stays at 176 with existing media unchanged. The review page previews expansion art from `src/expansion-art.json` and keeps honest pending audio controls (`src/expansion-media.json` is `{ "audio": {} }`). Manifest image counts are not owner art approval. Do not claim pronunciation or playable illustrations. Playable integration, version bump, deploy and Gemini replacements remain later stages. These drafts are not developmental requirements.

Approved expansion narration reads the name plus the description in each language (`ZH name。description`; `EN name. description`).

## Inventory

77 cards: 37 in four new categories, 40 additions to five existing categories. Chinese names, pinyin, English labels and both descriptions are in `src/expansion.ts` only.

| Group | Category id | Kind | Count | IDs |
| --- | --- | --- | ---: | --- |
| 交通工具 | transport | new | 10 | transport-01..10 |
| 蔬菜 | vegetables | new | 9 | vegetables-01..09 |
| 饭桌食物 | food | new | 10 | food-01..10 |
| 一起出门 | places | new | 8 | places-01..08 |
| 身边物品 | objects | existing | 11 | objects-21..31 |
| 动物朋友 | animals | existing | 9 | animals-21..29 |
| 开口说说 | phrases | existing | 9 | phrases-21..29 |
| 天气自然 | weather | existing | 5 | weather-21..25 |
| 缤纷水果 | fruits | existing | 6 | fruits-21..26 |

New-category titles are the approved product names above. Additions reuse the live category names. Food and vegetable cards are everyday culinary labels. 橘子 is mandarin orange; 柚子 is pomelo; they stay distinct from live 橙子 / Orange.

## Six stages

1. **Review first.** Owner reads the local review page at https://zoo.dev.hexly.ai/?review=expansion. Copy may change. No speech or image provider requests.
2. **Owner approval.** Explicit sign-off on the draft list and wording. Approval of copy is not authorization to generate media, bump a version, or deploy.
3. **Edge bilingual generation.** (stopped, 0/154) Temporary Mandarin and English recordings for the approved drafts. The authorized run failed on the first pair. Existing Gemini and live Edge files stay untouched. Fresh approval is required before any further provider call.
4. **Workflow GPT image generation.** (complete, 77/77 natives and 154 deliveries; not owner art approval) Owner authorized all 77 expansion illustrations on 2026-10-14. Native 2048 × 1792 Azure `gpt-image-2.5-sunburst` through the Workflow environment, existing-card style, at most three in-flight requests, 40 seconds between starts, no automatic retries. The 2026-10-14 run stopped with no retries at 46/77: transport-01..10, vegetables-01..09, food-01..10, places-01..04, places-06..08, objects-21..29, and phrases-21. `places-05` timed out (612.72s). First export halted on `vegetables-04` thumb: LANCZOS mixed the bottom-right corner to RGB distance 9, above tolerance 8, so the second normalize could not flood-fill it. Unrecorded full/thumb were preserved under ignored `artifacts/expansion-art/halted-vegetables-04/` (full SHA-256 `3eff3ea94cf13024799483a3ec850b7cc6d38224fbb54788340e1a9bc854500e`, thumb `2c45280b7547626f4a4edaf17492e87c7fdda649e6208944df2527ef56eddaf7`) before regenerating. Processing still uses RGB tolerance 8; after thumbnail resample it restores the four exact paper corners. Re-export wrote all 46 deliveries; full `vegetables-04` bytes match the preserved halt file; the new thumb hash is `80c969a54eb44e30d770e016c6ea2229e96f028b2f964d77a04410feede5232a`. On 2026-10-15 the owner authorized the 30 never-requested images, then one manual retry each of timeout `places-05` and `animals-22` plus the remaining 11. 2026-10-15 added 31 new originals (18 then 13). `animals-22` first timed out (602.66s). Failed timeout records are preserved under `design/art/expansion/attempts/2026-10-15-authorized-retry` with original paths and SHA-256; prompts stayed active. Both retries succeeded; the retry-13 run exited 0. Prior 64 deliveries stayed SHA-256 identical. Offline export now lists all 77 in `src/expansion-art.json` (154 WebPs). `process.py --check` reports 77/77. No pending or outcome-unknown active cards. No further image API is authorized. Raw visual notes and remaining defects: `design/art/expansion/2026-10-14/review.md`. The review page previews thumbnails from `src/expansion-art.json`. Live art for the 176 playable cards stays untouched. All 77 generated is not owner art approval or playable integration.
5. **Validation and owner-authorized release.** Content, media, playback and release checks, then a separately authorized production release. Playable integration into `src/content.ts` happens in this stage, not before.
6. **Gemini replacements.** Mandarin first, then English, under a fresh scope and budget. No timer, leftover budget, or earlier grant is authorization.

## Phase 4 review page

The local review URL still reads `src/expansion.ts`. It shows optional thumbnails from `src/expansion-art.json` in this generated static schema:

`{ "images": { "<id>": { "image": "/art/expansion/<id>-thumb.webp?v=<16-hex>", "imageLarge": "/art/expansion/<id>-full.webp?v=<16-hex>" } } }`

Missing IDs show 待生成, with no placeholder illustration. A present thumbnail may open `imageLarge` in a new tab with `rel="noopener"`. That URL is the normalized 2048 × 1792 delivery WebP, not the untouched provider PNG. Generation originals stay under `design/art/` and are not the review-page web link. Progress is the number of manifest thumbnails among 77 and does not mean the owner approved the art. Audio controls stay honest at 0/154. The page does not request speech or fall back to TTS, and does not integrate drafts into the playable app.

## Phase 3 commands

Offline, no provider, no writes from `--check`:

- `python3 scripts/generate-edge-audio.py --check --expansion`
- `python3 scripts/check-edge-expansion.py`
- `node scripts/build-media.mjs` writes `src/expansion-media.json` without calling a speech provider. Missing languages omit URLs. Mismatch or orphan expansion files fail the build. `src/media.json` for the 176 live cards keeps its current meaning.

Generation (not authorized to rerun):

- `uv run --with edge-tts==7.2.8 python scripts/generate-edge-audio.py --expansion` already ran once and stopped. Do not invoke it again until a fresh owner grant. Do not change `edge-tts==7.2.8`, the speech websocket, or credentials.

`--expansion` selects the 77 `expansionCategories` cards in source order, both languages, full name-plus-description transcripts. Voices: `zh-CN-XiaoxiaoNeural` at `+10%`, `en-US-JennyNeural` at `+0%`. At most two concurrent requests. No application retries. A failed pair stops scheduling later pairs; successful files stay. Identical existing recordings are skipped. Conflicting or orphaned files fail without overwrite. The generator shares `artifacts/audio-schedule/generation.lock` with other speech jobs; do not reset schedule state. `edge_tts` is imported only when a network request is required.

Evidence of the stopped run: `artifacts/expansion-audio/generation.log`; zero-byte `transport-01.tmp.mp3` files moved to `artifacts/expansion-audio/failed-first-pair/{zh,en}/`. All 1,469 preexisting audio/archive files stayed SHA-256 identical. No expansion JSON/MP3 was promoted.

Isolation: no Gemini, no credentials, no images, no `src/expansion.ts` copy edits, no live 176 media regeneration, no version bump, deploy or push. Expansion outputs are `design/audio-edge/{zh,en}/<id>.json` and `public/audio-edge/{zh,en}/<id>.mp3` using IDs that do not overlap the live cards. The review UI reads `src/expansion-media.json` as `{ "audio": { "<id>": { "zh"?: "<content-versioned relative MP3 URL>", "en"?: "<...>" } } }`.

## Checks

`npm run check` imports `scripts/check-expansion.ts` and asserts exact counts, unique IDs against the 176 live cards, nonempty fields, group kind and membership, name isolation, and that live content remains 176. No extra dependencies.

`python3 scripts/check-edge-expansion.py` is the phase-3 offline harness: 77/154 scope, bilingual full copy, preserved live Edge English name-only contract, skip-identical without network, mismatch/orphan failure, write-free `--check`, and stop-scheduling on failure.

Verified after the stopped generation (coordinator, no provider rerun): `python3 scripts/check-edge-expansion.py`, `python3 scripts/generate-edge-audio.py --check` (legacy live Edge files), `node --experimental-strip-types scripts/check-audio-player.ts`, `npm run check`, `npm run build`, `node scripts/check-pwa.mjs`, and `npm run check:live` all passed. `python3 scripts/generate-edge-audio.py --check --expansion` still fails because all 154 expansion recordings are missing (0 completed); that is the intended missing-file check, not a passing generation result. Chromium and WebKit at 320/390/844/1440 px passed the empty-manifest review page (77 cards, 9 filters, 154 disabled controls) and the live root (8 categories, 20 cards in the default view). Root mocked-`Audio` browser tests passed exclusive play, manual clicks, filter change, pagehide, backgrounding, stale errors, and post-`play()` media errors. These are not real speech or listening approval.

After the 46-delivery export, root `npm run check`, `npm run build`, PWA and live checks passed. A preservation snapshot reported 3,332 files unchanged. All 92 expansion WebPs passed size and paper-corner checks. Visual coverage of the first 46 is the verified-raw 36 plus the objects-21..29 contact sheet and the previously inspected `phrases-21` native. P3 `transport-06` stands. See `design/art/expansion/2026-10-14/review.md`.

After the 77-delivery export, root `python3 -B design/art/expansion/generate.py --check` 77/77, `process.py --check` 77/77, `npm run check`, `npm run build`, PWA and `npm run check:live` passed. Preservation: 3,770 preexisting media/archive files SHA-256 identical, excluding two intentionally modified scripts and two docs; archived unknown-attempt source bytes compared via the retry manifest. Active content, copy and media are byte-identical to `a400eb4`. The prior 64 natives, `delivery.json` files and public WebPs stayed SHA-256 identical. Independent reviewer browser of the first 64 at 390/1440 is recorded in `design/art/expansion/2026-10-14/review.md`. Root browser of all 77: Chromium and WebKit at 320/390/844/1440, 77 thumbs at 640×560, 0 pending, 154 disabled audio controls; at 390 each engine opened 9 category HD links decoded at 2048×1792. Evidence: `artifacts/expansion-art/2026-10-15/browser77.json`. Root visual of the last 13 used fruits and weather contact sheets plus `places-05` and `animals-22` natives; no additional obvious subject, style, or safety mismatch. Do not claim a completed independent last-13 review; the reviewer disconnected before that report. The earlier 18 findings remain valid. All 77 generated is not owner art approval; recorded defects remain.

Skipped: Edge rerun, further illustration API, playable integration, deploy, version bump.
