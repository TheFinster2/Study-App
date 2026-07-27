# Build Brief — HSC Mathematics **Advanced + Extension 1**

**Hand this entire file to another agent.** It is a complete, self-contained specification:
what to build, how to build it, and — most valuable — the mistakes the reference app already
paid for so you don't repeat them.

> There is a sibling brief, `MATHS-BRIEF-STANDARD.md`, for Mathematics Standard 2. **Use
> exactly one.** They are separate apps, not one app with a switch — the content, the game
> modes and the maths renderer all differ.

The reference implementation is **MoleQuest**, a game-based HSC Chemistry study app:
<https://github.com/TheFinster2/Study-App> (branch `claude/hsc-chemistry-study-app-04o2ri`).
Clone and play it before writing code. It is ~10,000 lines across 42 files with no build
step, so it reads end to end in one sitting.

**Working name:** *MathQuest*. Change it if you have a better one.

---

## 0. Advanced-only vs Advanced + Extension 1 — READ FIRST

Extension 1 students sit Advanced as well, so this brief covers **both**, with Extension 1
as an additive tier. If the student is doing Advanced only, you build strictly less — you
never build something different.

**Confirm with the user which they want before writing content.** Then implement the choice
as a real toggle, not a fork:

```js
// js/data/tiers.js — the ONE place this decision lives.
MQ.DATA.TIERS = ["MA"];          // Advanced only
// MQ.DATA.TIERS = ["MA", "ME"]; // Advanced + Extension 1
```

Every topic code is prefixed `MA-` or `ME-`. `Bank.all()` filters on `TIERS`, so flipping
the array is the entire change. What that implies:

- **Question banks** live in separate files (`questions-ma-*.js`, `questions-me-*.js`). The
  `ME` files are simply not listed in `index.html`/`PRECACHE` for an Advanced-only build.
- **Game modes are shared.** No mode is Extension-only — Ext 1 content flows through the
  same Proof Builder, Calculation Crunch and so on. The two exceptions are called out in §5
  (Vector Lab and Induction Builder), which should self-hide when `TIERS` excludes `ME`
  rather than being separate screens.
- **The sixth boss** (§5) is Extension-only and hides the same way.
- **Achievements** referencing Ext 1 topics must be filtered out too, or an Advanced-only
  player sees permanently unobtainable achievements — a small thing that feels awful.
- **The validator asserts both configurations pass**, so an Advanced-only build never
  references an `ME-` id it isn't shipping. Add this on day one; it costs ten lines and it
  is the only thing that stops the toggle rotting.

Build the Advanced tier completely first, in either case. Extension 1 is step 12.

---

## 1. The ask

> Build a fun, interactive study app for HSC Mathematics. It needs to be enjoyable, have
> rewards of some form, and several different games — ideally the whole thing is a game.
> Make it a very full app.

Deliver a zero-dependency web app the student can open on their phone, install to the home
screen, and use on a train with no signal. No build step, no npm, no account, no backend.

---

## 2. Non-negotiable technical constraints

These come from the reference app and exist for good reasons. Do not "modernise" them.

| Constraint | Why |
|---|---|
| **No dependencies. No npm, no bundler, no framework.** | The user clones and opens `index.html`. Anything else is a barrier. |
| **Classic `<script>` tags in dependency order** — no ES modules | ES modules are blocked by CORS on `file://`. Script tags mean double-clicking `index.html` works. |
| **One global: `window.MQ`** (mirrors `window.CHEM`) | Namespacing without a module system. Every file starts `window.MQ = window.MQ \|\| {}`. |
| **Hash routing** (`#/play`, `#/game/quiz/MA-C1`) | Works from `file://` and from a GitHub Pages subpath with no server config. |
| **Vanilla DOM via one `el()` helper** | See `js/core/util.js`. ~40 lines, replaces all of React at this scale. |
| **`localStorage` save, debounced write + explicit flush** | See §9.4 — there is a mobile data-loss bug here you must copy the fix for. |
| **PWA: `manifest.webmanifest` + `sw.js` precache** | Offline is the point. Relative `start_url`/`scope` so it works from a subpath. |
| **Everything renders at 390 px with zero horizontal overflow** | It's a phone app first. Tested at 390 px *and* 360 px. |

**No MathJax, no KaTeX.** See §6 — this is the single biggest difference from the chemistry
app and the thing most likely to sink the project if you get it wrong.

---

## 3. Architecture to copy

