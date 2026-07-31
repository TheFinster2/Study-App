/* Question bank: aggregation, TIER FILTERING and the adaptive draw.

   Bank.all() is where MQ.DATA.TIERS is enforced. Nothing else in the app
   needs to know which tier is enabled — filter once, here. */
window.MQ = window.MQ || {};

MQ.Bank = (function () {
  const U = MQ.U;
  let ALL = null;
  let INDEX = null;

  /** Every question bank registers itself here, so adding a file is one line. */
  const SOURCES = [];
  function register(arr) { SOURCES.push(arr); ALL = null; }

  function all() {
    if (!ALL) {
      const merged = [].concat.apply([], SOURCES.filter(Boolean));
      // The single point where the Advanced / Extension 1 toggle takes effect.
      ALL = merged.filter(q => MQ.DATA.tierEnabled(q.topic));
      INDEX = new Map(ALL.map(q => [q.id, q]));
    }
    return ALL;
  }

  const byId = id => { all(); return INDEX.get(id); };

  /* Topic codes follow NESA. `group` collects codes into the five boss
     domains and the Topic Drill headings. */
  const TOPICS = [
    { id:"MA-F1",   name:"Working with Functions",              short:"Functions",        group:"Functions",  tier:"MA" },
    { id:"MA-T1",   name:"Trigonometry & Measure of Angles",    short:"Trig & Radians",   group:"Trig",       tier:"MA" },
    { id:"MA-T2",   name:"Trigonometric Functions & Identities",short:"Trig Functions",   group:"Trig",       tier:"MA" },
    { id:"MA-C1",   name:"Introduction to Differentiation",     short:"Intro Calculus",   group:"Calculus",   tier:"MA" },
    { id:"MA-C2",   name:"Differential Calculus",               short:"Differentiation",  group:"Calculus",   tier:"MA" },
    { id:"MA-C3",   name:"Applications of Differentiation",     short:"Curve Sketching",  group:"Calculus",   tier:"MA" },
    { id:"MA-C4",   name:"Integral Calculus",                   short:"Integration",      group:"Integration",tier:"MA" },
    { id:"MA-E1",   name:"Logarithms and Exponentials",         short:"Logs & Exponentials", group:"Functions", tier:"MA" },
    { id:"MA-M1",   name:"Modelling Financial Situations",      short:"Financial Maths",  group:"Financial",  tier:"MA" },
    { id:"MA-S1",   name:"Probability & Discrete Random Variables", short:"Probability",  group:"Statistics", tier:"MA" },
    { id:"MA-S2",   name:"Descriptive Statistics & Bivariate Data", short:"Statistics",   group:"Statistics", tier:"MA" },
    { id:"MA-S3",   name:"Random Variables",                    short:"Normal Distribution", group:"Statistics", tier:"MA" },

    { id:"ME-F1",   name:"Further Work with Functions",         short:"Further Functions",group:"Functions",  tier:"ME" },
    { id:"ME-F2",   name:"Polynomials",                         short:"Polynomials",      group:"Functions",  tier:"ME" },
    { id:"ME-T1",   name:"Inverse Trigonometric Functions",     short:"Inverse Trig",     group:"Trig",       tier:"ME" },
    { id:"ME-T2",   name:"Further Trigonometric Identities",    short:"Further Identities",group:"Trig",      tier:"ME" },
    { id:"ME-T3",   name:"Trigonometric Equations",             short:"Trig Equations",   group:"Trig",       tier:"ME" },
    { id:"ME-A1",   name:"Working with Combinatorics",          short:"Combinatorics",    group:"Statistics", tier:"ME" },
    { id:"ME-C1",   name:"Rates of Change",                     short:"Rates of Change",  group:"Calculus",   tier:"ME" },
    { id:"ME-C2",   name:"Further Calculus Skills",             short:"Further Calculus", group:"Integration",tier:"ME" },
    { id:"ME-C3",   name:"Applications of Calculus",            short:"Volumes & DEs",    group:"Integration",tier:"ME" },
    { id:"ME-P1",   name:"Proof by Mathematical Induction",     short:"Induction",        group:"Proof",      tier:"ME" },
    { id:"ME-V1",   name:"Vectors",                             short:"Vectors",          group:"Vectors",    tier:"ME" },
    { id:"ME-S1",   name:"The Binomial Distribution",           short:"Binomial",         group:"Statistics", tier:"ME" }
  ];

  /** Only the topics this build ships. */
  const topics = () => TOPICS.filter(t => MQ.DATA.TIERS.indexOf(t.tier) >= 0);

  const topicName = id => (TOPICS.find(t => t.id === id) || {}).short || id;
  const topicFull = id => (TOPICS.find(t => t.id === id) || {}).name || id;
  const topicMeta = id => TOPICS.find(t => t.id === id) || { id, short: id, name: id, group: "", tier: "MA" };

  /** Topic codes belonging to a boss / drill group, tier-filtered. */
  const groupTopics = group => topics().filter(t => t.group === group).map(t => t.id);

  function filter(opts) {
    const o = opts || {};
    let pool = all();
    if (o.topics && o.topics.length) pool = pool.filter(q => o.topics.includes(q.topic));
    if (o.group) pool = pool.filter(q => topicMeta(q.topic).group === o.group);
    if (o.tier) pool = pool.filter(q => MQ.DATA.tierOf(q.topic) === o.tier);
    if (o.maxDiff) pool = pool.filter(q => q.diff <= o.maxDiff);
    if (o.minDiff) pool = pool.filter(q => q.diff >= o.minDiff);
    if (o.exclude) pool = pool.filter(q => !o.exclude.has(q.id));
    return pool;
  }

  /** Weight for the adaptive draw: mistakes first, weak topics next. */
  function weightFor(q, mistakeIds, topicAcc) {
    let w = 1;
    if (mistakeIds.has(q.id)) w += 3.5;
    const acc = topicAcc[q.topic];
    if (acc !== undefined && acc < 0.7) w += (0.7 - acc) * 4;
    return w;
  }

  /**
   * Draw n questions with options already shuffled and `a` remapped.
   * opts: { topics, group, tier, maxDiff, minDiff, adaptive (default true), shuffleChoices }
   */
  function draw(n, opts) {
    const o = opts || {};
    let pool = filter(o);
    if (!pool.length) pool = all();

    let chosen;
    if (o.adaptive === false) {
      chosen = U.sample(pool, n);
    } else {
      const st = MQ.State.data;
      const mistakeIds = new Set((st.mistakes || []).map(m => m.id));
      const topicAcc = {};
      for (const [k, v] of Object.entries(st.topics || {})) {
        if (v.seen >= 4) topicAcc[k] = v.correct / v.seen;
      }
      const bag = pool.map(q => ({ q, w: weightFor(q, mistakeIds, topicAcc) * (0.5 + Math.random()) }));
      bag.sort((a, b) => b.w - a.w);
      chosen = U.shuffle(bag.slice(0, n).map(x => x.q));
    }

    return chosen.map(q => (o.shuffleChoices === false ? clone(q) : shuffleChoices(q)));
  }

  function clone(q) { return Object.assign({}, q, { choices: q.choices.slice() }); }

  /** Shuffle the options so the key isn't always in the same slot. */
  function shuffleChoices(q) {
    const pairs = q.choices.map((text, i) => ({ text, correct: i === q.a }));
    const mixed = U.shuffle(pairs);
    return Object.assign({}, q, {
      choices: mixed.map(p => p.text),
      a: mixed.findIndex(p => p.correct)
    });
  }

  /** Questions previously got wrong, most recent first. */
  function mistakeQuestions() {
    return (MQ.State.data.mistakes || []).map(m => byId(m.id)).filter(Boolean).map(shuffleChoices);
  }

  function bookmarkedQuestions() {
    return (MQ.State.data.bookmarks || []).map(byId).filter(Boolean).map(shuffleChoices);
  }

  function statsByTopic() {
    const st = MQ.State.data;
    return topics().map(t => {
      const rec = st.topics[t.id] || { seen: 0, correct: 0 };
      return Object.assign({}, t, {
        seen: rec.seen, correct: rec.correct,
        total: all().filter(q => q.topic === t.id).length,
        mastery: MQ.State.mastery(t.id),
        accuracy: U.pct(rec.correct, rec.seen)
      });
    });
  }

  /** The weakest topic the player has actually attempted — powers "Drill my weak spot". */
  function weakestTopic() {
    const seen = statsByTopic().filter(t => t.seen >= 5);
    if (!seen.length) return null;
    return seen.sort((a, b) => a.mastery - b.mastery)[0];
  }

  return { register, all, byId, TOPICS, topics, topicName, topicFull, topicMeta, groupTopics,
           filter, draw, shuffleChoices, mistakeQuestions, bookmarkedQuestions,
           statsByTopic, weakestTopic };
})();
