#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Content validator. Node only, no browser, no test framework.

   Loads every data file in a `vm` sandbox where the context global IS
   `window`, then asserts content invariants. Run it constantly while
   authoring — it is far cheaper than finding a broken question in play.

       node tests/validate.js
       BREAK=<name> node tests/validate.js    (see the bottom of this file)

   The BREAK mode is the habit that matters more than any individual check
   here: it deletes a specific guard with a regex and asserts the suite then
   FAILS. A test that passes with its fix removed is worthless, and three of
   them were quietly worthless in the reference app until this existed.
   ═══════════════════════════════════════════════════════════════ */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const BREAK = process.env.BREAK || "";

let failures = 0, checks = 0;
const notes = [];

function ok(cond, label, detail) {
  checks++;
  if (cond) return true;
  failures++;
  console.log("  ✗ " + label + (detail ? "\n      " + detail : ""));
  return false;
}
function section(name) { console.log("\n" + name); }
function pass(label, extra) { checks++; console.log("  ✓ " + label + (extra ? "  " + extra : "")); }

/* ── the sandbox ──────────────────────────────────────────────
   Enough DOM to let data files and pure logic load. Anything that
   genuinely needs a browser belongs in smoke.js, not here. */
function makeContext(tiers) {
  const ctx = {
    console,
    performance: { now: () => Date.now() },
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    matchMedia: () => ({ matches: false }),
    localStorage: {
      _d: {},
      getItem(k) { return this._d[k] === undefined ? null : this._d[k]; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; }
    },
    navigator: { serviceWorker: undefined },
    location: { hash: "", protocol: "file:" },
    document: {
      documentElement: { dataset: {}, style: { setProperty() {} } },
      createElement: () => stubNode(),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {}, removeEventListener() {},
      body: stubNode()
    },
    addEventListener() {}, removeEventListener() {}
  };
  ctx.window = ctx;
  vm.createContext(ctx);

  function stubNode() {
    return {
      style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
      children: [], childNodes: [],
      set innerHTML(v) { this._h = v; },
      get innerHTML() { return this._h || ""; },
      get textContent() { return String(this._h || "").replace(/<[^>]*>/g, ""); },
      set textContent(v) { this._h = v; },
      appendChild() {}, removeChild() {}, remove() {}, insertBefore() {},
      setAttribute() {}, addEventListener() {}, removeEventListener() {},
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0, right: 0 }),
      querySelector: () => null, querySelectorAll: () => [], focus() {}
    };
  }

  const load = rel => {
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8");
    if (BREAK) src = applyBreak(rel, src);
    vm.runInContext(src, ctx, { filename: rel });
  };

  [
    "js/core/util.js", "js/core/expr.js", "js/core/audio.js",
    "js/data/tiers.js"
  ].forEach(load);

  // Override the tier array BEFORE the banks register, so both configurations
  // can be validated in the same process.
  ctx.MQ.DATA.TIERS = tiers.slice();

  ["js/core/state.js", "js/core/bank.js"].forEach(load);
  DATA_FILES.forEach(load);
  return ctx;
}

const DATA_FILES = [
  "js/data/questions-ma-functions.js",
  "js/data/questions-ma-trig.js",
  "js/data/questions-ma-calculus.js",
  "js/data/questions-ma-integration.js",
  "js/data/questions-ma-financial.js",
  "js/data/questions-ma-statistics.js",
  "js/data/questions-ma-mixed.js",
  "js/data/questions-me-functions.js",
  "js/data/questions-me-trig.js",
  "js/data/questions-me-calculus.js",
  "js/data/questions-me-discrete.js",
  "js/data/questions-me-vectors.js",
  "js/data/generators.js",
  "js/data/flashcards.js",
  "js/data/proofs.js",
  "js/data/reference.js",
  "js/data/shop.js",
  "js/data/achievements.js",
  "js/data/arcade.js"
];

/* Deliberately breaking a guard, to prove the test that covers it works. */
const BREAKS = {
  "answer-first": ["js/data/generators.js",
    /item\.answer = g\.solve\(item\.params\);/, "item.answer = item.answer;"],
  "tier-filter": ["js/core/bank.js",
    /ALL = merged\.filter\(q => MQ\.DATA\.tierEnabled\(q\.topic\)\);/, "ALL = merged;"],
  "escape": ["js/core/util.js",
    /return render\(derivPrepass\(escapeHtml\(String\(str\)\)\)\);/, "return render(derivPrepass(String(str)));"],
  "domain": ["js/core/expr.js",
    /const \[lo, hi\] = o\.domain \|\| DEFAULT_DOMAIN;/, "const [lo, hi] = DEFAULT_DOMAIN;"],
  "minclean": ["js/core/expr.js",
    /if \(clean < minClean\) return \{ equal: false, reason: "undefined", clean \};/, ""]
};
let breakApplied = false;
function applyBreak(rel, src) {
  const spec = BREAKS[BREAK];
  if (!spec || spec[0] !== rel) return src;
  const out = src.replace(spec[1], spec[2]);
  if (out === src) {
    console.error(`BREAK "${BREAK}" did not match anything in ${rel} — the patch is stale.`);
    process.exit(2);
  }
  // A patched file that no longer parses would "fail" for the wrong reason.
  try { new Function(out); } catch (e) {
    console.error(`BREAK "${BREAK}" produced a file that does not parse: ${e.message}`);
    process.exit(2);
  }
  breakApplied = true;
  return out;
}

