import importlib.util
import json
from pathlib import Path
import hashlib

from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
RUN = Path(__file__).parent / '2026-10-10'
spec = importlib.util.spec_from_file_location('atlas', ROOT / 'design/art/process_atlas.py')
atlas = importlib.util.module_from_spec(spec)
spec.loader.exec_module(atlas)


def main():
    output = ROOT / 'public/art/hd'
    output.mkdir(parents=True, exist_ok=True)
    for identifier in ['animals-01', 'animals-02', 'animals-03']:
        folder = RUN / identifier
        source = folder / 'raw/generated.png'
        with Image.open(source) as raw:
            assert raw.size == (2048, 1792), f'Unexpected native size: {raw.size}'
            image = atlas.normalize_paper(raw.convert('RGB'), tolerance=8)
        files = []
        for suffix, size in [('full', (2048, 1792)), ('thumb', (640, 560))]:
            derivative = image.resize(size, Image.Resampling.LANCZOS) if size != image.size else image
            path = output / f'{identifier}-{suffix}.webp'
            derivative.save(path, 'WEBP', lossless=True, method=6)
            with Image.open(path) as saved:
                assert saved.size == size
                assert all(saved.getpixel(point) == atlas.PAPER for point in
                           [(0, 0), (size[0] - 1, 0), (0, size[1] - 1), (size[0] - 1, size[1] - 1)])
            files.append({'path': str(path.relative_to(ROOT)), 'size': size,
                          'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
        (folder / 'delivery.json').write_text(json.dumps({
            'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'processing': 'Edge-connected paper normalization (RGB tolerance 8); lossless WebP; thumbnail downsampling only.',
            'files': files,
        }, indent=2) + '\n')
        print(f'已导出 {identifier}：2048 高清图与 640 缩略图。', flush=True)


if __name__ == '__main__':
    main()
