/* Module 4 expansion A — Drivers of Reactions. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM4A = [

/* ── enthalpy ────────────────────────────────────────────── */
{ id:"a4-001", mod:"M4", topic:"Enthalpy", diff:1,
  q:"A reaction with ΔH = −250 kJ/mol is:",
  choices:["Exothermic","Endothermic","Thermally neutral","Always spontaneous"],
  a:0, why:"A negative enthalpy change means energy is released to the surroundings, which warm as a result." },

{ id:"a4-002", mod:"M4", topic:"Enthalpy", diff:2,
  q:"In an exothermic reaction, the total energy released forming bonds is:",
  choices:["Greater than that absorbed breaking bonds","Less than that absorbed breaking bonds","Exactly equal to that absorbed","Unrelated to the bond energies"],
  a:0, why:"ΔH is the difference between bonds broken and bonds formed, so a net release means bond formation dominates." },

{ id:"a4-003", mod:"M4", topic:"Enthalpy", diff:2,
  q:"The standard enthalpy of formation of an element in its standard state is:",
  choices:["Zero by definition","Always negative","Always positive","Equal to its molar mass"],
  a:0, why:"Forming an element from itself involves no change, so it is the agreed reference point for all other values." },

{ id:"a4-004", mod:"M4", topic:"Enthalpy", diff:3,
  q:"Given bond energies, ΔH for a reaction is calculated as:",
  choices:["Bonds broken minus bonds formed","Bonds formed minus bonds broken","Bonds broken plus bonds formed","The average of the two totals"],
  a:0, why:"Breaking absorbs energy (positive) and forming releases it (negative), so subtracting in that order gives the net change." },

{ id:"a4-005", mod:"M4", topic:"Enthalpy", diff:3,
  q:"The enthalpy of combustion of methane is −890 kJ/mol. Burning 0.500 mol releases:",
  choices:["445 kJ","890 kJ","1780 kJ","222 kJ"],
  a:0, why:"Energy scales with amount: 0.500 × 890 = 445 kJ released." },

{ id:"a4-006", mod:"M4", topic:"Enthalpy", diff:3,
  q:"Reversing a reaction changes its enthalpy change by:",
  choices:["Reversing the sign but not the magnitude","Halving the original value","Doubling the original value","Leaving it completely unchanged"],
  a:0, why:"Enthalpy is a state function, so the reverse path costs exactly what the forward path released." },

{ id:"a4-007", mod:"M4", topic:"Enthalpy diagrams", diff:2,
  q:"On an energy profile for an endothermic reaction, the products sit:",
  choices:["Above the reactants","Below the reactants","At the same level","Above the transition state"],
  a:0, why:"Net energy is absorbed, so the product enthalpy is higher than the reactant enthalpy." },

{ id:"a4-008", mod:"M4", topic:"Enthalpy diagrams", diff:3,
  q:"On an energy profile, adding a catalyst changes:",
  choices:["The height of the activation barrier","The enthalpy of the products","The enthalpy of the reactants","The overall value of ΔH"],
  a:0, why:"A catalyst provides a new pathway with a lower peak. The start and end energies are fixed by the substances involved." },

/* ── calorimetry ─────────────────────────────────────────── */
{ id:"a4-009", mod:"M4", topic:"Calorimetry", diff:2,
  q:"In the equation q = mcΔT, the symbol c represents:",
  choices:["Specific heat capacity","Concentration of solution","Total heat capacity","Enthalpy of combustion"],
  a:0, why:"It is the energy needed to raise one gram of the substance by one degree, 4.18 J/g/K for water." },

{ id:"a4-010", mod:"M4", topic:"Calorimetry", diff:2,
  q:"Heating 100 g of water by 10.0 °C requires energy of:",
  choices:["4.18 kJ","41.8 kJ","0.418 kJ","418 kJ"],
  a:0, why:"q = 100 × 4.18 × 10.0 = 4180 J = 4.18 kJ." },

