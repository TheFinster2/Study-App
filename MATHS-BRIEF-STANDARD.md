# Build Brief — HSC Mathematics **Standard 2**

**Hand this entire file to another agent.** It is a complete, self-contained specification:
what to build, how to build it, and — most valuable — the mistakes the reference app already
paid for so you don't repeat them.

> There is a sibling brief, `MATHS-BRIEF-ADVANCED-EXT1.md`, for Mathematics Advanced /
> Extension 1. **Use exactly one.** They are separate apps, not one app with a switch — the
> content, the game modes and the maths renderer all differ. If the student is doing
> Standard 2, this is the file.

The reference implementation is **MoleQuest**, a game-based HSC Chemistry study app:
<https://github.com/TheFinster2/Study-App> (branch `claude/hsc-chemistry-study-app-04o2ri`).
Clone and play it before writing code. It is ~10,000 lines across 42 files with no build
step, so it reads end to end in one sitting.

**Working name:** *NumberCrunch*. Change it if you have a better one.

---

## 1. The ask

> Build a fun, interactive study app for HSC Mathematics Standard 2. It needs to be
> enjoyable, have rewards of some form, and several different games — ideally the whole
> thing is a game. Make it a very full app.

Deliver a zero-dependency web app the student can open on their phone, install to the home
screen, and use on a train with no signal. No build step, no npm, no account, no backend.

### Read this before you design anything

Standard 2 is **not** Advanced-with-the-hard-bits-removed, and building it that way produces
a bad app. It is a genuinely different subject: applied, contextual, and dominated by
real-world scenarios — wages and tax, loans and annuities, fuel consumption, bearings and
radial surveys, project networks, data displays. There is **no calculus at all**.

That has three consequences that shape the whole build:

1. **Word problems are the subject, not a wrapper on it.** A Standard 2 question is usually
   a paragraph of context plus a table or a diagram. Your question renderer must handle
   multi-line stems, embedded tables and small diagrams — not just one line of algebra.
2. **The syllabus prescribes *methods*, not just answers.** Annuities are examined with
   future-value/present-value **tables**, not only the closed-form formula. If your app
   teaches only the formula, the student will be lost in the exam. See §4.3.
3. **This is the course where a study app helps most.** Standard 2 rewards fluency with
   many small procedures — unit conversion, rate calculation, reading a z-score, tracing a
   critical path. That is exactly what spaced repetition and timed drills are good at. Lean
   into it.

---

## 2. Non-negotiable technical constraints

These come from the reference app and exist for good reasons. Do not "modernise" them.

| Constraint | Why |
|---|---|
| **No dependencies. No npm, no bundler, no framework.** | The user clones and opens `index.html`. Anything else is a barrier. |
| **Classic `<script>` tags in dependency order** — no ES modules | ES modules are blocked by CORS on `file://`. Script tags mean double-clicking `index.html` works. |
| **One global: `window.MQ`** (mirrors `window.CHEM`) | Namespacing without a module system. Every file starts `window.MQ = window.MQ \|\| {}`. |
| **Hash routing** (`#/play`, `#/game/quiz/MS-F4`) | Works from `file://` and from a GitHub Pages subpath with no server config. |
| **Vanilla DOM via one `el()` helper** | See `js/core/util.js`. ~40 lines, replaces all of React at this scale. |
| **`localStorage` save, debounced write + explicit flush** | See §9.4 — there is a mobile data-loss bug here you must copy the fix for. |
| **PWA: `manifest.webmanifest` + `sw.js` precache** | Offline is the point. Relative `start_url`/`scope` so it works from a subpath. |
| **Everything renders at 390 px with zero horizontal overflow** | It's a phone app first. Tested at 390 px *and* 360 px. |

**No MathJax, no KaTeX.** See §6 — and note that Standard 2 needs far less notation than
Advanced does, which makes this easy rather than hard.

---

## 3. Architecture to copy

