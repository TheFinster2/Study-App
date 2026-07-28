/* Module 6 expansion A — Acid/Base Reactions. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM6A = [

/* ── theories ────────────────────────────────────────────── */
{ id:"a6-001", mod:"M6", topic:"Acid–base theories", diff:2,
  q:"A Brønsted–Lowry base is best defined as a:",
  choices:["Proton acceptor","Proton donor","Hydroxide donor","An electron pair acceptor"],
  a:0, why:"The definition covers species such as ammonia and carbonate that contain no hydroxide at all." },

{ id:"a6-002", mod:"M6", topic:"Acid–base theories", diff:2,
  q:"The main advantage of the Brønsted–Lowry model over Arrhenius is that it:",
  choices:["Applies to non-aqueous solvents too","Requires no water to be present","Explains why acids taste sour","Predicts exact pH values directly"],
  a:0, why:"Arrhenius is confined to aqueous H⁺ and OH⁻, while proton transfer works in ammonia, in the gas phase and elsewhere." },

{ id:"a6-003", mod:"M6", topic:"Acid–base theories", diff:3,
  q:"In the reaction NH₃(g) + HCl(g) → NH₄Cl(s), ammonia acts as:",
  choices:["A Brønsted–Lowry base","An Arrhenius base","A Lewis acid","An oxidising agent"],
  a:0, why:"It accepts a proton, and the absence of water rules out the Arrhenius description entirely." },

{ id:"a6-004", mod:"M6", topic:"Historical development", diff:3,
  q:"Lavoisier's early theory of acids was later shown to be wrong because it claimed all acids contain:",
  choices:["Oxygen","Hydrogen","Chlorine","Sulfur"],
  a:0, why:"Davy's work on hydrochloric acid, which contains no oxygen, forced the theory to be abandoned." },

{ id:"a6-005", mod:"M6", topic:"Acid–base theories", diff:3,
  q:"A Lewis acid is defined as a species that:",
  choices:["Accepts an electron pair","Donates an electron pair","Donates a proton","Releases hydroxide ions"],
  a:0, why:"The Lewis model is the broadest, covering species such as BF₃ that have no proton to donate at all." },

/* ── conjugate pairs ─────────────────────────────────────── */
{ id:"a6-006", mod:"M6", topic:"Conjugate pairs", diff:2,
  q:"The conjugate base of H₂PO₄⁻ is:",
  choices:["HPO₄²⁻","H₃PO₄","PO₄³⁻","H₂PO₄⁻"],
  a:0, why:"Removing one proton gives HPO₄²⁻, differing from the acid by exactly one H⁺." },

{ id:"a6-007", mod:"M6", topic:"Conjugate pairs", diff:2,
  q:"The conjugate acid of HCO₃⁻ is:",
  choices:["H₂CO₃","CO₃²⁻","H₃CO₃⁺","CO₂"],
  a:0, why:"Adding a proton to hydrogencarbonate gives carbonic acid." },

{ id:"a6-008", mod:"M6", topic:"Conjugate pairs", diff:3,
  q:"A strong acid necessarily has a conjugate base that is:",
  choices:["Very weak","Equally strong","Also a strong acid","Amphiprotic"],
  a:0, why:"Complete ionisation means the reverse reaction is negligible, so the conjugate has almost no affinity for protons." },

{ id:"a6-009", mod:"M6", topic:"Amphiprotic species", diff:3,
  q:"Which of these could NOT behave as an amphiprotic species?",
  choices:["NO₃⁻","HSO₄⁻","H₂O","HPO₄²⁻"],
  a:0, why:"Nitrate has no proton to donate and is too weak a base to accept one appreciably." },

{ id:"a6-010", mod:"M6", topic:"Amphiprotic species", diff:3,
  q:"Water is amphiprotic, which is demonstrated by its:",
  choices:["Self-ionisation into H₃O⁺ and OH⁻","High specific heat capacity","Ability to dissolve ionic solids","Unusually high boiling point"],
  a:0, why:"One water molecule donates a proton to another, so the same species acts as both acid and base." },

/* ── strong vs weak ──────────────────────────────────────── */
{ id:"a6-011", mod:"M6", topic:"Strong vs weak", diff:2,
  q:"A strong acid differs from a concentrated acid in that strong refers to:",
  choices:["Extent of ionisation in water","Moles of acid per litre","Total volume of the solution","Corrosiveness towards metals"],
  a:0, why:"Strength is a property of the substance; concentration is a property of the particular solution." },