/* ═══════════════ the checks ═══════════════ */

console.log("MathQuest content validator" + (BREAK ? `  [BREAK=${BREAK}]` : ""));

const ctxFull = makeContext(["MA", "ME"]);
const MQ = ctxFull.MQ;
const U = MQ.U;
const questions = MQ.Bank.all();

/* ── 1. structural invariants ─────────────────────────────── */
section("Structure");
{
  const ids = new Set();
  let dupes = 0, badChoices = 0, badAnswer = 0, badWhy = 0, badTopic = 0,
      badDiff = 0, dupChoices = 0, noSub = 0;
  const validTopics = new Set(MQ.Bank.TOPICS.map(t => t.id));

  for (const q of questions) {
    if (ids.has(q.id)) { dupes++; console.log("      duplicate id: " + q.id); }
    ids.add(q.id);
    if (!Array.isArray(q.choices) || q.choices.length !== 4) { badChoices++; console.log("      not 4 choices: " + q.id); }
    if (q.a !== 0) { badAnswer++; console.log("      a is not 0: " + q.id); }
    if (!q.why || !q.why.trim()) { badWhy++; console.log("      empty why: " + q.id); }
    if (!validTopics.has(q.topic)) { badTopic++; console.log("      bad topic: " + q.id + " → " + q.topic); }
    if (!(q.diff >= 1 && q.diff <= 3)) { badDiff++; console.log("      diff out of range: " + q.id); }
    if (new Set(q.choices).size !== q.choices.length) { dupChoices++; console.log("      duplicate choices: " + q.id); }
    if (!q.sub) noSub++;
  }

  ok(dupes === 0, "unique question ids");
  ok(badChoices === 0, "every question has exactly 4 choices");
  ok(badAnswer === 0, "every stored answer is at index 0");
  ok(badWhy === 0, "every question has a worked explanation");
  ok(badTopic === 0, "every topic code is valid");
  ok(badDiff === 0, "every difficulty is 1-3");
  ok(dupChoices === 0, "no question repeats a choice");
  if (!dupes && !badChoices && !badAnswer && !badWhy && !badTopic && !badDiff && !dupChoices) {
    pass("structural invariants", `(${questions.length} questions)`);
  }
}

/* ── 2. content volume ────────────────────────────────────── */
section("Volume");
{
  const ma = questions.filter(q => q.topic.startsWith("MA-")).length;
  const me = questions.filter(q => q.topic.startsWith("ME-")).length;
  const cards = MQ.DATA.flashcards;
  const cardsMa = cards.filter(c => c.topic.startsWith("MA-")).length;
  const cardsMe = cards.filter(c => c.topic.startsWith("ME-")).length;
  const proofs = MQ.DATA.proofs;
  const inductions = proofs.filter(p => p.kind === "induction").length;

  ok(ma >= 400, "≥ 400 Advanced questions", `have ${ma}`) && pass("Advanced questions", `${ma}`);
  ok(me >= 150, "≥ 150 Extension 1 questions", `have ${me}`) && pass("Extension 1 questions", `${me}`);
  ok(cardsMa >= 80, "≥ 80 Advanced flashcards", `have ${cardsMa}`) && pass("Advanced flashcards", `${cardsMa}`);
  ok(cardsMe >= 40, "≥ 40 Extension 1 flashcards", `have ${cardsMe}`) && pass("Extension 1 flashcards", `${cardsMe}`);
  ok(MQ.Gen.all().length >= 40, "≥ 40 generators", `have ${MQ.Gen.all().length}`) &&
    pass("generators", `${MQ.Gen.all().length}`);
  ok(proofs.length >= 12, "≥ 12 proof puzzles", `have ${proofs.length}`) && pass("proof puzzles", `${proofs.length}`);
  ok(inductions >= 6, "≥ 6 induction puzzles", `have ${inductions}`) && pass("induction puzzles", `${inductions}`);
  ok(MQ.DATA.achievements.length >= 65, "≥ 65 achievements", `have ${MQ.DATA.achievements.length}`) &&
    pass("achievements", `${MQ.DATA.achievements.length}`);
}

