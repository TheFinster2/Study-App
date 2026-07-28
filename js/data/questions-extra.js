/* Second question bank — extends every module. IDs are prefixed "x" to keep
   them distinct from the original set. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qExtra = [
/* ── Module 1: Properties and Structure of Matter ─────────────── */
{ id:"xm1-01", mod:"M1", topic:"Separation techniques", diff:2,
  q:"Which technique would best separate two dissolved coloured pigments from a plant extract?",
  choices:["Chromatography","Filtration","Magnetic separation","Decanting"],
  a:0, why:"Both pigments are dissolved, so filtration cannot separate them. Chromatography separates by differing affinity for the stationary versus mobile phase." },

{ id:"xm1-02", mod:"M1", topic:"Elements and compounds", diff:1,
  q:"Which of the following is a pure substance?",
  choices:["Distilled water","Filtered air","Brass","Seawater"],
  a:0, why:"A pure substance has fixed composition and a sharp melting/boiling point. Air, brass and seawater are all mixtures with variable composition." },

{ id:"xm1-03", mod:"M1", topic:"Atomic structure", diff:2,
  q:"Which statement about isotopes is correct?",
  choices:["Same number of protons, different numbers of neutrons","Different numbers of protons but the same neutrons","Noticeably different chemical properties from each other","Always the same mass number as one another"],
  a:0, why:"Isotopes differ only in neutron count, so mass differs but nuclear charge and electron configuration — and therefore chemistry — are essentially identical." },

{ id:"xm1-04", mod:"M1", topic:"Electron configuration", diff:2,
  q:"The ground-state electron configuration of a calcium atom (Z = 20) is:",
  choices:["1s² 2s² 2p⁶ 3s² 3p⁶ 4s²","1s² 2s² 2p⁶ 3s² 3p⁶ 3d²","1s² 2s² 2p⁶ 3s² 3p⁸","1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d¹"],
  a:0, why:"4s fills before 3d because it is lower in energy at this point, giving [Ar]4s² for calcium." },

{ id:"xm1-05", mod:"M1", topic:"Periodic trends", diff:2,
  q:"Which species has the smallest radius?",
  choices:["Al³⁺","Na⁺","Mg²⁺","Ne"],
  a:0, why:"All four are isoelectronic with 10 electrons. The greater the nuclear charge, the more strongly those electrons are pulled in — Al (Z = 13) has the highest." },

{ id:"xm1-06", mod:"M1", topic:"Periodic trends", diff:2,
  q:"Electronegativity generally increases:",
  choices:["Left to right across a period and up a group","Right to left across a period and down a group","Down a group but not across a period","Only among the transition metal elements"],
  a:0, why:"Increasing nuclear charge with similar shielding pulls bonding electrons harder across a period; going up a group the bonding electrons sit closer to the nucleus. Fluorine is the most electronegative element." },

{ id:"xm1-07", mod:"M1", topic:"Bonding", diff:2,
  q:"A compound conducts electricity when molten, has a very high melting point and is brittle. It is most likely:",
  choices:["Ionic","Metallic","Covalent molecular","Covalent network"],
  a:0, why:"Conduction when molten but not solid indicates mobile ions. Brittleness comes from layers of ions shifting so like charges align and repel — metals would deform instead." },

{ id:"xm1-08", mod:"M1", topic:"Bonding", diff:3,
  q:"Silicon dioxide has a much higher melting point than carbon dioxide because:",
  choices:["SiO₂ is a covalent network solid; CO₂ is covalent molecular","SiO₂ is an ionic lattice whereas CO₂ is covalent","CO₂ molecules are held together by hydrogen bonds","Silicon dioxide has the smaller molar mass of the two oxides"],
  a:0, why:"Melting SiO₂ requires breaking strong covalent bonds throughout a 3D lattice. Melting CO₂ only overcomes weak dispersion forces between discrete molecules." },

{ id:"xm1-09", mod:"M1", topic:"Polarity", diff:3,
  q:"Which molecule is non-polar overall despite containing polar bonds?",
  choices:["CO₂","H₂O","NH₃","HCl"],
  a:0, why:"CO₂ is linear, so the two bond dipoles point in opposite directions and cancel. Water and ammonia are bent/pyramidal, so their dipoles add to a net dipole." },

{ id:"xm1-10", mod:"M1", topic:"Intermolecular forces", diff:3,
  q:"Ethanol and dimethyl ether are both C₂H₆O, yet ethanol boils about 100 °C higher. Why?",
  choices:["Ethanol has an O-H group and hydrogen bonds with itself","Dimethyl ether forms a rigid ionic lattice when liquid","Ethanol has the considerably larger molar mass","Dimethyl ether is a covalent network solid"],
  a:0, why:"Hydrogen bonding requires H bonded directly to N, O or F. The ether's oxygen has no attached hydrogen, so its molecules only attract by dipole–dipole and dispersion forces." },

/* ── Module 2: Introduction to Quantitative Chemistry ─────────── */
{ id:"xm2-01", mod:"M2", topic:"The mole", diff:2,
  q:"Which sample contains the greatest number of atoms?",
  choices:["1 mol of CH₄","1 mol of H₂","1 mol of He","1 mol of CO"],
  a:0, why:"Count atoms per formula unit: CH₄ has 5, CO has 2, H₂ has 2, He has 1. One mole of methane therefore contains 5 × 6.022 × 10²³ atoms." },

{ id:"xm2-02", mod:"M2", topic:"Molar mass", diff:1,
  q:"What is the molar mass of Ca(OH)₂?",
  choices:["74.10 g mol⁻¹","57.08 g mol⁻¹","58.08 g mol⁻¹","41.08 g mol⁻¹"],
  a:0, why:"40.08 + 2(16.00 + 1.008) = 40.08 + 34.02 = 74.10 g mol⁻¹. The subscript 2 applies to the whole hydroxide group." },

{ id:"xm2-03", mod:"M2", topic:"Empirical formula", diff:3,
  q:"A 2.50 g sample of a hydrocarbon burns to give 7.86 g CO₂ and 3.22 g H₂O. Its empirical formula is:",
  choices:["CH₂","CH₄","C₂H₅","CH"],
  a:0, why:"n(C) = 7.86/44.01 = 0.1786 mol; n(H) = 2 × 3.22/18.02 = 0.3574 mol. The ratio 0.1786 : 0.3574 is 1 : 2, giving CH₂." },

{ id:"xm2-04", mod:"M2", topic:"Percentage composition", diff:2,
  q:"What is the percentage by mass of nitrogen in ammonium nitrate, NH₄NO₃ (M = 80.05)?",
  choices:["35.0%","17.5%","28.0%","46.7%"],
  a:0, why:"There are 2 nitrogen atoms: (2 × 14.01)/80.05 × 100 = 35.0%. Forgetting the second N is the standard error here." },

{ id:"xm2-05", mod:"M2", topic:"Gas laws", diff:2,
  q:"At constant temperature, doubling the pressure on a fixed mass of gas will:",
  choices:["Halve its volume","Double its volume","Leave the volume unchanged","Quadruple its volume"],
  a:0, why:"Boyle's law: P₁V₁ = P₂V₂, so pressure and volume are inversely proportional at constant temperature." },

