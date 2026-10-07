# Loudness-matches every SFX so a volume of 1.0 means "about 10 dB under the voice".
# Target: loudest 100 ms window at -24 dBFS RMS, peaks capped at -9 dBFS. The banned 'wrong' buzzer is skipped.
import sys, os, subprocess, numpy as np
src, dst = sys.argv[1], sys.argv[2]; SR = 48000; TARGET = -24.0; PEAK = 10 ** (-9 / 20)
for f in sorted(os.listdir(src)):
    if not f.endswith('.mp3') or f.startswith('wrong'): continue
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(src, f), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout, np.float32).reshape(-1, 2).copy()
    m = x.mean(1); w = 4800
    r = max(np.sqrt(np.mean(m[i:i + w] ** 2)) for i in range(0, max(1, len(m) - w + 1), w // 2))
    x *= 10 ** ((TARGET - 20 * np.log10(r + 1e-9)) / 20)
    p = np.abs(x).max()
    if p > PEAK: x = np.tanh(x / PEAK) * PEAK          # soft-clip only the transient tip
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-b:a', '192k', os.path.join(dst, f)], input=x.astype(np.float32).tobytes())
    print(f, round(20 * np.log10(r), 1), '->', TARGET)
