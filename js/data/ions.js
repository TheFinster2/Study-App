/* Ions, solubility rules and inorganic naming data (NSW HSC Chemistry). */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.ions = [
  // name, formula, charge, tier (1 = must-know, 2 = extension)
  { name: "Ammonium",           formula: "NH₄⁺",    charge: 1,  tier: 1 },
  { name: "Hydronium",          formula: "H₃O⁺",    charge: 1,  tier: 1 },
  { name: "Hydroxide",          formula: "OH⁻",     charge: -1, tier: 1 },
  { name: "Nitrate",            formula: "NO₃⁻",    charge: -1, tier: 1 },
  { name: "Nitrite",            formula: "NO₂⁻",    charge: -1, tier: 2 },
  { name: "Carbonate",          formula: "CO₃²⁻",   charge: -2, tier: 1 },
  { name: "Hydrogen carbonate", formula: "HCO₃⁻",   charge: -1, tier: 1 },
  { name: "Sulfate",            formula: "SO₄²⁻",   charge: -2, tier: 1 },
  { name: "Sulfite",            formula: "SO₃²⁻",   charge: -2, tier: 2 },
  { name: "Hydrogen sulfate",   formula: "HSO₄⁻",   charge: -1, tier: 2 },
  { name: "Sulfide",            formula: "S²⁻",     charge: -2, tier: 1 },
  { name: "Phosphate",          formula: "PO₄³⁻",   charge: -3, tier: 1 },
  { name: "Hydrogen phosphate", formula: "HPO₄²⁻",  charge: -2, tier: 2 },
  { name: "Dihydrogen phosphate", formula: "H₂PO₄⁻", charge: -1, tier: 2 },
  { name: "Acetate (ethanoate)", formula: "CH₃COO⁻", charge: -1, tier: 1 },
  { name: "Permanganate",       formula: "MnO₄⁻",   charge: -1, tier: 1 },
  { name: "Dichromate",         formula: "Cr₂O₇²⁻", charge: -2, tier: 1 },
  { name: "Chromate",           formula: "CrO₄²⁻",  charge: -2, tier: 2 },
  { name: "Hypochlorite",       formula: "ClO⁻",    charge: -1, tier: 2 },
  { name: "Chlorate",           formula: "ClO₃⁻",   charge: -1, tier: 2 },
  { name: "Cyanide",            formula: "CN⁻",     charge: -1, tier: 2 },
  { name: "Thiocyanate",        formula: "SCN⁻",    charge: -1, tier: 2 },
  { name: "Oxalate",            formula: "C₂O₄²⁻",  charge: -2, tier: 2 },
  { name: "Peroxide",           formula: "O₂²⁻",    charge: -2, tier: 2 },
  { name: "Silver(I)",          formula: "Ag⁺",     charge: 1,  tier: 1 },
  { name: "Zinc(II)",           formula: "Zn²⁺",    charge: 2,  tier: 1 },
  { name: "Iron(II)",           formula: "Fe²⁺",    charge: 2,  tier: 1 },
  { name: "Iron(III)",          formula: "Fe³⁺",    charge: 3,  tier: 1 },
  { name: "Copper(II)",         formula: "Cu²⁺",    charge: 2,  tier: 1 },
  { name: "Lead(II)",           formula: "Pb²⁺",    charge: 2,  tier: 1 },
  { name: "Barium",             formula: "Ba²⁺",    charge: 2,  tier: 1 },
  { name: "Aluminium",          formula: "Al³⁺",    charge: 3,  tier: 1 }
];

/* Flame test colours — Module 8 analysis */
CHEM.DATA.flameTests = [
  { cation: "Li⁺",  colour: "Crimson red" },
  { cation: "Na⁺",  colour: "Intense yellow" },
  { cation: "K⁺",   colour: "Lilac / pale violet" },
  { cation: "Ca²⁺", colour: "Brick red / orange-red" },
  { cation: "Sr²⁺", colour: "Scarlet / crimson" },
  { cation: "Ba²⁺", colour: "Apple green" },
  { cation: "Cu²⁺", colour: "Blue-green" },
  { cation: "Pb²⁺", colour: "Bluish-white" }
];

/* Cations that give characteristic precipitates with NaOH (Module 8). */
CHEM.DATA.hydroxideTests = [
  { cation: "Fe²⁺", obs: "Green precipitate of Fe(OH)₂, darkens on standing" },
  { cation: "Fe³⁺", obs: "Red-brown precipitate of Fe(OH)₃" },
  { cation: "Cu²⁺", obs: "Pale blue precipitate of Cu(OH)₂" },
  { cation: "Pb²⁺", obs: "White precipitate, dissolves in excess NaOH" },
  { cation: "Ba²⁺", obs: "No precipitate (Ba(OH)₂ is soluble)" },
  { cation: "Ca²⁺", obs: "Slight white precipitate (Ca(OH)₂ sparingly soluble)" }
];

/* Solubility grid used by the Precipitation Panic game.
   true  = soluble (no precipitate)
   false = insoluble (precipitate forms) */
