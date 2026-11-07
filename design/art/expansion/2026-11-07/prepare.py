import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
HD = 'design/art/hd/2026-10-10'
EX = 'design/art/expansion/2026-10-14'
AD = 'design/art/expansion/2026-10-23'

STYLE = """Use case: illustration-story, toddler picture-learning website for children aged 1.5-3 with an adult.
Create ONE finished native 2048x1792 illustration, not a grid, contact sheet, collage, mockup or interface.

The attached native PNG image(s) are STYLE references only. Match their paint, paper grain, rounded proportions, palette and cream paper. Do not copy the old subject, pose, identity, toy-scale context or composition.

STYLE: charming flat gouache with layered painted-paper shapes, rounded child-friendly forms, tiny dark dot eyes and gentle peach blush only where a face naturally suits, fine organic painted-paper texture, and rich but restrained mint, ochre, coral and sky accents."""

COMPOSITION = """COMPOSITION: one complete centered subject or activity vignette, its longest dimension occupying approximately 82 percent of the canvas, with comfortable clean cream margin around every part. Flat uniform warm cream background, exact sRGB #faf6e8 right to every edge; no vignette, gradient, frame, corner shapes, colored letterbox or cast shadow. No text, letters, numbers, signage words, watermark, grid or extra panels. No 3D, photorealism or heavy outlines."""

