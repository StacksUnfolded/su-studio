import React from 'react';
import {DATA, SHOTS, OW, GOLD, INK, RED, GREEN, shotIndex, inCard, levelAt, sp, popS, clamp, lerp, ease, textW, FA, FB, FR, CARDS} from './lib';

const AMT: Record<number, string> = {0: '$0', 1: '$0', 2: '$1', 3: '$200/MO', 4: '$400', 5: '$10K/YR', 6: '$20K', 7: '$3K/MO', 8: '$50K/YR', 9: '$100K/YR', 10: '$500K/YR', 11: '$1,000,000'};
const on = (t: number) => { const s = SHOTS[shotIndex(t)]; return !s.nohud && !inCard(t) && !['card', 'title', 'end'].includes(s.motion) && t >= DATA.rewindHud; };
/** time the HUD last appeared (for its slide-in) */
const appearedAt = (t: number) => { let k = t; while (k > 0 && on(k - 1 / 30)) k -= 1 / 30; return k; };

export const Hud: React.FC<{t: number}> = ({t}) => {
  if (!on(t)) return null;
  const s = sp(t, appearedAt(t), {damping: 14, stiffness: 160});
  const lv = levelAt(t); const amt = AMT[lv];
  const w1 = textW(`LEVEL ${lv}`, FA, 44), w2 = textW(amt, FB, 34);
  const w = Math.max(w1 + 26 + w2 + 56, 11 * 26 + 10 * 6 + 56); const bw = (w - 56 - 60) / 11;
  const lvT = (CARDS.find(([l]) => l === lv) || [0, -9])[1] + DATA.card * 0.5;
  const v = DATA.hours[0][1];
  const panel: React.CSSProperties = {position: 'absolute', top: 36 - (1 - s) * 190, height: 118, borderRadius: 22, background: 'rgba(17,19,21,0.86)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)'};
  return (
    <>
      <div style={{...panel, left: OW - 44 - w, width: w}}>
        <div style={{position: 'absolute', left: 28, top: 10, fontFamily: FA, fontSize: 44, color: GOLD, lineHeight: 1.2}}>LEVEL {lv}</div>
        <div style={{position: 'absolute', left: 28 + w1 + 26, top: 20, fontFamily: FB, fontWeight: 800, fontSize: 34, color: '#fff', lineHeight: 1.2}}>{amt}</div>
        {Array.from({length: 11}, (_, i) => {
          const lit = i < lv; const ps = i === lv - 1 ? popS(t, lvT) : 1;
          return <div key={i} style={{position: 'absolute', left: 28 + i * (bw + 6), top: 80, width: bw, height: 18, borderRadius: 5, border: `3px solid ${INK}`, boxSizing: 'border-box',
            background: lit ? GOLD : 'rgb(35,60,64)', transform: `scale(${lit ? lerp(1.8, 1, ps) : 1})`, boxShadow: lit ? '0 0 10px rgba(230,199,119,0.6)' : 'none'}} />;
        })}
      </div>
      <div style={{...panel, left: 44, width: 420}}>
        <div style={{position: 'absolute', left: 26, top: 18, fontFamily: FB, fontWeight: 800, fontSize: 26, color: 'rgb(200,210,215)'}}>FREE HOURS / WEEK</div>
        <div style={{position: 'absolute', right: 26, top: 8, fontFamily: FA, fontSize: 46, color: v < 6 ? RED : GOLD, lineHeight: 1.2}}>{Math.round(v)}</div>
        <div style={{position: 'absolute', left: 26, top: 82, width: 368, height: 20, borderRadius: 8, background: 'rgb(40,48,52)', overflow: 'hidden'}}>
          <div style={{width: 368 * clamp(v / 40) * clamp(s), height: 20, borderRadius: 8, background: v < 8 ? RED : v < 16 ? 'rgb(230,150,60)' : GREEN,
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%)'}} />
        </div>
        <div style={{position: 'absolute', left: 26, top: 126, fontFamily: FR, fontSize: 20, color: 'rgb(170,180,185)'}}>illustrative</div>
      </div>
    </>
  );
};
