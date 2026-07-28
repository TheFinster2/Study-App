# Build Brief — HSC **English Advanced**

**Hand this entire file to another agent.** It is a complete, self-contained specification:
what to build, how to build it, and — most valuable — the mistakes the reference app already
paid for so you don't repeat them.

> Sibling briefs exist for Mathematics: `MATHS-BRIEF-STANDARD.md` and
> `MATHS-BRIEF-ADVANCED-EXT1.md`. They are separate apps. This one is English Advanced.

The reference implementation is **MoleQuest**, a game-based HSC Chemistry study app:
<https://github.com/TheFinster2/Study-App> (branch `claude/hsc-chemistry-study-app-04o2ri`).
Clone and play it before writing code. It is ~10,000 lines across 42 files with no build
step, so it reads end to end in one sitting.

**Working name:** *Close Reading*. Change it if you have a better one.

---

## 0. The marking decision — READ THIS FIRST, IT SHAPES EVERYTHING

The student must be able to **type real answers in their own words and have them marked**,
without exact wording and **without calling out to any AI service**. Three approaches were
weighed. The chosen answer is a **three-layer marking stack**, built in this order:

| Layer | What it marks | How | Verdict |
|---|---|---|---|
| **A. Structural** | Choices, orderings, matches, recall | `===` on a determinate answer | **The backbone.** Most of the app. |
| **B. Fuzzy string** | *Short closed* answers — a cloze word, a technique name, a character | Normalise + Levenshtein / Jaccard | **Yes, but narrowly scoped.** See §0.2. |
| **C. Sentence embeddings** | *Short analytical* free text — a thesis, a topic sentence, an effect statement | Bundled MiniLM model, cosine similarity, all in-browser | **The headline feature.** See §6.5. |

**No LLM API calls. No API key. No network request at any point after the app loads.**
Layer C is a small neural model that ships *with* the app and runs locally — that is the
whole reason it's acceptable here.

### 0.1 Why not fuzzy matching for prose — read this before scoping Layer B

Fuzzy string matching was proposed for full analytical answers with this worked example:

> Student: *"Hotspur values martial honour above all else"*
> Model: *"Hotspur prioritises chivalric duty over pragmatism"*
> → strip punctuation, tokenise, Levenshtein or Jaccard, pass at ≥ 0.65

**Run the numbers: that pair shares exactly one token — "Hotspur".** Jaccard ≈ 0.09.
Character-level Levenshtein is worse still. The example given as a *passing* case scores
around 0.1 and would be marked "rewrite". It fails its own threshold.

That isn't a tuning problem, it's the technique: Levenshtein and Jaccard measure **surface
form**, so they can only reward answers that reuse the model answer's words. That is exactly
the word-for-word marking the student said they didn't want, and in English it is actively
harmful — two sentences sharing no vocabulary can both be excellent, and a paraphrase-heavy
model answer punishes the strongest students hardest.

**So Layer B is kept, but only where surface form genuinely is the thing being marked:**