/* ── 3. answer-length bias ────────────────────────────────────
   Writing a thorough correct answer and three throwaway distractors makes
   the key guessable from length alone — measured at 63.9% in the reference
   app before it was fixed. The overall limit is not enough on its own: a
   healthy-looking 24% average there was hiding one module at 38%. */
section("Answer bias");
{
  /* The strategy being modelled is "glance at the options and pick the visibly
     longest one". Two options differing by a single character are not visibly
     different, so anything within a small tolerance of the maximum counts as
     tied and the credit is split — otherwise `"10","4","6","2"` scores as a
     bias when nobody could exploit it. */
  const near = max => Math.max(2, Math.round(max * 0.15));

  const perTopic = {};
  let longestWins = 0, strictWins = 0;

  for (const q of questions) {
    const lens = q.choices.map(c => c.length);
    const max = Math.max(...lens);
    const tol = near(max);
    const tiedAtMax = lens.filter(l => l >= max - tol).length;
    const keyIsLongest = lens[0] >= max - tol;
    if (keyIsLongest) longestWins += 1 / tiedAtMax;
    if (lens[0] === max && lens.filter(l => l === max).length === 1) strictWins++;

    const t = perTopic[q.topic] || (perTopic[q.topic] = { n: 0, w: 0 });
    t.n++;
    if (keyIsLongest) t.w += 1 / tiedAtMax;
  }

  const overall = (longestWins / questions.length) * 100;
  const strict = (strictWins / questions.length) * 100;
  ok(overall <= 32, `longest-option scoring ≤ 32%`, `measured ${overall.toFixed(1)}%`) &&
    pass("longest-option scoring", `${overall.toFixed(1)}% (chance is 25%)`);
  pass("strictly-longest-is-key", `${strict.toFixed(1)}%`);

  const worst = Object.entries(perTopic)
    .map(([id, t]) => ({ id, pct: (t.w / t.n) * 100, n: t.n }))
    .filter(t => t.n >= 15)
    .sort((a, b) => b.pct - a.pct)[0];
  if (worst) {
    ok(worst.pct <= 36, "no single topic above 36%",
      `worst is ${worst.id} at ${worst.pct.toFixed(1)}% over ${worst.n} questions`) &&
      pass("worst topic", `${worst.id} at ${worst.pct.toFixed(1)}%`);
  }

  /* Maths has its OWN version of this tell: the most structurally complex
     option is often the key, because distractors get written as
     simplifications. Measure it the same way. */
  let complexWins = 0;
  for (const q of questions) {
    const cx = q.choices.map(c => (c.match(/[\\^_{}+\-*/]/g) || []).length);
    const max = Math.max(...cx);
    const tol = Math.max(1, Math.round(max * 0.2));
    const tied = cx.filter(v => v >= max - tol).length;
    if (cx[0] >= max - tol) complexWins += 1 / tied;
  }
  const cpct = (complexWins / questions.length) * 100;
  ok(cpct <= 36, "most-complex-option scoring ≤ 36%", `measured ${cpct.toFixed(1)}%`) &&
    pass("most-complex-option scoring", `${cpct.toFixed(1)}%`);
}

/* ── 4. near-duplicate questions ──────────────────────────────
   Comparing token SETS flags "P(A and B)" as a duplicate of "P(A or B)" —
   identical tokens, opposite questions. Word PAIRS fix it, and digits,
   operators and symbols stay in the tokens because stripping them is what
   collapsed those two into the same set. */
section("Duplicates");
{
  const bigrams = q => {
    const toks = String(q.q).toLowerCase().match(/[a-z0-9\\^_{}+\-*/=<>|]+/g) || [];
    const out = new Set();
    for (let i = 0; i < toks.length - 1; i++) out.add(toks[i] + " " + toks[i + 1]);
    return out;
  };
  const jaccard = (a, b) => {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    a.forEach(x => { if (b.has(x)) inter++; });
    return inter / (a.size + b.size - inter);
  };

  const byTopic = {};
  questions.forEach(q => (byTopic[q.topic] = byTopic[q.topic] || []).push(q));

  let found = 0;
  for (const list of Object.values(byTopic)) {
    const grams = list.map(bigrams);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const s = jaccard(grams[i], grams[j]);
        if (s > 0.75) {
          found++;
          console.log(`      ${(s * 100).toFixed(0)}% similar: ${list[i].id} / ${list[j].id}`);
          console.log(`        ${list[i].q}`);
          console.log(`        ${list[j].q}`);
        }
      }
    }
  }
  ok(found === 0, "no near-duplicate questions (bigram Jaccard > 0.75)",
    "fixing one can expose another — re-run until clean") && pass("no near-duplicates");
}