```
index.html              shell + script order (the script order IS the dependency graph)
manifest.webmanifest    PWA metadata
sw.js                   service worker, cache-first, versioned CACHE name
assets/                 icons (SVG source + rendered PNGs at 192/512 + apple-touch)
css/styles.css          design system + 10 themes as CSS custom properties
js/data/tiers.js        the MA / ME toggle (§0)
js/data/*.js            content banks — pure data, no logic
js/core/util.js         DOM helpers, maths renderer, seeded RNG, numeric compare
js/core/expr.js         expression parser + evaluator + equivalence check (§6.3)
js/core/draw.js         canvas helpers: graphs, curves, vectors, normal curves
js/core/audio.js        WebAudio synthesised SFX — no audio files at all
js/core/fx.js           canvas particles, confetti, floating XP
js/core/state.js        the save file: XP, levels, coins, streaks, SRS, achievements
js/core/bank.js         question aggregation, tier filtering, adaptive draw
js/core/ui.js           hash router, toasts, modals, THE REWARD PIPELINE
js/core/arcade.js       ticket economy for the paid arcade
js/games/*.js           one file per game mode
js/screens/*.js         one file per screen (home, play, study, progress, shop, misc)
js/app.js               route registration + bootstrap
```

### The two conventions that hold it together

**1. Every reward flows through `UI.award({xp, coins, bonus, accuracy})`.** Level-ups,
achievement checks, toasts, confetti, the XP multiplier and the anti-farm accuracy gate all
happen in exactly one function. No game mode can forget them, and no game mode can bypass
the anti-cheat. This is what makes §9.5 enforceable rather than aspirational.

**2. Every game gets its chrome from `UI.gameShell(title, opts)` and registers teardown with
`UI.onLeave(fn)`.** The router calls `onLeave` before swapping screens. It is the only thing
stopping `setInterval` timers and `requestAnimationFrame` loops leaking between modes — and
in a maths app with animated graphs you will have far more of those than chemistry did.

### Public APIs worth mirroring exactly

```js
U      // util.js
  $, $$, el, clamp, randInt, pick, shuffle, sample, escapeHtml,
  dayKey, daysBetween, hash, seededRandom, seededShuffle, fmtTime, pct, sigFig, numClose

State  // state.js
  load, save, flush, onChange, emit, data (getter),
  xpNeeded, levelTitle, addXP, addCoins, spendCoins, MAX_LEVEL,
  difficulty, xpMultiplier, canPrestige, doPrestige, masteryTier,
  weekly, weeklyQuests, claimQuest, weekKey, touchStreak, streakBonus,
  recordAnswer, noteStreak, bump, markMode, recordScore, mastery, overallAccuracy,
  usePowerup, grantPowerup, ownsTheme, ownsAvatar,
  cardState, reviewCard, dueCards, cardXpEligible, markCardXp,
  checkAchievements, achievementStats, daily, dailySpec, progressDaily, claimDaily, reset

UI     // ui.js
  route, go, init, handleRoute, syncHeader, applyTheme, toast, modal, closeModal,
  confirmDialog, award, gameShell, results, rank, chip, onLeave, pulse,
  MIN_BONUS_ACCURACY, MIN_READ_MS

Bank   // bank.js
  all, byId, TOPICS, topicName, filter, draw, shuffleChoices, mistakeQuestions, statsByTopic
```

---

## 4. Content

Keep the chemistry question shape: `{ id, mod, topic, diff, q, choices, a, why }`.

### 4.1 Mathematics Advanced — the core tier (`MA-`)

| Code | Topic | Sub-topics for the `topic` field |
|---|---|---|
| **MA-F1** | Working with Functions | Domain & range, notation, odd/even, composite, inverse, transformations, absolute value, reciprocal functions |
| **MA-T1/T2** | Trigonometry & Measure of Angles | Radians, arc length, sector area, exact values, unit circle, graphs & transformations, identities, trig equations |
| **MA-C1** | Introduction to Differentiation | Limits, first principles, gradient functions, differentiability |
| **MA-C2** | Differential Calculus | Chain/product/quotient rules, tangents & normals, rates of change |
| **MA-C3** | Applications of Differentiation | Stationary points, first & second derivative tests, concavity, curve sketching, optimisation |
| **MA-C4** | Integral Calculus | Antiderivatives, the definite integral, areas under and between curves, the trapezoidal rule |
| **MA-E1** | Logarithms and Exponentials | Index & log laws, graphs of `a^x` and `log_a x`, `e^x` and `ln x`, their calculus, growth & decay |
| **MA-M1** | Modelling Financial Situations | APs & GPs, series, annuities, loans, compound interest, sums to infinity |
| **MA-S1** | Probability and Discrete Random Variables | Conditional probability, independence, tree diagrams, discrete random variables, expected value, variance |
| **MA-S2** | Descriptive Statistics & Bivariate Data | Summary statistics, displays, scatterplots, Pearson's r, least-squares regression |
| **MA-S3** | Random Variables | Continuous random variables, probability density functions, the normal distribution, z-scores |

