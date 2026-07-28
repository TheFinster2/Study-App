/* Question bank: aggregation, filtering and adaptive draw. */
window.CHEM = window.CHEM || {};

CHEM.Bank = (function () {
  const U = CHEM.U;
  let ALL = null;
  let INDEX = null;

  /* Every CHEM.DATA key named like a question bank (qM1A, qY11, qExtra…) is picked up
     automatically. Discovered rather than listed: the bank is spread over dozens of files
     and an explicit list is one forgotten line away from silently dropping a few hundred
     questions. The content validator uses the same rule. */
  function all() {
    if (!ALL) {
      const D = CHEM.DATA;
      ALL = Object.keys(D)
        .filter(k => /^q[A-Z0-9]/.test(k) && Array.isArray(D[k]) && D[k].length && D[k][0].choices)
        .sort()
        .reduce((acc, k) => acc.concat(D[k]), []);
      INDEX = new Map(ALL.map(q => [q.id, q]));
    }
    return ALL;
  }

  const byId = id => { all(); return INDEX.get(id); };

  const MODULES = [
    { id: "M1", name: "Properties & Structure of Matter", year: 11, short: "Structure of Matter" },
    { id: "M2", name: "Introduction to Quantitative Chemistry", year: 11, short: "Quantitative Chem" },
    { id: "M3", name: "Reactive Chemistry", year: 11, short: "Reactive Chemistry" },
    { id: "M4", name: "Drivers of Reactions", year: 11, short: "Drivers of Reactions" },
    { id: "M5", name: "Equilibrium & Acid Reactions", year: 12, short: "Equilibrium" },
    { id: "M6", name: "Acid/Base Reactions", year: 12, short: "Acids & Bases" },
    { id: "M7", name: "Organic Chemistry", year: 12, short: "Organic" },
    { id: "M8", name: "Applying Chemical Ideas", year: 12, short: "Analysis & Monitoring" }
  ];

  const moduleName = id => (MODULES.find(m => m.id === id) || {}).short || id;

  function filter(opts) {
    const o = opts || {};
    let pool = all();
    if (o.mods && o.mods.length) pool = pool.filter(q => o.mods.includes(q.mod));
    if (o.maxDiff) pool = pool.filter(q => q.diff <= o.maxDiff);
    if (o.minDiff) pool = pool.filter(q => q.diff >= o.minDiff);
    if (o.topic) pool = pool.filter(q => q.topic === o.topic);
    return pool;
  }

  /** Weight a question for the adaptive draw: mistakes first, weak modules next. */
  function weightFor(q, mistakeIds, moduleAcc) {
    let w = 1;
    if (mistakeIds.has(q.id)) w += 3.5;
    const acc = moduleAcc[q.mod];
    if (acc !== undefined && acc < 0.7) w += (0.7 - acc) * 4;
    return w;
  }

  /**
   * Draw n questions.
   * opts: { mods, maxDiff, minDiff, adaptive (default true), shuffleChoices (default true) }
   * Returns question objects with `choices` already shuffled and `a` remapped.
   */
  function draw(n, opts) {
    const o = opts || {};
    let pool = filter(o);
    if (!pool.length) pool = all();

    let chosen;
    if (o.adaptive === false) {
      chosen = U.sample(pool, n);
    } else {
      const st = CHEM.State.data;
      const mistakeIds = new Set((st.mistakes || []).map(m => m.id));
      const moduleAcc = {};
      for (const [k, v] of Object.entries(st.modules || {})) {
        if (v.seen >= 4) moduleAcc[k] = v.correct / v.seen;
      }
      // Weighted sampling without replacement.
      const bag = pool.map(q => ({ q, w: weightFor(q, mistakeIds, moduleAcc) * (0.5 + Math.random()) }));
      bag.sort((a, b) => b.w - a.w);
      chosen = bag.slice(0, n).map(x => x.q);
      chosen = U.shuffle(chosen);
    }

    return chosen.map(q => o.shuffleChoices === false ? clone(q) : shuffleChoices(q));
  }

  function clone(q) { return Object.assign({}, q, { choices: q.choices.slice() }); }

  /** Shuffle the options so the answer isn't always in the same slot. */
  function shuffleChoices(q) {
    const pairs = q.choices.map((text, i) => ({ text, correct: i === q.a }));
    const mixed = U.shuffle(pairs);
    return Object.assign({}, q, {
      choices: mixed.map(p => p.text),
      a: mixed.findIndex(p => p.correct)
    });
  }

  /** Questions the player has previously got wrong, most recent first. */
  function mistakeQuestions() {
    const st = CHEM.State.data;
    return (st.mistakes || []).map(m => byId(m.id)).filter(Boolean).map(shuffleChoices);
  }

  function statsByModule() {
    const st = CHEM.State.data;
    return MODULES.map(m => {
      const rec = st.modules[m.id] || { seen: 0, correct: 0 };
      const total = all().filter(q => q.mod === m.id).length;
      return {
        id: m.id, name: m.name, short: m.short, year: m.year,
        seen: rec.seen, correct: rec.correct, total,
        mastery: CHEM.State.mastery(m.id),
        accuracy: U.pct(rec.correct, rec.seen)
      };
    });
  }

  return { all, byId, MODULES, moduleName, filter, draw, shuffleChoices, mistakeQuestions, statsByModule };
})();