{ id:"xm2-06", mod:"M2", topic:"Gas laws", diff:3,
  q:"What mass of oxygen occupies 12.4 L at 25 °C and 100 kPa? (Vm = 24.79 L mol⁻¹, M = 32.00)",
  choices:["16.0 g","32.0 g","8.00 g","24.8 g"],
  a:0, why:"n = 12.4/24.79 = 0.500 mol; m = 0.500 × 32.00 = 16.0 g." },

{ id:"xm2-07", mod:"M2", topic:"Ideal gas law", diff:3,
  q:"Using PV = nRT with R = 8.314 J K⁻¹ mol⁻¹, what is the pressure of 0.500 mol of gas in a 10.0 L vessel at 300 K?",
  choices:["125 kPa","1.25 kPa","12.5 kPa","1250 kPa"],
  a:0, why:"P = nRT/V = (0.500 × 8.314 × 300)/0.0100 m³ = 124 710 Pa ≈ 125 kPa. Volume must be converted to cubic metres." },

{ id:"xm2-08", mod:"M2", topic:"Concentration", diff:2,
  q:"How many moles of HCl are in 25.0 mL of 0.200 mol L⁻¹ solution?",
  choices:["5.00 × 10⁻³ mol","2.00 × 10⁻³ mol","8.00 mol","5.00 mol"],
  a:0, why:"n = cV = 0.200 × 0.0250 L = 5.00 × 10⁻³ mol. Volume must be in litres." },

{ id:"xm2-09", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"What mass of CaO forms when 25.0 g of CaCO₃ decomposes completely? (M: CaCO₃ = 100.09, CaO = 56.08)",
  choices:["14.0 g","25.0 g","11.0 g","56.1 g"],
  a:0, why:"n(CaCO₃) = 25.0/100.09 = 0.2498 mol. The 1:1 ratio gives the same moles of CaO, so m = 0.2498 × 56.08 = 14.0 g." },

{ id:"xm2-10", mod:"M2", topic:"Limiting reagent", diff:3,
  q:"5.00 g of Mg reacts with 10.0 g of HCl. Which is limiting? (Mg + 2HCl → MgCl₂ + H₂; M: Mg 24.31, HCl 36.46)",
  choices:["HCl","Mg","Neither — they are exactly stoichiometric","Cannot be determined"],
  a:0, why:"n(Mg) = 0.2057 mol needs 0.4114 mol HCl. Available HCl = 10.0/36.46 = 0.2743 mol, which is less, so HCl limits." },

{ id:"xm2-11", mod:"M2", topic:"Solution preparation", diff:2,
  q:"Which piece of glassware gives the most accurate fixed volume when preparing a standard solution?",
  choices:["Volumetric flask","Measuring cylinder","Beaker","Conical flask"],
  a:0, why:"A volumetric flask is calibrated to contain one precise volume at a stated temperature. Measuring cylinders and beakers are far less accurate." },

{ id:"xm2-12", mod:"M2", topic:"Significant figures", diff:2,
  q:"A student measures 24.85 mL and 0.0120 mol L⁻¹. The product should be reported to how many significant figures?",
  choices:["3","4","2","5"],
  a:0, why:"When multiplying, the answer takes the fewest significant figures of the inputs. 0.0120 has 3 (leading zeros do not count, the trailing zero does)." },

/* ── Module 3: Reactive Chemistry ─────────────────────────────── */
{ id:"xm3-01", mod:"M3", topic:"Reaction types", diff:2,
  q:"AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq) is best classified as:",
  choices:["Precipitation (double displacement)","Synthesis (combination)","Redox with electron transfer throughout","Decomposition"],
  a:0, why:"The ions swap partners and an insoluble product drops out. No oxidation numbers change, so it is not redox." },

{ id:"xm3-02", mod:"M3", topic:"Metal reactivity", diff:2,
  q:"Which metal will NOT react with dilute hydrochloric acid?",
  choices:["Copper","Zinc","Magnesium","Iron"],
  a:0, why:"Copper lies below hydrogen in the activity series, so it cannot displace H⁺. It only reacts with oxidising acids such as concentrated nitric acid." },

{ id:"xm3-03", mod:"M3", topic:"Redox", diff:2,
  q:"In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, the oxidising agent is:",
  choices:["Cu²⁺","Zn","Zn²⁺","Cu"],
  a:0, why:"The oxidising agent is the species that is itself reduced. Cu²⁺ gains two electrons to become Cu, so it oxidises the zinc." },

{ id:"xm3-04", mod:"M3", topic:"Redox", diff:3,
  q:"What is the oxidation number of sulfur in sodium thiosulfate, Na₂S₂O₃?",
  choices:["+2","+6","−2","+4"],
  a:0, why:"Na is +1 each (+2 total) and O is −2 each (−6 total). For a neutral compound: 2 + 2x − 6 = 0, so x = +2 (an average across the two sulfurs)." },

{ id:"xm3-05", mod:"M3", topic:"Galvanic cells", diff:3,
  q:"In a galvanic cell, electrons flow through the external circuit from:",
  choices:["Anode to cathode","Cathode to anode","Salt bridge to anode","Cathode to salt bridge"],
  a:0, why:"Oxidation at the anode releases electrons, which travel through the wire to the cathode where reduction consumes them. Ions carry the charge inside the cell." },

{ id:"xm3-06", mod:"M3", topic:"Corrosion", diff:2,
  q:"Galvanising protects steel from rusting mainly because zinc:",
  choices:["It is more easily oxidised than iron, so corrodes sacrificially","It is considerably harder than the steel it coats","It stops oxygen from dissolving into the surface water film","It reacts with the iron to form a protective alloy"],
  a:0, why:"Zinc has the more negative reduction potential, so it oxidises preferentially. Protection continues even if the coating is scratched — unlike simple paint." },

{ id:"xm3-07", mod:"M3", topic:"Rates of reaction", diff:2,
  q:"Powdering a solid reactant increases the reaction rate because it:",
  choices:["Increases the surface area available for collisions","Increases the activation energy of the reaction","Raises the temperature of the reacting mixture","Increases the effective concentration of the solid"],
  a:0, why:"More exposed particles means more frequent successful collisions per second. The activation energy is unchanged." },

{ id:"xm3-08", mod:"M3", topic:"Rates of reaction", diff:3,
  q:"On a Maxwell–Boltzmann distribution, adding a catalyst is shown by:",
  choices:["Moving the activation energy line to the left","Shifting the whole distribution curve to the right","Raising the peak height of the distribution","Flattening and broadening the whole curve"],
  a:0, why:"A catalyst lowers Ea, so the line moves left and a greater fraction of the same distribution lies beyond it. Only a temperature change alters the curve's shape." },

{ id:"xm3-09", mod:"M3", topic:"Combustion", diff:2,
  q:"The complete combustion of any hydrocarbon always produces:",
  choices:["Carbon dioxide and water","Carbon monoxide and water","Soot and water","Hydrogen and carbon dioxide"],
  a:0, why:"With sufficient oxygen, every carbon becomes CO₂ and every hydrogen becomes H₂O. Incomplete combustion is what yields CO and carbon." },

{ id:"xm3-10", mod:"M3", topic:"Acid reactions", diff:2,
  q:"Acid + metal hydroxide always produces:",
  choices:["Salt and water","Salt, water and carbon dioxide","Salt and hydrogen","Hydrogen and oxygen"],
  a:0, why:"This is simple neutralisation. Carbon dioxide appears only with carbonates or hydrogen carbonates; hydrogen appears only with reactive metals." },

