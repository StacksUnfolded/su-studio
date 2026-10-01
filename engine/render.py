import subprocess,os,sys,math,random
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageEnhance
from paths import LIB,VIDEO
import overlays; overlays.SPECIAL.update(set('→←·×÷≈'))
from overlays import F, FA, FB, FR, pill, rlen
from shots import S,L,HOURS,SUB
from timeline import TOTAL,offs,durs,CARDS,CARD,TITLE,TITLE_T,cue,VOEND
FPS=30; OW,OH=1920,1080
GOLD=(230,199,119); INK=(17,19,21); CREAM=(243,233,210); RED=(200,50,60); GREEN=(70,170,100); TEAL=(14,40,44); WHITE=(255,255,255)
AMT={0:'$0',1:'$0',2:'$1',3:'$200/MO',4:'$400',5:'$10K/YR',6:'$20K',7:'$3K/MO',8:'$50K/YR',9:'$100K/YR',10:'$500K/YR',11:'$1,000,000'}
CARDAMT={1:'$0',2:'$1',3:'$200 A MONTH',4:'$400',5:'$10,000 A YEAR',6:'$20,000',7:'$3,000 A MONTH',8:'$50,000 A YEAR',9:'$100,000 A YEAR',10:'$500,000 A YEAR',11:'$1,000,000'}
def ease(p): p=max(0,min(1,p)); return p*p*(3-2*p)
def eout(p): p=max(0,min(1,p)); return 1-(1-p)**3
def pop(t,t0,d=0.28):
    if t<t0: return 0
    p=(t-t0)/d
    if p>=1: return 1
    return 1.18*math.sin(p*math.pi/2) if p<0.6 else 1.18-0.18*ease((p-0.6)/0.4)
def txtimg(text,font,fill,stroke=None,sw=0):
    d=ImageDraw.Draw(Image.new('RGBA',(10,10)));b=d.textbbox((0,0),text,font=font,stroke_width=sw)
    im=Image.new('RGBA',(b[2]-b[0]+8,b[3]-b[1]+8),(0,0,0,0))
    ImageDraw.Draw(im).text((4-b[0],4-b[1]),text,font=font,fill=fill,stroke_width=sw,stroke_fill=stroke); return im
_tx={}
def T(text,font,size,fill,stroke=INK,sw=0):
    k=(text,font,size,fill,stroke,sw)
    if k not in _tx: _tx[k]=txtimg(text,F(font,size),fill,stroke,sw)
    return _tx[k]
def paste_c(fr,im,cx,cy,s=1.0,alpha=1.0,rot=0):
    if s<=0.01 or alpha<=0.01: return
    if s!=1: im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.BICUBIC)
    if rot: im=im.rotate(rot,expand=True,resample=Image.BICUBIC)
    if alpha<1: im=im.copy(); im.putalpha(im.getchannel('A').point(lambda v:int(v*alpha)))
    fr.alpha_composite(im,(int(cx-im.width/2),int(cy-im.height/2)))
# ---------------- library ----------------
def grad(kind):
    cols={'gold':((70,48,10),(214,160,50)),'teal':((8,28,32),(40,100,100)),'red':((40,8,12),(170,40,50)),'navy':((10,16,34),(40,64,120)),'green':((8,34,20),(50,140,80)),'purple':((24,12,40),(100,60,150))}[kind]
    im=Image.new('RGB',(OW,OH),cols[0])
    g=Image.new('L',(OW,OH),0);ImageDraw.Draw(g).ellipse([OW/2-820,OH/2-560,OW/2+820,OH/2+460],fill=190)
    g=g.filter(ImageFilter.GaussianBlur(200)); im.paste(Image.new('RGB',(OW,OH),cols[1]),(0,0),g)
    ray=Image.new('L',(OW,OH),0); rd=ImageDraw.Draw(ray)
    for a in range(0,360,15):
        r=a*math.pi/180; rd.polygon([(960,540),(960+2400*math.cos(r),540+2400*math.sin(r)),(960+2400*math.cos(r+0.13),540+2400*math.sin(r+0.13))],fill=13)
    ray=ray.filter(ImageFilter.GaussianBlur(3))
    im.paste(Image.new('RGB',(OW,OH),(255,255,255)),(0,0),ray)
    return im
_pl={}
def plate(name):
    if name not in _pl:
        if name.startswith('G:'): im=grad(name[2:])
        elif name.startswith('V01:'): im=Image.open(LIB+'plates/V01/SU_V01_'+name[4:]+'.png').convert('RGB').resize((OW,OH),Image.LANCZOS)
        else:
            im=Image.open(LIB+'plates/'+name+'.png').convert('RGB')
            if im.size!=(OW,OH): im=im.resize((OW,OH),Image.LANCZOS)
        _pl[name]=im.convert('RGBA')
    return _pl[name]
def libpath(code):
    if code[0]=='P' and code[1:].isdigit(): return LIB+'poses/'+code+'.png'
    if code[0]=='C' and code[1:].isdigit(): return LIB+'cast/'+code+'.png'
    return LIB+'props/'+code+'.png'
_raw={}; _cut={}
def cut(code,h,flip=False):
    k=(code,int(h),flip)
    if k not in _cut:
        if code not in _raw: _raw[code]=Image.open(libpath(code)).convert('RGBA')
        im=_raw[code]; w=max(1,int(im.width*h/im.height)); im=im.resize((w,int(h)),Image.LANCZOS)
        if flip: im=im.transpose(Image.FLIP_LEFT_RIGHT)
        _cut[k]=im
    return _cut[k]
_sh={}
def shadow(w):
    w=int(w)//4*4
    if w not in _sh:
        im=Image.new('RGBA',(w+80,90),(0,0,0,0)); ImageDraw.Draw(im).ellipse([40,30,w+40,60],fill=(0,0,0,120))
        _sh[w]=im.filter(ImageFilter.GaussianBlur(9))
    return _sh[w]
def actor_bbox_bottom(code):
    return 1.0
