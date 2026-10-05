// V05 dedicated Shorts (1080x1920), phone-first style. Word cues come from shorts_words.json (forced alignment).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import SW from './shorts_words.json';
import {Actor} from './Stage';
import {Grad} from './Stage';
import {Phone} from './Phone';
import {Tracker, Combo, Sticker, Label, Stat, Source} from './Fx';
import {PropPop} from './Fx2';
import {ST, At} from '../Text';
import {FPS, GOLD, INK, WHITE, ease, eout, clamp, lerp, popS, sp, plateSrc, FA, FB, FR, UI} from './base';

const W = 1080, H = 1920;
const D: any = SW;
const norm = (t: string) => (t.replace(/-/g, ' ').replace(/…/g, ' ').toLowerCase().match(/[a-z']+/g) || []);
const mk = (id: string) => {
  const ws: [string, number, number][] = D[id].words;
  const c = (phrase: string, n = 0) => { const p = norm(phrase); let k = 0; for (let m = 0; m + p.length <= ws.length; m++) { let ok = true; for (let q = 0; q < p.length; q++) if (ws[m + q][0] !== p[q]) { ok = false; break; } if (ok) { if (k === n) return ws[m][1]; k++; } } console.warn('missing', id, phrase); return 0; };
  return c;
};

// ------------------------------------------------------------ shared pieces
const Bg: React.FC<{t: number; plate: string; fx?: number; z0?: number; night?: boolean}> = ({t, plate, fx = 0.5, z0 = 0}) => {
  if (plate.startsWith('G:')) return <div style={{position: 'absolute', left: -420, top: 0, width: 1920, height: 1920}}><Grad kind={plate.slice(2)} t={t} /></div>;
  const z = 1.05 + 0.04 * Math.sin(t * 0.25) + z0;
  return <Img src={plateSrc(plate)} style={{position: 'absolute', width: W, height: H, objectFit: 'cover', objectPosition: `${fx * 100}% 50%`, transform: `scale(${z})`}} />;
};
const Captions: React.FC<{t: number; disp: [string, number, number][]; y?: number}> = ({t, disp, y = 330}) => {
  const groups: [string, number, number][][] = []; let cur: any[] = [];
  for (const w of disp) { cur.push(w); if (cur.length >= 3 || /[.?!,…:]$/.test(w[0])) { groups.push(cur); cur = []; } }
  if (cur.length) groups.push(cur);
  const gi = groups.findIndex((g, i) => g[0][1] <= t && t < (i + 1 < groups.length ? groups[i + 1][0][1] : g[g.length - 1][2] + 0.4)); if (gi < 0) return null;
  const g = groups[gi]; const s = popS(t, g[0][1]);
  return <At x={540} y={y} s={clamp(s, 0, 1.15)}>
    <div style={{display: 'flex', gap: 22, flexWrap: 'nowrap'}}>{g.map(([w, s0, e], k) => <ST key={k} text={w.toUpperCase().replace(/"/g, '')} font={FA} size={96} color={s0 <= t && t < e + 0.08 ? GOLD : WHITE} sw={11} />)}</div>
  </At>;
};
const Title: React.FC<{t: number; t1: number; text: string; col?: string}> = ({t, t1, text, col = GOLD}) => {
  const o = 1 - ease((t - (t1 - 0.2)) / 0.2); const s = popS(t, 0.05);
  return <At x={540} y={170} s={clamp(s, 0, 1.15)} o={o}><div style={{background: 'rgba(14,17,22,0.92)', border: `5px solid ${col}`, borderRadius: 28, padding: '16px 34px'}}><ST text={text} font={FA} size={78} color={col} sw={0} shadow={0} /></div></At>;
};

type Spec = {id: string; build: (c: (p: string, n?: number) => number) => {shots: any[]; layers: any[]; trk: [number, any][]; sfx: [string, number, number?][]; title: string}};

const ShortView: React.FC<{spec: Spec}> = ({spec}) => {
  const f = useCurrentFrame(); const t = f / FPS; const c = mk(spec.id); const B = React.useMemo(() => spec.build(c), []);
  let si = 0; B.shots.forEach((s: any, k: number) => { if (s.t <= t) si = k; }); const s = B.shots[si];
  let st: any = null, tc = 0; for (const [tk, v] of B.trk) if (tk <= t) { st = v; tc = tk; }
  const flash = si > 0 && t - s.t < 0.12 ? 1 - (t - s.t) / 0.12 : 0;
  const KIND: Record<string, React.FC<any>> = {phone: ({p}) => <Phone t={t} p={p} />, combo: (l) => <Combo {...l} />, sticker: (l) => <Sticker {...l} />, label: (l) => <Label {...l} />, stat: (l) => <Stat {...l} />, source: (l) => <Source {...l} />, prop: (l) => <PropPop {...l} />};
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden', width: W, height: H}}>
      <Audio src={staticFile(`v05vo/short${spec.id}_mix.wav`)} />
      {B.sfx.map(([n, t0, v], k) => <Sequence key={k} from={Math.max(0, Math.round(t0 * FPS))} durationInFrames={75}><Audio src={staticFile(`sfx05/${n}.mp3`)} volume={v ?? 0.45} /></Sequence>)}
      <Bg t={t} plate={s.plate} fx={s.fx} />
      {s.night && <AbsoluteFill style={{background: 'rgb(60,80,150)', mixBlendMode: 'multiply', opacity: 0.5}} />}
      {B.layers.filter((l: any) => l.t0 <= t && t < l.t1 && l.under).map((l: any, k: number) => { const C = KIND[l.kind]; return <C key={'u' + k} {...l} t={t} />; })}
      {(s.actors || []).map((a: any, k: number) => <Actor key={k} a={a} t={t} ts={s.t} settle={false} />)}
      {B.layers.filter((l: any) => l.t0 <= t && t < l.t1 && !l.under).map((l: any, k: number) => { const C = KIND[l.kind]; return <C key={k} {...l} t={t} />; })}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)'}} />
      {st && <div style={{transform: 'scale(0.9)', transformOrigin: '0 0', position: 'absolute', left: 0, top: 0}}><Tracker t={t} st={st} tIn={B.trk[0][0]} tChange={tc} /></div>}
      {t < 2.6 && <Title t={t} t1={2.6} text={B.title} />}
      <Captions t={t} disp={D[spec.id].disp} y={330} />
      {flash > 0 && <AbsoluteFill style={{background: `rgba(255,255,255,${0.8 * flash})`}} />}
      <Img src={staticFile(`fx/grain${f % 8}.png`)} style={{position: 'absolute', width: W, height: H, opacity: 0.06, mixBlendMode: 'overlay', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

const A = (c: string, x: number, y: number, h: number, kw: any = {}) => ({c, x, y, h, ...kw});
const ph = (t0: number, t1: number, screens: any[], kw: any = {}) => ({kind: 'phone', t0, t1, under: true, p: {t0, t1, x: 640, y: 1040, h: 1100, rot: -3, screens, ...kw}});

// ------------------------------------------------------------ Short A: the $60 sneakers that cost $2,340
export const SpecA: Spec = {id: 'A', build: (c) => {
  const here = c("here's how"), easy = c('easy'), jacket = c('then a jacket'), sale = c('the holiday sale'), second = c('a second app'), no = c('said no'), third = c('then a third'), seven = c('seven plans');
  const week = c('then one week'), split = c('so you split'), bounce = c('then a payment bounces'), late = c('late fee'), od = c('overdraft fee'), twelve = c('twelve plans'), started = c('and it all started'), END = D.A.dur;
  const P1 = {item: 'sneakers', name: 'Sneakers', total: 60, app: 0};
  const shots = [
    {t: 0, plate: 'L02', fx: 0.35, night: true, actors: [A('P13', 250, 1880, 680)]},
    {t: jacket, plate: 'L02', fx: 0.35, night: true, actors: [A('P06', 250, 1880, 680)]},
    {t: second, plate: 'L04', fx: 0.3, actors: [A('P13', 250, 1880, 680)]},
    {t: no, plate: 'L04', fx: 0.3, actors: [A('P08', 250, 1880, 680)]},
    {t: week, plate: 'L03', fx: 0.3, actors: [A('P21', 250, 1880, 680)]},
    {t: bounce, plate: 'L04', fx: 0.3, actors: [A('P08', 250, 1880, 680)]},
    {t: twelve, plate: 'L02', fx: 0.4, night: true, actors: [A('P15', 260, 1880, 520)]},
    {t: started, plate: 'G:teal', actors: []},
  ];
  const layers: any[] = [
    {kind: 'prop', t0: 0, t1: here, c: 'sneakers', x: 600, y: 900, h: 420},
    ph(here - 0.1, started, [
      {t: 0, kind: 'checkout', item: 'sneakers', title: 'Street sneakers', price: 60, clock: '11:47', tTap: easy - 0.1, noOk: true},
      {t: jacket, kind: 'checkout', item: 'jacket', title: 'Puffer jacket', price: 120, clock: '9:13', tTap: jacket + 0.6, noOk: true},
      {t: sale, kind: 'checkout', item: 'headphones', title: 'Headphones', price: 200, clock: '1:03', tTap: sale + 0.6, noOk: true, timer: {t0: sale, secs: 7200}},
      {t: second, kind: 'home', clock: '12:41', apps: [{t: -1}, {t: second + 0.3, pulse: second + 0.3}, {t: third, pulse: third}]},
      {t: week, kind: 'bank', clock: '6:58', start: 400, hits: [[week + 0.4, -75, 'Sofa'], [week + 0.8, -120, 'TV'], [week + 1.2, -65, 'Gaming chair'], [week + 1.6, -50, 'Headphones']]},
      {t: split, kind: 'checkout', item: 'groceries', title: 'Weekly groceries', price: 94, clock: '7:02', tTap: split + 1.0, noOk: true},
      {t: bounce, kind: 'bank', clock: '6:00', start: 11, hits: [[bounce + 0.3, -45, 'Pay in 4 · Headphones'], [bounce + 0.6, -63, 'Pay in 4 · Chair'], [late + 0.1, -7, 'Late fee', 'fee'], [od + 0.1, -34, 'Overdraft fee', 'fee']]},
      {t: twelve, kind: 'lock', clock: '2:04', date: 'Tuesday', crack: 0.8, seed: 3, notes: [[twelve, 'Payment failed', 'Your payment of $45 didn’t go through', UI.red], [twelve + 0.4, 'Late fee added', 'A late fee was added to your plan', UI.amber], [twelve + 0.8, 'Past due', 'Groceries ($94) is past due', UI.red]]},
    ], {buzz: [twelve, twelve + 0.4, twelve + 0.8]}),
    {kind: 'combo', t0: easy, t1: jacket, n: 1, x: 760, y: 560}, {kind: 'combo', t0: jacket + 0.7, t1: sale, n: 2, x: 760, y: 560},
    {kind: 'combo', t0: sale + 0.7, t1: second, n: 4, x: 760, y: 560}, {kind: 'combo', t0: seven, t1: week, n: 7, x: 640, y: 560},
    {kind: 'sticker', t0: no, t1: third, text: 'NOT APPROVED', x: 640, y: 560, size: 64},
    {kind: 'combo', t0: split + 1.1, t1: bounce, n: 10, x: 640, y: 560},
    {kind: 'sticker', t0: late, t1: twelve, text: 'LATE FEE', x: 700, y: 520, size: 80}, {kind: 'sticker', t0: od, t1: twelve, text: 'OVERDRAFT FEE', x: 640, y: 680, size: 70, rot: 6},
    {kind: 'prop', t0: started, t1: END + 1, c: 'sneakers', x: 600, y: 900, h: 420},
  ];
  const st = (plans: number, owed: number, apps = 1, next?: string, amt?: number, late = false) => ({plans, owed, apps, next, nextAmt: amt, late});
  const trk: [number, any][] = [[easy, st(1, 45, 1, 'IN 2 WKS', 15)], [jacket + 0.7, st(2, 135, 1, 'FRI', 45)], [sale + 0.7, st(4, 500, 1, 'FRI', 63)], [seven, st(7, 1740, 3, 'TUE', 205)], [split + 1.1, st(10, 1830, 3, 'TUE', 251)], [bounce + 0.6, st(10, 1830, 3, 'PAST DUE', undefined, true)], [twelve, st(12, 2340, 3, 'PAST DUE', undefined, true)]];
  const sfx: [string, number, number?][] = [['thump', 0.05, 0.5], ['whoosh', here - 0.1, 0.4], ['tap', easy - 0.1, 0.7], ['register', easy, 0.35], ['tap', jacket + 0.6, 0.7], ['register', jacket + 0.7, 0.35], ['tap', sale + 0.6, 0.7], ['register', sale + 0.7, 0.35],
    ['pop', second + 0.3, 0.45], ['wrong', no, 0.35], ['pop', third, 0.45], ['register', seven, 0.4], ['coin', week + 0.4, 0.3], ['coin', week + 0.8, 0.3], ['coin', week + 1.2, 0.3], ['tap', split + 1.0, 0.6], ['thump', split + 1.05, 0.55],
    ['wrong', bounce + 0.3, 0.35], ['wrong', bounce + 0.6, 0.35], ['stamp', late, 0.4], ['stamp', od, 0.4], ['buzz', twelve, 0.6], ['buzz', twelve + 0.4, 0.6], ['buzz', twelve + 0.8, 0.6], ['riser', started - 0.4, 0.35], ['whoosh', started, 0.4]];
  return {shots, layers, trk, sfx, title: '$60 SNEAKERS = $2,340?!'};
}};

// ------------------------------------------------------------ Short B: this checkout is a trap
export const SpecB: Spec = {id: 'B', build: (c) => {
  const btn = c('the pay later button'), timer = c('countdown timer'), three = c('only three left'), big = c('and the big number'), tiny = c('tiny letters'), acc = c('none of that'), stores = c('stores pay'), more = c('buy more'), bigger = c('buy bigger');
  const works = c('and it works'), bill = c('twenty billion'), before = c('so before you tap'), full = c('could i pay'), ifnot = c('if not'), END = D.B.dur;
  const CK = {kind: 'checkout', item: 'gamingchair', title: 'Gaming chair', price: 60, clock: '1:04', timer: {t0: 0, secs: 8099}, stock: 'Only 3 left!'};
  const shots = [
    {t: 0, plate: 'G:navy', actors: [A('P23', 230, 1880, 620)]},
    {t: acc, plate: 'L08', fx: 0.5, actors: [A('P02', 250, 1880, 680)]},
    {t: works, plate: 'G:purple', actors: [A('P08', 250, 1880, 620)]},
    {t: before, plate: 'L02', fx: 0.35, night: true, actors: [A('P05', 250, 1880, 680)]},
    {t: ifnot, plate: 'G:navy', actors: [A('P23', 230, 1880, 620)]},
  ];
  const layers: any[] = [
    ph(0, acc, [{t: 0, ...CK, marks: [[btn, 'button'], [timer, 'timer'], [three, 'stock'], [big, 'small'], [tiny, 'total']]}], {t0: -1, h: 1150, x: 650, y: 1060}),
    {kind: 'sticker', t0: acc + 0.2, t1: works, text: 'NOT AN ACCIDENT', x: 620, y: 620, size: 76},
    {kind: 'sticker', t0: stores, t1: works, text: 'THE STORE PAYS A FEE', x: 620, y: 820, size: 62, col: '#7c4dff', rot: 5},
    {kind: 'prop', t0: more, t1: works, c: 'shopbag', x: 700, y: 1260, h: 220}, {kind: 'prop', t0: bigger, t1: works, c: 'shopbag', x: 880, y: 1300, h: 380},
    {kind: 'stat', t0: works + 0.3, t1: before, big: '$20 BILLION', cap: 'spent online with BNPL in the 2025 holiday season', x: 540, y: 860, w: 960, size: 150},
    {kind: 'source', t0: bill, t1: before, text: 'Adobe Digital Insights, Jan 2026'},
    {kind: 'label', t0: full, t1: ifnot, text: 'PAY IN FULL TODAY?', x: 540, y: 860, size: 120},
    ph(ifnot, END + 1, [{t: 0, ...CK}], {h: 1150, x: 650, y: 1060}),
  ];
  const sfx: [string, number, number?][] = [['thump', 0.05, 0.5], ['marker', btn, 0.5], ['marker', timer, 0.5], ['marker', three, 0.5], ['marker', big, 0.5], ['marker', tiny, 0.5], ['stamp', acc + 0.2, 0.4], ['register', stores, 0.35], ['pop', more, 0.4], ['pop', bigger, 0.45], ['thump', works + 0.3, 0.5], ['ding', full, 0.35], ['whoosh', ifnot, 0.4]];
  return {shots, layers, trk: [], sfx, title: 'THIS CHECKOUT IS A TRAP'};
}};

export const ShortA05: React.FC = () => <ShortView spec={SpecA} />;
export const ShortB05: React.FC = () => <ShortView spec={SpecB} />;
export const SDUR = (id: string) => Math.round((D[id].dur + 0.15) * FPS);
