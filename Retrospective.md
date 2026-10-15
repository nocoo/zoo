# Retrospective

## 2026-10-10 - PWA offline response variants

An initial offline reload returned the cached HTML but failed to resolve cached JS/CSS, leaving an empty application. Vite preview sends `Vary: Origin`; installation and page asset requests can differ in Origin headers. For this public, same-origin, versioned static app, explicitly match known shell paths and image cache entries with `ignoreVary`, rather than assuming a successful service-worker install proves offline usability. Validate a real offline reload and a previously viewed full-size image, not only CacheStorage entry counts. Keep audio/Range and cross-origin requests outside the worker, and do not precache the 246 MiB artwork collection.

The image response must also be cloned before `respondWith` can consume its body; cloning later in a sibling promise can silently prevent cache writes. Preserve the copy before resolving the response and retain cache writes with `waitUntil`. Chromium now passes offline reload, cached HD images and uncached placeholders. WebKit automation reports an internal error on offline reload; do not claim iPhone offline acceptance from that test. Verify the actual Home Screen installation, status bar and offline reopening on a physical device after publication.

## 2026-10-10 - HD production deployment

Deployed application revision `c902fea` to `zoo.hexly.ai` using the existing assets-only Worker. Active Cloudflare version: `c97fd2cb-ece7-440d-9fbd-7af7b832096f`, deployed at 03:57 UTC. Wrangler uploaded 349 changed files after one internal upload retry. Content checks, all 120 image provenance checks, build and Wrangler dry run passed. Production Chromium checks decoded and navigated all 120 full-size images at 390 px / 3x and 1440 px / 2x without page errors or horizontal overflow. An actual image response returned HTTP 200 and `CF-Cache-Status: HIT`.

The 120 full-size images total 221.78 MiB (median approximately 1.77 MiB, maximum 3.19 MiB); the 120 thumbnails total 23.92 MiB (median approximately 200 KiB). Retain Workers Static Assets: it already provides global caching and this fixed collection does not need independent object uploads. R2 would not reduce file sizes. Consider delivery compression separately if mobile transfer measurements justify it; consider R2 only for independently managed uploads or materially larger asset requirements. No bucket, DNS or billing change was made. Recorded speech remains incomplete (99/246) and the existing browser speech player remains in production; the daily local generation schedule is unchanged.

## 2026-10-10 - Image batch pacing

A four-request image burst produced one Azure HTTP 429 even though the other three completed. Preserve both successful native images and the rejected request record, add explicit 35-second request-start spacing, and resume after cooling down. Bounded concurrency is not request-rate control; never repeat a batch wholesale or automatically retry an outcome-unknown paid generation.

The paced run completed all 120 originals without another rejected request. Thumbnail resampling introduced a one-channel paper-color difference at a fruit corner; normalize the edge-connected background again after downsampling rather than changing the whole illustration palette. Preserve already validated outputs. Validate native dimensions, hashes, all category contact sheets, and real browser full-size image decoding before claiming full coverage.

## 2026-10-10 - Full-screen illustration resolution

The original 1536 x 1024 atlases placed twenty subjects on each canvas, leaving roughly 300 x 250 native pixels per card. Lossless export preserved those pixels but could not make them suitable for full-screen high-DPI viewing. Re-exporting or sharpening would not restore missing detail. For full-screen artwork, generate one subject per native high-resolution image and provide a separate small list derivative. The owner authorized a three-animal reference-guided redraw preview before expanding the batch; keep the original atlas and all generation provenance.

## 2026-10-10 - Batch speech rate limits

The generator initially hid provider error details and treated HTTP 429 as a short-window rate limit. Spacing starts by seven and then fifteen seconds did not resolve it. Reading the sanitized response revealed a Tier 1 limit of 100 requests per day and a reset countdown. Preserve completed WAVs and their hashes, expose useful errors without credentials, and wait for the actual quota reset instead of assuming a one-minute cooldown. Concurrency alone is not a rate limit. The batch stopped with 98 completed clips; the site retains its existing playback until all 246 are ready.

## 2026-10-10 - Preview entrypoint and speech pace

The Vite SPA fallback served the application homepage for the directory-style `/voice-preview/` URL, despite `public/voice-preview/index.html` existing. Add an exact local route rewrite and validate the actual URL, including a nonzero expected audio element count, before declaring the preview usable. An `every()` check over an empty element list otherwise passes vacuously.

