/* Arcade catalogue — pure-fun games you pay Moles to play for a fixed time.
   These deliberately award NO XP and NO Moles: they are a sink for the currency
   you earn by studying, not another way to earn it. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.arcade = [
  {
    id: "ioncrush",
    icon: "💠",
    name: "Ion Crush",
    colour: "#ff5c8a",
    blurb: "Match three or more ions to clear them. Cascades score big.",
    how: "Tap a tile, then tap an adjacent one to swap. A swap is only allowed if it makes a match of three or more. Chains and cascades multiply your score.",
    minLevel: 3,
    tickets: [
      { secs: 300,  cost: 315,  label: "5 minutes" },
      { secs: 900,  cost: 750,  label: "15 minutes" },
      { secs: 1800, cost: 1250, label: "30 minutes" }
    ]
  },
  {
    id: "runner",
    icon: "🏃",
    name: "Mole Runner",
    colour: "#ffcc55",
    blurb: "Endless dash through the lab. Jump the hazards, duck the fumes.",
    how: "Space, ↑ or tap to jump — hold for a higher jump. ↓ or swipe down to duck under fume clouds. It gets faster the longer you last.",
    minLevel: 3,
    tickets: [
      { secs: 300,  cost: 250,  label: "5 minutes" },
      { secs: 900,  cost: 625,  label: "15 minutes" },
      { secs: 1800, cost: 1065, label: "30 minutes" }
    ]
  },
  {
    id: "merge",
    icon: "🔬",
    name: "Isotope 2048",
    colour: "#39d6c8",
    blurb: "Slide and merge identical nuclei to build heavier elements.",
    how: "Arrow keys, WASD or swipe to slide every tile. Two identical tiles merge into the next element up. How far up the periodic table can you get?",
    minLevel: 5,
    tickets: [
      { secs: 300,  cost: 275,  label: "5 minutes" },
      { secs: 900,  cost: 690,  label: "15 minutes" },
      { secs: 1800, cost: 1125, label: "30 minutes" }
    ]
  }
];

/* Tile set for Ion Crush — six common ions, visually distinct. */
CHEM.DATA.crushTiles = [
  { sym: "Na⁺",   colour: "#ffd24a", glow: "#ffb300" },
  { sym: "Cl⁻",   colour: "#7dffa6", glow: "#22c55e" },
  { sym: "OH⁻",   colour: "#6fa8ff", glow: "#2563eb" },
  { sym: "SO₄²⁻", colour: "#c8a2ff", glow: "#7c3aed" },
  { sym: "NH₄⁺",  colour: "#ff8fb1", glow: "#e11d48" },
  { sym: "CO₃²⁻", colour: "#5ee7e7", glow: "#0891b2" }
];

/* Merge ladder for Isotope 2048 — each merge climbs the periodic table. */
CHEM.DATA.mergeLadder = [
  { sym: "H",  name: "Hydrogen",  colour: "#3a4256" },
  { sym: "He", name: "Helium",    colour: "#44506b" },
  { sym: "Li", name: "Lithium",   colour: "#4f6390" },
  { sym: "Be", name: "Beryllium", colour: "#4a77a8" },
  { sym: "B",  name: "Boron",     colour: "#3f8bb4" },
  { sym: "C",  name: "Carbon",    colour: "#2f9fae" },
  { sym: "N",  name: "Nitrogen",  colour: "#2fae8b" },
  { sym: "O",  name: "Oxygen",    colour: "#4bb85e" },
  { sym: "F",  name: "Fluorine",  colour: "#8cc63f" },
  { sym: "Ne", name: "Neon",      colour: "#d4c13c" },
  { sym: "Na", name: "Sodium",    colour: "#e0a132" },
  { sym: "Mg", name: "Magnesium", colour: "#e07b32" },
  { sym: "Al", name: "Aluminium", colour: "#e0553a" },
  { sym: "Si", name: "Silicon",   colour: "#d63a63" },
  { sym: "P",  name: "Phosphorus",colour: "#b83ac4" },
  { sym: "S",  name: "Sulfur",    colour: "#7c3aed" },
  { sym: "Cl", name: "Chlorine",  colour: "#4f46e5" },
  { sym: "Ar", name: "Argon",     colour: "#0ea5e9" }
];
