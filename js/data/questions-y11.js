/* Year 11 Chemistry — Modules 1–4. Foundation content assumed by the HSC course. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qY11 = [
/* ── Module 1: Properties and Structure of Matter ─────────────── */
{ id:"m1-01", mod:"M1", topic:"Separation techniques", diff:1,
  q:"A mixture of sand, salt and water needs to be fully separated. Which sequence works?",
  choices:["Filtration, then evaporation of the filtrate","Evaporation, then filtration","Distillation, then chromatography","Decanting, then sublimation"],
  a:0, why:"Filtration removes the insoluble sand; evaporating the filtrate leaves the salt behind and (if condensed) recovers the water. Evaporating first would leave sand and salt mixed together." },

{ id:"m1-02", mod:"M1", topic:"Separation techniques", diff:2,
  q:"Fractional distillation separates a liquid mixture based primarily on differences in:",
  choices:["Boiling point","Density","Particle size","Solubility in water"],
  a:0, why:"Components vaporise at different temperatures. The fractionating column gives repeated condensation–vaporisation cycles, enriching the vapour in the more volatile (lower boiling point) component." },

{ id:"m1-03", mod:"M1", topic:"Atomic structure", diff:1,
  q:"An atom of ³⁷Cl⁻ contains how many protons, neutrons and electrons?",
  choices:["17 p, 20 n, 18 e","17 p, 20 n, 17 e","18 p, 19 n, 18 e","17 p, 37 n, 18 e"],
  a:0, why:"Chlorine is Z = 17 so there are 17 protons. Neutrons = 37 − 17 = 20. The 1− charge means one extra electron: 18 electrons." },

{ id:"m1-04", mod:"M1", topic:"Isotopes", diff:2,
  q:"Copper has isotopes ⁶³Cu (68.9%) and ⁶⁵Cu (31.1%). The relative atomic mass is closest to:",
  choices:["63.6","64.0","64.5","63.0"],
  a:0, why:"(63 × 0.689) + (65 × 0.311) = 43.41 + 20.22 = 63.6. The weighted average sits nearer 63 because ⁶³Cu is more abundant." },

{ id:"m1-05", mod:"M1", topic:"Emission spectra", diff:2,
  q:"Why does each element produce a unique line emission spectrum?",
  choices:["Each element has a unique set of quantised electron energy levels","Each element emits light of a single wavelength","Emission depends only on the number of neutrons","Electrons are ejected from the nucleus at fixed speeds"],
  a:0, why:"Electrons falling between quantised levels emit photons of energy ΔE = hf. Because the spacing of levels differs for every element, the pattern of lines acts like a fingerprint." },

{ id:"m1-06", mod:"M1", topic:"Periodic trends", diff:2,
  q:"Which correctly describes the trend in first ionisation energy across Period 3 (Na → Ar)?",
  choices:["Increases overall, with dips at Al and S","Decreases steadily","Increases steadily with no exceptions","Stays constant"],
  a:0, why:"Nuclear charge rises with roughly constant shielding, so ionisation energy increases. Al dips because its 3p electron is higher in energy than 3s; S dips because of electron–electron repulsion in a doubly-occupied 3p orbital." },

{ id:"m1-07", mod:"M1", topic:"Periodic trends", diff:1,
  q:"Atomic radius down a group increases mainly because:",
  choices:["More occupied electron shells and greater shielding","Nuclear charge decreases","Electrons are added to the same shell","Atoms gain neutrons"],
  a:0, why:"Each successive period adds a shell, and inner electrons shield the outer electrons from the nucleus, so the outermost electrons sit further out despite a larger nuclear charge." },

{ id:"m1-08", mod:"M1", topic:"Bonding", diff:2,
  q:"Which property is best explained by delocalised electrons in a metallic lattice?",
  choices:["Malleability and electrical conductivity","Brittleness","Low melting point","Insolubility in water"],
  a:0, why:"Cations sit in a 'sea' of delocalised electrons. Layers can slide without breaking the bonding (malleable), and the mobile electrons carry charge (conductive)." },

{ id:"m1-09", mod:"M1", topic:"Bonding", diff:2,
  q:"Ionic compounds conduct electricity when molten or dissolved but not as solids because:",
  choices:["Ions become mobile only when the lattice breaks down","Electrons are released on melting","The ions become neutral atoms","Covalent bonds form on melting"],
  a:0, why:"Charge carriers must be free to move. In a solid lattice the ions are locked in fixed positions; melting or dissolving frees them." },