def draw_actor(fr,a,t,ts):
    code=a['c']; x,fy,h=a['x'],a['y'],a['h']; flip=a.get('flip',False); tin=a.get('t',ts); ent=a.get('enter','pop' if a.get('t') else None)
    if t<tin: return
    tt=t-tin; s=1.0; dx=0; dy=0; al=1.0
    if ent=='pop': s=0.86+0.14*pop(t,tin,0.26) if tt<0.26 else 1.0
    elif ent in('L','R'): p=eout(tt/0.45); dx=(-1 if ent=='L' else 1)*(1-p)*1200
    elif ent=='drop': p=eout(tt/0.4); dy=-(1-p)*900
    elif ent=='fade': al=ease(tt/0.3)
    ex=a.get('exit')
    if ex:
        te,kind=ex
        if t>=te:
            p=ease((t-te)/0.45)
            if kind in('L','R'): dx+=(-1 if kind=='L' else 1)*p*1400
            elif kind=='fade': al*=1-p
    bob=0 if a.get('still') else 5*math.sin(2*math.pi*(t-ts)/2.3+x*0.01)
    im=cut(code,h,flip)
    if s!=1: im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.BICUBIC)
    if not a.get('noshadow'):
        sh=shadow(im.width*0.62)
        if al<1: sh=sh.copy(); sh.putalpha(sh.getchannel('A').point(lambda v:int(v*al)))
        fr.alpha_composite(sh,(int(x+dx-sh.width/2),int(fy-58)))
    if al<1: im=im.copy(); im.putalpha(im.getchannel('A').point(lambda v:int(v*al)))
    fr.alpha_composite(im,(int(x+dx-im.width/2),int(fy+dy-im.height+bob*(0 if ent=='drop' and tt<0.4 else 1)-6)))
def draw_prop(fr,p,t,ts):
    code,x,y,h=p['c'],p['x'],p['y'],p['h']; tin=p.get('t',ts)
    if t<tin: return
    s=pop(t,tin,0.3); te=p.get('t1')
    if te and t>=te: s*=1-ease((t-te)/0.25)
    if s<=0.01: return
    fl=0 if p.get('still') else 6*math.sin(2*math.pi*(t-tin)/1.9+x*0.02)
    im=cut(code,h,p.get('flip',False))
    if p.get('label'):
        pass
    paste_c(fr,im,x,y+fl,s,1,p.get('rot',0))
    if p.get('label'):
        lb=label_img(p['label'],p.get('lcol',GOLD)); paste_c(fr,lb,x,y+fl+h*0.5+34,s)
_lb={}
def label_img(text,col=GOLD):
    k=(text,col)
    if k not in _lb:
        f=F(FB,34); w=int(rlen(text,f))+44
        im=Image.new('RGBA',(w,62),(0,0,0,0)); d=ImageDraw.Draw(im)
        d.rounded_rectangle([0,0,w-1,61],16,fill=col+(245,),outline=INK+(255,),width=4)
        d.text((w/2,31),text,font=f,anchor='mm',fill=INK); _lb[k]=im
    return _lb[k]
def comp_base(s,t):
    fr=plate(s['plate']).copy()
    if s.get('tint'): fr.alpha_composite(Image.new('RGBA',(OW,OH),s['tint']))
    items=[('a',a) for a in s.get('actors',[])]+[('p',p) for p in s.get('props',[])]
    items.sort(key=lambda it:it[1].get('z',it[1]['y']))
    for k,it in items:
        if k=='a': draw_actor(fr,it,t,s['t'])
        else: draw_prop(fr,it,t,s['t'])
    return fr
def kb(im,s,e,t,motion,focus,a=0.07):
    n=max(1e-6,e-s); p=ease((t-s)/n); fx,fy=focus
    if motion=='in': z=1+a*p; px,py=fx,fy
    elif motion=='out': z=1+a*(1-p); px,py=fx,fy
    elif motion=='panR': z=1.10; px,py=0.2+0.6*p,fy
    elif motion=='panL': z=1.10; px,py=0.8-0.6*p,fy
    elif motion=='punch': z=1.12+0.03*p; px,py=fx,fy
    else: z=1.0; px,py=0.5,0.5
    if abs(z-1)<1e-4: return im
    k=z; vw,vh=OW/k,OH/k
    cx=vw/2+px*(OW-vw); cy=vh/2+py*(OH-vh)
    return im.transform((OW,OH),Image.AFFINE,(1/k,0,cx-OW/2/k,0,1/k,cy-OH/2/k),resample=Image.BILINEAR)
# ---------------- cards ----------------
BG=grad('teal')
def blocks(d,x0,y,n,lit,sw,sh,sp,flash=None,r=10,ow=5):
    for i in range(n):
        x=x0+i*(sw+sp); f=GOLD if i<lit else (35,60,64)
        if flash is not None and i==lit-1: f=tuple(int(c+(255-c)*flash) for c in GOLD)
        d.rounded_rectangle([x,y,x+sw,y+sh],r,fill=f,outline=INK,width=ow)
def card(lv,tt):
    fr=BG.copy().convert('RGBA')
    a=T(f'LEVEL {lv}',FA,250,GOLD,INK,14); b=T(CARDAMT[lv],FB,110 if len(CARDAMT[lv])<10 else 92,WHITE,INK,10); c=T(SUB[lv],FB,46,(200,215,215))
    paste_c(fr,a,960,380,pop(tt,0.05)); paste_c(fr,b,960,620,pop(tt,0.2))
    d=ImageDraw.Draw(fr); n=11;sw=112;sp=14;x0=(OW-(n*sw+(n-1)*sp))/2
    lit=lv if tt>=0.45 else lv-1; fl=max(0,1-(tt-0.45)/0.35) if tt>=0.45 else None
    blocks(d,x0,780,n,lit,sw,34,sp,fl)
    paste_c(fr,c,960,880,1,ease((tt-0.6)/0.3))
    if 0.45<=tt<0.85:
        g=Image.new('L',(OW,OH),0);ImageDraw.Draw(g).ellipse([960-500,380-300,960+500,380+300],fill=int(90*(1-(tt-0.45)/0.4)))
        fr=Image.composite(Image.new('RGBA',(OW,OH),(255,240,200,255)),fr,g.filter(ImageFilter.GaussianBlur(120)))
    punch=1+0.25*ease((tt-(CARD-0.18))/0.18)
    if punch>1: k=punch; fr=fr.transform((OW,OH),Image.AFFINE,(1/k,0,960-960/k,0,1/k,540-540/k),resample=Image.BICUBIC)
    return fr
