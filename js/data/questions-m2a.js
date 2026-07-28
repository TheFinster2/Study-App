/* Module 2 expansion A — Introduction to Quantitative Chemistry.
   Distractors are deliberately built from real arithmetic slips (wrong ratio,
   forgotten dilution factor, mass used as moles) and matched in length to the key. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM2A = [

/* ── the mole ────────────────────────────────────────────── */
{ id:"a2-001", mod:"M2", topic:"The mole", diff:1,
  q:"How many particles are in 2.0 mol of a substance?",
  choices:["1.2 × 10²⁴","6.0 × 10²³","3.0 × 10²³","1.2 × 10²³"],
  a:0, why:"n × N_A = 2.0 × 6.022 × 10²³ = 1.2 × 10²⁴ particles." },

{ id:"a2-002", mod:"M2", topic:"The mole", diff:1,
  q:"The molar mass of CaCO₃ is closest to:",
  choices:["100.1 g/mol","82.1 g/mol","116.1 g/mol","60.1 g/mol"],
  a:0, why:"40.1 + 12.0 + (3 × 16.0) = 100.1 g/mol." },

{ id:"a2-003", mod:"M2", topic:"The mole", diff:2,
  q:"What amount of substance is present in 8.8 g of CO₂?",
  choices:["0.20 mol","0.40 mol","2.0 mol","0.10 mol"],
  a:0, why:"M(CO₂) = 44.0 g/mol, so n = 8.8 / 44.0 = 0.20 mol." },

{ id:"a2-004", mod:"M2", topic:"The mole", diff:2,
  q:"How many oxygen atoms are in 0.50 mol of H₂SO₄?",
  choices:["1.2 × 10²⁴","3.0 × 10²³","6.0 × 10²³","2.4 × 10²⁴"],
  a:0, why:"Each formula unit holds 4 O atoms, so n(O) = 2.0 mol and N = 2.0 × 6.022 × 10²³ = 1.2 × 10²⁴." },

{ id:"a2-005", mod:"M2", topic:"The mole", diff:2,
  q:"The mass of 0.25 mol of NaOH is:",
  choices:["10.0 g","40.0 g","4.00 g","20.0 g"],
  a:0, why:"M(NaOH) = 23.0 + 16.0 + 1.0 = 40.0 g/mol, so m = 0.25 × 40.0 = 10.0 g." },

{ id:"a2-006", mod:"M2", topic:"The mole", diff:3,
  q:"A sample contains 3.01 × 10²³ molecules of NH₃. Its mass is:",
  choices:["8.5 g","17.0 g","4.3 g","34.0 g"],
  a:0, why:"n = 3.01 × 10²³ / 6.022 × 10²³ = 0.500 mol; m = 0.500 × 17.0 = 8.5 g." },

{ id:"a2-007", mod:"M2", topic:"The mole", diff:3,
  q:"How many hydrogen atoms are present in 0.200 mol of glucose, C₆H₁₂O₆?",
  choices:["1.4 × 10²⁴","2.4 × 10²³","1.2 × 10²³","7.2 × 10²³"],
  a:0, why:"n(H) = 0.200 × 12 = 2.40 mol, so N = 2.40 × 6.022 × 10²³ = 1.4 × 10²⁴ atoms." },

/* ── molar mass and composition ──────────────────────────── */
{ id:"a2-008", mod:"M2", topic:"Percentage composition", diff:2,
  q:"The percentage by mass of nitrogen in NH₄NO₃ is closest to:",
  choices:["35.0%","17.5%","28.0%","46.7%"],
  a:0, why:"Two N atoms give 28.0 g in a molar mass of 80.0 g, so 28.0/80.0 = 35.0%." },

{ id:"a2-009", mod:"M2", topic:"Percentage composition", diff:2,
  q:"The percentage by mass of water in CuSO₄·5H₂O (M = 249.7 g/mol) is closest to:",
  choices:["36.1%","28.8%","18.0%","44.9%"],
  a:0, why:"5 × 18.0 = 90.0 g of water in 249.7 g, giving 90.0/249.7 = 36.1%." },