{ id:"m1-10", mod:"M1", topic:"Intermolecular forces", diff:2,
  q:"Why does water have a much higher boiling point than hydrogen sulfide?",
  choices:["Water molecules form hydrogen bonds","H₂S is ionic","Water has a larger molar mass","H₂S is non-polar overall"],
  a:0, why:"O is small and highly electronegative, so H₂O forms strong hydrogen bonds. S is larger and less electronegative, so H₂S only has weaker dipole–dipole and dispersion forces despite its greater molar mass." },

{ id:"m1-11", mod:"M1", topic:"Intermolecular forces", diff:3,
  q:"Which best explains why the boiling points of the noble gases increase down the group?",
  choices:["Larger electron clouds are more polarisable, giving stronger dispersion forces","Hydrogen bonding increases","Dipole–dipole forces increase","Covalent bonds form between atoms"],
  a:0, why:"Noble gases are non-polar, so dispersion forces are the only intermolecular force. More electrons = a more polarisable cloud = larger instantaneous dipoles = stronger attraction." },

{ id:"m1-12", mod:"M1", topic:"Allotropes", diff:2,
  q:"Graphite conducts electricity but diamond does not because:",
  choices:["Graphite has delocalised electrons between its layers","Graphite contains metal atoms","Diamond has ionic bonding","Graphite molecules are smaller"],
  a:0, why:"Each carbon in graphite bonds to three others, leaving one electron per atom delocalised across the layer. In diamond every valence electron is committed to a σ bond in the tetrahedral network." },

/* ── Module 2: Introduction to Quantitative Chemistry ─────────── */
{ id:"m2-01", mod:"M2", topic:"The mole", diff:1,
  q:"How many moles are in 88.0 g of carbon dioxide (M = 44.01 g mol⁻¹)?",
  choices:["2.00 mol","1.00 mol","4.00 mol","0.50 mol"],
  a:0, why:"n = m / M = 88.0 / 44.01 ≈ 2.00 mol." },

{ id:"m2-02", mod:"M2", topic:"The mole", diff:2,
  q:"How many oxygen atoms are in 0.250 mol of Al₂(SO₄)₃?",
  choices:["1.81 × 10²⁴","3.01 × 10²³","6.02 × 10²³","7.22 × 10²³"],
  a:0, why:"Each formula unit has 12 O atoms (3 × SO₄). n(O) = 0.250 × 12 = 3.00 mol, so N = 3.00 × 6.022 × 10²³ = 1.81 × 10²⁴ atoms." },

{ id:"m2-03", mod:"M2", topic:"Empirical formula", diff:2,
  q:"A compound is 40.0% C, 6.7% H and 53.3% O by mass. Its empirical formula is:",
  choices:["CH₂O","C₂H₄O","CHO","C₂H₆O₂"],
  a:0, why:"Per 100 g: C 40.0/12.01 = 3.33, H 6.7/1.008 = 6.65, O 53.3/16.00 = 3.33. Dividing by 3.33 gives 1 : 2 : 1 → CH₂O." },

{ id:"m2-04", mod:"M2", topic:"Molecular formula", diff:2,
  q:"A compound with empirical formula CH₂O has a molar mass of 180 g mol⁻¹. Its molecular formula is:",
  choices:["C₆H₁₂O₆","C₃H₆O₃","C₂H₄O₂","C₅H₁₀O₅"],
  a:0, why:"M(CH₂O) = 30.03. 180 / 30.03 ≈ 6, so multiply every subscript by 6 → C₆H₁₂O₆ (glucose)." },

{ id:"m2-05", mod:"M2", topic:"Gas laws", diff:2,
  q:"What volume does 3.00 mol of an ideal gas occupy at 25 °C and 100 kPa (Vm = 24.79 L mol⁻¹)?",
  choices:["74.4 L","67.2 L","22.4 L","24.8 L"],
  a:0, why:"V = n × Vm = 3.00 × 24.79 = 74.4 L. Note 24.79 L mol⁻¹ applies at 25 °C and 100 kPa, not at 0 °C." },

{ id:"m2-06", mod:"M2", topic:"Gas laws", diff:3,
  q:"A gas occupies 500 mL at 300 K and 101.3 kPa. What volume does it occupy at 450 K and 202.6 kPa?",
  choices:["375 mL","750 mL","250 mL","1000 mL"],
  a:0, why:"P₁V₁/T₁ = P₂V₂/T₂ → V₂ = (101.3 × 500 × 450)/(300 × 202.6) = 375 mL. Heating expands it 1.5×, doubling pressure halves it." },