{ id:"a4-011", mod:"M4", topic:"Calorimetry", diff:3,
  q:"Burning 0.100 mol of a fuel raises 500 g of water by 12.0 °C. The enthalpy of combustion is closest to:",
  choices:["−251 kJ/mol","−25.1 kJ/mol","−2510 kJ/mol","+251 kJ/mol"],
  a:0, why:"q = 500 × 4.18 × 12.0 = 25 080 J = 25.1 kJ; dividing by 0.100 mol gives 251 kJ/mol released." },

{ id:"a4-012", mod:"M4", topic:"Calorimetry", diff:3,
  q:"Heat lost to the surroundings during calorimetry makes the calculated enthalpy of combustion:",
  choices:["Less exothermic than the true value","More exothermic than the true value","Exactly equal to the true value","Positive rather than negative"],
  a:0, why:"Less heat reaches the water, so the measured temperature rise underestimates the energy actually released." },

{ id:"a4-013", mod:"M4", topic:"Calorimetry", diff:3,
  q:"Neutralising 50.0 mL of 1.00 mol/L HCl with 50.0 mL of 1.00 mol/L NaOH raises the temperature of 100 g of solution by 6.8 °C. ΔH of neutralisation is closest to:",
  choices:["−56.9 kJ/mol","−28.4 kJ/mol","−5.69 kJ/mol","+56.9 kJ/mol"],
  a:0, why:"q = 100 × 4.18 × 6.8 = 2842 J for 0.0500 mol, so 2842/0.0500 = 56.9 kJ per mole released." },

{ id:"a4-014", mod:"M4", topic:"Calorimetry", diff:3,
  q:"A polystyrene cup is preferred to a glass beaker for solution calorimetry because it:",
  choices:["Insulates better, reducing heat loss","Has a much higher heat capacity","Reacts with neither acid nor base","Allows the mixture to be seen clearly"],
  a:0, why:"Minimising heat exchange with the room is the dominant source of error in a simple calorimeter." },

/* ── Hess's law ──────────────────────────────────────────── */
{ id:"a4-015", mod:"M4", topic:"Hess's law", diff:2,
  q:"Hess's law states that the enthalpy change of a reaction is:",
  choices:["Independent of the pathway taken","Proportional to the reaction rate","Always negative for spontaneous change","Determined solely by activation energy"],
  a:0, why:"Enthalpy is a state function, so only the initial and final states matter — which is what makes indirect routes valid." },

{ id:"a4-016", mod:"M4", topic:"Hess's law", diff:3,
  q:"If A → B has ΔH = −100 kJ and B → C has ΔH = +40 kJ, then A → C has ΔH of:",
  choices:["−60 kJ","−140 kJ","+140 kJ","+60 kJ"],
  a:0, why:"Adding the steps adds the enthalpies: −100 + 40 = −60 kJ." },

{ id:"a4-017", mod:"M4", topic:"Hess's law", diff:3,
  q:"Doubling every coefficient in a thermochemical equation changes ΔH by:",
  choices:["Doubling it","Leaving it unchanged","Halving it","Reversing its sign"],
  a:0, why:"ΔH is quoted per mole of reaction as written, so scaling the equation scales the energy proportionally." },

{ id:"a4-018", mod:"M4", topic:"Hess's law", diff:3,
  q:"Hess's law is particularly useful for reactions that:",
  choices:["Cannot be carried out directly","Are extremely fast","Release no heat at all","Occur only in the gas phase"],
  a:0, why:"Formation of CO without any CO₂, for instance, cannot be measured directly but can be found from an alternative route." },

/* ── entropy ─────────────────────────────────────────────── */
{ id:"a4-019", mod:"M4", topic:"Entropy", diff:1,
  q:"Entropy is best described as a measure of:",
  choices:["Dispersal of energy and matter","Total energy content of a system","Reaction rate","Bond strength"],
  a:0, why:"More accessible microstates means higher entropy, which is why gases exceed liquids and liquids exceed solids." },

