# su-studio

Private production kit for the Stacks Unfolded channel. It holds the edit engine, the asset library and every video's source files, so a Claude cloud session can render videos without using your normal limits.

## Making a video in a cloud session
1. Go to **claude.ai/code** and start a new session on **StacksUnfolded/su-studio**.
2. Tell it, for example: *"Make V05 (BNPL) following CLAUDE.md. The script and voice-over are in videos/V05."* You can also ask it to write the script first.
3. When it's done, download the video from the repo's **Releases** page, or from the branch it pushed.

The session reads `CLAUDE.md` automatically. That file holds all the channel rules and the build steps.

## Quick commands
```
./su.sh setup
./su.sh test  V04 30 538
./su.sh long  V05
./su.sh short V05 A
```
