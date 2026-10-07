// V05 edit as code: shots, layers, SFX, tracker states, freeze frames. All times come from word cues.
import {T, c, ce, secEnd, card} from './tl';
const UI = {red: '#ff4757', amber: '#ffb020', green: '#32d074'};

export const S: any[] = []; export const L: any[] = []; export const SFX: [string, number, number?][] = []; export const TRK: [number, any][] = []; export const FREEZE: [number, number][] = [];
const R2 = (x: number) => Math.round(x * 100) / 100;
export const A = (c: string, x: number, y = 1010, h = 760, kw: any = {}) => ({c, x, y, h, ...kw});
export const shot = (t: number, plate: string, actors: any[] = [], kw: any = {}) => { const d = {t: R2(t), plate, actors, props: [], motion: 'in', focus: [0.5, 0.5], tr: 'cut', ...kw}; S.push(d); if (kw.sfx) SFX.push([kw.sfx, t - 0.05]); return d; };
export const lay = (kind: string, t0: number, t1: number, kw: any = {}) => { const d = {kind, t0: R2(t0), t1: R2(t1), ...kw}; L.push(d); return d; };
const sfx = (n: string, t: number, v?: number) => SFX.push([n, t, v]);
const trk = (t: number, st: any) => TRK.push([t, st]);
const phone = (t0: number, t1: number, screens: any[], kw: any = {}) => lay('phone', t0, t1, {p: {t0, t1, x: 1400, y: 560, h: 900, screens, ...kw}});
const label = (t0: number, t1: number, text: string, kw: any = {}) => lay('label', t0, t1, {text, ...kw});
const sticker = (t0: number, t1: number, text: string, x: number, y: number, kw: any = {}) => { lay('sticker', t0, t1, {text, x, y, ...kw}); sfx('stamp', t0, 0.35); };
const stat = (t0: number, t1: number, big: string, cap: string, kw: any = {}) => { lay('stat', t0, t1, {big, cap, ...kw}); sfx('thump', t0, 0.5); };
const source = (t0: number, t1: number, text: string) => lay('source', t0, t1, {text});
const hypo = (t0: number, t1: number, kw: any = {}) => lay('hypo', t0, t1, kw);
const pop = (t0: number, t1: number, cc: string, x: number, y: number, h: number, kw: any = {}) => { lay('prop', t0, t1, {c: cc, x, y, h, ...kw}); sfx(kw.drop ? 'thump' : 'pop', t0, kw.drop ? 0.45 : 0.35); };
const combo = (t0: number, t1: number, n: number, kw: any = {}) => { lay('combo', t0, t1, {n, ...kw}); sfx('register', t0, 0.35); };
const chat = (t0: number, t1: number, msgs: any[], kw: any = {}) => lay('chat', t0, t1, {msgs, ...kw});
const receipt = (t0: number, t1: number, lines: any[], kw: any = {}) => { lay('receipt', t0, t1, {lines, ...kw}); sfx('print', t0, 0.5); };
const st = (plans: number, owed: number, apps = 1, next?: string, nextAmt?: number, late = false) => ({plans, owed, apps, next, nextAmt, late});

// ---- the 12 plans of the story (HYPOTHETICAL)
const PL: any = {
  sneakers: {item: 'sneakers', name: 'Sneakers', total: 60, app: 0}, jacket: {item: 'jacket', name: 'Puffer jacket', total: 120, app: 0},
  headphones: {item: 'headphones', name: 'Headphones', total: 200, app: 0}, chair: {item: 'gamingchair', name: 'Gaming chair', total: 260, app: 0},
  tv: {item: 'tv', name: 'TV', total: 480, app: 1}, sofa: {item: 'sofa', name: 'Sofa (12 months)', total: 900, app: 2, n: 12},
  controller: {item: 'controller', name: 'Controller', total: 70, app: 1}, groc1: {item: 'groceries', name: 'Groceries', total: 94, app: 1},
  groc2: {item: 'groceries', name: 'Groceries', total: 88, app: 2}, takeout: {item: 'takeoutbag', name: 'Food delivery', total: 46, app: 2},
  groc3: {item: 'groceries', name: 'Groceries', total: 91, app: 1}, groc4: {item: 'groceries', name: 'Groceries', total: 86, app: 2},
};
const plan = (k: string, kw: any = {}) => ({...PL[k], ...kw});
const ALL12 = ['sneakers', 'jacket', 'headphones', 'chair', 'tv', 'sofa', 'controller', 'groc1', 'groc2', 'takeout', 'groc3', 'groc4'];
const after = (sec: number) => { const k = card(sec); return k.t + k.dur; };

