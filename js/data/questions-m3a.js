/* Module 3 expansion A — Reactive Chemistry. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM3A = [

/* ── reaction types ──────────────────────────────────────── */
{ id:"a3-001", mod:"M3", topic:"Reaction types", diff:1,
  q:"The reaction 2Mg + O₂ → 2MgO is best classified as:",
  choices:["Synthesis","Decomposition","Displacement","Neutralisation"],
  a:0, why:"Two reactants combine into a single product, which is the defining pattern of a synthesis reaction." },

{ id:"a3-002", mod:"M3", topic:"Reaction types", diff:1,
  q:"The reaction CaCO₃ → CaO + CO₂ is classified as:",
  choices:["Decomposition","Synthesis","Combustion","Precipitation"],
  a:0, why:"One reactant breaks into two products, typically driven by heating." },

{ id:"a3-003", mod:"M3", topic:"Reaction types", diff:2,
  q:"Zn + CuSO₄ → ZnSO₄ + Cu is an example of:",
  choices:["Single displacement","Double displacement","Decomposition","Acid–base reaction"],
  a:0, why:"A more reactive metal displaces a less reactive one from its salt solution." },

{ id:"a3-004", mod:"M3", topic:"Reaction types", diff:2,
  q:"AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq) is best described as:",
  choices:["Precipitation","Single displacement","Redox","Combustion"],
  a:0, why:"Two soluble salts exchange partners and an insoluble solid drops out. No oxidation states change." },

{ id:"a3-005", mod:"M3", topic:"Reaction types", diff:3,
  q:"Which reaction is NOT a redox reaction?",
  choices:["HCl + NaOH → NaCl + H₂O","Zn + 2HCl → ZnCl₂ + H₂","2Mg + O₂ → 2MgO","Fe + CuSO₄ → FeSO₄ + Cu"],
  a:0, why:"Neutralisation is a proton transfer; every element keeps its oxidation state. The other three all involve electron transfer." },

{ id:"a3-006", mod:"M3", topic:"Combustion", diff:2,
  q:"Complete combustion of a hydrocarbon always produces:",
  choices:["Carbon dioxide and water","Carbon monoxide and water","Soot and carbon dioxide","Hydrogen gas and carbon"],
  a:0, why:"With sufficient oxygen every carbon becomes CO₂ and every hydrogen becomes H₂O." },

{ id:"a3-007", mod:"M3", topic:"Combustion", diff:3,
  q:"Incomplete combustion is a concern mainly because it produces:",
  choices:["Toxic carbon monoxide","Additional carbon dioxide","Excess water vapour","Unreacted oxygen gas"],
  a:0, why:"CO binds haemoglobin far more strongly than oxygen does, so it is dangerous at low concentrations." },

/* ── metal reactivity ────────────────────────────────────── */
{ id:"a3-008", mod:"M3", topic:"Metal reactivity", diff:1,
  q:"Which metal reacts most vigorously with cold water?",
  choices:["Potassium","Calcium","Magnesium","Zinc"],
  a:0, why:"Group 1 metals react fastest, and reactivity increases down the group as ionisation energy falls." },

{ id:"a3-009", mod:"M3", topic:"Metal reactivity", diff:2,
  q:"A metal that reacts with dilute acid but not with cold water is likely to be:",
  choices:["Magnesium","Sodium","Copper","Gold"],
  a:0, why:"Magnesium sits mid-series: reactive enough for acid, too unreactive for a fast reaction with cold water." },

{ id:"a3-010", mod:"M3", topic:"Metal reactivity", diff:2,
  q:"Copper does not react with dilute hydrochloric acid because copper is:",
  choices:["Below hydrogen in the activity series","Too dense to dissolve in acid","Already fully oxidised in the metal","Protected by a permanent oxide layer"],
  a:0, why:"Only metals above hydrogen can reduce H⁺ to hydrogen gas, and copper's reduction potential is more positive." },