CHEM.DATA.solubility = {
  cations: [
    { sym: "Na⁺",  name: "sodium" },
    { sym: "NH₄⁺", name: "ammonium" },
    { sym: "Ag⁺",  name: "silver(I)" },
    { sym: "Ba²⁺", name: "barium" },
    { sym: "Ca²⁺", name: "calcium" },
    { sym: "Pb²⁺", name: "lead(II)" },
    { sym: "Cu²⁺", name: "copper(II)" },
    { sym: "Fe³⁺", name: "iron(III)" }
  ],
  anions: [
    { sym: "NO₃⁻",  name: "nitrate" },
    { sym: "Cl⁻",   name: "chloride" },
    { sym: "SO₄²⁻", name: "sulfate" },
    { sym: "CO₃²⁻", name: "carbonate" },
    { sym: "OH⁻",   name: "hydroxide" },
    { sym: "PO₄³⁻", name: "phosphate" }
  ],
  /* [cation][anion] */
  grid: {
    "Na⁺":  { "NO₃⁻": true, "Cl⁻": true,  "SO₄²⁻": true,  "CO₃²⁻": true,  "OH⁻": true,  "PO₄³⁻": true },
    "NH₄⁺": { "NO₃⁻": true, "Cl⁻": true,  "SO₄²⁻": true,  "CO₃²⁻": true,  "OH⁻": true,  "PO₄³⁻": true },
    "Ag⁺":  { "NO₃⁻": true, "Cl⁻": false, "SO₄²⁻": false, "CO₃²⁻": false, "OH⁻": false, "PO₄³⁻": false },
    "Ba²⁺": { "NO₃⁻": true, "Cl⁻": true,  "SO₄²⁻": false, "CO₃²⁻": false, "OH⁻": true,  "PO₄³⁻": false },
    "Ca²⁺": { "NO₃⁻": true, "Cl⁻": true,  "SO₄²⁻": false, "CO₃²⁻": false, "OH⁻": false, "PO₄³⁻": false },
    "Pb²⁺": { "NO₃⁻": true, "Cl⁻": false, "SO₄²⁻": false, "CO₃²⁻": false, "OH⁻": false, "PO₄³⁻": false },
    "Cu²⁺": { "NO₃⁻": true, "Cl⁻": true,  "SO₄²⁻": true,  "CO₃²⁻": false, "OH⁻": false, "PO₄³⁻": false },
    "Fe³⁺": { "NO₃⁻": true, "Cl⁻": true,  "SO₄²⁻": true,  "CO₃²⁻": false, "OH⁻": false, "PO₄³⁻": false }
  },
  notes: {
    "Ca²⁺|SO₄²⁻": "CaSO₄ is only slightly soluble — treated as a precipitate at normal concentrations.",
    "Ba²⁺|OH⁻":   "Ba(OH)₂ is appreciably soluble, unlike most Group 2 hydroxides.",
    "Pb²⁺|Cl⁻":   "PbCl₂ is insoluble in cold water but dissolves in hot water."
  }
};

/* Ka / pKa values for weak acids (Module 6). */
CHEM.DATA.acidStrengths = [
  { acid: "Hydrochloric acid, HCl",  ka: "very large", pka: null, note: "Strong — ionises completely" },
  { acid: "Nitric acid, HNO₃",       ka: "very large", pka: null, note: "Strong monoprotic acid" },
  { acid: "Sulfuric acid, H₂SO₄",    ka: "very large", pka: null, note: "Strong diprotic (1st ionisation)" },
  { acid: "Hydrogen sulfate, HSO₄⁻", ka: 1.2e-2,  pka: 1.92, note: "2nd ionisation of H₂SO₄ — weak" },
  { acid: "Phosphoric acid, H₃PO₄",  ka: 7.5e-3,  pka: 2.12, note: "Weak triprotic acid" },
  { acid: "Hydrofluoric acid, HF",   ka: 7.2e-4,  pka: 3.14, note: "Weak despite being a hydrogen halide" },
  { acid: "Methanoic acid, HCOOH",   ka: 1.8e-4,  pka: 3.75, note: "Strongest of the simple carboxylic acids" },
  { acid: "Benzoic acid, C₆H₅COOH",  ka: 6.3e-5,  pka: 4.20, note: "Ring stabilises the conjugate base" },
  { acid: "Ethanoic acid, CH₃COOH",  ka: 1.8e-5,  pka: 4.76, note: "The classic HSC weak acid" },
  { acid: "Carbonic acid, H₂CO₃",    ka: 4.5e-7,  pka: 6.35, note: "Blood buffer / ocean acidification" },
  { acid: "Ammonium ion, NH₄⁺",      ka: 5.6e-10, pka: 9.25, note: "Conjugate acid of ammonia" },
  { acid: "Hydrogen carbonate, HCO₃⁻", ka: 4.7e-11, pka: 10.33, note: "2nd ionisation of carbonic acid" }
];

/* Indicator ranges (Module 6). */
CHEM.DATA.indicators = [
  { name: "Methyl orange",   range: "3.1 – 4.4",  acid: "Red",       base: "Yellow",  use: "Strong acid + weak base" },
  { name: "Methyl red",      range: "4.4 – 6.2",  acid: "Red",       base: "Yellow",  use: "Strong acid + weak base" },
  { name: "Bromothymol blue",range: "6.0 – 7.6",  acid: "Yellow",    base: "Blue",    use: "Strong acid + strong base" },
  { name: "Litmus",          range: "5.0 – 8.0",  acid: "Red",       base: "Blue",    use: "Rough indicator only" },
  { name: "Phenolphthalein", range: "8.3 – 10.0", acid: "Colourless",base: "Pink",    use: "Weak acid + strong base" },
  { name: "Bromocresol green", range: "3.8 – 5.4",acid: "Yellow",    base: "Blue",    use: "Weak base titrations" }
];