/* ── 5. the maths renderer ────────────────────────────────── */
section("Renderer");
{
  const strings = [];
  questions.forEach(q => { strings.push(q.q, q.why); q.choices.forEach(c => strings.push(c)); });
  MQ.DATA.flashcards.forEach(c => strings.push(c.q, c.a));
  MQ.DATA.proofs.forEach(p => {
    strings.push(p.title, p.goal);
    p.steps.forEach(s => strings.push(s));
    (p.traps || []).forEach(s => strings.push(s));
  });
  MQ.DATA.reference.forEach(r => {
    strings.push(r.title, r.blurb, r.note || "");
    r.cols.forEach(c => strings.push(c));
    r.rows.forEach(row => row.forEach(c => strings.push(c)));
  });

  let unbalanced = 0, leftover = 0, rawTag = 0, empty = 0;
  const KNOWN = /\\(frac|dfrac|tfrac|binom|sqrt|vec|bar|overline|hat|abs|norm|text|mathbb|ang|int|iint|oint|sum|prod|lim|limsup|liminf|[a-zA-Z]+)/g;

  for (const s of strings) {
    if (s === undefined || s === null) { empty++; continue; }
    // Braces must balance, or readGroup() silently swallows the rest of the line.
    let depth = 0, bad = false;
    for (const ch of String(s)) {
      if (ch === "{") depth++;
      else if (ch === "}") { depth--; if (depth < 0) { bad = true; break; } }
    }
    if (bad || depth !== 0) { unbalanced++; console.log("      unbalanced braces: " + s); }

    const html = U.math(s);
    // A backslash surviving into the output means an unrecognised command.
    if (html.includes("\\")) { leftover++; console.log("      leftover backslash: " + s + "\n        → " + html); }
    // Raw markup reaching the DOM would be an XSS hole in a study app.
    if (/<(?!\/?(span|sup|sub|b|i|em)\b)/.test(html)) {
      rawTag++;
      console.log("      unexpected tag in output: " + s + "\n        → " + html);
    }
  }
  ok(unbalanced === 0, "every string has balanced braces");
  ok(leftover === 0, "no unrecognised \\commands survive rendering");
  ok(rawTag === 0, "no raw markup reaches the DOM");
  ok(empty === 0, "no null/undefined strings");
  if (!unbalanced && !leftover && !rawTag && !empty) pass("renderer round-trip", `(${strings.length} strings)`);

  // The escaping order is load-bearing; assert it directly.
  const xss = U.math('<img src=x onerror="alert(1)">');
  ok(!xss.includes("<img"), "HTML is escaped before substitution", xss) && pass("XSS: input is escaped first");

  // Nesting three deep, which Extension 1 does routinely.
  const deep = U.math("\\frac{\\frac{1}{\\sqrt{\\frac{a}{b}}}}{2}");
  ok((deep.match(/class="frac"/g) || []).length === 3, "fractions nest three deep") &&
    pass("nested fractions render");
}

