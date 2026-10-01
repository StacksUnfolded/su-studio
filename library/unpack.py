import json,sys,os
d=open(sys.argv[1],'rb').read(); out=sys.argv[2]; os.makedirs(out,exist_ok=True)
m=json.loads(d[:8192].decode().strip()); o=8192
for n,s in m:
    if s<0: print('FAILED',n,s); continue
    open(os.path.join(out,n),'wb').write(d[o:o+s]); o+=s
print(o==len(d),len(m))
