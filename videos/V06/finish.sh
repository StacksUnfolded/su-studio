#!/bin/bash
set -e
cd /home/claude/su-studio/videos/V06/out
ls chunks/c*.mp4 | sort | sed "s#^chunks/#file '#;s/$/'/" > chunks/list.txt
ffmpeg -y -v error -f concat -safe 0 -i chunks/list.txt -c copy V06_video.mp4
J=$(ffmpeg -hide_banner -i ../vo/v06_mix_full.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -v error -i V06_video.mp4 -i ../vo/v06_mix_full.wav -map 0:v -map 1:a -c:v copy \
  -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true \
  -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart Stacks-Unfolded-V06-Influencers.mp4
ffmpeg -hide_banner -i Stacks-Unfolded-V06-Influencers.mp4 -af ebur128 -f null - 2>&1 | grep -A1 Integrated | tail -1
ffprobe -v error -show_entries format=duration,size -of csv=p=0 Stacks-Unfolded-V06-Influencers.mp4