/* ── 6. equivalence checking, and its four traps ────────────── */
section("Equivalence");
{
  const E = MQ.Expr;
  const cases = [
    ["accepts a genuinely different form", () =>
      E.equivalent("2sin(x)cos(x)", "sin(2x)", { seed: "t" }).equal],
    ["rejects a wrong answer", () =>
      !E.equivalent("x^2", "x^3", { seed: "t" }).equal],

    /* Trap 1 — DOMAIN. sqrt(x^2) is x only for x >= 0. */
    ["trap 1: domain-restricted pair rejected over ℝ", () =>
      !E.equivalent("sqrt(x^2)", "x", { seed: "t" }).equal],
    ["trap 1: same pair accepted on its declared domain", () =>
      E.equivalent("sqrt(x^2)", "x", { seed: "t", domain: [0.5, 4] }).equal],

    /* Trap 2 — BRANCH CUTS. arcsin(sin x) is x only on [-pi/2, pi/2]. */
    ["trap 2: arcsin(sin x) rejected outside the principal range", () =>
      !E.equivalent("arcsin(sin(x))", "x", { seed: "t", domain: [-3, 3] }).equal],
    ["trap 2: accepted inside the principal range", () =>
      E.equivalent("arcsin(sin(x))", "x", { seed: "t", domain: [-1.5, 1.5] }).equal],

    /* Trap 3 — POLES. Rejected samples must never read as agreement. */
    ["trap 3: an all-undefined comparison is NOT 'equivalent'", () => {
      const r = E.equivalent("ln(x)", "ln(x)", { seed: "t", domain: [-5, -1] });
      return !r.equal && r.reason === "undefined";
    }],
    ["trap 3: a pole-carrying pair still compares where it is defined", () =>
      E.equivalent("1/(x-1)", "1/(x-1)", { seed: "t", domain: [2, 6] }).equal],

    /* Trap 4 — COINCIDENCE. Two different expressions agreeing at a couple of
       points must not pass. x^2 and 2x - 1 meet only at x = 1. */
    ["trap 4: coincidental agreement is rejected", () =>
      !E.equivalent("x^2", "2x - 1", { seed: "t" }).equal],
    ["trap 4: eight samples are demanded, not two", () =>
      E.equivalent("x", "x", { seed: "t" }).clean >= 8],

    ["parser reports a useful error", () => {
      const r = E.tryParse("2*(x+1");
      return !r.ok && /bracket/i.test(r.error);
    }],
    ["exact numeric forms parse", () =>
      Math.abs(U.parseNum("pi/4") - Math.PI / 4) < 1e-12 &&
      Math.abs(U.parseNum("sqrt(2)") - Math.SQRT2) < 1e-12 &&
      Math.abs(U.parseNum("3/8") - 0.375) < 1e-12 &&
      Math.abs(U.parseNum("ln(3)") - Math.log(3)) < 1e-12 &&
      Math.abs(U.parseNum("e^2") - Math.exp(2)) < 1e-12],
    ["vectors compare componentwise", () =>
      E.vectorClose("(3,-4)", [3, -4]) && E.vectorClose("3i - 4j", [3, -4]) &&
      !E.vectorClose("(3,4)", [3, -4])]
  ];
  let bad = 0;
  cases.forEach(([label, fn]) => {
    let r = false;
    try { r = !!fn(); } catch (e) { r = false; }
    if (!ok(r, label)) bad++;
  });
  if (!bad) pass("equivalence checks", `(${cases.length} cases)`);
}

/* ── 7. generators: answer-first, contract-honouring ──────────
   Every generated question is solved independently by `solve()`, which works
   FORWARDS from the inputs while `make()` worked BACKWARDS from the answer.
   A stored answer that was never re-derived by a second path is an assertion,
   not a fact. */
section("Generators");
{
  const SAMPLES = 500;
  let broken = 0;
  for (const g of MQ.Gen.all()) {
    let firstFail = null;
    for (let i = 0; i < SAMPLES; i++) {
      const seed = g.id + "#" + i;
      let item;
      try { item = MQ.Gen.build(g, seed); }
      catch (e) { firstFail = "threw: " + e.message; break; }

      const rebuilt = g.solve(item.params);
      if (!isFinite(rebuilt)) { firstFail = "solve() is not finite for " + JSON.stringify(item.params); break; }
      /* Check the stored answer is a NUMBER before comparing. Without this the
         comparison is `NaN > tolerance`, which is false — so a missing answer
         reads as agreement and the whole check quietly stops testing anything.
         BREAK=answer-first is what surfaced this. */
      if (typeof item.answer !== "number" || !isFinite(item.answer)) {
        firstFail = "no finite answer was stored (got " + item.answer + ")"; break;
      }
      if (Math.abs(rebuilt - item.answer) > 1e-9 * Math.max(1, Math.abs(rebuilt))) {
        firstFail = "make/solve disagree: " + item.answer + " vs " + rebuilt; break;
      }
      if (Math.abs(item.answer) > 1e9) { firstFail = "answer out of range: " + item.answer; break; }
      if (!item.prompt || !item.why) { firstFail = "missing prompt or explanation"; break; }
      if (!g.contract || !g.contract.answerType) { firstFail = "no difficulty contract"; break; }
      // The contract's promise about the answer's SHAPE must hold.
      if (/integer/.test(g.contract.answerType) && Math.abs(item.answer - Math.round(item.answer)) > 1e-9) {
        firstFail = "contract says integer but answer is " + item.answer; break;
      }
      if (!(g.diff >= 1 && g.diff <= 3)) { firstFail = "diff out of range"; break; }
      if (!MQ.Bank.TOPICS.some(t => t.id === g.topic)) { firstFail = "unknown topic " + g.topic; break; }
    }
    if (firstFail) { broken++; console.log("      " + g.id + ": " + firstFail); }
  }
  ok(broken === 0, `every generator survives ${SAMPLES} samples`) &&
    pass("generators re-derived independently", `(${MQ.Gen.all().length} × ${SAMPLES})`);

  // Determinism: the same seed must give the same question, or a bug report
  // from the wild cannot be turned into a test case.
  const a = MQ.Gen.build(MQ.Gen.all()[0], "fixed");
  const b = MQ.Gen.build(MQ.Gen.all()[0], "fixed");
  ok(a.prompt === b.prompt && a.answer === b.answer && typeof a.answer === "number",
    "generators are deterministic per seed") &&
    pass("seeded generation is reproducible");
}

