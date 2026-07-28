/* Module 5 expansion A — Equilibrium and Acid Reactions. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM5A = [

/* ── dynamic equilibrium ─────────────────────────────────── */
{ id:"a5-001", mod:"M5", topic:"Dynamic equilibrium", diff:2,
  q:"Adding a radioactive tracer to the products of a system at equilibrium shows tracer appearing in the reactants. This demonstrates that:",
  choices:["Both reactions continue at equal rates","The equilibrium has been disturbed","The reaction has gone to completion","Only the reverse reaction occurs"],
  a:0, why:"Isotopic scrambling is direct evidence that molecular change never stops, even though bulk concentrations are constant." },

{ id:"a5-002", mod:"M5", topic:"Dynamic equilibrium", diff:2,
  q:"A reaction reaches equilibrium when:",
  choices:["Forward and reverse rates become equal","All reactants have been consumed","The concentrations become identical","The temperature stops changing"],
  a:0, why:"Equal opposing rates fix the concentrations, which is a different condition from the concentrations themselves being equal." },

{ id:"a5-003", mod:"M5", topic:"Dynamic equilibrium", diff:3,
  q:"Which property remains constant once equilibrium is established in a closed gaseous system?",
  choices:["Total pressure of the mixture","Rate of the forward reaction only","Mass of each individual molecule","Number of collisions per second"],
  a:0, why:"Macroscopic properties stabilise because the composition stops changing, even though collisions continue unabated." },

{ id:"a5-004", mod:"M5", topic:"Open vs closed", diff:2,
  q:"Heating CaCO₃ in an open crucible drives the decomposition to completion because:",
  choices:["CO₂ escapes so equilibrium is never reached","The forward reaction is strongly exothermic here","Calcium oxide is unstable in air","The reverse reaction is very fast"],
  a:0, why:"Continually removing a product means Q never rises to K, so the system keeps shifting right until the carbonate is gone." },

{ id:"a5-005", mod:"M5", topic:"Open vs closed", diff:3,
  q:"Equilibrium can only be established in a system that is:",
  choices:["Closed to matter exchange","Open to the atmosphere","Held at constant volume","Free of any catalyst"],
  a:0, why:"If products leave the system the reverse reaction cannot compete, so the opposing rates never equalise." },

/* ── Le Chatelier ────────────────────────────────────────── */
{ id:"a5-006", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing pressure shifts the equilibrium:",
  choices:["Right, towards fewer gas moles","Left, towards more gas moles","In neither direction","Right, then back to the left"],
  a:0, why:"Compression is relieved by reducing the total moles of gas, and the right side has two rather than four." },

{ id:"a5-007", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"For an exothermic forward reaction, raising the temperature:",
  choices:["Shifts the equilibrium to the left","Shifts the equilibrium to the right","Leaves the position unchanged","Stops the reverse reaction"],
  a:0, why:"Heat behaves as a product, so adding it favours the endothermic reverse direction and K decreases." },

{ id:"a5-008", mod:"M5", topic:"Le Chatelier", diff:2,
  q:"Adding an inert gas at constant volume to a gaseous equilibrium:",
  choices:["Causes no shift in position","Shifts towards fewer moles of gas","Shifts towards more moles of gas","Always doubles the value of K"],
  a:0, why:"Partial pressures of the reacting species are unchanged, so Q still equals K and nothing moves." },

{ id:"a5-009", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Adding an inert gas at constant total pressure to N₂O₄ ⇌ 2NO₂:",
  choices:["Shifts right as the volume expands","Shifts left towards fewer moles","Causes no change whatsoever","Increases the value of K"],
  a:0, why:"Holding pressure constant forces the volume up, diluting the reacting gases — equivalent to a pressure decrease, which favours more moles." },

{ id:"a5-010", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), which change increases the yield of SO₃?",
  choices:["Increasing pressure","Increasing temperature","Adding a catalyst","Increasing the volume"],
  a:0, why:"Three moles become two, so compression favours the product. The forward reaction is exothermic, so heating would reduce yield." },

{ id:"a5-011", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"For H₂(g) + I₂(g) ⇌ 2HI(g), changing the pressure has no effect because:",
  choices:["Moles of gas are equal on both sides","The reaction is thermally neutral","Iodine is present as a solid","The equilibrium constant is exactly one"],
  a:0, why:"With two moles on each side, compression raises both Q's numerator and denominator equally." },

