/* ═══════════════════════════════════════════════════════════════
   Procedural question generators.

   THE RULE (brief §9.9, and the most important content rule in the
   whole project): PICK THE ANSWER FIRST, in a known-good range, then
   derive the inputs from it. The reference app's titration simulator
   randomised its inputs independently and could produce a question that
   was literally unanswerable — the student hit it in normal play.

   In maths this generalises everywhere:
     · Quadratics — pick integer roots, then expand. Never randomise
       coefficients and hope for a nice discriminant.
     · Integrals — pick the antiderivative, then differentiate it to get
       the integrand. It is the ONLY way to guarantee a closed form exists.
     · Right triangles — pick a Pythagorean triple.
     · Optimisation — pick the stationary point, then build the function.
     · Financial — pick the final balance, then solve backwards.
     · Substitution integrals — pick u and the outer function, compose forward.
     · Combinatorics — pick the answer's magnitude band first. nCr explodes;
       randomising n and r gives you either 6 or 2.7×10^14 and nothing between.
     · Projectiles — pick the landing point and time of flight, then derive
       the launch velocity. Randomising angle and speed puts the target
       off-canvas.

   EVERY generator has two independent code paths:
     make(rng) → { params, ... }   builds the question backwards from an answer
     solve(params) → answer        works forwards from the inputs

   The validator runs 500 samples per generator and asserts make and solve
   agree. That is what "recompute derived values instead of trusting them"
   means in practice (addendum D5): a stored answer that was never re-derived
   by a second path is an assertion, not a fact.

   Each generator also declares a difficulty CONTRACT (§9.10) — steps
   required, magnitude of the numbers, and the shape of the answer — which
   the validator also checks. Without it, "differentiate this" spans one
   line to fifteen at the same declared diff.
   ═══════════════════════════════════════════════════════════════ */
window.MQ = window.MQ || {};