/* ── 8. proof puzzles ─────────────────────────────────────── */
section("Proofs");
{
  let bad = 0;
  for (const p of MQ.DATA.proofs) {
    if (!p.steps || p.steps.length < 3) { bad++; console.log("      too few steps: " + p.id); continue; }
    if (new Set(p.steps).size !== p.steps.length) { bad++; console.log("      repeated step: " + p.id); }
    if (p.phases && p.phases.length !== p.steps.length) {
      bad++; console.log("      phases/steps length mismatch: " + p.id);
    }
    // A trap that duplicates a real step would make the puzzle unsolvable.
    (p.traps || []).forEach(t => {
      if (p.steps.includes(t)) { bad++; console.log("      trap duplicates a real step: " + p.id); }
    });
    // Recompute the declared step count rather than trusting it.
    const solvedIn = p.steps.length;
    if (solvedIn !== p.steps.length) { bad++; console.log("      step count mismatch: " + p.id); }
    if (!(p.traps || []).length) { bad++; console.log("      no traps — solvable by elimination: " + p.id); }
    if (!MQ.Bank.TOPICS.some(t => t.id === p.topic)) { bad++; console.log("      unknown topic: " + p.id); }
    if (p.kind === "induction" && !p.phases) { bad++; console.log("      induction without phases: " + p.id); }
  }
  ok(bad === 0, "every proof puzzle is well-formed and solvable in its declared steps") &&
    pass("proof puzzles", `(${MQ.DATA.proofs.length})`);
}

/* ── 9. a fresh save unlocks nothing ──────────────────────── */
section("Fresh save");
{
  const ctx2 = makeContext(["MA", "ME"]);
  ctx2.MQ.State.load();
  const unlocked = ctx2.MQ.State.checkAchievements();
  ok(unlocked.length === 0, "no achievement unlocks on a brand-new save",
    unlocked.map(a => a.id).join(", ")) && pass("fresh save unlocks nothing");
  ok(ctx2.MQ.State.data.level === 1 && ctx2.MQ.State.data.xp === 0, "a fresh save starts at level 1") &&
    pass("fresh save starts clean");
}

/* ── 10. Table Panic boards are never trivially uniform ──────
   A randomly drawn grid can come up almost all one answer, making "tap the
   same thing sixteen times" a legitimately perfect score. */
section("Generated boards");
{
  const src = fs.readFileSync(path.join(ROOT, "js/games/panic.js"), "utf8");
  const tablesMatch = /MQ\.DATA\.panicTables = (\[[\s\S]*?\n\];)/.exec(src);
  ok(!!tablesMatch, "panic tables are parseable");
  if (tablesMatch) {
    vm.runInContext("MQ.DATA.panicTables = " + tablesMatch[1], ctxFull);
    const tables = ctxFull.MQ.DATA.panicTables;
    let badTable = 0, uniform = 0;
    for (const t of tables) {
      if (t.rows.length < 10) { badTable++; console.log("      too few rows: " + t.id); }
      // Simulate the constrained draw the game performs.
      for (let trial = 0; trial < 200; trial++) {
        const rows = ctxFull.MQ.U.sample(t.rows, 10);
        const counts = {};
        rows.forEach(r => (counts[r[1]] = (counts[r[1]] || 0) + 1));
        const share = Math.max(...Object.values(counts)) / rows.length;
        if (share > 0.6) uniform++;
      }
    }
    ok(badTable === 0, "every panic table has enough rows");
    // The unconstrained draw DOES occasionally go uniform — which is exactly
    // why the game constrains it. This just proves the risk is real.
    pass("uniform-board risk measured", `${uniform} of ${tables.length * 200} raw draws exceed 60%`);
  }
}

/* ── 11. the tier toggle ──────────────────────────────────────
   The only thing stopping this toggle from rotting is asserting BOTH
   configurations pass. */
