import React from 'react';
import {Img, AbsoluteFill} from 'remotion';
import {ST, At} from '../Text';
import {UI, GOLD, INK, RED, WHITE, sp, popS, ease, eout, ein, clamp, lerp, outF, FA, FB, FR, FD, lsrc, ldims, money, cracks, rnd, textW} from './base';
import {Lock, SW, SH, BZ, AppIcon, APPS} from './Phone';

// ---------------------------------------------------------------- Debt Tracker HUD (top right)
/** st = {plans, owed, apps, next, nextAmt, late} ; tChange = time of last change (for the bump) */
export const Tracker: React.FC<{t: number; st: any; tIn: number; tChange: number}> = ({t, st, tIn, tChange}) => {
  const s = sp(t, tIn, {damping: 14, stiffness: 160}); const b = t - tChange < 0.5 ? popS(t, tChange) : 1; const bump = t - tChange < 0.5 ? lerp(1.12, 1, clamp(b)) : 1;
  const flash = t - tChange < 0.5 ? 1 - (t - tChange) / 0.5 : 0; const late = st.late;
  return (
    <div style={{position: 'absolute', left: 40, top: 32 - (1 - s) * 200, width: 470, borderRadius: 26, background: 'rgba(14,17,22,0.88)', border: `3px solid ${late ? UI.red : 'rgba(180,77,255,0.7)'}`, boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 ${30 * flash}px rgba(180,77,255,${flash})`, padding: '14px 20px', fontFamily: FB, color: '#fff', transform: `scale(${bump})`, transformOrigin: '0 0'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: UI.sub, letterSpacing: 2}}><AppIcon size={24} />DEBT TRACKER</div>
      <div style={{display: 'flex', gap: 22, marginTop: 8, alignItems: 'baseline'}}>
        <div><div style={{fontSize: 13, color: UI.sub}}>PLANS</div><div style={{fontFamily: FA, fontSize: 52, lineHeight: 1, color: st.plans > 8 ? UI.red : st.plans > 3 ? UI.amber : '#fff'}}>{st.plans}{st.apps > 1 && <span style={{fontSize: 22, color: UI.sub}}> · {st.apps} APPS</span>}</div></div>
        <div><div style={{fontSize: 13, color: UI.sub}}>OWED</div><div style={{fontFamily: FA, fontSize: 52, lineHeight: 1, color: GOLD}}>{money(st.owed)}</div></div>
      </div>
      {(st.next || late) && <div style={{marginTop: 8, fontSize: 18, color: late ? UI.red : '#d6dbe4'}}>{late ? '⚠ PAYMENTS PAST DUE' : <>NEXT: <b>{st.next}</b> {st.nextAmt != null && <span style={{color: GOLD}}>{money(st.nextAmt, st.nextAmt % 1 !== 0)}</span>}</>}</div>}
      <div style={{fontFamily: FR, fontSize: 13, color: '#8a93a3', marginTop: 4}}>HYPOTHETICAL story numbers</div>
    </div>
  );
};

// ---------------------------------------------------------------- level card: a full-screen lock screen
export const LevelCard: React.FC<{tt: number; c: any}> = ({tt, c}) => {
  const D = c.dur ?? 2.2; const k = 1.18; const zoom = 1 + 0.05 * ease(tt / D) + 0.5 * ein((tt - (D - 0.22)) / 0.22);
  const crack = c.crack ?? 0; const C = cracks(c.seed ?? 11, crack, 1920, 1080);
  const n1 = popS(tt, 0.35); const n2 = popS(tt, 0.65); const shk = tt > 0.35 && tt < 0.8 ? 9 * Math.exp(-(tt - 0.35) * 9) * Math.sin((tt - 0.35) * 70) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#05060a'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translate(${shk}px,0)`, filter: tt > D - 0.22 ? `blur(${8 * ein((tt - (D - 0.22)) / 0.22)}px)` : undefined}}>
        <AbsoluteFill style={{background: c.bg ?? 'radial-gradient(ellipse at 30% 20%, #3b2a6b 0%, #171233 45%, #07080e 100%)'}} />
        <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: FR, color: 'rgba(255,255,255,0.85)', fontSize: 34}}>{c.date ?? 'Tuesday'}</div>
        <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: FB, fontWeight: 800, color: '#fff', fontSize: 200, letterSpacing: -6, lineHeight: 1}}>{c.clock}</div>
        <div style={{position: 'absolute', left: 960 - 520, top: 470, width: 1040, borderRadius: 40, background: 'rgba(245,245,250,0.9)', padding: '30px 36px', display: 'flex', gap: 30, alignItems: 'center',
          transform: `translateY(${(1 - n1) * -160}px) scale(${lerp(0.85, 1, clamp(n1))})`, opacity: clamp(n1 * 2), boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
          <AppIcon size={110} />
          <div style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FR, color: '#666', fontSize: 26}}><span>PAY IN 4</span><span>now</span></div>
            <div style={{fontFamily: FA, fontSize: 104, color: INK, lineHeight: 1.05}}>LEVEL {c.lv}</div>
            <div style={{fontFamily: FB, fontWeight: 800, fontSize: 40, color: c.col ?? '#4b2bbf', transform: `scale(${lerp(0.6, 1, clamp(n2))})`, transformOrigin: '0 50%', opacity: clamp(n2 * 3)}}>{c.sub}</div>
          </div>
        </div>
        {crack > 0 && <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {C.lines.map((d, i) => <path key={i} d={d} stroke="rgba(255,255,255,0.9)" strokeWidth={3} fill="none" />)}
          {C.lines.map((d, i) => <path key={'b' + i} d={d} stroke="rgba(0,0,0,0.6)" strokeWidth={1.5} fill="none" transform="translate(3,3)" />)}
          <circle cx={C.cx} cy={C.cy} r={14 + 20 * crack} fill="rgba(255,255,255,0.25)" />
        </svg>}
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(255,255,255,${0.85 * ein((tt - (D - 0.15)) / 0.15)})`}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- receipt printer
/** lines: [[label, value, col?]] ; long = how long the paper gets (px) */
export const Receipt: React.FC<{t: number; t0: number; t1: number; lines: any[]; x?: number; tear?: number; full?: boolean}> = ({t, t0, t1, lines, x = 1560, tear, full}) => {
  const pr = eout((t - t0) / 0.9); const out = ein((t - (t1 - 0.3)) / 0.3); const lh = 54; const H = 150 + lines.length * lh + (full ? 300 : 0);
  const shown = H * pr; const R = rnd(3); const teeth = Array.from({length: 18}, (_, i) => `${i * 20},0 ${i * 20 + 10},12`).join(' ');
  const torn = tear != null && t >= tear ? eout((t - tear) / 0.5) : 0;
  return (
    <div style={{position: 'absolute', left: x - 180, top: -6, width: 360, height: shown + 30, overflow: 'hidden', transform: `translateY(${-out * (shown + 60)}px)`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 360, height: 26, background: '#1b1f27', borderRadius: '0 0 14px 14px', zIndex: 2, boxShadow: '0 6px 10px rgba(0,0,0,0.4)'}} />
      <div style={{position: 'absolute', left: 20, top: shown - H + 14 + torn * 400, width: 320, height: H, background: '#fbfaf5', boxShadow: '0 12px 30px rgba(0,0,0,0.35)', fontFamily: 'monospace', color: '#222', padding: '26px 22px', boxSizing: 'border-box', transform: `rotate(${torn * 18}deg)`, opacity: 1 - torn * 0.7}}>
        <div style={{textAlign: 'center', fontFamily: FB, fontWeight: 800, fontSize: 22, letterSpacing: 3}}>RECEIPT</div>
        <div style={{borderTop: '2px dashed #999', margin: '12px 0'}} />
        {lines.map(([l, v, c]: any, i: number) => <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, lineHeight: `${lh}px`, fontWeight: 700, color: c ?? '#222'}}><span>{l}</span><span>{v}</span></div>)}
        <svg width={320} height={14} style={{position: 'absolute', left: 0, bottom: -12}}><polygon points={`0,0 ${teeth} 360,0`} fill="#fbfaf5" /></svg>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- combo counter ("PLAN ×3!")
export const Combo: React.FC<{t: number; t0: number; t1: number; n: number; x?: number; y?: number; text?: string}> = ({t, t0, t1, n, x = 1350, y = 520, text}) => {
  const s = popS(t, t0); const o = outF(t, t1); const shk = t - t0 < 0.4 ? 10 * Math.sin((t - t0) * 80) * (1 - (t - t0) / 0.4) : 0;
  return <At x={x + shk} y={y} s={lerp(2.2, 1, clamp(s)) * (s > 1 ? s : 1)} r={-8} o={o * clamp(s * 3)}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
      <ST text={text ?? 'PLAN'} font={FA} size={110} color={WHITE} sw={12} />
      <ST text={`×${n}!`} font={FA} size={170} color={n >= 7 ? 'rgb(255,80,90)' : GOLD} sw={14} />
    </div>
  </At>;
};

// ---------------------------------------------------------------- slap stickers (fees etc.)
export const Sticker: React.FC<{t: number; t0: number; t1: number; text: string; x: number; y: number; col?: string; rot?: number; size?: number}> = ({t, t0, t1, text, x, y, col = RED, rot = -8, size = 64}) => {
  const tt = t - t0; const s = tt < 0.14 ? lerp(1.6, 1, ein(tt / 0.14)) : 1 + 0.06 * Math.exp(-(tt - 0.14) * 9) * Math.sin((tt - 0.14) * 45);
  return <At x={x} y={y} s={s} r={rot} o={outF(t, t1) * clamp(tt / 0.06)}>
    <div style={{background: col, color: '#fff', fontFamily: FA, fontSize: size, padding: '10px 34px', borderRadius: 18, border: '7px solid #fff', boxShadow: '0 12px 0 rgba(0,0,0,0.35)', whiteSpace: 'pre', lineHeight: 1.05}}>{text}</div>
  </At>;
};

// ---------------------------------------------------------------- caption label (freeze frames, meme beats)
export const Label: React.FC<{t: number; t0: number; t1: number; text: string; y?: number; col?: string; size?: number; x?: number}> = ({t, t0, t1, text, y = 860, col = GOLD, size = 120, x = 960}) => {
  const words = text.split(' ');
  return <At x={x} y={y} o={outF(t, t1)}>
    <div style={{display: 'flex', gap: size * 0.3}}>{words.map((w, k) => { const s = popS(t, t0 + k * 0.08); return <div key={k} style={{transform: `translateY(${(1 - s) * 50}px) scale(${s}) rotate(${(1 - clamp(s)) * (k % 2 ? 8 : -8)}deg)`, opacity: clamp(s * 3)}}><ST text={w} font={FA} size={size} color={col} sw={13} /></div>; })}</div>
  </At>;
};

// ---------------------------------------------------------------- stat card + source pill
export const Stat: React.FC<{t: number; t0: number; t1: number; big: string; cap: string; x?: number; y?: number; col?: string; size?: number; w?: number}> = ({t, t0, t1, big, cap, x = 960, y = 470, col = GOLD, size = 190, w = 1100}) => {
  const s = sp(t, t0, {damping: 12, stiffness: 170}); const o = outF(t, t1, 0.2);
  return <At x={x} y={y + (1 - s) * 80} s={lerp(0.85, 1, clamp(s))} o={o * clamp(s * 2)}>
    <div style={{width: w, padding: '34px 40px', borderRadius: 36, background: 'rgba(14,17,22,0.9)', border: `4px solid ${col}`, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
      <div style={{fontFamily: FA, fontSize: size, lineHeight: 1, color: col, textShadow: `0 0 30px ${col}55`}}>{big}</div>
      <div style={{fontFamily: FB, fontWeight: 800, fontSize: 42, color: '#fff', marginTop: 14, lineHeight: 1.2}}>{cap}</div>
    </div>
  </At>;
};
export const Source: React.FC<{t: number; t0: number; t1: number; text: string}> = ({t, t0, t1, text}) => {
  const o = clamp((t - t0) / 0.25) * outF(t, t1, 0.25);
  return <div style={{position: 'absolute', left: 44 - (1 - eout((t - t0) / 0.3)) * 60, bottom: 40, opacity: o, background: 'rgba(14,17,22,0.85)', borderRadius: 14, padding: '12px 22px', fontFamily: FR, fontSize: 26, color: '#e6e6e6', border: '1px solid rgba(255,255,255,0.15)'}}>Source: {text}</div>;
};
export const Hypo: React.FC<{t: number; t0: number; t1: number; x?: number; y?: number}> = ({t, t0, t1, x = 1745, y = 76}) => {
  const tt = t - t0; const s = tt < 0.16 ? 1.8 - 0.8 * ein(tt / 0.16) : 1;
  return <At x={x} y={y} s={s} r={-6} o={outF(t, t1) * clamp(tt / 0.08)}><div style={{border: `5px solid ${RED}`, borderRadius: 10, padding: '4px 20px', fontFamily: FA, fontSize: 40, color: RED, background: 'rgba(255,255,255,0.9)'}}>HYPOTHETICAL</div></At>;
};

// ---------------------------------------------------------------- group chat with Jay
/** msgs = [[t, from:'jay'|'you', text, typingFrom?]] */
export const Chat: React.FC<{t: number; t0: number; t1: number; msgs: any[]; x?: number; y?: number}> = ({t, t0, t1, msgs, x = 70, y = 250}) => {
  const s = sp(t, t0, {damping: 14, stiffness: 170}); const o = outF(t, t1, 0.25);
  const head = ldims('C03'); const vis = msgs.filter((m) => t >= m[0] || (m[3] != null && t >= m[3]));
  return <div style={{position: 'absolute', left: x - (1 - s) * 700, top: y, width: 620, opacity: o, fontFamily: FB}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(14,17,22,0.88)', borderRadius: '26px 26px 0 0', padding: '14px 20px'}}>
      <div style={{width: 64, height: 64, borderRadius: 32, overflow: 'hidden', background: '#2b8a5a', position: 'relative'}}><Img src={lsrc('C03')} style={{position: 'absolute', width: 64 * 2.4 * head.ar, height: 64 * 2.4, left: 32 - 64 * 1.2 * head.ar, top: -4}} /></div>
      <div><div style={{color: '#fff', fontSize: 26, fontWeight: 800}}>Jay</div><div style={{color: UI.sub, fontSize: 16, fontFamily: FR}}>{vis.some((m) => m[3] != null && t >= m[3] && t < m[0]) ? 'typing…' : 'online'}</div></div>
    </div>
    <div style={{background: 'rgba(14,17,22,0.72)', borderRadius: '0 0 26px 26px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10}}>
      {vis.map(([tm, from, text, typ]: any, i: number) => {
        const typing = typ != null && t < tm; const ins = popS(t, typing ? typ : tm); const me = from === 'you';
        return <div key={i} style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 470, background: me ? '#2f8cff' : '#e9e9ee', color: me ? '#fff' : '#111', borderRadius: 24, padding: '12px 20px', fontSize: 28, fontFamily: FR, fontWeight: 700, transform: `scale(${clamp(ins, 0, 1.2)})`, transformOrigin: me ? '100% 100%' : '0 100%'}}>
          {typing ? <span style={{letterSpacing: 4}}>{'•••'.slice(0, 1 + (Math.floor(t * 4) % 3))}</span> : text}
        </div>;
      })}
    </div>
  </div>;
};

// ---------------------------------------------------------------- bars chart (BNPL use by income)
export const Bars: React.FC<{t: number; t0: number; t1: number; items: any[]; title: string; max?: number}> = ({t, t0, t1, items, title, max}) => {
  const o = outF(t, t1, 0.25); const s = sp(t, t0, {damping: 14, stiffness: 160}); const M = max ?? Math.max(...items.map((i) => i[1]));
  return <div style={{position: 'absolute', left: 560, top: 150 + (1 - s) * 100, width: 1000, height: 700, borderRadius: 36, background: 'rgba(14,17,22,0.9)', border: `4px solid ${GOLD}`, opacity: o * clamp(s * 2), fontFamily: FB}}>
    <div style={{textAlign: 'center', color: '#fff', fontSize: 40, fontWeight: 800, marginTop: 28}}>{title}</div>
    {items.map(([lab, v, col, ti], i: number) => {
      const p = eout((t - (ti ?? t0 + 0.3 + i * 0.35)) / 0.7); const hh = 400 * (v / M) * p; const cx = 1000 / (items.length + 1) * (i + 1);
      return <div key={i}>
        <div style={{position: 'absolute', left: cx - 95, bottom: 110, width: 190, height: hh, borderRadius: '18px 18px 6px 6px', background: col ?? GOLD, border: `5px solid ${INK}`, boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: cx - 120, width: 240, bottom: 120 + hh, textAlign: 'center', fontFamily: FA, fontSize: 72, color: '#fff', opacity: clamp(p * 2)}}>{v}%</div>
        <div style={{position: 'absolute', left: cx - 150, width: 300, bottom: 40, textAlign: 'center', fontSize: 28, color: 'rgb(220,225,232)'}}>{lab}</div>
      </div>;
    })}
  </div>;
};

// ---------------------------------------------------------------- 8-week payment timeline (Level 2 math)
export const Weeks: React.FC<{t: number; t0: number; t1: number; plans: any[]; labels?: string[]; note?: string; sums?: any[]}> = ({t, t0, t1, plans, labels, note, sums}) => {
  const NC = labels ? labels.length : 9; const CW = 1460 / NC;
  const o = outF(t, t1, 0.25); const s = sp(t, t0, {damping: 14, stiffness: 150}); const cw = 1500 / 9;
  const PH = 160 + plans.length * 120 + (sums && sums.length ? 110 : 0);
  return <div style={{position: 'absolute', left: 210, top: 540 - PH / 2 + (1 - s) * 80, width: 1500, height: PH, borderRadius: 36, background: 'rgba(14,17,22,0.92)', opacity: o * clamp(s * 2), fontFamily: FB}}>
    {Array.from({length: NC}, (_, w) => <div key={w} style={{position: 'absolute', left: 20 + w * CW, top: 30, width: CW - 10, textAlign: 'center', color: UI.sub, fontSize: 26}}>{labels ? labels[w] : `WK ${w + 1}`}</div>)}
    {plans.map((p: any, r: number) => p.weeks.map((w: number, k: number) => {
      const tk = p.ts ? p.ts[k] : (p.t ?? t0 + 0.3) + k * 0.18; const ps = popS(t, tk); if (t < tk) return null;
      return <div key={r + '-' + k} style={{position: 'absolute', left: 30 + w * CW, top: 90 + r * 120, width: CW - 30, height: 96, borderRadius: 16, background: p.col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FA, fontSize: 46, color: '#fff', transform: `scale(${ps})`, border: '4px solid #000'}}>{p.label ?? money(p.amt)}</div>;
    }))}
    {(sums || []).map(([w, v, tt]: any, i: number) => t >= tt && <div key={'s' + i} style={{position: 'absolute', left: 30 + w * CW, top: 90 + plans.length * 120 + 10, width: CW - 30, textAlign: 'center', fontFamily: FA, fontSize: 58, color: v > 30 ? UI.red : GOLD, transform: `scale(${popS(t, tt)})`}}>{money(v)}</div>)}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', color: '#ccd', fontSize: 30, fontFamily: FR}}>{note ?? 'HYPOTHETICAL example'}</div>
  </div>;
};

// ---------------------------------------------------------------- phantom pie: each app sees only its own slice
export const Pie: React.FC<{t: number; t0: number; t1: number; reveal?: number}> = ({t, t0, t1, reveal}) => {
  const o = outF(t, t1, 0.25); const s = sp(t, t0, {damping: 13, stiffness: 150}); const fog = reveal != null ? 1 - eout((t - reveal) / 0.8) : 1;
  const sl = [[0, 0.42], [0.42, 0.73], [0.73, 1]]; const P = (a: number, r: number) => `${300 + r * Math.cos(a * 2 * Math.PI - Math.PI / 2)},${300 + r * Math.sin(a * 2 * Math.PI - Math.PI / 2)}`;
  return <At x={1350} y={520} s={clamp(s, 0, 1.2)} o={o}>
    <svg width={600} height={600} viewBox="0 0 600 600" style={{overflow: 'visible'}}>
      {sl.map(([a, b], i) => { const sel = Math.floor(((t - t0) / 1.0)) % 3 === i && fog > 0.5; const mid = (a + b) / 2; const dx = sel ? 30 * Math.cos(mid * 2 * Math.PI - Math.PI / 2) : 0, dy = sel ? 30 * Math.sin(mid * 2 * Math.PI - Math.PI / 2) : 0;
        return <g key={i} transform={`translate(${dx},${dy})`} opacity={fog > 0.5 ? (sel ? 1 : 0.18) : 1}>
          <path d={`M300,300 L${P(a, 260)} A260,260 0 ${b - a > 0.5 ? 1 : 0} 1 ${P(b, 260)} Z`} fill={`url(#g${i})`} stroke="#000" strokeWidth={6} />
          <defs><linearGradient id={`g${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={APPS[i][0]} /><stop offset="1" stopColor={APPS[i][1]} /></linearGradient></defs>
        </g>; })}
    </svg>
    {fog > 0.05 && <div style={{position: 'absolute', left: -40, top: -40, width: 680, height: 680, borderRadius: '50%', background: `radial-gradient(circle, rgba(200,205,220,${0.0 * fog}) 0%, rgba(200,205,220,${0.35 * fog}) 70%, rgba(200,205,220,0) 100%)`}} />}
  </At>;
};

// ---------------------------------------------------------------- generic step list (Level 10)
export const Steps: React.FC<{t: number; t0: number; t1: number; items: any[]; title?: string; x?: number}> = ({t, t0, t1, items, title, x = 1000}) => {
  const o = outF(t, t1, 0.25);
  return <div style={{position: 'absolute', left: x, top: 150, width: 840, opacity: o, fontFamily: FB}}>
    {title && <div style={{fontFamily: FA, fontSize: 70, color: GOLD, marginBottom: 20}}>{title}</div>}
    {items.map(([ti, txt]: any, i: number) => { if (t < ti) return null; const s = sp(t, ti, {damping: 13, stiffness: 190}); const done = items[i + 1] && t >= items[i + 1][0];
      return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18, padding: '18px 24px', borderRadius: 24, background: done ? 'rgba(20,60,40,0.9)' : 'rgba(14,17,22,0.9)', transform: `translateX(${(1 - s) * 500}px)`, border: `3px solid ${done ? UI.green : GOLD}`}}>
        <div style={{width: 70, height: 70, borderRadius: 35, background: done ? UI.green : GOLD, color: INK, fontFamily: FA, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>{done ? '✓' : i + 1}</div>
        <div style={{color: '#fff', fontSize: 40, fontWeight: 800}}>{txt}</div>
      </div>; })}
  </div>;
};

// ---------------------------------------------------------------- three cards with a red verdict (Level 7)
export const Doors: React.FC<{t: number; t0: number; t1: number; items: any[]}> = ({t, t0, t1, items}) => {
  const o = outF(t, t1, 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', gap: 50, opacity: o, fontFamily: FB}}>
    {items.map(([ti, head, verdict, tv]: any, i: number) => { const s = popS(t, ti); const v = t >= tv ? popS(t, tv) : 0;
      return <div key={i} style={{width: 460, height: 420, borderRadius: 36, background: 'rgba(14,17,22,0.92)', border: `5px solid ${v ? RED : GOLD}`, transform: `scale(${clamp(s, 0, 1.15)})`, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: FA, fontSize: 78, color: '#fff', textAlign: 'center', lineHeight: 1}}>{head}</div>
        {v > 0 && <div style={{marginTop: 30, background: RED, color: '#fff', fontFamily: FA, fontSize: 54, padding: '6px 26px', borderRadius: 14, transform: `rotate(-8deg) scale(${lerp(2, 1, clamp(v))})`}}>{verdict}</div>}
      </div>; })}
  </div>;
};

// ---------------------------------------------------------------- avalanche vs snowball
export const AvSnow: React.FC<{t: number; t0: number; t1: number; tA: number; tB: number}> = ({t, t0, t1, tA, tB}) => {
  const o = outF(t, t1, 0.25);
  const plans = [['Sofa (interest)', 900, 3], ['TV', 480, 1], ['Late fees', 60, 2], ['Chair', 260, 0], ['Groceries', 94, 0], ['Sneakers', 30, 0]];
  const col = (title: string, order: number[], tStart: number, x: number, accent: string) => (
    <div style={{position: 'absolute', left: x, top: 140, width: 760, opacity: t >= tStart - 0.3 ? 1 : 0.25}}>
      <div style={{fontFamily: FA, fontSize: 84, color: accent, textAlign: 'center'}}>{title}</div>
      {order.map((pi, k) => { const [name, amt] = plans[pi] as any; const gone = t >= tStart + 0.6 + k * 0.55 && k < 3 ? ein((t - (tStart + 0.6 + k * 0.55)) / 0.4) : 0;
        return <div key={pi} style={{height: 80 * (1 - gone), marginTop: 12 * (1 - gone), overflow: 'hidden', borderRadius: 18, background: 'rgba(14,17,22,0.92)', border: `3px solid ${k === 0 && gone === 0 && t >= tStart ? accent : '#333'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 26px', color: '#fff', fontFamily: FB, fontWeight: 800, fontSize: 34,
          transform: `translateX(${gone * 900}px) rotate(${gone * 25}deg)`, opacity: 1 - gone}}><span>{name}</span><span style={{color: GOLD}}>{money(amt)}</span></div>; })}
    </div>
  );
  return <div style={{position: 'absolute', inset: 0, opacity: o}}>
    {col('AVALANCHE', [0, 2, 1, 3, 4, 5], tA, 140, 'rgb(120,190,255)')}
    {col('SNOWBALL', [5, 2, 4, 3, 1, 0], tB, 1020, GOLD)}
    <div style={{position: 'absolute', left: 950, top: 160, width: 4, height: 760, background: 'rgba(255,255,255,0.25)'}} />
  </div>;
};