{ id:"m2-07", mod:"M2", topic:"Concentration", diff:1,
  q:"What mass of NaOH (M = 40.00 g mol⁻¹) is needed to make 250 mL of 0.100 mol L⁻¹ solution?",
  choices:["1.00 g","4.00 g","0.400 g","10.0 g"],
  a:0, why:"n = cV = 0.100 × 0.250 = 0.0250 mol; m = nM = 0.0250 × 40.00 = 1.00 g." },

{ id:"m2-08", mod:"M2", topic:"Dilution", diff:2,
  q:"What volume of 2.00 mol L⁻¹ HCl is needed to prepare 500 mL of 0.150 mol L⁻¹ HCl?",
  choices:["37.5 mL","75.0 mL","150 mL","18.8 mL"],
  a:0, why:"c₁V₁ = c₂V₂ → V₁ = (0.150 × 500)/2.00 = 37.5 mL, then dilute to the 500 mL mark." },

{ id:"m2-09", mod:"M2", topic:"Limiting reagent", diff:3,
  q:"2.00 mol H₂ reacts with 3.00 mol O₂ (2H₂ + O₂ → 2H₂O). What is the limiting reagent and mass of water formed?",
  choices:["H₂ limiting, 36.0 g water","O₂ limiting, 36.0 g water","H₂ limiting, 54.0 g water","O₂ limiting, 108 g water"],
  a:0, why:"H₂ requires only 1.00 mol O₂, and 3.00 mol is available, so H₂ limits. n(H₂O) = 2.00 mol → m = 2.00 × 18.02 = 36.0 g." },

{ id:"m2-10", mod:"M2", topic:"Percentage yield", diff:2,
  q:"A reaction with a theoretical yield of 12.0 g produced 9.60 g. The percentage yield is:",
  choices:["80.0%","125%","20.0%","96.0%"],
  a:0, why:"% yield = (actual / theoretical) × 100 = (9.60 / 12.0) × 100 = 80.0%." },

/* ── Module 3: Reactive Chemistry ─────────────────────────────── */
{ id:"m3-01", mod:"M3", topic:"Reaction types", diff:1,
  q:"2Mg(s) + O₂(g) → 2MgO(s) is best classified as:",
  choices:["Synthesis (combination) and redox","Decomposition","Double displacement","Neutralisation"],
  a:0, why:"Two reactants combine into one product (synthesis), and magnesium is oxidised 0 → +2 while oxygen is reduced 0 → −2, so it is also redox." },

{ id:"m3-02", mod:"M3", topic:"Metal reactivity", diff:2,
  q:"Zinc placed in copper(II) sulfate solution produces a red-brown coating because:",
  choices:["Zn is a stronger reductant than Cu, so it reduces Cu²⁺","Cu²⁺ oxidises the sulfate ion","Zinc dissolves without any electron transfer","Copper is more reactive than zinc"],
  a:0, why:"Zn is above Cu in the activity series, so Zn(s) → Zn²⁺ + 2e⁻ and Cu²⁺ + 2e⁻ → Cu(s). Copper metal deposits on the zinc." },

{ id:"m3-03", mod:"M3", topic:"Redox", diff:2,
  q:"What is the oxidation number of chromium in Cr₂O₇²⁻?",
  choices:["+6","+3","+7","+2"],
  a:0, why:"Oxygen is −2, so 7 × (−2) = −14. For a total of −2: 2x − 14 = −2 → x = +6." },

{ id:"m3-04", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"In a Zn|Zn²⁺ || Cu²⁺|Cu galvanic cell (E° = +1.10 V), which statement is correct?",
  choices:["Zinc is the anode and loses mass","Copper is the anode and loses mass","Electrons flow through the salt bridge","Zinc is reduced"],
  a:0, why:"Oxidation occurs at the anode. Zn has the lower reduction potential so it is oxidised, dissolving into solution as Zn²⁺ and losing mass. The salt bridge carries ions, not electrons." },

{ id:"m3-05", mod:"M3", topic:"Galvanic cells", diff:2,
  q:"The purpose of the salt bridge in a galvanic cell is to:",
  choices:["Maintain electrical neutrality by allowing ion migration","Conduct electrons between electrodes","Prevent any ion movement","Supply reactants to the cathode"],
  a:0, why:"Without it, the anode half-cell builds positive charge and the cathode half-cell negative charge, stopping the reaction. Anions migrate to the anode and cations to the cathode." },

