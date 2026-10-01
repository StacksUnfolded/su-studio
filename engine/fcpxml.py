import subprocess,os
import os
from paths import VIDEO
from shots import S
from timeline import TOTAL
FPS=30
def nfr(p): return int(subprocess.check_output(['ffprobe','-v','error','-count_packets','-select_streams','v:0','-show_entries','stream=nb_read_packets','-of','csv=p=0',p]).strip())
def r(n): return f'{n}/30s'
clips=[f'c{i:03d}.mp4' for i in range(len(S))]
fr=[nfr('clips/'+c) for c in clips]; tot=sum(fr)
A=[];SP=[];off=0
for i,(c,n) in enumerate(zip(clips,fr)):
    A.append(f'<asset id="v{i}" name="{c}" start="0s" duration="{r(n)}" hasVideo="1" format="r1"><media-rep kind="original-media" src="file:///C:/Users/Finghin/Documents/Stacks%20Unfolded/V04/edit/clips/{c}"/></asset>')
    lbl=S[i].get('plate',S[i]['motion'])
    conn=''
    if i==0:
        for k,(nm,lane) in enumerate([('vo.m4a',-1),('sfx.m4a',-2),('music.m4a',-3)]):
            conn+=f'<asset-clip ref="a{k}" lane="{lane}" offset="0s" duration="{r(tot)}" name="{nm}" audioRole="dialogue"/>'
    SP.append(f'<asset-clip ref="v{i}" offset="{r(off)}" duration="{r(n)}" name="{i:03d} {lbl}">{conn}</asset-clip>'); off+=n
for k,nm in enumerate(['vo.m4a','sfx.m4a','music.m4a']):
    A.append(f'<asset id="a{k}" name="{nm}" start="0s" duration="{r(tot)}" hasAudio="1" audioSources="1" audioChannels="2" audioRate="48000"><media-rep kind="original-media" src="file:///C:/Users/Finghin/Documents/Stacks%20Unfolded/V04/edit/audio/{nm}"/></asset>')
x=f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
<resources><format id="r1" name="FFVideoFormat1080p30" frameDuration="1/30s" width="1920" height="1080"/>
{chr(10).join(A)}
</resources>
<library><event name="Stacks Unfolded V04"><project name="V04 Side Hustle">
<sequence format="r1" duration="{r(tot)}" tcStart="0s" tcFormat="NDF"><spine>
{chr(10).join(SP)}
</spine></sequence></project></event></library></fcpxml>'''
open('Stacks-Unfolded-'+os.path.basename(VIDEO.rstrip('/'))+'-Timeline.fcpxml','w').write(x); print('frames',tot)
