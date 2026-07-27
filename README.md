# ⚗️ MoleQuest — HSC Chemistry Study Game

A game-based study app for **NSW HSC Chemistry** (Modules 1–8, weighted towards Year 12
Modules 5–8). Eleven game modes, 60 levels with prestige, three difficulty modes, a currency
you spend on unlocks, five boss fights, spaced-repetition flashcards and a reference sheet.

No build step, no dependencies, no account, no network. **Open `index.html` and play.**

```
git clone <this repo> && cd Study-App
xdg-open index.html      # macOS: open index.html   Windows: start index.html
```

Progress is saved to `localStorage` in that browser. Settings → *Export save* writes a JSON
backup you can import on another device.

## Putting it on your phone

The app is a PWA: install it to your home screen and it runs full-screen with **no network
at all** — the service worker precaches every file, so it works on a train, in a classroom,
or in aeroplane mode.

**1. Publish it (one time).** On GitHub: **Settings → Pages → Source: "Deploy from a
branch" → Branch: `claude/hsc-chemistry-study-app-04o2ri` / `(root)` → Save.** After about
a minute the site is live at:

```
https://thefinster2.github.io/Study-App/
```

**2. Install it.** Open that URL on your phone, then:

- **iOS/Safari** — Share → *Add to Home Screen*
- **Android/Chrome** — ⋮ → *Add to Home screen* (or the install prompt)

Open it once while online so the precache completes; after that it works with no signal.

**Prefer no public URL?** Serve it over your own Wi-Fi instead — run
`python3 -m http.server 8000` in this folder and browse to `http://<your-computer-ip>:8000`
from your phone. Offline install still works, since service workers are allowed on
`localhost` and over HTTPS but not over plain HTTP to a LAN IP — so on that route you get
the app, but not the offline caching.

Progress lives in `localStorage` per device, so your phone and laptop keep separate
save files. Use Settings → *Export save* / *Import save* to move one across.

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
| 💀 **Survival** | One life, tightening clock, escalating difficulty — how deep can you go? |
| 🩹 **Mistake Rehab** | Only the questions you've previously missed |

### Exam Bosses

Five HP duels with a per-question timer. Each is themed on a module and has a gimmick —
Le Chatelier heals himself every third question, Carbon the Chainmaster doubles the damage
of wrong answers, Spectra hides the module and topic labels. Beat one to unlock the next;
all four unlock **The Final Paper**.

---

## How the systems work

**XP and levels.** Correct answers pay `10 × difficulty`, multiplied by your streak
(×1 → ×3 in half steps every 5 correct). Level *n* costs `round(130 × n^1.5)` XP —
**60 levels**, from *Lab Rat* to *MoleQuest Legend*. Reaching level 20 takes ~87,000 XP
and level 60 about 1.42 million. This is a whole-HSC-year progression, not an afternoon's.

**No length tells.** Options are deliberately length-matched. Question banks are written
with mini-explanation keys by default, which makes the correct answer the longest option
and lets a student score ~64% by always picking it. Every option was rewritten until the
key is strictly longest in 24% of questions — *below* the 25% you'd get by chance — and the
validator fails the build if that ever climbs past 32%.

**Ascension (prestige).** At level 60 you can ascend: level and XP reset to 1, but every
unlock, achievement, flashcard box and statistic is kept, and you gain a permanent **+12%
XP** bonus that stacks with each further ascension, plus 2,500 Moles and 3 Catalysts.

**Difficulty modes.** Standard, Hard (×1.45 XP, 25% less time, bosses hit 40% harder) and
Nightmare (×2.1 XP, 45% less time, brutal bosses, and 50/50 and Skip are disabled). Set it
once in Settings; it applies to every mode.

**Moles (🪙).** The currency, and deliberately scarce — game payouts are scaled to 60%.
Spend them on seven power-ups (50/50, Skip, Time Freeze, Buffer, Catalyst, Insight,
Adrenaline), **ten lab skins**, **twenty-two avatars**, and three tiers of random supply
crate. Most of the good items are level-gated as well as priced.

