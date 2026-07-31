/* Proof and derivation puzzles for the Proof Builder and the Induction Builder.

   Each puzzle stores its steps IN ORDER. The game shuffles them, so the data
   is the answer key and the validator can assert that a puzzle is solvable in
   exactly `steps.length` moves.

   `traps` are plausible-but-wrong step cards mixed into the pool. They are
   what stops the mode being solvable by elimination once you have placed
   n - 1 cards.

   Induction puzzles additionally carry `phase` labels, which the Induction
   Builder uses to run its four-stage flow: base case, assumption, inductive
   step, conclusion. */
window.MQ = window.MQ || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.proofs = [

/* ── trigonometric identities ─────────────────────────────── */
{id:"pf-trig-1",topic:"MA-T1",kind:"identity",diff:2,
 title:"Prove tan^2 theta + 1 = sec^2 theta",
 goal:"Start from the Pythagorean identity and divide.",
 steps:[
   "sin^2 theta + cos^2 theta = 1",
   "Divide every term by cos^2 theta (valid where cos theta != 0)",
   "\\frac{sin^2 theta}{cos^2 theta} + \\frac{cos^2 theta}{cos^2 theta} = \\frac{1}{cos^2 theta}",
   "tan^2 theta + 1 = sec^2 theta"],
 traps:[
   "Divide every term by sin^2 theta",
   "sin^2 theta - cos^2 theta = 1",
   "tan^2 theta - 1 = sec^2 theta"]},

{id:"pf-trig-2",topic:"MA-T2",kind:"identity",diff:3,
 title:"Prove \\frac{sin 2x}{1 + cos 2x} = tan x",
 goal:"Expand both double angles, then cancel.",
 steps:[
   "sin 2x = 2 sin x cos x",
   "cos 2x = 2cos^2 x - 1, so 1 + cos 2x = 2cos^2 x",
   "\\frac{sin 2x}{1 + cos 2x} = \\frac{2 sin x cos x}{2cos^2 x}",
   "Cancel 2cos x to get \\frac{sin x}{cos x} = tan x"],
 traps:[
   "cos 2x = 1 - 2sin^2 x, so 1 + cos 2x = 2sin^2 x",
   "sin 2x = sin x cos x",
   "Cancel cos^2 x to get 2 sin x"]},

{id:"pf-trig-3",topic:"MA-T1",kind:"identity",diff:3,
 title:"Prove \\frac{1 - cos theta}{sin theta} = \\frac{sin theta}{1 + cos theta}",
 goal:"Cross-multiply and use the Pythagorean identity.",
 steps:[
   "Cross-multiply: show (1 - cos theta)(1 + cos theta) = sin^2 theta",
   "Expand the left side as a difference of two squares: 1 - cos^2 theta",
   "By the Pythagorean identity, 1 - cos^2 theta = sin^2 theta",
   "Both sides agree, so the original identity holds where the denominators are non-zero"],
 traps:[
   "Expand the left side to 1 - 2cos theta + cos^2 theta",
   "Add the two fractions over a common denominator",
   "By the Pythagorean identity, 1 - cos^2 theta = tan^2 theta"]},

{id:"pf-trig-4",topic:"ME-T2",kind:"identity",diff:3,
 title:"Derive cos 2A = 1 - 2sin^2 A",
 goal:"From the compound angle formula.",
 steps:[
   "cos 2A = cos(A + A) = cos A cos A - sin A sin A",
   "So cos 2A = cos^2 A - sin^2 A",
   "Substitute cos^2 A = 1 - sin^2 A",
   "cos 2A = (1 - sin^2 A) - sin^2 A = 1 - 2sin^2 A"],
 traps:[
   "cos 2A = cos A cos A + sin A sin A",
   "Substitute sin^2 A = 1 + cos^2 A",
   "cos 2A = 2cos^2 A - 1, which is the sine-only form"]},

/* ── calculus derivations ─────────────────────────────────── */
{id:"pf-calc-1",topic:"MA-C1",kind:"derivation",diff:3,
 title:"Differentiate f(x) = x^2 from first principles",
 goal:"Build the difference quotient and take the limit.",
 steps:[
   "f'(x) = \\lim_{h->0}\\frac{f(x+h) - f(x)}{h}",
   "= \\lim_{h->0}\\frac{(x+h)^2 - x^2}{h}",
   "= \\lim_{h->0}\\frac{x^2 + 2xh + h^2 - x^2}{h} = \\lim_{h->0}\\frac{2xh + h^2}{h}",
   "= \\lim_{h->0}(2x + h) = 2x"],
 traps:[
   "= \\lim_{h->0}\\frac{(x+h)^2 - x^2}{x}",
   "= \\lim_{h->0}\\frac{x^2 + h^2 - x^2}{h}",
   "Cancel h before expanding the bracket"]},

{id:"pf-calc-2",topic:"MA-C3",kind:"derivation",diff:3,
 title:"Optimisation: maximise the area of a rectangle with perimeter 40 m",
 goal:"Write the full solution the way a marker wants to see it.",
 steps:[
   "Let the sides be x and y, so 2x + 2y = 40 and y = 20 - x",
   "Area A = xy = x(20 - x) = 20x - x^2, for 0 < x < 20",
   "\\frac{dA}{dx} = 20 - 2x, which is zero when x = 10",
   "\\frac{d^2A}{dx^2} = -2 < 0, so x = 10 gives a maximum",
   "The maximum area is 10 \\times 10 = 100 m^2 (a square)"],
 traps:[
   "Area A = 2x + 2y = 40",
   "\\frac{dA}{dx} = 20 - x, which is zero when x = 20",
   "\\frac{d^2A}{dx^2} = 2 > 0, so this is a minimum"]},

{id:"pf-calc-3",topic:"MA-C4",kind:"derivation",diff:3,
 title:"Find the area enclosed between y = x^2 and y = 2x",
 goal:"Find the intersections, decide which curve is on top, then integrate.",
 steps:[
   "Solve x^2 = 2x, so x(x - 2) = 0 and the curves meet at x = 0 and x = 2",
   "On 0 < x < 2 test x = 1: the line gives 2, the parabola gives 1, so the line is above",
   "Area = int_0^{2}(2x - x^2) dx",
   "= [x^2 - \\frac{x^3}{3}]_0^{2} = 4 - \\frac{8}{3}",
   "= \\frac{4}{3} square units"],
 traps:[
   "Area = int_0^{2}(x^2 - 2x) dx",
   "Solve x^2 = 2x, so x = 2 is the only intersection",
   "= [x^2 - \\frac{x^3}{3}]_0^{2} = 4 + \\frac{8}{3}"]},

{id:"pf-calc-4",topic:"MA-C2",kind:"derivation",diff:3,
 title:"Find the tangent to y = x^3 - 2x at the point where x = 2",
 goal:"Gradient, point, then point-gradient form.",
 steps:[
   "When x = 2, y = 8 - 4 = 4, so the point is (2, 4)",
   "\\frac{dy}{dx} = 3x^2 - 2",
   "At x = 2 the gradient is 12 - 2 = 10",
   "y - 4 = 10(x - 2), so y = 10x - 16"],
 traps:[
   "\\frac{dy}{dx} = 3x^2 - 2x",
   "y - 2 = 10(x - 4), so y = 10x - 38",
   "The normal gradient is 10, so y = 10x - 16"]},

{id:"pf-calc-5",topic:"ME-C2",kind:"derivation",diff:3,
 title:"Evaluate int_0^{1}x e^{x^2} dx by substitution",
 goal:"Substitute, change the limits, integrate.",
 steps:[
   "Let u = x^2, so du = 2x dx and x dx = \\frac{1}{2}du",
   "Change the limits: x = 0 gives u = 0, and x = 1 gives u = 1",
   "The integral becomes \\frac{1}{2}int_0^{1}e^{u} du",
   "= \\frac{1}{2}[e^{u}]_0^{1} = \\frac{1}{2}(e - 1)"],
 traps:[
   "Let u = e^{x^2}, so du = 2x e^{x^2} dx",
   "The integral becomes 2int_0^{1}e^{u} du",
   "Keep the original limits 0 and 1 in x and substitute back at the end"]},

{id:"pf-calc-6",topic:"ME-C3",kind:"derivation",diff:3,
 title:"Find the volume when y = \\sqrt{x} is rotated about the x-axis from 0 to 4",
 goal:"Disc method.",
 steps:[
   "V = pi int_0^{4}y^2 dx",
   "y^2 = x, so V = pi int_0^{4}x dx",
   "= pi[\\frac{x^2}{2}]_0^{4}",
   "= pi(8 - 0) = 8pi cubic units"],
 traps:[
   "V = 2pi int_0^{4}y dx",
   "y^2 = \\sqrt{x}, so V = pi int_0^{4}\\sqrt{x} dx",
   "= pi[\\frac{x^2}{2}]_0^{4} = 16pi"]},

/* ── logs and exponentials ────────────────────────────────── */
{id:"pf-log-1",topic:"MA-E1",kind:"derivation",diff:3,
 title:"Solve log_2(x) + log_2(x - 2) = 3",
 goal:"Combine, solve, then check the domain.",
 steps:[
   "Combine using the log law: log_2(x(x-2)) = 3",
   "Convert to index form: x(x - 2) = 2^3 = 8",
   "x^2 - 2x - 8 = 0, so (x - 4)(x + 2) = 0 and x = 4 or x = -2",
   "Reject x = -2 because log_2(-2) is undefined; the solution is x = 4"],
 traps:[
   "Combine using the log law: log_2(2x - 2) = 3",
   "Convert to index form: x(x-2) = 3^2 = 9",
   "Both x = 4 and x = -2 are solutions"]},

{id:"pf-log-2",topic:"MA-E1",kind:"derivation",diff:3,
 title:"An investment doubles in 10 years. Find the continuous rate k.",
 goal:"Model, substitute, take logs.",
 steps:[
   "Model the value as P = P_0 e^{kt}",
   "Doubling means P = 2P_0 when t = 10, so 2P_0 = P_0 e^{10k}",
   "Divide by P_0 and take natural logs: ln 2 = 10k",
   "k = \\frac{ln 2}{10} ~= 0.0693, about 6.93% per annum"],
 traps:[
   "Doubling means P = 2P_0 when t = 2",
   "Divide by P_0 and take logs: ln 2 = k^{10}",
   "k = \\frac{10}{ln 2} ~= 14.4"]},

/* ══════════════════════════════════════════════════════════
   INDUCTION — the Induction Builder runs these in four phases.
   Induction is the hardest thing in Extension 1 to learn from a
   textbook and the easiest to drill interactively, which is exactly
   why it gets its own mode.
   ══════════════════════════════════════════════════════════ */

{id:"pf-ind-1",topic:"ME-P1",kind:"induction",diff:2,
 title:"Prove 1 + 2 + 3 + ... + n = \\frac{n(n+1)}{2} for all n >= 1",
 goal:"A series induction — the standard shape.",
 steps:[
   "BASE: for n = 1, LHS = 1 and RHS = \\frac{1(2)}{2} = 1, so the statement holds",
   "ASSUME: suppose 1 + 2 + ... + k = \\frac{k(k+1)}{2} for some integer k >= 1",
   "STEP: then 1 + 2 + ... + k + (k+1) = \\frac{k(k+1)}{2} + (k+1)",
   "= (k+1)(\\frac{k}{2} + 1) = \\frac{(k+1)(k+2)}{2}, which is the formula with n = k+1",
   "CONCLUDE: true for n = 1, and true for k implies true for k+1, so it holds for all n >= 1"],
 phases:["base","assume","step","step","conclude"],
 traps:[
   "BASE: for n = 0, LHS = 0 and RHS = 0",
   "ASSUME: suppose the result holds for n = k+1",
   "= \\frac{k(k+1)}{2} + k = \\frac{k(k+3)}{2}"]},

{id:"pf-ind-2",topic:"ME-P1",kind:"induction",diff:3,
 title:"Prove Sum_{r=1}^{n}r^2 = \\frac{n(n+1)(2n+1)}{6}",
 goal:"A series induction with heavier algebra in the step.",
 steps:[
   "BASE: for n = 1, LHS = 1 and RHS = \\frac{1(2)(3)}{6} = 1",
   "ASSUME: suppose Sum_{r=1}^{k}r^2 = \\frac{k(k+1)(2k+1)}{6}",
   "STEP: adding the next term gives \\frac{k(k+1)(2k+1)}{6} + (k+1)^2",
   "= \\frac{(k+1)[k(2k+1) + 6(k+1)]}{6} = \\frac{(k+1)(2k^2 + 7k + 6)}{6}",
   "= \\frac{(k+1)(k+2)(2k+3)}{6}, which is the formula with n = k+1",
   "CONCLUDE: by induction the formula holds for all integers n >= 1"],
 phases:["base","assume","step","step","step","conclude"],
 traps:[
   "STEP: adding the next term gives \\frac{k(k+1)(2k+1)}{6} + k^2",
   "= \\frac{(k+1)(2k^2 + 7k + 6)}{6} = \\frac{(k+1)(k+3)(2k+2)}{6}",
   "BASE: for n = 1, RHS = \\frac{1(2)(3)}{2} = 3"]},

{id:"pf-ind-3",topic:"ME-P1",kind:"induction",diff:3,
 title:"Prove 5^{n} - 1 is divisible by 4 for all n >= 1",
 goal:"A divisibility induction — manufacture the assumed multiple.",
 steps:[
   "BASE: for n = 1, 5^1 - 1 = 4, which is divisible by 4",
   "ASSUME: suppose 5^{k} - 1 = 4M for some integer M",
   "STEP: then 5^{k+1} - 1 = 5 \\times 5^{k} - 1 = 5(4M + 1) - 1",
   "= 20M + 5 - 1 = 20M + 4 = 4(5M + 1), a multiple of 4",
   "CONCLUDE: by induction 5^{n} - 1 is divisible by 4 for all n >= 1"],
 phases:["base","assume","step","step","conclude"],
 traps:[
   "STEP: then 5^{k+1} - 1 = 5^{k} - 1 + 5 = 4M + 5",
   "ASSUME: suppose 5^{k} - 1 = 4 for some integer",
   "= 20M + 4 = 2(10M + 2), a multiple of 2"]},

{id:"pf-ind-4",topic:"ME-P1",kind:"induction",diff:3,
 title:"Prove 3^{2n} - 1 is divisible by 8 for all n >= 1",
 goal:"Divisibility, with a base that is not simply the modulus.",
 steps:[
   "BASE: for n = 1, 3^2 - 1 = 8, which is divisible by 8",
   "ASSUME: suppose 3^{2k} - 1 = 8M for some integer M",
   "STEP: then 3^{2(k+1)} - 1 = 9 \\times 3^{2k} - 1 = 9(8M + 1) - 1",
   "= 72M + 9 - 1 = 72M + 8 = 8(9M + 1), a multiple of 8",
   "CONCLUDE: by induction 3^{2n} - 1 is divisible by 8 for all n >= 1"],
 phases:["base","assume","step","step","conclude"],
 traps:[
   "STEP: then 3^{2(k+1)} - 1 = 3 \\times 3^{2k} - 1 = 3(8M + 1) - 1",
   "= 72M + 8 = 4(18M + 2), a multiple of 4",
   "ASSUME: suppose 3^{2k} = 8M"]},

{id:"pf-ind-5",topic:"ME-P1",kind:"induction",diff:3,
 title:"Prove 2^{n} > n^2 for all integers n >= 5",
 goal:"An inequality induction — the step needs a second bounding argument.",
 steps:[
   "BASE: for n = 5, 2^5 = 32 and 5^2 = 25, so 32 > 25 holds",
   "ASSUME: suppose 2^{k} > k^2 for some integer k >= 5",
   "STEP: then 2^{k+1} = 2 \\times 2^{k} > 2k^2",
   "It remains to show 2k^2 >= (k+1)^2, i.e. k^2 - 2k - 1 >= 0, which holds for k >= 5",
   "So 2^{k+1} > (k+1)^2",
   "CONCLUDE: by induction 2^{n} > n^2 for all n >= 5"],
 phases:["base","assume","step","step","step","conclude"],
 traps:[
   "BASE: for n = 1, 2 > 1 so the statement holds",
   "STEP: then 2^{k+1} = 2^{k} + 2 > k^2 + 2",
   "It remains to show 2k^2 <= (k+1)^2"]},

{id:"pf-ind-6",topic:"ME-P1",kind:"induction",diff:3,
 title:"Prove Sum_{r=1}^{n}\\frac{1}{r(r+1)} = \\frac{n}{n+1}",
 goal:"A telescoping series, proved by induction.",
 steps:[
   "BASE: for n = 1, LHS = \\frac{1}{1 \\times 2} = \\frac{1}{2} and RHS = \\frac{1}{2}",
   "ASSUME: suppose the sum to k terms is \\frac{k}{k+1}",
   "STEP: adding the next term gives \\frac{k}{k+1} + \\frac{1}{(k+1)(k+2)}",
   "= \\frac{k(k+2) + 1}{(k+1)(k+2)} = \\frac{(k+1)^2}{(k+1)(k+2)} = \\frac{k+1}{k+2}",
   "CONCLUDE: this is the formula with n = k+1, so by induction it holds for all n >= 1"],
 phases:["base","assume","step","step","conclude"],
 traps:[
   "STEP: adding the next term gives \\frac{k}{k+1} + \\frac{1}{k(k+1)}",
   "= \\frac{k(k+2) + 1}{(k+1)(k+2)} = \\frac{k^2 + 2k + 1}{k+2}",
   "BASE: for n = 1, LHS = 1 and RHS = \\frac{1}{2}"]},

{id:"pf-ind-7",topic:"ME-P1",kind:"induction",diff:3,
 title:"Prove n^3 - n is divisible by 6 for all n >= 1",
 goal:"Divisibility where the leftover term needs its own argument.",
 steps:[
   "BASE: for n = 1, 1 - 1 = 0, which is divisible by 6",
   "ASSUME: suppose k^3 - k = 6M for some integer M",
   "STEP: then (k+1)^3 - (k+1) = k^3 + 3k^2 + 3k + 1 - k - 1",
   "= (k^3 - k) + 3k^2 + 3k = 6M + 3k(k+1)",
   "k(k+1) is a product of consecutive integers, so it is even and 3k(k+1) is divisible by 6",
   "CONCLUDE: the total is divisible by 6, so by induction the result holds for all n >= 1"],
 phases:["base","assume","step","step","step","conclude"],
 traps:[
   "= (k^3 - k) + 3k^2 + 3k + 2 = 6M + 3k(k+1) + 2",
   "3k(k+1) is divisible by 3, which is enough",
   "STEP: then (k+1)^3 - (k+1) = k^3 + 1 - k - 1"]},

{id:"pf-ind-8",topic:"ME-P1",kind:"induction",diff:3,
 title:"Prove Prod_{r=2}^{n}(1 - \\frac{1}{r^2}) = \\frac{n+1}{2n} for n >= 2",
 goal:"A product induction.",
 steps:[
   "BASE: for n = 2, LHS = 1 - \\frac{1}{4} = \\frac{3}{4} and RHS = \\frac{3}{4}",
   "ASSUME: suppose the product to k factors is \\frac{k+1}{2k}",
   "STEP: multiplying by the next factor gives \\frac{k+1}{2k}(1 - \\frac{1}{(k+1)^2})",
   "= \\frac{k+1}{2k} \\times \\frac{(k+1)^2 - 1}{(k+1)^2} = \\frac{k+1}{2k} \\times \\frac{k(k+2)}{(k+1)^2}",
   "= \\frac{k+2}{2(k+1)}, which is the formula with n = k+1",
   "CONCLUDE: by induction the product formula holds for all n >= 2"],
 phases:["base","assume","step","step","step","conclude"],
 traps:[
   "BASE: for n = 1, LHS = 1 and RHS = 1",
   "STEP: multiplying by the next factor gives \\frac{k+1}{2k} + (1 - \\frac{1}{(k+1)^2})",
   "= \\frac{k+1}{2k} \\times \\frac{(k+1)^2 + 1}{(k+1)^2}"]}
];

/* Tier-aware access, mirroring Bank.all() and MQ.Cards.all(). */
MQ.Proofs = (function () {
  let cached = null;
  const all = () => (cached || (cached = MQ.DATA.proofs.filter(p => MQ.DATA.tierEnabled(p.topic))));
  const byId = id => all().find(p => p.id === id);
  const inductions = () => all().filter(p => p.kind === "induction");
  const general = () => all().filter(p => p.kind !== "induction");
  return { all, byId, inductions, general };
})();
