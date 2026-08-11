/* Shop catalogue: lab skins, avatars and consumable power-ups. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.shop = {
  themes: [
    { id:"lab",         name:"Standard Lab",   cost:0,    desc:"Teal and violet. The default bench.",
      dots:["#39d6c8","#7c5cff","#0a0f1c"] },
    { id:"abyss",       name:"Deep Solution",  cost:600,  desc:"Cyan on midnight blue — easy on the eyes at 1 a.m.",
      dots:["#28e0ff","#0f7aa8","#04141a"] },
    { id:"noble",       name:"Noble Gold",     cost:900,  desc:"Warm amber, inert and unbothered.",
      dots:["#ffc861","#ff7a3d","#150e05"] },
    { id:"chlorophyll", name:"Chlorophyll",    cost:900,  desc:"Photosynthesis green. Very organic.",
      dots:["#5ef08a","#b8f03a","#061407"] },
    { id:"magma",       name:"Exothermic",     cost:1400, desc:"Red hot. ΔH is extremely negative.",
      dots:["#ff4d3d","#ffb03a","#170406"] },
    { id:"acid",        name:"Litmus Light",   cost:1400, desc:"A bright, high-contrast light mode.",
      dots:["#e2306b","#6d5cff","#f4f7fb"] },
    { id:"plasma",      name:"Plasma Arc",     cost:2200, desc:"Magenta and cyan. Fourth state of matter.",
      dots:["#ff3df0","#28e0ff","#12021c"], minLevel:15 },
    { id:"aurora",      name:"Aurora",         cost:2800, desc:"Emission spectrum green over deep violet.",
      dots:["#7dffb0","#a86bff","#050818"], minLevel:22 },
    { id:"obsidian",    name:"Obsidian",       cost:3600, desc:"Monochrome. For people who find colour distracting.",
      dots:["#d8dee9","#8892a4","#050506"], minLevel:30 },
    { id:"radium",      name:"Radium Glow",    cost:5000, desc:"Luminous green on black. Handle with care.",
      dots:["#b6ff2e","#6fdc00","#060a02"], minLevel:40 },
    { id:"cryo",        name:"Cryo Condensate",cost:3200, desc:"Pale blue on deep frost. Enthalpy of fusion, made aesthetic.",
      dots:["#8fe3ff","#c7f5ff","#05141c"], minLevel:34 },
    { id:"quantum",     name:"Quantum Foam",   cost:4600, desc:"Indigo static that shouldn't exist and definitely won't sit still.",
      dots:["#7a5cff","#c9a8ff","#07040f"], minLevel:46 },
    { id:"supernova",   name:"Supernova",      cost:6400, desc:"Every colour there is, briefly, right before it all goes dark.",
      dots:["#ffdf6b","#ff5e3a","#0a0203"], minLevel:55 }
  ],

  avatars: [
    { emoji:"🧑‍🔬", name:"Lab Coat",       cost:0 },
    { emoji:"⚗️",  name:"Retort",         cost:0 },
    { emoji:"🧪",  name:"Test Tube",      cost:300 },
    { emoji:"🔬",  name:"Microscope",     cost:300 },
    { emoji:"💧",  name:"Droplet",        cost:450 },
    { emoji:"🔥",  name:"Bunsen",         cost:450 },
    { emoji:"🧯",  name:"Fire Extinguisher",cost:550 },
    { emoji:"❄️",  name:"Endotherm",      cost:600 },
    { emoji:"🧫",  name:"Petri Dish",     cost:600 },
    { emoji:"🥽",  name:"Safety Goggles", cost:750 },
    { emoji:"🌡️",  name:"Thermometer",    cost:750 },
    { emoji:"🦠",  name:"Culture",        cost:750 },
    { emoji:"🧲",  name:"Magnet",         cost:900,  minLevel:8 },
    { emoji:"☢️",  name:"Radioactive",    cost:1100, minLevel:10 },
    { emoji:"💎",  name:"Crystal Lattice",cost:1400, minLevel:12 },
    { emoji:"🎈",  name:"Ideal Gas",      cost:1400, minLevel:14 },
    { emoji:"🌈",  name:"Emission Line",  cost:1800, minLevel:16 },
    { emoji:"🐐",  name:"GOAT",           cost:2400, minLevel:18, note:"Reserved for the truly unhinged." },
    { emoji:"🌋",  name:"Volcanic",       cost:2800, minLevel:20 },
    { emoji:"👑",  name:"Nobel Laureate", cost:3200, minLevel:24 },
    { emoji:"🦉",  name:"Wise Owl",       cost:3600, minLevel:27, note:"Knows the answer. Won't tell you." },
    { emoji:"🧠",  name:"Big Brain",      cost:4000, minLevel:30 },
    { emoji:"🎇",  name:"Chemiluminescence",cost:4600, minLevel:33 },
    { emoji:"🦾",  name:"Autotitrator",   cost:5200, minLevel:36 },
    { emoji:"🛸",  name:"Noble Gas",      cost:6800, minLevel:42 },
    { emoji:"🌌",  name:"Stellar Fusion", cost:9000, minLevel:50 },
    { emoji:"🔱",  name:"Ascendant",      cost:12000, minLevel:60, note:"Level 60. The end of the road." }
  ],

  powerups: [
    { id:"fifty",  icon:"✂️", name:"50/50",      cost:140,
      desc:"Removes two wrong options in a multiple-choice round." },
    { id:"skip",   icon:"⏭️", name:"Skip",       cost:110,
      desc:"Skip a question with no penalty to your streak." },
    { id:"freeze", icon:"🧊", name:"Time Freeze",cost:190,
      desc:"Adds 20 seconds to the clock in any timed mode." },
    { id:"shield", icon:"🛡️", name:"Buffer",     cost:260,
      desc:"Absorbs one wrong answer — your streak survives." },
    { id:"double", icon:"✨", name:"Catalyst",   cost:400,
      desc:"Doubles all XP earned for one complete run." },
    { id:"insight",icon:"🔍", name:"Insight",    cost:320,
      desc:"Reveals a hint for the current question without breaking your streak." },
    { id:"revive", icon:"💉", name:"Adrenaline", cost:750,
      desc:"Restores 40% health when you fall in a boss fight. Consumed automatically." },
    { id:"vitality",icon:"❤️", name:"Vitality",  cost:340,
      desc:"Instantly grants one extra life in any lives-based round." },
    { id:"windfall",icon:"🪙", name:"Windfall",   cost:220,
      desc:"Instantly cashes in a burst of bonus Moles." }
  ],

  crates: [
    { id:"crate_s", name:"Reagent Pouch", cost:600, icon:"📦",
      desc:"A small pouch. Contains 1–2 power-ups and a handful of Moles." },
    { id:"crate_l", name:"Supply Crate",  cost:1500, icon:"🎁",
      desc:"3–5 power-ups, a bigger payout, and a chance of a bonus avatar." },
    { id:"crate_m", name:"Isotope Cache", cost:2500, icon:"🧬",
      desc:"4–6 power-ups and a solid payout — the middle ground.", minLevel:12 },
    { id:"crate_x", name:"Fume Cupboard", cost:4000, icon:"🗄️",
      desc:"6–9 power-ups, a large payout, and a good chance at a locked avatar.",
      minLevel:20 }
  ]
};

/* Level titles — index by level, capped at the last entry. 60 levels. */
CHEM.DATA.levelTitles = [
  "Lab Rat",                    //  1
  "Bench Hand",                 //  2
  "Glassware Washer",           //  3
  "Pipette Novice",             //  4
  "Bunsen Lighter",             //  5
  "Mole Counter",               //  6
  "Titration Trainee",          //  7
  "Buffer Buff",                //  8
  "Precipitate Spotter",        //  9
  "Junior Analyst",             // 10
  "Equilibrium Seeker",         // 11
  "Le Chatelier's Apprentice",  // 12
  "Organic Initiate",           // 13
  "Isomer Wrangler",            // 14
  "Spectrum Reader",            // 15
  "Reflux Regular",             // 16
  "Standard Solution Maker",    // 17
  "Reaction Engineer",          // 18
  "Kinetics Tracker",           // 19
  "Band 5 Candidate",           // 20
  "Enthalpy Accountant",        // 21
  "Entropy Enthusiast",         // 22
  "Gibbs Free Agent",           // 23
  "Catalyst Curator",           // 24
  "Ka Calculator",              // 25
  "Amphiprotic Adept",          // 26
  "Conjugate Strategist",       // 27
  "Polymer Weaver",             // 28
  "Ester Perfumer",             // 29
  "Band 6 Candidate",           // 30
  "Chromatographer",            // 31
  "Mass Spec Interpreter",      // 32
  "NMR Whisperer",              // 33
  "Infrared Oracle",            // 34
  "Trace Metal Hunter",         // 35
  "Gravimetric Purist",         // 36
  "Ksp Sentinel",               // 37
  "Redox Duelist",              // 38
  "Galvanic Architect",         // 39
  "Master of Moles",            // 40
  "Molecular Cartographer",     // 41
  "Synthesis Planner",          // 42
  "Retrosynthetic Thinker",     // 43
  "Yield Optimiser",            // 44
  "Atom Economist",             // 45
  "Haber's Heir",               // 46
  "Contact Process Custodian",  // 47
  "Ostwald Operative",          // 48
  "Nomenclature Sovereign",     // 49
  "Distinguished Chemist",      // 50
  "Bond Theorist",              // 51
  "Orbital Navigator",          // 52
  "Lattice Sovereign",          // 53
  "Grandmaster of Bonds",       // 54
  "Alchemist Supreme",          // 55
  "Nobel Hopeful",              // 56
  "Nobel Laureate",             // 57
  "Elemental Legend",           // 58
  "Avogadro's Equal",           // 59
  "MoleQuest Legend"            // 60+
];