{ id:"a5-012", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Removing a product from an equilibrium mixture causes the system to:",
  choices:["Shift right to replace it","Shift left to conserve mass","Remain exactly as it was","Increase its equilibrium constant"],
  a:0, why:"Q falls below K, so the forward reaction runs faster until the ratio is restored." },

{ id:"a5-013", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Which change alters the numerical value of the equilibrium constant?",
  choices:["Changing the temperature","Changing the pressure","Adding a catalyst","Adding more reactant"],
  a:0, why:"K is temperature-dependent only. Everything else shifts the position but leaves the constant untouched." },

{ id:"a5-014", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Diluting the equilibrium mixture for Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺ with water causes:",
  choices:["A shift left towards more particles","A shift right towards fewer particles","No observable colour change","An increase in the value of K"],
  a:0, why:"Dilution is relieved by favouring the side with more dissolved species, so the red complex fades." },

/* ── equilibrium constant ────────────────────────────────── */
{ id:"a5-015", mod:"M5", topic:"Equilibrium constant", diff:2,
  q:"For aA + bB ⇌ cC + dD, the expression for K is:",
  choices:["[C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ","[A]ᵃ[B]ᵇ / [C]ᶜ[D]ᵈ","([C]+[D]) / ([A]+[B])","[C][D] / [A][B] always"],
  a:0, why:"Products go on top, each concentration raised to its stoichiometric coefficient." },

{ id:"a5-016", mod:"M5", topic:"Equilibrium constant", diff:2,
  q:"A very large value of K indicates that at equilibrium:",
  choices:["Products strongly predominate","Reactants strongly predominate","The reaction is extremely fast","The reaction is highly exothermic"],
  a:0, why:"K describes the position of equilibrium, not the speed of getting there." },

{ id:"a5-017", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"Pure solids and pure liquids are omitted from K expressions because:",
  choices:["Their concentrations are effectively constant","They do not participate in the reaction at all","Their concentrations are always zero","They are consumed before equilibrium"],
  a:0, why:"A pure condensed phase has fixed density, so its 'concentration' is folded into the constant itself." },

{ id:"a5-018", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"If K = 4.0 for A ⇌ B, then K for B ⇌ A is:",
  choices:["0.25","4.0","−4.0","16"],
  a:0, why:"Reversing a reaction inverts its equilibrium constant." },

{ id:"a5-019", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"If K = 3.0 for A ⇌ B, then K for 2A ⇌ 2B is:",
  choices:["9.0","6.0","1.5","3.0"],
  a:0, why:"Multiplying an equation by n raises its equilibrium constant to the power n." },

{ id:"a5-020", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"At equilibrium [H₂] = 0.20, [I₂] = 0.20 and [HI] = 1.60 mol/L. The value of K for H₂ + I₂ ⇌ 2HI is:",
  choices:["64","40","8.0","16"],
  a:0, why:"K = (1.60)² / (0.20 × 0.20) = 2.56/0.040 = 64." },

{ id:"a5-021", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"K has no units because concentrations are expressed:",
  choices:["Relative to a standard state","In moles per litre exactly","As partial pressures only","In grams per litre"],
  a:0, why:"Each term is really a ratio against a 1 mol/L reference, so the units cancel throughout." },

/* ── reaction quotient ───────────────────────────────────── */
{ id:"a5-022", mod:"M5", topic:"Reaction quotient", diff:2,
  q:"If Q < K, the reaction will:",
  choices:["Proceed forwards to reach equilibrium","Proceed in reverse to reach equilibrium","Already be at equilibrium","Stop entirely until disturbed"],
  a:0, why:"Too few products relative to equilibrium means the forward reaction must dominate until Q rises to K." },

{ id:"a5-023", mod:"M5", topic:"Reaction quotient", diff:3,
  q:"For a system with Q = 25 and K = 5, the mixture will:",
  choices:["Shift left, consuming products","Shift right, forming products","Stay exactly where it is","Shift right then immediately left"],
  a:0, why:"Q exceeding K means excess products, so the reverse reaction runs until the ratio falls to 5." },