{ id:"a3-011", mod:"M3", topic:"Metal reactivity", diff:3,
  q:"Which pair would react when mixed?",
  choices:["Mg(s) and Cu²⁺(aq)","Cu(s) and Mg²⁺(aq)","Ag(s) and Cu²⁺(aq)","Au(s) and Zn²⁺(aq)"],
  a:0, why:"A metal displaces the ion of any metal below it in the activity series, and magnesium sits well above copper." },

{ id:"a3-012", mod:"M3", topic:"Metal reactivity", diff:3,
  q:"Aluminium appears unreactive despite being high in the activity series because:",
  choices:["A tough oxide layer protects the surface","Its ionisation energy is unusually high","It is always alloyed with inert metals","It reacts only above 500 °C"],
  a:0, why:"Al₂O₃ forms instantly, adheres tightly and blocks further attack — the basis of anodising." },

/* ── redox and oxidation numbers ─────────────────────────── */
{ id:"a3-013", mod:"M3", topic:"Redox", diff:1,
  q:"Oxidation is best defined as:",
  choices:["Loss of electrons","Gain of electrons","Loss of protons","Gain of oxygen only"],
  a:0, why:"The electron definition covers every redox reaction, including those with no oxygen involved at all." },

{ id:"a3-014", mod:"M3", topic:"Redox", diff:2,
  q:"The oxidation number of sulfur in H₂SO₄ is:",
  choices:["+6","+4","−2","+2"],
  a:0, why:"Hydrogen contributes +2 and four oxygens −8, so sulfur must be +6 for a neutral molecule." },

{ id:"a3-015", mod:"M3", topic:"Redox", diff:2,
  q:"The oxidation number of manganese in MnO₄⁻ is:",
  choices:["+7","+6","+4","+2"],
  a:0, why:"Four oxygens give −8 and the overall charge is −1, so Mn must be +7." },

{ id:"a3-016", mod:"M3", topic:"Redox", diff:2,
  q:"The oxidation number of chromium in Cr₂O₇²⁻ is:",
  choices:["+6","+7","+3","+12"],
  a:0, why:"Seven oxygens give −14 and the ion carries −2, so 2Cr = +12 and each chromium is +6." },

{ id:"a3-017", mod:"M3", topic:"Redox", diff:3,
  q:"In Zn + Cu²⁺ → Zn²⁺ + Cu, the oxidising agent is:",
  choices:["Cu²⁺","Zn","Zn²⁺","Cu"],
  a:0, why:"Cu²⁺ gains electrons and is reduced, so it is the species causing oxidation of the zinc." },

{ id:"a3-018", mod:"M3", topic:"Redox", diff:3,
  q:"In the half-equation MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, permanganate is:",
  choices:["Reduced, acting as an oxidant","Oxidised, acting as a reductant","Neither oxidised nor reduced","Acting only as a catalyst"],
  a:0, why:"Manganese falls from +7 to +2 by gaining five electrons, which is reduction." },

{ id:"a3-019", mod:"M3", topic:"Redox", diff:3,
  q:"Which species can act only as a reducing agent?",
  choices:["Zn(s)","Fe²⁺(aq)","SO₃²⁻(aq)","H₂O₂(aq)"],
  a:0, why:"Zinc metal is already at its lowest oxidation state, so it can only lose electrons. The other three have accessible states both above and below." },

{ id:"a3-020", mod:"M3", topic:"Redox", diff:3,
  q:"Balancing Fe²⁺ → Fe³⁺ in acidic solution requires adding:",
  choices:["One electron to the right","One electron to the left","Two electrons to the right","One H⁺ to the left"],
  a:0, why:"Iron loses one electron going from +2 to +3, so the electron appears as a product." },

/* ── galvanic cells ──────────────────────────────────────── */
{ id:"a3-021", mod:"M3", topic:"Galvanic cells", diff:1,
  q:"In a galvanic cell, oxidation occurs at the:",
  choices:["Anode","Cathode","Salt bridge","External resistor"],
  a:0, why:"By definition oxidation is always at the anode, which is the negative electrode in a galvanic cell." },

