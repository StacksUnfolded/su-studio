import React from 'react';
import {Img, AbsoluteFill} from 'remotion';
import {ST, At} from '../Text';
import {UI, GOLD, INK, RED, WHITE, sp, popS, ease, eout, ein, clamp, lerp, outF, FA, FB, FR, lsrc, ldims, money, rnd} from './base';
import {AppIcon, APPS} from './Phone';
import {Grad} from './Stage';
import {SvgProp, SVGPROPS} from './Fx3';

/** prop pop / drop layer */
export const PropPop: React.FC<{t: number; t0: number; t1: number; c: string; x: number; y: number; h: number; drop?: boolean; rot?: number; spin?: boolean}> = ({t, t0, t1, c, x, y, h, drop, rot = 0, spin}) => {
  const isSvg = c.startsWith('svg:'); const d = isSvg ? {ar: SVGPROPS[c.slice(4)][0]} : ldims(c); const w = d.ar * h; let s = popS(t, t0), dy = 0, sy = 1, sx = 1;
  if (drop) { const tt = t - t0; const f = 0.3; s = 1; if (tt < f) dy = -(1 - ein(tt / f)) * 900; else { const k = tt - f; const q = Math.exp(-k * 7) * Math.cos(k * 26); sy = 1 - 0.18 * q; sx = 1 + 0.14 * q; } }
  const o = outF(t, t1); const fl = drop ? 0 : 6 * Math.sin((t - t0) * 3 + x);
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2 + dy + fl, width: w, height: h, transform: `scale(${s * (0.85 + 0.15 * o)}) scale(${sx},${sy}) rotate(${rot + (spin ? (t - t0) * 30 : 0)}deg)`, transformOrigin: '50% 100%', opacity: o, filter: 'drop-shadow(0 16px 12px rgba(0,0,0,0.35))'}}>
    {isSvg ? <SvgProp k={c.slice(4)} h={h} /> : <Img src={lsrc(c)} style={{width: w, height: h}} />}
  </div>;
};

/** $60 -> $15 swap: the big price shrinks and gets crossed out, the small one grows */
export const Swap: React.FC<{t: number; t0: number; tB: number; t1: number; a: string; b: string; x?: number; y?: number; ax?: number; bx?: number}> = ({t, t0, tB, t1, a, b, x = 700, y = 470, ax = 230, bx = 170}) => {
  const sa = popS(t, t0); const q = eout((t - tB) / 0.5); const sb = popS(t, tB); const o = outF(t, t1);
  return <div style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
    <At x={x - ax * q} y={y - 40 * q} s={clamp(sa, 0, 1.2) * lerp(1, 0.55, q)}>
      <div style={{position: 'relative'}}><ST text={a} font={FA} size={260} color={WHITE} sw={14} />
        {q > 0 && <div style={{position: 'absolute', left: -20, top: '48%', height: 22, width: `${110 * q}%`, background: RED, borderRadius: 11, transform: 'rotate(-10deg)', border: '4px solid #111'}} />}</div>
    </At>
    {t >= tB && <At x={x + bx} y={y + 40} s={clamp(sb, 0, 1.25) * 1.25}><ST text={b} font={FA} size={260} color={GOLD} sw={14} /></At>}
  </div>;
};

