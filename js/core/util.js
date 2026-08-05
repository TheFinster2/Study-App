/* Small DOM + general helpers. Everything hangs off window.CHEM. */
window.CHEM = window.CHEM || {};

CHEM.U = (function () {
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /** Create an element. `attrs.html` sets innerHTML, `attrs.on` binds listeners. */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k === "text") node.textContent = v;
        else if (k === "on") for (const [ev, fn] of Object.entries(v)) node.addEventListener(ev, fn);
        else if (k === "data") for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = dv;
        else if (v === true) node.setAttribute(k, "");
        else node.setAttribute(k, v);
      }
    }
    for (const c of [].concat(children || [])) {
      if (c === null || c === undefined || c === false) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Take up to n random items without repeats. */
  const sample = (arr, n) => shuffle(arr).slice(0, n);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* Render an ASCII chemical formula with real subscripts: C3H8 → C₃H₈.
     Digits following a letter or ')' become subscripts; charges stay superscript. */
  function formula(str) {
    const safe = escapeHtml(str);
    return safe.replace(/([A-Za-z)\]])(\d+)/g, (_, a, d) => a + "<sub>" + d + "</sub>");
  }

  const SUBS = { 0:"₀",1:"₁",2:"₂",3:"₃",4:"₄",5:"₅",6:"₆",7:"₇",8:"₈",9:"₉" };
  const toSub = n => String(n).split("").map(c => SUBS[c] || c).join("");

  /** Local date key (YYYY-MM-DD) — deliberately local, not UTC, so streaks match the user's day. */
  function dayKey(d) {
    const t = d || new Date();
    const p = n => String(n).padStart(2, "0");
    return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
  }

  function daysBetween(aKey, bKey) {
    const a = new Date(aKey + "T00:00:00");
    const b = new Date(bKey + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }

  /** Deterministic hash → used to pick a stable "daily" challenge from a date key. */
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  /** Seeded PRNG so the daily challenge is identical all day. */
  function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  function seededShuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  /** Round to n significant figures, then strip trailing zeros for display. */
  function sigFig(x, n) {
    if (x === 0) return 0;
    const mag = Math.ceil(Math.log10(Math.abs(x)));
    const factor = Math.pow(10, n - mag);
    return Math.round(x * factor) / factor;
  }

  const SUPER = { "⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","⁻":"-","⁺":"+" };

  /**
   * Read a number the way a student might actually write it. Accepts 3.2e-4, 3.2E-4,
   * 3.2 × 10^-4, 3.2x10-4, 3.2*10^-4, 3.2 × 10⁻⁴, a bare 10^-4, a Unicode minus sign,
   * thousands separators, and a trailing unit. Returns NaN if there is no number.
   *
   * The exponent marker must be explicit — an × or x or * before the 10, or a caret
   * after it. Matching a bare "10" would turn 310 into 3e0.
   */
  function parseNum(raw) {
    if (raw === null || raw === undefined) return NaN;
    let s = String(raw)
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, ch => SUPER[ch])   // 10⁻⁴ → 10-4
      .replace(/[−–—]/g, "-")           // − – — → -
      .replace(/[\s,]/g, "");
    s = s.replace(/^10\^/, "1e");                      // 10^-4, no mantissa
    s = s.replace(/[×x*]10\^?/gi, "e");                // 3.2×10^-4 / 3.2x10-4 / 3.2*10^-4
    const v = parseFloat(s);                           // also handles a trailing unit
    return isFinite(v) ? v : NaN;
  }

  const SUP_DIGITS = { "-": "⁻", "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹" };

  /**
   * Format in proper scientific notation — 3.2 × 10⁻⁴, not "3.2e-4". Used to echo back
   * what the app understood the student to have typed, and to show the expected answer.
   * Numbers comfortably inside everyday range are left alone.
   */
  function sci(x, figs) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0";
    const mag = Math.floor(Math.log10(Math.abs(x)));
    if (mag >= -3 && mag < 5) return String(sigFig(x, figs || 4));
    const mant = sigFig(x / Math.pow(10, mag), figs || 3);
    return mant + " × 10" + String(mag).replace(/[-\d]/g, ch => SUP_DIGITS[ch]);
  }

  /* ── expression evaluator (the in-game calculator) ───────────
     A recursive-descent parser, not `eval` or `new Function`. Partly because
     evaluating text a student typed is a bad habit to build into a study app, and
     partly because a parser can say *why* something failed — "unmatched bracket"
     beats a thrown SyntaxError.

     Handles + − × ÷ ^ with the usual precedence and right-associative powers,
     unary minus, brackets, implicit multiplication (2π, 3(4+1)), scientific
     notation, and the functions a chemistry student actually needs. */
  const FUNCS = {
    log: x => Math.log10(x), ln: x => Math.log(x), sqrt: x => Math.sqrt(x),
    exp: x => Math.exp(x), abs: x => Math.abs(x),
    sin: x => Math.sin(x * Math.PI / 180), cos: x => Math.cos(x * Math.PI / 180),
    tan: x => Math.tan(x * Math.PI / 180)
  };
  const CONSTS = { pi: Math.PI, "π": Math.PI, e: Math.E };

  function tokenise(src) {
    const s = String(src)
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, ch => SUPER[ch])
      .replace(/[−–—]/g, "-").replace(/[×⋅]/g, "*").replace(/[÷]/g, "/")
      .replace(/√/g, "sqrt").replace(/,/g, "");
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        // an exponent only counts if a sign or digit follows, so "2e" is not a number
        if (s[j] === "e" || s[j] === "E") {
          let k = j + 1;
          if (s[k] === "+" || s[k] === "-") k++;
          if (/[0-9]/.test(s[k] || "")) { while (k < s.length && /[0-9]/.test(s[k])) k++; j = k; }
        }
        const num = Number(s.slice(i, j));
        if (!isFinite(num)) return { error: "that number doesn't make sense" };
        out.push({ t: "num", v: num });
        i = j;
      } else if (/[a-zA-Zπ]/.test(c)) {
        // Letters only — no digits. Allowing them made "√16" tokenise as one name
        // ("sqrt16") once the radical was rewritten, and nothing else needs them.
        let j = i;
        while (j < s.length && /[a-zA-Zπ]/.test(s[j])) j++;
        out.push({ t: "name", v: s.slice(i, j).toLowerCase() });
        i = j;
      } else if ("+-*/^()".indexOf(c) >= 0) {
        out.push({ t: c });
        i++;
      } else {
        return { error: `"${c}" isn't something I can calculate with` };
      }
    }
    return { tokens: out };
  }

  function calc(src, ans) {
    if (!String(src || "").trim()) return { empty: true };
    const lex = tokenise(src);
    if (lex.error) return { error: lex.error };
    const T = lex.tokens;
    let p = 0;
    const peek = () => T[p];
    const eat = t => (T[p] && T[p].t === t ? (p++, true) : false);

    function expr() {
      let v = term();
      for (;;) {
        if (eat("+")) v += term();
        else if (eat("-")) v -= term();
        else return v;
      }
    }
    function term() {
      let v = unary();
      for (;;) {
        if (eat("*")) v *= unary();
        else if (eat("/")) {
          const d = unary();
          if (d === 0) throw new Error("can't divide by zero");
          v /= d;
        } else if (peek() && (peek().t === "num" || peek().t === "name" || peek().t === "(")) {
          v *= unary();                       // implicit multiplication: 2π, 3(4+1)
        } else return v;
      }
    }
    function unary() {
      if (eat("-")) return -unary();
      if (eat("+")) return unary();
      return power();
    }
    function power() {
      const base = primary();
      if (eat("^")) return Math.pow(base, unary());   // right associative
      return base;
    }
    function primary() {
      const tok = peek();
      if (!tok) throw new Error("the expression stops early");
      if (tok.t === "num") { p++; return tok.v; }
      if (tok.t === "(") {
        p++;
        const v = expr();
        if (!eat(")")) throw new Error("a bracket was left open");
        return v;
      }
      if (tok.t === "name") {
        p++;
        const n = tok.v;
        if (n === "ans") return ans || 0;
        if (n in CONSTS) return CONSTS[n];
        if (n in FUNCS) {
          let arg;
          if (eat("(")) {
            arg = expr();
            if (!eat(")")) throw new Error("a bracket was left open");
          } else arg = unary();               // sqrt 9, log 100
          const v = FUNCS[n](arg);
          if (!isFinite(v)) throw new Error(`${n} of that isn't defined`);
          return v;
        }
        throw new Error(`I don't know what "${n}" means`);
      }
      if (tok.t === ")") throw new Error("a bracket was closed but never opened");
      throw new Error("that operator needs a number before it");
    }

    try {
      const v = expr();
      if (p < T.length) throw new Error("there's something extra on the end");
      if (!isFinite(v)) throw new Error("the result isn't a finite number");
      return { value: v };
    } catch (e) {
      return { error: e.message };
    }
  }

  /** Compare a typed numeric answer to the expected value within a relative tolerance. */
  function numClose(input, expected, tolRel) {
    const v = parseNum(input);
    if (!isFinite(v)) return false;
    const tol = Math.abs(expected * (tolRel === undefined ? 0.02 : tolRel));
    return Math.abs(v - expected) <= Math.max(tol, 1e-12);
  }

  /**
   * Is this answer the right digits with the wrong power of ten? Worth saying so
   * explicitly: before the answer pad existed, a phone keypad could not type an
   * exponent at all, so "the mantissa on its own" was the natural thing to enter.
   */
  function wrongPowerOfTen(input, expected) {
    const v = parseNum(input);
    if (!isFinite(v) || v === 0 || expected === 0) return 0;
    if (Math.sign(v) !== Math.sign(expected)) return 0;
    const e = Math.log10(Math.abs(expected / v));
    const n = Math.round(e);
    return n !== 0 && Math.abs(e - n) < 0.02 ? n : 0;
  }

  return { $, $$, el, clamp, randInt, pick, shuffle, sample, escapeHtml, formula, toSub,
           dayKey, daysBetween, hash, seededRandom, seededShuffle, fmtTime, pct, sigFig,
           parseNum, numClose, wrongPowerOfTen, sci, calc };
})();
