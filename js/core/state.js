/* Persistent player state: XP, levels, coins, streaks, inventory, SRS and stats.
   Everything is stored in one localStorage key and saved on a short debounce. */
window.CHEM = window.CHEM || {};

CHEM.State = (function () {
  const KEY = "molequest.save.v1";
  const U = CHEM.U;

  const DEFAULT = () => ({
    v: 1,
    createdAt: Date.now(),
    profile: { name: "Chemist", avatar: "🧑‍🔬", theme: "lab" },
    xp: 0, level: 1, xpIntoLevel: 0, coins: 150,
    streak: { count: 0, lastDay: null, longest: 0 },
    stats: {
      answered: 0, correct: 0, bestStreak: 0, perfectRuns: 0,
      equationsBalanced: 0, ionsMatched: 0, titrations: 0, perfectTitrations: 0,
      pathways: 0, namingCorrect: 0, calcsCorrect: 0,
      bossWins: 0, flawlessBoss: 0, clutchWins: 0, perfectPrecipitation: 0,
      mistakesFixed: 0, peakCoins: 150, nightOwl: false, earlyBird: false,
      timePlayed: 0
    },
    modules: {},
    modesPlayed: {},
    pathwaysSolved: {},
    bossesBeaten: {},
    inventory: { fifty: 1, skip: 1, freeze: 0, shield: 0, double: 0 },
    owned: { themes: ["lab"], avatars: ["🧑‍🔬", "⚗️"] },
    srs: {},
    mistakes: [],
    achievements: {},
    history: {},
    scores: {},
    settings: { sound: true, motion: true, hardMode: false },
    daily: { day: null, progress: 0, claimed: false, spec: null }
  });

  let data = DEFAULT();
  const listeners = new Set();
  let saveTimer = null;

  /* ── persistence ─────────────────────────────────────────── */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        data = deepMerge(DEFAULT(), parsed);
      }
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
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { console.warn("Could not save progress.", e); }
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(write, 200);
  }

  /** Write immediately, cancelling any pending debounce.
      Mobile browsers can kill a backgrounded tab without warning, so the app
      calls this on visibilitychange/pagehide — otherwise the last few seconds
      of progress are lost whenever someone switches apps mid-question. */
  function flush() {
    clearTimeout(saveTimer);
    saveTimer = null;
    write();
  }

  function emit() { listeners.forEach(fn => fn(data)); save(); }
  function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  /* ── levelling ───────────────────────────────────────────── */
  const xpNeeded = level => Math.round(100 * Math.pow(1.18, level - 1));

  function levelTitle(level) {
    const t = CHEM.DATA.levelTitles;
    return t[Math.min(level - 1, t.length - 1)];
  }

  /** Award XP. Returns { levelsGained, newLevel }. */
  function addXP(amount) {
    if (!amount || amount <= 0) return { levelsGained: 0, newLevel: data.level };
    data.xp += amount;
    data.xpIntoLevel += amount;
    const today = U.dayKey();
    data.history[today] = (data.history[today] || 0) + amount;

    let gained = 0;
    while (data.xpIntoLevel >= xpNeeded(data.level)) {
      data.xpIntoLevel -= xpNeeded(data.level);
      data.level++;
      gained++;
      // Levelling up pays out — 25 Moles per level reached.
      addCoins(25 * data.level, true);
    }
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

  /** Bonus for showing up: grows with streak length, capped so it stays sane. */
  const streakBonus = () => Math.min(10 + data.streak.count * 5, 100);

  /* ── answer recording ────────────────────────────────────── */
  function recordAnswer(mod, isCorrect, questionId) {
    data.stats.answered++;
    if (isCorrect) data.stats.correct++;

    if (mod) {
      const m = data.modules[mod] || (data.modules[mod] = { seen: 0, correct: 0 });
      m.seen++;
      if (isCorrect) m.correct++;
    }

    if (questionId) {
      const idx = data.mistakes.findIndex(x => x.id === questionId);
      if (isCorrect) {
        if (idx >= 0) {
          data.mistakes.splice(idx, 1);
          data.stats.mistakesFixed++;
        }
      } else if (idx >= 0) {
        data.mistakes[idx].misses++;
        data.mistakes[idx].ts = Date.now();
      } else {
        data.mistakes.unshift({ id: questionId, mod: mod, misses: 1, ts: Date.now() });
        if (data.mistakes.length > 120) data.mistakes.pop();
      }
    }
    save();
  }

  function noteStreak(n) {
    if (n > data.stats.bestStreak) { data.stats.bestStreak = n; save(); }
  }

  function bump(statKey, by) {
    data.stats[statKey] = (data.stats[statKey] || 0) + (by === undefined ? 1 : by);
    save();
  }

  function markMode(modeId) {
    if (!data.modesPlayed[modeId]) {
      data.modesPlayed[modeId] = 0;
    }
    data.modesPlayed[modeId]++;
    save();
  }

  function recordScore(modeId, score) {
    const prev = data.scores[modeId];
    const isBest = prev === undefined || score > prev;
    if (isBest) { data.scores[modeId] = score; save(); }
    return isBest;
  }

  /* ── module mastery ──────────────────────────────────────── */
  function mastery(mod) {
    const m = data.modules[mod];
    if (!m || !m.seen) return 0;
    // Confidence-weighted: a 100% run over 3 questions shouldn't read as mastered.
    const raw = m.correct / m.seen;
    const confidence = Math.min(1, m.seen / 25);
    return Math.round(raw * confidence * 100);
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

  function ownsTheme(id)  { return data.owned.themes.includes(id); }
  function ownsAvatar(em) { return data.owned.avatars.includes(em); }

  /* ── spaced repetition (Leitner, 5 boxes) ────────────────── */
  const BOX_DAYS = [0, 1, 2, 4, 8, 16];

  function cardState(id) {
    return data.srs[id] || (data.srs[id] = { box: 1, due: U.dayKey(), reps: 0, lapses: 0 });
  }

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

  function dueCards() {
    const today = U.dayKey();
    return CHEM.DATA.flashcards.filter(card => {
      const c = data.srs[card.id];
      return !c || U.daysBetween(c.due, today) >= 0;
    });
  }

  /* ── achievements ────────────────────────────────────────── */
  function achievementStats() {
    return Object.assign({}, data.stats, {
      level: data.level,
      longestDayStreak: data.streak.longest,
      modules: data.modules,
      modesPlayed: data.modesPlayed,
      themesOwned: data.owned.themes.length,
      pathwaysSolvedUnique: Object.keys(data.pathwaysSolved).length,
      bossesBeaten: Object.keys(data.bossesBeaten).length,
      cardsMastered: Object.values(data.srs).filter(x => x.box >= 5).length
    });
  }

  /** Evaluate every achievement; returns any that were newly unlocked. */
  function checkAchievements() {
    const s = achievementStats();
    const unlocked = [];
    for (const a of CHEM.DATA.achievements) {
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

  /* ── daily challenge ─────────────────────────────────────── */
  /** The spec is derived from the date, so everyone sees the same challenge all day. */
  function dailySpec() {
    const day = U.dayKey();
    const seed = U.hash("molequest-" + day);
    const rng = U.seededRandom(seed);
    const modes = ["quiz", "balance", "ionmatch", "naming", "calc", "precipitate", "titration", "pathway"];
    const mode = modes[Math.floor(rng() * modes.length)];
    const targets = { quiz: 12, balance: 6, ionmatch: 1, naming: 10, calc: 8,
                      precipitate: 1, titration: 2, pathway: 3 };
    return { day, mode, target: targets[mode] || 10, reward: 120, xp: 150 };
  }

  function daily() {
    const spec = dailySpec();
    if (data.daily.day !== spec.day) {
      data.daily = { day: spec.day, progress: 0, claimed: false, spec };
      save();
    } else {
      data.daily.spec = spec;
    }
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

  function reset() {
    data = DEFAULT();
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    emit();
  }

  return {
    load, save, flush, onChange, emit,
    get data() { return data; },
    xpNeeded, levelTitle, addXP, addCoins, spendCoins,
    touchStreak, streakBonus,
    recordAnswer, noteStreak, bump, markMode, recordScore,
    mastery, overallAccuracy,
    usePowerup, grantPowerup, ownsTheme, ownsAvatar,
    cardState, reviewCard, dueCards,
    checkAchievements, achievementStats,
    daily, dailySpec, progressDaily, claimDaily,
    reset
  };
})();
