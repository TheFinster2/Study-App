# Addendum to `MATHS-BRIEF-STANDARD.md` — everything the reference app fixed *after* the brief was written

**Hand this to the agent alongside the main brief.** The brief's §9 lists twelve mistakes
already paid for. This file is the next round: real defects found and fixed in MoleQuest
since, several of them reported by the student using it. Each entry says what broke, what
the fix was, and — where the chemistry case doesn't map cleanly — what the Standard 2
equivalent is.

Nothing here is speculative. Every number quoted was measured, and every fix has a
regression test that was confirmed to fail without it.

---

## A. The one habit that matters more than any item on this list

**Prove the test fails without the fix.** Every time. It took under a minute each time and
it caught three tests that were quietly worthless:

- An update test passed *with the fix removed*, because the scenario it set up let the
  browser do the right thing by accident.
- A "spamming earns nothing" test passed at 83 XP of farmed rewards, because the threshold
  was set loosely enough to let the bug through.
- A balance measurement showed a 25% pay rise as a **1%** change, because two other reward
  sources were drowning the signal.

Two mechanisms, both cheap:
- `BREAK=1 node test.js` — the test copies the app, deletes the specific guard with a
  regex, then runs. Assert the patch matched *and* that the patched file still parses
  (`new Function(src)`), or you'll "fail" for the wrong reason and believe you're covered.
- `git stash && node test.js && git stash pop` — for measurements, run the whole suite
  against the old code and quote both numbers.

---

## B. Measurement traps

**B1. Unrelated rewards drown the thing you're measuring.**
Tuning the payout rate from 0.6 to 0.75 (+25%), a real run at level 1 measured **1%**.
Level-ups pay `30 × level` coins *raw* — bypassing the payout multiplier — and swamped the
run's own award. Pinning to the level cap swapped one confound for another: one-off
achievement rewards are also raw. The clean number came from awarding a fixed amount
directly with no level-up and no achievement in flight: **600 → 750**.
*Rule:* when measuring an economy change, silence every other reward source first — pin the
level mid-range and pre-mark all achievements as earned.

