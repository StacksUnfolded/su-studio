import json,re,subprocess
from paths import VO as V
words=json.load(open(V+'words.json'))
N=14
durs=[float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',V+f'sec{i:02d}.mp3'])) for i in range(N)]
START=0.3; TITLE=2.4; CARD=1.9; RECAP=0.6; PAYGAP=1.2; ENDHOLD=15.0
LEVEL_OF_SEC={1:1,2:2,3:3,4:4,5:5,6:6,8:7,9:8,10:9,11:10,12:11}
offs=[];o=START;CARDS=[];TITLE_T=None
for i,d in enumerate(durs):
    if i==1: TITLE_T=o+0.25; o+=0.25+TITLE
    if i in LEVEL_OF_SEC: CARDS.append((LEVEL_OF_SEC[i],o)); o+=CARD
    if i==7: o+=RECAP
    if i==13: o+=PAYGAP
    offs.append(round(o,3)); o+=d+0.22
VOEND=o; TOTAL=round(o+ENDHOLD,2)
W=[]
for i,ws in enumerate(words):
    for w,s,e in ws: W.append((i,re.sub(r'\(\d+\)','',w),offs[i]+s,offs[i]+e))
REP=[('2025','twenty twenty five'),('IRS','i r s'),('LLC','l l c'),('US','u s'),('Gen Z','gen z')]
def norm(t):
    for a,b in REP: t=re.sub(r'\b'+re.escape(a)+r'\b',b,t)
    t=t.replace('-',' ').replace('…',' ')
    return re.findall(r"[a-z']+",t.lower())
_memo={};AMB=[]
def _hits(sec,phrase):
    p=norm(phrase); idx=[j for j,x in enumerate(W) if x[0]==sec]
    return [(W[j][2],W[idx[m+len(p)-1]][3]) for m,j in enumerate(idx) if [W[q][1] for q in idx[m:m+len(p)]]==p]
def cue(sec,phrase,n=0):
    k=(sec,phrase,n)
    if k in _memo: return _memo[k]
    h=_hits(sec,phrase)
    if not h: raise Exception(f'cue not found {sec} {phrase!r}')
    if len(h)>1 and n==0: AMB.append((sec,phrase,[round(x[0],1) for x in h]))
    _memo[k]=round(h[n][0],2); return _memo[k]
def cend(sec,phrase,n=0): return round(_hits(sec,phrase)[n][1],2)
def send(sec): return round(offs[sec]+durs[sec],2)
if __name__=='__main__':
    print([round(x,1) for x in offs]); print('TITLE',TITLE_T,'VOEND',round(VOEND,1),'TOTAL',TOTAL, TOTAL/60)
    print(CARDS)
