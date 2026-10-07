import '/tmp/claude-0/shim';
import {shortSfx} from '/home/claude/su-studio/remotion/src/v06/Shorts06';
import * as fs from 'fs';
fs.writeFileSync('/tmp/claude-0/ssfx6.json', JSON.stringify({A: shortSfx('A'), B: shortSfx('B')})); console.log('ok');