```
index.html              shell + script order (the script order IS the dependency graph)
manifest.webmanifest    PWA metadata
sw.js                   service worker, cache-first, versioned CACHE name
assets/                 icons (SVG source + rendered PNGs at 192/512 + apple-touch)
css/styles.css          design system + 10 themes as CSS custom properties
js/data/*.js            content banks — pure data, no logic
js/core/util.js         DOM helpers, notation renderer, seeded RNG, numeric compare
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
achievement checks, toasts, confetti, the XP multiplier and the anti-farm accuracy gate all
happen in exactly one function. No game mode can forget them, and no game mode can bypass
the anti-cheat. This is what makes §9.5 enforceable rather than aspirational.

**2. Every game gets its chrome from `UI.gameShell(title, opts)` and registers teardown with
`UI.onLeave(fn)`.** The router calls `onLeave` before swapping screens. It is the only thing
stopping `setInterval` timers and `requestAnimationFrame` loops leaking between modes.

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

## 4. Content — Mathematics Standard 2

Keep the chemistry question shape: `{ id, mod, topic, diff, q, choices, a, why }`, plus the
Standard-specific extras in §4.2.

### 4.1 Topic tree

**Year 11 (Standard, common to Standard 1 and 2)**

| Code | Topic | Sub-topics for the `topic` field |
|---|---|---|
| **MS-A1** | Formulae and Equations | Substitution, rearranging, blood-alcohol & medication formulae |
| **MS-A2** | Linear Relationships | Graphing lines, gradient/intercept, direct variation, conversion graphs |
| **MS-M1** | Applications of Measurement | Units & prefixes, error & percentage error, perimeter, area, surface area, volume, capacity, mass |
| **MS-M2** | Working with Time | 12/24-hour time, time zones, timetables, elapsed time |
| **MS-F1** | Money Matters | Wages & salary, overtime, commission, piecework, allowances, PAYG tax, budgeting, GST |
| **MS-S1** | Data Analysis | Classifying data, frequency tables, displays, mean/median/mode/range, IQR, outliers, box plots |
| **MS-S2** | Relative Frequency and Probability | Sample space, complements, multi-stage events, tree & Venn diagrams, expected frequency |

**Year 12 (Standard 2)**

| Code | Topic | Sub-topics |
|---|---|---|
| **MS-A4** | Types of Relationships | Simultaneous equations (graphical & algebraic), break-even analysis, quadratic, exponential, reciprocal models |
| **MS-M6** | Non-right-angled Trigonometry | Pythagoras & right-angle trig, sine rule, cosine rule, area rule, bearings, radial surveys, ambiguous case |
| **MS-M7** | Rates and Ratios | Unit rates, fuel consumption, heart rate, energy & power, scale drawings, ratio & proportion, dividing quantities |
| **MS-F4** | Investments and Loans | Simple & compound interest, appreciation, depreciation (straight-line & declining balance), shares & dividends, inflation, reducing-balance loans |
| **MS-F5** | Annuities | Future value & present value of an annuity, **using tables**, superannuation, loan repayment schedules |
| **MS-S4** | Bivariate Data Analysis | Scatterplots, correlation (Pearson's r), least-squares regression line, interpolation vs extrapolation, causation |
| **MS-S5** | The Normal Distribution | z-scores, the 68/95/99.7 empirical rule, comparing scores, quality control |
| **MS-N1** | Networks and Paths | Vertices/edges/degree, connected graphs, weighted graphs, minimum spanning trees (Prim's & Kruskal's), shortest path |
| **MS-N2** | Critical Path Analysis | Activity charts, network diagrams, forward & backward scanning, float time, the critical path, minimum completion time |

> **Verify these codes against the current NESA syllabus before writing 400 questions.**
> They are correct as of the last syllabus revision the author is aware of, but topic codes
> get renumbered and it is much cheaper to check now than to re-tag later.

### 4.2 Question shape — extended for Standard

Standard 2 questions frequently carry context that a single `q` string can't hold. Extend
the shape rather than cramming it in:

```js
{ id:"f4-018", mod:"MS-F4", topic:"Reducing-balance loans", diff:2,
  stem: "Priya borrows $18,000 at 6% p.a. compounded monthly, repaying $350 per month.",
  table: { head:["Month","Opening","Interest","Repayment","Closing"],
           rows:[["1","18000.00","90.00","350.00","17740.00"],
                 ["2","17740.00","88.70","350.00","17478.70"]] },
  q: "What is the closing balance at the end of month 3?",
  choices:["$17,216.10", "$17,128.70", "$17,304.85", "$16,978.70"],
  a:0,
  why: "Interest = 17478.70 × 0.06/12 = $87.39. Closing = 17478.70 + 87.39 − 350 = $17,216.09." }
