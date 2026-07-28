/* Module 8 expansion A — Applying Chemical Ideas. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM8A = [

/* ── cation and anion tests ──────────────────────────────── */
{ id:"a8-001", mod:"M8", topic:"Flame tests", diff:1,
  q:"A brick-red flame test indicates the presence of:",
  choices:["Calcium","Sodium","Potassium","Copper"],
  a:0, why:"Calcium gives brick-red; sodium is yellow, potassium lilac and copper blue-green." },

{ id:"a8-002", mod:"M8", topic:"Flame tests", diff:2,
  q:"A lilac flame is easily masked by sodium contamination, so potassium is best confirmed by:",
  choices:["Viewing through cobalt blue glass","Adding a much larger sample to the flame","Using a hotter Bunsen flame","Repeating the test in daylight"],
  a:0, why:"Cobalt glass absorbs the intense yellow sodium emission, letting the weaker lilac line show through." },

{ id:"a8-003", mod:"M8", topic:"Cation tests", diff:2,
  q:"Adding NaOH dropwise to a solution gives a pale blue precipitate insoluble in excess. The cation is:",
  choices:["Cu²⁺","Fe³⁺","Al³⁺","Zn²⁺"],
  a:0, why:"Copper(II) hydroxide is pale blue and does not redissolve, unlike the amphoteric aluminium and zinc hydroxides." },

{ id:"a8-004", mod:"M8", topic:"Cation tests", diff:3,
  q:"A white precipitate with NaOH that dissolves in excess NaOH indicates:",
  choices:["Al³⁺ or Zn²⁺","Ca²⁺ or Mg²⁺","Fe²⁺ or Fe³⁺","Ba²⁺ or Sr²⁺"],
  a:0, why:"Both hydroxides are amphoteric, redissolving as aluminate and zincate in excess base." },

{ id:"a8-005", mod:"M8", topic:"Cation tests", diff:3,
  q:"Aluminium and zinc are then distinguished by adding:",
  choices:["Aqueous ammonia in excess","More sodium hydroxide","Dilute hydrochloric acid instead","Distilled water"],
  a:0, why:"Zinc hydroxide dissolves in excess ammonia forming a complex ion, while aluminium hydroxide does not." },

{ id:"a8-006", mod:"M8", topic:"Cation tests", diff:3,
  q:"A green precipitate with NaOH that darkens on standing in air indicates:",
  choices:["Fe²⁺","Fe³⁺","Cu²⁺","Ni²⁺"],
  a:0, why:"Iron(II) hydroxide is green and oxidises in air to the red-brown iron(III) hydroxide." },

{ id:"a8-007", mod:"M8", topic:"Anion tests", diff:2,
  q:"Adding acidified barium chloride gives a white precipitate. The anion present is:",
  choices:["Sulfate","Chloride","Carbonate","Nitrate"],
  a:0, why:"Barium sulfate is insoluble, and prior acidification destroys carbonate so it cannot give a false positive." },

{ id:"a8-008", mod:"M8", topic:"Anion tests", diff:3,
  q:"Barium chloride solution is acidified before the sulfate test to:",
  choices:["Remove carbonate, which would also precipitate","Greatly increase the solubility of barium sulfate","Speed up the precipitation reaction","Prevent the barium from oxidising"],
  a:0, why:"Barium carbonate is also a white precipitate, so the acid decomposes any carbonate to CO₂ first." },

{ id:"a8-009", mod:"M8", topic:"Anion tests", diff:2,
  q:"Adding acidified silver nitrate gives a cream precipitate. The halide present is:",
  choices:["Bromide","Chloride","Iodide","Fluoride"],
  a:0, why:"AgCl is white, AgBr cream and AgI yellow; silver fluoride is soluble and gives no precipitate." },

{ id:"a8-010", mod:"M8", topic:"Anion tests", diff:3,
  q:"Silver halide precipitates are further distinguished by their solubility in:",
  choices:["Aqueous ammonia of differing concentration","Hot distilled water at various temperatures","Dilute nitric acid","Ethanol solution"],
  a:0, why:"AgCl dissolves in dilute ammonia, AgBr only in concentrated ammonia, and AgI in neither." },

{ id:"a8-011", mod:"M8", topic:"Anion tests", diff:2,
  q:"Effervescence on adding dilute acid, with the gas turning limewater milky, indicates:",
  choices:["Carbonate","Sulfate","Nitrate","Phosphate"],
  a:0, why:"Carbonates release CO₂, which precipitates calcium carbonate in limewater." },

