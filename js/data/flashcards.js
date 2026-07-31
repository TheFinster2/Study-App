/* Flashcards for the 5-box Leitner deck.

   Cards carry a `topic` code so MQ.Cards.all() can tier-filter them the same
   way Bank.all() filters questions — an Advanced-only build never sees an
   ME- card, and never sees one appear in a due count it can't clear. */
window.MQ = window.MQ || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.flashcards = [

/* ── exact trigonometric values ───────────────────────────── */
{id:"fc-t-01",topic:"MA-T1",deck:"Exact values",q:"sin \\frac{pi}{6}",a:"\\frac{1}{2}"},
{id:"fc-t-02",topic:"MA-T1",deck:"Exact values",q:"cos \\frac{pi}{6}",a:"\\frac{\\sqrt{3}}{2}"},
{id:"fc-t-03",topic:"MA-T1",deck:"Exact values",q:"tan \\frac{pi}{6}",a:"\\frac{1}{\\sqrt{3}}"},
{id:"fc-t-04",topic:"MA-T1",deck:"Exact values",q:"sin \\frac{pi}{4}",a:"\\frac{1}{\\sqrt{2}}"},
{id:"fc-t-05",topic:"MA-T1",deck:"Exact values",q:"tan \\frac{pi}{4}",a:"1"},
{id:"fc-t-06",topic:"MA-T1",deck:"Exact values",q:"sin \\frac{pi}{3}",a:"\\frac{\\sqrt{3}}{2}"},
{id:"fc-t-07",topic:"MA-T1",deck:"Exact values",q:"cos \\frac{pi}{3}",a:"\\frac{1}{2}"},
{id:"fc-t-08",topic:"MA-T1",deck:"Exact values",q:"tan \\frac{pi}{3}",a:"\\sqrt{3}"},
{id:"fc-t-09",topic:"MA-T1",deck:"Exact values",q:"sin \\frac{pi}{2}",a:"1"},
{id:"fc-t-10",topic:"MA-T1",deck:"Exact values",q:"cos pi",a:"-1"},
{id:"fc-t-11",topic:"MA-T1",deck:"Unit circle",q:"Which functions are positive in the second quadrant?",a:"Sine only (and cosec)"},
{id:"fc-t-12",topic:"MA-T1",deck:"Unit circle",q:"Which functions are positive in the third quadrant?",a:"Tangent only (and cot)"},
{id:"fc-t-13",topic:"MA-T1",deck:"Unit circle",q:"Which functions are positive in the fourth quadrant?",a:"Cosine only (and sec)"},
{id:"fc-t-14",topic:"MA-T1",deck:"Radians",q:"Convert degrees to radians",a:"Multiply by \\frac{pi}{180}"},
{id:"fc-t-15",topic:"MA-T1",deck:"Radians",q:"Arc length of a sector",a:"l = r theta, with theta in radians"},
{id:"fc-t-16",topic:"MA-T1",deck:"Radians",q:"Area of a sector",a:"A = \\frac{1}{2}r^2 theta"},
{id:"fc-t-17",topic:"MA-T1",deck:"Identities",q:"sin^2 theta + cos^2 theta",a:"1"},
{id:"fc-t-18",topic:"MA-T1",deck:"Identities",q:"1 + tan^2 theta",a:"sec^2 theta"},
{id:"fc-t-19",topic:"MA-T1",deck:"Identities",q:"1 + cot^2 theta",a:"cosec^2 theta"},
{id:"fc-t-20",topic:"MA-T2",deck:"Identities",q:"sin 2A",a:"2 sin A cos A"},
{id:"fc-t-21",topic:"MA-T2",deck:"Identities",q:"cos 2A (three forms)",a:"cos^2 A - sin^2 A = 2cos^2 A - 1 = 1 - 2sin^2 A"},
{id:"fc-t-22",topic:"MA-T2",deck:"Graphs",q:"Period of y = sin nx",a:"\\frac{2pi}{n}"},
{id:"fc-t-23",topic:"MA-T2",deck:"Graphs",q:"Period of y = tan nx",a:"\\frac{pi}{n}"},
{id:"fc-t-24",topic:"MA-T1",deck:"Triangles",q:"The sine rule",a:"\\frac{a}{sin A} = \\frac{b}{sin B} = \\frac{c}{sin C}"},
{id:"fc-t-25",topic:"MA-T1",deck:"Triangles",q:"The cosine rule",a:"c^2 = a^2 + b^2 - 2ab cos C"},
{id:"fc-t-26",topic:"MA-T1",deck:"Triangles",q:"Area of a triangle from two sides and the included angle",a:"A = \\frac{1}{2}ab sin C"},

/* ── differentiation ──────────────────────────────────────── */
{id:"fc-d-01",topic:"MA-C1",deck:"Derivatives",q:"\\frac{d}{dx}x^n",a:"nx^{n-1}"},
{id:"fc-d-02",topic:"MA-E1",deck:"Derivatives",q:"\\frac{d}{dx}e^{x}",a:"e^{x}"},
{id:"fc-d-03",topic:"MA-E1",deck:"Derivatives",q:"\\frac{d}{dx}e^{f(x)}",a:"f'(x)e^{f(x)}"},
{id:"fc-d-04",topic:"MA-E1",deck:"Derivatives",q:"\\frac{d}{dx}ln x",a:"\\frac{1}{x}"},
{id:"fc-d-05",topic:"MA-E1",deck:"Derivatives",q:"\\frac{d}{dx}ln f(x)",a:"\\frac{f'(x)}{f(x)}"},
{id:"fc-d-06",topic:"MA-T2",deck:"Derivatives",q:"\\frac{d}{dx}sin x",a:"cos x"},
{id:"fc-d-07",topic:"MA-T2",deck:"Derivatives",q:"\\frac{d}{dx}cos x",a:"-sin x"},
{id:"fc-d-08",topic:"MA-T2",deck:"Derivatives",q:"\\frac{d}{dx}tan x",a:"sec^2 x"},
{id:"fc-d-09",topic:"MA-C2",deck:"Rules",q:"The product rule",a:"(uv)' = u'v + uv'"},
{id:"fc-d-10",topic:"MA-C2",deck:"Rules",q:"The quotient rule",a:"(\\frac{u}{v})' = \\frac{u'v - uv'}{v^2}"},
{id:"fc-d-11",topic:"MA-C2",deck:"Rules",q:"The chain rule",a:"\\frac{dy}{dx} = \\frac{dy}{du} \\times \\frac{du}{dx}"},
{id:"fc-d-12",topic:"MA-C1",deck:"Definitions",q:"The derivative from first principles",a:"\\lim_{h->0}\\frac{f(x+h)-f(x)}{h}"},
{id:"fc-d-13",topic:"MA-C3",deck:"Curve sketching",q:"f'(x) = 0 and f''(x) > 0 means",a:"A local minimum"},
{id:"fc-d-14",topic:"MA-C3",deck:"Curve sketching",q:"f'(x) = 0 and f''(x) < 0 means",a:"A local maximum"},
{id:"fc-d-15",topic:"MA-C3",deck:"Curve sketching",q:"A point of inflexion requires",a:"f'' = 0 AND a change of sign in f''"},
{id:"fc-d-16",topic:"MA-C2",deck:"Geometry",q:"Gradient of the normal, given tangent gradient m",a:"-\\frac{1}{m}"},

/* ── integration ──────────────────────────────────────────── */
{id:"fc-i-01",topic:"MA-C4",deck:"Integrals",q:"int x^n dx (n != -1)",a:"\\frac{x^{n+1}}{n+1} + c"},
{id:"fc-i-02",topic:"MA-E1",deck:"Integrals",q:"int \\frac{1}{x} dx",a:"ln|x| + c"},
{id:"fc-i-03",topic:"MA-E1",deck:"Integrals",q:"int e^{ax} dx",a:"\\frac{1}{a}e^{ax} + c"},
{id:"fc-i-04",topic:"MA-T2",deck:"Integrals",q:"int sin ax dx",a:"-\\frac{1}{a}cos ax + c"},
{id:"fc-i-05",topic:"MA-T2",deck:"Integrals",q:"int cos ax dx",a:"\\frac{1}{a}sin ax + c"},
{id:"fc-i-06",topic:"MA-T2",deck:"Integrals",q:"int sec^2 ax dx",a:"\\frac{1}{a}tan ax + c"},
{id:"fc-i-07",topic:"MA-C4",deck:"Integrals",q:"int (ax+b)^n dx",a:"\\frac{(ax+b)^{n+1}}{a(n+1)} + c"},
{id:"fc-i-08",topic:"MA-E1",deck:"Integrals",q:"int \\frac{f'(x)}{f(x)} dx",a:"ln|f(x)| + c"},
{id:"fc-i-09",topic:"MA-C4",deck:"Applications",q:"Area between curves, f above g",a:"int_a^{b}(f - g) dx"},
{id:"fc-i-10",topic:"MA-C4",deck:"Applications",q:"The trapezoidal rule",a:"\\frac{h}{2}(y_0 + y_n + 2(y_1 + ... + y_{n-1}))"},
{id:"fc-i-11",topic:"MA-C4",deck:"Applications",q:"Average value of f on [a, b]",a:"\\frac{1}{b-a}int_a^{b}f dx"},
{id:"fc-i-12",topic:"MA-C4",deck:"Definitions",q:"The fundamental theorem of calculus",a:"\\frac{d}{dx}int_a^{x}f(t)dt = f(x)"},

/* ── logs and exponentials ────────────────────────────────── */
{id:"fc-e-01",topic:"MA-E1",deck:"Log laws",q:"log(ab)",a:"log a + log b"},
{id:"fc-e-02",topic:"MA-E1",deck:"Log laws",q:"log\\frac{a}{b}",a:"log a - log b"},
{id:"fc-e-03",topic:"MA-E1",deck:"Log laws",q:"log a^n",a:"n log a"},
{id:"fc-e-04",topic:"MA-E1",deck:"Log laws",q:"Change of base: log_b a",a:"\\frac{ln a}{ln b}"},
{id:"fc-e-05",topic:"MA-E1",deck:"Log laws",q:"log_a 1 and log_a a",a:"0 and 1"},
{id:"fc-e-06",topic:"MA-E1",deck:"Index laws",q:"a^{-n}",a:"\\frac{1}{a^n}"},
{id:"fc-e-07",topic:"MA-E1",deck:"Index laws",q:"a^{\\frac{m}{n}}",a:"\\sqrt[n]{a^m}"},
{id:"fc-e-08",topic:"MA-E1",deck:"Growth & decay",q:"Solution of \\frac{dP}{dt} = kP",a:"P = P_0 e^{kt}"},
{id:"fc-e-09",topic:"MA-E1",deck:"Growth & decay",q:"Half-life relation to k",a:"k = \\frac{ln 2}{T_{1/2}}"},

/* ── financial ────────────────────────────────────────────── */
{id:"fc-m-01",topic:"MA-M1",deck:"Sequences",q:"nth term of an AP",a:"T_n = a + (n-1)d"},
{id:"fc-m-02",topic:"MA-M1",deck:"Sequences",q:"Sum of an AP",a:"S_n = \\frac{n}{2}(2a + (n-1)d) = \\frac{n}{2}(a+l)"},
{id:"fc-m-03",topic:"MA-M1",deck:"Sequences",q:"nth term of a GP",a:"T_n = ar^{n-1}"},
{id:"fc-m-04",topic:"MA-M1",deck:"Sequences",q:"Sum of a GP",a:"S_n = \\frac{a(r^n - 1)}{r - 1}"},
{id:"fc-m-05",topic:"MA-M1",deck:"Sequences",q:"Limiting sum of a GP, and when it exists",a:"S_inf = \\frac{a}{1-r}, valid only for |r| < 1"},
{id:"fc-m-06",topic:"MA-M1",deck:"Finance",q:"Compound interest",a:"A = P(1+r)^n"},
{id:"fc-m-07",topic:"MA-M1",deck:"Finance",q:"Future value of an annuity",a:"FV = M\\frac{(1+r)^n - 1}{r}"},
{id:"fc-m-08",topic:"MA-M1",deck:"Finance",q:"Reducing-balance loan recurrence",a:"A_n = A_{n-1}(1+r) - M"},

/* ── statistics ───────────────────────────────────────────── */
{id:"fc-s-01",topic:"MA-S1",deck:"Probability",q:"The addition rule",a:"P(A U B) = P(A) + P(B) - P(A n B)"},
{id:"fc-s-02",topic:"MA-S1",deck:"Probability",q:"Conditional probability",a:"P(A|B) = \\frac{P(A n B)}{P(B)}"},
{id:"fc-s-03",topic:"MA-S1",deck:"Probability",q:"The test for independence",a:"P(A n B) = P(A)P(B)"},
{id:"fc-s-04",topic:"MA-S1",deck:"Random variables",q:"Expected value of a discrete X",a:"E(X) = Sum x P(X = x)"},
{id:"fc-s-05",topic:"MA-S1",deck:"Random variables",q:"Variance, computational form",a:"Var(X) = E(X^2) - [E(X)]^2"},
{id:"fc-s-06",topic:"MA-S1",deck:"Random variables",q:"Var(aX + b)",a:"a^2 Var(X) — the constant b does nothing"},
{id:"fc-s-07",topic:"MA-S3",deck:"Normal",q:"The z-score",a:"z = \\frac{x - mu}{sigma}"},
{id:"fc-s-08",topic:"MA-S3",deck:"Normal",q:"The empirical rule",a:"68% / 95% / 99.7% within 1, 2 and 3 standard deviations"},
{id:"fc-s-09",topic:"MA-S3",deck:"Normal",q:"Conditions for a probability density function",a:"f >= 0 and the total area is 1"},
{id:"fc-s-10",topic:"MA-S2",deck:"Bivariate",q:"What r^2 measures",a:"The proportion of variation in y explained by the model"},
{id:"fc-s-11",topic:"MA-S2",deck:"Bivariate",q:"The point every least-squares line passes through",a:"(\\bar{x}, \\bar{y})"},
{id:"fc-s-12",topic:"MA-S2",deck:"Summary",q:"The interquartile range",a:"IQR = Q_3 - Q_1"},
{id:"fc-s-13",topic:"MA-S2",deck:"Summary",q:"The usual outlier fence",a:"Beyond Q_1 - 1.5 IQR or Q_3 + 1.5 IQR"},

/* ── functions ────────────────────────────────────────────── */
{id:"fc-f-01",topic:"MA-F1",deck:"Functions",q:"Definition of an even function",a:"f(-x) = f(x); symmetric in the y-axis"},
{id:"fc-f-02",topic:"MA-F1",deck:"Functions",q:"Definition of an odd function",a:"f(-x) = -f(x); 180 deg rotational symmetry about the origin"},
{id:"fc-f-03",topic:"MA-F1",deck:"Functions",q:"How to find an inverse",a:"Swap x and y, then solve for y"},
{id:"fc-f-04",topic:"MA-F1",deck:"Functions",q:"y = f(x - h) + k is which transformation?",a:"Shift h right and k up"},
{id:"fc-f-05",topic:"MA-F1",deck:"Functions",q:"The quadratic formula",a:"x = \\frac{-b +- \\sqrt{b^2-4ac}}{2a}"},
{id:"fc-f-06",topic:"MA-F1",deck:"Functions",q:"What the discriminant tells you",a:"> 0 two roots, = 0 one, < 0 none"},
{id:"fc-f-07",topic:"MA-F1",deck:"Functions",q:"Solving |A| < k",a:"-k < A < k"},
{id:"fc-f-08",topic:"MA-F1",deck:"Functions",q:"Solving |A| > k",a:"A < -k or A > k"},

/* ══════════ Extension 1 ══════════ */

{id:"fc-x-01",topic:"ME-T1",deck:"Inverse trig",q:"Range of sin^{-1}x",a:"[-\\frac{pi}{2}, \\frac{pi}{2}]"},
{id:"fc-x-02",topic:"ME-T1",deck:"Inverse trig",q:"Range of cos^{-1}x",a:"[0, pi]"},
{id:"fc-x-03",topic:"ME-T1",deck:"Inverse trig",q:"Range of tan^{-1}x",a:"(-\\frac{pi}{2}, \\frac{pi}{2})"},
{id:"fc-x-04",topic:"ME-T1",deck:"Inverse trig",q:"sin^{-1}x + cos^{-1}x",a:"\\frac{pi}{2}"},
{id:"fc-x-05",topic:"ME-C2",deck:"Inverse trig",q:"\\frac{d}{dx}sin^{-1}x",a:"\\frac{1}{\\sqrt{1-x^2}}"},
{id:"fc-x-06",topic:"ME-C2",deck:"Inverse trig",q:"\\frac{d}{dx}tan^{-1}x",a:"\\frac{1}{1+x^2}"},
{id:"fc-x-07",topic:"ME-C2",deck:"Inverse trig",q:"int\\frac{dx}{\\sqrt{a^2-x^2}}",a:"sin^{-1}\\frac{x}{a} + c"},
{id:"fc-x-08",topic:"ME-C2",deck:"Inverse trig",q:"int\\frac{dx}{a^2+x^2}",a:"\\frac{1}{a}tan^{-1}\\frac{x}{a} + c"},
{id:"fc-x-09",topic:"ME-T2",deck:"Identities",q:"sin(A + B)",a:"sin A cos B + cos A sin B"},
{id:"fc-x-10",topic:"ME-T2",deck:"Identities",q:"cos(A + B)",a:"cos A cos B - sin A sin B"},
{id:"fc-x-11",topic:"ME-T2",deck:"Identities",q:"tan(A + B)",a:"\\frac{tan A + tan B}{1 - tan A tan B}"},
{id:"fc-x-12",topic:"ME-T2",deck:"Identities",q:"tan 2A",a:"\\frac{2tan A}{1 - tan^2 A}"},
{id:"fc-x-13",topic:"ME-T2",deck:"Identities",q:"t-formula for sin x, with t = tan\\frac{x}{2}",a:"\\frac{2t}{1+t^2}"},
{id:"fc-x-14",topic:"ME-T2",deck:"Identities",q:"t-formula for cos x",a:"\\frac{1-t^2}{1+t^2}"},
{id:"fc-x-15",topic:"ME-T2",deck:"Identities",q:"Auxiliary angle: a sin x + b cos x",a:"Rsin(x + alpha) with R = \\sqrt{a^2+b^2}, tan alpha = \\frac{b}{a}"},
{id:"fc-x-16",topic:"ME-T2",deck:"Integration prep",q:"sin^2 x in integrable form",a:"\\frac{1 - cos 2x}{2}"},
{id:"fc-x-17",topic:"ME-T2",deck:"Integration prep",q:"cos^2 x in integrable form",a:"\\frac{1 + cos 2x}{2}"},
{id:"fc-x-18",topic:"ME-T3",deck:"Equations",q:"General solution of sin x = a",a:"x = npi + (-1)^n alpha"},
{id:"fc-x-19",topic:"ME-T3",deck:"Equations",q:"General solution of cos x = a",a:"x = 2npi +- alpha"},
{id:"fc-x-20",topic:"ME-T3",deck:"Equations",q:"General solution of tan x = a",a:"x = npi + alpha"},
{id:"fc-x-21",topic:"ME-F2",deck:"Polynomials",q:"The remainder theorem",a:"Dividing P(x) by (x-a) leaves remainder P(a)"},
{id:"fc-x-22",topic:"ME-F2",deck:"Polynomials",q:"The factor theorem",a:"(x-a) is a factor exactly when P(a) = 0"},
{id:"fc-x-23",topic:"ME-F2",deck:"Polynomials",q:"Sum and product of roots of a quadratic",a:"-\\frac{b}{a} and \\frac{c}{a}"},
{id:"fc-x-24",topic:"ME-F2",deck:"Polynomials",q:"Sum and product of roots of a cubic",a:"-\\frac{b}{a} and -\\frac{d}{a}"},
{id:"fc-x-25",topic:"ME-F2",deck:"Polynomials",q:"Test for a double root at x = a",a:"P(a) = 0 and P'(a) = 0"},
{id:"fc-x-26",topic:"ME-A1",deck:"Combinatorics",q:"nPr(n,r)",a:"\\frac{n!}{(n-r)!}"},
{id:"fc-x-27",topic:"ME-A1",deck:"Combinatorics",q:"nCr(n,r)",a:"\\frac{n!}{r!(n-r)!}"},
{id:"fc-x-28",topic:"ME-A1",deck:"Combinatorics",q:"Arrangements of n objects in a circle",a:"(n-1)!"},
{id:"fc-x-29",topic:"ME-A1",deck:"Combinatorics",q:"Pascal's identity",a:"nCr(n,k) = nCr(n-1,k-1) + nCr(n-1,k)"},
{id:"fc-x-30",topic:"ME-A1",deck:"Combinatorics",q:"General term of (a+b)^n",a:"nCr(n,k)a^{n-k}b^{k}"},
{id:"fc-x-31",topic:"ME-P1",deck:"Induction",q:"The three steps of induction",a:"Base case, assume for n = k, prove for n = k+1"},
{id:"fc-x-32",topic:"ME-P1",deck:"Induction",q:"Standard first move in a divisibility induction",a:"Rewrite the n = k+1 expression to contain the assumed multiple as a factor"},
{id:"fc-x-33",topic:"ME-V1",deck:"Vectors",q:"Magnitude of xi + yj",a:"\\sqrt{x^2+y^2}"},
{id:"fc-x-34",topic:"ME-V1",deck:"Vectors",q:"The dot product in components",a:"\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2"},
{id:"fc-x-35",topic:"ME-V1",deck:"Vectors",q:"The dot product and the angle between vectors",a:"\\vec{u} \\cdot \\vec{v} = |\\vec{u}||\\vec{v}|cos theta"},
{id:"fc-x-36",topic:"ME-V1",deck:"Vectors",q:"Vector projection of \\vec{u} onto \\vec{v}",a:"\\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{v}|^2}\\vec{v}"},
{id:"fc-x-37",topic:"ME-V1",deck:"Projectiles",q:"Range on level ground",a:"\\frac{V^2 sin 2theta}{g}"},
{id:"fc-x-38",topic:"ME-V1",deck:"Projectiles",q:"Time of flight on level ground",a:"\\frac{2V sin theta}{g}"},
{id:"fc-x-39",topic:"ME-V1",deck:"Projectiles",q:"Maximum height",a:"\\frac{V^2 sin^2 theta}{2g}"},
{id:"fc-x-40",topic:"ME-C3",deck:"Volumes",q:"Volume of revolution about the x-axis",a:"V = pi int_a^{b}y^2 dx"},
{id:"fc-x-41",topic:"ME-C3",deck:"Volumes",q:"Volume of revolution about the y-axis",a:"V = pi int_c^{d}x^2 dy"},
{id:"fc-x-42",topic:"ME-C1",deck:"Rates",q:"Newton's law of cooling",a:"\\frac{dT}{dt} = -k(T - A), so T = A + (T_0 - A)e^{-kt}"},
{id:"fc-x-43",topic:"ME-S1",deck:"Binomial",q:"Mean and variance of Bin(n, p)",a:"np and np(1-p)"},
{id:"fc-x-44",topic:"ME-S1",deck:"Binomial",q:"P(X = k) for Bin(n, p)",a:"nCr(n,k)p^{k}(1-p)^{n-k}"},
{id:"fc-x-45",topic:"ME-S1",deck:"Binomial",q:"Mean and variance of the sample proportion",a:"p and \\frac{p(1-p)}{n}"}
];

/* Tier-aware access, mirroring Bank.all(). */
MQ.Cards = (function () {
  let cached = null;
  function all() {
    if (!cached) cached = MQ.DATA.flashcards.filter(c => MQ.DATA.tierEnabled(c.topic));
    return cached;
  }
  const byId = id => all().find(c => c.id === id);
  function decks() {
    const seen = [];
    all().forEach(c => { if (!seen.includes(c.deck)) seen.push(c.deck); });
    return seen;
  }
  const inDeck = name => all().filter(c => c.deck === name);
  return { all, byId, decks, inDeck };
})();
