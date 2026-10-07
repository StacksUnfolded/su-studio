import sys,os
src,dst_dir=sys.argv[1],sys.argv[2]; base=os.path.basename(src); stem=os.path.splitext(base)[0]
data=b'SUDATA01'+open(src,'rb').read(); P=19_000_000; parts=[]
for i in range(0,len(data),P):
    n=f'{stem}.part{i//P+1:02d}.sud'; open(os.path.join(dst_dir,n),'wb').write(data[i:i+P]); parts.append(n)
bat=f'''@echo off
cd /d "%~dp0"
echo Joining {base} ...
copy /b {"+".join(parts)} "{stem}.joined.sud" >nul
powershell -NoProfile -Command "$b=[IO.File]::ReadAllBytes('%CD%\\{stem}.joined.sud'); $f=[IO.File]::Create('%CD%\\{base}'); $f.Write($b,8,$b.Length-8); $f.Close()"
if exist "{base}" (del "{stem}.joined.sud" & del {" ".join(parts)} & echo Done: {base}) else (echo Something went wrong - parts kept.)
'''
open(os.path.join(dst_dir,f'JOIN-{stem}.bat'),'w',newline='\r\n').write(bat)
print(parts, len(data))