{ id:"a8-012", mod:"M8", topic:"Anion tests", diff:3,
  q:"Phosphate is confirmed by forming a yellow precipitate with:",
  choices:["Ammonium molybdate in nitric acid","Acidified barium chloride solution","Silver nitrate solution","Sodium hydroxide solution"],
  a:0, why:"Ammonium phosphomolybdate is a distinctive bright yellow solid." },

{ id:"a8-013", mod:"M8", topic:"Cation tests", diff:3,
  q:"A systematic separation scheme adds reagents in a set order so that:",
  choices:["Each group precipitates before the next","All cations precipitate together","No precipitates can form at any stage","Only the final ion is identified"],
  a:0, why:"Removing one group at a time avoids the ambiguity of several ions precipitating simultaneously." },

/* ── gravimetric analysis ────────────────────────────────── */
{ id:"a8-014", mod:"M8", topic:"Gravimetric analysis", diff:2,
  q:"Gravimetric analysis determines an ion's concentration by measuring the:",
  choices:["Mass of a pure dried precipitate","Volume of titrant required","Absorbance of the solution","Electrical conductivity of the solution"],
  a:0, why:"Stoichiometry converts precipitate mass back to moles of the target ion." },

{ id:"a8-015", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"A precipitate is heated to constant mass in order to:",
  choices:["Ensure all water has been driven off","Decompose it fully into its elements","Increase its molar mass","Convert it to a soluble form"],
  a:0, why:"Repeating heat-cool-weigh cycles until the mass stops changing proves the sample is dry." },

{ id:"a8-016", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"Precipitating 0.0200 mol of sulfate as BaSO₄ (M = 233.4 g/mol) gives a mass of:",
  choices:["4.67 g","2.33 g","9.34 g","0.467 g"],
  a:0, why:"m = 0.0200 × 233.4 = 4.67 g, since the ratio of sulfate to precipitate is 1 : 1." },

{ id:"a8-017", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"Washing a precipitate before drying is necessary to remove:",
  choices:["Soluble ions adhering to the solid","A small amount of the precipitate itself","Excess water from the crystals","The filter paper fibres"],
  a:0, why:"Co-precipitated soluble salts would otherwise be weighed as part of the product and inflate the result." },

{ id:"a8-018", mod:"M8", topic:"Gravimetric analysis", diff:3,
  q:"An incompletely dried precipitate causes the calculated concentration to be:",
  choices:["Higher than the true value","Rather lower than the true value","Exactly the true value","Impossible to estimate"],
  a:0, why:"Retained water adds mass, which the calculation attributes entirely to the analyte." },

/* ── precipitation titration ─────────────────────────────── */
{ id:"a8-019", mod:"M8", topic:"Precipitation titration", diff:3,
  q:"In a Mohr titration for chloride, the indicator forms a red precipitate at the end point. It is:",
  choices:["Potassium chromate","Phenolphthalein indicator solution","Methyl orange","Starch solution"],
  a:0, why:"Once chloride is exhausted, silver reacts with chromate to give red silver chromate." },

{ id:"a8-020", mod:"M8", topic:"Precipitation titration", diff:3,
  q:"A Mohr titration must be carried out near neutral pH because in acid the:",
  choices:["Chromate indicator is protonated to dichromate","Silver chloride redissolves almost completely","Chloride ions are oxidised to chlorine","Reaction becomes far too fast"],
  a:0, why:"Converting CrO₄²⁻ to Cr₂O₇²⁻ removes the species needed to form the coloured end-point precipitate." },

/* ── AAS ─────────────────────────────────────────────────── */
{ id:"a8-021", mod:"M8", topic:"AAS", diff:2,
  q:"Atomic absorption spectroscopy measures the amount of light:",
  choices:["Absorbed by gaseous atoms of the element","Emitted by excited molecules","Scattered by suspended particles","Reflected back from the sample surface"],
  a:0, why:"Ground-state atoms in the flame absorb at wavelengths characteristic of that element." },

{ id:"a8-022", mod:"M8", topic:"AAS", diff:3,
  q:"AAS uses a hollow cathode lamp made of the element being measured because it:",
  choices:["Emits exactly the wavelengths that element absorbs","Produces a broad and continuous spectrum","Heats the sample more efficiently","Prevents the flame from flickering"],
  a:0, why:"Matching the source to the analyte gives extremely high selectivity against other elements present." },

