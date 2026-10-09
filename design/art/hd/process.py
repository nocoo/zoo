import importlib.util
import json
from pathlib import Path
import hashlib
import argparse

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
RUN = Path(__file__).parent / '2026-10-10'
spec = importlib.util.spec_from_file_location('atlas', ROOT / 'design/art/process_atlas.py')
atlas = importlib.util.module_from_spec(spec)
spec.loader.exec_module(atlas)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='Verify all 120 delivery records without writes')
    args = parser.parse_args()
    output = ROOT / 'public/art/hd'
    if not args.check:
        output.mkdir(parents=True, exist_ok=True)
    folders = sorted(path.parent.parent for path in RUN.glob('*/raw/generated.png'))
    if args.check:
        assert len(folders) == 120, f'Expected 120 originals, found {len(folders)}'
    for folder in folders:
        identifier = folder.name
        source = folder / 'raw/generated.png'
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        response = json.loads((folder / 'response.json').read_text())
        assert response['status'] == 'succeeded' and response['output']['sha256'] == digest
        record_path = folder / 'delivery.json'
        if record_path.exists():
            record = json.loads(record_path.read_text())
            assert record['source_sha256'] == digest
            assert len(record['files']) == 2
            for file in record['files']:
                path = ROOT / file['path']
                assert hashlib.sha256(path.read_bytes()).hexdigest() == file['sha256'], path
                with Image.open(path) as saved:
                    assert list(saved.size) == file['size']
                    saved.verify()
            continue
        assert not args.check, f'Missing delivery record: {identifier}'
        with Image.open(source) as raw:
            assert raw.size == (2048, 1792), f'Unexpected native size: {raw.size}'
            image = atlas.normalize_paper(raw.convert('RGB'), tolerance=8)
        files = []
        for suffix, size in [('full', (2048, 1792)), ('thumb', (640, 560))]:
            derivative = atlas.normalize_paper(image.resize(size, Image.Resampling.LANCZOS), tolerance=8) if size != image.size else image
            path = output / f'{identifier}-{suffix}.webp'
            derivative.save(path, 'WEBP', lossless=True, method=6)
            with Image.open(path) as saved:
                assert saved.size == size
                assert all(saved.getpixel(point) == atlas.PAPER for point in
                           [(0, 0), (size[0] - 1, 0), (0, size[1] - 1), (size[0] - 1, size[1] - 1)])
            files.append({'path': str(path.relative_to(ROOT)), 'size': size,
                          'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
        record_path.write_text(json.dumps({
            'source_sha256': digest,
            'processing': 'Edge-connected paper normalization (RGB tolerance 8); lossless WebP; thumbnail downsampling only.',
            'files': files,
        }, indent=2) + '\n')
        print(f'已导出 {identifier}：2048 高清图与 640 缩略图。', flush=True)
    if not args.check:
        for category in sorted(atlas.CATEGORIES):
            sheet = Image.new('RGB', (1200, 920), atlas.PAPER)
            draw = ImageDraw.Draw(sheet)
            for index in range(20):
                identifier = f'{category}-{index + 1:02}'
                path = output / f'{identifier}-thumb.webp'
                if path.exists():
                    with Image.open(path) as image:
                        image.thumbnail((230, 200), Image.Resampling.LANCZOS)
                        sheet.paste(image, ((index % 5) * 240, (index // 5) * 230))
                draw.text(((index % 5) * 240 + 8, (index // 5) * 230 + 204), identifier, fill='#554630')
            sheet.save(RUN / f'{category}-contact.jpg', quality=90)
    print(f'校验通过：{len(folders)} 张高清图及对应缩略图。', flush=True)


if __name__ == '__main__':
    main()