{ id:"a2-010", mod:"M2", topic:"Percentage composition", diff:3,
  q:"Which compound has the highest percentage by mass of oxygen?",
  choices:["H₂O","CO₂","SO₂","Fe₂O₃"],
  a:0, why:"Water is 16.0/18.0 = 88.9%, well above CO₂ (72.7%), SO₂ (50.0%) and Fe₂O₃ (30.1%)." },

{ id:"a2-011", mod:"M2", topic:"Molar mass", diff:2,
  q:"A 0.150 mol sample has a mass of 9.60 g. Its molar mass is:",
  choices:["64.0 g/mol","1.44 g/mol","16.0 g/mol","144 g/mol"],
  a:0, why:"M = m/n = 9.60 / 0.150 = 64.0 g/mol." },

/* ── empirical and molecular formula ─────────────────────── */
{ id:"a2-012", mod:"M2", topic:"Empirical formula", diff:2,
  q:"A compound is 52.2% C, 13.0% H and 34.8% O by mass. Its empirical formula is:",
  choices:["C₂H₆O","CH₃O","C₂H₄O","CH₂O"],
  a:0, why:"Moles per 100 g: 4.35 C, 13.0 H, 2.18 O. Dividing by 2.18 gives 2 : 6 : 1." },

{ id:"a2-013", mod:"M2", topic:"Empirical formula", diff:2,
  q:"A compound contains 2.4 g C and 0.6 g H. Its empirical formula is:",
  choices:["CH₃","CH₂","C₂H₃","CH₄"],
  a:0, why:"n(C) = 0.20 mol, n(H) = 0.60 mol, giving a ratio of 1 : 3." },

{ id:"a2-014", mod:"M2", topic:"Molecular formula", diff:3,
  q:"A compound has empirical formula CH₂ and molar mass 70.0 g/mol. Its molecular formula is:",
  choices:["C₅H₁₀","C₂H₄","C₄H₈","C₆H₁₂"],
  a:0, why:"The empirical unit weighs 14.0 g/mol and 70.0/14.0 = 5, so every subscript is multiplied by five." },

{ id:"a2-015", mod:"M2", topic:"Molecular formula", diff:3,
  q:"A compound is 92.3% C and 7.7% H with molar mass 78.0 g/mol. Its molecular formula is:",
  choices:["C₆H₆","C₂H₂","CH","C₅H₁₈"],
  a:0, why:"Empirical formula is CH (mass 13.0); 78.0/13.0 = 6, giving benzene." },

{ id:"a2-016", mod:"M2", topic:"Empirical formula", diff:3,
  q:"Heating 2.50 g of hydrated salt leaves 1.60 g anhydrous. The mass of water lost is:",
  choices:["0.90 g","1.60 g","2.50 g","0.45 g"],
  a:0, why:"Water driven off = 2.50 − 1.60 = 0.90 g, which is then converted to moles to find the hydration number." },

/* ── stoichiometry ───────────────────────────────────────── */
{ id:"a2-017", mod:"M2", topic:"Stoichiometry", diff:2,
  q:"For 2H₂ + O₂ → 2H₂O, how many moles of water form from 4.0 mol H₂ with excess O₂?",
  choices:["4.0 mol","2.0 mol","8.0 mol","1.0 mol"],
  a:0, why:"The H₂ : H₂O ratio is 2 : 2, so moles of water equal moles of hydrogen." },

{ id:"a2-018", mod:"M2", topic:"Stoichiometry", diff:2,
  q:"For N₂ + 3H₂ → 2NH₃, how much H₂ is needed to react fully with 2.0 mol N₂?",
  choices:["6.0 mol","2.0 mol","3.0 mol","4.0 mol"],
  a:0, why:"The ratio is 1 : 3, so 2.0 mol of nitrogen consumes 6.0 mol of hydrogen." },

{ id:"a2-019", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"What mass of CO₂ forms when 10.0 g of CaCO₃ decomposes completely?",
  choices:["4.40 g","10.0 g","44.0 g","2.20 g"],
  a:0, why:"n(CaCO₃) = 10.0/100.1 = 0.0999 mol; the ratio is 1 : 1, so m = 0.0999 × 44.0 = 4.40 g." },

