/* Module 8 — Applying Chemical Ideas (analysis, instrumentation, monitoring) */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM8 = [
{ id:"m8-01", mod:"M8", topic:"Cation tests", diff:2,
  q:"A solution gives a red-brown precipitate with NaOH. The cation is most likely:",
  choices:["Fe³⁺","Fe²⁺","Cu²⁺","Ba²⁺"],
  a:0, why:"Fe(OH)₃ is a distinctive red-brown gelatinous precipitate. Fe²⁺ gives green Fe(OH)₂ that darkens as it oxidises, and Cu²⁺ gives pale blue Cu(OH)₂." },

{ id:"m8-02", mod:"M8", topic:"Flame tests", diff:1,
  q:"An apple-green flame test indicates the presence of:",
  choices:["Ba²⁺","Ca²⁺","Cu²⁺","Na⁺"],
  a:0, why:"Barium gives apple green. Calcium is brick red, copper is blue-green, and sodium's intense yellow can mask other colours — a cobalt-blue glass filter helps." },

{ id:"m8-03", mod:"M8", topic:"Anion tests", diff:2,
  q:"Adding dilute HCl to an unknown solid produces a gas that turns limewater milky. The anion is:",
  choices:["Carbonate","Sulfate","Chloride","Nitrate"],
  a:0, why:"Carbonates release CO₂, which forms insoluble CaCO₃ in limewater. Sulfates give no gas — they are identified with acidified BaCl₂ instead." },

{ id:"m8-04", mod:"M8", topic:"Anion tests", diff:2,
  q:"A white precipitate forms with acidified silver nitrate and dissolves in dilute ammonia. The anion is:",
  choices:["Chloride","Bromide","Iodide","Sulfate"],
  a:0, why:"AgCl is white and dissolves in dilute NH₃. AgBr is cream and needs concentrated ammonia; AgI is yellow and is insoluble even in concentrated ammonia." },

{ id:"m8-05", mod:"M8", topic:"Anion tests", diff:2,
  q:"Why must the solution be acidified with dilute nitric acid before adding BaCl₂ to test for sulfate?",
  choices:["To dissolve carbonate or sulfite, which would also precipitate with Ba²⁺","To increase the solubility of BaSO₄","To speed up the reaction","To prevent AgCl forming"],
  a:0, why:"BaCO₃ and BaSO₃ are also white precipitates, giving a false positive. Nitric acid destroys them as CO₂/SO₂, leaving only BaSO₄ which is acid-insoluble." },

{ id:"m8-06", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"In a gravimetric analysis the precipitate must be washed, dried to constant mass and weighed. Drying to constant mass ensures:",
  choices:["All water has been removed so the mass reflects only the precipitate","The precipitate has fully reacted","No precipitate is lost","The correct stoichiometry is used"],
  a:0, why:"Repeated heating and weighing until two consecutive masses agree confirms residual moisture is gone — otherwise the calculated percentage would be too high." },

{ id:"m8-07", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"A 2.00 g sample of impure BaCl₂ yields 1.50 g of BaSO₄ (M = 233.4). The mass of Ba in the sample is closest to:",
  choices:["0.883 g","1.50 g","0.643 g","2.00 g"],
  a:0, why:"n(BaSO₄) = 1.50/233.4 = 6.427 × 10⁻³ mol. There is 1 Ba per formula unit, so m(Ba) = 6.427 × 10⁻³ × 137.3 = 0.883 g." },

{ id:"m8-08", mod:"M8", topic:"Precipitation titration", diff:3,
  q:"In a Mohr titration for chloride, the potassium chromate indicator signals the end point by forming:",
  choices:["A red-brown Ag₂CrO₄ precipitate once all Cl⁻ has reacted","A colourless solution","A white AgCl precipitate","A blue complex"],
  a:0, why:"AgCl (Ksp ≈ 1.8 × 10⁻¹⁰) precipitates first. Only when Cl⁻ is exhausted does Ag⁺ build up enough to exceed Ksp for the more soluble red-brown silver chromate." },

{ id:"m8-09", mod:"M8", topic:"AAS", diff:2,
  q:"Atomic absorption spectroscopy is especially suited to:",
  choices:["Determining trace metal ion concentrations at ppm/ppb levels","Identifying organic functional groups","Separating mixtures","Measuring pH"],
  a:0, why:"A hollow cathode lamp emits light at a wavelength specific to the metal being tested, and absorption is proportional to concentration — extremely sensitive and element-selective." },

{ id:"m8-10", mod:"M8", topic:"AAS", diff:3,
  q:"In AAS, a calibration curve is prepared by:",
  choices:["Measuring absorbance of standards of known concentration and plotting A vs c","Diluting the sample until absorbance is zero","Measuring absorbance at several wavelengths","Weighing the metal recovered"],
  a:0, why:"Beer–Lambert law gives a linear A–c relationship at low concentrations. The unknown's absorbance is read off the line of best fit — interpolation, not extrapolation." },

{ id:"m8-11", mod:"M8", topic:"Colorimetry", diff:2,
  q:"Colorimetry can only be used for solutions that:",
  choices:["Are coloured, or can be reacted to form a coloured product","Contain metals","Are acidic","Conduct electricity"],
  a:0, why:"Absorbance requires a chromophore. Colourless analytes such as phosphate are reacted with a reagent to form a coloured complex before measurement." },

{ id:"m8-12", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"In the mass spectrum of an organic compound, the molecular ion peak (M⁺) gives:",
  choices:["The molar mass of the intact molecule","The number of carbon atoms only","The number of hydrogen environments","The functional group directly"],
  a:0, why:"M⁺ is the whole molecule minus one electron, so its m/z equals the molar mass. Fragment peaks and the M+1 / M+2 isotope pattern give structural information." },

{ id:"m8-13", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"A compound shows M⁺ and M+2 peaks of almost equal height. This suggests the presence of:",
  choices:["Bromine","Chlorine","Nitrogen","Oxygen"],
  a:0, why:"⁷⁹Br and ⁸¹Br occur in roughly 1:1 abundance, giving twin peaks of similar height. Chlorine (³⁵Cl:³⁷Cl ≈ 3:1) gives an M+2 peak about one third the height of M⁺." },

{ id:"m8-14", mod:"M8", topic:"Infrared spectroscopy", diff:2,
  q:"A broad absorption around 3200–3600 cm⁻¹ in an IR spectrum indicates:",
  choices:["An O-H bond (alcohol)","A C=O bond","A C-H bond","A C≡N bond"],
  a:0, why:"Hydrogen bonding broadens the O-H stretch dramatically. A carboxylic acid O-H is even broader (2500–3300 cm⁻¹) and appears alongside a strong C=O near 1700 cm⁻¹." },

{ id:"m8-15", mod:"M8", topic:"Infrared spectroscopy", diff:2,
  q:"A strong sharp peak near 1700 cm⁻¹ is characteristic of:",
  choices:["C=O stretching","O-H stretching","C-C stretching","N-H bending"],
  a:0, why:"The carbonyl stretch is one of the most reliable IR signals. Its exact position distinguishes aldehydes, ketones, esters and acids." },

{ id:"m8-16", mod:"M8", topic:"¹H NMR", diff:3,
  q:"In ¹H NMR, the number of distinct signals tells you:",
  choices:["The number of chemically different hydrogen environments","The total number of hydrogens","The molar mass","The number of carbon atoms"],
  a:0, why:"Equivalent protons resonate together. Integration gives the relative number of H in each environment, and splitting (n+1 rule) reveals neighbouring protons." },

{ id:"m8-17", mod:"M8", topic:"¹H NMR", diff:3,
  q:"A ¹H NMR spectrum shows a triplet and a quartet in a 3:2 ratio. The compound most likely contains:",
  choices:["An ethyl group, CH₃CH₂-","A methyl group only","An isopropyl group","A benzene ring"],
  a:0, why:"The CH₃ (3H) is split into a triplet by 2 neighbours and the CH₂ (2H) into a quartet by 3 neighbours — the classic ethyl signature." },

{ id:"m8-18", mod:"M8", topic:"¹³C NMR", diff:3,
  q:"Propan-2-ol, (CH₃)₂CHOH, shows how many signals in its ¹³C NMR spectrum?",
  choices:["2","3","4","1"],
  a:0, why:"The two methyl carbons are chemically equivalent by symmetry, so they give one signal; the CH carbon gives another. Two environments, two signals." },

{ id:"m8-19", mod:"M8", topic:"Chromatography", diff:2,
  q:"In paper chromatography, the Rf value is calculated as:",
  choices:["Distance moved by spot ÷ distance moved by solvent front","Distance moved by solvent ÷ distance moved by spot","Spot distance × solvent distance","Mass of spot ÷ total mass"],
  a:0, why:"Rf is always between 0 and 1 for a valid run. It is characteristic of a substance for a given stationary phase, mobile phase and temperature." },

{ id:"m8-20", mod:"M8", topic:"Chromatography", diff:3,
  q:"A component with a high Rf value in paper chromatography is:",
  choices:["More attracted to the mobile phase than the stationary phase","Strongly adsorbed to the paper","Always the most polar","Insoluble in the solvent"],
  a:0, why:"Chromatography separates by differential partitioning. Travelling far means the substance spends more time dissolved in the moving solvent, typically because its polarity matches the mobile phase." },

{ id:"m8-21", mod:"M8", topic:"Water quality", diff:2,
  q:"Eutrophication in a waterway is primarily caused by:",
  choices:["Excess nitrate and phosphate causing algal blooms and later oxygen depletion","Low water temperature","High dissolved oxygen","Acid rain alone"],
  a:0, why:"Fertiliser and detergent run-off feed rapid algal growth. When the algae die, decomposition by bacteria consumes dissolved oxygen, suffocating fish." },

{ id:"m8-22", mod:"M8", topic:"Water quality", diff:2,
  q:"Dissolved oxygen in a river typically decreases when:",
  choices:["Water temperature rises or organic pollution increases","Water flows over rapids","Temperature falls","Photosynthesis increases"],
  a:0, why:"Gas solubility falls as temperature rises, and decomposing organic waste has a high biochemical oxygen demand. Turbulence and photosynthesis both increase DO." },

{ id:"m8-23", mod:"M8", topic:"Water quality", diff:3,
  q:"Total hardness in water is caused mainly by:",
  choices:["Ca²⁺ and Mg²⁺ ions","Na⁺ and K⁺ ions","Nitrate ions","Dissolved CO₂"],
  a:0, why:"These divalent cations form scum with soap and scale (CaCO₃) in pipes and kettles. They can be measured by AAS or EDTA titration." },

{ id:"m8-24", mod:"M8", topic:"Ozone", diff:3,
  q:"CFCs deplete stratospheric ozone because:",
  choices:["UV light releases chlorine radicals that catalytically destroy ozone","They react directly with oxygen","They absorb infrared radiation","They dissolve ozone"],
  a:0, why:"A single Cl• can destroy thousands of O₃ molecules: Cl• + O₃ → ClO• + O₂, then ClO• + O• → Cl• + O₂. The radical is regenerated, so it acts catalytically." },

{ id:"m8-25", mod:"M8", topic:"Ozone", diff:2,
  q:"HFCs were introduced to replace CFCs because they:",
  choices:["Contain no chlorine, so they cannot generate ozone-destroying radicals","Are cheaper","Do not contribute to global warming","Break down instantly"],
  a:0, why:"Without C-Cl bonds there is no chlorine radical source. HFCs are still potent greenhouse gases, which is why they are now being phased down too." },

{ id:"m8-26", mod:"M8", topic:"Organic analysis", diff:3,
  q:"An unknown liquid turns blue litmus red, fizzes with sodium carbonate and has a broad IR band from 2500–3300 cm⁻¹ with a strong peak at 1710 cm⁻¹. It is:",
  choices:["A carboxylic acid","An alcohol","An ester","An aldehyde"],
  a:0, why:"Acidity plus effervescence with carbonate rules out alcohols and esters, and the very broad O-H combined with a carbonyl peak is the carboxylic acid fingerprint." },

{ id:"m8-27", mod:"M8", topic:"Organic analysis", diff:3,
  q:"Which test distinguishes an aldehyde from a ketone?",
  choices:["Tollens' reagent gives a silver mirror with the aldehyde only","Bromine water decolourises with the ketone","Both react with sodium metal","Only the ketone burns"],
  a:0, why:"Aldehydes are readily oxidised to carboxylic acids, reducing Ag⁺ to metallic silver. Ketones have no H on the carbonyl carbon and do not react. Fehling's/Benedict's works similarly." },

{ id:"m8-28", mod:"M8", topic:"Chemical synthesis", diff:3,
  q:"When designing an industrial synthesis, 'atom economy' measures:",
  choices:["The proportion of reactant mass ending up in the desired product","The percentage yield achieved","The cost per kilogram","The energy released"],
  a:0, why:"Atom economy = (mass of desired product / total mass of products) × 100, calculated from the balanced equation. A reaction can have 100% yield but poor atom economy if it generates large by-products." },

{ id:"m8-29", mod:"M8", topic:"Chemical monitoring", diff:2,
  q:"Why is continuous monitoring of a chemical plant's effluent important?",
  choices:["To detect breaches of discharge limits before environmental damage occurs","To increase reaction yield","To reduce catalyst cost","To measure atom economy"],
  a:0, why:"Real-time data on pH, dissolved oxygen, heavy metals and temperature allows rapid corrective action, and demonstrates regulatory compliance." },

{ id:"m8-30", mod:"M8", topic:"Instrumental analysis", diff:3,
  q:"Which combination would best confirm the identity of an unknown organic compound?",
  choices:["Mass spectrometry for molar mass, IR for functional groups and NMR for the carbon skeleton","IR alone","A flame test","A melting point alone"],
  a:0, why:"Each technique answers a different question. Used together they cross-validate a structure — a standard approach in forensic and pharmaceutical analysis." },

{ id:"m8-31", mod:"M8", topic:"Cation tests", diff:3,
  q:"A blue solution gives a pale blue precipitate with a little NaOH that dissolves in excess ammonia to give a deep blue solution. The cation is:",
  choices:["Cu²⁺","Fe²⁺","Zn²⁺","Al³⁺"],
  a:0, why:"Cu(OH)₂ is pale blue and redissolves in excess ammonia forming the deep blue tetraamminecopper(II) complex, [Cu(NH₃)₄]²⁺." },

{ id:"m8-32", mod:"M8", topic:"Analysis calculations", diff:3,
  q:"A 250 mL water sample contains 0.0050 g of lead. The concentration in ppm is:",
  choices:["20 ppm","5.0 ppm","0.020 ppm","50 ppm"],
  a:0, why:"ppm = mg of solute per litre of solution. 0.0050 g = 5.0 mg in 0.250 L → 5.0/0.250 = 20 mg L⁻¹ = 20 ppm." }
];