/* Difficulty modes. `xp` multiplies all XP earned; the rest are applied per game. */
CHEM.DATA.difficulties = [
  { id: "standard", name: "Standard", icon: "🧪", xp: 1.0, timeScale: 1.0, damage: 1.0,
    desc: "The default balance. Full timers, normal boss damage." },
  { id: "hard", name: "Hard", icon: "🔥", xp: 1.45, timeScale: 0.75, damage: 1.4,
    desc: "25% less time on every clock, bosses hit 40% harder — but 45% more XP." },
  { id: "nightmare", name: "Nightmare", icon: "☠️", xp: 2.1, timeScale: 0.55, damage: 1.9,
    desc: "Barely any time, brutal bosses, no 50/50 or Skip. Double XP for the reckless." }
];

/* Module mastery tiers, checked against State.mastery(). */
CHEM.DATA.masteryTiers = [
  { at: 0,  name: "Unranked", icon: "▪️", colour: "var(--ink-faint)" },
  { at: 25, name: "Bronze",   icon: "🥉", colour: "#cd7f32" },
  { at: 45, name: "Silver",   icon: "🥈", colour: "#c0c0c0" },
  { at: 65, name: "Gold",     icon: "🥇", colour: "#ffd24a" },
  { at: 80, name: "Platinum", icon: "💠", colour: "#7fe3ff" },
  { at: 92, name: "Diamond",  icon: "💎", colour: "#b388ff" }
];