# id, references, chinese, english meaning, english subject
CARDS = [
    ('animals-36', [f'{EX}/animals-21/raw/generated.png', f'{AD}/animals-33/raw/generated.png'],
     '奶牛。奶牛身上有黑白花纹，会给我们牛奶。', 'Cow. A cow has black and white patches and gives us milk.',
     'One calm dairy cow standing in side view: a rounded cream-white body with a few large soft black painted patches, a gentle face with tiny dark dot eyes and a small pink muzzle, two short blunt horns, four sturdy legs with dark hooves and a thin tail with a tuft. Not a bull with big horns, not a calf lying down, no barn, no grass, no milk pail.'),
    ('animals-37', [f'{AD}/animals-34/raw/generated.png', f'{AD}/animals-33/raw/generated.png'],
     '马。马跑起来飞快，鬃毛在风里飘。', 'Horse. A horse runs very fast, and its mane flows in the wind.',
     'One friendly small horse standing in side view, a warm chestnut body with a soft cream muzzle, a flowing ochre mane and a long tail both painted as gentle separate strands, four slender legs, small upright ears and tiny dark dot eyes. Not a pony with a saddle, no rider, no fence, no grass in the mouth.'),
    ('animals-38', [f'{EX}/animals-22/raw/generated.png', f'{HD}/animals-17/raw/generated.png'],
     '公鸡。公鸡头上有红红的鸡冠，早上会大声叫。', 'Rooster. A rooster has a red comb and calls out loudly in the morning.',
     'One rooster standing upright in side view with its beak open in a cheerful crow: a rounded cream and ochre body, a warm coral-red comb and wattle, an ochre tail of three soft curved feathers and two thin yellow legs. Not a hen, not a chick, no beak open toward the viewer, no sun, no fence.'),
    ('animals-39', [f'{AD}/animals-33/raw/generated.png', f'{EX}/animals-21/raw/generated.png'],
     '山羊。山羊头上有弯弯的角，喜欢啃青草。', 'Goat. A goat has curved horns and likes to nibble on grass.',
     'One small goat standing in side view: a soft cream body, a short pale beard, two gently curved ochre horns sweeping back, small floppy ears, four slim legs and tiny dark dot eyes. Not a sheep with round wool, not an ibex with long horns, no rocky cliff, no grass, no bell on the neck.'),
    ('animals-40', [f'{HD}/animals-15/raw/generated.png', f'{HD}/animals-04/raw/generated.png'],
     '犀牛。犀牛鼻子上长着一只角，皮厚厚的。', 'Rhino. A rhino has one horn on its nose and thick skin.',
     'One sturdy rhino in calm side view: a broad rounded grey-mauve body with soft painted skin folds, one short curved horn on the nose, small ears, tiny dark dot eyes and four short thick legs. Not a hippo without a horn, not a triceratops with three horns, not charging, no savanna, no dust.'),
    ('animals-41', [f'{HD}/animals-05/raw/generated.png', f'{HD}/animals-04/raw/generated.png'],
     '骆驼。骆驼背上有驼峰，能在沙漠里走很久。', 'Camel. A camel has a hump on its back and can walk a long way in the desert.',
     'One calm camel in side view: a warm sand-ochre body with one soft rounded hump on its back, a long gentle neck, a rounded muzzle, small ears, tiny dark dot eyes, four long legs with wide soft feet. Not a two-humped Bactrian camel, not a rider or saddle, no desert dunes, no baggage.'),
    ('animals-42', [f'{HD}/animals-03/raw/generated.png', f'{AD}/animals-34/raw/generated.png'],
     '袋鼠。袋鼠用强壮的后腿跳着走，妈妈肚子上有口袋。', 'Kangaroo. A kangaroo hops on strong back legs, and the mother has a pouch on her tummy.',
     'One gentle kangaroo standing in side view: a warm ochre-brown body, two long strong back legs with big soft feet, two small front paws held close, a thick tail resting on the ground, tall ears and tiny dark dot eyes, with one small rounded pouch clearly visible on the tummy. The pouch is empty. Not a wallaby mid-jump, no joey, no grass, no fence.'),
    ('animals-43', [f'{HD}/animals-08/raw/generated.png', f'{HD}/animals-10/raw/generated.png'],
     '豹子。豹子身上一圈圈的花斑，跑得特别快。', 'Leopard. A leopard has spotted rings on its coat and runs very fast.',
     'One calm leopard standing in side view: a warm ochre coat covered with small painted ring-shaped rosette spots, a rounded head with small ears, tiny dark dot eyes, a long softly curved tail with lighter tip. Not a tiger with stripes, not a cheetah with solid dots, not snarling, no jungle, no tree branch.'),
    ('animals-44', [f'{HD}/animals-19/raw/generated.png', f'{HD}/animals-15/raw/generated.png'],
     '鲸鱼。鲸鱼住在海里，浮上来时会喷出水柱。', 'Whale. A whale lives in the sea and spouts water when it comes up.',
     'One gentle blue whale in calm side view: a large rounded sky-blue body tapering into a soft horizontal tail fluke, one small fin, a wide friendly mouth line, one tiny dark dot eye, and one soft painted spout of three small droplets rising from the top of the head. No waves, no ocean, no bubbles, no other animals.'),
    ('animals-45', [f'{HD}/animals-19/raw/generated.png', f'{AD}/animals-30/raw/generated.png'],
     '海豹。海豹圆滚滚的，在水里游得又稳又快。', 'Seal. A seal is round and plump, swimming steady and fast.',
     'One round plump seal in side view, resting on its belly: a smooth grey-blue body with a lighter cream belly, two small front flippers, a small forked tail flipper, a rounded whiskered face with tiny dark dot eyes. Not a sea lion with ear flaps, not a walrus with tusks, no water, no rock, no ball on the nose.'),
    ('animals-46', [f'{AD}/animals-32/raw/generated.png', f'{HD}/animals-20/raw/generated.png'],
     '章鱼。章鱼有八条软软的腕，会喷墨躲起来。', 'Octopus. An octopus has eight soft arms and squirts ink to hide.',
     'One friendly octopus seen from the front: a rounded coral-orange head with two tiny dark dot eyes and a gentle smile, and exactly eight soft curling arms fanned out below it. Count the arms carefully: eight, no more, no fewer. No ink cloud, no water, no rocks, no fish.'),
    ('animals-47', [f'{AD}/animals-32/raw/generated.png', f'{AD}/animals-30/raw/generated.png'],
     '海星。海星有五条角，像一颗落在海边的小星星。', 'Starfish. A starfish has five arms, like a little star resting by the sea.',
     'One single starfish lying flat and centered: exactly five plump rounded arms of even length radiating from a soft middle, warm coral-orange with a few tiny pale painted dots along each arm, no face. Count the arms carefully: five. Not a brittle star with thin wavy arms, no seashells, no sand, no water.'),
    ('animals-48', [f'{EX}/animals-29/raw/generated.png', f'{EX}/animals-28/raw/generated.png'],
     '蜘蛛。蜘蛛有八条腿，会用细细的丝结网。', 'Spider. A spider has eight legs and spins a web with fine silk.',
     'One friendly round spider seen from the top: a soft dark-plum rounded body with a lighter cream marking, two tiny dark dot eyes and exactly eight thin bent legs, four on each side. Count the legs carefully: eight. A few short pale silk threads trail from its back. Not an insect with six legs, no big web filling the canvas, no fly caught in it.'),
    ('animals-49', [f'{EX}/animals-27/raw/generated.png', f'{EX}/animals-28/raw/generated.png'],
     '萤火虫。萤火虫的尾巴会发光，像提着一盏小灯。', "Firefly. A firefly's tail glows, like carrying a little lamp.",
     'One friendly firefly in side view: a small rounded dark-teal body, two soft folded wings, six little legs, tiny dark dot eyes and a gently glowing warm-yellow tip at the end of its tail painted as a soft even halo. Exactly six legs. Not a bee with stripes, not a lightning bug swarm, no night sky, no jar, no grass.'),
    ('animals-50', [f'{EX}/animals-27/raw/generated.png', f'{EX}/animals-24/raw/generated.png'],
     '蜻蜓。蜻蜓有四片薄薄的翅膀，飞起来轻轻的。', 'Dragonfly. A dragonfly has four thin wings and flies very lightly.',
     'One gentle dragonfly seen from above, hovering: a long slim mint-green body, a rounded head with two big calm eyes, and exactly four long translucent pale wings with fine painted veins, two on each side, spread wide. Count the wings: four. Not a butterfly with broad colored wings, no pond, no reeds, no other insects.'),
    ('fruits-27', [f'{EX}/fruits-21/raw/generated.png', f'{HD}/fruits-05/raw/generated.png'],
     '杨桃。杨桃切开是五角星的样子。', 'Starfruit. A starfruit is shaped like a five-point star when sliced.',
     'One whole starfruit standing in the middle and one single slice beside it in front: the whole fruit is a pale yellow-green ribbed oval with five soft ridges, and the slice is a clear five-pointed star with a thin pale core at its center. Not a star cookie or toy, no leaf, no plate, no knife.'),
    ('fruits-28', [f'{EX}/fruits-21/raw/generated.png', f'{EX}/fruits-23/raw/generated.png'],
     '枇杷。枇杷黄黄的，圆圆的，剥开皮就能吃。', 'Loquat. A loquat is yellow and round; just peel it and eat.',
     'Three loquats resting together in a small loose group: two whole round fruits in warm golden yellow with a soft peachy blush, each with a tiny short brown stem and a small dry star-shaped calyx at the end, and one fruit partly peeled with the pale golden flesh showing. Not an apricot, not an orange, no leaves, no plate.'),
    ('fruits-29', [f'{HD}/fruits-13/raw/generated.png', f'{HD}/fruits-04/raw/generated.png'],
     '桑葚。桑葚一颗颗紫黑色，吃了舌头会变紫。', 'Mulberry. Mulberries are tiny and dark purple, and they turn your tongue purple.',
     'Four or five mulberries resting in a small loose cluster: each is an elongated little fruit built of many tiny rounded deep plum-purple beads, with one short pale green stem on top. Not a blackberry, not a grape, no leaf, no basket, no stained hands.'),
    ('fruits-30', [f'{HD}/fruits-12/raw/generated.png', f'{HD}/fruits-01/raw/generated.png'],
     '山楂。山楂红红的，圆圆的，酸得眯起眼睛。', 'Hawthorn. A hawthorn is small and red, and it tastes so sour you squint.',
     'Five small round hawthorn berries gathered in a loose cluster: each is a bright coral-red little apple-shaped fruit with a tiny dry blossom end and a short green stem. Not a cherry with a long thin stem, not a cranberry, no leaves, no candy coating, no sugar.'),
    ('fruits-31', [f'{EX}/fruits-24/raw/generated.png', f'{HD}/fruits-17/raw/generated.png'],
     '红枣。红枣红红的，皱皱的，晒干后甜甜的。', 'Red date. A red date is red and wrinkly, and it tastes sweet when dried.',
     'Four dried red dates resting together: each is a small oval deep-russet fruit with soft painted wrinkled skin lines running lengthwise and a tiny stem scar. Not a fresh jujube that is green and smooth, not a raisin, not a plum, no bowl, no plate.'),
    ('fruits-32', [f'{EX}/fruits-25/raw/generated.png', f'{HD}/fruits-08/raw/generated.png'],
     '无花果。无花果软软的，里面有好多小小的籽。', 'Fig. A fig is soft, with lots of tiny seeds inside.',
     'One whole fig resting beside one half fig cut open: the whole fruit is a soft violet-purple teardrop with a short pale stem, and the cut face shows a rounded rose-pink interior filled with many tiny pale seeds arranged toward the center. Not a fig leaf, not a wasp, not a dried fig, no plate.'),
    ('fruits-33', [f'{HD}/fruits-10/raw/generated.png', f'{HD}/fruits-20/raw/generated.png'],
     '木瓜。木瓜长长圆圆的，果肉橙橙色，很软。', 'Papaya. A papaya is long and round with soft orange flesh.',
     'One whole papaya lying in side view beside one long half cut open: the whole fruit is an elongated pale yellow-green oval with a slight curve, and the cut half shows smooth salmon-orange flesh with a hollow row of small shiny dark seeds down the middle. Not a mango, not a squash, no plate, no spoon.'),
    ('fruits-34', [f'{HD}/fruits-07/raw/generated.png', f'{HD}/fruits-16/raw/generated.png'],
     '牛油果。牛油果切开，中间有一颗圆圆的大核。', 'Avocado. Cut an avocado open and you find one big round pit.',
     'One whole avocado and one half avocado in front of it: the whole fruit is a dark-green bumpy pear shape, and the half shows pale yellow-green soft flesh around one large round warm-brown pit sitting in the center. Not a pear with a stem, not sliced into pieces, no toast, no plate.'),
    ('fruits-35', [f'{HD}/fruits-14/raw/generated.png', f'{HD}/fruits-19/raw/generated.png'],
     '百香果。百香果的皮有点硬，里面是香香的籽。', 'Passion fruit. A passion fruit has firm skin, with fragrant seeds inside.',
     'One whole passion fruit beside one half cut open: the whole fruit is a deep plum-purple round shell with a slightly firm glossy surface, and the half shows a pale cream rim around golden-yellow juicy pulp full of tiny dark seeds. Not a kiwi, not a pomegranate, no spoon, no drink, no juice glass.'),
    ('fruits-36', [f'{HD}/fruits-01/raw/generated.png', f'{HD}/fruits-07/raw/generated.png'],
     '番石榴。番石榴咬下去脆脆的，有特别的香味。', 'Guava. A guava is crunchy to bite and has a special fragrance.',
     'One whole guava beside one half cut open: the whole fruit is a pale yellow-green rounded oval with a slightly uneven painted skin, and the cut half shows crisp cream-white flesh with a soft pink blush near the rim and a small cluster of tiny pale seeds in the middle. Not a pear, not an apple, no leaf, no plate.'),
    ('fruits-37', [f'{HD}/fruits-09/raw/generated.png', f'{EX}/fruits-25/raw/generated.png'],
     '榴莲。榴莲外面长满尖刺，要大人帮忙打开。', 'Durian. Durian is covered in sharp spikes; a grown-up helps open it.',
     'One whole durian resting alone: a large rounded pale green-ochre husk entirely covered with many short soft rounded spikes, and one narrow opened seam showing pale golden flesh inside. The spikes are painted short and blunt, never sharp or dangerous. Not a jackfruit, not cut into many pieces, no knife, no plate, no people.'),
    ('fruits-38', [f'{HD}/fruits-09/raw/generated.png', f'{HD}/fruits-16/raw/generated.png'],
     '菠萝蜜。菠萝蜜是最大的水果之一，果肉一瓣一瓣。', 'Jackfruit. Jackfruit is one of the biggest fruits, with flesh in segments.',
     'One large whole jackfruit beside a small opened section: the whole fruit is a big pale yellow-green oval covered with many tiny rounded painted bumps, and the opened part shows three or four golden-yellow soft segments nestled together. Not a durian with long spikes, not a pineapple with a leaf crown, no plate, no knife.'),
    ('fruits-39', [f'{HD}/fruits-06/raw/generated.png', f'{HD}/fruits-20/raw/generated.png'],
     '甜瓜。甜瓜外皮光滑，闻起来甜甜的。', 'Melon. A melon has smooth skin and smells sweet.',
     'One whole smooth melon resting alone: a rounded pale yellow-green fruit with a perfectly smooth unmarked skin, a soft blush of warm peach on one side and a small short pale stem scar. Not a netted cantaloupe, not a watermelon with stripes, not cut open, no leaf, no plate.'),
    ('fruits-40', [f'{HD}/fruits-02/raw/generated.png', f'{HD}/fruits-18/raw/generated.png'],
     '甘蔗。甘蔗像一根小棍子，里面的汁甜甜的。', 'Sugarcane. Sugarcane is like a little stick with sweet juice inside.',
     'Two short sugarcane pieces lying side by side: each is a thick straight pale ochre-green stalk with clearly painted smooth jointed segments and a few short soft leaf blades sprouting from one end. Not a bamboo cane, not a wooden stick, not a drink, no glass, no plate.'),
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