/* ── Module 4: Drivers of Reactions ───────────────────────────── */
{ id:"xm4-01", mod:"M4", topic:"Enthalpy", diff:2,
  q:"Bond breaking and bond making are respectively:",
  choices:["Endothermic and exothermic","Exothermic and endothermic","Both endothermic","Both exothermic"],
  a:0, why:"Energy must be supplied to pull bonded atoms apart, and energy is released when atoms come together. The net of the two gives ΔH." },

{ id:"xm4-02", mod:"M4", topic:"Enthalpy", diff:3,
  q:"Using bond energies, ΔH for H₂ + Cl₂ → 2HCl is closest to: (H-H 436, Cl-Cl 242, H-Cl 431 kJ mol⁻¹)",
  choices:["−184 kJ mol⁻¹","+184 kJ mol⁻¹","−247 kJ mol⁻¹","−862 kJ mol⁻¹"],
  a:0, why:"ΔH = bonds broken − bonds formed = (436 + 242) − (2 × 431) = 678 − 862 = −184 kJ mol⁻¹." },

{ id:"xm4-03", mod:"M4", topic:"Calorimetry", diff:3,
  q:"Why is the experimental molar heat of combustion from a spirit burner usually much lower in magnitude than the accepted value?",
  choices:["Heat is lost to the surroundings and combustion may be incomplete","The molar mass of the fuel used is far too high to measure","Water has a specific heat capacity that varies with temperature","The thermometer consistently reads several degrees too high"],
  a:0, why:"Only some of the released energy reaches the water; the rest heats the air, the container and the stand. Soot on the base is direct evidence of incomplete combustion." },

{ id:"xm4-04", mod:"M4", topic:"Entropy", diff:2,
  q:"Which change corresponds to a decrease in entropy?",
  choices:["A gas condensing to a liquid","Ice melting to liquid water","A solid dissolving in water","A gas expanding into a vacuum"],
  a:0, why:"Condensation reduces the number of accessible positions and orientations, so disorder — and entropy — falls." },

{ id:"xm4-05", mod:"M4", topic:"Entropy", diff:3,
  q:"For the reaction 2H₂(g) + O₂(g) → 2H₂O(l), the sign of ΔS is:",
  choices:["Negative, because 3 mol of gas become a liquid","Positive, because water molecules are being formed","Zero, because the number of atoms is conserved","Positive, because the reaction is strongly exothermic"],
  a:0, why:"Three moles of gas collapse into a condensed liquid phase, a large decrease in positional disorder. The reaction is still spontaneous because ΔH is strongly negative." },

{ id:"xm4-06", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"A reaction with ΔH > 0 and ΔS < 0 is:",
  choices:["Non-spontaneous at all temperatures","Spontaneous at all temperatures","Spontaneous only at high temperature","Spontaneous only at low temperature"],
  a:0, why:"ΔG = ΔH − TΔS is positive plus a positive quantity at every temperature, so ΔG is always positive. The reverse reaction is always spontaneous." },

{ id:"xm4-07", mod:"M4", topic:"Gibbs free energy", diff:3,
  q:"At what temperature does a reaction with ΔH = −40.0 kJ mol⁻¹ and ΔS = −120 J K⁻¹ mol⁻¹ stop being spontaneous?",
  choices:["Above 333 K","Below 333 K","Above 3.0 K","It is always spontaneous"],
  a:0, why:"ΔG = 0 at T = ΔH/ΔS = 40 000/120 = 333 K. Above this the −TΔS term (positive here) outweighs the negative ΔH." },

{ id:"xm4-08", mod:"M4", topic:"Spontaneity", diff:2,
  q:"A spontaneous reaction is one that:",
  choices:["Occurs without continuous external energy input","Occurs rapidly once the reactants are mixed","Is always exothermic under standard conditions","Always increases the entropy of the system"],
  a:0, why:"Spontaneity is a thermodynamic statement about direction, not speed. Diamond converting to graphite is spontaneous but immeasurably slow." },

{ id:"xm4-09", mod:"M4", topic:"Enthalpy diagrams", diff:2,
  q:"On an energy profile diagram, the activation energy is the difference between:",
  choices:["The reactants and the transition state peak","The reactants and the final products","The products and the transition state peak","The transition state peak and the axis"],
  a:0, why:"Ea is the energy barrier from reactants up to the activated complex. The reactant-to-product difference is ΔH." },

{ id:"xm4-10", mod:"M4", topic:"Hess's law", diff:3,
  q:"Why can Hess's law be applied to any reaction pathway?",
  choices:["Enthalpy is a state function, so ΔH depends only on start and end","Enthalpy is always conserved and released entirely as heat","Every chemical reaction is reversible under the right conditions","The activation energies of each step cancel one another out"],
  a:0, why:"Because H is a state function, the route taken is irrelevant. This lets us calculate ΔH for reactions that cannot be measured directly." },

/* ── Module 5: Equilibrium and Acid Reactions ─────────────────── */
{ id:"xm5-01", mod:"M5", topic:"Dynamic equilibrium", diff:2,
  q:"A sealed bottle of soft drink shows equilibrium between CO₂(g) and CO₂(aq). Opening the bottle causes fizzing because:",
  choices:["Pressure above the liquid drops, shifting equilibrium to CO₂(g)","The temperature of the drink rises sharply on opening","Carbon dioxide becomes far more soluble at the lower pressure","The dissolution reaction becomes irreversible once opened"],
  a:0, why:"Releasing the pressure lowers the partial pressure of CO₂ above the liquid, so dissolved CO₂ escapes to restore equilibrium — an application of Le Chatelier and Henry's law." },

{ id:"xm5-02", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"For CO(g) + 2H₂(g) ⇌ CH₃OH(g), increasing the pressure will:",
  choices:["Shift the equilibrium towards methanol","Shift the equilibrium back towards CO and H₂","Have no effect on the equilibrium position","Decrease the value of the equilibrium constant"],
  a:0, why:"Three moles of gas become one, so compression favours the side with fewer gas particles — the product." },

{ id:"xm5-03", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"For an endothermic reaction, raising the temperature will:",
  choices:["Shift the equilibrium right and increase K","Shift the equilibrium left and decrease K","Shift it right but leave K unchanged","Have no effect on the position or on K"],
  a:0, why:"Heat behaves as a reactant for an endothermic reaction, so adding it drives the system forward. Because temperature is the only variable that alters K, K rises." },

{ id:"xm5-04", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"For 2NO(g) + O₂(g) ⇌ 2NO₂(g), if [NO] = 0.10, [O₂] = 0.20 and [NO₂] = 0.40 mol L⁻¹ at equilibrium, K equals:",
  choices:["80","8.0","0.0125","16"],
  a:0, why:"K = [NO₂]²/([NO]²[O₂]) = 0.16/(0.010 × 0.20) = 0.16/0.0020 = 80." },

