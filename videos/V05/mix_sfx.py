# Mixes the SFX list exported from remotion/src/v05/shots.ts onto vo/v05_vo_music.wav,
# the same way Video05.tsx plays them (start rounded to the frame, 2.5 s max, linear volume).
import json, subprocess, numpy as np, sys
SR = 48000; FPS = 30
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
base = load('vo/v05_vo_music.wav')
total = float(sys.argv[2]) if len(sys.argv) > 2 else None
if total: base = np.pad(base, ((0, max(0, int(total * SR) - len(base))), (0, 0)))[:int(total * SR)]
cache = {}
for n, t0, *v in json.load(open(sys.argv[1])):
    vol = v[0] if v and v[0] is not None else 0.45
    if n not in cache: cache[n] = load(f'../../remotion/public/sfx05/{n}.mp3')[:int(2.5 * SR)]
    s = int(round(max(0, round(t0 * FPS)) / FPS * SR)); a = cache[n][:max(0, len(base) - s)]
    base[s:s + len(a)] += a * vol
print('peak', float(np.abs(base).max()))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', 'out/V05_mix_full.wav'], input=base.astype(np.float32).tobytes())
