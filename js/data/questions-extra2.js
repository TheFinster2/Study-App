/* Third question bank. Written with deliberately length-matched options so the
   correct answer is never guessable from how long it is. IDs prefixed "y". */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qExtra2 = [
/* ── Module 1 ─────────────────────────────────────────────────── */
{ id:"ym1-01", mod:"M1", topic:"Separation techniques", diff:2,
  q:"Which method would best recover pure water from seawater?",
  choices:["Simple distillation of the mixture","Filtration through fine filter paper","Chromatography on absorbent paper","Decanting after allowing it to settle"],
  a:0, why:"The dissolved salts are not volatile, so only water evaporates and can be condensed back. Filtration and decanting only remove suspended solids." },

{ id:"ym1-02", mod:"M1", topic:"Atomic structure", diff:2,
  q:"Which pair are isotopes of the same element?",
  choices:["¹²C and ¹⁴C","¹⁴C and ¹⁴N","³⁵Cl and ³⁷Ar","⁴⁰Ca and ⁴⁰Ar"],
  a:0, why:"Isotopes share the atomic number and differ in neutron count. ¹⁴C and ¹⁴N are isobars — same mass number, different elements." },

{ id:"ym1-03", mod:"M1", topic:"Emission spectra", diff:3,
  q:"A hydrogen emission line appears when an electron moves from n = 4 to n = 2. This transition:",
  choices:["Releases a photon of fixed, quantised energy","Absorbs a photon of fixed, quantised energy","Releases a continuous spread of energies","Ejects the electron from the atom entirely"],
  a:0, why:"Dropping to a lower level releases the energy difference as a single photon, ΔE = hf. Absorption happens when an electron is promoted upward." },

{ id:"ym1-04", mod:"M1", topic:"Periodic trends", diff:3,
  q:"Why is the second ionisation energy of sodium far larger than the first?",
  choices:["The second electron is removed from a stable full inner shell","The second electron is further from the nucleus than the first","Sodium becomes a non-metal after losing one electron","The nuclear charge falls once the first electron leaves"],
  a:0, why:"Na⁺ has the neon configuration. Removing another electron breaks into a complete shell much closer to the nucleus, so far more energy is needed." },

{ id:"ym1-05", mod:"M1", topic:"Bonding", diff:2,
  q:"Which substance has a giant covalent (network) structure?",
  choices:["Silicon carbide, SiC","Sodium chloride, NaCl","Carbon dioxide, CO₂","Magnesium metal, Mg"],
  a:0, why:"Silicon carbide is a 3D lattice of covalent bonds, giving an extremely high melting point. NaCl is ionic, CO₂ is molecular and Mg is metallic." },

{ id:"ym1-06", mod:"M1", topic:"Polarity", diff:3,
  q:"Which molecule has a permanent dipole?",
  choices:["NH₃, a trigonal pyramidal molecule","CCl₄, a tetrahedral molecule","BF₃, a trigonal planar molecule","CO₂, a linear triatomic molecule"],
  a:0, why:"Ammonia's lone pair makes it pyramidal, so the bond dipoles do not cancel. The other three are symmetrical, so their dipoles cancel exactly." },

{ id:"ym1-07", mod:"M1", topic:"Intermolecular forces", diff:2,
  q:"Which liquid would you expect to have the highest surface tension?",
  choices:["Water, which hydrogen bonds strongly","Hexane, a long-chain liquid alkane","Propanone, a polar organic solvent","Tetrachloromethane, a dense liquid"],
  a:0, why:"Surface tension tracks the strength of intermolecular attraction. Hydrogen bonding in water is far stronger than the dipole and dispersion forces in the others." },

{ id:"ym1-08", mod:"M1", topic:"Allotropes", diff:2,
  q:"Diamond and graphite are allotropes because they:",
  choices:["Are different structural forms of the same element","Contain different elements bonded covalently","Have the same structure but different masses","Differ only in the number of neutrons present"],
  a:0, why:"Allotropes are distinct structural arrangements of one element in the same physical state. Different neutron counts would describe isotopes instead." },

/* ── Module 2 ─────────────────────────────────────────────────── */
{ id:"ym2-01", mod:"M2", topic:"The mole", diff:2,
  q:"How many chloride ions are present in 0.500 mol of magnesium chloride?",
  choices:["6.02 × 10²³","3.01 × 10²³","1.20 × 10²⁴","1.51 × 10²³"],
  a:0, why:"MgCl₂ gives 2 Cl⁻ per formula unit, so n(Cl⁻) = 1.00 mol and N = 6.022 × 10²³ ions." },

{ id:"ym2-02", mod:"M2", topic:"Molar mass", diff:2,
  q:"What is the molar mass of hydrated copper(II) sulfate, CuSO₄·5H₂O?",
  choices:["249.7 g mol⁻¹","159.6 g mol⁻¹","177.6 g mol⁻¹","231.7 g mol⁻¹"],
  a:0, why:"159.61 for CuSO₄ plus 5 × 18.02 = 90.10 for the water of crystallisation gives 249.7 g mol⁻¹." },

{ id:"ym2-03", mod:"M2", topic:"Empirical formula", diff:3,
  q:"A hydrate loses 36.1% of its mass on heating. If the anhydrous salt is MgSO₄ (M = 120.4), the formula of the hydrate is:",
  choices:["MgSO₄·4H₂O","MgSO₄·7H₂O","MgSO₄·2H₂O","MgSO₄·6H₂O"],
  a:0, why:"Per 100 g: 36.1 g water = 2.004 mol; 63.9 g MgSO₄ = 0.531 mol. Ratio 2.004/0.531 ≈ 3.8, which rounds to 4." },

{ id:"ym2-04", mod:"M2", topic:"Gas laws", diff:3,
  q:"Equal volumes of two gases at the same temperature and pressure contain:",
  choices:["Equal numbers of molecules","Equal masses of gas","Equal numbers of atoms","Equal densities of gas"],
  a:0, why:"This is Avogadro's law. Mass and density differ because the molar masses differ, and atom counts differ with molecular complexity." },

{ id:"ym2-05", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"What volume of CO₂ at 25 °C and 100 kPa forms from 10.0 g of CaCO₃? (M = 100.09, Vm = 24.79)",
  choices:["2.48 L","1.24 L","4.96 L","24.8 L"],
  a:0, why:"n(CaCO₃) = 0.0999 mol, giving the same moles of CO₂. V = 0.0999 × 24.79 = 2.48 L." },

{ id:"ym2-06", mod:"M2", topic:"Concentration", diff:2,
  q:"A solution is labelled 5.00% (m/v) NaCl. This means it contains:",
  choices:["5.00 g of NaCl per 100 mL of solution","5.00 g of NaCl per 100 g of solution","5.00 mL of NaCl per 100 mL of water","5.00 mol of NaCl per 100 L of water"],
  a:0, why:"Mass/volume percentage is grams of solute per 100 mL of final solution. Mass/mass would be grams per 100 g." },

{ id:"ym2-07", mod:"M2", topic:"Dilution", diff:2,
  q:"Adding water to a solution changes which of the following?",
  choices:["The concentration, but not the moles of solute","The moles of solute, but not the concentration","Both the concentration and the moles present","Neither the concentration nor the moles"],
  a:0, why:"Dilution spreads the same amount of solute through a larger volume, so c falls while n stays fixed. That is why c₁V₁ = c₂V₂ works." },

{ id:"ym2-08", mod:"M2", topic:"Limiting reagent", diff:3,
  q:"In a reaction, the limiting reagent is the one that:",
  choices:["Runs out first and caps the product formed","Is present in the largest number of moles","Has the highest molar mass of the reactants","Appears with the largest coefficient shown"],
  a:0, why:"Divide the moles available by the coefficient for each reactant; the smallest ratio identifies the limiting reagent, regardless of mass or coefficient." },

{ id:"ym2-09", mod:"M2", topic:"Errors", diff:3,
  q:"A student's repeated titres are 24.10, 24.12 and 24.11 mL, but the true value is 25.00 mL. The results are:",
  choices:["Precise but not accurate","Accurate but not precise","Both accurate and precise","Neither accurate nor precise"],
  a:0, why:"The values agree closely with each other (precise) but sit well away from the true value, which indicates a systematic error rather than random scatter." },

{ id:"ym2-10", mod:"M2", topic:"Percentage yield", diff:2,
  q:"A percentage yield above 100% most likely indicates that the product:",
  choices:["Is still wet or contains impurities","Was formed by an extra side reaction","Has an incorrectly measured molar mass","Was weighed on a correctly zeroed balance"],
  a:0, why:"Mass cannot be created, so an apparent yield over 100% points to residual solvent or contaminant adding to the weighed mass." },

/* ── Module 3 ─────────────────────────────────────────────────── */
{ id:"ym3-01", mod:"M3", topic:"Reaction types", diff:2,
  q:"2H₂O₂(aq) → 2H₂O(l) + O₂(g) is best classified as:",
  choices:["Decomposition, and also a redox reaction","Synthesis, and also a redox reaction","Double displacement of two ion pairs","Neutralisation of an acid by a base"],
  a:0, why:"One reactant becomes two products. Oxygen goes from −1 in peroxide to −2 in water and 0 in O₂, so it is both oxidised and reduced — a disproportionation." },

{ id:"ym3-02", mod:"M3", topic:"Metal reactivity", diff:3,
  q:"A metal that reacts with cold water but not violently is most likely:",
  choices:["Calcium, a Group 2 metal","Potassium, a Group 1 metal","Copper, a transition metal","Gold, a very unreactive metal"],
  a:0, why:"Calcium reacts steadily with cold water giving hydrogen. Potassium reacts violently, while copper and gold do not react with water at all." },

{ id:"ym3-03", mod:"M3", topic:"Redox", diff:3,
  q:"In MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, manganese is:",
  choices:["Reduced, from +7 down to +2","Oxidised, from +2 up to +7","Reduced, from +2 down to −7","Oxidised, from +7 up to +8"],
  a:0, why:"Gaining five electrons is reduction. In MnO₄⁻ the oxidation number is +7 and in Mn²⁺ it is +2." },

{ id:"ym3-04", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"Standard cell potential is calculated as:",
  choices:["E°(cathode) − E°(anode)","E°(anode) − E°(cathode)","E°(cathode) + E°(anode)","E°(anode) × E°(cathode)"],
  a:0, why:"E°cell = E°reduction − E°oxidation. A positive value indicates a spontaneous galvanic reaction under standard conditions." },

{ id:"ym3-05", mod:"M3", topic:"Corrosion", diff:2,
  q:"Rusting of iron requires the presence of:",
  choices:["Both oxygen and water","Only oxygen, but not water","Only water, but not oxygen","Neither oxygen nor water"],
  a:0, why:"Rust is hydrated iron(III) oxide. Iron does not rust in dry air or in fully deoxygenated water — both are needed, and salt speeds it up." },

{ id:"ym3-06", mod:"M3", topic:"Rates of reaction", diff:3,
  q:"A reaction's rate is measured as the gradient of a concentration–time graph. The rate is greatest:",
  choices:["At the start, when reactants are most concentrated","At the end, when the products have accumulated","Exactly halfway through the reaction's course","Constantly, throughout the whole reaction"],
  a:0, why:"Collision frequency is highest when reactant concentration is highest, so the curve is steepest at t = 0 and flattens as reactants are consumed." },

{ id:"ym3-07", mod:"M3", topic:"Collision theory", diff:2,
  q:"For a collision to result in reaction, the particles must:",
  choices:["Collide with sufficient energy and correct orientation","Collide with sufficient energy, whatever the orientation","Collide with the correct orientation at any energy","Simply collide, since all collisions cause reaction"],
  a:0, why:"Both conditions are required. Most collisions are unsuccessful because they are either too gentle or geometrically unfavourable." },

{ id:"ym3-08", mod:"M3", topic:"Acid reactions", diff:2,
  q:"Which observation confirms that a gas produced is hydrogen?",
  choices:["A lit splint gives a squeaky pop","A glowing splint relights brightly","Limewater turns milky and cloudy","Damp red litmus turns blue quickly"],
  a:0, why:"The squeaky pop is the standard hydrogen test. A relighting splint indicates oxygen, milky limewater indicates CO₂, and blue litmus indicates ammonia." },

/* ── Module 4 ─────────────────────────────────────────────────── */
{ id:"ym4-01", mod:"M4", topic:"Enthalpy", diff:2,
  q:"On an enthalpy diagram for an endothermic reaction, the products sit:",
  choices:["Higher in energy than the reactants","Lower in energy than the reactants","At the same energy as the reactants","Below the activation energy barrier"],
  a:0, why:"Endothermic means the system absorbs energy, so ΔH is positive and the products are above the reactants on the diagram." },

{ id:"ym4-02", mod:"M4", topic:"Calorimetry", diff:3,
  q:"In a solution calorimetry experiment, the assumption that the solution's specific heat equals that of water:",
  choices:["Introduces a small systematic error","Has no effect on the result at all","Makes the calculation impossible","Only matters for exothermic reactions"],
  a:0, why:"Dissolved solutes change c slightly, so the calculated q is slightly off in a consistent direction — a systematic, not random, error." },

{ id:"ym4-03", mod:"M4", topic:"Hess's law", diff:3,
  q:"If a reaction is reversed, its enthalpy change:",
  choices:["Keeps the same magnitude but changes sign","Keeps both the same magnitude and sign","Doubles in magnitude and changes sign","Falls to zero, since it is a state function"],
  a:0, why:"Enthalpy is a state function. Going backwards along the same path releases exactly the energy absorbed going forwards, so only the sign flips." },

{ id:"ym4-04", mod:"M4", topic:"Entropy", diff:2,
  q:"Which sample has the highest molar entropy at 25 °C?",
  choices:["Water vapour, H₂O(g)","Liquid water, H₂O(l)","Ice at 0 °C, H₂O(s)","Ice at −50 °C, H₂O(s)"],
  a:0, why:"Entropy increases with disorder and with temperature. Gases have far more positional freedom than liquids, which in turn exceed solids." },

{ id:"ym4-05", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"A reaction is at equilibrium when:",
  choices:["ΔG equals zero","ΔH equals zero","ΔS equals zero","ΔG is strongly negative"],
  a:0, why:"ΔG measures the driving force. At equilibrium there is no net drive in either direction, so ΔG = 0 while ΔH and ΔS are generally non-zero." },

{ id:"ym4-06", mod:"M4", topic:"Enthalpy", diff:3,
  q:"Why is the enthalpy of combustion of methane more negative than that of methanol per mole?",
  choices:["Methanol is already partly oxidised","Methanol has a lower molar mass","Methane forms more water on burning","Methanol produces carbon monoxide"],
  a:0, why:"The C-O bond in methanol means some of the potential energy has already been released, so less remains to be liberated on combustion." },

{ id:"ym4-07", mod:"M4", topic:"Activation energy", diff:2,
  q:"A reaction with a very large activation energy will generally be:",
  choices:["Slow at room temperature","Fast at room temperature","Always strongly exothermic","Always non-spontaneous overall"],
  a:0,
  why:"A high barrier means very few collisions succeed at ordinary temperatures. Ea governs rate, and says nothing about ΔH or spontaneity." },

{ id:"ym4-08", mod:"M4", topic:"Spontaneity", diff:3,
  q:"Photosynthesis has ΔG > 0 yet occurs in plants. This is possible because:",
  choices:["It is driven by absorbed light energy","It is actually spontaneous in sunlight","Enzymes make ΔG become negative","The second law does not apply to life"],
  a:0, why:"An external energy input can drive a non-spontaneous process. Enzymes only change the rate; they cannot alter thermodynamic quantities." },

/* ── Module 5 ─────────────────────────────────────────────────── */
{ id:"ym5-01", mod:"M5", topic:"Dynamic equilibrium", diff:2,
  q:"Which pair of properties stays constant once equilibrium is reached?",
  choices:["Concentrations and observable colour","Reaction rates and total bond energy","Temperature and the value of ΔH","Pressure and the activation energy"],
  a:0, why:"Macroscopic properties become constant because the opposing rates match. Rates are equal but not constant in the sense implied by the other options." },

{ id:"ym5-02", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"For H₂(g) + I₂(g) ⇌ 2HI(g), halving the container volume will:",
  choices:["Cause no shift, as moles of gas are equal","Shift the equilibrium towards HI strongly","Shift the equilibrium back towards H₂ and I₂","Decrease the equilibrium constant sharply"],
  a:0, why:"Both sides have 2 mol of gas, so compression raises all partial pressures equally and Q still equals K. Only unequal gas moles produce a pressure shift." },

{ id:"ym5-03", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"For N₂ + 3H₂ ⇌ 2NH₃ with K = 0.50, what is K for 2NH₃ ⇌ N₂ + 3H₂?",
  choices:["2.0","0.50","0.25","−0.50"],
  a:0, why:"Reversing a reaction inverts K: 1/0.50 = 2.0." },

{ id:"ym5-04", mod:"M5", topic:"ICE tables", diff:3,
  q:"For a reaction with a very small K, a common simplifying assumption is that:",
  choices:["The change x is negligible beside the initial concentration","The initial concentration is negligible beside x","The equilibrium concentrations are all equal","The reaction goes essentially to completion"],
  a:0, why:"With K very small, only a tiny fraction reacts, so (c − x) ≈ c. This is valid when x is under about 5% of the initial concentration." },

{ id:"ym5-05", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"Which silver halide is the least soluble in water?",
  choices:["AgI, with Ksp ≈ 8.5 × 10⁻¹⁷","AgBr, with Ksp ≈ 5.4 × 10⁻¹³","AgCl, with Ksp ≈ 1.8 × 10⁻¹⁰","AgF, which is freely soluble"],
  a:0, why:"For salts of the same 1:1 stoichiometry, the smaller the Ksp the lower the solubility. Silver iodide has by far the smallest." },

{ id:"ym5-06", mod:"M5", topic:"Common ion effect", diff:3,
  q:"Adding solid sodium ethanoate to ethanoic acid solution will:",
  choices:["Suppress the acid's ionisation and raise pH","Increase the acid's ionisation and lower pH","Leave both ionisation and pH unchanged","Convert the acid completely into its salt"],
  a:0, why:"Extra ethanoate ions shift CH₃COOH ⇌ H⁺ + CH₃COO⁻ to the left, lowering [H⁺]. This is exactly how an ethanoate buffer is prepared." },

{ id:"ym5-07", mod:"M5", topic:"Industrial equilibrium", diff:3,
  q:"Why is the Contact process run at about 450 °C rather than at room temperature?",
  choices:["To reach equilibrium at a workable rate","To increase the equilibrium yield of SO₃","To keep the vanadium catalyst from melting","To convert the SO₃ directly into oleum"],
  a:0, why:"The reaction is exothermic, so a low temperature would maximise yield but the rate would be far too slow. 450 °C is the usual compromise." },

{ id:"ym5-08", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"Adding more of a pure solid to a heterogeneous equilibrium will:",
  choices:["Have no effect on the equilibrium position","Shift the equilibrium towards the products","Shift the equilibrium towards the reactants","Increase the value of the equilibrium constant"],
  a:0, why:"A pure solid has a fixed effective concentration, so it does not appear in the expression for K and adding more cannot change Q." },

{ id:"ym5-09", mod:"M5", topic:"Equilibrium graphs", diff:3,
  q:"On a concentration–time graph, equilibrium is first reached at the point where:",
  choices:["All curves become horizontal lines","All curves cross one another exactly","The reactant curve reaches zero","The product curve is at its steepest"],
  a:0, why:"Constant concentrations show as flat lines. Curves crossing merely means two species happen to have equal concentration at that instant." },

{ id:"ym5-10", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"A solution in which Q is less than Ksp is described as:",
  choices:["Unsaturated, so more solid will dissolve","Saturated, so no further solid dissolves","Supersaturated, so solid will precipitate","At equilibrium with excess solid present"],
  a:0, why:"Q below Ksp means the solution can still take up more solute. Q above Ksp means precipitation, and Q = Ksp is exactly saturated." },

{ id:"ym5-11", mod:"M5", topic:"Enthalpy of solution", diff:3,
  q:"Instant cold packs typically use ammonium nitrate because dissolving it is:",
  choices:["Endothermic, absorbing heat from around it","Exothermic, releasing heat into the pack","Athermic, with no measurable heat change","Explosive, releasing gas and cooling fast"],
  a:0, why:"The lattice enthalpy absorbed exceeds the hydration enthalpy released, so the surroundings cool. The large entropy gain still makes it spontaneous." },

{ id:"ym5-12", mod:"M5", topic:"Ocean acidification", diff:3,
  q:"Ocean acidification threatens shellfish primarily because it:",
  choices:["Lowers the carbonate ion concentration","Raises the carbonate ion concentration","Removes dissolved oxygen from the water","Increases the salinity of the surface water"],
  a:0, why:"Extra H⁺ converts CO₃²⁻ into HCO₃⁻. With less carbonate available, CaCO₃ shells dissolve more readily and are harder to build." },

{ id:"ym5-13", mod:"M5", topic:"Reaction quotient", diff:3,
  q:"A reaction vessel is found to have Q smaller than K. Over time:",
  choices:["[Products] will rise and [reactants] will fall","[Reactants] will rise and [products] will fall","Both concentrations will rise together","Nothing will change, as Q always equals K"],
  a:0, why:"Q < K means there is not yet enough product, so the forward reaction dominates until Q climbs to meet K." },

{ id:"ym5-14", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Nitrogen dioxide is placed in a sealed syringe and compressed: 2NO₂(g) ⇌ N₂O₄(g). The colour first darkens, then fades. Why?",
  choices:["Concentration rises immediately, then the shift consumes NO₂","The temperature rises first, then falls back down","The equilibrium constant briefly rises, then falls","N₂O₄ is coloured and NO₂ is entirely colourless"],
  a:0, why:"Compression instantly concentrates the brown NO₂, so colour deepens. The system then shifts towards colourless N₂O₄, so the colour partially fades." },

/* ── Module 6 ─────────────────────────────────────────────────── */
{ id:"ym6-01", mod:"M6", topic:"Acid–base theories", diff:2,
  q:"Which species can act only as a Brønsted–Lowry base?",
  choices:["NH₃, which has a nitrogen lone pair","HSO₄⁻, the hydrogen sulfate ion","H₂O, the solvent in most reactions","HCO₃⁻, the hydrogen carbonate ion"],
  a:0, why:"Ammonia has no ionisable proton to donate, so it can only accept. The other three are amphiprotic and can act either way." },

{ id:"ym6-02", mod:"M6", topic:"Conjugate pairs", diff:3,
  q:"Which pair is NOT a conjugate acid–base pair?",
  choices:["H₃O⁺ and OH⁻","NH₄⁺ and NH₃","H₂CO₃ and HCO₃⁻","HCl and Cl⁻"],
  a:0, why:"A conjugate pair differs by exactly one proton. H₃O⁺ and OH⁻ differ by two, so they are not a conjugate pair." },

{ id:"ym6-03", mod:"M6", topic:"pH calculations", diff:3,
  q:"Mixing 50.0 mL of 0.100 mol L⁻¹ HCl with 50.0 mL of 0.100 mol L⁻¹ NaOH gives a solution of pH:",
  choices:["7.00","1.00","13.00","3.50"],
  a:0, why:"Equal moles of strong acid and strong base exactly neutralise, leaving only NaCl, whose ions do not hydrolyse." },

{ id:"ym6-04", mod:"M6", topic:"pH calculations", diff:3,
  q:"Mixing 50.0 mL of 0.200 mol L⁻¹ HCl with 50.0 mL of 0.100 mol L⁻¹ NaOH gives a pH closest to:",
  choices:["1.30","7.00","2.00","12.70"],
  a:0, why:"Excess H⁺ = (0.0100 − 0.0050) = 0.0050 mol in 0.100 L, so [H⁺] = 0.050 mol L⁻¹ and pH = −log(0.050) = 1.30." },

{ id:"ym6-05", mod:"M6", topic:"Strong vs weak", diff:3,
  q:"Magnesium ribbon is added to equal-concentration HCl and CH₃COOH. Compared with HCl, the ethanoic acid will:",
  choices:["Fizz more slowly but produce the same gas volume","Fizz more slowly and produce far less gas","Fizz more quickly but produce less gas overall","Fizz at the same rate and produce the same volume"],
  a:0, why:"Lower [H₃O⁺] means a slower rate, but the total moles of acid available are the same, so the final volume of hydrogen matches." },

{ id:"ym6-06", mod:"M6", topic:"Ka", diff:3,
  q:"Diluting a weak acid tenfold will:",
  choices:["Raise the percentage ionisation and raise the pH","Lower the percentage ionisation and raise the pH","Raise the percentage ionisation and lower the pH","Leave the percentage ionisation entirely unchanged"],
  a:0, why:"Ostwald's dilution law: dilution shifts the ionisation equilibrium right, so a larger fraction ionises even though [H₃O⁺] and therefore acidity still fall." },

{ id:"ym6-07", mod:"M6", topic:"Titration curves", diff:3,
  q:"Which titration produces an equivalence point below pH 7?",
  choices:["Ammonia titrated with hydrochloric acid","Sodium hydroxide with hydrochloric acid","Ethanoic acid with sodium hydroxide","Sodium carbonate with hydrochloric acid"],
  a:0, why:"The salt formed is NH₄Cl, and NH₄⁺ hydrolyses to give H₃O⁺. Weak base with strong acid always gives an acidic equivalence point." },

{ id:"ym6-08", mod:"M6", topic:"Indicators", diff:3,
  q:"An indicator changes colour when the pH passes approximately its:",
  choices:["pKa value","Ka value","pKw value","pOH value"],
  a:0, why:"At pH = pKa the two coloured forms are present in equal amounts, so the visible transition straddles that value by roughly one pH unit either side." },

{ id:"ym6-09", mod:"M6", topic:"Buffers", diff:3,
  q:"A buffer has equal concentrations of a weak acid and its conjugate base. Its pH equals:",
  choices:["The pKa of the weak acid","Exactly 7.00 at any temperature","The pKb of the conjugate base","14 minus the pKa of the acid"],
  a:0, why:"Henderson–Hasselbalch: pH = pKa + log([A⁻]/[HA]). When the ratio is 1, the log term is zero." },

{ id:"ym6-10", mod:"M6", topic:"Volumetric analysis", diff:2,
  q:"Which glassware should be rinsed with distilled water only, never with the solution it holds?",
  choices:["The conical flask receiving the aliquot","The burette delivering the titrant","The pipette measuring the aliquot","The volumetric flask's delivery tip"],
  a:0, why:"Extra water in the flask does not change the moles of analyte delivered by the pipette. Rinsing the burette or pipette with solution prevents dilution errors." },

{ id:"ym6-11", mod:"M6", topic:"Titration calculations", diff:3,
  q:"A 25.00 mL aliquot of Na₂CO₃ needs 22.40 mL of 0.1000 mol L⁻¹ HCl for complete reaction. [Na₂CO₃] equals:",
  choices:["0.04480 mol L⁻¹","0.08960 mol L⁻¹","0.02240 mol L⁻¹","0.1120 mol L⁻¹"],
  a:0, why:"Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. n(HCl) = 2.240 × 10⁻³ mol, so n(Na₂CO₃) = half that. c = 1.120 × 10⁻³ / 0.02500 = 0.04480 mol L⁻¹." },

{ id:"ym6-12", mod:"M6", topic:"Salt hydrolysis", diff:3,
  q:"Which aqueous salt solution has the lowest pH?",
  choices:["Aluminium chloride, AlCl₃","Sodium chloride, NaCl","Potassium nitrate, KNO₃","Sodium ethanoate, CH₃COONa"],
  a:0, why:"The small, highly charged Al³⁺ ion polarises its hydration shell strongly, releasing H₃O⁺. The others are neutral or basic." },

{ id:"ym6-13", mod:"M6", topic:"Acid–base theories", diff:3,
  q:"Which statement about the Brønsted–Lowry model is correct?",
  choices:["It requires an acid and a base in every reaction","It applies only to reactions in aqueous solution","It defines bases as substances producing hydroxide","It was developed before the Arrhenius definition"],
  a:0, why:"A proton donated must be accepted by something, so acid–base behaviour is always a partnership. The model works in any solvent, or none at all." },

{ id:"ym6-14", mod:"M6", topic:"Enthalpy of neutralisation", diff:3,
  q:"Why is the enthalpy of neutralisation almost identical for HCl/NaOH and HNO₃/KOH?",
  choices:["Both reactions are essentially H⁺ + OH⁻ → H₂O","Both salts formed have very similar molar masses","Both acids used have exactly the same Ka value","Both reactions produce exactly one mole of salt"],
  a:0, why:"All four species are fully ionised, so the spectator ions play no part and the same net reaction occurs in each case." },

/* ── Module 7 ─────────────────────────────────────────────────── */
{ id:"ym7-01", mod:"M7", topic:"Nomenclature", diff:3,
  q:"What is the IUPAC name of CH₃CH₂CH₂CHO?",
  choices:["Butanal","Butanone","Butan-1-ol","Butanoic acid"],
  a:0, why:"Four carbons ending in a -CHO group. The aldehyde carbon is always C1, so no locant is needed." },

{ id:"ym7-02", mod:"M7", topic:"Nomenclature", diff:3,
  q:"Which name breaks IUPAC numbering rules?",
  choices:["3-methylbutan-3-ol","2-methylbutan-2-ol","3-methylbutan-2-ol","2-methylbutan-1-ol"],
  a:0, why:"Numbering must give the principal functional group the lowest locant; that carbon would be C2, so the name should be 2-methylbutan-2-ol." },

{ id:"ym7-03", mod:"M7", topic:"Isomers", diff:3,
  q:"How many structural isomers have the molecular formula C₅H₁₂?",
  choices:["3","4","2","5"],
  a:0, why:"Pentane, 2-methylbutane and 2,2-dimethylpropane. C₆H₁₄ has five isomers and C₄H₁₀ has two." },

{ id:"ym7-04", mod:"M7", topic:"Reactions of alkenes", diff:3,
  q:"Which product forms when but-2-ene reacts with hydrogen bromide?",
  choices:["2-bromobutane, as the only product","1-bromobutane, as the major product","Butan-2-ol and hydrogen bromide","1,2-dibromobutane exclusively"],
  a:0, why:"But-2-ene is symmetrical about the double bond, so adding HBr either way puts the bromine on carbon 2. Markovnikov's rule is not needed here." },

{ id:"ym7-05", mod:"M7", topic:"Oxidation of alcohols", diff:3,
  q:"To prepare an aldehyde rather than a carboxylic acid from a primary alcohol you should:",
  choices:["Distil the product off as it forms","Reflux the mixture for several hours","Use an excess of the oxidising agent","Add a strong base before oxidising"],
  a:0, why:"The aldehyde is more volatile than the alcohol and acid, so distilling it out immediately removes it before it can be oxidised further." },

{ id:"ym7-06", mod:"M7", topic:"Esterification", diff:3,
  q:"Concentrated sulfuric acid is used in esterification because it acts as:",
  choices:["A catalyst and a dehydrating agent","An oxidising agent and a solvent","A reducing agent and a catalyst","A base neutralising the carboxylic acid"],
  a:0, why:"It protonates the carbonyl to speed the reaction, and by absorbing the water produced it shifts the equilibrium towards the ester." },

{ id:"ym7-07", mod:"M7", topic:"Polymers", diff:3,
  q:"Which pair of monomers would form a polyester?",
  choices:["A diol and a dicarboxylic acid","A diamine and a dicarboxylic acid","Two different alkene monomers","A diol and a simple monoalcohol"],
  a:0, why:"Ester links form between -OH and -COOH groups. A diamine with a diacid gives amide links and therefore a polyamide such as nylon." },

{ id:"ym7-08", mod:"M7", topic:"Polymers", diff:3,
  q:"A significant environmental problem with most addition polymers is that they:",
  choices:["Are non-biodegradable and persist for centuries","Decompose rapidly into toxic organic acids","Dissolve readily in water and pollute rivers","Release carbon dioxide continuously at 25 °C"],
  a:0, why:"The saturated hydrocarbon backbone has no bonds that common enzymes can attack, so the material fragments physically but does not break down chemically." },

{ id:"ym7-09", mod:"M7", topic:"Soaps and detergents", diff:3,
  q:"In a micelle formed by soap in water, the hydrocarbon tails point:",
  choices:["Inwards, towards the trapped grease","Outwards, towards the surrounding water","Randomly, in no particular direction","Along the surface of the water only"],
  a:0, why:"The non-polar tails cluster around the oil droplet while the ionic heads face the water, keeping the whole micelle suspended." },

{ id:"ym7-10", mod:"M7", topic:"Biofuels", diff:3,
  q:"Compared with petrol, ethanol as a fuel has:",
  choices:["A lower energy density but cleaner combustion","A higher energy density and cleaner combustion","A lower energy density and dirtier combustion","An identical energy density and equal emissions"],
  a:0, why:"Ethanol releases about 30 kJ g⁻¹ against petrol's 48 kJ g⁻¹, but its oxygen content promotes more complete combustion and less particulate output." },

{ id:"ym7-11", mod:"M7", topic:"Functional groups", diff:2,
  q:"Which compound contains an amide linkage?",
  choices:["CH₃CONHCH₃","CH₃COOCH₃","CH₃CH₂NH₂","CH₃COCH₃"],
  a:0, why:"An amide has a carbonyl bonded directly to nitrogen. The second is an ester, the third an amine and the fourth a ketone." },

{ id:"ym7-12", mod:"M7", topic:"Reactions summary", diff:3,
  q:"Which reagent distinguishes an alkene from an alkane at room temperature?",
  choices:["Bromine water, in the absence of light","Sodium metal, freshly cut and dried","Sodium hydroxide solution when warmed","Dilute hydrochloric acid when shaken"],
  a:0, why:"Alkenes decolourise bromine water immediately by addition. Alkanes need UV light to react at all, so keeping it dark makes the test unambiguous." },

{ id:"ym7-13", mod:"M7", topic:"Intermolecular forces", diff:3,
  q:"Why are esters generally more volatile than carboxylic acids of similar molar mass?",
  choices:["Esters cannot hydrogen bond with each other","Esters have much weaker covalent bonding","Esters are ionic and dissociate on heating","Esters have a far lower molar mass overall"],
  a:0, why:"The ester's oxygen has no attached hydrogen, so no O-H hydrogen bonds form between molecules. Acids form strong hydrogen-bonded dimers." },

{ id:"ym7-14", mod:"M7", topic:"Haloalkanes", diff:3,
  q:"Which haloalkane would you expect to hydrolyse most rapidly with aqueous NaOH?",
  choices:["1-iodobutane, with a weak C-I bond","1-chlorobutane, with a strong C-Cl bond","1-fluorobutane, with a very strong C-F bond","Butane itself, which has no halogen"],
  a:0, why:"Rate is governed largely by the carbon–halogen bond strength. C-I is the weakest and breaks most readily; C-F is the strongest by a wide margin." },

/* ── Module 8 ─────────────────────────────────────────────────── */
{ id:"ym8-01", mod:"M8", topic:"Cation tests", diff:3,
  q:"Which pair of cations can be distinguished using a flame test alone?",
  choices:["Sodium and potassium ions","Iron(II) and iron(III) ions","Lead(II) and silver(I) ions","Zinc and aluminium ions"],
  a:0, why:"Sodium gives intense yellow and potassium gives lilac. The other pairs give either no distinctive colour or colours too similar to separate." },

{ id:"ym8-02", mod:"M8", topic:"Anion tests", diff:3,
  q:"A solution gives no precipitate with acidified BaCl₂ and none with acidified AgNO₃. The anion could be:",
  choices:["Nitrate","Sulfate","Chloride","Carbonate"],
  a:0, why:"Nitrates are soluble with every common cation, so no precipitate forms in either test. Carbonate would fizz with the acid used." },

{ id:"ym8-03", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"Which property makes a precipitate suitable for gravimetric analysis?",
  choices:["Very low solubility and a known formula","High solubility and a variable formula","A strong colour that is easy to see","A low melting point for easy drying"],
  a:0, why:"Any dissolved product is lost from the measurement, and the mole calculation needs a definite formula. Colour and melting point are irrelevant." },

{ id:"ym8-04", mod:"M8", topic:"AAS", diff:3,
  q:"Why is a sample usually diluted before AAS analysis?",
  choices:["To bring it within the linear calibration range","To increase the absorbance to a measurable level","To remove interfering metals from the solution","To raise the temperature of the flame used"],
  a:0, why:"Beer–Lambert linearity fails at high concentration, so readings must fall inside the range covered by the standards used to build the curve." },

{ id:"ym8-05", mod:"M8", topic:"Colorimetry", diff:3,
  q:"A blank is run in a colorimetric analysis in order to:",
  choices:["Zero the instrument against the solvent","Calibrate the wavelength of the light source","Provide a second reading for averaging","Confirm that the sample is fully coloured"],
  a:0, why:"The blank contains everything but the analyte, so any absorbance from the cuvette and solvent is subtracted from every subsequent reading." },

{ id:"ym8-06", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"In a mass spectrometer, ions are separated according to their:",
  choices:["Mass-to-charge ratio","Total mass alone","Electrical charge alone","Boiling point and mass"],
  a:0,
  why:"Magnetic and electric fields deflect ions by m/z, so a doubly charged ion appears at half the m/z of the singly charged equivalent." },

{ id:"ym8-07", mod:"M8", topic:"Infrared spectroscopy", diff:3,
  q:"IR spectroscopy detects molecular vibrations only when the vibration:",
  choices:["Changes the molecule's dipole moment","Occurs in a molecule containing carbon","Involves a hydrogen atom directly","Happens above room temperature"],
  a:0, why:"An oscillating dipole is needed to couple with the infrared radiation. This is why symmetrical molecules such as N₂ and O₂ are IR-inactive." },

{ id:"ym8-08", mod:"M8", topic:"¹H NMR", diff:3,
  q:"A ¹H NMR signal split into a doublet indicates the proton has:",
  choices:["One hydrogen on the adjacent carbon","Two hydrogens on the adjacent carbon","One hydrogen in the same environment","Two equivalent hydrogens on itself"],
  a:0, why:"The n+1 rule: n neighbouring protons split a signal into n+1 peaks, so a doublet means exactly one neighbour." },

{ id:"ym8-09", mod:"M8", topic:"¹³C NMR", diff:3,
  q:"How many signals appear in the ¹³C NMR spectrum of propanone, CH₃COCH₃?",
  choices:["2","3","1","4"],
  a:0, why:"The two methyl carbons are equivalent by symmetry and the carbonyl carbon is distinct, giving two environments in total." },

{ id:"ym8-10", mod:"M8", topic:"Chromatography", diff:3,
  q:"Two substances co-elute with identical Rf values. The best next step is to:",
  choices:["Repeat the run with a different solvent","Repeat the run with a longer piece of paper","Increase the size of the original spots","Warm the tank to speed the solvent up"],
  a:0, why:"Rf depends on the mobile phase, so changing the solvent alters the relative affinities and usually separates the components." },

{ id:"ym8-11", mod:"M8", topic:"Water quality", diff:3,
  q:"Which measurement would best indicate recent sewage contamination of a river?",
  choices:["A high biochemical oxygen demand","A high concentration of dissolved oxygen","A low total dissolved solids reading","A low turbidity through the water column"],
  a:0, why:"Sewage is rich in biodegradable organic matter, and the bacteria decomposing it consume large amounts of oxygen, giving a high BOD." },

{ id:"ym8-12", mod:"M8", topic:"Atmospheric monitoring", diff:3,
  q:"Which gas is the main contributor to photochemical smog formation?",
  choices:["Nitrogen dioxide from vehicle exhaust","Carbon dioxide from power stations","Sulfur dioxide from smelting works","Methane from agricultural sources"],
  a:0, why:"NO₂ photolyses in sunlight to give oxygen atoms, which form ground-level ozone and then react with volatile organics to produce smog." },

{ id:"ym8-13", mod:"M8", topic:"Chemical synthesis", diff:3,
  q:"An addition reaction generally has a higher atom economy than a substitution because it:",
  choices:["Incorporates all reactant atoms into the product","Requires no catalyst and therefore less waste","Always proceeds with a higher percentage yield","Uses reactants with far lower molar masses"],
  a:0, why:"In an addition every atom ends up in the product, whereas substitution always expels a leaving group as a by-product." },

{ id:"ym8-14", mod:"M8", topic:"Organic analysis", diff:3,
  q:"An unknown compound has M⁺ at m/z 60, a broad IR band at 3000 cm⁻¹ and a peak at 1715 cm⁻¹. It is most likely:",
  choices:["Ethanoic acid, CH₃COOH","Propan-1-ol, C₃H₇OH","Methyl methanoate, HCOOCH₃","Propanone, CH₃COCH₃"],
  a:0, why:"M = 60 fits all of C₃H₈O and C₂H₄O₂, but the very broad O-H together with a carbonyl peak is characteristic of a carboxylic acid." }
];
