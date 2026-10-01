#!/usr/bin/env bash
# Stacks Unfolded build helper.  Usage:
#   ./su.sh setup                      install ffmpeg, fonts and Python packages
#   ./su.sh align  V05                 word-align the voiceover (videos/V05/vo/secNN.mp3 + .txt -> words.json)
#   ./su.sh test   V05 12.5 60 300     render QA stills at those seconds -> videos/V05/qa/
#   ./su.sh long   V05                 render the full long video + mix + captions -> videos/V05/out/
#   ./su.sh short  V05 A               render Short A (videos/V05/shorts/shortA.py) -> videos/V05/out/
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
export PYTHONPATH="$ROOT/engine:$PYTHONPATH"
cmd=$1; V=$2; VD="$ROOT/videos/$V"; export SU_VIDEO="$VD"
case "$cmd" in
 setup)
  (sudo -n true 2>/dev/null && S=sudo) ; $S apt-get update -qq && $S apt-get install -y -qq ffmpeg fonts-dejavu-core >/dev/null
  pip install -q --break-system-packages pillow numpy opencv-python-headless pocketsphinx 2>/dev/null || pip install -q pillow numpy opencv-python-headless pocketsphinx
  echo "setup done";;
 align) cd "$VD/vo" && python3 "$ROOT/engine/align.py";;
 test)  shift 2; cd "$VD/edit" && python3 "$ROOT/engine/render.py" test "$@";;
 long)
  mkdir -p "$VD/out"; cd "$VD/edit"
  NJ=${NJ:-$(nproc)} python3 "$ROOT/engine/render.py" all | tee render.log
  grep -q FAIL render.log && { echo "some clips failed"; exit 1; }
  python3 "$ROOT/engine/audio.py"
  ls clips/c*.mp4 | sort | sed "s/^/file '/;s/$/'/" > list.txt
  ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy video.mp4
  ffmpeg -y -v error -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$VD/out/Stacks-Unfolded-$V.mp4"
  python3 "$ROOT/engine/srt.py" && mv Stacks-Unfolded-*-Captions.srt "$VD/out/"
  echo "done -> $VD/out";;
 short)
  X=$3; mkdir -p "$VD/out"; cd "$VD/shorts"
  python3 short$X.py render
  ffmpeg -y -v error -i ${X}_video.mp4 -i ${X}_audio.m4a -map 0:v -map 1:a -c copy -shortest -movflags +faststart "$VD/out/Stacks-Unfolded-Short-$V$X.mp4"
  echo "done -> $VD/out/Stacks-Unfolded-Short-$V$X.mp4";;
 *) sed -n 2,8p "$0";;
esac
