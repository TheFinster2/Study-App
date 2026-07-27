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

  /** Compare a typed numeric answer to the expected value within a relative tolerance. */
  function numClose(input, expected, tolRel) {
    const v = parseFloat(String(input).replace(/[, ]/g, "").replace(/×10\^?/i, "e").replace(/x10\^?/i, "e"));
    if (!isFinite(v)) return false;
    const tol = Math.abs(expected * (tolRel === undefined ? 0.02 : tolRel));
    return Math.abs(v - expected) <= Math.max(tol, 1e-12);
  }

  return { $, $$, el, clamp, randInt, pick, shuffle, sample, escapeHtml, formula, toSub,
           dayKey, daysBetween, hash, seededRandom, seededShuffle, fmtTime, pct, sigFig, numClose };
})();