{ id:"a8-023", mod:"M8", topic:"AAS", diff:3,
  q:"A calibration curve in AAS is constructed by plotting absorbance against:",
  choices:["Known standard concentrations","Sample volume used","Flame temperature","Wavelength setting of the lamp"],
  a:0, why:"The unknown's absorbance is then read back against the straight line through the standards." },

{ id:"a8-024", mod:"M8", topic:"AAS", diff:3,
  q:"AAS is particularly suited to environmental monitoring because it can measure:",
  choices:["Trace metals at parts-per-billion levels","Organic compounds in almost any matrix","The pH of natural waters","Dissolved oxygen concentration"],
  a:0, why:"Its sensitivity to very low metal concentrations is what made lead and cadmium monitoring practical." },

{ id:"a8-025", mod:"M8", topic:"AAS", diff:3,
  q:"A sample whose absorbance falls above the calibration range should be:",
  choices:["Diluted and re-measured","Reported using extrapolation","Measured at a different wavelength","Heated before measurement"],
  a:0, why:"Beer's law loses linearity at high absorbance, so extrapolating beyond the standards is unreliable." },

/* ── colorimetry and UV-visible ──────────────────────────── */
{ id:"a8-026", mod:"M8", topic:"Colorimetry", diff:2,
  q:"Colorimetry can be used only for solutions that are:",
  choices:["Coloured or can be made coloured","Perfectly transparent to visible light","Strongly acidic","Highly concentrated"],
  a:0, why:"Absorbance in the visible region requires a chromophore, though a reagent can be added to create one." },

{ id:"a8-027", mod:"M8", topic:"Colorimetry", diff:3,
  q:"The Beer–Lambert law states that absorbance is proportional to concentration and:",
  choices:["Path length through the sample","Temperature of the solution","Volume of the cuvette","Emitted intensity of the source lamp"],
  a:0, why:"A = εcl, so doubling either the concentration or the path length doubles the absorbance." },

{ id:"a8-028", mod:"M8", topic:"Colorimetry", diff:3,
  q:"The wavelength chosen for a colorimetric analysis should be:",
  choices:["The wavelength of maximum absorbance","The wavelength most strongly transmitted","The shortest available wavelength","Any wavelength in the visible range"],
  a:0, why:"Working at λmax gives the steepest calibration line and so the best sensitivity and precision." },

{ id:"a8-029", mod:"M8", topic:"Colorimetry", diff:3,
  q:"A blank is run in colorimetry in order to:",
  choices:["Zero the instrument against the solvent","Calibrate the wavelength scale","Warm the lamp to a stable output","Test the overall linearity of the detector"],
  a:0, why:"Absorbance by the solvent, cuvette and reagents is subtracted so only the analyte contributes." },

/* ── mass spectrometry ───────────────────────────────────── */
{ id:"a8-030", mod:"M8", topic:"Mass spectrometry", diff:2,
  q:"A mass spectrometer separates ions according to their:",
  choices:["Mass-to-charge ratio","Boiling point","Electronegativity","Overall molecular polarity"],
  a:0, why:"Deflection in the magnetic field depends on m/z, so lighter and more highly charged ions deflect more." },

{ id:"a8-031", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"The molecular ion peak in a mass spectrum corresponds to the:",
  choices:["Intact molecule minus one electron","Largest fragment produced","Most abundant of the fragment ions","Base peak in every case"],
  a:0, why:"It is usually the highest significant m/z value, giving the molar mass directly." },

{ id:"a8-032", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"A compound shows M and M+2 peaks of roughly equal height. It most likely contains:",
  choices:["Chlorine","Bromine","Nitrogen","Fluorine"],
  a:0, why:"Bromine's two isotopes are nearly equally abundant, giving a 1 : 1 doublet. Chlorine gives roughly 3 : 1." },

{ id:"a8-033", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"The base peak in a mass spectrum is the peak that is:",
  choices:["Most intense","At the highest m/z","At the lowest m/z","Due to the molecular ion"],
  a:0, why:"It is assigned 100% relative abundance and corresponds to the most stable fragment ion." },

