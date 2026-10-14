# Expansion Illustrations

Owner authorized 77 expansion drawings in the established HD style, skipping the stopped Edge 403 run. Live `public/art/` and `design/art/hd/` originals stay untouched. Draft copy in `src/expansion.ts` is unchanged. Root invokes generation; these scripts do not schedule provider calls.

`2026-10-14/manifest.json` is an array of the approved 77 records `{id,category,subject,references}` in source order. Each `2026-10-14/<id>/prompt.txt` is prepared separately. References are existing native 2048 x 1792 PNGs. This directory does not write prompts or the dated manifest.

## Generate Or Resume

```sh
python3 design/art/expansion/generate.py --check
python3 design/art/expansion/check.py
direnv exec ../workflow uv run --with pillow python "$PWD/design/art/expansion/generate.py"
direnv exec ../workflow uv run --with pillow python "$PWD/design/art/expansion/generate.py" --ids transport-01,vegetables-01,phrases-21
```

`--check` is read-only: it validates the 77 IDs, prompt and reference provenance (request promptSha256, reference paths/hashes/order, model/size/quality), and completed native hashes/dimensions, then reports pending cards. Completed helper records are counted as they arrive. An in-flight `request.json` without a succeeded response is listed and never queued. It makes no provider requests and writes nothing. `--ids` is an optional comma-separated subset of those IDs; unknown IDs fail. Do not regenerate or overwrite existing sample prompts, references or natives.

Generation reuses the unchanged helper `design/art/hd/2026-10-10/generate_azure.py` with `gpt-image-2.5-sunburst`, high quality, 2048 x 1792. Exclusive `fcntl` lock, at most three in-flight requests, 40-second spacing measured from helper process launch. References and the card log are prepared before the pace lock; the helper is launched with `Popen` under the lock, then waited out of lock. Preparation, launch, nonzero exit or validation failure sets the run failed: queued jobs stop, in-flight requests settle, no retry or provider/model fallback. `request.json` without a succeeded validated response blocks resumption. Existing natives, references and approved copy are never overwritten. Workflow direnv supplies credentials; this code does not read, print or archive them.

## Process Delivery

```sh
python3 design/art/expansion/process.py
python3 design/art/expansion/process.py --check
```

Process only validated natives. Delivery is `public/art/expansion/<id>-{full,thumb}.webp` at 2048 x 1792 and 640 x 560, with edge-connected `#faf6e8` paper normalization at RGB tolerance 8. Checksums live in `2026-10-14/<id>/delivery.json`. Category contact sheets are written beside the dated manifest. Missing natives stay pending. Conflicting or orphan files fail. `--check` is read-only and uses no network.

`src/expansion-art.json` is a separate map `{images:{ID:{image,imageLarge}}}` with content-versioned `/art/expansion/` URLs. It does not change live `src/media.json`. An empty `{ "images": {} }` seed is valid before any export.