def title(tt):
    fr=grad('gold').convert('RGBA')
    paste_c(fr,T('YOUR LIFE AT',FA,120,WHITE,INK,10),960,230,pop(tt,0.05))
    paste_c(fr,T('EVERY LEVEL',FA,230,GOLD,INK,16),960,420,pop(tt,0.2))
    paste_c(fr,T('OF SIDE HUSTLE',FA,150,WHITE,INK,12),960,610,pop(tt,0.35))
    paste_c(fr,T('$0 TO $1,000,000',FB,80,(255,244,210),INK,8),960,780,pop(tt,0.6))
    paste_c(fr,cut('P10',480),1650,800,pop(tt,0.8,0.3))
    paste_c(fr,cut('cash',150),300,880,pop(tt,0.9,0.3),1,-12)
    if tt>TITLE-0.25:
        p=ease((tt-(TITLE-0.25))/0.25); k=1+0.3*p
        fr=fr.transform((OW,OH),Image.AFFINE,(1/k,0,960-960/k,0,1/k,540-540/k),resample=Image.BICUBIC)
        fr.alpha_composite(Image.new('RGBA',(OW,OH),(255,255,255,int(200*p))))
    return fr
def endscreen(tt):
    fr=grad('teal').convert('RGBA'); d=ImageDraw.Draw(fr)
    paste_c(fr,T('WATCH NEXT',FA,110,GOLD,INK,10),560,150,pop(tt,0.1))
    d.rounded_rectangle([110,260,1010,766],28,outline=GOLD,width=8)
    d.text((560,513),'EVERY LEVEL OF WEALTH',font=F(FB,44),anchor='mm',fill=(150,190,190))
    d.ellipse([1370,330,1730,690],outline=GOLD,width=8)
    d.text((1550,510),'SUBSCRIBE',font=F(FB,40),anchor='mm',fill=(150,190,190))
    draw_actor(fr,dict(c='P04',x=1180,y=1020,h=600,enter='pop',t=0.3),tt,0)
    paste_c(fr,T('Not financial, tax or legal advice. US tax rules simplified.',FR,28,(160,190,190)),960,1040,1,ease((tt-0.5)/0.5))
    return fr
# ---------------- HUD ----------------
def in_card(t): return any(t0<=t<t0+CARD for _,t0 in CARDS) or (TITLE_T<=t<TITLE_T+TITLE)
def level_at(t):
    lv=0
    for l,t0 in CARDS:
        if t>=t0+CARD*0.5: lv=l
    return lv
def hours_at(t):
    v=HOURS[0][1]
    for i,(tk,val) in enumerate(HOURS):
        if t>=tk:
            prev=HOURS[i-1][1] if i else val; v=prev+(val-prev)*ease((t-tk)/0.8)
    return v
def hud(fr,t,s):
    if s.get('nohud') or in_card(t) or t>=VOEND-0.5: return
    if t<cue(0,"let's rewind")+0.5: return
    lv=level_at(t); amt=AMT[lv]
    d=ImageDraw.Draw(fr); f1=F(FA,44); f2=F(FB,34)
    s1=f'LEVEL {lv}'; w1=f1.getlength(s1); w2=f2.getlength(amt)
    w=max(w1+26+w2+56,11*26+10*6+56); x1=OW-44; x0=x1-w; y0=36
    d.rounded_rectangle([x0,y0,x1,y0+118],22,fill=(17,19,21,215))
    d.text((x0+28,y0+14),s1,font=f1,fill=GOLD); d.text((x0+28+w1+26,y0+22),amt,font=f2,fill=WHITE)
    bw=(w-56-10*6)/11; blocks(d,x0+28,y0+80,11,lv,bw,18,6,r=5,ow=3)
    # hours meter
    if s.get('nohours'): return
    v=hours_at(t); x0=44; y0=36; w=420
    drop=any(0<=t-tk<0.9 and val<(HOURS[i-1][1] if i else val) for i,(tk,val) in enumerate(HOURS))
    d.rounded_rectangle([x0,y0,x0+w,y0+118],22,fill=(17,19,21,215))
    d.text((x0+26,y0+16),'FREE HOURS / WEEK',font=F(FB,26),fill=(200,210,215))
    d.text((x0+w-26,y0+10),f'{round(v)}',font=F(FA,46),anchor='ra',fill=RED if (drop or v<6) else GOLD)
    bx0,bx1,by=x0+26,x0+w-26,y0+82
    d.rounded_rectangle([bx0,by,bx1,by+20],8,fill=(40,48,52))
    fw=(bx1-bx0)*max(0,min(1,v/40))
    col=RED if v<8 else ((230,150,60) if v<16 else GREEN)
    if fw>6: d.rounded_rectangle([bx0,by,bx0+fw,by+20],8,fill=col)
    d.text((x0+26,y0+126),'illustrative',font=F(FR,20),fill=(170,180,185))
# ---------------- overlays ----------------
def actor_boxes(shot,t):
    out=[]
    if not shot or 'actors' not in shot: return out
    for a in shot['actors']:
        if a.get('t',-1)>t+0.05: continue
        ex=a.get('exit')
        if ex and t>ex[0]+0.3: continue
        im=cut(a['c'],a['h'],a.get('flip',False)); out.append((a['x']-im.width/2,a['y']-im.height,a['x']+im.width/2,a['y']))
    return out
