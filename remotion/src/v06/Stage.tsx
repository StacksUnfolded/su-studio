import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {OW, OH, ease, eout, ein, sp, popS, clamp, lerp, plateSrc, rnd, FD, FB} from '../lib';
import {ldims as dims, lsrc as libSrc} from './base';

const GR: Record<string, [string, string]> = {
  gold: ['rgb(70,48,10)', 'rgb(214,160,50)'], teal: ['rgb(8,28,32)', 'rgb(40,100,100)'], red: ['rgb(40,8,12)', 'rgb(170,40,50)'],
  navy: ['rgb(10,16,34)', 'rgb(40,64,120)'], green: ['rgb(8,34,20)', 'rgb(50,140,80)'], purple: ['rgb(24,12,40)', 'rgb(100,60,150)'],
};
/** gradient backdrop with slowly turning light rays */
export const Grad: React.FC<{kind: string; t: number}> = ({kind, t}) => {
  const [a, b] = GR[kind];
  const rot = t * 6;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 980px 640px at 50% 46%, ${b} 0%, ${a} 100%)`}}>
      <Img src={staticFile('fx/rays.png')} style={{position: 'absolute', left: 960 - 1500, top: 540 - 1500, width: 3000, height: 3000, transform: `rotate(${rot}deg)`}} />
    </AbsoluteFill>
  );
};

export const Plate: React.FC<{name: string; t: number}> = ({name, t}) => {
  if (name.startsWith('G:')) return <Grad kind={name.slice(2)} t={t} />;
  const src = name.startsWith('V01:') ? plateSrc('V01/SU_V01_' + name.slice(4)) : plateSrc(name);
  return <Img src={src} style={{position: 'absolute', width: OW, height: OH, objectFit: 'cover'}} />;
};

/** one character cut-out with springs, squash & stretch, breathing and a contact shadow */
export const Actor: React.FC<{a: any; t: number; ts: number; settle: boolean}> = ({a, t, ts, settle}) => {
  const tin = a.t ?? ts; const ent = a.enter ?? (a.t ? 'pop' : null);
  if (t < tin) return null;
  const tt = t - tin; const h = a.h; const w = dims(a.c).ar * h;
  let dx = 0, dy = 0, sx = 1, sy = 1, rot = 0, al = 1, shS = 1;
  if (ent === 'pop') {
    const s = popS(t, tin);
    sy = lerp(0.25, 1, s); sx = clamp(1 / Math.sqrt(Math.max(sy, 0.2)), 0.85, 1.35) * lerp(0.6, 1, clamp(s * 1.4));
    dy = -40 * Math.sin(Math.PI * clamp(tt / 0.3)); shS = clamp(s);
  } else if (ent === 'L' || ent === 'R') {
    const s = sp(t, tin, {damping: 14, stiffness: 120, mass: 0.8});
    const dir = ent === 'L' ? -1 : 1; dx = dir * (1 - s) * 1250;
    const v = sp(t + 1 / 30, tin, {damping: 14, stiffness: 120, mass: 0.8}) - s; // velocity
    rot = clamp(-dir * v * 300, -14, 14) * (dir > 0 ? 1 : 1);
    // little hop while sliding in
    dy = -Math.abs(Math.sin(tt * 18)) * 22 * (1 - clamp(s));
    if (s > 0.95 && tt < 0.9) { const k = Math.exp(-(tt - 0.35) * 8) * Math.sin((tt - 0.35) * 30); sy = 1 - 0.04 * k; sx = 1 + 0.04 * k; }
  } else if (ent === 'drop') {
    const fall = 0.32;
    if (tt < fall) { const p = ein(tt / fall); dy = -(1 - p) * 950; sy = 1.12; sx = 0.92; shS = p; }
    else { const k = tt - fall; const sq = Math.exp(-k * 7) * Math.cos(k * 26); sy = 1 - 0.22 * sq; sx = 1 + 0.18 * sq; }
  } else if (ent === 'fade') al = ease(tt / 0.3);
  else if (settle) { const s = sp(t, tin, {damping: 10, stiffness: 260, mass: 0.5}); sx = sy = lerp(0.93, 1, s); }
  if (a.exit) {
    const [te, kind] = a.exit;
    if (t >= te) {
      const p = ein((t - te) / 0.55);
      if (kind === 'L' || kind === 'R') { const dir = kind === 'L' ? -1 : 1; dx += dir * p * 1500; rot += dir * 6 * clamp((t - te) / 0.12); dy -= Math.abs(Math.sin((t - te) * 14)) * 26; }
      else if (kind === 'fade') al *= 1 - p;
    }
  }
  const still = a.still;
  const ph = a.x * 0.01;
  const breathe = still ? 0 : 0.012 * Math.sin((2 * Math.PI * (t - ts)) / 2.3 + ph);
  const bob = still ? 0 : 5 * Math.sin((2 * Math.PI * (t - ts)) / 2.3 + ph);
  const sway = still ? 0 : 0.7 * Math.sin((2 * Math.PI * (t - ts)) / 3.1 + ph);
  const flip = a.flip ? -1 : 1;
  const lift = Math.max(0, -dy);
  const shW = w * 0.62 * clamp(1 - lift / 1400, 0.3, 1) * shS * sx;
  return (
    <>
      {!a.noshadow && (
        <div style={{position: 'absolute', left: a.x + dx - shW / 2, top: a.y - 28, width: shW, height: 34, borderRadius: '50%',
          background: 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.5), rgba(0,0,0,0.25) 60%, rgba(0,0,0,0))', opacity: al * clamp(1 - lift / 1200, 0.25, 1)}} />
      )}
      <Img src={libSrc(a.c)} style={{
        position: 'absolute', left: a.x + dx - w / 2, top: a.y - h * dims(a.c).foot - 4 + dy + (ent === 'drop' && tt < 0.32 ? 0 : bob), width: w, height: h,
        transformOrigin: `50% ${dims(a.c).foot * 100}%`, transform: `rotate(${rot + sway}deg) scale(${sx * flip * (1 - breathe * 0.5)}, ${sy * (1 + breathe)})`,
        opacity: al,
      }} />
    </>
  );
};

export const Prop: React.FC<{p: any; t: number; ts: number}> = ({p, t, ts}) => {
  const tin = p.t ?? ts; if (t < tin) return null;
  let s = popS(t, tin);
  if (p.t1 && t >= p.t1) s *= 1 - ease((t - p.t1) / 0.25);
  if (s <= 0.01) return null;
  const fl = p.still ? 0 : 7 * Math.sin((2 * Math.PI * (t - tin)) / 1.9 + p.x * 0.02);
  const wob = p.still ? 0 : 4 * Math.sin((2 * Math.PI * (t - tin)) / 2.6 + p.x);
  const h = p.h, w = dims(p.c).ar * h;
  const spin = (1 - clamp(s)) * -40;
  return (
    <div style={{position: 'absolute', left: p.x - w / 2, top: p.y + fl - h / 2, width: w, height: h,
      transform: `scale(${s}) rotate(${(p.rot ?? 0) * -1 + wob + spin}deg)`, filter: 'drop-shadow(0 14px 10px rgba(0,0,0,0.35))'}}>
      <Img src={libSrc(p.c)} style={{width: w, height: h}} />
    </div>
  );
};

/** Ken Burns camera, like the Python engine but with parallax: characters move a touch more than the plate */
const camera = (s: any, e: number, t: number) => { const p = ease((t - s.t) / Math.max(1e-6, e - s.t)); const [fx, fy] = s.focus || [0.5, 0.5];
  const a = s.za ?? 0.07; let z = 1, px = 0.5, py = 0.5;
  if (s.motion === 'in') { z = 1 + a * p; px = fx; py = fy; }
  else if (s.motion === 'out') { z = 1 + a * (1 - p); px = fx; py = fy; }
  else if (s.motion === 'punch') { z = 1.12 + 0.03 * p; px = fx; py = fy; }
  else if (s.motion === 'panR') { z = 1.1; px = 0.2 + 0.6 * p; py = fy; }
  else if (s.motion === 'panL') { z = 1.1; px = 0.8 - 0.6 * p; py = fy; }
  return {z, px, py};
};
const camT = (z: number, px: number, py: number) => {
  const vw = OW / z, vh = OH / z; const cx = vw / 2 + px * (OW - vw), cy = vh / 2 + py * (OH - vh);
  const ox = cx - OW / 2 / z, oy = cy - OH / 2 / z;
  return `scale(${z}) translate(${-ox}px, ${-oy}px)`;
};

export const Shot: React.FC<{s: any; prev?: any; e: number; t: number}> = ({s, prev, e, t}) => {
  const settle = !!prev && prev.plate === s.plate && s.tr === 'cut';
  const {z, px, py} = camera(s, e, t);
  const za = 1 + (z - 1) * 1.35;
  const items = [...(s.actors || []).map((a: any) => ['a', a]), ...(s.props || []).map((p: any) => ['p', p])]
    .sort((u: any, v: any) => (u[1].z ?? u[1].y) - (v[1].z ?? v[1].y));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{filter: s.fx === 'rewind' ? 'saturate(0.3) contrast(1.15)' : undefined}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: camT(z, px, py)}}>
        <Plate name={s.plate} t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: camT(za, px, py)}}>
        {items.map(([k, it]: any, n: number) => k === 'a'
          ? <Actor key={n} a={it} t={t} ts={s.t} settle={settle} />
          : <Prop key={n} p={it} t={t} ts={s.t} />)}
      </AbsoluteFill>
      </AbsoluteFill>
      {s.fx === 'night' && <Night t={t} />}
      {s.fx === 'rewind' && <Rewind t={t} t0={s.t} label={s.rwLabel ?? 'THE BEGINNING'} />}
    </AbsoluteFill>
  );
};

/** moonlit night grade: cool multiply, lamp glow, heavier vignette */
const Night: React.FC<{t: number}> = ({t}) => (
  <>
    <AbsoluteFill style={{background: 'rgb(60,80,150)', mixBlendMode: 'multiply', opacity: 0.55}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle 520px at 30% 30%, rgba(255,200,120,0.18), rgba(255,200,120,0) 70%)', mixBlendMode: 'screen', opacity: 0.85 + 0.15 * Math.sin(t * 9)}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,20,0.55) 100%)'}} />
  </>
);

/** VHS rewind: desaturate, scanlines, tracking glitches, RGB split, noise, timecode running backwards */
const Rewind: React.FC<{t: number; t0: number; label: string}> = ({t, t0, label}) => {
  const f = Math.round(t * 30); const R = rnd(f * 7 + 3);
  const bands = Array.from({length: 5}, () => ({y: R() * 1040, h: 6 + R() * 46, dx: (R() - 0.5) * 120, a: 0.25 + R() * 0.4}));
  const tt = t - t0;
  const secs = Math.max(0, 6 * 30 * 86400 - tt * 86400 * 20);
  const d = Math.floor(secs / 86400), hh = Math.floor((secs % 86400) / 3600), mm = Math.floor((secs % 3600) / 60);
  const tc = `-${String(d).padStart(3, '0')}D ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  return (
    <>
      <AbsoluteFill style={{background: 'rgb(255,0,60)', mixBlendMode: 'screen', opacity: 0.06, transform: `translateX(${6 + R() * 4}px)`}} />
      <AbsoluteFill style={{background: 'rgb(0,200,255)', mixBlendMode: 'screen', opacity: 0.06, transform: `translateX(${-6 - R() * 4}px)`}} />
      {bands.map((b, k) => (
        <div key={k} style={{position: 'absolute', left: 0, top: b.y, width: OW, height: b.h, filter: 'blur(2px)', mixBlendMode: 'screen',
          transform: `translateX(${b.dx}px)`, background: `rgba(255,255,255,${b.a * 0.45})`}} />
      ))}
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)'}} />
      <Img src={staticFile(`fx/grain${f % 8}.png`)} style={{position: 'absolute', width: OW, height: OH, opacity: 0.35, mixBlendMode: 'overlay'}} />
      {Math.floor(tt * 3) % 2 === 0 && (
        <div style={{position: 'absolute', left: 80, top: 66, fontFamily: FD, fontSize: 78, color: '#fff', textShadow: '4px 0 rgba(255,0,60,0.7), -4px 0 rgba(0,200,255,0.7)'}}>◄◄ REWIND</div>
      )}
      <div style={{position: 'absolute', right: 80, bottom: 70, textAlign: 'right', fontFamily: FB, fontWeight: 800, fontSize: 44, color: '#fff', textShadow: '3px 0 rgba(255,0,60,0.6), -3px 0 rgba(0,200,255,0.6)'}}>
        {label}<div style={{fontFamily: FD, fontSize: 30, opacity: 0.8, marginTop: 6}}>{tc}</div>
      </div>
    </>
  );
};