{ id:"a8-034", mod:"M8", topic:"Mass spectrometry", diff:3,
  q:"A loss of 15 mass units from the molecular ion suggests loss of a:",
  choices:["Methyl group","Hydroxyl group","Water molecule","Carbonyl group"],
  a:0, why:"CH₃ has mass 15; OH is 17 and H₂O is 18." },

/* ── infrared ────────────────────────────────────────────── */
{ id:"a8-035", mod:"M8", topic:"Infrared spectroscopy", diff:2,
  q:"Infrared spectroscopy detects functional groups by measuring:",
  choices:["Absorption that causes bond vibration","Emission of light from excited electrons","Deflection of charged fragments","Nuclear spin transitions"],
  a:0, why:"Each bond has a characteristic stretching and bending frequency in the infrared region." },

{ id:"a8-036", mod:"M8", topic:"Infrared spectroscopy", diff:3,
  q:"A strong sharp absorption near 1710 cm⁻¹ indicates:",
  choices:["A carbonyl group","A hydroxyl group","A carbon–carbon single bond","An amine group"],
  a:0, why:"The C=O stretch is intense and falls in a region with little interference." },

{ id:"a8-037", mod:"M8", topic:"Infrared spectroscopy", diff:3,
  q:"A very broad absorption from 2500–3300 cm⁻¹ together with a peak near 1710 cm⁻¹ indicates:",
  choices:["A carboxylic acid","A simple primary alcohol","A ketone","An ester"],
  a:0, why:"Hydrogen-bonded O–H of the acid dimer gives the exceptionally broad band, and the carbonyl confirms it." },

{ id:"a8-038", mod:"M8", topic:"Infrared spectroscopy", diff:3,
  q:"A broad absorption near 3300 cm⁻¹ with no carbonyl peak suggests:",
  choices:["An alcohol","A carboxylic acid","An aldehyde","An alkane"],
  a:0, why:"The hydroxyl stretch is present but the absence of C=O rules out acids and other carbonyl compounds." },

{ id:"a8-039", mod:"M8", topic:"Infrared spectroscopy", diff:3,
  q:"The fingerprint region of an IR spectrum is useful mainly for:",
  choices:["Confirming identity against a reference","Identifying individual functional groups","Determining the molar mass","Counting the hydrogen environments"],
  a:0, why:"Below about 1500 cm⁻¹ the pattern is complex but unique to each compound, so it matches like a fingerprint." },

/* ── NMR ─────────────────────────────────────────────────── */
{ id:"a8-040", mod:"M8", topic:"¹H NMR", diff:2,
  q:"The number of signals in a ¹H NMR spectrum indicates the number of:",
  choices:["Different hydrogen environments","Hydrogen atoms in total","Carbon atoms present","Functional groups that are present"],
  a:0, why:"Chemically equivalent hydrogens resonate together and produce a single signal." },

{ id:"a8-041", mod:"M8", topic:"¹H NMR", diff:3,
  q:"The area under a ¹H NMR signal is proportional to the:",
  choices:["Number of hydrogens in that environment","Electronegativity of the nearby atoms","Number of neighbouring hydrogens","Molar mass of the compound"],
  a:0, why:"Integration gives the ratio of hydrogens across the environments." },

{ id:"a8-042", mod:"M8", topic:"¹H NMR", diff:3,
  q:"Under the n+1 rule, a signal split into a triplet indicates:",
  choices:["Two hydrogens on adjacent carbons","Three hydrogens on adjacent carbons","Two hydrogens in that environment","Three equivalent hydrogens present"],
  a:0, why:"Splitting counts the neighbours, so n + 1 = 3 gives n = 2 adjacent hydrogens." },

{ id:"a8-043", mod:"M8", topic:"¹H NMR", diff:3,
  q:"Ethanol's ¹H NMR shows three signals in the ratio:",
  choices:["3 : 2 : 1","1 : 2 : 3","2 : 2 : 2","1 : 1 : 1"],
  a:0, why:"CH₃ has three hydrogens, CH₂ has two and OH has one, each in a distinct environment." },

{ id:"a8-044", mod:"M8", topic:"¹H NMR", diff:3,
  q:"TMS is used as the reference standard in NMR because it:",
  choices:["Gives a single sharp peak at zero","Reacts with the sample cleanly","Has the highest possible chemical shift","Contains no hydrogen atoms"],
  a:0, why:"Its twelve equivalent, highly shielded hydrogens give one peak well clear of typical sample signals." },