{ id:"a4-020", mod:"M4", topic:"Entropy", diff:2,
  q:"Which process has a positive entropy change?",
  choices:["Ice melting to water","Water freezing to ice","Gas condensing to liquid","A precipitate forming"],
  a:0, why:"The liquid state offers far more positional disorder than the fixed lattice of a solid." },

{ id:"a4-021", mod:"M4", topic:"Entropy", diff:2,
  q:"Which reaction has the largest positive ΔS?",
  choices:["CaCO₃(s) → CaO(s) + CO₂(g)","N₂(g) + 3H₂(g) → 2NH₃(g)","H₂O(g) → H₂O(l)","2NO₂(g) → N₂O₄(g)"],
  a:0, why:"A gas is produced from a solid where none existed before, which is the single biggest entropy increase available." },

{ id:"a4-022", mod:"M4", topic:"Entropy", diff:3,
  q:"For N₂(g) + 3H₂(g) → 2NH₃(g), the entropy change is:",
  choices:["Negative, as gas moles decrease","Positive, as gas moles increase","Zero, as mass is conserved","Positive, as a new substance forms"],
  a:0, why:"Four moles of gas become two, so the system's positional disorder falls sharply." },

{ id:"a4-023", mod:"M4", topic:"Entropy", diff:3,
  q:"Dissolving an ionic solid in water usually increases entropy because:",
  choices:["Ordered lattice ions disperse through the solvent","The solution becomes warmer overall","Water molecules become more ordered","New covalent bonds are formed"],
  a:0, why:"Breaking up the lattice greatly increases positional freedom, though solvation shells partly offset it." },

{ id:"a4-024", mod:"M4", topic:"Entropy", diff:3,
  q:"The third law of thermodynamics implies that entropy approaches zero for:",
  choices:["A perfect crystal at absolute zero","Any gas at standard pressure","Water at its freezing point","Any pure element at 25 °C"],
  a:0, why:"With only one possible arrangement and no thermal motion, there is exactly one microstate." },

/* ── Gibbs free energy ───────────────────────────────────── */
{ id:"a4-025", mod:"M4", topic:"Gibbs free energy", diff:1,
  q:"The Gibbs free energy equation is:",
  choices:["ΔG = ΔH − TΔS","ΔG = ΔH + TΔS","ΔG = TΔS − ΔH","ΔG = ΔH × TΔS"],
  a:0, why:"The entropy term is weighted by absolute temperature and subtracted from the enthalpy change." },

{ id:"a4-026", mod:"M4", topic:"Gibbs free energy", diff:2,
  q:"A reaction is spontaneous when ΔG is:",
  choices:["Negative","Positive","Exactly zero","Equal to ΔH"],
  a:0, why:"A negative free energy change means the process can proceed without continuous external input." },

{ id:"a4-027", mod:"M4", topic:"Gibbs free energy", diff:2,
  q:"When ΔG = 0, the system is:",
  choices:["At equilibrium","Reacting at maximum rate","Completely unreactive","Certainly exothermic"],
  a:0, why:"Neither direction is favoured, which is exactly the condition defining equilibrium." },

{ id:"a4-028", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"A reaction with ΔH > 0 and ΔS > 0 is spontaneous:",
  choices:["Only at high temperature","Only at low temperature","At all temperatures","At no temperature"],
  a:0, why:"TΔS must exceed ΔH for ΔG to turn negative, and raising T is what makes that possible." },

{ id:"a4-029", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"A reaction with ΔH < 0 and ΔS < 0 is spontaneous:",
  choices:["Only at low temperature","Only at high temperature","At all temperatures","At no temperature"],
  a:0, why:"The unfavourable −TΔS term grows with temperature, so it eventually overwhelms the favourable enthalpy." },

{ id:"a4-030", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"For a reaction with ΔH = +50.0 kJ/mol and ΔS = +150 J/K/mol, spontaneity begins above:",
  choices:["333 K","300 K","3.33 K","3330 K"],
  a:0, why:"At the crossover ΔG = 0, so T = ΔH/ΔS = 50 000/150 = 333 K. Units must be matched first." },

