import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Shot} from './Stage';
import {Phone} from './Phone';
import {Receipt, Combo, Sticker, Label, Stat, Source, Hypo, Chat, Bars, Pie, Steps} from './Fx';
import {Dash, Milestone, Title06, End06, DollarBar, RangeBar, Ladder, Checklist, Heartbeat, Donut, Months, Tiles, Pyramid, Org, Tag, Chain} from './Fx3';
import {PropPop, Flow, LockRow} from './Fx2';
import {FPS, OW, OH, ease, clamp} from './base';
import {S, L, SFX, TRK, FREEZE} from './shots';
import {T} from './tl';

export const DUR = Math.round(T.total * FPS);
// Audio (VO + music + loudness-matched SFX) is premixed by videos/V06/mix.py, so the SFX level is measured, not guessed.
const MUTE = false;
const shotIdx = (t: number) => { let i = 0; for (let k = 0; k < S.length; k++) { if (S[k].t <= t) i = k; else break; } return i; };
const shotEnd = (i: number) => (i + 1 < S.length ? S[i + 1].t : T.total);

const KINDS: Record<string, React.FC<any>> = {
  phone: ({t, p}) => <Phone t={t} p={p} />, receipt: (l) => <Receipt {...l} />, combo: (l) => <Combo {...l} />, sticker: (l) => <Sticker {...l} />,
  label: (l) => <Label {...l} />, stat: (l) => <Stat {...l} />, source: (l) => <Source {...l} />, hypo: (l) => <Hypo {...l} />, chat: (l) => <Chat {...l} />,
  bars: (l) => <Bars {...l} />, pie: (l) => <Pie {...l} />, prop: (l) => <PropPop {...l} />, flow: (l) => <Flow {...l} />, lockrow: (l) => <LockRow {...l} />,
  dollar: (l) => <DollarBar {...l} />, range: (l) => <RangeBar {...l} />, ladder: (l) => <Ladder {...l} />, check: (l) => <Checklist {...l} />, heart: (l) => <Heartbeat {...l} />,
  donut: (l) => <Donut {...l} />, months: (l) => <Months {...l} />, tiles: (l) => <Tiles {...l} />, pyramid: (l) => <Pyramid {...l} />, org: (l) => <Org {...l} />, tag: (l) => <Tag {...l} />, chain: (l) => <Chain {...l} />, steps: (l) => <Steps {...l} />,
};
const Layers: React.FC<{t: number; live?: boolean}> = ({t, live}) => (
  <>{L.map((l, k) => { if (!(l.t0 <= t && t < l.t1)) return null; if (live != null && !!l.live !== live) return null; const C = KINDS[l.kind]; return C ? <C key={k} {...l} t={t} /> : null; })}</>
);

const SHAKERS = SFX.filter(([n]) => ['thump', 'gavel', 'stamp', 'scratch'].includes(n));
const shake = (t: number) => { let x = 0, y = 0, r = 0, z = 0; for (const [n, t0, v] of SHAKERS) { const dt = t - t0; if (dt < 0 || dt > 0.5) continue; const a = (n === 'thump' || n === 'gavel' ? 0.9 : 0.45) * (v ?? 0.5) * 2 * Math.exp(-dt * 9); x += 14 * a * Math.sin(dt * 71); y += 10 * a * Math.cos(dt * 57); r += 0.4 * a * Math.sin(dt * 43); z += 0.03 * a; } return {x, y, r, z}; };

const trackerAt = (t: number) => { let st: any = null, prev: any = null, tc = 0; for (const [tk, s] of TRK) { if (tk <= t) { prev = st; st = s; tc = tk; } else break; } return {st, prev, tc}; };
const hudOn = (t: number) => { const s = S[shotIdx(t)]; return !s.kind && !s.nohud && (s.hud || !String(s.plate).startsWith('G:')) && trackerAt(t).st; };
const hudSince = (t: number) => { let k = t; while (k > 0 && hudOn(k - 1 / 30)) k -= 1 / 30; return k; };

