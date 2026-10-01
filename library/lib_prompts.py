# Reusable asset library prompts (Stacks Unfolded)
CUT = ("Single full-body character cut-out in the exact cartoon style of the reference image: bold near-black outlines, flat colours with one soft cel-shadow. "
 "The character stands centred, fully visible from head to feet with a small margin on every side, nothing cropped, feet flat on an invisible floor. "
 "Background: one perfectly flat, uniform, solid pure magenta colour (#FF00FF) filling the whole image, no floor line, no shadow, no gradient, no texture, no other objects. "
 "No magenta or pink anywhere on the character. No text, letters, numbers or logos anywhere. ")
HOST = ("The HOST from the reference: perfectly round plain white head with no nose or ears, black sunglasses always on, simple mouth, grey hoodie with the hood UP around the head, "
 "grey jogger trousers, simple dark grey trainers, white mitten-style hands with correct fingers. The host must NOT be a baby. ")
POSES = {
'P01': "standing relaxed and neutral, arms by his sides, small friendly smile, facing the viewer.",
'P02': "explaining something, one hand raised with an open palm to the side, confident talking mouth, facing the viewer.",
'P03': "pointing enthusiastically up and to his LEFT side of the picture (the viewer's right) with one arm fully extended, big smile.",
'P04': "pointing enthusiastically up and to the viewer's LEFT with one arm fully extended, big smile.",
'P05': "pointing straight at the viewer with one finger, confident grin, leaning slightly forward.",
'P06': "arms crossed over his chest, smug confident grin, standing tall.",
'P07': "shrugging with both palms up and shoulders raised, awkward crooked smile.",
'P08': "shocked, both hands pressed to his cheeks, mouth wide open in an O.",
'P09': "thinking, one hand on his chin, head slightly tilted, mouth to one side.",
'P10': "celebrating, both fists raised in the air, jumping slightly off the ground, huge open-mouth smile.",
'P11': "facepalm, one hand covering the lower part of his face under the sunglasses, slumped shoulders.",
'P12': "counting on his fingers, one hand holding up three fingers, the other hand touching them, concentrating.",
'P13': "looking down at a plain black smartphone held in one hand, the screen facing him, slight frown of concentration.",
'P14': "sitting on a simple wooden chair at a small plain wooden desk, typing on an open silver laptop, seen from a three-quarter front angle; desk, chair and laptop fully visible.",
'P15': "sitting slumped on the floor with his back hunched, legs out, arms limp, exhausted, tired mouth.",
'P16': "walking briskly towards the viewer's right, side-on view, mid-stride, arms swinging.",
'P17': "running in a panic towards the viewer's left, side-on view, mid-stride, arms flailing, mouth open, sweat drops.",
'P18': "holding up a fan of green dollar bills in one hand like playing cards, smug smile.",
'P19': "holding a plain brown cardboard parcel box with both hands in front of his chest, proud smile.",
'P20': "giving a big thumbs up with one hand, cheerful grin.",
'P21': "nervous, sweating with drops flying off his head, pulling at the neck of his hoodie with one finger, wobbly worried mouth.",
'P22': "yawning hugely with one hand over his mouth, the other arm stretched up, sleepy.",
'P23': "presenting like a teacher, holding a long thin wooden pointer stick angled up to the viewer's right, other hand on his hip, confident.",
'P24': "sitting relaxed on a simple modern office chair, legs crossed, leaning back, one arm resting on the armrest, calm satisfied smile; chair fully visible.",
}
CAST = {
'C01': "THE TAXMAN: a short round man with a round white cartoon face, simple dot eyes and small mouth, thin combed-over dark hair, small round glasses, grey three-piece suit and a red tie, holding a brown clipboard; polite but serious expression. He must NOT look like the host (no hood, no sunglasses).",
'C02': "A CUSTOMER: a friendly young woman with a round white cartoon face, dot eyes, big smile, curly brown hair in a ponytail, yellow jumper, blue jeans and white trainers, holding a small paper shopping bag. No hood, no sunglasses.",
'C03': "A FRIEND: a casual young man with a round white cartoon face, dot eyes, short messy black hair, green t-shirt, jeans, holding a phone, happy expression. No hood, no sunglasses.",
'C04': "THE BUYER: a tall confident businessman with a round white cartoon face, dot eyes, neat slicked-back silver hair, navy suit, white shirt, blue tie, holding a black leather briefcase. No hood, no sunglasses.",
'C05': "THE COPYCAT: a sly market trader with a round white cartoon face, narrow dot eyes and a sneaky grin, thin moustache, flat cap, striped shirt and a green apron. No hood, no sunglasses.",
'C06': "THE ACCOUNTANT: a middle-aged woman with a round white cartoon face, dot eyes, grey bob haircut, reading glasses on a chain, purple cardigan, holding a calculator. No hood, no sunglasses.",
'C07': "THE BOSS: a middle-aged man with a round white cartoon face, dot eyes, bald with a brown beard, white shirt with rolled sleeves and loosened tie, holding a coffee mug, unimpressed expression. No hood, no sunglasses.",
'C08': "AN OFFICE WORKER: a young woman with a round white cartoon face, dot eyes, black hair in a bun, light blue blouse and dark trousers, clapping her hands, smiling. No hood, no sunglasses.",
}
SHEET = ("A sprite sheet of separate cartoon props in the exact cartoon style of the reference image (bold near-black outlines, flat colours, one soft cel-shadow), "
 "arranged in a neat grid of 4 columns and 3 rows with lots of empty space between every item so none of them touch or overlap. "
 "Background: one perfectly flat, uniform, solid pure magenta colour (#FF00FF), no shadows, no floor. No magenta on the props. No characters. No text, letters, numbers or logos anywhere. The props are: ")