{ id:"a5-024", mod:"M5", topic:"Reaction quotient", diff:3,
  q:"The reaction quotient Q differs from K in that Q:",
  choices:["Applies at any point, not just equilibrium","Is always larger than K","Ignores the reaction stoichiometry entirely","Depends only on temperature"],
  a:0, why:"They use the same algebraic form; Q is evaluated with whatever concentrations exist at that instant." },

/* ── ICE tables ──────────────────────────────────────────── */
{ id:"a5-025", mod:"M5", topic:"ICE tables", diff:3,
  q:"0.100 mol/L of A decomposes as A ⇌ 2B. At equilibrium [B] = 0.060 mol/L, so [A] equals:",
  choices:["0.070 mol/L","0.040 mol/L","0.094 mol/L","0.100 mol/L"],
  a:0, why:"Forming 0.060 of B consumes 0.030 of A, leaving 0.100 − 0.030 = 0.070 mol/L." },

{ id:"a5-026", mod:"M5", topic:"ICE tables", diff:3,
  q:"In an ICE table, the 'C' row entries must always be in the ratio of:",
  choices:["The stoichiometric coefficients","The initial concentrations","The equilibrium concentrations","One to one for all species"],
  a:0, why:"Species are consumed and produced in the ratio the balanced equation specifies." },

{ id:"a5-027", mod:"M5", topic:"ICE tables", diff:3,
  q:"The approximation 'x is negligible' in an ICE calculation is valid when:",
  choices:["K is very small compared with the initial concentration","K is very large compared with the starting concentration","The reaction is strongly exothermic","The system contains a catalyst"],
  a:0, why:"A tiny K means very little reactant converts, so subtracting x barely changes the initial value." },

/* ── temperature and K ───────────────────────────────────── */
{ id:"a5-028", mod:"M5", topic:"Temperature and K", diff:3,
  q:"For an endothermic reaction, raising temperature causes K to:",
  choices:["Increase","Decrease","Remain constant","Become negative"],
  a:0, why:"Heat acts as a reactant, so supplying more of it pushes the equilibrium towards products and raises the constant." },

{ id:"a5-029", mod:"M5", topic:"Temperature and K", diff:3,
  q:"A plot of ln K against 1/T is linear. Its gradient is related to:",
  choices:["The enthalpy change of the reaction","The activation energy of the forward step","The entropy change alone","The catalyst's efficiency"],
  a:0, why:"The van 't Hoff relation gives a gradient of −ΔH/R, so the sign of the slope reveals whether the reaction is exo- or endothermic." },

/* ── industrial equilibrium ──────────────────────────────── */
{ id:"a5-030", mod:"M5", topic:"Haber process", diff:2,
  q:"The Haber process uses about 400–450 °C rather than a lower temperature because:",
  choices:["A lower temperature gives an impractically slow rate","Ammonia decomposes below 400 °C","The reaction is endothermic overall","Nitrogen gas will not liquefy anywhere above 450 °C"],
  a:0, why:"Yield favours low temperature but kinetics forbid it, so the operating point is a deliberate compromise." },

{ id:"a5-031", mod:"M5", topic:"Haber process", diff:3,
  q:"Ammonia is removed by condensation during the Haber process in order to:",
  choices:["Shift the equilibrium further right","Increase the value of K","Lower the required pressure","Prevent the iron catalyst from being poisoned"],
  a:0, why:"Removing product keeps Q below K, so the forward reaction continues rather than stalling at equilibrium." },

{ id:"a5-032", mod:"M5", topic:"Haber process", diff:3,
  q:"The iron catalyst in the Haber process affects the:",
  choices:["Rate of attaining equilibrium only","Final equilibrium yield of ammonia","Value of the equilibrium constant","Enthalpy change of the reaction"],
  a:0, why:"Catalysts speed both directions equally, so equilibrium arrives sooner but sits in the same place." },

{ id:"a5-033", mod:"M5", topic:"Contact process", diff:3,
  q:"The Contact process uses a vanadium(V) oxide catalyst mainly to:",
  choices:["Reach equilibrium at a lower temperature","Increase the equilibrium yield of SO₃","Prevent sulfur dioxide from escaping","Raise the operating pressure needed"],
  a:0, why:"A faster route means an acceptable rate at a cooler temperature, which is where the exothermic equilibrium sits more favourably." },

