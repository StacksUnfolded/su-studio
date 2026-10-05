# Stacks Unfolded studio: instructions for Claude

This repo is the production kit for **Stacks Unfolded**, a faceless finance YouTube channel made with stickman-style animation. It is owned by Fin (UK). It contains the edit engine, the reusable asset library and one folder per video. V04 is the reference build.

## First thing in every session
```bash
./su.sh setup                     # ffmpeg, DejaVu font, pillow numpy opencv pocketsphinx
./su.sh test V04 30 538           # should write videos/V04/qa/t_0030.00.jpg and t_0538.00.jpg
```
Look at both stills (Read the jpgs). If they look right, the engine works.

## Channel rules (non-negotiable)
- **Host SU01:** round white head, black sunglasses, grey hoodie with the hood UP. Never a baby. Use the library poses (see `library/CATALOG.md`).
- **No real people and no logos** in any image. **Text never covers a face or a key object.** The engine's bigtext/top layers dodge actors automatically, but check the QA stills anyway.
- **Every stat** gets an on-screen source (`src(...)`) and goes in the description's Sources list.
- **Invented examples** get the HYPOTHETICAL stamp (`hypo(t0,t1)`) and are listed in the description.
- **Spelling:** American spelling in narration. Fin's own notes are in UK English.
- **Length:** about 15 minutes for the long video, built in an "Every Level" or story structure with retention hooks every 60–90 s. Make dedicated Shorts written from scratch, never cuts of the long video, at 30–45 s with a loop ending.
- **Voice:** ElevenLabs **Eleven v4**, voice `2nICQbZAqZdBaP1l1aiw`. Do **not** use ElevenLabs music or SFX. Use only `library/sfx` and `library/music`.
- **Images:** rich "first style" at 1920×1080 or larger. Check every new image for clipping, anatomy, logos and text. Prefer the library: V04 needed zero new images.
- **Thumbnails:** MrBeast or Odd1sOut style. Show what the video is about at a glance. Text must never cover the character.
- **Titles** come from outlier data (vidIQ), not guesses.
- **Editing must be top notch:** pose swaps on word cues, SFX on every beat, no dead air, and no text collisions.
- **Never handle API keys.** Never upload, publish or schedule anything on YouTube. Fin does that himself after approving.

## Repo layout
```
su.sh                 build helper (setup / align / test / long / short)
engine/               shared code
  paths.py            repo-relative paths; SU_VIDEO = current video folder
  render.py           1920x1080 frame engine: plates, actors, props, layers, HUD, cards, transitions
  overlays.py         fonts (Anton FA, Montserrat FB/FR) + DejaVu fallback for → ← · × ÷ ≈
  audio.py            VO placement + SFX + music (sidechain ducked) -> mix.wav, -14 LUFS
  srt.py              captions from the aligned words
  align.py            pocketsphinx forced alignment: vo/secNN.mp3 + secNN.txt -> vo/words.json
  vo_text.py          clean(): converts script text to VO text (caps, numbers)
  rs.py               9:16 Shorts engine (word-pop captions at y=700, actors around y=1650)
  fcpxml.py           optional FCPXML timeline export
library/              poses, cast, props, plates, sfx, music + CATALOG.md
fonts/                Anton + Montserrat (OFL)
videos/V04/           reference video: script.md, upload-pack.md, vo/, edit/, shorts/
videos/_template/     copy this to start a new video
```

## How a video is built
1. **Script:** `videos/VNN/script.md`. Split it into sections (hook, title, levels or chapters, outro). Each section becomes one VO file.
2. **Voice-over:** `videos/VNN/vo/sec00.mp3 … secNN.mp3`, plus the matching `secNN.txt` (exact spoken text, through `vo_text.clean`). Generate it with the ElevenLabs connector if this session has it (`creative_generate_speech`, model eleven_v4, the voice above, a single generation). Otherwise Fin generates it in the Claude app and commits the files.
3. **Align:** `./su.sh align VNN` writes `vo/words.json`.
4. **Timeline:** `edit/timeline.py` sets the section offsets, the title card, level cards and the end-screen hold (15 s). It also provides `cue(sec, 'phrase', n)`, which returns the time a phrase is spoken. Copy V04's file and adjust N, LEVEL_OF_SEC and the gaps.
5. **Shots:** `edit/shots.py` is the whole edit as code. See V04 for every pattern.
   - `shot(t, plate, [A('P02',x,y,h,...)], [P('cash',x,y,h)], motion='in|out|punch|still', tr='cut|whip|whipL|zoom|flash|fade', sfx=...)`
   - Layers: `big()`, `top()`, `tag()`, `src()`, `hypo()`, `lay('bars'|'statcard'|'eq'|'cards3'|'week'|'steps'|'checklist'|'prices'|'waterfall'|'runway'|'notif'|'clock'|'poll'|'comment'|'burst'|'formpaper'|'ladder'|'meterbig', ...)`
   - `SFX += [(name, t)]`. The names are mapped in `engine/audio.py`.
   - Time everything from `c(sec,'phrase')`, never from hard-coded seconds.
   - Cut a new shot every 2–5 s.
6. **QA:** `./su.sh test VNN <seconds…>`. Render stills at every new layout and inspect them. Check for text over faces, clipping, overlaps, empty panels and wrong spellings.
7. **Render:** `./su.sh long VNN` produces `videos/VNN/out/Stacks-Unfolded-VNN.mp4` and the captions SRT. It renders in parallel: `NJ` defaults to the core count, at about 0.1 s per frame per core.
8. **Shorts:** use `shorts/shortA.py` and `shortB.py` with their own VO (`shortA.mp3/.txt`) and `words.json`. Then run `./su.sh short VNN A`.
9. **Upload pack:** `videos/VNN/upload-pack.md` with titles (main + A/B test), description, chapters, Sources, HYPOTHETICAL list, disclaimer, music credits, tags, pinned comment, settings, end screen and card, plus the Shorts details. Copy V04's structure.

## Delivering
- Finished mp4s are usually over 100 MB, so git ignores them. Cloud sessions **can't create GitHub Releases**. Instead, split each file below 95 MB with `split -b 95m -d` and commit the parts to a branch called `deliver/VNN`, along with a `JOIN.bat` that rebuilds it with `copy /b part00+part01+... name.mp4`. Files under 30 MB can also be sent straight into the chat.
- Commit every source file (script, VO, words.json, timeline, shots, shorts, upload pack) to a branch and open a PR so Fin can review it.