{ id:"a2-020", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"Burning 1.0 mol of propane (C₃H₈) completely produces how many moles of water?",
  choices:["4.0 mol","3.0 mol","8.0 mol","1.0 mol"],
  a:0, why:"C₃H₈ + 5O₂ → 3CO₂ + 4H₂O, so eight hydrogen atoms give four water molecules." },

{ id:"a2-021", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"What mass of oxygen is required to burn 16.0 g of methane completely?",
  choices:["64.0 g","32.0 g","16.0 g","48.0 g"],
  a:0, why:"n(CH₄) = 1.00 mol and CH₄ + 2O₂ → CO₂ + 2H₂O, so n(O₂) = 2.00 mol and m = 64.0 g." },

/* ── limiting reagent ────────────────────────────────────── */
{ id:"a2-022", mod:"M2", topic:"Limiting reagent", diff:2,
  q:"The limiting reagent in a reaction is the one that:",
  choices:["Is fully consumed first","Is present in the largest mass","Has the greatest molar mass","Appears first in the equation"],
  a:0, why:"Once it runs out the reaction stops, so it fixes the maximum possible yield regardless of what else remains." },

{ id:"a2-023", mod:"M2", topic:"Limiting reagent", diff:3,
  q:"For 2H₂ + O₂ → 2H₂O, mixing 3.0 mol H₂ with 2.0 mol O₂ gives water of:",
  choices:["3.0 mol","2.0 mol","4.0 mol","6.0 mol"],
  a:0, why:"H₂ needs only 1.5 mol O₂, so hydrogen limits. The 2 : 2 ratio then gives 3.0 mol of water." },

{ id:"a2-024", mod:"M2", topic:"Limiting reagent", diff:3,
  q:"Reacting 0.20 mol Zn with 0.30 mol HCl (Zn + 2HCl → ZnCl₂ + H₂) produces hydrogen of:",
  choices:["0.15 mol","0.20 mol","0.30 mol","0.10 mol"],
  a:0, why:"Zinc would need 0.40 mol of acid, so HCl limits: 0.30/2 = 0.15 mol of H₂." },

{ id:"a2-025", mod:"M2", topic:"Limiting reagent", diff:3,
  q:"In the previous reaction, the amount of zinc left unreacted is:",
  choices:["0.05 mol","0.10 mol","0.15 mol","Zero — all zinc reacts"],
  a:0, why:"0.30 mol HCl consumes 0.15 mol Zn, leaving 0.20 − 0.15 = 0.05 mol of zinc." },

/* ── percentage yield and purity ─────────────────────────── */
{ id:"a2-026", mod:"M2", topic:"Percentage yield", diff:2,
  q:"A reaction with a theoretical yield of 8.0 g gives 6.0 g of product. The percentage yield is:",
  choices:["75%","133%","48%","80%"],
  a:0, why:"Actual over theoretical: 6.0/8.0 × 100 = 75%." },

{ id:"a2-027", mod:"M2", topic:"Percentage yield", diff:3,
  q:"A synthesis has 60% yield and a theoretical yield of 25.0 g. The actual mass obtained is:",
  choices:["15.0 g","41.7 g","10.0 g","20.0 g"],
  a:0, why:"0.60 × 25.0 = 15.0 g of product actually isolated." },

{ id:"a2-028", mod:"M2", topic:"Percentage yield", diff:3,
  q:"Which factor would NOT reduce the percentage yield of a synthesis?",
  choices:["Using an excess of the non-limiting reagent","Loss of product during filtration","A competing side reaction occurring","Incomplete conversion at equilibrium"],
  a:0, why:"Yield is measured against the limiting reagent, so adding more of the other reactant cannot lower it. The other three all remove product or prevent its formation." },

