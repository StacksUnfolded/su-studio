import React from 'react';
import {Img} from 'remotion';
import {UI, sp, popS, ease, eout, ein, clamp, lerp, outF, FA, FB, FR, lsrc, ldims, money, cracks, rnd} from './base';

// Design units: the screen is 390 x 844 (phone points). The phone frame adds a 15px bezel.
export const SW = 390, SH = 844, BZ = 15;

const Status: React.FC<{time?: string; dark?: boolean}> = ({time = '11:47', dark = true}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', fontFamily: FB, fontWeight: 800, fontSize: 16, color: dark ? '#fff' : '#111'}}>
    <span>{time}</span>
    <span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
      <span style={{display: 'inline-flex', gap: 2, alignItems: 'flex-end'}}>{[6, 9, 12, 15].map((hh, i) => <span key={i} style={{width: 3, height: hh, background: dark ? '#fff' : '#111', borderRadius: 1}} />)}</span>
      <span style={{width: 26, height: 12, border: `2px solid ${dark ? '#fff' : '#111'}`, borderRadius: 4, position: 'relative'}}><span style={{position: 'absolute', left: 1, top: 1, bottom: 1, width: 14, background: dark ? '#fff' : '#111', borderRadius: 2}} /></span>
    </span>
  </div>
);