// =====================================================================================================
// 0  COLD OPEN
{
  const s = 0; const yep = c(s, 'yep'), twelve = c(s, 'twelve'), crazy = c(s, 'and the crazy part'), back = c(s, "let's go back");
  shot(0, 'L02', [A('P21', 560, 1000, 740)], {fx: 'night', focus: [0.4, 0.5], za: 0.09});
  const notes = [[c(s, 'payment failed', 0), 'Payment failed', 'Your payment of $45 didn’t go through', UI.red], [c(s, 'payment failed', 1), 'Payment failed', 'Your payment of $63 didn’t go through', UI.red],
    [c(s, 'late fee'), 'Late fee added', 'A late fee was added to your plan', UI.amber], [c(s, 'your bank account'), 'Bank', 'Your account is overdrawn', '#0a84ff'], [c(s, 'past due'), 'Past due', 'Groceries ($94) is past due', UI.red]];
  phone(0.25, twelve, [{t: 0, kind: 'lock', clock: '2:04', date: 'Tuesday', notes, crack: 0.55, seed: 3}], {buzz: [c(s, 'buzzing'), ...notes.map((n) => n[0])]});
  for (const n of notes) sfx('buzz', n[0] as number, 0.6); sfx('buzz', c(s, 'buzzing'), 0.6);
  shot(c(s, 'payment failed', 0), 'L02', [A('P08', 560, 1000, 740)], {fx: 'night', motion: 'punch', focus: [0.3, 0.45]});
  shot(c(s, 'your bank account'), 'L02', [A('P21', 560, 1000, 740)], {fx: 'night', focus: [0.35, 0.5]});
  // freeze: YEP. THAT'S YOU.
  FREEZE.push([yep - 0.05, twelve - 0.1]); sfx('scratch', yep - 0.12, 0.5); label(yep, twelve - 0.1, "YEP. THAT'S YOU.", {live: true, y: 880});
  shot(twelve, 'G:red', [], {tr: 'flash', hud: true});
  combo(twelve, c(s, 'across three apps'), 12, {x: 720, y: 520});
  phone(twelve, c(s, 'on stuff you mostly'), [{t: twelve, kind: 'plans', clock: '2:05', plans: ALL12.map((k, i) => plan(k, {tAdd: twelve + i * 0.08, paid: 1, state: i % 3 === 0 ? 'late' : 'ok', due: 'FRI'})), apps: 3, red: true},
    {t: c(s, 'across three apps'), kind: 'home', clock: '2:05', apps: [{t: -1, badge: 4}, {t: -1, badge: 3}, {t: -1, badge: 5}]}], {x: 1400});
  label(c(s, 'across three apps'), c(s, 'two thousand'), '3 APPS', {x: 700, y: 520, size: 200});
  trk(twelve, st(12, 2340, 3, 'PAST DUE', undefined, true));
  stat(c(s, 'two thousand'), c(s, 'on stuff you mostly'), '$2,340', 'owed (HYPOTHETICAL)', {x: 700, w: 760, size: 170});
  shot(c(s, 'on stuff you mostly'), 'L02', [A('P07', 960, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  pop(c(s, "don't even remember"), crazy, 'jacket', 470, 760, 280); pop(c(s, 'remember buying'), crazy, 'controller', 1450, 760, 170);
  pop(c(s, 'remember buying') + 0.2, crazy, 'headphones', 1600, 450, 230); pop(c(s, 'remember buying') + 0.4, crazy, 'shopbag', 350, 430, 260);
  trk(crazy, null);
  shot(crazy, 'L02', [A('P07', 960, 1000, 740)], {fx: 'rewind', rwLabel: 'HOW IT STARTED', motion: 'out', nohud: true, sfx: 'scratch'});
  shot(c(s, 'it all started'), 'G:teal', [A('P09', 1620, 1040, 560)], {tr: 'flash'});
  pop(c(s, 'it all started'), c(s, "so here's what"), 'sneakers', 900, 470, 380);
  label(c(s, 'sixty dollar pair'), c(s, 'no interest'), '$60', {x: 900, y: 820, size: 170, col: '#fff'});
  sticker(c(s, 'no interest'), c(s, "so here's what"), '0% INTEREST', 420, 760, {col: '#7c4dff', size: 54});
  sticker(c(s, 'no credit check'), c(s, "so here's what"), 'NO CREDIT CHECK', 900, 860, {col: '#2f8cff', size: 54, rot: 5});
  sticker(c(s, 'four easy payments'), c(s, "so here's what"), '4 EASY PAYMENTS', 1340, 760, {col: '#ff4fa3', size: 54, rot: -4});
  shot(c(s, "so here's what"), 'G:navy', [A('P02', 960, 1040, 600)], {tr: 'whip', sfx: 'whoosh'});
  pop(c(s, "so here's what") + 0.3, c(s, 'which one was it'), 'sneakers', 380, 470, 230);
  pop(c(s, 'and this'), c(s, 'which one was it'), 'bills', 1540, 470, 260);
  pop(c(s, 'became a trap'), c(s, 'which one was it'), 'padlock', 960, 260, 300, {drop: true});
  shot(c(s, 'which one was it'), 'G:red', [A('P09', 960, 1040, 640)], {motion: 'punch', tr: 'zoom', sfx: 'riser'});
  label(c(s, 'which one was it'), back, 'WHICH ONE?', {y: 190, size: 170, col: 'rgb(255,90,100)'});
  shot(back, 'L02', [A('P13', 700, 1000, 740)], {fx: 'rewind', rwLabel: 'THE BEGINNING', motion: 'out', nohud: true, sfx: 'scratch'});
}
// title
S.push({t: T.titleT, kind: 'title', nohud: true}); SFX.push(['riser', T.titleT - 0.8, 0.4], ['thump', T.titleT + 0.3, 0.6], ['register', T.titleT + 0.9, 0.4], ['glass', T.titleT + 1.5, 0.5], ['whoosh', T.titleT + T.title - 0.25, 0.5]);

// level cards (shots inserted for each)
for (const k of T.cards) { S.push({t: k.t, kind: 'card', c: k, nohud: true}); SFX.push(['buzz', k.t + 0.3, 0.6], ['ding', k.t + 0.38, 0.35], ['thump', k.t + 0.66, 0.45], ['whoosh', k.t + k.dur - 0.25, 0.45]); }

// =====================================================================================================
// 1  LEVEL 1: one plan (sneakers)
{
  const s = 1; const k = after(s); const tap = c(s, 'tap'); const brain = c(s, 'your brain'); const sign = c(s, 'and signing up'); const first = c(s, 'the first fifteen');
  shot(k, 'L02', [A('P13', 560, 1000, 740)], {fx: 'night', focus: [0.35, 0.5]});
  phone(k - 0.1, brain, [{t: 0, kind: 'checkout', item: 'sneakers', title: 'Street sneakers', price: 60, clock: '11:47', marks: [[c(s, "there's a button"), 'button'], [c(s, 'zero percent'), 'small']]}], {kf: [[c(s, "there's a button"), 1380, 560, 980, -2]]});
  shot(c(s, "there's a button"), 'L02', [A('P09', 560, 1000, 740)], {fx: 'night', focus: [0.3, 0.5]});
  shot(brain, 'G:teal', [A('P09', 1640, 1040, 560)], {tr: 'whip', sfx: 'whoosh'});
  lay('swap', brain + 0.2, sign, {a: '$60', b: '$15', tB: c(s, 'only sees fifteen'), x: 700, y: 440}); sfx('wrong', c(s, 'only sees fifteen'), 0.3); sfx('ding', c(s, 'only sees fifteen') + 0.15, 0.35);
  pop(c(s, 'is a sandwich'), sign, 'sandwich', 1180, 800, 230); sfx('ding', c(s, 'is a sandwich'), 0.3);
  shot(sign, 'L02', [A('P13', 330, 1000, 700)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  phone(sign, first, [{t: 0, kind: 'checkout', item: 'sneakers', title: 'Street sneakers', price: 60, clock: '11:48', tOk: c(s, 'approved'), noOk: false}]);
  sticker(c(s, 'name'), first, 'NAME', 800, 300, {col: '#5e5ce6', size: 50, rot: -6}); sticker(c(s, 'phone number'), first, 'PHONE #', 820, 430, {col: '#5e5ce6', size: 50, rot: 4});
  sticker(c(s, 'debit card'), first, 'DEBIT CARD', 800, 560, {col: '#5e5ce6', size: 50, rot: -3}); sticker(c(s, 'no hard credit check'), first, 'NO HARD CREDIT CHECK', 820, 720, {col: '#2f8cff', size: 46, rot: 3});
  shot(c(s, 'approved'), 'L02', [A('P10', 330, 1000, 700)], {fx: 'night'}); sfx('ding', c(s, 'approved') + 0.25, 0.4);
  shot(first, 'G:navy', [A('P23', 1720, 1050, 520)], {tr: 'whip', sfx: 'whoosh'});
  lay('weeks', first, tap - 0.1, {plans: [{weeks: [0, 2, 4, 6], amt: 15, col: '#7c4dff', ts: [c(s, 'first fifteen') + 0.2, c(s, 'the other three') + 0.2, c(s, 'the other three') + 0.45, c(s, 'the other three') + 0.7]}], note: 'Pay in 4: every two weeks, straight from your card · HYPOTHETICAL'});
  pop(c(s, 'straight from your card'), tap - 0.1, 'card', 1480, 860, 150); label(c(s, 'feels like magic'), tap - 0.1, 'FEELS LIKE MAGIC', {y: 920, size: 90, col: '#d9b8ff'});
  shot(tap - 0.25, 'L02', [A('P05', 560, 1000, 740)], {fx: 'night', motion: 'punch', focus: [0.6, 0.5]});
  phone(tap - 0.25, c(s, 'and honestly'), [{t: 0, kind: 'checkout', item: 'sneakers', title: 'Street sneakers', price: 60, clock: '11:49', tTap: tap, noOk: true},
    {t: tap + 0.6, kind: 'plans', clock: '11:49', plans: [plan('sneakers', {tAdd: tap + 0.7, paid: 1, due: 'in 2 wks'})]}]);
  sfx('tap', tap, 0.7); combo(tap + 0.3, c(s, 'and honestly'), 1, {x: 980, y: 250}); trk(tap + 0.3, st(1, 45, 1, 'IN 2 WKS', 15));
  shot(c(s, 'and honestly'), 'L03', [A('P20', 760, 1010, 760)], {tr: 'whip', sfx: 'whoosh', focus: [0.45, 0.5]});
  sticker(c(s, 'zero interest'), c(s, 'plenty of people'), 'ON TIME = $0 EXTRA', 1420, 420, {col: UI.green, size: 60});
  shot(c(s, 'plenty of people'), 'L03', [A('P01', 760, 1010, 760)], {focus: [0.5, 0.5]});
  shot(c(s, "so who's paying"), 'G:teal', [A('P09', 960, 1040, 620)], {tr: 'zoom', sfx: 'whoosh'}); label(c(s, "so who's paying"), c(s, 'mostly the store'), 'WHO PAYS?', {y: 200, size: 150});
  shot(c(s, 'mostly the store'), 'G:navy', [], {tr: 'whip', sfx: 'whoosh'});
  lay('flow', c(s, 'mostly the store'), c(s, 'your friend jay'), {tYou: c(s, 'and stores are happy')});
  pop(c(s, 'buy more'), c(s, 'your friend jay'), 'shopbag', 1700, 830, 150); pop(c(s, 'buy bigger'), c(s, 'your friend jay'), 'shopbag', 1300, 800, 280);
  shot(c(s, 'your friend jay'), 'L05', [A('P06', 1500, 1010, 760)], {tr: 'whip', sfx: 'whoosh', focus: [0.6, 0.5]});
  chat(c(s, 'your friend jay'), c(s, "that's level one"), [[c(s, 'jay likes') + 0.2, 'jay', 'bro those sneakers are FIRE'], [c(s, 'likes the sneakers') + 0.5, 'jay', 'how much??'], [c(s, 'you like how easy'), 'you', '$15 lol', c(s, 'you like how easy') - 0.8]], {x: 560, y: 210});
  sfx('ding', c(s, 'jay likes') + 0.2, 0.3); sfx('ding', c(s, 'you like how easy'), 0.3);
  shot(c(s, "that's level one"), 'L02', [A('P20', 700, 1000, 760)], {fx: 'night', tr: 'fade'});
  receipt(c(s, "that's level one"), secEnd(s) + 0.3, [['PLANS', '1'], ['OWED', '$45']], {x: 1300});
}

// =====================================================================================================
// 2  LEVEL 2: two plans (the overlap)
{
  const s = 2; const k = after(s); const tapJ = c(s, 'four payments of thirty') + 1.0; const here = c(s, "but here's the thing"); const math = c(s, "let's actually do the math");
  shot(k, 'L05', [A('P16', 420, 1010, 740, {exit: [c(s, "there's a jacket") - 0.2, 'R']})], {focus: [0.4, 0.5]});
  shot(c(s, "there's a jacket"), 'L05', [A('P13', 560, 1010, 740)], {focus: [0.4, 0.5]});
  phone(k, here, [{t: 0, kind: 'lock', clock: '9:12', date: 'Friday', notes: [[k + 0.4, 'Back in stock', 'The jacket you liked is back', '#ff9f0a']], crack: 0},
    {t: c(s, "there's a jacket"), kind: 'checkout', item: 'jacket', title: 'Puffer jacket', price: 120, clock: '9:13', tTap: tapJ, noOk: true}], {buzz: [k + 0.4]});
  sfx('buzz', k + 0.4, 0.5); sfx('tap', tapJ, 0.7); combo(tapJ + 0.2, here, 2, {x: 980, y: 250}); trk(tapJ + 0.2, st(2, 135, 1, 'FRI', 45));
  shot(here, 'G:navy', [A('P08', 420, 1040, 620)], {tr: 'whip', sfx: 'whoosh'});
  phone(here, c(s, 'this is the first quiet'), [{t: 0, kind: 'plans', clock: '9:14', plans: [plan('sneakers', {paid: 1, due: 'FRI', hl: c(s, 'the sneakers')}), plan('jacket', {tAdd: here + 0.2, paid: 1, due: 'FRI'})]}], {x: 1250, h: 940});
  sticker(c(s, "aren't paid off yet"), c(s, 'this is the first quiet'), 'NOT PAID OFF', 1600, 330, {col: UI.red, size: 50, rot: 8});
  shot(c(s, 'this is the first quiet'), 'L04', [A('P14', 620, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  pop(c(s, 'a thing anymore'), c(s, 'fifteen here'), 'sneakers', 1400, 880, 200, {drop: true}); pop(c(s, 'a stack of things'), c(s, 'fifteen here'), 'jacket', 1400, 650, 280, {drop: true});
  label(c(s, 'a stack of things'), c(s, 'fifteen here'), 'A STACK', {x: 1400, y: 300, size: 140});
  shot(c(s, 'fifteen here'), 'G:teal', [A('P12', 960, 1040, 600)], {tr: 'zoom', sfx: 'whoosh'});
  sticker(c(s, 'fifteen here'), math, '$15', 520, 380, {col: '#7c4dff', size: 120}); sticker(c(s, 'thirty there'), math, '$30', 1400, 380, {col: '#ff8a00', size: 120, rot: 6});
  sticker(c(s, 'on friday'), math, 'FRIDAY: $45', 960, 180, {col: UI.red, size: 80, rot: -3});
  shot(math, 'G:navy', [A('P23', 1730, 1060, 470)], {tr: 'whip', sfx: 'whoosh'});
  const wk = [math + 0.6, math + 0.8, math + 1.0, math + 1.2];
  lay('weeks', math, c(s, "that's the quiet cost"), {plans: [{weeks: [0, 2, 4, 6], amt: 15, col: '#7c4dff', ts: wk}, {weeks: [2, 4, 6, 8], amt: 30, col: '#ff8a00', ts: wk.map((x) => x + c(s, 'eight payments') - math - 0.6)}],
    sums: [[0, 15, c(s, "some weeks it's fifteen")], [2, 45, c(s, 'forty five')], [4, 45, c(s, 'forty five') + 0.15], [6, 45, c(s, 'forty five') + 0.3], [8, 30, c(s, 'forty five') + 0.45]], note: '2 plans = 8 payments on 4 different days · HYPOTHETICAL'});
  sticker(c(s, 'picked for you'), c(s, "that's the quiet cost"), 'PICKED FOR YOU', 1100, 900, {col: UI.red, size: 54});
  shot(c(s, "that's the quiet cost"), 'L04', [A('P09', 620, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, "it's not the interest"), c(s, 'you still feel fine'), 'NOT THE INTEREST...', {x: 1250, y: 330, size: 100, col: '#fff'});
  label(c(s, 'spoken for'), c(s, 'you still feel fine'), 'YOUR NEXT PAYCHECKS', {x: 1250, y: 520, size: 110, col: 'rgb(255,90,100)'});
  pop(c(s, 'one small slice'), c(s, 'you still feel fine'), 'cash', 1250, 760, 200);
  shot(c(s, 'you still feel fine'), 'L04', [A('P20', 700, 1010, 760)], {tr: 'cut'});
  shot(c(s, 'mostly'), 'L04', [A('P21', 700, 1010, 760)], {motion: 'punch', focus: [0.35, 0.4]}); sfx('trombone', c(s, 'mostly'), 0.35);
  receipt(c(s, 'you still feel fine'), secEnd(s) + 0.3, [['PLANS', '2'], ['OWED', '$135']], {x: 1350});
}

// =====================================================================================================
// 3  LEVEL 3: four plans (the big sale)
{
  const s = 3; const k = after(s); const ev = c(s, 'everything', 1); const alone = c(s, "you're not alone"); const look = c(s, 'and look at how');
  shot(k, 'G:red', [A('P17', 1450, 1040, 560, {enter: 'R'})], {motion: 'punch', focus: [0.5, 0.5]}); sfx('riser', k, 0.35);
  label(k + 0.1, c(s, 'and everything'), 'HOLIDAY SALE', {x: 760, y: 440, size: 170, col: '#fff'});
  shot(c(s, 'and everything'), 'G:red', [], {tr: 'flash', hud: true});
  const t1 = ev + 0.25, t2 = ev + 1.45;
  phone(c(s, 'and everything'), alone, [{t: 0, kind: 'checkout', item: 'headphones', title: 'Wireless headphones', price: 200, clock: '1:03', tTap: t1, noOk: true, timer: {t0: k, secs: 8099}},
    {t: t1 + 0.55, kind: 'checkout', item: 'gamingchair', title: 'Gaming chair', price: 260, clock: '1:04', tTap: t2, noOk: true, timer: {t0: k, secs: 8030}}], {x: 1350, h: 980});
  sfx('tap', t1, 0.7); sfx('tap', t2, 0.7); combo(t1 + 0.1, t2 - 0.1, 3, {x: 640, y: 520}); combo(t2 + 0.1, alone, 4, {x: 640, y: 520});
  trk(t1 + 0.1, st(3, 335, 1, 'FRI', 45)); trk(t2 + 0.1, st(4, 500, 1, 'FRI', 63));
  shot(alone, 'G:navy', [A('P06', 1720, 1050, 480)], {tr: 'whip', sfx: 'whoosh'});
  label(alone + 0.1, c(s, 'twenty billion'), "YOU'RE NOT ALONE", {x: 820, y: 470, size: 140});
  stat(c(s, 'twenty billion'), c(s, 'and on cyber monday'), '$20 BILLION', 'spent online with BNPL in the 2025 holiday season', {x: 860, w: 1240});
  stat(c(s, 'and on cyber monday'), c(s, 'over eighty percent'), '$1.03 BILLION', 'on Cyber Monday 2025, the first $1B BNPL day', {x: 860, w: 1240});
  source(c(s, 'twenty billion'), c(s, 'over eighty percent'), 'Adobe Digital Insights, Jan 2026');
  shot(c(s, 'over eighty percent'), 'L02', [A('P13', 620, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh', focus: [0.35, 0.5]});
  stat(c(s, 'over eighty percent'), look, '82%', 'of holiday BNPL spend was on smartphones', {x: 1350, w: 860, size: 170});
  source(c(s, 'over eighty percent'), look, 'Adobe Digital Insights, Jan 2026');
  shot(c(s, 'just like you'), 'L02', [A('P13', 620, 1000, 740)], {fx: 'night', motion: 'punch', focus: [0.3, 0.35]}); sfx('ding', c(s, 'just like you'), 0.3);
  shot(look, 'G:navy', [A('P23', 420, 1050, 640)], {tr: 'zoom', sfx: 'whoosh'});
  phone(look, c(s, 'none of that'), [{t: 0, kind: 'checkout', item: 'gamingchair', title: 'Gaming chair', price: 260, clock: '1:04', timer: {t0: k, secs: 8030}, stock: 'Only 3 left!',
    marks: [[c(s, 'the pay later button'), 'button'], [c(s, 'countdown timer'), 'timer'], [c(s, 'only three left'), 'stock'], [c(s, 'the price in big letters'), 'small'], [c(s, 'tiny letters'), 'total']]}], {x: 1250, h: 1000, rot: 0});
  for (const w of ['the pay later button', 'countdown timer', 'only three left', 'the price in big letters', 'tiny letters']) sfx('marker', c(s, w), 0.5);
  shot(c(s, 'none of that'), 'G:teal', [A('P02', 1550, 1050, 620)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'none of that'), c(s, 'and it works best'), 'NOT AN ACCIDENT', {x: 760, y: 400, size: 140, col: 'rgb(255,90,100)'});
  label(c(s, 'the yes faster'), c(s, 'and it works best'), 'YES > THINKING', {x: 760, y: 620, size: 120});
  shot(c(s, 'and it works best'), 'G:navy', [A('P09', 1720, 1000, 560)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'and it works best') + 0.1, c(s, 'sixteen percent') - 0.7, 'IT WORKS BEST ON PEOPLE', {x: 760, y: 420, size: 110, col: '#fff'});
  label(c(s, 'who can least'), c(s, 'sixteen percent') - 0.7, 'WHO CAN LEAST AFFORD IT', {x: 760, y: 580, size: 120, col: 'rgb(255,90,100)'}); sfx('thump', c(s, 'who can least'), 0.4);
  lay('bars', c(s, 'sixteen percent') - 0.7, c(s, 'four plans now'), {title: 'Used BNPL in the past year', items: [['All adults', 16, 'rgb(230,199,119)', c(s, 'sixteen percent')], ['$25K to $50K', 23, 'rgb(230,80,90)', c(s, 'twenty five to fifty')], ['$100K+', 12, 'rgb(120,190,255)', c(s, 'over a hundred thousand')]], max: 25});
  source(c(s, "the fed's"), c(s, 'four plans now'), 'Federal Reserve, Economic Well-Being of U.S. Households in 2025 (May 2026)');
  shot(c(s, 'four plans now'), 'L02', [A('P13', 520, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  phone(c(s, 'four plans now'), c(s, "that's the trick"), [{t: 0, kind: 'plans', clock: '1:20', plans: [plan('sneakers', {paid: 2, due: 'FRI'}), plan('jacket', {paid: 1, due: 'FRI'}), plan('headphones', {paid: 1, due: 'TUE'}), plan('chair', {paid: 1, due: 'WED'})]}], {x: 1450});
  sticker(c(s, "i'm buying this"), c(s, "that's the trick"), '"I\'M BUYING THIS"', 900, 330, {col: '#5c6370', size: 52, rot: -4});
  sticker(c(s, "i'm only paying fifty"), c(s, "that's the trick"), '"ONLY $50 THIS WEEK"', 900, 520, {col: '#7c4dff', size: 52, rot: 3});
  shot(c(s, "that's the trick"), 'L02', [A('P11', 700, 1000, 760)], {fx: 'night', motion: 'punch', focus: [0.4, 0.4]});
  label(c(s, 'the total disappears'), secEnd(s) + 0.3, 'THE TOTAL DISAPPEARS', {x: 1100, y: 900, size: 110, col: 'rgb(255,90,100)'});
  receipt(c(s, 'all you ever see'), secEnd(s) + 0.3, [['PLANS', '4'], ['OWED', '$500']], {x: 1450});
}

// =====================================================================================================
// 4  LEVEL 4: seven plans, three apps
{
  const s = 4; const k = after(s); const sec = c(s, 'second one'), third = c(s, 'and then a third'), stack = c(s, 'loan stacking'), cfpb = c(s, 'when the consumer');
  shot(k, 'L04', [A('P13', 560, 1010, 740)], {focus: [0.4, 0.5]});
  phone(k, c(s, 'this has a name'), [{t: 0, kind: 'checkout', item: 'tv', title: '55" TV', price: 480, clock: '12:41', tTap: c(s, 'hit the limit') + 0.3, noOk: true, tNo: c(s, "won't approve")},
    {t: c(s, 'so you download'), kind: 'home', clock: '12:42', apps: [{t: -1}, {t: sec, pulse: sec}, {t: third, pulse: third}]}]);
  sfx('tap', c(s, 'hit the limit') + 0.3, 0.6); sfx('wrong', c(s, "won't approve"), 0.4);
  shot(c(s, "won't approve"), 'L04', [A('P08', 560, 1010, 740)], {motion: 'punch', focus: [0.3, 0.4]});
  shot(c(s, 'so you download'), 'L04', [A('P06', 560, 1010, 740)]);
  sfx('pop', sec, 0.5); sfx('pop', third, 0.5); combo(sec + 0.3, third, 5, {x: 980, y: 230}); combo(third + 0.3, stack, 6, {x: 980, y: 230});
  trk(sec + 0.3, st(5, 980, 2, 'TUE', 120)); trk(third + 0.3, st(6, 1640, 3, 'TUE', 195));
  shot(c(s, 'this has a name'), 'G:navy', [A('P03', 1600, 1050, 600)], {tr: 'whip', sfx: 'whoosh', hud: true});
  label(stack, cfpb, 'LOAN STACKING', {x: 800, y: 470, size: 190}); combo(stack + 0.2, cfpb, 7, {x: 800, y: 760}); trk(stack + 0.2, st(7, 1740, 3, 'TUE', 205));
  shot(cfpb, 'G:navy', [A('P23', 1740, 1060, 470)], {tr: 'zoom', sfx: 'whoosh'});
  label(cfpb + 0.1, c(s, 'sixty three percent'), 'THE CFPB STUDIED IT', {x: 820, y: 470, size: 120});
  stat(c(s, 'sixty three percent'), c(s, 'and a third'), '63%', 'of BNPL borrowers had more than one loan going at once', {x: 820, w: 1200});
  stat(c(s, 'and a third'), c(s, 'and getting approved'), '1 IN 3', 'borrowed from more than one BNPL company', {x: 820, w: 1200});
  stat(c(s, 'and getting approved'), c(s, 'which sounds generous'), '78%', 'of loan applications approved for subprime and deep subprime credit (2022)', {x: 820, w: 1200, col: UI.green});
  source(c(s, 'sixty three percent'), c(s, 'which sounds generous'), 'CFPB, Consumer Use of BNPL, Jan 2025 (2021–22 data)');
  for (let i = 0; i < 3; i++) sticker(c(s, 'seventy eight percent') + 1.6 + i * 0.25, c(s, 'which sounds generous'), 'APPROVED', 420 + i * 520, 900, {col: UI.green, size: 50, rot: -10 + i * 9});
  shot(c(s, 'which sounds generous'), 'L08', [A('P07', 520, 1010, 740), A('C04', 1420, 1010, 720)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'two very different things'), c(s, 'and notice the sofa'), 'APPROVED IS NOT AFFORDABLE', {y: 200, size: 96, col: '#fff'});
  shot(c(s, 'and notice the sofa'), 'G:teal', [A('P09', 420, 1050, 600)], {tr: 'whip', sfx: 'whoosh'});
  phone(c(s, 'and notice the sofa'), c(s, "now here's what"), [{t: 0, kind: 'checkout', item: 'sofa', title: '3-seat sofa', price: 900, n: 12, monthly: true, clock: '12:58', marks: [[c(s, 'monthly plan'), 'small']]}], {x: 1300, h: 980});
  sticker(c(s, 'charge interest'), c(s, "now here's what"), 'INTEREST MAY APPLY', 860, 360, {col: UI.red, size: 54, rot: -7});
  label(c(s, 'the zero percent'), c(s, "now here's what"), '"0%"?', {x: 820, y: 640, size: 170});
  shot(c(s, "now here's what"), 'G:navy', [A('P21', 430, 1050, 640)], {tr: 'whip', sfx: 'riser'});
  lay('pie', c(s, "now here's what") + 0.2, secEnd(s) + 0.3, {});
  label(c(s, 'app one'), c(s, 'and for a long time'), 'EACH APP SEES ONE SLICE', {x: 1350, y: 150, size: 80, col: '#fff'});
  sticker(c(s, 'credit report either'), c(s, 'some people call it'), 'NOT ON YOUR CREDIT REPORT', 1350, 960, {col: '#5c6370', size: 46});
  label(c(s, 'phantom debt'), secEnd(s) + 0.3, 'PHANTOM DEBT', {x: 1350, y: 960, size: 130, col: '#d9b8ff'}); sfx('wow', c(s, 'phantom debt'), 0.25);
  receipt(c(s, 'all in one place') - 1.0, secEnd(s) + 0.3, [['PLANS', '7'], ['APPS', '3'], ['OWED', '$1,740']], {x: 1700});
}

// =====================================================================================================
// 5  LEVEL 5: ten plans (the groceries)
{
  const s = 5; const k = after(s); const split = c(s, 'so you split'); const stop = c(s, 'stop for a second'); const upto = c(s, 'up to now'); const rem = c(s, 'remember this level');
  shot(k, 'L04', [A('P21', 560, 1010, 740)]);
  const names = ['the sneakers', 'the jacket', 'the headphones', 'the chair', 'the TV', 'the sofa']; const amts = [-15, -30, -50, -65, -120, -75]; const labs = ['Sneakers', 'Puffer jacket', 'Headphones', 'Gaming chair', 'TV', 'Sofa'];
  phone(k, split, [{t: 0, kind: 'bank', clock: '6:58', start: 400, hits: names.map((n, i) => [c(s, n), amts[i], labs[i]])}]);
  names.forEach((n) => sfx('coin', c(s, n), 0.35));
  shot(c(s, "there's not enough"), 'L04', [A('P08', 560, 1010, 740)], {motion: 'punch', focus: [0.3, 0.4]});
  shot(split, 'L03', [A('P13', 520, 1010, 740)], {tr: 'cut', motion: 'still'});
  phone(split, stop, [{t: 0, kind: 'checkout', item: 'groceries', title: 'Weekly groceries', price: 94, clock: '7:02', tTap: split + 1.2, noOk: true}], {x: 1350});
  sfx('tap', split + 1.2, 0.5); sfx('thump', split + 1.25, 0.6); trk(split + 1.3, st(10, 1830, 3, 'TUE', 251)); lay('combo', split + 1.3, stop, {n: 10, text: 'PLAN', x: 1080, y: 200});
  FREEZE.push([stop - 0.05, upto - 0.1]); sfx('scratch', stop - 0.1, 0.5); label(stop, upto - 0.1, 'STOP.', {live: true, y: 860, size: 220, col: 'rgb(255,80,90)'});
  shot(upto, 'G:teal', [], {tr: 'flash'});
  label(upto + 0.2, c(s, "groceries don't"), 'WANTS', {x: 520, y: 220, size: 150});
  pop(c(s, 'things you wanted'), c(s, "groceries don't"), 'sneakers', 380, 520, 200); pop(c(s, 'things you wanted') + 0.2, c(s, "groceries don't"), 'headphones', 660, 560, 230); pop(c(s, 'things you wanted') + 0.4, c(s, "groceries don't"), 'tv', 520, 820, 240);
  label(c(s, 'things you need'), c(s, "groceries don't"), 'NEEDS', {x: 1400, y: 220, size: 150, col: 'rgb(255,90,100)'});
  pop(c(s, 'things you need'), c(s, "groceries don't"), 'groceries', 1400, 640, 420);
  shot(c(s, "groceries don't"), 'L03', [A('P01', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  pop(c(s, "groceries don't"), c(s, 'four weeks later'), 'groceries', 1300, 760, 320);
  shot(c(s, 'four weeks later'), 'G:navy', [], {tr: 'whip', sfx: 'whoosh'});
  const fw = c(s, 'four weeks later');
  lay('weeks', fw, c(s, 'and this is not'), {plans: [{weeks: [0, 2, 4, 6], amt: 24, col: '#c0392b', ts: [fw + 0.3, fw + 0.5, fw + 0.7, fw + 0.9]}, {weeks: [2, 4, 6, 8], amt: 22, col: '#e67e22', ts: [c(s, 'on top of') + 0.0, c(s, 'on top of') + 0.2, c(s, 'on top of') + 0.4, c(s, 'on top of') + 0.6]}, {weeks: [4, 6, 8], amt: 23, col: '#f1c40f', ts: [c(s, 'this month'), c(s, 'this month') + 0.2, c(s, 'this month') + 0.4]}],
    note: 'Old meals stack on top of new ones · HYPOTHETICAL'});
  shot(c(s, 'and this is not'), 'G:navy', [A('P23', 1740, 1060, 470)], {tr: 'zoom', sfx: 'whoosh'});
  stat(c(s, 'and this is not') + 0.2, c(s, 'twenty nine percent'), '1 IN 5', 'BNPL users bought groceries or food delivery with it', {x: 820, w: 1200, col: 'rgb(255,90,100)'});
  stat(c(s, 'twenty nine percent'), rem, '29%', 'said BNPL was "the only way I could afford it"', {x: 820, w: 1200, col: 'rgb(255,90,100)'});
  source(c(s, 'one in five'), rem, 'Federal Reserve, Economic Well-Being of U.S. Households in 2025 (May 2026)');
  shot(rem, 'L03', [A('P01', 560, 1010, 740)], {tr: 'fade', motion: 'in', focus: [0.6, 0.5]});
  pop(rem, secEnd(s) + 0.3, 'fridge', 1250, 690, 560); sfx('crickets', rem + 0.3, 0.4);
  FREEZE.push([rem + 0.4, secEnd(s) + 0.2]); label(rem + 0.4, secEnd(s) + 0.2, 'REMEMBER THIS LEVEL.', {live: true, x: 1080, y: 200, size: 120});
  receipt(rem + 0.6, secEnd(s) + 0.4, [['PLANS', '10'], ['APPS', '3'], ['OWED', '$1,830'], ['FOOD', 'SPLIT', 'rgb(200,50,60)']], {x: 860});
}

// =====================================================================================================
// 6  RECAP
{
  const s = 6; const t0 = T.offs[s];
  shot(t0 - 0.2, 'G:navy', [], {tr: 'whip', sfx: 'whoosh', nohud: true});
  lay('lockrow', c(s, 'quick catch up'), c(s, 'so far'), {items: [[c(s, 'level one'), 1, '1 plan, totally fine', 0], [c(s, 'level two'), 2, 'plans overlapping', 0], [c(s, 'level three'), 3, 'price tags vanish', 0.05], [c(s, 'level four'), 4, '3 apps, no full view', 0.15], [c(s, 'level five'), 5, 'groceries split', 0.3]], hot: 4, tHot: c(s, 'level five')});
  ['level one', 'level two', 'level three', 'level four', 'level five'].forEach((w) => sfx('pop', c(s, w), 0.4));
  shot(c(s, 'so far'), 'L03', [A('P20', 760, 1010, 760)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, "haven't missed"), c(s, "that's about to change"), '0 MISSED PAYMENTS', {x: 1350, y: 300, size: 100, col: UI.green});
  shot(c(s, "that's about to change"), 'L03', [A('P21', 760, 1010, 760)], {motion: 'punch', focus: [0.4, 0.4], fx: 'night'}); sfx('riser', c(s, "that's about to change") - 0.6, 0.45);
  label(c(s, "that's about to change"), secEnd(s) + 0.4, "THAT'S ABOUT TO CHANGE", {x: 1180, y: 200, size: 100, col: 'rgb(255,90,100)'});
}

// =====================================================================================================
// 7  LEVEL 6: first late payment
{
  const s = 7; const k = after(s); const six = c(s, 'and at six'); const prob = c(s, 'the problem is'); const two = c(s, 'two things happen'); const ex = c(s, 'this is exactly');
  shot(k, 'L04', [A('P22', 560, 1010, 740)], {focus: [0.4, 0.5]});
  sticker(c(s, "it's a tuesday"), six, 'TUESDAY', 1350, 330, {col: '#5e5ce6', size: 90}); sticker(c(s, 'payday is friday'), six, 'PAYDAY: FRIDAY', 1350, 560, {col: '#c9a227', size: 70, rot: 5});
  const h0 = c(s, 'try to take') + 0.3;
  phone(six, prob, [{t: 0, kind: 'bank', clock: '6:00', start: 11, hits: [[h0, -45, 'Pay in 4 · Headphones'], [h0 + 0.45, -63, 'Pay in 4 · Chair'], [h0 + 0.9, -23.5, 'Pay in 4 · Groceries']]}]);
  shot(six, 'L04', [A('P22', 560, 1010, 740)], {motion: 'punch', focus: [0.35, 0.45]});
  [h0, h0 + 0.45, h0 + 0.9].forEach((x) => sfx('wrong', x, 0.35)); shot(h0 + 0.9, 'L04', [A('P08', 560, 1010, 740)], {motion: 'punch', focus: [0.3, 0.4]});
  trk(h0 + 0.9, st(10, 1830, 3, 'PAST DUE', undefined, true));
  shot(prob, 'G:navy', [A('P02', 1700, 1060, 470)], {tr: 'whip', sfx: 'whoosh'});
  lay('weeks', prob, two, {labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], plans: [{weeks: [1], label: '-$45', col: '#c0392b', ts: [c(s, 'whatever day')]}, {weeks: [1], label: '-$63', col: '#c0392b', ts: [c(s, 'whatever day') + 0.25]}, {weeks: [1], label: '-$24', col: '#c0392b', ts: [c(s, 'whatever day') + 0.5]}, {weeks: [4], label: 'PAYDAY', col: '#c9a227', ts: [prob + 0.6]}],
    note: 'Each plan charges on the day you bought · HYPOTHETICAL'});
  label(c(s, 'lands before'), two, 'TOO LATE', {x: 1200, y: 870, size: 110, col: 'rgb(255,90,100)'});
  shot(two, 'L04', [A('P11', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  phone(two, ex, [{t: 0, kind: 'bank', clock: '6:01', start: -120.5, hits: [[c(s, 'late fee') + 0.2, -7, 'Late fee', 'fee'], [c(s, 'overdraft fee') + 0.2, -34, 'Overdraft fee', 'fee']]}]);
  sticker(c(s, 'late fee'), ex, 'LATE FEE', 980, 330, {size: 80}); sticker(c(s, 'overdraft fee'), ex, 'OVERDRAFT FEE', 980, 560, {size: 80, rot: 6});
  hypo(c(s, 'late fee'), ex, {x: 980, y: 820});
  shot(ex, 'G:navy', [A('P23', 1740, 1060, 470)], {tr: 'zoom', sfx: 'whoosh'});
  stat(ex + 0.3, c(s, 'sixty four percent'), '26%', 'of BNPL users paid late in the past year', {x: 820, w: 1200, col: 'rgb(255,90,100)'});
  stat(c(s, 'sixty four percent'), c(s, 'and eleven percent'), '64%', 'of people who paid late were charged a fee', {x: 820, w: 1200, col: 'rgb(255,90,100)'});
  stat(c(s, 'and eleven percent'), c(s, 'and notice'), '11%', 'of all BNPL users got overdraft or NSF fees from a BNPL payment', {x: 820, w: 1200, col: 'rgb(255,90,100)'});
  source(c(s, 'a quarter'), c(s, 'and notice'), 'Federal Reserve, Economic Well-Being of U.S. Households in 2025 (May 2026)');
  shot(c(s, 'and notice'), 'G:teal', [A('P09', 1550, 1050, 600)], {tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'zero percent'), c(s, 'real life'), '"0%"*', {x: 760, y: 360, size: 220});
  label(c(s, 'only ever true'), c(s, 'real life'), '*IF EVERYTHING GOES PERFECTLY', {x: 760, y: 620, size: 66, col: '#fff'});
  shot(c(s, 'real life'), 'G:teal', [A('P07', 960, 1050, 640)], {motion: 'punch'}); sfx('trombone', c(s, 'real life') + 0.4, 0.35);
  receipt(c(s, 'real life'), secEnd(s) + 0.3, [['PLANS', '10'], ['OWED', '$1,830'], ['+ FEES', '$41', 'rgb(200,50,60)']], {x: 1450});
}

// =====================================================================================================
// 8  LEVEL 7: credit score
{
  const s = 8; const k = after(s); const ch = c(s, "that's changing"); const in25 = c(s, 'in twenty twenty five'); const patchy = c(s, "it's still patchy"); const always = c(s, 'and one thing'); const lower = c(s, 'and a lower credit');
  shot(k, 'L08', [A('P01', 520, 1010, 740), A('C04', 1420, 1010, 720)]);
  sticker(c(s, "don't really check"), ch, "DON'T REALLY CHECK", 965, 540, {col: '#5c6370', size: 44}); sticker(c(s, "don't really report"), ch, "DON'T REALLY REPORT", 965, 680, {col: '#5c6370', size: 44, rot: 5});
  shot(ch, 'L08', [A('P08', 520, 1010, 740), A('C04', 1420, 1010, 720)], {motion: 'punch', focus: [0.3, 0.4]}); label(ch, in25, "THAT'S CHANGING", {x: 1060, y: 200, size: 130, col: 'rgb(255,90,100)'}); sfx('thump', ch, 0.5);
  shot(in25, 'G:navy', [A('P09', 300, 1050, 560)], {tr: 'whip', sfx: 'whoosh'});
  const r0 = c(s, 'reporting all'); const cr = {t: 0, kind: 'credit', clock: '8:15', score: [[0, 705], [c(s, 'drag your credit score') + 0.3, 598]],
    rows: [[r0, 'Pay in 4 · Sneakers', 'REPORTED'], [r0 + 0.3, 'Pay in 4 · Jacket', 'REPORTED'], [r0 + 0.6, 'Pay in 4 · Headphones', 'REPORTED'], [r0 + 0.9, 'Monthly · Sofa', 'REPORTED'], [c(s, 'collections'), 'Collections', 'NEGATIVE', UI.red]]};
  phone(in25, patchy, [cr], {x: 1450, h: 980});
  label(c(s, 'two of the three'), patchy, '2 OF 3 BUREAUS', {x: 820, y: 330, size: 120});
  sticker(c(s, 'fico'), patchy, 'FICO SCORE 10 BNPL', 820, 560, {col: '#5e5ce6', size: 64});
  source(r0, patchy, 'Affirm press release (Mar 2025); FICO (Jun 2025)');
  shot(patchy, 'G:navy', [A('P09', 420, 1050, 620)], {tr: 'whip', sfx: 'whoosh'});
  lay('pie', patchy, always, {reveal: c(s, 'becoming visible')}); label(c(s, 'becoming visible'), always, 'NOW VISIBLE', {x: 1350, y: 150, size: 110, col: UI.green}); sfx('ding', c(s, 'becoming visible'), 0.4);
  shot(always, 'L08', [A('P21', 520, 1010, 740), A('C04', 1420, 1010, 720)], {tr: 'whip', sfx: 'whoosh'});
  phone(always, lower, [cr], {x: 1000, h: 880, rot: 3});
  sticker(c(s, 'collections'), lower, 'COLLECTIONS', 1500, 300, {size: 70, rot: 8}); sfx('wrong', c(s, 'drag your credit score') + 0.3, 0.4);
  shot(lower, 'G:navy', [], {tr: 'whip', sfx: 'whoosh'});
  lay('doors', lower, c(s, 'ten plans for'), {items: [[lower + 0.3, 'CAR LOAN', 'HIGHER RATE', c(s, 'car loan', 1) + 0.5], [c(s, 'apartment'), 'APARTMENT', 'BIGGER DEPOSIT', c(s, 'apartment') + 0.5], [c(s, 'landlord'), 'LANDLORD', 'DENIED', c(s, 'landlord') + 0.5]]});
  sfx('gavel', c(s, 'car loan', 1) + 0.5, 0.4); sfx('gavel', c(s, 'apartment') + 0.5, 0.4); sfx('gavel', c(s, 'landlord') + 0.5, 0.5);
  shot(c(s, 'ten plans for'), 'L08', [A('P08', 520, 1010, 740), A('C04', 1420, 1010, 720)], {tr: 'whip', sfx: 'whoosh'});
  sticker(c(s, 'the rest of your life') - 0.3, secEnd(s) + 0.3, 'DENIED', 1420, 640, {size: 100, rot: -10}); sfx('gavel', c(s, 'the rest of your life') - 0.3, 0.5);
  receipt(c(s, 'following you'), secEnd(s) + 0.3, [['PLANS', '10'], ['CREDIT', 'HIT', 'rgb(200,50,60)']], {x: 960});
}

// =====================================================================================================
// 9  LEVEL 8: paying debt with debt
{
  const s = 9; const k = after(s); const due = c(s, 'payment due'); const mom = c(s, 'this is the moment'); const lc = c(s, 'remember lifestyle creep');
  shot(k, 'L02', [A('P14', 700, 1010, 700)], {fx: 'night'});
  label(c(s, 'get creative'), due, 'GET CREATIVE', {x: 1350, y: 300, size: 130});
  shot(due, 'G:navy', [A('P21', 960, 1050, 600)], {tr: 'whip', sfx: 'whoosh'});
  lay('juggle', due, mom, {x: 960, y: 560, items: ['phone', 'card', 'coins', 'cash', 'groceries']});
  sticker(c(s, 'put it on your credit card'), mom, 'CREDIT CARD', 380, 300, {col: '#2f8cff', size: 60, rot: -8});
  sticker(c(s, 'new plan on app three'), mom, 'NEW PLAN', 1540, 300, {col: '#7c4dff', size: 60, rot: 6}); trk(c(s, 'new plan on app three'), st(12, 2340, 3, 'PAST DUE', undefined, true));
  sticker(c(s, 'borrow from jay'), mom, 'BORROW FROM JAY', 380, 760, {col: '#ff8a00', size: 56, rot: 5});
  sticker(c(s, 'another plan'), mom, 'ANOTHER PLAN', 1540, 760, {col: UI.red, size: 60, rot: -6});
  shot(mom, 'G:red', [A('P08', 1600, 1050, 560)], {tr: 'zoom', sfx: 'whoosh'});
  lay('swap', c(s, 'zero percent loan'), lc, {a: '0%', b: '$$$', tB: c(s, 'very expensive'), x: 700, y: 440}); sfx('register', c(s, 'very expensive'), 0.4);
  pop(c(s, 'that one does charge'), lc, 'card', 700, 820, 170); label(c(s, 'every month'), lc, 'INTEREST. EVERY MONTH.', {x: 700, y: 960, size: 70, col: '#fff'});
  shot(lc, 'L05', [A('P24', 560, 1010, 700)], {tr: 'whip', sfx: 'whoosh'});
  pop(lc, c(s, 'this is the same trap'), 'car', 1350, 820, 300); label(lc + 0.3, c(s, 'this is the same trap'), 'LIFESTYLE CREEP', {x: 1300, y: 300, size: 110});
  sticker(lc + 0.5, c(s, 'this is the same trap'), 'SIDE HUSTLE VIDEO', 1300, 490, {col: '#5e5ce6', size: 44});
  shot(c(s, 'this is the same trap'), 'L02', [A('P21', 560, 1000, 740)], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  label(c(s, 'just faster'), secEnd(s) + 0.3, 'SAME TRAP. FASTER.', {x: 1250, y: 190, size: 110, col: 'rgb(255,90,100)'});
  chat(c(s, 'and with more apps') - 0.6, secEnd(s) + 0.4, [[c(s, 'and with more apps'), 'jay', 'bro are u ok?'], [secEnd(s) - 0.2, 'you', 'yeah all good', secEnd(s) - 1.0]], {x: 980, y: 380});
  sfx('ding', c(s, 'and with more apps'), 0.3);
  receipt(c(s, 'just faster'), secEnd(s) + 0.3, [['PLANS', '12'], ['APPS', '3'], ['CARD', '1'], ['OWED', '$2,340']], {x: 300});
}

// =====================================================================================================
// 10  LEVEL 9: locked out
{
  const s = 10; const k = after(s); const next = c(s, "here's what usually"); const pl = c(s, 'the plans you already'); const worst = c(s, 'and honestly'); const tw = c(s, 'twelve plans'); const ok = c(s, 'okay');
  shot(k, 'L02', [A('P21', 560, 1000, 740)], {fx: 'night'});
  const notes = [[c(s, 'payment failed', 0), 'Payment failed', 'Your payment of $45 didn’t go through', UI.red], [c(s, 'payment failed', 1), 'Payment failed', 'Your payment of $63 didn’t go through', UI.red], [c(s, 'late fee'), 'Late fee added', 'A late fee was added to your plan', UI.amber]];
  phone(k, next, [{t: 0, kind: 'lock', clock: '2:00', date: 'Tuesday', notes, crack: 0.85, seed: 9}], {buzz: notes.map((n) => n[0])}); notes.forEach((n) => sfx('buzz', n[0] as number, 0.6));
  shot(next, 'L02', [A('P13', 560, 1000, 740)], {fx: 'night'});
  const lock = c(s, 'stop letting you');
  phone(next, pl, [{t: 0, kind: 'checkout', item: 'controller', title: 'Controller', price: 70, clock: '2:03', tLock: lock + 0.3}], {x: 1350, h: 960});
  pop(lock, pl, 'padlock', 1350, 640, 260, {drop: true}); sticker(c(s, "isn't anymore"), pl, 'LOCKED', 820, 300, {size: 90, rot: -8});
  shot(pl, 'L02', [A('P21', 520, 1000, 740), A('C01', 1500, 1000, 700, {enter: 'R', t: c(s, 'collections agency')})], {fx: 'night', tr: 'whip', sfx: 'whoosh'});
  sfx('door', c(s, 'collections agency'), 0.5); sticker(c(s, 'collections agency') + 0.4, worst, 'COLLECTIONS', 1500, 230, {size: 64, rot: 6});
  shot(c(s, "that's the version"), 'L02', [A('P08', 520, 1000, 740), A('C01', 1500, 1000, 700)], {fx: 'night', motion: 'punch', focus: [0.3, 0.4]});
  shot(worst, 'L02', [A('P15', 820, 1010, 560)], {fx: 'night', tr: 'fade', motion: 'in', za: 0.12, nohud: true});
  pop(c(s, 'flinching'), tw, 'phone', 1300, 930, 120, {rot: 80}); sfx('buzz', c(s, 'flinching') + 0.2, 0.6); sfx('buzz', c(s, 'phone buzzes') + 0.1, 0.6);
  chat(c(s, 'saying'), tw, [[c(s, 'yeah all good'), 'you', 'yeah, all good 👍'.replace(' 👍', ''), c(s, 'saying') + 0.2]], {x: 1150, y: 260});
  shot(tw, 'L02', [A('P15', 820, 1010, 560)], {fx: 'night', motion: 'in', za: 0.18, nohud: true});
  label(tw, ok, 'TWELVE PLANS.', {y: 200, size: 110, col: '#fff'}); label(c(s, 'sixty dollar sneakers'), ok, '$60 SNEAKERS.', {y: 340, size: 110});
  shot(ok, 'G:navy', [A('P09', 960, 1050, 620)], {tr: 'flash', nohud: true}); sfx('buzz', ok - 0.3, 0.5);
  label(c(s, 'how do we get out'), secEnd(s) + 0.4, 'HOW DO WE GET OUT?', {y: 200, size: 130});
}

// =====================================================================================================
// 11  LEVEL 10: zero plans (the way out)
{
  const s = 11; const k = after(s); const one = c(s, 'one see'); const two = c(s, 'two stop'); const three = c(s, 'three protect'); const four = c(s, 'four talk'); const av = c(s, 'and there are two'); const close = c(s, 'one by one'); const evil = c(s, "isn't evil"); const rules = c(s, 'so if you are going');
  shot(k, 'L03', [A('P02', 560, 1010, 740)]);
  shot(c(s, 'deep breath'), 'L03', [A('P01', 560, 1010, 740)]);
  shot(one, 'G:navy', [], {tr: 'whip', sfx: 'whoosh'});
  lay('steps', one, av, {items: [[one, 'See the whole stack'], [two, 'Stop adding'], [three, 'Protect the essentials'], [four, 'Talk to them']], x: 1010});
  [one, two, three, four].forEach((x) => sfx('ding', x, 0.4));
  phone(c(s, 'open every app'), two, [{t: 0, kind: 'plans', clock: '7:31', title: 'All plans, one list', plans: ALL12.map((kk, i) => plan(kk, {tAdd: c(s, 'open every app') + i * 0.12, paid: 1, due: i % 3 ? 'FRI' : 'TUE'})), apps: 3}], {x: 500, h: 960, rot: 2});
  phone(two, three, [{t: 0, kind: 'home', clock: '7:33', apps: [{t: -1}, {t: -1}, {t: -1}], trash: [c(s, 'delete the apps'), c(s, 'delete the apps') + 0.35, c(s, 'delete the apps') + 0.7]}], {x: 500, h: 960, rot: 2});
  sfx('paper', c(s, 'delete the apps'), 0.4); sfx('paper', c(s, 'delete the apps') + 0.35, 0.4); sfx('paper', c(s, 'delete the apps') + 0.7, 0.4);
  pop(c(s, 'rent'), four, 'house', 330, 330, 230); pop(c(s, 'utilities'), four, 'plant', 650, 420, 200); pop(c(s, 'food'), four, 'groceries', 470, 720, 300);
  shot(four, 'G:navy', [A('P13', 470, 1010, 720)], {tr: 'cut'});
  chat(four + 0.3, av, [[c(s, 'move a payment date'), 'you', 'Can we move my payment date?', four + 0.8]], {x: 690, y: 700});
  source(c(s, 'nonprofit credit counselor'), av, 'Not financial advice. If you’re struggling, look for a nonprofit credit counselor.');
  shot(av, 'G:navy', [], {tr: 'whip', sfx: 'whoosh'});
  lay('avsnow', av, c(s, 'the best one'), {tA: c(s, 'the avalanche'), tB: c(s, 'or the snowball')});
  shot(c(s, 'the best one'), 'G:teal', [A('P20', 960, 1050, 640)], {tr: 'zoom', sfx: 'whoosh'}); label(c(s, 'the best one') + 0.2, close, 'PICK ONE. STICK TO IT.', {y: 190, size: 100});
  shot(close, 'G:navy', [A('P10', 400, 1050, 560, {t: close + 3.2})], {tr: 'whip', sfx: 'whoosh', hud: true});
  const gone = (i: number) => close + 0.4 + i * 0.22;
  phone(close, evil, [{t: 0, kind: 'plans', clock: '7:40', title: 'Plans left', plans: ALL12.map((kk, i) => plan(kk, {paid: 3, due: 'paid', tGone: gone(i)})), apps: 3}], {x: 1350, h: 980});
  ALL12.forEach((_, i) => { sfx('ding', gone(i), 0.25); trk(gone(i) + 0.1, st(11 - i, Math.max(0, Math.round(2340 * (11 - i) / 12)), i < 8 ? 3 : 1, (11 - i) ? 'FRI' : undefined, undefined, false)); });
  label(gone(11) + 0.3, evil, 'ZERO PLANS', {x: 680, y: 330, size: 150, col: UI.green}); sfx('wow', gone(11) + 0.3, 0.35);
  shot(evil, 'L03', [A('P02', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  sticker(c(s, 'free little loan'), c(s, "it's the stack"), 'A FREE LITTLE LOAN', 1350, 360, {col: UI.green, size: 64});
  shot(c(s, "it's the stack"), 'L03', [A('P05', 560, 1010, 740)], {motion: 'punch', focus: [0.3, 0.4]});
  label(c(s, "it's the stack"), rules, "IT'S THE STACK.", {x: 1300, y: 260, size: 150, col: 'rgb(255,90,100)'}); pop(c(s, "it's the stack") + 0.3, rules, 'bills', 1300, 700, 300, {drop: true});
  shot(rules, 'G:teal', [A('P20', 400, 1050, 600)], {tr: 'whip', sfx: 'whoosh'});
  lay('steps', rules, secEnd(s) + 0.4, {title: 'SAFE-USE RULES', items: [[c(s, 'only use it if'), 'Only if you could pay in full today'], [c(s, 'one plan at a time'), 'One plan at a time. Never a stack.'], [c(s, 'and never for'), 'Never for food, bills or stuff that runs out']], x: 840});
  [c(s, 'only use it if'), c(s, 'one plan at a time'), c(s, 'and never for')].forEach((x) => sfx('ding', x, 0.4));
  pop(c(s, 'stuff you eat'), c(s, 'keep the lights'), 'fridge', 1700, 900, 260);
}

// =====================================================================================================
// 12  PAYOFF
{
  const s = 12; const t0 = T.offs[s]; const gro = c(s, 'it was the groceries'); const mom = c(s, 'the moment'); const ifever = c(s, 'if you ever'); const honest = c(s, 'so be honest'); const next = c(s, 'and if you want');
  shot(t0 - 0.3, 'G:navy', [], {tr: 'flash', nohud: true});
  lay('lockrow', t0, mom, {items: [[t0 + 0.1, 1, 'sneakers', 0], [t0 + 0.2, 2, 'jacket', 0], [t0 + 0.3, 3, 'sale', 0.05], [t0 + 0.4, 4, '3 apps', 0.15], [t0 + 0.5, 5, 'groceries', 0.3], [t0 + 0.6, 6, 'late', 0.42], [t0 + 0.7, 7, 'credit', 0.55], [t0 + 0.8, 8, 'debt for debt', 0.68], [t0 + 0.9, 9, 'locked', 0.85], [t0 + 1.0, 10, 'way out', 0]],
    hot: 4, tHot: gro, warm: []});
  sfx('pop', t0 + 0.1, 0.3);
  label(c(s, 'not the sneakers'), c(s, 'not the TV'), 'NOT THE SNEAKERS', {y: 900, size: 100, col: '#fff'}); label(c(s, 'not the TV'), gro, 'NOT THE TV OR SOFA', {y: 900, size: 100, col: '#fff'});
  sfx('thump', gro, 0.6); label(gro + 0.2, mom, 'THE GROCERIES', {y: 900, size: 130, col: 'rgb(255,90,100)'});
  shot(mom, 'G:teal', [], {tr: 'whip', sfx: 'whoosh'});
  lay('swap', mom + 0.2, c(s, 'because you can always'), {a: 'WANTS', b: 'NEEDS', tB: c(s, 'things you needed'), x: 760, y: 470, ax: 420, bx: 320});
  shot(c(s, 'because you can always'), 'L03', [A('P01', 560, 1010, 740)], {tr: 'whip', sfx: 'whoosh'});
  pop(c(s, 'stop buying sneakers'), ifever, 'sneakers', 1480, 450, 200); pop(c(s, "can't stop eating"), ifever, 'groceries', 1620, 720, 380);
  receipt(c(s, 'every week made'), honest - 0.3, [['SNEAKERS', '$60'], ['JACKET', '$120'], ['HEADPHONES', '$200'], ['CHAIR', '$260'], ['TV', '$480'], ['SOFA', '$900'], ['GROCERIES', '$94', 'rgb(200,50,60)'], ['GROCERIES', '$88', 'rgb(200,50,60)'], ['FOOD', '$46', 'rgb(200,50,60)'], ['FEES', '$41', 'rgb(200,50,60)']], {x: 1000, full: true, tear: c(s, 'warning light')});
  shot(ifever, 'L03', [A('P05', 560, 1010, 740)], {motion: 'punch', focus: [0.3, 0.4]});
  label(c(s, 'warning light'), honest, 'WARNING LIGHT', {x: 1350, y: 860, size: 120, col: 'rgb(255,90,100)'}); sfx('ding', c(s, 'warning light'), 0.4);
  shot(honest, 'G:purple', [A('P05', 1400, 1050, 680)], {tr: 'whip', sfx: 'whoosh'});
  chat(honest, next, [[honest + 0.3, 'jay', 'real talk tho...'], [c(s, 'how many'), 'jay', 'how many plans u got rn?']], {x: 160, y: 200});
  sticker(c(s, 'zero counts'), next, 'ZERO COUNTS', 600, 760, {col: UI.green, size: 70}); label(c(s, 'tell me in the comments'), next, 'COMMENT BELOW', {x: 600, y: 920, size: 90});
  shot(next, 'G:purple', [A('P03', 700, 1050, 680)], {tr: 'whip', sfx: 'whoosh'});
  label(next + 0.3, T.voEnd, 'SIDE HUSTLE: $0 TO $1M', {x: 1250, y: 300, size: 100});
}
S.push({t: T.voEnd, kind: 'end', nohud: true}); SFX.push(['whoosh', T.voEnd - 0.1, 0.4]);

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