- cloze recall of a memorised quote (one word, with an authored alternates list)
- technique names — accept *"anaphora"* for *"anafora"*, *"epistrophe"*/*"epiphora"*
- character, composer and text names — accept spelling slips
- British/American spellings and inflections everywhere

Use a normalised Levenshtein ratio with a **0.85** threshold on single words or short names,
never on sentences. This is spellcheck, not marking, and framing it that way keeps it useful.

### 0.2 What Layer C can and cannot do

Sentence embeddings genuinely solve the Hotspur pair — those two sentences land close in
vector space despite sharing no vocabulary. That is the capability you're buying. But be
precise about its limits, because two of them will bite:

- ✅ **Short analytical claims.** One or two sentences: a thesis, a topic sentence, "what is
  the effect of this technique here". This is where the technology works, and happily it's
  also most of what English practice actually consists of.
- ❌ **Whole essays.** Cosine similarity to a model essay is meaningless — length dominates,
  structure is invisible, and a *better* answer than the exemplar can score lower. Do not
  offer whole-essay marking. Mark the moves, at the length the moves happen.
- ❌ **Quality.** Similarity says *"this means roughly what a good answer means"*, never
  *"this is well written"*. Never render a cosine score as a band or a mark out of 20.
- ⚠️ **Negation and direction** — the serious one. *"Hotspur values honour above pragmatism"*
  and *"Hotspur values pragmatism above honour"* embed almost identically (cosine ~0.95) and
  are opposite claims. §6.5.4 gives the fix, and it is not optional.

### 0.3 How the layers combine

- **XP and levelling ride on Layers A and B**, which are deterministic. This keeps the
  economy and the anti-farm work in §9.5 sound.
- **Layer C pays a smaller, capped reward** and is rate-limited per question per day (§9.8),
  because a similarity threshold is inherently softer than an equality check.
- **Layer C always reveals the model answers afterwards** so the student can self-compare.
  The score routes them; the exemplars teach them.
- **Every free-text question carries 3–5 model answers, not one** (§6.5.3). Take the best
  cosine across all of them. This single decision does more for accuracy than any threshold
  tuning.

### 0.4 Be honest in-app about the boundary

The stack trains analysis, structure, technique fluency, quote recall and the ability to
state a claim precisely. **It still cannot tell the student whether the essay they wrote last
night is any good.** Say so once, plainly, in onboarding — *"This trains the moves and marks
your sentences. Your teacher marks the essay."* A study app that implies it can mark an HSC
essay is worse than one that admits it can't.

### 0.5 The Draft Desk

Include a plain writing space with word count, timer and export-to-file. It gives **no XP,
no currency and no marking** — it exists because a student mid-session will want to draft a
paragraph and shouldn't have to leave the app. Because all rewards flow through `UI.award()`
(§3), you enforce "earns nothing" structurally by never calling it. Same pattern as the
arcade in §5.

---

## 1. The ask

> Build a fun, interactive study app for HSC English Advanced. It needs to be enjoyable,
> have rewards of some form, and several different games — ideally the whole thing is a
> game. Make it a very full app.

Deliver a zero-dependency web app the student can open on their phone, install to the home
screen, and use on a train with no signal. No build step, no npm, no account, no backend.

### Before you design anything: English is text-specific

Chemistry and maths have a fixed syllabus that's the same for every student. **English does
not.** Two Advanced students at the same school may share only the Common Module text. An
app built around texts the student isn't studying is worthless to them.

So, first action, before writing any content:

> **Ask the student which four texts they study** — one for the Common Module, one for
> Module A (a pair), one for Module B, and their Module C focus. Then build their banks.

And architect for it (§4.1): one file per text, a manifest, and a text-agnostic core that
works regardless. Ship 6–8 common texts as starters so the app isn't empty on first run, but
treat "add my text" as a first-class supported path, not an afterthought.

---

## 2. Non-negotiable technical constraints

These come from the reference app and exist for good reasons. Do not "modernise" them.

| Constraint | Why |
|---|---|
| **No npm, no bundler, no build step, no framework.** | The user clones and opens `index.html`. Anything else is a barrier. **One narrow exception:** the embedding runtime and model of Layer C are *vendored* into the repo as plain files (§6.5.1) — checked in, never fetched, never installed. |
| **Classic `<script>` tags in dependency order** — no ES modules | ES modules are blocked by CORS on `file://`. Script tags mean double-clicking `index.html` works. |
| **One global: `window.EN`** (mirrors `window.CHEM`) | Namespacing without a module system. Every file starts `window.EN = window.EN \|\| {}`. |
| **Hash routing** (`#/play`, `#/game/technique/common`) | Works from `file://` and from a GitHub Pages subpath with no server config. |
| **Vanilla DOM via one `el()` helper** | See `js/core/util.js`. ~40 lines, replaces all of React at this scale. |
| **`localStorage` save, debounced write + explicit flush** | See §9.4 — there is a mobile data-loss bug here you must copy the fix for. |
| **PWA: `manifest.webmanifest` + `sw.js` precache** | Offline is the point. Relative `start_url`/`scope` so it works from a subpath. |
| **Everything renders at 390 px with zero horizontal overflow** | It's a phone app first. Tested at 390 px *and* 360 px. |
| **No network calls after load, ever** | Reinforced by §0: no AI endpoint, no telemetry, no CDN. Everything — including the embedding model — is served from the app's own origin and cached. `offline.js` asserts zero outbound requests (§8). |
| **Layer C degrades, never blocks** | WASM and workers won't load from `file://` (§6.5.2), so embedding marking is unavailable when the app is opened as a local file. Every other mode must still work perfectly there. Detect and explain; never show a broken screen. |

**Copyright note.** Quotes for study and criticism are fine; a full text is not. Ship
*extracts* — a line, a sentence, a short passage with attribution — never a whole poem or
chapter. Keep every extract short enough to be plainly a quotation, and always attribute.

---

## 3. Architecture to copy

```
index.html              shell + script order (the script order IS the dependency graph)
manifest.webmanifest    PWA metadata
sw.js                   service worker, cache-first, versioned CACHE name
assets/                 icons (SVG source + rendered PNGs at 192/512 + apple-touch)
css/styles.css          design system + 10 themes as CSS custom properties
js/data/texts/*.js      ONE FILE PER PRESCRIBED TEXT — see §4.1
js/data/texts.js        the manifest: which texts are active, in which module slot
js/data/techniques.js   technique glossary — name, definition, effect, examples
js/data/rubric.js       band descriptors + rubric verbs, per module
js/data/paragraphs.js   band-tagged sample paragraphs for the Marking Desk (§5)
js/data/*.js            other content banks — pure data, no logic
vendor/transformers/    VENDORED embedding runtime + ONNX WASM — checked in, never fetched
models/minilm/          VENDORED model weights (~23 MB int8) + tokenizer
js/core/mark.js         THE MARKING STACK — layers A/B/C behind one API (§6.5)
js/core/util.js         DOM helpers, seeded RNG, text helpers
js/core/audio.js        WebAudio synthesised SFX — no audio files at all
js/core/fx.js           canvas particles, confetti, floating XP
js/core/state.js        the save file: XP, levels, coins, streaks, SRS, achievements
js/core/bank.js         question aggregation, text filtering, adaptive draw
js/core/ui.js           hash router, toasts, modals, THE REWARD PIPELINE
js/core/arcade.js       ticket economy for the paid arcade
js/games/*.js           one file per game mode
js/screens/*.js         one file per screen (home, play, vault, progress, shop, misc)
js/app.js               route registration + bootstrap
```

### The two conventions that hold it together

**1. Every reward flows through `UI.award({xp, coins, bonus, accuracy})`.** Level-ups,
achievement checks, toasts, confetti, the XP multiplier and the anti-farm accuracy gate all
happen in exactly one function. No game mode can forget them, and no game mode can bypass
the anti-cheat. It is also what makes "the Draft Desk earns nothing" (§0) and "the arcade
earns nothing" (§5) structural facts rather than promises.

**2. Every game gets its chrome from `UI.gameShell(title, opts)` and registers teardown with
`UI.onLeave(fn)`.** The router calls `onLeave` before swapping screens. It is the only thing
stopping `setInterval` timers and `requestAnimationFrame` loops leaking between modes.

### Public APIs worth mirroring exactly

```js
U      // util.js
  $, $$, el, clamp, randInt, pick, shuffle, sample, escapeHtml,
  dayKey, daysBetween, hash, seededRandom, seededShuffle, fmtTime, pct, words, cloze

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
  MIN_BONUS_ACCURACY, MIN_READ_MS, readTimeFor

Bank   // bank.js
  all, byId, MODULES, moduleName, activeTexts, filter, draw, shuffleChoices,
  mistakeQuestions, statsByModule, statsByText

Mark   // mark.js — every typed answer in the app goes through this (§6.5)
  check, fuzzy, embed, cosine, ready, available, downloadModel, downloadProgress
```

Note `U.cloze` and `UI.readTimeFor` — both are English-specific additions explained in §6.4
and §9.5.

---

## 4. Content

### 4.1 The text architecture — get this right on day one

```js
// js/data/texts/nineteen-eighty-four.js
EN.DATA.texts["1984"] = {
  id: "1984",
  title: "Nineteen Eighty-Four",
  composer: "George Orwell",
  year: 1949,
  form: "prose fiction",
  modules: ["common"],              // which module slot(s) this text can fill
  context: [ /* MCQ-able context facts, each with a `why` */ ],
  quotes: [
    { id:"1984-q07",
      text:"Who controls the past controls the future.",
      locus:"Part 1, Ch. 3",
      speaker:"Party slogan",
      span:[0,12],                  // the highlighted span the technique operates on
      techniques:["paradox","antithesis"],   // ALL techniques genuinely present — see §9.7
      effect:"Compresses the Party's epistemology into a chiasmus...",
      concepts:["power","truth","memory"] }
  ],
  characters: [...],
  structure: [...]                  // form/structure facts: acts, narrative frame, etc.
};
```

`js/data/texts.js` is the manifest — which text id sits in which module slot for *this*
student:

```js
EN.DATA.activeTexts = {
  common:  "1984",
  moduleA: ["tempest", "hagseed"],   // Module A is always a pair
  moduleB: "hamlet",
  moduleC: "craft"                   // Module C is a skills focus, not a single text
};
```

Everything downstream filters through `Bank.activeTexts()`. Swapping the student's texts is
then a one-file edit, and the validator (§8) asserts that every question references a text
present in the manifest.

**Ship starter texts** so a fresh install isn't empty. Pick from the commonly prescribed
Advanced list — Common Module: *Nineteen Eighty-Four*, *The Crucible*, *Past the Shallows*,
*Billy Elliot*; Module A pairs: *The Tempest* / *Hag-Seed*, *King Richard III* / *Looking for
Richard*, *The Great Gatsby* / *Sonnets from the Portuguese*; Module B: *Hamlet*,
*Cloudstreet*, *Mrs Dalloway*, selected T.S. Eliot or Plath.

> **Verify against the current NESA prescriptions before writing 400 questions.** Text lists
> rotate on a multi-year cycle and the set above will drift. Ask the student what they
> actually study and prioritise those four; treat the starters as filler.

### 4.2 The text-agnostic core

A good half of the app works for any student regardless of texts, and you should build it
first because it's immediately useful:

- **Technique glossary** — ≥ 80 techniques with definition, effect, and worked examples.
  Language, structural, form-specific (dramatic, poetic, filmic), and rhetorical.
- **Rubric verbs** — *analyse, evaluate, explore, assess, to what extent, discuss*. What each
  demands, and what a response that ignores the verb looks like.
- **Band descriptors** per module, in the student's own words as well as NESA's.
- **Essay architecture** — thesis construction, topic sentences, integration of evidence,
  linking, conceptual throughlines.
- **Module concepts** — the Common Module's "human experiences", Module A's "resonances and
  dissonances", Module B's "textual integrity", Module C's craft focus.

### 4.3 Question shape

Keep the chemistry shape and extend it:

```js
{ id:"cm-084", mod:"common", text:"1984", topic:"Techniques", diff:2,
  stem:"“Who controls the past controls the future.” — Party slogan, Part 1, Ch. 3",
  highlight:[0,12],                 // optional: the span under discussion
  q:"Which technique most directly produces the slogan's sense of inescapable circularity?",
  choices:["Chiasmus","Anaphora","Zeugma","Synecdoche"],
  a:0,
  why:"The clause order inverts across the pivot — controls/past, past/controls — so the sentence closes the loop it describes." }