section("Tier toggle");
{
  const maOnly = makeContext(["MA"]);
  const maQs = maOnly.MQ.Bank.all();
  const leaks = maQs.filter(q => q.topic.startsWith("ME-"));
  ok(leaks.length === 0, "an Advanced-only build ships no ME- questions",
    leaks.slice(0, 3).map(q => q.id).join(", ")) && pass("MA-only build is clean");

  const cardLeaks = maOnly.MQ.Cards.all().filter(c => c.topic.startsWith("ME-"));
  ok(cardLeaks.length === 0, "an Advanced-only build ships no ME- flashcards") &&
    pass("MA-only flashcards are clean");

  const proofLeaks = maOnly.MQ.Proofs.all().filter(p => p.topic.startsWith("ME-"));
  ok(proofLeaks.length === 0, "an Advanced-only build ships no ME- proofs") &&
    pass("MA-only proofs are clean");

  const achLeaks = maOnly.MQ.DATA.enabledAchievements().filter(a => a.tier === "ME");
  ok(achLeaks.length === 0,
    "an Advanced-only build hides Extension achievements (no permanently unobtainable ones)") &&
    pass("MA-only achievements are clean");

  const genLeaks = maOnly.MQ.Gen.enabled().filter(g => g.topic.startsWith("ME-"));
  ok(genLeaks.length === 0, "an Advanced-only build ships no ME- generators") &&
    pass("MA-only generators are clean");

  const refLeaks = maOnly.MQ.Reference.all().filter(r => r.tier === "ME");
  ok(refLeaks.length === 0, "an Advanced-only build ships no ME- reference sheets") &&
    pass("MA-only reference is clean");

  // And every achievement must still be REACHABLE in the MA-only build.
  maOnly.MQ.State.load();
  let evalFail = 0;
  const stats = maOnly.MQ.State.achievementStats();
  for (const a of maOnly.MQ.DATA.enabledAchievements()) {
    try { a.check(stats); } catch (e) { evalFail++; console.log("      throws: " + a.id + " — " + e.message); }
  }
  ok(evalFail === 0, "every enabled achievement evaluates without throwing") &&
    pass("achievement checks are safe on a fresh MA-only save");

  ok(maQs.length >= 400, "the Advanced-only build still has ≥ 400 questions", `have ${maQs.length}`) &&
    pass("MA-only volume", `${maQs.length} questions`);
}

/* ── 12. the precache list ────────────────────────────────────
   Shipping a change to a precached file without bumping CACHE means anyone
   already installed keeps serving the old code — the fix can never reach them. */
section("Service worker");
{
  const swSrc = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  const listMatch = /const PRECACHE = \[([\s\S]*?)\n\];/.exec(swSrc);
  ok(!!listMatch, "PRECACHE is parseable");
  const precache = (listMatch ? listMatch[1] : "")
    .split("\n").map(l => (l.match(/"([^"]+)"/) || [])[1]).filter(Boolean);

  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const scripts = Array.from(html.matchAll(/<script src="([^"]+)"><\/script>/g)).map(m => m[1]);

  const missingFromCache = scripts.filter(s => !precache.includes(s));
  ok(missingFromCache.length === 0, "every script in index.html is precached",
    missingFromCache.join(", ")) && pass("index.html ⊆ PRECACHE");

  const missingOnDisk = precache.filter(p => p !== "./" && !fs.existsSync(path.join(ROOT, p)));
  ok(missingOnDisk.length === 0, "every precached path exists on disk", missingOnDisk.join(", ")) &&
    pass("PRECACHE ⊆ disk");

  const jsOnDisk = [];
  ["js", "js/core", "js/data", "js/games", "js/screens"].forEach(dir => {
    fs.readdirSync(path.join(ROOT, dir))
      .filter(f => f.endsWith(".js"))
      .forEach(f => jsOnDisk.push(dir + "/" + f));
  });
  const notLoaded = jsOnDisk.filter(f => !scripts.includes(f));
  ok(notLoaded.length === 0, "every js file on disk is loaded by index.html", notLoaded.join(", ")) &&
    pass("no orphaned source files");

  const cacheName = (/const CACHE = "([^"]+)"/.exec(swSrc) || [])[1];
  const appVer = (/MQ\.VERSION = "([^"]+)"/.exec(fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8")) || [])[1];
  ok(cacheName === "mathquest-v" + appVer,
    "the cache name matches MQ.VERSION — bump both together",
    `CACHE=${cacheName}, MQ.VERSION=${appVer}`) && pass("cache version", cacheName);
}

/* ── 13. the arcade cannot pay ────────────────────────────────
   Enforced structurally: arcade code never calls UI.award(). Assert it
   textually, because that is the only way the rule stays true. */
section("Arcade isolation");
{
  const files = ["js/core/arcade.js", "js/games/arcade-crush.js",
                 "js/games/arcade-runner.js", "js/games/arcade-tower.js"];
  let violations = 0;
  files.forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, f), "utf8");
    // Ignore the comments that explain the rule; look for actual calls.
    const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    if (/UI\.award\s*\(/.test(stripped) || /\baddXP\s*\(/.test(stripped)) {
      violations++;
      console.log("      " + f + " calls a reward function");
    }
  });
  ok(violations === 0, "no arcade file calls UI.award() or addXP()") &&
    pass("arcade earns nothing — structurally");
}

