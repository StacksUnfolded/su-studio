// V06 edit as code: shots, layers, SFX, dashboard states, freeze frames. All times come from word cues.
// SFX volumes are relative to the loudness-matched set in public/sfx06 (1.0 ≈ 10 dB under the voice).
import {T, c, ce, secEnd, card} from './tl';
const UI = {red: '#ff4757', amber: '#ffb020', green: '#32d074', gold: 'rgb(230,199,119)', pink: 'rgb(255,90,140)'};

export const S: any[] = []; export const L: any[] = []; export const SFX: [string, number, number?][] = []; export const TRK: [number, any][] = []; export const FREEZE: [number, number][] = [];
const R2 = (x: number) => Math.round(x * 100) / 100;
export const A = (c: string, x: number, y = 1010, h = 760, kw: any = {}) => ({c, x, y, h, ...kw});
export const shot = (t: number, plate: string, actors: any[] = [], kw: any = {}) => { const d = {t: R2(t), plate, actors, props: [], motion: 'in', focus: [0.5, 0.5], tr: 'cut', ...kw}; S.push(d); if (kw.sfx) SFX.push([kw.sfx, t - 0.05, 0.8]); return d; };
export const lay = (kind: string, t0: number, t1: number, kw: any = {}) => { const d = {kind, t0: R2(t0), t1: R2(t1), ...kw}; L.push(d); return d; };
const sfx = (n: string, t: number, v = 1) => { if (n === 'wrong') throw new Error('the wrong buzzer is banned'); SFX.push([n, t, v]); };
const dash = (t: number, f: number, e: number, k: number) => TRK.push([t, {f, e, k}]);
const phone = (t0: number, t1: number, screens: any[], kw: any = {}) => lay('phone', t0, t1, {p: {t0, t1, x: 1400, y: 560, h: 900, screens, ...kw}});
const label = (t0: number, t1: number, text: string, kw: any = {}) => lay('label', t0, t1, {text, ...kw});
const sticker = (t0: number, t1: number, text: string, x: number, y: number, kw: any = {}) => { lay('sticker', t0, t1, {text, x, y, ...kw}); sfx('stamp', t0, 0.8); };
const stat = (t0: number, t1: number, big: string, cap: string, kw: any = {}) => { lay('stat', t0, t1, {big, cap, ...kw}); sfx('thump', t0, 0.9); };
const source = (t0: number, t1: number, text: string) => lay('source', t0, t1, {text});
const hypo = (t0: number, t1: number, kw: any = {}) => lay('hypo', t0, t1, kw);
const pop = (t0: number, t1: number, cc: string, x: number, y: number, h: number, kw: any = {}) => { lay('prop', t0, t1, {c: cc, x, y, h, ...kw}); sfx(kw.drop ? 'thump' : 'pop', t0, kw.drop ? 0.8 : 0.7); };
const tag = (t0: number, t1: number, text: string, x: number, y: number, kw: any = {}) => { lay('tag', t0, t1, {text, x, y, ...kw}); sfx('register', t0, 0.6); };
const chat = (t0: number, t1: number, msgs: any[], kw: any = {}) => { lay('chat', t0, t1, {msgs, ...kw}); msgs.forEach((m) => sfx('tap', m[0], 0.6)); };
const receipt = (t0: number, t1: number, lines: any[], kw: any = {}) => { lay('receipt', t0, t1, {lines, ...kw}); sfx('print', t0, 0.8); };
const freeze = (t0: number, t1: number, text: string, kw: any = {}) => { FREEZE.push([t0 - 0.05, t1]); sfx('scratch', t0 - 0.12, 0.9); label(t0, t1, text, {live: true, y: 880, ...kw}); };
const LADDER = ['0', '1K', '10K', 'PAID', '50K', '100K', 'TEAM', '1M', 'OWN IT', '10M'];

