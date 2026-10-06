#!/bin/bash
# resumable chunked render of V05 (video only); finished chunks are skipped
cd /home/claude/su-studio/remotion
N=25690; C=2000
for ((s=0; s<N; s+=C)); do
  e=$((s+C-1)); [ $e -ge $N ] && e=$((N-1))
  f=../videos/V05/out/chunks/c$(printf %05d $s).mp4
  [ -f "$f" ] && continue
  npx remotion render src/index.ts V05 "$f.tmp.mp4" --frames=$s-$e --muted --concurrency=2 --crf=18 --gl=angle > ../videos/V05/out/chunks/log_$s.txt 2>&1 && mv "$f.tmp.mp4" "$f"
done
echo ALLDONE > ../videos/V05/out/chunks/done.txt