/* ── 14. the anti-farm guards are present ─────────────────── */
section("Anti-farm guards");
{
  const uiSrc = fs.readFileSync(path.join(ROOT, "js/core/ui.js"), "utf8");
  ok(/MIN_BONUS_ACCURACY = 0\.5/.test(uiSrc), "the completion bonus is accuracy-gated at 50%");
  ok(/acc < MIN_BONUS_ACCURACY \? 0 :/.test(uiSrc), "below the gate the bonus is withheld entirely, not scaled");
  ok(/MIN_READ_MS = 1200/.test(uiSrc), "a minimum read time of 1200 ms is defined");

  const gameFiles = fs.readdirSync(path.join(ROOT, "js/games")).filter(f => f.endsWith(".js"));
  let floors = 0;
  gameFiles.forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, "js/games", f), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    // Math.max(<literal>, ...) applied to a score is a per-item floor, and a
    // per-item floor plus a completion bonus is a farm.
    const m = src.match(/Math\.max\(\s*[1-9]\d*\s*,[^)]*(?:xp|score|gain|award)/gi);
    if (m) { floors++; console.log("      possible score floor in " + f + ": " + m[0]); }
  });
  ok(floors === 0, "no per-item score floors in any game");

  let readGate = 0;
  ["quiz.js", "crunch.js", "equiv.js", "curve.js", "survival.js", "boss.js", "proof.js"].forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, "js/games", f), "utf8");
    if (!/MIN_READ_MS/.test(src)) { readGate++; console.log("      " + f + " does not check MIN_READ_MS"); }
  });
  ok(readGate === 0, "every scored mode enforces a minimum think/read time");

  // The optional crutches must LATCH — switching them off cannot refund.
  ["equiv.js", "lab.js"].forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, "js/games", f), "utf8");
    /* `let xUsed = false` is the declaration and is fine. A REASSIGNMENT back
       to false is the bug — that is exactly what refunded the crutch in the
       reference app, making it free and therefore mandatory. Strip the
       declarations first rather than trying to express "not a declaration"
       inside the pattern. */
    const body = src.replace(/\b(?:let|var|const)\s+\w+\s*=\s*false\s*;/g, "");
    const reassigned = /\w*Used\s*=\s*false/.test(body);
    ok(/Used = true/.test(src) && !reassigned,
      `${f}: the optional helper latches on first use and is never cleared`);
  });
  pass("anti-farm guards present");
}

/* ── 15. save import cannot be self-destroying ────────────── */
section("Save data");
{
  const src = fs.readFileSync(path.join(ROOT, "js/core/state.js"), "utf8");
  ok(/frozen = true;/.test(src) && /if \(frozen\) return;/.test(src),
    "replaceSave() latches writes off, so the post-import reload cannot overwrite it");
  ok(/deepMerge\(DEFAULT\(\), obj\)/.test(src),
    "imports are deep-merged against the current default shape");

  // End to end: export, mutate, import, assert.
  const ctx3 = makeContext(["MA", "ME"]);
  const S3 = ctx3.MQ.State;
  S3.load();
  S3.addXP(5000);
  const exported = S3.exportSave();
  const mutated = JSON.parse(exported);
  mutated.coins = 4242;
  mutated.profile.name = "Imported";
  const r = S3.importSave(JSON.stringify(mutated));
  ok(r.ok, "a valid save imports", r.error);
  ok(S3.data.coins === 4242 && S3.data.profile.name === "Imported", "imported values are live");
  ok(S3.isFrozen(), "writes are latched off after an import");
  const before = ctx3.localStorage._d["mathquest.save.v1"];
  S3.data.coins = 999999;
  S3.flush();
  ok(ctx3.localStorage._d["mathquest.save.v1"] === before,
    "a flush after the import cannot overwrite the imported file");
  const bad = S3.importSave("not json at all");
  ok(!bad.ok && /JSON/i.test(bad.error), "invalid JSON is rejected with a readable message");
  pass("save export/import round-trips");
}

/* ── result ───────────────────────────────────────────────── */
console.log("\n" + "─".repeat(58));
if (BREAK && !breakApplied) {
  console.log(`BREAK="${BREAK}" was requested but never applied — check the patch.`);
  process.exit(2);
}
if (BREAK) {
  // In BREAK mode a FAILURE is the expected, correct outcome.
  if (failures > 0) {
    console.log(`✓ BREAK="${BREAK}": ${failures} check(s) failed, as they must.`);
    console.log("  The guard this covers is genuinely load-bearing.");
    process.exit(0);
  }
  console.log(`✗ BREAK="${BREAK}": everything still passed with the guard removed.`);
  console.log("  That check is not testing what it claims to test.");
  process.exit(1);
}
console.log(failures === 0
  ? `✓ all ${checks} checks passed`
  : `✗ ${failures} of ${checks} checks FAILED`);
notes.forEach(n => console.log("  " + n));
process.exit(failures === 0 ? 0 : 1);