{ id:"a2-029", mod:"M2", topic:"Purity", diff:3,
  q:"A 5.00 g sample of impure CaCO₃ yields 0.0400 mol of CO₂ on full decomposition. Its purity is:",
  choices:["80.1%","40.0%","100%","20.0%"],
  a:0, why:"n(CaCO₃) = 0.0400 mol, so m = 4.00 g of the 5.00 g sample: 4.00/5.00 = 80.1% by mass." },

/* ── concentration ───────────────────────────────────────── */
{ id:"a2-030", mod:"M2", topic:"Concentration", diff:1,
  q:"The concentration of a solution containing 0.50 mol in 2.0 L is:",
  choices:["0.25 mol/L","1.0 mol/L","4.0 mol/L","2.5 mol/L"],
  a:0, why:"c = n/V = 0.50/2.0 = 0.25 mol/L." },

{ id:"a2-031", mod:"M2", topic:"Concentration", diff:2,
  q:"What mass of NaCl is needed to make 250 mL of 0.200 mol/L solution?",
  choices:["2.92 g","11.7 g","5.85 g","1.46 g"],
  a:0, why:"n = 0.200 × 0.250 = 0.0500 mol; m = 0.0500 × 58.5 = 2.92 g." },

{ id:"a2-032", mod:"M2", topic:"Concentration", diff:2,
  q:"A solution contains 4.00 g of NaOH in 500 mL. Its concentration is:",
  choices:["0.200 mol/L","0.100 mol/L","0.400 mol/L","8.00 mol/L"],
  a:0, why:"n = 4.00/40.0 = 0.100 mol in 0.500 L, giving 0.200 mol/L." },

{ id:"a2-033", mod:"M2", topic:"Concentration", diff:3,
  q:"How many moles of chloride ions are in 100 mL of 0.150 mol/L CaCl₂?",
  choices:["0.0300 mol","0.0150 mol","0.150 mol","0.00750 mol"],
  a:0, why:"n(CaCl₂) = 0.0150 mol and each formula unit releases two Cl⁻, so n(Cl⁻) = 0.0300 mol." },

{ id:"a2-034", mod:"M2", topic:"Concentration", diff:3,
  q:"A solution is labelled 20.0 ppm. This is equivalent to:",
  choices:["20.0 mg per litre","20.0 g per litre","2.00 mg per litre","20.0 mg per millilitre"],
  a:0, why:"For dilute aqueous solutions 1 ppm ≈ 1 mg/L, since 1 L of water has a mass near 10⁶ mg." },

/* ── dilution ────────────────────────────────────────────── */
{ id:"a2-035", mod:"M2", topic:"Dilution", diff:2,
  q:"Diluting 25.0 mL of 0.400 mol/L solution to 100.0 mL gives a concentration of:",
  choices:["0.100 mol/L","0.160 mol/L","1.60 mol/L","0.200 mol/L"],
  a:0, why:"c₁V₁ = c₂V₂: (0.400 × 25.0)/100.0 = 0.100 mol/L. Moles are unchanged by adding solvent." },

{ id:"a2-036", mod:"M2", topic:"Dilution", diff:2,
  q:"What volume of 2.00 mol/L stock is needed to prepare 500 mL of 0.150 mol/L solution?",
  choices:["37.5 mL","75.0 mL","150 mL","18.8 mL"],
  a:0, why:"V₁ = c₂V₂/c₁ = (0.150 × 500)/2.00 = 37.5 mL, made up to the mark with water." },

{ id:"a2-037", mod:"M2", topic:"Dilution", diff:3,
  q:"A 10.0 mL aliquot is diluted to 250 mL. The dilution factor is:",
  choices:["25.0","10.0","2.50","250"],
  a:0, why:"Final volume over initial volume: 250/10.0 = 25.0, so the original concentration is 25 times the diluted value." },

{ id:"a2-038", mod:"M2", topic:"Dilution", diff:3,
  q:"Adding water to a solution changes which quantity?",
  choices:["Concentration only, not moles of solute","Moles of solute only, not concentration","Both concentration and moles of solute","Neither concentration nor moles"],
  a:0, why:"Dilution adds solvent, so the same amount of solute now occupies a larger volume." },

