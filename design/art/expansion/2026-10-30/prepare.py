"""Prepare prompts and the manifest for the 2026-10-30 category batch.

Writes only missing files. The three owner-reviewed samples already carry their
exact prompts, so this script never rewrites an existing prompt.txt.
"""

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]

SYMBOL_REFS = [
    'design/art/symbol-studies/2026-10-10-162535/numbers-1/raw/generated.png',
    'design/art/symbol-studies/2026-10-10-162535/letters-A/raw/generated.png',
]
PERSON_REFS = [
    'design/art/expansion/2026-10-14/places-01/raw/generated.png',
    'design/art/expansion/2026-10-14/places-07/raw/generated.png',
]

SYMBOL_HEAD = """Use case: scientific-educational, toddler picture-learning illustration, ages 1.5-3.
Create ONE finished illustration, not a sheet or interface mockup, at native 2048 x 1792.
The attached illustrations are STYLE references only: match their tactile gouache, colored-pencil grain, cut-paper shapes, warm friendly proportions and rich but gentle colors. Do not copy their composition, glyphs or subjects.
BACKGROUND: flat warm cream paper #faf6e8, uniform right to all four edges, no colored panel, vignette, horizon, frame, border, badge or cast shadow. Use delicate texture within painted shapes, not visual noise across the paper."""

PERSON_HEAD = """Use case: illustration-story, toddler picture-learning website for children aged 1.5-3 with an adult.
Create ONE finished native 2048x1792 illustration, not a grid, contact sheet, collage, mockup or interface.

Grown-ups match the warm painted-paper adult style from the attached references. Do not copy the reference scenes or their activities. Keep the scene simple and readable, with no signage words.

STYLE: charming flat gouache with layered painted-paper shapes, rounded child-friendly forms, tiny dark dot eyes and gentle peach blush only where a face naturally suits, fine organic painted-paper texture, and rich but restrained mint, ochre, coral and sky accents."""

PERSON_TAIL = """COMPOSITION: one complete centred figure, its longest dimension occupying approximately 82 percent of the canvas, with comfortable clean cream margin around every part. Flat uniform warm cream background, exact sRGB #faf6e8 right to every edge; no vignette, gradient, frame, corner shapes, colored letterbox or cast shadow. No text, letters, numbers, signage words, watermark, grid or extra panels. No 3D, photorealism or heavy outlines."""

SWATCH_DESIGN = """DESIGN: one very large instantly legible color swatch is the unmistakable hero. It is a single warm rounded-square patch of one solid hue, painted in expressive hand-painted gouache with visible but gentle brush direction and colored-pencil grain. The hue must stay unmistakably one color across the whole patch; do not blend into a second hue, do not add stripes, dots, gradients or pattern, and keep the patch's silhouette complete and simple. The swatch fills approximately 72 percent of image height and sits just left of centre, leaving 8-10 percent clear outer margin. Illustration should feel close and generous, not a small subject floating in empty space."""

SHAPE_DESIGN = """DESIGN: one very large instantly legible geometric shape is the unmistakable hero. A single flat front-view shape with a clean closed outline and one solid warm gouache fill, painted with visible but gentle brush direction and colored-pencil grain. Keep the silhouette crisp and unmistakable at thumbnail size: no perspective, no distortion, no rotation, no overlapping second shape, no partial hatching across the contour. The shape fills approximately 72 percent of image height and sits just left of centre, leaving 8-10 percent clear outer margin. Illustration should feel close and generous, not a small subject floating in empty space."""

HUSH = """Nothing else on the paper: no stickers, stars, confetti, banners, captions, labels, chalk marks, paint splashes outside the shapes, or extraneous objects. No face, eyes, arms or legs on the {hero}. Accurate {skill} identity is essential; a child must read one clear {skill} at a glance."""