{ id:"xm5-05", mod:"M5", topic:"Equilibrium constant", diff:2,
  q:"Units are usually omitted from K values in the HSC course because:",
  choices:["K is defined using activities, which are dimensionless ratios","The equilibrium constant carries no real physical meaning","The concentration units always cancel out exactly","The units of K are always simply mol per litre"],
  a:0, why:"Strictly, each concentration is divided by a standard state, making every term unitless. The units would otherwise vary with the stoichiometry." },

{ id:"xm5-06", mod:"M5", topic:"ICE tables", diff:3,
  q:"0.50 mol of H₂ and 0.50 mol of I₂ are placed in a 1.0 L flask. At equilibrium 0.80 mol of HI has formed. What is [H₂] at equilibrium?",
  choices:["0.10 mol L⁻¹","0.40 mol L⁻¹","0.20 mol L⁻¹","0.30 mol L⁻¹"],
  a:0, why:"H₂ + I₂ ⇌ 2HI. Forming 0.80 mol HI consumes 0.40 mol H₂, leaving 0.50 − 0.40 = 0.10 mol L⁻¹." },

{ id:"xm5-07", mod:"M5", topic:"Reaction quotient", diff:3,
  q:"A mixture has Q = K. This means:",
  choices:["The system is at equilibrium and no net change occurs","The forward reaction will dominate until Q rises","The reverse reaction will dominate until Q falls","The reaction has stopped completely at the particle level"],
  a:0, why:"Q = K defines equilibrium. Both reactions continue at equal rates, so there is no net change in concentration." },

{ id:"xm5-08", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"Ksp for Mg(OH)₂ is 5.6 × 10⁻¹². Its molar solubility is given by:",
  choices:["s = ∛(Ksp/4)","s = √Ksp","s = Ksp/2","s = ∛Ksp"],
  a:0, why:"Mg(OH)₂ → Mg²⁺ + 2OH⁻ gives Ksp = s(2s)² = 4s³, so s = ∛(Ksp/4)." },

{ id:"xm5-09", mod:"M5", topic:"Solubility equilibria", diff:2,
  q:"Increasing the temperature usually increases the solubility of an ionic solid because:",
  choices:["Dissolution is usually endothermic, so heat shifts it right","The solubility product Ksp is independent of temperature","The lattice energy of the solid decreases on heating","Water molecules become significantly more polar"],
  a:0, why:"For most salts ΔH_soln is positive, so adding heat drives dissolution forward and raises Ksp. Some salts, such as Ce₂(SO₄)₃, behave oppositely." },

{ id:"xm5-10", mod:"M5", topic:"Common ion effect", diff:3,
  q:"The solubility of CaF₂ is lowest in which solution?",
  choices:["0.10 mol L⁻¹ NaF","Pure water","0.10 mol L⁻¹ NaCl","0.10 mol L⁻¹ KNO₃"],
  a:0, why:"F⁻ is a common ion, so it suppresses dissolution most strongly. NaCl and KNO₃ contribute only spectator ions." },

{ id:"xm5-11", mod:"M5", topic:"Industrial equilibrium", diff:3,
  q:"In the Haber process, unreacted N₂ and H₂ are recycled because:",
  choices:["Single-pass conversion is low, so recycling raises overall yield","The iron catalyst requires a large excess of gas to stay active","Recycling lowers the temperature the reactor needs to run at","Ammonia would otherwise decompose back to its elements"],
  a:0, why:"Only about 15% converts per pass under the compromise conditions. Condensing out the ammonia and recycling the rest makes the process economic." },

{ id:"xm5-12", mod:"M5", topic:"Catalysts", diff:2,
  q:"Iron is used in the Haber process and vanadium(V) oxide in the Contact process. Both:",
  choices:["Lower the activation energy without shifting the equilibrium","Increase the equilibrium yield of the desired product substantially","Are consumed steadily as the reaction proceeds","Raise the value of the equilibrium constant K"],
  a:0, why:"A heterogeneous catalyst provides a surface for an alternative lower-energy pathway. It is regenerated unchanged and cannot alter the equilibrium position." },

{ id:"xm5-13", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"For Fe³⁺(aq) + SCN⁻(aq) ⇌ [FeSCN]²⁺(aq) (blood red), adding solid NaOH causes the colour to fade because:",
  choices:["OH⁻ precipitates Fe³⁺ as Fe(OH)₃, removing a reactant","OH⁻ attacks the complex directly to give a colourless ion","The temperature drops as the solid sodium hydroxide dissolves","The thiocyanate ion is oxidised by the hydroxide added"],
  a:0, why:"Removing Fe³⁺ from solution shifts the equilibrium left to replace it, decomposing the red complex." },

{ id:"xm5-14", mod:"M5", topic:"Equilibrium graphs", diff:3,
  q:"After a system reaches equilibrium, a catalyst is added. On a rate–time graph this appears as:",
  choices:["Both rates jump equally and remain equal to each other","The forward rate rises above the reverse rate","The reverse rate falls while the forward rate holds","No change at all in either of the two rates"],
  a:0, why:"A catalyst accelerates both directions by the same factor. The rates stay equal, so concentrations never change." },

{ id:"xm5-15", mod:"M5", topic:"Ocean acidification", diff:3,
  q:"Which equation best represents the step that directly lowers ocean pH?",
  choices:["H₂CO₃(aq) ⇌ H⁺(aq) + HCO₃⁻(aq)","CO₂(g) ⇌ CO₂(aq)","CaCO₃(s) ⇌ Ca²⁺(aq) + CO₃²⁻(aq)","CO₂(aq) + H₂O(l) ⇌ H₂CO₃(aq)"],
  a:0, why:"pH depends on [H⁺]. Dissolution and hydration produce carbonic acid, but it is the ionisation step that actually releases protons." },

{ id:"xm5-16", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"Reaction A has K = 1 × 10⁵ and reaction B has K = 1 × 10⁻⁵ at the same temperature. Which is true?",
  choices:["A favours products; B favours reactants","A reaches equilibrium faster than B does","B favours products; A favours reactants","Both sit at equilibrium when concentrations are equal"],
  a:0, why:"A large K means the numerator (products) dominates at equilibrium. K carries no information about rate." },

{ id:"xm5-17", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"Diluting an aqueous equilibrium with water shifts it towards:",
  choices:["The side with more dissolved particles","The side with fewer dissolved particles","Neither side — dilution never causes a shift","The side containing any solid phase present"],
  a:0, why:"Dilution lowers all concentrations, and the system opposes this by shifting to produce more dissolved species — the aqueous analogue of decreasing pressure." },

{ id:"xm5-18", mod:"M5", topic:"Enthalpy of solution", diff:3,
  q:"A salt dissolves and the solution becomes warm. This tells you:",
  choices:["Hydration energy released exceeds lattice energy absorbed","Lattice energy absorbed exceeds hydration energy released","The dissolution process is strongly endothermic overall","The entropy change on dissolving must be negative"],
  a:0, why:"An exothermic dissolution means the energy released as ions are hydrated outweighs the energy needed to break the lattice apart." },

{ id:"xm5-19", mod:"M5", topic:"Precipitation prediction", diff:3,
  q:"For a precipitate to form when two solutions are mixed:",
  choices:["The ionic product Q must exceed Ksp","The ionic product Q must be less than Ksp","The ionic product Q must be exactly equal to Ksp","Both solutions must already be fully saturated"],
  a:0, why:"Q > Ksp means the solution is supersaturated with respect to that salt, so solid forms until Q falls back to Ksp." },

