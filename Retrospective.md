# Retrospective

## 2026-10-09 - Initial implementation verification

- The inherited Herdr pane context did not resolve with `--current`. No pane was created by the failed command. Inspect live state and use the confirmed controller pane ID before splitting; never guess from focus.
- TypeScript 7 checks side-effect imports. The UI library exports CSS without a corresponding module declaration. Add a narrowly scoped ambient declaration for `animal-island-ui/style` rather than disabling strict checks.
- The user's Chrome session did not expose remote debugging. Do not retry permission prompts or change browser settings; use an isolated headless browser for responsive smoke checks.
- Library `Button` wraps all child content in a span. Layout selectors must account for that wrapper; styling only the button left category labels inline. Inspect rendered structure during the first visual pass.
- The game-shaped library `Modal` has no built-in close button. Supply an explicit, accessible close control; backdrop and Escape alone are insufficient on mobile.
- `cf pages deploy` appears in command discovery but the installed implementation rejects every deployment. Inspect concrete command support before selecting an infrastructure path. Use an assets-only Worker instead; no Pages project was created.
- Initial browser-check selectors matched both the underlying card heading and dialog heading. Scope assertions to the dialog and wait for layout transitions after viewport resizing to avoid false overflow reports.
- Generated atlases only approximated a uniform grid. Equal-cell slicing clipped subjects or included fragments from neighboring rows. Inspect original images, record crop boundaries in whitespace and regenerate optimized cards without modifying the originals.
