# High-Resolution Redraw Preview

The owner authorized a three-card reference-guided redraw preview on 2026-10-10. Lion, panda and rabbit now use individual native 2048 x 1792 images from Azure `gpt-image-2.5-sunburst`, high quality, through `/images/edits`. These are newly generated drawings, not recovered source detail or interpolated enlargements. The other 117 illustrated cards remain unchanged pending owner review.

`2026-10-10/<card-id>/` preserves the original atlas crop, exact prompt, sanitized request/response, untouched generated PNG and delivery checksums. `generate_azure.py` is an unchanged snapshot of the reference-edit helper from `hexly.ai/artwork/logo-family/tools/`. Its `raw-review.json` is the helper's pending owner-review record; this application preview is not an owner approval. No logo workflow or catalogue adoption is involved.

The reference crop locks the character, pose, palette and paper-cut/gouache appearance. Each request asks for one complete character, clear margins, fine native brushwork and a uniform cream background. Original atlases and old delivery files remain untouched for comparison.

## Reproduce Delivery

```sh
uv run --with pillow python design/art/hd/process.py
```

The processor reuses edge-connected paper normalization from `process_atlas.py` with a tighter RGB tolerance of 8 to retain pale panda brushwork. It writes lossless WebP at native 2048 x 1792 and a downsampled 640 x 560 thumbnail to `public/art/hd/`. It verifies dimensions and corner color, and records SHA-256 hashes. No sharpening or enlargement is applied. List cards load only thumbnails; the full-screen viewer loads the native-size delivery image on opening.

## Generate Another Take

Use a new run directory with `prompt.txt` and an exact source crop. Never overwrite an existing request or native output. The Workflow direnv environment privately supplies `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY`; do not print or archive their values.

```sh
direnv exec ../workflow python3 "$PWD/design/art/hd/2026-10-10/generate_azure.py" \
  --run-dir /absolute/path/to/new/run \
  --image /absolute/path/to/reference.png \
  --model gpt-image-2.5-sunburst --size 2048x1792
```

Use absolute paths for the script as well when running through direnv from another directory. Inspect every native output before deriving delivery assets. Do not regenerate the remaining cards until the owner accepts this preview direction. No production deployment is authorized by this preview.