```

### 4.4 Volume targets

The chemistry app shipped comparable numbers; match or beat them.

- **≥ 400 multiple-choice questions** — techniques, context, module concepts, rubric verbs,
  form and structure — every one with a worked `why`
- **≥ 250 quotes** in the Quote Vault across the active texts, each tagged with techniques,
  concepts and locus
- **≥ 80 techniques** in the glossary
- **≥ 60 band-tagged sample paragraphs** for the Marking Desk — the highest-value and
  highest-cost content in the app. See §6.2 for how to author them cheaply and well.
- **≥ 12 essay-assembly puzzles** for the Essay Architect
- **≥ 40 topic-sentence A/B pairs**
- **≥ 60 free-text prompts** for Layer C, each with **3–5 exemplar answers** and **2–3
  near-misses** (§6.5.3). Budget for this properly — it's roughly the same authoring cost as
  180 MCQs, and it is what the embedding model exists to serve. Twenty is enough to ship.
- **~120 hand-labelled responses** for `calibrate.js` (§6.5.7), tagged good/partial/wrong
- **≥ 65 achievements**, from *First Steps* to *Answer 5,000 questions*
- Reference screens: technique glossary, rubric and band descriptors, module concept notes,
  essay structure guide, and a per-text quote sheet

---

## 5. Game modes — the chemistry→English mapping

⭐ marks the ones where English is genuinely *better* than chemistry was — lead with those.

| Chemistry | → English Advanced | Notes |
|---|---|---|
| ⚡ Rapid Fire | ⚡ **Rapid Fire** | Unchanged in shape. 2 min, endless technique/context/concept questions, streak multiplier to ×3. |
| 🎯 Module Drill | 🎯 **Module Drill** | 15 adaptive questions from one module or one text, no clock. |
| ⚖️ Balance Blitz | ⭐ ✍️ **Thesis Forge** | Chemistry showed a live per-element atom tally as you balanced. Here the student **types a thesis** and gets live feedback on two levels: deterministic structure (does it take a position? name the module concept? use a conceptual verb rather than a plot verb? reference the text?) *and*, once they submit, Layer C similarity against 3–5 exemplar theses (§6.5.3). Same "the game tells you the truth as you build" feel, and it's the mode that most justifies the embedding model. |
| 🧩 Ion Memory | 🃏 **Quote Match** | Concentration-style. Match quote↔technique, quote↔character, technique↔effect, concept↔quote. |
| 🏷️ Name That Compound | ⭐ 🔍 **Name That Technique** | Given a quote with a highlighted span, identify the technique — and the reverse, given a technique pick the quote that demonstrates it. The single most drillable skill in the course. **Read §9.7 before authoring a single one of these.** |
| 🔢 Calculation Crunch | ⭐ 🕳️ **Cloze Crunch** | Chemistry generated numeric problems procedurally. English's procedural equivalent is quote recall: delete words from a memorised quote by algorithm — increasing deletion rate with the card's Leitner box, always deleting the *load-bearing* words (the ones tagged in `span`), never the articles. Infinite, deterministic, and it drills the thing students most reliably lose marks for. |
| 🌧️ Precipitation Panic | ⏱️ **Band Grid** | Fill a grid against the clock: match rubric descriptors to bands, or techniques to effects. Net-scored per §9.6. |
| 🧪 Titration Lab | ⭐⭐ 📝 **The Marking Desk** | **The flagship, and the best mode in this app.** You are the marker. Read a sample paragraph, assign it a band, tick which rubric descriptors it meets, then see the real judgement and the reasoning. Scored on how close your band was and how well your descriptor ticks matched — both exactly markable. Chemistry's titration sim was the most-praised mode and this is precisely its shape: make a judgement call, reveal the truth, score the gap within tolerance. It is also, genuinely, the best-evidenced way to learn to write: marking other people's work. |
| 🔗 Pathway Puzzle | ⭐ 🧱 **Essay Architect** | Chemistry: build a synthesis route through a reaction graph. English: assemble a paragraph or a whole essay from shuffled cards — thesis, topic sentence, evidence, analysis, link, conceptual return. Validated with the same ordering/step-count check. Escalates from single-paragraph TEEL to a five-paragraph skeleton. |
| 💀 Survival | 💀 **Survival** | Unchanged. One life, tightening clock, escalating difficulty. |
| 🩹 Mistake Rehab | 🩹 **Mistake Rehab** | Unchanged. Only questions you've previously missed. |
| 🃏 *(flashcards)* | ⭐ 🗝️ **The Quote Vault** | Chemistry's flashcards were a side feature. Here, promote quote memorisation to a top-level screen with its own nav slot. 5-box Leitner over the quote bank, with Cloze Crunch as its testing mode. For HSC English this is the highest-leverage thing in the whole app. |
| *(new)* | 🎯 **Question Deconstruction** | Procedurally assemble essay questions from a grammar of rubric verb + module concept + directive, then ask what's actually being demanded: which verb, which concept, what would an off-task response look like. Cheap to generate, and it addresses the most common way strong students lose marks. |
| *(new, Layer C)* | ⭐ 💬 **Say It In One** | The purest expression of the marking stack. A quote, a technique, or a module concept appears; the student states its effect **in one sentence, in their own words**. Marked by Layer C against 3–5 exemplars with contrastive near-misses (§6.5.4), then all the exemplars are revealed for self-comparison. Short, repeatable, and it drills the exact sentence-level move that separates a Band 4 paragraph from a Band 6 one. |
| *(new, Layer C)* | 🔧 **Rewrite Rescue** | A weak sentence is shown — plot summary, technique named but unanalysed, floating quote. The student rewrites it. Marked on similarity to exemplar *rewrites*, with the original as a `nearMiss` so "barely changed it" is caught automatically. A neat use of the contrastive rule that costs no extra authoring. |
| *(new, earns nothing)* | 📄 **Draft Desk** | Per §0.5: a plain writing space with word count, timer and export. No XP, no marking, no grading. |

### Boss fights

Five HP duels with a per-question timer, each themed on a module with a **gimmick**:

1. **The Party** (Common Module) — rewrites one of your previously-correct answers as wrong each round; you have to notice and re-answer it.
2. **The Double** (Module A, Textual Conversations) — every question comes as a pair, one from each text of your pairing; answer both or neither counts.
3. **The Critic** (Module B, Critical Study) — hides the technique labels, so you must reason from the quote alone.
4. **The Blank Page** (Module C, Craft of Writing) — a timed assembly gauntlet in the Essay Architect rather than MCQ.
5. **The Examiner** (mixed) — randomises which power-ups are available each turn, and the timer shortens as its HP drops.

Beat one to unlock the next; all five unlock **The Final Paper**, a mixed 25-question gauntlet.

### The Arcade (pay to play, earns nothing)

Three arcade games rented with the in-game currency in 5/15/30-minute tickets:

- **Letter Crush** — 8×8 match-3 on letter tiles
- **Margin Runner** — endless canvas runner
- **Word Tower 2048** — 4×4 merge up a ladder of words

**Critical:** these must award **no XP, no currency, no achievements — only a high score.** An
endless runner that paid XP is a better farm than studying. Enforce structurally by never
calling `UI.award()` from arcade code.

---

## 6. The hard problems

Chemistry's hard problem was rendering formulas. Maths's was rendering notation and checking
algebra. English has three, and **§6.5 — the marking stack — is by far the largest.** Budget
for it accordingly: it is more engineering than any other single part of this app.

### 6.1 Making the multiple-choice half feel like real English, not trivia

Layer C handles free text, but most of the bank is still Layer A, and its failure mode is
degenerating into a technique vocabulary quiz — *what is anaphora?* — which is memorisation,
not analysis, and students see through it in ten minutes.

The fix is that **every question should require reasoning from a specific text to a specific
effect**, not recall of a definition. Concretely:

- ❌ "What is a metaphor?"
- ⚠️ "Which technique is used in this quote?" — acceptable, but shallow on its own
- ✅ "The slogan's clause inversion produces which effect on the reader's sense of agency?"
- ✅ "Which of these four readings of the quote is best supported by its *structure*?"
- ✅ "This paragraph asserts a technique but never links it to the module concept. Which
  sentence would fix that?"

Aim for at least half the bank in the bottom two categories. It's harder to author and it's
the whole difference between an app that helps and an app that's a flashcard deck wearing a
costume.

The **Marking Desk** and **Thesis Forge** carry most of this weight, which is why they're
the flagship modes rather than nice-to-haves.

### 6.2 Authoring 60 band-tagged paragraphs without going insane

The Marking Desk needs sample paragraphs across Bands 2–6, each with a defensible band and
per-descriptor ticks. Authored blind, this is slow and inconsistent.

**Author them by controlled degradation — write the Band 6 first, then break it in exactly
one specified way per lower sample.**

```
Band 6 exemplar (write this first, carefully)
  → Band 5: keep the analysis, weaken the conceptual throughline (drop the link sentence)
  → Band 4: keep the technique identification, replace analysis with description of plot
  → Band 3: keep the quote, drop technique naming entirely
  → Band 2: retell the narrative, no textual evidence
