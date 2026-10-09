# Retrospective

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