```

Optional fields your renderer should support: `stem` (context paragraph), `table`,
`figure` (a small canvas/SVG drawing id — bearings diagrams, networks, box plots), and
`units` (for free-response numeric answers).

### 4.3 Financial maths must teach the exam's method

This is the single most important content-accuracy note in this brief.

NESA examines annuities using **future-value and present-value interest factor tables** — a
grid of periods × interest rate that the student reads a factor from and multiplies. Many
generated-content approaches will only ever teach the closed-form formula, which produces a
student who can compute the right number and still cannot answer the exam question.

So: **ship the tables as data** (`js/data/annuity-tables.js`), render them as an interactive
reference, and make table-lookup its own game mode (§5, *Table Trek*). Then teach the formula
as the cross-check. Do both.

The same applies to depreciation (straight-line *and* declining-balance are both examinable
and students routinely pick the wrong one) and to Prim's vs Kruskal's for minimum spanning
trees.

### 4.4 Volume targets

The chemistry app shipped these; match or beat them.

- **≥ 400 multiple-choice questions**, every one with a worked `why`. Standard 2 has nine
  Year 12 topics plus seven Year 11 topics, so weight roughly 60/40 towards Year 12.
- **≥ 80 flashcards** — formulae, unit conversions, the empirical rule, network definitions,
  tax bracket structure, the difference between correlation and causation.
- **≥ 40** procedurally generated calculation templates (see §9.9 and §9.10)
- **≥ 10** critical-path / network puzzles for the Proof-Builder analogue
- **≥ 65 achievements**, from *First Steps* to *Answer 5,000 questions*
- Reference tables: unit conversions & prefixes, area/volume/surface-area formulae, the
  trig rules, PAYG tax brackets, the annuity tables, z-score properties, network algorithms,
  and a full formula sheet mirroring the NESA reference sheet
- Procedurally generated calculations, so numeric practice never runs out

---

## 5. Game modes — the chemistry→Standard mapping

The chemistry app has eleven modes plus five bosses plus a three-game arcade. Here is what
each becomes. ⭐ marks the ones where Standard 2 is genuinely a *better* fit than chemistry
was — lead with those.

| Chemistry | → Standard 2 | Notes |
|---|---|---|
| ⚡ Rapid Fire | ⚡ **Rapid Fire** | Unchanged. 2 min, endless questions, streak multiplier to ×3. |
| 🎯 Module Drill | 🎯 **Topic Drill** | Unchanged. 15 adaptive questions from one topic, no clock. |
| ⚖️ Balance Blitz | 📏 **Unit Chain** | Chemistry showed a live per-element atom tally. Here: convert through a chain of units (mL/min → L/h → kL/day) with a live dimensional-analysis check that shows which units have cancelled. Same "the game tells you the truth as you work" feel, and it drills MS-M1 and MS-M7 hard. |
| 🧩 Ion Memory | 🃏 **Match Pairs** | Concentration-style. Match shape↔area formula, unit↔equivalent, statistic↔definition, network term↔meaning. |
| 🏷️ Name That Compound | ⭐ 📊 **Read the Display** | Given a rendered box plot, histogram, scatterplot or stem-and-leaf, answer what it says — median, IQR, skew, outliers, correlation strength. Canvas-drawn, so it's infinitely generatable. This is a huge chunk of MS-S1/MS-S4 and chemistry had no equivalent. |
| 🔢 Calculation Crunch | ⭐ 🔢 **Calculation Crunch** | Procedurally generated: pay and tax, compound interest, depreciation, fuel consumption, sine/cosine rule, z-scores, scale drawings, break-even. Standard 2 generates *beautifully* because almost every topic is a formula with plug-in values. Read §9.9 before writing a single generator. |
| 🌧️ Precipitation Panic | ⏱️ **Conversion Panic** | Fill a grid against the clock: metric conversions, time-zone offsets, common area/volume formulae, or the 68/95/99.7 bands. |
| 🧪 Titration Lab | ⭐ 💰 **Loan Lab** | The flagship interactive toy, and Standard's best possible version of it. A canvas amortisation simulator: drag the repayment slider and watch the balance curve bend, aiming to clear the loan in exactly N years. Get within tolerance, then do the exact calculation. Chemistry's titration sim was the most-praised mode; this is the same shape — a slider, a curve, an end condition, then the maths. **Second lab: Bearings Lab** — drag a compass to plot a radial survey, then compute the area with the area rule. |
| 🔗 Pathway Puzzle | ⭐ 🕸️ **Critical Path** | Chemistry: build a synthesis route through a reaction graph. Standard 2 has *actual graph theory in the syllabus* (MS-N1/N2). Drag activity nodes into a network, run the forward and backward scan, identify the critical path and float times. The reference app's BFS graph-validation code maps across almost directly. This is the single strongest chemistry→Standard translation in the whole brief. |
| 💀 Survival | 💀 **Survival** | Unchanged. One life, tightening clock, escalating difficulty. |
| 🩹 Mistake Rehab | 🩹 **Mistake Rehab** | Unchanged. Only questions you've previously missed. |
| *(new)* | ⭐ 📋 **Table Trek** | Standard-only, and non-negotiable per §4.3. Read the right factor out of a future-value / present-value annuity table under time pressure, then use it. Drill the exam skill directly. |

### Boss fights

Five HP duels with a per-question timer, each themed on a topic with a **gimmick**:

1. **The Taxman** (MS-F1 Money Matters) — heals 10% every third question, "claiming a deduction".
2. **Compound** (MS-F4/F5 Investments & Annuities) — its HP *grows* between turns at a visible interest rate, so slow play is punished.
3. **The Surveyor** (MS-M6 Trigonometry) — rotates the answer options every 3 seconds.
4. **Sigma** (MS-S4/S5 Statistics) — randomises which power-ups are available each turn.
5. **The Critical Path** (MS-N1/N2 Networks) — you must beat it within a fixed number of turns; there is float time, but not much.

Beat one to unlock the next; all five unlock **The Final Paper**, a mixed 25-question gauntlet.

### The Arcade (pay to play, earns nothing)

Three arcade games rented with the in-game currency in 5/15/30-minute tickets:

- **Prime Crush** — 8×8 match-3 on number tiles
- **Budget Runner** — endless canvas runner; jump the expenses, collect the payslips
- **Power Tower 2048** — 4×4 merge up the powers of 2

**Critical:** these must award **no XP, no currency, no achievements — only a high score.** An
endless runner that paid XP is a better farm than studying. Because all rewards go through
`UI.award()`, you enforce this structurally by simply never calling it from arcade code.

---

## 6. Rendering notation without a library

Chemistry needed `H2SO4 → H₂SO₄`, a 3-line regex (`js/core/util.js:53`). **Standard 2 needs
less than Advanced and more than chemistry** — and, unusually, most of your rendering effort
goes into *tables and diagrams* rather than notation.

### 6.1 Notation: a ~60-line mini-language

Define a small inline syntax in your content files and a renderer in `util.js`:

| You write | Renders | How |
|---|---|---|
| `x^2`, `m^3` | x², m³ | Unicode superscripts (Standard rarely needs more) |
| `\frac{a}{b}` | stacked fraction | `<span class="frac">` with `display:inline-flex; flex-direction:column` and a `border-top` on the denominator — 15 lines of CSS |
| `sqrt(x)` | √x | `√` + a `border-top` span |
| `deg`, `pm`, `>=`, `->`, `x_bar` | °, ±, ≥, →, x̄ | plain symbol table |
| `$1,234.50` | as written | but see §6.4 on money |

That's genuinely most of it. There are no integrals, no limits, no summation notation and no
vectors in Standard 2. **Escape HTML before you substitute** — chemistry's `formula()` does;
copy that ordering or you've built an XSS hole in a study app.

**Do not pull in KaTeX.** 300 kB and a font-file precache problem, to render things Unicode
already has characters for.

### 6.2 Tables and diagrams are the real work

Budget more time here than on notation. You need:

- **A table component** that scrolls horizontally inside its own container at 390 px without
  the page body scrolling (`overflow-x: auto` on the wrapper, never on `body`).
- **Canvas/SVG drawing helpers** for: box plots, histograms, scatterplots with a regression
  line, normal curves with shaded regions, bearings/compass diagrams, right and non-right
  triangles with labelled sides, network graphs with weighted edges, and amortisation curves.

Write these as one small `js/core/draw.js` with a consistent API (`draw.boxplot(ctx, data)`,
`draw.network(ctx, nodes, edges)`). Every one of them gets reused across questions, games and
the reference screens, so the investment pays back three times over.

Read theme colours from CSS custom properties inside the draw functions so diagrams follow
the active theme — the chemistry app's canvas runner does exactly this.

### 6.3 Checking typed answers

You need less than Advanced does, but more than nothing. Write a ~120-line recursive-descent
parser producing an AST, then an evaluator, so the student can type `3/8`, `0.375`,
`37.5%` or `sqrt(50)` and all be accepted where appropriate.

**Never call `eval()` or `new Function()` on student input.** Not for safety theatre — the
parser gives you *better* error messages ("unmatched bracket at character 7") than a thrown
`SyntaxError` ever could.

For the Unit Chain mode you additionally need a tiny **units engine**: represent a quantity
as `{ value, units: {m:1, s:-1} }`, multiply/divide the unit maps, and check the final map
matches the target. ~80 lines, and it's what makes the live dimensional-analysis feedback
possible.

### 6.4 Money and rounding will bite you

Standard 2 is full of currency, and floating-point money is a classic source of
almost-right answers that mark as wrong.

- Store and compute money **in cents as integers** wherever you can.
- Round **only at the point the syllabus rounds** — e.g. bank interest rounds to the cent
  each period, and rounding at the end instead of each month gives a different (wrong)
  balance after 25 years.
- Accept the student's answer to the cent for money, but keep `numClose`'s 0.5% relative
  tolerance for measurement and rates.
- Percentage answers: accept `6`, `6%`, and `0.06` only where genuinely unambiguous —
  otherwise state the expected form in the prompt.

Chemistry's `U.numClose(input, expected, tolRel)` already strips thousands separators; extend
it for `$`, `%`, and simple fractions.

---

## 7. Progression and economy (copy the numbers, they're tuned)

- **XP:** correct answers pay `10 × difficulty`, multiplied by a streak multiplier (×1 → ×3
  in half-steps every 5 correct).
- **Levels:** `xpNeeded(n) = round(130 × n^1.5)`, **60 levels** with themed titles. Level 20
  is ~87,000 XP; level 60 is ~1.42 M. A whole-HSC-year progression, deliberately. The
  reference app's user explicitly asked for it to be *harder* than the first tuning — don't
  soften it.
- **Prestige/Ascension:** at level 60, reset level and XP but keep every unlock, achievement,
  flashcard box and statistic, and gain a permanent **+12% XP** that stacks per ascension.
- **Currency:** chemistry used "Moles" 🪙. Here use **"Credits"** 💵 (it fits the financial
  spine of the course). Game payouts scaled to **60%** so it stays scarce. Spend on 7
  power-ups (50/50, Skip, Time Freeze, Buffer, Boost, Insight, Adrenaline), **10 themes**,
  **22 avatars**, 3 tiers of random supply crate, and arcade playtime. Level-gate the good
  items as well as pricing them.
- **Difficulty modes:** Standard / Hard (×1.45 XP, −25% time) / Nightmare (×2.1 XP, −45%
  time, 50/50 and Skip disabled). Set once in Settings, applies everywhere.
- **Daily challenge:** derived from the date via seeded PRNG, so it's stable all day and
  identical for every player.
- **Weekly quests:** 3 per ISO week from a 12-quest pool via seeded shuffle. Derive progress
  by diffing cumulative stats against a baseline snapshot taken at week rollover — no
  per-event bookkeeping needed.
- **Streaks:** consecutive-day bonus growing to +60 XP per run.
- **Spaced repetition:** 5-box Leitner on the flashcard deck, intervals 1/2/4/8/16 days; a
  miss drops straight to box 1.
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
   - Every network/critical-path puzzle is solvable and its declared critical path is
     verified by an independent implementation
   - No achievement unlocks on a fresh save
   - `PRECACHE` in `sw.js` matches the files on disk exactly
   - **The answer-length distribution check** (§9.7)
   - **Standard-specific and essential:** every procedurally generated question is solved
     independently by the validator, and every stored numeric answer is re-derived from its
     own question text. Run 500 samples per generator.
   - **Also Standard-specific:** every money value in the banks round-trips through
     cents-as-integers without drift, and every annuity-table lookup in a question matches
     the shipped table to the published number of decimal places.

2. **`smoke.js`** — Playwright drives every mode, a boss fight, a shop purchase, a crate
   opening, a theme switch and a reload-persistence check. Fails on **any** console error.
   Plus horizontal-overflow checks across every screen at **390 px and 360 px** — and
   Standard has tables, so run this after *every* new table-bearing screen, not at the end.

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
header/meta rows, hide non-essential chrome below 430 px. **This bites much harder here than
in chemistry** because Standard 2 is full of wide tables — every table needs its own
`overflow-x: auto` wrapper so the table scrolls, not the page.

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
   **Raise it for Standard**: a question with a context paragraph and a table takes longer to
   read than one line of algebra. Scale it with stem length — something like
   `1200 + 12 ms per word`, capped around 4 s.
4. **Remove every XP floor.** "You get at least 50 XP for finishing" is a farm.

Result: 35,097 XP/hr → **0**, with honest play unchanged. Design this in from day one; it is
far more painful to retrofit.

### 9.6 Guessable grids need *net* scoring
A fill-the-grid mode with two states per cell is ~50% correct by chance. Scoring `right`
alone paid well for random clicking. **Fix:** score `max(0, right − wrong)`, and scale any
time bonus by accuracy with a floor (no bonus below 75%). Applies to **Conversion Panic** and
to any true/false-shaped question set.

### 9.7 The correct answer was always the longest option — the user found this too
Writing a thorough correct answer and three throwaway distractors makes the key guessable
from length alone. Measured: **63.9%** score by always picking the longest option.

**Fix:** put the reasoning in `why`, keep the key terse, and make every distractor a
specific, plausible misconception of comparable length. 156 questions were rewritten and 45
more had a distractor lengthened, taking longest-option scoring to 32.3% and *strictly*
longest-is-key to 24.3% — **below the 25% you'd get by chance**.

**Then automate it.** The validator fails the build if longest-option scoring exceeds 32%.
Write this check on day one and you'll never author a biased question in the first place.

Standard 2 has a second, related tell you must also guard: **the option with a dollar sign
and two decimal places is often the key** in financial questions, because distractors get
written lazily as round numbers. Make every distractor as precisely formatted as the answer.

### 9.8 Self-graded flashcards are free money
"Did you get it?" → "Yes" → XP is an infinite loop. **Fix:** a card pays only **once per
day**, only if it was genuinely **due**, and only if it stayed on screen for `MIN_READ_MS`.
Report accuracy to `award()` as *paid cards / deck size*, never the self-reported figure.

### 9.9 Simulators and generators must produce the answer first, then the question
The titration sim randomised concentrations and volumes independently, so the required titre
could exceed the input cap and the equipment's capacity. The question was literally
unanswerable, and the user hit it in normal play.

**Fix: pick the answer first, in a known-good range, then derive the inputs from it.** For
Standard 2 specifically:

- **Loans/annuities:** pick a clean final balance and repayment, then solve backwards for the
  principal — don't randomise rate, term and repayment and hope the loan clears.
- **Sine/cosine rule:** pick the triangle (three consistent sides/angles that actually
  close), then hide one. Randomising two sides and an angle produces impossible triangles —
  and the **ambiguous case** will silently generate questions with two valid answers.
- **Tax:** pick the tax payable, then work back to the gross income within one bracket.
- **Depreciation:** pick the salvage value and years, then derive the rate.
- **z-scores:** pick a z that lands on an empirical-rule boundary when the question asks for
  a percentage.
- **Networks:** generate the graph, then run *your own* algorithm to find the answer — never
  hand-author the critical path.
- **Break-even:** pick the integer break-even point, then build the two cost lines through it.

Then assert the range and validity in the validator across 500 samples per generator.

### 9.10 Procedural generators need a difficulty *contract*
Chemistry's `calc.js` produced problems whose difficulty varied wildly for the same declared
`diff`. Give each generator an explicit contract: number of steps required, magnitude of the
numbers, and whether the answer is an integer, an exact dollar amount, or a rounded decimal.
Assert it in tests. For Standard, add: **whether a calculator is assumed** — some Standard 2
questions are designed to be done by hand and your generated numbers should respect that.

### 9.11 A "free" game becomes the optimal strategy
The arcade was nearly shipped paying small XP. An endless runner paying even 1 XP/second
beats studying. **Fix:** free/fun modes award nothing but a high score, enforced structurally
by never calling `award()`. State it in the UI so it doesn't read as a bug — *"spend Credits,
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

1. **Skeleton + `util.js` + the notation renderer (§6.1) + `draw.js` (§6.2) + their tests.**
   Everything depends on them, and the drawing helpers are on the critical path for half the
   game modes.
2. `state.js` with the save file, XP curve, and `UI.award()` **including the §9.5 gates from
   the start**. Write `exploit.js` now, while it's trivially passing.
3. `ui.js` router, shell, modals, toasts. Add `[hidden]{display:none!important}` (§9.1),
   `min-width:0` (§9.2) and the scrollable table wrapper to the stylesheet immediately.
4. One topic bank (~40 questions from MS-F1, which is self-contained and high-value) +
   `bank.js` + Rapid Fire. Now it's playable.
5. The money/cents layer (§6.4) and the expression parser (§6.3) — these unlock Calculation
   Crunch and everything financial.
6. The rest of the game modes, cheapest first. Keep `smoke.js` green after each one. Do
   **Critical Path** before the other bespoke modes — it's the biggest and it validates
   `draw.js` hardest.
7. Content push to the volume targets in §4.4. Run the length-bias check (§9.7) continuously.
8. Shop, achievements, progress screen, daily/weekly, prestige.
9. Bosses.
10. PWA (manifest, service worker, icons) + `offline.js`.
11. Arcade last — pure fun, and it can't break the economy if it never calls `award()`.

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
  users keep serving the old version forever.

---

## 12. Tone and polish

The reference app's personality is dry, confident and a bit chemistry-nerdy — theme names
like *Exothermic* and *Noble Gold*, rank blurbs like *"Flawless work. Band 6 energy."* Do the
Standard 2 equivalent — lean into the applied, money-and-measurement character of the course
(*Ledger*, *Blueprint*, *Compound Interest*, *Off-Peak*, *Critical Path*) rather than generic
gamification voice. It matters more than it sounds like it should: the user asked for
"enjoyable" first and "study app" second.

One tone warning specific to this course: **do not write Standard 2 as the easy course.**
No "don't worry, this one's simpler" copy anywhere. The student chose it, it's a full HSC
course, and condescension in a study app is the fastest way to get it deleted.

Synthesise **all** sound effects in WebAudio (`js/core/audio.js` has ~67 of them in 273
lines) — no audio files, nothing to precache, nothing to license. The reference app's user
explicitly asked for "way more sound effects" mid-build; budget for a large SFX vocabulary
from the start.

Respect `prefers-reduced-motion` (disable particles and background animation), support
keyboard play (`1`–`4` answer, `Enter` advances, `Esc` closes), and keep every theme legible
in both light and dark.
