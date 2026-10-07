// V06 "creator dashboard" pieces: HUD, milestone cards, money splits, graphs and code-drawn props.
import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {ST, At} from '../Text';
import {UI, GOLD, INK, WHITE, sp, popS, ease, eout, ein, clamp, lerp, outF, FA, FB, FR, FD, lsrc, money, rnd} from './base';
import {kv, short} from './Phone';

const GREENK = '#3ee089';

// ---------------------------------------------------------------- Creator Dashboard HUD (top left)
/** st = {f: followers, e: earned, k: kept} ; tChange = time of last change */
export const Dash: React.FC<{t: number; st: any; prev: any; tIn: number; tChange: number}> = ({t, st, prev, tIn, tChange}) => {
  const s = sp(t, tIn, {damping: 14, stiffness: 160}); const q = eout((t - tChange) / 0.9);
  const v = (k: string) => (prev ? lerp(prev[k], st[k], q) : st[k]);
  const flash = t - tChange < 0.6 ? 1 - (t - tChange) / 0.6 : 0; const kept = v('k');
  const M = (x: number) => { const a = Math.abs(x), sg = x < 0 ? '-' : ''; return a >= 1e6 ? `${sg}$${(a / 1e6).toFixed(1)}M` : a >= 1e5 ? `${sg}$${Math.round(a / 1e3)}K` : money(Math.round(x)); };
  const Col: React.FC<{lab: string; val: string; col: string; w: number}> = ({lab, val, col, w}) => (
    <div style={{width: w}}><div style={{fontSize: 13, color: UI.sub, letterSpacing: 1.5}}>{lab}</div><div style={{fontFamily: FA, fontSize: 48, lineHeight: 1.05, color: col}}>{val}</div></div>);
  return (
    <div style={{position: 'absolute', left: 40, top: 32 - (1 - s) * 200, width: 520, borderRadius: 26, background: 'rgba(14,17,22,0.88)', border: '3px solid rgba(255,90,140,0.65)', boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 ${30 * flash}px rgba(255,90,140,${flash})`, padding: '12px 20px', fontFamily: FB, color: '#fff'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: UI.sub, letterSpacing: 2}}><span style={{width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg,#ff7a59,#c3337f)', display: 'inline-block'}} />CREATOR DASHBOARD</div>
      <div style={{display: 'flex', gap: 14, marginTop: 6}}>
        <Col lab="FOLLOWERS" val={short(v('f'))} col="#fff" w={150} />
        <Col lab="EARNED" val={M(v('e'))} col={GOLD} w={160} />
        <Col lab="KEPT" val={M(kept)} col={kept < 0 ? UI.red : GREENK} w={160} />
      </div>
      <div style={{fontFamily: FR, fontSize: 12, color: '#8a93a3', marginTop: 2}}>HYPOTHETICAL story numbers</div>
    </div>
  );
};

// ---------------------------------------------------------------- milestone level card
export const Milestone: React.FC<{tt: number; c: any}> = ({tt, c}) => {
  const D = c.dur ?? 2.2; const zoom = 1 + 0.05 * ease(tt / D) + 0.5 * ein((tt - (D - 0.22)) / 0.22);
  const n1 = popS(tt, 0.2); const n2 = popS(tt, 0.55); const R = rnd(c.lv * 7 + 3);
  const shk = tt > 0.55 && tt < 1 ? 9 * Math.exp(-(tt - 0.55) * 9) * Math.sin((tt - 0.55) * 70) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#05060a'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translate(${shk}px,0)`, filter: tt > D - 0.22 ? `blur(${8 * ein((tt - (D - 0.22)) / 0.22)}px)` : undefined}}>
        <AbsoluteFill style={{background: c.bg ?? 'radial-gradient(ellipse at 50% 30%, #6b2a5a 0%, #2a1236 50%, #07080e 100%)'}} />
        {Array.from({length: 70}, (_, i) => { const x = R() * 1920, d = 0.15 + R() * 0.5, sp0 = 300 + R() * 500; const y = -60 + (tt - d) * sp0; if (tt < d) return null;
          return <div key={i} style={{position: 'absolute', left: x + 30 * Math.sin(tt * 3 + i), top: y, width: 16, height: 26, borderRadius: 3, background: ['#ff4f8b', '#ffd23f', '#3ee089', '#5aa9ff', '#b44dff'][i % 5], transform: `rotate(${tt * 300 * (i % 2 ? 1 : -1) + i * 20}deg)`, opacity: 0.9}} />; })}
        <div style={{position: 'absolute', left: 960 - 470, top: 150, width: 940, borderRadius: 34, background: 'rgba(245,245,250,0.94)', padding: '22px 30px', display: 'flex', gap: 22, alignItems: 'center',
          transform: `translateY(${(1 - n1) * -160}px) scale(${lerp(0.85, 1, clamp(n1))})`, opacity: clamp(n1 * 2), boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
          <div style={{width: 84, height: 84, borderRadius: 22, background: 'linear-gradient(135deg,#ff7a59,#c3337f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontFamily: FD, color: '#fff'}}>★</div>
          <div style={{flex: 1}}><div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FR, color: '#666', fontSize: 22}}><span>CREATOR STUDIO</span><span>now</span></div>
            <div style={{fontFamily: FB, fontSize: 40, color: INK}}>{c.note}</div></div>
        </div>
        <div style={{position: 'absolute', top: 400, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${lerp(2.2, 1, clamp(n2))})`, opacity: clamp(n2 * 3)}}>
          <ST text={`LEVEL ${c.lv}`} font={FA} size={230} color={WHITE} sw={16} />
        </div>
        <div style={{position: 'absolute', top: 700, width: '100%', display: 'flex', justifyContent: 'center', opacity: clamp((tt - 0.8) * 4), transform: `translateY(${(1 - eout((tt - 0.8) / 0.4)) * 40}px)`}}>
          <ST text={c.sub} font={FA} size={88} color={c.col ?? GOLD} sw={10} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(255,255,255,${0.85 * ein((tt - (D - 0.15)) / 0.15)})`}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- title + end screen
export const Title06: React.FC<{tt: number; T: number}> = ({tt, T}) => {
  const a = popS(tt, 0.05), b = popS(tt, 0.4); const out = ein((tt - (T - 0.25)) / 0.25);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3a1236 0%, #12081c 60%, #05040a 100%)', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.6 * out})`, opacity: 1 - out}}>
        <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${lerp(1.8, 1, clamp(a))})`, opacity: clamp(a * 3)}}><ST text="HOW INFLUENCERS ACTUALLY GET PAID" font={FA} size={118} color={WHITE} sw={12} /></div>
        <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${lerp(2.2, 1, clamp(b))})`, opacity: clamp(b * 3)}}><ST text="AT EVERY LEVEL" font={FA} size={190} color="rgb(255,90,140)" sw={14} /></div>
        <div style={{position: 'absolute', top: 720, width: '100%', display: 'flex', justifyContent: 'center', fontFamily: FB, fontSize: 40, color: GOLD, letterSpacing: 8, opacity: clamp((tt - 0.8) * 3)}}>0 → 10,000,000 FOLLOWERS</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const End06: React.FC<{tt: number}> = ({tt}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 40%, #2a1236 0%, #0d0814 70%)'}}>
    <div style={{position: 'absolute', left: 120, top: 110, fontFamily: FA, fontSize: 92, color: WHITE, opacity: clamp(tt * 3)}}><ST text="WATCH NEXT" font={FA} size={92} color={GOLD} sw={10} /></div>
    <div style={{position: 'absolute', left: 120, top: 260, width: 900, height: 506, borderRadius: 26, border: `6px solid ${GOLD}`, background: 'rgba(255,255,255,0.04)'}} />
    <div style={{position: 'absolute', left: 1440, top: 330, width: 340, height: 340, borderRadius: 170, border: `6px solid ${GOLD}`}} />
    <Img src={lsrc('P04')} style={{position: 'absolute', left: 1080, top: 520, height: 520}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontFamily: FR, fontSize: 22, color: '#bbb'}}>Not financial or tax advice. Story numbers are HYPOTHETICAL.</div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- where the dollar goes
/** segs: [[t, label, amount, col]] ; total ; youLabel */
export const DollarBar: React.FC<{t: number; t0: number; t1: number; title: string; total: number; segs: any[]; y?: number; x?: number; w?: number; tYou?: number}> = ({t, t0, t1, title, total, segs, y = 470, x = 960, w = 1500, tYou}) => {
  const s = sp(t, t0, {damping: 15, stiffness: 170}); const o = outF(t, t1);
  let acc = 0; const used = segs.filter((g) => t >= g[0]).reduce((a, g) => a + g[2], 0); const left = total - used;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - 150, width: w, opacity: o * clamp(s * 2), transform: `translateY(${(1 - s) * 60}px)`, fontFamily: FB, color: '#fff'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}><span style={{fontSize: 44}}>{title}</span><span style={{fontFamily: FA, fontSize: 70, color: GOLD}}>{money(total)}</span></div>
      <div style={{position: 'relative', height: 120, borderRadius: 22, background: '#1d2330', overflow: 'hidden', marginTop: 10, boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>
        {segs.map(([tg, label, amt, col], i) => { const p = eout((t - tg) / 0.45); const l = acc; acc += amt; if (p <= 0) return null;
          return <div key={i} style={{position: 'absolute', left: `${(100 * l) / total}%`, top: 0, bottom: 0, width: `${(100 * amt * p) / total}%`, background: col, borderRight: '3px solid #0e1116', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
            <span style={{fontSize: 22, whiteSpace: 'nowrap', textShadow: '0 2px 0 rgba(0,0,0,0.4)'}}>{amt / total > 0.12 ? label : ''}</span></div>; })}
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(100 * left) / total}%`, background: GREENK, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: tYou != null && t >= tYou ? `0 0 ${30 + 20 * Math.sin(t * 6)}px ${GREENK}` : undefined}}>
          <span style={{fontSize: 30, color: '#0b2a19'}}>YOU</span></div>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px 26px', marginTop: 16, fontSize: 24}}>
        {segs.filter((g) => t >= g[0]).map(([tg, label, amt, col], i) => <span key={i} style={{display: 'flex', alignItems: 'center', gap: 8, transform: `scale(${popS(t, tg)})`}}><span style={{width: 18, height: 18, borderRadius: 5, background: col}} />{label} <span style={{color: '#ff8a96'}}>−{money(amt)}</span></span>)}
        <span style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', color: GREENK}}>YOU KEEP {money(left)}</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- range bar ($50K ---- $250K+)
export const RangeBar: React.FC<{t: number; t0: number; t1: number; lo: string; hi: string; cap: string; y?: number; x?: number}> = ({t, t0, t1, lo, hi, cap, y = 560, x = 760}) => {
  const p = eout((t - t0 - 0.2) / 0.8); const o = outF(t, t1) * clamp((t - t0) * 4);
  return (
    <div style={{position: 'absolute', left: x - 560, top: y - 120, width: 1120, opacity: o, fontFamily: FB, color: '#fff'}}>
      <div style={{fontSize: 34, color: '#d6dbe4', marginBottom: 16}}>{cap}</div>
      <div style={{position: 'relative', height: 26, borderRadius: 13, background: '#2a303a'}}>
        <div style={{position: 'absolute', left: '12%', top: 0, bottom: 0, width: `${76 * p}%`, borderRadius: 13, background: `linear-gradient(90deg, ${GOLD}, ${GREENK})`}} />
        {[[12, lo], [12 + 76 * p, hi]].map(([l, s], i) => <div key={i} style={{position: 'absolute', left: `${l}%`, top: -12, width: 50, height: 50, marginLeft: -25, borderRadius: 25, background: '#fff', border: `6px solid ${i ? GREENK : GOLD}`}} />)}
      </div>
      <div style={{position: 'relative', height: 90}}>
        <div style={{position: 'absolute', left: '12%', top: 20, transform: 'translateX(-50%)'}}><ST text={lo} font={FA} size={74} color={GOLD} sw={8} /></div>
        <div style={{position: 'absolute', left: `${12 + 76 * p}%`, top: 20, transform: 'translateX(-50%)', opacity: clamp(p * 2)}}><ST text={hi} font={FA} size={74} color={GREENK} sw={8} /></div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the level ladder
/** items: labels ; marks: [[t, index, kind:'glow'|'dim'|'shake'|'gold', label?]] */
export const Ladder: React.FC<{t: number; t0: number; t1: number; items: string[]; marks?: any[]; y?: number; tStep?: number}> = ({t, t0, t1, items, marks = [], y = 540, tStep = 0.12}) => {
  const n = items.length; const W = 1760; const cw = W / n; const o = outF(t, t1);
  return (
    <div style={{position: 'absolute', left: 80, top: y - 150, width: W, height: 300, opacity: o}}>
      {items.map((lab, i) => { const s = popS(t, t0 + i * tStep); let st: any = null; for (const m of marks) if (m[1] === i && t >= m[0]) st = m;
        const kind = st ? st[2] : ''; const dim = kind === 'dim'; const glow = kind === 'glow' || kind === 'gold'; const shk = kind === 'shake' && t - st[0] < 0.6 ? 10 * Math.sin((t - st[0]) * 70) : 0;
        const col = kind === 'gold' ? GOLD : kind === 'shake' ? UI.red : glow ? '#fff' : '#9aa3b2';
        return <div key={i} style={{position: 'absolute', left: i * cw + 8, top: 140 - i * 10, width: cw - 16, height: 150 + i * 10, borderRadius: 18, background: glow ? 'rgba(230,199,119,0.18)' : 'rgba(255,255,255,0.06)', border: `4px solid ${kind === 'shake' ? UI.red : glow ? GOLD : 'rgba(255,255,255,0.18)'}`,
          transform: `translateX(${shk}px) scale(${s * (glow ? 1.06 + 0.03 * Math.sin(t * 6) : 1)})`, opacity: dim ? 0.3 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: glow ? `0 0 40px rgba(230,199,119,0.6)` : undefined}}>
          <div style={{fontFamily: FB, fontSize: 18, color: '#9aa3b2'}}>LVL {i}</div>
          <div style={{fontFamily: FA, fontSize: lab.length > 6 ? 30 : 42, color: col, textAlign: 'center', lineHeight: 1.05}}>{lab}</div>
          {st && st[3] && <div style={{position: 'absolute', top: -70, whiteSpace: 'nowrap'}}><ST text={st[3]} font={FA} size={44} color={kind === 'shake' ? 'rgb(255,90,100)' : GOLD} sw={6} /></div>}
        </div>; })}
    </div>
  );
};

// ---------------------------------------------------------------- checklist
export const Checklist: React.FC<{t: number; t0: number; t1: number; items: [number, string][]; x?: number; y?: number; w?: number; title?: string}> = ({t, t0, t1, items, x = 1250, y = 420, w = 760, title}) => {
  const o = outF(t, t1) * clamp((t - t0) * 4);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - 150, width: w, opacity: o, fontFamily: FB, color: '#fff', background: 'rgba(14,17,22,0.88)', borderRadius: 28, padding: '26px 30px', border: '3px solid rgba(255,255,255,0.12)'}}>
      {title && <div style={{fontSize: 30, color: GOLD, marginBottom: 12}}>{title}</div>}
      {items.map(([ti, txt], i) => { const ok = t >= ti; const p = popS(t, ti);
        return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, margin: '12px 0', fontSize: 34, opacity: ok ? 1 : 0.45}}>
          <span style={{width: 50, height: 50, borderRadius: 14, background: ok ? GREENK : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FD, fontSize: 32, transform: `scale(${ok ? p : 1})`, color: '#0b2a19'}}>{ok ? '✓' : ''}</span>{txt}</div>; })}
    </div>
  );
};

// ---------------------------------------------------------------- views vs money line graph
export const Heartbeat: React.FC<{t: number; t0: number; t1: number; pts: number[]; money?: boolean; x?: number; y?: number; w?: number; h?: number; label?: string}> = ({t, t0, t1, pts, money: m = true, x = 960, y = 560, w = 1400, h = 420, label}) => {
  const p = eout((t - t0) / 1.6); const o = outF(t, t1) * clamp((t - t0) * 4); const n = pts.length; const mx = Math.max(...pts);
  const path = (k: number) => pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (n - 1)) * w},${h - (v / mx) * (h - 40) * k - 20}`).join(' ');
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o}}>
      <svg width={w} height={h} style={{overflow: 'visible'}}>
        <defs><clipPath id="hbclip"><rect x={0} y={-50} width={w * p} height={h + 100} /></clipPath></defs>
        {[0.25, 0.5, 0.75, 1].map((k) => <line key={k} x1={0} x2={w} y1={h * k} y2={h * k} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />)}
        <g clipPath="url(#hbclip)">
          <path d={path(1)} fill="none" stroke="#5aa9ff" strokeWidth={8} strokeLinejoin="round" />
          {m && <path d={path(0.62)} fill="none" stroke={GOLD} strokeWidth={8} strokeLinejoin="round" strokeDasharray="1 0" transform="translate(0,40)" />}
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, top: -64, display: 'flex', gap: 36, fontFamily: FB, fontSize: 30}}>
        <span style={{color: '#5aa9ff'}}>■ VIEWS</span>{m && <span style={{color: GOLD}}>■ MONEY</span>}{label && <span style={{color: '#fff'}}>{label}</span>}</div>
    </div>
  );
};