{ id:"a3-022", mod:"M3", topic:"Galvanic cells", diff:2,
  q:"The purpose of a salt bridge is to:",
  choices:["Maintain charge balance between half-cells","Carry electrons between electrodes","Provide the reacting ions for the cell","Prevent any ion movement at all"],
  a:0, why:"Ions migrate through it to offset charge build-up. Electrons travel the external wire, not the bridge." },

{ id:"a3-023", mod:"M3", topic:"Galvanic cells", diff:2,
  q:"In a Zn/Cu galvanic cell, which electrode gains mass during discharge?",
  choices:["Copper, as Cu²⁺ is deposited","Zinc, as Zn²⁺ is deposited","Both electrodes gain mass","Neither electrode changes mass"],
  a:0, why:"Cu²⁺ ions are reduced at the cathode and plate onto it, while the zinc anode dissolves away." },

{ id:"a3-024", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"Given E°(Cu²⁺/Cu) = +0.34 V and E°(Zn²⁺/Zn) = −0.76 V, the cell potential is:",
  choices:["+1.10 V","−1.10 V","+0.42 V","−0.42 V"],
  a:0, why:"E°cell = E°cathode − E°anode = 0.34 − (−0.76) = +1.10 V, and the positive value confirms spontaneity." },

{ id:"a3-025", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"A galvanic cell reaction is spontaneous when the cell potential is:",
  choices:["Positive","Negative","Exactly zero","Independent of sign"],
  a:0, why:"ΔG° = −nFE°cell, so a positive potential corresponds to a negative free energy change." },

{ id:"a3-026", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"During discharge of a Zn/Cu cell, the mass of the zinc electrode:",
  choices:["Decreases as zinc is oxidised","Increases as zinc ions deposit","Stays constant throughout","Increases then decreases"],
  a:0, why:"Zinc atoms leave the electrode as Zn²⁺ ions, so the anode is progressively consumed." },

{ id:"a3-027", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"Standard electrode potentials are measured relative to the:",
  choices:["Standard hydrogen electrode","Copper–copper sulfate electrode","Silver–silver chloride electrode","Saturated calomel electrode"],
  a:0, why:"The SHE is assigned exactly 0.00 V by convention, giving every other couple a reference point." },

/* ── rates of reaction ───────────────────────────────────── */
{ id:"a3-028", mod:"M3", topic:"Rates of reaction", diff:1,
  q:"Increasing the temperature of a reaction increases its rate mainly because:",
  choices:["More collisions exceed the activation energy","The activation energy itself decreases","The reaction becomes more exothermic","The reactants become more concentrated"],
  a:0, why:"Raising temperature shifts the Maxwell–Boltzmann distribution so a much larger fraction of collisions are energetic enough." },

{ id:"a3-029", mod:"M3", topic:"Rates of reaction", diff:2,
  q:"Powdering a solid reactant increases the rate because it increases:",
  choices:["Surface area available for collision","The activation energy of the reaction","The concentration of the solid","The temperature of the mixture"],
  a:0, why:"Reaction happens at the solid's surface, so more exposed area means more collision sites per second." },

{ id:"a3-030", mod:"M3", topic:"Collision theory", diff:2,
  q:"For a collision to lead to reaction, particles must have sufficient energy and:",
  choices:["Correct orientation on impact","Identical masses","Opposite electrical charges","The same velocity"],
  a:0, why:"Bonds must break and form in specific geometric positions, so a badly aligned energetic collision still fails." },

{ id:"a3-031", mod:"M3", topic:"Rates of reaction", diff:2,
  q:"Increasing the pressure of a gaseous reaction mixture increases the rate because:",
  choices:["Particles are closer so collisions are more frequent","Each individual collision then carries more energy","The activation energy is lowered","The gas becomes a liquid"],
  a:0, why:"Compression raises concentration. It does not change the energy per collision, which depends on temperature." },