### 4.2 Extension 1 — the additive tier (`ME-`)

Only built when `TIERS` includes `"ME"` (§0).

| Code | Topic | Sub-topics |
|---|---|---|
| **ME-F1** | Further Work with Functions | Inequalities (incl. rational & absolute value), graphing techniques, parametric form, functions with parameters |
| **ME-F2** | Polynomials | Remainder & factor theorems, roots and coefficients, multiple roots, polynomial division |
| **ME-T1** | Inverse Trigonometric Functions | Definitions & restricted domains, graphs, properties, exact values |
| **ME-T2** | Further Trigonometric Identities | Sum & difference, double angle, half angle, t-formulae, auxiliary angle, products to sums |
| **ME-T3** | Trigonometric Equations | Solving with identities, general solutions, equations of the form `a cos x + b sin x = c` |
| **ME-A1** | Working with Combinatorics | Permutations, combinations, arrangements in a circle, pigeonhole principle, binomial expansion, Pascal's triangle |
| **ME-C1** | Rates of Change | Related rates, exponential growth & decay with a limiting value (Newton's law of cooling) |
| **ME-C2** | Further Calculus Skills | Integration by substitution, differentiating & integrating inverse trig, integrals of `sin²`/`cos²` |
| **ME-C3** | Applications of Calculus | Volumes of solids of revolution, differential equations, direction fields |
| **ME-P1** | Proof by Mathematical Induction | Series, divisibility, inequality and product induction proofs |
| **ME-V1** | Vectors | Component form, magnitude & direction, addition & scalar multiplication, dot product, projection, projectile motion |
| **ME-S1** | The Binomial Distribution | Bernoulli trials, binomial probability, mean & variance, normal approximation |

> **Verify these codes against the current NESA syllabus before writing 400 questions.**
> They are correct as of the last syllabus revision the author is aware of, but codes get
> renumbered and it is much cheaper to check now than to re-tag later.

### 4.3 Volume targets

The chemistry app shipped these; match or beat them.

- **≥ 400 multiple-choice questions** for Advanced, plus **≥ 150** for Extension 1, every one
  with a worked `why`
- **≥ 80 flashcards** for Advanced (exact values, derivative/integral rules, log laws,
  definitions), plus **≥ 40** for Extension 1
- **≥ 40** procedurally generated calculation templates (see §9.9 and §9.10)
- **≥ 12** multi-step proof/derivation puzzles for the Proof Builder, of which ≥ 6 are
  induction proofs when Ext 1 is on
- **≥ 65 achievements**, from *First Steps* to *Answer 5,000 questions*
- Reference tables: exact trig values, the unit circle, derivative & integral rules, log
  laws, the standard normal table, financial formulae, combinatorics identities, vector
  identities, and a full formula sheet mirroring the NESA reference sheet
- Procedurally generated calculations, so numeric practice never runs out

---

## 5. Game modes — the chemistry→maths mapping

The chemistry app has eleven modes plus five bosses plus a three-game arcade. ⭐ marks the
ones where maths is genuinely *better* than chemistry was — lead with those.

| Chemistry | → Maths | Notes |
|---|---|---|
| ⚡ Rapid Fire | ⚡ **Rapid Fire** | Unchanged. 2 min, endless questions, streak multiplier to ×3. |
| 🎯 Module Drill | 🎯 **Topic Drill** | Unchanged. 15 adaptive questions from one topic, no clock. |
| ⚖️ Balance Blitz | ⭐ 🔁 **Equivalence Engine** | Chemistry showed a live per-element atom tally. Maths shows a live **numeric equivalence check**: the student rearranges or simplifies an expression and you verify by evaluating both sides at random values of *x*. Same "the game tells you the truth as you type" feel. See §6.3 — and §6.5 for the traps. |
| 🧩 Ion Memory | 🃏 **Match Pairs** | Concentration-style. Match function↔derivative, graph↔equation, expression↔factored form, identity↔equivalent form. |
| 🏷️ Name That Compound | ⭐ 📈 **Read the Curve** | Given a *drawn* graph, pick the equation — and the reverse. Canvas-rendered, so it's infinitely generatable. Chemistry's version needed 28 hand-authored compounds; this needs none. |
| 🔢 Calculation Crunch | ⭐ 🔢 **Calculation Crunch** | The big one. Procedurally generated: differentiate, integrate, solve quadratics, log laws, z-scores, APs/GPs, annuities, related rates — plus combinatorics and substitution integrals on the Ext 1 tier. Maths generates far more variety than chemistry could. Read §9.9 first. |
| 🌧️ Precipitation Panic | ⏱️ **Table Panic** | Fill a grid against the clock: the unit circle (exact sin/cos/tan), the derivative table, the integral table, log laws. |
| 🧪 Titration Lab | ⭐ 📐 **Calculus Lab** | The flagship interactive toy. Drag a point along a curve to place a tangent, read off the gradient, then compute *f′(x)* exactly and compare. Second mode: drag the bounds of a shaded region, estimate the area with trapezoids, then integrate exactly. Chemistry's titration sim was the most-praised mode; this is the same shape. |
| 🔗 Pathway Puzzle | ⭐ 🪜 **Proof Builder** | Chemistry: build a synthesis route through a reaction graph. Maths: assemble a proof or derivation from shuffled step cards in the correct order — trig identity proofs, optimisation write-ups, and (Ext 1) induction. Validate with the same BFS/step-count check. |
| 💀 Survival | 💀 **Survival** | Unchanged. One life, tightening clock, escalating difficulty. |
| 🩹 Mistake Rehab | 🩹 **Mistake Rehab** | Unchanged. Only questions you've previously missed. |
| *(Ext 1 only)* | ⭐ 🎯 **Vector Lab** | Hides itself when `TIERS` excludes `ME`. A projectile-motion canvas: drag launch angle and speed to hit a target, then compute the exact range, time of flight and max height. The second-best toy in the app, and it only exists on the Extension tier — a genuine reward for being there. |
| *(Ext 1 only)* | 🪜 **Induction Builder** | A specialised Proof Builder: assemble base case → assumption → inductive step → conclusion, with the algebra of the step itself as a fill-in. Induction is the hardest thing in Ext 1 to learn from a textbook and the easiest to drill interactively. |

### Boss fights

Five HP duels with a per-question timer (six with Extension 1), each with a **gimmick**:

1. **The Asymptote** (MA-F1 Functions) — heals 10% every third question, approaching but never reaching full HP.
2. **Radian the Rotator** (MA-T Trigonometry) — the answer options rotate position every 3 seconds.
3. **Lord Leibniz** (MA-C1–C3 Differentiation) — doubles the damage of wrong answers.
4. **The Integrator** (MA-C4 Integration) — hides the topic label; its HP bar is a shaded area that fills back in.
5. **Sigma** (MA-S Statistics) — randomises which of your power-ups are available each turn.
6. **The Inductor** *(Ext 1 only)* — a three-phase fight mirroring base case / inductive step / conclusion; fail a phase and you restart that phase, not the fight.

Beat one to unlock the next; all of them unlock **The Final Paper**, a mixed 25-question
gauntlet drawn from every enabled tier.

### The Arcade (pay to play, earns nothing)

Three arcade games rented with the in-game currency in 5/15/30-minute tickets:

- **Prime Crush** — 8×8 match-3 on number tiles
- **Vector Runner** — endless canvas runner; jump the gaps, duck under the ceiling
- **Power Tower 2048** — 4×4 merge up the powers of 2 (already a maths game)

**Critical:** these must award **no XP, no currency, no achievements — only a high score.** An
endless runner that paid XP is a better farm than studying. Because all rewards go through
`UI.award()`, you enforce this structurally by simply never calling it from arcade code.

---

## 6. Rendering maths without a library — READ THIS FIRST

This is the one genuinely hard problem chemistry didn't have. Chemistry needed
`H2SO4 → H₂SO₄`, a 3-line regex (`js/core/util.js:53`). Maths needs fractions, powers,
roots, integrals, limits, summations — and, on the Extension tier, vectors and `nCr`.

### 6.1 The approach: Unicode + a tiny CSS component set. Not a layout engine.

Define a small inline mini-language in your content files and a ~120-line renderer in
`util.js` that converts it to HTML:

| You write | Renders as | How |
|---|---|---|
| `x^2`, `x^{n+1}` | x², x<sup>n+1</sup> | Unicode superscripts for single digits; `<sup>` otherwise |
| `x_1` | x₁ | Unicode subscripts |
| `\frac{a}{b}` | stacked fraction | `<span class="frac"><span class="num">a</span><span class="den">b</span></span>` — 15 lines of CSS: `display:inline-flex; flex-direction:column` and a `border-top` on the denominator |
| `\sqrt{x}` | √x̅ | `√` + `<span class="rad">x</span>` with a `border-top` |
| `\int_a^b` | ∫ with limits | `<span class="lim">` stack |
| `\sum_{n=1}^{k}` | Σ with limits | same `.lim` component |
| `\lim_{x->0}` | lim with subscript | same |
| `pi`, `theta`, `>=`, `->`, `inf`, `int` | π, θ, ≥, →, ∞, ∫ | plain symbol table |
| `d/dx` | stacked fraction | reuse `.frac` |
| **Ext 1:** `\vec{a}`, `\|a\|`, `nCr(n,k)` | **a** / a̲, ‖a‖, ⁿC<sub>k</sub> | bold+underline span, doubled bars, `<sup>/<sub>` pair |

Everything else is literal text. **Escape HTML before you substitute** — chemistry's
`formula()` does; copy that ordering or you've built an XSS hole in a study app.

### 6.2 Why not KaTeX

300 kB, a dependency, font files to precache, and it renders one way. The mini-language above
covers ~98% of HSC notation in about 120 lines you fully control and that costs nothing
offline. Budget half a day, and **write unit tests for the renderer** (§8) — it's used on
every screen, so a bug here is a bug everywhere.

The `.frac` component must survive nesting (a fraction inside a fraction inside a `\sqrt`)
because Ext 1 will do that to you. Test it explicitly at three levels deep, at 390 px.

### 6.3 Checking algebraic answers without a CAS

For free-response algebra — the Equivalence Engine, and anywhere the student types an
expression — do **not** string-compare and do **not** use `eval`.

Write a ~150-line recursive-descent parser producing an AST (`js/core/expr.js`), then an
evaluator. To check the student's expression against the target:

```js
// Evaluate both at 8 pseudo-random x values seeded from the question id (so the check is
// deterministic and reproducible in tests). Skip any sample where either side is
// non-finite; require at least 5 clean samples. Agreement to 1e-9 relative is equivalence
// for every expression class in the HSC course.
function equivalent(userAst, targetAst, seed) { /* ... */ }
```

This is robust and correctly accepts `2sin(x)cos(x)` for `sin(2x)`, which no string
comparison ever will.

**Never call `eval()` or `new Function()` on student input.** Not for safety theatre — the
parser gives you *better* error messages ("unmatched bracket at character 7") than a thrown
`SyntaxError` ever could.

### 6.4 Numeric answers

Chemistry's `U.numClose(input, expected, tolRel)` already handles thousands separators and
`×10^` scientific notation. Extend it to accept, via the §6.3 parser:

- `pi/4` and `π/4` → 0.7854
- `sqrt(2)` / `√2`
- exact fractions `3/8`
- `ln(3)`, `e^2`
- **Ext 1:** vector answers as component pairs `(3, -4)` or `3i - 4j` — this needs its own
  comparison path, not `numClose`. Compare componentwise with tolerance.

Default tolerance 0.5% relative, overridable per question; exact to the cent for money.

### 6.5 Equivalence checking traps — the Extension tier will find all of these

The random-sampling equivalence check in §6.3 is excellent, and it has exactly four failure
modes. Handle them up front or you will ship a game that marks correct answers wrong:

1. **Domain restrictions.** `sqrt(x²)` and `x` agree only for x ≥ 0. Sample from a domain
   declared per question, not from ℝ.
2. **Branch cuts (Ext 1, ME-T1).** `arcsin(sin x)` equals `x` only on `[-π/2, π/2]`. Inverse
   trig questions must carry their principal-value range and sample inside it.
3. **Poles.** `tan x`, rational functions and `ln x` blow up. Reject non-finite samples and
   require a minimum count of clean ones — never let 8 rejected samples read as "equivalent".
4. **Coincidental agreement.** Two different expressions can agree at a few points. Eight
   samples over an interval makes this vanishingly unlikely; two does not. Don't economise.

Write a test that asserts each of these four cases behaves correctly. It is thirty lines and
it will save you a bug report from a student who typed the right answer.

---

## 7. Progression and economy (copy the numbers, they're tuned)

- **XP:** correct answers pay `10 × difficulty`, multiplied by a streak multiplier (×1 → ×3
  in half-steps every 5 correct). Extension 1 questions carry `diff:3` more often, so they
  pay more naturally — don't add a separate Ext 1 bonus on top or the Advanced tier feels
  like a chore.
- **Levels:** `xpNeeded(n) = round(130 × n^1.5)`, **60 levels** with themed titles. Level 20
  is ~87,000 XP; level 60 is ~1.42 M. A whole-HSC-year progression, deliberately. The
  reference app's user explicitly asked for it to be *harder* than the first tuning — don't
  soften it.
- **Prestige/Ascension:** at level 60, reset level and XP but keep every unlock, achievement,
  flashcard box and statistic, and gain a permanent **+12% XP** that stacks per ascension.
- **Currency:** chemistry used "Moles" 🪙. Here use **"Primes"** 🔢. Game payouts scaled to
  **60%** so it stays scarce. Spend on 7 power-ups (50/50, Skip, Time Freeze, Buffer, Boost,
  Insight, Adrenaline), **10 themes**, **22 avatars**, 3 tiers of random supply crate, and
  arcade playtime. Level-gate the good items as well as pricing them.
- **Difficulty modes:** Standard / Hard (×1.45 XP, −25% time) / Nightmare (×2.1 XP, −45%
  time, 50/50 and Skip disabled). Set once in Settings, applies everywhere. **This is
  separate from the MA/ME tier toggle** — don't conflate "harder scoring" with "more
  syllabus".
- **Daily challenge:** derived from the date via seeded PRNG, so it's stable all day and
  identical for every player.
- **Weekly quests:** 3 per ISO week from a 12-quest pool via seeded shuffle. Derive progress
  by diffing cumulative stats against a baseline snapshot taken at week rollover.
- **Streaks:** consecutive-day bonus growing to +60 XP per run.
- **Spaced repetition:** 5-box Leitner, intervals 1/2/4/8/16 days; a miss drops to box 1.
- **Adaptive draw:** weight each question ×3.5 if previously missed, plus a bonus scaled to
  how weak that topic is.
- **Mastery:** confidence-weighted, `accuracy × min(1, seen/25)` — not raw accuracy, so a
  perfect 3-question run doesn't read as mastered.

---

## 8. Testing regime — build these as you go, not at the end

Five plain Node + Playwright scripts, no test framework. Chromium is at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` in this environment.

1. **`validate.js`** — loads the data files in a Node `vm` sandbox where the context global
   *is* `window`, then asserts content invariants:
   - Every question has 4 options, `a:0`, a non-empty `why`, and a valid topic code
   - No duplicate ids
   - Every proof puzzle is solvable in its declared number of steps
   - No achievement unlocks on a fresh save
   - `PRECACHE` in `sw.js` matches the files on disk exactly
   - **The answer-length distribution check** (§9.7)
   - **Both tier configurations pass** (§0) — an `MA`-only build references no `ME-` id
   - **Maths-specific and essential:** every procedurally generated question is solved
     independently by the validator, and every stored numeric answer is re-derived from its
     own question text. Run 500 samples per generator.
   - **Also maths-specific:** round-trip every string through the §6.1 renderer and assert no
     unbalanced braces, no leftover `\` commands, and no raw `<` reaching the DOM. Plus the
     four equivalence traps in §6.5.

2. **`smoke.js`** — Playwright drives every mode, a boss fight, a shop purchase, a crate
   opening, a theme switch and a reload-persistence check. Fails on **any** console error.
   Plus horizontal-overflow checks across every screen at **390 px and 360 px**.

3. **`offline.js`** — serves the app from a *subpath* (`http://127.0.0.1:8811/App/`, which is
   what GitHub Pages looks like), confirms the service worker registers and precaches, then
   **cuts the network** and verifies every screen renders and that progress saved while
   offline survives a reload.

