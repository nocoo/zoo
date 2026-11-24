# 05 · Media Pipeline, UI Specs & Batch Provenance History

This document preserves the full content inventory, UI/PWA specifications, illustration/speech generation SOPs, and dated batch/authorization provenance offloaded from root [AGENTS.md](../AGENTS.md) during the v2 handbook normalization. Cross-references: [01 - Bilingual Gemini TTS](01-bilingual-gemini-tts.md), [02 - Bilingual Copy](02-bilingual-copy.md), [03 - Content Expansion](03-content-expansion.md), [04 - Basic Categories](04-basic-categories.md), and [HD Redraws](../design/art/hd/README.md).

## 1. Content Inventory & Interaction Contracts

- `src/content.ts` assembles **360 cards across 15 categories**: 176 original (unchanged), 77 from `src/expansion.ts`, 82 from `src/additions.ts`, and 25 from `src/foundations.ts`.
  - **Category counts**: animals 60, numbers 30, letters 26, colors 10, shapes 8, family 7, hanzi 20, phrases 37, weather 29, objects 37, fruits 40, transport 15, vegetables 13, food 16, places 12.
  - **Numbers & letters**: numbers cover 1–30 in one flat collection (no subgroup controls or pagination; sequential and random browsing include all 30); letters cover A–Z.
  - **Animal groups**: 森林草原 18, 农场伙伴 13, 水边伙伴 16, 花园小伙伴 9, 天空飞鸟 4 (the fifth group holds the four birds added on 2026-11-07).
- `src/foundations.ts` owns the three basic-cognition categories added on 2026-10-30: colors (10), shapes (8), and family (7). Colors and shapes use the symbol template (one oversized swatch or geometric hero plus a small object hook); family uses the figurative places cast. Delivered to `public/art/foundations/` with map `src/foundations-art.json` via `design/art/expansion/generate.py --run 2026-10-30`. Never present advanced numbers, literacy, colors, shapes, or family as developmental requirements.
- `src/useIsland.ts` owns interaction state, device-local favorites, and playback:
  - Random start uses a Fisher-Yates shuffle of the current filtered list for one viewer session; next/previous navigation, counter, and neighbor-image preloads share that order.
  - A full cycle visits each card once, and backward navigation retraces it. Closing or opening a regular card clears the shuffled session; the gallery keeps its normal order.
- `src/App.tsx` and `src/PictureViewer.tsx` UI contracts:
  - Native modal `<dialog>` handles full-viewport browsing, focus containment/restoration, pointer swipes, and arrow keys; the ordinary `animal-island-ui` `Modal` remains only for parent information.
  - Playback pills stay `64 px` tall with single-line labels. Widths follow content: if both cannot fit, wrap the entire English button onto a new row rather than truncating or wrapping its text.
  - Keep card and viewer illustration surfaces on `--zoo-art-paper` with matching normalized backgrounds; do not restore multiply blending, colored letterboxing, or nested pill geometry on image cards.
  - Subtitle geometry stability: the viewer reserves subtitle space above pinyin using overlapping, invisible, accessibility-hidden copies of both transcripts so revealing or switching captions cannot move the image or controls. Word segmentation, timing estimates, and highlighting were removed at the owner's request; render the complete transcript as plain text. Animate only the whole subtitle on appearance/language change using opacity and a small transform (never layout dimensions), honoring `prefers-reduced-motion`. Captions appear only after an explicit playback click; language changes replace them; card changes, close, backgrounding, or errors clear them; playback completion retains the transcript. Temporary English name-only clips show only their recorded names, never an unrecorded explanation.
  - Image preloading: the viewer preloads at most two previous and two next full-size images from the current filtered collection (wraps around, deduplicates small collections, covers all illustrated categories) using native `Image` requests for iOS support. Never preload audio as a collection.
- `npm run build:mac` runs `npm run build`, then `scripts/build-mac.mjs` compiles `macos/App.swift` and `macos/LocalServer.swift` via `swiftc`, builds `AppIcon.icns` from `public/assets/brand/icon.png` (`sips` + `iconutil`), copies `dist/` (excluding `sw.js`) into `dist-mac/小小动物岛.app/Contents/Resources/dist/`, and applies an ad-hoc `codesign`. The app serves static assets over a read-only `127.0.0.1` loopback HTTP server with `Range` support inside `WKWebView`, keeping web source paths and audio playback unchanged; `dist-mac/` is gitignored.

## 2. PWA, Icons, Caching & Offline Validation

