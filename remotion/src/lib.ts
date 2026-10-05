import {spring, staticFile, delayRender, continueRender} from 'remotion';
import {measureText} from '@remotion/layout-utils';
import D from './data/v04hook.json';

export const FPS = 30, OW = 1920, OH = 1080;
export const GOLD = 'rgb(230,199,119)', INK = '#111315', CREAM = 'rgb(243,233,210)', RED = 'rgb(200,50,60)', GREEN = 'rgb(70,170,100)', WHITE = '#fff';
export const rgb = (c: any) => (Array.isArray(c) ? `rgb(${c[0]},${c[1]},${c[2]})` : c);
export const DATA: any = D;

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ease = (p: number) => { p = clamp(p); return p * p * (3 - 2 * p); };
export const eout = (p: number) => { p = clamp(p); return 1 - (1 - p) ** 3; };
export const ein = (p: number) => { p = clamp(p); return p * p * p; };
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** spring value for an event at t0, read at t (seconds). */
export const sp = (t: number, t0: number, cfg: any = {}) =>
  t < t0 ? 0 : spring({frame: (t - t0) * FPS, fps: FPS, config: {damping: 11, stiffness: 170, mass: 0.7, ...cfg}});
/** bouncy pop 0 -> 1 with overshoot */
export const popS = (t: number, t0: number) => sp(t, t0, {damping: 9, stiffness: 210, mass: 0.6});
/** fade-out factor near t1 */
export const outF = (t: number, t1: number, d = 0.15) => 1 - ease((t - (t1 - d)) / d);

// ---------- fonts ----------
export const FA = 'Anton', FB = 'MontserratX', FR = 'MontserratR', FD = 'DejaVuB';
const fontHandle = delayRender('fonts');
Promise.all([
  [FA, 'fonts/anton-latin-400-normal.woff', '400'],
  [FB, 'fonts/montserrat-latin-800-normal.woff', '800'],
  [FR, 'fonts/montserrat-latin-400-normal.woff', '400'],
  [FD, 'fonts/DejaVuSans-Bold.ttf', '700'],
].map(([n, f, w]) => new FontFace(n, `url(${staticFile(f)})`, {weight: w}).load().then((ff) => (document.fonts as any).add(ff))))
  .then(() => continueRender(fontHandle));

const _mt = new Map<string, number>();
export const textW = (text: string, font: string, size: number) => {
  const k = text + '|' + font + '|' + size;
  if (!_mt.has(k)) {
    let w = 0;
    try { w = measureText({text, fontFamily: font, fontSize: size, fontWeight: font === FB ? '800' : '400'}).width; } catch { w = 0; }
    if (!w) w = text.length * size * (font === FA ? 0.42 : 0.62);
    _mt.set(k, w);
  }
  return _mt.get(k)!;
};

// ---------- library ----------
export const dims = (c: string) => DATA.dims[c];
export const libSrc = (c: string) => staticFile(dims(c).path);
export const plateSrc = (n: string) => staticFile('plates/' + n + '.png');

// ---------- deterministic noise ----------
export const rnd = (seed: number) => { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

// ---------- shots ----------
export const SHOTS: any[] = DATA.shots;
export const END: number = DATA.end;
export const shotIndex = (t: number) => { let i = 0; SHOTS.forEach((s, k) => { if (s.t <= t) i = k; }); return i; };
export const shotEnd = (i: number) => (i + 1 < SHOTS.length ? SHOTS[i + 1].t : END);
export const CARDS: [number, number][] = DATA.cards;
export const inCard = (t: number) => CARDS.some(([, t0]) => t0 <= t && t < t0 + DATA.card) || (DATA.titleT <= t && t < DATA.titleT + DATA.title);
export const levelAt = (t: number) => { let lv = 0; CARDS.forEach(([l, t0]) => { if (t >= t0 + DATA.card * 0.5) lv = l; }); return lv; };

/** actor bounding boxes (unzoomed frame coords) for text dodging, like the Python engine */
export const actorBoxes = (shot: any, t: number) => {
  const out: number[][] = [];
  if (!shot || !shot.actors) return out;
  for (const a of shot.actors) {
    if ((a.t ?? -1) > t + 0.05) continue;
    if (a.exit && t > a.exit[0] + 0.3) continue;
    const w = dims(a.c).ar * a.h;
    const ft = dims(a.c).foot ?? 1; out.push([a.x - w / 2, a.y - a.h * ft, a.x + w / 2, a.y]);
  }
  return out;
};
export const freeSpans = (bx: number[][], y0: number, y1: number, margin = 30, edge = 30) => {
  const occ = bx.filter((b) => y0 < b[3] && y1 > b[1]).map((b) => [b[0] - margin, b[2] + margin]).sort((a, b) => a[0] - b[0]);
  const spans: number[][] = []; let cur = edge;
  for (const [a, b] of occ) { if (a > cur) spans.push([cur, a]); cur = Math.max(cur, b); }
  if (cur < OW - edge) spans.push([cur, OW - edge]);
  return spans;
};

/** impact shake from SFX hits */
const HITS: [string, number][] = DATA.sfx.filter(([n]: any) => ['thump', 'gavel', 'stamp', 'scratch', 'wrong'].includes(n));
export const shake = (t: number) => {
  let x = 0, y = 0, r = 0, z = 0;
  for (const [n, t0] of HITS) {
    const dt = t - t0; if (dt < 0 || dt > 0.6) continue;
    const a = (n === 'thump' || n === 'gavel' ? 1 : 0.55) * Math.exp(-dt * 9);
    x += 16 * a * Math.sin(dt * 71); y += 11 * a * Math.cos(dt * 57); r += 0.5 * a * Math.sin(dt * 43); z += 0.035 * a;
  }
  return {x, y, r, z};
};