{ id:"a6-012", mod:"M6", topic:"Strong vs weak", diff:3,
  q:"Two acids of equal pH are titrated against the same base. The weak acid requires more base because:",
  choices:["It holds a large reserve of unionised acid","Its molecules are physically larger","It reacts more slowly with the base","Its conjugate base is also acidic"],
  a:0, why:"Equal pH means equal [H⁺], but the weak acid's total concentration is far higher, and every molecule eventually reacts." },

{ id:"a6-013", mod:"M6", topic:"Strong vs weak", diff:3,
  q:"Equal volumes and concentrations of HCl and CH₃COOH react with excess magnesium. Compared with HCl, the ethanoic acid gives:",
  choices:["The same volume of gas, more slowly","Less gas, but at exactly the same rate","Less gas, more slowly","More gas, more slowly"],
  a:0, why:"Total moles of acid are equal so the final yield matches, but the lower H⁺ concentration slows the reaction." },

{ id:"a6-014", mod:"M6", topic:"Strong vs weak", diff:3,
  q:"Which measurement would distinguish a strong acid from a weak acid of the same concentration?",
  choices:["Electrical conductivity of the solution","Total volume of the solution used","Mass of acid dissolved","Temperature of the solution"],
  a:0, why:"Conductivity reflects ion concentration directly, so the fully ionised acid conducts far better." },

/* ── pH and Kw ───────────────────────────────────────────── */
{ id:"a6-015", mod:"M6", topic:"pH calculations", diff:2,
  q:"The pH of 0.010 mol/L HCl is:",
  choices:["2.00","1.00","12.0","0.010"],
  a:0, why:"HCl ionises fully, so [H⁺] = 0.010 and pH = −log(0.010) = 2.00." },

{ id:"a6-016", mod:"M6", topic:"pH calculations", diff:2,
  q:"The pH of 0.0010 mol/L NaOH is:",
  choices:["11.00","3.00","10.0","1.00"],
  a:0, why:"pOH = 3.00, so pH = 14.00 − 3.00 = 11.00." },

{ id:"a6-017", mod:"M6", topic:"pH calculations", diff:3,
  q:"A solution has pH 4.5. Its hydrogen ion concentration is closest to:",
  choices:["3.2 × 10⁻⁵ mol/L","4.5 × 10⁻⁵ mol/L","3.2 × 10⁻¹⁰ mol/L","1.0 × 10⁻⁴ mol/L"],
  a:0, why:"[H⁺] = 10^(−4.5) = 3.2 × 10⁻⁵ mol/L." },

{ id:"a6-018", mod:"M6", topic:"pH calculations", diff:3,
  q:"The pH of 0.050 mol/L H₂SO₄, assuming full ionisation of both protons, is:",
  choices:["1.00","1.30","2.00","0.70"],
  a:0, why:"[H⁺] = 2 × 0.050 = 0.10 mol/L, so pH = 1.00." },

{ id:"a6-019", mod:"M6", topic:"Kw", diff:2,
  q:"At 25 °C the ionic product of water, Kw, equals:",
  choices:["1.0 × 10⁻¹⁴","1.0 × 10⁻⁷","1.0 × 10⁻¹","14.0"],
  a:0, why:"[H⁺][OH⁻] = 1.0 × 10⁻¹⁴, which is why pH + pOH = 14 at this temperature." },

{ id:"a6-020", mod:"M6", topic:"Kw", diff:3,
  q:"At 50 °C, Kw is larger than at 25 °C. Pure water at 50 °C therefore has:",
  choices:["pH below 7 but is still neutral","pH of exactly 7 and is still neutral","pH above 7 and is basic","pH below 7 and is acidic"],
  a:0, why:"Self-ionisation is endothermic, so both ion concentrations rise equally — neutral, but at a lower pH value." },

{ id:"a6-021", mod:"M6", topic:"Kw", diff:3,
  q:"A solution has [OH⁻] = 2.0 × 10⁻³ mol/L at 25 °C. Its pH is closest to:",
  choices:["11.3","2.7","3.3","10.7"],
  a:0, why:"pOH = −log(2.0 × 10⁻³) = 2.70, so pH = 14.00 − 2.70 = 11.30." },

