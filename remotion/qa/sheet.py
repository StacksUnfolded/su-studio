import sys
from PIL import Image, ImageDraw
ts=sys.argv[2:]; out=sys.argv[1]; cols=4; W,H=480,270
S=Image.new('RGB',(cols*W,((len(ts)+cols-1)//cols)*H))
for k,t in enumerate(ts):
    im=Image.open(f'qa/v06/t{t}.jpg').resize((W,H)); ImageDraw.Draw(im).text((5,5),t,fill='yellow'); S.paste(im,((k%cols)*W,(k//cols)*H))
S.save(out)