4. **`exploit.js`** — a zero-knowledge bot: always picks option A, spams "Got it" on every
   flashcard, submits garbage in every free-response field. **Fails the build if any mode
   pays more than 25 XP, if the sustained rate exceeds 2,000 XP/hour, or if pure guessing
   reaches level 2.** Run after every economy change. See §9.5.

5. **`arcade.js`** — tickets charge correctly, a broke player is refused, the clock runs only
   while the game is on screen, high scores survive a reload, and **XP/level/currency are
   provably untouched by playing**.

**Also run an "honest player" bot** alongside `exploit.js` — one that answers correctly.
Every anti-cheat measure in §9 could plausibly break normal play, and the only way to know it
hasn't is to measure both directions. The chemistry app's honest bot earns 608/619/248 XP in
three modes; the spam bot earns 0.

---

## 9. The twelve mistakes already paid for — do not repeat them

Each of these was a real defect in the reference app, several reported by the user *after*
shipping.

### 9.1 `display: grid` beats the `hidden` attribute
`.modal-root { display: grid }` overrode `[hidden]`, leaving an invisible full-screen overlay
that swallowed every click after the first modal closed. **Fix:**
`[hidden] { display: none !important }` at the top of your stylesheet.

### 9.2 Grid children default to `min-width: auto`
Game screens overflowed horizontally on mobile because a grid/flex child won't shrink below
its content. **Fix:** `.gshell > * { min-width: 0 }` on every game container, wrap your
header/meta rows, hide non-essential chrome below 430 px. Watch this closely with the `.frac`
and `.lim` components — a deeply nested fraction is exactly the kind of unshrinkable content
that triggers it.