# id, chinese name, pinyin, english, chinese description, english description, hue, hook, extra
COLORS = [
    ('colors-01', '红色', 'hóng sè', 'Red', '红色像小苹果一样鲜艳。', 'Red is bright like a little apple.',
     'vivid warm apple red, the red of a ripe apple skin rather than orange or pink',
     'red apple with a short brown stem and one green leaf', ''),
    ('colors-02', '黄色', 'huáng sè', 'Yellow', '黄色像小鸭子一样温暖。', 'Yellow is warm like a little duckling.',
     'warm sunny buttercup yellow, a clear egg-yolk yellow not pale cream and not orange',
     'small yellow duckling with a tiny orange bill', ''),
    ('colors-03', '蓝色', 'lán sè', 'Blue', '蓝色像天空和大海。', 'Blue is the color of the sky and the sea.',
     'clear day-sky blue, a true mid blue that is neither navy nor turquoise',
     'small blue fish with a gently forked tail', ''),
    ('colors-04', '绿色', 'lǜ sè', 'Green', '绿色像小草和树叶。', 'Green is the color of grass and leaves.',
     'fresh leafy green, a living grass green rather than olive or mint',
     'single fresh green leaf with a short stem', ''),
    ('colors-05', '橙色', 'chéng sè', 'Orange', '橙色像甜甜的橙子。', 'Orange is the color of a sweet orange.',
     'bright pumpkin orange, clearly orange rather than red or yellow',
     'round orange fruit with one small green leaf', ''),
    ('colors-06', '紫色', 'zǐ sè', 'Purple', '紫色像一串小葡萄。', 'Purple is like a little bunch of grapes.',
     'soft grape purple, a clear violet that is neither pink nor blue',
     'small bunch of purple grapes with a tiny green stem', ''),
    ('colors-07', '粉色', 'fěn sè', 'Pink', '粉色像软软的花瓣。', 'Pink is soft like flower petals.',
     'gentle blossom pink, a soft warm pink clearly paler and pinker than red',
     'single small pink flower with a short green stem', ''),
    ('colors-08', '黑色', 'hēi sè', 'Black', '黑色像夜晚的天空。', 'Black is like the night sky.',
     'deep night black, a rich dark charcoal-black with soft painted light rather than pure digital #000000',
     'small black cat with white whiskers and round dot eyes', ''),
    ('colors-09', '白色', 'bái sè', 'White', '白色像棉花和雪花。', 'White is like cotton and snowflakes.',
     'clean soft paper white, a warm off-white that still reads as white beside the cream background',
     'single fluffy white cloud', 'outline'),
    ('colors-10', '棕色', 'zōng sè', 'Brown', '棕色像大树的树干。', 'Brown is like the trunk of a big tree.',
     'warm earth brown, a soft cocoa brown rather than grey or dark chocolate',
     'small brown bear cub with round ears', ''),
]

