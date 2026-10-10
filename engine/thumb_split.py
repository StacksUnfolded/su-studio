# Lightning-split thumbnails in the style of V04's "$1 | $1M" (Fin's pick, 10 Oct 2026):
#   two scenes side by side, cut by a white zig-zag "lightning" line
#   one side cold and dark (the bad state), the other warm and glowing (the good state)
#   the host in both, with the emotion obvious; a big white number with a black outline at the top of each side
#   numbers sit above the heads, never on a face
# usage: python3 engine/thumb_split.py spec.json out.png        (specs live in thumbs/specs/*-split.json)
import json, sys, os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance, ImageChops
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, 'library'); DIMS = json.load(open(os.path.join(LIB, 'dims.json')))
FA = os.path.join(ROOT, 'fonts', 'anton-latin-400-normal.woff')
W, H = 1920, 1080; MID = W // 2

def asset(code):
    p = DIMS[code]['path'] if code in DIMS else ('props/%s.png' % code)
    return Image.open(os.path.join(LIB, p)).convert('RGBA')

def plate(code, cx, zoom):
    im = Image.open(os.path.join(LIB, 'plates', code + '.png')).convert('RGB')
    w, h = round(im.width * zoom * H / im.height), round(H * zoom)
    im = im.resize((w, h), Image.LANCZOS)
    x0 = max(0, min(w - W // 2 - 60, round(cx * w - W / 4))); y0 = (h - H) // 2
    return im.crop((x0, y0, x0 + W // 2 + 60, y0 + H))

def grade(im, mood):
    if mood == 'cold':   # night, blue, tired
        im = ImageEnhance.Color(im).enhance(0.45); im = ImageEnhance.Brightness(im).enhance(0.62)
        im = ImageChops.multiply(im, Image.new('RGB', im.size, (150, 175, 225)))
        v = Image.new('L', im.size, 0); ImageDraw.Draw(v).ellipse((-200, -100, im.width + 200, im.height + 300), fill=255)
        return Image.composite(im, ImageEnhance.Brightness(im).enhance(0.55), v.filter(ImageFilter.GaussianBlur(160)))
    im = ImageEnhance.Color(im).enhance(1.25); im = ImageEnhance.Brightness(im).enhance(1.05)
    glow = Image.new('L', im.size, 0); gd = ImageDraw.Draw(glow)
    cx, cy = im.width // 2, im.height // 2 - 40
    for i in range(30): r = 700 - i * 22; gd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=int(i * 6))
    gold = Image.new('RGB', im.size, (255, 214, 90))
    return Image.composite(gold, im, glow.filter(ImageFilter.GaussianBlur(80)).point(lambda v: int(v * 0.42)))

def sparkle(c, x0, x1, n=30, seed=3):
    r = random.Random(seed); d = ImageDraw.Draw(c)
    for _ in range(n):
        x, y, s = r.uniform(x0, x1), r.uniform(150, 900), r.uniform(4, 11)
        d.polygon([(x, y - s * 2), (x + s * .5, y), (x, y + s * 2), (x - s * .5, y)], fill=(255, 246, 200, 230))
        d.polygon([(x - s * 2, y), (x, y + s * .5), (x + s * 2, y), (x, y - s * .5)], fill=(255, 246, 200, 230))

def rain(c, x0, x1, seed=5):
    r = random.Random(seed); lay = Image.new('RGBA', c.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for _ in range(140):
        x, y = r.uniform(x0, x1), r.uniform(0, H)
        d.line((x, y, x - 8, y + 34), fill=(200, 215, 255, 70), width=2)
    c.alpha_composite(lay)

def shadow(im, r=16, a=120):
    s = Image.new('RGBA', (im.width + 4 * r, im.height + 4 * r), (0, 0, 0, 0))
    s.paste((0, 0, 0, 255), (2 * r, 2 * r + 12), im.split()[3].point(lambda v: a if v > 20 else 0))
    return s.filter(ImageFilter.GaussianBlur(r)), 2 * r

def put(c, code, cx, base, h, flip=False, rot=0, foot=True):
    im = asset(code)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im = im.resize((round(im.width * h / im.height), round(h)), Image.LANCZOS)
    if rot: im = im.rotate(rot, expand=True, resample=Image.BICUBIC)
    f = DIMS[code]['foot'] if (foot and code in DIMS) else 1.0
    x = round(cx - im.width / 2); y = round(base - im.height * f)
    s, p = shadow(im); c.paste(s, (x - p, y - p), s); c.paste(im, (x, y), im)
    return (x, y, x + im.width, y + im.height)

def bolt(c, seed=2):
    r = random.Random(seed); pts = []; y = -20; x = MID + 20
    while y < H + 40:
        pts.append((x, y)); y += r.uniform(110, 170); x = MID + (60 if len(pts) % 2 else -60) + r.uniform(-15, 15)
    pts.append((x, H + 60))
    left = [(0, -40)] + [(p[0] - 1, p[1]) for p in pts] + [(0, H + 40)]
    return pts, left

def number(c, t, cx, y, size, col='#ffffff', maxw=760):
    d = ImageDraw.Draw(c)
    f = ImageFont.truetype(FA, size)
    while d.textlength(t, font=f) > maxw: size -= 8; f = ImageFont.truetype(FA, size)
    sw = max(10, size // 16)
    # drop shadow, then outlined text
    sh = Image.new('RGBA', c.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    sd.text((cx + 8, y + 12), t, font=f, anchor='mt', fill=(0, 0, 0, 160), stroke_width=sw, stroke_fill=(0, 0, 0, 160))
    c.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    d.text((cx, y), t, font=f, anchor='mt', fill=col, stroke_width=sw, stroke_fill='#111315')
    return d.textbbox((cx, y), t, font=f, anchor='mt', stroke_width=sw)

def build(spec, out):
    c = Image.new('RGBA', (W, H), (0, 0, 0, 255)); boxes = []; faces = []
    halves = [spec['left'], spec['right']]
    pts, leftpoly = bolt(c, spec.get('seed', 2))
    for i, s in enumerate(halves):
        bg = grade(plate(s['plate'], s.get('pcx', .5), s.get('zoom', 1.0)), s['mood']).convert('RGBA')
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); layer.paste(bg, (0 if i == 0 else MID - 60, 0))
        if s['mood'] == 'cold': rain(layer, 0 if i == 0 else MID, MID if i == 0 else W)
        for p in s.get('back', []): put(layer, p['a'], p['x'], p['y'], p['h'], p.get('flip', False), p.get('rot', 0), foot=False)
        a = s['actor']; b = put(layer, a['a'], a['x'], a.get('base', 1075), a['h'], a.get('flip', False))
        faces.append((b[0] + (b[2] - b[0]) * .15, b[1], b[2] - (b[2] - b[0]) * .15, b[1] + (b[3] - b[1]) * .3))
        for p in s.get('front', []): put(layer, p['a'], p['x'], p['y'], p['h'], p.get('flip', False), p.get('rot', 0), foot=False)
        if s['mood'] == 'warm': sparkle(layer, MID if i else 0, W if i else MID)
        mask = Image.new('L', (W, H), 0); md = ImageDraw.Draw(mask); md.polygon(leftpoly, fill=255)
        if i == 1: mask = ImageChops.invert(mask)
        c.paste(layer, (0, 0), mask)
    d = ImageDraw.Draw(c)
    d.line(pts, fill='#111315', width=34, joint='curve'); d.line(pts, fill='#ffffff', width=20, joint='curve')
    for i, s in enumerate(halves):
        cx = (MID // 2 - 20) if i == 0 else (MID + MID // 2 + 20)
        boxes.append(number(c, s['text'], cx, s.get('ty', 30), s.get('size', 270), s.get('col', '#ffffff')))
    for bb in boxes:
        for fz in faces:
            if not (bb[2] < fz[0] or bb[0] > fz[2] or bb[3] < fz[1] or bb[1] > fz[3]):
                raise SystemExit(f'number {bb} overlaps a face {fz}')
    c.convert('RGB').save(out); print(out, boxes)

if __name__ == '__main__':
    build(json.load(open(sys.argv[1])), sys.argv[2])