### 9.3 A service worker makes every first load reload itself
`clients.claim()` fires `controllerchange` even when there was no previous controller, so a
naive "reload on controllerchange" handler reloads every first visit. **Fix:** capture
`const hadController = !!navigator.serviceWorker.controller` **before** registering, and
ignore the event when it's false. (`js/app.js:87`)

### 9.4 Debounced saves lose data on mobile
A 200 ms debounce with no flush means backgrounding the tab mid-write loses progress —
mobile browsers reclaim tabs aggressively. **Fix:** `State.flush()` on both
`visibilitychange` (when hidden) and `pagehide`. `visibilitychange` is the only event mobile
reliably fires before reclaiming a tab.

### 9.5 XP was farmable by spamming — the user found this, not the tests
The original design paid XP for correct answers with **no penalty for wrong ones**, so
mashing any answer and submitting earned **35,097 XP/hour**. Four fixes, all required:

1. **Accuracy-gate the completion bonus.** Below 50% accuracy the end-of-run bonus is
   withheld *entirely*; above it, scaled by accuracy. Enforce inside `UI.award()` so no mode
   can skip it.
2. **Wrong answers subtract XP** from the run's pool (floored at zero).
3. **A minimum read time.** Answers faster than **1,200 ms** — quicker than the question can
   physically be read — pay nothing. Export as `UI.MIN_READ_MS` and use it everywhere.
