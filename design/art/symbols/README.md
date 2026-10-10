# Number And Alphabet Illustrations

The owner approved the four 2048 x 1792 samples on 2026-10-10 and authorized completing numbers 1-30 and letters A-Z. Reuse those four original PNGs from `../symbol-studies/2026-10-10-162535/` without regeneration or modification. The remaining 52 requests use approved number or alphabet images as style references with Azure `gpt-image-2.5-sunburst`, high quality.

`2026-10-10/manifest.json` records all 56 sources and approval status. Each new source directory preserves the exact English prompt, sanitized request/response, provider original and generation log. Batch authorization is not individual visual approval of new outputs.

## Generate And Resume

```sh
python3 design/art/symbols/generate.py --check
direnv exec ../workflow python3 "$PWD/design/art/symbols/generate.py"
```

The generator validates existing successful hashes and native dimensions before generating missing items. It has an exclusive process lock, at most three in-flight requests and 40-second request-start spacing. A failure stops additional starts; already-started requests finish and retain their results. Failed or unknown requests require manual investigation; no automatic retry, output overwriting or model switching. Credentials are privately supplied by Workflow, never recorded here.

## Review And Export

```sh
uv run --with pillow python design/art/symbols/process.py --sheets
uv run --with pillow python design/art/symbols/process.py
uv run --with pillow python design/art/symbols/process.py --check
```

Review all native glyphs and number counts before export. Number illustrations must show exactly their numeral's quantity; count row by row, especially 11-30. Alphabet cards show the standard uppercase/lowercase pair and an English association; do not confuse letters with objects or allow objects to obscure distinguishing strokes. Approved samples stay immutable even if later styles differ slightly.

Exports reuse the established edge-connected cream-paper normalization, lossless native 2048 x 1792 WebP and 640 x 560 thumbnails. Delivery checksums live in the batch directory, not the original approved study. No upscaling or sharpening. Old audio files remain preserved; the active content limit automatically restricts future speech generation to 1-30.