{ id:"a6-022", mod:"M6", topic:"Dilution and pH", diff:3,
  q:"Diluting a strong acid tenfold changes its pH by:",
  choices:["Increasing it by one unit","Decreasing it by one unit","Increasing it by ten units","Leaving it unchanged"],
  a:0, why:"A tenfold fall in [H⁺] is one logarithmic unit, so pH 2 becomes pH 3." },

{ id:"a6-023", mod:"M6", topic:"Dilution and pH", diff:3,
  q:"Diluting a strong acid of pH 5 by a factor of 1000 gives a pH:",
  choices:["Slightly below 7","Exactly 8, since it becomes basic","Exactly 2","Exactly 7"],
  a:0, why:"Water's own ionisation dominates at these concentrations, so pH approaches but never crosses 7 for an acid." },

/* ── Ka and weak acids ───────────────────────────────────── */
{ id:"a6-024", mod:"M6", topic:"Ka", diff:2,
  q:"A larger value of Ka indicates an acid that is:",
  choices:["More extensively ionised","More concentrated in solution","More corrosive to metals","Less soluble in water"],
  a:0, why:"Ka is the equilibrium constant for ionisation, so a bigger value means more H⁺ released at a given concentration." },

{ id:"a6-025", mod:"M6", topic:"Ka and pKa", diff:3,
  q:"An acid with pKa 3.2 compared with one of pKa 4.8 is:",
  choices:["Stronger, by a factor of about 40","Weaker, by a factor of about 40","Stronger, by a factor of 1.6","Identical in strength"],
  a:0, why:"pKa is a negative log, so lower means stronger; 10^1.6 ≈ 40 times the Ka." },

{ id:"a6-026", mod:"M6", topic:"Ka", diff:3,
  q:"For 0.10 mol/L of a weak acid with Ka = 1.0 × 10⁻⁵, the pH is closest to:",
  choices:["3.0","5.0","1.0","7.0"],
  a:0, why:"[H⁺] = √(Ka × c) = √(1.0 × 10⁻⁶) = 1.0 × 10⁻³, giving pH 3.0." },

{ id:"a6-027", mod:"M6", topic:"Percentage ionisation", diff:3,
  q:"Diluting a weak acid causes its percentage ionisation to:",
  choices:["Increase","Decrease","Stay constant","Fall to zero"],
  a:0, why:"Dilution shifts the ionisation equilibrium towards more particles, so a larger fraction dissociates even though [H⁺] falls." },

{ id:"a6-028", mod:"M6", topic:"Polyprotic acids", diff:3,
  q:"For a polyprotic acid, Ka1 is always much larger than Ka2 because:",
  choices:["Removing a proton from an anion is harder","The second proton is more acidic","The molecule becomes smaller","Water molecules compete for the second proton"],
  a:0, why:"The growing negative charge holds the remaining protons more tightly, typically by four to five orders of magnitude." },

/* ── salt hydrolysis ─────────────────────────────────────── */
{ id:"a6-029", mod:"M6", topic:"Salt hydrolysis", diff:2,
  q:"An aqueous solution of sodium ethanoate is:",
  choices:["Basic, as ethanoate hydrolyses","Acidic, as sodium hydrolyses","Neutral, as it is a salt","Basic, as sodium releases hydroxide"],
  a:0, why:"Ethanoate is the conjugate base of a weak acid, so it removes protons from water and releases OH⁻." },

{ id:"a6-030", mod:"M6", topic:"Salt hydrolysis", diff:2,
  q:"An aqueous solution of ammonium chloride is:",
  choices:["Acidic, as ammonium donates protons","Basic, as chloride accepts protons","Neutral, as both ions are inert","Basic, as ammonia is released"],
  a:0, why:"NH₄⁺ is the conjugate acid of the weak base ammonia, so it hydrolyses to give H₃O⁺." },

{ id:"a6-031", mod:"M6", topic:"Salt hydrolysis", diff:3,
  q:"Which salt gives a neutral aqueous solution?",
  choices:["Potassium nitrate","Sodium carbonate","Ammonium sulfate","Sodium ethanoate"],
  a:0, why:"Both ions come from a strong acid and a strong base, so neither hydrolyses appreciably." },

{ id:"a6-032", mod:"M6", topic:"Salt hydrolysis", diff:3,
  q:"Sodium carbonate solution is strongly basic because carbonate:",
  choices:["Accepts protons from water","Donates protons to water","Precipitates hydroxide ions","Reacts directly with sodium"],
  a:0, why:"CO₃²⁻ is the conjugate base of the weak acid HCO₃⁻, so hydrolysis generates hydroxide." },

