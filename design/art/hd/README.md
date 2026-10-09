# High-Resolution Redraws

The owner approved the three-card preview and authorized all remaining 117 reference-guided redraws on 2026-10-10. All requests use individual native 2048 x 1792 images from Azure `gpt-image-2.5-sunburst`, high quality, through `/images/edits`. These are newly generated drawings, not recovered source detail or interpolated enlargements. The full batch is in progress; only the three approved animals are currently integrated in the application.

`2026-10-10/<card-id>/` preserves the original atlas crop, exact prompt, sanitized request/response, untouched generated PNG and delivery checksums. `generate_azure.py` is an unchanged snapshot of the reference-edit helper from `hexly.ai/artwork/logo-family/tools/`. Its `raw-review.json` distinguishes the three owner-approved samples from subsequent generated images; authorization of the batch is not individual owner approval. No logo workflow or catalogue adoption is involved.

## Generate Or Resume The Batch

```sh
uv run --with pillow python design/art/hd/generate_batch.py --prepare
direnv exec ../workflow uv run --with pillow python "$PWD/design/art/hd/generate_batch.py"
```

The preparation command makes exact original atlas crops using the established crop boundaries, saves English prompts and validates completed original hashes without API calls. Generation uses at most four workers with 35 seconds between request starts. It stops after a failed batch; no automatic retries, provider/model switches or duplicate requests. Do not run concurrent generator processes. A prior failed or outcome-unknown request blocks resumption until investigated. Preserve a confirmed rejected request's request/response/log under the card's `attempts/` directory before deliberately retrying; never discard a successful output or blindly retry an unknown paid outcome.

The first four-request burst produced one HTTP 429 and three successful images. Its rejected request is retained under `animals-04/attempts/01-rate-limited/`; requests were then paced and resumed after a cooldown.

The reference crop locks the character, pose, palette and paper-cut/gouache appearance. Each request asks for one complete character, clear margins, fine native brushwork and a uniform cream background. Original atlases and old delivery files remain untouched for comparison.

## Reproduce Delivery

```sh
uv run --with pillow python design/art/hd/process.py
uv run --with pillow python design/art/hd/process.py --check
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

Use absolute paths for the script as well when running through direnv from another directory. Inspect the generated contact sheets and any questionable native output before application integration. No production deployment is authorized by this batch.
