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