/* ── indicators ──────────────────────────────────────────── */
{ id:"a6-033", mod:"M6", topic:"Indicators", diff:2,
  q:"An acid–base indicator is best described as a:",
  choices:["Weak acid whose forms differ in colour","Strong acid that changes colour sharply","Neutral salt that absorbs light","Catalyst for the neutralisation"],
  a:0, why:"HIn and In⁻ have different colours, and their ratio is set by the solution's pH." },

{ id:"a6-034", mod:"M6", topic:"Indicators", diff:3,
  q:"An indicator changes colour most sharply when the pH equals its:",
  choices:["pKa value","Ka value","Equivalence point","Concentration in solution"],
  a:0, why:"At pH = pKa the two coloured forms are present in equal amounts, which is the midpoint of the transition." },

{ id:"a6-035", mod:"M6", topic:"Indicators", diff:3,
  q:"For a titration of a weak acid with a strong base, the best indicator is:",
  choices:["Phenolphthalein","Methyl orange","Bromophenol blue","Methyl red"],
  a:0, why:"The equivalence point is above pH 7, and phenolphthalein's 8.3–10.0 range falls inside the vertical section." },

{ id:"a6-036", mod:"M6", topic:"Indicators", diff:3,
  q:"For a titration of a weak base with a strong acid, the best indicator is:",
  choices:["Methyl orange","Phenolphthalein","Thymol blue","Alizarin yellow"],
  a:0, why:"The equivalence point is below pH 7, matching methyl orange's 3.1–4.4 transition range." },

/* ── titration curves ────────────────────────────────────── */
{ id:"a6-037", mod:"M6", topic:"Titration curves", diff:2,
  q:"The equivalence point of a titration is where:",
  choices:["Moles of acid and base are stoichiometrically equal","The indicator first changes colour in the flask","The pH reaches exactly 7","The burette reading is recorded"],
  a:0, why:"It is defined by stoichiometry. The end point is where the indicator changes, ideally very close by." },

{ id:"a6-038", mod:"M6", topic:"Titration curves", diff:3,
  q:"A strong acid–strong base titration has an equivalence point at pH:",
  choices:["7.0","Above 7","Below 7","Exactly 14"],
  a:0, why:"The salt formed has no hydrolysing ion, so the solution at equivalence is neutral." },

{ id:"a6-039", mod:"M6", topic:"Titration curves", diff:3,
  q:"A weak acid–strong base titration has an equivalence point:",
  choices:["Above pH 7","Below pH 7","Exactly at pH 7","Below pH 4"],
  a:0, why:"The conjugate base of the weak acid hydrolyses, making the solution basic at equivalence." },

{ id:"a6-040", mod:"M6", topic:"Titration curves", diff:3,
  q:"The half-equivalence point of a weak acid titration is useful because there:",
  choices:["pH equals the pKa of the acid","The solution is exactly neutral","All the acid has reacted","The indicator changes colour"],
  a:0, why:"Half the acid is converted to its conjugate base, so the buffer equation reduces to pH = pKa." },

{ id:"a6-041", mod:"M6", topic:"Titration curves", diff:3,
  q:"Compared with a strong acid–strong base curve, a weak acid–strong base curve has:",
  choices:["A shorter vertical section","A longer vertical section","No vertical section at all","An identical vertical section"],
  a:0, why:"Buffering before equivalence flattens the early curve, narrowing the range of usable indicators." },

/* ── buffers ─────────────────────────────────────────────── */
{ id:"a6-042", mod:"M6", topic:"Buffers", diff:2,
  q:"A buffer solution is typically made from a weak acid and:",
  choices:["Its conjugate base","A strong base of equal concentration","A strong acid","An inert salt"],
  a:0, why:"Having both members of the conjugate pair present lets the solution absorb added acid or base." },

{ id:"a6-043", mod:"M6", topic:"Buffers", diff:3,
  q:"Adding a small amount of strong acid to a buffer causes:",
  choices:["The conjugate base to consume the added H⁺","The weak acid to release much more H⁺","The pH to fall by several units","The buffer to precipitate out"],
  a:0, why:"The basic component neutralises the addition, so the ratio changes only slightly and pH barely moves." },

