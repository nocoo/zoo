import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
HD = 'design/art/hd/2026-10-10'
EX = 'design/art/expansion/2026-10-14'

STYLE = """Use case: illustration-story, toddler picture-learning website for children aged 1.5-3 with an adult.
Create ONE finished native 2048x1792 illustration, not a grid, contact sheet, collage, mockup or interface.

The attached native PNG image(s) are STYLE references only. Match their paint, paper grain, rounded proportions, palette and cream paper. Do not copy the old subject, pose, identity, toy-scale context or composition.

STYLE: charming flat gouache with layered painted-paper shapes, rounded child-friendly forms, tiny dark dot eyes and gentle peach blush only where a face naturally suits, fine organic painted-paper texture, and rich but restrained mint, ochre, coral and sky accents."""

COMPOSITION = """COMPOSITION: one complete centered subject or activity vignette, its longest dimension occupying approximately 82 percent of the canvas, with comfortable clean cream margin around every part. Flat uniform warm cream background, exact sRGB #faf6e8 right to every edge; no vignette, gradient, frame, corner shapes, colored letterbox or cast shadow. No text, letters, numbers, signage words, watermark, grid or extra panels. No 3D, photorealism or heavy outlines."""

# id, references, chinese, english meaning, english subject
CARDS = [
    ('animals-30', [f'{HD}/animals-19/raw/generated.png', f'{HD}/animals-20/raw/generated.png'],
     '小鱼。小鱼在水里游，尾巴一摆一摆。', 'Fish. A little fish swims in the water and wags its tail.',
     'One small fish. A single friendly little fish in calm side view: rounded soft body, one gentle eye, small rounded fins, a softly forked tail and a few simple painted scales. Freshwater pet fish, not a whale, shark, dolphin or shellfish. One complete animal, no water waves, bubbles, plants or scenery behind it.'),
    ('animals-31', [f'{HD}/animals-20/raw/generated.png', f'{EX}/animals-25/raw/generated.png'],
     '青蛙。青蛙蹲在荷叶上，跳起来又远又稳。', 'Frog. The frog sits on a lily pad and jumps far and steady.',
     'One small green frog sitting calmly on a single round lily pad, four soft webbed feet, tiny dark dot eyes and a gentle smile. Not a toad, not a lizard, not a tadpole. The lily pad is part of the subject; no water, no other plants.'),
    ('animals-32', [f'{HD}/animals-20/raw/generated.png', f'{HD}/animals-19/raw/generated.png'],
     '螃蟹。螃蟹横着走路，举着两只大钳子。', 'Crab. The crab walks sideways and holds up two big claws.',
     'One small round red-orange crab seen from the front, two friendly eyes on short stalks, two rounded claws held up, six little legs, gentle smile. Not a lobster, not a shrimp, not a hermit crab in a shell. Nothing else around it.'),
    ('animals-33', [f'{EX}/animals-21/raw/generated.png', f'{EX}/animals-23/raw/generated.png'],
     '绵羊。绵羊的毛卷卷的，像一朵白云。', 'Sheep. The sheep has curly wool like a little cloud.',
     'One fluffy white sheep standing quietly in side view, its fleece painted as soft rounded cloud-like curls, a small dark face, short dark legs and tiny dot eyes. Not a goat, not a lamb asleep, no farm scenery.'),
    ('animals-34', [f'{EX}/animals-21/raw/generated.png', f'{HD}/animals-05/raw/generated.png'],
     '小鹿。小鹿头上长着小角，跑起来很轻快。', 'Deer. The little deer has small antlers and runs lightly.',
     'One gentle young deer standing in side view, slender legs, two small soft antlers, warm brown coat with a few pale painted spots, tiny dark eyes, small tail. Not a reindeer with big antlers, not a moose, no forest behind it.'),
    ('animals-35', [f'{HD}/animals-20/raw/generated.png', f'{EX}/animals-29/raw/generated.png'],
     '刺猬。刺猬背上长满小刺，遇到危险就缩成一团。', 'Hedgehog. A hedgehog has little spines on its back and rolls up when it feels unsafe.',
     'One small round hedgehog in side view, its rounded back covered with short soft painted spines, a tiny pointed snout, small dark eyes, four tiny feet and a gentle face. Not a porcupine, not a sea urchin, not curled into a ball.'),
    ('vegetables-10', [f'{EX}/vegetables-08/raw/generated.png', f'{EX}/vegetables-09/raw/generated.png'],
     '蘑菇。蘑菇像一把小伞，有圆圆的伞盖。', 'Mushroom. A mushroom looks like a little umbrella with a round cap.',
     'One single mushroom standing upright: a rounded coral-red cap with a few pale spots and a short thick cream stem. Not a cluster, not a toadstool with insects, no grass, no basket.'),
    ('vegetables-11', [f'{EX}/vegetables-02/raw/generated.png', f'{EX}/vegetables-09/raw/generated.png'],
     '豆角。豆角长长的，里面有小小的豆子。', 'Green beans are long and have small beans inside.',
     'Three long slender green beans lying together in a small tidy bundle, each showing a few soft painted bumps where the little beans sit inside. Not a pea pod split open, no plate, no basket, nothing else.'),
    ('vegetables-12', [f'{EX}/vegetables-07/raw/generated.png', f'{EX}/vegetables-03/raw/generated.png'],
     '菠菜。菠菜的叶子绿绿的，煮熟以后软软的。', 'Spinach has green leaves and turns soft when cooked.',
     'One small bunch of fresh spinach leaves gathered like a little bouquet: rounded soft green blades with slightly wavy edges and short pale stems tied together at the base. Not a cabbage, not lettuce, no plate.'),
    ('vegetables-13', [f'{EX}/vegetables-04/raw/generated.png', f'{EX}/vegetables-01/raw/generated.png'],
     '洋葱。洋葱一层一层包着，切开时有点辣眼睛。', 'An onion has layer after layer, and cutting it can make our eyes water.',
     'One whole onion with a rounded bulb, layered pale golden and rose skin with a few fine painted lines, a small tuft of dry stem on top. Not a garlic bulb, not sliced, not peeled open.'),
    ('food-11', [f'{EX}/food-03/raw/generated.png', f'{EX}/food-01/raw/generated.png'],
     '肉。肉煮熟了香香的，可以撕成小块。', 'Cooked meat smells good and can be torn into small pieces.',
     'One small cooked piece of tender meat with a soft glossy browned surface and a few gentle painted texture lines, resting alone. Not a bone, not a steak with sauce, no plate, no cutlery.'),
    ('food-12', [f'{EX}/food-03/raw/generated.png', f'{EX}/food-07/raw/generated.png'],
     '鱼肉。鱼肉软软的，吃之前大人会帮我们把刺挑出来。', 'Fish is soft, and a grown-up takes out the bones before we eat.',
     'One cooked boneless fish fillet, pale cream inside and lightly golden on top, with soft flaky painted layers. Explicitly no bones, no fish head, no plate, no lemon.'),
    ('food-13', [f'{EX}/food-10/raw/generated.png', f'{EX}/food-09/raw/generated.png'],
     '汤。汤盛在碗里，喝起来暖暖的。', 'Soup is served in a bowl and feels warm to drink.',
     'One simple shallow cream bowl filled with warm golden soup and a few small soft floating pieces of vegetable, no steam clouds. The bowl is part of the subject. Not a pot, not a spoon, nothing else.'),
    ('food-14', [f'{EX}/food-06/raw/generated.png', f'{EX}/food-08/raw/generated.png'],
     '饼干。饼干小小的，咬一口嘎吱响。', 'A cracker is small and crunches when we bite it.',
     'Two round golden crackers, one whole and one broken in half, with tiny pale holes across the surface and gently curled edges. Not a cookie with icing, not a sandwich, no plate.'),
    ('food-15', [f'{EX}/food-06/raw/generated.png', f'{EX}/food-03/raw/generated.png'],
     '蛋糕。蛋糕软软的，上面抹着甜甜的奶油。', 'Cake is soft and topped with sweet cream.',
     'One small round cake with a soft cream-colored top and a gentle swirl of cream on the center, a pale golden sponge side. Not a layer cake with candles, not a slice, no plate, no fork.'),
    ('food-16', [f'{EX}/food-05/raw/generated.png', f'{EX}/food-08/raw/generated.png'],
     '糖果。糖果甜甜的，吃完要记得刷牙。', 'Candy is sweet, and we brush our teeth after eating it.',
     'Two wrapped candies side by side, one soft rose and one warm yellow, each with a rounded center and twisted wrapper ends painted as little folded triangles. Not a lollipop, not a jar, not a pile of candy.'),
    ('objects-32', [f'{HD}/objects-13/raw/generated.png', f'{HD}/objects-14/raw/generated.png'],
     '气球。气球鼓鼓的，一松手就往天上飞。', 'A balloon is puffy and flies up when we let go.',
     'One round inflated balloon in soft coral red, glossy painted highlight, a small tied knot at the bottom and a short curly string hanging down. Not a cluster of balloons, not a party scene, no faces.'),
    ('objects-33', [f'{HD}/objects-16/raw/generated.png', f'{HD}/objects-09/raw/generated.png'],
     '风筝。风筝有一根长长的线，有风的时候能飞很高。', 'A kite has a long string and flies high when it is windy.',
     'One diamond-shaped kite with a simple two-tone painted sail, a light cross frame showing through, and a short tail of three small painted bows. Shown flat and complete. Not a bird shape, no sky, no clouds.'),
    ('objects-34', [f'{HD}/objects-05/raw/generated.png', f'{HD}/objects-16/raw/generated.png'],
     '蜡笔。蜡笔能画出彩色的线，盖好笔帽不容易干。', 'Crayons draw colorful lines, and putting the caps back keeps them from drying out.',
     'Three crayons of different colors lying side by side in a small fan, each with a rounded paper wrapper band and a soft waxy tip. Not pencils, not markers, no paper or drawing beneath them.'),
    ('objects-35', [f'{HD}/objects-20/raw/generated.png', f'{HD}/objects-02/raw/generated.png'],
     '钥匙。钥匙插进锁孔一转，门就开了。', 'A key goes into the lock and turns to open the door.',
     'One simple metal key seen flat: a rounded bow with a small hole, a short shaft and two square teeth. Warm brass tone with soft painted highlight. Not a key ring with many keys, no lock, no door.'),
    ('objects-36', [f'{HD}/objects-19/raw/generated.png', f'{HD}/objects-06/raw/generated.png'],
     '枕头。枕头软软的，睡觉的时候垫在头下面。', 'A pillow is soft and goes under our head when we sleep.',
     'One plump pillow with rounded corners and a gentle dent in the middle, soft cream fabric with a few fine painted fold lines. Not a bed, not a blanket, not a cushion with a pattern.'),
    ('objects-37', [f'{EX}/objects-25/raw/generated.png', f'{HD}/objects-18/raw/generated.png'],
     '扫把。扫把能把地上的碎屑扫到一起。', 'A broom sweeps the crumbs on the floor into a pile.',
     'One simple broom leaning slightly: a long warm wooden handle and a fan-shaped head of soft straw bristles bound with a painted band. Not a mop, not a dustpan, no floor, no dust.'),
    ('transport-11', [f'{EX}/transport-08/raw/generated.png', f'{EX}/transport-01/raw/generated.png'],
     '警车。警车会闪灯，提醒大家让一让。', 'A police car flashes its lights to remind everyone to make way.',
     'One small friendly police car in three-quarter view, white body with blue side panels, a low light bar on the roof, two round headlights and four round wheels. Absolutely no letters, numbers, badges or words on the doors or roof. No road, no officers.'),
    ('transport-12', [f'{EX}/transport-03/raw/generated.png', f'{EX}/transport-01/raw/generated.png'],
     '摩托车。摩托车有两个轮子，跑起来声音很响。', 'A motorcycle has two wheels and sounds loud when it goes.',
     'One simple motorcycle standing in side view: two round wheels, a small rounded seat, a simple handlebar, a chunky painted engine block and a short exhaust. No rider, no road, no helmet.'),
    ('transport-13', [f'{EX}/transport-08/raw/generated.png', f'{EX}/transport-02/raw/generated.png'],
     '洒水车。洒水车一边开一边洒水，把路面冲干净。', 'A water truck sprays water as it drives and washes the road.',
     'One water truck in side view with a rounded cylindrical tank on the back, a small cab in front, four wheels and a short spray nozzle at the rear with a few soft painted droplets falling below it. No letters, no road, no driver.'),
    ('transport-14', [f'{EX}/transport-02/raw/generated.png', f'{EX}/transport-10/raw/generated.png'],
     '垃圾车。垃圾车把垃圾收走，让街道保持干净。', 'A garbage truck takes the rubbish away and keeps the street clean.',
     'One garbage truck in side view with a boxy cabin and a rounded rear loader body, four wheels and a simple side rail. No letters, no numbers, no rubbish bags scattered, no road.'),
    ('transport-15', [f'{EX}/transport-06/raw/generated.png', f'{EX}/transport-07/raw/generated.png'],
     '热气球。热气球鼓得大大的，慢慢升上天空。', 'A hot-air balloon is big and round, and it rises slowly into the sky.',
     'One hot-air balloon: a large rounded striped envelope with soft vertical panels of coral, ochre and cream, a small woven basket hanging below on four thin painted ropes. No people in the basket, no sky, no clouds.'),
    ('places-09', [f'{EX}/places-01/raw/generated.png', f'{EX}/places-08/raw/generated.png'],
     '动物园。动物园里有好多动物，要隔着栏杆看。', 'At the zoo we can see many animals from behind the railing.',
     'A small zoo vignette: a low rounded wooden fence with three posts in front, a soft green painted hill and two small trees behind it, and a simple stone path between them. No animals, no signs, no letters, no visitors.'),
    ('places-10', [f'{EX}/weather-24/raw/generated.png', f'{EX}/weather-21/raw/generated.png'],
     '海边。海边有沙子和小浪花，可以光脚踩水。', 'At the seaside there is sand and gentle waves, and we can paddle barefoot.',
     'A gentle seaside vignette: warm sand across the lower part, two soft blue wave crests of pale foam, and two small painted shells resting on the sand. No people, no boats, no sky or sun.'),
    ('places-11', [f'{EX}/places-02/raw/generated.png', f'{EX}/places-07/raw/generated.png'],
     '餐厅。餐厅里可以坐下来吃饭，服务员会端来饭菜。', 'In a restaurant we sit down to eat and the waiter brings the food.',
     'A simple restaurant vignette: a round table with a soft cream cloth, one small bowl and a pair of chopsticks on it, and one small chair beside the table. No people, no menus, no letters, no food other than the bowl.'),
    ('places-12', [f'{EX}/places-04/raw/generated.png', f'{EX}/places-02/raw/generated.png'],
     '理发店。理发店可以剪头发，剪刀咔嚓咔嚓响。', 'At the hair salon we get a haircut, and the scissors go snip snip.',
     'A simple hair salon vignette: one salon chair with a rounded back, a small round mirror on the wall behind it, and a narrow shelf with two plain bottles. No people, no scissors in use, no labels or letters on the bottles.'),
    ('weather-26', [f'{EX}/weather-25/raw/generated.png', f'{HD}/weather-01/raw/generated.png'],
     '春天。春天花开了，小草从土里钻出来。', 'In spring the flowers open and the grass comes up.',
     'A spring vignette: three soft pink blossoms with pale yellow centers on short green stems, a small patch of fresh green grass and two tiny new sprouts. No trees, no butterfly, no sky.'),
    ('weather-27', [f'{EX}/weather-25/raw/generated.png', f'{HD}/weather-01/raw/generated.png'],
     '夏天。夏天很热，可以吃西瓜、玩水。', 'Summer is hot, and we can eat watermelon and play with water.',
     'A summer vignette: one bright round sun with soft painted rays, a leafy green branch with three large rounded leaves, and one slice of watermelon resting at the bottom. No people, no beach, no clouds.'),
    ('weather-28', [f'{EX}/weather-25/raw/generated.png', f'{HD}/weather-01/raw/generated.png'],
     '秋天。秋天树叶变黄，一片一片落下来。', 'In autumn the leaves turn yellow and fall one by one.',
     'An autumn vignette: a short bare branch with three ochre and coral leaves still attached and four more leaves drifting down below it, over a soft small patch of grass. No trees, no wind swirls, no sky.'),
    ('weather-29', [f'{HD}/weather-04/raw/generated.png', f'{HD}/weather-20/raw/generated.png'],
     '冬天。冬天很冷，出门要穿厚厚的衣服。', 'Winter is cold, and we wear thick clothes when we go out.',
     'A winter vignette: one small tree with a soft rounded crown of pale snow, a low snowdrift at its base and three large painted snowflakes falling beside it. No people, no house, no sky.'),
    ('phrases-30', [f'{HD}/phrases-13/raw/generated.png', f'{HD}/phrases-15/raw/generated.png'],
     '早上好。早上见到大人，可以说一句早上好。', 'In the morning we can say good morning to a grown-up.',
     'One small cheerful toddler standing and waving one hand high in greeting, a warm smile, simple everyday clothes in soft muted colors, short neat hair. Same child style as the references. No sun, no text, no other people.'),
    ('phrases-31', [f'{HD}/phrases-09/raw/generated.png', f'{HD}/phrases-10/raw/generated.png'],
     '晚安。睡觉前轻轻说一句晚安。', 'Before sleep we say good night softly.',
     'One small toddler lying in a simple bed with a soft blanket up to the chin, eyes gently closed and a calm smile, one hand resting on the blanket. Not sitting up, no toys, no moon or stars.'),
    ('phrases-32', [f'{HD}/phrases-15/raw/generated.png', f'{HD}/phrases-13/raw/generated.png'],
     '不客气。别人说谢谢的时候，可以回一句不客气。', 'When someone says thank you, we can answer you are welcome.',
     'One small toddler standing with a warm smile and both hands open and turned slightly outward in a kind, welcoming gesture. Same child style as the references, simple clothes. No other people, no objects.'),
    ('phrases-33', [f'{HD}/phrases-03/raw/generated.png', f'{HD}/phrases-05/raw/generated.png'],
     '我要上厕所。想上厕所的时候说出来，大人就能帮忙。', 'When we need the toilet, saying it lets a grown-up help.',
     'One small toddler standing beside a simple closed pale door with a round knob, one hand raised toward it and a slightly urgent but calm expression. No bathroom fixtures, no signs or letters on the door, no other people.'),
    ('phrases-34', [f'{HD}/phrases-06/raw/generated.png', f'{HD}/phrases-07/raw/generated.png'],
     '我自己来。想自己试一试的时候，可以说我自己来。', 'When we want to try alone, we can say I will do it myself.',
     'One small toddler sitting on a low stool, leaning forward to pull on a soft slip-on shoe with both hands, concentrating with a determined little smile. One shoe on, one in hand. No other people, no laces.'),
    ('phrases-35', [f'{HD}/phrases-11/raw/generated.png', f'{HD}/phrases-01/raw/generated.png'],
     '等一下。还没做完的时候，可以说等一下。', 'When we are not finished yet, we can say just a moment.',
     'One small toddler standing and holding up one open palm toward the viewer at chest height, other hand clutching a small picture book, a patient expectant face. No other people, no clock.'),
    ('phrases-36', [f'{EX}/phrases-21/raw/generated.png', f'{HD}/phrases-11/raw/generated.png'],
     '再来一次。遇到喜欢的游戏，可以说再来一次。', 'For a game we enjoy, we can say again please.',
     'One small toddler caught mid-jump with both arms up and a wide happy smile, feet off the ground, simple clothes. No ball, no playground, no other people.'),
    ('phrases-37', [f'{HD}/phrases-01/raw/generated.png', f'{HD}/phrases-17/raw/generated.png'],
     '小心。走路或者端水的时候，大人会说小心。', 'When we walk or carry water, a grown-up says careful.',
     'One small toddler walking slowly while carrying a small cup in both hands, eyes on the cup, a careful focused expression, tiny cautious steps. No spilled water, no other people, no table.'),
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