{ id:"a8-045", mod:"M8", topic:"¹³C NMR", diff:3,
  q:"¹³C NMR spectra are usually simpler than ¹H spectra because:",
  choices:["Carbon–carbon coupling is rarely observed","Carbon has no nuclear spin","Fewer carbons than hydrogens exist","Signals are always singlets by their nature"],
  a:0, why:"The low natural abundance of ¹³C makes adjacent ¹³C nuclei very unlikely, and proton decoupling removes the rest." },

{ id:"a8-046", mod:"M8", topic:"¹³C NMR", diff:3,
  q:"The number of peaks in a ¹³C NMR spectrum equals the number of:",
  choices:["Distinct carbon environments","Carbon atoms in the molecule","Hydrogen atoms attached to carbon","Functional groups present"],
  a:0, why:"Symmetry makes equivalent carbons resonate together, so benzene gives just one peak." },

{ id:"a8-047", mod:"M8", topic:"¹H NMR", diff:3,
  q:"A hydrogen close to an electronegative atom appears at a chemical shift that is:",
  choices:["Higher, because it is deshielded","Lower, because it is strongly shielded","Unchanged by nearby atoms","Always exactly zero ppm"],
  a:0, why:"Electron density is drawn away, so the nucleus feels more of the applied field and resonates downfield." },

/* ── chromatography ──────────────────────────────────────── */
{ id:"a8-048", mod:"M8", topic:"Chromatography", diff:2,
  q:"All chromatographic methods separate components by their differing:",
  choices:["Affinity for stationary and mobile phases","Molar masses alone","Boiling points alone","Electrical charges on each species alone"],
  a:0, why:"Repeated partitioning between the two phases magnifies small differences in affinity into a clean separation." },

{ id:"a8-049", mod:"M8", topic:"Chromatography", diff:3,
  q:"In gas chromatography, the mobile phase is:",
  choices:["An inert carrier gas","A volatile organic solvent","A heated metal surface","A stream of water vapour"],
  a:0, why:"Helium or nitrogen carries vaporised sample through the column without reacting with it." },

{ id:"a8-050", mod:"M8", topic:"Chromatography", diff:3,
  q:"In gas chromatography, retention time is characteristic of a compound under:",
  choices:["Fixed column and temperature conditions","Any conditions whatsoever","Aqueous conditions only","Elevated pressure conditions only"],
  a:0, why:"Retention time is only comparable against standards run on the same column under the same programme." },

{ id:"a8-051", mod:"M8", topic:"Chromatography", diff:3,
  q:"HPLC is preferred over GC for compounds that are:",
  choices:["Thermally unstable or non-volatile","Extremely volatile","Present only in the gaseous state","Strongly coloured"],
  a:0, why:"HPLC runs near room temperature in liquid, so heat-sensitive compounds are not destroyed." },

{ id:"a8-052", mod:"M8", topic:"Chromatography", diff:3,
  q:"The spot in paper chromatography that travels furthest is the one most attracted to the:",
  choices:["Mobile phase","Stationary phase","Filter paper fibres","Baseline pencil line"],
  a:0, why:"Greater solubility in the running solvent carries a component further before it partitions back." },

/* ── water quality ───────────────────────────────────────── */
{ id:"a8-053", mod:"M8", topic:"Water quality", diff:2,
  q:"Biochemical oxygen demand is a measure of:",
  choices:["Oxygen used by microorganisms decomposing organic matter","The total mass of solids dissolved in the water","Acidity of the water sample","Suspended sediment concentration"],
  a:0, why:"High BOD indicates heavy organic pollution, which depletes the oxygen aquatic life needs." },

{ id:"a8-054", mod:"M8", topic:"Water quality", diff:3,
  q:"Dissolved oxygen in a river typically falls as temperature rises because gas solubility:",
  choices:["Decreases with increasing temperature","Increases with increasing temperature","Is unaffected by temperature","Depends only on the pH"],
  a:0, why:"Dissolution of gases is exothermic, so heating drives dissolved oxygen back out of solution." },

{ id:"a8-055", mod:"M8", topic:"Water quality", diff:3,
  q:"Eutrophication in a waterway is caused primarily by excess:",
  choices:["Nitrate and phosphate nutrients","Dissolved oxygen","Heavy metal ions","Fine suspended clay particles"],
  a:0, why:"Fertiliser runoff triggers algal blooms whose decay then strips oxygen from the water." },

