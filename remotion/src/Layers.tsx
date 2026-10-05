import React from 'react';
import {Img} from 'remotion';
import {ST, At} from './Text';
import {DATA, OW, OH, GOLD, INK, RED, WHITE, GREEN, rgb, sp, popS, ease, eout, ein, clamp, lerp, outF, textW, actorBoxes, freeSpans, FA, FB, FR, libSrc, dims, rnd} from './lib';

const BigText: React.FC<any> = ({t, t0, t1, text, y = 800, col, size = 150, shot}) => {
  const sz = text.length < 16 ? size : Math.round(size * 0.78);
  const sw = 12; const words = text.split(' ');
  const gap = sz * 0.34;
  const ww = words.map((w: string) => textW(w, FA, sz) + sw * 2);
  let W = ww.reduce((a: number, b: number) => a + b, 0) + gap * (words.length - 1);
  const H = sz * 1.2;
  let x = 960, fit = Math.min(1, 1760 / W);
  const bx = actorBoxes(shot, t);
  const hit = bx.some((b) => x - (W * fit) / 2 < b[2] + 20 && x + (W * fit) / 2 > b[0] - 20 && y - H / 2 < b[3] && y + H / 2 > b[1]);
  if (hit) {
    const spans = freeSpans(bx, y - H / 2, y + H / 2, 30, 40);
    if (spans.length) { const [a, b] = spans.reduce((m, s) => (s[1] - s[0] > m[1] - m[0] ? s : m)); fit = Math.min(fit, (b - a) / W); x = (a + b) / 2; }
  }
  const o = outF(t, t1); const exitS = lerp(0.85, 1, o);
  return (
    <At x={x} y={y} s={fit * exitS} o={o}>
      <div style={{display: 'flex', gap, alignItems: 'center'}}>
        {words.map((w: string, k: number) => {
          const tk = t0 + k * 0.07; const s = popS(t, tk);
          const r = (1 - clamp(s)) * (k % 2 ? 9 : -9);
          return (
            <div key={k} style={{transform: `translateY(${(1 - s) * 60}px) scale(${s}) rotate(${r}deg)`, opacity: clamp(s * 3)}}>
              <ST text={w} font={FA} size={sz} color={rgb(col ?? [230, 199, 119])} sw={sw} />
            </div>
          );
        })}
      </div>
    </At>
  );
};

const Top: React.FC<any> = ({t, t0, t1, text, shot}) => {
  const panelUp = DATA.layers.some((l: any) => l.kind === 'meterbig' && l.t0 <= t && t < (l.t1 ?? 1e9));
  const bx = actorBoxes(shot, t); const cy = panelUp ? 700 : 968;
  const spans = freeSpans(bx, cy - 50, cy + 50);
  const [a, b] = spans.length ? spans.reduce((m, s) => (s[1] - s[0] > m[1] - m[0] ? s : m)) : [30, OW - 30];
  let lines = [text]; let size = 50;
  const fits = (ls: string[], sz: number) => ls.every((l) => textW(l, FB, sz) + 70 <= b - a);
  while (size > 30 && !fits(lines, size)) size -= 2;
  if (!fits(lines, size)) {
    const wd = text.split(' '); let best: any = null;
    for (let k = 1; k < wd.length; k++) { const l1 = wd.slice(0, k).join(' '), l2 = wd.slice(k).join(' '); const m = Math.max(l1.length, l2.length); if (!best || m < best[0]) best = [m, [l1, l2]]; }
    lines = best[1]; size = 46; while (size > 28 && !fits(lines, size)) size -= 2;
  }
  const s = sp(t, t0, {damping: 13, stiffness: 200}); const o = clamp((t - t0) / 0.12) * outF(t, t1, 0.18);
  const cx = (a + b) / 2;
  const ys = lines.length === 1 ? [cy] : [cy - 68, cy + 12];
  let wi = 0;
  return (
    <>
      {lines.map((l, k) => (
        <At key={k} x={cx} y={ys[k] + (1 - s) * 50} o={o} s={lerp(0.9, 1, s)}>
          <div style={{background: 'rgba(17,19,21,0.9)', borderRadius: 24, padding: '18px 34px', fontFamily: FB, fontWeight: 800, fontSize: size, color: '#fff', lineHeight: 1.1, whiteSpace: 'pre', boxShadow: '0 8px 0 rgba(0,0,0,0.3)', display: 'flex', gap: size * 0.28}}>
            {l.split(' ').map((w, j) => { const tk = t0 + 0.05 + (wi++) * 0.045; const p = eout((t - tk) / 0.18); return <span key={j} style={{opacity: p, transform: `translateY(${(1 - p) * 14}px)`, display: 'inline-block'}}>{w}</span>; })}
          </div>
        </At>
      ))}
    </>
  );
};

