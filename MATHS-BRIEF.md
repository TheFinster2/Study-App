# Build Brief — MathQuest (HSC Mathematics)

**Hand this entire file to another agent.** It is a complete, self-contained specification:
what to build, how to build it, and — most valuable — the twelve mistakes the reference app
made so you don't repeat them.

The reference implementation is **MoleQuest**, a game-based HSC Chemistry study app:
<https://github.com/TheFinster2/Study-App> (branch `claude/hsc-chemistry-study-app-04o2ri`).
Clone and play it before writing code. It is ~10,000 lines across 42 files with no build
step, so it reads end to end in one sitting.

> **One thing to confirm with the user before you start on content:** which HSC maths course.
> This brief assumes **Mathematics Advanced** as the core, with **Extension 1** as a bonus
> tier. If they're doing Standard 2 or Extension 2, swap the topic list in §4 — nothing else
> in this document changes.

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
| **One global: `window.MATH`** (mirrors `window.CHEM`) | Namespacing without a module system. Every file does `window.MATH = window.MATH \|\| {}`. |
| **Hash routing** (`#/play`, `#/game/quiz/M2`) | Works from `file://` and from a GitHub Pages subpath with no server config. |
| **Vanilla DOM via one `el()` helper** | See `js/core/util.js`. ~40 lines, replaces all of React for this scale. |
| **`localStorage` save, debounced write + explicit flush** | See §9.4 — there is a mobile data-loss bug here you must copy the fix for. |
| **PWA: `manifest.webmanifest` + `sw.js` precache** | Offline is the point. Relative `start_url`/`scope` so it works from a subpath. |
| **Everything renders at 390 px wide with zero horizontal overflow** | It's a phone app first. Tested at 390 px *and* 360 px. |

**No MathJax, no KaTeX.** They're heavy, they're a dependency, and they fight the offline
precache. See §6 for what to do instead — this is the single biggest difference from the
chemistry app and the thing most likely to sink the project if you get it wrong.

---

## 3. Architecture to copy

```
index.html              shell + script order (the script order IS the dependency graph)
manifest.webmanifest    PWA metadata
sw.js                   service worker, cache-first, versioned CACHE name
assets/                 icons (SVG source + rendered PNGs at 192/512 + apple-touch)
css/styles.css          design system + 10 themes as CSS custom properties
js/data/*.js            content banks — pure data, no logic
js/core/util.js         DOM helpers, maths renderer, seeded RNG, numeric compare
js/core/audio.js        WebAudio synthesised SFX — no audio files at all
js/core/fx.js           canvas particles, confetti, floating XP
js/core/state.js        the save file: XP, levels, coins, streaks, SRS, achievements
js/core/bank.js         question aggregation, filtering, adaptive draw
js/core/ui.js           hash router, toasts, modals, THE REWARD PIPELINE
js/core/arcade.js       ticket economy for the paid arcade
js/games/*.js           one file per game mode
js/screens/*.js         one file per screen (home, play, study, progress, shop, misc)
js/app.js               route registration + bootstrap
```

### The two conventions that hold it together

**1. Every reward flows through `UI.award({xp, coins, bonus, accuracy})`.** Level-ups,
achievement checks, toasts, confetti, the XP multiplier, the anti-farm accuracy gate — all
of it happens in exactly one function. No game mode can forget them, and no game mode can
bypass the anti-cheat. This is what makes §5 enforceable rather than aspirational.

**2. Every game gets its chrome from `UI.gameShell(title, opts)` and registers teardown
with `UI.onLeave(fn)`.** The router calls `onLeave` before swapping screens. This is the
only thing stopping `setInterval` timers and `requestAnimationFrame` loops leaking between
modes — and in a maths app with animated graphs you will have more of those than chemistry did.

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

## 4. Content — HSC Mathematics Advanced

Replace chemistry's 8 modules with the Advanced topic tree. Keep the same
`{ id, mod, topic, diff, q, choices, a, why }` question shape.

