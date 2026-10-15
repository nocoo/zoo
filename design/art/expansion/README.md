# Expansion Illustrations

Owner authorized 77 expansion drawings in the established HD style, skipping the stopped Edge 403 run. Generation is 77/77 natives and 154 exported deliveries. 2026-10-14 stopped at 46/77. 2026-10-15 added 31 new originals (18 never-requested, then one manual retry each of timeout `places-05` and `animals-22` plus 11 unattempted). Failed timeout records are under `attempts/2026-10-15-authorized-retry` with original paths and SHA-256. No pending or outcome-unknown active cards. No further image API is authorized. All 77 generated is not owner art approval; recorded defects remain in `2026-10-14/review.md`. Live playable `public/art/` files (non-expansion) and `design/art/hd/` originals stay untouched. Draft copy in `src/expansion.ts` is unchanged. Phase 3 audio stays 0/154. No playable integration or deploy. Root invokes generation; these scripts do not schedule provider calls.

`2026-10-14/manifest.json` is an array of the approved 77 records `{id,category,subject,references}` in source order. Each `2026-10-14/<id>/prompt.txt` is prepared separately. References are existing native 2048 x 1792 PNGs. This directory does not write prompts or the dated manifest. Raw visual notes: `2026-10-14/review.md`.

Succeeded natives (77): transport-01..10, vegetables-01..09, food-01..10, places-01..08, objects-21..31, animals-21..29, phrases-21..29, weather-21..25, fruits-21..26. Archived timeout attempts: `places-05` and `animals-22` under `attempts/2026-10-15-authorized-retry`. No pending active cards.

## Generate Or Resume

Use the already-installed `python3` and Pillow. Do not `uv run --with pillow` or otherwise install packages for these scripts.

```sh
python3 -B design/art/expansion/generate.py --check
python3 -B design/art/expansion/check.py
python3 -B design/art/expansion/process.py --check
```

`--check` is read-only: it validates the 77 IDs, prompt and reference provenance (request promptSha256, reference paths/hashes/order, model/size/quality), and completed native hashes/dimensions, then reports pending cards. Completed helper records are counted as they arrive. An in-flight or outcome-unknown `request.json` without a succeeded response is listed and never queued. It makes no provider requests and writes nothing. `--ids` is an optional comma-separated subset of those IDs; unknown IDs fail. Do not regenerate or overwrite existing sample prompts, references or natives.

Generation (not authorized to rerun) reuses the unchanged helper `design/art/hd/2026-10-10/generate_azure.py` with `gpt-image-2.5-sunburst`, high quality, 2048 x 1792, via Workflow direnv and `python3 -B`. Exclusive `fcntl` lock, at most three in-flight requests, 40-second spacing measured from helper process launch. References and the card log are prepared before the pace lock; the helper is launched with `Popen` under the lock, then waited out of lock. Preparation, launch, nonzero exit or validation failure sets the run failed: queued jobs stop, in-flight requests settle, no retry or provider/model fallback. `request.json` without a succeeded validated response blocks resumption. Existing natives, references and approved copy are never overwritten. Workflow direnv supplies credentials; this code does not read, print or archive them.

## Process Delivery

```sh
python3 -B design/art/expansion/process.py
python3 -B design/art/expansion/process.py --check
```

Process only validated natives. Delivery is `public/art/expansion/<id>-{full,thumb}.webp` at 2048 x 1792 and 640 x 560, with edge-connected `#faf6e8` paper normalization at RGB tolerance 8. After LANCZOS thumbnail resample, a second normalize can miss a corner whose drift exceeds 8; the four corners are then set to exact paper. Checksums live in `2026-10-14/<id>/delivery.json`. Category contact sheets are written beside the dated manifest. Missing natives stay pending. Conflicting or orphan files fail. `--check` is read-only and uses no network.

The first 46-card export halted on `vegetables-04-thumb.webp` (bottom-right distance 9) before writing the map. Unrecorded full/thumb were copied to ignored `artifacts/expansion-art/halted-vegetables-04/` then removed from `public/art/expansion/`. Halt hashes: full `3eff3ea94cf13024799483a3ec850b7cc6d38224fbb54788340e1a9bc854500e` (2,021,600 bytes), thumb `2c45280b7547626f4a4edaf17492e87c7fdda649e6208944df2527ef56eddaf7` (207,962 bytes); native `959ac6a35756e656c44e8f4f18d0dc748ef8a4099ac39971e3c2c17e87770e4c`. Re-export of all 46 succeeded. The new full matches the halt file; the new thumb is `80c969a54eb44e30d770e016c6ea2229e96f028b2f964d77a04410feede5232a`. Later exports added 18 then 13 deliveries without rewriting the prior 64 natives, `delivery.json` files or public WebPs; `process.py --check` reports 77/77.

`src/expansion-art.json` is a separate map `{images:{ID:{image,imageLarge}}}` with content-versioned `/art/expansion/` URLs. It currently lists all 77 delivered cards (154 WebPs). It does not change live `src/media.json`. Missing IDs stay absent. An empty `{ "images": {} }` seed is valid only in tests and before any export.
