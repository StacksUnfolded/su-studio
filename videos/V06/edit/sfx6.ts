import {SFX} from '/home/claude/su-studio/remotion/src/v06/shots';
import * as fs from 'fs';
fs.writeFileSync('/tmp/claude-0/sfx6.json', JSON.stringify(SFX)); console.log(SFX.length);