{ id:"m3-06", mod:"M3", topic:"Rates of reaction", diff:2,
  q:"Increasing temperature speeds up a reaction mainly because:",
  choices:["A greater proportion of collisions exceed the activation energy","Activation energy is lowered","Particles become larger","Collision frequency alone doubles the rate"],
  a:0, why:"The Maxwell–Boltzmann distribution shifts, so many more particles have E ≥ Ea. Increased collision frequency contributes, but the energy effect dominates." },

{ id:"m3-07", mod:"M3", topic:"Catalysts", diff:2,
  q:"A catalyst increases reaction rate by:",
  choices:["Providing an alternative pathway with lower activation energy","Increasing the enthalpy change","Shifting the equilibrium position right","Raising the temperature of the mixture"],
  a:0, why:"Catalysts lower Ea for both forward and reverse reactions equally. ΔH and the equilibrium position are unchanged — only the time taken to reach equilibrium falls." },

/* ── Module 4: Drivers of Reactions ───────────────────────────── */
{ id:"m4-01", mod:"M4", topic:"Enthalpy", diff:1,
  q:"For an exothermic reaction:",
  choices:["ΔH is negative and the products are lower in energy","ΔH is positive and heat is absorbed","ΔH is zero","Bond breaking releases more energy than bond making"],
  a:0, why:"Energy released when new bonds form exceeds the energy absorbed breaking old bonds, so the system loses enthalpy: ΔH < 0 and the surroundings warm up." },

{ id:"m4-02", mod:"M4", topic:"Calorimetry", diff:3,
  q:"Burning 0.500 g of ethanol (M = 46.07) raises 200 g of water by 18.0 °C (c = 4.18 J g⁻¹ K⁻¹). The molar heat of combustion is closest to:",
  choices:["−1.39 × 10³ kJ mol⁻¹","−15.0 kJ mol⁻¹","−694 kJ mol⁻¹","−2.78 × 10³ kJ mol⁻¹"],
  a:0, why:"q = mcΔT = 200 × 4.18 × 18.0 = 15 048 J = 15.05 kJ. n = 0.500/46.07 = 0.01085 mol. ΔH = −15.05/0.01085 ≈ −1.39 × 10³ kJ mol⁻¹." },

{ id:"m4-03", mod:"M4", topic:"Hess's law", diff:3,
  q:"Given C + O₂ → CO₂ (ΔH = −393 kJ) and CO + ½O₂ → CO₂ (ΔH = −283 kJ), what is ΔH for C + ½O₂ → CO?",
  choices:["−110 kJ","−676 kJ","+110 kJ","+676 kJ"],
  a:0, why:"Reverse the second equation (+283) and add to the first: −393 + 283 = −110 kJ." },

{ id:"m4-04", mod:"M4", topic:"Entropy", diff:2,
  q:"Which process has the largest positive entropy change?",
  choices:["Sublimation of dry ice: CO₂(s) → CO₂(g)","Freezing of water","2NO₂(g) → N₂O₄(g)","Dissolving a gas in water"],
  a:0, why:"Going from a highly ordered solid to a gas creates by far the greatest increase in positional disorder. The other three all reduce the number of gas particles or increase order." },

{ id:"m4-05", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"A reaction has ΔH = +50 kJ mol⁻¹ and ΔS = +150 J K⁻¹ mol⁻¹. It becomes spontaneous above approximately:",
  choices:["333 K","0.33 K","3.0 K","750 K"],
  a:0, why:"Spontaneous when ΔG = ΔH − TΔS < 0, i.e. T > ΔH/ΔS = 50 000 J / 150 J K⁻¹ = 333 K. Watch the unit conversion — kJ to J." },

{ id:"m4-06", mod:"M4", topic:"Gibbs free energy", diff:2,
  q:"A reaction with ΔH < 0 and ΔS > 0 is:",
  choices:["Spontaneous at all temperatures","Never spontaneous","Spontaneous only at high temperature","Spontaneous only at low temperature"],
  a:0, why:"ΔG = ΔH − TΔS. With ΔH negative and −TΔS also negative at all positive T, ΔG is always negative." },

{ id:"m4-07", mod:"M4", topic:"Enthalpy", diff:2,
  q:"Dissolving ammonium nitrate in water makes the beaker feel cold. This means:",
  choices:["The dissolution is endothermic and is driven by an entropy increase","The dissolution is exothermic","ΔS is negative","ΔG is positive"],
  a:0, why:"Heat is absorbed from the surroundings (ΔH > 0), yet it still happens spontaneously because the large positive ΔS of dispersing ions makes TΔS outweigh ΔH." }
];