# id, chinese name, pinyin, english, chinese description, english description, geometry, hook
SHAPES = [
    ('shapes-01', '圆形', 'yuán xíng', 'Circle', '圆形像皮球一样圆滚滚。', 'A circle is round like a ball.',
     'A huge perfectly round disc in warm coral-red gouache, the outline a true circle with no flattening, oval squeeze or wobbly bumps; it must read as a circle even when very small on screen.',
     'small round striped toy ball about 24 percent of the disc diameter, fully separate from the disc, clearly a real toy ball rather than a second plain disc'),
    ('shapes-02', '正方形', 'zhèng fāng xíng', 'Square', '正方形四条边一样长。', 'A square has four sides the same length.',
     'A huge perfect square in warm ochre-yellow gouache, four equal straight sides and four square corners, standing flat and upright with no tilt or perspective.',
     'small square golden cracker about 24 percent of the square width, fully separate, clearly a real cracker rather than a second plain square'),
    ('shapes-03', '三角形', 'sān jiǎo xíng', 'Triangle', '三角形有三条边三个角。', 'A triangle has three sides and three corners.',
     'A huge equilateral triangle in soft leafy-green gouache, three equal straight sides with slightly rounded corners, one flat horizontal base and one clear apex pointing straight up.',
     'small triangular watermelon slice about 24 percent of the triangle height, fully separate, clearly a real fruit slice rather than a second plain triangle'),
    ('shapes-04', '长方形', 'cháng fāng xíng', 'Rectangle', '长方形有两组长边和短边。', 'A rectangle has two long sides and two short sides.',
     'A huge upright rectangle in warm sky-blue gouache, clearly twice as tall as it is wide, four straight sides and four square corners. It must never look like a square.',
     'small upright rectangular picture book about 24 percent of the rectangle height, fully separate, clearly a real book with a visible cover edge rather than a second plain rectangle'),
    ('shapes-05', '椭圆形', 'tuǒ yuán xíng', 'Oval', '椭圆形像鸡蛋一样。', 'An oval looks like an egg.',
     'A huge smooth vertical oval in warm rose-pink gouache, a continuous curve taller than it is wide, with no flat sides and no pointed ends. It must never look like a circle.',
     'single white egg about 24 percent of the oval height, fully separate, clearly a real eggshell with soft shading rather than a second plain oval'),
    ('shapes-06', '星形', 'xīng xíng', 'Star', '星形有五个尖尖的角。', 'A star has five pointed corners.',
     'A huge five-pointed star in warm golden-yellow gouache, five equal sharp points and five clear inner corners, one point straight up, symmetric and instantly readable as a star.',
     'small star-shaped biscuit about 24 percent of the star width, fully separate, clearly a baked biscuit with a painted crumb texture rather than a second plain star'),
    ('shapes-07', '心形', 'xīn xíng', 'Heart', '心形像一颗爱心。', 'A heart shape looks like a loving heart.',
     'A huge symmetric heart in warm coral-red gouache, a clean notch at the top centre and a soft point at the bottom, both lobes equal and rounded. It must read as a heart, not a leaf or a spade.',
     'small heart-shaped candy about 24 percent of the heart width, fully separate, clearly a wrapped sweet rather than a second plain heart'),
    ('shapes-08', '菱形', 'líng xíng', 'Diamond', '菱形像小风筝。', 'A diamond shape looks like a little kite.',
     'A huge upright diamond (rhombus) in soft teal-green gouache, four equal straight sides, one corner straight up and one straight down, clearly taller than it is wide. It must read as a diamond, not a tilted square.',
     'small diamond-shaped kite about 24 percent of the diamond height, fully separate, with a short visible tail string, clearly a real kite rather than a second plain diamond'),
]

