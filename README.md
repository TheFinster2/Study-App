# MathQuest — HSC Mathematics Advanced + Extension 1

A game-based study app for NSW HSC Mathematics. Zero dependencies, no build
step, no npm, no account, no backend. Clone it, open `index.html`, and it works
— including on a train with no signal once you have opened it once online.

Built from `MATHS-BRIEF-ADVANCED-EXT1.md` and its addendum, using
[MoleQuest](https://github.com/TheFinster2/Study-App/tree/claude/hsc-chemistry-study-app-04o2ri)
(HSC Chemistry) as the reference implementation.

---

## What's in it

| | |
|---|---|
| **629 multiple-choice questions** | 424 Advanced, 205 Extension 1, every one with a worked explanation |
| **137 flashcards** | 92 Advanced, 45 Extension 1, on a 5-box Leitner schedule |
| **75 procedural generators** | Calculation Crunch never repeats and never runs out |
| **20 proof puzzles** | 12 derivations and 8 inductions |
| **84 achievements** | Extension-only ones hide themselves on an Advanced build |
| **18 reference sheets** | The whole formula sheet, searchable |
| **13 game modes + 6 bosses + 3 arcade games** | |

### Game modes

| Mode | What it is |
|---|---|
| ⚡ **Rapid Fire** | Two minutes, endless questions, streak multipliers to ×3 |
| 🎯 **Topic Drill** | 15 adaptive questions from one topic, no clock |
| 🔁 **Equivalence Engine** | Rearrange an expression; the app checks it NUMERICALLY, so any correct form counts — `2sin(x)cos(x)` is accepted for `sin(2x)` |
| 🃏 **Match Pairs** | Concentration: function ↔ derivative, expression ↔ factored form, identity ↔ equivalent |
| 📈 **Read the Curve** | A drawn graph and four candidate equations, or the reverse. Canvas-rendered, so infinitely generatable |
| 🔢 **Calculation Crunch** | 75 generators across every topic. Type exact forms: `pi/4`, `sqrt(2)`, `3/8`, `ln(3)`, `e^2` |
| ⏱️ **Table Panic** | Fill the unit circle, the derivative table or the log laws against the clock |
| 📐 **Calculus Lab** | Drag a tangent onto a curve, or the bounds of a shaded area — then compute it exactly |
| 🪜 **Proof Builder** | Assemble a proof from shuffled step cards. Some cards are plausible and wrong |
| 🎯 **Vector Lab** *(Ext 1)* | Set an angle and speed to hit a target, then compute range, flight time or apex |
| ⛓️ **Induction Builder** *(Ext 1)* | Base case → assumption → inductive step → conclusion, in order |
| 💀 **Survival** | One life, tightening clock, escalating difficulty |
| 🩹 **Mistake Rehab** / 🔖 **Starred** | Only what you got wrong, or what you starred |

Six Exam Bosses, each with a gimmick — The Asymptote heals a proportion of the
gap every third question and so never quite reaches full health; Radian rotates
the answer options while you read them; Lord Leibniz doubles the cost of being
wrong; The Integrator hides the topic label; Sigma randomises which power-ups
you may use; and The Inductor *(Ext 1)* runs three phases, where failing one
restarts **that phase**, not the fight. Beat all of them to unlock **The Final
Paper**, a mixed 25-question gauntlet.

---

## Running it

```bash
git clone <this repo>
cd Study-App
open index.html          # or just double-click it
```

That is genuinely all. There is no install step because there is nothing to
install.

### On a phone

**GitHub → Settings → Pages → Deploy from a branch → this branch → `/ (root)`.**
It goes live at `https://<user>.github.io/<repo>/` in about a minute.

> An agent cannot enable Pages for you — that switch is a manual step in the
> repository settings.

Then **iOS/Safari:** *Share → Add to Home Screen*. **Android/Chrome:**
*⋮ → Add to home screen*. Open it once while online so the precache completes,
and after that it works with no signal.

A LAN alternative is `python3 -m http.server 8000`, but note that service
workers do not register over plain HTTP to a LAN IP, so that route gives you
the app without the offline caching.

Progress lives in `localStorage`, so it is per-device. **Settings → Export
save** writes a JSON file you can import on another phone.

---

## Advanced only, or Advanced + Extension 1

One line, in `js/data/tiers.js`:

```js
MQ.DATA.TIERS = ["MA", "ME"];   // Advanced + Extension 1  (current)
// MQ.DATA.TIERS = ["MA"];      // Advanced only
```

Every topic code is prefixed `MA-` or `ME-` and `Bank.all()` filters on this
array, so flipping it is most of the change. For a clean Advanced-only build
also remove the five `questions-me-*.js` lines from `index.html` and from
`PRECACHE` in `sw.js`, and bump `CACHE`.

Extension 1 is **additive, not a difficulty ladder**. Advanced content is never
gated behind Extension progress. What the toggle changes:

- the `ME-` question banks, flashcards, proofs, generators and reference sheets
- Vector Lab, the Induction Builder and the sixth boss, which hide themselves
- Extension achievements, which are filtered out rather than shown as
  permanently unobtainable

`tests/validate.js` asserts **both** configurations pass, which is the only
thing stopping the toggle from rotting.

---

## Testing

```bash
node tests/validate.js     # content — no browser needed, run this constantly
node tests/smoke.js        # every screen and mode, zero console errors
node tests/exploit.js      # the farming bot AND the honest player
node tests/arcade.js       # the arcade provably earns nothing
node tests/offline.js      # subpath, offline, and PWA update handling
```

The browser tests need `playwright-core`:

```bash
npm install --no-save playwright-core
```

Chromium is expected at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`;
change `EXECUTABLE` in `tests/harness.js` if yours lives elsewhere.

### `BREAK` mode

The single most valuable habit here, and it takes under a minute each time:

```bash
BREAK=answer-first node tests/validate.js
```

This deletes a specific guard with a regex, checks the patched file still
parses, and then asserts the suite **fails**. A test that passes with its fix
removed is worthless. Five guards are covered: `answer-first`, `tier-filter`,
`escape`, `domain`, `minclean`.

---

## How it is built

```
index.html              shell + script order (the script order IS the dependency graph)
manifest.webmanifest    PWA metadata, relative start_url/scope so a subpath works
sw.js                   service worker, cache-first, versioned CACHE
css/styles.css          design system, 10 themes, and the maths render components
js/data/tiers.js        the MA / ME toggle
js/data/*.js            content — questions, flashcards, proofs, generators, reference
js/core/util.js         DOM helpers + THE MATHS RENDERER
js/core/expr.js         expression parser, evaluator, equivalence check
js/core/draw.js         canvas: plots, curves, shading, trapezoids, vectors, normal curves
js/core/audio.js        ~90 synthesised sound effects — no audio files at all
js/core/fx.js           canvas particles, confetti, floating XP
js/core/state.js        the save file
js/core/bank.js         question aggregation, tier filtering, adaptive draw
js/core/ui.js           hash router, modals, THE REWARD PIPELINE
js/core/arcade.js       ticket economy
js/games/*.js           one file per mode
js/screens/*.js         one file per screen
js/app.js               routes, bootstrap, service-worker update handling
```

### Two conventions hold it together

**Every reward flows through `UI.award()`.** Level-ups, achievement checks,
toasts, confetti, the XP multiplier and the anti-farm accuracy gate all happen
in exactly one function. No mode can forget them and no mode can bypass the
anti-cheat — which is what makes "the arcade earns nothing" structural rather
than aspirational: arcade code simply never calls it, and `validate.js` asserts
that textually.

**Every game gets its chrome from `UI.gameShell()` and registers teardown with
`UI.onLeave()`.** The router runs `onLeave` before swapping screens. It is the
only thing stopping `setInterval` timers and `requestAnimationFrame` loops
leaking between modes, and an app full of animated graphs has a lot of them.

### Rendering maths without a library

No MathJax, no KaTeX. A small inline mini-language and a ~200-line renderer in
`util.js`:

| You write | Renders as |
|---|---|
| `x^2`, `x^{n+1}` | x², x<sup>n+1</sup> |
| `\frac{a}{b}` | a stacked fraction (nests three deep — Extension 1 needs it to) |
| `\sqrt{x}` | √ with an overbar |
| `\int_a^b`, `\sum_{n=1}^{k}`, `\lim_{x->0}` | the operator with stacked limits |
| `pi`, `theta`, `>=`, `->`, `inf` | π, θ, ≥, →, ∞ |
| `d/dx`, `dy/dx` | stacked fractions |
| `\vec{a}`, `nCr(n,k)` | **a̲**, ⁿCₖ |

Input is **HTML-escaped before any substitution happens**. That ordering is
load-bearing — reverse it and the whole app is one XSS hole, since every
question, distractor and explanation goes through it. `validate.js` asserts it
directly, and `BREAK=escape` proves the assertion works.

### Marking algebra without a CAS

`js/core/expr.js` is a recursive-descent parser and evaluator. To check a
student's expression against a target it evaluates **both at eight
pseudo-random values**, seeded from the question id so a failure in the wild
reproduces exactly in a test. That is why `2sin(x)cos(x)` is accepted for
`sin(2x)` — no string comparison ever will be.

It never calls `eval()` or `new Function()` on student input. Not as safety
theatre: the parser gives strictly better errors. *"Unmatched bracket — opened
at character 3"* beats *"Unexpected token )"*.

Four failure modes are handled and tested individually — domain restrictions,
branch cuts, poles, and coincidental agreement. See §6.5 of the brief and the
`Equivalence` section of `validate.js`.

### Generated questions pick the answer first

Every generator has two independent code paths: `make()` builds the question
**backwards from a chosen answer**, and `solve()` works **forwards from the
inputs**. The validator runs 500 samples of each and asserts they agree — a
stored answer that was never re-derived by a second path is an assertion, not a
fact.

This is what stops unanswerable questions. Quadratics pick integer roots then
expand. Integrals pick the antiderivative then differentiate it. Right triangles
pick a Pythagorean triple. `nCr` picks its magnitude band first, because
randomising n and r gives you either 6 or 2.7×10¹⁴ and nothing between.
Projectiles pick the landing point, then derive the launch velocity — otherwise
the target lands off-canvas.

Writing these two paths caught two real bugs on the first run: a quotient-rule
generator that could place its evaluation point exactly on a pole, and a
log-equation generator whose contract promised an integer solution it did not
always deliver.

---

## The anti-farming design

The reference app's original design paid XP for correct answers with no penalty
for wrong ones. Mashing any option and finishing the run earned **35,097
XP/hour**. The user found it, not the tests.

- The completion bonus is **withheld entirely** below 50% accuracy, not scaled
  down — and it happens inside `UI.award()` where no mode can skip it.
- Wrong answers **subtract** XP from the run's pool, floored at zero.
- Answers faster than **1,200 ms** pay nothing. Nobody reads a question that fast.
- **No XP floors anywhere.** "At least 50 XP for finishing" is a farm, and so is
  `Math.max(15, score)` per item — flailing does eventually solve everything.
- Completion bonuses are gated on **efficiency** (ideal moves ÷ moves spent),
  not on "got there in the end".
- The Proof Builder's **restart button carries its cost**: the moves already
  spent stay on the clock, so "probe, restart, run it clean" is never cheaper.
- Optional crutches — the Equivalence Engine's live check, the Calculus Lab's
  gradient readout — **latch on first use** and are never refunded. Switching
  one off before submitting used to refund the cost, which made it free and
  therefore mandatory.
- Table Panic scores **net** (right − wrong), gives no time bonus below 75%
  accuracy, and re-draws any board where one answer holds more than 40% of the
  cells — an accidentally uniform board makes "tap the same thing sixteen
  times" a perfect score.
- Flashcards pay **once per card per day**, only when genuinely due, and only
  after `MIN_READ_MS` — and report *paid ÷ deck size* as accuracy, never the
  self-reported figure.
- The **arcade pays nothing at all**: no XP, no Primes, no achievements. A game
  that paid would beat studying.

`tests/exploit.js` measures both directions, because an anti-cheat that also
breaks honest play is not a fix. The bot is deterministic and adversarial
rather than random — a random clicker sometimes stumbles onto the right answer,
which is optimal play and is *supposed* to pay, so it cannot distinguish the
bug from the fix.

---

## Progression

- **XP:** `10 × difficulty` per correct answer, times a streak multiplier
  (×1 → ×3 in half-steps every 5 correct).
- **Levels:** `xpNeeded(n) = round(130 × n^1.5)`, 60 levels with themed titles.
  Level 20 is ~87,000 XP; level 60 about 1.42 M. A whole-HSC-year progression,
  deliberately.
- **Ascension:** at level 60, reset level and XP, keep every unlock and
  statistic, gain a permanent **+12% XP** that stacks.
- **Primes 🔢:** payouts scale to 60% so they stay scarce. Spend on 7 power-ups,
  10 themes, 22 avatars, 3 crate tiers and arcade playtime.
- **Difficulty:** Standard / Hard (×1.45 XP, −25% time) / Nightmare (×2.1 XP,
  −45% time, no 50/50 or Skip). **Separate from the tier toggle** — harder
  scoring, not more syllabus.
- **Daily challenge** derived from the date, so it is identical for everyone.
  **Weekly quests**, 3 from a 12-quest pool. **Streaks** up to +60 XP.
- **Spaced repetition:** 5-box Leitner, 1/2/4/8/16 days.
- **Adaptive draw:** ×3.5 weight on previously-missed questions, plus a bonus
  scaled to how weak the topic is.
- **Mastery** is confidence-weighted: `accuracy × min(1, seen/25)`, so a perfect
  3-question run does not read as mastered.

---

## Notes for whoever works on this next

- **Bump `CACHE` in `sw.js` on every change to a precached file**, and keep
  `MQ.VERSION` in step. `validate.js` fails the build if they drift. Shipping a
  fix without bumping means anyone already installed keeps serving the old code
  and the fix can never reach them.
- **Verify the NESA topic codes** before writing another 400 questions. They are
  correct as of the last syllabus revision the author is aware of, but codes get
  renumbered and checking now is much cheaper than re-tagging later.
- `MQ.__current` is a documented test hook holding the current answer, so
  `exploit.js` can drive an honest player as well as a farming one. It is not a
  security hole — anyone with a console can already call `State.addXP()`, and
  there is no leaderboard. The anti-farm measures exist to stop *lazy in-app*
  farming, which is the behaviour a student actually drifts into.
- Settings has a **Force refresh** that unregisters every worker, deletes every
  cache and reloads with a cache-buster. iOS does not clear website data when a
  home-screen PWA is deleted, so without it a student can be stranded on a stale
  build with no way out.
