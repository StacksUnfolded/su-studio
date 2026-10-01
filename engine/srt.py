import json,re
import os
from paths import VIDEO
from pocketsphinx import Decoder
from timeline import offs
from paths import VO as V
words=json.load(open(V+'words.json'))
d=Decoder(samprate=16000)
REP=[('2025','twenty twenty five'),('IRS','i r s'),('LLC','l l c'),('US','u s')]
def ntok(w):
    t=re.sub(r'[^A-Za-z0-9\'-]','',w)
    for a,b in REP:
        if t==a: t=b
    t=t.replace('-',' ')
    return [x for x in re.findall(r"[a-zA-Z']+",t.lower()) if d.lookup_word(x)]
cues=[]
for si in range(14):
    txt=open(V+f'sec{si:02d}.txt').read(); ws=words[si]; k=0; timed=[]
    for w in txt.split():
        n=len(ntok(w))
        if n==0 or k>=len(ws): timed.append([w,None,None]); continue
        s=ws[k][1]; e=ws[min(k+n,len(ws))-1][2]; k+=n; timed.append([w,offs[si]+s,offs[si]+e])
    for i,x in enumerate(timed):
        if x[1] is None:
            prev=next((timed[j][2] for j in range(i-1,-1,-1) if timed[j][2]),offs[si]); x[1]=x[2]=prev
    cur=[]
    for w,s,e in timed:
        cur.append((w,s,e)); text=' '.join(x[0] for x in cur)
        if len(text)>=40 or (w[-1] in '.?!…"' and len(text)>12):
            cues.append((cur[0][1],cur[-1][2],text)); cur=[]
    if cur: cues.append((cur[0][1],cur[-1][2],' '.join(x[0] for x in cur)))
def fmt(t):
    h=int(t//3600);m=int(t%3600//60);s=t%60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int((s%1)*1000):03d}"
out=[]
for i,(s,e,t) in enumerate(cues):
    e2=min(max(e+0.25,s+0.8),cues[i+1][0]-0.02) if i+1<len(cues) else e+0.5
    out.append(f"{i+1}\n{fmt(s)} --> {fmt(e2)}\n{t}\n")
open('Stacks-Unfolded-'+os.path.basename(VIDEO.rstrip('/'))+'-Captions.srt','w').write('\n'.join(out))
print(len(out)); print(''.join(out[:3])); print(out[-1])
