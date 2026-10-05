import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Grad} from './Scene';
import {ST, At} from './Text';
import {DATA, GOLD, INK, WHITE, CREAM, sp, popS, ease, ein, eout, clamp, lerp, FA, FB, libSrc, dims, rnd, textW} from './lib';

const CARDAMT: Record<number, string> = {1: '$0', 2: '$1', 3: '$200 A MONTH', 4: '$400', 5: '$10,000 A YEAR', 6: '$20,000', 7: '$3,000 A MONTH', 8: '$50,000 A YEAR', 9: '$100,000 A YEAR', 10: '$500,000 A YEAR', 11: '$1,000,000'};

/** letters slam in one by one; optional moving shine clipped to the letters */
const Slam: React.FC<{text: string; t: number; t0: number; size: number; color: string; sw: number; step?: number; font?: string; shine?: number}> = ({text, t, t0, size, color, sw, step = 0.035, font = FA, shine}) => {
  let acc = 0; const total = text.split('').reduce((a, ch) => a + textW(ch === ' ' ? '\u00a0' : ch, font, size), 0);
  return (
    <div style={{display: 'flex'}}>
      {text.split('').map((ch, k) => {
        const c = ch === ' ' ? '\u00a0' : ch; const off = acc; acc += textW(c, font, size);
        const s = popS(t, t0 + k * step);
        return <div key={k} style={{position: 'relative', transform: `translateY(${(1 - s) * -70}px) scale(${lerp(1.35, 1, s)})`, opacity: clamp(s * 4), transformOrigin: '50% 80%'}}>
          <ST text={c} font={font} size={size} color={color} sw={sw} />
          {shine != null && shine > 0 && shine < 1 && (
            <div style={{position: 'absolute', left: 0, top: 0, fontFamily: font, fontSize: size, lineHeight: 1, whiteSpace: 'pre', color: 'transparent',
              backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${shine * 160 - 40}%, rgba(255,255,255,0.85) ${shine * 160 - 25}%, rgba(255,255,255,0) ${shine * 160 - 10}%)`,
              backgroundSize: `${total}px 100%`, backgroundPosition: `${-off}px 0`, backgroundRepeat: 'no-repeat', WebkitBackgroundClip: 'text', backgroundClip: 'text'}}>{c}</div>
          )}
        </div>;
      })}
    </div>
  );
};

export const Title: React.FC<{tt: number}> = ({tt}) => {
  const T = DATA.title; const endP = ease((tt - (T - 0.25)) / 0.25);
  const R = rnd(91);
  const hb = 480, wb = dims('P10').ar * hb;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.3 * endP})`}}>
        <Grad kind="gold" t={tt * 3} />
        {Array.from({length: 14}, (_, i) => {
          const x = R() * 1920, sp0 = 0.3 + R() * 0.6, rot = R() * 360, vy = 260 + R() * 260, hh = 70 + R() * 60, code = i % 2 ? 'cash' : 'coins';
          const y = -150 + (tt - sp0 * 0.5) * vy * 1.6; if (tt < sp0 * 0.5) return null;
          return <Img key={i} src={libSrc(code)} style={{position: 'absolute', left: x, top: y, height: hh, transform: `rotate(${rot + tt * 120 * (i % 2 ? 1 : -1)}deg) rotateY(${tt * 400}deg)`, opacity: 0.55, filter: 'blur(1.5px)'}} />;
        })}
        <At x={960} y={230}><Slam text="YOUR LIFE AT" t={tt} t0={0.05} size={120} color={WHITE} sw={10} step={0.025} /></At>
        <At x={960} y={420} s={1 + 0.02 * Math.sin(tt * 6)}>
          <Slam text="EVERY LEVEL" t={tt} t0={0.2} size={230} color={GOLD} sw={16} step={0.04} shine={(tt - 0.95) / 0.6} />
        </At>
        <At x={960} y={610}><Slam text="OF SIDE HUSTLE" t={tt} t0={0.45} size={150} color={WHITE} sw={12} step={0.025} /></At>
        <At x={960} y={780} s={popS(tt, 0.75)} r={(1 - clamp(popS(tt, 0.75))) * -8}>
          <div style={{background: INK, borderRadius: 24, padding: '10px 36px', boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
            <ST text="$0 TO $1,000,000" font={FB} size={80} weight={800} color="rgb(255,244,210)" sw={0} shadow={0} />
          </div>
        </At>
        <Img src={libSrc('P10')} style={{position: 'absolute', left: 1650 - wb / 2, top: 800 - hb / 2, height: hb, transformOrigin: '50% 100%',
          transform: `translateY(${(1 - popS(tt, 0.85)) * 500}px) scaleY(${lerp(1.3, 1, clamp(popS(tt, 0.85)))}) rotate(${3 * Math.sin(tt * 7)}deg)`}} />
        <Img src={libSrc('cash')} style={{position: 'absolute', left: 300 - 110, top: 880 - 75, height: 150, transform: `scale(${popS(tt, 0.95)}) rotate(${12 + 6 * Math.sin(tt * 5)}deg)`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(255,255,255,${0.85 * endP})`}} />
    </AbsoluteFill>
  );
};

export const LevelCard: React.FC<{lv: number; tt: number; sub: string}> = ({lv, tt, sub}) => {
  const C = DATA.card; const n = 11, sw = 112, spc = 14, x0 = (1920 - (n * sw + (n - 1) * spc)) / 2;
  const litT = 0.45; const punch = ein((tt - (C - 0.18)) / 0.18);
  const flash = tt >= litT && tt < litT + 0.5 ? 1 - (tt - litT) / 0.5 : 0;
  const shk = tt > 0.32 && tt < 0.8 ? 10 * Math.exp(-(tt - 0.32) * 9) * Math.sin((tt - 0.32) * 70) : 0;
  const amt = CARDAMT[lv];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.35 * punch}) translate(${shk}px, ${shk * 0.6}px)`, filter: punch > 0 ? `blur(${punch * 6}px)` : undefined}}>
        <Grad kind="teal" t={tt * 4} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse 620px 380px at 50% 35%, rgba(255,240,200,${0.45 * flash}), rgba(255,240,200,0) 70%)`}} />
        <At x={960} y={380}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 50}}>
            <Slam text="LEVEL" t={tt} t0={0.02} size={250} color={GOLD} sw={14} step={0.03} />
            <div style={{transform: `scale(${lerp(3, 1, popS(tt, 0.3))}) rotate(${(1 - clamp(popS(tt, 0.3))) * 20}deg)`, opacity: clamp(popS(tt, 0.3) * 4)}}>
              <ST text={String(lv)} font={FA} size={250} color={WHITE} sw={14} />
            </div>
          </div>
        </At>
        <At x={960} y={620} s={popS(tt, 0.2)}><ST text={amt} font={FB} weight={800} size={amt.length < 10 ? 110 : 92} color={WHITE} sw={10} /></At>
        {Array.from({length: n}, (_, i) => {
          const pin = popS(tt, 0.05 + i * 0.025); const lit = i < (tt >= litT ? lv : lv - 1); const isNew = i === lv - 1 && tt >= litT;
          return <div key={i} style={{position: 'absolute', left: x0 + i * (sw + spc), top: 780, width: sw, height: 34, borderRadius: 10, border: `5px solid ${INK}`, boxSizing: 'border-box',
            background: lit ? (isNew ? `rgb(${230 + 25 * flash},${199 + 56 * flash},${119 + 136 * flash})` : GOLD) : 'rgb(35,60,64)',
            transform: `scale(${pin * (isNew ? lerp(1.7, 1, popS(tt, litT)) : 1)})`, boxShadow: lit ? `0 0 ${20 + 40 * flash}px rgba(230,199,119,0.8)` : 'none'}} />;
        })}
        <At x={960} y={880} o={ease((tt - 0.6) / 0.3)} s={lerp(0.9, 1, eout((tt - 0.6) / 0.3))}>
          <div style={{fontFamily: FB, fontWeight: 800, fontSize: 46, color: 'rgb(200,215,215)', letterSpacing: lerp(14, 4, eout((tt - 0.6) / 0.5))}}>{sub}</div>
        </At>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