{ id:"a5-034", mod:"M5", topic:"Industrial equilibrium", diff:3,
  q:"Industrial equilibrium processes typically operate at conditions that:",
  choices:["Balance yield against rate and cost","Maximise theoretical yield above all","Minimise the reaction rate for safety","Guarantee complete conversion"],
  a:0, why:"An optimal yield at an unusable rate, or at ruinous pressure, is worthless commercially." },

/* ── solubility equilibria ───────────────────────────────── */
{ id:"a5-035", mod:"M5", topic:"Solubility equilibria", diff:2,
  q:"For Ag₂CrO₄(s) ⇌ 2Ag⁺(aq) + CrO₄²⁻(aq), the solubility product expression is:",
  choices:["Ksp = [Ag⁺]²[CrO₄²⁻]","Ksp = [Ag⁺][CrO₄²⁻]","Ksp = 2[Ag⁺][CrO₄²⁻]","Ksp = [Ag⁺]²[CrO₄²⁻]²"],
  a:0, why:"Each ion concentration is raised to its coefficient, so the silver term is squared and the solid is omitted." },

{ id:"a5-036", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"For a salt MX with Ksp = 1.0 × 10⁻¹⁰, its molar solubility is:",
  choices:["1.0 × 10⁻⁵ mol/L","1.0 × 10⁻¹⁰ mol/L","2.0 × 10⁻⁵ mol/L","1.0 × 10⁻²⁰ mol/L"],
  a:0, why:"Ksp = s², so s = √(1.0 × 10⁻¹⁰) = 1.0 × 10⁻⁵ mol/L." },

{ id:"a5-037", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"For M(OH)₂ with solubility s, the solubility product equals:",
  choices:["4s³","s²","2s²","s³"],
  a:0, why:"[M²⁺] = s and [OH⁻] = 2s, so Ksp = s(2s)² = 4s³." },

{ id:"a5-038", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"Comparing Ksp values directly to rank solubility is only valid when the salts:",
  choices:["Share the same ion ratio","Contain the same metal ion","Have equal molar masses","Dissolve at the same temperature"],
  a:0, why:"AB and AB₂ salts relate Ksp to s by different powers, so the comparison is meaningless across types." },

{ id:"a5-039", mod:"M5", topic:"Common ion effect", diff:3,
  q:"The solubility of AgCl in 0.10 mol/L NaCl compared with pure water is:",
  choices:["Much lower","Much higher","Exactly the same","Higher then lower"],
  a:0, why:"Added chloride pushes the dissolution equilibrium left, so far less silver chloride dissolves." },

{ id:"a5-040", mod:"M5", topic:"Common ion effect", diff:3,
  q:"The common ion effect is a direct consequence of:",
  choices:["Le Chatelier's principle","A change in the value of Ksp","Increased ionic bond strength","The solvent becoming saturated"],
  a:0, why:"Adding a product ion raises Q above Ksp, so precipitation occurs until the product falls back to Ksp." },

{ id:"a5-041", mod:"M5", topic:"Precipitation prediction", diff:3,
  q:"A precipitate forms when the ionic product is:",
  choices:["Greater than Ksp","Less than Ksp","Exactly equal to Ksp","Equal to zero"],
  a:0, why:"Exceeding the solubility product means the solution is supersaturated and solid must come out." },

{ id:"a5-042", mod:"M5", topic:"Precipitation prediction", diff:3,
  q:"Mixing equal volumes of 2.0 × 10⁻³ mol/L Ag⁺ and 2.0 × 10⁻³ mol/L Cl⁻ (Ksp = 1.8 × 10⁻¹⁰) results in:",
  choices:["Precipitation, since Q exceeds Ksp","No precipitate, since Q is below Ksp","Exact saturation with no solid","Complete dissolution of all ions"],
  a:0, why:"After mixing each ion is 1.0 × 10⁻³, so Q = 1.0 × 10⁻⁶, far above the solubility product." },

/* ── enthalpy of solution ────────────────────────────────── */
{ id:"a5-043", mod:"M5", topic:"Enthalpy of solution", diff:3,
  q:"The enthalpy of solution is the net result of:",
  choices:["Lattice energy and hydration energy","Bond energy and activation energy","Entropy and free energy","Ionisation energy and electron affinity"],
  a:0, why:"Breaking the lattice absorbs energy and hydrating the ions releases it; the sign of the sum decides warming or cooling." },