```

This gives you five samples from one authoring effort, the band differences are
*pedagogically legible* rather than vibes, and — crucially — **the `why` writes itself**,
because you know exactly what you removed. Store the degradation as data:

```js
{ id:"para-common-04", module:"common", text:"1984", band:4,
  derivedFrom:"para-common-04-b6",
  broke:["analysis→description"],
  descriptors:{ thesis:true, evidence:true, technique:true, analysis:false, concept:false },
  para:"...", why:"Identifies the paradox and quotes accurately, but the sentence after the quote retells what happens rather than explaining how the paradox positions the reader." }
```

This is the direct English analogue of the reference app's most important content rule
(§9.9): **produce the answer first, then derive the question from it.** In chemistry that
meant picking the titre before the concentrations. Here it means writing the top band before
the lower ones. Same principle, and it works just as well.

The validator can then assert that every degraded sample's `descriptors` map differs from its
parent in exactly the ways `broke` claims — which catches the sample that drifted two bands
while you weren't looking.

### 6.3 Text rendering

Mercifully light compared to maths. You need:

- **Block quotes with attribution**, and a highlight span (`<mark>`) driven by the `span`
  field — that's the whole technique-identification UI.
- **Line-numbered verse** for poetry and drama extracts, since locus matters.
- **A paragraph reader** that's genuinely comfortable at 390 px: ~66ch measure, 1.6 line
  height, and real margins. The Marking Desk asks students to read carefully on a phone; if
  the type is bad, the mode fails regardless of the content.

**Escape HTML before inserting any text content.** Chemistry's `formula()` establishes the
ordering — escape first, then insert markup. Quotes contain apostrophes and em dashes and
occasionally angle brackets; a study app with an XSS hole is still an XSS hole.

### 6.4 `U.cloze` — the procedural generator (Layer B's main customer)

```js
// Delete n words from a quote, biased towards the load-bearing ones (those inside `span`
// or tagged in `techniques`), never articles or prepositions. Seeded from the quote id +
// the card's box, so a given card at a given box always produces the same gaps — otherwise
// the student is re-learning a new puzzle each time instead of consolidating one quote.
U.cloze(quote, { rate, seed })  // → { display, blanks:[{i, word, alts:[...]}] }
```

`alts` matters: accept obvious inflections and British/American spellings so the student
isn't punished for typing "realise". Run the comparison through **Layer B** (§6.5.6) — a
normalised Levenshtein ratio at 0.85 — so a typo doesn't cost a mark. This is exactly the
scope §0.1 permits: one word against a short authored list, where surface form *is* the
thing being tested.

### 6.5 The marking stack — `js/core/mark.js`

Everything the student types goes through one API, so no game mode invents its own marking
and the anti-farm rules in §9 apply uniformly:

```js
Mark.check(response, spec)  // → { verdict, score, layer, feedback, exemplars }
// spec = { layer:"B"|"C", answers:[...], nearMiss:[...], domain, threshold }
// verdict = "nailed" | "close" | "notYet" | "unavailable"
```

`"unavailable"` is a first-class verdict, not an error: Layer C can't run from `file://`
(§6.5.2) or before the model has been downloaded (§6.5.5), and the UI must handle that
gracefully — show the exemplars, award nothing, don't pretend.

