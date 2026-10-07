# V06 full audio mix -> vo/v06_mix_full.wav
#   1. voice placed at the section offsets, loudness-normalised to -16 LUFS
#   2. music bed (Jazz -> Intense Suspense for levels 5-7 -> Jazz), side-chain ducked under the voice
#   3. sound effects from the loudness-matched set (remotion/public/sfx06), then MEASURED against the voice:
#      every effect is turned down until its loudest 100 ms sits at least 8 dB under the voice around it
#      (or under -26 dBFS RMS when nobody is talking). Fin asked for SFX that are never too loud.
# usage: python3 mix.py sfxlist.json        (sfxlist.json is exported from remotion/src/v06/shots.ts)
import json, subprocess, sys, numpy as np
SR = 48000; FPS = 30
T = json.load(open('../../remotion/src/v06/timeline.json')); offs = T['offs']; TOT = T['total']
M = '../../library/music/'; JAZZ = M + 'Jazz In Paris - Media Right Productions.mp3'; SUSP = M + 'Intense Suspense - Audionautix.mp3'
SFXDIR = '../../remotion/public/sfx06/'
def run(c): subprocess.run(c, check=True)
def load(p, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
def cue(sec, word):  # first word time in a section
    for w in T['words']:
        if w[0] == sec and w[1] == word: return w[2]
    return offs[sec]
S5 = T['cards'][[k['sec'] for k in T['cards']].index(7)]['t']      # level 5 card
S8 = T['cards'][[k['sec'] for k in T['cards']].index(10)]['t']     # level 8 card

# ---- 1+2: voice + music with ffmpeg
inp = []; fl = []
for i, o in enumerate(offs):
    inp += ['-i', f'vo/sec{i:02d}.mp3']; fl.append(f'[{i}]aresample={SR},aformat=channel_layouts=stereo,adelay={int(o*1000)}:all=1[a{i}]')
n = len(offs)
fl.append(''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad,atrim=0:{TOT},loudnorm=I=-16:TP=-2:LRA=11,aresample={SR}[vo]')
inp += ['-stream_loop', '-1', '-i', JAZZ, '-stream_loop', '-1', '-i', SUSP, '-stream_loop', '-1', '-i', JAZZ]
j1, s1, j2 = n, n + 1, n + 2
fl.append(f'[{j1}]aresample={SR},aformat=channel_layouts=stereo,atrim=0:{S5+1},afade=t=out:st={S5-0.5}:d=1.5,volume=0.15[m1]')
fl.append(f'[{s1}]aresample={SR},aformat=channel_layouts=stereo,atrim=0:{S8-S5+1.5},afade=t=in:d=1,afade=t=out:st={S8-S5}:d=1.5,volume=0.14,adelay={int((S5-0.5)*1000)}:all=1[m2]')
fl.append(f'[{j2}]aresample={SR},aformat=channel_layouts=stereo,atrim=0:{TOT-S8+1},afade=t=in:d=2,afade=t=out:st={TOT-S8-1.5}:d=2,volume=0.15,adelay={int((S8-0.2)*1000)}:all=1[m3]')
fl.append(f'[m1][m2][m3]amix=inputs=3:normalize=0,apad,atrim=0:{TOT}[mus]')
fl.append('[vo]asplit=3[v1][v2][v3];[mus][v2]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=450[md];[v1][md]amix=inputs=2:normalize=0,aresample=48000[out]')
run(['ffmpeg', '-y', '-v', 'error'] + inp + ['-filter_complex', ';'.join(fl), '-map', '[out]', '-c:a', 'pcm_f32le', 'vo/v06_vomus.wav', '-map', '[v3]', '-c:a', 'pcm_f32le', 'vo/v06_voonly.wav'])

# ---- 3: SFX, measured against the voice
base = load('vo/v06_vomus.wav'); voice = load('vo/v06_voonly.wav').mean(1)
N = int(TOT * SR); base = np.pad(base, ((0, max(0, N - len(base))), (0, 0)))[:N]; voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
def peak100(x):
    m = x.mean(1) if x.ndim > 1 else x; w = 4800
    return max((rms_db(m[i:i + w]) for i in range(0, max(1, len(m) - w + 1), 1200)), default=-99)
cache = {}; report = []
for n, t0, v in json.load(open(sys.argv[1])):
    if n == 'wrong': continue                      # banned
    if n not in cache: cache[n] = load(SFXDIR + n + '.mp3')[:int(2.5 * SR)]
    s = int(round(max(0, round(t0 * FPS)) / FPS * SR)); a = cache[n][:max(0, N - s)] * (v if v is not None else 1.0)
    if not len(a): continue
    vwin = voice[max(0, s - int(0.3 * SR)): s + len(a) + int(0.3 * SR)]
    vlev = peak100(vwin) if len(vwin) else -99
    limit = (vlev - 8) if vlev > -40 else -26        # 8 dB under the voice, or -26 dBFS in a pause
    lev = peak100(a); g = 1.0
    if lev > limit: g = 10 ** ((limit - lev) / 20)
    base[s:s + len(a)] += a * g
    report.append((round(float(t0), 2), n, round(float(lev), 1), round(float(vlev), 1), round(float(20 * np.log10(g)), 1)))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', 'vo/v06_mix_full.wav'], input=base.astype(np.float32).tobytes(), check=True)
cut = [r for r in report if r[4] < 0]
print(f'{len(report)} effects placed; {len(cut)} turned down to stay under the voice')
gaps = [r[2] + r[4] - r[3] for r in report if r[3] > -40]
print('effect level vs voice (dB): max', round(max(gaps), 1), 'median', round(float(np.median(gaps)), 1))
json.dump(report, open('vo/sfx_report.json', 'w'))