# id, chinese name, pinyin, english, chinese description, english description, subject
FAMILY = [
    ('family-01', '妈妈', 'mā ma', 'Mom', '妈妈会抱抱我，也会陪我玩。', 'Mom gives hugs and plays with me.',
     'A warm half-length portrait of one kind adult woman, the mother, painted in the same gouache picture-book style as the reference grown-ups. She has soft dark hair, a calm smiling face, tiny dark dot eyes and gentle peach blush, and wears a simple comfortable coral or mustard top with a teal accent. Her arms are gently open in a welcoming hug gesture toward the viewer, one hand slightly raised. She is the single clear hero and must feel approachable and familiar to a toddler, never glamorous or photorealistic. No child in the image, so the mother alone reads unambiguously.'),
    ('family-02', '爸爸', 'bà ba', 'Dad', '爸爸把我举得高高的。', 'Dad lifts me up high.',
     'A warm half-length portrait of one friendly adult man, the father, in the same gouache picture-book style as the reference grown-ups. He has short dark hair, a broad calm smile, a rounded friendly face, tiny dark dot eyes and gentle peach blush, and wears a simple soft oat-coloured sweater with a teal collar. Both arms are lifted forward and slightly up in an encouraging lifting gesture, strong but gentle. He is the single clear hero, warm and safe rather than muscular or stern. No child in the image and no beard, glasses or hat.'),
    ('family-03', '爷爷', 'yé ye', 'Grandpa', '爷爷牵着我的手慢慢走。', 'Grandpa holds my hand and walks slowly with me.',
     'A warm half-length portrait of one gentle elderly man, the grandfather, in the same gouache picture-book style as the reference grown-ups. He has soft silvery-white hair, light smile lines, kind crinkled eyes with tiny dark pupils, gentle peach blush and a short neat white moustache. He wears a simple muted sage cardigan over a cream shirt. One arm reaches gently forward as if offering his hand. He is the single clear hero: clearly older and calmer than the father, never frail or sad. No child in the image and no glasses, cane or chair.'),
    ('family-04', '奶奶', 'nǎi nai', 'Grandma', '奶奶做的饭菜香香的。', 'Grandma\'s cooking smells yummy.',
     'A warm half-length portrait of one gentle elderly woman, the grandmother, in the same gouache picture-book style as the reference grown-ups. She has soft silvery hair gathered into a small low bun, light smile lines, kind eyes with tiny dark pupils, gentle peach blush and a warm closed smile. She wears a simple dusty-rose blouse with a soft cream apron tied at the waist, one hand resting lightly on the apron. She is the single clear hero: clearly older and calmer than the mother, never frail or sad. No child in the image and no glasses.'),
    ('family-05', '宝宝', 'bǎo bao', 'Baby', '宝宝小小的，大家都爱他。', 'The baby is little and everyone loves him.',
     'A warm full-body portrait of one small happy baby sitting upright, in the same gouache picture-book style as the reference cast. The baby has a soft round head with a few fine dark hairs, big calm dark dot eyes, plump cheeks with gentle peach blush, a toothless open smile, and wears a simple soft mint onesie with tiny cream socks. Both little hands reach forward contentedly. The baby is the single clear hero and must look like a baby, distinctly younger and plumper than the reference toddler. No adult, no child, no crib, no toys and no blanket.'),
    ('family-06', '哥哥', 'gē ge', 'Big brother', '哥哥牵着我的手，一起玩。', 'My big brother holds my hand and we play together.',
     'A warm half-length portrait of one friendly slightly older child, the big brother, in the same gouache picture-book style as the reference cast. He is a young boy with short dark hair, warm brown skin-free painted face, tiny dark dot eyes, gentle peach blush and a bright open smile, wearing a simple leaf-green t-shirt with cream stripes. One hand reaches forward as if offering to hold a smaller hand. He is the single clear hero: clearly a couple of years older than a toddler, upright and dependable, never adult. No adult in the image and no ball or toys.'),
    ('family-07', '姐姐', 'jiě jie', 'Big sister', '姐姐教我画画。', 'My big sister teaches me to draw.',
     'A warm half-length portrait of one friendly slightly older child, the big sister, in the same gouache picture-book style as the reference cast. She is a young girl with dark hair in two short pigtails tied with coral bands, tiny dark dot eyes, gentle peach blush and a gentle smile, wearing a simple sky-blue dress with a cream collar. She holds one chunky crayon upright in her hand as if showing how to draw. She is the single clear hero: clearly a couple of years older than a toddler, never adult. No adult in the image, no paper, no drawing and no other objects.'),
]


def symbol_prompt(subject, design, hero, skill):
    return '\n\n'.join([
        SYMBOL_HEAD,
        design,
        'Beside the ' + hero + ' place ONE small familiar concrete object described below, completely separate and fully visible. ' + HUSH.format(hero=hero, skill=skill),
        'SUBJECT AND COMPOSITION:\n' + subject,
    ]) + '\n'