4. **Remove every XP floor.** "You get at least 50 XP for finishing" is a farm.

Result: 35,097 XP/hr → **0**, with honest play unchanged. Design this in from day one; it is
far more painful to retrofit.

### 9.6 Guessable grids need *net* scoring
A fill-the-grid mode with two states per cell is ~50% correct by chance. Scoring `right`
alone paid well for random clicking. **Fix:** score `max(0, right − wrong)`, and scale any
time bonus by accuracy with a floor (no bonus below 75%). Applies directly to **Table Panic**.

### 9.7 The correct answer was always the longest option — the user found this too
Writing a thorough correct answer and three throwaway distractors makes the key guessable
from length alone. Measured: **63.9%** score by always picking the longest option.

**Fix:** put the reasoning in `why`, keep the key terse, and make every distractor a
specific, plausible misconception of comparable length. 156 questions were rewritten and 45
more had a distractor lengthened, taking longest-option scoring to 32.3% and *strictly*
longest-is-key to 24.3% — **below the 25% you'd get by chance**.

**Then automate it.** The validator fails the build if longest-option scoring exceeds 32%.
Write this check on day one and you'll never author a biased question in the first place.
Maths has a natural advantage — options are short expressions, so length is less informative
— but the check is cheap and catches other authoring drift.

