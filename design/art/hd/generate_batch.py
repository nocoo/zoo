import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import subprocess
import sys

from PIL import Image

from process import ROOT, RUN, atlas


def prepare():
    folders = []
    for category in ['animals', 'fruits', 'weather', 'objects', 'hanzi', 'phrases']:
        subjects = (ROOT / f'design/art/{category}-order.txt').read_text().splitlines()
        assert len(subjects) == 20
        with Image.open(ROOT / f'design/art/originals/{category}-atlas.png') as original:
            assert original.size == (1536, 1024)
            for index, subject in enumerate(subjects):
                identifier = f'{category}-{index + 1:02}'
                folder = RUN / identifier
                if not folder.exists():
                    folder.mkdir()
                    original.crop(atlas.crop_box(category, index)).save(folder / 'reference.png')
                    (folder / 'prompt.txt').write_text(f'''Use case: illustration-story, reference-guided high-resolution redraw.
Image 1 is the exact existing illustration to preserve, not just a loose inspiration.
Redraw this one illustration as genuinely detailed native high-resolution artwork for a toddler picture-learning website. Subject: {subject}.
Preserve the reference identities, species, pose, expression, body proportions, markings, palette, object count, spatial relationships and prop placement. For a human activity retain the original action, people and essential props. For a natural phenomenon retain the depicted phenomenon rather than turning it into an animal character. Keep the same charming flat gouache and layered paper-cut picture-book aesthetic, simple rounded shapes, gentle faces where present, fine organic painted-paper texture and rich harmonious colors.
Clarify edges and delicate brushwork at native high resolution; do not reproduce low-resolution blur, pixelation, compression artifacts, halos or artificial oversharpening. Do not redesign the subject or add unrelated objects, characters or scenery. Ignore any tiny accidental fragment from an adjacent atlas cell at the outer boundary of the reference.
One complete subject or activity vignette only, centered, its longest dimension occupying approximately 82 percent of the canvas, with comfortable clean clearance around every body part and prop. Flat uniform warm cream background, exact sRGB #faf6e8, especially at every edge; no vignette, gradient, frame, corner shapes or cast shadow. No writing, letters, labels or watermark, including on books or clothing. No 3D, photorealism or heavy outlines. Match the supplied reference closely while redrawing its fine texture cleanly. Output a single 2048x1792 illustration, not a grid or contact sheet.
''')
                folders.append(folder)
    return folders


def complete(folder):
    response = folder / 'response.json'
    if not response.exists():
        return False
    metadata = json.loads(response.read_text())
    if metadata['status'] != 'succeeded':
        raise ValueError(f'{folder.name} 上次请求失败或结果未知，请先人工检查记录，不自动重试。')
    source = folder / 'raw/generated.png'
    assert hashlib.sha256(source.read_bytes()).hexdigest() == metadata['output']['sha256']
    with Image.open(source) as image:
        assert image.size == (2048, 1792), f'{folder.name} 原生尺寸不符'
        image.verify()
    return True


def generate(folder):
    with (folder / 'generation.log').open('w') as log:
        result = subprocess.run([
            sys.executable, str(RUN / 'generate_azure.py'), '--run-dir', str(folder),
            '--image', str(folder / 'reference.png'), '--model', 'gpt-image-2.5-sunburst',
            '--size', '2048x1792',
        ], stdout=log, stderr=subprocess.STDOUT)
    if result.returncode or not complete(folder):
        raise ValueError(f'{folder.name} 生成未完成，请检查该目录的 response.json；未重试或切换模型。')
    print(f'完成高清原图：{folder.name}', flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--prepare', action='store_true', help='Prepare references and prompts without API requests')
    args = parser.parse_args()
    folders = prepare()
    pending = []
    for folder in folders:
        if not complete(folder):
            if (folder / 'request.json').exists():
                raise ValueError(f'{folder.name} 存在未完成请求，先检查结果，禁止重复提交。')
            pending.append(folder)
    print(f'共 120 张，已完成 {120 - len(pending)} 张，待生成 {len(pending)} 张。', flush=True)
    if args.prepare:
        return
    with ThreadPoolExecutor(max_workers=4) as executor:
        for start in range(0, len(pending), 4):
            jobs = [executor.submit(generate, folder) for folder in pending[start:start + 4]]
            for job in jobs:
                job.result()
    print('全部 120 张高清原图已保存。', flush=True)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, AssertionError) as error:
        raise SystemExit(str(error)) from None