{ id:"a3-032", mod:"M3", topic:"Catalysts", diff:2,
  q:"A heterogeneous catalyst differs from a homogeneous one in that it:",
  choices:["Is in a different phase from the reactants","Is consumed during the reaction","Changes the enthalpy of reaction","Works only at high temperature"],
  a:0, why:"Solid catalysts in a gas or liquid stream are heterogeneous, which is why they are easy to separate and reuse industrially." },

{ id:"a3-033", mod:"M3", topic:"Catalysts", diff:3,
  q:"A catalyst affects which of the following?",
  choices:["The rate of both forward and reverse reactions","Only the forward reaction rate","The overall enthalpy change","The final position of equilibrium"],
  a:0, why:"Lowering the activation barrier speeds both directions equally, so equilibrium is reached sooner but at the same position." },

{ id:"a3-034", mod:"M3", topic:"Rates of reaction", diff:3,
  q:"On an energy profile diagram, the activation energy is the difference between:",
  choices:["Reactants and the transition state","Reactants and products","Products and the transition state","The catalysed and uncatalysed peaks"],
  a:0, why:"Ea is the barrier that must be climbed from the reactant energy to the peak of the profile." },

{ id:"a3-035", mod:"M3", topic:"Rates of reaction", diff:3,
  q:"A reaction producing gas is monitored by mass loss. The rate is greatest:",
  choices:["At the very start of the reaction","Halfway through the reaction","Just before the reaction stops","Constantly throughout the reaction"],
  a:0, why:"Reactant concentration is highest initially, so collision frequency and therefore rate peak at t = 0." },

/* ── corrosion ───────────────────────────────────────────── */
{ id:"a3-036", mod:"M3", topic:"Corrosion", diff:2,
  q:"Hydrated iron(III) oxide, the main component of rust, has the formula:",
  choices:["Fe₂O₃·xH₂O","FeO·xH₂O","Fe(OH)₂","Fe₃O₄"],
  a:0, why:"Iron is oxidised all the way to the +3 state and the flaky product retains a variable amount of water." },

{ id:"a3-037", mod:"M3", topic:"Corrosion", diff:3,
  q:"Galvanising protects steel because zinc:",
  choices:["Is oxidised in preference to iron","Forms a decorative outer coating","Chemically neutralises acid rain","Increases the steel's hardness"],
  a:0, why:"Zinc is the more active metal, so it acts as a sacrificial anode and continues protecting even where the coating is scratched." },

{ id:"a3-038", mod:"M3", topic:"Corrosion", diff:3,
  q:"Attaching magnesium blocks to a steel ship's hull is an example of:",
  choices:["Cathodic protection","Anodising the surface","Passivation by oxide","Electroplating the hull"],
  a:0, why:"Magnesium oxidises preferentially and forces the steel to become the cathode, so the hull is not corroded." },

{ id:"a3-039", mod:"M3", topic:"Corrosion", diff:3,
  q:"Corrosion of iron occurs faster in seawater than in fresh water because:",
  choices:["Dissolved ions improve electrolyte conductivity","Seawater contains far more oxygen","Salt lowers the activation energy","Seawater is significantly more acidic"],
  a:0, why:"A better electrolyte carries the corrosion current more easily, so the electrochemical cells operate faster." },

/* ── acid reactions ──────────────────────────────────────── */
{ id:"a3-040", mod:"M3", topic:"Acid reactions", diff:1,
  q:"Reacting a metal carbonate with a dilute acid produces a salt, water and:",
  choices:["Carbon dioxide","Hydrogen","Oxygen","Ammonia"],
  a:0, why:"Carbonates release CO₂, which is why effervescence and a positive limewater test identify them." },

