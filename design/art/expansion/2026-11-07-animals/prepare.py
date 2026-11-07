import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
HD = 'design/art/hd/2026-10-10'
EX = 'design/art/expansion/2026-10-14'
AD = 'design/art/expansion/2026-10-23'
NEW = 'design/art/expansion/2026-11-07'

STYLE = """Use case: illustration-story, toddler picture-learning website for children aged 1.5-3 with an adult.
Create ONE finished native 2048x1792 illustration, not a grid, contact sheet, collage, mockup or interface.

The attached native PNG image(s) are STYLE references only. Match their paint, paper grain, rounded proportions, palette and cream paper. Do not copy the old subject, pose, identity, toy-scale context or composition.

STYLE: charming flat gouache with layered painted-paper shapes, rounded child-friendly forms, tiny dark dot eyes and gentle peach blush only where a face naturally suits, fine organic painted-paper texture, and rich but restrained mint, ochre, coral and sky accents."""

COMPOSITION = """COMPOSITION: one complete centered subject or activity vignette, its longest dimension occupying approximately 82 percent of the canvas, with comfortable clean cream margin around every part. Flat uniform warm cream background, exact sRGB #faf6e8 right to every edge; no vignette, gradient, frame, corner shapes, colored letterbox or cast shadow. No text, letters, numbers, signage words, watermark, grid or extra panels. No 3D, photorealism or heavy outlines."""

