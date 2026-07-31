/* The save file: XP, levels, Primes, streaks, inventory, SRS, bookmarks,
   achievements and stats. One localStorage key, written on a short debounce
   with an explicit flush (see §9.4 of the brief — mobile browsers reclaim
   backgrounded tabs without warning, and a 200 ms debounce with no flush
   loses whatever was in flight). */
window.MQ = window.MQ || {};

MQ.State = (function () {
  const KEY = "mathquest.save.v1";
  const U = MQ.U;

  const DEFAULT = () => ({
    v: 1,
    createdAt: Date.now(),
    profile: { name: "Student", avatar: "🧮", theme: "graph" },
    xp: 0, level: 1, xpIntoLevel: 0, coins: 100, prestige: 0, lifetimeXp: 0,
    streak: { count: 0, lastDay: null, longest: 0 },
    stats: {
      answered: 0, correct: 0, bestStreak: 0, perfectRuns: 0,
      equivalences: 0, pairsMatched: 0, curvesRead: 0, calcsCorrect: 0,
      tangentsPlaced: 0, perfectTangents: 0, areasFound: 0,
      proofsSolved: 0, inductionsSolved: 0, gridsFilled: 0, perfectGrids: 0,
      projectilesLanded: 0, bullseyes: 0,
      bossWins: 0, flawlessBoss: 0, clutchWins: 0,
      mistakesFixed: 0, peakCoins: 100, nightOwl: false, earlyBird: false,
      timePlayed: 0, survivalBest: 0, hardWins: 0, nightmareWins: 0,
      cardsMastered: 0, questsDone: 0, extAnswered: 0, extCorrect: 0,
      finalPaperBest: 0, referenceReads: 0
    },
    topics: {},
    modesPlayed: {},
    proofsSolved: {},
    bossesBeaten: {},
    inventory: { fifty: 1, skip: 1, freeze: 0, shield: 0, double: 0, insight: 0, revive: 0 },
    owned: { themes: ["graph"], avatars: ["🧮", "📐"] },
    srs: {},
    mistakes: [],
    bookmarks: [],
    achievements: {},
    history: {},
    scores: {},
    settings: { sound: true, motion: true, volume: 0.8, difficulty: "standard", radians: true },
    daily: { day: null, progress: 0, claimed: false, spec: null },
    weekly: { week: null, baseline: null, quests: [], claimed: [] },
    arcade: { tickets: {}, scores: {}, played: {} }
  });

  let data = DEFAULT();
  const listeners = new Set();
  let saveTimer = null;
  /* Set by replaceSave(). Once latched, NO further write can happen — see the
     comment on replaceSave() for why this exists. */
  let frozen = false;

  /* ── persistence ─────────────────────────────────────────── */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) data = deepMerge(DEFAULT(), JSON.parse(raw));
    } catch (e) {
      console.warn("Save file unreadable, starting fresh.", e);
      data = DEFAULT();
    }
    return data;
  }

  function deepMerge(base, override) {
    if (Array.isArray(base)) return Array.isArray(override) ? override : base;
    if (base && typeof base === "object" && override && typeof override === "object") {
      const out = Object.assign({}, base);
      for (const k of Object.keys(override)) {
        out[k] = k in base ? deepMerge(base[k], override[k]) : override[k];
      }
      return out;
    }
    return override === undefined ? base : override;
  }

  function write() {
    if (frozen) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { console.warn("Could not save progress.", e); }
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(write, 200);
  }

  /** Write immediately, cancelling any pending debounce. The app calls this on
      visibilitychange and pagehide — visibilitychange is the only event mobile
      browsers reliably fire before reclaiming a tab. */
  function flush() {
    clearTimeout(saveTimer);
    saveTimer = null;
    write();
  }

  function emit() { listeners.forEach(fn => fn(data)); save(); }
  function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  /* ── levelling ───────────────────────────────────────────────
     Level 20 is ~87,000 XP and level 60 about 1.42 million: a whole-HSC-year
     progression, deliberately. Do not soften this — the reference app's user
     asked explicitly for it to be harder than the first tuning. */
  const xpNeeded = level => Math.round(130 * Math.pow(level, 1.5));
  const MAX_LEVEL = 60;

  function levelTitle(level) {
    const t = MQ.DATA.levelTitles;
    return t[Math.min(level - 1, t.length - 1)];
  }

  function difficulty() {
    const id = data.settings.difficulty || "standard";
    return MQ.DATA.difficulties.find(d => d.id === id) || MQ.DATA.difficulties[0];
  }

  /** Difficulty bonus compounded with the permanent ascension bonus (+12% each). */
  function xpMultiplier() {
    return difficulty().xp * (1 + (data.prestige || 0) * 0.12);
  }

  const canPrestige = () => data.level >= MAX_LEVEL;

  /** Ascend: reset level and XP, keep every unlock, gain a permanent XP bonus. */
  function doPrestige() {
    if (!canPrestige()) return false;
    data.prestige = (data.prestige || 0) + 1;
    data.level = 1;
    data.xpIntoLevel = 0;
    data.xp = 0;
    addCoins(2500, true);
    grantPowerup("double", 3);
    emit();
    return true;
  }

  function masteryTier(pct) {
    const tiers = MQ.DATA.masteryTiers;
    let out = tiers[0];
    for (const t of tiers) if (pct >= t.at) out = t;
    return out;
  }

  /** Award XP (already multiplied by the caller). Returns { levelsGained, newLevel }. */
  function addXP(amount) {
    if (!amount || amount <= 0) return { levelsGained: 0, newLevel: data.level };
    data.xp += amount;
    data.lifetimeXp = (data.lifetimeXp || 0) + amount;
    data.xpIntoLevel += amount;
    const today = U.dayKey();
    data.history[today] = (data.history[today] || 0) + amount;

    let gained = 0;
    while (data.level < MAX_LEVEL && data.xpIntoLevel >= xpNeeded(data.level)) {
      data.xpIntoLevel -= xpNeeded(data.level);
      data.level++;
      gained++;
      addCoins(30 * data.level, true);
    }
    if (data.level >= MAX_LEVEL) data.xpIntoLevel = Math.min(data.xpIntoLevel, xpNeeded(MAX_LEVEL));
    emit();
    return { levelsGained: gained, newLevel: data.level };
  }

  function addCoins(n, quiet) {
    data.coins = Math.max(0, data.coins + n);
    if (data.coins > data.stats.peakCoins) data.stats.peakCoins = data.coins;
    if (!quiet) emit();
    return data.coins;
  }

  function spendCoins(n) {
    if (data.coins < n) return false;
    data.coins -= n;
    emit();
    return true;
  }

  /* ── daily streak ────────────────────────────────────────── */
  function touchStreak() {
    const today = U.dayKey();
    const last = data.streak.lastDay;
    if (last === today) return { changed: false, count: data.streak.count };

    if (!last) data.streak.count = 1;
    else {
      const gap = U.daysBetween(last, today);
      data.streak.count = gap === 1 ? data.streak.count + 1 : 1;
    }
    data.streak.lastDay = today;
    data.streak.longest = Math.max(data.streak.longest, data.streak.count);

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 4) data.stats.nightOwl = true;
    if (hour >= 5 && hour < 7) data.stats.earlyBird = true;

    emit();
    return { changed: true, count: data.streak.count };
  }

  const streakBonus = () => Math.min(5 + data.streak.count * 3, 60);

  /* ── answer recording ────────────────────────────────────── */
  function recordAnswer(topic, isCorrect, questionId) {
    data.stats.answered++;
    if (isCorrect) data.stats.correct++;

    if (topic) {
      const t = data.topics[topic] || (data.topics[topic] = { seen: 0, correct: 0 });
      t.seen++;
      if (isCorrect) t.correct++;
      if (MQ.DATA.tierOf(topic) === "ME") {
        data.stats.extAnswered = (data.stats.extAnswered || 0) + 1;
        if (isCorrect) data.stats.extCorrect = (data.stats.extCorrect || 0) + 1;
      }
    }

    if (questionId) {
      const idx = data.mistakes.findIndex(x => x.id === questionId);
      if (isCorrect) {
        if (idx >= 0) { data.mistakes.splice(idx, 1); data.stats.mistakesFixed++; }
      } else if (idx >= 0) {
        data.mistakes[idx].misses++;
        data.mistakes[idx].ts = Date.now();
      } else {
        data.mistakes.unshift({ id: questionId, topic, misses: 1, ts: Date.now() });
        if (data.mistakes.length > 150) data.mistakes.pop();
      }
    }
    save();
  }

  function noteStreak(n) { if (n > data.stats.bestStreak) { data.stats.bestStreak = n; save(); } }

  function bump(statKey, by) {
    data.stats[statKey] = (data.stats[statKey] || 0) + (by === undefined ? 1 : by);
    save();
  }

  function markMode(modeId) {
    data.modesPlayed[modeId] = (data.modesPlayed[modeId] || 0) + 1;
    save();
  }

  function recordScore(modeId, score) {
    const prev = data.scores[modeId];
    const isBest = prev === undefined || score > prev;
    if (isBest) { data.scores[modeId] = score; save(); }
    return isBest;
  }

  /* ── bookmarks ───────────────────────────────────────────────
     Star a question mid-run and it lands in a review deck on the Study
     screen. Deliberately unrewarded — it's a notebook, not a game mode. */
  function toggleBookmark(id) {
    const i = data.bookmarks.indexOf(id);
    if (i >= 0) data.bookmarks.splice(i, 1);
    else data.bookmarks.unshift(id);
    if (data.bookmarks.length > 200) data.bookmarks.pop();
    save();
    return i < 0;
  }
  const isBookmarked = id => data.bookmarks.indexOf(id) >= 0;

  /* ── topic mastery ───────────────────────────────────────── */
  function mastery(topic) {
    const t = data.topics[topic];
    if (!t || !t.seen) return 0;
    // Confidence-weighted: a perfect 3-question run shouldn't read as mastered.
    return Math.round((t.correct / t.seen) * Math.min(1, t.seen / 25) * 100);
  }

  const overallAccuracy = () => U.pct(data.stats.correct, data.stats.answered);

  /* ── inventory ───────────────────────────────────────────── */
  function usePowerup(id) {
    if ((data.inventory[id] || 0) <= 0) return false;
    data.inventory[id]--;
    emit();
    return true;
  }
  function grantPowerup(id, n) {
    data.inventory[id] = (data.inventory[id] || 0) + (n || 1);
    emit();
  }

  const ownsTheme = id => data.owned.themes.includes(id);
  const ownsAvatar = em => data.owned.avatars.includes(em);

  /* ── spaced repetition (Leitner, 5 boxes) ────────────────── */
  const BOX_DAYS = [0, 1, 2, 4, 8, 16];

  function cardState(id) {
    return data.srs[id] || (data.srs[id] = { box: 1, due: U.dayKey(), reps: 0, lapses: 0 });
  }

  /* Flashcards are self-graded, so "Did you get it?" → "Yes" → XP is an
     infinite loop. A card therefore pays at most once per day, and only if
     it was genuinely due (see §9.8). */
  function cardXpEligible(id) {
    const c = data.srs[id];
    return !c || c.xpDay !== U.dayKey();
  }
  function markCardXp(id) { cardState(id).xpDay = U.dayKey(); save(); }

  function reviewCard(id, gotIt) {
    const c = cardState(id);
    c.reps++;
    if (gotIt) c.box = Math.min(5, c.box + 1);
    else { c.box = 1; c.lapses++; }
    const due = new Date();
    due.setDate(due.getDate() + BOX_DAYS[c.box]);
    c.due = U.dayKey(due);
    data.stats.cardsMastered = Object.values(data.srs).filter(x => x.box >= 5).length;
    save();
    return c;
  }

  /** Cards due today, tier-filtered so an Advanced-only build never shows ME cards. */
  function dueCards(deck) {
    const today = U.dayKey();
    return (deck || MQ.Cards.all()).filter(card => {
      const c = data.srs[card.id];
      return !c || U.daysBetween(c.due, today) >= 0;
    });
  }

  /* ── achievements ────────────────────────────────────────── */
  function achievementStats() {
    return Object.assign({}, data.stats, {
      level: data.level,
      longestDayStreak: data.streak.longest,
      topics: data.topics,
      modesPlayed: data.modesPlayed,
      themesOwned: data.owned.themes.length,
      avatarsOwned: data.owned.avatars.length,
      proofsSolvedUnique: Object.keys(data.proofsSolved).length,
      inductionsSolvedUnique: MQ.Proofs.inductions().filter(p => data.proofsSolved[p.id]).length,
      bossesBeaten: Object.keys(data.bossesBeaten).length,
      cardsMastered: Object.values(data.srs).filter(x => x.box >= 5).length,
      bookmarks: data.bookmarks.length,
      prestige: data.prestige || 0,
      questsDone: data.stats.questsDone || 0,
      // Exposed as a function so mastery achievements use the UI's weighting.
      masteryOf: mastery
    });
  }

  /** Evaluate every enabled achievement; returns any newly unlocked. */
  function checkAchievements() {
    const s = achievementStats();
    const unlocked = [];
    for (const a of MQ.DATA.enabledAchievements()) {
      if (data.achievements[a.id]) continue;
      let ok = false;
      try { ok = !!a.check(s); } catch (e) { ok = false; }
      if (ok) {
        data.achievements[a.id] = Date.now();
        if (a.reward) addCoins(a.reward, true);
        unlocked.push(a);
      }
    }
    if (unlocked.length) emit();
    return unlocked;
  }

  /* ── daily challenge ─────────────────────────────────────────
     Derived from the date, so it's stable all day and identical for
     everyone. */
  function dailySpec() {
    const day = U.dayKey();
    const rng = U.seededRandom(U.hash("mathquest-" + day));
    const modes = ["rapid", "equiv", "match", "curve", "crunch", "panic", "lab", "proof"]
      .concat(MQ.DATA.hasExt() ? ["vector"] : []);
    const mode = modes[Math.floor(rng() * modes.length)];
    const targets = { rapid: 14, equiv: 6, match: 1, curve: 10, crunch: 8,
                      panic: 1, lab: 3, proof: 3, vector: 3 };
    return { day, mode, target: targets[mode] || 10, reward: 120, xp: 150 };
  }

  function daily() {
    const spec = dailySpec();
    if (data.daily.day !== spec.day) {
      data.daily = { day: spec.day, progress: 0, claimed: false, spec };
      save();
    } else data.daily.spec = spec;
    return data.daily;
  }

  function progressDaily(mode, by) {
    const d = daily();
    if (d.claimed || d.spec.mode !== mode) return false;
    d.progress = Math.min(d.spec.target, d.progress + (by === undefined ? 1 : by));
    save();
    return d.progress >= d.spec.target;
  }

  function claimDaily() {
    const d = daily();
    if (d.claimed || d.progress < d.spec.target) return false;
    d.claimed = true;
    addCoins(d.spec.reward, true);
    addXP(d.spec.xp);
    return true;
  }

  /* ── weekly quests ───────────────────────────────────────────
     Each quest names a cumulative stat; progress is that stat minus a
     snapshot taken at week rollover, so no per-event plumbing is needed. */
  const QUEST_POOL = [
    { id:"q_answer",  stat:"answered",     target:180, xp:1400, coins:700, icon:"📝",
      name:"Grind it out",      desc:"Answer 180 questions" },
    { id:"q_correct", stat:"correct",      target:120, xp:1600, coins:800, icon:"🎯",
      name:"On target",         desc:"Get 120 questions right" },
    { id:"q_equiv",   stat:"equivalences", target:30,  xp:1300, coins:650, icon:"🔁",
      name:"Same thing twice",  desc:"Verify 30 equivalences" },
    { id:"q_pairs",   stat:"pairsMatched", target:60,  xp:1100, coins:550, icon:"🃏",
      name:"Pair sweep",        desc:"Match 60 pairs" },
    { id:"q_lab",     stat:"tangentsPlaced", target:20, xp:1500, coins:750, icon:"📐",
      name:"Gradient week",     desc:"Place 20 tangents in the Calculus Lab" },
    { id:"q_proof",   stat:"proofsSolved", target:12,  xp:1400, coins:700, icon:"🪜",
      name:"Proof sprint",      desc:"Assemble 12 proofs" },
    { id:"q_calc",    stat:"calcsCorrect", target:45,  xp:1400, coins:700, icon:"🔢",
      name:"Number crunch",     desc:"Solve 45 calculations" },
    { id:"q_curve",   stat:"curvesRead",   target:45,  xp:1300, coins:650, icon:"📈",
      name:"Curve literacy",    desc:"Read 45 graphs correctly" },
    { id:"q_boss",    stat:"bossWins",     target:3,   xp:2200, coins:1100, icon:"⚔️",
      name:"Boss hunter",       desc:"Defeat 3 Exam Bosses" },
    { id:"q_perfect", stat:"perfectRuns",  target:5,   xp:2000, coins:1000, icon:"✨",
      name:"Flawless five",     desc:"Finish 5 perfect runs" },
    { id:"q_cards",   stat:"cardsMastered",target:20,  xp:1500, coins:750, icon:"🗂️",
      name:"Deck builder",      desc:"Have 20 flashcards mastered" },
    { id:"q_survive", stat:"survivalBest", target:25,  xp:1800, coins:900, icon:"💀",
      name:"Last stand",        desc:"Reach a 25-question Survival run" }
  ];

  /** ISO-ish week key, e.g. "2026-W31". */
  function weekKey(d) {
    const t = d || new Date();
    const target = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
    const firstThursday = new Date(target.getFullYear(), 0, 4);
    firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
    const week = 1 + Math.round((target - firstThursday) / (7 * 86400000));
    return `${target.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  function statFor(key) {
    if (key === "cardsMastered") return Object.values(data.srs).filter(c => c.box >= 5).length;
    return data.stats[key] || 0;
  }

  function weekly() {
    const wk = weekKey();
    if (data.weekly.week !== wk) {
      const rng = U.seededRandom(U.hash("mathquest-week-" + wk));
      const picked = U.seededShuffle(QUEST_POOL, rng).slice(0, 3).map(q => q.id);
      const baseline = {};
      QUEST_POOL.forEach(q => (baseline[q.stat] = statFor(q.stat)));
      data.weekly = { week: wk, baseline, quests: picked, claimed: [] };
      save();
    }
    return data.weekly;
  }

  function weeklyQuests() {
    const w = weekly();
    return w.quests.map(id => {
      const q = QUEST_POOL.find(x => x.id === id);
      const base = (w.baseline && w.baseline[q.stat]) || 0;
      const done = Math.max(0, Math.min(q.target, statFor(q.stat) - base));
      return { quest: q, done, target: q.target,
               complete: done >= q.target, claimed: w.claimed.includes(id) };
    });
  }

  function claimQuest(id) {
    const w = weekly();
    const entry = weeklyQuests().find(e => e.quest.id === id);
    if (!entry || !entry.complete || entry.claimed) return false;
    w.claimed.push(id);
    data.stats.questsDone = (data.stats.questsDone || 0) + 1;
    addCoins(entry.quest.coins, true);
    addXP(Math.round(entry.quest.xp * xpMultiplier()));
    return true;
  }

  /* ── export / import ─────────────────────────────────────────
     localStorage is per-device, and students change phones. */
  function exportSave() { return JSON.stringify(data, null, 2); }

  /**
   * Replace the save file and freeze all further writes.
   *
   * The naive version of this — write, then location.reload() — destroys the
   * import. The reload fires `pagehide`, `pagehide` fires the debounced-save
   * flush, and the flush writes the OLD in-memory state straight back over the
   * file that was just imported. From the outside the import silently does
   * nothing at all.
   *
   * So: merge against the current DEFAULT shape (a save from an older version
   * gains new fields rather than blanking them), write once, and latch `frozen`
   * so nothing — not pagehide, not a debounce already in flight — can write
   * again before the reload lands.
   */
  function replaceSave(obj) {
    clearTimeout(saveTimer);
    saveTimer = null;
    data = deepMerge(DEFAULT(), obj);
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { return { ok: false, error: "Could not write the save file." }; }
    frozen = true;
    return { ok: true };
  }

  function importSave(json) {
    let parsed;
    try { parsed = JSON.parse(json); }
    catch (e) { return { ok: false, error: "Couldn't read that file — is it valid JSON?" }; }
    if (!parsed || typeof parsed !== "object" || typeof parsed.xp !== "number") {
      return { ok: false, error: "That doesn't look like a MathQuest save file." };
    }
    return replaceSave(parsed);
  }

  const isFrozen = () => frozen;

  function reset() {
    data = DEFAULT();
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    emit();
  }

  return {
    load, save, flush, onChange, emit,
    get data() { return data; },
    xpNeeded, levelTitle, addXP, addCoins, spendCoins, MAX_LEVEL,
    difficulty, xpMultiplier, canPrestige, doPrestige, masteryTier,
    weekly, weeklyQuests, claimQuest, weekKey, QUEST_POOL,
    touchStreak, streakBonus,
    recordAnswer, noteStreak, bump, markMode, recordScore,
    toggleBookmark, isBookmarked,
    mastery, overallAccuracy,
    usePowerup, grantPowerup, ownsTheme, ownsAvatar,
    cardState, reviewCard, dueCards, cardXpEligible, markCardXp,
    checkAchievements, achievementStats,
    daily, dailySpec, progressDaily, claimDaily,
    exportSave, importSave, replaceSave, isFrozen, reset
  };
})();