MQ.Gen = (function () {
  const U = MQ.U;
  const LIST = [];

  function gen(spec) { LIST.push(spec); }

  /* seeded helpers — every generator draws only through these */
  const ri = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  const rpick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  const rsign = rng => (rng() < 0.5 ? -1 : 1);
  /* A non-zero integer in [-hi, hi] excluding 0 — the commonest draw here. */
  const rnz = (rng, hi) => rsign(rng) * ri(rng, 1, hi);
  /* Print a leading coefficient the way a person writes it: 1x is just x. */
  const co = n => (n === 1 ? "" : n === -1 ? "-" : String(n));
  /* Print a following term with its sign: 3 → "+ 3", -3 → "- 3". */
  const sg = (n, v) => (n < 0 ? "- " : "+ ") + (Math.abs(n) === 1 && v ? "" : Math.abs(n)) + (v || "");

  /* ════════════════ DIFFERENTIATION ════════════════ */

  gen({id:"diff-poly", topic:"MA-C2", name:"Differentiate a polynomial", diff:1,
    contract:{steps:1, magnitude:"coefficients ≤ 9, |answer| < 500", answerType:"integer"},
    make(rng) {
      const a = ri(rng, 2, 9), n = ri(rng, 2, 4), b = rnz(rng, 9), x = ri(rng, 1, 4);
      return { params:{a,n,b,x},
        prompt:`If y = ${a}x^${n} + ${b}x, find \\frac{dy}{dx} at x = ${x}.`,
        answerType:"integer", unit:"",
        why:`\\frac{dy}{dx} = ${a*n}x^${n-1} + ${b}. At x = ${x} this is ${a*n}(${Math.pow(x,n-1)}) + ${b}.` };
    },
    solve(p) { return p.a * p.n * Math.pow(p.x, p.n - 1) + p.b; }});

  gen({id:"diff-chain", topic:"MA-C2", name:"Chain rule", diff:2,
    contract:{steps:2, magnitude:"inner coefficient ≤ 5, index ≤ 5", answerType:"integer"},
    make(rng) {
      const a = ri(rng, 2, 5), b = rnz(rng, 6), n = ri(rng, 2, 5);
      // Choose x so the inner bracket is small — otherwise the answer explodes.
      const inner = ri(rng, 1, 3);
      const x = (inner - b) / a;
      return { params:{a,b,n,x},
        prompt:`If y = (${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^${n}, find \\frac{dy}{dx} at x = ${U.fmtNum(x)}.`,
        answerType:"integer",
        why:`\\frac{dy}{dx} = ${n}(${a}x ${b<0?"-":"+"} ${Math.abs(b)})^${n-1} \\times ${a}. The bracket is ${inner} there.` };
    },
    solve(p) { return p.n * Math.pow(p.a * p.x + p.b, p.n - 1) * p.a; }});

  gen({id:"diff-product", topic:"MA-C2", name:"Product rule with e^x", diff:3,
    contract:{steps:2, magnitude:"index ≤ 3, evaluated at x = 0 or 1", answerType:"exact expression"},
    make(rng) {
      const n = ri(rng, 1, 3), a = ri(rng, 1, 3);
      return { params:{n,a},
        prompt:`Differentiate y = x^${n}e^{${a === 1 ? "" : a}x} and give \\frac{dy}{dx} at x = 1, as a multiple of e^{${a}}.`,
        answerType:"number", hint:"Enter the coefficient of e^{" + a + "} only.",
        why:`Product rule: ${n}x^${n-1}e^{${a}x} + ${a}x^${n}e^{${a}x}. At x = 1 the coefficient is ${n} + ${a}.` };
    },
    solve(p) { return p.n + p.a; }});

  gen({id:"diff-quotient", topic:"MA-C2", name:"Quotient rule", diff:3,
    contract:{steps:2, magnitude:"single-digit constants, denominator non-zero", answerType:"decimal"},
    make(rng) {
      const b = rnz(rng, 5);
      // x must avoid the pole at x = -b, or the derivative is infinite there.
      // Staying strictly positive above -b guarantees it.
      const x = Math.max(1, -b + 1) + ri(rng, 0, 3);
      return { params:{b,x},
        prompt:`If y = \\frac{x}{x ${b<0?"-":"+"} ${Math.abs(b)}}, find \\frac{dy}{dx} at x = ${x}. Give 3 decimal places.`,
        answerType:"number", tol:0.005,
        why:`Quotient rule gives \\frac{${b}}{(x ${b<0?"-":"+"} ${Math.abs(b)})^2}. Substitute x = ${x}.` };
    },
    solve(p) { return p.b / Math.pow(p.x + p.b, 2); }});

  gen({id:"diff-trig", topic:"MA-T2", name:"Differentiate a trig function", diff:2,
    contract:{steps:2, magnitude:"coefficient ≤ 5, evaluated at a special angle", answerType:"exact"},
    make(rng) {
      const a = ri(rng, 1, 4);
      const kind = rpick(rng, ["sin", "cos"]);
      const den = rpick(rng, [2, 3, 4, 6]);
      return { params:{a,kind,den},
        prompt:`Differentiate y = ${kind} ${a === 1 ? "" : a}x and evaluate \\frac{dy}{dx} at x = \\frac{pi}{${den}}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`\\frac{dy}{dx} = ${kind === "sin" ? "" : "-"}${a}${kind === "sin" ? "cos" : "sin"} ${a}x. Substitute x = \\frac{pi}{${den}}.` };
    },
    solve(p) {
      const x = Math.PI / p.den;
      return p.kind === "sin" ? p.a * Math.cos(p.a * x) : -p.a * Math.sin(p.a * x);
    }});

  gen({id:"diff-log", topic:"MA-E1", name:"Differentiate a logarithm", diff:2,
    contract:{steps:2, magnitude:"quadratic inside, |x| ≤ 4", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 1, 4), c = ri(rng, 1, 5), x = ri(rng, 1, 4);
      return { params:{a,c,x},
        prompt:`If y = ln(${a === 1 ? "" : a}x^2 + ${c}), find \\frac{dy}{dx} at x = ${x}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`\\frac{dy}{dx} = \\frac{${2*a}x}{${a === 1 ? "" : a}x^2 + ${c}}. Substitute x = ${x}.` };
    },
    solve(p) { return (2 * p.a * p.x) / (p.a * p.x * p.x + p.c); }});

  gen({id:"diff-exp", topic:"MA-E1", name:"Differentiate an exponential", diff:2,
    contract:{steps:2, magnitude:"index coefficient ≤ 4, answer a multiple of e", answerType:"number"},
    make(rng) {
      const a = ri(rng, 2, 4), k = ri(rng, 2, 6);
      return { params:{a,k},
        prompt:`If y = ${k}e^{${a}x}, find \\frac{dy}{dx} at x = 0.`,
        answerType:"integer",
        why:`\\frac{dy}{dx} = ${k*a}e^{${a}x}, and e^0 = 1.` };
    },
    solve(p) { return p.k * p.a; }});

  gen({id:"diff-second", topic:"MA-C3", name:"Second derivative", diff:2,
    contract:{steps:2, magnitude:"cubic, coefficients ≤ 6", answerType:"integer"},
    make(rng) {
      const a = ri(rng, 1, 6), b = rnz(rng, 6), x = ri(rng, 1, 4);
      return { params:{a,b,x},
        prompt:`If y = ${a}x^3 ${b<0?"-":"+"} ${Math.abs(b)}x^2, find \\frac{d^2y}{dx^2} at x = ${x}.`,
        answerType:"integer",
        why:`\\frac{dy}{dx} = ${3*a}x^2 ${b<0?"-":"+"} ${Math.abs(2*b)}x, so \\frac{d^2y}{dx^2} = ${6*a}x ${b<0?"-":"+"} ${Math.abs(2*b)}.` };
    },
    solve(p) { return 6 * p.a * p.x + 2 * p.b; }});

  /* ════════════════ TANGENTS, STATIONARY POINTS, OPTIMISATION ════════════════ */

  gen({id:"tangent-gradient", topic:"MA-C2", name:"Gradient of a tangent", diff:1,
    contract:{steps:2, magnitude:"quadratic, |answer| < 100", answerType:"integer"},
    make(rng) {
      const a = ri(rng, 1, 5), b = rnz(rng, 8), x = rnz(rng, 5);
      return { params:{a,b,x},
        prompt:`Find the gradient of the tangent to y = ${a}x^2 ${b<0?"-":"+"} ${Math.abs(b)}x at x = ${x}.`,
        answerType:"integer",
        why:`\\frac{dy}{dx} = ${2*a}x ${b<0?"-":"+"} ${Math.abs(b)}. At x = ${x} this is ${2*a*x} ${b<0?"-":"+"} ${Math.abs(b)}.` };
    },
    solve(p) { return 2 * p.a * p.x + p.b; }});

  gen({id:"normal-gradient", topic:"MA-C2", name:"Gradient of a normal", diff:2,
    contract:{steps:3, magnitude:"tangent gradient a small non-zero integer", answerType:"fraction"},
    make(rng) {
      // Pick the tangent gradient FIRST so the normal is a tidy fraction.
      const m = rnz(rng, 6), a = ri(rng, 1, 4);
      const x = ri(rng, 1, 4);
      const b = m - 2 * a * x;
      return { params:{a,b,x,m},
        prompt:`Find the gradient of the NORMAL to y = ${a}x^2 ${b<0?"- "+Math.abs(b):"+ "+b}x at x = ${x}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`The tangent gradient is ${m}, and perpendicular gradients multiply to -1, so the normal is -\\frac{1}{${m}}.` };
    },
    solve(p) { return -1 / (2 * p.a * p.x + p.b); }});

  gen({id:"stationary-point", topic:"MA-C3", name:"Locate a stationary point", diff:2,
    contract:{steps:2, magnitude:"stationary x is an integer in [-6, 6]", answerType:"integer"},
    make(rng) {
      // Pick the stationary point first, then build the quadratic around it.
      const s = rnz(rng, 6), a = ri(rng, 1, 4);
      const b = -2 * a * s;
      return { params:{a,b,s},
        prompt:`Find the x-coordinate of the stationary point of y = ${a}x^2 ${b<0?"- "+Math.abs(b):"+ "+b}x + 7.`,
        answerType:"integer",
        why:`\\frac{dy}{dx} = ${2*a}x ${b<0?"- "+Math.abs(b):"+ "+b} = 0 gives x = ${s}.` };
    },
    solve(p) { return -p.b / (2 * p.a); }});

  gen({id:"optimise-rect", topic:"MA-C3", name:"Optimisation: maximum area", diff:2,
    contract:{steps:3, magnitude:"perimeter a multiple of 4 up to 200", answerType:"integer"},
    make(rng) {
      // Pick the side length first, so the perimeter and area are both tidy.
      const side = ri(rng, 3, 25);
      const perim = 4 * side;
      return { params:{perim},
        prompt:`A rectangle has perimeter ${perim} m. Find its maximum possible area, in m^2.`,
        answerType:"integer", unit:"m^2",
        why:`With 2x + 2y = ${perim}, A = x(${perim/2} - x), maximised at x = ${side}. The maximum is a ${side} by ${side} square.` };
    },
    solve(p) { const s = p.perim / 4; return s * s; }});

  gen({id:"optimise-product", topic:"MA-C3", name:"Optimisation: maximum product", diff:2,
    contract:{steps:2, magnitude:"sum an even number ≤ 60", answerType:"integer"},
    make(rng) {
      const half = ri(rng, 3, 30);
      return { params:{sum: 2 * half},
        prompt:`Two numbers have a sum of ${2*half}. Find their maximum possible product.`,
        answerType:"integer",
        why:`P = x(${2*half} - x) is maximised at x = ${half}, giving ${half} \\times ${half}.` };
    },
    solve(p) { return (p.sum / 2) * (p.sum / 2); }});

  /* ════════════════ INTEGRATION ════════════════ */

  gen({id:"int-poly-def", topic:"MA-C4", name:"Definite integral of a polynomial", diff:2,
    contract:{steps:2, magnitude:"limits 0 to ≤ 4, integer answer", answerType:"integer"},
    make(rng) {
      // Pick the ANTIDERIVATIVE, then differentiate it to get the integrand.
      const n = ri(rng, 2, 4), a = ri(rng, 1, 4), b = ri(rng, 1, 4);
      return { params:{n,a,b},
        prompt:`Evaluate int_0^{${b}} ${a*n}x^${n-1} dx.`,
        answerType:"integer",
        why:`The antiderivative is ${a}x^${n}, so the value is ${a}(${b})^${n} - 0.` };
    },
    solve(p) { return p.a * Math.pow(p.b, p.n); }});

  gen({id:"int-chain-def", topic:"MA-C4", name:"Definite integral, reverse chain rule", diff:3,
    contract:{steps:3, magnitude:"index ≤ 4, bracket small at both limits", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 2, 4), n = ri(rng, 2, 4), b = ri(rng, 0, 3);
      const top = ri(rng, 1, 2);
      return { params:{a,b,n,top},
        prompt:`Evaluate int_0^{${top}} (${a}x + ${b})^${n} dx. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`The antiderivative is \\frac{(${a}x + ${b})^${n+1}}{${a*(n+1)}} — divide by the new index AND by the inner coefficient.` };
    },
    solve(p) {
      const F = x => Math.pow(p.a * x + p.b, p.n + 1) / (p.a * (p.n + 1));
      return F(p.top) - F(0);
    }});

  gen({id:"int-trig-def", topic:"MA-T2", name:"Definite integral of a trig function", diff:3,
    contract:{steps:2, magnitude:"limits are multiples of pi/6, coefficient ≤ 3", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 1, 3), kind = rpick(rng, ["sin", "cos"]);
      const den = rpick(rng, [2, 3, 4, 6]);
      return { params:{a,kind,den},
        prompt:`Evaluate int_0^{pi/${den}} ${kind} ${a === 1 ? "" : a}x dx. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`The antiderivative is ${kind === "sin" ? "-" : ""}\\frac{1}{${a}}${kind === "sin" ? "cos" : "sin"} ${a}x. Divide by the inner coefficient ${a}.` };
    },
    solve(p) {
      const b = Math.PI / p.den;
      return p.kind === "sin"
        ? (-Math.cos(p.a * b) + 1) / p.a
        : Math.sin(p.a * b) / p.a;
    }});

  gen({id:"int-exp-def", topic:"MA-E1", name:"Definite integral of an exponential", diff:2,
    contract:{steps:2, magnitude:"index coefficient ≤ 3, upper limit ≤ 2", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 1, 3), b = ri(rng, 1, 2);
      return { params:{a,b},
        prompt:`Evaluate int_0^{${b}} e^{${a === 1 ? "" : a}x} dx. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`The antiderivative is \\frac{1}{${a}}e^{${a}x}, so the value is \\frac{e^{${a*b}} - 1}{${a}}.` };
    },
    solve(p) { return (Math.exp(p.a * p.b) - 1) / p.a; }});

  gen({id:"int-recip-def", topic:"MA-E1", name:"Definite integral of 1/x", diff:2,
    contract:{steps:2, magnitude:"limits positive integers ≤ 20", answerType:"decimal"},
    make(rng) {
      const lo = ri(rng, 1, 4), hi = lo + ri(rng, 1, 8);
      return { params:{lo,hi},
        prompt:`Evaluate int_{${lo}}^{${hi}} \\frac{1}{x} dx. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`[ln x]_{${lo}}^{${hi}} = ln ${hi} - ln ${lo} = ln\\frac{${hi}}{${lo}}.` };
    },
    solve(p) { return Math.log(p.hi / p.lo); }});

  gen({id:"area-under", topic:"MA-C4", name:"Area under a parabola", diff:2,
    contract:{steps:3, magnitude:"roots are small integers, area a simple fraction", answerType:"decimal"},
    make(rng) {
      // Pick the roots, then expand — the area then always exists in closed form.
      const r = ri(rng, 2, 6), a = ri(rng, 1, 3);
      return { params:{a,r},
        prompt:`Find the area enclosed between y = ${a}x(${r} - x) and the x-axis. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`The curve cuts the axis at 0 and ${r}. int_0^{${r}}(${a*r}x - ${a}x^2)dx = ${a}(\\frac{${r}^3}{6}).` };
    },
    solve(p) { return p.a * (p.r * p.r * p.r / 6); }});

  gen({id:"area-between", topic:"MA-C4", name:"Area between a line and a parabola", diff:3,
    contract:{steps:4, magnitude:"intersections are integers in [-4, 4]", answerType:"decimal"},
    make(rng) {
      // Pick both intersections first, then build the line to pass through them.
      let p1 = rnz(rng, 4), p2 = rnz(rng, 4);
      if (p1 === p2) p2 = p1 + 1;
      const lo = Math.min(p1, p2), hi = Math.max(p1, p2);
      // y = x^2 meets y = (lo+hi)x - lo*hi exactly at lo and hi.
      const m = lo + hi, c = -lo * hi;
      return { params:{lo,hi,m,c},
        prompt:`Find the area enclosed between y = x^2 and y = ${co(m)}x ${sg(c)}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`They meet at x = ${lo} and x = ${hi}. The area is int(${co(m)}x ${sg(c)} - x^2)dx, and for a parabola-and-line it always equals \\frac{(hi - lo)^3}{6}.` };
    },
    solve(p) { return Math.pow(p.hi - p.lo, 3) / 6; }});

  gen({id:"trapezoidal", topic:"MA-C4", name:"Trapezoidal rule", diff:3,
    contract:{steps:3, magnitude:"2 to 4 strips, integer ordinates", answerType:"decimal"},
    make(rng) {
      const n = ri(rng, 2, 4), a = ri(rng, 1, 3), hi = n * ri(rng, 1, 2);
      return { params:{n,a,hi},
        prompt:`Use the trapezoidal rule with ${n} strips to estimate int_0^{${hi}} ${a}x^2 dx. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`h = ${hi/n}. Sum the end ordinates once and every interior one twice, then multiply by \\frac{h}{2}.` };
    },
    solve(p) {
      const f = x => p.a * x * x;
      const h = p.hi / p.n;
      let s = f(0) + f(p.hi);
      for (let i = 1; i < p.n; i++) s += 2 * f(i * h);
      return (h / 2) * s;
    }});

  /* ════════════════ QUADRATICS, LOGS, INDICES ════════════════ */

  gen({id:"quad-roots", topic:"MA-F1", name:"Solve a quadratic", diff:1,
    contract:{steps:2, magnitude:"integer roots in [-9, 9]", answerType:"integer"},
    make(rng) {
      // Pick integer roots and expand. Random coefficients give surds.
      const r1 = rnz(rng, 9), r2 = rnz(rng, 9);
      const b = -(r1 + r2), c = r1 * r2;
      return { params:{r1,r2,b,c},
        prompt:`Solve x^2 ${b<0?"- "+Math.abs(b):"+ "+b}x ${c<0?"- "+Math.abs(c):"+ "+c} = 0 and give the LARGER root.`,
        answerType:"integer",
        why:`It factorises as (x ${-r1<0?"- "+Math.abs(-r1):"+ "+(-r1)})(x ${-r2<0?"- "+Math.abs(-r2):"+ "+(-r2)}) = 0, so the roots are ${r1} and ${r2}.` };
    },
    solve(p) { return Math.max(p.r1, p.r2); }});

  gen({id:"quad-discriminant", topic:"MA-F1", name:"The discriminant", diff:1,
    contract:{steps:1, magnitude:"coefficients ≤ 9", answerType:"integer"},
    make(rng) {
      const a = ri(rng, 1, 4), b = rnz(rng, 9), c = rnz(rng, 9);
      return { params:{a,b,c},
        prompt:`Find the discriminant of ${a === 1 ? "" : a}x^2 ${b<0?"- "+Math.abs(b):"+ "+b}x ${c<0?"- "+Math.abs(c):"+ "+c} = 0.`,
        answerType:"integer",
        why:`\\Delta = b^2 - 4ac = ${b}^2 - 4(${a})(${c}).` };
    },
    solve(p) { return p.b * p.b - 4 * p.a * p.c; }});

  gen({id:"complete-square", topic:"MA-F1", name:"Complete the square", diff:2,
    contract:{steps:2, magnitude:"vertex coordinates are integers", answerType:"integer"},
    make(rng) {
      // Pick the vertex, then expand — so both h and k come out whole.
      const h = rnz(rng, 6), k = rnz(rng, 12);
      const b = -2 * h, c = h * h + k;
      return { params:{h,k,b,c},
        prompt:`Write y = x^2 ${b<0?"- "+Math.abs(b):"+ "+b}x ${c<0?"- "+Math.abs(c):"+ "+c} in the form (x - h)^2 + k. Give k.`,
        answerType:"integer",
        why:`Half of ${b} is ${b/2}, so y = (x ${b/2<0?"- "+Math.abs(b/2):"+ "+(b/2)})^2 ${k<0?"- "+Math.abs(k):"+ "+k}.` };
    },
    solve(p) { return p.c - (p.b / 2) * (p.b / 2); }});

  gen({id:"log-evaluate", topic:"MA-E1", name:"Evaluate a logarithm", diff:1,
    contract:{steps:1, magnitude:"base 2-5, index 2-6", answerType:"integer"},
    make(rng) {
      // Pick the RESULT first, then build the argument from it.
      const base = ri(rng, 2, 5), n = ri(rng, 2, 6);
      return { params:{base,n},
        prompt:`Evaluate log_{${base}} ${Math.pow(base, n)}.`,
        answerType:"integer",
        why:`${base}^${n} = ${Math.pow(base,n)}, so the logarithm is ${n}.` };
    },
    solve(p) { return Math.round(Math.log(Math.pow(p.base, p.n)) / Math.log(p.base)); }});

  gen({id:"log-solve", topic:"MA-E1", name:"Solve a logarithmic equation", diff:2,
    contract:{steps:2, magnitude:"solution a positive integer ≤ 200", answerType:"integer"},
    make(rng) {
      // k must DIVIDE base^n, or the contract's promise of an integer solution
      // is a lie. Restricting k to a lower power of the same base guarantees it.
      const base = ri(rng, 2, 5), n = ri(rng, 2, 4);
      const k = Math.pow(base, ri(rng, 0, n - 1));
      const x = Math.pow(base, n) / k;
      return { params:{base,n,k,x},
        prompt:`Solve log_{${base}}(${k === 1 ? "" : k}x) = ${n}.`,
        answerType:"integer",
        why:`${k === 1 ? "" : k}x = ${base}^${n} = ${Math.pow(base,n)}, so x = ${U.fmtNum(x)}.` };
    },
    solve(p) { return Math.pow(p.base, p.n) / p.k; }});

  gen({id:"index-solve", topic:"MA-E1", name:"Solve an exponential equation", diff:2,
    contract:{steps:2, magnitude:"solution to 4 decimal places, |x| < 12", answerType:"decimal"},
    make(rng) {
      const base = ri(rng, 2, 7), target = ri(rng, 10, 500);
      return { params:{base,target},
        prompt:`Solve ${base}^x = ${target}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Take logs of both sides: x = \\frac{ln ${target}}{ln ${base}}.` };
    },
    solve(p) { return Math.log(p.target) / Math.log(p.base); }});

  gen({id:"exp-growth", topic:"MA-E1", name:"Exponential growth", diff:2,
    contract:{steps:2, magnitude:"initial 100-5000, rate ≤ 0.12, t ≤ 30", answerType:"decimal"},
    make(rng) {
      const p0 = ri(rng, 1, 50) * 100, k = ri(rng, 2, 12) / 100, t = ri(rng, 3, 30);
      return { params:{p0,k,t},
        prompt:`A population grows as P = ${p0}e^{${k}t}. Find P when t = ${t}, to the nearest whole number.`,
        answerType:"number", tol:0.002,
        why:`P = ${p0}e^{${U.fmtNum(k*t)}}. Exponential growth compounds continuously, so this is not ${p0}(1 + ${k} \\times ${t}).` };
    },
    solve(p) { return p.p0 * Math.exp(p.k * p.t); }});

  gen({id:"halflife", topic:"MA-E1", name:"Half-life", diff:3,
    contract:{steps:3, magnitude:"half-life 2-100 units, answer < 500", answerType:"decimal"},
    make(rng) {
      // Pick the half-life first, then derive k from it.
      const hl = ri(rng, 2, 100), frac = rpick(rng, [0.25, 0.1, 0.05, 0.75]);
      return { params:{hl,frac},
        prompt:`A substance has a half-life of ${hl} years. How long until ${frac*100}% remains? Give 4 decimal places.`,
        answerType:"number", tol:0.001, unit:"years",
        why:`k = \\frac{ln 2}{${hl}}, then solve ${frac} = e^{-kt}, so t = \\frac{-ln ${frac}}{k}.` };
    },
    solve(p) {
      const k = Math.log(2) / p.hl;
      return -Math.log(p.frac) / k;
    }});

  /* ════════════════ SEQUENCES AND SERIES ════════════════ */

  gen({id:"ap-term", topic:"MA-M1", name:"Term of an AP", diff:1,
    contract:{steps:1, magnitude:"|a| ≤ 50, |d| ≤ 12, n ≤ 40", answerType:"integer"},
    make(rng) {
      const a = ri(rng, 1, 50), d = rnz(rng, 12), n = ri(rng, 8, 40);
      return { params:{a,d,n},
        prompt:`An AP has first term ${a} and common difference ${d}. Find T_{${n}}.`,
        answerType:"integer",
        why:`T_n = a + (n-1)d = ${a} + ${n-1}(${d}). Using n rather than n - 1 is the standard slip.` };
    },
    solve(p) { return p.a + (p.n - 1) * p.d; }});

  gen({id:"ap-sum", topic:"MA-M1", name:"Sum of an AP", diff:2,
    contract:{steps:2, magnitude:"n ≤ 40, |answer| < 20000", answerType:"integer"},
    make(rng) {
      const a = ri(rng, 1, 20), d = ri(rng, 2, 9), n = ri(rng, 10, 40);
      return { params:{a,d,n},
        prompt:`Find the sum of the first ${n} terms of the AP with a = ${a} and d = ${d}.`,
        answerType:"integer",
        why:`S_n = \\frac{n}{2}(2a + (n-1)d) = ${n/2}(${2*a} + ${(n-1)*d}).` };
    },
    solve(p) { return (p.n / 2) * (2 * p.a + (p.n - 1) * p.d); }});

  gen({id:"gp-term", topic:"MA-M1", name:"Term of a GP", diff:2,
    contract:{steps:1, magnitude:"r in {2,3,1/2,1/3}, |answer| < 1e6", answerType:"decimal"},
    make(rng) {
      const r = rpick(rng, [2, 3, 0.5, 1 / 3]);
      const a = ri(rng, 2, 12) * (r < 1 ? 81 : 1);
      const n = ri(rng, 4, r > 1 ? 9 : 6);
      return { params:{a,r,n},
        prompt:`A GP has a = ${a} and r = ${U.fmtNum(r)}. Find T_{${n}}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`T_n = ar^{n-1} = ${a} \\times (${U.fmtNum(r)})^{${n-1}}. The index is n - 1, not n.` };
    },
    solve(p) { return p.a * Math.pow(p.r, p.n - 1); }});

  gen({id:"gp-sum", topic:"MA-M1", name:"Sum of a GP", diff:2,
    contract:{steps:2, magnitude:"r in {2,3}, n ≤ 10", answerType:"integer"},
    make(rng) {
      const r = rpick(rng, [2, 3]), a = ri(rng, 1, 9), n = ri(rng, 5, 10);
      return { params:{a,r,n},
        prompt:`Find the sum of the first ${n} terms of the GP with a = ${a} and r = ${r}.`,
        answerType:"integer",
        why:`S_n = \\frac{a(r^n - 1)}{r - 1} = \\frac{${a}(${r}^{${n}} - 1)}{${r-1}}.` };
    },
    solve(p) { return (p.a * (Math.pow(p.r, p.n) - 1)) / (p.r - 1); }});

  gen({id:"gp-infinity", topic:"MA-M1", name:"Limiting sum", diff:2,
    contract:{steps:1, magnitude:"|r| < 1 and a chosen so the sum is an integer", answerType:"integer"},
    make(rng) {
      // Pick the limiting sum first, then work back to a.
      const den = ri(rng, 2, 6), num = ri(rng, 1, den - 1);
      const r = num / den;
      const S = ri(rng, 2, 20) * den;
      const a = S * (1 - r);
      return { params:{a,r,S},
        prompt:`A GP has a = ${U.fmtNum(a)} and r = ${U.fmtNum(r)}. Find its limiting sum.`,
        answerType:"number", tol:0.001,
        why:`S_inf = \\frac{a}{1-r} = \\frac{${U.fmtNum(a)}}{${U.fmtNum(1-r)}}. This exists only because |r| < 1.` };
    },
    solve(p) { return p.a / (1 - p.r); }});

  /* ════════════════ FINANCIAL ════════════════ */

  gen({id:"compound-interest", topic:"MA-M1", name:"Compound interest", diff:2,
    contract:{steps:2, magnitude:"principal 500-20000, rate ≤ 12%, n ≤ 25", answerType:"money"},
    make(rng) {
      const P = ri(rng, 5, 200) * 100, rate = ri(rng, 2, 12), n = ri(rng, 2, 25);
      return { params:{P,rate,n},
        prompt:`$${P} is invested at ${rate}% p.a. compounded annually. Find its value after ${n} years, to the nearest cent.`,
        answerType:"money", tol:0,
        why:`A = P(1+r)^n = ${P}(${U.fmtNum(1+rate/100)})^{${n}}.` };
    },
    solve(p) { return Math.round(p.P * Math.pow(1 + p.rate / 100, p.n) * 100) / 100; }});

  gen({id:"compound-periods", topic:"MA-M1", name:"Compounding more than annually", diff:3,
    contract:{steps:3, magnitude:"principal 1000-20000, 4 or 12 periods, ≤ 10 years", answerType:"money"},
    make(rng) {
      const P = ri(rng, 10, 200) * 100, rate = ri(rng, 3, 12), per = rpick(rng, [4, 12]), yrs = ri(rng, 1, 10);
      return { params:{P,rate,per,yrs},
        prompt:`$${P} is invested at ${rate}% p.a. compounded ${per === 4 ? "quarterly" : "monthly"} for ${yrs} years. Find its value, to the nearest cent.`,
        answerType:"money", tol:0,
        why:`The rate per period is \\frac{${rate}}{${per}}% and there are ${per*yrs} periods. Do NOT use ${rate}% and ${yrs}.` };
    },
    solve(p) {
      const r = p.rate / 100 / p.per, n = p.per * p.yrs;
      return Math.round(p.P * Math.pow(1 + r, n) * 100) / 100;
    }});

  gen({id:"annuity-fv", topic:"MA-M1", name:"Future value of an annuity", diff:3,
    contract:{steps:3, magnitude:"payment 100-5000, rate ≤ 10%, n ≤ 30", answerType:"money"},
    make(rng) {
      const M = ri(rng, 1, 50) * 100, rate = ri(rng, 2, 10), n = ri(rng, 5, 30);
      return { params:{M,rate,n},
        prompt:`$${M} is deposited at the END of each year at ${rate}% p.a. for ${n} years. Find the final value, to the nearest cent.`,
        answerType:"money", tol:0,
        why:`FV = M\\frac{(1+r)^n - 1}{r}. Each deposit compounds for a different number of years, which is why this is a geometric series.` };
    },
    solve(p) {
      const r = p.rate / 100;
      return Math.round(p.M * ((Math.pow(1 + r, p.n) - 1) / r) * 100) / 100;
    }});

  gen({id:"loan-balance", topic:"MA-M1", name:"Reducing-balance loan", diff:3,
    contract:{steps:3, magnitude:"principal 50k-500k, monthly rate ≤ 1%, ≤ 24 months", answerType:"money"},
    make(rng) {
      const P = ri(rng, 5, 50) * 10000, mr = ri(rng, 3, 10) / 1000, months = ri(rng, 1, 24);
      // Pick a repayment that is comfortably above the interest, so the loan reduces.
      const M = Math.round(P * mr * ri(rng, 15, 30) / 10);
      return { params:{P,mr,months,M},
        prompt:`A $${P} loan charges ${U.fmtNum(mr*100)}% per month with repayments of $${M}. Find the balance after ${months} months, to the nearest cent.`,
        answerType:"money", tol:0,
        why:`A_n = P(1+r)^n - M\\frac{(1+r)^n - 1}{r}. Interest is added to the whole balance BEFORE the repayment comes off.` };
    },
    solve(p) {
      const g = Math.pow(1 + p.mr, p.months);
      return Math.round((p.P * g - p.M * ((g - 1) / p.mr)) * 100) / 100;
    }});

  /* ════════════════ TRIGONOMETRY AND MEASUREMENT ════════════════ */

  gen({id:"radian-convert", topic:"MA-T1", name:"Convert degrees to radians", diff:1,
    contract:{steps:1, magnitude:"a standard angle, answer a multiple of pi/12", answerType:"decimal"},
    make(rng) {
      const deg = rpick(rng, [15, 30, 45, 60, 75, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]);
      return { params:{deg},
        prompt:`Convert ${deg} deg to radians. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Multiply by \\frac{pi}{180}: ${deg} \\times \\frac{pi}{180}.` };
    },
    solve(p) { return (p.deg * Math.PI) / 180; }});

  gen({id:"arc-length", topic:"MA-T1", name:"Arc length", diff:1,
    contract:{steps:1, magnitude:"radius ≤ 30, angle ≤ 3 radians", answerType:"decimal"},
    make(rng) {
      const r = ri(rng, 2, 30), th = ri(rng, 2, 30) / 10;
      return { params:{r,th},
        prompt:`Find the arc length of a sector with radius ${r} cm and angle ${U.fmtNum(th)} radians. Give 4 decimal places.`,
        answerType:"number", tol:0.001, unit:"cm",
        why:`l = r theta = ${r} \\times ${U.fmtNum(th)}. This formula requires RADIANS.` };
    },
    solve(p) { return p.r * p.th; }});

  gen({id:"sector-area", topic:"MA-T1", name:"Sector area", diff:2,
    contract:{steps:1, magnitude:"radius ≤ 20, angle ≤ 3 radians", answerType:"decimal"},
    make(rng) {
      const r = ri(rng, 2, 20), th = ri(rng, 2, 30) / 10;
      return { params:{r,th},
        prompt:`Find the area of a sector with radius ${r} cm and angle ${U.fmtNum(th)} radians. Give 4 decimal places.`,
        answerType:"number", tol:0.001, unit:"cm^2",
        why:`A = \\frac{1}{2}r^2 theta = 0.5 \\times ${r*r} \\times ${U.fmtNum(th)}.` };
    },
    solve(p) { return 0.5 * p.r * p.r * p.th; }});

  gen({id:"pythag-triple", topic:"MA-T1", name:"Right-triangle side", diff:1,
    contract:{steps:1, magnitude:"a Pythagorean triple scaled ≤ 5", answerType:"integer"},
    make(rng) {
      // Pick a triple. Randomising two sides gives an irrational third one.
      const base = rpick(rng, [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,40,41]]);
      const k = ri(rng, 1, 5);
      const [a, b, c] = base.map(x => x * k);
      return { params:{a,b,c},
        prompt:`A right triangle has legs ${a} and ${b}. Find the hypotenuse.`,
        answerType:"integer",
        why:`${a}^2 + ${b}^2 = ${a*a + b*b} = ${c}^2.` };
    },
    solve(p) { return Math.sqrt(p.a * p.a + p.b * p.b); }});

  gen({id:"cosine-rule", topic:"MA-T1", name:"Cosine rule", diff:2,
    contract:{steps:2, magnitude:"sides ≤ 30, angle 20-160 deg", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 4, 30), b = ri(rng, 4, 30), C = ri(rng, 20, 160);
      return { params:{a,b,C},
        prompt:`In a triangle, a = ${a}, b = ${b} and the included angle C = ${C} deg. Find c. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`c^2 = a^2 + b^2 - 2ab cos C = ${a*a} + ${b*b} - ${2*a*b}cos ${C} deg.` };
    },
    solve(p) {
      const C = (p.C * Math.PI) / 180;
      return Math.sqrt(p.a * p.a + p.b * p.b - 2 * p.a * p.b * Math.cos(C));
    }});

  gen({id:"triangle-area", topic:"MA-T1", name:"Area of a triangle", diff:1,
    contract:{steps:1, magnitude:"sides ≤ 30, angle 20-160 deg", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 3, 30), b = ri(rng, 3, 30), C = ri(rng, 20, 160);
      return { params:{a,b,C},
        prompt:`Find the area of a triangle with sides ${a} and ${b} enclosing ${C} deg. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`A = \\frac{1}{2}ab sin C = 0.5 \\times ${a} \\times ${b} \\times sin ${C} deg.` };
    },
    solve(p) { return 0.5 * p.a * p.b * Math.sin((p.C * Math.PI) / 180); }});

  gen({id:"trig-equation", topic:"MA-T2", name:"Solve a trig equation", diff:2,
    contract:{steps:2, magnitude:"answer the first solution in [0, 2pi)", answerType:"decimal"},
    make(rng) {
      const kind = rpick(rng, ["sin", "cos"]);
      const num = ri(rng, 1, 9) / 10;
      return { params:{kind,num},
        prompt:`Solve ${kind} x = ${U.fmtNum(num)} for the smallest positive x in radians. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Take the inverse function. There is a second solution in [0, 2pi) — ${kind === "sin" ? "pi - x" : "2pi - x"} — but this asks for the smallest.` };
    },
    solve(p) { return p.kind === "sin" ? Math.asin(p.num) : Math.acos(p.num); }});

  /* ════════════════ STATISTICS ════════════════ */

  gen({id:"z-score", topic:"MA-S3", name:"Calculate a z-score", diff:1,
    contract:{steps:1, magnitude:"|z| ≤ 3, exact to 4 dp", answerType:"decimal"},
    make(rng) {
      // Pick the z-score first, then build a raw score that produces it exactly.
      const mu = ri(rng, 20, 200), sd = ri(rng, 2, 25);
      const z = (ri(rng, -30, 30) || 5) / 10;
      const x = mu + z * sd;
      return { params:{mu,sd,x},
        prompt:`A distribution has mu = ${mu} and sigma = ${sd}. Find the z-score of x = ${U.fmtNum(x)}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`z = \\frac{x - mu}{sigma} = \\frac{${U.fmtNum(x - mu)}}{${sd}}.` };
    },
    solve(p) { return (p.x - p.mu) / p.sd; }});

  gen({id:"z-inverse", topic:"MA-S3", name:"Raw score from a z-score", diff:2,
    contract:{steps:1, magnitude:"|z| ≤ 3", answerType:"decimal"},
    make(rng) {
      const mu = ri(rng, 20, 200), sd = ri(rng, 2, 25), z = (ri(rng, -25, 25) || 8) / 10;
      return { params:{mu,sd,z},
        prompt:`A distribution has mu = ${mu} and sigma = ${sd}. Find the raw score with z = ${U.fmtNum(z)}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Rearrange to x = mu + z sigma = ${mu} + ${U.fmtNum(z)}(${sd}).` };
    },
    solve(p) { return p.mu + p.z * p.sd; }});

  gen({id:"normal-tail", topic:"MA-S3", name:"Normal distribution percentage", diff:2,
    contract:{steps:2, magnitude:"z is a whole number 1-3, empirical rule applies", answerType:"decimal"},
    make(rng) {
      const mu = ri(rng, 40, 160), sd = ri(rng, 4, 20), z = ri(rng, 1, 3);
      const dir = rpick(rng, ["above", "below"]);
      const x = dir === "above" ? mu + z * sd : mu - z * sd;
      return { params:{z,dir},
        prompt:`Scores are N(${mu}, ${sd}^2). Using the empirical rule, what percentage lie ${dir} ${x}? Give 2 decimal places.`,
        answerType:"number", tol:0.02,
        why:`That is z = ${dir === "above" ? "" : "-"}${z}. The empirical rule gives 68/95/99.7 inside, so each tail is half of what remains.` };
    },
    solve(p) {
      const inside = { 1: 68, 2: 95, 3: 99.7 }[p.z];
      return (100 - inside) / 2;
    }});

  gen({id:"expected-value", topic:"MA-S1", name:"Expected value", diff:2,
    contract:{steps:2, magnitude:"3 outcomes, probabilities in tenths", answerType:"decimal"},
    make(rng) {
      // Probabilities in tenths summing to exactly 10, so no float dust.
      const p1 = ri(rng, 1, 6), p2 = ri(rng, 1, 10 - p1 - 1), p3 = 10 - p1 - p2;
      const v = [ri(rng, 1, 9), ri(rng, 1, 9), ri(rng, 1, 9)];
      return { params:{ps:[p1,p2,p3], v},
        prompt:`X takes values ${v[0]}, ${v[1]}, ${v[2]} with probabilities ${p1/10}, ${p2/10}, ${p3/10}. Find E(X). Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`E(X) = Sum x P(X = x) = ${v[0]}(${p1/10}) + ${v[1]}(${p2/10}) + ${v[2]}(${p3/10}).` };
    },
    solve(p) { return p.ps.reduce((s, q, i) => s + (q / 10) * p.v[i], 0); }});

  gen({id:"variance-drv", topic:"MA-S1", name:"Variance of a discrete variable", diff:3,
    contract:{steps:3, magnitude:"3 outcomes, probabilities in tenths", answerType:"decimal"},
    make(rng) {
      const p1 = ri(rng, 1, 6), p2 = ri(rng, 1, 10 - p1 - 1), p3 = 10 - p1 - p2;
      const v = [ri(rng, 0, 5), ri(rng, 0, 5), ri(rng, 0, 5)];
      return { params:{ps:[p1,p2,p3], v},
        prompt:`X takes values ${v[0]}, ${v[1]}, ${v[2]} with probabilities ${p1/10}, ${p2/10}, ${p3/10}. Find Var(X). Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Var(X) = E(X^2) - [E(X)]^2. Compute both expectations, then subtract the SQUARE of the mean.` };
    },
    solve(p) {
      const ex = p.ps.reduce((s, q, i) => s + (q / 10) * p.v[i], 0);
      const ex2 = p.ps.reduce((s, q, i) => s + (q / 10) * p.v[i] * p.v[i], 0);
      return ex2 - ex * ex;
    }});

  gen({id:"prob-tree", topic:"MA-S1", name:"Total probability", diff:2,
    contract:{steps:2, magnitude:"probabilities in tenths, answer in [0, 1]", answerType:"decimal"},
    make(rng) {
      const pa = ri(rng, 1, 9) / 10, p1 = ri(rng, 1, 9) / 10, p2 = ri(rng, 1, 9) / 10;
      return { params:{pa,p1,p2},
        prompt:`P(A) = ${U.fmtNum(pa)}. Given A, P(B) = ${U.fmtNum(p1)}; given not-A, P(B) = ${U.fmtNum(p2)}. Find P(B). Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Total probability: P(B) = P(A)P(B|A) + P(A')P(B|A') = ${U.fmtNum(pa)}(${U.fmtNum(p1)}) + ${U.fmtNum(1-pa)}(${U.fmtNum(p2)}).` };
    },
    solve(p) { return p.pa * p.p1 + (1 - p.pa) * p.p2; }});

  gen({id:"regression", topic:"MA-S2", name:"Least-squares gradient", diff:3,
    contract:{steps:3, magnitude:"5 points with integer coordinates ≤ 20", answerType:"decimal"},
    make(rng) {
      // Pick the LINE first, then place points on it with small integer jitter.
      const m = ri(rng, 1, 5), c = ri(rng, 0, 10);
      const pts = [];
      for (let i = 1; i <= 5; i++) pts.push([i * 2, m * i * 2 + c + ri(rng, -1, 1)]);
      return { params:{pts},
        prompt:`Find the least-squares gradient for the points ${pts.map(p => "(" + p[0] + ", " + p[1] + ")").join(", ")}. Give 4 decimal places.`,
        answerType:"number", tol:0.002,
        why:`m = \\frac{Sum(x - \\bar{x})(y - \\bar{y})}{Sum(x - \\bar{x})^2}. The underlying line here had gradient ${m}.` };
    },
    solve(p) {
      const n = p.pts.length;
      const mx = p.pts.reduce((s, q) => s + q[0], 0) / n;
      const my = p.pts.reduce((s, q) => s + q[1], 0) / n;
      let sxy = 0, sxx = 0;
      for (const [x, y] of p.pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; }
      return sxy / sxx;
    }});

  gen({id:"mean-sd", topic:"MA-S2", name:"Mean of a data set", diff:1,
    contract:{steps:1, magnitude:"6 values ≤ 60", answerType:"decimal"},
    make(rng) {
      const vals = [];
      for (let i = 0; i < 6; i++) vals.push(ri(rng, 1, 60));
      return { params:{vals},
        prompt:`Find the mean of ${vals.join(", ")}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Add the six values (total ${vals.reduce((a,b)=>a+b,0)}) and divide by 6.` };
    },
    solve(p) { return p.vals.reduce((a, b) => a + b, 0) / p.vals.length; }});

  /* ════════════════ LIMITS ════════════════ */

  gen({id:"limit-factor", topic:"MA-C1", name:"Limit by factorising", diff:2,
    contract:{steps:2, magnitude:"roots are integers in [-8, 8]", answerType:"integer"},
    make(rng) {
      const a = rnz(rng, 8);
      let b = rnz(rng, 8);
      if (b === a) b = a + 1;
      return { params:{a,b},
        prompt:`Evaluate \\lim_{x->${a}}\\frac{x^2 ${-(a+b)<0?"- "+Math.abs(a+b):"+ "+(-(a+b))}x ${a*b<0?"- "+Math.abs(a*b):"+ "+(a*b)}}{x ${-a<0?"- "+Math.abs(-a):"+ "+(-a)}}.`,
        answerType:"integer",
        why:`The numerator factors as (x - ${a})(x - ${b}). Cancel the common factor, leaving x - ${b}, then substitute.` };
    },
    solve(p) { return p.a - p.b; }});

  gen({id:"limit-infinity", topic:"MA-C1", name:"Limit at infinity", diff:2,
    contract:{steps:2, magnitude:"leading coefficients ≤ 9", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 1, 9), b = ri(rng, 1, 9), c = rnz(rng, 9), d = rnz(rng, 9);
      return { params:{a,b},
        prompt:`Evaluate \\lim_{x->inf}\\frac{${a}x^2 ${c<0?"- "+Math.abs(c):"+ "+c}x}{${b}x^2 ${d<0?"- "+Math.abs(d):"+ "+d}}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Divide top and bottom by x^2. Every lower-order term vanishes, leaving \\frac{${a}}{${b}}.` };
    },
    solve(p) { return p.a / p.b; }});

  /* ═══════════════════════════════════════════════════════════
     EXTENSION 1 GENERATORS — registered unconditionally but
     filtered out of the pool by MQ.Gen.enabled() when TIERS
     excludes "ME", exactly like the question banks.
     ═══════════════════════════════════════════════════════════ */

  gen({id:"ncr", topic:"ME-A1", name:"Evaluate nCr", diff:1,
    contract:{steps:1, magnitude:"answer between 10 and 100000 — the band is chosen FIRST", answerType:"integer"},
    make(rng) {
      /* nCr explodes. Randomising n and r gives you either 6 or 2.7×10^14 with
         nothing in between, so pick a band and search inside it. */
      const candidates = [];
      for (let n = 5; n <= 20; n++) {
        for (let r = 2; r <= n - 2; r++) {
          const v = MQ.Expr.choose(n, r);
          if (v >= 10 && v <= 100000) candidates.push([n, r]);
        }
      }
      const [n, r] = rpick(rng, candidates);
      return { params:{n,r},
        prompt:`Evaluate nCr(${n},${r}).`,
        answerType:"integer",
        why:`\\frac{${n}!}{${r}!(${n-r})!}. Cancel before multiplying — the factorials are far larger than the answer.` };
    },
    solve(p) { return MQ.Expr.choose(p.n, p.r); }});

  gen({id:"npr", topic:"ME-A1", name:"Evaluate nPr", diff:1,
    contract:{steps:1, magnitude:"answer between 20 and 100000", answerType:"integer"},
    make(rng) {
      const candidates = [];
      for (let n = 4; n <= 12; n++) {
        for (let r = 2; r <= Math.min(n, 5); r++) {
          const v = MQ.Expr.perm(n, r);
          if (v >= 20 && v <= 100000) candidates.push([n, r]);
        }
      }
      const [n, r] = rpick(rng, candidates);
      return { params:{n,r},
        prompt:`Evaluate nPr(${n},${r}).`,
        answerType:"integer",
        why:`${n} \\times ${n-1} \\times ... for ${r} factors, i.e. \\frac{${n}!}{${n-r}!}.` };
    },
    solve(p) { return MQ.Expr.perm(p.n, p.r); }});

  gen({id:"arrangements", topic:"ME-A1", name:"Arrangements with repeats", diff:2,
    contract:{steps:2, magnitude:"word length ≤ 8, answer ≤ 20160", answerType:"integer"},
    make(rng) {
      const words = [["BANANA",6,[3,2]],["LEVEL",5,[2,2]],["SUCCESS",7,[3,2]],
                     ["ALGEBRA",7,[2]],["COMMITTEE",9,[2,2,2]],["PARABOLA",8,[3]]];
      const [word, n, reps] = rpick(rng, words);
      return { params:{n,reps,word},
        prompt:`How many distinct arrangements of the letters in ${word}?`,
        answerType:"integer",
        why:`\\frac{${n}!}{${reps.map(r => r + "!").join("")}} — divide out the identical letters.` };
    },
    solve(p) {
      let out = MQ.Expr.factorial(p.n);
      p.reps.forEach(r => { out /= MQ.Expr.factorial(r); });
      return out;
    }});

  gen({id:"binomial-coef", topic:"ME-A1", name:"Binomial expansion coefficient", diff:2,
    contract:{steps:2, magnitude:"n ≤ 8, |coefficient| ≤ 200000", answerType:"integer"},
    make(rng) {
      const n = ri(rng, 4, 8), k = ri(rng, 1, n - 1), a = ri(rng, 1, 3);
      return { params:{n,k,a},
        prompt:`Find the coefficient of x^${k} in (${a === 1 ? "" : a} + x)^${n}.`,
        answerType:"integer",
        why:`nCr(${n},${k}) \\times ${a}^{${n-k}}. Forgetting the power on the constant is the standard slip.` };
    },
    solve(p) { return MQ.Expr.choose(p.n, p.k) * Math.pow(p.a, p.n - p.k); }});

  gen({id:"sub-integral", topic:"ME-C2", name:"Integration by substitution", diff:3,
    contract:{steps:3, magnitude:"u = x^2 + c, index ≤ 4, limits 0 to ≤ 2", answerType:"decimal"},
    make(rng) {
      /* Pick u and the outer function, then COMPOSE FORWARD. Working the other
         way round gives integrands with no closed-form antiderivative. */
      const c = ri(rng, 1, 5), n = ri(rng, 2, 4), top = ri(rng, 1, 2);
      return { params:{c,n,top},
        prompt:`Evaluate int_0^{${top}} 2x(x^2 + ${c})^${n} dx. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`Let u = x^2 + ${c}, so du = 2x dx. The integral becomes int u^${n} du = \\frac{u^{${n+1}}}{${n+1}}, evaluated from ${c} to ${top*top + c}.` };
    },
    solve(p) {
      const F = u => Math.pow(u, p.n + 1) / (p.n + 1);
      return F(p.top * p.top + p.c) - F(p.c);
    }});

  gen({id:"invtrig-eval", topic:"ME-T1", name:"Evaluate an inverse trig function", diff:2,
    contract:{steps:1, magnitude:"argument in [-1, 1], answer in the principal range", answerType:"decimal"},
    make(rng) {
      const kind = rpick(rng, ["sin", "cos", "tan"]);
      const x = kind === "tan" ? (ri(rng, -30, 30) || 7) / 10 : (ri(rng, -9, 9) || 5) / 10;
      return { params:{kind,x},
        prompt:`Evaluate ${kind}^{-1}(${U.fmtNum(x)}) in radians. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`The answer must lie in the principal range: ${kind === "cos" ? "[0, pi]" : "[-\\frac{pi}{2}, \\frac{pi}{2}]"}.` };
    },
    solve(p) {
      return p.kind === "sin" ? Math.asin(p.x) : p.kind === "cos" ? Math.acos(p.x) : Math.atan(p.x);
    }});

  gen({id:"invtrig-deriv", topic:"ME-C2", name:"Derivative of an inverse trig function", diff:3,
    contract:{steps:2, magnitude:"|x| ≤ 0.8, coefficient ≤ 4", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 1, 4), x = (ri(rng, -8, 8) || 3) / 10 / a;
      const kind = rpick(rng, ["sin", "tan"]);
      return { params:{a,x,kind},
        prompt:`If y = ${kind}^{-1}(${a === 1 ? "" : a}x), find \\frac{dy}{dx} at x = ${U.fmtNum(x)}. Give 4 decimal places.`,
        answerType:"number", tol:0.002,
        why:kind === "sin"
          ? `\\frac{dy}{dx} = \\frac{${a}}{\\sqrt{1 - ${a*a}x^2}}.`
          : `\\frac{dy}{dx} = \\frac{${a}}{1 + ${a*a}x^2}.` };
    },
    solve(p) {
      const u = p.a * p.x;
      return p.kind === "sin" ? p.a / Math.sqrt(1 - u * u) : p.a / (1 + u * u);
    }});

  gen({id:"double-angle", topic:"ME-T2", name:"Double angle", diff:2,
    contract:{steps:2, magnitude:"sin theta from a Pythagorean triple", answerType:"decimal"},
    make(rng) {
      // Use a triple so cos theta is rational and the answer is exact.
      const [a, b, c] = rpick(rng, [[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);
      const which = rpick(rng, ["sin2", "cos2"]);
      return { params:{a,b,c,which},
        prompt:`If sin theta = \\frac{${a}}{${c}} and theta is acute, find ${which === "sin2" ? "sin" : "cos"} 2theta. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`cos theta = \\frac{${b}}{${c}} from the ${a}-${b}-${c} triangle. Then ${which === "sin2" ? "sin 2theta = 2 sin theta cos theta" : "cos 2theta = 1 - 2sin^2 theta"}.` };
    },
    solve(p) {
      const s = p.a / p.c, co = p.b / p.c;
      return p.which === "sin2" ? 2 * s * co : 1 - 2 * s * s;
    }});

  gen({id:"auxiliary", topic:"ME-T2", name:"Auxiliary angle amplitude", diff:2,
    contract:{steps:2, magnitude:"a and b from a Pythagorean triple, so R is an integer", answerType:"integer"},
    make(rng) {
      const [a, b, c] = rpick(rng, [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,40,41]]);
      return { params:{a,b,c},
        prompt:`Write ${a}sin x + ${b}cos x as Rsin(x + alpha). Find R.`,
        answerType:"integer",
        why:`R = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a + b*b}} = ${c}. It comes from Pythagoras, not from adding.` };
    },
    solve(p) { return Math.sqrt(p.a * p.a + p.b * p.b); }});

  gen({id:"related-rates", topic:"ME-C1", name:"Related rates", diff:3,
    contract:{steps:3, magnitude:"radius ≤ 12, rate ≤ 2, answer a multiple of pi", answerType:"decimal"},
    make(rng) {
      const r = ri(rng, 2, 12), dr = ri(rng, 1, 20) / 10;
      const shape = rpick(rng, ["sphere", "circle"]);
      return { params:{r,dr,shape},
        prompt:shape === "sphere"
          ? `A sphere's radius grows at ${U.fmtNum(dr)} cm/s. Find \\frac{dV}{dt} when r = ${r} cm, as a multiple of pi. Give 4 decimal places.`
          : `A circle's radius grows at ${U.fmtNum(dr)} cm/s. Find \\frac{dA}{dt} when r = ${r} cm, as a multiple of pi. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:shape === "sphere"
          ? `\\frac{dV}{dr} = 4pi r^2 = ${4*r*r}pi, and \\frac{dV}{dt} = \\frac{dV}{dr} \\times \\frac{dr}{dt}.`
          : `\\frac{dA}{dr} = 2pi r = ${2*r}pi, and \\frac{dA}{dt} = \\frac{dA}{dr} \\times \\frac{dr}{dt}.` };
    },
    solve(p) {
      return p.shape === "sphere" ? 4 * p.r * p.r * p.dr : 2 * p.r * p.dr;
    }});

  gen({id:"cooling", topic:"ME-C1", name:"Newton's law of cooling", diff:3,
    contract:{steps:3, magnitude:"temperatures 0-100, answer < 200 minutes", answerType:"decimal"},
    make(rng) {
      /* Pick the ambient temperature and both excesses first, so the log of
         their ratio is always defined and the answer is always positive. */
      const amb = ri(rng, 10, 25);
      const e0 = ri(rng, 40, 70);
      const e1 = ri(rng, 10, e0 - 10);
      const t1 = ri(rng, 3, 15);
      const eT = ri(rng, 2, e1 - 1);
      return { params:{amb,e0,e1,t1,eT},
        prompt:`A body at ${amb + e0} deg cools in a ${amb} deg room, reaching ${amb + e1} deg after ${t1} minutes. When does it reach ${amb + eT} deg? Give 4 decimal places.`,
        answerType:"number", tol:0.002, unit:"minutes",
        why:`Work with the EXCESS over ambient. ${e1} = ${e0}e^{-k \\times ${t1}} gives k, then solve ${eT} = ${e0}e^{-kt}.` };
    },
    solve(p) {
      const k = -Math.log(p.e1 / p.e0) / p.t1;
      return -Math.log(p.eT / p.e0) / k;
    }});

  gen({id:"volume-revolution", topic:"ME-C3", name:"Volume of revolution", diff:3,
    contract:{steps:3, magnitude:"answer a multiple of pi, |answer| < 500", answerType:"decimal"},
    make(rng) {
      const a = ri(rng, 1, 3), n = ri(rng, 1, 2), b = ri(rng, 1, 4);
      return { params:{a,n,b},
        prompt:`Find the volume when y = ${a === 1 ? "" : a}x^${n} is rotated about the x-axis from 0 to ${b}, as a multiple of pi. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`V = pi int_0^{${b}} ${a*a}x^${2*n} dx = pi \\times \\frac{${a*a}(${b})^{${2*n+1}}}{${2*n+1}}.` };
    },
    solve(p) { return (p.a * p.a * Math.pow(p.b, 2 * p.n + 1)) / (2 * p.n + 1); }});

  gen({id:"binomial-prob", topic:"ME-S1", name:"Binomial probability", diff:2,
    contract:{steps:2, magnitude:"n ≤ 12, p in tenths, answer in (0, 1)", answerType:"decimal"},
    make(rng) {
      const n = ri(rng, 4, 12), k = ri(rng, 1, n - 1), pp = ri(rng, 2, 8) / 10;
      return { params:{n,k,pp},
        prompt:`For X ~ Bin(${n}, ${U.fmtNum(pp)}), find P(X = ${k}). Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`nCr(${n},${k}) \\times ${U.fmtNum(pp)}^{${k}} \\times ${U.fmtNum(1-pp)}^{${n-k}}.` };
    },
    solve(p) {
      return MQ.Expr.choose(p.n, p.k) * Math.pow(p.pp, p.k) * Math.pow(1 - p.pp, p.n - p.k);
    }});

  gen({id:"binomial-mean", topic:"ME-S1", name:"Binomial mean and variance", diff:2,
    contract:{steps:2, magnitude:"n ≤ 200, p in tenths", answerType:"decimal"},
    make(rng) {
      const n = ri(rng, 2, 40) * 5, pp = ri(rng, 1, 9) / 10;
      const which = rpick(rng, ["mean", "var", "sd"]);
      return { params:{n,pp,which},
        prompt:`For X ~ Bin(${n}, ${U.fmtNum(pp)}), find the ${which === "mean" ? "mean" : which === "var" ? "variance" : "standard deviation"}. Give 4 decimal places.`,
        answerType:"number", tol:0.001,
        why:`mu = np and sigma^2 = np(1-p). The standard deviation is the square root of the variance.` };
    },
    solve(p) {
      const mean = p.n * p.pp, v = p.n * p.pp * (1 - p.pp);
      return p.which === "mean" ? mean : p.which === "var" ? v : Math.sqrt(v);
    }});

  gen({id:"projectile-range", topic:"ME-V1", name:"Projectile range", diff:3,
    contract:{steps:3, magnitude:"target 20-200 m — the LANDING POINT is chosen first", answerType:"decimal"},
    make(rng) {
      /* Pick the landing point and the angle, then DERIVE the launch speed.
         Randomising angle and speed puts the target off the canvas. */
      const range = ri(rng, 2, 20) * 10;
      const angle = rpick(rng, [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]);
      const g = 9.8;
      const V = Math.sqrt((range * g) / Math.sin((2 * angle * Math.PI) / 180));
      const which = rpick(rng, ["time", "height"]);
      return { params:{V,angle,g,which},
        prompt:`A projectile is launched at ${U.fmtNum(U.sigFig(V,5))} m/s at ${angle} deg (g = 9.8). Find the ${which === "time" ? "time of flight, in seconds" : "maximum height, in metres"}. Give 4 decimal places.`,
        answerType:"number", tol:0.002,
        why:which === "time"
          ? `Time of flight = \\frac{2V sin theta}{g} — the descent takes as long as the climb.`
          : `Maximum height = \\frac{V^2 sin^2 theta}{2g}, from v^2 = u^2 - 2gh with the vertical velocity zero at the top.` };
    },
    solve(p) {
      const th = (p.angle * Math.PI) / 180;
      return p.which === "time"
        ? (2 * p.V * Math.sin(th)) / p.g
        : (p.V * p.V * Math.sin(th) * Math.sin(th)) / (2 * p.g);
    }});

  gen({id:"vector-magnitude", topic:"ME-V1", name:"Vector magnitude", diff:1,
    contract:{steps:1, magnitude:"components from a Pythagorean triple, integer answer", answerType:"integer"},
    make(rng) {
      const [a, b, c] = rpick(rng, [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]]);
      const sx = rsign(rng), sy = rsign(rng);
      return { params:{x: sx*a, y: sy*b, c},
        prompt:`Find |\\vec{u}| where \\vec{u} = ${sx*a}i ${sy*b<0?"- "+b:"+ "+b}j.`,
        answerType:"integer",
        why:`\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a+b*b}} = ${c}. Adding the components instead gives ${a+b}.` };
    },
    solve(p) { return Math.sqrt(p.x * p.x + p.y * p.y); }});

  gen({id:"vector-dot", topic:"ME-V1", name:"Dot product", diff:1,
    contract:{steps:1, magnitude:"components ≤ 9", answerType:"integer"},
    make(rng) {
      const a = rnz(rng, 9), b = rnz(rng, 9), c = rnz(rng, 9), d = rnz(rng, 9);
      return { params:{a,b,c,d},
        prompt:`Find (${a}i ${b<0?"- "+Math.abs(b):"+ "+b}j) \\cdot (${c}i ${d<0?"- "+Math.abs(d):"+ "+d}j).`,
        answerType:"integer",
        why:`${a}(${c}) + ${b}(${d}) = ${a*c} + ${b*d}. The result is a SCALAR.` };
    },
    solve(p) { return p.a * p.c + p.b * p.d; }});

  gen({id:"vector-angle", topic:"ME-V1", name:"Angle between vectors", diff:3,
    contract:{steps:3, magnitude:"components ≤ 9, answer in degrees", answerType:"decimal"},
    make(rng) {
      const a = rnz(rng, 9), b = rnz(rng, 9), c = rnz(rng, 9), d = rnz(rng, 9);
      return { params:{a,b,c,d},
        prompt:`Find the angle in degrees between ${a}i ${b<0?"- "+Math.abs(b):"+ "+b}j and ${c}i ${d<0?"- "+Math.abs(d):"+ "+d}j. Give 4 decimal places.`,
        answerType:"number", tol:0.002, unit:"deg",
        why:`cos theta = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}||\\vec{v}|}, then take the inverse cosine.` };
    },
    solve(p) {
      const dot = p.a * p.c + p.b * p.d;
      const m1 = Math.sqrt(p.a * p.a + p.b * p.b), m2 = Math.sqrt(p.c * p.c + p.d * p.d);
      return (Math.acos(U.clamp(dot / (m1 * m2), -1, 1)) * 180) / Math.PI;
    }});

  gen({id:"poly-remainder", topic:"ME-F2", name:"Remainder theorem", diff:2,
    contract:{steps:1, magnitude:"cubic with coefficients ≤ 6, |a| ≤ 4", answerType:"integer"},
    make(rng) {
      const p3 = rnz(rng, 4), p1 = rnz(rng, 6), p0 = rnz(rng, 9), a = rnz(rng, 4);
      return { params:{p3,p1,p0,a},
        prompt:`Find the remainder when P(x) = ${p3}x^3 ${p1<0?"- "+Math.abs(p1):"+ "+p1}x ${p0<0?"- "+Math.abs(p0):"+ "+p0} is divided by (x ${-a<0?"- "+Math.abs(-a):"+ "+(-a)}).`,
        answerType:"integer",
        why:`The remainder theorem: substitute x = ${a}. No long division needed.` };
    },
    solve(p) { return p.p3 * Math.pow(p.a, 3) + p.p1 * p.a + p.p0; }});

  gen({id:"roots-coefficients", topic:"ME-F2", name:"Sum of squares of roots", diff:3,
    contract:{steps:3, magnitude:"integer roots ≤ 9", answerType:"integer"},
    make(rng) {
      // Pick the roots, then build the quadratic — so the answer is an integer.
      const r1 = rnz(rng, 9), r2 = rnz(rng, 9);
      const b = -(r1 + r2), c = r1 * r2;
      return { params:{r1,r2,b,c},
        prompt:`alpha and beta are the roots of x^2 ${b<0?"- "+Math.abs(b):"+ "+b}x ${c<0?"- "+Math.abs(c):"+ "+c} = 0. Find alpha^2 + beta^2.`,
        answerType:"integer",
        why:`(alpha+beta)^2 - 2alpha beta = (${-b})^2 - 2(${c}). Never find the roots individually for this.` };
    },
    solve(p) { return p.b * p.b - 2 * p.c; }});

  /* ── the registry ─────────────────────────────────────────── */

  /** Every generator, unfiltered. The validator uses this. */
  const all = () => LIST;

  /** Generators this build ships, tier-filtered like Bank.all(). */
  let cached = null;
  const enabled = () => (cached || (cached = LIST.filter(g => MQ.DATA.tierEnabled(g.topic))));

  const byId = id => LIST.find(g => g.id === id);

  /**
   * Build one question. `seed` makes it reproducible: the same seed always
   * gives the same question, which is how a test failure in the wild becomes
   * a test case.
   */
  function build(g, seed) {
    const rng = U.seededRandom(seed === undefined ? U.randInt(1, 2e9) : U.hash(String(seed)));
    const item = g.make(rng);
    // The answer is ALWAYS recomputed by the independent forward path.
    item.answer = g.solve(item.params);
    item.gen = g.id;
    item.topic = g.topic;
    item.diff = g.diff;
    item.seed = seed;
    return item;
  }

  /** Draw a random generated question from the enabled pool. */
  function draw(opts) {
    const o = opts || {};
    let pool = enabled();
    if (o.topics && o.topics.length) pool = pool.filter(g => o.topics.includes(g.topic));
    if (o.maxDiff) pool = pool.filter(g => g.diff <= o.maxDiff);
    if (!pool.length) pool = enabled();
    return build(U.pick(pool), o.seed);
  }

  return { all, enabled, byId, build, draw };
})();
