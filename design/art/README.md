# Artwork Archive

Generated on 2026-10-09 through the Workflow `agi-image-generation` CLI using Azure OpenAI `gpt-image-2.5-sunburst`, high quality, 1536 x 1024. Original PNG outputs are retained unchanged in `originals/`.

Six atlases each contain twenty subjects in row-major order. The `*-order.txt` files and `*-prompt.txt` files record the exact subjects and generation instructions. The hero is a separate image.

`process_atlas.py` produces 300 x 250 lossless WebP cards and a 1200-pixel-wide hero at quality 88. Generated subjects do not obey exact equal grid boundaries; the explicit crop edges follow visually inspected whitespace instead of blindly splitting the atlas into equal cells. Contact sheets provide a visual check of subject ordering and clipping.

Card backgrounds connected to the crop edges are normalized to the shared paper color `#faf6e8`. Flood filling only near-paper pixels connected to the perimeter preserves enclosed light-colored illustration details. Lossless delivery keeps that background exact, so `object-fit: contain` does not reveal a differently colored rectangle in the full-screen viewer. Original PNGs remain unchanged.

```sh
uv run --with pillow python design/art/process_atlas.py animals design/art/originals/animals-atlas.png
uv run --with pillow python design/art/process_atlas.py hero design/art/originals/hero.png
```

Repeat the first command for `fruits`, `weather`, `objects`, `hanzi`, and `phrases`. Do not include credentials in this archive. Do not regenerate art merely to change delivery size; derive delivery assets from the preserved originals.