{ id:"xm5-20", mod:"M5", topic:"Equilibrium", diff:3,
  q:"Which change would increase the equilibrium yield of SO₃ in 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH < 0?",
  choices:["Lowering the temperature and raising the pressure","Raising the temperature and lowering the pressure","Adding a catalyst to the reaction vessel","Adding an inert gas at constant volume"],
  a:0, why:"Exothermic favours low temperature; 3 mol → 2 mol favours high pressure. A catalyst changes only the rate, and inert gas at constant volume changes nothing." },

/* ── Module 6: Acid/Base Reactions ────────────────────────────── */
{ id:"xm6-01", mod:"M6", topic:"Acid–base theories", diff:2,
  q:"In the reaction NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, water acts as:",
  choices:["An acid, donating a proton to ammonia","A base, accepting a proton from ammonia","A catalyst, speeding the reaction up","A spectator, taking no chemical part"],
  a:0, why:"Water donates H⁺ to ammonia here, so it is the Brønsted–Lowry acid. With HCl, water instead accepts a proton — it is amphiprotic." },

{ id:"xm6-02", mod:"M6", topic:"Conjugate pairs", diff:2,
  q:"Identify the conjugate acid of the carbonate ion, CO₃²⁻.",
  choices:["HCO₃⁻","H₂CO₃","CO₂","OH⁻"],
  a:0, why:"A conjugate acid is formed by adding one proton: CO₃²⁻ + H⁺ → HCO₃⁻." },

{ id:"xm6-03", mod:"M6", topic:"Historical development", diff:2,
  q:"Lavoisier's early definition of acids was later shown to be wrong because:",
  choices:["He claimed all acids contain oxygen, but HCl does not","He insisted that every acid must be a liquid at 25 °C","He consistently confused acidic and basic behaviour","He ignored the role played by the hydrogen ion"],
  a:0, why:"Davy demonstrated that hydrochloric acid contains only hydrogen and chlorine, disproving oxygen as the essential acidic element and pointing to hydrogen instead." },

{ id:"xm6-04", mod:"M6", topic:"pH calculations", diff:2,
  q:"What is the pH of 0.0025 mol L⁻¹ HNO₃?",
  choices:["2.60","2.40","3.60","11.40"],
  a:0, why:"Nitric acid is strong and monoprotic, so [H₃O⁺] = 2.5 × 10⁻³. pH = −log(2.5 × 10⁻³) = 2.60." },

{ id:"xm6-05", mod:"M6", topic:"pH calculations", diff:3,
  q:"What is the pH of a solution made by diluting 10.0 mL of 0.100 mol L⁻¹ HCl to 1.00 L?",
  choices:["3.00","1.00","2.00","4.00"],
  a:0, why:"n = 0.0100 × 0.100 = 1.00 × 10⁻³ mol in 1.00 L gives 1.00 × 10⁻³ mol L⁻¹, so pH = 3.00." },

{ id:"xm6-06", mod:"M6", topic:"Strong vs weak", diff:3,
  q:"Equal volumes of 0.10 mol L⁻¹ HCl and 0.10 mol L⁻¹ CH₃COOH are each fully neutralised by NaOH. Which requires more NaOH?",
  choices:["Neither — both require exactly the same amount","The hydrochloric acid, since it is fully ionised","The ethanoic acid, since it must keep ionising","It depends on which indicator is chosen"],
  a:0, why:"Neutralisation depends on total moles of acid, not on the degree of ionisation. As the weak acid is consumed it ionises further until all of it has reacted." },

{ id:"xm6-07", mod:"M6", topic:"Ka", diff:3,
  q:"A 0.20 mol L⁻¹ weak acid has pH 3.00. Its Ka is closest to:",
  choices:["5.0 × 10⁻⁶","1.0 × 10⁻³","2.0 × 10⁻⁴","5.0 × 10⁻⁴"],
  a:0, why:"[H₃O⁺] = 1.0 × 10⁻³. Ka ≈ [H₃O⁺]²/c = (1.0 × 10⁻³)²/0.20 = 5.0 × 10⁻⁶." },

{ id:"xm6-08", mod:"M6", topic:"Percentage ionisation", diff:3,
  q:"A 0.10 mol L⁻¹ weak acid has [H₃O⁺] = 1.3 × 10⁻³ mol L⁻¹. Its percentage ionisation is:",
  choices:["1.3%","13%","0.13%","0.013%"],
  a:0, why:"% ionisation = (1.3 × 10⁻³ / 0.10) × 100 = 1.3%. Diluting a weak acid actually increases its percentage ionisation." },

{ id:"xm6-09", mod:"M6", topic:"Polyprotic acids", diff:3,
  q:"Sulfuric acid is described as a strong diprotic acid, but its second ionisation is weak. This means:",
  choices:["The first proton ionises completely; the second only partially","Both of the available protons ionise completely in water","Neither proton ionises completely at normal concentrations","It behaves as a simple monoprotic acid in every case"],
  a:0, why:"H₂SO₄ → H⁺ + HSO₄⁻ is complete, but HSO₄⁻ ⇌ H⁺ + SO₄²⁻ has Ka ≈ 1.2 × 10⁻². Removing a proton from an already negative ion is much harder." },

{ id:"xm6-10", mod:"M6", topic:"Titration curves", diff:3,
  q:"On a strong acid–strong base titration curve, the steep vertical section corresponds to:",
  choices:["A large pH change from a very small added volume","The buffer region of the titration curve","The point of maximum buffering capacity","The very start of the titration, before any base"],
  a:0, why:"Near equivalence almost no excess acid remains, so each drop of base causes a dramatic pH jump. This is why indicator choice matters less for strong–strong titrations." },

{ id:"xm6-11", mod:"M6", topic:"Titration curves", diff:3,
  q:"For a weak acid titrated with a strong base, the pH at half-equivalence equals:",
  choices:["pKa of the acid","7.00","pKb of the conjugate base","14 − pKa"],
  a:0, why:"At half-equivalence [HA] = [A⁻], so the log term in the Henderson–Hasselbalch equation is zero and pH = pKa. This is a standard way to measure Ka." },

{ id:"xm6-12", mod:"M6", topic:"Indicators", diff:2,
  q:"An indicator is itself a:",
  choices:["Weak acid or base whose conjugate forms differ in colour","Strong acid that fully ionises at the end point","Neutral salt that changes colour with dilution","Buffer solution that holds the pH steady near the equivalence point"],
  a:0, why:"HIn ⇌ H⁺ + In⁻ with the two forms differently coloured. The colour flips when pH passes roughly the indicator's pKa." },

{ id:"xm6-13", mod:"M6", topic:"Buffers", diff:3,
  q:"Which mixture would form an effective buffer?",
  choices:["CH₃COOH and CH₃COONa","HCl and NaCl","NaOH and NaCl","HCl and NaOH in equal moles"],
  a:0, why:"A buffer needs a weak acid plus its conjugate base in comparable amounts. The other options contain no weak conjugate pair." },

{ id:"xm6-14", mod:"M6", topic:"Buffers", diff:3,
  q:"A buffer loses its effectiveness when:",
  choices:["Added acid or base exceeds the capacity of one component","Its pH happens to be exactly equal to the acid's pKa","It is warmed slightly above normal room temperature","It has been made from a weak acid rather than a strong one"],
  a:0, why:"Once one component is essentially consumed there is nothing left to neutralise further additions, and the pH then changes sharply. Buffers work best when pH is within about 1 unit of pKa." },

