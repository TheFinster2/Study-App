# ⚗️ MoleQuest — HSC Chemistry Study Game

A game-based study app for **NSW HSC Chemistry** (Modules 1–8, weighted towards Year 12
Modules 5–8). Ten game modes, XP and levels, a currency you spend on unlocks, five boss
fights, spaced-repetition flashcards and a built-in reference sheet.

No build step, no dependencies, no account, no network. **Open `index.html` and play.**

```
git clone <this repo> && cd Study-App
xdg-open index.html      # macOS: open index.html   Windows: start index.html
```

Progress is saved to `localStorage` in that browser. Settings → *Export save* writes a JSON
backup you can import on another device.

---

## Game modes

| Mode | What it trains |
|---|---|
| ⚡ **Rapid Fire** | 2 minutes, endless questions, streak multipliers to ×3 |
| 🎯 **Module Drill** | 15 adaptive questions from one module, no clock |
| ⚖️ **Balance Blitz** | Balancing equations, with a live per-element atom tally |
| 🧩 **Ion Memory** | Concentration-style matching of polyatomic ions to formulas |
| 🏷️ **Name That Compound** | IUPAC nomenclature — structure→name *and* name→structure |
| 🔢 **Calculation Crunch** | Procedurally generated moles, pH, dilution, Ksp, calorimetry problems |
| 🌧️ **Precipitation Panic** | Fill a solubility grid against the clock |
| 🧪 **Titration Lab** | A simulated titration: find the end point, then do the calculation |
| 🔗 **Pathway Puzzle** | Build organic synthesis routes by choosing reagents |
| 🩹 **Mistake Rehab** | Only the questions you've previously missed |

### Exam Bosses

Five HP duels with a per-question timer. Each is themed on a module and has a gimmick —
Le Chatelier heals himself every third question, Carbon the Chainmaster doubles the damage
of wrong answers, Spectra hides the module and topic labels. Beat one to unlock the next;
all four unlock **The Final Paper**.

---

## How the systems work

**XP and levels.** Correct answers pay `10 × difficulty`, multiplied by your streak
(×1 → ×3 in half steps every 5 correct). Level *n* costs `round(100 × 1.18^(n−1))` XP, so
levelling stays brisk early and slows down sensibly. Each level up pays out Moles and
awards one of 20 titles, from *Lab Rat* to *MoleQuest Legend*.

**Moles (🪙).** The currency. Spend them on power-ups (50/50, Skip, Time Freeze, Buffer,
Catalyst), six lab skins, sixteen avatars, and two tiers of random supply crate.

**Adaptive question draw.** `Bank.draw` weights each question: ×3.5 if you've missed it
before, plus a bonus scaled to how weak the module is. Answer options are shuffled at draw
time, so the correct answer is never in a predictable slot.

**Mastery.** Not raw accuracy — it's confidence-weighted by attempt count
(`accuracy × min(1, seen/25)`), so a perfect run over three questions doesn't read as
mastered.

**Spaced repetition.** A 5-box Leitner system on the flashcard deck. Recall moves a card up
a box (intervals 1, 2, 4, 8, 16 days); a miss drops it straight back to box 1.

**Daily challenge.** Derived from the date with a seeded PRNG, so the challenge is stable
all day and identical for everyone.

**Streaks.** Show up on consecutive days for a bonus that grows to +100 XP per run.

---

## Content

Everything lives in `js/data/` as plain JS — edit it without touching the engine.

- **162** multiple-choice questions across all 8 modules, each with a worked explanation
- **36** balancing equations (all verified to balance in lowest terms)
- **73** flashcards
- **28** named organic compounds with plausible distractors
- **10** synthesis pathway puzzles over a 16-edge reaction graph
- **40** achievements
- Reference tables: flame tests, hydroxide precipitates, solubility grid, Ka/pKa values,
  indicator ranges, polyatomic ions, and a formula sheet
- Procedurally generated calculations, so numeric practice never runs out

### Adding questions

```js
// js/data/questions-m5.js
{ id:"m5-31", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"Question text — write formulas as C3H8 or use real subscripts (C₃H₈).",
  choices:["Correct answer first", "Distractor", "Distractor", "Distractor"],
  a:0, why:"The explanation shown after answering." }
```

Write the correct answer at index `0` and set `a:0` — the app shuffles options at runtime.
`diff` is 1–3 and drives both XP and boss damage.

---

## Architecture

Classic `<script>` tags in dependency order (no ES modules), so it runs straight from
`file://`. Everything hangs off one global, `window.CHEM`.

```
index.html            shell, script order
css/styles.css        design system + 6 themes as CSS custom properties
js/data/*.js          content banks — pure data
js/core/util.js       DOM helpers, formula→subscript renderer, seeded RNG
js/core/audio.js      WebAudio synthesised SFX (no audio files)
js/core/fx.js         canvas particles, confetti, floating XP
js/core/state.js      save file, XP/levels/coins/streaks/SRS/achievements
js/core/bank.js       question aggregation, filtering, adaptive draw
js/core/ui.js         hash router, toasts, modals, the reward pipeline
js/games/*.js         one file per game mode
js/screens/*.js       one file per screen
js/app.js             route registration + bootstrap
```

Two conventions worth knowing:

- **All rewards go through `UI.award({xp, coins})`.** Level-ups, achievement checks and
  their toasts/confetti happen in exactly one place, so no game mode can forget them.
- **Games get their chrome from `UI.gameShell()`** and register teardown with
  `UI.onLeave()`, which the router calls before swapping screens — that's what stops
  timers leaking between modes.

---

## Accessibility & compatibility

Keyboard: `1`–`4` answer multiple-choice questions, `Enter` advances, `Esc` closes modals.
`prefers-reduced-motion` disables particles and background animation. Themes are
theme-aware down to 390 px with no horizontal overflow. Tested in Chromium; uses only
widely-supported CSS (`color-mix`, custom properties, grid).

## Testing

`node --check` passes on all 33 JS files. Content is validated separately — every stored
equation is re-balanced from its parsed formulas, every pathway puzzle is BFS-checked
against its declared step count, and every achievement is asserted not to unlock on a
fresh save. A Playwright script drives all ten modes, a boss fight, a shop purchase, a
crate opening, a theme switch and a reload-persistence check, failing on any console error.