/** generic pay-later app icon: a clock cut into four slices */
export const AppIcon: React.FC<{size: number; col?: string; col2?: string}> = ({size, col = '#7c4dff', col2 = '#ff4fa3'}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: `linear-gradient(135deg, ${col}, ${col2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,0.35)'}}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 40 40">
      {[0, 1, 2, 3].map((k) => { const a0 = (k * Math.PI) / 2 - Math.PI / 2 + 0.12, a1 = a0 + Math.PI / 2 - 0.24; const p = (a: number, r: number) => `${20 + r * Math.cos(a)},${20 + r * Math.sin(a)}`;
        return <path key={k} d={`M${p(a0, 6)} L${p(a0, 18)} A18,18 0 0 1 ${p(a1, 18)} L${p(a1, 6)} A6,6 0 0 0 ${p(a0, 6)} Z`} fill="#fff" opacity={k === 0 ? 1 : 0.55} />; })}
    </svg>
  </div>
);
export const APPS = [['#7c4dff', '#ff4fa3'], ['#00b894', '#2f8cff'], ['#ff8a00', '#ff3d6e']];

// ---------------------------------------------------------------- screens
const ProductImg: React.FC<{item: string; h: number}> = ({item, h}) => {
  const d = ldims(item); const w = Math.min(300, d.ar * h); const hh = w / d.ar;
  return <Img src={lsrc(item)} style={{width: w, height: hh, objectFit: 'contain'}} />;
};

export const Checkout: React.FC<{t: number; s: any}> = ({t, s}) => {
  const n = s.n ?? 4; const each = s.price / n;
  const tap = s.tTap != null && t >= s.tTap; const tp = tap ? t - s.tTap : -1;
  const press = tp >= 0 && tp < 0.18 ? 1 - 0.06 * Math.sin((tp / 0.18) * Math.PI) : 1;
  const tOk = s.tOk ?? (s.tTap != null && !s.noOk ? s.tTap + 0.25 : null);
  const ok = tOk != null ? clamp((t - tOk) / 0.2) * (s.okHold ? 1 : 1 - clamp((t - tOk - 1.35) / 0.3)) : 0;
  const no = s.tNo != null ? clamp((t - s.tNo) / 0.2) : 0; const locked = s.tLock != null && t >= s.tLock;
  const glow = 0.6 + 0.4 * Math.sin(t * 5);
  const timer = s.timer ? (() => { const left = Math.max(0, s.timer.secs - (t - s.timer.t0)); const h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), sec = Math.floor(left % 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`; })() : null;
  const mark = (key: string) => (s.marks || []).find((m: any) => m[1] === key && t >= m[0]);
  const Circle: React.FC<{k: string; children: any; pad?: number}> = ({k, children, pad = 8}) => {
    const m = mark(k); const p = m ? eout((t - m[0]) / 0.35) : 0;
    return <div style={{position: 'relative'}}>{children}{m && (
      <svg style={{position: 'absolute', left: -pad - 6, top: -pad - 4, width: `calc(100% + ${2 * pad + 12}px)`, height: `calc(100% + ${2 * pad + 8}px)`, overflow: 'visible'}} viewBox="0 0 100 100" preserveAspectRatio="none">
        <ellipse cx="50" cy="50" rx="48" ry="46" fill="none" stroke="#ff2d2d" strokeWidth="3.2" vectorEffect="non-scaling-stroke" strokeDasharray="320" strokeDashoffset={320 * (1 - p)} pathLength={300} style={{strokeWidth: 5}} />
      </svg>)}</div>;
  };
  return (
    <div style={{position: 'absolute', inset: 0, background: '#f4f5f8', fontFamily: FB, color: '#14171c'}}>
      <Status dark={false} time={s.clock} />
      <div style={{position: 'absolute', top: 58, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{fontSize: 26, fontWeight: 800}}>‹</span><span style={{fontSize: 20, fontWeight: 800}}>Checkout</span><span style={{fontSize: 20}}>🔒</span>
      </div>
      {timer && <div style={{position: 'absolute', top: 100, left: 16, right: 16}}><Circle k="timer"><div style={{background: '#ff2d55', color: '#fff', borderRadius: 12, padding: '8px 12px', fontSize: 17, fontWeight: 800, textAlign: 'center', transform: `scale(${1 + 0.03 * Math.sin(t * 8)})`}}>SALE ENDS IN {timer}</div></Circle></div>}
      <div style={{position: 'absolute', top: timer ? 158 : 110, left: 16, right: 16, background: '#fff', borderRadius: 22, padding: 18, boxShadow: '0 6px 20px rgba(0,0,0,0.08)'}}>
        <div style={{height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef0f4', borderRadius: 16, position: 'relative'}}>
          <ProductImg item={s.item} h={180} />
          {s.stock && <div style={{position: 'absolute', top: 10, right: 10}}><Circle k="stock" pad={4}><div style={{background: '#ff9f0a', color: '#fff', borderRadius: 10, padding: '4px 10px', fontSize: 14, fontWeight: 800}}>{s.stock}</div></Circle></div>}
        </div>
        <div style={{marginTop: 14, fontSize: 21, fontWeight: 800}}>{s.title}</div>
        <div style={{marginTop: 4, fontSize: 15, color: '#6b7380', fontFamily: FR}}>Free shipping · Ships today</div>
      </div>
      <div style={{position: 'absolute', top: timer ? 500 : 452, left: 16, right: 16}}>
        <Circle k="small"><div style={{fontSize: 46, fontWeight: 800, letterSpacing: -1}}>{money(each, each % 1 !== 0)}<span style={{fontSize: 18, color: '#6b7380'}}> today</span></div></Circle>
        <Circle k="total" pad={4}><div style={{fontSize: 13, color: '#8a919c', fontFamily: FR, marginTop: 2}}>{n} payments of {money(each, each % 1 !== 0)} · total {money(s.price, s.price % 1 !== 0)}</div></Circle>
      </div>
      <div style={{position: 'absolute', top: timer ? 600 : 560, left: 16, right: 16}}>
        <Circle k="button"><div style={{height: 78, borderRadius: 22, background: locked ? '#9aa0aa' : UI.pay, filter: locked ? 'grayscale(1)' : undefined, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${press})`,
          boxShadow: `0 0 ${24 + 20 * glow}px ${UI.payGlow}, 0 8px 0 rgba(90,30,140,0.5)`}}>
          <div style={{fontSize: 26, fontWeight: 800}}>PAY IN {n} · {money(each, each % 1 !== 0)}</div>
          <div style={{fontSize: 13, fontFamily: FR, opacity: 0.9}}>{s.monthly ? `${n} monthly payments` : '0% interest · no hard credit check'}</div>
        </div></Circle>
        <div style={{marginTop: 14, height: 44, borderRadius: 14, background: '#e3e6eb', color: '#8a919c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15}}>Pay {money(s.price, s.price % 1 !== 0)} now</div>
      </div>
      {tp >= 0 && tp < 0.5 && <div style={{position: 'absolute', left: 195 - 120 * eout(tp / 0.5), top: (timer ? 639 : 599) - 120 * eout(tp / 0.5), width: 240 * eout(tp / 0.5), height: 240 * eout(tp / 0.5), borderRadius: '50%', background: 'rgba(255,255,255,0.45)', opacity: 1 - tp / 0.5}} />}
      {ok > 0 && <Approved t={t} t0={tOk} o={ok} />}
      {no > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(10,14,20,${0.55 * no})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{width: 290, padding: '28px 20px', borderRadius: 30, background: '#fff', textAlign: 'center', transform: `scale(${popS(t, s.tNo)})`}}>
        <div style={{width: 90, height: 90, margin: '0 auto', borderRadius: '50%', background: UI.red, color: '#fff', fontSize: 58, lineHeight: '90px', fontFamily: FB, fontWeight: 800}}>✕</div>
        <div style={{marginTop: 14, fontFamily: FB, fontWeight: 800, fontSize: 24, color: '#14171c'}}>Not approved this time</div>
        <div style={{marginTop: 4, fontFamily: FR, fontSize: 15, color: '#6b7380'}}>You've reached your limit</div></div></div>}
    </div>
  );
};

const Approved: React.FC<{t: number; t0: number; o: number}> = ({t, t0, o}) => {
  const s = popS(t, t0); const R = rnd(5);
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(10,14,20,${0.55 * o})`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o}}>
      {Array.from({length: 26}, (_, i) => { const a = R() * Math.PI * 2, v = 160 + R() * 220, tt = t - t0; const x = 195 + Math.cos(a) * v * eout(tt / 0.8), y = 420 + Math.sin(a) * v * eout(tt / 0.8) + 260 * tt * tt;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 10, height: 16, background: ['#7c4dff', '#ff4fa3', '#32d074', '#ffd23f'][i % 4], transform: `rotate(${tt * 600 * (i % 2 ? 1 : -1)}deg)`, borderRadius: 2}} />; })}
      <div style={{width: 280, padding: '30px 20px', borderRadius: 30, background: '#fff', textAlign: 'center', transform: `scale(${s})`, boxShadow: '0 20px 50px rgba(0,0,0,0.4)'}}>
        <div style={{width: 90, height: 90, margin: '0 auto', borderRadius: '50%', background: UI.green, color: '#fff', fontSize: 58, lineHeight: '90px', fontFamily: FD_}}>✓</div>
        <div style={{marginTop: 14, fontFamily: FB, fontWeight: 800, fontSize: 26, color: '#14171c'}}>You're approved!</div>
        <div style={{marginTop: 4, fontFamily: FR, fontSize: 15, color: '#6b7380'}}>First payment taken today</div>
      </div>
    </div>
  );
};
const FD_ = 'DejaVuB';