export const Label: React.FC<{text: string; col: string}> = ({text, col}) => (
  <div style={{background: col, border: `4px solid ${INK}`, borderRadius: 16, height: 62, boxSizing: 'border-box', padding: '0 22px', display: 'flex', alignItems: 'center',
    fontFamily: FB, fontWeight: 800, fontSize: 34, color: INK, whiteSpace: 'pre', boxShadow: '0 7px 0 rgba(0,0,0,0.35)'}}>{text}</div>
);
const Tag: React.FC<any> = ({t, t0, t1, text, x, y, col}) => {
  const s = popS(t, t0); const o = outF(t, t1);
  const wig = 1.5 * Math.sin((t - t0) * 5);
  return <At x={x} y={y} s={s * lerp(0.8, 1, o)} r={lerp(-12, -2, clamp(s)) + wig} o={o}><Label text={text} col={rgb(col)} /></At>;
};

const Src: React.FC<any> = ({t, t0, t1, text}) => {
  const o = clamp((t - t0) / 0.25) * outF(t, t1, 0.25); const txt = text.startsWith('HYPO') ? text : 'Source: ' + text;
  return <div style={{position: 'absolute', left: 44 - (1 - eout((t - t0) / 0.3)) * 60, top: 196, opacity: o, background: 'rgba(17,19,21,0.82)', borderRadius: 14, padding: '12px 22px', fontFamily: FR, fontSize: 26, color: '#e1e1e1'}}>{txt}</div>;
};

const Stamp: React.FC<any> = ({t, t0, t1, x = 1560, y = 250, text = 'HYPOTHETICAL'}) => {
  const tt = t - t0; const s = tt < 0.16 ? 1.8 - 0.8 * ein(tt / 0.16) : 1 + 0.05 * Math.exp(-(tt - 0.16) * 10) * Math.sin((tt - 0.16) * 40);
  return <At x={x} y={y} s={s} r={-7} o={outF(t, t1) * clamp(tt / 0.08)}>
    <div style={{border: `9px solid ${RED}`, borderRadius: 12, padding: '14px 36px', fontFamily: FA, fontSize: 74, color: RED, lineHeight: 1, background: 'rgba(255,255,255,0.08)'}}>{text}</div>
  </At>;
};

const Notif: React.FC<any> = ({t, t0, t1, title, body, right = '', col = [70, 170, 100], y = 170}) => {
  const s = sp(t, t0, {damping: 12, stiffness: 160}); const q = ein((t - (t1 - 0.3)) / 0.3);
  const yy = -160 + (y + 160) * s - (y + 160) * q;
  const n = parseInt(right, 10); const cnt = isNaN(n) ? right : String(Math.round(n * eout((t - t0 - 0.15) / 0.7)));
  const jig = t - t0 > 0.8 ? 0 : 3 * Math.sin((t - t0) * 50) * (1 - clamp((t - t0) / 0.8));
  return (
    <div style={{position: 'absolute', left: 960 - 450 + jig, top: yy - 75, width: 900, height: 150, borderRadius: 34, background: 'rgba(250,250,250,0.97)', border: `4px solid ${INK}`, boxSizing: 'border-box',
      boxShadow: '0 18px 40px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 26}}>
      <div style={{width: 90, height: 90, borderRadius: 22, background: rgb(col), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FA, fontSize: 64, color: '#fff', flex: 'none'}}>$</div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: FB, fontWeight: 800, fontSize: 38, color: INK}}>{title}</div>
        <div style={{fontFamily: FR, fontSize: 32, color: '#464646', marginTop: 6}}>{body}</div>
      </div>
      {right && <div style={{fontFamily: FA, fontSize: 60, color: rgb(col), transform: `scale(${1 + 0.25 * Math.exp(-(t - t0 - 0.85) * 8) * (t - t0 > 0.85 ? 1 : 0)})`}}>{cnt}</div>}
    </div>
  );
};