def color_prompt(record):
    _, zh, _, en, _, _, hue, hook, extra = record
    outline = ''
    if extra == 'outline':
        outline = ' Because white would vanish on cream paper, give the patch one delicate warm-grey painted outline of even weight so its silhouette stays clearly visible; keep the interior clean white.'
    subject = (
        f'Color (verbatim): {zh} / {en.lower()}.\n'
        f'A huge rounded-square patch in {hue}.{outline} '
        f'To its lower right place exactly ONE {hook}, about 24 percent of the swatch height and fully separate from the patch. '
        f'The swatch must be seen first and the object second. Composition is centred as a whole. '
        f'Do not include any text, letters, digits, the words {en.lower()} or {zh}, color-name labels, rainbow strips, color wheels or multiple swatches.'
    )
    return symbol_prompt(subject, SWATCH_DESIGN, 'swatch', 'color')


def shape_prompt(record):
    _, zh, _, en, _, _, geometry, hook = record
    subject = (
        f'Shape (verbatim): {zh} / {en.lower()}.\n'
        f'{geometry} '
        f'To its lower right place exactly ONE {hook}. '
        f'The shape must be seen first and the object second. Composition is centred as a whole. '
        f'Do not include any text, letters, digits, the words {en.lower()} or {zh}, shape-name labels, dashed guide lines, dimension marks, other shapes, or a shape chart.'
    )
    return symbol_prompt(subject, SHAPE_DESIGN, 'shape', 'shape')


def person_prompt(record):
    _, zh, _, en, _, _, subject = record
    return '\n\n'.join([
        PERSON_HEAD,
        f'CONCEPTUAL SOURCE (meaning only; do not write, letter, number, label or caption any of this in the image):\nChinese: {record[4]}\nEnglish: {record[5]}',
        'Paint this new subject in the same picture-book family as the attached native illustrations.',
        'SUBJECT: ' + subject,
        PERSON_TAIL,
    ]) + '\n'


def build():
    cards = []
    for record in COLORS:
        identifier, zh, pinyin, en, description, english_description = record[:6]
        references = ['design/art/expansion/2026-10-30/colors-01/raw/generated.png'] + SYMBOL_REFS if identifier != 'colors-01' else SYMBOL_REFS
        cards.append({
            'id': identifier, 'category': 'colors', 'name': zh, 'pinyin': pinyin, 'english': en,
            'description': description, 'englishDescription': english_description,
            'subject': f'{zh}：{description}', 'references': references, 'prompt': color_prompt(record),
        })
    for record in SHAPES:
        identifier, zh, pinyin, en, description, english_description = record[:6]
        references = ['design/art/expansion/2026-10-30/shapes-01/raw/generated.png'] + SYMBOL_REFS if identifier != 'shapes-01' else SYMBOL_REFS
        cards.append({
            'id': identifier, 'category': 'shapes', 'name': zh, 'pinyin': pinyin, 'english': en,
            'description': description, 'englishDescription': english_description,
            'subject': f'{zh}：{description}', 'references': references, 'prompt': shape_prompt(record),
        })
    for record in FAMILY:
        identifier, zh, pinyin, en, description, english_description = record[:6]
        cards.append({
            'id': identifier, 'category': 'family', 'name': zh, 'pinyin': pinyin, 'english': en,
            'description': description, 'englishDescription': english_description,
            'subject': f'{zh}：{description}', 'references': PERSON_REFS, 'prompt': person_prompt(record),
        })

    manifest = []
    for card in cards:
        manifest.append({
            'id': card['id'], 'category': card['category'],
            'subject': card['subject'], 'references': card['references'],
        })
        folder = HERE / card['id']
        folder.mkdir(parents=True, exist_ok=True)
        prompt = folder / 'prompt.txt'
        if prompt.exists():
            if prompt.read_text() != card['prompt']:
                print(f'保留既有 prompt：{card["id"]}')
            continue
        prompt.write_text(card['prompt'])
    (HERE / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'manifest 已写入 {len(manifest)} 张卡片。')
    return cards


if __name__ == '__main__':
    build()