Maths has its *own* version of this tell you must guard separately: **the most
structurally-complex option is often the key**, because distractors get written as
simplifications. If three options are `2x`, `x²`, `4x` and the fourth is
`\frac{2x}{\sqrt{x²+1}}`, a student picks the fourth without reading the question. Measure
"pick the option with the most operators" the same way you measure length.

### 9.8 Self-graded flashcards are free money
"Did you get it?" → "Yes" → XP is an infinite loop. **Fix:** a card pays only **once per
day**, only if it was genuinely **due**, and only if it stayed on screen for `MIN_READ_MS`.
Report accuracy to `award()` as *paid cards / deck size*, never the self-reported figure.

### 9.9 Simulators and generators must produce the answer first, then the question
The titration sim randomised concentrations and volumes independently, so the required titre
could exceed the input cap and the equipment's capacity. The question was literally
unanswerable, and the user hit it in normal play.

**Fix: pick the answer first, in a known-good range, then derive the inputs from it.** This
is the most important content rule in this document, and it generalises across every maths
generator:

- **Quadratics:** pick integer roots, then expand — not random coefficients hoping for a nice
  discriminant.
- **Integrals:** pick the antiderivative, then differentiate it to get the integrand. This is
  the only way to guarantee a closed-form answer exists at all.
- **Right triangles:** pick a Pythagorean triple; don't randomise two sides.
- **Optimisation:** pick the stationary point, then construct the function around it.
- **Logs:** pick the result, then build the expression.
- **Financial:** pick the final balance, then solve backwards for the payment.
- **Ext 1 — substitution integrals:** pick `u` and the outer function, then compose forwards.
- **Ext 1 — combinatorics:** pick the answer's magnitude band first; `nCr` explodes, and
  randomising n and r gives you either `6` or `2.7×10¹⁴` with nothing in between.
- **Ext 1 — projectile motion:** pick the landing point and time of flight, then derive the
  launch velocity and angle. Randomising angle and speed puts the target off-canvas.
- **Ext 1 — induction:** pick the closed form, then derive the series.

Then assert the range and validity in the validator across 500 samples per generator.

### 9.10 Procedural generators need a difficulty *contract*
Chemistry's `calc.js` produced problems whose difficulty varied wildly for the same declared
`diff`. In maths this is much worse — "differentiate this" spans one line to fifteen. Give
each generator an explicit contract: number of steps required, magnitude of the numbers, and
whether the answer is an integer, a simple fraction, a surd, or a decimal. Assert it in tests.

