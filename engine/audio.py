import subprocess
from shots import SFX
from timeline import offs, durs, TOTAL, TITLE_T, CARDS, send, cue
END=TOTAL
from paths import LIB,VO as V
M={'whoosh':'Whoosh','pop':'Pop','ding':'Ding','wrong':'Wrong','riser':'Riser','wow':'Wow','register':'Cash Register','coin':'Coin Drop','paper':'Paper','stamp':'Stamp','splash':'Splash','drag':'Drag','scratch':'Record Scratch','phone':'Phone ring','crickets':'Crickets','typing':'Typing',
   'rattle':'Baby Rattle','shutter':'Camera Shutter','flash1':'Camera Flash 1','flash2':'Camera Flash 2','bells':'Church Bells','chime':'Clock Chime','tick':'Clock Tick','door':'Door Creak','gavel':'Gavel','heli':'Helicopter','murmur':'Murmur','violin':'Sad Violin','signature':'Signature','thump':'Thump Individual','trombone':'Wah Wah Trombone','water':'Water'}
MAXD={'phone':1.8,'register':1.6,'ding':2.0,'riser':1.6,'water':1.8,'drag':1.2,'wow':1.5,'bells':3.5,'murmur':3.5,'heli':3.5,'violin':7.0,'tick':1.6,'crickets':2.5,'typing':2.0,'chime':2.5,'trombone':2.8,'gavel':1.5,'door':1.8}
VOL={'pop':0.45,'whoosh':0.4,'ding':0.35,'wrong':0.3,'riser':0.3,'wow':0.35,'register':0.35,'coin':0.5,'paper':0.45,'stamp':0.5,'splash':0.4,'drag':0.4,'scratch':0.45,'phone':0.25,'crickets':0.35,'typing':0.3,
     'rattle':0.5,'shutter':0.45,'flash1':0.4,'flash2':0.45,'bells':0.25,'chime':0.3,'tick':0.35,'door':0.4,'gavel':0.45,'heli':0.3,'murmur':0.3,'violin':0.3,'signature':0.5,'thump':0.6,'trombone':0.35,'water':0.5}
def run(c): subprocess.run(c,check=True)
N=len(offs)
inp=[];fl=[]
for i in range(N):
    inp+=['-i',V+f'sec{i:02d}.mp3']; fl.append(f"[{i}]aresample=48000,adelay={int(offs[i]*1000)}:all=1[a{i}]")
fl.append(''.join(f'[a{i}]' for i in range(N))+f"amix=inputs={N}:normalize=0,apad,atrim=0:{END},loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[vo]")
run(['ffmpeg','-y','-v','error']+inp+['-filter_complex',';'.join(fl),'-map','[vo]','-ac','2','vo.wav'])
# SFX in chunks (ffmpeg input limits)
ev=sorted([(n,t) for n,t in SFX if t<END-0.2],key=lambda x:x[1])
parts=[]
for ci in range(0,len(ev),60):
    chunk=ev[ci:ci+60]; inp=[];fl=[]
    for k,(n,t) in enumerate(chunk):
        inp+=['-i',LIB+'sfx/'+M[n]+'.mp3']; d=MAXD.get(n,3.0)
        fl.append(f"[{k}]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{d},afade=t=out:st={max(0,d-0.3)}:d=0.3,volume={VOL[n]},adelay={int(max(0,t)*1000)}:all=1[s{k}]")
    fl.append(''.join(f'[s{k}]' for k in range(len(chunk)))+f"amix=inputs={len(chunk)}:normalize=0,apad,atrim=0:{END}[sfx]")
    out=f'sfx{ci//60}.wav'; parts.append(out)
    run(['ffmpeg','-y','-v','error']+inp+['-filter_complex',';'.join(fl),'-map','[sfx]',out])
inp=sum([['-i',p] for p in parts],[])
run(['ffmpeg','-y','-v','error']+inp+['-filter_complex',''.join(f'[{i}]' for i in range(len(parts)))+f'amix=inputs={len(parts)}:normalize=0[o]','-map','[o]','sfx.wav'])
# music: suspense (hook) -> jazz -> suspense (crash) -> jazz
SUS=LIB+'music/Intense Suspense - Audionautix.mp3'; JAZ=LIB+'music/Jazz In Paris - Media Right Productions.mp3'
tw0=cue(5,'this is the time wall')-0.8; tw1=cue(5,'the people who break')
dc0=cue(10,'and you face')-0.5; dc1=cue(10,"it's so tempting")
segs=[(SUS,0,TITLE_T+0.2,-27),(JAZ,TITLE_T+0.1,tw0+0.4,-30),(SUS,tw0,tw1+0.4,-29),(JAZ,tw1,dc0+0.4,-30),(SUS,dc0,dc1+0.4,-29),(JAZ,dc1,END,-30)]
inp=[];fl=[]
for k,(f,a,b,lu) in enumerate(segs):
    d=b-a; inp+=['-stream_loop','-1','-i',f]
    fl.append(f"[{k}]atrim=0:{d},aresample=48000,aformat=channel_layouts=stereo,loudnorm=I={lu}:TP=-8,afade=t=in:d=0.8,afade=t=out:st={max(0,d-1.2)}:d=1.2,adelay={int(a*1000)}:all=1[m{k}]")
fl.append(''.join(f'[m{k}]' for k in range(len(segs)))+f"amix=inputs={len(segs)}:normalize=0,apad,atrim=0:{END},afade=t=out:st={END-5}:d=5[mus]")
run(['ffmpeg','-y','-v','error']+inp+['-filter_complex',';'.join(fl),'-map','[mus]','music.wav'])
run(['ffmpeg','-y','-v','error','-i','vo.wav','-i','sfx.wav','-i','music.wav','-filter_complex',
 "[0]asplit=2[v1][v2];[2][v2]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=400[md];[v1][1][md]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[out]",
 '-map','[out]','-c:a','pcm_s16le','mix.wav'])
print('audio done',len(ev),END)