{ id:"xm6-15", mod:"M6", topic:"Titration technique", diff:2,
  q:"Why should the burette tip be filled with solution before the initial reading is taken?",
  choices:["An unfilled tip empties during the titration, raising the titre","It removes any contamination left from the previous titration","It brings the titrant up to the temperature of the room","It stops the titrant evaporating from the burette tip"],
  a:0, why:"If an air gap is expelled mid-titration, the volume recorded includes the bubble's volume even though that solution never reached the flask." },

{ id:"xm6-16", mod:"M6", topic:"Titration calculations", diff:3,
  q:"20.00 mL of 0.150 mol L⁻¹ H₂SO₄ is neutralised by 0.200 mol L⁻¹ NaOH. What volume of NaOH is required?",
  choices:["30.00 mL","15.00 mL","60.00 mL","7.50 mL"],
  a:0, why:"n(H₂SO₄) = 3.00 × 10⁻³ mol. Being diprotic it needs 2 × that in NaOH = 6.00 × 10⁻³ mol. V = 6.00 × 10⁻³/0.200 = 0.0300 L." },

{ id:"xm6-17", mod:"M6", topic:"Back titration", diff:3,
  q:"An antacid is dissolved in 50.0 mL of 0.500 mol L⁻¹ HCl; the excess needs 12.0 mL of 0.500 mol L⁻¹ NaOH. How many moles of acid reacted with the antacid?",
  choices:["1.90 × 10⁻² mol","6.00 × 10⁻³ mol","2.50 × 10⁻² mol","3.10 × 10⁻² mol"],
  a:0, why:"n(HCl) added = 0.0500 × 0.500 = 2.50 × 10⁻² mol; n excess = 0.0120 × 0.500 = 6.00 × 10⁻³ mol. Reacted = 2.50 × 10⁻² − 6.00 × 10⁻³ = 1.90 × 10⁻² mol." },

{ id:"xm6-18", mod:"M6", topic:"Salt hydrolysis", diff:3,
  q:"Which solution is closest to neutral?",
  choices:["KNO₃","NH₄Cl","Na₂CO₃","CH₃COONa"],
  a:0, why:"K⁺ comes from a strong base and NO₃⁻ from a strong acid, so neither hydrolyses. The other three each contain an ion derived from a weak acid or base." },

{ id:"xm6-19", mod:"M6", topic:"Acid rain", diff:2,
  q:"Sulfur dioxide from burning coal contributes to acid rain by:",
  choices:["Oxidising to SO₃, which dissolves to form sulfuric acid","Reacting with atmospheric nitrogen to form nitric acid","Depleting stratospheric ozone and admitting more UV","Dissolving directly in rain to give carbonic acid"],
  a:0, why:"SO₂ oxidises in the atmosphere to SO₃, which reacts with water to give H₂SO₄. Nitrogen oxides similarly give nitric acid." },

{ id:"xm6-20", mod:"M6", topic:"Kw", diff:3,
  q:"If the pH of a neutral solution is 6.80 at some temperature, then at that temperature Kw is:",
  choices:["Greater than 1.0 × 10⁻¹⁴","Less than 1.0 × 10⁻¹⁴","Exactly 1.0 × 10⁻¹⁴","Effectively zero"],
  a:0, why:"Neutral means [H⁺] = [OH⁻] = 10⁻⁶·⁸, so Kw = (10⁻⁶·⁸)² = 10⁻¹³·⁶, which is larger than 10⁻¹⁴. The temperature must be above 25 °C." },

/* ── Module 7: Organic Chemistry ──────────────────────────────── */
{ id:"xm7-01", mod:"M7", topic:"Nomenclature", diff:3,
  q:"What is the IUPAC name of (CH₃)₂CHCH₂CH₂OH?",
  choices:["3-methylbutan-1-ol","2-methylbutan-4-ol","3-methylbutan-4-ol","2-methylpentan-1-ol"],
  a:0, why:"The longest chain containing the -OH is four carbons, numbered from the -OH end to give it position 1. The methyl branch then lands on carbon 3." },

{ id:"xm7-02", mod:"M7", topic:"Nomenclature", diff:2,
  q:"How many carbon atoms are in a molecule of 2,3-dimethylbutane?",
  choices:["6","4","5","8"],
  a:0, why:"The parent chain 'butane' has 4 carbons, plus two methyl branches contributing 1 carbon each, giving 6 in total." },

{ id:"xm7-03", mod:"M7", topic:"Homologous series", diff:2,
  q:"Members of a homologous series always:",
  choices:["Differ by a CH₂ unit and share a general formula","Have essentially identical boiling points to one another","Have the same molar mass as one another","Contain a different functional group each"],
  a:0, why:"Each successive member adds CH₂, so physical properties change gradually and predictably while chemical behaviour stays similar." },

{ id:"xm7-04", mod:"M7", topic:"Isomers", diff:3,
  q:"How many structural isomers have the formula C₃H₈O?",
  choices:["3","2","4","1"],
  a:0, why:"Propan-1-ol, propan-2-ol and methoxyethane. The first two are positional isomers of each other; the ether is a functional group isomer." },

{ id:"xm7-05", mod:"M7", topic:"Reactions of alkanes", diff:2,
  q:"Why do alkanes react only slowly with most reagents?",
  choices:["C-C and C-H bonds are strong and essentially non-polar","They are ionic compounds and so react only with other ions","They contain double bonds that resist attack","They are highly polar and repel most reagents"],
  a:0, why:"With no significant dipole and no π electrons, there is nothing for nucleophiles or electrophiles to attack. Radical substitution needs UV initiation." },

{ id:"xm7-06", mod:"M7", topic:"Reactions of alkenes", diff:3,
  q:"Which reagent would convert propene into 2-bromopropane?",
  choices:["HBr","Br₂","NaBr","Br₂ in water"],
  a:0, why:"Adding HBr across the double bond follows Markovnikov's rule, placing Br on the more substituted carbon. Br₂ would add two bromines." },

{ id:"xm7-07", mod:"M7", topic:"Reactions of alkenes", diff:2,
  q:"Hydrogenation of an alkene with H₂ and a nickel catalyst produces:",
  choices:["An alkane","A primary alcohol","A haloalkane","A carboxylic acid"],
  a:0, why:"H₂ adds across the C=C, saturating it. This is the reaction used to harden vegetable oils into margarine." },

{ id:"xm7-08", mod:"M7", topic:"Haloalkanes", diff:3,
  q:"Reacting 1-bromopropane with hot concentrated KOH dissolved in ethanol favours:",
  choices:["Elimination, giving propene","Substitution, giving propan-1-ol","Oxidation, giving propanoic acid","No reaction"],
  a:0, why:"Alcoholic KOH and heat favour elimination of HBr to form the alkene. Aqueous KOH at lower temperature favours substitution instead — the solvent decides." },

{ id:"xm7-09", mod:"M7", topic:"Alcohols", diff:2,
  q:"Which alcohol is secondary?",
  choices:["Butan-2-ol","Butan-1-ol","2-methylpropan-2-ol","Methanol"],
  a:0, why:"A secondary alcohol has its -OH carbon attached to exactly two other carbons. Butan-1-ol is primary and 2-methylpropan-2-ol is tertiary." },