#### 6.5.1 What to vendor, and why it isn't really a dependency

- **Runtime:** `transformers.js` (Xenova) — ~1–3 MB minified, plus the `onnxruntime-web`
  WASM binaries it needs.
- **Model:** `all-MiniLM-L6-v2`, int8-quantised ONNX — **~23 MB**, 384-dimensional output.
  This is the model the 384-dim figure in the proposal refers to, and it's the right choice:
  Universal Sentence Encoder via TensorFlow.js is larger, slower to start, and no better at
  short analytical sentences.

Check both into the repo as plain files under `vendor/` and `models/`. No npm, no build
step, no install — the constraint in §2 is about *toolchains*, and a checked-in file is just
an asset like the icons.

**Critical configuration:** transformers.js fetches from the HuggingFace CDN by default,
which would break the no-network promise in the most embarrassing possible way — silently,
online only, and never in your offline test. Set explicitly:

```js
env.allowRemoteModels = false;                    // never phone home
env.localModelPath   = "./models/";
env.backends.onnx.wasm.wasmPaths = "./vendor/transformers/";
```

Then assert it: `offline.js` (§8) must fail the build if *any* outbound request is made
after load.

#### 6.5.2 It will not run from `file://`

WASM instantiation and web workers are blocked by CORS on `file://`. The rest of the app
runs there fine and must continue to — so:

- Feature-detect at boot; if unavailable, `Mark.check` returns `"unavailable"` for Layer C.
- Say why, once, in plain words: *"Sentence marking needs the app served over http — it
  works on your phone install and on the published site, just not by double-clicking the
  file."*
- **All Layer A and B modes must remain fully playable from `file://`.** Test this.

#### 6.5.3 Multiple model answers, and negative exemplars

This is the highest-leverage content decision in the whole marking design.

```js
{ id:"cm-thesis-04", mod:"common", text:"1984", type:"free",
  prompt:"In one sentence, state what Orwell's use of the Party slogans suggests about the relationship between language and power.",
  answers:[                               // 3–5 genuinely different valid answers
    "Controlling language lets the Party control what can be thought.",
    "Orwell presents language as the instrument through which power reproduces itself.",
    "By narrowing what words exist, the Party narrows the range of possible dissent." ],
  nearMiss:[                              // semantically CLOSE but wrong — see §6.5.4
    "The Party uses slogans because propaganda is memorable.",
    "Language is controlled by the people rather than the Party." ],
  domain:"common/language-power", threshold:0.62 }
```

Score as **best cosine across `answers`**, then apply the contrastive rule below. Authoring
three to five valid answers per prompt costs about as much as writing three distractors for
an MCQ, and it does more for accuracy than any amount of threshold tuning — because English
questions genuinely have many right answers, and a single exemplar encodes one person's
phrasing as the truth.

#### 6.5.4 The negation fix — do not skip this

Embeddings are famously weak on negation and direction. *"Hotspur values honour above
pragmatism"* and *"Hotspur values pragmatism above honour"* score ~0.95 against each other.
Marked naively, the app will confidently accept the opposite of the right answer, which is
worse than not marking at all.

**Fix: contrastive scoring against authored near-misses.**

```js
const best   = max(cos(student, a) for a in answers);
const worst  = max(cos(student, n) for n in nearMiss);
if (worst >= best - 0.02) return "notYet";   // closer to a wrong reading than a right one
return best >= threshold ? "nailed" : best >= threshold - 0.10 ? "close" : "notYet";
```

Author `nearMiss` entries as the *inversions and misreadings you'd otherwise write as MCQ
distractors* — reversed direction, right idea about the wrong character, plot summary
instead of analysis. You are already writing these; point them at the marker too.

Add a cheap deterministic backstop for the specific case of reversal: if the prompt's key
terms appear in both the model answer and the student answer but in **opposite relational
order**, flag it regardless of cosine. Twenty lines, and it catches the failure mode that
embarrasses you most.

#### 6.5.5 Downloading 23 MB politely

Do **not** put the model in the initial `PRECACHE` — a 23 MB first load on mobile data is
hostile, and it would block the app's first paint.

- Ship the app without it; every Layer A/B mode works immediately.
- Offer the download behind an explicit button with the size stated: *"Enable sentence
  marking — 23 MB, one time, then works offline forever."*
- Store it in a **separate cache bucket** (`molequest-model-v1`) that survives app-version
  cache bumps, so shipping a content update doesn't re-download 23 MB.
- Show real progress. Handle interruption and resume.
- On a version bump of the model itself, and only then, invalidate that bucket.

#### 6.5.6 Layer B, precisely scoped

```js
// Normalised Levenshtein ratio, after: lowercase, strip punctuation and diacritics,
// collapse whitespace, apply the British/American spelling map.
// 0.85 threshold. Single words and short names ONLY — never a sentence. See §0.1.
Mark.fuzzy(input, alts)  // → { ok, matched, ratio }
```

If you ever find yourself passing a full sentence to `Mark.fuzzy`, that's the §0.1 mistake
reasserting itself. Sentences go to Layer C or to a structural mode. There is no third path.

#### 6.5.7 Calibrate the threshold with data, not vibes

`0.62`–`0.75` is the plausible range for MiniLM cosine on short analytical sentences, and
the right value differs per prompt type. Guessing produces an app that is either insultingly
generous or maddeningly strict.

Build `calibrate.js` (§8) with **~120 hand-labelled student responses** — real-ish sentences
you write, each tagged `good` / `partial` / `wrong` — and have it report the precision and
recall at each threshold from 0.50 to 0.85 in steps of 0.01. Pick the value where false
accepts (a wrong answer marked "nailed") drop to near zero, then accept whatever recall that
buys. **Asymmetric on purpose:** wrongly accepting a bad answer teaches the student something
false, wrongly rejecting a good one merely annoys them — and the exemplars shown afterwards
soften the annoyance.