/* ── gas laws ────────────────────────────────────────────── */
{ id:"a2-039", mod:"M2", topic:"Gas laws", diff:1,
  q:"The molar volume of an ideal gas at 25 °C and 100 kPa is:",
  choices:["24.79 L/mol","22.71 L/mol","22.41 L/mol","24.00 L/mol"],
  a:0, why:"V = RT/P = (8.314 × 298.15)/100 = 24.79 L/mol at standard laboratory conditions." },

{ id:"a2-040", mod:"M2", topic:"Gas laws", diff:2,
  q:"Boyle's law states that at constant temperature, pressure and volume are:",
  choices:["Inversely proportional","Directly proportional","Equal in magnitude","Completely independent"],
  a:0, why:"PV is constant, so halving the volume of a fixed amount of gas doubles its pressure." },

{ id:"a2-041", mod:"M2", topic:"Gas laws", diff:2,
  q:"A gas occupies 500 mL at 100 kPa. At 250 kPa and constant temperature its volume is:",
  choices:["200 mL","1250 mL","125 mL","800 mL"],
  a:0, why:"P₁V₁ = P₂V₂: (100 × 500)/250 = 200 mL." },

{ id:"a2-042", mod:"M2", topic:"Gas laws", diff:2,
  q:"A gas at 300 K occupies 6.00 L. At 400 K and constant pressure its volume is:",
  choices:["8.00 L","4.50 L","7.00 L","2.00 L"],
  a:0, why:"Charles's law: V₂ = V₁T₂/T₁ = 6.00 × 400/300 = 8.00 L. Temperatures must be absolute." },

{ id:"a2-043", mod:"M2", topic:"Gas laws", diff:3,
  q:"What volume does 0.250 mol of gas occupy at 25 °C and 100 kPa?",
  choices:["6.20 L","5.68 L","24.8 L","12.4 L"],
  a:0, why:"V = n × 24.79 = 0.250 × 24.79 = 6.20 L." },

{ id:"a2-044", mod:"M2", topic:"Ideal gas law", diff:3,
  q:"Using PV = nRT, the amount of gas in 2.00 L at 150 kPa and 300 K is closest to:",
  choices:["0.120 mol","0.240 mol","1.20 mol","0.0600 mol"],
  a:0, why:"n = PV/RT = (150 × 2.00)/(8.314 × 300) = 300/2494 = 0.120 mol, with P in kPa and V in L." },

{ id:"a2-045", mod:"M2", topic:"Ideal gas law", diff:3,
  q:"A 0.500 g sample of gas occupies 400 mL at 100 kPa and 300 K. Its molar mass is closest to:",
  choices:["31.2 g/mol","15.6 g/mol","62.4 g/mol","24.9 g/mol"],
  a:0, why:"n = (100 × 0.400)/(8.314 × 300) = 0.01604 mol, so M = 0.500/0.01604 = 31.2 g/mol." },

{ id:"a2-046", mod:"M2", topic:"Gas laws", diff:3,
  q:"Equal volumes of gases at the same temperature and pressure contain equal numbers of:",
  choices:["Molecules","Atoms","Electrons","Grams of substance"],
  a:0, why:"Avogadro's hypothesis concerns particles, not atoms — a mole of CO₂ and a mole of He hold very different atom counts." },

{ id:"a2-047", mod:"M2", topic:"Gas laws", diff:3,
  q:"Real gases deviate most from ideal behaviour at:",
  choices:["High pressure and low temperature","Low pressure and high temperature","Standard laboratory conditions","Any temperature above 0 °C"],
  a:0, why:"Compression and cooling bring molecules close and slow them, so their volume and mutual attractions stop being negligible." },

/* ── solution preparation and technique ──────────────────── */
{ id:"a2-048", mod:"M2", topic:"Solution preparation", diff:2,
  q:"A standard solution is best prepared using a:",
  choices:["Volumetric flask","Measuring cylinder","Conical flask","Beaker with graduations"],
  a:0, why:"Only a volumetric flask is calibrated to a single accurate volume at a stated temperature." },

