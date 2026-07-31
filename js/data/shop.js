/* Shop catalogue: themes, avatars, power-ups and crates.
   Plus the 60 level titles, the difficulty modes and the mastery tiers. */
window.MQ = window.MQ || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.shop = {
  themes: [
    { id:"graph",      name:"Graph Paper",   cost:0,    desc:"Teal and violet on midnight. The default grid.",
      dots:["#39d6c8","#7c5cff","#0a0f1c"] },
    { id:"complex",    name:"Complex Plane", cost:600,  desc:"Cyan on deep blue — easy on the eyes at 1 a.m.",
      dots:["#28e0ff","#0f7aa8","#04141a"] },
    { id:"golden",     name:"Golden Ratio",  cost:900,  desc:"Warm amber in a pleasing proportion.",
      dots:["#ffc861","#ff7a3d","#150e05"] },
    { id:"chalk",      name:"Chalkboard",    cost:900,  desc:"Pale chalk on board green. Old school.",
      dots:["#a8f0c8","#e8f5b8","#08160f"] },
    { id:"euler",      name:"Euler",         cost:1400, desc:"Red hot. e to the i pi, and all that follows.",
      dots:["#ff4d3d","#ffb03a","#170406"] },
    { id:"paper",      name:"Squared Paper", cost:1400, desc:"A bright, high-contrast light mode.",
      dots:["#1d5fc4","#6d5cff","#f4f7fb"] },
    { id:"imaginary",  name:"Imaginary",     cost:2200, desc:"Magenta and cyan. Strictly off the real line.",
      dots:["#ff3df0","#28e0ff","#12021c"], minLevel:15 },
    { id:"montecarlo", name:"Monte Carlo",   cost:2800, desc:"Green over violet. Converges eventually.",
      dots:["#7dffb0","#a86bff","#050818"], minLevel:22 },
    { id:"manifold",   name:"Manifold",      cost:3600, desc:"Monochrome. For people who find colour distracting.",
      dots:["#d8dee9","#8892a4","#050506"], minLevel:30 },
    { id:"radian",     name:"Radian",        cost:5000, desc:"Luminous lime on black. 57.3 degrees of attitude.",
      dots:["#b6ff2e","#6fdc00","#060a02"], minLevel:40 }
  ],

  avatars: [
    { emoji:"🧮", name:"Abacus",          cost:0 },
    { emoji:"📐", name:"Set Square",      cost:0 },
    { emoji:"📏", name:"Straight Edge",   cost:300 },
    { emoji:"✏️", name:"Working Shown",   cost:300 },
    { emoji:"📊", name:"Bar Chart",       cost:450 },
    { emoji:"📈", name:"Upward Trend",    cost:450 },
    { emoji:"🎲", name:"Fair Die",        cost:600 },
    { emoji:"🧊", name:"Unit Cube",       cost:600 },
    { emoji:"🔺", name:"Special Triangle",cost:750 },
    { emoji:"⭕", name:"Unit Circle",     cost:750 },
    { emoji:"🌀", name:"Spiral",          cost:900,  minLevel:8 },
    { emoji:"♾️", name:"Limiting Sum",    cost:1100, minLevel:10 },
    { emoji:"🧿", name:"Locus",           cost:1400, minLevel:12 },
    { emoji:"🎯", name:"Stationary Point",cost:1400, minLevel:14 },
    { emoji:"🌈", name:"Continuous",      cost:1800, minLevel:16 },
    { emoji:"🐐", name:"GOAT",            cost:2400, minLevel:18, note:"Greatest of all theorems." },
    { emoji:"👑", name:"Fields Medallist",cost:3200, minLevel:24 },
    { emoji:"🧠", name:"Second Derivative",cost:4000, minLevel:30 },
    { emoji:"🦾", name:"Autodifferentiator",cost:5200, minLevel:36 },
    { emoji:"🛸", name:"Non-Euclidean",   cost:6800, minLevel:42 },
    { emoji:"🌌", name:"Aleph Null",      cost:9000, minLevel:50 },
    { emoji:"🔱", name:"Ascendant",       cost:12000,minLevel:60, note:"Level 60. The end of the road." }
  ],

  powerups: [
    { id:"fifty",  icon:"✂️", name:"50/50",       cost:140,
      desc:"Removes two wrong options in a multiple-choice round." },
    { id:"skip",   icon:"⏭️", name:"Skip",        cost:110,
      desc:"Skip a question with no penalty to your streak." },
    { id:"freeze", icon:"🧊", name:"Time Freeze", cost:190,
      desc:"Adds 20 seconds to the clock in any timed mode." },
    { id:"shield", icon:"🛡️", name:"Buffer",      cost:260,
      desc:"Absorbs one wrong answer — your streak survives." },
    { id:"double", icon:"✨", name:"Boost",       cost:400,
      desc:"Doubles all XP earned for one complete run." },
    { id:"insight",icon:"🔍", name:"Insight",     cost:320,
      desc:"Reveals a hint for the current question without breaking your streak." },
    { id:"revive", icon:"💉", name:"Adrenaline",  cost:750,
      desc:"Restores 40% health when you fall in a boss fight. Consumed automatically." }
  ],

  crates: [
    { id:"crate_s", name:"Scrap Paper",   cost:600, icon:"📦",
      desc:"1-2 power-ups and a handful of Primes." },
    { id:"crate_l", name:"Supply Crate",  cost:1500, icon:"🎁",
      desc:"3-5 power-ups, a bigger payout, and a chance of a bonus avatar." },
    { id:"crate_x", name:"Reference Sheet",cost:4000, icon:"🗄️",
      desc:"6-9 power-ups, a large payout, and a good chance at a locked avatar.",
      minLevel:20 }
  ]
};

