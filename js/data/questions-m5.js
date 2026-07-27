/* Module 5 — Equilibrium and Acid Reactions */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM5 = [
{ id:"m5-01", mod:"M5", topic:"Dynamic equilibrium", diff:1,
  q:"At dynamic equilibrium in a closed system:",
  choices:["Forward and reverse rates are equal and concentrations are constant","All reaction has stopped","Concentrations of reactants and products are equal","Only the forward reaction occurs"],
  a:0, why:"Both reactions continue at the molecular level, but at equal rates, so macroscopic properties (concentration, colour, pressure) stay constant. Equal rates does not mean equal concentrations." },

{ id:"m5-02", mod:"M5", topic:"Dynamic equilibrium", diff:2,
  q:"Which observation is the best evidence that an equilibrium is dynamic rather than static?",
  choices:["Radioactive tracer added as reactant later appears in the product","The colour stops changing","The pressure is constant","The temperature stays constant"],
  a:0, why:"Isotopic labelling shows atoms are still moving between reactant and product species even though the bulk concentrations do not change — the defining feature of a dynamic equilibrium." },

{ id:"m5-03", mod:"M5", topic:"Open vs closed", diff:2,
  q:"Why can equilibrium never be established when limestone is heated in an open crucible? CaCO₃(s) ⇌ CaO(s) + CO₂(g)",
  choices:["CO₂ escapes, so the reverse reaction cannot occur","CaCO₃ is insoluble","The reaction is irreversible by nature","The reaction is exothermic"],
  a:0, why:"Equilibrium requires a closed system. Because CO₂ diffuses away, its concentration never builds up and the system is continually driven forward until all CaCO₃ decomposes." },

{ id:"m5-04", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = −92 kJ mol⁻¹, increasing the temperature will:",
  choices:["Shift left and decrease K","Shift right and increase K","Shift left but leave K unchanged","Have no effect on the equilibrium"],
  a:0, why:"Heat is effectively a product of an exothermic reaction. Adding heat shifts the system left to absorb it, reducing the yield of NH₃, and K falls because K only changes with temperature." },

{ id:"m5-05", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"For N₂O₄(g) ⇌ 2NO₂(g), what happens when the volume of the container is halved at constant temperature?",
  choices:["Shifts left, favouring N₂O₄","Shifts right, favouring NO₂","No shift because moles of gas are equal","K increases"],
  a:0, why:"Halving the volume doubles all partial pressures. The system shifts to the side with fewer gas moles — left, towards 1 mol of N₂O₄ — to partially oppose the pressure rise. K is unchanged." },

{ id:"m5-06", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Adding argon to a rigid vessel containing N₂/H₂/NH₃ at equilibrium will:",
  choices:["Cause no shift — partial pressures of reacting gases are unchanged","Shift towards ammonia","Shift away from ammonia","Increase K"],
  a:0, why:"Total pressure rises, but argon is inert and the volume is fixed, so the partial pressures (and concentrations) of N₂, H₂ and NH₃ are unaltered. Q still equals K." },

{ id:"m5-07", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"Adding a catalyst to a system at equilibrium:",
  choices:["Has no effect on the position of equilibrium or K","Shifts the equilibrium right","Increases the yield of product","Increases K"],
  a:0, why:"A catalyst lowers the activation energy of the forward and reverse reactions by the same amount, so both rates increase equally. Equilibrium is reached faster but at the same position." },

{ id:"m5-08", mod:"M5", topic:"Equilibrium constant", diff:2,
  q:"For the reaction 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), the correct expression for K is:",
  choices:["[SO₃]² / ([SO₂]²[O₂])","[SO₂]²[O₂] / [SO₃]²","2[SO₃] / (2[SO₂][O₂])","[SO₃] / ([SO₂][O₂])"],
  a:0, why:"K = products over reactants, each raised to its coefficient. Coefficients become exponents, not multipliers." },

{ id:"m5-09", mod:"M5", topic:"Equilibrium constant", diff:2,
  q:"Which species is omitted from an equilibrium expression?",
  choices:["Pure solids and pure liquids","Gases","Aqueous ions","Weak acids"],
  a:0, why:"The 'concentration' of a pure solid or liquid is fixed by its density, so it is folded into the value of K. Only gases and aqueous species appear." },

{ id:"m5-10", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"At equilibrium [H₂] = 0.20, [I₂] = 0.20 and [HI] = 1.60 mol L⁻¹ for H₂ + I₂ ⇌ 2HI. K equals:",
  choices:["64","8.0","0.016","32"],
  a:0, why:"K = [HI]²/([H₂][I₂]) = (1.60)²/(0.20 × 0.20) = 2.56/0.040 = 64." },

{ id:"m5-11", mod:"M5", topic:"Reaction quotient", diff:3,
  q:"If Q > K for a reaction mixture, the system will:",
  choices:["Shift left, forming more reactants","Shift right, forming more products","Already be at equilibrium","Have its K value decrease"],
  a:0, why:"Q > K means there is too much product relative to equilibrium. The reverse reaction dominates until Q falls to K." },

{ id:"m5-12", mod:"M5", topic:"Equilibrium constant", diff:2,
  q:"A reaction has K = 1.2 × 10⁻⁸ at 25 °C. This indicates:",
  choices:["Equilibrium lies far to the left; very little product forms","Products dominate strongly","The reaction is very fast","Reactants and products are about equal"],
  a:0, why:"A very small K means the denominator (reactants) dominates. Note that K says nothing about rate — a reaction can have a large K and still be extremely slow." },

{ id:"m5-13", mod:"M5", topic:"ICE tables", diff:3,
  q:"0.100 mol of PCl₅ in a 1.00 L flask decomposes; at equilibrium 0.020 mol of PCl₃ has formed. K for PCl₅ ⇌ PCl₃ + Cl₂ is:",
  choices:["5.0 × 10⁻³","4.0 × 10⁻³","2.0 × 10⁻²","4.0 × 10⁻⁴"],
  a:0, why:"ICE: [PCl₅] = 0.100 − 0.020 = 0.080; [PCl₃] = [Cl₂] = 0.020. K = (0.020 × 0.020)/0.080 = 5.0 × 10⁻³." },

{ id:"m5-14", mod:"M5", topic:"Temperature and K", diff:2,
  q:"The only factor that changes the value of K for a given reaction is:",
  choices:["Temperature","Pressure","Concentration","Adding a catalyst"],
  a:0, why:"Pressure, concentration and catalyst changes shift the position of equilibrium but the ratio defined by K is restored. Only temperature alters the value of K itself." },

{ id:"m5-15", mod:"M5", topic:"Haber process", diff:3,
  q:"Industrial ammonia synthesis uses ~400–500 °C even though the reaction is exothermic. Why?",
  choices:["A compromise: lower temperatures give higher yield but unacceptably slow rates","Higher temperature increases equilibrium yield","The catalyst only works above 400 °C to shift equilibrium","Ammonia decomposes below 400 °C"],
  a:0, why:"Le Chatelier favours low temperature for yield, but the rate would be uneconomically slow. The chosen temperature balances yield against rate — the classic 'compromise conditions' answer." },

{ id:"m5-16", mod:"M5", topic:"Haber process", diff:2,
  q:"High pressure (~200–400 atm) is used in the Haber process because:",
  choices:["4 mol of gas become 2 mol, so high pressure shifts equilibrium right","It lowers the activation energy","It increases K","It prevents the catalyst poisoning"],
  a:0, why:"N₂ + 3H₂ ⇌ 2NH₃ goes from 4 mol to 2 mol of gas. Compressing shifts the system towards fewer gas particles, raising the ammonia yield." },

{ id:"m5-17", mod:"M5", topic:"Contact process", diff:2,
  q:"In the Contact process, SO₃ is absorbed into concentrated H₂SO₄ rather than water because:",
  choices:["Direct reaction with water forms a dense, uncontrollable acid mist","SO₃ does not react with water","Water would decompose the SO₃","Oleum is a waste product"],
  a:0, why:"SO₃ + H₂O is violently exothermic and produces a fine sulfuric acid aerosol that is hard to condense. Absorbing into H₂SO₄ gives oleum (H₂S₂O₇), which is then safely diluted." },

{ id:"m5-18", mod:"M5", topic:"Solubility equilibria", diff:2,
  q:"For AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq), the solubility product expression is:",
  choices:["Ksp = [Ag⁺][Cl⁻]","Ksp = [Ag⁺][Cl⁻]/[AgCl]","Ksp = [AgCl]/([Ag⁺][Cl⁻])","Ksp = [Ag⁺] + [Cl⁻]"],
  a:0, why:"The solid is omitted, leaving the product of the dissolved ion concentrations, each raised to its stoichiometric coefficient (both 1 here)." },

{ id:"m5-19", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"Ksp(AgCl) = 1.8 × 10⁻¹⁰. The molar solubility of AgCl in pure water is:",
  choices:["1.3 × 10⁻⁵ mol L⁻¹","1.8 × 10⁻¹⁰ mol L⁻¹","3.6 × 10⁻¹⁰ mol L⁻¹","9.0 × 10⁻¹¹ mol L⁻¹"],
  a:0, why:"Let s = solubility. Ksp = s² = 1.8 × 10⁻¹⁰, so s = √(1.8 × 10⁻¹⁰) = 1.34 × 10⁻⁵ mol L⁻¹." },

{ id:"m5-20", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"For PbI₂, Ksp = 4s³ rather than s². Why?",
  choices:["Each formula unit releases 1 Pb²⁺ and 2 I⁻, so Ksp = (s)(2s)²","Lead has a charge of 2+","PbI₂ is a strong electrolyte","Iodide ions dimerise"],
  a:0, why:"PbI₂ → Pb²⁺ + 2I⁻ gives [Pb²⁺] = s and [I⁻] = 2s. Ksp = s × (2s)² = 4s³." },

{ id:"m5-21", mod:"M5", topic:"Common ion effect", diff:3,
  q:"Adding NaCl to a saturated AgCl solution causes:",
  choices:["More AgCl to precipitate, as the equilibrium shifts left","More AgCl to dissolve","No change, since NaCl is a spectator","Ksp of AgCl to decrease"],
  a:0, why:"Extra Cl⁻ makes Q > Ksp, so the system shifts left, precipitating AgCl and reducing its solubility. Ksp itself is temperature-dependent only." },

{ id:"m5-22", mod:"M5", topic:"Precipitation prediction", diff:3,
  q:"Equal volumes of 2.0 × 10⁻⁴ mol L⁻¹ AgNO₃ and 2.0 × 10⁻⁴ mol L⁻¹ NaCl are mixed. Given Ksp(AgCl) = 1.8 × 10⁻¹⁰, what happens?",
  choices:["A precipitate forms because Q = 1.0 × 10⁻⁸ > Ksp","No precipitate; Q < Ksp","The solution is exactly saturated","AgCl dissolves completely and Q = Ksp"],
  a:0, why:"Mixing equal volumes halves each concentration to 1.0 × 10⁻⁴. Q = (1.0 × 10⁻⁴)² = 1.0 × 10⁻⁸, which exceeds Ksp, so AgCl precipitates." },

{ id:"m5-23", mod:"M5", topic:"Enthalpy of solution", diff:2,
  q:"The enthalpy of solution is determined by:",
  choices:["The balance between lattice energy absorbed and hydration energy released","Lattice energy only","Hydration energy only","The entropy change of the water"],
  a:0, why:"ΔH_soln = ΔH_lattice (endothermic, breaking the ionic lattice) + ΔH_hydration (exothermic, ions attracting water). Whichever dominates sets the sign." },

{ id:"m5-24", mod:"M5", topic:"Ocean acidification", diff:3,
  q:"Increasing atmospheric CO₂ affects the oceans because:",
  choices:["CO₂ dissolves and forms H₂CO₃, lowering pH and dissolving carbonate shells","CO₂ raises ocean pH","CO₂ is insoluble in seawater","Carbonate concentration increases"],
  a:0, why:"CO₂(g) ⇌ CO₂(aq); CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Extra H⁺ lowers pH and consumes CO₃²⁻, shifting CaCO₃(s) ⇌ Ca²⁺ + CO₃²⁻ right and eroding shells." },

{ id:"m5-25", mod:"M5", topic:"Cobalt equilibrium", diff:3,
  q:"For [Co(H₂O)₆]²⁺(pink) + 4Cl⁻ ⇌ [CoCl₄]²⁻(blue) + 6H₂O, adding concentrated HCl turns the solution blue because:",
  choices:["Increased [Cl⁻] shifts the equilibrium right","HCl raises the temperature","H⁺ is a reactant","Water is removed by H⁺"],
  a:0, why:"Adding a reactant (Cl⁻) drives the system right to consume it, favouring the blue tetrachlorocobaltate complex. Diluting with water reverses it to pink." },

{ id:"m5-26", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"For 2CrO₄²⁻(yellow) + 2H⁺ ⇌ Cr₂O₇²⁻(orange) + H₂O, adding NaOH will:",
  choices:["Turn the solution yellow by removing H⁺","Turn the solution orange","Cause no change","Increase K"],
  a:0, why:"OH⁻ neutralises H⁺, lowering its concentration. The system shifts left to replace it, converting dichromate back to the yellow chromate ion." },

{ id:"m5-27", mod:"M5", topic:"Equilibrium graphs", diff:3,
  q:"On a concentration–time graph, a sudden vertical jump in one species followed by curves settling to new constant values indicates:",
  choices:["A concentration change was imposed on the system","A temperature change","A catalyst was added","The system reached equilibrium for the first time"],
  a:0, why:"Only a concentration change produces an instantaneous discontinuity for a single species. Temperature changes cause all species to curve gradually; a catalyst causes no shift at all." },

{ id:"m5-28", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"If K = 25 for A + B ⇌ C, what is K for the reverse reaction C ⇌ A + B?",
  choices:["0.040","25","−25","5.0"],
  a:0, why:"Reversing a reaction inverts K: K_rev = 1/K = 1/25 = 0.040." },

{ id:"m5-29", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"If K = 4.0 for A ⇌ B, what is K for the reaction 2A ⇌ 2B?",
  choices:["16","8.0","4.0","2.0"],
  a:0, why:"Multiplying an equation by n raises K to the power n: K' = 4.0² = 16." },

{ id:"m5-30", mod:"M5", topic:"Equilibrium", diff:2,
  q:"Removing product from an equilibrium mixture as it forms will:",
  choices:["Shift the equilibrium right and increase overall conversion","Increase K","Decrease the rate of the forward reaction permanently","Have no effect"],
  a:0, why:"Removing a product makes Q < K, so the forward reaction dominates until equilibrium is restored. Industrially this is why ammonia is condensed out and recycled." }
];