{ id:"a5-044", mod:"M5", topic:"Enthalpy of solution", diff:3,
  q:"Dissolving NH₄NO₃ makes the solution cold, so its enthalpy of solution is:",
  choices:["Positive, as lattice energy dominates","Negative, as hydration energy dominates","Zero, as the terms cancel exactly","Negative, though the solution cools"],
  a:0, why:"More energy is needed to break the lattice than hydration returns, so heat is drawn from the surroundings." },

{ id:"a5-045", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"The solubility of most gases in water decreases as temperature rises because dissolution is:",
  choices:["Exothermic, so heating shifts it back","Endothermic, so heating shifts it back","Independent of any temperature effect","Controlled entirely by pressure"],
  a:0, why:"Gas dissolution releases heat, so raising temperature drives the dissolved gas back out — the basis of thermal pollution concerns." },

/* ── ocean acidification and environment ─────────────────── */
{ id:"a5-046", mod:"M5", topic:"Ocean acidification", diff:2,
  q:"Dissolved CO₂ lowers ocean pH because it forms:",
  choices:["Carbonic acid, which ionises","Carbon monoxide and oxygen","Insoluble calcium carbonate","Hydroxide ions in solution"],
  a:0, why:"CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻, and the released protons lower the pH." },

{ id:"a5-047", mod:"M5", topic:"Ocean acidification", diff:3,
  q:"Rising ocean acidity threatens shell-forming organisms because it:",
  choices:["Lowers the carbonate ion concentration","Raises the temperature of the water","Removes dissolved oxygen entirely","Increases the solubility of calcium"],
  a:0, why:"Extra H⁺ converts CO₃²⁻ to HCO₃⁻, so less carbonate is available for calcium carbonate skeletons." },

{ id:"a5-048", mod:"M5", topic:"Ocean acidification", diff:3,
  q:"Increasing atmospheric CO₂ partial pressure shifts the ocean equilibrium:",
  choices:["Towards more dissolved carbonic acid","Towards less dissolved carbon dioxide","Towards more solid carbonate","In no direction at all"],
  a:0, why:"Henry's law raises dissolved CO₂ as its partial pressure rises, driving the whole carbonate system rightwards." },

/* ── observable equilibria ───────────────────────────────── */
{ id:"a5-049", mod:"M5", topic:"Cobalt equilibrium", diff:3,
  q:"The pink-to-blue cobalt chloride equilibrium turns blue on heating, showing the forward reaction is:",
  choices:["Endothermic","Exothermic","Thermally neutral","Catalysed by chloride"],
  a:0, why:"Heat drives the equilibrium towards the blue complex, so forming it must absorb energy." },

{ id:"a5-050", mod:"M5", topic:"Cobalt equilibrium", diff:3,
  q:"Adding concentrated HCl to the pink cobalt solution turns it blue because:",
  choices:["Extra chloride shifts the equilibrium right","The solution simply becomes strongly acidic","Water is chemically destroyed","Cobalt is oxidised to a higher state"],
  a:0, why:"Chloride is a reactant in forming the blue tetrachloro complex, so adding it pushes the system that way." },

{ id:"a5-051", mod:"M5", topic:"Equilibrium graphs", diff:3,
  q:"On a concentration–time graph, equilibrium is reached where the curves:",
  choices:["Become horizontal","Cross one another","Reach the same value","Return to their starting points"],
  a:0, why:"Constant concentration means zero net change, which appears as a plateau rather than an intersection." },

{ id:"a5-052", mod:"M5", topic:"Equilibrium graphs", diff:3,
  q:"A sudden vertical jump in one species' concentration followed by gradual curves indicates:",
  choices:["More of that species was added","The temperature was raised","A catalyst was introduced","The volume was doubled"],
  a:0, why:"Only direct addition changes one concentration instantaneously; temperature and volume changes affect all species at once." },

{ id:"a5-053", mod:"M5", topic:"Equilibrium graphs", diff:3,
  q:"Adding a catalyst to a system already at equilibrium produces a graph in which:",
  choices:["No concentration changes at all","All concentrations rise together","Products rise and reactants fall","Both curves become vertical"],
  a:0, why:"Equilibrium is already established, and a catalyst cannot shift its position — only shorten the time to reach it." },

