/* Recursive-descent expression parser, evaluator and equivalence check.

   This exists so the app can mark free-response algebra without a CAS and
   without ever calling eval(). Two reasons, in order of importance:

   1. It is correct. `2sin(x)cos(x)` IS `sin(2x)`, and no string comparison
      will ever agree. Evaluating both at several random x values will.
   2. It gives better errors than a thrown SyntaxError — "unmatched bracket
      at character 7" is a hint; "Unexpected token )" is a shrug.

   Never pass student input to eval() or new Function(). Not as a safety
   ritual — the parser is simply the better tool. */
window.MQ = window.MQ || {};

MQ.Expr = (function () {

  /* ── tokeniser ─────────────────────────────────────────────── */

  const FUNCS = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x), cot: x => 1 / Math.tan(x),
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    ln: Math.log, log: Math.log10, lg: Math.log10, log10: Math.log10, log2: Math.log2,
    exp: Math.exp, sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs,
    floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign
  };
  const FUNCS2 = {
    logb: (b, x) => Math.log(x) / Math.log(b),
    ncr: (n, r) => choose(n, r),
    npr: (n, r) => perm(n, r),
    min: Math.min, max: Math.max, atan2: Math.atan2, pow: Math.pow
  };
  const CONSTS = { pi: Math.PI, "π": Math.PI, e: Math.E, tau: Math.PI * 2, inf: Infinity, infinity: Infinity };

  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }
  function choose(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || r < 0 || r > n) return NaN;
    r = Math.min(r, n - r);
    let out = 1;
    for (let i = 0; i < r; i++) out = (out * (n - i)) / (i + 1);
    return Math.round(out);
  }
  function perm(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || r < 0 || r > n) return NaN;
    let out = 1;
    for (let i = 0; i < r; i++) out *= n - i;
    return out;
  }

  class ParseError extends Error {
    constructor(msg, pos) { super(msg); this.pos = pos; this.friendly = msg; }
  }

  /** Normalise the shorthands students and content files actually type. */
  function normalise(src) {
    return String(src)
      .replace(/√/g, "sqrt")
      .replace(/π/g, "pi")
      .replace(/×/g, "*").replace(/·/g, "*").replace(/÷/g, "/")
      .replace(/−/g, "-").replace(/–/g, "-")
      .replace(/\{/g, "(").replace(/\}/g, ")")
      .replace(/\[/g, "(").replace(/\]/g, ")")
      .replace(/\\/g, "")           // \frac{a}{b} → frac(a)(b) is handled below
      .replace(/frac\(([^()]*)\)\(([^()]*)\)/g, "(($1)/($2))")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenise(src) {
    const s = normalise(src);
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (c === " ") { i++; continue; }
      if (/[0-9.]/.test(c)) {
        const m = /^\d*\.?\d+(e[-+]?\d+)?/i.exec(s.slice(i));
        if (!m) throw new ParseError("That number doesn't look right", i);
        out.push({ t: "num", v: parseFloat(m[0]), i });
        i += m[0].length;
        continue;
      }
      if (/[A-Za-z]/.test(c)) {
        const m = /^[A-Za-z][A-Za-z0-9_]*/.exec(s.slice(i));
        out.push({ t: "name", v: m[0].toLowerCase(), raw: m[0], i });
        i += m[0].length;
        continue;
      }
      if ("+-*/^()|,!%".includes(c)) { out.push({ t: c, i }); i++; continue; }
      throw new ParseError(`I don't understand "${c}" (character ${i + 1})`, i);
    }
    return out;
  }

  /* ── parser ────────────────────────────────────────────────────
     expr    := term (('+'|'-') term)*
     term    := unary (('*'|'/')? unary)*        ← the gap IS multiplication
     unary   := ('-'|'+')* power
     power   := postfix ('^' unary)?             ← right-associative
     postfix := atom '!'*
     atom    := num | const | var | fn '(' args ')' | '(' expr ')' | '|' expr '|'
     ────────────────────────────────────────────────────────────── */

  function parse(src) {
    const toks = tokenise(src);
    let p = 0;

    const peek = () => toks[p];
    const at = t => toks[p] && toks[p].t === t;
    function expect(t, what) {
      if (!at(t)) {
        const tok = peek();
        throw new ParseError(
          tok ? `Expected ${what} at character ${tok.i + 1}` : `Expected ${what} — the expression ends early`,
          tok ? tok.i : src.length);
      }
      return toks[p++];
    }

    function expr() {
      let node = term();
      while (at("+") || at("-")) {
        const op = toks[p++].t;
        node = { k: "bin", op, a: node, b: term() };
      }
      return node;
    }

    function term() {
      let node = unary();
      for (;;) {
        if (at("*") || at("/")) {
          const op = toks[p++].t;
          node = { k: "bin", op, a: node, b: unary() };
          continue;
        }
        // Implicit multiplication: 2x, 3(x+1), x y, 2sin(x)cos(x).
        const t = peek();
        if (t && (t.t === "num" || t.t === "name" || t.t === "(" || t.t === "|")) {
          node = { k: "bin", op: "*", a: node, b: unary() };
          continue;
        }
        return node;
      }
    }

    function unary() {
      if (at("-")) { p++; return { k: "neg", a: unary() }; }
      if (at("+")) { p++; return unary(); }
      return power();
    }

    function power() {
      const base = postfix();
      if (at("^")) { p++; return { k: "bin", op: "^", a: base, b: unary() }; }
      return base;
    }

    function postfix() {
      let node = atom();
      while (at("!") || at("%")) {
        node = toks[p++].t === "!" ? { k: "fact", a: node } : { k: "pctof", a: node };
      }
      return node;
    }

    function atom() {
      const t = peek();
      if (!t) throw new ParseError("The expression ends before it's finished", src.length);

      if (t.t === "num") { p++; return { k: "num", v: t.v }; }

      if (t.t === "(") {
        p++;
        const inner = expr();
        if (!at(")")) throw new ParseError(`Unmatched bracket — opened at character ${t.i + 1}`, t.i);
        p++;
        return inner;
      }

      if (t.t === "|") {
        p++;
        const inner = expr();
        if (!at("|")) throw new ParseError(`Unmatched | — opened at character ${t.i + 1}`, t.i);
        p++;
        return { k: "call", f: "abs", args: [inner] };
      }

      if (t.t === "name") {
        p++;
        const name = t.v;
        if (FUNCS[name] || FUNCS2[name]) {
          // sin x is legal shorthand; sin(x) is the normal case.
          if (at("(")) {
            p++;
            const args = [expr()];
            while (at(",")) { p++; args.push(expr()); }
            if (!at(")")) throw new ParseError(`Unmatched bracket after ${t.raw}`, t.i);
            p++;
            if (FUNCS2[name] && args.length === 2) return { k: "call2", f: name, args };
            if (args.length !== 1) throw new ParseError(`${t.raw} takes one value`, t.i);
            return { k: "call", f: name, args };
          }
          if (FUNCS2[name]) throw new ParseError(`${t.raw} needs two values, like ${t.raw}(5,2)`, t.i);
          // sin^2 x — a notation this course uses constantly.
          if (at("^")) {
            p++;
            const pow = unary();
            return { k: "bin", op: "^", a: { k: "call", f: name, args: [unary()] }, b: pow };
          }
          return { k: "call", f: name, args: [unary()] };
        }
        if (name in CONSTS) return { k: "num", v: CONSTS[name] };
        return { k: "var", v: name };
      }

      throw new ParseError(`Unexpected "${t.t}" at character ${t.i + 1}`, t.i);
    }

    const tree = expr();
    if (p < toks.length) {
      throw new ParseError(`Extra input from character ${toks[p].i + 1} — check your brackets`, toks[p].i);
    }
    return tree;
  }

  /** Parse, returning { ok, ast } or { ok:false, error }. Never throws. */
  function tryParse(src) {
    try { return { ok: true, ast: parse(src) }; }
    catch (e) { return { ok: false, error: e.friendly || String(e.message || e), pos: e.pos }; }
  }

  /* ── evaluator ─────────────────────────────────────────────── */

  function evaluate(node, vars) {
    const v = vars || {};
    switch (node.k) {
      case "num": return node.v;
      case "var": {
        if (node.v in v) return v[node.v];
        if (node.v in CONSTS) return CONSTS[node.v];
        return NaN;
      }
      case "neg": return -evaluate(node.a, v);
      case "fact": return factorial(evaluate(node.a, v));
      case "pctof": return evaluate(node.a, v) / 100;
      case "call": {
        const f = FUNCS[node.f];
        return f ? f(evaluate(node.args[0], v)) : NaN;
      }
      case "call2": {
        const f = FUNCS2[node.f];
        return f ? f(evaluate(node.args[0], v), evaluate(node.args[1], v)) : NaN;
      }
      case "bin": {
        const a = evaluate(node.a, v), b = evaluate(node.b, v);
        switch (node.op) {
          case "+": return a + b;
          case "-": return a - b;
          case "*": return a * b;
          case "/": return a / b;
          case "^": return Math.pow(a, b);
        }
        return NaN;
      }
    }
    return NaN;
  }

  /** Convenience: parse and evaluate in one call. Returns null on any failure. */
  function evalString(src, vars) {
    const r = tryParse(src);
    if (!r.ok) return null;
    const val = evaluate(r.ast, vars || {});
    return isFinite(val) ? val : null;
  }

  /** Every variable name appearing in an AST. */
  function varsIn(node, into) {
    const set = into || new Set();
    if (!node || typeof node !== "object") return set;
    if (node.k === "var") set.add(node.v);
    ["a", "b"].forEach(k => node[k] && varsIn(node[k], set));
    (node.args || []).forEach(x => varsIn(x, set));
    return set;
  }

  /** Rough structural complexity — used by the validator's distractor-bias check. */
  function complexity(node) {
    if (!node || typeof node !== "object") return 0;
    let n = 1;
    ["a", "b"].forEach(k => { if (node[k]) n += complexity(node[k]); });
    (node.args || []).forEach(x => { n += complexity(x); });
    return n;
  }

  /* ── equivalence ───────────────────────────────────────────────
     Evaluate both expressions at several pseudo-random points and see
     whether they agree. Deterministic (seeded from the question id) so a
     failure in the wild reproduces exactly in a test.

     Four things break a naive version of this, and all four are handled:

     1. DOMAIN. sqrt(x²) and x agree only for x ≥ 0, so questions declare
        their own domain instead of sampling ℝ.
     2. BRANCH CUTS. arcsin(sin x) is x only on [-π/2, π/2]. Inverse-trig
        questions carry their principal range as that domain.
     3. POLES. tan, ln and every rational function blow up. Non-finite
        samples are discarded — and a minimum count of CLEAN samples is
        required, so eight rejected samples can never read as "equivalent".
     4. COINCIDENCE. Two different expressions can agree at a couple of
        points. Eight samples makes that vanishingly unlikely; two doesn't.
     ────────────────────────────────────────────────────────────── */

  const DEFAULT_DOMAIN = [-3.7, 3.7];

  function equivalent(a, b, opts) {
    const o = opts || {};
    const astA = typeof a === "string" ? tryParse(a) : { ok: true, ast: a };
    const astB = typeof b === "string" ? tryParse(b) : { ok: true, ast: b };
    if (!astA.ok || !astB.ok) return { equal: false, reason: "parse", clean: 0 };

    const names = new Set([...varsIn(astA.ast), ...varsIn(astB.ast)]);
    const vars = (o.vars && o.vars.length) ? o.vars : (names.size ? [...names] : ["x"]);
    const [lo, hi] = o.domain || DEFAULT_DOMAIN;
    const samples = o.samples || 12;
    const minClean = o.minClean === undefined ? 5 : o.minClean;
    const tol = o.tol === undefined ? 1e-9 : o.tol;
    const rng = MQ.U.seededRandom(o.seed === undefined ? 987654321 : MQ.U.hash(String(o.seed)));

    let clean = 0;
    for (let i = 0; i < samples * 3 && clean < samples; i++) {
      const env = {};
      // Spread the points across the interval rather than clustering them.
      for (const name of vars) {
        const t = (clean + rng()) / samples;
        env[name] = lo + (hi - lo) * Math.min(0.999, t * 0.6 + rng() * 0.4);
      }
      const va = evaluate(astA.ast, env);
      const vb = evaluate(astB.ast, env);
      if (!isFinite(va) || !isFinite(vb)) continue;                 // pole or out of domain
      if (Math.abs(va) > 1e12 || Math.abs(vb) > 1e12) continue;     // about to become one
      clean++;
      const scale = Math.max(1, Math.abs(va), Math.abs(vb));
      if (Math.abs(va - vb) > tol * scale) {
        return { equal: false, reason: "differs", at: env, clean, va, vb };
      }
    }
    if (clean < minClean) return { equal: false, reason: "undefined", clean };
    return { equal: true, clean };
  }

  /* ── vectors ────────────────────────────────────────────────────
     Vector answers need their own comparison path: numClose() on a pair
     of components is meaningless, and "3i - 4j" is not a number at all. */

  /** Parse (3,-4) / [3,-4] / <3,-4> / 3i-4j / "3i - 4j" into [x, y], or null. */
  function parseVector(src) {
    let t = String(src).trim().replace(/\s+/g, "");
    if (!t) return null;

    const bracketed = /^[([<]([^,]+),([^,]+)[)\]>]$/.exec(t);
    if (bracketed) {
      const x = evalString(bracketed[1], {});
      const y = evalString(bracketed[2], {});
      return x === null || y === null ? null : [x, y];
    }

    // i/j form. Underscore-tilde and hat notation both reduce to the same thing.
    const cleaned = t.replace(/[_~^]/g, "");
    if (/[ij]/.test(cleaned) && !/[a-hk-z]/.test(cleaned.replace(/[ij]/g, ""))) {
      let x = 0, y = 0, seen = false;
      const re = /([+-]?[^+-]*?)([ij])/g;
      let m;
      while ((m = re.exec(cleaned))) {
        let coef = m[1];
        if (coef === "" || coef === "+") coef = "1";
        if (coef === "-") coef = "-1";
        const v = evalString(coef, {});
        if (v === null) return null;
        if (m[2] === "i") x = v; else y = v;
        seen = true;
      }
      return seen ? [x, y] : null;
    }
    return null;
  }

  /** Componentwise comparison with a relative tolerance. */
  function vectorClose(input, expected, tolRel) {
    const v = parseVector(input);
    if (!v) return false;
    const tol = tolRel === undefined ? 0.005 : tolRel;
    return expected.every((e, i) => {
      const t = Math.max(Math.abs(e * tol), 1e-9);
      return Math.abs(v[i] - e) <= t;
    });
  }

  return { parse, tryParse, evaluate, evalString, equivalent, varsIn, complexity,
           parseVector, vectorClose, factorial, choose, perm, ParseError,
           FUNCS, FUNCS2, CONSTS };
})();