{ id:"a3-041", mod:"M3", topic:"Acid reactions", diff:2,
  q:"Reacting an active metal with dilute acid produces a salt and:",
  choices:["Hydrogen","Water","Carbon dioxide","Oxygen"],
  a:0, why:"The metal reduces H⁺ ions to hydrogen gas, which gives the characteristic squeaky pop test." },

{ id:"a3-042", mod:"M3", topic:"Acid reactions", diff:2,
  q:"The reaction of a metal oxide with an acid produces:",
  choices:["A salt and water only","A salt and hydrogen only","A salt and carbon dioxide","An alkali and hydrogen"],
  a:0, why:"Metal oxides are basic, so neutralisation gives salt plus water with no gas evolved." },

{ id:"a3-043", mod:"M3", topic:"Acid reactions", diff:3,
  q:"Which observation distinguishes a carbonate from a metal when acid is added?",
  choices:["The gas turns limewater milky","The gas gives a squeaky pop","The solution becomes warm","A solid residue remains"],
  a:0, why:"Both fizz, but only carbonate releases CO₂. A metal releases hydrogen, which pops rather than clouding limewater." },

/* ── precipitation ───────────────────────────────────────── */
{ id:"a3-044", mod:"M3", topic:"Precipitation", diff:2,
  q:"Which combination produces a precipitate?",
  choices:["Ba²⁺(aq) and SO₄²⁻(aq)","Na⁺(aq) and NO₃⁻(aq)","K⁺(aq) and Cl⁻(aq)","NH₄⁺(aq) and NO₃⁻(aq)"],
  a:0, why:"Barium sulfate is insoluble. All sodium, potassium, ammonium and nitrate salts are soluble." },

{ id:"a3-045", mod:"M3", topic:"Precipitation", diff:3,
  q:"The net ionic equation for mixing AgNO₃ and NaCl solutions is:",
  choices:["Ag⁺ + Cl⁻ → AgCl","Ag⁺ + NO₃⁻ → AgNO₃","Na⁺ + Cl⁻ → NaCl","AgNO₃ + NaCl → AgCl + NaNO₃"],
  a:0, why:"Spectator ions Na⁺ and NO₃⁻ stay dissolved and are omitted from the net ionic equation." },

{ id:"a3-046", mod:"M3", topic:"Precipitation", diff:3,
  q:"Which salt is insoluble in water?",
  choices:["Lead(II) iodide","Sodium sulfate","Potassium nitrate","Ammonium chloride"],
  a:0, why:"Most iodides are soluble but lead is a standard exception, producing the bright yellow PbI₂ precipitate." },

/* ── energy and reaction profiles ────────────────────────── */
{ id:"a3-047", mod:"M3", topic:"Energy changes", diff:2,
  q:"An exothermic reaction is one in which:",
  choices:["Energy is released to the surroundings","Energy is absorbed from the surroundings","No energy change occurs at all","Only the activation energy changes"],
  a:0, why:"Bond forming releases more energy than bond breaking absorbs, so ΔH is negative and the surroundings warm." },

{ id:"a3-048", mod:"M3", topic:"Energy changes", diff:3,
  q:"In an endothermic reaction, the products have:",
  choices:["Higher enthalpy than the reactants","Lower enthalpy than the reactants","Exactly the same enthalpy","Zero enthalpy by definition"],
  a:0, why:"Net energy is absorbed, so the product energy level sits above the reactants on the profile and ΔH is positive." },

{ id:"a3-049", mod:"M3", topic:"Energy changes", diff:3,
  q:"Breaking chemical bonds is always:",
  choices:["Endothermic","Exothermic","Thermally neutral","Spontaneous at all temperatures"],
  a:0, why:"Energy must be supplied to overcome the attraction holding bonded atoms together; forming bonds releases it." },

/* ── mixed reasoning ─────────────────────────────────────── */
{ id:"a3-050", mod:"M3", topic:"Metal reactivity", diff:3,
  q:"A metal X displaces Y from solution, and Y displaces Z. The correct order of reactivity is:",
  choices:["X > Y > Z","Z > Y > X","Y > X > Z","X > Z > Y"],
  a:0, why:"Displacement runs from more reactive to less reactive, so each observation places one metal above the next." },

