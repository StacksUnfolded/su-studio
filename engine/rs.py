import sys,os,json,math,re,subprocess
_here=os.getcwd(); sys.path.insert(0,os.path.join(_here,'..','edit'))
os.chdir(os.path.join(_here,'..','edit'))
import render as R
os.chdir(_here)
from paths import LIB
from PIL import Image,ImageDraw,ImageFilter
from overlays import F,FA,FB,FR,pill,rlen
W,H=1080,1920; FPS=30
GOLD=R.GOLD; INK=R.INK; RED=R.RED; GREEN=R.GREEN; WHITE=(255,255,255)
ease,eout,pop,T,paste_c,cut,label_img=R.ease,R.eout,R.pop,R.T,R.paste_c,R.cut,R.label_img
_pp={}
def pplate(name,fx):
    k=(name,round(fx,2))
    if k not in _pp:
        if name.startswith('G:'):
            kind=name[2:]; base=R.grad(kind).resize((3413,1920),Image.BICUBIC)
        else: base=R.plate(name).convert('RGB').resize((3413,1920),Image.LANCZOS)
        cx=int(fx*3413); x0=min(max(0,cx-W//2),3413-W)
        _pp[k]=base.crop((x0,0,x0+W,H)).convert('RGBA')
    return _pp[k]
def kb(im,s,e,t,motion,fy=0.5,a=0.06):
    p=ease((t-s)/max(1e-6,e-s))
    z=1+a*p if motion=='in' else (1+a*(1-p) if motion=='out' else (1.1+0.03*p if motion=='punch' else 1.0))
    if z==1.0: return im
    vw,vh=W/z,H/z; cx=W/2; cy=vh/2+fy*(H-vh)
    return im.transform((W,H),Image.AFFINE,(1/z,0,cx-W/2/z,0,1/z,cy-H/2/z),resample=Image.BILINEAR)
def run(name,words_key,shots,layers,sfx,caps_off=()):
    words=json.load(open('words.json'))[words_key]
    txt=open(f'{name}.txt').read()
    dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{name}.mp3']))
    TOT=round(dur+0.05,2)
    # caption groups: map display words to aligned tokens
    from pocketsphinx import Decoder
    d=Decoder(samprate=16000)
    def ntok(w):
        t=re.sub(r"[^A-Za-z0-9'-]",'',w); t='twenty twenty five' if t=='2025' else t
        return [x for x in re.findall(r"[a-zA-Z']+",t.replace('-',' ').lower()) if d.lookup_word(x)]
    disp=[];k=0
    for w in txt.split():
        n=len(ntok(w))
        if n==0 or k>=len(words): disp.append([w,None,None]); continue
        disp.append([w,words[k][1],words[min(k+n,len(words))-1][2]]); k+=n
    for i,x in enumerate(disp):
        if x[1] is None: prev=next((disp[j][2] for j in range(i-1,-1,-1) if disp[j][2]),0); x[1]=x[2]=prev
    groups=[];cur=[]
    for w in disp:
        cur.append(w)
        if len(cur)>=3 or w[0][-1] in '.?!,…:' : groups.append(cur); cur=[]
    if cur: groups.append(cur)
    def caption(fr,t):
        if any(a<=t<b for a,b in caps_off): return
        g=next((g for i,g in enumerate(groups) if g[0][1]<=t<(groups[i+1][0][1] if i+1<len(groups) else g[-1][2]+0.4)),None)
        if not g: return
        items=[]
        for w,s_,e in g:
            word=w.upper().strip('"'); col=GOLD if s_<=t<e+0.08 else WHITE
            items.append(T(word,FA,92,col,INK,10))
        tw=sum(i.width for i in items)+18*(len(items)-1); hh=max(i.height for i in items)
        gim=Image.new('RGBA',(tw,hh),(0,0,0,0)); x=0
        for im in items: gim.alpha_composite(im,(x,(hh-im.height)//2)); x+=im.width+18
        sc=min(1,1000/tw); paste_c(fr,gim,540,700,sc*pop(t,g[0][1],0.18))
    def frame(t):
        i=max(k for k,s in enumerate(shots) if s['t']<=t); s=shots[i]; e=shots[i+1]['t'] if i+1<len(shots) else TOT
        fr=pplate(s['plate'],s.get('fx',0.5)).copy()
        if s.get('night'): fr.alpha_composite(Image.new('RGBA',(W,H),(10,20,60,70)))
        for a in s.get('actors',[]): R.draw_actor(fr,a,t,s['t'])
        for p in s.get('props',[]): R.draw_prop(fr,p,t,s['t'])
        fr=kb(fr,s['t'],e,t,s.get('motion','in'),s.get('fy',0.6))
        tt=t-s['t']
        if i>0 and tt<0.12 and s.get('tr','flash')=='flash': fr.alpha_composite(Image.new('RGBA',(W,H),(255,255,255,int(180*(1-tt/0.12)))))
        for l in layers:
            if l['t0']<=t<l['t1']: DYN[l['kind']](fr,t,l)
        caption(fr,t)
        return fr.convert('RGB')
    return frame,TOT
# ---- portrait layers ----
def big(fr,t,l):
    im=T(l['text'],FA,l.get('size',140),l.get('col',GOLD),INK,12)
    if im.width>1000: im=im.resize((1000,int(im.height*1000/im.width)),Image.BICUBIC)
    paste_c(fr,im,540,l.get('y',330),pop(t,l['t0'],0.25),1-ease((t-(l['t1']-0.15))/0.15))
def tag(fr,t,l):
    paste_c(fr,label_img(l['text'],l.get('col',GOLD)),l.get('x',540),l['y'],1.5*pop(t,l['t0']),1-ease((t-(l['t1']-0.15))/0.15))
def src(fr,t,l):
    f=F(FR,28); w=int(rlen(l['text'],f))+40; d=ImageDraw.Draw(fr)
    d.rounded_rectangle([540-w/2,90,540+w/2,140],14,fill=(17,19,21,205)); d.text((540,115),l['text'],font=f,anchor='mm',fill=(225,225,225))
def stamp(fr,t,l): R.stamp(fr,t,l['t0'],l['t1'],x=l.get('x',540),y=l.get('y',520))
def count(fr,t,l):
    v=l['keys'][0][1]
    for i,(tk,val) in enumerate(l['keys']):
        if t>=tk:
            prev=l['keys'][i-1][1] if i else val; v=prev+(val-prev)*ease((t-tk)/0.6)
    col=RED if v<10 else (GOLD if v>60 else WHITE)
    paste_c(fr,T(f'{round(v)}',FA,230,col,INK,14),540,300,1)
    paste_c(fr,T('HOURS LEFT',FB,44,WHITE,INK,6),540,440,1)
    d=ImageDraw.Draw(fr); d.rounded_rectangle([140,490,940,524],12,fill=(40,48,52,230)); fw=800*max(0,v)/168
    if fw>8: d.rounded_rectangle([140,490,140+fw,524],12,fill=RED if v<10 else GREEN)
def bars2(fr,t,l):
    d=ImageDraw.Draw(fr); d.rounded_rectangle([160,140,920,560],26,fill=(17,19,21,225),outline=GOLD,width=4)
    for i,(lab,v,txt,col,ti) in enumerate(l['items']):
        if t<ti: continue
        p=eout((t-ti)/0.6); cx=350+i*380; base=500; top=base-300*v/885*p
        d.rounded_rectangle([cx-80,top,cx+80,base],12,fill=col,outline=INK,width=5)
        d.text((cx,530),lab,font=F(FB,30),anchor='mm',fill=(243,233,210))
        if p>0.6: paste_c(fr,T(txt,FA,70,WHITE,INK,8),cx,top-40,pop(t,ti+0.4))
DYN={'big':big,'tag':tag,'src':src,'stamp':stamp,'count':count,'bars2':bars2}
def render(frame,TOT,out):
    ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
    for f in range(int(TOT*FPS)): ff.stdin.write(frame(f/FPS).tobytes())
    ff.stdin.close(); ff.wait()
def mix(name,sfx,TOT,out):
    M={'whoosh':'Whoosh','pop':'Pop','ding':'Ding','wrong':'Wrong','riser':'Riser','wow':'Wow','register':'Cash Register','coin':'Coin Drop','paper':'Paper','stamp':'Stamp','drag':'Drag','scratch':'Record Scratch','phone':'Phone ring','tick':'Clock Tick','thump':'Thump Individual','violin':'Sad Violin','typing':'Typing'}
    VOL={'pop':0.4,'whoosh':0.35,'ding':0.3,'wrong':0.3,'riser':0.28,'wow':0.3,'register':0.3,'coin':0.45,'paper':0.4,'stamp':0.45,'drag':0.35,'scratch':0.4,'phone':0.2,'tick':0.3,'thump':0.55,'violin':0.25,'typing':0.25}
    inp=['-i',f'{name}.mp3'];fl=['[0]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-15:TP=-2,adelay=0:all=1[v]']
    for k,(n,t) in enumerate(sfx):
        inp+=['-i',LIB+f'sfx/{M[n]}.mp3']; fl.append(f"[{k+1}]aresample=48000,aformat=channel_layouts=stereo,atrim=0:1.8,afade=t=out:st=1.5:d=0.3,volume={VOL[n]},adelay={int(max(0,t)*1000)}:all=1[s{k}]")
    inp+=['-stream_loop','-1','-i',LIB+'music/Jazz In Paris - Media Right Productions.mp3']; m=len(sfx)+1
    fl.append(f'[{m}]atrim=0:{TOT},aresample=48000,aformat=channel_layouts=stereo,volume=0.07[mu]')
    fl.append('[v]'+''.join(f'[s{k}]' for k in range(len(sfx)))+f'[mu]amix=inputs={len(sfx)+2}:normalize=0,apad,atrim=0:{TOT},alimiter=limit=0.9[o]')
    subprocess.run(['ffmpeg','-y','-v','error']+inp+['-filter_complex',';'.join(fl),'-map','[o]','-c:a','aac','-b:a','192k',out],check=True)
