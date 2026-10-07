# Shorts audio: voice (-15 LUFS) + ducked music + loudness-matched SFX capped 8 dB under the voice -> vo/short{A,B}_mix.wav
# usage: python3 mix_shorts.py /tmp/claude-0/ssfx6.json
import json, subprocess, sys, numpy as np
SR = 48000; FPS = 30
M = '../../../library/music/'; TRACK = {'A': M + 'Jazz In Paris - Media Right Productions.mp3', 'B': M + 'Intense Suspense - Audionautix.mp3'}
SFXDIR = '../../../remotion/public/sfx06/'
def load(p, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
def peak100(x):
    m = x.mean(1) if x.ndim > 1 else x; w = 4800
    return max((rms_db(m[i:i + w]) for i in range(0, max(1, len(m) - w + 1), 1200)), default=-99)
L = json.load(open(sys.argv[1]))
for k in ['A', 'B']:
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'short{k}.mp3'])) + 0.2
    fl = (f'[0]aresample={SR},aformat=channel_layouts=stereo,apad,atrim=0:{dur},loudnorm=I=-15:TP=-2:LRA=11,aresample={SR},asplit=3[v1][v2][v3];'
          f'[1]aresample={SR},aformat=channel_layouts=stereo,atrim=0:{dur},afade=t=in:d=0.3,volume=0.17[m];[m][v2]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=400[md];[v1][md]amix=inputs=2:normalize=0[out]')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', f'short{k}.mp3', '-stream_loop', '-1', '-i', TRACK[k], '-filter_complex', fl,
                    '-map', '[out]', '-c:a', 'pcm_f32le', f'/tmp/claude-0/s{k}_vm.wav', '-map', '[v3]', '-c:a', 'pcm_f32le', f'/tmp/claude-0/s{k}_v.wav'], check=True)
    base = load(f'/tmp/claude-0/s{k}_vm.wav'); voice = load(f'/tmp/claude-0/s{k}_v.wav').mean(1); N = len(base); cache = {}; gaps = []
    for n, t0, v in L[k]:
        if n == 'wrong': continue
        if n not in cache: cache[n] = load(SFXDIR + n + '.mp3')[:int(2.5 * SR)]
        s = int(round(max(0, round(t0 * FPS)) / FPS * SR)); a = cache[n][:max(0, N - s)] * (v if v is not None else 1.0)
        if not len(a): continue
        vw = voice[max(0, s - 14400): s + len(a) + 14400]; vl = peak100(vw) if len(vw) else -99
        lim = (vl - 8) if vl > -40 else -26; lev = peak100(a); g = 10 ** ((lim - lev) / 20) if lev > lim else 1.0
        base[s:s + len(a)] += a * g
        if vl > -40: gaps.append(lev + 20 * np.log10(g) - vl)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), '-c:a', 'pcm_s16le', f'../vo/short{k}_mix.wav'], input=base.astype(np.float32).tobytes(), check=True)
    print(k, round(dur, 2), 's; SFX vs voice dB: max', round(max(gaps), 1), 'median', round(float(np.median(gaps)), 1))
