#!/usr/bin/env python3
import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public/art"
ARCHIVE = ROOT / "design/art"
CATEGORIES = {"animals", "fruits", "weather", "objects", "hanzi", "phrases"}
ROW_EDGES = {
    "animals": [0, 264, 510, 757, 1024],
    "objects": [0, 256, 486, 734, 1024],
    "fruits": [0, 257, 522, 754, 1024],
    "hanzi": [0, 261, 507, 751, 1024],
    "weather": [0, 269, 507, 748, 1024],
    "phrases": [0, 254, 507, 757, 1024],
}
COLUMN_EDGES = {
    "animals": [0, 310, 607, 906, 1225, 1536],
    "hanzi": [0, 300, 604, 931, 1225, 1536],
}
PAPER = (250, 246, 232)


def normalize_paper(image):
    difference = ImageChops.difference(image, Image.new("RGB", image.size, PAPER))
    red, green, blue = difference.split()
    distance = ImageChops.lighter(ImageChops.lighter(red, green), blue)
    candidates = distance.point(lambda value: 255 if value <= 18 else 0)
    bordered = ImageOps.expand(candidates, border=1, fill=255)
    ImageDraw.floodfill(bordered, (0, 0), 128, thresh=0)
    background = bordered.crop((1, 1, image.width + 1, image.height + 1)).point(lambda value: 255 if value == 128 else 0)
    return Image.composite(Image.new("RGB", image.size, PAPER), image, background)


def process_atlas(category, source):
    with Image.open(source) as atlas:
        atlas = atlas.convert("RGB")
        width, height = atlas.size
        if (width, height) != (1536, 1024):
            raise ValueError(f"Expected 1536x1024 atlas, got {width}x{height}")
        items = (ARCHIVE / f"{category}-order.txt").read_text(encoding="utf-8").splitlines()
        if len(items) != 20:
            raise ValueError(f"Expected 20 ordered items, got {len(items)}")
        for index, _item in enumerate(items):
            col, row = index % 5, index // 5
            rows = ROW_EDGES[category].copy()
            cols = COLUMN_EDGES.get(category, [round(i * width / 5) for i in range(6)])
            if category == "fruits" and col == 4:
                rows[2] = 504
            if category == "fruits" and col == 2:
                rows[3] = 747
            if category == "phrases" and col == 1:
                rows[2] = 498
            box = (
                cols[col], rows[row], cols[col + 1], rows[row + 1],
            )
            cell = normalize_paper(atlas.crop(box).resize((300, 250), Image.Resampling.LANCZOS))
            cell.save(PUBLIC / f"{category}-{index + 1:02}.webp", "WEBP", lossless=True, method=6)

    thumbs = []
    for index in range(20):
        with Image.open(PUBLIC / f"{category}-{index + 1:02}.webp") as image:
            thumbs.append(image.convert("RGB").resize((180, 150), Image.Resampling.LANCZOS))
    gap, margin = 14, 14
    sheet = Image.new("RGB", (margin * 2 + 5 * 180 + 4 * gap, margin * 2 + 4 * 150 + 3 * gap), "#fff5dc")
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, (margin + (index % 5) * (180 + gap), margin + (index // 5) * (150 + gap)))
    sheet.save(ARCHIVE / f"{category}-contact.jpg", "JPEG", quality=90, optimize=True)


def process_hero(source):
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        image.save(PUBLIC / "hero.webp", "WEBP", quality=88, method=6)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("category", choices=sorted(CATEGORIES | {"hero"}))
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    PUBLIC.mkdir(parents=True, exist_ok=True)
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    if args.category == "hero":
        process_hero(args.source)
    else:
        process_atlas(args.category, args.source)


if __name__ == "__main__":
    main()