### 9.11 A "free" game becomes the optimal strategy
The arcade was nearly shipped paying small XP. An endless runner paying even 1 XP/second
beats studying. **Fix:** free/fun modes award nothing but a high score, enforced structurally
by never calling `award()`. State it in the UI so it doesn't read as a bug — *"spend Primes,
earn nothing but bragging rights."*

### 9.12 Test-harness traps that will cost you an hour each
- Assigning an **unchanged** `location.hash` fires no `hashchange`, so the router never runs
  and your test hangs. Call the router function directly (`UI.go(...)`) from tests.
- Results modals that open on a delay (e.g. 900 ms after the last question) make a naive
  "dismiss the modal" step race the animation. Write one `dismissModal()` helper that waits.
- A shop test asserting "coins must decrease" breaks once achievements can pay out more than
  the item costs mid-purchase. Assert `spendCoins` was called and the inventory changed.

---

## 10. Suggested build order

1. **Skeleton + `util.js` + the maths renderer (§6.1) + its tests.** Everything depends on it.
2. `state.js` with the save file, XP curve, and `UI.award()` **including the §9.5 gates from
   the start**. Write `exploit.js` now, while it's trivially passing.
3. `ui.js` router, shell, modals, toasts. Add `[hidden]{display:none!important}` (§9.1) and
   `min-width:0` (§9.2) to the stylesheet immediately.
4. `tiers.js` and tier-aware `Bank.all()` (§0) — ten lines now, a refactor later.
5. One Advanced topic bank (~40 questions from MA-C2, which is self-contained and
   high-value) + `bank.js` + Rapid Fire. Now it's playable.
6. **`expr.js`** — the parser, evaluator and equivalence check (§6.3) *with the §6.5 trap
   tests*. This unlocks Calculation Crunch and the Equivalence Engine.
7. `draw.js` — canvas graph/curve helpers. Unlocks Read the Curve and Calculus Lab.
8. The rest of the game modes, cheapest first. Keep `smoke.js` green after each one.
9. Advanced content push to the §4.3 targets. Run the length-bias and complexity-bias checks
   (§9.7) continuously.
10. Shop, achievements, progress screen, daily/weekly, prestige.
11. Bosses 1–5. PWA (manifest, service worker, icons) + `offline.js`.
12. **Extension 1 tier** — `ME-` banks, Vector Lab, Induction Builder, the sixth boss. Verify
    the Advanced-only build still passes every test with `TIERS = ["MA"]`.
13. Arcade last — pure fun, and it can't break the economy if it never calls `award()`.

Commit at each numbered step with the tests green. Don't batch.

---

## 11. Delivery and hosting

- Push to a single feature branch; don't open a PR unless the user asks.
- To get it on a phone: **GitHub → Settings → Pages → Deploy from a branch → `<branch>` /
  `(root)`**. Live at `https://<user>.github.io/<repo>/` in about a minute. An agent
  generally *cannot* enable Pages — tell the user this is a manual step rather than
  pretending to do it.
- Then: iOS/Safari *Share → Add to Home Screen*, Android/Chrome *⋮ → Add to home screen*.
  Open once online so the precache completes.
- LAN alternative: `python3 -m http.server 8000`. Note that service workers won't register
  over plain HTTP to a LAN IP, so that route gives the app but not offline caching.
- Offer Settings → **Export save / Import save** as JSON, since `localStorage` is per-device.
- **Bump the `CACHE` constant in `sw.js` on every deploy** and keep `PRECACHE` in sync with
  the files on disk. The validator should fail the build if they drift — otherwise offline
  users keep serving the old version forever. Note that switching tiers changes the file
  list, so it must bump the cache too.

---

## 12. Tone and polish

The reference app's personality is dry, confident and a bit chemistry-nerdy — theme names
like *Exothermic* and *Noble Gold*, rank blurbs like *"Flawless work. Band 6 energy."* Do the
maths equivalent (*Asymptotic*, *Golden Ratio*, *Imaginary*, *Monte Carlo*, *Euler*) rather
than generic gamification voice. It matters more than it sounds like it should: the user
asked for "enjoyable" first and "study app" second.

If Extension 1 is enabled, mark its content visibly but not smugly — a small `EXT` chip on
the question card is enough. Do not gate Advanced content behind Extension progress; they're
parallel tiers of one course, not a difficulty ladder.

Synthesise **all** sound effects in WebAudio (`js/core/audio.js` has ~67 of them in 273
lines) — no audio files, nothing to precache, nothing to license. The reference app's user
explicitly asked for "way more sound effects" mid-build; budget for a large SFX vocabulary
from the start.

Respect `prefers-reduced-motion` (disable particles and background animation), support
keyboard play (`1`–`4` answer, `Enter` advances, `Esc` closes), and keep every theme legible
in both light and dark.
