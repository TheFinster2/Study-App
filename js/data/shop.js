/* Shop catalogue: lab skins, avatars and consumable power-ups. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.shop = {
  themes: [
    { id:"lab",         name:"Standard Lab",   cost:0,   desc:"Teal and violet. The default bench.",
      dots:["#39d6c8","#7c5cff","#0a0f1c"] },
    { id:"abyss",       name:"Deep Solution",  cost:250, desc:"Cyan on midnight blue — easy on the eyes at 1 a.m.",
      dots:["#28e0ff","#0f7aa8","#04141a"] },
    { id:"noble",       name:"Noble Gold",     cost:400, desc:"Warm amber, inert and unbothered.",
      dots:["#ffc861","#ff7a3d","#150e05"] },
    { id:"chlorophyll", name:"Chlorophyll",    cost:400, desc:"Photosynthesis green. Very organic.",
      dots:["#5ef08a","#b8f03a","#061407"] },
    { id:"magma",       name:"Exothermic",     cost:600, desc:"Red hot. ΔH is extremely negative.",
      dots:["#ff4d3d","#ffb03a","#170406"] },
    { id:"acid",        name:"Litmus Light",   cost:600, desc:"A bright, high-contrast light mode.",
      dots:["#e2306b","#6d5cff","#f4f7fb"] }
  ],

  avatars: [
    { emoji:"🧑‍🔬", name:"Lab Coat",       cost:0 },
    { emoji:"⚗️",  name:"Retort",         cost:0 },
    { emoji:"🧪",  name:"Test Tube",      cost:120 },
    { emoji:"🔬",  name:"Microscope",     cost:120 },
    { emoji:"💧",  name:"Droplet",        cost:180 },
    { emoji:"🔥",  name:"Bunsen",         cost:180 },
    { emoji:"❄️",  name:"Endotherm",      cost:240 },
    { emoji:"🧫",  name:"Petri Dish",     cost:240 },
    { emoji:"🦠",  name:"Culture",        cost:300 },
    { emoji:"☢️",  name:"Radioactive",    cost:400 },
    { emoji:"💎",  name:"Crystal Lattice",cost:500 },
    { emoji:"🌡️",  name:"Thermometer",    cost:300 },
    { emoji:"🧲",  name:"Magnet",         cost:350 },
    { emoji:"🐐",  name:"GOAT",           cost:900, note:"Reserved for the truly unhinged." },
    { emoji:"👑",  name:"Nobel Laureate", cost:1500, note:"Level 15+ required.", minLevel:15 },
    { emoji:"🧠",  name:"Big Brain",      cost:2000, note:"Level 20+ required.", minLevel:20 }
  ],

  powerups: [
    { id:"fifty",  icon:"✂️", name:"50/50",      cost:60,
      desc:"Removes two wrong options in a multiple-choice round." },
    { id:"skip",   icon:"⏭️", name:"Skip",       cost:45,
      desc:"Skip a question with no penalty to your streak." },
    { id:"freeze", icon:"🧊", name:"Time Freeze",cost:80,
      desc:"Adds 20 seconds to the clock in any timed mode." },
    { id:"shield", icon:"🛡️", name:"Buffer",     cost:110,
      desc:"Absorbs one wrong answer — your streak survives." },
    { id:"double", icon:"✨", name:"Catalyst",   cost:150,
      desc:"Doubles all XP earned for one complete run." }
  ],

  crates: [
    { id:"crate_s", name:"Reagent Pouch", cost:200, icon:"📦",
      desc:"A small pouch. Contains 1–2 power-ups and a handful of Moles." },
    { id:"crate_l", name:"Supply Crate",  cost:500, icon:"🎁",
      desc:"3–5 power-ups, a bigger payout, and a small chance of a bonus avatar." }
  ]
};

/* Level titles — index by level, capped at the last entry. */
CHEM.DATA.levelTitles = [
  "Lab Rat",            // 1
  "Bench Hand",         // 2
  "Pipette Novice",     // 3
  "Titration Trainee",  // 4
  "Mole Counter",       // 5
  "Buffer Buff",        // 6
  "Equilibrium Seeker", // 7
  "Organic Apprentice", // 8
  "Spectrum Reader",    // 9
  "Reaction Engineer",  // 10
  "Le Chatelier's Heir",// 11
  "Master of Moles",    // 12
  "Catalyst",           // 13
  "Distinguished Chemist", // 14
  "Band 6 Candidate",   // 15
  "Nobel Hopeful",      // 16
  "Molecular Architect",// 17
  "Grandmaster of Bonds", // 18
  "Alchemist Supreme",  // 19
  "MoleQuest Legend"    // 20+
];
