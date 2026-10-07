#!/bin/bash
# two-pass loudnorm to -14 LUFS, video copied
in=$1; out=$2
J=$(ffmpeg -hide_banner -i "$in" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -v error -i "$in" -map 0:v -map 0:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$out"
ffmpeg -hide_banner -i "$out" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated" | tail -2