The owner found the first speech take too slow. Regenerate the same three samples with shorter pauses and a conversational pace while retaining the voice and pronunciation instructions. Preserve immutable take paths and provide old/new comparison instead of changing playback speed or overwriting the previous recordings.

## 2026-10-10 - Picture-centered browsing

The initial card reused a pill Button without resetting its border, radius and hover surface. These styles created a second shape inside the card, particularly after touch/hover. Opaque cream illustrations multiplied over category colors also exposed rectangular edges. The blob modal further constrained image size to 170-210 pixels and added conflicting background shapes.

Reset the card action geometry, normalize only edge-connected paper pixels while preserving originals, and render images without multiply blending. Replace the recognition modal with a native full-viewport dialog, retaining concise controls and adding directional swipes. Inspect hover states, image letterboxing and landscape layouts rather than relying only on homepage screenshots. The installed Carousel implementation was inspected and has no touch handlers, so no carousel dependency was added.

Validation: content/swipe checks and production build passed. Isolated Chromium checks covered real CDP touch swipes, vertical gesture rejection, keyboard navigation, favorites, closing/focus restoration, number 100, and 320/390/768/844/1440 layouts. The existing Vite server on port 7058 serves the local preview. No production deployment was performed.

## 2026-10-09 - Initial implementation verification

- The inherited Herdr pane context did not resolve with `--current`. No pane was created by the failed command. Inspect live state and use the confirmed controller pane ID before splitting; never guess from focus.
- TypeScript 7 checks side-effect imports. The UI library exports CSS without a corresponding module declaration. Add a narrowly scoped ambient declaration for `animal-island-ui/style` rather than disabling strict checks.
- The user's Chrome session did not expose remote debugging. Do not retry permission prompts or change browser settings; use an isolated headless browser for responsive smoke checks.
- Library `Button` wraps all child content in a span. Layout selectors must account for that wrapper; styling only the button left category labels inline. Inspect rendered structure during the first visual pass.
- The game-shaped library `Modal` has no built-in close button. Supply an explicit, accessible close control; backdrop and Escape alone are insufficient on mobile.
- `cf pages deploy` appears in command discovery but the installed implementation rejects every deployment. Inspect concrete command support before selecting an infrastructure path. Use an assets-only Worker instead; no Pages project was created.
- Initial browser-check selectors matched both the underlying card heading and dialog heading. Scope assertions to the dialog and wait for layout transitions after viewport resizing to avoid false overflow reports.
- Generated atlases only approximated a uniform grid. Equal-cell slicing clipped subjects or included fragments from neighboring rows. Inspect original images, record crop boundaries in whitespace and regenerate optimized cards without modifying the originals.

## 2026-10-10 - Isolated health checks

The first local health check tried reserved port 17058 while an existing production preview already owned it. Wrangler exited instead of testing the new endpoint; no existing process was stopped. A reserved port is not an ownership guarantee. The health harness now lets the OS allocate HTTP and inspector ports, waits for its own Wrangler readiness output, uses a temporary configuration without production account/routes/bindings, and terminates only its child process before removing its own state. The installed workerd also supports compatibility dates only through 2026-10-08; the local fixture explicitly records this limitation rather than lowering the production date of 2026-10-09. Production behavior remains a separate release check.

## 2026-10-10 - Temporary narration integration

Do not turn incomplete Gemini generation into runtime system speech: the owner explicitly requested static temporary Edge MP3s while Gemini resumes tomorrow. Keep provider archives separate and select Gemini first at build time, without replacing approved files. Any new media directory must also be excluded from PWA shell precaching; otherwise adding temporary audio silently downloads the full collection during installation. The PWA check now covers the Edge directory and content-versioned image cache keys.

The bounded neighbor helper initially added only one collection length before modulo; a one-card collection with offset -2 could produce a negative index. Normalize both backward offsets and keep runnable assertions for zero, one and two cards as well as normal wraparound.

## 2026-10-12 - Caption layout stability

The first on-demand caption implementation inserted text into an auto-sized footer, moving the illustration and controls when playback started. Separate button columns also allowed different heights, especially with viewport-sized typography in a narrow landscape sidebar. Reserve space for both possible transcripts before playback, align both buttons in one shared grid row, and size their text against the actual control container. The owner rejected approximate word timing; remove the segmenter and progress callbacks rather than leaving an unused feature path. Browser checks now compare geometry before and after both language clicks, wait for entrance animations to finish before measuring, and include long English labels as well as the lion sample.

