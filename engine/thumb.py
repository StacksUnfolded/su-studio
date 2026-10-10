# Thumbnails in the "BORN RICH" style (V03, the channel's best long video so far, Oct 2026):
#   one flat, bright background colour + a soft glow behind the host
#   ONE big host (cropped at the thighs, face in the upper third, never covered)
#   ONE hero object/pile that says what the video is about
#   2–3 words of heavy Anton text on the LEFT, black, with one accent word
# usage: python3 engine/thumb.py spec.json out.png      (spec format: see SPECS at the bottom / thumbs/*.json)
import json, sys, os, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, 'library'); DIMS = json.load(open(os.path.join(LIB, 'dims.json')))
FA = os.path.join(ROOT, 'fonts', 'anton-latin-400-normal.woff')
W, H = 1920, 1080

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def asset(code):
    p = DIMS[code]['path'] if code in DIMS else ('props/%s.png' % code)
    return Image.open(os.path.join(LIB, p)).convert('RGBA')

def shadow(im, r=18, a=110, off=(0, 14)):
    s = Image.new('RGBA', (im.width + 4 * r, im.height + 4 * r), (0, 0, 0, 0))
    m = im.split()[3].point(lambda v: a if v > 20 else 0)
    s.paste((0, 0, 0, 255), (2 * r + off[0], 2 * r + off[1]), m)
    return s.filter(ImageFilter.GaussianBlur(r)), 2 * r

def place(canvas, im, cx, top=None, bottom=None, h=None, w=None, flip=False, rot=0, shad=True):
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if h: im = im.resize((round(im.width * h / im.height), round(h)), Image.LANCZOS)
    elif w: im = im.resize((round(w), round(im.height * w / im.width)), Image.LANCZOS)
    if rot: im = im.rotate(rot, expand=True, resample=Image.BICUBIC)
    x = round(cx - im.width / 2); y = round(top if top is not None else bottom - im.height)
    if shad:
        s, pad = shadow(im); canvas.alpha_composite(s, (x - pad, y - pad)) if x - pad >= 0 and y - pad >= 0 else canvas.paste(s, (x - pad, y - pad), s)
    canvas.paste(im, (x, y), im)
    return (x, y, x + im.width, y + im.height)

def text_block(d, lines, x0, y0, maxw, gap=0):
    # lines: [[text, colour, size]] ; shrinks each line to fit maxw; returns bbox
    y = y0; box = [x0, y0, x0, y0]
    for t, col, size in lines:
        f = ImageFont.truetype(FA, size)
        while d.textlength(t, font=f) > maxw and size > 60: size -= 6; f = ImageFont.truetype(FA, size)
        sw = max(6, size // 22)
        stroke = (255, 255, 255) if hexrgb(col) == (17, 19, 21) else (17, 19, 21)
        d.text((x0, y), t, font=f, fill=col, stroke_width=sw, stroke_fill=stroke)
        bb = d.textbbox((x0, y), t, font=f, stroke_width=sw)
        box = [min(box[0], bb[0]), min(box[1], bb[1]), max(box[2], bb[2]), max(box[3], bb[3])]
        y = bb[3] + gap
    return box

def build(spec, out):
    bg = hexrgb(spec['bg']); c = Image.new('RGBA', (W, H), bg + (255,))
    # glow behind the host + faint sunburst, like the winning thumbnail's lighting
    hx = spec.get('host_x', 1380)
    glow = Image.new('L', (W, H), 0); g = ImageDraw.Draw(glow)
    for i in range(40):
        r = 900 - i * 20; g.ellipse((hx - r, 520 - r, hx + r, 520 + r), fill=int(4 + i * 3.2))
    light = Image.new('RGBA', (W, H), (255, 255, 255, 0)); light.putalpha(glow.filter(ImageFilter.GaussianBlur(60)).point(lambda v: int(v * 0.55)))
    c.alpha_composite(light)
    if spec.get('rays', True):
        rays = Image.new('L', (W, H), 0); rd = ImageDraw.Draw(rays)
        for k in range(18):
            a0 = k * 20; a1 = a0 + 9
            p = [(hx, 520)] + [(hx + 2600 * math.cos(math.radians(a)), 520 + 2600 * math.sin(math.radians(a))) for a in (a0, a1)]
            rd.polygon(p, fill=26)
        c.alpha_composite(Image.merge('RGBA', [Image.new('L', (W, H), 255)] * 3 + [rays.filter(ImageFilter.GaussianBlur(3))]))
    # props behind the host
    for p in spec.get('back', []):
        place(c, asset(p['a']), p['x'], bottom=p.get('bottom', H + 20), h=p.get('h'), w=p.get('w'), flip=p.get('flip', False), rot=p.get('rot', 0))
    # host (and optional second character)
    for a in spec['actors']:
        im = asset(a['a']); foot = DIMS[a['a']]['foot']
        hh = a['h']; top = a.get('top', 60)
        place(c, im, a['x'], top=top, h=hh, flip=a.get('flip', False))
        a['_box'] = (a['x'] - hh * DIMS[a['a']]['ar'] / 2, top, a['x'] + hh * DIMS[a['a']]['ar'] / 2, top + hh * 0.33)  # head zone
    for p in spec.get('front', []):
        place(c, asset(p['a']), p['x'], bottom=p.get('bottom', H + 20), h=p.get('h'), w=p.get('w'), flip=p.get('flip', False), rot=p.get('rot', 0))
    d = ImageDraw.Draw(c)
    tb = text_block(d, spec['text'], spec.get('text_x', 70), spec.get('text_y', 90), spec.get('text_w', 820), gap=spec.get('gap', 4))
    for b in spec.get('badges', []):  # small pill, e.g. "5 YEARS"
        f = ImageFont.truetype(FA, b.get('size', 90)); tw = d.textlength(b['t'], font=f)
        x, y = b['x'], b['y']; pad = 28
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
        ld.rounded_rectangle((x, y, x + tw + 2 * pad, y + b.get('size', 90) * 1.35), radius=24, fill=hexrgb(b.get('bg', '#E8322B')) + (255,), outline=(17, 19, 21), width=8)
        ld.text((x + pad, y + 4), b['t'], font=f, fill=b.get('col', '#ffffff'))
        c.alpha_composite(lay.rotate(b.get('rot', -4), center=(x, y), resample=Image.BICUBIC))
    # guard: text must not touch any face
    for a in spec['actors']:
        hb = a['_box']
        if not (tb[2] < hb[0] or tb[0] > hb[2] or tb[3] < hb[1] or tb[1] > hb[3]):
            raise SystemExit(f'text block {tb} overlaps the face of {a["a"]} {hb}')
    c.convert('RGB').save(out)
    print(out, 'text box', tb)

if __name__ == '__main__':
    build(json.load(open(sys.argv[1])), sys.argv[2])