| Code | Topic | Sub-topics for the `topic` field |
|---|---|---|
| **MA-F** | Functions | Domain/range, composite, inverse, transformations, polynomials, absolute value |
| **MA-T** | Trigonometry | Radians, exact values, graphs & transformations, identities, equations |
| **MA-C1** | Differential Calculus | First principles, chain/product/quotient, tangents & normals, stationary points, curve sketching, optimisation |
| **MA-C2** | Integral Calculus | Antiderivatives, definite integrals, area between curves, trapezoidal rule, volumes |
| **MA-E** | Exponentials & Logs | Log laws, exponential & log graphs, `e^x` and `ln x` calculus, growth & decay |
| **MA-S** | Statistical Analysis | Bivariate data, correlation & regression, random variables, normal distribution & z-scores |
| **MA-M** | Financial Maths | Sequences & series, APs/GPs, annuities, loans, compound interest |
| **MA-P** | Probability | Conditional probability, tree diagrams, independence, discrete random variables |

Bonus tier (level-gated, marked clearly as beyond Advanced):

| **EX1-*** | Extension 1 | Further trig (t-formulae, sums to products), inverse trig functions, vectors, binomial distribution, mathematical induction, further calculus |

**Volume targets** (the chemistry app shipped these; match or beat them):

- **≥ 375 multiple-choice questions**, every one with a worked `why` explanation
- **≥ 70 flashcards** (formulae, exact values, derivative/integral rules, definitions)
- **≥ 35** worked "identity/rearrangement" items for the equivalence game
- **≥ 10** multi-step proof/derivation puzzles
- **≥ 65 achievements**, scaled from *First Steps* to *Answer 5,000 questions*
- Reference tables: exact trig values, unit circle, derivative rules, integral rules,
  log laws, the standard normal table, financial formulae, and a full formula sheet
- Procedurally generated calculation problems, so numeric practice never runs out

---

## 5. Game modes — the chemistry→maths mapping

The chemistry app has eleven modes plus five bosses plus a three-game arcade. Here is what
each becomes. The ones marked ⭐ are the ones where maths is genuinely *better* than
chemistry — lead with those.

| Chemistry | → Maths | Notes |
|---|---|---|
| ⚡ Rapid Fire | ⚡ **Rapid Fire** | Unchanged. 2 min, endless questions, streak multiplier to ×3. |
| 🎯 Module Drill | 🎯 **Topic Drill** | Unchanged. 15 adaptive questions from one topic, no clock. |
| ⚖️ Balance Blitz | ⭐ 🔁 **Equivalence Engine** | Chemistry showed a live per-element atom tally. Maths shows a live **numeric equivalence check**: the student rearranges/simplifies an expression, and you verify by evaluating both sides at 8 random values of *x*. Same "the game tells you the truth as you type" feel. See §6.3. |
| 🧩 Ion Memory | 🃏 **Match Pairs** | Concentration-style. Match function↔derivative, graph↔equation, expression↔factored form, identity↔equivalent. |
| 🏷️ Name That Compound | ⭐ 📈 **Read the Curve** | Given a *drawn* graph, pick the equation — and the reverse. Canvas-rendered, so it's infinitely generatable. Chemistry's version needed 28 hand-authored compounds; this needs none. |
| 🔢 Calculation Crunch | ⭐ 🔢 **Calculation Crunch** | The big one. Procedurally generated: differentiate, integrate, solve quadratics, log laws, z-scores, APs/GPs, annuities, related rates. Maths can generate *far* more variety than chemistry could. Read §9.10 before writing a single generator. |
| 🌧️ Precipitation Panic | ⏱️ **Table Panic** | Fill a grid against the clock: the unit circle (exact sin/cos/tan), the derivative table, the integral table, log laws. |
| 🧪 Titration Lab | ⭐ 📐 **Calculus Lab** | An interactive canvas simulator. Drag a point along a curve to place a tangent, read off the gradient, then compute *f′(x)* exactly and compare. Second mode: drag the bounds of a shaded region, estimate the area with trapezoids, then integrate exactly. This is the flagship "toy" — chemistry's titration sim was the most-praised mode. |
| 🔗 Pathway Puzzle | ⭐ 🪜 **Proof Builder** | Chemistry: build a synthesis route through a reaction graph. Maths: assemble a proof or derivation from shuffled step cards in the correct order — induction proofs, trig identity proofs, optimisation write-ups. Validate with the same BFS/step-count check. |
| 💀 Survival | 💀 **Survival** | Unchanged. One life, tightening clock, escalating difficulty. |
| 🩹 Mistake Rehab | 🩹 **Mistake Rehab** | Unchanged. Only questions you've previously missed. |