{ id:"xm7-10", mod:"M7", topic:"Oxidation of alcohols", diff:3,
  q:"Oxidising butan-2-ol with acidified dichromate gives:",
  choices:["Butanone","Butanal","Butanoic acid","No reaction"],
  a:0, why:"Secondary alcohols oxidise to ketones and stop there, because further oxidation would require breaking a carbon–carbon bond." },

{ id:"xm7-11", mod:"M7", topic:"Oxidation of alcohols", diff:2,
  q:"The colour change observed when acidified potassium dichromate oxidises an alcohol is:",
  choices:["Orange to green","Purple to colourless","Green to orange","Colourless to pink"],
  a:0, why:"Orange Cr₂O₇²⁻ is reduced to green Cr³⁺. Acidified permanganate instead goes purple to colourless." },

{ id:"xm7-12", mod:"M7", topic:"Carboxylic acids", diff:2,
  q:"Carboxylic acids are classified as weak acids because they:",
  choices:["They only partially ionise in aqueous solution","They contain no ionisable hydrogen at all","They react with metals to release hydrogen","They have relatively low molar masses"],
  a:0, why:"The equilibrium RCOOH ⇌ RCOO⁻ + H⁺ lies well to the left; ethanoic acid has Ka ≈ 1.8 × 10⁻⁵, so only about 1% ionises at 0.1 mol L⁻¹." },

{ id:"xm7-13", mod:"M7", topic:"Esterification", diff:3,
  q:"Esterification typically gives yields well below 100% because it:",
  choices:["It is a reversible equilibrium reaction","It produces an insoluble solid product","It proceeds without any catalyst present","It is strongly exothermic and self-limiting"],
  a:0, why:"The reverse reaction — acid hydrolysis of the ester — competes. Removing water or using an excess of one reactant shifts the equilibrium towards the ester." },

{ id:"xm7-14", mod:"M7", topic:"Esters", diff:2,
  q:"Esters are commonly used in flavourings and perfumes because they:",
  choices:["They are volatile and have pleasant, fruity odours","They are strong acids with a sharp, sour taste","They are ionic and therefore very water soluble","They have very high boiling points and persist"],
  a:0, why:"Esters cannot hydrogen bond with themselves, so they are relatively volatile — the vapour reaches your nose readily." },

{ id:"xm7-15", mod:"M7", topic:"Esters", diff:3,
  q:"Which ester is formed from propan-1-ol and ethanoic acid?",
  choices:["Propyl ethanoate","Ethyl propanoate","Propyl propanoate","Ethyl ethanoate"],
  a:0, why:"The alcohol supplies the alkyl name (propyl) and the acid supplies the -oate (ethanoate). Reversing them describes a completely different compound." },

{ id:"xm7-16", mod:"M7", topic:"Polymers", diff:2,
  q:"The repeating unit of polypropene is:",
  choices:["-CH₂-CH(CH₃)-","-CH₂-CH₂-","-CH₂-CHCl-","-CH₂-CH(C₆H₅)-"],
  a:0, why:"Propene, CH₂=CHCH₃, opens its double bond leaving a two-carbon backbone unit with a methyl side group." },

{ id:"xm7-17", mod:"M7", topic:"Polymers", diff:3,
  q:"Why is polytetrafluoroethene (Teflon) so chemically inert and non-stick?",
  choices:["Very strong C-F bonds and weak attraction to other substances","It is an ionic polymer with a rigid charged lattice","Extensive hydrogen bonding holds the polymer chains together","It has an unusually low molar mass for a polymer"],
  a:0, why:"C-F is one of the strongest single bonds in organic chemistry, and the fluorinated surface has very low polarisability, so little sticks to it." },

{ id:"xm7-18", mod:"M7", topic:"Biofuels", diff:3,
  q:"A disadvantage of large-scale ethanol biofuel production is that it:",
  choices:["It competes with food crops for arable land and water","Its combustion produces no carbon dioxide at all","It cannot be blended with petrol in any proportion","It burns without producing any combustion products"],
  a:0, why:"Diverting sugarcane or corn to fuel raises food prices and can drive land clearing. Ethanol also has a lower energy density than petrol." },

{ id:"xm7-19", mod:"M7", topic:"Alcohols", diff:2,
  q:"Ethanol is widely used as a solvent because it:",
  choices:["It has both a polar -OH group and a non-polar ethyl group","It is completely non-polar right across the whole molecule","It is ionic and dissociates fully in most solvents","It has a very high boiling point and low volatility"],
  a:0, why:"The dual character lets it dissolve polar substances via hydrogen bonding and non-polar substances via dispersion forces around the alkyl chain." },

{ id:"xm7-20", mod:"M7", topic:"Reactions summary", diff:3,
  q:"Which sequence converts ethene into ethanoic acid?",
  choices:["Hydration, then oxidation under reflux","Oxidation, then hydration with steam","Hydrogenation, then esterification","Polymerisation, then acid hydrolysis"],
  a:0, why:"Ethene + steam with an acid catalyst gives ethanol; refluxing with acidified dichromate then oxidises it fully through ethanal to ethanoic acid." },

/* ── Module 8: Applying Chemical Ideas ────────────────────────── */
{ id:"xm8-01", mod:"M8", topic:"Cation tests", diff:2,
  q:"A colourless solution gives a white precipitate with NaOH that dissolves in excess NaOH. The cation could be:",
  choices:["Pb²⁺","Fe³⁺","Cu²⁺","Ba²⁺"],
  a:0, why:"Lead(II) hydroxide is amphoteric — it redissolves in excess base forming the plumbite ion. Fe³⁺ and Cu²⁺ give coloured precipitates and Ba²⁺ gives none." },

{ id:"xm8-02", mod:"M8", topic:"Flame tests", diff:2,
  q:"Why is a nichrome or platinum wire cleaned with concentrated HCl between flame tests?",
  choices:["To remove residues that would spoil the next result","To make the Bunsen flame burn hotter and more cleanly","To add chloride ions, which intensify the flame colour","To cool the wire down before the next sample is taken"],
  a:0, why:"Traces of sodium in particular produce an intense yellow that masks other colours. Acid converts residues to volatile chlorides that burn off." },

{ id:"xm8-03", mod:"M8", topic:"Anion tests", diff:3,
  q:"A student adds acidified AgNO₃ to a solution and gets a cream precipitate that dissolves only in concentrated ammonia. The anion is:",
  choices:["Bromide","Chloride","Iodide","Sulfate"],
  a:0, why:"AgBr is cream and needs concentrated ammonia. AgCl is white and dissolves in dilute ammonia; AgI is yellow and does not dissolve even in concentrated ammonia." },

{ id:"xm8-04", mod:"M8", topic:"Anion tests", diff:2,
  q:"The test for phosphate involves adding ammonium molybdate and warming, producing:",
  choices:["A yellow precipitate","A white precipitate","A red-brown precipitate","A blue solution"],
  a:0, why:"Ammonium phosphomolybdate is a distinctive yellow solid formed in acidic conditions on gentle warming." },