{ id:"a8-056", mod:"M8", topic:"Water quality", diff:3,
  q:"Total hardness of water is due mainly to dissolved:",
  choices:["Calcium and magnesium ions","Dissolved sodium and potassium ions","Nitrate and chloride ions","Dissolved carbon dioxide"],
  a:0, why:"These doubly charged cations precipitate soap and form scale in pipes and kettles." },

{ id:"a8-057", mod:"M8", topic:"Water quality", diff:3,
  q:"Turbidity matters in drinking water treatment because suspended particles:",
  choices:["Shield pathogens from disinfection","Directly poison anyone who drinks it","Raise the water's pH sharply","Remove all dissolved oxygen"],
  a:0, why:"Microorganisms sheltering inside flocs can survive chlorination, so turbidity must be reduced first." },

{ id:"a8-058", mod:"M8", topic:"Water quality", diff:3,
  q:"Heavy metals are of particular concern in waterways because they:",
  choices:["Bioaccumulate up the food chain","Evaporate rapidly in direct sunlight","Decompose into harmless gases","Raise dissolved oxygen levels"],
  a:0, why:"They are not metabolised or excreted efficiently, so concentrations magnify at each trophic level." },

/* ── atmosphere ──────────────────────────────────────────── */
{ id:"a8-059", mod:"M8", topic:"Ozone", diff:3,
  q:"CFCs deplete stratospheric ozone because UV light releases:",
  choices:["Chlorine radicals that catalyse ozone breakdown","Fluoride ions that directly neutralise ozone","Carbon dioxide that absorbs ozone","Water vapour that dilutes ozone"],
  a:0, why:"One chlorine radical destroys many thousands of ozone molecules before it is finally removed." },

{ id:"a8-060", mod:"M8", topic:"Ozone", diff:3,
  q:"Ozone in the stratosphere is beneficial, but at ground level it is a pollutant because it:",
  choices:["Is an oxidant that irritates lungs and damages plants","Blocks sunlight from reaching crops","Reacts with water to form acid rain","Traps heat far more than carbon dioxide"],
  a:0, why:"The same reactivity that makes it useful as a UV filter aloft makes it damaging where people breathe it." },

{ id:"a8-061", mod:"M8", topic:"Atmospheric monitoring", diff:3,
  q:"Oxides of nitrogen are formed in car engines because the high temperature:",
  choices:["Allows atmospheric N₂ and O₂ to combine","Decomposes the fuel into nitrogen","Releases nitrogen from the catalyst","Oxidises nitrogen in the lubricating oil"],
  a:0, why:"The N≡N bond is only broken at combustion temperatures, so the nitrogen comes from the air drawn in." },

{ id:"a8-062", mod:"M8", topic:"Atmospheric monitoring", diff:3,
  q:"A catalytic converter reduces emissions by converting NOₓ and CO into:",
  choices:["Nitrogen and carbon dioxide","Ammonia and methane","Nitric acid and carbon","Nitrous oxide and free oxygen"],
  a:0, why:"The catalyst reduces the nitrogen oxides while simultaneously oxidising carbon monoxide and unburnt fuel." },

/* ── organic analysis and synthesis ──────────────────────── */
{ id:"a8-063", mod:"M8", topic:"Organic analysis", diff:3,
  q:"A compound gives a molecular ion at m/z 46, a broad IR band near 3300 cm⁻¹ and three NMR signals. It is:",
  choices:["Ethanol","Ethanoic acid","Methanal","Dimethyl ether"],
  a:0, why:"Mass 46 fits C₂H₆O; the broad O–H rules out the ether, and three environments rule out the symmetric alternative." },

{ id:"a8-064", mod:"M8", topic:"Organic analysis", diff:3,
  q:"A compound with molecular ion m/z 60, a broad band from 2500–3300 cm⁻¹ and a peak at 1715 cm⁻¹ is:",
  choices:["Ethanoic acid","Propan-1-ol","Propanal","Methyl methanoate"],
  a:0, why:"Mass 60 fits C₂H₄O₂, and the acid dimer O–H with a carbonyl is conclusive." },