**B2. Noisy models make useless measurements.**
To prove a game didn't pay for flailing, I first used a random clicker. It sometimes
stumbles onto a one-step answer with its first click — which is optimal play and is
*supposed* to pay — so it scored anywhere from **0 to 79 XP** run to run and could not
distinguish the bug from the fix. Replacing it with a deterministic model ("solve every
item correctly, but only after 20 moves that cannot possibly be right") gave a stable
**0 XP with the fix, 83 XP without**.
*Rule:* a farming model should be deterministic and adversarial, not random.

**B3. Observation perturbs.** Adding a diagnostic script to a flaky test made it pass 3/3.
The diagnostics were the only change. Don't conclude "fixed" from a test whose timing you
just altered — re-run without the instrumentation.

**B4. Instrument the actual thing instead of guessing.** Two cases that would have cost
hours of theorising:
- *Why is this button's fill wrong?* — dumped the matched CSS rules over the Chrome
  DevTools Protocol (`CSS.getMatchedStylesForNode`) and read the winning selector directly.
- *Is the service worker receiving my message?* — had the worker write marker entries into
  cache names (`diag-msg-<id>`, `diag-activate-<id>`) that the test could then read. That
  proved the message arrived and `skipWaiting()` ran, and that activation never happened —
  which pointed at the browser, not the app.

**B5. Fixed sleeps rot as content grows.** A `waitForTimeout(3000)` passed for weeks, then
started failing intermittently purely because the data banks got bigger and boot took
longer. Poll for the condition with a deadline instead.

**B6. Counters on `window` are wiped by a reload.** A test counting an event read 0 for both
"never happened" and "happened, and the page reloaded because of it" — a false negative that
failed 3 runs in 5. Use `sessionStorage` for anything that must survive a reload.

**B7. Don't assert what the platform doesn't guarantee.** One test demanded a service worker
activate while another tab still held the old one. Chromium accepts the request, runs
`skipWaiting()`, and then leaves its promise pending indefinitely — roughly two launches in
five. That's the browser's behaviour, not a bug to fix. Split the assertion: check what your
code *controls* (that it asks), and separately check the outcome in the configuration where
the platform does promise it.

---

## C. Anti-farming — the second wave

The brief covers the basics (§9.5, §9.6, §9.8). These are the ones that got through.

**C1. Per-item score floors are a farm.**
A puzzle mode paid `Math.max(15, computedScore)` per solved item, and scored run accuracy as
`itemsSolved / itemsTotal`. Since flailing *does* eventually solve everything, a bot
collected the floor on every item plus a full completion bonus. Removing the floor and
gating the completion bonus on **efficiency** (ideal moves ÷ moves actually spent, wasted
attempts included) took a flailing run from 83 XP to **0**, with honest play unchanged at
668.
*Standard 2 equivalent:* multi-step questions where the student can keep resubmitting.
Don't floor the per-question award, and don't let "got there in the end" score as
full accuracy.

**C2. A "restart" button is a free undo unless it costs something.**
The same mode had *Restart this route*, needed because a wrong move could strand you. It
reset the wasted-move counter, so the cheapest strategy became "try everything, note what
worked, restart, do it cleanly for full marks." Fix: carry the cost across the restart —
the wasted attempts *and* the moves already taken are charged to the item before the board
clears.
*Standard 2 equivalent:* any "try again" / "new question" button inside a scored run, and
especially a "reveal the worked solution then retry" flow.

**C3. Optional helpers must latch.**
Two crutches (a per-element atom tally, a digital pH meter) cost 25% and 30% of the run's XP.
Both originally set the penalty flag on the current state, so switching the helper **off**
before submitting refunded it. Fix: the flag is set the moment the helper is first used and
is *never* cleared for the rest of the run — a one-way door. The results screen names it
("Atom tally: used") so the cost is visible.
*Standard 2 equivalent:* a formula sheet, a worked-example peek, a calculator toggle in a
mental-arithmetic mode, a "show the substitution" hint. Same rule: latch on first use.

**C4. Randomly generated boards can be accidentally trivial.**
A solubility grid could come up almost all one state, making "tap the same answer sixteen
times" a legitimately perfect score worth 363 XP. Fix: re-draw any board where one answer
holds more than 65% or less than 35% of the cells, and score net (right − wrong) with
credit only above a 55% baseline. Worst case fell to **20 XP**; the sustained farm rate
went from 2,111 XP/hour to under 260; honest play was unchanged at 619.
*Standard 2 equivalent:* true/false and matching grids, "is this relationship positive or
negative", "which of these is a function" — anything with few possible answers per cell.
Constrain the generated mix, don't trust the RNG.

**C5. Keep one bot test that plays every mode badly.** It reports XP/hour for pure guessing.
The target is 0. It has caught every regression above.

---

## D. Content quality and validation

**D1. Length bias needs a *per-topic* limit, not just an overall one.**
The brief already warns that explanation-shaped keys make the correct answer the longest
(§9.7). What it doesn't say: a healthy-looking 24% overall average was hiding one module at
**38%**. The validator now fails above 32% overall **or 36% in any single module**. Current
state: 22.9% overall across 944 questions — below the 25% you'd get by chance — with the
worst module at 31.8%.

**D2. Duplicate detection must use bigrams, not single words.**
Comparing token *sets* flagged `ΔH < 0 and ΔS > 0` as a duplicate of `ΔH > 0 and ΔS < 0` —
identical tokens, opposite questions. Word *pairs* (bigram Jaccard > 0.75) fixed it.
Keep digits, operators and symbols in the tokens; stripping them was what collapsed those
two into the same set.
*Standard 2 equivalent:* this bites harder, not less. `increase by 15%` vs `decrease by 15%`,
`at least 20` vs `at most 20`, and `P(A and B)` vs `P(A or B)` are all unigram-identical.

**D3. Fixing one duplicate can expose another.** The check runs pairwise within a topic, so
a collision can mask a third. Re-run until clean; don't fix one and move on.

**D4. Discover content, don't list it.**
A new question file was loaded by scanning `DATA` for keys matching a pattern, but flashcards
were still concatenated by hand — and appending to the array from a file that sorted
*before* the file that declared it silently dropped **87 cards**. Nothing failed; the deck
was just smaller. Fix: both banks are now discovered by scanning the data namespace, so
script order can't lose content. Assert the total count in the validator.

**D5. Recompute derived values instead of trusting them.**
Every stored "this takes N steps" was recomputed from the underlying graph rather than read
from the data. Same for every balanced equation, re-balanced from its parsed formulas.
*Standard 2 equivalent:* every generated question's answer must be recomputed by an
independent path from the one that produced it, and every stored answer to a hand-written
question should be checked by the same evaluator the game uses to mark it. If your
loan-repayment question stores `$1,342.19`, the validator should recompute it.

**D6. Validate the structural invariants too** — unique IDs, exactly 4 choices, answer index
in range, no duplicate choices among the distractors, metadata present, difficulty in range.
Cheap to write, and it catches copy-paste errors immediately.

---

## E. PWA updates — the part that generated the most support questions

The student reported twice that updates weren't reaching their phone. The brief's §9.3 covers
only the first-load reload loop. These are the rest.

**E1. Bump the cache version on *every* change to a precached file.** I shipped a commit that
changed four JS/CSS files without bumping, so anyone already installed kept serving the old
code from cache — the fix in that commit could never reach them. Put it in your checklist, or
better, have the validator diff the precache list against the files on disk and remind you.

**E2. `updatefound` never fires for a worker that is already waiting.** It fires when
installation *starts*. A worker that finished installing in a previous session is sitting in
`registration.waiting` with no event ever coming. You must check `reg.waiting` explicitly at
boot and post it `SKIP_WAITING`.

**E3. Do that check *before* your own `update()` call.** This was the subtle one. Calling
`registration.update()` when a worker is already waiting makes Chromium install that same
worker again, which fires `updatefound` — so a boot-time update check racing the claim turned
a silent, correct "apply the pending update" into a **dismissable reload prompt**. Dismiss it
and you stayed on the old version until the next launch, where the same thing happened. That
is the "updates take forever to arrive" symptom, and it is entirely self-inflicted. Sequence
it: claim any pending worker first, and only then go looking for a new one.

**E4. A waiting worker self-activates only when every client of the old worker is gone.**
Backgrounding a PWA does not count as gone. And with another client alive, `skipWaiting()`
may simply never resolve (see B7).

**E5. `updateViaCache: "none"` when registering**, so the browser's HTTP cache can't serve you
a stale `sw.js`.

**E6. iOS does not clear website data when a home-screen PWA is deleted.** Reinstalling does
*not* reset it — the student uninstalled and reinstalled and still got the old version. You
need an in-app escape hatch: a **Force refresh** in Settings that unregisters every service
worker, deletes every cache, and reloads with a cache-busting query string. Also show the
running build somewhere in Settings so "what version am I actually on?" is answerable.

**E7. Check for updates on `visibilitychange → visible`**, throttled. Reopening an installed
PWA usually just resumes the page, so the browser's own check never runs.

---

## F. Save data

**F1. `location.reload()` after an import destroys the import.**
Importing a save file wrote it to `localStorage`, then reloaded. The reload fires `pagehide`,
which fires the debounced-save flush, which wrote the **old in-memory state** straight back
over the imported file. The student's import appeared to do nothing at all. Fix: a dedicated
`replaceSave()` that writes the merged save and sets a `frozen` latch so no further write can
happen, then reload. Test it end to end — export, mutate, import, reload, assert.

**F2. Deep-merge imports against the current default shape**, so a save from an older version
gains new fields instead of blanking them.

---

## G. Performance on a real phone

**G1. Forced synchronous layout inside a loop.** The reflow idiom that restarts a CSS
animation (`void el.offsetWidth`) sat inside a per-cell loop — up to 64 forced layouts per
repaint, several repaints per move. One reflow for the whole board, plus a per-cell paint
cache so unchanged cells are never rewritten, took blocking work per move from **30.6 ms to
20.2 ms** at 6× CPU throttling.

**G2. Test with the CPU throttled.** `Emulation.setCPUThrottlingRate` over CDP at 4–6×
approximates a mid-range phone. The stutter the student reported was invisible at full speed.

**G3. iOS needs the prefixes for 3D card flips** — `-webkit-transform-style: preserve-3d`,
`-webkit-backface-visibility: hidden`, and `will-change: transform` for layer promotion. Also
never animate `transform` on the element that owns the `perspective`; animate a child, or the
flip judders.

**G4. A reduced-motion setting must reach CSS.** Ours only silenced JS particle effects while
every CSS animation kept running. Set a data attribute on `<html>` and honour it in the
stylesheet (`:root[data-motion="off"] * { animation: none }` for the decorative ones).

---

## H. UI defects worth knowing about in advance

**H1. Don't open a results overlay over something the student is reading.**
Submitting the final answer in the titration mode called the results modal immediately —
covering the worked solution, which is the only place the answer is explained, and the whole
point of the exercise. **Gate the results behind a button** the student clicks when ready,
and put a **"Review the working"** button on the results screen that dismisses it and leaves
a floating way back. Before this, re-reading the explanation meant quitting the run and
throwing it away.
*Standard 2 equivalent:* this is more important, not less — your worked solutions are longer
than a chemistry explanation, and multi-line algebra takes real time to follow.

**H2. A hover rule that repeats a base value can still outrank a variant class.**
`.btn:hover:not(:disabled) { background: var(--card-2) }` repeated `.btn`'s own background, so
it was a no-op for plain buttons — but at specificity (0,3,0) it beat `.btn-primary` at
(0,1,0), replacing the gradient with a flat fill while the text stayed the dark on-accent
colour. Dark text on a dark background, on **every primary button in the app**, and on touch
it sticks after a tap. Hover states should add lift and shadow, not repaint.

**H3. Sticky elements must clear other fixed chrome.** A sticky element with `top: 6px` slid
under the fixed top bar. Measure the bar in JS and publish it as a CSS custom property
(`--topbar-h`) — it isn't a constant, because the safe-area inset changes it on notched
phones and on rotation. Also: a sticky element over scrolling content needs an **opaque**
background; a translucent `--card-2` tint let the content read straight through it.

**H4. Don't let a title contradict the score.** The results screen said "Perfect titration"
above a rank D, because the title came from one component and the rank averaged two. Name
both, or derive both from the same thing.

**H5. Long option lists need a sticky context element.** When a chooser grew past a screen,
the thing the choice depends on scrolled out of view. Pin it.

**H6. Check horizontal overflow on every screen at 360 px and 390 px**, automatically, in the
smoke test. It's three lines and it catches a whole class of regressions.

---

## I. Economy tuning — how to change it without breaking it

The student asked for "slightly easier to earn currency and level up, but keep the arcade
costing about the same effort." That's three coupled numbers, and the only way to do it
honestly is to define the unit first.

Measure **effort per purchase** in units of "a run that nominally pays 1000". Then:

| | before | after |
|---|---|---|
| payout rate | 0.60 | 0.75 |
| level curve | `130 × n^1.5` | `115 × n^1.5` |
| Lv20 / Lv60 total | 87,276 / 1.42M XP | 77,206 / 1.26M XP |
| cheapest arcade ticket | 250 | 315 |

Effort per ticket: 0.417 → 0.420. Unchanged, as asked — while everything *not* repriced
(power-ups, cosmetics, crates) got 25% cheaper in real terms and levels arrive ~11% sooner.

Keep this as a test that prints the table. It makes the next tuning request a five-minute job
instead of an argument.

---

## J. Quick checklist to run before you call anything done

1. Content validator: counts, unique IDs, structural invariants, per-topic answer-length
   bias, bigram duplicate check, every derived value recomputed.
2. Smoke test: every screen and every mode driven end to end, zero console errors, no
   horizontal overflow at 360/390 px, button hover states unchanged.
3. Farming bot: plays every mode badly, reports XP/hour. Target 0.
4. Honest player: plays every mode well, reports XP per run. Should be comfortably higher
   than any bot and roughly consistent across modes.
5. Helper latch test: turn each optional crutch on then off, assert the penalty survives.
6. Offline test: install, go offline, assert every screen still renders and progress persists.
7. Update test: deploy a new version, assert it is detected while open **and** applied on
   next launch. Run it with `BREAK=1` to confirm it still fails without the fix.
8. Import test: export, mutate, import, reload, assert the imported values are live.
9. Perf test: one interaction-heavy screen under 4–6× CPU throttling, assert blocking work
   per interaction stays under budget.

All nine exist in the reference app. Each is a standalone Playwright script of 60–150
lines, so any one of them can be run on its own while you work on the thing it covers.
Build them as you go; retrofitting them is much more expensive.