/** STORE -> fee -> APP ; YOU -> $0 */
export const Flow: React.FC<{t: number; t0: number; t1: number; tYou: number}> = ({t, t0, t1, tYou}) => {
  const o = outF(t, t1, 0.25);
  const box = (ti: number, x: number, y: number, label: string, icon: React.ReactNode, col: string) => { const s = popS(t, ti); return <At x={x} y={y} s={clamp(s, 0, 1.2)}><div style={{width: 330, height: 260, borderRadius: 34, background: 'rgba(14,17,22,0.92)', border: `5px solid ${col}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>{icon}<div style={{fontFamily: FA, fontSize: 64, color: '#fff'}}>{label}</div></div></At>; };
  const arrow = (ti: number, x0: number, y0: number, x1: number, label: string, col: string) => { const p = eout((t - ti) / 0.5); if (t < ti) return null; return <div>
    <div style={{position: 'absolute', left: x0, top: y0 - 9, width: (x1 - x0) * p, height: 18, background: col, borderRadius: 9}} />
    <div style={{position: 'absolute', left: x0 + (x1 - x0) * p - 10, top: y0 - 28, width: 0, height: 0, borderTop: '28px solid transparent', borderBottom: '28px solid transparent', borderLeft: `40px solid ${col}`}} />
    <div style={{position: 'absolute', left: (x0 + x1) / 2 - 150, width: 300, top: y0 - 90, textAlign: 'center', fontFamily: FB, fontWeight: 800, fontSize: 40, color: col, opacity: p}}>{label}</div></div>; };
  return <div style={{position: 'absolute', inset: 0, opacity: o}}>
    {box(t0, 480, 400, 'STORE', <Img src={lsrc('shopbag')} style={{height: 110}} />, GOLD)}
    {arrow(t0 + 0.6, 660, 400, 1250, 'pays a fee', GOLD)}
    {box(t0 + 0.3, 1440, 400, 'THE APP', <AppIcon size={100} />, '#b44dff')}
    {t >= tYou && box(tYou, 480, 780, 'YOU', <Img src={lsrc('P05')} style={{height: 120}} />, UI.green)}
    {t >= tYou && arrow(tYou + 0.4, 660, 780, 1250, '$0 extra (if on time)', UI.green)}
  </div>;
};

/** juggling: items orbit over the host's hands */
export const Juggle: React.FC<{t: number; t0: number; t1: number; x: number; y: number; items: string[]}> = ({t, t0, t1, x, y, items}) => {
  const o = outF(t, t1) * clamp((t - t0) / 0.3);
  return <div style={{position: 'absolute', inset: 0, opacity: o}}>{items.map((c, i) => {
    const ph = ((t - t0) * 1.4 + i / items.length) % 1; const ang = ph * Math.PI * 2; const px = x + 260 * Math.cos(ang), py = y - 120 - 220 * Math.abs(Math.sin(ang));
    const d = ldims(c); const hh = c === 'card' ? 90 : 120;
    return <Img key={i} src={lsrc(c)} style={{position: 'absolute', left: px - (d.ar * hh) / 2, top: py - hh / 2, height: hh, transform: `rotate(${(t - t0) * 300 * (i % 2 ? 1 : -1)}deg)`, filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.35))'}} />;
  })}</div>;
};

/** title card for V05 */
export const Title05: React.FC<{tt: number; T: number}> = ({tt, T}) => {
  const endP = ease((tt - (T - 0.25)) / 0.25); const glow = 0.6 + 0.4 * Math.sin(tt * 8);
  const line = (txt: string, t0: number, size: number, col: string, y: number) => { const s = popS(tt, t0); return <At x={960} y={y} s={clamp(s, 0, 1.3) * lerp(1.6, 1, clamp(s))} o={clamp(s * 3)}><ST text={txt} font={FA} size={size} color={col} sw={14} /></At>; };
  const bs = popS(tt, 0.85); const crackP = clamp((tt - 1.5) / 0.15);
  return <AbsoluteFill style={{overflow: 'hidden', background: '#07080e'}}>
    <AbsoluteFill style={{transform: `scale(${1 + 0.35 * endP})`}}>
      <Grad kind="purple" t={tt * 4} />
      {line('HOW BUY NOW, PAY LATER', 0.05, 120, WHITE, 200)}
      {line('DESTROYS YOUR LIFE', 0.3, 190, 'rgb(255,80,90)', 380)}
      {line('AT EVERY LEVEL', 0.55, 150, GOLD, 560)}
      <At x={960} y={790} s={clamp(bs, 0, 1.2)}>
        <div style={{position: 'relative', width: 760, height: 150, borderRadius: 44, background: UI.pay, boxShadow: `0 0 ${60 * glow}px ${UI.payGlow}, 0 14px 0 rgba(90,30,140,0.6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FB, fontWeight: 800, fontSize: 70, color: '#fff'}}>
          PAY IN 4
          {crackP > 0 && <svg width={760} height={150} style={{position: 'absolute', left: 0, top: 0}}><path d="M380,0 L360,40 L400,70 L370,110 L395,150 M360,40 L300,55 M400,70 L470,60" stroke="#fff" strokeWidth={6} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - crackP)} /></svg>}
        </div>
      </At>
      <Img src={lsrc('P21')} style={{position: 'absolute', left: 1600 - 180, top: 1080 - 520, height: 520, transform: `translateY(${(1 - popS(tt, 1.0)) * 600}px)`}} />
    </AbsoluteFill>
    <AbsoluteFill style={{background: `rgba(255,255,255,${0.85 * endP})`}} />
  </AbsoluteFill>;
};

