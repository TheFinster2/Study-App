/* Module 6 — Acid/Base Reactions */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM6 = [
{ id:"m6-01", mod:"M6", topic:"Acid–base theories", diff:1,
  q:"According to Brønsted–Lowry theory, an acid is a substance that:",
  choices:["Donates a proton","Produces OH⁻ in water","Accepts an electron pair","Produces H⁺ only in aqueous solution"],
  a:0, why:"Brønsted–Lowry defines acids as proton donors and bases as proton acceptors. This extends Arrhenius theory to non-aqueous systems, e.g. NH₃(g) + HCl(g) → NH₄Cl(s)." },

{ id:"m6-02", mod:"M6", topic:"Acid–base theories", diff:2,
  q:"A key limitation of Arrhenius theory that Brønsted–Lowry theory overcomes is that Arrhenius:",
  choices:["Cannot explain why ammonia is basic without containing OH⁻","Cannot account for the complete ionisation of strong acids","Ignores the role played by water as a solvent entirely","Applies only to organic acids such as ethanoic acid"],
  a:0, why:"NH₃ has no hydroxide group, yet it is clearly basic. Brønsted–Lowry explains it as a proton acceptor: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻." },

{ id:"m6-03", mod:"M6", topic:"Conjugate pairs", diff:2,
  q:"What is the conjugate base of H₂PO₄⁻?",
  choices:["HPO₄²⁻","H₃PO₄","PO₄³⁻","H₂PO₄⁺"],
  a:0, why:"A conjugate base is formed by removing one proton: H₂PO₄⁻ − H⁺ → HPO₄²⁻. Adding a proton would give the conjugate acid H₃PO₄." },

{ id:"m6-04", mod:"M6", topic:"Amphiprotic species", diff:2,
  q:"Which species is amphiprotic?",
  choices:["HCO₃⁻","CO₃²⁻","Na⁺","Cl⁻"],
  a:0, why:"HCO₃⁻ can donate a proton (→ CO₃²⁻) or accept one (→ H₂CO₃). An amphiprotic species must have both an ionisable H and a lone pair to accept a proton." },

{ id:"m6-05", mod:"M6", topic:"Strong vs weak", diff:2,
  q:"The difference between a strong acid and a concentrated acid is that:",
  choices:["Strong refers to degree of ionisation; concentrated to moles per litre","The two terms describe exactly the same property of an acidic solution","A strong acid is by definition always a concentrated one","Concentrated acids are those that ionise completely in water"],
  a:0, why:"You can have dilute HCl (strong but low concentration) and concentrated ethanoic acid (weak but high concentration). Strength is an intrinsic property; concentration is how much you dissolved." },

{ id:"m6-06", mod:"M6", topic:"Strong vs weak", diff:2,
  q:"Equal concentrations of HCl and CH₃COOH are compared. The ethanoic acid solution will have:",
  choices:["Higher pH and lower conductivity","Lower pH and higher conductivity","The same pH","Higher conductivity but the same pH"],
  a:0, why:"CH₃COOH only partially ionises, so [H₃O⁺] is much lower — higher pH — and there are fewer mobile ions, so conductivity is lower. The reaction rate with Mg would also be slower." },

{ id:"m6-07", mod:"M6", topic:"pH calculations", diff:2,
  q:"What is the pH of a 0.010 mol L⁻¹ HCl solution?",
  choices:["2.00","1.00","12.00","0.010"],
  a:0, why:"HCl is a strong monoprotic acid, so [H₃O⁺] = 0.010 mol L⁻¹. pH = −log₁₀(0.010) = 2.00." },

{ id:"m6-08", mod:"M6", topic:"pH calculations", diff:3,
  q:"What is the pH of 0.0050 mol L⁻¹ Ba(OH)₂ at 25 °C?",
  choices:["12.00","11.70","2.00","12.30"],
  a:0, why:"Ba(OH)₂ gives 2 OH⁻ per formula unit: [OH⁻] = 0.010 mol L⁻¹. pOH = 2.00, so pH = 14.00 − 2.00 = 12.00." },

{ id:"m6-09", mod:"M6", topic:"Kw", diff:2,
  q:"At 25 °C, Kw = 1.0 × 10⁻¹⁴. If [H₃O⁺] = 2.0 × 10⁻⁵, then [OH⁻] equals:",
  choices:["5.0 × 10⁻¹⁰","2.0 × 10⁻⁹","5.0 × 10⁻⁵","1.0 × 10⁻¹⁴"],
  a:0, why:"[OH⁻] = Kw/[H₃O⁺] = 1.0 × 10⁻¹⁴ / 2.0 × 10⁻⁵ = 5.0 × 10⁻¹⁰ mol L⁻¹." },

{ id:"m6-10", mod:"M6", topic:"Kw", diff:3,
  q:"At 50 °C, Kw = 5.5 × 10⁻¹⁴ and pure water has pH ≈ 6.63. This water is:",
  choices:["Still neutral, because [H₃O⁺] equals [OH⁻]","Acidic, because the pH has fallen below 7","Basic, because Kw is larger than at 25 °C","Impossible — pure water is always exactly pH 7"],
  a:0, why:"Neutrality means [H₃O⁺] = [OH⁻], not pH = 7. Autoionisation is endothermic, so heating increases Kw and lowers the neutral pH." },

{ id:"m6-11", mod:"M6", topic:"Dilution and pH", diff:3,
  q:"A solution of pH 3 is diluted with water by a factor of 100. The new pH is:",
  choices:["5","1","3","30"],
  a:0, why:"[H₃O⁺] falls from 10⁻³ to 10⁻⁵ mol L⁻¹. Each tenfold dilution raises pH by 1 unit for a strong acid, so two tenfold dilutions give pH 5." },

{ id:"m6-12", mod:"M6", topic:"Ka", diff:3,
  q:"Ethanoic acid has Ka = 1.8 × 10⁻⁵. What is the pH of a 0.10 mol L⁻¹ solution?",
  choices:["2.87","1.00","4.74","5.00"],
  a:0, why:"[H₃O⁺] = √(Ka × c) = √(1.8 × 10⁻⁵ × 0.10) = √(1.8 × 10⁻⁶) = 1.34 × 10⁻³. pH = −log(1.34 × 10⁻³) = 2.87." },

{ id:"m6-13", mod:"M6", topic:"Ka and pKa", diff:2,
  q:"Acid X has pKa = 3.2 and acid Y has pKa = 4.8. Which is true?",
  choices:["X is the stronger acid and has the weaker conjugate base","Y is the stronger acid because its pKa value is larger","X has the smaller Ka, so it ionises less readily","Both acids ionise to essentially the same extent"],
  a:0, why:"pKa = −log Ka, so a smaller pKa means a larger Ka and a stronger acid. Stronger acids have weaker (more stable) conjugate bases." },

{ id:"m6-14", mod:"M6", topic:"Salt hydrolysis", diff:3,
  q:"An aqueous solution of sodium ethanoate (CH₃COONa) is:",
  choices:["Basic, because ethanoate hydrolyses to give OH⁻","Acidic, because the sodium ion hydrolyses in water","Neutral, since it is the salt of a neutralisation","Basic, because Na⁺ reacts with water to give NaOH"],
  a:0, why:"Na⁺ is a spectator, but CH₃COO⁻ is the conjugate base of a weak acid: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻, raising the pH above 7." },

{ id:"m6-15", mod:"M6", topic:"Salt hydrolysis", diff:3,
  q:"Which salt gives an acidic solution?",
  choices:["NH₄Cl","NaCl","KNO₃","CH₃COOK"],
  a:0, why:"NH₄⁺ is the conjugate acid of the weak base ammonia and donates a proton to water: NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺. Cl⁻ is a spectator." },

{ id:"m6-16", mod:"M6", topic:"Neutralisation", diff:2,
  q:"The net ionic equation for the reaction of a strong acid with a strong base is:",
  choices:["H⁺(aq) + OH⁻(aq) → H₂O(l)","HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)","H₂O(l) → H⁺(aq) + OH⁻(aq)","Na⁺(aq) + Cl⁻(aq) → NaCl(aq)"],
  a:0, why:"Both are fully ionised, so Na⁺ and Cl⁻ are spectator ions and cancel. Every strong acid–strong base neutralisation has ΔH ≈ −57 kJ mol⁻¹ for this same reaction." },

{ id:"m6-17", mod:"M6", topic:"Titration", diff:2,
  q:"Which indicator is most appropriate for titrating ethanoic acid with sodium hydroxide?",
  choices:["Phenolphthalein, range 8.3–10.0","Methyl orange, range 3.1–4.4","Methyl red, range 4.4–6.2","Any indicator, since the jump is steep"],
  a:0, why:"The equivalence point is basic (pH ≈ 8.7) because the salt formed hydrolyses. The indicator's range must lie within the steep section, so phenolphthalein fits and methyl orange would change far too early." },

{ id:"m6-18", mod:"M6", topic:"Titration", diff:2,
  q:"For a strong acid titrated with a strong base, the equivalence point occurs at pH:",
  choices:["7","Below 7","Above 7","It depends on the concentrations"],
  a:0, why:"The salt formed (e.g. NaCl) contains only spectator ions that do not hydrolyse, so the solution at equivalence is neutral at 25 °C." },

{ id:"m6-19", mod:"M6", topic:"Titration", diff:3,
  q:"25.00 mL of NaOH requires 18.60 mL of 0.1050 mol L⁻¹ HCl to reach the end point. [NaOH] is:",
  choices:["0.07812 mol L⁻¹","0.1411 mol L⁻¹","0.1050 mol L⁻¹","0.03906 mol L⁻¹"],
  a:0, why:"n(HCl) = 0.01860 × 0.1050 = 1.953 × 10⁻³ mol. The ratio is 1:1, so n(NaOH) is the same. c = 1.953 × 10⁻³ / 0.02500 = 0.07812 mol L⁻¹." },

{ id:"m6-20", mod:"M6", topic:"Titration technique", diff:2,
  q:"A conical flask rinsed with the standard solution instead of distilled water will:",
  choices:["Add extra moles of analyte, giving a titre that is too high","Have no measurable effect, because the extra liquid is only water","Give a titre that is too low by diluting the analyte","Affect only the precision of repeats, not the accuracy"],
  a:0, why:"Residual solution in the flask contributes extra moles, so more titrant is needed. The flask should be rinsed with distilled water only — extra water does not change the number of moles delivered by the pipette." },

{ id:"m6-21", mod:"M6", topic:"Titration technique", diff:2,
  q:"Why must a burette be rinsed with the titrant before use?",
  choices:["Residual water would dilute the titrant, raising the titre","To dislodge any air bubbles trapped below the tap","To bring the glassware up to the room temperature","To sterilise the inside surface of the glass before the titration begins"],
  a:0, why:"Water left in the burette lowers the actual concentration delivered, so a larger volume is required to reach the end point — a systematic error." },

{ id:"m6-22", mod:"M6", topic:"Primary standards", diff:2,
  q:"Which property is NOT required of a primary standard?",
  choices:["It must be a strong acid or a strong base","It must be obtainable in a very high purity","It must have a known and stable composition","It should have a high molar mass to cut weighing error"],
  a:0, why:"Anhydrous sodium carbonate is a common primary standard and is a weak base. What matters is purity, stability (non-hygroscopic), known formula and a reasonably high molar mass." },

{ id:"m6-23", mod:"M6", topic:"Primary standards", diff:2,
  q:"Why is sodium hydroxide unsuitable as a primary standard?",
  choices:["It is hygroscopic and absorbs CO₂ from the air","It is too weak a base to react quantitatively","Its molar mass is too high to weigh accurately","It is insufficiently soluble in cold distilled water"],
  a:0, why:"NaOH pellets absorb water vapour and CO₂ (forming Na₂CO₃), so a weighed mass does not correspond to a known number of moles. It must be standardised against a primary standard." },

{ id:"m6-24", mod:"M6", topic:"Buffers", diff:3,
  q:"A buffer solution is best described as:",
  choices:["A weak acid and its conjugate base in comparable amounts","A strong acid mixed with an equal amount of strong base","Any solution whose pH happens to sit close to 7","A saturated solution of a sparingly soluble salt"],
  a:0, why:"The weak acid neutralises added base and the conjugate base neutralises added acid, so pH resists change. Strong acid/base pairs simply neutralise each other completely." },

{ id:"m6-25", mod:"M6", topic:"Buffers", diff:3,
  q:"In the blood buffer H₂CO₃ ⇌ H⁺ + HCO₃⁻, adding a small amount of acid causes:",
  choices:["HCO₃⁻ to accept H⁺, shifting left and limiting the pH drop","The pH of the blood to fall sharply and more or less immediately","The hydrogen carbonate concentration to increase","The carbonic acid present to ionise still further"],
  a:0, why:"The conjugate base HCO₃⁻ mops up added H⁺ to form H₂CO₃. Excess CO₂ is exhaled, which is why respiration rate is linked to blood pH." },

{ id:"m6-26", mod:"M6", topic:"Back titration", diff:3,
  q:"Excess acid is added to an antacid tablet and the leftover acid is titrated with NaOH. This technique is used because:",
  choices:["The solid reacts slowly, so a direct titration has no sharp end point","Sodium hydroxide is a primary standard and needs no standardising","It uses less glassware and so introduces fewer random errors","Antacids are strong bases and cannot be titrated directly"],
  a:0, why:"Back titration suits slow-reacting or insoluble samples. Moles reacted = moles acid added − moles acid remaining." },

{ id:"m6-27", mod:"M6", topic:"Enthalpy of neutralisation", diff:3,
  q:"Neutralising a weak acid with a strong base releases slightly less heat than a strong acid–strong base reaction because:",
  choices:["Energy is absorbed to fully ionise the weak acid","The weak acid solution is inevitably more dilute","Fewer moles of water are produced in the reaction","The neutralisation reaction does not go to completion"],
  a:0, why:"Some of the released energy is consumed breaking the remaining un-ionised acid molecules apart, so the measured ΔH is less negative than −57 kJ mol⁻¹." },

{ id:"m6-28", mod:"M6", topic:"Titration curves", diff:3,
  q:"A titration curve showing two distinct equivalence points indicates:",
  choices:["A diprotic acid such as carbonic acid","A strong monoprotic acid such as HCl","A buffer solution resisting pH change","An error in reading the burette scale"],
  a:0, why:"Each ionisable proton produces its own equivalence point. Na₂CO₃ titrated with HCl shows two: CO₃²⁻ → HCO₃⁻, then HCO₃⁻ → H₂CO₃." },

{ id:"m6-29", mod:"M6", topic:"pH", diff:3,
  q:"Which solution has the highest pH?",
  choices:["0.10 mol L⁻¹ NaOH","0.10 mol L⁻¹ NH₃","0.10 mol L⁻¹ NaCl","0.10 mol L⁻¹ CH₃COOH"],
  a:0, why:"NaOH is a strong base and fully ionises to give [OH⁻] = 0.10 (pH 13). Ammonia is a weak base with a lower pH, NaCl is neutral and ethanoic acid is acidic." },

{ id:"m6-30", mod:"M6", topic:"Acid reactions", diff:2,
  q:"Which gas is produced when hydrochloric acid reacts with sodium carbonate?",
  choices:["Carbon dioxide","Carbon monoxide","Oxygen","Chlorine"],
  a:0, why:"2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂. Acid + carbonate always gives salt + water + carbon dioxide; the gas turns limewater milky." },

{ id:"m6-31", mod:"M6", topic:"Acid reactions", diff:2,
  q:"Which combination produces hydrogen gas?",
  choices:["Magnesium with dilute hydrochloric acid","Copper with dilute hydrochloric acid","Sodium carbonate with dilute acid","Sodium hydroxide with dilute acid"],
  a:0, why:"Active metals above hydrogen in the activity series displace H₂: Mg + 2HCl → MgCl₂ + H₂. Copper sits below hydrogen and does not react with dilute non-oxidising acids." },

{ id:"m6-32", mod:"M6", topic:"Volumetric analysis", diff:3,
  q:"When making a standard solution in a volumetric flask, water should be added:",
  choices:["Until the bottom of the meniscus sits on the mark at eye level","Until the flask is filled right up into the narrow neck","Until the top of the meniscus rests on the calibration mark","Roughly up to the mark, since precision matters little here"],
  a:0, why:"Volumetric glassware is calibrated to the bottom of the meniscus. Reading above or below eye level introduces parallax error." }
];
