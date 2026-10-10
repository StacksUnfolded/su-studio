import json,re,subprocess
from pocketsphinx import Decoder
REP=[('CFPB','c f p b'),('TV','t v'),('APR','a p r'),('BNPL','b n p l'),('2025','twenty twenty five'),('IRS','i r s'),('LLC','l l c'),('US','u s'),('ninety-nine K','ninety nine k'),('Gen Z','gen z'),('DMs','d m s'),('DM','d m'),('FTC','f t c'),('U.S.','u s')]
def norm(t):
    for a,b in REP: t=re.sub(r'\b'+re.escape(a)+r'\b',b,t)
    t=t.replace('-',' ').replace('…',' ')
    return re.findall(r"[a-zA-Z']+",t.lower())
# extra pronunciations (CMU phones) for words the default dictionary lacks
EXTRA={'influencer':'IH N F L UW AH N S ER','influencers':'IH N F L UW AH N S ER Z','merch':'M ER CH','hoodie':'HH UH D IY','hoodies':'HH UH D IY Z',
       'glowsip':'G L OW S IH P','sneakier':'S N IY K IY ER',"app's":'AE P S','snugbox':'S N AH G B AA K S','vexo':'V EH K S OW','dez':'D EH Z',"excitement's":'IH K S AY T M AH N T S'}
res=[]
import glob
N=len(glob.glob('sec*.txt'))
for i in range(N):
    txt=open(f'sec{i:02d}.txt').read()
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'sec{i:02d}.mp3','-ar','16000','-ac','1','-f','s16le','-'],capture_output=True).stdout
    d=Decoder(samprate=16000,bestpath=False)
    for w,ph in EXTRA.items():
        if not d.lookup_word(w): d.add_word(w,ph,True)
    words=norm(txt); known=[w for w in words if d.lookup_word(w)]
    miss=sorted(set(w for w in words if not d.lookup_word(w)))
    d.set_align_text(' '.join(known)); d.start_utt(); d.process_raw(raw,full_utt=True); d.end_utt()
    segs=[(s.word,s.start_frame/100,s.end_frame/100) for s in d.seg() if s.word not in ('<s>','</s>','<sil>','(NULL)')]
    print(i,len(known),len(segs),'missing:',miss,flush=True); res.append(segs)
json.dump(res,open('words.json','w'))