/** plan list: plans = [{item, name, total, paid (n of 4), due, state:'ok'|'late'|'paid', app, tAdd, tGone}] */
export const Plans: React.FC<{t: number; s: any}> = ({t, s}) => {
  const vis = s.plans.filter((p: any) => t >= (p.tAdd ?? -1) && !(p.tGone != null && t > p.tGone + 0.5));
  const owed = vis.reduce((a: number, p: any) => a + (p.total * (1 - (p.paid ?? 1) / (p.n ?? 4))), 0);
  const compact = s.plans.length > 6; const rowH = compact ? 52 : 96;
  return (
    <div style={{position: 'absolute', inset: 0, background: UI.bg, fontFamily: FB, color: UI.text}}>
      <Status time={s.clock} />
      <div style={{position: 'absolute', top: 60, left: 22, right: 22}}>
        <div style={{fontSize: 15, color: UI.sub, fontFamily: FR}}>{s.title ?? 'Your plans'}</div>
        <div style={{fontSize: 46, fontWeight: 800, letterSpacing: -1, color: s.red ? UI.red : UI.text}}>{money(s.owed ?? owed)}</div>
        <div style={{fontSize: 14, color: UI.sub, fontFamily: FR}}>{vis.length} active plan{vis.length === 1 ? '' : 's'}{s.apps ? ` · ${s.apps} apps` : ''}</div>
      </div>
      <div style={{position: 'absolute', top: 178, left: 14, right: 14}}>
        {s.plans.map((p: any, i: number) => {
          if (t < (p.tAdd ?? -1)) return null;
          const ins = sp(t, p.tAdd ?? -9, {damping: 13, stiffness: 190});
          const gone = p.tGone != null ? ein((t - p.tGone) / 0.5) : 0; if (gone >= 1) return null;
          const late = p.state === 'late' || (p.tLate != null && t >= p.tLate);
          const paid = (p.paid ?? 1) + (p.tPay != null ? (t >= p.tPay ? 1 : 0) : 0); const n = p.n ?? 4;
          const shake = late && p.tLate != null && t - p.tLate < 0.6 ? 6 * Math.sin((t - p.tLate) * 60) * (1 - (t - p.tLate) / 0.6) : 0;
          return (
            <div key={i} style={{height: rowH - 8, marginBottom: 8, borderRadius: 16, background: p.done ? '#163a26' : UI.card, border: `2px solid ${late ? UI.red : p.hl && t >= p.hl ? UI.gold : 'transparent'}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12,
              transform: `translateX(${(1 - ins) * 420 + gone * 460 + shake}px)`, opacity: 1 - gone}}>
              {!compact && <div style={{width: 58, height: 58, borderRadius: 14, background: '#262c37', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><ProductImg item={p.item} h={46} /></div>}
              {compact && p.app != null && <AppIcon size={30} col={APPS[p.app][0]} col2={APPS[p.app][1]} />}
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: compact ? 17 : 21, fontWeight: 800}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>{p.name}</span><span>{money(p.total, p.total % 1 !== 0)}</span></div>
                <div style={{height: 6, borderRadius: 3, background: '#2c3340', marginTop: compact ? 5 : 8, overflow: 'hidden'}}><div style={{width: `${(100 * paid) / n}%`, height: '100%', background: late ? UI.red : p.done ? UI.green : 'linear-gradient(90deg,#7c4dff,#ff4fa3)'}} /></div>
                {!compact && <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, color: late ? UI.red : UI.sub, fontFamily: FR, marginTop: 6}}><span>{paid} of {n} paid</span><span>{late ? 'PAST DUE' : p.due ? `Next: ${p.due}` : ''}</span></div>}
              </div>
              {compact && <div style={{fontSize: 13, color: late ? UI.red : UI.sub, fontWeight: 800, width: 66, textAlign: 'right'}}>{late ? 'PAST DUE' : p.due ?? ''}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** bank app: s = {start, hits:[[t, amount, label]], name} */
export const Bank: React.FC<{t: number; s: any}> = ({t, s}) => {
  let bal = s.start; const shown: any[] = [];
  for (const [th, amt, label, kind] of s.hits) if (t >= th) { const p = eout((t - th) / 0.35); bal += amt * (p >= 1 ? 1 : p); shown.push([th, amt, label, kind]); }
  const neg = bal < 0; const last = shown.length ? shown[shown.length - 1][0] : -9; const jolt = t - last < 0.4 ? 8 * Math.sin((t - last) * 70) * (1 - (t - last) / 0.4) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: neg ? '#2a0d12' : UI.bg, fontFamily: FB, color: UI.text}}>
      <Status time={s.clock} />
      <div style={{position: 'absolute', top: 62, left: 22, fontSize: 18, fontWeight: 800}}>{s.name ?? 'Checking ••4821'}</div>
      <div style={{position: 'absolute', top: 100, left: 22, right: 22, padding: 22, borderRadius: 24, background: neg ? 'linear-gradient(135deg,#7a0f1f,#3a0a12)' : 'linear-gradient(135deg,#1e3a5f,#142235)', transform: `translateX(${jolt}px)`}}>
        <div style={{fontSize: 14, color: '#c9d2e0', fontFamily: FR}}>Available balance</div>
        <div style={{fontSize: 54, fontWeight: 800, letterSpacing: -1.5, color: neg ? '#ff8a96' : '#fff'}}>{money(Math.round(bal * 100) / 100, true)}</div>
        {neg && <div style={{display: 'inline-block', marginTop: 6, background: UI.red, borderRadius: 8, padding: '3px 10px', fontSize: 13}}>OVERDRAWN</div>}
      </div>
      <div style={{position: 'absolute', top: neg ? 290 : 262, left: 22, fontSize: 15, color: UI.sub}}>Today</div>
      <div style={{position: 'absolute', top: neg ? 318 : 290, left: 14, right: 14}}>
        {shown.slice().reverse().map(([th, amt, label, kind]: any, i: number) => {
          const ins = sp(t, th, {damping: 14, stiffness: 200});
          return <div key={th + label} style={{height: 64, marginBottom: 8, borderRadius: 14, background: kind === 'fee' ? '#3a1218' : UI.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', transform: `translateY(${(1 - ins) * -40}px)`, opacity: clamp(ins * 2)}}>
            <div><div style={{fontSize: 16, fontWeight: 800}}>{label}</div><div style={{fontSize: 12, color: UI.sub, fontFamily: FR}}>{kind === 'fee' ? 'Fee' : 'Autopay · Pay in 4'}</div></div>
            <div style={{fontSize: 18, fontWeight: 800, color: amt < 0 ? UI.red : UI.green}}>{amt < 0 ? '−' : '+'}{money(Math.abs(amt), true).replace('$', '$')}</div>
          </div>;
        })}
      </div>
    </div>
  );
};

/** home screen with app icons. s = {apps:[{t, col}], trash?:[t...], badge?: [[t, n]]} */
export const Home: React.FC<{t: number; s: any}> = ({t, s}) => {
  const grid = ['#34c759', '#0a84ff', '#ff9f0a', '#5e5ce6', '#ff375f', '#64d2ff', '#ffd60a', '#30d158', '#bf5af2', '#ff453a', '#8e8e93', '#ac8e68'];
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1b2a4a,#3a1f4f 60%,#151a2a)', fontFamily: FB}}>
      <Status time={s.clock} />
      <div style={{position: 'absolute', top: 80, left: 26, right: 26, display: 'grid', gridTemplateColumns: 'repeat(4, 66px)', gap: '30px 22px'}}>
        {grid.map((c, i) => <div key={i} style={{width: 66, height: 66, borderRadius: 16, background: c, opacity: 0.55}} />)}
      </div>
      <div style={{position: 'absolute', top: 470, left: 26, right: 26, display: 'flex', gap: 22}}>
        {s.apps.map((a: any, i: number) => {
          if (t < a.t) return null; const p = popS(t, a.t); const tr = s.trash && s.trash[i] != null ? ein((t - s.trash[i]) / 0.45) : 0; if (tr >= 1) return null;
          const pulse = a.pulse && t >= a.pulse ? 1 + 0.08 * Math.sin((t - a.pulse) * 10) : 1;
          return <div key={i} style={{transform: `scale(${p * pulse * (1 - tr)}) translateY(${tr * 260}px) rotate(${tr * 40}deg)`, textAlign: 'center', position: 'relative'}}>
            <AppIcon size={66} col={APPS[i][0]} col2={APPS[i][1]} />
            <div style={{color: '#fff', fontSize: 12, marginTop: 6, fontFamily: FR}}>{['PayLater', 'SplitNow', 'Pay4'][i]}</div>
            {a.badge && <div style={{position: 'absolute', top: -8, right: -8, width: 26, height: 26, borderRadius: 13, background: UI.red, color: '#fff', fontSize: 14, lineHeight: '26px'}}>{a.badge}</div>}
          </div>;
        })}
      </div>
      {s.trash && <div style={{position: 'absolute', bottom: 60, left: 145, width: 100, height: 100, borderRadius: 26, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54}}>🗑</div>}
      <div style={{position: 'absolute', bottom: 20, left: 22, right: 22, height: 92, borderRadius: 30, background: 'rgba(255,255,255,0.18)'}} />
    </div>
  );
};

/** lock screen with stacking notifications. s = {clock, date, notes:[[t, title, body, col]], crack} */
export const Lock: React.FC<{t: number; s: any}> = ({t, s}) => {
  const notes = s.notes.filter((n: any) => t >= n[0]);
  const C = cracks(s.seed ?? 7, s.crack ?? 0, SW, SH);
  return (
    <div style={{position: 'absolute', inset: 0, background: s.bg ?? 'linear-gradient(170deg,#141a33,#2b1840 55%,#0b0d16)', fontFamily: FB, color: '#fff', overflow: 'hidden'}}>
      <Status time="" />
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: FR, fontSize: 18, opacity: 0.85}}>{s.date ?? 'Tuesday, March 4'}</div>
      <div style={{position: 'absolute', top: 92, width: '100%', textAlign: 'center', fontSize: 92, fontWeight: 800, letterSpacing: -3}}>{s.clock}</div>
      <div style={{position: 'absolute', top: 230, left: 12, right: 12}}>
        {notes.slice(-6).reverse().map(([tn, title, body, col]: any, i: number) => {
          const ins = sp(t, tn, {damping: 13, stiffness: 220}); const jig = t - tn < 0.35 ? 5 * Math.sin((t - tn) * 80) : 0;
          return <div key={tn + title} style={{marginBottom: 8, borderRadius: 20, background: 'rgba(245,245,250,0.82)', padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', color: '#121418',
            transform: `translateY(${(1 - ins) * -60}px) translateX(${jig}px) scale(${lerp(0.9, 1, ins) * (1 - i * 0.015)})`, opacity: clamp(ins * 2) * (1 - i * 0.08)}}>
            <div style={{width: 40, height: 40, borderRadius: 10, background: col ?? UI.red, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22}}>{col === 'app' ? '' : '!'}</div>
            <div style={{flex: 1, minWidth: 0}}><div style={{fontSize: 19, fontWeight: 800, display: 'flex', justifyContent: 'space-between'}}><span>{title}</span><span style={{fontFamily: FR, fontSize: 13, color: '#666'}}>now</span></div><div style={{fontFamily: FR, fontSize: 17, color: '#333', lineHeight: 1.2}}>{body}</div></div>
          </div>;
        })}
      </div>
      {s.crack > 0 && <svg width={SW} height={SH} style={{position: 'absolute', left: 0, top: 0}}>{C.lines.map((d, i) => <path key={i} d={d} stroke="rgba(255,255,255,0.85)" strokeWidth={1.6} fill="none" />)}{C.lines.map((d, i) => <path key={'s' + i} d={d} stroke="rgba(0,0,0,0.5)" strokeWidth={0.8} fill="none" transform="translate(1.5,1.5)" />)}</svg>}
    </div>
  );
};

/** credit report. s = {rows:[[t, label, tag, col]], score:[[t, value]], denied?} */
export const Credit: React.FC<{t: number; s: any}> = ({t, s}) => {
  let v = s.score[0][1]; for (let i = 1; i < s.score.length; i++) { const [tk, val] = s.score[i]; if (t >= tk) v = s.score[i - 1][1] + (val - s.score[i - 1][1]) * eout((t - tk) / 1); }
  const frac = (v - 300) / 550; const col = v > 700 ? UI.green : v > 620 ? UI.amber : UI.red;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#f4f5f8', fontFamily: FB, color: '#14171c'}}>
      <Status dark={false} time={s.clock} />
      <div style={{position: 'absolute', top: 62, left: 22, fontSize: 22, fontWeight: 800}}>Credit report</div>
      <svg width={300} height={170} style={{position: 'absolute', top: 104, left: 45}} viewBox="0 0 300 170">
        <path d="M30,150 A120,120 0 0 1 270,150" stroke="#e1e4ea" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M30,150 A120,120 0 0 1 270,150" stroke={col} strokeWidth={22} fill="none" strokeLinecap="round" pathLength={100} strokeDasharray={`${100 * clamp(frac)} 100`} />
        <text x="150" y="132" textAnchor="middle" fontFamily={FB} fontWeight={800} fontSize="56" fill="#14171c">{Math.round(v)}</text>
        <text x="150" y="160" textAnchor="middle" fontFamily={FR} fontSize="14" fill="#6b7380">score (illustrative)</text>
      </svg>
      <div style={{position: 'absolute', top: 300, left: 16, right: 16}}>
        {s.rows.filter((r: any) => t >= r[0]).map(([tr, label, tag, c]: any, i: number) => {
          const ins = sp(t, tr, {damping: 14, stiffness: 200});
          return <div key={i} style={{height: 62, marginBottom: 8, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', boxShadow: '0 3px 10px rgba(0,0,0,0.06)', transform: `translateX(${(1 - ins) * 300}px)`}}>
            <span style={{fontSize: 18, fontWeight: 800}}>{label}</span><span style={{fontSize: 13, fontWeight: 800, color: '#fff', background: c ?? '#5e5ce6', borderRadius: 8, padding: '4px 8px'}}>{tag}</span>
          </div>;
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the phone itself
const SCREENS: Record<string, React.FC<{t: number; s: any}>> = {checkout: Checkout, plans: Plans, bank: Bank, home: Home, lock: Lock, credit: Credit};

/** Phone layer. p = {x, y, h, t0, t1, rot, screens:[{t, kind, ...spec}], swipe} */
const kfAt = (p: any, t: number) => {
  let x = p.x, y = p.y, h = p.h ?? 900, r = p.rot ?? -4;
  for (const [tk, X, Y, H, Rr] of (p.kf || [])) { if (t < tk) break; const q = eout((t - tk) / 0.5); x = lerp(x, X, q); y = lerp(y, Y, q); h = lerp(h, H, q); if (Rr != null) r = lerp(r, Rr, q); }
  return {x, y, h, r};
};
export const Phone: React.FC<{t: number; p: any}> = ({t, p: p0}) => {
  const K = kfAt(p0, t); const p = {...p0, x: K.x, y: K.y, h: K.h, rot: K.r};
  const h = p.h; const k = h / (SH + 2 * BZ);
  const ins = sp(t, p.t0, {damping: 14, stiffness: 120, mass: 0.9}); const out = p.t1 != null ? ein((t - (p.t1 - 0.3)) / 0.3) : 0;
  const float = 6 * Math.sin(t * 1.6 + (p.x ?? 0) * 0.01);
  const rot = (p.rot ?? -4) + (1 - ins) * 18 + 1.2 * Math.sin(t * 1.1);
  const buzz = (p.buzz || []).some((b: number) => t >= b && t < b + 0.35) ? 5 * Math.sin(t * 140) : 0;
  // which screen: last with t <= now; slide transition 0.3s
  const scr = p.screens; let i = 0; scr.forEach((s: any, j: number) => { if (s.t <= t) i = j; });
  const cur = scr[i]; const prev = scr[i - 1]; const st = t - cur.t; const tr = i > 0 && st < 0.3 ? eout(st / 0.3) : 1;
  const render = (s: any) => { const C = SCREENS[s.kind]; return C ? <C t={t} s={s} /> : null; };
  return (
    <div style={{position: 'absolute', left: p.x - (SW + 2 * BZ) / 2, top: p.y - (SH + 2 * BZ) / 2, width: SW + 2 * BZ, height: SH + 2 * BZ,
      transform: `translate(${buzz}px, ${(1 - ins) * 900 + out * 1000 + float}px) scale(${k}) rotate(${rot}deg)`, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 64, background: 'linear-gradient(145deg,#3a3f48,#121418 40%,#0b0c0e)', boxShadow: '0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 3px #50555e'}} />
      <div style={{position: 'absolute', left: BZ, top: BZ, width: SW, height: SH, borderRadius: 50, overflow: 'hidden', background: '#000'}}>
        {prev && tr < 1 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${-tr * 40}%)`, opacity: 1 - tr}}>{render(prev)}</div>}
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - tr) * 100}%)`}}>{render(cur)}</div>
        <div style={{position: 'absolute', left: SW / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: '#000'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)', pointerEvents: 'none'}} />
      </div>
    </div>
  );
};