/** row of mini lock screens (recap / payoff) */
export const LockRow: React.FC<{t: number; t0: number; t1: number; items: any[]; hot?: number; tHot?: number; warm?: number[]; y?: number}> = ({t, t0, t1, items, hot, tHot, warm = [], y = 470}) => {
  const o = outF(t, t1, 0.25); const n = items.length; const w = Math.min(330, 1760 / n - 20);
  return <div style={{position: 'absolute', left: 0, right: 0, top: y - 230, display: 'flex', justifyContent: 'center', gap: 18, opacity: o}}>
    {items.map(([ti, lv, sub, crack]: any, i: number) => {
      const s = popS(t, ti); const isHot = hot === i && tHot != null && t >= tHot; const pulse = isHot ? 1.08 + 0.04 * Math.sin((t - tHot!) * 9) : 1;
      return <div key={i} style={{width: w, height: 460, borderRadius: 40, background: isHot ? 'linear-gradient(170deg,#5a0f1c,#1a0508)' : 'linear-gradient(170deg,#24204a,#0d0e18)', border: `6px solid ${isHot ? RED : warm.includes(i) ? GOLD : '#3a3f4a'}`, transform: `scale(${clamp(s, 0, 1.15) * pulse}) translateY(${isHot ? -30 : 0}px)`, position: 'relative', overflow: 'hidden', boxShadow: isHot ? `0 0 60px rgba(255,60,80,0.7)` : '0 10px 30px rgba(0,0,0,0.5)', opacity: clamp(s * 3)}}>
        {n > 6 ? <div style={{marginTop: 26, textAlign: 'center', color: '#fff'}}><div style={{fontFamily: FB, fontWeight: 800, fontSize: 20, letterSpacing: 2, opacity: 0.8}}>LEVEL</div><div style={{fontFamily: FA, fontSize: 110, lineHeight: 1}}>{lv}</div></div>
          : <div style={{marginTop: 40, textAlign: 'center', fontFamily: FA, fontSize: 74, color: '#fff'}}>LEVEL {lv}</div>}
        <div style={{margin: '14px 16px 0', textAlign: 'center', fontFamily: FB, fontWeight: 800, fontSize: n > 6 ? 22 : 28, color: isHot ? '#ffb3bd' : GOLD, lineHeight: 1.2}}>{sub}</div>
        {crack > 0 && <svg width={w} height={460} style={{position: 'absolute', left: 0, top: 0}}>{Array.from({length: Math.round(crack * 8)}, (_, k) => { const R = rnd(i * 31 + k); let x = w * 0.7, yy = 90, d = `M${x},${yy}`; for (let q = 0; q < 5; q++) { x += (R() - 0.5) * 90; yy += 30 + R() * 50; d += ` L${x},${yy}`; } return <path key={k} d={d} stroke="rgba(255,255,255,0.75)" strokeWidth={2} fill="none" />; })}</svg>}
      </div>;
    })}
  </div>;
};

/** end screen: video slot left, subscribe right */
export const End05: React.FC<{tt: number}> = ({tt}) => {
  const s = popS(tt, 0.1);
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Grad kind="purple" t={tt * 2} />
    <At x={560} y={150} s={clamp(s, 0, 1.2)}><ST text="WATCH NEXT" font={FA} size={110} color={GOLD} sw={10} /></At>
    <div style={{position: 'absolute', left: 110, top: 260, width: 900, height: 506, borderRadius: 28, border: `8px solid ${GOLD}`}} />
    <div style={{position: 'absolute', left: 1370, top: 330, width: 360, height: 360, borderRadius: '50%', border: `8px solid ${GOLD}`}} />
    <Img src={lsrc('P04')} style={{position: 'absolute', left: 1025, top: 1030 - 520, height: 520, transform: `translateY(${(1 - popS(tt, 0.3)) * 500}px)`}} />
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontFamily: FR, fontSize: 28, color: 'rgb(200,200,220)', opacity: ease((tt - 0.5) / 0.5)}}>Not financial advice. Story numbers are HYPOTHETICAL.</div>
  </AbsoluteFill>;
};
