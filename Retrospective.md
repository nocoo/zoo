# Retrospective

## 2026-10-09 - Initial implementation verification

- The inherited Herdr pane context did not resolve with `--current`. No pane was created by the failed command. Inspect live state and use the confirmed controller pane ID before splitting; never guess from focus.
- TypeScript 7 checks side-effect imports. The UI library exports CSS without a corresponding module declaration. Add a narrowly scoped ambient declaration for `animal-island-ui/style` rather than disabling strict checks.
- The user's Chrome session did not expose remote debugging. Do not retry permission prompts or change browser settings; use an isolated headless browser for responsive smoke checks.
