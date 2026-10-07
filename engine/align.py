import json,re,subprocess
from pocketsphinx import Decoder
REP=[('CFPB','c f p b'),('TV','t v'),('APR','a p r'),('BNPL','b n p l'),('2025','twenty twenty five'),('IRS','i r s'),('LLC','l l c'),('US','u s'),('ninety-nine K','ninety nine k'),('Gen Z','gen z')]
def norm(t):
    for a,b in REP: t=re.sub(r'\b'+re.escape(a)+r'\b',b,t)
    t=t.replace('-',' ').replace('…',' ')
    return re.findall(r"[a-zA-Z']+",t.lower())
res=[]
import glob
N=len(glob.glob('sec*.txt'))
for i in range(N):
    txt=open(f'sec{i:02d}.txt').read()
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'sec{i:02d}.mp3','-ar','16000','-ac','1','-f','s16le','-'],capture_output=True).stdout
    d=Decoder(samprate=16000,bestpath=False)
    words=norm(txt); known=[w for w in words if d.lookup_word(w)]
    miss=sorted(set(w for w in words if not d.lookup_word(w)))
    d.set_align_text(' '.join(known)); d.start_utt(); d.process_raw(raw,full_utt=True); d.end_utt()
    segs=[(s.word,s.start_frame/100,s.end_frame/100) for s in d.seg() if s.word not in ('<s>','</s>','<sil>','(NULL)')]
    print(i,len(known),len(segs),'missing:',miss,flush=True); res.append(segs)
json.dump(res,open('words.json','w'))
