import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

from PIL import Image, ImageDraw

from generate import ROOT, RUN, complete

spec = importlib.util.spec_from_file_location('atlas', ROOT / 'design/art/process_atlas.py')
atlas = importlib.util.module_from_spec(spec)
spec.loader.exec_module(atlas)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sheets', action='store_true', help='Create review sheets without exporting delivery assets')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    items = json.loads((RUN / 'manifest.json').read_text())
    for item in items:
        folder = ROOT / item['source']
        assert complete(folder), f"Missing original: {item['id']}"
        if args.sheets:
            continue
        record_path = RUN / f"{item['id']}-delivery.json"
        source = folder / 'raw/generated.png'
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if record_path.exists():
            record = json.loads(record_path.read_text())
            assert record['source_sha256'] == digest
            for file in record['files']:
                path = ROOT / file['path']
                assert hashlib.sha256(path.read_bytes()).hexdigest() == file['sha256']
                with Image.open(path) as image:
                    assert list(image.size) == file['size']
                    image.verify()
            continue
        assert not args.check, f'Missing delivery record: {record_path}'
        files = []
        with Image.open(source) as raw:
            image = atlas.normalize_paper(raw.convert('RGB'), tolerance=8)
        for suffix, size in [('full', (2048, 1792)), ('thumb', (640, 560))]:
            path = ROOT / f"public/art/hd/{item['id']}-{suffix}.webp"
            assert not path.exists(), f'Inspect existing unrecorded output: {path}'
            derivative = image if image.size == size else atlas.normalize_paper(image.resize(size, Image.Resampling.LANCZOS), tolerance=8)
            derivative.save(path, 'WEBP', lossless=True, method=6)
            files.append({'path': str(path.relative_to(ROOT)), 'size': list(size), 'bytes': path.stat().st_size,
                          'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
        record_path.write_text(json.dumps({'source_sha256': digest, 'source': str(source.relative_to(ROOT)),
                                          'processing': 'Edge-connected paper normalization; native full-size lossless WebP; thumbnail downsampling only.',
                                          'files': files}, indent=2) + '\n')
        print(f"已导出：{item['id']}", flush=True)
    if args.sheets:
        for category in ['numbers', 'letters']:
            group = [item for item in items if item['id'].startswith(category)]
            for start in range(0, len(group), 6):
                sheet = Image.new('RGB', (1536, 960), atlas.PAPER)
                draw = ImageDraw.Draw(sheet)
                for index, item in enumerate(group[start:start + 6]):
                    with Image.open(ROOT / item['source'] / 'raw/generated.png') as raw:
                        raw.thumbnail((512, 448), Image.Resampling.LANCZOS)
                        x, y = index % 3 * 512, index // 3 * 480
                        sheet.paste(raw, (x, y))
                        draw.text((x + 12, y + 452), item['id'], fill='#554630')
                sheet.save(RUN / f'{category}-review-{start // 6 + 1}.jpg', quality=94)
    print('56 张原图已校验。', flush=True)


if __name__ == '__main__':
    main()