{ id:"a2-049", mod:"M2", topic:"Solution preparation", diff:3,
  q:"When making a standard solution, the solid should first be:",
  choices:["Dissolved in a small volume then transferred","Added directly to the filled volumetric flask","Weighed after transferring it to the flask","Heated strongly to drive off any water"],
  a:0, why:"Dissolving in a beaker and rinsing the transfer ensures all the solute reaches the flask before making up to the mark." },

{ id:"a2-050", mod:"M2", topic:"Solution preparation", diff:3,
  q:"Filling a volumetric flask past the graduation mark makes the concentration:",
  choices:["Lower than intended","Higher than intended","Unchanged overall","Impossible to determine"],
  a:0, why:"The moles of solute are fixed, so a larger final volume gives a smaller concentration." },

{ id:"a2-051", mod:"M2", topic:"Errors", diff:3,
  q:"A pipette rinsed with distilled water but not the solution will deliver:",
  choices:["Slightly fewer moles than intended","Slightly more moles than intended","Exactly the intended amount","A completely unrelated volume"],
  a:0, why:"Residual water dilutes the aliquot inside the pipette, so the delivered volume carries less solute." },

{ id:"a2-052", mod:"M2", topic:"Errors", diff:3,
  q:"A burette rinsed only with water before titrating will make the titre:",
  choices:["Larger than the true value","Smaller than the true value","Unaffected by the rinsing","Impossible to read accurately"],
  a:0, why:"Water dilutes the titrant, so more volume must be delivered to supply the same number of moles." },

/* ── significant figures and units ───────────────────────── */
{ id:"a2-053", mod:"M2", topic:"Significant figures", diff:2,
  q:"How many significant figures are in the measurement 0.004070 g?",
  choices:["Four","Three","Five","Seven"],
  a:0, why:"Leading zeros only locate the decimal point; 4, 0, 7 and the trailing 0 are all significant." },

{ id:"a2-054", mod:"M2", topic:"Significant figures", diff:3,
  q:"The result of 2.5 × 3.42 should be reported as:",
  choices:["8.6","8.550","8.55","9"],
  a:0, why:"Multiplication keeps the fewest significant figures of any input, and 2.5 has only two." },

{ id:"a2-055", mod:"M2", topic:"Significant figures", diff:3,
  q:"Adding 12.11 g and 0.3 g should be reported as:",
  choices:["12.4 g","12.41 g","12 g","12.410 g"],
  a:0, why:"Addition keeps the fewest decimal places, and 0.3 g is known only to one." },

{ id:"a2-056", mod:"M2", topic:"Units", diff:2,
  q:"Converting 250 mL to litres gives:",
  choices:["0.250 L","2.50 L","25.0 L","0.0250 L"],
  a:0, why:"There are 1000 mL in a litre, so divide by 1000." },

{ id:"a2-057", mod:"M2", topic:"Units", diff:3,
  q:"A concentration of 0.0500 mol/L is equivalent to:",
  choices:["50.0 mmol/L","5.00 mmol/L","500 mmol/L","0.500 mmol/L"],
  a:0, why:"Multiply by 1000 to convert mol to millimol: 0.0500 × 1000 = 50.0 mmol/L." },

/* ── mixed and applied ──────────────────────────────────── */
{ id:"a2-058", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"What volume of 0.100 mol/L HCl neutralises 25.0 mL of 0.100 mol/L NaOH?",
  choices:["25.0 mL","12.5 mL","50.0 mL","2.50 mL"],
  a:0, why:"The reaction is 1 : 1 and the concentrations are equal, so the volumes must match." },

{ id:"a2-059", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"What volume of 0.200 mol/L H₂SO₄ neutralises 20.0 mL of 0.100 mol/L NaOH?",
  choices:["5.00 mL","10.0 mL","20.0 mL","40.0 mL"],
  a:0, why:"n(NaOH) = 0.00200 mol; the ratio is 2 : 1, so n(H₂SO₄) = 0.00100 mol and V = 0.00100/0.200 = 5.00 mL." },