{ id:"a6-044", mod:"M6", topic:"Buffers", diff:3,
  q:"A buffer has its greatest capacity when the acid and conjugate base are:",
  choices:["Present in roughly equal amounts","Present in a 10 : 1 ratio by concentration","Both extremely dilute","Both fully ionised"],
  a:0, why:"Equal amounts leave the maximum reserve to neutralise additions in either direction." },

{ id:"a6-045", mod:"M6", topic:"Buffers", diff:3,
  q:"Blood is buffered near pH 7.4 principally by the:",
  choices:["Carbonic acid–hydrogencarbonate system","Ethanoic acid–ethanoate system","Ammonia–ammonium system","Phosphoric acid–phosphate system alone"],
  a:0, why:"H₂CO₃/HCO₃⁻ is coupled to respiration, so the body can adjust it rapidly by changing breathing rate." },

{ id:"a6-046", mod:"M6", topic:"Buffers", diff:3,
  q:"Which pair would NOT form a buffer solution?",
  choices:["HCl and NaCl","CH₃COOH and CH₃COONa","NH₃ and NH₄Cl","H₂CO₃ and NaHCO₃"],
  a:0, why:"Chloride is the conjugate base of a strong acid and has no measurable affinity for protons." },

/* ── volumetric analysis ─────────────────────────────────── */
{ id:"a6-047", mod:"M6", topic:"Primary standards", diff:2,
  q:"A primary standard must be:",
  choices:["Pure, stable and of known formula","Highly volatile, reactive and hygroscopic","A strong acid in every case","Coloured for easy detection"],
  a:0, why:"Only then can a solution of accurately known concentration be made by weighing alone." },

{ id:"a6-048", mod:"M6", topic:"Primary standards", diff:3,
  q:"Anhydrous sodium carbonate is a good primary standard largely because it:",
  choices:["Can be dried to constant mass without decomposing","Reacts instantly with every weak acid","Has an unusually low molar mass","Changes colour at the equivalence point"],
  a:0, why:"Oven-drying removes absorbed water without altering the compound, so the weighed mass reliably gives the moles present." },

{ id:"a6-049", mod:"M6", topic:"Titration technique", diff:2,
  q:"A conical flask is rinsed with distilled water before a titration because:",
  choices:["Residual water does not change moles present","Water increases the reaction rate","The flask must be completely chemically dried","Water acts as an indicator"],
  a:0, why:"Extra water dilutes but does not alter the moles of aliquot, so the titre is unaffected." },

{ id:"a6-050", mod:"M6", topic:"Titration technique", diff:3,
  q:"An air bubble in the burette tip released during titration makes the recorded titre:",
  choices:["Larger than the true value","Smaller than the true value","Unchanged from the true value","Impossible to read at all"],
  a:0, why:"The volume that filled the bubble is counted as delivered liquid, inflating the apparent titre." },

{ id:"a6-051", mod:"M6", topic:"Titration technique", diff:3,
  q:"Concordant titres are usually defined as results agreeing within:",
  choices:["0.10 mL of each other","1.00 mL of each other","0.01 mL of each other","5% of each other"],
  a:0, why:"This tolerance reflects the practical reading precision of a 50 mL burette." },

{ id:"a6-052", mod:"M6", topic:"Volumetric analysis", diff:3,
  q:"A 25.0 mL aliquot of NaOH needs 22.5 mL of 0.100 mol/L HCl. The NaOH concentration is:",
  choices:["0.0900 mol/L","0.111 mol/L","0.225 mol/L","0.0450 mol/L"],
  a:0, why:"n(HCl) = 0.00225 mol, the ratio is 1 : 1, so c = 0.00225/0.0250 = 0.0900 mol/L." },

{ id:"a6-053", mod:"M6", topic:"Volumetric analysis", diff:3,
  q:"A 20.0 mL aliquot of H₂SO₄ needs 30.0 mL of 0.200 mol/L NaOH. The acid concentration is:",
  choices:["0.150 mol/L","0.300 mol/L","0.075 mol/L","0.600 mol/L"],
  a:0, why:"n(NaOH) = 0.00600 mol; the ratio is 2 : 1, so n(acid) = 0.00300 mol and c = 0.150 mol/L." },

{ id:"a6-054", mod:"M6", topic:"Back titration", diff:3,
  q:"A back titration is used when the analyte:",
  choices:["Reacts too slowly for a direct titration","Is already a standard solution","Has no suitable indicator available","Is present in very high concentration"],
  a:0, why:"Excess reagent is added and allowed to finish reacting, then the leftover is titrated to find what was consumed." },

