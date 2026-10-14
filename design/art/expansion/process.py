import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

from PIL import Image, ImageDraw

import generate as gen

spec = importlib.util.spec_from_file_location('atlas', Path(__file__).resolve().parents[1] / 'process_atlas.py')
atlas = importlib.util.module_from_spec(spec)
spec.loader.exec_module(atlas)

PROCESSING = 'Edge-connected paper normalization (RGB tolerance 8); lossless WebP; thumbnail downsampling only.'
SIZES = [('full', (2048, 1792)), ('thumb', (640, 560))]


def public_dir():
    return gen.ROOT / 'public/art/expansion'


def art_path():
    return gen.ROOT / 'src/expansion-art.json'


def delivery_path(item):
    return gen.folder_for(item) / 'delivery.json'


def public_file(item, suffix):
    return public_dir() / f"{item['id']}-{suffix}.webp"


def expected_names(items):
    return {f"{item['id']}-{suffix}.webp" for item in items for suffix, _ in SIZES}


def verify_record(item, record, digest):
    if record.get('source_sha256') != digest:
        raise ValueError(f'Delivery source mismatch: {item["id"]}')
    if len(record.get('files', [])) != 2:
        raise ValueError(f'Delivery files mismatch: {item["id"]}')
    files = {Path(file['path']).name: file for file in record['files']}
    for suffix, size in SIZES:
        file = files.get(f"{item['id']}-{suffix}.webp")
        if file is None:
            raise ValueError(f'Delivery files mismatch: {item["id"]}')
        path = gen.ROOT / file['path']
        if path != public_file(item, suffix):
            raise ValueError(f'Delivery path mismatch: {path}')
        if hashlib.sha256(path.read_bytes()).hexdigest() != file['sha256']:
            raise ValueError(f'Delivery hash mismatch: {path}')
        with Image.open(path) as saved:
            if list(saved.size) != list(file['size']) or tuple(saved.size) != size:
                raise ValueError(f'Delivery size mismatch: {path}')


def orphans(items):
    folder = public_dir()
    allowed = expected_names(items)
    if not folder.exists():
        return
    for path in folder.iterdir():
        if path.name.startswith('.'):
            continue
        if path.name not in allowed:
            raise ValueError(f'Orphan expansion art: {path}')


def art_from(records):
    images = {}
    for item, record in records:
        files = {Path(file['path']).name: file for file in record['files']}
        thumb = files[f"{item['id']}-thumb.webp"]
        full = files[f"{item['id']}-full.webp"]
        images[item['id']] = {
            'image': f"/art/expansion/{item['id']}-thumb.webp?v={thumb['sha256'][:16]}",
            'imageLarge': f"/art/expansion/{item['id']}-full.webp?v={full['sha256'][:16]}",
        }
    return {'images': images}


def export_item(item):
    source = gen.folder_for(item) / 'raw/generated.png'
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    record_path = delivery_path(item)
    if record_path.exists():
        record = json.loads(record_path.read_text())
        verify_record(item, record, digest)
        return record
    for suffix, _ in SIZES:
        path = public_file(item, suffix)
        if path.exists():
            raise ValueError(f'Inspect existing unrecorded output: {path}')
    with Image.open(source) as raw:
        if raw.size != (2048, 1792):
            raise ValueError(f'Unexpected native size: {item["id"]}')
        image = atlas.normalize_paper(raw.convert('RGB'), tolerance=8)
    public_dir().mkdir(parents=True, exist_ok=True)
    files = []
    for suffix, size in SIZES:
        derivative = image if image.size == size else atlas.normalize_paper(
            image.resize(size, Image.Resampling.LANCZOS), tolerance=8)
        path = public_file(item, suffix)
        derivative.save(path, 'WEBP', lossless=True, method=6)
        with Image.open(path) as saved:
            if saved.size != size:
                raise ValueError(f'Unexpected delivery size: {path}')
            corners = [(0, 0), (size[0] - 1, 0), (0, size[1] - 1), (size[0] - 1, size[1] - 1)]
            if any(saved.getpixel(point) != atlas.PAPER for point in corners):
                raise ValueError(f'Paper corner mismatch: {path}')
        files.append({
            'path': str(path.relative_to(gen.ROOT)),
            'size': list(size),
            'bytes': path.stat().st_size,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        })
    record = {
        'source_sha256': digest,
        'source': str(source.relative_to(gen.ROOT)),
        'processing': PROCESSING,
        'files': files,
    }
    record_path.write_text(json.dumps(record, indent=2) + '\n')
    print(f"已导出：{item['id']}", flush=True)
    return record


def write_sheets(items):
    output = public_dir()
    categories = list(dict.fromkeys(item['category'] for item in items))
    for category in categories:
        group = [item for item in items if item['category'] == category]
        thumbs = [output / f"{item['id']}-thumb.webp" for item in group]
        if not any(path.exists() for path in thumbs):
            continue
        rows = (len(group) + 4) // 5
        sheet = Image.new('RGB', (1200, rows * 230), atlas.PAPER)
        draw = ImageDraw.Draw(sheet)
        for index, item in enumerate(group):
            path = output / f"{item['id']}-thumb.webp"
            x, y = (index % 5) * 240, (index // 5) * 230
            if path.exists():
                with Image.open(path) as image:
                    image.thumbnail((230, 200), Image.Resampling.LANCZOS)
                    sheet.paste(image, (x, y))
            draw.text((x + 8, y + 204), item['id'], fill='#554630')
        sheet.save(gen.RUN / f'{category}-contact.jpg', quality=90)


def collect(items, check):
    orphans(items)
    records = []
    for item in items:
        folder = gen.folder_for(item)
        ready = gen.complete(item)
        record_path = delivery_path(item)
        source = folder / 'raw/generated.png'
        if not ready:
            if record_path.exists() or any(public_file(item, suffix).exists() for suffix, _ in SIZES):
                raise ValueError(f'Conflict without validated native: {item["id"]}')
            continue
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if check:
            if not record_path.exists():
                for suffix, _ in SIZES:
                    path = public_file(item, suffix)
                    if path.exists():
                        raise ValueError(f'Inspect existing unrecorded output: {path}')
                continue
            record = json.loads(record_path.read_text())
            verify_record(item, record, digest)
            records.append((item, record))
            continue
        records.append((item, export_item(item)))
    expected = art_from(records)
    current = json.loads(art_path().read_text())
    if check:
        if current != expected:
            raise ValueError('src/expansion-art.json does not match delivered expansion images')
        return records
    art_path().write_text(json.dumps(expected, indent=2) + '\n')
    write_sheets(items)
    return records


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='Read-only validation; no writes or network')
    args = parser.parse_args()
    items = gen.load_items()
    records = collect(items, args.check)
    print(f'扩展插画已校验：{len(records)}/{len(items)}。', flush=True)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, AssertionError) as error:
        raise SystemExit(str(error)) from None