// =====================================================================================================
// 0  COLD OPEN: famous and broke
{
  const s = 0; const bank = c(s, 'and your bank account'), glitch = c(s, "that's not a glitch"), today = c(s, 'so today'), every = c(s, 'at every level'), some = c(s, 'and somewhere'), notf = c(s, "it's not the follower"), find = c(s, "let's find it");
  shot(0, 'L02', [A('P13', 560, 1000, 740)], {fx: 'night', focus: [0.4, 0.5], za: 0.09});
  phone(0.2, bank + 0.1, [{t: 0, kind: 'post', handle: '@you', caption: 'this is why i never… 😭', pose: 'P08', thumbText: 'I TRIED IT FOR 30 DAYS', views: [[0, 0], [0.4, 2100000]], likes: [[0, 0], [c(s, 'a hundred and forty'), 140000]], comments: [[0, 0], [c(s, 'strangers know'), 9800]], hearts: c(s, 'a hundred and forty')}]);
  sfx('whoosh', 0.2, 0.7); sfx('ding', c(s, 'two million'), 0.8); sfx('wow', c(s, 'a hundred and forty'), 0.6);
  shot(c(s, 'strangers know'), 'L02', [A('P06', 900, 1000, 740)], {fx: 'night', motion: 'punch', focus: [0.3, 0.45]});
  lay('chat', c(s, 'brands are in'), bank, {msgs: [[c(s, 'brands are in'), 'jay', 'GlowSip wants a collab??'], [c(s, 'every single day'), 'jay', 'bro ur famous 😭']], x: 120, y: 230});
  shot(bank, 'L02', [A('P21', 560, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  phone(bank, glitch, [{t: 0, kind: 'bank', clock: '2:11', start: 212.4, hits: []}], {x: 1380});
  hypo(bank + 0.3, glitch);
  freeze(c(s, 'two hundred and twelve') + 0.9, glitch - 0.05, 'FAMOUS. BROKE.', {col: UI.pink});
  dash(glitch, 248000, 31200, 212);
  shot(glitch, 'G:purple', [A('P07', 1500, 1050, 640)], {tr: 'zoom', hud: true});
  label(glitch + 0.2, today, 'THE MOST COMMON WAY', {x: 760, y: 420, size: 120, col: '#fff'}); label(c(s, 'the most common way') + 0.3, today, 'TO BE AN INFLUENCER', {x: 760, y: 580, size: 110});
  // rewind to zero
  shot(today, 'G:navy', [], {tr: 'flash', hud: true});
  dash(today + 0.1, 0, 0, 0); sfx('riser', today, 0.7);
  lay('ladder', today + 0.3, some, {items: LADDER, tStep: 0.12, marks: [[c(s, 'zero followers'), 0, 'glow'], [c(s, 'ten million'), 9, 'gold']]});
  label(every, some, 'WHERE THE MONEY COMES FROM', {y: 880, size: 92, col: '#fff'});
  sfx('ding', c(s, 'zero followers'), 0.7); sfx('register', c(s, 'ten million'), 0.7);
  shot(some, 'G:navy', [], {tr: 'cut', hud: true});
  lay('ladder', some, find + 0.3, {items: ['?', '?', '?', '?', '?', '?', '?', '?', '?', '?'], tStep: 0.05, marks: [[c(s, 'making a living'), 5, 'glow', 'HERE?'], [notf, 7, 'glow', 'OR HERE?']]});
  sfx('pop', c(s, 'making a living'), 0.7); sfx('pop', notf, 0.7);
  label(find, find + 0.9, "LET'S FIND IT", {y: 880, size: 120});
}

S.push({t: T.titleT, kind: 'title', nohud: true}); SFX.push(['riser', T.titleT - 0.8, 0.7], ['thump', T.titleT + 0.3, 1], ['register', T.titleT + 0.9, 0.7], ['ding', T.titleT + 1.5, 0.8], ['whoosh', T.titleT + T.title - 0.25, 0.8]);
for (const k of T.cards) { S.push({t: k.t, kind: 'card', c: k, nohud: true}); SFX.push(['ding', k.t + 0.22, 0.9], ['pop', k.t + 0.25, 0.6], ['thump', k.t + 0.58, 0.9], ['whoosh', k.t + k.dur - 0.25, 0.8]); }
const after = (sec: number) => { const k = card(sec); return k.t + k.dur; };

// =====================================================================================================
// 1  LEVEL 0: zero followers
{
  const s = 1; const k = after(s); const spent = c(s, 'and before'), post = c(s, 'you post every'), mom = c(s, 'most of them are'), here = c(s, "here's the first"), alone = c(s, "and you're not alone"), quit = c(s, 'most of them quit'), dont = c(s, "but you don't quit"), four = c(s, 'four hundred and eighty');
  dash(k, 0, 0, 0);
  shot(k, 'L02', [A('P09', 560, 1000, 740)], {focus: [0.4, 0.5]});
  phone(k, spent, [{t: 0, kind: 'grid', handle: '@you', posts: 0, followers: 0, counts: [], t0: k}], {x: 1400});
  shot(spent, 'G:teal', [A('P12', 1560, 1050, 600)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(spent + 0.1, c(s, 'ring light'), 'BEFORE YOUR FIRST CENT…', {x: 760, y: 470, size: 110, col: '#fff'});
  pop(c(s, 'ring light'), post, 'svg:ringlight', 420, 560, 420); tag(c(s, 'ring light') + 0.2, post, '$40', 520, 330);
  pop(c(s, 'a tripod'), post, 'svg:tripod', 780, 600, 330); tag(c(s, 'a tripod') + 0.2, post, '$25', 860, 400);
  pop(c(s, 'tiny microphone'), post, 'svg:mic', 1100, 640, 220); tag(c(s, 'tiny microphone') + 0.2, post, '$30', 1160, 500);
  dash(c(s, 'ninety five dollars'), 0, 0, -95); hypo(c(s, 'ninety five dollars'), post); sfx('register', c(s, 'ninety five dollars'), 0.6);
  shot(post, 'L02', [A('P13', 900, 1000, 740)], {tr: 'whip', sfx: 'whoosh'});
  const counts = [41, 12, 88, 9, 230, 17, 33, 6, 54, 21, 14, 72, 8, 29, 11, 44, 19, 5, 61, 27, 13, 38, 7, 22, 16, 49, 10, 31, 24, 15];
  phone(post, here, [{t: 0, kind: 'grid', handle: '@you', posts: 30, followers: 47, counts, t0: post + 0.2, best: 4, tBest: c(s, 'two hundred and thirty')}], {x: 1400, h: 960});
  dash(post + 1, 47, 0, -95); sfx('ding', c(s, 'two hundred and thirty'), 0.7);
  chat(mom - 0.1, here, [[mom, 'jay', 'bro who is this for 💀']], {x: 120, y: 240});
  shot(here, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(here + 0.1, c(s, 'the platform is making'), 'NOBODY TELLS YOU THIS', {x: 1150, y: 470, size: 110, col: '#fff'});
  lay('chain', c(s, 'the platform is making'), alone, {y: 420, nodes: [[c(s, 'the platform is making'), 'YOU', 'P13', '#5aa9ff'], [c(s, 'keeps people scrolling'), 'THE APP', 'phone', UI.pink], [c(s, 'an ad they can sell'), 'ADVERTISERS', 'briefcase', UI.gold]],
    links: [[c(s, 'every video you post'), 'free videos', '#5aa9ff'], [c(s, 'an ad they can sell') + 0.3, 'sells ads', UI.gold]], back: [c(s, "you're working for free") - 0.3, 'YOU GET: $0']});
  label(c(s, "you're working for free") + 0.6, alone, "YOU'RE WORKING FOR FREE", {y: 150, size: 90, col: UI.pink});
  shot(alone, 'L02', [A('P09', 1400, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  phone(alone, quit, [{t: 0, kind: 'grid', handle: '@everyone', posts: 999, followers: 0, counts: Array.from({length: 24}, (_, i) => (i * 37) % 90 + 3), t0: alone}], {x: 520, rot: 4});
  shot(quit, 'L02', [A('P15', 960, 1010, 600)], {fx: 'night', motion: 'punch', focus: [0.5, 0.6]});
  label(c(s, 'shouting into a pillow'), dont, '40 HOURS → 200 VIEWS', {y: 260, size: 100, col: '#fff'});
  shot(dont, 'L02', [A('P13', 560, 1000, 740)], {fx: 'night', tr: 'cut'});
  phone(dont, secEnd(s) + 0.5, [{t: 0, kind: 'post', handle: '@you', caption: 'day 33. still here.', pose: 'P20', thumbText: 'DAY 33', views: [[0, 230], [c(s, 'one video hits'), 4000], [four - 0.4, 61000], [four, 480000]], likes: [[0, 9], [four, 52000]], comments: [[0, 2], [four, 3100]], hearts: four}]);
  sfx('riser', c(s, 'one video hits') - 0.3, 0.7); [four - 0.4, four].forEach((x) => sfx('whoosh', x, 0.7)); sfx('wow', four + 0.2, 0.7);
  shot(c(s, 'overnight'), 'L02', [A('P08', 560, 1000, 740)], {fx: 'night', motion: 'punch', focus: [0.3, 0.45]});
  dash(c(s, 'your follower count'), 47, 0, -95); dash(c(s, 'a thousand and twelve'), 1012, 0, -95); sfx('register', c(s, 'a thousand and twelve'), 0.8);
  hypo(four, secEnd(s));
}

// =====================================================================================================
// 2  LEVEL 1: paid in hoodies
{
  const s = 2; const k = after(s); const dm = c(s, 'we love your vibe'), free = c(s, 'free stuff'), exc = c(s, 'except that hoodie'), one = c(s, 'string one'), two = c(s, 'string two'), sneak = c(s, "and there's a sneakier"), so = c(s, 'so a company gets'), at = c(s, 'at level one');
  dash(k, 1000, 0, -95);
  shot(k, 'L02', [A('P13', 560, 1000, 740)], {focus: [0.4, 0.5]});
  phone(k, free, [{t: 0, kind: 'dm', from: 'SnugBox', col: '#ff7a59', sub: 'Brand · 4,210 followers', msgs: [[dm - 0.2, 'in', 'hiii we LOVE your vibe 💕'], [c(s, 'can we send'), 'in', 'can we send you a hoodie?? just tag us!']], typing: [k + 0.3, dm - 0.2]}]);
  sfx('ding', dm - 0.2, 0.8); sfx('ding', c(s, 'can we send'), 0.8);
  shot(free, 'L02', [A('P10', 760, 1010, 760)], {tr: 'whip', sfx: 'whoosh'});
  pop(free + 0.1, exc, 'parcel', 1350, 760, 300, {drop: true}); label(free + 0.3, exc, 'FREE!', {x: 1350, y: 380, size: 160});
  freeze(exc, one - 0.05, 'TWO STRINGS ATTACHED', {col: UI.pink});
  sticker(exc + 0.4, one, 'MUST DISCLOSE', 1350, 300, {col: UI.red, size: 60}); sticker(exc + 0.9, one, 'MAYBE TAXABLE', 1350, 480, {col: '#7c4dff', size: 60, rot: 6});
  shot(one, 'G:navy', [A('P23', 360, 1050, 600)], {tr: 'whip', sfx: 'whoosh', hud: true});
  phone(one, two, [{t: 0, kind: 'post', handle: '@you', caption: '#ad  Thanks @SnugBox for the hoodie!', pose: 'P20', thumbText: 'NEW HOODIE', views: [[0, 3400]], likes: [[0, 410]], comments: [[0, 22]]}], {x: 1250, h: 860});
  label(c(s, 'not hidden in your bio'), two, 'NOT IN YOUR BIO', {x: 560, y: 340, size: 90, col: '#fff'}); label(c(s, 'right there in the post'), two, 'IN THE POST', {x: 560, y: 500, size: 110, col: UI.green});
  source(c(s, 'federal trade commission'), two, 'FTC, "Disclosures 101 for Social Media Influencers"');
  shot(two, 'G:purple', [A('P09', 1600, 1050, 600)], {tr: 'whip', sfx: 'whoosh', hud: true});
  pop(two + 0.2, sneak, 'svg:hoodie', 700, 520, 360); tag(c(s, 'what it would cost'), sneak, 'VALUE: $60', 700, 260);
  label(c(s, 'show up on your tax bill'), sneak, 'TAX BILL?', {x: 700, y: 860, size: 110, col: UI.pink});
  source(c(s, 'in the u s'), sneak, 'IRS: income includes goods and services received for work · not tax advice');
  shot(sneak, 'L02', [A('P13', 560, 1000, 740)], {tr: 'whip', sfx: 'whoosh'});
  phone(sneak, so + 0.2, [{t: 0, kind: 'dm', from: 'SnugBox', col: '#ff7a59', sub: 'Brand', msgs: [[-1, 'in', 'can we send you a hoodie?? just tag us!'], [c(s, 'read the small print') , 'in', '1 video + tag us + rights to repost & run it as an ad 🙏']], mark: [c(s, 'use your video in their own'), 1]}]);
  sfx('marker', c(s, 'use your video in their own'), 0.8);
  shot(so, 'G:red', [A('P11', 1580, 1050, 600)], {tr: 'zoom', hud: true});
  label(so + 0.2, at, 'YOUR FACE = THEIR AD', {x: 760, y: 420, size: 130});
  label(c(s, 'content usage rights'), at, 'USAGE RIGHTS', {x: 760, y: 620, size: 100, col: '#fff'}); sfx('ding', c(s, 'content usage rights'), 0.7);
  shot(at, 'L02', [A('P07', 960, 1010, 760)], {tr: 'whip', sfx: 'whoosh'});
  pop(at + 0.3, secEnd(s) + 0.3, 'svg:hoodie', 420, 520, 260); pop(at + 0.5, secEnd(s) + 0.3, 'svg:hoodie', 1500, 500, 240, {rot: 8});
  label(c(s, "you can't pay rent"), secEnd(s) + 0.4, "CAN'T PAY RENT IN HOODIES", {y: 900, size: 100}); sfx('trombone', c(s, 'in hoodies', 1), 0.7);
}

// =====================================================================================================
// 3  LEVEL 2: the first real check
{
  const s = 3; const k = after(s); const brands = c(s, 'brands call this'), charge = c(s, 'you charge'), lesson = c(s, "and that's your first"), next = c(s, 'next time'), oh = c(s, 'oh and watch'), still = c(s, 'still the glowsip'), aff = c(s, 'then you discover'), some = c(s, 'somebody buys'), real = c(s, 'affiliate money is real'), so = c(s, 'so you go after');
  dash(k, 10000, 0, -95);
  shot(k, 'L04', [A('P14', 600, 1010, 700)], {focus: [0.4, 0.5]});
  phone(k, brands, [{t: 0, kind: 'dm', from: 'GlowSip', col: '#ff4f8b', verified: true, sub: 'Brand · verified', msgs: [[k + 0.4, 'in', 'Hi! Rate for 1 video? 💸']], typing: [k + 1.2, 99]}]);
  sfx('ding', k + 0.4, 0.8);
  shot(brands, 'G:navy', [A('P23', 1620, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  stat(c(s, 'nano'), charge, '$100–$500', 'per post · nano (1K–10K followers)', {x: 760, y: 360, w: 1000, size: 150});
  lay('stat', c(s, 'micro'), charge, {big: '$500–$2,500', cap: 'per post · micro (10K–100K)', x: 760, y: 720, w: 1000, size: 120, col: '#fff'}); sfx('thump', c(s, 'micro'), 0.8);
  source(c(s, 'nano'), charge, 'Later, Influencer Pricing Benchmarks (Jul 2026) · typical ranges');
  shot(charge, 'L04', [A('P14', 600, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  phone(charge, lesson, [{t: 0, kind: 'dm', from: 'GlowSip', col: '#ff4f8b', verified: true, sub: 'Brand · verified', msgs: [[-1, 'in', 'Hi! Rate for 1 video? 💸'], [charge + 0.2, 'out', '$250?'], [c(s, 'they say yes'), 'in', 'Deal!! 🎉']]}]);
  sfx('tap', charge + 0.2, 0.8); sfx('ding', c(s, 'they say yes'), 0.8); hypo(charge, lesson);
  dash(c(s, 'they say yes'), 10000, 250, 155); sfx('register', c(s, 'they say yes') + 0.2, 0.8);
  freeze(c(s, 'instantly') + 0.5, lesson - 0.05, 'YES IN 4 SECONDS', {col: UI.pink});
  chat(lesson, next, [[lesson + 0.1, 'jay', 'they said yes in 4 seconds… u undercharged 💀']], {x: 120, y: 240});
  shot(lesson, 'L04', [A('P11', 1350, 1010, 740)], {motion: 'punch', focus: [0.6, 0.45]});
  shot(next, 'L04', [A('P05', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  phone(next, oh, [{t: 0, kind: 'kit', handle: '@you', t0: next + 0.3, rows: [['Avg views', '18K'], ['Audience', '18–24'], ['1 video', '$400'], ['1 story', '$150']]}]);
  hypo(next + 0.3, oh); [0, 1, 2, 3].forEach((i) => sfx('pop', next + 0.3 + 0.15 * i, 0.5));
  shot(oh, 'L02', [A('P09', 560, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  phone(oh, still, [{t: 0, kind: 'dm', from: 'GlobalModelz_Official', col: '#888', sub: '12 followers', msgs: [[c(s, 'congrats'), 'in', 'Congrats! You’ve been selected as a BRAND AMBASSADOR 🌟 Just pay $49 for your starter kit!', 'pay']]}]);
  sfx('ding', c(s, 'congrats'), 0.8);
  sticker(c(s, "it's a scam"), still, 'SCAM', 620, 420, {col: UI.red, size: 120});
  label(c(s, 'a real brand pays you'), still, 'A REAL BRAND PAYS YOU', {x: 620, y: 860, size: 92, col: UI.green});
  shot(still, 'L04', [A('P20', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  pop(still + 0.2, aff, 'svg:can', 1350, 560, 300); tag(still + 0.5, aff, '+$250', 1350, 330, {col: UI.green});
  shot(aff, 'L04', [A('P14', 600, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  phone(aff, real, [{t: 0, kind: 'affiliate', sales: [[c(s, 'forty dollar'), '30oz Water Bottle', 40, 0.03]]}]);
  pop(c(s, 'forty dollar'), real, 'svg:bottle', 500, 520, 260);
  hypo(aff + 0.3, real); sfx('coin', c(s, 'a dollar twenty'), 0.9); sfx('trombone', c(s, 'a dollar twenty') + 0.5, 0.7);
  dash(c(s, 'a dollar twenty'), 10000, 251.2, 156.2);
  shot(real, 'G:navy', [A('P07', 1580, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(real + 0.2, so, 'COFFEE MONEY', {x: 760, y: 360, size: 140}); pop(real + 0.4, so, 'coffee', 760, 640, 260);
  label(c(s, 'thousands of sales'), so, 'NEED: 1,000s OF SALES / MONTH', {x: 760, y: 900, size: 80, col: '#fff'});
  shot(so, 'L04', [A('P03', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'paid by the platform'), secEnd(s) + 0.4, 'GET PAID BY THE APP', {x: 1300, y: 300, size: 110}); sfx('riser', c(s, 'paid by the platform') - 0.4, 0.6);
}

// =====================================================================================================
// 4  LEVEL 3: monetized
{
  const s = 4; const k = after(s); const yt = c(s, 'on youtube'), cuts = c(s, 'then come the cuts'), shorts = c(s, 'on shorts'), first = c(s, 'your first month'), amount = c(s, 'and the amount'), same = c(s, 'same views'), hurts = c(s, "and here's the part"), sodo = c(s, 'so you do what');
  dash(k, 22000, 251.2, 156.2);
  shot(k, 'G:navy', [A('P23', 360, 1050, 600)], {focus: [0.5, 0.5], hud: true});
  lay('check', k + 0.3, cuts, {title: 'FULL PARTNER PROGRAM', items: [[c(s, 'a thousand subscribers'), '1,000 subscribers'], [c(s, 'four thousand watch hours'), '4,000 watch hours (12 months)'], [c(s, 'ten million shorts'), 'OR 10M Shorts views (90 days)']], x: 1180, y: 470, w: 980});
  [c(s, 'a thousand subscribers'), c(s, 'four thousand watch hours'), c(s, 'ten million shorts')].forEach((x) => sfx('ding', x, 0.7));
  source(yt, cuts, 'YouTube Help, "Overview of the expanded YouTube Partner Program"');
  shot(cuts, 'G:navy', [A('P09', 360, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('donut', cuts + 0.2, first, {keys: [[c(s, 'on regular videos'), 55, 'YOU · LONG VIDEOS'], [shorts, 45, 'YOU · SHORTS']], x: 1200, y: 520});
  label(c(s, 'the platform keeps'), first, 'THE APP KEEPS THE REST', {x: 1200, y: 940, size: 80, col: '#fff'});
  source(c(s, 'on regular videos'), first, 'YouTube Help, "YouTube partner earnings overview"'); sfx('pop', c(s, 'on regular videos'), 0.7); sfx('pop', shorts, 0.7);
  shot(first, 'L04', [A('P14', 600, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  phone(first, amount, [{t: 0, kind: 'payout', title: 'Earnings', label: 'Your first ad payment', amount: [[0, 0], [c(s, 'thirty seven'), 37.12]], sub: 'Paid next month'}]);
  hypo(first + 0.3, amount); dash(c(s, 'thirty seven'), 22000, 288.32, 193.32); sfx('coin', c(s, 'thirty seven'), 0.9);
  shot(c(s, 'thirty seven') + 0.3, 'L04', [A('P08', 900, 1010, 740)], {motion: 'punch', focus: [0.5, 0.45]});
  chat(c(s, 'twelve cents') + 0.3, amount, [[c(s, 'twelve cents') + 0.3, 'jay', '37 dollars?? i make that in 2 hrs at the car wash']], {x: 120, y: 240});
  shot(amount, 'G:teal', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  phone(amount, same + 0.5, [{t: 0, kind: 'post', handle: '@you', caption: 'trying weird snacks pt 4', pose: 'P08', bg: 'linear-gradient(160deg,#ffb020,#ff4f8b)', thumbText: 'WEIRD SNACKS', views: [[0, 100000]], likes: [[0, 8000]], comments: [[0, 400]]}], {x: 520, rot: -5, h: 820});
  phone(c(s, 'a video about investing'), same + 0.5, [{t: 0, kind: 'post', handle: '@you', caption: 'how to invest your first $100', pose: 'P23', bg: 'linear-gradient(160deg,#1e3a5f,#2f8cff)', thumbText: 'INVEST $100', views: [[0, 100000]], likes: [[0, 6200]], comments: [[0, 380]]}], {x: 1400, rot: 5, h: 820});
  tag(c(s, 'several times more'), same + 0.5, '$ × SEVERAL', 1400, 120, {col: UI.green}); tag(c(s, 'trying weird snacks'), same + 0.5, '$', 520, 120);
  hypo(c(s, 'a video about investing'), same + 0.5);
  shot(same, 'G:teal', [A('P11', 960, 1050, 600)], {tr: 'cut', hud: true});
  label(same + 0.1, c(s, "that's why so many"), 'SAME VIEWS ≠ SAME PAY', {x: 960, y: 260, size: 120, col: '#fff'});
  label(c(s, "that's why so many"), hurts, '…WAIT.', {x: 960, y: 260, size: 150}); sfx('crickets', c(s, 'about money') + 0.2, 0.8);
  shot(hurts, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('heart', hurts + 0.2, sodo, {pts: [3, 8, 4, 9, 2, 7, 3, 10, 2, 6, 3, 8], x: 960, y: 560, w: 1500, h: 420, label: 'PER VIEW, NOT PER FOLLOWER'});
  label(c(s, 'flops with them'), sodo, 'VIEWS FLOP = CHECK FLOPS', {y: 940, size: 80, col: UI.pink}); sfx('trombone', c(s, 'flops with them'), 0.7);
  hypo(hurts + 0.3, sodo);
  shot(sodo, 'L04', [A('P14', 600, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'you post more'), secEnd(s) + 0.4, 'POST MORE.', {x: 1350, y: 300, size: 150}); sfx('thump', c(s, 'you post more'), 0.8);
}

// =====================================================================================================
// 5  LEVEL 4: the treadmill
{
  const s = 5; const k = after(s); const film = c(s, 'you film in'), every = c(s, 'and everywhere you look'), buy = c(s, 'so you buy'), week = c(s, 'then one week'), income = c(s, 'your income gets'), rem = c(s, 'remember that line');
  dash(k, 50000, 1250, 1155);
  shot(k, 'L02', [A('P15', 760, 1010, 600)], {fx: 'night', focus: [0.45, 0.6]});
  label(c(s, 'on paper'), c(s, 'in real life'), "ON PAPER: YOU'RE GROWING", {x: 1300, y: 260, size: 90, col: '#3ee089'}); label(c(s, 'in real life'), film, 'IN REAL LIFE: EXHAUSTED', {x: 1300, y: 260, size: 90, col: UI.pink}); sfx('pop', c(s, 'on paper'), 0.6); sfx('thump', c(s, 'in real life'), 0.7);
  shot(film, 'G:navy', [A('P14', 1500, 1060, 620)], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('steps', film, every, {title: 'EVERY. SINGLE. DAY.', items: [[c(s, 'film'), 'FILM'], [c(s, 'edit at night'), 'EDIT'], [c(s, 'reply to comments'), 'REPLY'], [c(s, "you're posting every day"), 'POST · REPEAT']], x: 700});
  [c(s, 'film'), c(s, 'edit at night'), c(s, 'reply to comments'), c(s, "you're posting every day")].forEach((x) => sfx('tap', x, 0.8));
  label(c(s, 'the algorithm stops'), every, 'STOP = INVISIBLE', {x: 700, y: 940, size: 80, col: UI.pink});
  shot(every, 'L04', [A('P09', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  phone(every, buy, [{t: 0, kind: 'post', handle: '@someone_else', caption: 'new setup reveal ✨', plate: 'L07', thumbText: '2M VIEWS', views: [[0, 2000000]], likes: [[0, 210000]], comments: [[0, 12000]]}]);
  label(c(s, 'neon sign'), buy, 'NEON SIGN.', {x: 560, y: 260, size: 110, col: UI.pink});
  shot(buy, 'G:purple', [A('P18', 1640, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  pop(c(s, 'a better camera'), week, 'svg:camera', 420, 560, 360); tag(c(s, 'a better camera') + 0.2, week, '$650', 420, 300);
  pop(c(s, 'better lights'), week, 'svg:ringlight', 800, 560, 400); tag(c(s, 'better lights') + 0.2, week, '$180', 820, 300);
  pop(c(s, 'a second phone'), week, 'phone', 1150, 600, 300); tag(c(s, 'a second phone') + 0.2, week, '$400', 1150, 330);
  dash(c(s, 'a better camera'), 50000, 1250, 505); dash(c(s, 'better lights'), 50000, 1250, 325); dash(c(s, 'a second phone'), 50000, 1250, -75);
  hypo(c(s, 'a better camera'), week);
  shot(week, 'L04', [A('P21', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  phone(week, income + 0.3, [{t: 0, kind: 'analytics', pts: [30, 34, 31, 38, 36, 41, 44, 40, 47, 45, 50, 48, 52, 49, 55, 53], tDrop: c(s, 'cut in half'), pct: 52, total: 812000}]);
  sfx('thump', c(s, 'cut in half'), 1); hypo(c(s, 'cut in half'), income + 0.3);
  label(c(s, 'no warning'), income, 'NO WARNING.', {x: 560, y: 300, size: 100, col: '#fff'}); label(c(s, 'no email'), income, 'NO EMAIL.', {x: 560, y: 440, size: 100, col: '#fff'}); label(c(s, 'no reason'), income, 'NO REASON.', {x: 560, y: 580, size: 100, col: UI.pink});
  shot(income, 'G:red', [A('P11', 1600, 1050, 600)], {tr: 'zoom', hud: true});
  dash(c(s, 'cut in half too'), 50000, 1250, -300);
  label(income + 0.1, c(s, "you're renting one"), 'INCOME −50%', {x: 760, y: 470, size: 150, col: UI.pink});
  label(c(s, "you're renting one"), rem, "YOU'RE RENTING", {x: 760, y: 380, size: 150}); label(c(s, "you're renting one") + 0.3, rem, 'YOUR AUDIENCE', {x: 760, y: 560, size: 130, col: '#fff'}); sfx('thump', c(s, "you're renting one"), 0.9);
  shot(rem, 'G:navy', [A('P05', 1500, 1050, 600)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(rem + 0.2, secEnd(s) + 0.4, 'REMEMBER THAT LINE', {x: 760, y: 420, size: 120}); label(c(s, 'level eight') , secEnd(s) + 0.4, '→ LEVEL 8', {x: 760, y: 600, size: 110, col: UI.gold}); sfx('ding', c(s, 'level eight'), 0.8);
}

// =====================================================================================================
// 6  QUICK CATCH-UP
{
  const s = 6; const t0 = T.offs[s]; const now = c(s, "and now you're about");
  shot(t0 - 0.3, 'G:navy', [], {tr: 'flash', nohud: true});
  lay('ladder', t0, secEnd(s) + 0.4, {items: ['YOU PAY', 'HOODIES', '$250', '$37', 'RENTING', '?', '?', '?', '?', '?'], tStep: 0.08,
    marks: [[c(s, 'at zero'), 0, 'glow'], [c(s, 'at a thousand'), 1, 'glow'], [c(s, 'at ten thousand'), 2, 'glow'], [c(s, 'the platform pays'), 3, 'glow'], [c(s, 'take it away'), 4, 'shake'], [now, 5, 'gold', 'FAMOUS'], [now, 0, 'dim'], [now, 1, 'dim'], [now, 2, 'dim'], [now, 3, 'dim']]});
  [c(s, 'at zero'), c(s, 'at a thousand'), c(s, 'at ten thousand'), c(s, 'the platform pays')].forEach((x) => sfx('pop', x, 0.7)); sfx('thump', c(s, 'take it away'), 0.8); sfx('riser', now, 0.7);
  label(c(s, 'where it gets weird'), secEnd(s) + 0.4, 'IT GETS WEIRD.', {y: 900, size: 110, col: UI.pink});
}

// =====================================================================================================
// 7  LEVEL 5: famous but broke
{
  const s = 7; const k = after(s); const deals = c(s, 'and the deals jump'), four = c(s, 'four thousand dollars for'), but = c(s, "but deals don't"), press = c(s, "and now there's a new"), rent = c(s, 'so you rent the car'), why = c(s, 'this is why so many'), heart = c(s, 'and when your income');
  dash(k, 100000, 1250, -300);
  shot(k, 'L05', [A('P06', 1000, 1010, 760), A('C02', 1580, 1010, 700)], {focus: [0.6, 0.5]});
  lay('chat', c(s, 'people recognize'), deals, {msgs: [[c(s, 'people recognize') + 0.2, 'jay', 'someone just asked me if i know YOU 😭']], x: 120, y: 230});
  shot(deals, 'G:navy', [A('P23', 1620, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  stat(deals + 0.2, four, '$2,500–$10,000+', 'per post · macro (100K–1M followers)', {x: 760, y: 470, w: 1150, size: 140});
  source(c(s, 'brands pay this tier'), four, 'Later, Influencer Pricing Benchmarks (Jul 2026) · typical ranges');
  shot(four, 'L04', [A('P14', 600, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  phone(four - 0.2, but, [{t: 0, kind: 'dm', from: 'Vexo Energy', col: '#2f8cff', verified: true, sub: 'Brand · verified', msgs: [[four - 0.1, 'in', 'Hi! We’d love a 60-second integration. Budget: $4,000 ⚡']]}]);
  pop(four + 0.4, but, 'svg:can', 1790, 820, 240); hypo(four, but); sfx('ding', four - 0.1, 0.8);
  dash(c(s, 'you feel rich'), 100000, 5250, 3700); sfx('register', c(s, 'you feel rich'), 0.8);
  shot(c(s, 'you feel rich'), 'L04', [A('P18', 600, 1010, 760)], {motion: 'punch', focus: [0.35, 0.45]});
  shot(but, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('months', but + 0.1, press, {cells: [['MAR', '$4,000', c(s, 'one month')], ['APR', '$0', c(s, 'the next month')], ['MAY', '$0', c(s, "the next month it's zero") + 0.4], ['JUN', '$1,500', c(s, 'thirty sixty')]]});
  hypo(but + 0.3, press); sfx('register', c(s, 'one month'), 0.7); sfx('thump', c(s, 'the next month'), 0.8);
  label(c(s, 'thirty sixty'), press, 'PAID 30–90 DAYS LATER', {y: 880, size: 90, col: UI.pink});
  shot(press, 'G:purple', [A('P21', 400, 1050, 640)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(press + 0.1, c(s, 'nice apartment'), 'LOOK SUCCESSFUL', {x: 1150, y: 300, size: 120, col: '#fff'});
  pop(c(s, 'nice apartment'), rent, 'house', 950, 520, 320); pop(c(s, 'nice car'), rent, 'car', 1450, 560, 300); pop(c(s, 'nice trips'), rent, 'briefcase', 1200, 860, 220);
  shot(rent, 'L05', [A('P06', 760, 1010, 760)], {tr: 'whip', sfx: 'whoosh'});
  pop(rent, why, 'car', 1350, 820, 340);
  receipt(c(s, 'hotel lobby'), why, [['CAR RENTAL', '$300/day'], ['HOTEL LOBBY', 'FREE'], ['"DAY IN MY LIFE"', 'FAKE']], {x: 1180});
  label(c(s, 'looking rich is what'), why, 'THE LOOK IS A BUSINESS EXPENSE', {x: 760, y: 260, size: 80, col: '#fff'}); hypo(rent, why);
  shot(why, 'G:purple', [A('P15', 1600, 1010, 520)], {tr: 'zoom', hud: true});
  label(why + 0.1, c(s, 'sixty seven percent') - 0.1, 'LOOK RICH ≠ BE RICH', {x: 760, y: 470, size: 140, col: UI.pink}); sfx('thump', why + 0.1, 0.8);
  stat(c(s, 'sixty seven percent'), heart, '67%', 'of creators earn under $10K a year', {x: 760, y: 420, w: 1100, size: 200});
  lay('stat', c(s, 'just under five'), heart, {big: 'UNDER 5%', cap: 'clear $100K', x: 760, y: 780, w: 760, size: 110, col: UI.green}); sfx('thump', c(s, 'just under five'), 0.8);
  source(c(s, 'a big survey'), heart, 'CreatorIQ × Influencers Club, State of Creators (May–Jun 2026, 5,095 creators)');
  dash(why + 0.3, 100000, 31200, 212);
  shot(heart, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('heart', heart + 0.1, secEnd(s) + 0.4, {pts: [9, 1, 2, 8, 1, 1, 6, 1, 9, 2, 1, 7], money: false, x: 700, y: 560, w: 1000, h: 380, label: 'YOUR INCOME'});
  phone(c(s, 'pay in four'), secEnd(s) + 0.4, [{t: 0, kind: 'checkout', item: 'sneakers', title: 'Street sneakers', price: 60, clock: '1:12'}], {x: 1500, h: 820, rot: 6});
  label(c(s, 'how that ends'), secEnd(s) + 0.4, 'WATCH: BNPL VIDEO', {x: 700, y: 900, size: 80, col: UI.pink});
}

// =====================================================================================================
// 8  LEVEL 6: the team
{
  const s = 8; const k = after(s); const mgr = c(s, 'a manager who'), cut = c(s, "and then there's the cut"), deal = c(s, 'so that eight thousand'), read = c(s, 'and then you read'), net = c(s, 'net sixty'), good = c(s, 'this is exactly'), earned = c(s, 'earned and kept');
  dash(k, 250000, 31200, 212);
  shot(k, 'L07', [A('P02', 560, 1010, 740)], {focus: [0.45, 0.5]});
  shot(mgr, 'L07', [A('C07', 420, 1010, 700), A('C03', 960, 1010, 680), A('C06', 1500, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  sticker(c(s, 'takes a cut'), cut, 'MANAGER 20%', 420, 260, {col: '#7c4dff', size: 54}); sticker(c(s, 'an editor'), cut, 'EDITOR $1,200/MO', 960, 260, {col: '#2f8cff', size: 50, rot: 5}); sticker(c(s, 'an accountant'), cut, 'ACCOUNTANT $300/MO', 1500, 260, {col: '#ff8a00', size: 46});
  hypo(mgr, cut);
  shot(cut, 'L07', [A('C01', 1500, 1010, 720, {enter: 'R'})], {tr: 'whip', sfx: 'whoosh'});
  sfx('thump', c(s, 'self employment tax'), 1);
  stat(c(s, 'fifteen point three'), deal, '15.3%', 'self-employment tax on your profit', {x: 700, y: 440, w: 1000, size: 200});
  label(c(s, 'you owe it yourself'), deal, 'NO BOSS. YOU OWE IT.', {x: 700, y: 840, size: 90, col: UI.pink});
  source(c(s, 'self employment tax'), deal, 'IRS, "Self-employment tax (Social Security and Medicare taxes)" · not tax advice');
  shot(deal, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('dollar', deal + 0.1, read, {title: 'ONE BRAND DEAL', total: 8000, y: 520, tYou: c(s, 'a little over half'),
    segs: [[deal + 0.6, 'MANAGER', 1600, '#7c4dff'], [deal + 1.0, 'EDITOR', 1200, '#2f8cff'], [deal + 1.4, 'SE TAX', 800, '#ff4757'], [deal + 1.8, 'INCOME TAX', 300, '#ff8a00']]});
  [0.6, 1.0, 1.4, 1.8].forEach((d) => sfx('pop', deal + d, 0.6)); hypo(deal + 0.3, read);
  dash(c(s, 'a little over half'), 250000, 39200, 4312); sfx('register', c(s, 'a little over half'), 0.7);
  shot(read, 'L07', [A('P13', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  phone(read, good, [{t: 0, kind: 'contract', title: 'Creator Agreement', lines: [['Payment: Net 60', net], ['Exclusivity: 90 days', c(s, 'exclusivity')], ['Usage rights: 12 months, all channels', c(s, 'twelve months of usage')]]}], {h: 960});
  [net, c(s, 'exclusivity'), c(s, 'twelve months of usage')].forEach((x) => sfx('marker', x, 0.8));
  label(c(s, 'block every other'), good, 'BLOCKS EVERY OTHER DRINK BRAND', {x: 600, y: 190, size: 70, col: '#fff'});
  shot(good, 'L07', [A('C07', 560, 1010, 720), A('P20', 1450, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  label(good + 0.3, earned, 'THIS IS WHY MANAGERS EXIST', {y: 900, size: 90});
  shot(earned, 'G:navy', [A('P09', 1620, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(earned, secEnd(s) + 0.4, 'EARNED', {x: 500, y: 380, size: 170, col: UI.gold}); label(c(s, 'kept'), secEnd(s) + 0.4, '≠ KEPT', {x: 1100, y: 380, size: 170, col: '#3ee089'});
  label(c(s, 'the more people'), secEnd(s) + 0.4, 'MORE PEOPLE IN BETWEEN', {x: 760, y: 640, size: 90, col: '#fff'});
}

// =====================================================================================================
// 9  LEVEL 7: the million
{
  const s = 9; const k = after(s); const at = c(s, 'at this level'), yes = c(s, 'and yes now'), good = c(s, 'good money'), rule = c(s, 'and it\'s a job'), stop = c(s, 'if you stop posting'), risk = c(s, "and there's a second");
  dash(k, 1000000, 39200, 4312);
  shot(k, 'L09', [A('P10', 560, 1010, 760)], {focus: [0.4, 0.5]});
  shot(at, 'L09', [A('C04', 1500, 1010, 720), A('P06', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  phone(at, yes, [{t: 0, kind: 'dm', from: 'Vexo Energy', col: '#2f8cff', verified: true, sub: 'Partnerships team', msgs: [[at + 0.3, 'in', 'Attached: 1 video · $25,000 · let’s sign 🤝', 'pdf']]}], {x: 1000, h: 820});
  pop(at + 0.8, yes, 'svg:contract', 1150, 860, 200); hypo(at + 0.3, yes); sfx('ding', at + 0.3, 0.8);
  stat(c(s, 'tens of thousands'), yes, '$10,000–$50,000+', 'per post · mega (1M+ followers)', {x: 960, y: 230, w: 1300, size: 110});
  source(c(s, 'top tier creators'), yes, 'Later, Influencer Pricing Benchmarks (Jul 2026) · typical ranges');
  dash(c(s, 'tens of thousands'), 1000000, 64200, 17312); sfx('register', c(s, 'tens of thousands') + 0.3, 0.8);
  shot(yes, 'G:navy', [A('P20', 1650, 1050, 540)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(yes + 0.1, c(s, 'fifty thousand') - 0.1, 'A GREAT LIVING?', {x: 760, y: 470, size: 140, col: UI.green});
  lay('range', c(s, 'fifty thousand'), good, {lo: '$50K', hi: '$250K+', cap: 'What most 1M+ creators earn a year', x: 760, y: 560});
  source(c(s, 'in that same survey'), good, 'CreatorIQ × Influencers Club, State of Creators (2026)'); sfx('riser', c(s, 'fifty thousand') - 0.2, 0.6);
  shot(good, 'L09', [A('P07', 960, 1010, 760)], {tr: 'whip', sfx: 'whoosh'});
  freeze(c(s, 'a million followers sounds'), rule - 0.05, '1M FOLLOWERS ≠ $1M', {col: UI.pink});
  label(c(s, 'well paid job'), rule, 'A WELL-PAID JOB', {x: 960, y: 260, size: 110, col: '#fff'});
  shot(rule, 'L02', [A('P22', 960, 1000, 740)], {tr: 'whip', sfx: 'whoosh'});
  shot(stop, 'G:red', [A('P15', 1550, 1010, 520)], {tr: 'zoom', hud: true});
  lay('heart', stop + 0.1, risk, {pts: [8, 9, 8, 10, 9, 3, 1, 1, 1, 1], money: true, x: 700, y: 560, w: 1000, h: 380, label: '2 WEEKS OFF'});
  label(c(s, 'no sick days'), risk, 'NO SICK DAYS', {x: 700, y: 900, size: 80, col: '#fff'}); label(c(s, 'logs off too'), risk, 'MONEY LOGS OFF', {x: 700, y: 900, size: 90, col: UI.pink});
  sfx('thump', c(s, 'logs off too'), 0.8);
  shot(risk, 'L02', [A('P21', 560, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  phone(risk, secEnd(s) + 0.4, [{t: 0, kind: 'lock', clock: '8:02', date: 'Monday', notes: [[c(s, 'one bad clip'), 'Comments', '4,200 new comments 😡', '#ff8a00'], [c(s, 'pause their deals'), 'Vexo Energy', 'We are pausing all creator campaigns', '#2f8cff'], [c(s, 'pause their deals') + 0.6, 'GlowSip', 'Re: our partnership', '#ff4f8b']]}], {buzz: [c(s, 'one bad clip'), c(s, 'pause their deals'), c(s, 'pause their deals') + 0.6]});
  [c(s, 'one bad clip'), c(s, 'pause their deals'), c(s, 'pause their deals') + 0.6].forEach((x) => sfx('buzz', x, 0.8)); hypo(c(s, 'one bad clip'), secEnd(s));
  label(c(s, 'your face is the business'), secEnd(s) + 0.4, 'YOUR FACE = THE BUSINESS', {x: 790, y: 225, size: 68});
}

// =====================================================================================================
// 10  LEVEL 8: own something
{
  const s = 10; const k = after(s); const rem = c(s, 'remember level four'), inst = c(s, 'instead of selling'), look = c(s, 'and look at how'), risk = c(s, "it's also riskier"), happ = c(s, "it's already happening"), side = c(s, 'remember the side');
  dash(k, 1400000, 64200, 17312);
  shot(k, 'L03B', [A('P19', 560, 1010, 760)], {focus: [0.4, 0.5]});
  pop(k + 0.3, rem, 'svg:hoodie', 1450, 560, 360);
  shot(rem, 'G:navy', [A('P05', 1620, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(rem + 0.1, inst, 'RENTING', {x: 560, y: 420, size: 150, col: '#9aa3b2'}); label(c(s, 'start owning'), inst, '→ OWNING', {x: 1050, y: 420, size: 150, col: '#3ee089'}); sfx('thump', c(s, 'start owning'), 0.9);
  shot(inst, 'G:teal', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(inst + 0.1, c(s, 'your own merch') - 0.1, 'SELL YOUR OWN STUFF', {y: 500, size: 140, col: '#3ee089'}); sfx('pop', inst + 0.1, 0.7);
  lay('tiles', inst + 0.2, look, {items: [[c(s, 'your own merch'), '▣', 'YOUR OWN PRODUCT'], [c(s, 'a course'), '✎', 'A COURSE'], [c(s, 'a paid community'), '★', 'PAID MEMBERS'], [c(s, 'collect people\'s emails'), '✉', 'YOUR EMAIL LIST']], y: 500});
  [c(s, 'your own merch'), c(s, 'a course'), c(s, 'a paid community'), c(s, "collect people's emails")].forEach((x) => sfx('pop', x, 0.7));
  label(c(s, 'no algorithm can'), look, 'NO ALGORITHM CAN TAKE IT', {y: 900, size: 84, col: '#fff'});
  shot(look, 'L04', [A('P14', 560, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  phone(look, risk, [{t: 0, kind: 'store', product: 'Hoodie drop', each: 30, orders: [[0, 0], [c(s, 'keep selling'), 400], [c(s, 'the work is the same'), 1000]]}]);
  label(c(s, 'pays once'), risk, 'SPONSOR: PAYS ONCE', {x: 560, y: 300, size: 80, col: '#fff'}); label(c(s, 'keep selling for months'), risk, 'PRODUCT: KEEPS SELLING', {x: 560, y: 460, size: 80, col: '#3ee089'});
  hypo(look + 0.3, risk); sfx('coin', c(s, 'keep selling'), 0.7); sfx('coin', c(s, 'keep selling') + 0.4, 0.7); sfx('register', c(s, 'the work is the same'), 0.7);
  dash(c(s, 'keep selling'), 1400000, 94200, 41312);
  shot(risk, 'L03B', [A('P21', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  pop(c(s, 'the boxes sit'), happ, 'svg:boxes', 1450, 700, 420, {drop: true});
  label(c(s, 'first time your income'), happ, 'NOBODY CAN PAUSE IT', {x: 1300, y: 260, size: 90, col: '#3ee089'});
  shot(happ, 'G:navy', [A('P23', 1620, 1050, 560)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(happ + 0.1, c(s, 'about a fifth') - 0.1, "IT'S ALREADY HAPPENING", {x: 760, y: 470, size: 120, col: '#fff'});
  stat(c(s, 'about a fifth'), side, '21.2%', 'of creator income: products, merch & affiliate', {x: 760, y: 470, w: 1150, size: 200});
  source(c(s, 'creator survey'), side, 'The Influencer Marketing Factory, Creator Economy Report (Feb 2026)');
  shot(side, 'L03', [A('P02', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  label(side + 0.3, c(s, 'level eight is the moment'), 'OWN A JOB?', {x: 1300, y: 300, size: 120, col: '#fff'}); label(c(s, 'you own a job'), c(s, 'level eight is the moment'), '…OR A BUSINESS?', {x: 1300, y: 470, size: 110, col: '#3ee089'});
  shot(c(s, 'level eight is the moment'), 'L03B', [A('P10', 760, 1010, 760)], {motion: 'punch', focus: [0.45, 0.45]});
  label(c(s, 'becomes a business'), secEnd(s) + 0.4, 'INFLUENCER → BUSINESS', {x: 1250, y: 300, size: 100}); sfx('ding', c(s, 'becomes a business'), 0.8);
}

// =====================================================================================================
// 11  LEVEL 9: the media company
{
  const s = 11; const k = after(s); const prod = c(s, "you've got producers"), forbes = c(s, 'forbes estimates'), look = c(s, 'and look closely'), fifty = c(s, "but that's fifty");
  dash(k, 10000000, 2400000, 1100000);
  shot(k, 'G:gold', [A('P18', 960, 1050, 620)], {focus: [0.5, 0.5], hud: true});
  label(k + 0.1, c(s, 'media company') - 0.1, '10,000,000 FOLLOWERS', {y: 200, size: 110}); label(c(s, 'media company'), prod, 'A MEDIA COMPANY WITH A FACE', {y: 200, size: 100, col: '#fff'}); hypo(k + 0.2, prod);
  shot(prod, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('org', prod, forbes, {boxes: [[c(s, 'producers'), 'PRODUCTION'], [c(s, 'lawyers'), 'LEGAL'], [c(s, 'sponsorships'), 'BRAND DEALS'], [c(s, 'products sitting'), 'PRODUCTS']]});
  [c(s, 'producers'), c(s, 'lawyers'), c(s, 'sponsorships'), c(s, 'products sitting')].forEach((x) => sfx('pop', x, 0.7));
  shot(forbes, 'G:gold', [A('P08', 1650, 1050, 520)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(forbes + 0.1, c(s, 'over a billion') - 0.1, 'FORBES TOP 50 CREATORS', {x: 760, y: 470, size: 120, col: '#fff'});
  stat(c(s, 'over a billion'), look, '$1.02 BILLION', 'Forbes Top 50 creators, combined, in one year', {x: 760, y: 380, w: 1200, size: 150});
  lay('stat', c(s, 'three hundred million'), look, {big: '≈ $300M', cap: 'the #1 creator alone', x: 760, y: 760, w: 800, size: 120, col: '#fff'}); sfx('register', c(s, 'three hundred million'), 0.8);
  source(c(s, 'forbes estimates'), look, 'Forbes Top Creators 2026 (estimates), via Tubefilter, Jun 2026');
  shot(look, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', hud: true});
  lay('org', look, fifty, {boxes: [[look, 'PRODUCTION'], [look, 'LEGAL'], [look, 'BRAND DEALS'], [look, 'PRODUCTS']], tGrow: c(s, 'built companies')});
  label(c(s, 'the videos are the marketing'), fifty, 'VIDEOS = MARKETING', {x: 560, y: 900, size: 80, col: '#fff'}); label(c(s, 'the businesses are the money'), fifty, 'BUSINESS = MONEY', {x: 1360, y: 900, size: 80, col: '#3ee089'});
  shot(fifty, 'G:navy', [], {tr: 'zoom', hud: true});
  lay('pyramid', fifty, secEnd(s) + 0.5, {tTop: c(s, 'fifty people')});
  label(c(s, 'out of tens'), secEnd(s) + 0.5, '50 OUT OF TENS OF MILLIONS', {y: 960, size: 80, col: '#fff'}); sfx('ding', c(s, 'fifty people'), 0.8);
  source(c(s, 'out of tens'), secEnd(s) + 0.5, 'Goldman Sachs Research (Apr 2023): ~50M creators, ~4% earn $100K+');
}

// =====================================================================================================
// 12  PAYOFF
{
  const s = 12; const t0 = T.offs[s]; const notm = c(s, "it's not a million"), danger = c(s, 'the most dangerous'), real = c(s, 'the real level up'), soif = c(s, "so if you're thinking"), what = c(s, 'what level would'), next = c(s, 'and if you want');
  shot(t0 - 0.3, 'G:navy', [], {tr: 'flash', nohud: true});
  lay('ladder', t0, soif, {items: LADDER, tStep: 0.06, marks: [[notm, 7, 'dim', 'NOPE'], [danger, 5, 'shake', 'THE TRAP'], [real, 8, 'gold', 'THIS ONE']]});
  sfx('pop', t0 + 0.1, 0.6); sfx('thump', notm, 0.8); sfx('thump', danger, 0.9); sfx('wow', real, 0.7); sfx('ding', real + 0.2, 0.8);
  label(c(s, 'followers are borrowed'), soif, 'FOLLOWERS ARE BORROWED', {y: 900, size: 90, col: '#fff'}); label(c(s, 'what you own you keep'), soif, 'WHAT YOU OWN, YOU KEEP', {y: 900, size: 100, col: '#3ee089'});
  shot(soif, 'L04', [A('P05', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'how do i get'), what, '"HOW DO I GET 1M FOLLOWERS?"', {x: 1250, y: 300, size: 70, col: '#9aa3b2'}); label(c(s, 'what will i own'), what, '"WHAT WILL I OWN?"', {x: 1250, y: 470, size: 100, col: '#3ee089'});
  dash(soif, 1400000, 94200, 94200);
  shot(what, 'G:purple', [A('P05', 1400, 1050, 680)], {tr: 'whip', sfx: 'whoosh', hud: true});
  chat(what, next, [[what + 0.3, 'jay', 'ok real talk…'], [c(s, 'tell me in the comments'), 'jay', 'what level would u stop at?']], {x: 160, y: 200});
  label(c(s, 'earns a single cent'), next, '(NOW YOU KNOW WHERE IT GOES)', {x: 600, y: 900, size: 60, col: '#fff'});
  shot(next, 'G:purple', [A('P03', 700, 1050, 680)], {tr: 'whip', sfx: 'whoosh', nohud: true});
  label(next + 0.3, T.voEnd, 'HOW BNPL DESTROYS YOUR LIFE', {x: 1250, y: 300, size: 80});
}
S.push({t: T.voEnd, kind: 'end', nohud: true}); SFX.push(['whoosh', T.voEnd - 0.1, 0.8]);

S.sort((a, b) => a.t - b.t);
// drop slivers, then split long shots into punch-in cuts every ~4s (same set-up, new framing)
for (let i = S.length - 2; i >= 0; i--) if (S[i + 1].t - S[i].t < 0.3) S.splice(i, 1);
{
  const out: any[] = []; const FOC = [[0.42, 0.45], [0.58, 0.5], [0.5, 0.4], [0.38, 0.55]];
  S.forEach((s, i) => {
    out.push(s); if (s.kind) return; const e = i + 1 < S.length ? S[i + 1].t : T.total; const d = e - s.t; if (d < 6.5) return;
    const n = Math.round(d / 4.3);
    for (let j = 1; j < n; j++) { const f = FOC[(i + j) % FOC.length]; out.push({...s, actors: s.actors.map((a: any) => (a.t != null ? a : {...a, enter: undefined})), t: R2(s.t + (j * d) / n), tr: 'cut', motion: j % 2 ? 'out' : 'in', za: 0.06 + 0.03 * (j % 2), focus: s.plate.startsWith('G:') ? s.focus : f, split: true, sfx: undefined}); }
  });
  S.length = 0; S.push(...out);
}
TRK.sort((a, b) => a[0] - b[0]); SFX.sort((a, b) => a[1] - b[1]);