Store the labelled set in the repo. Re-run it whenever the prompt bank grows.

---

## 7. Progression and economy (copy the numbers, they're tuned)

- **XP:** correct answers pay `10 × difficulty`, multiplied by a streak multiplier (×1 → ×3
  in half-steps every 5 correct).
- **Levels:** `xpNeeded(n) = round(130 × n^1.5)`, **60 levels** with themed titles. Level 20
  is ~87,000 XP; level 60 is ~1.42 M. A whole-HSC-year progression, deliberately. The
  reference app's user explicitly asked for it to be *harder* than the first tuning — don't
  soften it.
- **Prestige/Ascension:** at level 60, reset level and XP but keep every unlock, achievement,
  quote box and statistic, and gain a permanent **+12% XP** that stacks per ascension.
- **Currency:** chemistry used "Moles" 🪙. Here use **"Marks"** ✒️ (or "Ink" if "Marks" reads
  as confusing next to actual marking). Payouts scaled to **60%** so it stays scarce. Spend
  on 7 power-ups (50/50, Skip, Time Freeze, Second Read, Hint, Insight, Adrenaline), **10
  themes**, **22 avatars**, 3 tiers of random supply crate, and arcade playtime. Level-gate
  the good items as well as pricing them.
- **Difficulty modes:** Standard / Hard (×1.45 XP, −25% time) / Nightmare (×2.1 XP, −45%
  time, 50/50 and Skip disabled). Set once in Settings, applies everywhere. **Be careful
  with the time reductions here** — see §9.5; English questions take genuinely longer to
  read than chemistry ones, and a −45% clock on a paragraph-length stem is not "hard", it's
  unreadable. Scale the reduction against reading time, not a flat percentage.
- **Daily challenge:** derived from the date via seeded PRNG, stable all day, identical for
  everyone.
- **Weekly quests:** 3 per ISO week from a 12-quest pool via seeded shuffle. Derive progress
  by diffing cumulative stats against a baseline snapshot taken at week rollover.
- **Streaks:** consecutive-day bonus growing to +60 XP per run.
- **Spaced repetition:** 5-box Leitner over the **Quote Vault**, intervals 1/2/4/8/16 days; a
  miss drops to box 1. Deletion rate in Cloze Crunch rises with the box, so a quote gets
  progressively harder to recall as it gets more familiar.
- **Adaptive draw:** weight each question ×3.5 if previously missed, plus a bonus scaled to
  how weak that module *and text* are — track both, since a student can be strong on the
  Common Module and lost in Module B.
- **Mastery:** confidence-weighted, `accuracy × min(1, seen/25)` — not raw accuracy, so a
  perfect 3-question run doesn't read as mastered.

---

## 8. Testing regime — build these as you go, not at the end

Five plain Node + Playwright scripts, no test framework. Chromium is at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` in this environment.

1. **`validate.js`** — loads the data files in a Node `vm` sandbox where the context global
   *is* `window`, then asserts content invariants:
   - Every question has 4 options, `a:0`, a non-empty `why`, and a valid module code
   - No duplicate ids
   - **Every question references a text present in the manifest** (§4.1) — this is what
     stops the app breaking when the student swaps texts
   - Every `span` is within bounds of its quote; every `highlight` range is valid
   - **No distractor technique is actually present in the quote** (§9.7 — the English-specific
     content trap, and the most important check in this file)
   - Every Marking Desk sample's `descriptors` differ from its parent exactly as `broke`
     claims (§6.2)
   - Every Essay Architect puzzle has exactly one valid ordering, verified independently
   - No achievement unlocks on a fresh save
   - `PRECACHE` in `sw.js` matches the files on disk exactly
   - **The answer-length distribution check** (§9.7) — and English needs it more than any
     other subject
   - Every quote is short enough to be plainly a quotation, and carries an attribution

2. **`smoke.js`** — Playwright drives every mode, a boss fight, a shop purchase, a crate
   opening, a theme switch and a reload-persistence check. Fails on **any** console error.
   Plus horizontal-overflow checks across every screen at **390 px and 360 px**.

3. **`offline.js`** — serves the app from a *subpath* (`http://127.0.0.1:8811/App/`, which is
   what GitHub Pages looks like), confirms the service worker registers and precaches, then
   **cuts the network** and verifies every screen renders and that progress saved while
   offline survives a reload. **Additionally assert the app makes zero outbound requests
   after load** — that's the §0 no-network promise, mechanically enforced, and it's the only
   thing that will catch transformers.js silently reaching for the HuggingFace CDN (§6.5.1).
   Also: download the model, cut the network, and confirm Layer C still marks correctly.

4. **`calibrate.js`** — the threshold harness from §6.5.7. Runs the ~120 hand-labelled
   responses through `Mark.check` and reports precision/recall per threshold, plus a
   confusion matrix. **Fails the build if any labelled `wrong` response is marked "nailed"**
   — a false accept is the one error class that actively teaches something untrue. Also
   asserts the §6.5.4 negation pairs come out on opposite sides.

5. **`exploit.js`** — a zero-knowledge bot: always picks option A, spams through the Quote
   Vault, assigns Band 4 to every Marking Desk sample (the modal band — a real strategy),
   and — new for this app — **pastes the same plausible-sounding sentence into every free-text
   prompt**, then pastes lorem ipsum, then pastes the prompt back at itself. **Fails the build
   if any mode pays more than 25 XP, if the sustained rate exceeds 2,000 XP/hour, or if pure
   guessing reaches level 2.** See §9.5 and §9.8.

6. **`arcade.js`** — tickets charge correctly, a broke player is refused, the clock runs only
   while the game is on screen, high scores survive a reload, and **XP/level/currency are
   provably untouched** by playing — and by the Draft Desk.

7. **`file-protocol.js`** — opens the app as `file://` and asserts every Layer A and B mode
   is fully playable, that Layer C reports `"unavailable"` rather than throwing, and that the
   explanation is shown (§6.5.2).

**Also run an "honest player" bot** alongside `exploit.js`. Every anti-cheat measure in §9
could plausibly break normal play, and the only way to know it hasn't is to measure both
directions. The chemistry app's honest bot earns 608/619/248 XP in three modes; the spam bot
earns 0.

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
header/meta rows, hide non-essential chrome below 430 px. Watch long unbroken quotes and
`<mark>` spans, which are exactly the kind of content that triggers it.

### 9.3 A service worker makes every first load reload itself
`clients.claim()` fires `controllerchange` even when there was no previous controller, so a
naive "reload on controllerchange" handler reloads every first visit. **Fix:** capture
`const hadController = !!navigator.serviceWorker.controller` **before** registering, and
ignore the event when it's false. (`js/app.js:87`)

