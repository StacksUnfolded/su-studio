# V05 timeline: section offsets, level-card windows and absolute word times -> remotion/src/v05/timeline.json
import json, subprocess, re
words = json.load(open('vo/words.json'))
N = len(words)
durs = [float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'vo/sec{i:02d}.mp3'])) for i in range(N)]
# section -> (level, intro word count, subtitle, clock, crack)
LV = {1: (1, 4, '1 active plan', '11:47 PM', 0), 2: (2, 4, '2 active plans', '9:12 PM', 0), 3: (3, 4, '4 active plans', '1:03 AM', 0.05),
      4: (4, 6, '7 plans · 3 apps', '12:41 AM', 0.15), 5: (5, 4, '10 active plans', '6:58 PM', 0.3), 7: (6, 6, '1 payment PAST DUE', '6:00 AM', 0.42),
      8: (7, 7, 'Your credit report changed', '8:15 AM', 0.55), 9: (8, 6, '12 active plans', '11:59 PM', 0.68), 10: (9, 4, 'Account locked', '2:00 AM', 0.85), 11: (10, 4, '0 active plans (the goal)', '7:30 AM', 0.0)}
START = 0.4; TITLE = 2.4; GAP = 0.55
offs = []; cards = []; o = START; title_t = None
for i, d in enumerate(durs):
    if i == 1: title_t = o + 0.2; o += 0.2 + TITLE
    if i in LV: o += 0.55          # card leads the VO a little
    if i == 12: o += 0.8
    offs.append(round(o, 3))
    if i in LV:
        lv, nw, sub, clock, crack = LV[i]
        intro_end = words[i][nw - 1][2]
        cards.append(dict(sec=i, lv=lv, sub=sub, clock=clock, crack=crack, t=round(o - 0.55, 3), dur=round(0.55 + intro_end + 0.35, 3)))
    o += d + GAP
VOEND = o; TOTAL = round(o + 15.0, 2)
W = []
for i, ws in enumerate(words):
    for w, s, e in ws: W.append([i, re.sub(r'\(\d+\)', '', w), round(offs[i] + s, 3), round(offs[i] + e, 3)])
json.dump(dict(offs=offs, durs=durs, cards=cards, titleT=title_t, title=TITLE, voEnd=round(VOEND, 3), total=TOTAL, words=W),
          open('../../remotion/src/v05/timeline.json', 'w'))
print('total', TOTAL, 'min', round(TOTAL / 60, 2), 'voend', round(VOEND, 2)); print('offs', offs)
