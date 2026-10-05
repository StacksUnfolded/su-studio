import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {Video05, DUR as DUR05} from './v05/Video05';
import {ShortA05, ShortB05, SDUR} from './v05/Shorts05';
import {FPS, OW, OH, END} from './lib';

export const Root: React.FC = () => (
  <>
    <Composition id="V04Hook" component={Video} durationInFrames={Math.round(END * FPS)} fps={FPS} width={OW} height={OH} />
    <Composition id="V05" component={Video05} durationInFrames={DUR05} fps={FPS} width={OW} height={OH} />
    <Composition id="V05ShortA" component={ShortA05} durationInFrames={SDUR('A')} fps={FPS} width={1080} height={1920} />
    <Composition id="V05ShortB" component={ShortB05} durationInFrames={SDUR('B')} fps={FPS} width={1080} height={1920} />
  </>
);
