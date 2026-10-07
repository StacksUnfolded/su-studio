// Shared helpers for V05 (phone-first style). Generic maths/fonts come from ../lib.
import {staticFile} from 'remotion';
import LIBD from '../../../library/dims.json';
export * from '../lib';
import {rnd} from '../lib';
const LD: any = LIBD;
export const ldims = (c: string) => LD[c] || {path: 'props/' + c + '.png', ar: 1, foot: 1};
export const lsrc = (c: string) => staticFile(ldims(c).path);
// palette for the V05 phone UI
export const UI = {
  bg: '#0e1116', card: '#171b22', card2: '#1f242d', line: '#2a303a', text: '#f3f5f8', sub: '#9aa3b2',
  pay: 'linear-gradient(135deg,#7c4dff 0%,#b44dff 45%,#ff4fa3 100%)', payGlow: 'rgba(180,77,255,0.65)',
  green: '#32d074', red: '#ff4757', amber: '#ffb020', blue: '#2f8cff', gold: 'rgb(230,199,119)',
};
export const money = (v: number, cents = false) => (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString('en-US', {minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0});
/** deterministic crack lines for a lock screen; amount 0..1 */
export const cracks = (seed: number, amount: number, w: number, h: number) => {
  const R = rnd(seed); const lines: string[] = []; const n = Math.round(amount * 14);
  const cx = w * (0.62 + 0.2 * R()), cy = h * (0.18 + 0.2 * R());
  for (let i = 0; i < n; i++) {
    let x = cx, y = cy; let a = R() * Math.PI * 2; let d = `M${x.toFixed(1)},${y.toFixed(1)}`;
    const segs = 4 + Math.floor(R() * 5);
    for (let k = 0; k < segs; k++) { a += (R() - 0.5) * 0.9; const L = (30 + R() * 90) * (0.6 + amount); x += Math.cos(a) * L; y += Math.sin(a) * L; d += ` L${x.toFixed(1)},${y.toFixed(1)}`; }
    lines.push(d);
  }
  return {cx, cy, lines};
};
