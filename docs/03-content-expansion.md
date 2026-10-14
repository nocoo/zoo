# Content Expansion Drafts

Status: owner approved bilingual copy at commit `c6344b5` on 2026-10-14. Phase 3 Edge generation ran once with `uv run --with edge-tts==7.2.8 python scripts/generate-edge-audio.py --expansion` and stopped on the first pair: `transport-01` zh and en both failed `WSServerHandshakeError` HTTP 403. Completed expansion recordings: 0/154. The application did not retry and did not schedule later pairs. `edge-tts==7.2.8` itself handles HTTP 403 then retries the websocket once per `Communicate.stream` call, so underlying handshakes were not a single attempt. Root cause of the 403 is unknown. Do not change the pinned package, endpoint or credentials. Do not rerun without a fresh grant. Playable `src/content.ts` stays at 176 with existing media unchanged. The review UI stays without expansion playback (`src/expansion-media.json` is `{ "audio": {} }`). Do not claim generated files or pronunciation. GPT Image, playable integration, version bump, deploy and Gemini replacements remain later stages. These drafts are not developmental requirements.

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
4. **Workflow GPT image generation.** Approved illustrations for the new cards, under a fresh explicit grant. Live art under `public/art/` and `design/art/` stays untouched until that grant.
5. **Validation and owner-authorized release.** Content, media, playback and release checks, then a separately authorized production release. Playable integration into `src/content.ts` happens in this stage, not before.
6. **Gemini replacements.** Mandarin first, then English, under a fresh scope and budget. No timer, leftover budget, or earlier grant is authorization.

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

Skipped: image generation, deploy, version bump. Add when the owner opens the matching later stage.