const Clock: React.FC<any> = ({t, t0, t1, x, y: y0, r, h0, m0, h1, m1, ta, tb}) => {
  const s = popS(t, t0); if (s <= 0.01) return null;
  let y = y0; if (x > 1300 && y - r < 185) y = 185 + r;
  let mins = h0 * 60 + m0;
  if (h1 != null && t >= ta) mins = mins + (h1 * 60 + m1 - mins) * sp(t, ta, {damping: 8, stiffness: 200, mass: 0.5});
  const ring = ta != null ? tb : t0 + 0.2;
  const rt = t - ring; const wob = rt > 0 && rt < 0.9 ? 7 * Math.sin(rt * 55) * (1 - rt / 0.9) : 0;
  const am = ((mins % 60) / 60) * 360, ah = (((mins / 60) % 12) / 12) * 360, as = Math.floor((t - t0) * 1) * 6;
  const c = r + 10, S = 2 * r + 20;
  const hand = (deg: number, len: number, w: number, col: string) => <line x1={c} y1={c} x2={c + len * Math.sin((deg * Math.PI) / 180)} y2={c - len * Math.cos((deg * Math.PI) / 180)} stroke={col} strokeWidth={w} strokeLinecap="round" />;
  return (
    <At x={x} y={y} s={s * lerp(0.8, 1, outF(t, t1))} r={wob} o={outF(t, t1)}>
      <svg width={S} height={S} style={{overflow: 'visible', filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.3))'}}>
        <circle cx={c} cy={c} r={r} fill="rgb(250,246,236)" stroke={INK} strokeWidth={Math.max(6, r / 14)} />
        {Array.from({length: 12}, (_, i) => { const a = (i * Math.PI) / 6; return <line key={i} x1={c + r * 0.8 * Math.sin(a)} y1={c - r * 0.8 * Math.cos(a)} x2={c + r * 0.92 * Math.sin(a)} y2={c - r * 0.92 * Math.cos(a)} stroke={INK} strokeWidth={Math.max(3, r / 22)} />; })}
        {hand(ah, r * 0.5, Math.max(6, r / 10), INK)}
        {hand(am, r * 0.78, Math.max(4, r / 16), RED)}
        {hand(as, r * 0.82, 2.5, '#555')}
        <circle cx={c} cy={c} r={r / 12} fill={INK} />
      </svg>
    </At>
  );
};