# id, references, chinese, english meaning, english subject
CARDS = [
    ('animals-51', [f'{HD}/animals-18/raw/generated.png', f'{EX}/animals-24/raw/generated.png'],
     '孔雀。孔雀把尾巴张开，像一把彩色的大扇子。', "Peacock. A peacock's tail opens like a big colorful fan.",
     'One peacock standing in calm side view with its rounded fan of tail feathers spread behind it: a soft teal-blue body, a slender neck, a small crest of three dots on the head, tiny dark dot eyes and two thin legs. The fan is a semicircle of long painted feathers with simple eye spots in warm ochre, coral and mint. Not a turkey, not a pheasant, not a parrot, no garden, no bench, no flowers.'),
    ('animals-52', [f'{HD}/animals-18/raw/generated.png', f'{HD}/animals-17/raw/generated.png'],
     '鹦鹉。鹦鹉的羽毛很鲜艳，会学我们说话。', 'Parrot. A parrot has bright feathers and can copy what we say.',
     'One friendly parrot perched upright on a short rounded branch: a plump bright green body, a coral-red chest, a small curved pale beak, a rounded head with tiny dark dot eyes and a soft fan of short tail feathers below the branch. One complete bird with both wings folded. Not a macaw with a huge beak, not an owl, no cage, no jungle leaves.'),
    ('animals-53', [f'{HD}/animals-18/raw/generated.png', f'{EX}/animals-24/raw/generated.png'],
     '老鹰。老鹰张开翅膀，在高高的天空滑翔。', 'Eagle. An eagle spreads its wings and glides high in the sky.',
     'One noble eagle gliding with both wings fully spread in a wide gentle arc: a warm brown body, a paler cream head and neck, a small hooked pale beak, tiny dark dot eyes, a softly fanned tail. Seen slightly from below so both wings read as one shape. Not a vulture, not an owl, no mountain, no clouds, no prey.'),
    ('animals-54', [f'{HD}/animals-17/raw/generated.png', f'{HD}/animals-05/raw/generated.png'],
     '鸵鸟。鸵鸟跑得很快，可是不会飞。', 'Ostrich. An ostrich runs very fast, but it cannot fly.',
     'One ostrich standing in calm side view: a large rounded soft-grey body, a long pale neck, a small head with tiny dark dot eyes and a short flat beak, two very long sturdy pinkish legs and a fan of soft cream tail feathers. Wings are small and folded, clearly too small to fly. Not an emu, not a flamingo, no desert, no dust cloud.'),
    ('animals-55', [f'{EX}/animals-23/raw/generated.png', f'{HD}/animals-17/raw/generated.png'],
     '天鹅。天鹅的脖子又长又弯，在水上慢慢游。', 'Swan. A swan has a long curved neck and swims slowly on the water.',
     'One elegant white swan floating in side view on a small soft patch of pale blue water: a rounded body of creamy white feathers, one long neck curving down in a graceful S shape, a small orange beak with a dark base, tiny dark dot eyes, and one wing lifted as a soft rounded shape above its back. Clearly larger and longer-necked than a goose. Not a duck, not a goose with a short neck, no reeds, no sky, no other birds.'),
    ('animals-56', [f'{AD}/animals-31/raw/generated.png', f'{AD}/animals-30/raw/generated.png'],
     '蝌蚪。小蝌蚪黑黑的，长着小尾巴，长大就变成青蛙。', 'Tadpole. Tadpoles are tiny and black with a little tail, and they grow into frogs.',
     'Three tiny tadpoles swimming together in a small gentle group: each is a round dark-teal head with two tiny dot eyes and one soft tapering translucent tail, slightly different sizes and directions. No legs yet, no frog shape, no pond plants, no water waves, no other animals.'),
    ('animals-57', [f'{NEW}/animals-46/raw/generated.png', f'{HD}/animals-20/raw/generated.png'],
     '水母。水母像一把透明的伞，在水里轻轻飘。', 'Jellyfish. A jellyfish is like a clear umbrella, floating gently in the water.',
     'One gentle jellyfish seen from the side: a soft translucent dome in pale blush and sky blue with a rounded edge, two tiny dark dot eyes, and five short wavy painted tentacles trailing below with soft curly tips. The dome looks see-through and light, never spiky or slimy. Not an octopus with eight arms, no water, no bubbles, no fish.'),
    ('animals-58', [f'{NEW}/animals-46/raw/generated.png', f'{HD}/animals-19/raw/generated.png'],
     '海马。海马的头像小马，尾巴弯弯地卷起来。', 'Seahorse. A seahorse has a head like a tiny horse and a curly tail.',
     'One gentle seahorse floating upright in side view: a small head like a tiny horse with a long snout, tiny dark dot eyes, a slim body with soft painted ridges, one small dorsal fin and a tail curled into a spiral at the bottom, in warm ochre and coral. Not a sea dragon with leaves, not a fish with a straight tail, no seaweed, no water.'),
    ('animals-59', [f'{HD}/animals-13/raw/generated.png', f'{AD}/animals-35/raw/generated.png'],
     '仓鼠。仓鼠小小的，会把食物塞到脸颊里。', 'Hamster. A hamster is tiny and stuffs food into its cheeks.',
     'One small round hamster sitting up in a friendly pose: a plump ochre-and-cream body, two full rounded cheeks, a tiny pink nose, small rounded ears, tiny dark dot eyes and four tiny pale paws, one tiny seed held between the front paws. Not a guinea pig, not a mouse with a long thin tail, no cage, no wheel.'),
    ('animals-60', [f'{HD}/animals-11/raw/generated.png', f'{HD}/animals-02/raw/generated.png'],
     '北极熊。北极熊的毛白白的，住在很冷的地方。', 'Polar bear. A polar bear has white fur and lives where it is very cold.',
     'One calm polar bear standing in side view on a small soft patch of pale blue-white ice: a large rounded body of creamy white fur with a few gentle painted shadow lines, a long pale muzzle, tiny dark eyes and nose, four sturdy legs with softly rounded paws. Not a panda, not a brown bear, no snowflakes falling, no sky, no igloo.'),
]

PROMPT = """{style}

CONCEPTUAL SOURCE (meaning only; do not write, letter, number, label or caption any of this in the image):
Chinese: {chinese}
English: {english}

SUBJECT: {subject}

{composition}"""


def main():
    items = []
    for identifier, references, chinese, english, subject in CARDS:
        text = PROMPT.format(style=STYLE, chinese=chinese, english=english,
                             subject=subject, composition=COMPOSITION)
        folder = HERE / identifier
        folder.mkdir(parents=True, exist_ok=True)
        prompt = folder / 'prompt.txt'
        if prompt.exists():
            print(f'保留已有 prompt：{identifier}')
        else:
            prompt.write_text(text + '\n')
        for reference in references:
            if not (ROOT / reference).is_file():
                raise SystemExit(f'缺少参考图：{reference}')
        items.append({'id': identifier, 'category': identifier.split('-')[0],
                      'subject': subject.split(',')[0].split('.')[0].lower(), 'references': references})
    (HERE / 'manifest.json').write_text(json.dumps(items, indent=2, ensure_ascii=False) + '\n')
    print(f'准备完成：{len(items)} 张卡，manifest 与 prompt 已就位。')


if __name__ == '__main__':
    main()
