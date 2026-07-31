/* The Reference Library — a searchable formula sheet mirroring the NESA
   reference sheet, plus the tables that sheet leaves out (exact values, the
   unit circle, the standard normal table).

   Reading reference material earns nothing. That is deliberate: it should be
   the thing you reach for when stuck, not another XP faucet. */
window.MQ = window.MQ || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.reference = [

{id:"ref-exact",tier:"MA",icon:"📐",title:"Exact trigonometric values",
 blurb:"The two special triangles, in radians and degrees.",
 cols:["theta","sin theta","cos theta","tan theta"],
 rows:[
   ["0",           "0",                  "1",                  "0"],
   ["\\frac{pi}{6} (30 deg)","\\frac{1}{2}","\\frac{\\sqrt{3}}{2}","\\frac{1}{\\sqrt{3}}"],
   ["\\frac{pi}{4} (45 deg)","\\frac{1}{\\sqrt{2}}","\\frac{1}{\\sqrt{2}}","1"],
   ["\\frac{pi}{3} (60 deg)","\\frac{\\sqrt{3}}{2}","\\frac{1}{2}","\\sqrt{3}"],
   ["\\frac{pi}{2} (90 deg)","1",         "0",                  "undefined"],
   ["pi (180 deg)","0",                   "-1",                 "0"],
   ["\\frac{3pi}{2} (270 deg)","-1",      "0",                  "undefined"]],
 note:"The 30-60-90 triangle has sides 1, \\sqrt{3}, 2. The 45-45-90 triangle has sides 1, 1, \\sqrt{2}."},

{id:"ref-quadrants",tier:"MA",icon:"🧭",title:"The unit circle and related angles",
 blurb:"Which functions are positive where, and how to reduce any angle.",
 cols:["Quadrant","Angle range","Positive","Related angle"],
 rows:[
   ["1st","0 to \\frac{pi}{2}","All","theta"],
   ["2nd","\\frac{pi}{2} to pi","Sine","pi - theta"],
   ["3rd","pi to \\frac{3pi}{2}","Tangent","theta - pi"],
   ["4th","\\frac{3pi}{2} to 2pi","Cosine","2pi - theta"]],
 note:"Reduce to the related acute angle, evaluate it, then attach the sign for the quadrant."},

{id:"ref-derivs",tier:"MA",icon:"📉",title:"Derivatives",
 blurb:"Everything you may need to differentiate in Advanced.",
 cols:["f(x)","f'(x)"],
 rows:[
   ["x^n","nx^{n-1}"],
   ["e^{x}","e^{x}"],
   ["e^{f(x)}","f'(x)e^{f(x)}"],
   ["ln x","\\frac{1}{x}"],
   ["ln f(x)","\\frac{f'(x)}{f(x)}"],
   ["a^{x}","a^{x}ln a"],
   ["sin x","cos x"],
   ["cos x","-sin x"],
   ["tan x","sec^2 x"],
   ["uv","u'v + uv'"],
   ["\\frac{u}{v}","\\frac{u'v - uv'}{v^2}"],
   ["f(g(x))","f'(g(x))g'(x)"]],
 note:"Every chain-rule result is the outer derivative times the inner derivative — nothing else."},

{id:"ref-integrals",tier:"MA",icon:"📈",title:"Integrals",
 blurb:"The standard antiderivatives. Add + c to every indefinite one.",
 cols:["f(x)","int f(x) dx"],
 rows:[
   ["x^n (n != -1)","\\frac{x^{n+1}}{n+1}"],
   ["(ax+b)^n","\\frac{(ax+b)^{n+1}}{a(n+1)}"],
   ["\\frac{1}{x}","ln|x|"],
   ["\\frac{f'(x)}{f(x)}","ln|f(x)|"],
   ["e^{ax}","\\frac{1}{a}e^{ax}"],
   ["a^{x}","\\frac{a^{x}}{ln a}"],
   ["sin ax","-\\frac{1}{a}cos ax"],
   ["cos ax","\\frac{1}{a}sin ax"],
   ["sec^2 ax","\\frac{1}{a}tan ax"]],
 note:"Any antiderivative can be checked by differentiating it. Do that whenever you are unsure."},

{id:"ref-logs",tier:"MA",icon:"🔟",title:"Index and logarithm laws",
 blurb:"The two sets are the same laws, read in opposite directions.",
 cols:["Index law","Logarithm law"],
 rows:[
   ["a^m a^n = a^{m+n}","log(xy) = log x + log y"],
   ["\\frac{a^m}{a^n} = a^{m-n}","log\\frac{x}{y} = log x - log y"],
   ["(a^m)^n = a^{mn}","log x^n = n log x"],
   ["a^0 = 1","log_a 1 = 0"],
   ["a^1 = a","log_a a = 1"],
   ["a^{-n} = \\frac{1}{a^n}","log\\frac{1}{x} = -log x"],
   ["a^{\\frac{m}{n}} = \\sqrt[n]{a^m}","log_b a = \\frac{ln a}{ln b}"]],
 note:"log x is undefined for x <= 0 — always check solutions of log equations back in the original."},

{id:"ref-finance",tier:"MA",icon:"💰",title:"Sequences, series and finance",
 blurb:"Everything in MA-M1 on one screen.",
 cols:["Quantity","Formula"],
 rows:[
   ["AP: nth term","T_n = a + (n-1)d"],
   ["AP: sum","S_n = \\frac{n}{2}(2a + (n-1)d) = \\frac{n}{2}(a+l)"],
   ["GP: nth term","T_n = ar^{n-1}"],
   ["GP: sum","S_n = \\frac{a(r^n - 1)}{r - 1}"],
   ["GP: limiting sum (|r| < 1)","S_inf = \\frac{a}{1-r}"],
   ["Compound interest","A = P(1+r)^n"],
   ["Future value of an annuity","FV = M\\frac{(1+r)^n - 1}{r}"],
   ["Present value of an annuity","PV = M\\frac{1 - (1+r)^{-n}}{r}"],
   ["Reducing-balance loan","A_n = A_{n-1}(1+r) - M"]],
 note:"r is the rate PER PERIOD. Monthly compounding at 12% p.a. means r = 0.01, not 0.12."},

{id:"ref-stats",tier:"MA",icon:"📊",title:"Statistics and probability",
 blurb:"Rules, random variables and the normal distribution.",
 cols:["Quantity","Formula"],
 rows:[
   ["Addition rule","P(A U B) = P(A) + P(B) - P(A n B)"],
   ["Conditional probability","P(A|B) = \\frac{P(A n B)}{P(B)}"],
   ["Independence test","P(A n B) = P(A)P(B)"],
   ["Expected value","E(X) = Sum x P(X = x)"],
   ["Variance","Var(X) = E(X^2) - [E(X)]^2"],
   ["Linear transform","E(aX+b) = aE(X)+b, Var(aX+b) = a^2 Var(X)"],
   ["z-score","z = \\frac{x - mu}{sigma}"],
   ["Empirical rule","68% / 95% / 99.7% within 1, 2, 3 sd"],
   ["Least-squares line","passes through (\\bar{x}, \\bar{y})"]],
 note:"The empirical rule is enough for almost every Advanced normal-distribution question."},

{id:"ref-normal",tier:"MA",icon:"🔔",title:"Standard normal table",
 blurb:"P(Z < z) for the standard normal distribution.",
 cols:["z","P(Z < z)","z","P(Z < z)"],
 rows:[
   ["-3.0","0.0013","0.0","0.5000"],
   ["-2.5","0.0062","0.5","0.6915"],
   ["-2.0","0.0228","1.0","0.8413"],
   ["-1.5","0.0668","1.5","0.9332"],
   ["-1.0","0.1587","2.0","0.9772"],
   ["-0.5","0.3085","2.5","0.9938"],
   ["-0.25","0.4013","3.0","0.9987"]],
 note:"By symmetry, P(Z < -a) = 1 - P(Z < a). For an upper tail, subtract from 1."},

{id:"ref-funcs",tier:"MA",icon:"🪞",title:"Functions and transformations",
 blurb:"Reading a transformed function off its rule.",
 cols:["Rule","Effect on y = f(x)"],
 rows:[
   ["y = f(x) + k","Shift k up"],
   ["y = f(x - h)","Shift h right"],
   ["y = af(x)","Stretch vertically by a"],
   ["y = f(bx)","Compress horizontally by b"],
   ["y = -f(x)","Reflect in the x-axis"],
   ["y = f(-x)","Reflect in the y-axis"],
   ["y = f^{-1}(x)","Reflect in the line y = x"],
   ["y = |f(x)|","Reflect the parts below the x-axis upwards"]],
 note:"Changes INSIDE the bracket act on x and behave opposite to the sign; changes outside act on y and behave as written."},

{id:"ref-quadratic",tier:"MA",icon:"⚖️",title:"Quadratics and the discriminant",
 blurb:"Roots, sums, products and the shape of the parabola.",
 cols:["Quantity","Result"],
 rows:[
   ["Quadratic formula","x = \\frac{-b +- \\sqrt{b^2-4ac}}{2a}"],
   ["Discriminant","\\Delta = b^2 - 4ac"],
   ["\\Delta > 0","Two distinct real roots"],
   ["\\Delta = 0","One repeated root; the axis touches"],
   ["\\Delta < 0","No real roots"],
   ["Sum of roots","alpha + beta = -\\frac{b}{a}"],
   ["Product of roots","alpha beta = \\frac{c}{a}"],
   ["Axis of symmetry","x = -\\frac{b}{2a}"]],
 note:"Completing the square gives the vertex directly: a(x-h)^2 + k has vertex (h, k)."},

/* ══════════ Extension 1 sheets ══════════ */

{id:"ref-invtrig",tier:"ME",icon:"↩️",title:"Inverse trigonometric functions",
 blurb:"Domains, ranges and calculus. The ranges are the whole topic.",
 cols:["Function","Domain","Range","Derivative"],
 rows:[
   ["sin^{-1}x","[-1, 1]","[-\\frac{pi}{2}, \\frac{pi}{2}]","\\frac{1}{\\sqrt{1-x^2}}"],
   ["cos^{-1}x","[-1, 1]","[0, pi]","\\frac{-1}{\\sqrt{1-x^2}}"],
   ["tan^{-1}x","all real x","(-\\frac{pi}{2}, \\frac{pi}{2})","\\frac{1}{1+x^2}"]],
 note:"sin^{-1}x + cos^{-1}x = \\frac{pi}{2}. int\\frac{dx}{\\sqrt{a^2-x^2}} = sin^{-1}\\frac{x}{a}, and int\\frac{dx}{a^2+x^2} = \\frac{1}{a}tan^{-1}\\frac{x}{a}."},

{id:"ref-identities",tier:"ME",icon:"🔁",title:"Further trigonometric identities",
 blurb:"Compound angles, double angles, t-formulae and auxiliary angle.",
 cols:["Identity","Expansion"],
 rows:[
   ["sin(A+-B)","sin A cos B +- cos A sin B"],
   ["cos(A+-B)","cos A cos B -+ sin A sin B"],
   ["tan(A+-B)","\\frac{tan A +- tan B}{1 -+ tan A tan B}"],
   ["sin 2A","2 sin A cos A"],
   ["cos 2A","cos^2 A - sin^2 A = 2cos^2 A - 1 = 1 - 2sin^2 A"],
   ["tan 2A","\\frac{2tan A}{1 - tan^2 A}"],
   ["sin x (t-formula)","\\frac{2t}{1+t^2}, t = tan\\frac{x}{2}"],
   ["cos x (t-formula)","\\frac{1-t^2}{1+t^2}"],
   ["tan x (t-formula)","\\frac{2t}{1-t^2}"],
   ["a sin x + b cos x","Rsin(x+alpha), R = \\sqrt{a^2+b^2}, tan alpha = \\frac{b}{a}"],
   ["sin^2 x","\\frac{1 - cos 2x}{2}"],
   ["cos^2 x","\\frac{1 + cos 2x}{2}"]],
 note:"The last two are not identities you memorise for their own sake — they are how you integrate sin^2 and cos^2."},

{id:"ref-comb",tier:"ME",icon:"🎲",title:"Combinatorics",
 blurb:"Counting, the binomial theorem and Pascal's triangle.",
 cols:["Quantity","Formula"],
 rows:[
   ["Permutations","nPr(n,r) = \\frac{n!}{(n-r)!}"],
   ["Combinations","nCr(n,r) = \\frac{n!}{r!(n-r)!}"],
   ["Symmetry","nCr(n,r) = nCr(n,n-r)"],
   ["Pascal's identity","nCr(n,k) = nCr(n-1,k-1) + nCr(n-1,k)"],
   ["Circular arrangements","(n-1)!"],
   ["With repeated items","\\frac{n!}{p!q!...}"],
   ["Binomial theorem","(a+b)^n = Sum nCr(n,k)a^{n-k}b^{k}"],
   ["Sum of coefficients","Sum nCr(n,k) = 2^n"]],
 note:"Pigeonhole: n+1 objects in n containers force at least one container to hold two."},

{id:"ref-vectors",tier:"ME",icon:"➡️",title:"Vectors and projectiles",
 blurb:"Components, the dot product, projection and projectile motion.",
 cols:["Quantity","Formula"],
 rows:[
   ["Magnitude","|\\vec{u}| = \\sqrt{x^2+y^2}"],
   ["Unit vector","\\hat{u} = \\frac{\\vec{u}}{|\\vec{u}|}"],
   ["Dot product (components)","u_1v_1 + u_2v_2"],
   ["Dot product (angle)","|\\vec{u}||\\vec{v}|cos theta"],
   ["Perpendicular test","\\vec{u} \\cdot \\vec{v} = 0"],
   ["Scalar projection","\\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{v}|}"],
   ["Vector projection","\\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{v}|^2}\\vec{v}"],
   ["Projectile: x(t)","Vt cos theta"],
   ["Projectile: y(t)","Vt sin theta - \\frac{1}{2}gt^2"],
   ["Time of flight","\\frac{2V sin theta}{g}"],
   ["Range","\\frac{V^2 sin 2theta}{g}"],
   ["Maximum height","\\frac{V^2 sin^2 theta}{2g}"]],
 note:"Horizontal velocity is constant throughout; only the vertical component is affected by gravity."},

{id:"ref-polynomials",tier:"ME",icon:"🧮",title:"Polynomials",
 blurb:"Remainder, factor, roots and coefficients.",
 cols:["Result","Statement"],
 rows:[
   ["Remainder theorem","P(x) \\div (x-a) leaves remainder P(a)"],
   ["Factor theorem","(x-a) is a factor exactly when P(a) = 0"],
   ["Double root","P(a) = 0 and P'(a) = 0"],
   ["Quadratic: sum, product","-\\frac{b}{a}, \\frac{c}{a}"],
   ["Cubic: sum of roots","-\\frac{b}{a}"],
   ["Cubic: sum of pairs","\\frac{c}{a}"],
   ["Cubic: product of roots","-\\frac{d}{a}"],
   ["Quartic: product of roots","\\frac{e}{a}"]],
 note:"The signs alternate: the product of the roots is (-1)^n times the constant over the leading coefficient."},

{id:"ref-induction",tier:"ME",icon:"🪜",title:"Proof by induction",
 blurb:"The template, and what each part is actually for.",
 cols:["Step","What to write"],
 rows:[
   ["1. Base case","Verify the statement for the smallest n. Show BOTH sides."],
   ["2. Assumption","\"Assume the result holds for n = k, for some integer k >= (base).\""],
   ["3. Statement of target","Write out what n = k+1 requires, so you know what you are aiming at."],
   ["4. Inductive step","Start from n = k+1 and USE the assumption. Series: add the (k+1)th term. Divisibility: manufacture the assumed multiple as a factor."],
   ["5. Conclusion","\"True for n = base, and true for k implies true for k+1, so true for all n >= base by induction.\""]],
 note:"Without the base case, the implication proves nothing: n = n+1 implies n+1 = n+2, yet no integer satisfies it."},

{id:"ref-binomialdist",tier:"ME",icon:"🎯",title:"The binomial distribution",
 blurb:"Bernoulli trials, probabilities and the normal approximation.",
 cols:["Quantity","Formula"],
 rows:[
   ["P(X = k)","nCr(n,k)p^{k}(1-p)^{n-k}"],
   ["Mean","mu = np"],
   ["Variance","sigma^2 = np(1-p)"],
   ["Standard deviation","\\sqrt{np(1-p)}"],
   ["Sample proportion mean","p"],
   ["Sample proportion variance","\\frac{p(1-p)}{n}"],
   ["Normal approximation","N(np, np(1-p)) when np and n(1-p) are both >= 5"]],
 note:"P(X >= 1) = 1 - P(X = 0) is almost always faster than summing the individual terms."}
];

/* Tier-aware access. */
MQ.Reference = (function () {
  let cached = null;
  const all = () => (cached || (cached = MQ.DATA.reference.filter(r => MQ.DATA.TIERS.indexOf(r.tier) >= 0)));
  const byId = id => all().find(r => r.id === id);

  /** Plain-text search across titles, blurbs and every cell. */
  function search(term) {
    const t = String(term || "").trim().toLowerCase();
    if (!t) return all();
    return all().filter(sheet => {
      const hay = [sheet.title, sheet.blurb, sheet.note || ""]
        .concat(sheet.cols)
        .concat(sheet.rows.map(r => r.join(" ")))
        .join(" ").toLowerCase();
      return hay.includes(t);
    });
  }
  return { all, byId, search };
})();