{ id:"a3-051", mod:"M3", topic:"Redox", diff:3,
  q:"In 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu, the number of electrons transferred per aluminium atom is:",
  choices:["Three","Two","Six","One"],
  a:0, why:"Aluminium goes from 0 to +3, losing three electrons; six electrons move in total for the equation as written." },

{ id:"a3-052", mod:"M3", topic:"Rates of reaction", diff:3,
  q:"Doubling the concentration of a reactant doubles the rate. The reaction is:",
  choices:["First order in that reactant","Zero order in that reactant","Second order in that reactant","Independent of concentration"],
  a:0, why:"Rate proportional to concentration to the power one is the definition of first-order behaviour in that species." },

{ id:"a3-053", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"A cell is constructed from the couples Ag⁺/Ag (+0.80 V) and Ni²⁺/Ni (−0.25 V). The anode is:",
  choices:["Nickel","Silver","Both electrodes equally","Neither — the cell is inert"],
  a:0, why:"The more negative potential is oxidised, so nickel is the anode and the cell delivers 1.05 V." },

{ id:"a3-054", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"A dry cell eventually goes flat because:",
  choices:["Reactants are consumed and cannot be replaced","The electrodes physically fall apart","The salt bridge dries out completely","Electrons are permanently destroyed"],
  a:0, why:"A primary cell's reaction is not readily reversible, so once the limiting reactant is used up the potential collapses." },

{ id:"a3-055", mod:"M3", topic:"Reaction types", diff:3,
  q:"Which classification applies to 2H₂O₂ → 2H₂O + O₂?",
  choices:["Decomposition and redox","Synthesis and redox","Decomposition only","Displacement only"],
  a:0, why:"One reactant gives two products, and oxygen goes from −1 in peroxide to both −2 and 0, so it is also a disproportionation." },

{ id:"a3-056", mod:"M3", topic:"Rates of reaction", diff:3,
  q:"Which change would NOT increase the rate of a reaction between marble chips and acid?",
  choices:["Adding more water to the acid","Warming the acid before mixing","Crushing the marble chips finely","Using a more concentrated acid"],
  a:0, why:"Dilution lowers H⁺ concentration, reducing collision frequency. The other three all increase it." },

{ id:"a3-057", mod:"M3", topic:"Corrosion", diff:3,
  q:"Tin plating protects steel less reliably than zinc plating because tin is:",
  choices:["Less reactive than iron","More reactive than iron","Softer than iron","A poorer electrical conductor"],
  a:0, why:"If the tin layer is scratched, iron becomes the anode and corrodes faster. Zinc keeps protecting even when damaged." },

{ id:"a3-058", mod:"M3", topic:"Redox", diff:3,
  q:"The oxidation number of oxygen in hydrogen peroxide is:",
  choices:["−1","−2","0","+1"],
  a:0, why:"The O–O bond splits electrons evenly, so each oxygen is −1 rather than the usual −2." },

{ id:"a3-059", mod:"M3", topic:"Redox", diff:3,
  q:"Which is the strongest oxidising agent among these standard couples?",
  choices:["F₂ (+2.87 V)","Cl₂ (+1.36 V)","Br₂ (+1.09 V)","I₂ (+0.54 V)"],
  a:0, why:"The most positive reduction potential means the greatest tendency to gain electrons." },

{ id:"a3-060", mod:"M3", topic:"Acid reactions", diff:3,
  q:"Adding excess magnesium to a fixed volume of dilute HCl means the final volume of hydrogen depends on:",
  choices:["The moles of acid present","The mass of magnesium added","The surface area of the metal","The temperature of the acid"],
  a:0, why:"Acid is limiting, so it fixes the yield. Surface area and temperature change how fast the gas appears, not how much." }

];
