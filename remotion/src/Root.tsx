import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, OW, OH, END} from './lib';

export const Root: React.FC = () => (
  <Composition id="V04Hook" component={Video} durationInFrames={Math.round(END * FPS)} fps={FPS} width={OW} height={OH} />
);