{ id:"a4-031", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"Calculate ΔG at 298 K for ΔH = −100 kJ/mol and ΔS = −200 J/K/mol:",
  choices:["−40.4 kJ/mol","−159.6 kJ/mol","+40.4 kJ/mol","−100 kJ/mol"],
  a:0, why:"ΔG = −100 − (298 × −0.200) = −100 + 59.6 = −40.4 kJ/mol." },

/* ── spontaneity vs rate ─────────────────────────────────── */
{ id:"a4-032", mod:"M4", topic:"Spontaneity", diff:2,
  q:"Which everyday process is spontaneous but endothermic?",
  choices:["Ice melting at room temperature","Petrol burning in an engine","Iron rusting in damp air","Sodium reacting with water"],
  a:0, why:"Melting absorbs heat, yet the entropy gain of the liquid makes ΔG negative above 0 °C. The other three are all exothermic." },

{ id:"a4-033", mod:"M4", topic:"Spontaneity", diff:3,
  q:"Diamond converting to graphite is thermodynamically spontaneous yet unobserved because:",
  choices:["The activation energy is extremely high","The reaction has a positive ΔG","Entropy decreases during the change","Diamond is the more stable form"],
  a:0, why:"Kinetics and thermodynamics are independent: an enormous barrier can make a favourable reaction immeasurably slow." },

{ id:"a4-034", mod:"M4", topic:"Spontaneity", diff:3,
  q:"Which statement about spontaneity and rate is correct?",
  choices:["A spontaneous reaction may still be very slow","All spontaneous reactions are fast","All fast reactions are spontaneous","Rate determines the sign of ΔG"],
  a:0, why:"ΔG fixes the direction; the activation energy fixes the speed. Neither determines the other." },

/* ── activation energy ───────────────────────────────────── */
{ id:"a4-035", mod:"M4", topic:"Activation energy", diff:2,
  q:"Activation energy is best defined as the minimum energy required to:",
  choices:["Form the transition state","Break every bond in the reactants","Make the reaction exothermic","Reach thermal equilibrium"],
  a:0, why:"It is the barrier from reactants to the highest point on the reaction pathway." },

{ id:"a4-036", mod:"M4", topic:"Activation energy", diff:3,
  q:"Two reactions have the same ΔH but different activation energies. They will differ in:",
  choices:["Rate but not final energy change","Final energy change but not rate","Both rate and final energy change","Neither rate nor energy change"],
  a:0, why:"Ea controls how quickly the barrier is crossed; ΔH is fixed by the reactant and product energies alone." },

/* ── applied and mixed ───────────────────────────────────── */
{ id:"a4-037", mod:"M4", topic:"Enthalpy", diff:3,
  q:"Photosynthesis is endothermic overall. The energy input comes from:",
  choices:["Absorbed sunlight","Heat from the soil","Chemical energy in water","Respiration in the leaf"],
  a:0, why:"Chlorophyll captures photons, supplying the free energy needed to drive a strongly non-spontaneous reaction." },

{ id:"a4-038", mod:"M4", topic:"Entropy", diff:3,
  q:"Living organisms maintain low internal entropy without violating thermodynamics because they:",
  choices:["Increase the entropy of their surroundings","Are exempt from the second law","Have zero entropy change overall","Convert entropy directly into energy"],
  a:0, why:"The second law applies to the total system: local order is paid for by a larger disordering of the environment." },

{ id:"a4-039", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"An endothermic reaction that is spontaneous at room temperature must have:",
  choices:["A sufficiently large positive ΔS","A negative entropy change","A very small activation energy","A negative enthalpy change"],
  a:0, why:"With ΔH positive, only TΔS exceeding it can make ΔG negative — dissolving ammonium nitrate is the classic example." },

{ id:"a4-040", mod:"M4", topic:"Calorimetry", diff:3,
  q:"Specific heat capacity has units of:",
  choices:["J/g/K","J/mol","kJ/mol/K","J/K only"],
  a:0, why:"It is energy per unit mass per unit temperature change, which is why mass appears in q = mcΔT." },