## 2026-10-12 - Inventory wording and number assertions

Calling an Edge-backed card "missing audio" confused usable playback coverage with Gemini replacement coverage. Report both separately and trace the actual served file to its provider metadata when challenged. A number-navigation smoke assertion also expected the gallery's Arabic numeral in the viewer, which intentionally displays the Chinese number name; check the target view's rendering contract before asserting labels. Neither issue required changing existing recordings or number labels.

## 2026-10-12 - Daily narration smoke harness

The first daily playback check passed a relative audio URL to Playwright's request context without configuring a base URL, so the harness failed before checking delivery. Resolve asset URLs against the local site explicitly. Some isolated Chrome starts also timed out before the category button became available; a fresh run completed all five category samples and four viewport checks. Do not mistake an automation startup failure for failed audio generation, and do not regenerate paid recordings to retry browser checks. File hashes, decoded audio and selected browser URLs are separate evidence from listening-based pronunciation approval.

## 2026-10-14 - Expansion draft copy before owner review

Independent review of the 77 expansion drafts found translation and pinyin errors before owner reading: English that treated mandarin peel as segments, porridge defined as soup, 小鸡 labeled Chicken, 医院 yuàn written as yuán, unmarked guā on 黄瓜/南瓜, egg 圆圆 vs oval, phrase name "that" vs description "this", and streams assumed universally shallow. Check semantic alignment across name, description and both languages, mark standard tones, and contrast new-page copy against live cards before owner review. The controller browser harness also needed its return-link selector scoped to the header because two legitimate links exist; that is not a product defect.

## 2026-10-14 - Expansion Edge first pair HTTP 403

The authorized phase-3 command `uv run --with edge-tts==7.2.8 python scripts/generate-edge-audio.py --expansion` stopped on the first pair. `transport-01` zh and en both raised `aiohttp` `WSServerHandshakeError` HTTP 403 against the Edge TTS websocket. No expansion JSON or MP3 was promoted (0/154). The application did not retry and did not schedule later pairs. `edge-tts==7.2.8` `Communicate.stream` catches HTTP 403, runs its DRM handler, and retries `__stream()` once, so each job made more than one underlying handshake; the log shows two 403s with different `ConnectionId` values before the process exited. Root moved the two zero-byte `transport-01.tmp.mp3` files to `artifacts/expansion-audio/failed-first-pair/{zh,en}/`. Log: `artifacts/expansion-audio/generation.log`. All 1,469 preexisting audio/archive files stayed SHA-256 identical. Root cause of the 403 is unknown. Do not change the pinned package, endpoint or credentials, and do not rerun without a fresh grant. Do not claim generated recordings or pronunciation. The review UI stays without expansion playback. The root initial mocked browser harness matched all `role=status` nodes, including legitimate progress text; the assertion was scoped to `.toast[role=status]`, which is not an application defect.

## 2026-10-14 - Recorded audio errors after play()

Independent review found a latent gap in `createRecordedAudio`: only `play()` promise rejection was handled. After `play()` resolved, a later media `error` (network or decode) left the failed element running and skipped the useful Chinese callback. One identity-guarded `fail` path now serves both the promise catch and the element `error` listener. Report and stop only while that element is still `active`; a second signal from the same element, or an `error` on a previously stopped element, is ignored so the callback fires once. Keep the existing `DOMException` `NotAllowedError` copy. The player check covers async success-then-error, stale errors, and promise-plus-event delivery.

## 2026-10-14 - Release smoke geometry readiness

The first production playback smoke check measured the viewer before its fonts and image had finished loading, then reported an illustration-height change during playback. Waiting for `document.fonts.ready` and decoding the dialog images before taking the baseline made the unchanged application pass in Chromium and WebKit across all eight categories, number 30 and the final character/phrase cards. Wait for asset readiness as well as animation completion before comparing interaction geometry; do not weaken the assertion or regenerate paid audio to fix a harness timing error. The v1.3.0 release commit and deployed assets were not changed by this correction.

## 2026-10-14 - Preservation harness hashlib.file_digest