/* ── applied reasoning ───────────────────────────────────── */
{ id:"a5-054", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"For 2NO₂(g) ⇌ N₂O₄(g), a sealed syringe of the mixture is compressed. The colour initially darkens, then:",
  choices:["Fades as the equilibrium shifts right","Darkens further still as more NO₂ forms","Stays at its darkest level","Disappears completely"],
  a:0, why:"Compression first concentrates the brown NO₂, then the system responds by forming colourless N₂O₄." },

{ id:"a5-055", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Cooling the 2NO₂ ⇌ N₂O₄ equilibrium makes the mixture paler, showing dimerisation is:",
  choices:["Exothermic","Endothermic","Entropy-driven","Pressure-independent"],
  a:0, why:"Removing heat favours the direction that releases it, and the paler colour means more colourless dimer." },

{ id:"a5-056", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"A reaction has K = 1 × 10⁻¹⁵. At equilibrium the mixture will be:",
  choices:["Almost entirely reactants","Almost entirely products","An even mixture of both","Impossible to predict"],
  a:0, why:"A tiny constant means the numerator is minute relative to the denominator, so conversion is negligible." },

{ id:"a5-057", mod:"M5", topic:"Equilibrium", diff:3,
  q:"Which statement about a system at equilibrium is FALSE?",
  choices:["Reactant and product concentrations are equal","Forward and reverse rates are equal","Macroscopic properties all stay constant here","Both reactions continue to occur"],
  a:0, why:"Equal rates fix the concentrations at whatever ratio K demands, which is almost never one to one." },

{ id:"a5-058", mod:"M5", topic:"Equilibrium", diff:3,
  q:"A closed flask of N₂O₄ and NO₂ is at equilibrium. Doubling the volume causes the total pressure to:",
  choices:["Fall, then rise slightly as NO₂ forms","Fall and then continue falling steadily","Rise immediately on expansion","Remain completely unchanged"],
  a:0, why:"Expansion halves the pressure instantly, then the shift towards more gas moles partially restores it." },

{ id:"a5-059", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"Adding NaNO₃ to a saturated AgCl solution has little effect because:",
  choices:["Neither ion is common to the equilibrium","Sodium nitrate is insoluble in water","Nitrate precipitates the silver ions","The solution is already supersaturated"],
  a:0, why:"Only a shared ion shifts the dissolution equilibrium; spectator ions leave Q essentially unchanged." },

{ id:"a5-060", mod:"M5", topic:"Precipitation prediction", diff:3,
  q:"Selective precipitation separates two cations by exploiting differences in their:",
  choices:["Solubility product values","Atomic masses","Characteristic flame test colours","Ionic radii"],
  a:0, why:"Adding the precipitating ion slowly removes the less soluble salt first, since its Ksp is exceeded at a lower concentration." },

{ id:"a5-061", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Which change would increase both the rate and the yield of an exothermic gas-phase reaction with fewer product moles?",
  choices:["Increasing the pressure","Increasing the temperature","Removing the catalyst","Increasing the volume"],
  a:0, why:"Compression raises concentration, speeding the reaction, and simultaneously favours the side with fewer moles." },

{ id:"a5-062", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"Kp and Kc differ in value unless:",
  choices:["The moles of gas are equal on both sides","The temperature is exactly 298 K","The reaction involves only liquids","A suitable catalyst is present in the system"],
  a:0, why:"Kp = Kc(RT)^Δn, so when Δn is zero the conversion factor becomes one." },

{ id:"a5-063", mod:"M5", topic:"Dynamic equilibrium", diff:3,
  q:"A sealed bottle of soft drink shows equilibrium between:",
  choices:["Dissolved and gaseous carbon dioxide","Water and carbonic acid only","Sugar and its saturated solution","Liquid water and water vapour only"],
  a:0, why:"Opening the bottle releases the CO₂ pressure above the liquid, so the equilibrium shifts and the drink goes flat." },

{ id:"a5-064", mod:"M5", topic:"Equilibrium", diff:3,
  q:"Starting from pure products rather than pure reactants, the same reaction at the same temperature reaches:",
  choices:["The same equilibrium position","A different value of K","An exact mirror-image position","No equilibrium at all"],
  a:0, why:"Equilibrium is approachable from either direction; K depends only on temperature, not on the starting point." },

