/* DOM helpers, the maths renderer, seeded RNG and numeric comparison.
   Everything hangs off window.MQ. This file has no dependencies. */
window.MQ = window.MQ || {};

MQ.U = (function () {
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

  /* ══════════════════════════════════════════════════════════════
     The maths renderer.

     A deliberately small mini-language — not a layout engine and not a
     LaTeX subset. It covers the notation the HSC Advanced and Extension 1
     courses actually use, in ~200 lines we fully control, with nothing to
     download and nothing to precache. See MATHS-BRIEF §6.

     The input is ALWAYS HTML-escaped before any substitution happens, so
     content files can never inject markup. That ordering is load-bearing:
     every question, every distractor and every worked answer goes through
     here, and the whole app is one XSS hole if it is reversed.
     ══════════════════════════════════════════════════════════════ */

  const SUP_CHARS = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",
                      "+":"⁺","-":"⁻","n":"ⁿ","i":"ⁱ" };
  const SUB_CHARS = { "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉",
                      "+":"₊","-":"₋","n":"ₙ","x":"ₓ","a":"ₐ","e":"ₑ","i":"ᵢ","k":"ₖ" };

  /* Multi-character operators, matched on the ESCAPED string (so `<` is `&lt;`).
     Ordered longest-first — the scanner takes the first match. */
  const OPS = [
    ["&lt;=&gt;", "⇔"], ["&lt;-&gt;", "↔"], ["=&gt;", "⇒"], ["-&gt;", "→"],
    ["&lt;=", "≤"], ["&gt;=", "≥"], ["!=", "≠"], ["~=", "≈"], ["+-", "±"],
    ["-+", "∓"], ["...", "…"], ["|-", "∣"], ["*", "×"]
  ];

  /* Two tables, and the split matters.

     BARE words are substituted wherever they appear at a word boundary, so
     they must be tokens that never occur in English prose — question text is
     prose AND maths in the same string, and turning "therefore" into ∴ or
     "exists" into ∃ mid-sentence is exactly the kind of cute that makes a
     worked explanation unreadable. Everything ambiguous is backslash-only. */
  const BARE_WORDS = {
    pi:"π", theta:"θ", alpha:"α", beta:"β", gamma:"γ", delta:"δ", Delta:"Δ", epsilon:"ε",
    lambda:"λ", mu:"μ", sigma:"σ", Sigma:"Σ", phi:"φ", omega:"ω", Omega:"Ω", rho:"ρ", tau:"τ",
    inf:"∞", infty:"∞", deg:"°", int:"∫", nCr:"C", nPr:"P"
  };
  const CMD_WORDS = Object.assign({}, BARE_WORDS, {
    degrees:"°", cdot:"·", times:"×", div:"÷", pm:"±",
    ne:"≠", le:"≤", ge:"≥", approx:"≈", propto:"∝", therefore:"∴", because:"∵",
    forall:"∀", exists:"∃", elem:"∈", notelem:"∉", subset:"⊂", union:"∪", inter:"∩",
    emptyset:"∅", nat:"ℕ", ints:"ℤ", rats:"ℚ", reals:"ℝ", implies:"⇒", iff:"⇔",
    to:"→", mapsto:"↦", ldots:"…", cdots:"⋯", perp:"⊥", parallel:"∥", angle:"∠"
  });
  const WORD_RE = new RegExp("^(" +
    Object.keys(BARE_WORDS).filter(k => k !== "nCr" && k !== "nPr")
      .sort((a, b) => b.length - a.length).join("|") + ")(?![A-Za-z])");

  /** Read a {...} group (or a single character) starting at i. */
  function readGroup(s, i) {
    while (s[i] === " ") i++;
    if (s[i] !== "{") return { body: s[i] === undefined ? "" : s[i], end: i + 1 };
    let depth = 0;
    for (let j = i; j < s.length; j++) {
      if (s[j] === "{") depth++;
      else if (s[j] === "}") {
        depth--;
        if (depth === 0) return { body: s.slice(i + 1, j), end: j + 1 };
      }
    }
    // Unbalanced input: consume the rest rather than looping forever.
    return { body: s.slice(i + 1), end: s.length };
  }

  function readBracket(s, i) {
    if (s[i] !== "[") return null;
    const j = s.indexOf("]", i);
    if (j < 0) return null;
    return { body: s.slice(i + 1, j), end: j + 1 };
  }

  /** Read `(a,b)` — used by nCr / nPr, which are function-shaped, not brace-shaped. */
  function readParens(s, i) {
    while (s[i] === " ") i++;
    if (s[i] !== "(") return null;
    let depth = 0;
    for (let j = i; j < s.length; j++) {
      if (s[j] === "(") depth++;
      else if (s[j] === ")") {
        depth--;
        if (depth === 0) {
          const body = s.slice(i + 1, j);
          let split = -1, d = 0;
          for (let k = 0; k < body.length; k++) {
            if (body[k] === "(") d++;
            else if (body[k] === ")") d--;
            else if (body[k] === "," && d === 0) { split = k; break; }
          }
          if (split < 0) return null;
          return { a: body.slice(0, split), b: body.slice(split + 1), end: j + 1 };
        }
      }
    }
    return null;
  }

  function supHtml(inner) {
    if (inner.length === 1 && SUP_CHARS[inner]) return SUP_CHARS[inner];
    return "<sup>" + inner + "</sup>";
  }
  function subHtml(inner) {
    if (inner.length === 1 && SUB_CHARS[inner]) return SUB_CHARS[inner];
    return "<sub>" + inner + "</sub>";
  }

  /* Commands taking brace arguments. `fn` receives already-rendered strings. */
  const CMDS = {
    frac:  { args: 2, fn: (a, b) => fracHtml(a, b) },
    dfrac: { args: 2, fn: (a, b) => fracHtml(a, b, "frac-lg") },
    tfrac: { args: 2, fn: (a, b) => fracHtml(a, b, "frac-sm") },
    binom: { args: 2, fn: (a, b) => '<span class="binom">(<span class="stack">' +
             '<span>' + a + '</span><span>' + b + '</span></span>)</span>' },
    vec:   { args: 1, fn: a => '<span class="vec">' + a + "</span>" },
    bar:   { args: 1, fn: a => '<span class="over">' + a + "</span>" },
    overline: { args: 1, fn: a => '<span class="over">' + a + "</span>" },
    hat:   { args: 1, fn: a => '<span class="hat">' + a + "</span>" },
    abs:   { args: 1, fn: a => "|" + a + "|" },
    norm:  { args: 1, fn: a => "‖" + a + "‖" },
    text:  { args: 1, fn: a => '<span class="mtext">' + a + "</span>" },
    mathbb:{ args: 1, fn: a => '<span class="bb">' + a + "</span>" },
    ang:   { args: 1, fn: a => a + "°" }
  };

  function fracHtml(a, b, cls) {
    return '<span class="frac' + (cls ? " " + cls : "") + '">' +
           '<span class="fnum">' + a + "</span>" +
           '<span class="fden">' + b + "</span></span>";
  }

  /* Big operators carry their own limits, so they consume any following
     _{...} / ^{...} rather than letting the generic sub/sup rules have them. */
  const BIGOPS = { int: "∫", iint: "∬", oint: "∮", sum: "Σ", prod: "Π" };

  function bigopHtml(sym, lo, hi) {
    if (!lo && !hi) return '<span class="bigop"><span class="bop">' + sym + "</span></span>";
    return '<span class="bigop"><span class="bop">' + sym + "</span>" +
           '<span class="blims"><span class="bhi">' + (hi || "") + "</span>" +
           '<span class="blo">' + (lo || "") + "</span></span></span>";
  }

  function render(s) {
    let out = "";
    let i = 0;
    while (i < s.length) {
      const c = s[i];

      /* ── backslash commands ── */
      if (c === "\\") {
        const m = /^\\([a-zA-Z]+)/.exec(s.slice(i));
        if (!m) { i++; continue; }                       // a stray backslash renders as nothing
        const name = m[1];
        i += m[0].length;

        if (name === "sqrt") {
          const opt = readBracket(s, i);
          if (opt) i = opt.end;
          const g = readGroup(s, i); i = g.end;
          out += (opt ? '<sup class="nthroot">' + render(opt.body) + "</sup>" : "") +
                 '<span class="sqrt">√<span class="rad">' + render(g.body) + "</span></span>";
          continue;
        }
        if (BIGOPS[name]) {
          let lo = "", hi = "";
          for (let pass = 0; pass < 2; pass++) {
            if (s[i] === "_") { const g = readGroup(s, i + 1); lo = render(g.body); i = g.end; }
            else if (s[i] === "^") { const g = readGroup(s, i + 1); hi = render(g.body); i = g.end; }
          }
          out += bigopHtml(BIGOPS[name], lo, hi);
          continue;
        }
        if (name === "lim" || name === "limsup" || name === "liminf") {
          let lo = "";
          if (s[i] === "_") { const g = readGroup(s, i + 1); lo = render(g.body); i = g.end; }
          out += '<span class="limop"><span class="lword">lim</span>' +
                 (lo ? '<span class="llo">' + lo + "</span>" : "") + "</span>";
          continue;
        }
        if (CMDS[name]) {
          const spec = CMDS[name];
          const args = [];
          for (let k = 0; k < spec.args; k++) { const g = readGroup(s, i); args.push(render(g.body)); i = g.end; }
          out += spec.fn.apply(null, args);
          continue;
        }
        if (CMD_WORDS[name]) { out += CMD_WORDS[name]; continue; }
        out += name;                                     // unknown command → its own name
        continue;
      }

      /* ── nCr(n, k) / nPr(n, k) ── */
      if ((c === "n" || c === "N") && /^[nN][CP]r/.test(s.slice(i))) {
        const kind = s[i + 1].toUpperCase();
        const p = readParens(s, i + 3);
        if (p) {
          out += supHtml(render(p.a)) + kind + subHtml(render(p.b));
          i = p.end;
          continue;
        }
      }

      /* ── superscripts and subscripts ── */
      if (c === "^") { const g = readGroup(s, i + 1); out += supHtml(render(g.body)); i = g.end; continue; }
      if (c === "_") { const g = readGroup(s, i + 1); out += subHtml(render(g.body)); i = g.end; continue; }

      /* ── multi-character operators ── */
      let matched = false;
      for (const [pat, rep] of OPS) {
        if (s.startsWith(pat, i)) {
          // A lone `*` between digits reads better as ×; elsewhere leave it.
          out += rep; i += pat.length; matched = true; break;
        }
      }
      if (matched) continue;

      /* ── bare Greek / symbol words ── */
      if (/[A-Za-z]/.test(c) && (i === 0 || !/[A-Za-z]/.test(s[i - 1]))) {
        const w = WORD_RE.exec(s.slice(i));
        if (w) { out += BARE_WORDS[w[1]]; i += w[1].length; continue; }
      }

      out += c;
      i++;
    }
    return out;
  }

  /* `d/dx`, `dy/dx`, `d^2y/dx^2` are far more common than any other fraction in
     this course, so they get a shorthand rather than three sets of braces. */
  function derivPrepass(s) {
    return s
      .replace(/\bd\^(\d)([a-zA-Z])\/d([a-zA-Z])\^(\d)/g, "\\frac{d^{$1}$2}{d$3^{$4}}")
      .replace(/\b(d[a-zA-Z]?)\/(d[a-zA-Z])\b/g, "\\frac{$1}{$2}");
  }

  /** Render a maths string to HTML. Safe to hand any user- or content-supplied text. */
  function math(str) {
    if (str === null || str === undefined) return "";
    return render(derivPrepass(escapeHtml(String(str))));
  }

  /** Render into a fresh <span>. Use where you want a node rather than a string. */
  const mathEl = (str, cls) => el("span", { class: cls || "math", html: math(str) });

  /** Strip the mini-language to readable plain text — for aria-labels and tests. */
  function mathText(str) {
    const div = document.createElement("div");
    div.innerHTML = math(str);
    return div.textContent;
  }

  /* ══════════════════════════════════════════════════════════════
     Dates, hashing, seeded randomness
     ══════════════════════════════════════════════════════════════ */

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
    for (let i = 0; i < String(str).length; i++) {
      h ^= String(str).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  /** Seeded PRNG — the daily challenge and every equivalence check use this. */
  function seededRandom(seed) {
    let s = Math.abs(Math.floor(seed)) % 2147483647;
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

  /* ══════════════════════════════════════════════════════════════
     Number formatting and comparison
     ══════════════════════════════════════════════════════════════ */

  const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  /** Round to n significant figures, then strip trailing zeros for display. */
  function sigFig(x, n) {
    if (x === 0 || !isFinite(x)) return 0;
    const mag = Math.ceil(Math.log10(Math.abs(x)));
    const factor = Math.pow(10, n - mag);
    return Math.round(x * factor) / factor;
  }

  /** Format a number the way a marker would write it: no float dust, no 17 digits. */
  function fmtNum(x, dp) {
    if (!isFinite(x)) return String(x);
    if (dp !== undefined) return x.toFixed(dp);
    const r = Math.round(x * 1e10) / 1e10;
    if (Number.isInteger(r)) return String(r);
    if (Math.abs(r) < 1e-4 || Math.abs(r) >= 1e7) return r.toExponential(3).replace("e", " ×10^");
    return String(parseFloat(r.toFixed(6)));
  }

  /** Money, exact to the cent. */
  const fmtMoney = x => "$" + (Math.round(x * 100) / 100).toLocaleString("en-AU", {
    minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /**
   * Compare a typed numeric answer to the expected value.
   * Accepts thousands separators, scientific notation, and — via MQ.Expr —
   * exact forms the student is entitled to write: pi/4, sqrt(2), 3/8, ln(3), e^2.
   */
  function numClose(input, expected, tolRel) {
    const v = parseNum(input);
    if (v === null || !isFinite(v)) return false;
    const tol = Math.abs(expected * (tolRel === undefined ? 0.005 : tolRel));
    return Math.abs(v - expected) <= Math.max(tol, 1e-9);
  }

  /** Parse a typed answer to a number, or null. Exact forms go through the parser. */
  function parseNum(input) {
    let t = String(input).trim();
    if (!t) return null;
    t = t.replace(/\$/g, "").replace(/,/g, "").replace(/\s+/g, "")
         .replace(/[×x]\s*10\s*\^?/gi, "e").replace(/E/g, "e");
    // A bare "1e5" is already valid JS-ish; try the cheap path first.
    if (/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/.test(t)) return parseFloat(t);
    if (MQ.Expr) {
      const v = MQ.Expr.evalString(t, {});
      if (v !== null && isFinite(v)) return v;
    }
    const f = parseFloat(t);
    return isFinite(f) ? f : null;
  }

  /** Greatest common divisor, for reducing generated fractions. */
  function gcd(a, b) {
    a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
  }

  /** Render p/q in lowest terms as mini-language, collapsing q=1. */
  function fracStr(p, q) {
    if (q < 0) { p = -p; q = -q; }
    const g = gcd(p, q);
    p /= g; q /= g;
    if (q === 1) return String(p);
    return `\\frac{${p}}{${q}}`;
  }

  /** Signed coefficient for building polynomial strings: +3x, -x, (nothing) for 1. */
  function coefStr(c, v, first) {
    if (c === 0) return "";
    const sign = c < 0 ? "-" : (first ? "" : "+");
    const mag = Math.abs(c);
    const num = mag === 1 && v ? "" : String(mag);
    return sign + num + (v || "");
  }

  /** Ordinal suffix — used by boss phases and level titles. */
  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return { $, $$, el, clamp, randInt, pick, shuffle, sample, escapeHtml,
           math, mathEl, mathText,
           dayKey, daysBetween, hash, seededRandom, seededShuffle,
           fmtTime, pct, sigFig, fmtNum, fmtMoney, numClose, parseNum,
           gcd, fracStr, coefStr, ordinal };
})();
