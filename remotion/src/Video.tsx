import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {Shot} from './Scene';
import {Layers} from './Layers';
import {Hud} from './Hud';
import {Title, LevelCard} from './Cards';
import {FPS, OW, OH, SHOTS, DATA, shotIndex, ease, clamp, shake} from './lib';

const ShotFrame: React.FC<{i: number; t: number}> = ({i, t}) => {
  const s = SHOTS[i];
  if (s.motion === 'title') return <Title tt={t - s.t} />;
  if (s.motion === 'card') return <LevelCard lv={s.ch} tt={t - s.t} sub={DATA.sub[s.ch]} />;
  return <Shot i={i} t={t} />;
};

export const Video: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const i = shotIndex(t); const s = SHOTS[i]; const tt = t - s.t;
  const tr = s.tr || 'cut'; const D = s.xf ?? 0.35;
  const inTr = i > 0 && tt < D && tr !== 'cut'; const p = ease(tt / D);
  const isShot = !['card', 'title', 'end'].includes(s.motion);
  const sh = shake(t);

  let body: React.ReactNode = <ShotFrame i={i} t={t} />;
  let layerT = '';
  if (inTr && (tr === 'whip' || tr === 'whipL')) {
    const amt = 46 * Math.sin(Math.PI * p); const dir = tr === 'whip' ? -1 : 1;
    body = (
      <>
        <svg width={0} height={0} style={{position: 'absolute'}}><filter id={`wb${f}`} x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${amt} 0`} /></filter></svg>
        <AbsoluteFill style={{transform: `translateX(${dir * OW * p}px)`, filter: `url(#wb${f})`}}><ShotFrame i={i - 1} t={t} /></AbsoluteFill>
        <AbsoluteFill style={{transform: `translateX(${-dir * OW * (1 - p)}px)`, filter: `url(#wb${f})`}}><ShotFrame i={i} t={t} /></AbsoluteFill>
      </>
    );
    layerT = `translateX(${-dir * OW * (1 - p)}px)`;
  } else if (inTr && tr === 'zoom') {
    body = (
      <>
        <AbsoluteFill style={{transform: `scale(${1 + 0.5 * p})`, opacity: clamp(1 - p * 2.5), filter: `blur(${10 * p}px)`}}><ShotFrame i={i - 1} t={t} /></AbsoluteFill>
        <AbsoluteFill style={{transform: `scale(${1 + 0.3 * (1 - p)})`, opacity: clamp(p * 3), filter: p < 0.7 ? `blur(${10 * (1 - p / 0.7)}px)` : undefined}}><ShotFrame i={i} t={t} /></AbsoluteFill>
      </>
    );
  } else if (inTr && tr === 'fade') {
    body = (<><ShotFrame i={i - 1} t={t} /><AbsoluteFill style={{opacity: p}}><ShotFrame i={i} t={t} /></AbsoluteFill></>);
  } else if (inTr && tr === 'flash') {
    body = (<><AbsoluteFill style={{filter: `brightness(${1 + 0.8 * (1 - p)})`}}><ShotFrame i={i} t={t} /></AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(255,255,255,${0.92 * (1 - p)})`}} /></>);
  }

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('v04hook.wav')} />
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg) scale(${1 + sh.z + (sh.x || sh.y ? 0.02 : 0)})`}}>
        {body}
        {isShot && <AbsoluteFill style={{transform: layerT || undefined}}><Layers t={t} shot={s} /></AbsoluteFill>}
      </AbsoluteFill>
      {isShot && <Hud t={t} />}
      {isShot && <AbsoluteFill style={{background: 'radial-gradient(ellipse 1300px 820px at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)'}} />}
      <Img src={staticFile(`fx/grain${f % 8}.png`)} style={{position: 'absolute', width: OW, height: OH, opacity: 0.1, mixBlendMode: 'overlay'}} />
    </AbsoluteFill>
  );
};