/* Level titles — indexed by level, capped at the last entry. 60 levels.
   The tone is dry and mathematical rather than generic gamification: the
   user asked for "enjoyable" first and "study app" second. */
MQ.DATA.levelTitles = [
  "Number Line Walker",        //  1
  "Bracket Expander",          //  2
  "Sign Error Survivor",       //  3
  "Index Law Apprentice",      //  4
  "Factoriser",                //  5
  "Root Finder",               //  6
  "Graph Sketcher",            //  7
  "Domain Defender",           //  8
  "Transformation Wrangler",   //  9
  "Junior Analyst",            // 10
  "Radian Convert",            // 11
  "Unit Circle Regular",       // 12
  "Identity Prover",           // 13
  "Limit Approacher",          // 14
  "First Principles Purist",   // 15
  "Chain Rule Operator",       // 16
  "Quotient Rule Survivor",    // 17
  "Tangent Liner",             // 18
  "Stationary Point Spotter",  // 19
  "Band 5 Candidate",          // 20
  "Concavity Consultant",      // 21
  "Inflexion Inspector",       // 22
  "Optimiser",                 // 23
  "Antiderivative Adept",      // 24
  "Definite Integrator",       // 25
  "Area Accountant",           // 26
  "Trapezoidal Approximator",  // 27
  "Logarithm Linguist",        // 28
  "Exponential Modeller",      // 29
  "Band 6 Candidate",          // 30
  "Series Summoner",           // 31
  "Annuity Architect",         // 32
  "Amortisation Analyst",      // 33
  "Probability Broker",        // 34
  "Expected Value Realist",    // 35
  "Variance Auditor",          // 36
  "Regression Reader",         // 37
  "z-Score Standardiser",      // 38
  "Distribution Whisperer",    // 39
  "Master of the Mean",        // 40
  "Auxiliary Angler",          // 41
  "Substitution Specialist",   // 42
  "Volume of Revolution",      // 43
  "Direction Field Navigator", // 44
  "Combinatorial Counter",     // 45
  "Binomial Expander",         // 46
  "Pascal's Correspondent",    // 47
  "Inductive Reasoner",        // 48
  "Vector Cartographer",       // 49
  "Distinguished Mathematician",// 50
  "Projectile Plotter",        // 51
  "Asymptote Chaser",          // 52
  "Locus Sovereign",           // 53
  "Grandmaster of Proof",      // 54
  "Analytic Continuation",     // 55
  "Fields Hopeful",            // 56
  "Fields Medallist",          // 57
  "Elemental Theorem",         // 58
  "Euler's Equal",             // 59
  "MathQuest Legend"           // 60+
];

/* Difficulty modes. `xp` multiplies all XP earned; the rest are per game.
   This is SEPARATE from the MA/ME tier toggle — harder scoring, not more
   syllabus. Do not conflate the two. */
MQ.DATA.difficulties = [
  { id:"standard", name:"Standard", icon:"📘", xp:1.0, timeScale:1.0, damage:1.0,
    desc:"The default balance. Full timers, normal boss damage." },
  { id:"hard", name:"Hard", icon:"🔥", xp:1.45, timeScale:0.75, damage:1.4,
    desc:"25% less time on every clock, bosses hit 40% harder — but 45% more XP." },
  { id:"nightmare", name:"Nightmare", icon:"☠️", xp:2.1, timeScale:0.55, damage:1.9,
    desc:"Barely any time, brutal bosses, no 50/50 or Skip. Double XP for the reckless." }
];

/* Topic mastery tiers, checked against State.mastery(). */
MQ.DATA.masteryTiers = [
  { at:0,  name:"Unranked", icon:"▪️", colour:"var(--ink-faint)" },
  { at:25, name:"Bronze",   icon:"🥉", colour:"#cd7f32" },
  { at:45, name:"Silver",   icon:"🥈", colour:"#c0c0c0" },
  { at:65, name:"Gold",     icon:"🥇", colour:"#ffd24a" },
  { at:80, name:"Platinum", icon:"💠", colour:"#7fe3ff" },
  { at:92, name:"Diamond",  icon:"💎", colour:"#b388ff" }
];
