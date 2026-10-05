# V05 VO + music premix -> vo/v05_vo_music.wav (SFX are mixed in Remotion; final loudnorm after render)
import json, subprocess
E = json.load(open('/tmp/claude-0/exp.json')); offs = E['offs']; TOT = E['total']; CH, OK, SPLIT, STOP = E['change'], E['ok'], E['split'], E['stop']
M = '/home/claude/su-studio/library/music/'; JAZZ = M + 'Jazz In Paris - Media Right Productions.mp3'; SUSP = M + 'Intense Suspense - Audionautix.mp3'
def run(c): subprocess.run(c, check=True)
inp = []; fl = []
for i, o in enumerate(offs):
    inp += ['-i', f'vo/sec{i:02d}.mp3']; fl.append(f'[{i}]aresample=48000,aformat=channel_layouts=stereo,adelay={int(o*1000)}:all=1[a{i}]')
n = len(offs)
fl.append(''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad,atrim=0:{TOT},loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[vo]')
# music bed: jazz -> suspense -> jazz
inp += ['-stream_loop', '-1', '-i', JAZZ, '-stream_loop', '-1', '-i', SUSP, '-stream_loop', '-1', '-i', JAZZ]
j1, s1, j2 = n, n + 1, n + 2
fl.append(f'[{j1}]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{CH+1},afade=t=out:st={CH-0.5}:d=1.5,volume=0.16[m1]')
fl.append(f'[{s1}]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{OK-CH+1.5},afade=t=in:d=1,afade=t=out:st={OK-CH}:d=1.5,volume=0.15,adelay={int((CH-0.5)*1000)}:all=1[m2]')
fl.append(f'[{j2}]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{TOT-OK+1},afade=t=in:d=2,afade=t=out:st={TOT-OK-1.5}:d=2,volume=0.16,adelay={int((OK-0.2)*1000)}:all=1[m3]')
# music drop when you split your groceries
fl.append(f"[m1][m2][m3]amix=inputs=3:normalize=0,apad,atrim=0:{TOT},volume='if(between(t,{SPLIT+0.8},{STOP+2.2}),0.15,1)':eval=frame[mus]")
fl.append('[vo]asplit=2[v1][v2];[mus][v2]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=450[md];[v1][md]amix=inputs=2:normalize=0,aresample=48000[out]')
run(['ffmpeg', '-y', '-v', 'error'] + inp + ['-filter_complex', ';'.join(fl), '-map', '[out]', '-c:a', 'pcm_s16le', 'vo/v05_vo_music.wav'])
print('ok')