{ id:"a2-060", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"Excess AgNO₃ added to 50.0 mL of 0.100 mol/L NaCl precipitates AgCl of mass:",
  choices:["0.717 g","1.43 g","0.359 g","7.17 g"],
  a:0, why:"n(Cl⁻) = 0.00500 mol, ratio 1 : 1, so m = 0.00500 × 143.4 = 0.717 g." },

{ id:"a2-061", mod:"M2", topic:"Gas laws", diff:3,
  q:"What volume of CO₂ at 25 °C and 100 kPa forms from 5.00 g of CaCO₃?",
  choices:["1.24 L","2.48 L","0.620 L","24.8 L"],
  a:0, why:"n = 5.00/100.1 = 0.0500 mol; V = 0.0500 × 24.79 = 1.24 L." },

{ id:"a2-062", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"A 0.500 mol/L solution is diluted tenfold, then 20.0 mL is taken. The moles present are:",
  choices:["0.00100 mol","0.0100 mol","0.000100 mol","0.0500 mol"],
  a:0, why:"After dilution c = 0.0500 mol/L, so n = 0.0500 × 0.0200 = 0.00100 mol." },

{ id:"a2-063", mod:"M2", topic:"The mole", diff:3,
  q:"Which sample has the greatest mass?",
  choices:["1.0 mol of Fe","1.0 mol of Al","1.0 mol of C","1.0 mol of O₂"],
  a:0, why:"Molar masses are 55.8, 27.0, 12.0 and 32.0 g/mol, so iron is heaviest at one mole." },

{ id:"a2-064", mod:"M2", topic:"The mole", diff:3,
  q:"Which contains the greatest amount of substance?",
  choices:["10.0 g of He","10.0 g of Ne","10.0 g of Ar","10.0 g of Kr"],
  a:0, why:"For equal masses, the smallest molar mass gives the most moles: 10.0/4.0 = 2.5 mol of helium." },

{ id:"a2-065", mod:"M2", topic:"Percentage composition", diff:3,
  q:"A fertiliser is 21.0% nitrogen by mass. The mass of N in a 50.0 kg bag is:",
  choices:["10.5 kg","21.0 kg","4.20 kg","2.38 kg"],
  a:0, why:"0.210 × 50.0 = 10.5 kg of nitrogen." },

{ id:"a2-066", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"In a reaction with a 2 : 3 mole ratio of A to B, 0.60 mol of A requires B of:",
  choices:["0.90 mol","0.40 mol","1.20 mol","0.30 mol"],
  a:0, why:"0.60 × 3/2 = 0.90 mol of B, so scaling by the ratio the right way round matters." },

{ id:"a2-067", mod:"M2", topic:"Concentration", diff:3,
  q:"Mixing 100 mL of 0.200 mol/L NaCl with 100 mL of water gives a concentration of:",
  choices:["0.100 mol/L","0.200 mol/L","0.400 mol/L","0.0500 mol/L"],
  a:0, why:"Moles are unchanged at 0.0200 mol but the volume doubles to 0.200 L." },

{ id:"a2-068", mod:"M2", topic:"Concentration", diff:3,
  q:"Mixing 50.0 mL of 0.100 mol/L NaCl with 50.0 mL of 0.300 mol/L NaCl gives:",
  choices:["0.200 mol/L","0.400 mol/L","0.150 mol/L","0.100 mol/L"],
  a:0, why:"Total n = 0.00500 + 0.0150 = 0.0200 mol in 0.100 L, giving 0.200 mol/L." },

{ id:"a2-069", mod:"M2", topic:"Empirical formula", diff:3,
  q:"Burning 4.60 g of a compound gives 8.80 g CO₂ and 5.40 g H₂O. The C : H mole ratio is:",
  choices:["1 : 3","1 : 2","2 : 3","1 : 1"],
  a:0, why:"n(C) = 8.80/44.0 = 0.200 mol; n(H) = 2 × 5.40/18.0 = 0.600 mol, giving 1 : 3." },