{ id:"a6-055", mod:"M6", topic:"Back titration", diff:3,
  q:"In a back titration, the moles of analyte are found by:",
  choices:["Subtracting the excess from the total added","Adding the excess back to the total added","Multiplying the two volumes together","Dividing the titre by the aliquot"],
  a:0, why:"What reacted with the analyte is the difference between what was supplied and what remained." },

/* ── neutralisation energetics ───────────────────────────── */
{ id:"a6-056", mod:"M6", topic:"Enthalpy of neutralisation", diff:3,
  q:"Neutralisation of any strong acid with any strong base releases about 57 kJ/mol because:",
  choices:["The same reaction H⁺ + OH⁻ → H₂O occurs","All salts have similar lattice energies","Strong acids all have the same Ka","The spectator ions react identically"],
  a:0, why:"Both are fully ionised, so the only chemical change is water formation regardless of which ions are present." },

{ id:"a6-057", mod:"M6", topic:"Enthalpy of neutralisation", diff:3,
  q:"Neutralising a weak acid with a strong base releases slightly less energy because:",
  choices:["Energy is absorbed ionising the weak acid","The reaction does not go to completion","Weak acids have lower molar masses","The salt formed is less soluble"],
  a:0, why:"Some of the released energy is consumed breaking the covalent bond that was holding the proton." },

/* ── environment and application ─────────────────────────── */
{ id:"a6-058", mod:"M6", topic:"Acid rain", diff:2,
  q:"Sulfur dioxide contributes to acid rain by forming:",
  choices:["Sulfurous and sulfuric acids","Hydrochloric acid alone","Carbonic acid only","Nitric acid only"],
  a:0, why:"SO₂ dissolves to give H₂SO₃ and is oxidised in the atmosphere to the much stronger H₂SO₄." },

{ id:"a6-059", mod:"M6", topic:"Acid rain", diff:3,
  q:"Unpolluted rainwater is naturally slightly acidic at about pH 5.6 because of dissolved:",
  choices:["Carbon dioxide","Sulfur dioxide","Nitrogen dioxide","Ozone"],
  a:0, why:"Atmospheric CO₂ forms carbonic acid, so pH 5.6 is the natural baseline rather than pollution." },

{ id:"a6-060", mod:"M6", topic:"Acid reactions", diff:3,
  q:"Limestone is added to acidified lakes because calcium carbonate:",
  choices:["Neutralises excess acid slowly","Precipitates the dissolved metals","Absorbs carbon dioxide from air","Increases the water's conductivity"],
  a:0, why:"Its low solubility gives a gradual, self-limiting release of base rather than a dangerous pH spike." },

{ id:"a6-061", mod:"M6", topic:"Acid reactions", diff:3,
  q:"Antacids commonly contain magnesium hydroxide because it:",
  choices:["Neutralises stomach acid without being caustic","Is a strong base that acts instantly","Dissolves completely in the stomach's fluid","Catalyses the breakdown of acid"],
  a:0, why:"Very low solubility limits the OH⁻ concentration, so it neutralises steadily without harming the stomach lining." },

/* ── mixed reasoning ─────────────────────────────────────── */
{ id:"a6-062", mod:"M6", topic:"pH calculations", diff:3,
  q:"Mixing 40.0 mL of 0.100 mol/L NaOH with 40.0 mL of 0.200 mol/L CH₃COOH gives a solution that is:",
  choices:["A buffer, since both the acid and its base remain","Strongly basic, since the NaOH is in large excess","Exactly neutral at pH 7.00","Strongly acidic at about pH 1"],
  a:0, why:"Half the ethanoic acid is converted to ethanoate, leaving equal amounts of the conjugate pair — the half-equivalence point." },

{ id:"a6-063", mod:"M6", topic:"pH calculations", diff:3,
  q:"Adding 10.0 mL of 0.100 mol/L NaOH to 90.0 mL of pure water gives a pH closest to:",
  choices:["12.0","2.00","11.0","13.0"],
  a:0, why:"n(OH⁻) = 0.00100 mol in 0.100 L gives 0.0100 mol/L, so pOH = 2.00 and pH = 12.0." },

{ id:"a6-064", mod:"M6", topic:"Strong vs weak", diff:3,
  q:"Two acids of equal concentration have pH 1.0 and pH 3.0. The ratio of their [H⁺] is:",
  choices:["100 : 1","2 : 1","3 : 1","1000 : 1"],
  a:0, why:"Each pH unit is a factor of ten, so two units is a hundredfold difference." },