def bigtext(fr,t,t0,t1,text,y=800,col=GOLD,size=150,shot=None):
    im=T(text,FA,size if len(text)<16 else int(size*0.78),col,INK,12)
    if im.width>1760: im=im.resize((1760,int(im.height*1760/im.width)),Image.BICUBIC)
    x=960; bx=actor_boxes(shot,t)
    def hit(cx,w,h): return any(cx-w/2<b[2]+20 and cx+w/2>b[0]-20 and y-h/2<b[3] and y+h/2>b[1] for b in bx)
    if hit(x,im.width,im.height):
        # find widest free horizontal span in this text row
        occ=sorted([(b[0]-30,b[2]+30) for b in bx if y-im.height/2<b[3] and y+im.height/2>b[1]])
        spans=[];cur=40
        for a,b in occ:
            if a>cur: spans.append((cur,a))
            cur=max(cur,b)
        if cur<OW-40: spans.append((cur,OW-40))
        if spans:
            a,b=max(spans,key=lambda p:p[1]-p[0]); wmax=b-a
            if im.width>wmax: im=im.resize((int(wmax),int(im.height*wmax/im.width)),Image.BICUBIC)
            x=(a+b)/2
    paste_c(fr,im,x,y,pop(t,t0,0.25),1-ease((t-(t1-0.15))/0.15))
def free_spans(bx,y0,y1,margin=30):
    occ=sorted([(b[0]-margin,b[2]+margin) for b in bx if y0<b[3] and y1>b[1]])
    spans=[];cur=30
    for a,b in occ:
        if a>cur: spans.append((cur,a))
        cur=max(cur,b)
    if cur<OW-30: spans.append((cur,OW-30))
    return spans
def top(fr,t,t0,t1,text,shot=None):
    al=min(1,(t-t0)/0.18)*(1-ease((t-(t1-0.18))/0.18))
    bx=actor_boxes(shot,t); cy=968
    spans=free_spans(bx,cy-50,cy+50)
    full=(30,OW-30)
    a,b=max(spans,key=lambda p:p[1]-p[0]) if spans else full
    lines=[text]; size=50
    def fits(ls,sz): return all(rlen(l,F(FB,sz))+70<=b-a for l in ls)
    while size>30 and not fits(lines,size): size-=2
    if not fits(lines,size):
        wds=text.split(); best=None
        for k in range(1,len(wds)):
            l1,l2=' '.join(wds[:k]),' '.join(wds[k:]); m=max(len(l1),len(l2))
            if best is None or m<best[0]: best=(m,[l1,l2])
        lines=best[1]; size=46
        while size>28 and not fits(lines,size): size-=2
    lay=Image.new('RGBA',(OW,260),(0,0,0,0)); d=ImageDraw.Draw(lay)
    cx=(a+b)/2
    if len(lines)==1: pill(d,cx,160,lines[0],F(FB,size))
    else:
        pill(d,cx,92,lines[0],F(FB,size)); pill(d,cx,172,lines[1],F(FB,size))
    if al<1: lay.putalpha(lay.getchannel('A').point(lambda v:int(v*al)))
    fr.alpha_composite(lay,(0,808+int(20*(1-eout((t-t0)/0.25)))))
def tag(fr,t,t0,t1,text,x,y,col=GOLD):
    im=label_img(text,col); paste_c(fr,im,x,y,pop(t,t0),1-ease((t-(t1-0.15))/0.15))
def src(fr,t,t0,t1,text):
    al=min(1,(t-t0)/0.25)*(1-ease((t-(t1-0.25))/0.25))
    f=F(FR,26); text='Source: '+text if not text.startswith('HYPO') else text; w=int(rlen(text,f))+44
    lay=Image.new('RGBA',(w,54),(0,0,0,0)); d=ImageDraw.Draw(lay); d.rounded_rectangle([0,0,w-1,53],14,fill=(17,19,21,205))
    d.text((22,27),text,font=f,anchor='lm',fill=(225,225,225));
    if al<1: lay.putalpha(lay.getchannel('A').point(lambda v:int(v*al)))
    fr.alpha_composite(lay,(44,196))
def stamp(fr,t,t0,t1,x=1560,y=250,text='HYPOTHETICAL'):
    k=('stamp',text)
    if k not in _tx:
        f=F(FA,74); tw=int(f.getlength(text)); im=Image.new('RGBA',(tw+100,170),(0,0,0,0)); d=ImageDraw.Draw(im)
        d.rounded_rectangle([10,10,tw+90,160],12,outline=RED+(255,),width=9); d.text((50,85),text,font=f,anchor='lm',fill=RED+(255,))
        _tx[k]=im.rotate(7,expand=True,resample=Image.BICUBIC)
    s=1.6-0.6*ease((t-t0)/0.16) if t-t0<0.16 else 1
    paste_c(fr,_tx[k],x,y,s,1-ease((t-(t1-0.15))/0.15))
def dim(fr,t,t0,t1,a=140):
    fr.alpha_composite(Image.new('RGBA',(OW,OH),(8,12,22,int(a*min(1,(t-t0)/0.3)*(1-ease((t-(t1-0.3))/0.3))))))
def panel(d,box,fill=(17,19,21),alpha=225,outline=GOLD,r=26):
    d.rounded_rectangle(box,r,fill=fill+(alpha,),outline=outline+(255,),width=4)
