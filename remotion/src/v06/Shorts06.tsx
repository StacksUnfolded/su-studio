// V06 dedicated Shorts (1080x1920), creator-dashboard style. Word cues come from shorts_words.json (forced alignment).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import SW from './shorts_words.json';
import {Actor} from './Stage';
import {Grad} from './Stage';
import {Phone} from './Phone';
import {Combo, Sticker, Label, Stat, Source, Hypo} from './Fx';
import {Dash, Donut, Tag} from './Fx3';
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
  let st: any = null, prev: any = null, tc = 0; for (const [tk, v] of B.trk) if (tk <= t) { prev = st; st = v; tc = tk; }
  const flash = si > 0 && t - s.t < 0.12 ? 1 - (t - s.t) / 0.12 : 0;
  const KIND: Record<string, React.FC<any>> = {phone: ({p}) => <Phone t={t} p={p} />, combo: (l) => <Combo {...l} />, sticker: (l) => <Sticker {...l} />, label: (l) => <Label {...l} />, stat: (l) => <Stat {...l} />, source: (l) => <Source {...l} />, prop: (l) => <PropPop {...l} />, tag: (l) => <Tag {...l} />, donut: (l) => <Donut {...l} />, hypo: (l) => <Hypo {...l} />};
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden', width: W, height: H}}>
      <Audio src={staticFile(`v06vo/short${spec.id}_mix.wav`)} />
      <Bg t={t} plate={s.plate} fx={s.fx} />
      {s.night && <AbsoluteFill style={{background: 'rgb(60,80,150)', mixBlendMode: 'multiply', opacity: 0.5}} />}
      {B.layers.filter((l: any) => l.t0 <= t && t < l.t1 && l.under).map((l: any, k: number) => { const C = KIND[l.kind]; return <C key={'u' + k} {...l} t={t} />; })}
      {(s.actors || []).map((a: any, k: number) => <Actor key={k} a={a} t={t} ts={s.t} settle={false} />)}
      {B.layers.filter((l: any) => l.t0 <= t && t < l.t1 && !l.under).map((l: any, k: number) => { const C = KIND[l.kind]; return <C key={k} {...l} t={t} />; })}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)'}} />
      {st && <div style={{transform: 'scale(0.9)', transformOrigin: '0 0', position: 'absolute', left: 0, top: 0}}><Dash t={t} st={st} prev={prev} tIn={B.trk[0][0]} tChange={tc} /></div>}
      {t < 2.6 && <Title t={t} t1={2.6} text={B.title} />}
      <Captions t={t} disp={D[spec.id].disp} y={330} />
      {flash > 0 && <AbsoluteFill style={{background: `rgba(255,255,255,${0.8 * flash})`}} />}
      <Img src={staticFile(`fx/grain${f % 8}.png`)} style={{position: 'absolute', width: W, height: H, opacity: 0.06, mixBlendMode: 'overlay', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

const A = (c: string, x: number, y: number, h: number, kw: any = {}) => ({c, x, y, h, ...kw});
const ph = (t0: number, t1: number, screens: any[], kw: any = {}) => ({kind: 'phone', t0, t1, under: true, p: {t0, t1, x: 640, y: 1040, h: 1100, rot: -3, screens, ...kw}});

// ------------------------------------------------------------ Short A: what 1M views actually pays
export const SpecA: Spec = {id: 'A', build: (c) => {
  const how = c('how much did you make'), yt = c('on youtube'), shorts = c('and forty five'), rest = c('the platform keeps'), so = c('so a million views'), long = c('the same views on a long'), same = c('same views a completely'), why = c("that's why creators"), smart = c('and why the smart'), next = c('so next time'), END = D.A.dur;
  const POST = (k: number) => ({t: 0, kind: 'post', handle: '@you', caption: 'how i got 1M views', pose: 'P10', thumbText: '1,000,000 VIEWS', views: [[0, 0], [0.6, 1000000]], likes: [[0, 0], [0.8, 84000]], comments: [[0, 0], [0.8, 2100]], hearts: 0.6 + k});
  const shots = [
    {t: 0, plate: 'L02', fx: 0.35, night: true, actors: [A('P10', 250, 1880, 680)]},
    {t: yt, plate: 'G:navy', actors: [A('P23', 230, 1880, 620)]},
    {t: so, plate: 'L04', fx: 0.3, actors: [A('P08', 250, 1880, 680)]},
    {t: same, plate: 'G:teal', actors: [A('P11', 260, 1880, 620)]},
    {t: why, plate: 'L03B', fx: 0.3, actors: [A('P19', 260, 1880, 680)]},
    {t: next, plate: 'L02', fx: 0.35, night: true, actors: [A('P10', 250, 1880, 680)]},
  ];
  const layers: any[] = [
    ph(0, yt, [POST(0)]),
    {kind: 'donut', t0: yt + 0.3, t1: so, keys: [[c('fifty five'), 55, 'YOU · LONG VIDEOS'], [shorts, 45, 'YOU · SHORTS']], x: 540, y: 1000, r: 260},
    {kind: 'label', t0: rest, t1: so, text: 'THE APP KEEPS THE REST', x: 540, y: 600, size: 70, col: '#fff'},
    {kind: 'source', t0: yt, t1: so, text: 'YouTube Help: partner earnings overview'},
    ph(so - 0.1, same, [{t: 0, kind: 'payout', title: 'Earnings', label: '1M views on a Short', amount: [[0, 0], [c('tens to a few'), 180]], sub: 'tens to a few hundred dollars'},
      {t: long, kind: 'payout', title: 'Earnings', label: '1M views on a long video', amount: [[0, 0], [long + 0.6, 4200]], sub: 'can be thousands', col: '#1f9d55'}]),
    {kind: 'hypo', t0: so, t1: same, x: 820, y: 560},
    {kind: 'label', t0: same, t1: why, text: 'SAME VIEWS.', x: 540, y: 820, size: 130, col: '#fff'}, {kind: 'label', t0: c('a completely different'), t1: why, text: 'DIFFERENT CHECK.', x: 540, y: 1000, size: 120},
    {kind: 'label', t0: c('often broke'), t1: smart, text: 'FAMOUS ≠ RICH', x: 640, y: 820, size: 120, col: 'rgb(255,90,140)'},
    {kind: 'prop', t0: smart, t1: next, c: 'svg:hoodie', x: 700, y: 900, h: 360}, {kind: 'label', t0: c('sell their own'), t1: next, text: 'SELL YOUR OWN STUFF', x: 600, y: 1200, size: 90, col: '#3ee089'},
    ph(next, END + 1, [POST(next)]),
  ];
  const trk: [number, any][] = [];
  const sfx: [string, number, number?][] = [['whoosh', 0.05, 0.8], ['wow', 0.7, 0.7], ['ding', how, 0.7], ['whoosh', yt, 0.8], ['pop', c('fifty five'), 0.7], ['pop', shorts, 0.7], ['whoosh', so - 0.1, 0.8], ['coin', c('tens to a few'), 0.8], ['register', long + 0.6, 0.8],
    ['thump', same, 0.9], ['stamp', c('often broke'), 0.8], ['pop', smart, 0.7], ['riser', next - 0.5, 0.6], ['whoosh', next, 0.8]];
  return {shots, layers, trk, sfx, title: '1M VIEWS = $???'};
}};

// ------------------------------------------------------------ Short B: the free hoodie trap
export const SpecB: Spec = {id: 'B', build: (c) => {
  const congrats = c('congrats'), us = c('in the u s'), post = c('and if you post'), bio = c('not in your bio'), ten = c('ten free hoodies'), paper = c('on paper'), bank = c('not one dollar'), next = c('so the next time'), END = D.B.dur;
  const shots = [
    {t: 0, plate: 'L02', fx: 0.35, night: true, actors: [A('P10', 260, 1880, 680)]},
    {t: congrats, plate: 'L02', fx: 0.35, night: true, actors: [A('P08', 260, 1880, 680)]},
    {t: us, plate: 'G:navy', actors: [A('C01', 270, 1880, 640)]},
    {t: post, plate: 'G:purple', actors: [A('P23', 230, 1880, 620)]},
    {t: ten, plate: 'L02', fx: 0.4, night: true, actors: [A('P07', 880, 1880, 680)]},
    {t: next, plate: 'L02', fx: 0.35, night: true, actors: [A('P13', 260, 1880, 680)]},
  ];
  const layers: any[] = [
    {kind: 'prop', t0: 0.1, t1: us, c: 'svg:giftbox', x: 700, y: 980, h: 360, drop: true},
    {kind: 'prop', t0: 0.6, t1: us, c: 'svg:hoodie', x: 700, y: 720, h: 300},
    {kind: 'sticker', t0: c('you might owe'), t1: us, text: 'TAXES?', x: 640, y: 1260, size: 110},
    {kind: 'tag', t0: c('cost to buy'), t1: post, text: 'VALUE: $60', x: 700, y: 900},
    {kind: 'prop', t0: us + 0.2, t1: post, c: 'svg:hoodie', x: 700, y: 1150, h: 340},
    {kind: 'source', t0: us, t1: post, text: 'IRS: income includes goods received for work · not tax advice'},
    ph(post, ten, [{t: 0, kind: 'post', handle: '@you', caption: '#ad Thanks @SnugBox for the hoodie!', pose: 'P20', thumbText: 'NEW HOODIE', views: [[0, 3400]], likes: [[0, 410]], comments: [[0, 22]]}]),
    {kind: 'label', t0: bio, t1: ten, text: 'IN THE POST. NOT YOUR BIO.', x: 540, y: 1700, size: 70, col: '#3ee089'},
    {kind: 'source', t0: c('the f t c'), t1: ten, text: 'FTC: Disclosures 101 for Social Media Influencers'},
    ...Array.from({length: 10}, (_, i) => ({kind: 'prop', t0: ten + 0.08 * i, t1: next, c: 'svg:hoodie', x: 330 + (i % 4) * 160, y: 760 + Math.floor(i / 4) * 170, h: 150})),
    {kind: 'label', t0: paper, t1: next, text: 'INCOME ON PAPER', x: 430, y: 1380, size: 76, col: '#fff'}, {kind: 'label', t0: bank, t1: next, text: '$0 IN YOUR BANK', x: 430, y: 1510, size: 84, col: 'rgb(255,90,140)'},
    {kind: 'hypo', t0: ten, t1: next, x: 820, y: 560},
    ph(next, END + 1, [{t: 0, kind: 'dm', from: 'SnugBox', col: '#ff7a59', sub: 'Brand', msgs: [[next + 0.4, 'in', 'can we send you something? 💕']]}]),
  ];
  const sfx: [string, number, number?][] = [['thump', 0.1, 0.9], ['pop', 0.6, 0.7], ['scratch', congrats - 0.1, 0.8], ['stamp', c('you might owe'), 0.8], ['whoosh', us, 0.8], ['register', c('cost to buy'), 0.7], ['whoosh', post, 0.8], ['ding', bio, 0.7],
    ['whoosh', ten, 0.8], ...Array.from({length: 10}, (_, i) => ['pop', ten + 0.08 * i, 0.5] as [string, number, number]), ['thump', bank, 0.8], ['ding', next + 0.4, 0.8]];
  return {shots, layers, trk: [], sfx, title: 'THE FREE HOODIE TRAP'};
}};

export const ShortA06: React.FC = () => <ShortView spec={SpecA} />;
export const ShortB06: React.FC = () => <ShortView spec={SpecB} />;
export const SDUR = (id: string) => Math.round((D[id].dur + 0.15) * FPS);
export const SPECS = {A: SpecA, B: SpecB};
export const shortSfx = (id: 'A' | 'B') => SPECS[id].build(mk(id)).sfx;