{ id:"xm8-05", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"In gravimetric analysis, why is the precipitate washed with distilled water before drying?",
  choices:["To remove soluble ions that would add to the measured mass","To dissolve a small, known portion of the precipitate","To cool the sample rapidly before it enters the oven","To convert the precipitate into a denser and purer crystal form"],
  a:0, why:"Adsorbed spectator ions would be weighed along with the precipitate, inflating the calculated result. Washing removes them without dissolving the product." },

{ id:"xm8-06", mod:"M8", topic:"AAS", diff:3,
  q:"Why does AAS use a hollow cathode lamp made of the element being analysed?",
  choices:["It emits exactly the wavelengths the element absorbs","It is considerably cheaper than a broadband lamp","It produces intense white light across the spectrum","It supplies the heat needed to atomise the sample"],
  a:0, why:"Emission and absorption lines of an element coincide, so a lamp of that element gives a very narrow, perfectly matched source that other elements will not absorb." },

{ id:"xm8-07", mod:"M8", topic:"AAS", diff:3,
  q:"An unknown gives an absorbance of 0.42. On a calibration line A = 0.084c (c in ppm), the concentration is:",
  choices:["5.0 ppm","0.20 ppm","2.0 ppm","35 ppm"],
  a:0, why:"c = A/0.084 = 0.42/0.084 = 5.0 ppm. Interpolating within the calibrated range keeps the result reliable." },

{ id:"xm8-08", mod:"M8", topic:"Colorimetry", diff:3,
  q:"Which wavelength should be selected for a colorimetric analysis?",
  choices:["The wavelength of maximum absorbance for the species","The wavelength the solution transmits most strongly","Any convenient wavelength in the visible region","Always 500 nm, the middle of the visible range"],
  a:0, why:"Working at λmax gives the largest signal change per unit concentration, maximising sensitivity and minimising error." },

{ id:"xm8-09", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"A compound of molar mass 46 shows fragment peaks at m/z 31 and 15. This is consistent with:",
  choices:["Ethanol, losing CH₃ to give CH₂OH⁺","Ethanoic acid, losing OH to give CH₃CO⁺","Propane, losing CH₃ to give C₂H₅⁺","Methanol, losing H to give CH₂OH⁺"],
  a:0, why:"M = 46 matches C₂H₆O. Loss of a methyl radical (15) leaves CH₂OH⁺ at m/z 31 — the classic ethanol fragmentation." },

{ id:"xm8-10", mod:"M8", topic:"Infrared spectroscopy", diff:3,
  q:"An IR spectrum shows a strong peak at 1740 cm⁻¹ and no broad band above 3000 cm⁻¹. The compound is most likely:",
  choices:["An ester or else a ketone","A carboxylic acid","A primary alcohol","A primary amine"],
  a:0, why:"A carbonyl is present but there is no O-H or N-H stretch, ruling out acids, alcohols and amines." },

{ id:"xm8-11", mod:"M8", topic:"¹H NMR", diff:3,
  q:"How many signals appear in the ¹H NMR spectrum of ethanol, CH₃CH₂OH?",
  choices:["3","2","1","4"],
  a:0, why:"Three distinct hydrogen environments: the CH₃, the CH₂ and the OH. The OH signal is usually a broad singlet that does not split." },

{ id:"xm8-12", mod:"M8", topic:"¹H NMR", diff:3,
  q:"In ¹H NMR, the area under a signal (its integration) is proportional to:",
  choices:["The number of hydrogens in that environment","The number of hydrogens on adjacent carbons","The chemical shift of the signal in ppm","The molar mass of the whole compound"],
  a:0, why:"Integration gives the relative count of protons per environment. Splitting — not integration — reveals the neighbours via the n+1 rule." },

{ id:"xm8-13", mod:"M8", topic:"¹³C NMR", diff:3,
  q:"How many signals appear in the ¹³C NMR spectrum of benzene?",
  choices:["1","3","6","2"],
  a:0, why:"All six carbons are equivalent by symmetry in the delocalised ring, so they resonate at a single chemical shift." },

{ id:"xm8-14", mod:"M8", topic:"Chromatography", diff:3,
  q:"A spot travels 3.6 cm while the solvent front travels 8.0 cm. Its Rf value is:",
  choices:["0.45","2.22","0.36","4.4"],
  a:0, why:"Rf = 3.6/8.0 = 0.45. It must be between 0 and 1 — a value above 1 means the distances were divided the wrong way round." },

{ id:"xm8-15", mod:"M8", topic:"Chromatography", diff:2,
  q:"Why must the starting spots in paper chromatography sit above the solvent level?",
  choices:["The sample would dissolve into the reservoir instead of rising","The wet paper would tear under its own weight","The solvent would evaporate before it could rise","The separated spots would travel up the paper far too quickly"],
  a:0, why:"Submerging the origin line washes the sample straight off the paper, so no separation occurs." },

{ id:"xm8-16", mod:"M8", topic:"Water quality", diff:3,
  q:"Biochemical oxygen demand (BOD) measures:",
  choices:["Oxygen used by microorganisms decomposing organic matter","The total mass of dissolved solids suspended in the water","The pH of the water sample at the time of collection","The concentration of calcium and magnesium ions present"],
  a:0, why:"A high BOD indicates heavy organic pollution — sewage or runoff — which depletes dissolved oxygen and threatens aquatic life." },

{ id:"xm8-17", mod:"M8", topic:"Water quality", diff:2,
  q:"Why is turbidity monitored in drinking water?",
  choices:["Suspended particles shield pathogens from disinfection","Suspended particles change the pH of the treated water","Turbidity is a direct measure of the dissolved oxygen","Turbidity indicates the total hardness of the supply"],
  a:0, why:"Particulates can physically shelter microorganisms from chlorine or UV treatment, so low turbidity is required before disinfection is considered reliable." },

{ id:"xm8-18", mod:"M8", topic:"Atmospheric monitoring", diff:3,
  q:"Ozone in the stratosphere is beneficial, but ozone at ground level is a pollutant because it:",
  choices:["It is an oxidant that irritates lungs and damages plants","It rises and depletes the protective stratospheric ozone layer","It traps no heat at all, so it cools the lower atmosphere","It reacts with atmospheric nitrogen to produce ammonia"],
  a:0, why:"Tropospheric ozone forms photochemically from NOx and volatile organics and is a major component of photochemical smog." },

{ id:"xm8-19", mod:"M8", topic:"Chemical synthesis", diff:3,
  q:"A reaction has 100% yield but poor atom economy. This means:",
  choices:["All the limiting reagent converted, but much mass is by-product","The reaction produced essentially none of the useful product at all","Some of the limiting reagent was left over unreacted","The reaction was far too slow to be run industrially"],
  a:0, why:"Yield measures conversion efficiency; atom economy measures how much of the reactant mass is in the desired product. Addition reactions have inherently high atom economy." },

{ id:"xm8-20", mod:"M8", topic:"Organic analysis", diff:3,
  q:"An unknown liquid does not react with sodium carbonate, gives no silver mirror with Tollens', but does decolourise bromine water. It is most likely:",
  choices:["An alkene","A carboxylic acid","A simple aldehyde","An alkane"],
  a:0, why:"No effervescence rules out an acid, no silver mirror rules out an aldehyde, and decolourising bromine water indicates a C=C double bond." }
];
