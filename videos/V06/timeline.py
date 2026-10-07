# V06 timeline: section offsets, milestone-card windows and absolute word times -> remotion/src/v06/timeline.json
import json, subprocess, re
words = json.load(open('vo/words.json'))
N = len(words)
durs = [float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'vo/sec{i:02d}.mp3'])) for i in range(N)]
# section -> (level, intro word count, notification text, subtitle)
LV = {1: (0, 2, 'Account created', 'YOU PAY THEM'), 2: (1, 2, 'You hit 1,000 followers', 'PAID IN HOODIES'), 3: (2, 2, 'You hit 10,000 followers', 'THE FIRST REAL CHECK'),
      4: (3, 2, 'You’re now eligible for ads', 'THE PLATFORM PAYS… A LITTLE'), 5: (4, 2, 'You hit 50,000 followers', 'THE TREADMILL'),
      7: (5, 2, 'You hit 100,000 followers', 'FAMOUS BUT BROKE'), 8: (6, 2, 'New: 3 people work for you', 'EVERYBODY GETS A CUT'),
      9: (7, 2, 'You hit 1,000,000 followers', 'THE MILLION'), 10: (8, 2, 'New: your store is live', 'OWN SOMETHING'), 11: (9, 2, 'You hit 10,000,000 followers', 'THE MEDIA COMPANY')}
START = 0.4; TITLE = 2.6; GAP = 0.55
offs = []; cards = []; o = START; title_t = None
for i, d in enumerate(durs):
    if i == 1: title_t = o + 0.2; o += 0.2 + TITLE
    if i in LV: o += 0.6           # card leads the VO a little
    if i == 12: o += 0.8
    offs.append(round(o, 3))
    if i in LV:
        lv, nw, note, sub = LV[i]
        intro_end = words[i][nw - 1][2]
        cards.append(dict(sec=i, lv=lv, note=note, sub=sub, t=round(o - 0.6, 3), dur=round(0.6 + intro_end + 0.45, 3)))
    o += d + GAP
VOEND = o; TOTAL = round(o + 15.0, 2)
W = []
for i, ws in enumerate(words):
    for w, s, e in ws: W.append([i, re.sub(r'\(\d+\)', '', w), round(offs[i] + s, 3), round(offs[i] + e, 3)])
json.dump(dict(offs=offs, durs=durs, cards=cards, titleT=title_t, title=TITLE, voEnd=round(VOEND, 3), total=TOTAL, words=W),
          open('../../remotion/src/v06/timeline.json', 'w'))
print('total', TOTAL, 'min', round(TOTAL / 60, 2), 'voend', round(VOEND, 2)); print('offs', offs)