// ---------------------------------------------------------------- donut (55/45 swap)
export const Donut: React.FC<{t: number; t0: number; t1: number; keys: [number, number, string][]; x?: number; y?: number; r?: number}> = ({t, t0, t1, keys, x = 1280, y = 520, r = 230}) => {
  let i = 0; keys.forEach((k, j) => { if (t >= k[0]) i = j; }); const k = keys[i]; const prev = keys[Math.max(0, i - 1)]; const q = eout((t - k[0]) / 0.6);
  const you = i > 0 ? lerp(prev[1], k[1], q) : k[1] * eout((t - t0) / 0.8); const s = popS(t, t0); const o = outF(t, t1);
  const C = 2 * Math.PI * r;
  return (
    <div style={{position: 'absolute', left: x - r - 40, top: y - r - 40, width: 2 * r + 80, height: 2 * r + 80, transform: `scale(${s})`, opacity: o}}>
      <svg width={2 * r + 80} height={2 * r + 80}><g transform={`translate(${r + 40},${r + 40}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="#3a4150" strokeWidth={90} />
        <circle r={r} fill="none" stroke={GREENK} strokeWidth={90} strokeDasharray={`${(C * you) / 100} ${C}`} />
      </g></svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <ST text={`${Math.round(you)}%`} font={FA} size={110} color={GREENK} sw={8} />
        <div style={{fontFamily: FB, fontSize: 28, color: '#fff', marginTop: -6}}>{k[2]}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- months row (deal calendar)
export const Months: React.FC<{t: number; t0: number; t1: number; cells: [string, string, number][]; y?: number}> = ({t, t0, t1, cells, y = 520}) => {
  const o = outF(t, t1);
  return (
    <div style={{position: 'absolute', left: 960 - cells.length * 160, top: y - 140, display: 'flex', gap: 20, opacity: o}}>
      {cells.map(([m, v, tc], i) => { const s = popS(t, tc); const zero = v === '$0';
        return <div key={i} style={{width: 300, height: 280, borderRadius: 26, background: 'rgba(14,17,22,0.88)', border: `4px solid ${zero ? 'rgba(255,90,100,0.6)' : GOLD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`}}>
          <div style={{fontFamily: FB, fontSize: 32, color: '#9aa3b2'}}>{m}</div><ST text={v} font={FA} size={96} color={zero ? 'rgb(255,90,100)' : GOLD} sw={8} /></div>; })}
    </div>
  );
};

// ---------------------------------------------------------------- tiles (four "own it" tiles)
export const Tiles: React.FC<{t: number; t0: number; t1: number; items: [number, string, string][]; y?: number}> = ({t, t0, t1, items, y = 520}) => {
  const o = outF(t, t1);
  return (
    <div style={{position: 'absolute', left: 960 - items.length * 215, top: y - 160, display: 'flex', gap: 30, opacity: o}}>
      {items.map(([ti, ico, txt], i) => { const s = popS(t, ti);
        return <div key={i} style={{width: 400, height: 320, borderRadius: 30, background: 'linear-gradient(160deg,#1f2a22,#0f1a14)', border: `4px solid ${GREENK}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `translateY(${(1 - s) * 80}px) scale(${s})`}}>
          <div style={{fontSize: 96, fontFamily: FD, color: GREENK}}>{ico}</div><div style={{fontFamily: FA, fontSize: 52, color: '#fff', textAlign: 'center', lineHeight: 1.05, padding: '0 20px'}}>{txt}</div></div>; })}
    </div>
  );
};