### Boss fights

Five HP duels with a per-question timer, each themed on a topic with a **gimmick**:

1. **The Asymptote** (Functions) — questions get harder but never quite unsolvable; heals 10% every third question.
2. **Radian the Rotator** (Trigonometry) — the answer options rotate position every 3 seconds.
3. **Lord Leibniz** (Differentiation) — doubles the damage of wrong answers.
4. **The Integrator** (Integration) — hides the topic label, and its HP bar is a shaded area that fills back in.
5. **Sigma** (Statistics) — randomises which of your power-ups are available each turn.

Beat one to unlock the next; all five unlock **The Final Paper** (a mixed 25-question gauntlet).

### The Arcade (pay to play, earns nothing)

Three arcade games rented with the in-game currency in 5/15/30-minute tickets. Reskin the
chemistry ones — the mechanics are already maths-flavoured:

- **Prime Crush** — 8×8 match-3 on number tiles (match three equal values; a "×" tile clears a row)
- **Vector Runner** — endless canvas runner; jump the gaps, duck under the ceiling
- **Power Tower 2048** — 4×4 merge, but the ladder is powers of 2 (this is literally already the game)

**Critical:** these must award **no XP, no currency, no achievements — only a high score.**
An endless runner that paid XP is a better farm than studying. Because all rewards go through
`UI.award()`, you enforce this structurally by simply never calling it from arcade code.

---

## 6. Rendering maths without a library — READ THIS FIRST

This is the one genuinely hard problem that chemistry didn't have. Chemistry needed
`H2SO4 → H₂SO₄`, which is a 3-line regex (`js/core/util.js:53`). Maths needs fractions,
powers, roots, integrals, limits and summations.

### 6.1 The approach: Unicode + a tiny CSS component set. Not a layout engine.

Define a small inline mini-language in your content files and a ~120-line renderer in
`util.js` that converts it to HTML. Suggested syntax:

| You write | Renders as | How |
|---|---|---|
| `x^2`, `x^{n+1}` | x², x<sup>n+1</sup> | Unicode superscripts for single digits; `<sup>` otherwise |
| `x_1` | x₁ | Unicode subscripts |
| `\frac{a}{b}` | stacked fraction | `<span class="frac"><span class="num">a</span><span class="den">b</span></span>` — 15 lines of CSS with `display:inline-flex; flex-direction:column` and a `border-top` on the denominator |
| `\sqrt{x}` | √x̅ | `√` + `<span class="rad">x</span>` with a `border-top` |
| `\int_a^b` | ∫ with limits | `<span class="lim">` stack |
| `pi`, `theta`, `>=`, `->`, `inf` | π, θ, ≥, →, ∞ | plain symbol table |
| `d/dx` | stacked fraction | reuse `.frac` |