- **Identity**: document title, manifest `name`/`short_name`, and Apple standalone title are exactly `小小动物岛` (five Chinese characters). `public/manifest.webmanifest` uses stable `/` identity, root scope/start URL, and standalone display without an orientation lock.
- **Icons**: derived from the approved physical-tool identity — transparent `logo.png` and square `public/assets/brand/icon.png` (`icon-rounded.png` is README/display derivative only). `node scripts/generate-icons.mjs` uses the installed `sharp` transitive package to generate `public/favicon.png`, opaque 180 px Apple Touch Icon, 192/512 px regular icons, and a padded 512 px maskable icon. Do not pre-round Apple or maskable PNG corners (the OS applies its mask). No generation credentials are involved. The previous bear SVG is archived in the Hexly identity archive, not an active fallback.
- **Service worker (`dist/sw.js`)**: emitted by `scripts/build-pwa.mjs` post-Vite, versioned by all build bytes and worker code. Precaches root HTML, bundled JS/CSS/fonts, and install metadata only — never the full illustration or audio collections. Development never registers a worker; run offline tests against `vite preview` on reserved port `17058`.
- **Update & cache isolation**: keep one matching app-shell version until all old windows close; do not add unconditional `skipWaiting`, mix new HTML with old chunks, or reload mid-session. Worker activation deletes only Zoo-owned obsolete caches. `/sw.js` and `manifest.webmanifest` revalidate via `_headers`.
- **On-demand limits & bypasses**: at most 48 successfully viewed image responses are cached on demand; offline uncached images show a Chinese connection hint. Audio, `/api/`, and `Range` requests bypass the worker; health files never enter precache. Do not claim offline speech. Browser storage may be evicted (especially on iOS). No cache holds credentials; there is no analytics or background sync.
- **CDN/HTTP caching (`_headers`)**: HD image URLs carry a SHA-256 content version with 1-year browser/CDN immutable caching (changed bytes get a new URL on next build). MP3s carry content-versioned URLs with 1-day browser and 30-day shared-cache headers. `/api/live` serves JSON with `Cache-Control: no-store`.
- **iOS & mobile UX**: preserve viewport zoom and safe-area padding on the main page and viewer. Speech stops on page hide/backgrounding. Parent information explains Safari Share → Add to Home Screen and offline/update limitations.
- **Validation**: run `npm run check`, `npm run build`, and `node scripts/check-pwa.mjs`. Isolated Chromium covers offline reopening/images; WebKit covers online mobile layout and navigation (WebKit's automation offline reload returned an internal error; physical iPhone Home Screen/status-bar and offline verification remain outstanding).
- **Local health check (`npm run check:live`)**: requires a current build; starts a temporary local-only Worker with ephemeral HTTP/inspector ports and no account, routes, or remote bindings; verifies GET/HEAD JSON, version, revision, and `Cache-Control: no-store`, then cleans up its state. Installed `workerd` supports compatibility dates through `2026-10-08`; the test fixture uses `2026-10-08` without changing production `2026-10-09`, which must be verified post-deploy.

## 3. Illustration Pipelines & Historical Batches

Delivery assets live under `public/art/`; originals, prompts, exact subject ordering, and request records remain under `design/art/`. All 360 active cards use native 2048 × 1792 full-size WebP (`Picture.imageLarge`, normalized — not untouched provider PNG) and 640 × 560 thumbnails. Image pipeline uses Workflow Azure `gpt-image-2.5-sunburst`, max 3 in-flight, 40 s between starts, exclusive lock, no automatic retries; thumbnail export restores exact paper corners after LANCZOS with RGB tolerance 8. Machine `python3` lacks Pillow, so run art processors via `uv run --with pillow --no-project python ...`.

### Original 120 HD Redraws (2026-10-10)

- Owner approved the first three samples and authorized the remaining 117 reference-guided GPT Image 2.5 redraws on 2026-10-10. Hero asset is unchanged.
- Provenance lives under `design/art/hd/` (see `design/art/hd/README.md`).
- Export missing derivatives: `uv run --with pillow --no-project python design/art/hd/process.py` (`--check` validates all 120 records without writes).

### Number & Alphabet Symbol Redraw Batch (2026-10-10)

- Owner approved all four originals under `design/art/symbol-studies/2026-10-10-162535/` (numbers 1 and 2, letters A and B) on 2026-10-10. Preserve byte-for-byte; do not regenerate.
- Owner capped numbers at 30 and authorized the remaining 28 number and 24 letter illustrations (56 native originals total: 52 new + 4 retained). Numbers depict exact matching object counts arranged in rows of five for larger quantities; letters use a familiar English initial-letter association. Do not restore the old text-and-dot renderer; numbers explain counting the pictured objects. Preserve previously generated 31–100 audio archives (the Gemini generator reads active content dynamically so does not request 31–100).
- `design/art/symbols/2026-10-10/manifest.json` records all 56 sources including pointers to the four originals. Agent visual review checked every uppercase/lowercase pair and counted every number row by row; originals and review record are preserved.
- Offline checks: `python3 design/art/symbols/generate.py --check` (native hashes) and `uv run --with pillow --no-project python design/art/symbols/process.py --check` (all 56 symbol deliveries / 112 derivatives). Generation runs through Workflow `direnv` without logging secrets.
- Integration validation: native hashes/dimensions verified for 56 originals and 112 derivatives; numeric counts and glyphs visually checked; content/build/PWA/player/schedule checks passed; Chromium and WebKit verified 1–10/11–20/21–30 pages, native decoding, silent navigation, manual playback, and mobile/desktop layouts (that historical check was not deployment authorization).

### 77-Card Content Expansion Batch (2026-10-14 – 2026-10-15)

- Copy approved at `c6344b5` on 2026-10-14; owner approved all 77 illustrations/copy on 2026-10-15 and authorized generation, playable integration, and publication of 154 Edge clips (not sentence-by-sentence pronunciation approval). Obsolete draft review UI was removed; `src/expansion.ts`, `src/expansion-art.json`, and all provenance remain. See [03 - Content Expansion](03-content-expansion.md).
- Illustration completion: 77/77 natives and 154 exported deliveries (`src/expansion-art.json`). 2026-10-14 stopped at 46/77. 2026-10-15 added 31 new originals: first 18 never-requested (`objects-30..31`, `animals-21`, `animals-23..29`, `phrases-22..29`), then owner-authorized one manual retry each of timeout `places-05` and `animals-22` plus the remaining 11 (`weather-21..25`, `fruits-21..26`); that retry-13 run exited 0.
- Failed timeout records are preserved under `design/art/expansion/attempts/2026-10-15-authorized-retry` with a manifest of original paths and SHA-256; prompts stayed active; prior 64 deliveries stayed SHA-256 identical. Recorded visual findings remain in `design/art/expansion/2026-10-14/review.md`. No active pending or outcome-unknown cards remain; no further image API is authorized.
- `src/content.ts` supplies raw expansion delivery paths; `scripts/build-media.mjs` hashes them alongside original HD paths. Owner authorized v1.4.0, then the bounded Gemini replacement run and v1.4.1; root coordinator owns provider execution and releases.

### Additions Batches (`src/additions.ts` & `src/additions-art.json` — 82 Cards)

All three batches deliver into `public/art/expansion/` and `src/additions-art.json`, and play Gemini/Sulafat narration:

- **2026-10-23 (43 cards)** — `design/art/expansion/2026-10-23/` (natives, `prepare.py` prompts, `manifest.json`):

  ```sh
  python3 -B design/art/expansion/generate.py --run 2026-10-23
  uv run --with pillow --no-project python design/art/expansion/process.py --run 2026-10-23 --art src/additions-art.json
  ```
- **2026-11-07 (29 cards)** — `design/art/expansion/2026-11-07/` (merged into `src/additions-art.json`):

  ```sh
  python3 -B design/art/expansion/generate.py --run 2026-11-07
  uv run --with pillow --no-project python design/art/expansion/process.py --run 2026-11-07 --art src/additions-art.json --merge
  ```
- **2026-11-07 (10 animals)** — `design/art/expansion/2026-11-07-animals/` (merged into `src/additions-art.json`):

  ```sh
  python3 -B design/art/expansion/generate.py --run 2026-11-07-animals
  uv run --with pillow --no-project python design/art/expansion/process.py --run 2026-11-07-animals --art src/additions-art.json --merge
  ```

### Foundations Batch (2026-10-30 — 25 Cards)

- `design/art/expansion/2026-10-30/` delivers to `public/art/foundations/` and `src/foundations-art.json`. Full style decisions and commands live in [04 - Basic Categories](04-basic-categories.md).

## 4. Speech Generation SOP (Gemini & Edge)

### Gemini Configuration & Contracts

- **Approved provider/model**: Google Gemini Interactions API, `gemini-3.8-flash-tts`.
- **Approved voice**: `Sulafat` (warm adult female; faster second preview take approved on 2026-10-10).
- **Mandarin style**: standard Mainland Putonghua, no Taiwanese/Hong Kong/Cantonese accent, precise tones, natural neutral tones, affectionate without breathiness or baby talk, conversational ~4 Chinese syllables/sec connected speech, no vowel stretching, 150–200 ms pause after the name. Preserve the exact approved style in `scripts/generate-audio.py`; never imitate pace with playback speed changes.
- **Narration contract (`src/audio.ts`)**: picture/phrase cards read name + description; numbers read Chinese number name; letters read American English alphabet name only (not phonics). Only explicit language-button clicks play; opening, switching, and closing stop playback.
- **Credentials & tooling**: `scripts/generate-audio.py` reads `GEMINI_API_KEY` privately from gitignored `.env` only. Never print, copy, commit, pass via CLI arguments, or place the key in docs, prompts, generated metadata, browser code, or public files. Normal builds and playback require no credentials or provider access. Tooling requires Node.js with TypeScript stripping, Python 3 stdlib, and `ffmpeg` on PATH.
- **Archives & delivery**: `design/audio/<card-id>.wav` (and `design/audio/en/<card-id>.wav`) stores unmodified provider output; adjacent `.json` records model, voice, exact text/style, interaction ID, duration, source, and WAV/MP3 SHA-256 (no key). Delivery MP3s live in `public/audio/` (mono 24 kHz, 96 kbps via `ffmpeg`, no speed/trim/effects). `src/audio-manifest.json` maps IDs to content-versioned playback URLs and is written only after a complete batch succeeds.
- **Provenance on text/style changes**: resume validates recorded request metadata and file hashes. Before rerunning a card whose text/model/style changed, archive its old WAV/JSON/MP3 in a dated archive outside active `design/audio/` and `public/audio/`. Never delete provenance, blindly overwrite a completed take, or silently reuse an old approved preview for changed text.

### Gemini CLI Modes, Budget & Timer Policy

- **Default daily queue** (only with fresh explicit owner authorization): `python3 scripts/generate-audio.py --bilingual-day`. Category order: `animals`, `fruits`, `weather`, `objects`, `hanzi`, `phrases`, `transport`, `vegetables`, `food`, `places` (plus foundations), all Mandarin before English; excludes numbers and letters; sequential with >= 20 s between starts under exclusive lock; stops immediately on first error; no within-run retry, model fallback, key rotation, or billing change. Tier 1 credential limit reported as 100 req/day — inspect HTTP 429 details and wait for stated quota reset.
- **Legacy base invocation**: `python3 scripts/generate-audio.py` derives active transcripts, reuses the three approved v2 WAVs, and stores completed items immediately under the same spacing, lock, and no-retry rules.
- **Opt-in local-cap override**: `--bilingual-day --until-provider-error` requires fresh explicit approval each time; supersedes the local ceiling while recording an override marker in the ledger, and never alters provider quotas, credentials, spacing, or cooldown state.
- **Single-card English sample**: `python3 scripts/generate-audio.py --english-card <id>` (validate offline with `--check --english-card <id>`). Shares exclusive lock, incompatible with `--scheduled`, never writes batch manifest; `scripts/build-media.mjs` picks up validated English Gemini files independently of Mandarin.
- **Manual Mandarin review (1–5 cards)**: `--mandarin-cards <ids>` (validate offline with `--check --mandarin-cards <ids>`). Rejects numbers/letters and scheduled/English combinations; shares lock and daily budget; preserves recordings; does not rewrite batch manifest.
- **Offline inventory check** (no keys, network, or writes): `python3 scripts/generate-audio.py --check --bilingual-day --until-provider-error` or `--check --bilingual-day`. Bare `--check` requires the obsolete all-catalogue manifest and is not the current inventory command.
- **Local budget ledger (`artifacts/audio-schedule/request-budget.json`)**: enforces a 100-attempt local-calendar-day ceiling across all generator modes, reserving each attempt before network access so failures count. First entry per date seeds known successes from WAV modification dates (6 verified on 2026-10-12). This is local evidence, not a provider quota meter (cannot measure shared His.fm or other-device usage or pre-ledger failures), and date rollover is never authorization. Never delete or reset the ledger, cooldown history, logs, or lock.
- **Timer permanently revoked (2026-10-12)**: owner revoked timed generation. LaunchAgent `ai.hexly.zoo.audio` was unloaded and both `~/Library/LaunchAgents/ai.hexly.zoo.audio.plist` and its repository source were removed (`launchctl print gui/$(id -u)/ai.hexly.zoo.audio` confirms absence). Never reinstall a timer or invoke the dormant `--scheduled` wrapper.
- **Schedule unit check**: `python3 scripts/check-audio-schedule.py` validates budget, cooldown, and single-card isolation offline with mocked data.

### Edge TTS SOP & Current Inventory

- **Current Edge footprint**: 86 referenced recordings — `numbers-1..30` in Mandarin and English (60) plus shared `en/letters-A..Z` (26). Every card outside numbers and letters plays Gemini/Sulafat. Do not regenerate these 86 files; numbers and letters stay excluded from Gemini and rely solely on Edge.
- **Voices & format**: Mandarin `zh-CN-XiaoxiaoNeural` at `+10%`; English `en-US-JennyNeural` at normal speed (both female). Letters share their English alphabet clip and skip Mandarin. Requires Node (TS stripping) and `ffmpeg`; no API key needed. Because machine `python3` lacks `edge_tts`, run generation (only with fresh grant) via `uv run --with edge-tts==7.3.1 --no-project python scripts/generate-edge-audio.py`.
- **Offline check**: `python3 scripts/generate-edge-audio.py --check` (does not import `edge_tts`; validates referenced files only). Generation skips Gemini-completed languages independently, resumes existing Edge files, runs 2 concurrent requests, decodes every new MP3 fully via `ffmpeg`, shares `artifacts/audio-schedule/generation.lock`, and fails without overwriting mismatches or orphans.
- **Storage & media build**: Edge MP3s live in `public/audio-edge/{zh,en}/` and provenance (voice, text, rate, SHA-256, bytes) in `design/audio-edge/{zh,en}/`; Edge never touches `design/audio/` or `public/audio/`. `scripts/build-media.mjs` runs before dev and build, validates exact transcripts and MP3 hashes, prioritizes Gemini independently per language, and writes `src/media.json` without provider calls.

### Browser Verification Checklist

Open a card silently, click each language, rapidly switch cards silently, and close. Verify: only one recording plays; interrupted requests show no stale errors; failures show a useful message (never fall back to browser/OS TTS); sample >= 1 card per category, number 30, and an English letter. Chrome and WebKit verified silent opening/switching, separate language URLs, four neighbor image requests, and 320/390/844/1440 px viewer layouts. Automated checks do not substitute for listening-based pronunciation approval, and audio approval never authorizes production deployment.

## 5. Dated Speech Status & Consumed Authorizations

All historical authorizations below are **consumed**. Do not consume leftover daily budget, treat cooldown expiry as authorization, or call paid providers without fresh explicit owner approval.

### 2026-11-07 (Current Baseline — 360 Cards, 608/608 Gemini Complete)

- **Authorization 1 (consumed)**: owner reviewed the 29 new animal/fruit cards and said `通过。进行gemini tts`, authorizing 58 targets. One plain `--bilingual-day` run completed 58/58 (`animals-36..50`, `fruits-27..40`) with 20 s spacing, zero retries/errors, after read-only region probe returned HTTP 200 from direct Tokyo egress `74.82.193.28` (no proxy needed). Recorded 58/100 local attempts. Temporary Edge count had risen from 86 to 144; all 58 superseded Edge clips and provenance were deleted afterwards, restoring 86.
- **Authorization 2 (consumed)**: owner reviewed the 10 additional animals and chose `"1+2"` approving Gemini for 20 targets (`animals-51..60`) plus release. One plain `--bilingual-day` run completed 20/20 with 20 s spacing, zero retries/fallback/errors, from Tokyo egress `74.82.193.28`. Day's ledger closed at 78/100 (22 unused — not authorized for use). The 20 temporary Edge clips and provenance were deleted, restoring 86. `python3 scripts/generate-audio.py --check --bilingual-day` reports 608/608, zero pending.
- **Release**: v1.8.0 (`ba2d1a9`) deployed; exact-revision CI [42341384741](https://github.com/nocoo/zoo/actions/runs/42341384741) passed; `/api/live` reported `1.8.0` at `ba2d1a9`; GitHub Release `v1.8.0` published.

### 2026-11-06 (Superseded — 321 Cards, 530/530 Gemini Complete)

- **Authorization (consumed)**: owner said `补` and confirmed a Singapore proxy egress after the Hong Kong egress failed with HTTP 400 `User location is not supported for the API use.` (Gemini does not serve HK).
- Three `--bilingual-day --until-provider-error` runs completed all 39 remaining targets (14 Mandarin `shapes-02..08`, `family-01..07`; 25 English colors, shapes, family), recording 41/100 local attempts (59 remaining). First two runs stopped on an uncaught connection-level `OSError` at `en/colors-06`; the third completed 20/20. `--check --bilingual-day --until-provider-error` reported 530/530.

### 2026-10-29 (Superseded — 480/480 Gemini Complete & Edge Cleanup)

- **Authorization (consumed)**: owner requested resuming the speech queue in order until the day's budget was spent. With the 2026-10-24 15:00 cooldown elapsed and lock free, plain `--bilingual-day` (keeping the 100-attempt ceiling) completed all 91 remaining targets with zero errors and emptied the queue (9 unused — not permission for new calls).
- **v1.5.1 Edge cleanup**: removed 521 obsolete Edge clips (including the 154 expansion clips from `1d7320f`), retaining only the 86 number/alphabet files referenced by `src/media.json`.

### 2026-10-23 (Superseded — 253 Cards, 389/394 Gemini Complete)

- **Authorization (consumed)**: owner approved one Mandarin sample (`vegetables-06`, passed playback review) plus continuing the whole remaining queue until completion or first provider error, raising the local daily ceiling from 90 to 100.
- Completed 94 clips (22 Mandarin, 72 English); attempt 96 at `en/places-04` hit HTTP 429 reporting Tier 1 limit of 100 requests/day (local ledger held 95 attempts; difference reflects shared His.fm or other-device usage). Remaining 5 English clips (`en/places-04..08`) stayed on Edge. No retry, fallback, key rotation, or billing change followed. Provider retry delay `19h14m38s` (~2026-10-24 15:00 Asia/Shanghai) was recorded in cooldown state without a timer.
- **Release**: v1.4.2 (`42da9bf`) deployed; exact-revision CI [40021803639](https://github.com/nocoo/zoo/actions/runs/40021803639) passed; `/api/live` reported `1.4.2`.

### 2026-10-15 (Superseded — Edge 7.3.1 Expansion & Bounded Gemini Run)

- **Edge 7.3.1 run (consumed & later superseded)**: completed 154/154 expansion recordings, committed in `1d7320f`; all 1,469 existing audio/archive files (including 14 preview files) stayed SHA-256 identical. Superseded by Gemini in v1.5.1 and deleted — do not regenerate.
- **Historical Edge 7.2.8 hold**: earlier first-pair HTTP 403 stopped at 0/154 (library internally retried each websocket once; app did not retry or schedule later pairs). Failed tmp files and logs remain at `artifacts/expansion-audio/failed-first-pair/` and `artifacts/expansion-audio/generation.log`. Operational lesson: on similar failures, check the maintained client's latest release and use an explicitly authorized bounded probe before prolonged stale-version troubleshooting; never bypass endpoint, credential, or quota controls.
- **Gemini bounded run (consumed)**: after verified v1.4.0 (`52a03f8`) deployment with exact-revision CI success, `--bilingual-day --until-provider-error` ran the new expansion queue Mandarin-first, completing 55 clips before HTTP 429 at attempt 56 (reaching 295/394 Gemini; 22 Mandarin and 77 English stayed on Edge). v1.4.1 published the 55 replacements.

### 2026-10-14 (Consumed — 240/240 Original Bilingual Completion)

- **Authorization (consumed)**: owner confirmed only the remaining 40 English character/phrase recordings (excluding numbers and letters) plus a Y+1 release (v1.3.0). `--bilingual-day` completed 40/40 without retries or errors under the standard daily cap, reaching 240/240 eligible coverage with zero queued jobs.

### 2026-10-12 (Consumed — 5-Clip Review, 90-Budget Run, Error-Bounded Run & Timer Revocation)

- **5-clip Mandarin review**: `hanzi-19` and `phrases-01..04` passed owner listening approval.
- **Authorization 1 (consumed)**: owner approved continuing through the conservative 90-request Zoo budget, Mandarin first then English name + explanation, excluding numbers and letters. Completed 6 earlier seeded requests + 84 new (16 Mandarin phrases, 19 animal EN, 20 fruit EN, 20 weather EN, 9 object EN); process exited at 0 remaining budget.
- **Authorization 2 (consumed)**: owner requested continuing until first API error plus a Z+1 release via `--bilingual-day --until-provider-error` (`objects-10` onward, then hanzi/phrases English). Completed 11 successes, then stopped at HTTP 429 without retrying.
- **Timer revocation**: owner revoked timed generation and unloaded/removed `ai.hexly.zoo.audio`.