{ id:"a8-065", mod:"M8", topic:"Organic analysis", diff:3,
  q:"Combining several instrumental techniques is standard practice because each:",
  choices:["Provides different, complementary information","Gives exactly the same answer as confirmation","Requires the same sample preparation","Measures the concentration directly"],
  a:0, why:"Mass spectrometry gives molar mass, IR gives functional groups and NMR gives the carbon skeleton." },

{ id:"a8-066", mod:"M8", topic:"Chemical synthesis", diff:3,
  q:"An addition reaction has 100% atom economy, whereas a substitution reaction does not, because substitution:",
  choices:["Always expels a leaving group as waste","Requires a much higher temperature","Gives a lower percentage yield","Needs a stoichiometric catalyst"],
  a:0, why:"Every atom of both reactants ends up in an addition product, while substitution discards the displaced group." },

{ id:"a8-067", mod:"M8", topic:"Chemical synthesis", diff:3,
  q:"Green chemistry principles favour syntheses that:",
  choices:["Minimise waste and hazardous solvents","Maximise the number of steps","Use the highest possible temperature","Always employ stoichiometric reagents"],
  a:0, why:"Fewer steps, catalytic rather than stoichiometric reagents and benign solvents all reduce environmental cost." },

{ id:"a8-068", mod:"M8", topic:"Chemical synthesis", diff:3,
  q:"A batch process differs from a continuous process in that batch production:",
  choices:["Makes a fixed quantity then stops","Runs without interruption indefinitely","Cannot use any catalyst","Requires no quality testing"],
  a:0, why:"Batch suits small volumes and frequent product changes; continuous suits high-volume commodity chemicals." },

/* ── monitoring and calculations ─────────────────────────── */
{ id:"a8-069", mod:"M8", topic:"Analysis calculations", diff:3,
  q:"A 250 mL water sample contains 0.50 mg of lead. The concentration in ppm is:",
  choices:["2.0","0.50","5.0","0.125"],
  a:0, why:"0.50 mg in 0.250 L is 2.0 mg/L, and for dilute aqueous solution 1 mg/L equals 1 ppm." },

{ id:"a8-070", mod:"M8", topic:"Analysis calculations", diff:3,
  q:"A standard is diluted from 100 ppm to 5 ppm using a 100 mL flask. The volume of stock needed is:",
  choices:["5.0 mL","20 mL","10 mL","0.5 mL"],
  a:0, why:"c₁V₁ = c₂V₂: V₁ = (5 × 100)/100 = 5.0 mL, made up to the mark." },

{ id:"a8-071", mod:"M8", topic:"Chemical monitoring", diff:3,
  q:"Monitoring is described as continuous rather than periodic when measurements are:",
  choices:["Taken automatically at frequent intervals","Made once every calendar year","Performed only after a complaint","Carried out only in a distant laboratory"],
  a:0, why:"Automated in-line sensors catch short-lived excursions that infrequent grab samples would miss entirely." },

{ id:"a8-072", mod:"M8", topic:"Instrumental analysis", diff:3,
  q:"Instrumental methods have largely replaced classical wet chemistry for trace analysis because they offer:",
  choices:["Far greater sensitivity from smaller samples","Lower equipment purchase costs","Much simpler calculations at every stage","No need for any calibration"],
  a:0, why:"Detecting parts per billion is beyond gravimetric or volumetric methods, which need far more analyte." },

{ id:"a8-073", mod:"M8", topic:"Instrumental analysis", diff:3,
  q:"A calibration curve that is not linear at high concentrations means results there should be:",
  choices:["Obtained after diluting the sample","Read by extending the straight line","Reported without any correction","Multiplied by a fixed factor"],
  a:0, why:"Bringing the sample into the linear range is the only reliable option once Beer's law breaks down." },

{ id:"a8-074", mod:"M8", topic:"Water quality", diff:3,
  q:"Chlorination is used in water treatment primarily to:",
  choices:["Kill pathogenic microorganisms","Remove all the dissolved heavy metals","Reduce the water's hardness","Neutralise excess acidity"],
  a:0, why:"A residual chlorine concentration is maintained through the distribution network to prevent recontamination." },

{ id:"a8-075", mod:"M8", topic:"Water quality", diff:3,
  q:"Flocculation is used in water treatment to:",
  choices:["Aggregate fine particles so they settle","Dissolve all the suspended organic matter","Sterilise the water completely","Adjust the final pH precisely"],
  a:0, why:"Added alum neutralises the charges keeping colloids dispersed, so they clump and can be filtered out." }

];
