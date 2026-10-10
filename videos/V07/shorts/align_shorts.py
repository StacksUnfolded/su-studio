# Aligns shortA/shortB voice-overs -> remotion/src/v07/shorts_words.json  {id: {dur, words:[[w,s,e]], disp:[[display,s,e]]}}
import json, re, subprocess, sys
sys.path.insert(0, '../../../engine')
from pocketsphinx import Decoder
REP = [('FTC', 'f t c'), ('DM', 'd m'), ('U.S.', 'u s')]
EXTRA = {'influencer': 'IH N F L UW AH N S ER', 'influencers': 'IH N F L UW AH N S ER Z', 'merch': 'M ER CH', 'hoodie': 'HH UH D IY', 'hoodies': 'HH UH D IY Z', 'dez': 'D EH Z'}
def norm(t):
    for a, b in REP: t = re.sub(r'\b' + re.escape(a) + r'\b', b, t)
    return re.findall(r"[a-zA-Z']+", t.replace('-', ' ').replace('…', ' ').lower())
out = {}
for k in ['A', 'B']:
    txt = open(f'short{k}.txt').read()
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'short{k}.mp3', '-ar', '16000', '-ac', '1', '-f', 's16le', '-'], capture_output=True).stdout
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'short{k}.mp3']))
    d = Decoder(samprate=16000, bestpath=False)
    for w, ph in EXTRA.items():
        if not d.lookup_word(w): d.add_word(w, ph, True)
    words = [w for w in norm(txt) if d.lookup_word(w)]
    d.set_align_text(' '.join(words)); d.start_utt(); d.process_raw(raw, full_utt=True); d.end_utt()
    segs = [[re.sub(r'\(\d+\)', '', s.word), s.start_frame / 100, s.end_frame / 100] for s in d.seg() if s.word not in ('<s>', '</s>', '<sil>', '(NULL)')]
    disp = []; i = 0
    for tok in txt.split():
        n = len([w for w in norm(tok) if d.lookup_word(w)])
        if n and i < len(segs): disp.append([tok, segs[i][1], segs[min(i + n, len(segs)) - 1][2]]); i += n
        elif disp: disp.append([tok, disp[-1][2], disp[-1][2] + 0.2])
    out[k] = dict(dur=round(dur, 3), words=segs, disp=disp)
    print(k, dur, len(segs), len(words))
json.dump(out, open('../../../remotion/src/v07/shorts_words.json', 'w'))
