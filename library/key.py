import numpy as np, os, glob, json
from PIL import Image
from scipy import ndimage
def key(path):
    a=np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    h,w,_=a.shape
    border=np.concatenate([a[:8].reshape(-1,3),a[-8:].reshape(-1,3),a[:,:8].reshape(-1,3),a[:,-8:].reshape(-1,3)])
    bg=np.median(border,0)
    R,G,B=a[...,0],a[...,1],a[...,2]
    m=np.minimum(R,B)-G
    bm=min(bg[0],bg[2])-bg[1]
    k=np.clip((m-0.25*bm)/(0.6*bm),0,1)
    # only key regions connected to the border (protect interior)
    cand=k>0.02
    lab,n=ndimage.label(cand)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    conn=np.isin(lab,list(edge))
    # interior holes: key components whose core is strongly magenta
    strong=k>0.6
    lab2,n2=ndimage.label(cand)
    keep=np.zeros(n2+1,bool)
    if n2:
        mx=ndimage.maximum(strong.astype(np.uint8),lab2,index=np.arange(1,n2+1)); keep[1:]=np.asarray(mx)>0
    k=np.where(conn|keep[lab2],k,0)
    alpha=1-k
    # unmix spill
    with np.errstate(divide='ignore',invalid='ignore'):
        C=(a-k[...,None]*bg)/np.maximum(alpha[...,None],1e-3)
    C=np.clip(C,0,255)
    # extra despill: clamp magenta cast on semi edges
    semi=(alpha<0.98)&(alpha>0)
    mx=np.minimum(C[...,0],C[...,2]); ex=np.clip(mx-C[...,1]-10,0,None)
    C[...,0]-=np.where(semi,ex,0); C[...,2]-=np.where(semi,ex,0)
    alpha[alpha<0.06]=0
    out=np.dstack([C,alpha*255]).astype(np.uint8)
    return Image.fromarray(out,'RGBA')
def trim(im,pad=6):
    bb=im.getchannel('A').point(lambda v:255 if v>10 else 0).getbbox()
    im=im.crop(bb); c=Image.new('RGBA',(im.width+2*pad,im.height+2*pad),(0,0,0,0)); c.paste(im,(pad,pad)); return c
os.makedirs('poses',exist_ok=True);os.makedirs('cast',exist_ok=True);os.makedirs('props',exist_ok=True);os.makedirs('plates',exist_ok=True)
for f in sorted(glob.glob('raw/P??.png')):
    n=os.path.basename(f)[:3]; im=trim(key(f))
    if n in('P03','P16'): im=im.transpose(Image.FLIP_LEFT_RIGHT)
    im.save(f'poses/{n}.png')
for f in sorted(glob.glob('raw/C??.png')):
    n=os.path.basename(f)[:3]; trim(key(f)).save(f'cast/{n}.png')
names={'PRA':['coins','cash','moneybag','piggybank','card','receipts','briefcase','goldbar','wallet','calculator','coinjar','plant'],
       'PRB':['phone','laptop','parcel','calendar','envelope','clock','car','house','sandwich','coffee','takeoutbag','firstaid']}
for s,nl in names.items():
    im=key(f'raw/{s}.png'); A=np.asarray(im)[...,3]>20
    A2=ndimage.binary_dilation(A,iterations=12)
    lab,n=ndimage.label(A2); objs=ndimage.find_objects(lab)
    items=[(o[0].start,o[1].start,o) for o in objs if (o[0].stop-o[0].start)*(o[1].stop-o[1].start)>4000]
    # sort into rows then cols
    items.sort(key=lambda t:t[0]); rows=[]
    for it in items:
        if rows and abs(it[0]-rows[-1][0][0])<200: rows[-1].append(it)
        else: rows.append([it])
    order=[it for r in rows for it in sorted(r,key=lambda t:t[1])]
    print(s,len(order))
    for nm,(y,x,o) in zip(nl,order):
        crop=im.crop((o[1].start,o[0].start,o[1].stop,o[0].stop))
        trim(crop).save(f'props/{nm}.png')
import shutil
for f in glob.glob('raw/L*.png')+['raw/I01.png']: shutil.copy(f,'plates/'+os.path.basename(f))