const ShotFrame: React.FC<{i: number; t: number}> = ({i, t}) => {
  const s = S[i];
  if (s.kind === 'title') return <Title06 tt={t - s.t} T={T.title} />;
  if (s.kind === 'card') return <Milestone tt={t - s.t} c={{...s.c, dur: s.c.dur}} />;
  if (s.kind === 'end') return <End06 tt={t - s.t} />;
  return <Shot s={s} prev={S[i - 1]} e={shotEnd(i)} t={t} />;
};

const Scene: React.FC<{t: number; f: number}> = ({t, f}) => {
  const i = shotIdx(t); const s = S[i]; const tt = t - s.t; const tr = s.tr || 'cut'; const D = s.xf ?? 0.3;
  const inTr = i > 0 && tt < D && tr !== 'cut' && !S[i - 1].kind; const p = ease(tt / D);
  let body: React.ReactNode = <ShotFrame i={i} t={t} />;
  if (inTr && (tr === 'whip' || tr === 'whipL')) {
    const amt = 46 * Math.sin(Math.PI * p); const dir = tr === 'whip' ? -1 : 1;
    body = (<>
      <svg width={0} height={0} style={{position: 'absolute'}}><filter id={`wb${f}`} x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${amt} 0`} /></filter></svg>
      <AbsoluteFill style={{transform: `translateX(${dir * OW * p}px)`, filter: `url(#wb${f})`}}><ShotFrame i={i - 1} t={t} /></AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${-dir * OW * (1 - p)}px)`, filter: `url(#wb${f})`}}><ShotFrame i={i} t={t} /></AbsoluteFill></>);
  } else if (inTr && tr === 'zoom') {
    body = (<>
      <AbsoluteFill style={{transform: `scale(${1 + 0.5 * p})`, opacity: clamp(1 - p * 2.5), filter: `blur(${10 * p}px)`}}><ShotFrame i={i - 1} t={t} /></AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${1 + 0.3 * (1 - p)})`, opacity: clamp(p * 3), filter: p < 0.7 ? `blur(${10 * (1 - p / 0.7)}px)` : undefined}}><ShotFrame i={i} t={t} /></AbsoluteFill></>);
  } else if (inTr && tr === 'fade') {
    body = (<><ShotFrame i={i - 1} t={t} /><AbsoluteFill style={{opacity: p}}><ShotFrame i={i} t={t} /></AbsoluteFill></>);
  } else if (inTr && tr === 'flash') {
    body = (<><AbsoluteFill style={{filter: `brightness(${1 + 0.8 * (1 - p)})`}}><ShotFrame i={i} t={t} /></AbsoluteFill><AbsoluteFill style={{background: `rgba(255,255,255,${0.92 * (1 - p)})`}} /></>);
  }
  const isShot = !s.kind;
  return (<>
    {body}
    {isShot && <Layers t={t} live={false} />}
  </>);
};

export const Video06: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const fz = FREEZE.find(([a, b]) => t >= a && t < b); const tv = fz ? fz[0] : t;
  const sh = shake(t); const s = S[shotIdx(t)]; const isShot = !s.kind;
  const {st, prev, tc} = trackerAt(t); const showHud = hudOn(tv);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {!MUTE && <Audio src={staticFile('v06vo/v06_mix_full.wav')} />}
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg) scale(${1 + sh.z + (sh.x || sh.y ? 0.02 : 0)})`, filter: fz ? 'saturate(0.35) contrast(1.1) brightness(0.9)' : undefined}}>
        <Scene t={tv} f={fz ? Math.round(fz[0] * FPS) : f} />
      </AbsoluteFill>
      {fz && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)'}} />}
      {fz && <div style={{position: 'absolute', left: 50, top: 40, fontFamily: 'DejaVuB', fontSize: 40, color: '#fff', opacity: Math.floor(t * 2) % 2 ? 1 : 0.35}}>❚❚</div>}
      <Layers t={t} live={true} />
      {showHud && <Dash t={t} st={st} prev={prev} tIn={hudSince(tv)} tChange={tc} />}
      {isShot && <AbsoluteFill style={{background: 'radial-gradient(ellipse 1300px 820px at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.34) 100%)', pointerEvents: 'none'}} />}
      <Img src={staticFile(`fx/grain${f % 8}.png`)} style={{position: 'absolute', width: OW, height: OH, opacity: 0.06, mixBlendMode: 'overlay'}} />
    </AbsoluteFill>
  );
};