Everything else is literal text. **Escape HTML before you substitute** (chemistry's
`formula()` does; copy that ordering or you've built an XSS hole in a study app).

### 6.2 Why not KaTeX

It's 300 kB, it's a dependency, it needs font files precached, and it renders one way. The
mini-language above covers ~98% of HSC Advanced notation in about 120 lines that you fully
control and that costs nothing offline. Budget half a day for it and write unit tests for
the renderer (see §8) — it is used on every single screen, so a bug here is a bug everywhere.

### 6.3 Checking algebraic answers without a CAS

For free-response algebra (the Equivalence Engine, and anywhere the student types an
expression), do **not** string-compare and do **not** use `eval`.

Write a ~150-line recursive-descent parser producing an AST, then an evaluator. To check if
the student's expression equals the target:

```js
// Evaluate both at 8 pseudo-random x values (avoid poles: skip any where either is
// non-finite, and require at least 5 clean samples). Agreement to 1e-9 relative is
// equivalence for every expression class in the HSC course.
function equivalent(userAst, targetAst) { /* ... */ }
```

This is robust, it's ~30 lines on top of the parser, and it correctly accepts `2sin(x)cos(x)`
for `sin(2x)` — which no string comparison ever will. Seed the sample points from the
question id so the check is deterministic and testable.

**Never call `eval()` or `new Function()` on student input.** Not for safety theatre — the
parser gives you *better* error messages ("unmatched bracket at character 7") than a thrown
`SyntaxError` ever could.

### 6.4 Numeric answers

Chemistry's `U.numClose(input, expected, tolRel)` already handles thousands separators and
`×10^` scientific notation. Extend it for maths to also accept:

- `pi/4` and `π/4` → 0.7854 (run it through the §6.3 parser first, then compare numerically)
- `sqrt(2)` / `√2`
- exact fractions `3/8`
- Default tolerance 0.5% relative, but let each question override; for money use exact cents.

---

## 7. Progression and economy (copy the numbers, they're tuned)

- **XP:** correct answers pay `10 × difficulty`, multiplied by a streak multiplier (×1 → ×3
  in half-steps every 5 correct).
- **Levels:** `xpNeeded(n) = round(130 × n^1.5)`, **60 levels** with themed titles. Level 20
  is ~87,000 XP; level 60 is ~1.42 M. This is a whole-HSC-year progression, deliberately.
  The user explicitly asked for it to be *harder* than the first tuning — don't soften it.
- **Prestige/Ascension:** at level 60, reset level and XP but keep every unlock, achievement,
  flashcard box and statistic, and gain a permanent **+12% XP** that stacks per ascension.
- **Currency** (chemistry called them "Moles" — for maths use **"Primes"** 🔢 or similar):
  game payouts scaled to **60%** so it stays scarce. Spend on 7 power-ups (50/50, Skip, Time
  Freeze, Buffer, Catalyst→"Boost", Insight, Adrenaline), **10 themes**, **22 avatars**,
  3 tiers of random supply crate, and arcade playtime. Level-gate the good items as well as
  pricing them.
- **Difficulty modes:** Standard / Hard (×1.45 XP, −25% time) / Nightmare (×2.1 XP, −45%
  time, 50/50 and Skip disabled). Set once in Settings, applies everywhere.
- **Daily challenge:** derived from the date via seeded PRNG, so it's stable all day and
  identical for every player.
- **Weekly quests:** 3 per ISO week from a 12-quest pool via seeded shuffle. Derive progress
  by diffing cumulative stats against a baseline snapshot taken at week rollover — no
  per-event bookkeeping needed.
- **Streaks:** consecutive-day bonus growing to +60 XP per run.
- **Spaced repetition:** 5-box Leitner on the flashcard deck, intervals 1/2/4/8/16 days, a
  miss drops straight to box 1.
- **Adaptive draw:** weight each question ×3.5 if previously missed, plus a bonus scaled to
  how weak that topic is.
- **Mastery:** confidence-weighted, `accuracy × min(1, seen/25)` — not raw accuracy, so a
  perfect 3-question run doesn't read as mastered.

---

## 8. Testing regime — build these as you go, not at the end

The chemistry app has five test scripts. All are plain Node + Playwright, no test framework.
Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` in this environment.

1. **`validate.js`** — loads the data files in a Node `vm` sandbox where the context global
   *is* `window`, then asserts content invariants:
   - Every question has 4 options, `a:0`, a non-empty `why`, and a valid topic code
   - No duplicate ids
   - Every proof puzzle is solvable in its declared number of steps
   - No achievement unlocks on a fresh save
   - `PRECACHE` in `sw.js` matches the files on disk exactly
   - **The answer-length distribution check** (see §9.7)
   - **Maths-specific and essential:** every procedurally generated question is solved
     independently by the validator, and every stored numeric answer is re-derived from its
     own question text. Run 500 samples per generator. This catches the "impossible question"
     class of bug that a chemistry app can't have but a maths app absolutely will.
   - **Also maths-specific:** round-trip every string through the §6.1 renderer and assert
     no unbalanced braces, no leftover `\` commands, and no raw `<` reaching the DOM.

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
   reaches level 2.** Run it after every economy change. See §9.5.

5. **`arcade.js`** — tickets charge correctly, a broke player is refused, the clock runs only
   while the game is on screen, high scores survive a reload, and **XP/level/currency are
   provably untouched by playing**.

**Also run an "honest player" bot** alongside `exploit.js` — one that answers correctly. Every
anti-cheat measure in §9 could plausibly break normal play, and the only way to know it
hasn't is to measure both directions. The chemistry app's honest bot earns 608/619/248 XP in
three modes; the spam bot earns 0.

---

## 9. The twelve mistakes already paid for — do not repeat them

This is the most valuable section. Each of these was a real bug found in the reference app,
several reported by the user after shipping.

### 9.1 `display: grid` beats the `hidden` attribute
`.modal-root { display: grid }` overrode `[hidden]`, leaving an invisible full-screen overlay
that swallowed every click after the first modal closed. **Fix:** put
`[hidden] { display: none !important }` in your reset, at the top of the stylesheet.

### 9.2 Grid children default to `min-width: auto`
Game screens overflowed horizontally on mobile because a grid/flex child won't shrink below
its content. **Fix:** `.gshell > * { min-width: 0 }` on every game container, wrap your
header/meta rows, and hide non-essential chrome below 430 px. Then *test* it — the overflow
check in `smoke.js` is what caught this.

### 9.3 A service worker makes every first load reload itself
`clients.claim()` fires `controllerchange` even when there was no previous controller, so a
naive "reload on controllerchange" handler reloads every first visit. **Fix:** capture
`const hadController = !!navigator.serviceWorker.controller` **before** registering, and
ignore the event when it's false. (`js/app.js:87`)

### 9.4 Debounced saves lose data on mobile
A 200 ms debounce with no flush means backgrounding the tab mid-write loses progress —
mobile browsers reclaim tabs aggressively. **Fix:** `State.flush()` on both
`visibilitychange` (when hidden) and `pagehide`. `visibilitychange` is the only event mobile
reliably fires before reclaiming.

### 9.5 XP was farmable by spamming — the user found this, not the tests
Original design paid XP for correct answers with **no penalty for wrong ones**, so mashing
any answer and submitting earned **35,097 XP/hour**. Four fixes, all required:

1. **Accuracy-gate the completion bonus.** Below 50% accuracy the end-of-run bonus is
   withheld *entirely*; above it, scaled by accuracy. Enforce this inside `UI.award()` so no
   mode can skip it.
2. **Wrong answers subtract XP** from the run's pool (floored at zero).
3. **A minimum read time.** Answers faster than **1,200 ms** — quicker than the question can
   physically be read — pay nothing. Export it as `UI.MIN_READ_MS` and use it everywhere.
4. **Remove every XP floor.** "You get at least 50 XP for finishing" is a farm.

Result: 35,097 XP/hr → **0**, with honest play unchanged. Design this in from day one; it is
far more painful to retrofit.

### 9.6 Guessable grids need *net* scoring
A fill-the-grid mode with two states per cell is ~50% correct by pure chance. Scoring
`right` alone paid well for random clicking. **Fix:** score `max(0, right − wrong)`, and
scale any time bonus by accuracy with a floor (no bonus below 75%). Applies directly to
**Table Panic**.

### 9.7 The correct answer was always the longest option — the user found this too
Writing a thorough correct answer and three throwaway distractors makes the key guessable
from length alone. Measured: **63.9%** score by always picking the longest option.

**Fix:** put the reasoning in `why`, keep the key terse, and make every distractor a
specific, plausible misconception of comparable length. 156 questions were rewritten and 45
more had a distractor lengthened, taking longest-option scoring to 32.3% and *strictly*
longest-is-key to 24.3% — **below the 25% you'd get by chance**.

**Then automate it.** The validator fails the build if longest-option scoring exceeds 32%.
Write this check on day one and you'll never author a biased question in the first place.
Maths has a natural advantage here: options are short expressions, so length is less
informative — but the check is cheap and catches other authoring drift.

### 9.8 Self-graded flashcards are free money
"Did you get it?" → "Yes" → XP is an infinite loop. **Fix:** a card pays only **once per
day**, only if it was genuinely **due**, and only if it stayed on screen for `MIN_READ_MS`.
Report accuracy to `award()` as *paid cards / deck size*, never the self-reported figure.

### 9.9 Simulators must generate the answer first, then the question
The titration sim randomised concentrations and volumes independently, so the required
titre could exceed 60 mL — past the input cap and past the burette's 50 mL capacity. The
question was literally unanswerable, and the user hit it in normal play.

**Fix: pick the answer first, in a known-good range, then derive the inputs from it.**

This generalises to *every* maths generator and is the most important content rule in this
document:

- Quadratics: pick integer roots, then expand — not random coefficients hoping for a nice discriminant.
- Integrals: pick the antiderivative, then differentiate it to get the integrand.
- Right triangles: pick a Pythagorean triple, don't randomise two sides.
- Optimisation: pick the stationary point, then construct the function around it.
- Logs: pick the result, then build the expression.
- Financial: pick the final balance, then solve backwards for the payment.

Then assert the range in the validator (§8.1) across 500 samples per generator.

### 9.10 Procedural generators need a difficulty *contract*
Chemistry's `calc.js` produced problems whose difficulty varied wildly for the same declared
`diff`. In maths this is much worse — "differentiate this" spans one line to fifteen. Give
each generator an explicit contract: number of steps required, magnitude of the numbers, and
whether the answer is an integer, a simple fraction, or a decimal. Assert it in tests.

### 9.11 A "free" game becomes the optimal strategy
The arcade was nearly shipped paying small XP. An endless runner paying even 1 XP/second
beats studying. **Fix:** free/fun modes award nothing but a high score, enforced structurally
by never calling `award()`. State this in the UI so it doesn't feel like a bug —
*"spend currency, earn nothing but bragging rights."*

### 9.12 Test-harness traps that will cost you an hour each
- Assigning an **unchanged** `location.hash` fires no `hashchange` event, so the router never
  runs and your test hangs. Call the router function directly (`UI.go(...)`) from tests.
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
4. One question bank topic (~40 questions) + `bank.js` + Rapid Fire. Now it's playable.
5. The expression parser (§6.3) — unlocks Calculation Crunch and Equivalence Engine.
6. The rest of the game modes, cheapest first. Keep `smoke.js` green after each one.
7. Content push to the volume targets in §4. Run the length-bias check (§9.7) continuously.
8. Shop, achievements, progress screen, daily/weekly, prestige.
9. Bosses.
10. PWA (manifest, service worker, icons) + `offline.js`.
11. Arcade last — it's pure fun and it can't break the economy if it never calls `award()`.

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
- LAN alternative: `python3 -m http.server 8000`. Note the service worker won't register over
  plain HTTP to a LAN IP, so that route gives the app but not offline caching.
- Offer Settings → **Export save / Import save** as JSON, since `localStorage` is per-device.
- **Bump the `CACHE` constant in `sw.js` on every deploy** and keep `PRECACHE` in sync with
  the files on disk. The validator should fail the build if they drift — otherwise offline
  users keep serving the old version forever.

---

## 12. Tone and polish

The reference app's personality is dry, confident and a bit chemistry-nerdy — theme names
like *Exothermic* and *Noble Gold*, rank blurbs like *"Flawless work. Band 6 energy."* Do the
maths equivalent (*Asymptotic*, *Golden Ratio*, *Imaginary*, *Monte Carlo*) rather than
generic gamification voice. It matters more than it sounds like it should: the user asked for
"enjoyable" first and "study app" second.

Synthesise **all** sound effects in WebAudio (`js/core/audio.js` has ~67 of them in 273
lines) — no audio files, nothing to precache, nothing to license. The user explicitly asked
for "way more sound effects" mid-build; budget for a large SFX vocabulary from the start.

Respect `prefers-reduced-motion` (disable particles and background animation), support
keyboard play (`1`–`4` answer, `Enter` advances, `Esc` closes), and keep every theme legible
in both light and dark.