{ id:"a4-041", mod:"M4", topic:"Enthalpy", diff:3,
  q:"Water has an unusually high specific heat capacity mainly because of:",
  choices:["Extensive hydrogen bonding","Its low molar mass","Its high density","Its polar covalent bonds alone"],
  a:0, why:"Much of the added energy goes into disrupting the hydrogen-bond network rather than raising kinetic energy." },

{ id:"a4-042", mod:"M4", topic:"Entropy", diff:2,
  q:"Ranking the states by entropy for one substance gives:",
  choices:["Gas > liquid > solid","Solid > liquid > gas","Liquid > gas > solid","All three are equal"],
  a:0, why:"Positional and energetic freedom increase sharply on melting and again, much more, on vaporising." },

{ id:"a4-043", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"Which combination guarantees spontaneity at every temperature?",
  choices:["ΔH negative and ΔS positive","ΔH positive and ΔS negative","ΔH negative and ΔS negative","ΔH positive and ΔS positive"],
  a:0, why:"Both terms then favour a negative ΔG, so no temperature can reverse the outcome." },

{ id:"a4-044", mod:"M4", topic:"Hess's law", diff:3,
  q:"ΔH°reaction is calculated from formation enthalpies as:",
  choices:["Sum of products minus sum of reactants","Sum of reactants minus sum of products","The sum of all species involved","The average of reactants and products"],
  a:0, why:"Each value is weighted by its coefficient, and elements in their standard states contribute zero." },

{ id:"a4-045", mod:"M4", topic:"Calorimetry", diff:3,
  q:"A student uses 200 g of water instead of 100 g but the same fuel mass. The temperature rise will be:",
  choices:["Roughly half as large","Roughly twice as large","Almost exactly the same","Four times as large"],
  a:0, why:"The same energy spread over twice the mass produces half the change, since ΔT = q/(mc)." },

{ id:"a4-046", mod:"M4", topic:"Enthalpy", diff:3,
  q:"Enthalpy of combustion values are always negative because combustion:",
  choices:["Releases energy to the surroundings","Requires oxygen to proceed","Produces gaseous products","Increases the system's entropy"],
  a:0, why:"Strong C=O and O–H bonds in the products release more energy than breaking the fuel and oxygen bonds absorbs." },

{ id:"a4-047", mod:"M4", topic:"Spontaneity", diff:3,
  q:"Rusting of iron is spontaneous but slow, which shows that ΔG predicts:",
  choices:["Direction of change, not its speed","Speed of change, not its direction","Both direction and speed together","Neither direction nor speed"],
  a:0, why:"Thermodynamics answers whether a change can happen; kinetics answers whether it will happen soon enough to notice." },

{ id:"a4-048", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"Raising temperature makes the entropy term in ΔG:",
  choices:["More influential relative to enthalpy","Less influential relative to enthalpy","Exactly equal to enthalpy","Independent of the entropy value"],
  a:0, why:"TΔS scales linearly with temperature, so at high T entropy dominates the sign of ΔG." },

{ id:"a4-049", mod:"M4", topic:"Enthalpy", diff:3,
  q:"An instant cold pack works because dissolving the salt is:",
  choices:["Endothermic with a large positive ΔS","Exothermic with a large negative ΔS","Endothermic with a negative ΔS","Exothermic with a positive ΔS"],
  a:0, why:"Heat is absorbed from the surroundings, and the entropy gain on dispersing the lattice makes the process spontaneous anyway." },

{ id:"a4-050", mod:"M4", topic:"Activation energy", diff:3,
  q:"Increasing temperature affects the activation energy of a reaction by:",
  choices:["Leaving it essentially unchanged","Lowering it substantially","Raising it substantially","Reducing it to zero"],
  a:0, why:"Ea is a property of the pathway. Heating changes how many molecules can clear the barrier, not the barrier's height." }

];