**Weekly quests.** Three rotating objectives per ISO week, drawn from a twelve-quest pool
by a seeded shuffle. Progress is derived by diffing your cumulative stats against a
snapshot taken at week rollover, so nothing needs per-event bookkeeping.

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

**Streaks.** Show up on consecutive days for a bonus that grows to +60 XP per run.

---

## Content

Everything lives in `js/data/` as plain JS — edit it without touching the engine.

- **374** multiple-choice questions across all 8 modules, each with a worked explanation
- **36** balancing equations (all verified to balance in lowest terms)
- **73** flashcards
- **28** named organic compounds with plausible distractors
- **10** synthesis pathway puzzles over a 16-edge reaction graph
- **65** achievements, scaled from *First Steps* to *Answer 5,000 questions*
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

**Keep the options a similar length.** The natural instinct is to write a thorough correct
answer and three throwaway distractors, which makes the answer guessable from its length
alone. Put the reasoning in `why`, keep the key terse, and make each distractor a specific,
plausible misconception of comparable length. The validator enforces this.

---

## Architecture

Classic `<script>` tags in dependency order (no ES modules), so it runs straight from
`file://`. Everything hangs off one global, `window.CHEM`.

```
index.html            shell, script order
manifest.webmanifest  PWA metadata: icons, standalone display, shortcuts
sw.js                 service worker — precaches every file for offline use
assets/               app icons (SVG source + rendered PNGs)
css/styles.css        design system + 10 themes as CSS custom properties
js/data/*.js          content banks — pure data
js/core/util.js       DOM helpers, formula→subscript renderer, seeded RNG
js/core/audio.js      67 WebAudio synthesised SFX (no audio files) + master volume
js/core/fx.js         canvas particles, confetti, floating XP
js/core/state.js      save file, XP/levels/coins/streaks/SRS/achievements
js/core/bank.js       question aggregation, filtering, adaptive draw
js/core/ui.js         hash router, toasts, modals, the reward pipeline
js/games/*.js         one file per game mode (11 of them)
js/screens/*.js       one file per screen
js/app.js             route registration + bootstrap
```

Two conventions worth knowing:

- **All rewards go through `UI.award({xp, coins})`.** Level-ups, achievement checks and
  their toasts/confetti happen in exactly one place, so no game mode can forget them.
- **Games get their chrome from `UI.gameShell()`** and register teardown with
  `UI.onLeave()`, which the router calls before swapping screens — that's what stops
  timers leaking between modes.

If you add or rename a file, add it to `PRECACHE` in `sw.js` and bump `CACHE` to
`molequest-v2` (etc.), or offline users will keep serving the old version. The content
validator diffs `PRECACHE` against the files on disk and fails if they drift.

---

## Accessibility & compatibility

Keyboard: `1`–`4` answer multiple-choice questions, `Enter` advances, `Esc` closes modals.
`prefers-reduced-motion` disables particles and background animation. Themes are
theme-aware down to 390 px with no horizontal overflow. Tested in Chromium; uses only
widely-supported CSS (`color-mix`, custom properties, grid).

## Testing

`node --check` passes on all 37 JS files. Content is validated separately — every stored
equation is re-balanced from its parsed formulas, every pathway puzzle is BFS-checked
against its declared step count, every achievement is asserted not to unlock on a fresh
save, the service worker's precache list is diffed against the files on disk, and the
answer-length distribution is checked so the correct option never becomes guessable. A
Playwright script drives all ten modes, a boss fight, a shop purchase, a crate opening, a
theme switch and a reload-persistence check, plus horizontal-overflow checks across 17
screens at 390 px and 360 px. A second script serves the app from a subpath, confirms the
service worker registers and precaches, then cuts the network and verifies every screen
still renders and that progress saved while offline survives a reload.