### 9.4 Debounced saves lose data on mobile
A 200 ms debounce with no flush means backgrounding the tab mid-write loses progress —
mobile browsers reclaim tabs aggressively. **Fix:** `State.flush()` on both
`visibilitychange` (when hidden) and `pagehide`. Especially important here: a student in the
Draft Desk who backgrounds the app must not lose their paragraph.

### 9.5 XP was farmable by spamming — the user found this, not the tests
The original design paid XP for correct answers with **no penalty for wrong ones**, so
mashing any answer and submitting earned **35,097 XP/hour**. Four fixes, all required:

1. **Accuracy-gate the completion bonus.** Below 50% accuracy the end-of-run bonus is
   withheld *entirely*; above it, scaled by accuracy. Enforce inside `UI.award()`.
2. **Wrong answers subtract XP** from the run's pool (floored at zero).
3. **A minimum read time.** Answers faster than **1,200 ms** pay nothing. **English needs
   this to be dynamic, not a constant** — a technique question with a two-line quote and a
   Marking Desk sample of 180 words are not the same read. Implement
   `UI.readTimeFor(text)` ≈ `800 ms + 240 ms per word`, capped around 25 s, and use it in
   place of the flat constant everywhere. Getting this wrong in either direction is bad: too
   low and the mode is farmable, too high and an honest fast reader is punished. Tune it
   against the honest-player bot.
4. **Remove every XP floor.** "You get at least 50 XP for finishing" is a farm.

Result in chemistry: 35,097 XP/hr → **0**, with honest play unchanged. Design this in from
day one; it is far more painful to retrofit.

### 9.6 Guessable grids and small answer spaces need *net* scoring
A fill-the-grid mode with two states per cell is ~50% correct by chance. **Fix:** score
`max(0, right − wrong)`, and scale any time bonus by accuracy with a floor (no bonus below
75%). Applies to **Band Grid** — and note the Marking Desk has the same shape: with five
bands, guessing the modal band scores far above zero. Score band accuracy as *distance*
(exact = full, ±1 band = partial, ±2 = nothing) and require the descriptor ticks to agree
before paying the bonus.

### 9.7 Two content traps, and English has them worse than any other subject

**(a) The answer-length tell — the user found this in chemistry.** Writing a thorough correct
answer and three throwaway distractors makes the key guessable from length alone. Measured:
**63.9%** score by always picking the longest option. Fixed by rewriting 156 questions and
lengthening a distractor in 45 more, taking longest-option scoring to 32.3% and *strictly*
longest-is-key to 24.3% — **below the 25% chance baseline**. The validator now fails the
build above 32%.

**English is the worst subject for this**, because the sophisticated-sounding option is
almost always the intended answer when options are written quickly. You need *two* checks:
longest-option scoring, and **"most sophisticated vocabulary" scoring** — if the option
containing words like *juxtaposition*, *positions the responder*, *destabilises* is the key
more than ~30% of the time, your distractors are lazy. Write distractors that are equally
fluent and equally jargon-laden but *wrong about this quote*.

**(b) Quotes exhibit multiple techniques simultaneously — this trap is unique to English and
it will silently invalidate a third of your bank.** "Which technique is used here?" is not a
well-formed question when the quote contains metaphor *and* alliteration *and* a triadic
structure. A student who picks a technique that is genuinely present and marks it wrong will
lose trust in the app immediately, and they'll be right to.

Three fixes, use all of them:

1. **Tag every technique genuinely present** in the quote's `techniques` array — not just the
   one you're asking about.
2. **The validator asserts no distractor appears in that array.** This is the single most
   important content check in this brief.
3. **Ask about the highlighted span and the effect**, not the quote in general: *"Which
   technique operating in the highlighted phrase produces the sense of inevitability?"* Now
   the question has one defensible answer, and it's a better question pedagogically.

### 9.8 Self-graded review is free money
Chemistry's flashcards paid XP for a self-reported "I got it" — an infinite loop. **Fix:** a
card pays only **once per day**, only if it was genuinely **due**, and only after
`readTimeFor` has elapsed. Report accuracy to `award()` as *paid cards / deck size*, never
the self-reported figure.

**The Quote Vault must use Cloze Crunch for anything that pays.** Self-rated recall
("did you remember it? yes") is unmarkable and farmable; a typed cloze answer is neither.
Keep a self-rated mode for browsing, and pay nothing for it.

**Layer C needs its own farm guard, and it's a softer target than anything in the chemistry
app.** A similarity threshold is not an equality check, so these are all real attacks:

- *One good sentence, everywhere.* A generically strong sentence — *"Orwell positions the
  responder to interrogate the relationship between language and power"* — will clear
  threshold on a surprising number of prompts. **Fix:** a free-text prompt pays **once per
  day**, exactly like a flashcard, and cross-prompt repetition of the same response is
  detected (hash the normalised text; if it's the student's own answer to a different prompt
  today, pay nothing).
- *Paste the prompt back.* Prompts and their exemplars are semantically close to each other
  by construction. **Fix:** add the prompt itself to `nearMiss` automatically, at runtime,
  for every free-text question. One line, closes the whole attack class.
- *Resubmit until it passes.* **Fix:** one scored attempt per prompt per day. Further
  attempts show feedback and exemplars but pay nothing — which is the pedagogically better
  behaviour anyway.
- *Cap the ceiling.* Layer C should never be the fastest XP per minute in the app. Keep its
  per-response payout at or below a Layer A correct answer, and let the structural modes
  carry the economy.

### 9.9 Produce the answer first, then derive the question
The chemistry titration sim randomised concentrations and volumes independently, so the
required titre could exceed the equipment's capacity — an unanswerable question, which the
user hit in normal play. The rule that fixed it generalises to every subject.

For English: **§6.2 is this rule** — write the Band 6 exemplar first, then derive the lower
bands by controlled degradation. Also:

- **Cloze deletions:** pick which words are load-bearing first, then delete around them —
  don't delete at random and hope the gap is meaningful.
- **Essay Architect:** write the correct essay, then shuffle it. Never author a shuffled pile
  and try to declare an ordering afterwards.
- **Question Deconstruction:** pick the rubric verb and the intended demand first, then
  generate the question wording around it.
- **Technique questions:** start from the effect you want to teach, then find the quote that
  demonstrates it — not the reverse.
- **Free-text prompts (Layer C):** write the exemplar answers *first*, then write the prompt
  that they are all valid answers to. Prompts authored first tend to admit readings your
  exemplars don't cover, and every one of those is a false rejection of a correct student.

### 9.10 Procedural generators need a difficulty *contract*
Chemistry's `calc.js` produced problems whose difficulty varied wildly for the same declared
`diff`. Give Cloze Crunch and Question Deconstruction explicit contracts: deletion rate,
whether deleted words are content or function words, quote length band, and how many rubric
elements a deconstruction question involves. Assert them in tests.