{ id:"a5-065", mod:"M5", topic:"ICE tables", diff:3,
  q:"For A ⇌ B with K = 4.0 and 1.00 mol/L of A initially, the equilibrium [B] is:",
  choices:["0.80 mol/L","0.20 mol/L","0.50 mol/L","4.00 mol/L"],
  a:0, why:"x/(1.00 − x) = 4.0 gives x = 0.80 mol/L of B, leaving 0.20 mol/L of A." },

{ id:"a5-066", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"For BaSO₄ with Ksp = 1.1 × 10⁻¹⁰, the concentration of Ba²⁺ in a saturated solution is closest to:",
  choices:["1.0 × 10⁻⁵ mol/L","1.1 × 10⁻¹⁰ mol/L","3.3 × 10⁻⁶ mol/L","2.2 × 10⁻⁵ mol/L"],
  a:0, why:"With a 1 : 1 salt, s = √Ksp = √(1.1 × 10⁻¹⁰) ≈ 1.0 × 10⁻⁵ mol/L." },

{ id:"a5-067", mod:"M5", topic:"Le Chatelier", diff:3,
  q:"Barium sulfate is used as a medical contrast agent despite barium's toxicity because:",
  choices:["Its Ksp is extremely small","Barium ions are harmless when hydrated","Sulfate neutralises the toxicity","It is excreted before dissolving"],
  a:0, why:"So little dissolves that the free Ba²⁺ concentration stays far below a dangerous level." },

{ id:"a5-068", mod:"M5", topic:"Common ion effect", diff:3,
  q:"Adding sodium sulfate to a barium sulfate suspension before a medical scan would:",
  choices:["Further suppress barium ion concentration","Increase the dissolved barium","Have no effect on solubility","Convert the barium into a soluble salt"],
  a:0, why:"The common sulfate ion pushes the dissolution equilibrium further left, an extra safety margin." },

{ id:"a5-069", mod:"M5", topic:"Equilibrium constant", diff:3,
  q:"Two reactions are added together. The overall equilibrium constant is the:",
  choices:["Product of the individual constants","Arithmetic sum of the individual constants","Difference of the constants","Average of the constants"],
  a:0, why:"Adding equations multiplies their K values, in the same way Hess's law adds their enthalpies." },

{ id:"a5-070", mod:"M5", topic:"Temperature and K", diff:3,
  q:"K for an exothermic reaction is measured at 300 K and again at 500 K. The second value will be:",
  choices:["Smaller","Larger","Identical","Negative"],
  a:0, why:"Heating an exothermic equilibrium shifts it towards reactants, lowering the products-over-reactants ratio." },

{ id:"a5-071", mod:"M5", topic:"Catalysts", diff:3,
  q:"A catalyst reaches equilibrium faster because it lowers the activation energy of:",
  choices:["Both forward and reverse reactions","The forward reaction only","The reverse reaction only","Neither, only raising temperature"],
  a:0, why:"The same transition state serves both directions, so both barriers fall by the same amount." },

{ id:"a5-072", mod:"M5", topic:"Industrial equilibrium", diff:3,
  q:"Very high pressures are expensive industrially mainly because they require:",
  choices:["Thicker vessels and more compression energy","Higher purity starting materials","Much more frequent catalyst replacement","Lower operating temperatures"],
  a:0, why:"Capital and running costs rise steeply with pressure, which is why the Haber process stops well short of the yield optimum." },

{ id:"a5-073", mod:"M5", topic:"Dynamic equilibrium", diff:2,
  q:"Which observation would show that a coloured equilibrium has been reached?",
  choices:["The colour stops changing over time","The colour disappears completely","The solution begins to boil","A precipitate starts to form"],
  a:0, why:"Constant colour indicates constant concentration of the coloured species, the macroscopic signature of equilibrium." },

{ id:"a5-074", mod:"M5", topic:"Reaction quotient", diff:3,
  q:"At the instant reactants are mixed with no products present, Q equals:",
  choices:["Zero","Infinity","One","The value of K"],
  a:0, why:"With zero in the numerator the quotient is zero, so the reaction must initially run forwards." },

{ id:"a5-075", mod:"M5", topic:"Solubility equilibria", diff:3,
  q:"Solubility and solubility product differ in that solubility is:",
  choices:["A concentration, while Ksp is a constant","Always numerically much larger than Ksp","Independent of temperature","Measured only in grams per litre"],
  a:0, why:"Solubility is how much dissolves under given conditions; Ksp is the fixed ion-product at saturation for that temperature." }

];