PROPS = {
'PRA': "a stack of gold coins, a thick bundle of green dollar bills with a paper band, a brown money bag, a blue piggy bank, a plain credit card, a cardboard shoebox overflowing with white receipts, a black leather briefcase, a gold bar, a brown leather wallet, a grey desk calculator, a glass jar half full of coins, a small green potted plant.",
'PRB': "a plain black smartphone seen from the front with a blank dark screen, an open silver laptop with a blank screen, a brown cardboard parcel box, a blank wall calendar with empty squares, a plain white envelope, a round wall clock, a shiny red modern hatchback car seen from the side, a small cosy suburban house, a sandwich, a paper coffee cup, a brown paper takeaway bag, a white first-aid kit.",
}
PLATE = ("Wide 16:9 landscape background plate, full-bleed, in the exact cartoon style of the reference image: bold near-black outlines, flat muted colours with one soft cel-shadow, "
 "a richly detailed, painted, lived-in scene full of props. There are NO people or characters anywhere in the image; the host must NOT appear. "
 "Leave a clear open floor area in the centre and lower third where characters will be placed later. No text, letters, numbers, signage or logos anywhere. The scene: ")
PLATES = {
'L01': "an open-plan office cubicle area in the late afternoon: grey cubicle partitions, a desk with a computer monitor and keyboard, a wheeled office chair, a potted plant, fluorescent ceiling lights, a window with orange evening light.",
'L02': "a small cosy bedroom at night: a single bed with rumpled duvet, a bedside lamp glowing warmly, posters without text on the wall, a window showing a dark blue night sky with stars, clothes on a chair.",
'L03': "a small homely kitchen in the evening: a wooden kitchen table with two chairs in the middle, cupboards, a fridge, a kettle, a window with a dark evening sky, warm light.",
'L04': "a small home office: a desk against the wall with a monitor, shelves with folders and boxes, a cork board with blank papers pinned, a desk lamp, a rug on the floor.",
'L05': "a friendly town high street in the daytime: a row of colourful shopfronts with blank awnings and blank signs, a pavement, a wooden bench, street lamps, a few trees, blue sky.",
'L06': "a lively outdoor weekend market: rows of market stalls with striped awnings and wooden tables stacked with blank boxes and produce, bunting, cobbled ground, a clear open walkway in the middle.",
'L07': "a bright small startup studio office: white brick walls, a long shared wooden table with laptops and chairs, big windows, hanging plants, shelving with boxes and a whiteboard with blank sticky notes.",
'L08': "a grand bank interior: marble floor, tall columns, a long wooden counter with brass details, a big round vault door in the background wall, warm lighting.",
'L09': "a big modern glass boardroom high in a skyscraper: a long glossy table with leather chairs, floor-to-ceiling windows showing a city skyline at sunset.",
'L10': "a country road in the daytime splitting into two paths at a fork, with two blank wooden signposts at the fork pointing in different directions; green fields, rolling hills, blue sky with fluffy clouds.",
}