{ id:"a2-070", mod:"M2", topic:"Limiting reagent", diff:3,
  q:"Mixing 0.10 mol N₂ with 0.10 mol H₂ (N₂ + 3H₂ → 2NH₃) produces ammonia of:",
  choices:["0.067 mol","0.20 mol","0.10 mol","0.30 mol"],
  a:0, why:"Hydrogen limits: 0.10/3 = 0.0333 mol of N₂ reacts, giving 2 × 0.0333 = 0.067 mol NH₃." },

{ id:"a2-071", mod:"M2", topic:"Gas laws", diff:3,
  q:"A fixed mass of gas is heated from 27 °C to 327 °C at constant volume. Its pressure:",
  choices:["Doubles","Increases twelvefold","Halves","Stays the same"],
  a:0, why:"Absolute temperatures are 300 K and 600 K, so pressure scales by 600/300 = 2." },

{ id:"a2-072", mod:"M2", topic:"Errors", diff:3,
  q:"Using a measuring cylinder instead of a pipette to deliver an aliquot mainly increases:",
  choices:["Random uncertainty in the volume","Systematic error in the balance","The molar mass of the solute","The purity of the standard"],
  a:0, why:"Cylinders have much coarser graduations, so repeated deliveries scatter more widely around the intended volume." },

{ id:"a2-073", mod:"M2", topic:"The mole", diff:2,
  q:"The amount of substance in 3.55 g of Cl₂ is:",
  choices:["0.0500 mol","0.100 mol","0.0250 mol","1.00 mol"],
  a:0, why:"M(Cl₂) = 71.0 g/mol, so n = 3.55/71.0 = 0.0500 mol." },

{ id:"a2-074", mod:"M2", topic:"Molar mass", diff:2,
  q:"The molar mass of Al₂(SO₄)₃ is closest to:",
  choices:["342 g/mol","150 g/mol","278 g/mol","123 g/mol"],
  a:0, why:"2(27.0) + 3(32.1) + 12(16.0) = 54.0 + 96.3 + 192.0 = 342 g/mol." },

{ id:"a2-075", mod:"M2", topic:"Concentration", diff:3,
  q:"A 25.0 mL aliquot of 0.0800 mol/L solution contains:",
  choices:["2.00 mmol","0.800 mmol","20.0 mmol","3.20 mmol"],
  a:0, why:"n = 0.0800 × 0.0250 = 0.00200 mol, which is 2.00 mmol." },

{ id:"a2-076", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"Complete combustion of 0.100 mol of ethanol (C₂H₅OH) produces CO₂ of:",
  choices:["0.200 mol","0.100 mol","0.300 mol","0.400 mol"],
  a:0, why:"C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O, so each mole of ethanol gives two of carbon dioxide." },

{ id:"a2-077", mod:"M2", topic:"Percentage yield", diff:3,
  q:"A reaction should give 0.0500 mol of product but yields 0.0350 mol. The percentage yield is:",
  choices:["70.0%","65.0%","143%","35.0%"],
  a:0, why:"0.0350/0.0500 × 100 = 70.0%." },

{ id:"a2-078", mod:"M2", topic:"Ideal gas law", diff:3,
  q:"Which change alone would double the pressure of a fixed amount of ideal gas?",
  choices:["Halving the volume at constant temperature","Halving the absolute temperature","Doubling the volume at constant temperature","Doubling the container's mass"],
  a:0, why:"PV = nRT with n and T fixed means P and V are inversely proportional." },

{ id:"a2-079", mod:"M2", topic:"Units", diff:3,
  q:"A 2.5 ppm solution of lead corresponds to a concentration of:",
  choices:["2.5 mg/L","2.5 g/L","0.25 mg/L","25 mg/L"],
  a:0, why:"For dilute aqueous solutions ppm is milligrams of solute per litre of solution." },

{ id:"a2-080", mod:"M2", topic:"Stoichiometry", diff:3,
  q:"Excess Mg is added to 100 mL of 0.500 mol/L HCl. The hydrogen produced is:",
  choices:["0.0250 mol","0.0500 mol","0.100 mol","0.0125 mol"],
  a:0, why:"n(HCl) = 0.0500 mol and Mg + 2HCl → MgCl₂ + H₂, so n(H₂) = 0.0250 mol." }

];
