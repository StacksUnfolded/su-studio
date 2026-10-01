from PIL import Image,ImageDraw,ImageFont
from paths import FONTS
FB=FONTS+'montserrat-latin-800-normal.woff'
FR=FONTS+'montserrat-latin-400-normal.woff'
FA=FONTS+'anton-latin-400-normal.woff'
W,H=1920,1080
def F(p,s): return ImageFont.truetype(p,s)
FD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
SPECIAL=set('→←≠·')
def runs(text):
    out=[];cur='';sp=None
    for ch in text:
        s=ch in SPECIAL
        if sp is None or s==sp: cur+=ch
        else: out.append((cur,sp)); cur=ch
        sp=s
    if cur: out.append((cur,sp))
    return out
def rtext(d,x,y,text,font,fill):
    fd=ImageFont.truetype(FD,font.size)
    asc=font.getbbox('H')[1]
    for seg,sp in runs(text):
        f=fd if sp else font
        oy=0 if not sp else (asc-fd.getbbox('H')[1])
        d.text((x,y+oy),seg,font=f,fill=fill); x+=f.getlength(seg)
def rlen(text,font):
    fd=ImageFont.truetype(FD,font.size)
    return sum((fd if sp else font).getlength(s) for s,sp in runs(text))
def pill(d,cx,cy,text,font,fg=(255,255,255,255),bg=(17,19,21,225),px=34,py=18,r=24,anchor='c',x0=None):
    b=d.textbbox((0,0),'Hg',font=font); tw,th=rlen(text,font),b[3]-b[1]
    w,h=tw+2*px,th+2*py
    x=cx-w/2 if x0 is None else x0; y=cy-h/2
    d.rounded_rectangle([x,y,x+w,y+h],r,fill=bg)
    rtext(d,x+px,y+py-b[1],text,font,fg)
def fit(text,path,size,maxw):
    while size>20:
        f=F(path,size)
        if rlen(text,f)<=maxw: return f
        size-=2
    return F(path,size)
def render(kind,text,out):
    im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im)
    if kind in('top','chain'):
        f=fit(text,FB,48,1640); pill(d,W/2,968,text,f)
    elif kind=='post':
        f=F(FB,44); fs=F(FR,28)
        tw=f.getlength(text); w=tw+80; x=W-60-w; y=70
        d.rounded_rectangle([x,y,x+w,y+170],26,fill=(255,255,255,245),outline=(17,19,21,255),width=4)
        d.ellipse([x+30,y+24,x+80,y+74],fill=(101,115,131,255))
        d.text((x+95,y+32),'@just_a_normal_person  ·  1m',font=fs,fill=(90,90,90,255))
        d.text((x+40,y+95),text,font=f,fill=(17,19,21,255))
    elif kind=='big':
        f=fit(text,FA,170,1700)
        d.text((W/2,800),text,font=f,anchor='mm',fill=(230,199,119,255),stroke_width=12,stroke_fill=(17,19,21,255))
    elif kind=='stamp':
        f=F(FA,86); t=Image.new('RGBA',(900,260),(0,0,0,0)); td=ImageDraw.Draw(t)
        b=td.textbbox((0,0),text,font=f); tw=b[2]-b[0]
        td.rounded_rectangle([20,20,20+tw+60,20+140],12,outline=(200,50,60,255),width=10)
        td.text((50-b[0],48-b[1]),text,font=f,fill=(200,50,60,255))
        t=t.rotate(8,expand=True,resample=Image.BICUBIC); im.alpha_composite(t,(60,170))
    elif kind=='src':
        f=F(FR,30); pill(d,0,70,text,f,bg=(17,19,21,200),px=22,py=12,r=14,x0=60)
    elif kind=='phone':
        f=F(FB,58); d.text((968,470),'NO',font=f,anchor='mm',fill=(10,60,66,255)); d.text((968,540),'RESULTS',font=f,anchor='mm',fill=(10,60,66,255))
    elif kind=='tag':
        t,xy=text.split('@'); x,y=map(int,xy.split(','))
        pill(d,x,y,t,F(FB,36),fg=(17,19,21,255),bg=(230,199,119,245),px=22,py=12,r=16)
    elif kind in('q','q2','q3','keepq'):
        qs={'q':(0,'1. What do they actually own?'),'q2':(1,'2. What money does it make?'),'q3':(2,'3. How fast could it become cash?')}
        items=[qs[kind]] if kind!='keepq' else list(qs.values())
        for n,tx in items:
            f=F(FB,50); b=d.textbbox((0,0),tx,font=f)
            pill(d,0,230+n*120,tx,f,x0=70)
    im.save(out)
