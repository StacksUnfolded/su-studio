// V05 timeline helpers: word cues from the forced alignment.
import TL from './timeline.json';
export const T: any = TL;
const W: [number, string, number, number][] = T.words;
const REP: [RegExp, string][] = [[/\bCFPB\b/g, 'c f p b'], [/\bTV\b/g, 't v'], [/\bAPR\b/g, 'a p r'], [/\bBNPL\b/g, 'b n p l'], [/\b2025\b/g, 'twenty twenty five']];
export const norm = (t: string) => { for (const [a, b] of REP) t = t.replace(a, b); return (t.replace(/-/g, ' ').replace(/…/g, ' ').toLowerCase().match(/[a-z']+/g) || []); };
export const MISSING: string[] = [];
const hits = (sec: number, phrase: string): [number, number][] => {
  const p = norm(phrase); const idx = W.map((w, j) => (w[0] === sec ? j : -1)).filter((j) => j >= 0); const out: [number, number][] = [];
  for (let m = 0; m + p.length <= idx.length; m++) { let ok = true; for (let q = 0; q < p.length; q++) if (W[idx[m + q]][1] !== p[q]) { ok = false; break; } if (ok) out.push([W[idx[m]][2], W[idx[m + p.length - 1]][3]]); }
  return out;
};
/** start time of the n-th occurrence of phrase in section sec */
export const c = (sec: number, phrase: string, n = 0): number => { const h = hits(sec, phrase); if (h.length <= n) { MISSING.push(`${sec}:${phrase}#${n}`); return T.offs[sec]; } return h[n][0]; };
/** end time of phrase */
export const ce = (sec: number, phrase: string, n = 0): number => { const h = hits(sec, phrase); if (h.length <= n) { MISSING.push(`${sec}:${phrase}#${n}(end)`); return T.offs[sec] + 1; } return h[n][1]; };
export const secEnd = (sec: number) => T.offs[sec] + T.durs[sec];
export const card = (sec: number) => T.cards.find((k: any) => k.sec === sec);