def notif(fr,t,t0,t1,title,body,right='',col=GREEN,y=170):
    p=eout((t-t0)/0.35); q=ease((t-(t1-0.3))/0.3); yy=-160+(y+160)*p-(y+160)*q
    w=900; h=150; im=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle([0,0,w-1,h-1],34,fill=(250,250,250,248),outline=INK+(255,),width=4)
    d.rounded_rectangle([28,30,118,120],22,fill=col+(255,)); d.text((73,75),'$',font=F(FA,64),anchor='mm',fill=WHITE)
    d.text((146,48),title,font=F(FB,38),anchor='lm',fill=INK); d.text((146,104),body,font=F(FR,32),anchor='lm',fill=(70,70,70))
    if right: d.text((w-34,75),right,font=F(FA,60),anchor='rm',fill=col)
    fr.alpha_composite(im,(960-w//2,int(yy-h/2)))
def clock(fr,t,t0,t1,x,y,r,h0,m0,h1=None,m1=None,ta=None,tb=None):
    s=pop(t,t0,0.3)
    if s<=0.01: return
    mins=h0*60+m0
    if h1 is not None and t>=ta: mins=mins+((h1*60+m1)-mins)*ease((t-ta)/max(0.05,tb-ta))
    im=Image.new('RGBA',(2*r+20,2*r+20),(0,0,0,0)); d=ImageDraw.Draw(im); c=r+10
    d.ellipse([10,10,10+2*r,10+2*r],fill=(250,246,236,255),outline=INK+(255,),width=max(6,r//14))
    for i in range(12):
        a=i*math.pi/6; d.line([c+r*0.80*math.sin(a),c-r*0.80*math.cos(a),c+r*0.92*math.sin(a),c-r*0.92*math.cos(a)],fill=INK,width=max(3,r//22))
    am=(mins%60)/60*2*math.pi; ah=((mins/60)%12)/12*2*math.pi
    d.line([c,c,c+r*0.5*math.sin(ah),c-r*0.5*math.cos(ah)],fill=INK,width=max(6,r//10))
    d.line([c,c,c+r*0.78*math.sin(am),c-r*0.78*math.cos(am)],fill=RED,width=max(4,r//16))
    d.ellipse([c-r//12,c-r//12,c+r//12,c+r//12],fill=INK)
    paste_c(fr,im,x,y,s,1-ease((t-(t1-0.15))/0.15))
def poll(fr,t,t0,t1,opts,ans,tlock,treveal):
    d=ImageDraw.Draw(fr); n=len(opts); w=440; gap=70; x0=(OW-(n*w+(n-1)*gap))/2; y=470
    for i,o in enumerate(opts):
        ti=t0+0.25*i
        if t<ti: continue
        s=pop(t,ti); win=t>=treveal and i==ans; lose=t>=treveal and i!=ans
        box=Image.new('RGBA',(w,260),(0,0,0,0)); bd=ImageDraw.Draw(box)
        fill=GOLD if win else ((60,64,70) if lose else (250,246,236))
        bd.rounded_rectangle([0,0,w-1,259],30,fill=fill+(250,),outline=INK+(255,),width=6)
        bd.text((w/2,62),'ABC'[i],font=F(FB,44),anchor='mm',fill=(120,120,120) if lose else RED)
        bd.text((w/2,160),o,font=F(FA,104),anchor='mm',fill=(120,120,120) if lose else INK)
        sc=s*(1+0.12*pop(t,treveal,0.35)-0.12*(1 if t>=treveal+0.35 else 0)) if win else s
        paste_c(fr,box,x0+i*(w+gap)+w/2,y,sc)
    if tlock<=t<treveal:
        rem=max(0,treveal-t); tot=treveal-tlock; r=70; cx,cy=960,800
        d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(17,19,21,230),outline=(80,80,80),width=10)
        d.arc([cx-r,cy-r,cx+r,cy+r],-90,-90+360*rem/tot,fill=GOLD,width=10)
        d.text((cx,cy),str(int(math.ceil(rem*3/tot))),font=F(FA,80),anchor='mm',fill=WHITE)
def bars(fr,t,t0,t1,items,title=None,box=(560,190,1360,860),maxv=None):
    X0,Y0,X1,Y1=box; d=ImageDraw.Draw(fr); panel(d,[X0,Y0,X1,Y1])
    if title: d.text(((X0+X1)/2,Y0+50),title,font=F(FA,50),anchor='mm',fill=GOLD)
    n=len(items); mv=maxv or max(v for _,v,_,_,_ in items); bw=(X1-X0-120)/n*0.6
    for i,(lab,v,txt,col,ti) in enumerate(items):
        if t<ti: continue
        p=eout((t-ti)/0.7); cx=X0+60+(X1-X0-120)/n*(i+0.5); base=Y1-80; top_=base-(base-Y0-150)*v/mv*p
        d.rounded_rectangle([cx-bw/2,top_,cx+bw/2,base],12,fill=col,outline=INK,width=5)
        d.text((cx,base+38),lab,font=F(FB,36),anchor='mm',fill=CREAM)
        if p>0.6: paste_c(fr,T(txt,FA,80,WHITE,INK,8),cx,top_-50,pop(t,ti+0.45))
def statcard(fr,t,t0,t1,big,cap,x=960,y=470,col=GOLD,size=230):
    a=T(big,FA,size,col,INK,14); paste_c(fr,a,x,y,pop(t,t0,0.3),1-ease((t-(t1-0.15))/0.15))
    if cap: paste_c(fr,T(cap,FB,48,WHITE,INK,6),x,y+size*0.62+10,pop(t,t0+0.2),1-ease((t-(t1-0.15))/0.15))
def eq(fr,t,t0,t1,parts,y=520,size=130):
    ims=[(T(txt,FA,size,col,INK,12),tm) for txt,tm,col in parts]; gap=40
    tw=sum(im.width for im,_ in ims)+gap*(len(ims)-1); x=(OW-tw)/2
    for im,tm in ims:
        paste_c(fr,im,x+im.width/2,y,pop(t,tm)); x+=im.width+gap
def cards3(fr,t,t0,t1,items,hl=None,y=500):
    n=len(items); w=520; gap=60; x0=(OW-(n*w+(n-1)*gap))/2
    for i,(ttl,icon,l1,l2,ti) in enumerate(items):
        if t<ti: continue
        act=None
        for a,b in (hl or []):
            if t>=a: act=b
        on=act is None or act==i
        box=Image.new('RGBA',(w,560),(0,0,0,0)); bd=ImageDraw.Draw(box)
        bd.rounded_rectangle([0,0,w-1,559],30,fill=(250,246,236,250) if on else (90,94,100,240),outline=INK+(255,),width=6)
        bd.text((w/2,58),f'TYPE {i+1}',font=F(FB,34),anchor='mm',fill=RED)
        bd.text((w/2,124),ttl,font=F(FA,66),anchor='mm',fill=INK)
        ic=cut(icon,170); box.alpha_composite(ic,(int(w/2-ic.width/2),175))
        bd.text((w/2,410),l1,font=F(FB,32),anchor='mm',fill=(30,110,60)); bd.text((w/2,470),l2,font=F(FB,32),anchor='mm',fill=(170,40,50))
        paste_c(fr,box,x0+i*(w+gap)+w/2,y,pop(t,ti)*(1.04 if on and hl else 1))
def week(fr,t,t0,t1,segs,thustle=None,y=520):
    X0,X1=140,1780; d=ImageDraw.Draw(fr); tot=168
    paste_c(fr,T('YOUR WEEK: 168 HOURS',FA,80,WHITE,INK,8),960,y-190,pop(t,t0))
    x=X0; d.rounded_rectangle([X0-6,y-66,X1+6,y+66],20,fill=(17,19,21,230))
    for lab,h,col,ti in segs:
        w=(X1-X0)*h/tot
        if t>=ti:
            p=eout((t-ti)/0.4); d.rounded_rectangle([x,y-58,x+w*p,y+58],14,fill=col,outline=INK,width=4)
            if p>0.8:
                d.text((x+w/2,y-8),lab,font=F(FB,30 if w>150 else 22),anchor='mm',fill=INK)
                d.text((x+w/2,y+32),f'{h}h',font=F(FA,34),anchor='mm',fill=INK)
        x+=w
    if thustle and t>=thustle:
        w=(X1-X0)*segs[-1][1]/tot; xs=X1-w; p=eout((t-thustle)/0.8)
        d.rounded_rectangle([xs,y-58,xs+w*p,y+58],14,fill=RED,outline=INK,width=4)
        if p>0.5: d.text((xs+w/2,y),'HUSTLE',font=F(FA,44),anchor='mm',fill=WHITE)
def steps(fr,t,t0,t1,items,y=300):
    n=len(items); w=520; gap=80; x0=(OW-(n*w+(n-1)*gap))/2; d=ImageDraw.Draw(fr)
    for i,(text,tm) in enumerate(items):
        if t<tm: continue
        s=pop(t,tm); x=x0+i*(w+gap)
        box=Image.new('RGBA',(w,180),(0,0,0,0)); bd=ImageDraw.Draw(box)
        bd.rounded_rectangle([0,0,w-1,179],26,fill=(250,246,236,248),outline=INK+(255,),width=5)
        bd.text((w/2,44),f'{i+1}',font=F(FA,44),anchor='mm',fill=RED)
        f=F(FA,52) if len(text)<16 else F(FA,42); bd.text((w/2,116),text,font=f,anchor='mm',fill=INK)
        paste_c(fr,box,x+w/2,y,s)
def checklist(fr,t,t0,t1,items,title,x0=70,y0=190,w=940):
    h=110+len(items)*84; d=ImageDraw.Draw(fr)
    p=eout((t-t0)/0.35); ox=-(1-p)*(w+100)
    panel(d,[x0+ox,y0,x0+w+ox,y0+h]); d.text((x0+40+ox,y0+56),title,font=F(FA,52),anchor='lm',fill=GOLD)
    for i,(text,tm) in enumerate(items):
        if t<tm: continue
        y=y0+130+i*84; s=pop(t,tm,0.25)
        d.rounded_rectangle([x0+42+ox,y-22,x0+86+ox,y+22],10,fill=GOLD,outline=INK,width=3)
        if s>0.5: d.line([x0+50+ox,y,x0+62+ox,y+12,x0+80+ox,y-14],fill=INK,width=7)
        a=ease((t-tm)/0.25); d.text((x0+110+ox,y),text,font=F(FB,36),anchor='lm',fill=tuple(int(c*a+17*(1-a)) for c in CREAM))
def prices(fr,t,t0,t1,items,y=450):
    n=len(items); d=ImageDraw.Draw(fr)
    for i,(txt,tm) in enumerate(items):
        if t<tm: continue
        x=380+i*(1160/(n-1)); yy=y+i*55
        tg=Image.new('RGBA',(260,150),(0,0,0,0)); td=ImageDraw.Draw(tg)
        td.polygon([(40,0),(259,0),(259,149),(40,149),(0,75)],fill=(250,246,236,255) if i<n-1 else RED+(255,),outline=INK+(255,))
        td.ellipse([22,62,40,80],fill=INK); td.text((150,75),txt,font=F(FA,78),anchor='mm',fill=INK if i<n-1 else WHITE)
        paste_c(fr,tg,x,yy,pop(t,tm),1,-8+4*i)
    last=[tm for _,tm in items if tm<=t]
    if len(last)>1:
        p=ease((t-items[0][1])/max(0.1,(items[-1][1]-items[0][1])))
        x0,y0=380,y+160; x1=380+1160*p; y1=y0+55*(n-1)*p
        d.line([x0,y0,x1,y1],fill=INK,width=22); d.line([x0,y0,x1,y1],fill=RED,width=12)
def waterfall(fr,t,t0,t1,items,box=(360,180,1560,860)):
    X0,Y0,X1,Y1=box; d=ImageDraw.Draw(fr); panel(d,[X0,Y0,X1,Y1])
    mv=items[0][1]; base=Y1-90; top_=Y0+120; n=len(items); cw=(X1-X0-160)/n; run=0
    for i,(lab,v,txt,col,ti) in enumerate(items):
        if t<ti: continue
        p=eout((t-ti)/0.6); cx=X0+80+cw*(i+0.5); bw=cw*0.62
        if i==0: a,b=0,v
        elif v<0: a,b=run+v,run
        else: a,b=0,v
        ya=base-(base-top_)*a/mv; yb=base-(base-top_)*b/mv
        if v<0: yb2=yb+(ya-yb)*p; d.rounded_rectangle([cx-bw/2,yb,cx+bw/2,yb2],10,fill=col,outline=INK,width=5)
        else: ya2=ya-(ya-yb)*p; d.rounded_rectangle([cx-bw/2,ya2,cx+bw/2,ya],10,fill=col,outline=INK,width=5)
        d.text((cx,base+42),lab,font=F(FB,34),anchor='mm',fill=CREAM)
        if p>0.6: paste_c(fr,T(txt,FA,70,WHITE,INK,8),cx,min(ya,yb)-44 if v>0 else (ya+yb)/2,pop(t,ti+0.4))
        run=b if i==0 else (run+v if v<0 else run)
def runway(fr,t,t0,t1,y=560):
    X0,X1=260,1660; d=ImageDraw.Draw(fr); p=eout((t-t0)/0.5)
    d.rounded_rectangle([X0-40,y-150,X1+40,y+150],26,fill=(17,19,21,225),outline=GOLD,width=4)
    d.text((960,y-100),'SAVINGS RUNWAY (MONTHS OF LIVING COSTS)',font=F(FB,36),anchor='mm',fill=CREAM)
    d.rounded_rectangle([X0,y-20,X0+(X1-X0)*p,y+20],12,fill=(60,70,80))
    for m in range(13):
        x=X0+(X1-X0)*m/12
        if x<=X0+(X1-X0)*p: d.line([x,y-30,x,y+30],fill=(200,200,200),width=3); d.text((x,y+62),str(m),font=F(FB,30),anchor='mm',fill=CREAM)
    if t>=t0+0.7:
        q=eout((t-t0-0.7)/0.6); xa=X0+(X1-X0)*6/12; xb=xa+(X1-X0)*6/12*q
        d.rounded_rectangle([xa,y-26,xb,y+26],14,fill=GOLD,outline=INK,width=4)
        if q>0.7: d.text(((xa+xb)/2,y-58),'6–12 MONTHS',font=F(FA,44),anchor='mm',fill=GOLD)
def comment(fr,t,t0,t1,text='My guess: Level ',y=520):
    s=pop(t,t0,0.3); w=1100; h=230
    im=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle([0,0,w-1,h-1],30,fill=(250,250,250,250),outline=INK+(255,),width=5)
    d.ellipse([34,40,124,130],fill=(90,110,130)); d.text((150,62),'@you  ·  just now',font=F(FB,30),anchor='lm',fill=(110,110,110))
    n=int(max(0,(t-t0-0.3))*14); shown=text[:n]; cur='|' if int(t*2.5)%2==0 else ''
    d.text((150,140),shown+cur,font=F(FB,54),anchor='lm',fill=INK)
    paste_c(fr,im,960,y,s)
    paste_c(fr,T('COMMENT BELOW',FA,80,GOLD,INK,8),960,y+220,pop(t,t0+0.4))
def burst(fr,t,t0,t1,n=34,seed=4):
    rnd=random.Random(seed); tt=t-t0
    if tt<0: return
    for i in range(n):
        a=rnd.uniform(-math.pi*0.95,-math.pi*0.05); v=rnd.uniform(900,1700); spin=rnd.uniform(-400,400)
        x=960+math.cos(a)*v*tt; y=560+math.sin(a)*v*tt+900*tt*tt
        if y>OH+200: continue
        im=cut('cash' if i%3 else 'coins',rnd.choice([90,110,130]))
        paste_c(fr,im,x,y,1,1,spin*tt)
def formpaper(fr,t,t0,t1,x=960,y=520,title='FORM 1099-K',sub='Payment card and third party network transactions'):
    p=eout((t-t0)/0.5); s=pop(t,t0,0.3)
    w,h=620,760; im=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle([0,0,w-1,h-1],16,fill=(252,252,248,255),outline=INK+(255,),width=5)
    d.text((40,60),title,font=F(FA,70),anchor='lm',fill=INK)
    d.text((40,120),sub,font=F(FR,22),anchor='lm',fill=(80,80,80))
    for i in range(9): yy=180+i*62; d.rectangle([40,yy,w-40,yy+40],outline=(150,150,150),width=2)
    d.text((w-60,h-60),'SAMPLE',font=F(FA,40),anchor='rm',fill=(200,60,60))
    paste_c(fr,im,x,y+(1-p)*500,s if s>0 else 0.01,1,-4)
def ladder(fr,t,t0,t1,marks=(),x0=560,y0=90):
    names=['$0 · The idea','$1 · First sale','$200/mo · The median','$400 · The taxman','$10K/yr · The time wall','$20K · The paperwork','$3K/mo · Lifestyle creep','$50K/yr · Copycats','$100K/yr · The big decision','$500K/yr · The boss','$1M · The real million']
    d=ImageDraw.Draw(fr); w=800; rh=68
    p=eout((t-t0)/0.4); panel(d,[x0,y0,x0+w,y0+60+11*rh],alpha=int(230*p))
    for i,nm in enumerate(names):
        ti=t0+0.15+0.06*i
        if t<ti: continue
        y=y0+30+i*rh; col=CREAM; bg=None
        for tm,lv,c,lab in marks:
            if t>=tm and lv==i+1: bg=c; lb=lab
        if bg:
            s=pop(t,[tm for tm,lv,_,_ in marks if lv==i+1][0],0.3)
            d.rounded_rectangle([x0+14,y+4,x0+w-14,y+rh-4],16,fill=bg,outline=INK,width=4)
            col=INK
            paste_c(fr,label_img(lb,bg),x0+w+30+label_img(lb,bg).width/2,y+rh/2,s)
        d.text((x0+40,y+rh/2),f'LEVEL {i+1}',font=F(FA,40),anchor='lm',fill=col if bg else GOLD)
        d.text((x0+230,y+rh/2),nm,font=F(FB,34),anchor='lm',fill=col)
def meterbig(fr,t,t0,t1,frm=0,to=1000000,ta=None,tb=None,snap=None):
    d=ImageDraw.Draw(fr); tt=t-t0
    v=frm
    if ta is not None and t>=ta: v=frm+(to-frm)*(ease((t-ta)/max(0.1,tb-ta))**2)
    if snap and t>=snap: v=0
    d.rounded_rectangle([360,770,1560,1040],34,fill=(17,19,21,230))
    d.text((960,850),f'${v:,.0f}',font=F(FA,110),anchor='mm',fill=GOLD if not(snap and t>=snap) else RED)
    lit=int(11*v/1000000+0.0001) if v<1000000 else 11
    fl=max(0,1-(t-tb)/0.3) if tb and tb<=t<tb+0.3 else None
    blocks(d,400,970,11,lit,90,34,10,fl)
DYN={'bigtext':bigtext,'top':top,'tag':tag,'src':src,'stamp':stamp,'dim':dim,'notif':notif,'clock':clock,'poll':poll,'bars':bars,'statcard':statcard,'eq':eq,'cards3':cards3,'week':week,'steps':steps,'checklist':checklist,'prices':prices,'waterfall':waterfall,'runway':runway,'comment':comment,'burst':burst,'formpaper':formpaper,'ladder':ladder,'meterbig':meterbig}
def layers(fr,t,s):
    for l in L:
        t0=l['t0']; t1=l['t1'] if l.get('t1') is not None else 1e9
        if not(t0<=t<t1): continue
        kw={x:y for x,y in l.items() if x not in('kind','t0','t1')}
        if l['kind'] in('bigtext','top'): kw['shot']=s
        DYN[l['kind']](fr,t,t0,t1,**kw)
# ---------------- transitions ----------------
def mblur(im,amt):
    if amt<2: return im
    w=max(8,int(OW/amt)); return im.resize((w,OH),Image.BILINEAR).resize((OW,OH),Image.BILINEAR)
def shot_end(i): return S[i+1]['t'] if i+1<len(S) else TOTAL
def shot_frame(i,t):
    s=S[i]; e=shot_end(i); m=s['motion']
    if m=='card': return card(s['ch'],t-s['t'])
    if m=='title': return title(t-s['t'])
    if m=='end': return endscreen(t-s['t'])
    fr=comp_base(s,t)
    fr=kb(fr,s['t'],e,t,m,s['focus'],s.get('za',0.07))
    if s.get('fx')=='rewind':
        fr=rewindfx(fr,t-s['t'])
    if s.get('fx')=='night': fr.alpha_composite(Image.new('RGBA',(OW,OH),(10,20,60,70)))
    return fr
def rewindfx(fr,tt):
    g=ImageEnhance.Color(fr.convert('RGB')).enhance(0.35); a=np.asarray(g).copy()
    rnd=np.random.RandomState(int(tt*30))
    for _ in range(6):
        y=rnd.randint(0,OH-40); h=rnd.randint(8,40); sh=rnd.randint(-60,60); a[y:y+h]=np.roll(a[y:y+h],sh,axis=1)
    a[::4]=(a[::4]*0.8).astype(np.uint8)
    im=Image.fromarray(a).convert('RGBA'); d=ImageDraw.Draw(im)
    if int(tt*3)%2==0: d.text((80,70),'◄◄  REWIND',font=F(FA,80),fill=WHITE)
    d.text((OW-80,OH-80),'6 MONTHS AGO',font=F(FB,44),anchor='rs',fill=WHITE)
    return im
def frame(i,t):
    s=S[i]; fr=shot_frame(i,t); tt=t-s['t']; tr=s.get('tr','cut'); D=s.get('xf',0.35)
    if i>0 and tt<D and tr!='cut':
        p=ease(tt/D)
        if tr=='fade': pf=shot_frame(i-1,t); fr=Image.blend(pf,fr,p)
        elif tr in('whip','whipL'):
            pf=shot_frame(i-1,t).convert('RGB'); cur=fr.convert('RGB'); amt=40*math.sin(math.pi*p)
            c=Image.new('RGB',(OW,OH)); off=int(OW*p)
            if tr=='whip': c.paste(mblur(pf,amt),(-off,0)); c.paste(mblur(cur,amt),(OW-off,0))
            else: c.paste(mblur(pf,amt),(off,0)); c.paste(mblur(cur,amt),(-OW+off,0))
            fr=c.convert('RGBA')
        elif tr=='zoom':
            k=1+0.25*(1-p); fr=fr.transform((OW,OH),Image.AFFINE,(1/k,0,960-960/k,0,1/k,540-540/k),resample=Image.BILINEAR)
            if p<0.6: fr=fr.filter(ImageFilter.GaussianBlur(8*(1-p/0.6)))
        elif tr=='flash': fr=fr.copy(); fr.alpha_composite(Image.new('RGBA',(OW,OH),(255,255,255,int(230*(1-p)))))
    if s['motion'] not in('card','title','end'):
        layers(fr,t,s); hud(fr,t,s); fr.alpha_composite(VIG)
    return fr.convert('RGB')
_v=Image.new('L',(OW,OH),0); ImageDraw.Draw(_v).rectangle([0,0,OW,OH],fill=255); ImageDraw.Draw(_v).ellipse([-260,-200,OW+260,OH+200],fill=0)
_v=_v.filter(ImageFilter.GaussianBlur(170)).point(lambda x:int(x*0.38))
VIG=Image.new('RGBA',(OW,OH),(0,0,0,0)); VIG.putalpha(_v)
def job(i):
    s=S[i]; e=shot_end(i)
    f0=round(s['t']*FPS); f1=round(e*FPS); out=f'clips/c{i:03d}.mp4'
    os.makedirs('clips',exist_ok=True)
    ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{OW}x{OH}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
    for f in range(f0,f1): ff.stdin.write(frame(i,f/FPS).tobytes())
    ff.stdin.close(); return i,f1-f0,ff.wait()
def at(t):
    i=max(k for k,s in enumerate(S) if s['t']<=t); return frame(i,t)
if __name__=='__main__':
    if sys.argv[1]=='test':
        os.makedirs(VIDEO+'qa',exist_ok=True)
        for x in sys.argv[2:]:
            t=float(x); at(t).save(VIDEO+f'qa/t_{t:07.2f}.jpg',quality=80)
    else:
        ids=[int(x) for x in sys.argv[1:]] if sys.argv[1]!='all' else range(len(S))
        from concurrent.futures import ProcessPoolExecutor
        with ProcessPoolExecutor(int(os.environ.get('NJ','2'))) as ex:
            for i,n,rc in ex.map(job,ids): print(i,n,'OK' if rc==0 else 'FAIL',flush=True)