### 9.11 A "free" mode becomes the optimal strategy
The arcade was nearly shipped paying small XP. An endless runner paying even 1 XP/second
beats studying. **Fix:** free modes award nothing but a high score, enforced by never calling
`award()`. The **Draft Desk** (§0) is in the same category — it must pay nothing, or "type
500 words of nonsense" becomes the fastest way to level. State it in the UI so it reads as
design rather than a bug.

### 9.12 Test-harness traps that will cost you an hour each
- Assigning an **unchanged** `location.hash` fires no `hashchange`, so the router never runs
  and your test hangs. Call the router function directly (`UI.go(...)`) from tests.
- Results modals that open on a delay (e.g. 900 ms after the last question) make a naive
  "dismiss the modal" step race the animation. Write one `dismissModal()` helper that waits.
- A shop test asserting "coins must decrease" breaks once achievements can pay out more than
  the item costs mid-purchase. Assert `spendCoins` was called and the inventory changed.

---

## 10. Suggested build order

1. **Ask the student for their four texts** (§1). Everything downstream depends on it, and
   it costs one message.
2. **Skeleton + `util.js` + the text-rendering primitives (§6.3) + `U.cloze` (§6.4).**
3. `state.js` with the save file, XP curve, and `UI.award()` **including the §9.5 gates and
   `readTimeFor` from the start**. Write `exploit.js` now, while it's trivially passing.
4. `ui.js` router, shell, modals, toasts. Add `[hidden]{display:none!important}` (§9.1) and
   `min-width:0` (§9.2) immediately.
5. **The text manifest and one text file** (§4.1), plus `bank.js` with text filtering. Get
   the swap-my-text path working before there's content to migrate.
6. The text-agnostic core (§4.2): technique glossary, rubric, band descriptors. Useful on its
   own, and every later mode draws on it.
7. Rapid Fire + Name That Technique. Now it's playable. Turn on the §9.7 validator checks
   here, before the bank grows.
8. **`mark.js` with Layers A and B only** (§6.5.6), plus the **Quote Vault + Cloze Crunch**.
   Highest-leverage feature in the app; ship it early so the student gets value while the
   rest is built. Layer B has no model to download, so this all still runs from `file://`.
9. **The Marking Desk**, with 15 paragraphs authored by controlled degradation (§6.2), then
   Essay Architect.
10. **Layer C — the embedding marker.** Do it as one focused block, in this order, and don't
    start until steps 1–9 are green:
    a. Vendor transformers.js + MiniLM; wire `env.allowRemoteModels = false` (§6.5.1).
    b. Prove it embeds and cosines correctly in a Node harness before any UI exists.
    c. Author **20** free-text prompts with 3–5 exemplars and near-misses each (§6.5.3–4).
    d. Build `calibrate.js` and the ~120 labelled responses; pick the threshold (§6.5.7).
    e. Only now build the UI: Say It In One, Thesis Forge's submit path, Rewrite Rescue.
    f. Model download flow with its own cache bucket and progress (§6.5.5).
    g. `file-protocol.js` — confirm everything else still works without it (§6.5.2).
11. Remaining modes, cheapest first. Keep `smoke.js` green after each.
12. Content push to §4.4. Run both bias checks (§9.7a) and `calibrate.js` continuously.
13. Shop, achievements, progress, daily/weekly, prestige. Bosses.
14. PWA (manifest, service worker, icons) + `offline.js` including the zero-requests assert.
15. Draft Desk and Arcade last — neither can break the economy if neither calls `award()`.

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
- LAN alternative: `python3 -m http.server 8000`. Service workers won't register over plain
  HTTP to a LAN IP, so that route gives the app but not offline caching.
- Offer Settings → **Export save / Import save** as JSON, since `localStorage` is per-device.
  Include Draft Desk contents in the export — losing drafts on a device change would be worse
  than losing XP.
- **Bump the `CACHE` constant in `sw.js` on every deploy** and keep `PRECACHE` in sync with
  the files on disk. The validator should fail the build if they drift. Note that adding a
  text file changes the list, so it must bump the cache too. **The model bucket
  (`molequest-model-v1`) is versioned separately and must NOT be invalidated by an app-version
  bump** (§6.5.5) — otherwise every content update costs the student another 23 MB.
- **The repo will be ~30 MB** once the model and runtime are vendored. That's fine for GitHub
  (well under the 100 MB per-file limit and the 1 GB soft repo limit), but mention it to the
  user so the clone time isn't a surprise. Don't use Git LFS — Pages doesn't serve LFS
  objects, and the model would 404 in production while working perfectly for you locally.

---

## 12. Tone and polish

The reference app's personality is dry, confident and a bit chemistry-nerdy — theme names
like *Exothermic* and *Noble Gold*, rank blurbs like *"Flawless work. Band 6 energy."* Do the
English equivalent (*Marginalia*, *Foolscap*, *Red Pen*, *Iambic*, *Palimpsest*, *Folio*)
rather than generic gamification voice. It matters more than it sounds like it should: the
user asked for "enjoyable" first and "study app" second.

Two tone notes specific to this subject:

**Don't be smug about literature.** The app's voice should be a sharp friend who has read the
text, not a Head Teacher. Rank blurbs and technique explanations should sound like someone
explaining why a line works, not like a marking rubric with jokes.

**Be straight about the §0 boundary wherever it comes up.** If a student taps into the Draft
Desk expecting feedback, the empty state should say what it is — *"Somewhere to write. No
marks, no score, no one reading over your shoulder."* — rather than silently doing nothing.
Honesty about what the app can't do is what makes the rest of it trustworthy.

**Never present a cosine score as a mark.** Layer C's verdict is three words — *nailed it*,
*close*, *not yet* — followed by the exemplar answers. Do not show "0.71", do not render it
as a percentage, and above all do not map it to a band. It measures *"this means roughly what
a good answer means"*, and dressing that up as a mark out of 20 would be the one genuinely
dishonest thing this app could do. When the verdict is *close* or *not yet*, the exemplars
are the feedback — that's why they're always revealed.

Synthesise **all** sound effects in WebAudio (`js/core/audio.js` has ~67 of them in 273
lines) — no audio files, nothing to precache, nothing to license. The reference app's user
explicitly asked for "way more sound effects" mid-build; budget for a large SFX vocabulary
from the start. Keep them quieter and softer here than in the chemistry app: this app asks
for sustained reading, and a bright arcade sting every eight seconds fights that.

Respect `prefers-reduced-motion` (disable particles and background animation), support
keyboard play (`1`–`4` answer, `Enter` advances, `Esc` closes), and keep every theme legible
in both light and dark — with real attention to body-text contrast and measure, since this is
the one app in the set where the student reads paragraphs rather than glancing at formulas.
