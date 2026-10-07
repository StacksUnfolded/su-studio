import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {Video05, DUR as DUR05} from './v05/Video05';
import {ShortA05, ShortB05, SDUR} from './v05/Shorts05';
import {Video06, DUR as DUR06} from './v06/Video06';
import {ShortA06, ShortB06, SDUR as SDUR06} from './v06/Shorts06';
import {FPS, OW, OH, END} from './lib';

export const Root: React.FC = () => (
  <>
    <Composition id="V04Hook" component={Video} durationInFrames={Math.round(END * FPS)} fps={FPS} width={OW} height={OH} />
    <Composition id="V05" component={Video05} durationInFrames={DUR05} fps={FPS} width={OW} height={OH} />
    <Composition id="V05ShortA" component={ShortA05} durationInFrames={SDUR('A')} fps={FPS} width={1080} height={1920} />
    <Composition id="V05ShortB" component={ShortB05} durationInFrames={SDUR('B')} fps={FPS} width={1080} height={1920} />
    <Composition id="V06" component={Video06} durationInFrames={DUR06} fps={FPS} width={OW} height={OH} />
    <Composition id="V06ShortA" component={ShortA06} durationInFrames={SDUR06('A')} fps={FPS} width={1080} height={1920} />
    <Composition id="V06ShortB" component={ShortB06} durationInFrames={SDUR06('B')} fps={FPS} width={1080} height={1920} />
  </>
);