The root preservation harness first called `hashlib.file_digest`, which exists only on Python 3.11+, against system Python 3.9. Replace it with `hashlib.sha256(path.read_bytes())`. The snapshot then hashed 3,332 files successfully. Check the runtime before using a new standard-library API.

## 2026-10-14 - Expansion thumbnail LANCZOS paper-corner drift

Export of 46 expansion deliveries halted before writing `src/expansion-art.json` when `vegetables-04-thumb.webp` failed the exact paper-corner check. After RGB-tolerance-8 edge-connected normalize at 2048×1792, LANCZOS downsampling to 640×560 mixed the bottom-right corner to distance 9, so the second normalize could not flood-fill it. Unrecorded full/thumb were copied to ignored `artifacts/expansion-art/halted-vegetables-04/` with SHA-256 recorded, then removed from `public/art/expansion/`; no blind delete. Processing still uses tolerance 8 and does not touch natives. After thumbnail resample it now restores the four exact paper-corner pixels. Re-export completed 46/77. Existing `delivery.json` records were not rewritten. This does not explain the `places-05` provider timeout.

## 2026-10-15 - Expansion --ids progress scanned the full queue

The owner authorized only the 30 never-requested expansion images. `generate.py --ids` built that pending queue correctly, then computed `done = len(items) - len(pending_items(items))` against all 77 cards. `pending_items` raises on outcome-unknown `places-05`, so the process exited before any helper `Popen`. Progress reporting is not a queue gate. Count completed cards with `complete()` and keep `pending_items` on the selected subset. A default whole-run still refuses unknown cards. The offline mocked `--ids` of a pending card with unknown outside now launches only that card. No provider call, retry, or `places-05` resume.

## 2026-10-15 - Preservation exclusions and zsh URL query

The 77-delivery preservation compare excluded two intentionally modified scripts and two docs from the preexisting SHA set. Archived unknown-attempt files were compared through the retry manifest original paths and hashes, not by requiring those timeout records to remain in the active card folders. Quote zsh URL queries: an unquoted `curl` with `?review=expansion` ran no request because the shell ate the query; quoting the URL issued the request.

## 2026-10-15 - Integration checks must survive provider progress

The first expansion integration regression asserted 240 completed/154 pending against real Gemini files, and the Edge check required all 77 additions in normal-mode jobs. Root review caught that the first authorized Gemini success would invalidate both. Fixed initial 394/240/154 and 77-Mandarin-first expectations belong in an isolated fixture with explicit original completed IDs and expansion IDs; a one-clip-completed fixture must verify resume at 153 without regenerating that clip. Real inventory requires the original 240, validates existing recordings and allows only expansion targets to remain pending. Normal Edge jobs exclude independently completed Gemini languages while the 154-file expansion Edge archive stays intact. Do not freeze mutable provider progress into a permanent CI assertion.

A one-off preservation comparison also compared live objects directly with a JSON snapshot, falsely flagging existing `group: undefined` properties omitted by JSON. Compare the same serialized representation without changing source objects or the frozen snapshot. Exact-edit tool calls likewise need enough local context to distinguish repeated assertions; rejected ambiguous replacements make no file changes. Generation/publication authorization is not sentence-by-sentence listening or pronunciation approval; keep those claims separate in current documentation.

The fifth animal filter exposed horizontal overflow at 320 px because its flex container did not wrap. Enable wrapping on the shared filter container, preserving every label/control rather than clipping or hiding them. Imported `CoffeeCupIcon` and `MapIcon` also contain literal `stroke-width` JSX props in naive-icons 1.3.0; `CarIcon` does not. Use the installed, verified `DonutIcon` and `LocationIcon` instead of patching dependencies. New controls need the smallest supported viewport check and newly consumed SVG components need React-property validation, even when the library is already installed.

## 2026-10-15 - Bound production browser evidence

The first production native-audio smoke check used a 15-second readiness deadline and timed out without enough diagnostic context. Adding per-clip URL/state logging and a bounded 30-second deadline verified all 16 real playback cases across Chromium/WebKit and the four new categories, without changing app code or regenerating audio. The separate strict full-gallery harness still failed on a loading timeout and a Cloudflare-injected beacon request outside the application's source; local development also exposed a pre-existing BearIcon SVG warning. Report those gaps separately from successful exact-revision CI, asset hashes, local layout checks and native playback. Do not silently suppress errors, claim an all-green full-browser run, or change account-level telemetry configuration as part of a speech release.