/** value -> time inversion for the meter (v = to*ease(p)^2) */
const ease0 = (p: number) => p * p * (3 - 2 * p);
const tForFrac = (f: number, ta: number, tb: number) => { let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (ease0(m) ** 2 < f) lo = m; else hi = m; } return ta + lo * (tb - ta); };
const MeterBig: React.FC<any> = ({t, t0, t1, frm = 0, to = 1000000, ta, tb, snap}) => {
  const enter = sp(t, t0, {damping: 13, stiffness: 150});
  let v = frm; if (ta != null && t >= ta) v = frm + (to - frm) * ease((t - ta) / Math.max(0.1, tb - ta)) ** 2;
  const snapped = snap && t >= snap; if (snapped) v = 0;
  const lit = v < 1000000 ? Math.floor((11 * v) / 1000000 + 0.0001) : 11;
  const st = snapped ? t - snap : -1;
  const shk = st >= 0 && st < 0.5 ? 14 * Math.exp(-st * 8) * Math.sin(st * 70) : 0;
  const full = tb && t >= tb && !snapped; const glow = full ? 0.6 + 0.4 * Math.sin((t - tb) * 12) : 0;
  return (
    <div style={{position: 'absolute', left: 360 + shk, top: 770 + (1 - enter) * 340, width: 1200, height: 270, borderRadius: 34, background: 'rgba(17,19,21,0.92)', border: `4px solid ${snapped ? RED : 'rgba(230,199,119,0.5)'}`, boxSizing: 'border-box',
      boxShadow: full ? `0 0 ${60 * glow}px rgba(230,199,119,${0.7 * glow})` : '0 14px 30px rgba(0,0,0,0.4)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontFamily: FA, fontSize: 110, lineHeight: 1, color: snapped ? RED : GOLD,
        textShadow: snapped ? '6px 0 rgba(0,200,255,0.5), -6px 0 rgba(255,0,60,0.5)' : `0 0 ${20 + 30 * glow}px rgba(230,199,119,0.55)`, fontVariantNumeric: 'tabular-nums',
        transform: `scale(${1 + (full ? 0.06 * Math.exp(-(t - tb) * 6) : 0) + (snapped ? 0.1 * Math.exp(-st * 7) : 0)})`}}>
        ${Math.round(v).toLocaleString('en-US')}
      </div>
      {Array.from({length: 11}, (_, i) => {
        const on = i < lit; const tl = ta != null ? tForFrac((i + 1) / 11, ta, tb) : 0; const ps = on ? popS(t, tl) : 1;
        return <div key={i} style={{position: 'absolute', left: 40 + i * 100, top: 200, width: 90, height: 34, borderRadius: 10, border: `5px solid ${INK}`, boxSizing: 'border-box',
          background: on ? GOLD : 'rgb(35,60,64)', transform: `scale(${on ? lerp(1.6, 1, ps) : 1})`, boxShadow: on ? '0 0 18px rgba(230,199,119,0.7)' : 'none'}} />;
      })}
    </div>
  );
};

const Burst: React.FC<any> = ({t, t0, n = 34, seed = 4}) => {
  const tt = t - t0; if (tt < 0) return null; const R = rnd(seed * 1000 + 17);
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const a = lerp(-Math.PI * 0.95, -Math.PI * 0.05, R()), v = lerp(900, 1700, R()), spin = lerp(-400, 400, R()), hh = [90, 110, 130][Math.floor(R() * 3)], flipR = lerp(300, 900, R());
        const x = 960 + Math.cos(a) * v * tt, y = 560 + Math.sin(a) * v * tt + 900 * tt * tt;
        if (y > OH + 200) return null;
        const code = i % 3 ? 'cash' : 'coins'; const w = dims(code).ar * hh;
        return <Img key={i} src={libSrc(code)} style={{position: 'absolute', left: x - w / 2, top: y - hh / 2, width: w, height: hh,
          transform: `rotate(${-spin * tt}deg) rotateY(${code === 'cash' ? flipR * tt : 0}deg) scale(${clamp(tt / 0.08)})`, filter: 'drop-shadow(0 8px 6px rgba(0,0,0,0.3))'}} />;
      })}
    </>
  );
};

const KINDS: Record<string, React.FC<any>> = {bigtext: BigText, top: Top, tag: Tag, src: Src, stamp: Stamp, notif: Notif, clock: Clock, meterbig: MeterBig, burst: Burst};
export const Layers: React.FC<{t: number; shot: any}> = ({t, shot}) => (
  <>
    {DATA.layers.map((l: any, k: number) => {
      const t1 = l.t1 ?? 1e9; if (!(l.t0 <= t && t < t1)) return null;
      const C = KINDS[l.kind]; if (!C) return null;
      return <C key={k} {...l} t={t} t1={t1} shot={shot} />;
    })}
  </>
);