{ id:"a6-065", mod:"M6", topic:"Neutralisation", diff:2,
  q:"Neutralising an acid with a metal hydroxide always produces:",
  choices:["A salt and water","A salt and hydrogen","A salt and carbon dioxide","An oxide and water"],
  a:0, why:"H⁺ combines with OH⁻ to give water, and the remaining ions constitute the salt." },

{ id:"a6-066", mod:"M6", topic:"Ka", diff:3,
  q:"For a weak base, Kb and the Ka of its conjugate acid are related by:",
  choices:["Ka × Kb = Kw","Ka + Kb = Kw","Ka / Kb = Kw","Ka − Kb = Kw"],
  a:0, why:"Adding the two ionisation equations gives the self-ionisation of water, so the constants multiply." },

{ id:"a6-067", mod:"M6", topic:"Titration curves", diff:3,
  q:"On a titration curve, the steepest gradient occurs at the:",
  choices:["Equivalence point","Half-equivalence point","Start of the titration","End of the titration"],
  a:0, why:"Near equivalence the buffering capacity is exhausted, so a tiny addition changes pH dramatically." },

{ id:"a6-068", mod:"M6", topic:"Buffers", diff:3,
  q:"The Henderson–Hasselbalch equation shows buffer pH depends on pKa and the:",
  choices:["Ratio of base to acid concentrations","Absolute concentration of the acid","Total volume of the buffer","Temperature of the solution only"],
  a:0, why:"Because it is a ratio, diluting a buffer changes both terms equally and barely alters the pH." },

{ id:"a6-069", mod:"M6", topic:"pH calculations", diff:3,
  q:"A solution of pH 3 is compared with one of pH 6. The first is more acidic by a factor of:",
  choices:["1000","3","300","30"],
  a:0, why:"Three pH units correspond to 10³ in hydrogen ion concentration." },

{ id:"a6-070", mod:"M6", topic:"Volumetric analysis", diff:3,
  q:"Using a pipette rinsed with the solution to be measured rather than water ensures the:",
  choices:["Aliquot is not diluted before delivery","Pipette drains completely each time","Indicator works more effectively","Titre is smaller and easier to read"],
  a:0, why:"Any residual water would dilute the aliquot, lowering the moles delivered and biasing every result." },

{ id:"a6-071", mod:"M6", topic:"Amphiprotic species", diff:3,
  q:"Which species could act as either a Brønsted acid or base?",
  choices:["HSO₄⁻","SO₄²⁻","H₂SO₄","Na⁺"],
  a:0, why:"Hydrogensulfate can lose its remaining proton or regain one to become sulfuric acid." },

{ id:"a6-072", mod:"M6", topic:"Strong vs weak", diff:3,
  q:"Which acid is classified as strong in water?",
  choices:["Nitric acid","Ethanoic acid","Carbonic acid","Hydrofluoric acid"],
  a:0, why:"HNO₃ ionises essentially completely; the other three establish an equilibrium with substantial unionised acid." },

{ id:"a6-073", mod:"M6", topic:"Salt hydrolysis", diff:3,
  q:"Ammonium ethanoate solution is close to neutral because:",
  choices:["Both ions hydrolyse to a similar extent","Neither ion reacts with water","Ammonium is a very strong acid","Ethanoate precipitates from solution"],
  a:0, why:"The acidity of NH₄⁺ and the basicity of CH₃COO⁻ nearly cancel, since Ka and Kb are comparable." },

{ id:"a6-074", mod:"M6", topic:"Titration technique", diff:3,
  q:"Titrating past the end point and then adding acid back is poor practice because it:",
  choices:["Destroys the stoichiometric relationship measured","Uses too much indicator solution","Cools the reaction mixture down","Makes the indicator colour change irreversible"],
  a:0, why:"The titre no longer corresponds to a single delivery of one reagent, so the calculation is invalid." },

{ id:"a6-075", mod:"M6", topic:"pH calculations", diff:3,
  q:"Which solution has the lowest pH?",
  choices:["0.10 mol/L HCl","0.10 mol/L CH₃COOH","0.10 mol/L NaCl","0.10 mol/L NH₃"],
  a:0, why:"Full ionisation gives [H⁺] = 0.10, higher than the partially ionised weak acid and far above the neutral and basic solutions." }

];
