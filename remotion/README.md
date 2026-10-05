# Remotion pilot (V04 hook, first 60 s)

React/Remotion version of the edit engine, rebuilt for V04's first minute to compare against the Python engine.

```bash
cd remotion && npm install
ffmpeg -i ../videos/V04/edit/mix.wav -t 60 public/v04hook.wav   # audio (mix from ./su.sh long V04)
npx remotion studio          # live preview with timeline
npx remotion render src/index.ts V04Hook out/V04-Hook-Remotion.mp4
```

- `src/data/v04hook.json`: shots, layers and SFX exported from `videos/V04/edit/shots.py`, plus each cut-out's aspect ratio and real foot line (`foot`).
- Rendering uses the `angle` GL backend. It's about 0.35 s per frame on 2 cores (`swangle` was 5x slower).
- `public/{poses,cast,props,plates}` are symlinks to `../library`.