// ---------------------------------------------------------------- pyramid of creators
export const Pyramid: React.FC<{t: number; t0: number; t1: number; tTop: number}> = ({t, t0, t1, tTop}) => {
  const o = outF(t, t1); const z = lerp(2.6, 1, eout((t - t0) / 1.6)); const R = rnd(9); const rows = 16; const dots: any[] = [];
  for (let r = 0; r < rows; r++) { const n = 2 + r * 6; for (let i = 0; i < n; i++) dots.push([960 + (i - (n - 1) / 2) * 18, 160 + r * 52, r]); }
  return (
    <AbsoluteFill style={{opacity: o, transform: `scale(${z})`, transformOrigin: '50% 12%'}}>
      {dots.map(([x, y, r], i) => { const top = r < 2; return <div key={i} style={{position: 'absolute', left: x - 7, top: y, width: 14, height: 28, borderRadius: 7, background: top && t >= tTop ? GOLD : '#59606c', boxShadow: top && t >= tTop ? `0 0 14px ${GOLD}` : undefined}} />; })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- org chart
export const Org: React.FC<{t: number; t0: number; t1: number; boxes: [number, string][]; tGrow?: number}> = ({t, t0, t1, boxes, tGrow}) => {
  const o = outF(t, t1); const top = popS(t, t0); const grow = tGrow != null ? eout((t - tGrow) / 0.8) : 0;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: 960 - 150, top: 300, width: 300, height: 120, borderRadius: 22, background: GOLD, color: INK, fontFamily: FA, fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${top})`}}>YOU</div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>{boxes.map(([tb], i) => { const x = 960 + (i - (boxes.length - 1) / 2) * 340; return t >= tb ? <path key={i} d={`M960,420 L960,480 L${x},480 L${x},540`} stroke="#59606c" strokeWidth={6} fill="none" /> : null; })}</svg>
      {boxes.map(([tb, lab], i) => { const x = 960 + (i - (boxes.length - 1) / 2) * 340; const s = popS(t, tb); const big = lab === 'PRODUCTS' ? 1 + 0.5 * grow : 1;
        return <div key={i} style={{position: 'absolute', left: x - 150, top: 540, width: 300, height: 110, borderRadius: 20, background: lab === 'PRODUCTS' && grow > 0 ? '#1f5a3a' : '#1d2330', border: `4px solid ${lab === 'PRODUCTS' && grow > 0 ? GREENK : 'rgba(255,255,255,0.2)'}`, color: '#fff', fontFamily: FA, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s * big})`, transformOrigin: '50% 0', zIndex: lab === 'PRODUCTS' ? 2 : 1}}>{lab}</div>; })}
      {boxes.map(([tb], i) => { const x = 960 + (i - (boxes.length - 1) / 2) * 340; return Array.from({length: 8}, (_, k) => t >= tb + 0.3 + k * 0.05 ? <div key={i + '-' + k} style={{position: 'absolute', left: x - 120 + (k % 4) * 64, top: 700 + Math.floor(k / 4) * 70, width: 26, height: 48, borderRadius: 13, background: '#59606c'}} /> : null); })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- code-drawn props (no AI images needed)
const OL = '#16181d';
const VB: Record<string, [number, number]> = {ringlight: [55, 200], tripod: [60, 165], mic: [50, 105], camera: [86, 122], giftbox: [100, 96], can: [55, 96], bottle: [50, 100], contract: [92, 100], boxes: [90, 110], medal: [70, 96], hoodie: [100, 98]};
export const SVGPROPS: Record<string, [number, (s: number) => React.ReactNode]> = {
  // [aspect w/h, draw] drawn in the viewBox from VB
  ringlight: [0.275, () => <g stroke={OL} strokeWidth={3}><line x1={27.5} y1={70} x2={27.5} y2={175} strokeWidth={5} /><path d="M27.5,175 L10,195 M27.5,175 L45,195 M27.5,175 L27.5,197" strokeWidth={4} fill="none" /><circle cx={27.5} cy={40} r={26} fill="none" strokeWidth={10} stroke={OL} /><circle cx={27.5} cy={40} r={26} fill="none" strokeWidth={6} stroke="#fffbe8" /><rect x={23} y={34} width={9} height={14} rx={2} fill="#3a3f48" /></g>],
  tripod: [0.364, () => <g stroke={OL} strokeWidth={3}><rect x={10} y={8} width={40} height={72} rx={7} fill="#20242c" /><rect x={14} y={14} width={32} height={60} rx={4} fill="#3b4a6b" /><rect x={24} y={80} width={12} height={8} fill="#555" /><path d="M30,88 L8,160 M30,88 L52,160 M30,88 L30,162" strokeWidth={5} fill="none" /></g>],
  mic: [0.476, () => <g stroke={OL} strokeWidth={3}><rect x={14} y={6} width={22} height={34} rx={11} fill="#2a2e36" /><path d="M16,18 h18 M16,26 h18" stroke="#555" /><rect x={18} y={40} width={14} height={12} fill="#555" /><path d="M25,52 C25,80 10,80 12,100" fill="none" strokeWidth={3} /><rect x={30} y={10} width={12} height={20} rx={2} fill="#777" /></g>],
  camera: [0.705, () => <g stroke={OL} strokeWidth={3}><rect x={8} y={18} width={70} height={46} rx={8} fill="#2a2e36" /><rect x={22} y={10} width={22} height={10} rx={2} fill="#2a2e36" /><circle cx={43} cy={41} r={16} fill="#111" /><circle cx={43} cy={41} r={9} fill="#3b4a6b" /><circle cx={68} cy={28} r={3} fill="#ff4757" stroke="none" /><path d="M43,64 L20,118 M43,64 L66,118 M43,64 L43,120" strokeWidth={5} fill="none" /></g>],
  giftbox: [1.042, () => <g stroke={OL} strokeWidth={3}><rect x={14} y={42} width={72} height={50} rx={4} fill="#1fb5a5" /><rect x={10} y={30} width={80} height={16} rx={3} fill="#22c7b5" /><rect x={45} y={30} width={10} height={62} fill="#f2c94c" /><path d="M50,30 C35,8 18,18 32,30 Z M50,30 C65,8 82,18 68,30 Z" fill="#f2c94c" /></g>],
  can: [0.573, () => <g stroke={OL} strokeWidth={3}><rect x={8} y={10} width={39} height={78} rx={6} fill="#1e7bff" /><rect x={8} y={10} width={39} height={10} rx={4} fill="#cfd5df" /><rect x={8} y={80} width={39} height={8} rx={3} fill="#cfd5df" /><path d="M31,24 L17,50 L27,50 L22,72 L39,42 L29,42 Z" fill="#ffe14d" strokeWidth={2} /></g>],
  bottle: [0.5, () => <g stroke={OL} strokeWidth={3}><rect x={17} y={2} width={16} height={12} rx={3} fill="#2a2e36" /><path d="M14,14 h22 v8 c6,4 8,8 8,14 v52 c0,6 -4,8 -8,8 h-22 c-4,0 -8,-2 -8,-8 v-52 c0,-6 2,-10 8,-14z" fill="#e8f3ff" /><rect x={6} y={46} width={38} height={24} fill="#ff7a59" /></g>],
  contract: [0.92, () => <g stroke={OL} strokeWidth={3}><rect x={14} y={10} width={64} height={86} rx={3} fill="#fff" transform="rotate(6 46 53)" /><rect x={6} y={6} width={64} height={86} rx={3} fill="#fff" />{[20, 30, 40, 50, 60].map((y) => <line key={y} x1={14} x2={60} y1={y} y2={y} stroke="#c3c8d1" strokeWidth={3} />)}<path d="M14,78 c8,-8 14,6 22,-2 s10,4 16,-2" fill="none" stroke="#2f5bd8" /><path d="M58,62 l20,-30 l6,4 l-20,30 l-8,4z" fill="#ffb020" /></g>],
  boxes: [0.818, () => <g stroke={OL} strokeWidth={3}>{[[8, 60, 74, 38], [14, 24, 62, 36], [22, -6, 46, 30]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y + 10} width={w} height={h} fill="#c8935a" /><line x1={x + w / 2} x2={x + w / 2} y1={y + 10} y2={y + 10 + h} stroke="#e8c79a" strokeWidth={5} /></g>)}</g>],
  medal: [0.729, () => <g stroke={OL} strokeWidth={3}><path d="M20,4 L35,44 L50,4 Z" fill="#e8384f" /><circle cx={35} cy={66} r={28} fill="#f2c94c" /><circle cx={35} cy={66} r={19} fill="#ffe08a" /><path d="M35,52 l4,9 10,1 -8,6 3,10 -9,-6 -9,6 3,-10 -8,-6 10,-1z" fill="#e0a92c" stroke="none" /></g>],
  hoodie: [1.02, () => <g stroke={OL} strokeWidth={3} strokeLinejoin="round"><path d="M28,22 L8,40 L4,88 L18,90 L22,52 L26,52 L26,94 L74,94 L74,52 L78,52 L82,90 L96,88 L92,40 L72,22 Z" fill="#3a3f48" /><path d="M30,24 C28,4 72,4 70,24 C66,34 34,34 30,24 Z" fill="#2c3038" /><path d="M38,22 C40,12 60,12 62,22 C58,28 42,28 38,22 Z" fill="#1d2026" /><path d="M44,28 v16 M56,28 v16" stroke="#cfd5df" strokeWidth={2.5} /><rect x={34} y={62} width={32} height={18} rx={6} fill="#2c3038" /><path d="M26,90 h48" stroke="#2c3038" strokeWidth={5} /></g>],
};
export const SvgProp: React.FC<{k: string; h: number}> = ({k, h}) => { const P = SVGPROPS[k]; if (!P) return null; const [, draw] = P; const [vw, vh] = VB[k]; const ar = vw / vh;
  return <svg width={h * ar} height={h} viewBox={`0 0 ${vw} ${vh}`} style={{overflow: 'visible', filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.35))'}}>{draw(h)}</svg>; };

// ---------------------------------------------------------------- price tag (props with a price)
export const Tag: React.FC<{t: number; t0: number; t1: number; text: string; x: number; y: number; col?: string}> = ({t, t0, t1, text, x, y, col = GOLD}) => {
  const s = popS(t, t0); return <At x={x} y={y} s={s} r={-6} o={outF(t, t1) * clamp(s * 3)}><div style={{background: col, color: INK, fontFamily: FA, fontSize: 52, padding: '4px 22px', borderRadius: 14, border: '5px solid #fff', boxShadow: '0 8px 0 rgba(0,0,0,0.3)'}}>{text}</div></At>;
};

// ---------------------------------------------------------------- chain: YOU --videos--> APP <--$$-- ADVERTISERS
export const Chain: React.FC<{t: number; t0: number; t1: number; nodes: [number, string, string, string][]; links: [number, string, string][]; back?: [number, string]; y?: number}> = ({t, t0, t1, nodes, links, back, y = 470}) => {
  const o = outF(t, t1, 0.25); const n = nodes.length; const gap = 1700 / n; const X = (i: number) => 110 + gap * (i + 0.5);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      {links.map(([tl, lab, col], i) => { const p = eout((t - tl) / 0.5); if (t < tl) return null; const x0 = X(i) + 170, x1 = X(i + 1) - 170;
        return <div key={'l' + i}><div style={{position: 'absolute', left: x0, top: y - 9, width: (x1 - x0) * p, height: 18, background: col, borderRadius: 9}} />
          <div style={{position: 'absolute', left: x0 + (x1 - x0) * p - 10, top: y - 28, borderTop: '28px solid transparent', borderBottom: '28px solid transparent', borderLeft: `40px solid ${col}`}} />
          <div style={{position: 'absolute', left: (x0 + x1) / 2 - 170, width: 340, top: y - 92, textAlign: 'center', fontFamily: FB, fontSize: 36, color: col, opacity: p}}>{lab}</div></div>; })}
      {nodes.map(([tn, lab, img, col], i) => { const s = popS(t, tn); if (t < tn) return null;
        return <div key={i} style={{position: 'absolute', left: X(i) - 160, top: y - 140, width: 320, height: 280, borderRadius: 34, background: 'rgba(14,17,22,0.9)', border: `5px solid ${col}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${clamp(s, 0, 1.2)})`}}>
          {img.startsWith('svg:') ? <SvgProp k={img.slice(4)} h={130} /> : <Img src={lsrc(img)} style={{height: 140}} />}
          <div style={{fontFamily: FA, fontSize: 56, color: col}}>{lab}</div></div>; })}
      {back && t >= back[0] && (() => { const p = eout((t - back[0]) / 0.6); return <div style={{position: 'absolute', left: X(0), top: y + 170, width: (X(n - 1) - X(0)) * p, height: 70, borderLeft: `6px solid ${UI.red}`, borderBottom: `6px solid ${UI.red}`, borderRight: p > 0.95 ? `6px solid ${UI.red}` : undefined, borderRadius: '0 0 20px 20px'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 80, display: 'flex', justifyContent: 'center'}}><ST text={back[1]} font={FA} size={64} color="rgb(255,90,100)" sw={8} /></div></div>; })()}
    </div>
  );
};
