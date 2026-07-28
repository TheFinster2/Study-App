/* Module 7 expansion A — Organic Chemistry. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM7A = [

/* ── nomenclature ────────────────────────────────────────── */
{ id:"a7-001", mod:"M7", topic:"Nomenclature", diff:1,
  q:"The name of CH₃CH₂CH₂CH₃ is:",
  choices:["Butane","Propane","Pentane","Butene"],
  a:0, why:"Four carbons in an unbranched saturated chain gives the prefix but- and the suffix -ane." },

{ id:"a7-002", mod:"M7", topic:"Nomenclature", diff:2,
  q:"The correct IUPAC name for (CH₃)₂CHCH₂CH₃ is:",
  choices:["2-methylbutane","3-methylbutane","2-methylpentane","isopentane"],
  a:0, why:"The longest chain is four carbons and numbering from the nearer end places the methyl group at position 2." },

{ id:"a7-003", mod:"M7", topic:"Nomenclature", diff:2,
  q:"The name of CH₃CH₂OH is:",
  choices:["Ethanol","Methanol","Ethanal","Ethanoic acid"],
  a:0, why:"Two carbons with a hydroxyl group gives ethan- plus the alcohol suffix -ol." },

{ id:"a7-004", mod:"M7", topic:"Nomenclature", diff:2,
  q:"CH₃CH₂COOH is named:",
  choices:["Propanoic acid","Ethanoic acid","Propanal","Propanol"],
  a:0, why:"Three carbons including the carboxyl carbon gives propan-, and –COOH gives the suffix -oic acid." },

{ id:"a7-005", mod:"M7", topic:"Nomenclature", diff:3,
  q:"The name of CH₃CH(OH)CH₂CH₃ is:",
  choices:["Butan-2-ol","Butan-1-ol","2-methylpropan-1-ol","Butanal"],
  a:0, why:"A four-carbon chain with the hydroxyl on the second carbon, numbered to give the lowest locant." },

{ id:"a7-006", mod:"M7", topic:"Nomenclature", diff:3,
  q:"The name of CH₃CH₂CH₂Br is:",
  choices:["1-bromopropane","2-bromopropane","1-bromobutane","Propyl bromide"],
  a:0, why:"Three carbons with the halogen on the terminal carbon; substituent prefixes take the lowest possible number." },

{ id:"a7-007", mod:"M7", topic:"Nomenclature", diff:3,
  q:"The name of CH₃COOCH₂CH₃ is:",
  choices:["Ethyl ethanoate","Ethyl propanoate","Methyl ethanoate","Propyl methanoate"],
  a:0, why:"The alkyl group from the alcohol is named first, then the acid portion becomes the -oate ending." },

{ id:"a7-008", mod:"M7", topic:"Nomenclature", diff:3,
  q:"The name of CH₃CH=CHCH₂CH₃ is:",
  choices:["Pent-2-ene","Pent-3-ene","Pent-1-ene","2-methylbut-2-ene"],
  a:0, why:"Five carbons with the double bond between C2 and C3, numbered from the end that gives the lower locant." },

{ id:"a7-009", mod:"M7", topic:"Nomenclature", diff:3,
  q:"Which name violates IUPAC numbering rules?",
  choices:["3-methylbutane","2-methylbutane","2-methylpentane","3-methylpentane"],
  a:0, why:"Numbering from the other end gives 2-methylbutane, and the lowest locant must always be chosen." },

/* ── functional groups and homologous series ─────────────── */
{ id:"a7-010", mod:"M7", topic:"Functional groups", diff:1,
  q:"The functional group –COOH is characteristic of:",
  choices:["Carboxylic acids","Aldehydes and ketones","Esters","Alcohols"],
  a:0, why:"A carbonyl attached to a hydroxyl gives the acidic carboxyl group." },

{ id:"a7-011", mod:"M7", topic:"Functional groups", diff:2,
  q:"An aldehyde differs from a ketone in that its carbonyl carbon is:",
  choices:["At the end of the chain","In the middle of the chain","Bonded to a hydroxyl group","Bonded to a halogen atom"],
  a:0, why:"A terminal carbonyl carries a hydrogen, which is why aldehydes are oxidised further but ketones are not." },

{ id:"a7-012", mod:"M7", topic:"Homologous series", diff:2,
  q:"Members of a homologous series differ by:",
  choices:["A CH₂ unit","A CH₃ unit","One hydrogen atom","One functional group"],
  a:0, why:"Successive members differ by one methylene, which is why physical properties trend smoothly along the series." },

{ id:"a7-013", mod:"M7", topic:"Homologous series", diff:3,
  q:"The general formula for alkenes with one double bond is:",
  choices:["CₙH₂ₙ","CₙH₂ₙ₊₂","CₙH₂ₙ₋₂","CₙH₂ₙO"],
  a:0, why:"Each double bond removes two hydrogens relative to the corresponding alkane." },

{ id:"a7-014", mod:"M7", topic:"Functional groups", diff:3,
  q:"Which compound contains an ester group?",
  choices:["CH₃COOCH₃","CH₃COOH","CH₃CHO","CH₃OCH₃"],
  a:0, why:"The R–COO–R′ arrangement is the ester linkage; the others are an acid, an aldehyde and an ether." },

/* ── isomerism ───────────────────────────────────────────── */
{ id:"a7-015", mod:"M7", topic:"Isomers", diff:2,
  q:"Structural isomers have the same:",
  choices:["Molecular formula but different connectivity","Structural formula but different molar masses","Physical properties in every case","Functional group in every case"],
  a:0, why:"Rearranging how the same atoms are joined produces genuinely different compounds." },

{ id:"a7-016", mod:"M7", topic:"Isomers", diff:3,
  q:"How many structural isomers of C₄H₉Br exist?",
  choices:["Four","Two","Three","Five"],
  a:0, why:"1- and 2-bromobutane on the straight chain, plus 1- and 2-bromo-2-methylpropane on the branched skeleton." },

{ id:"a7-017", mod:"M7", topic:"Isomers", diff:3,
  q:"How many structural isomers does C₅H₁₂ have?",
  choices:["Three","Two","Four","Five"],
  a:0, why:"Pentane, 2-methylbutane and 2,2-dimethylpropane exhaust the possibilities." },

{ id:"a7-018", mod:"M7", topic:"Isomers", diff:3,
  q:"Butane and 2-methylpropane are best described as:",
  choices:["Chain isomers","Positional isomers","Functional group isomers","The same compound"],
  a:0, why:"The carbon skeleton itself is rearranged from straight to branched, with no functional group involved." },

{ id:"a7-019", mod:"M7", topic:"Isomers", diff:3,
  q:"Ethanol and dimethyl ether are examples of:",
  choices:["Functional group isomers","Positional isomers","Chain isomers","Two entirely identical compounds"],
  a:0, why:"Both are C₂H₆O, but one is an alcohol and the other an ether, so their properties differ sharply." },

/* ── intermolecular forces and physical properties ───────── */
{ id:"a7-020", mod:"M7", topic:"Intermolecular forces", diff:2,
  q:"Alcohols have higher boiling points than alkanes of similar molar mass because they:",
  choices:["Form hydrogen bonds between molecules","Have stronger covalent bonds","Are largely ionic in aqueous solution","Have larger molecular volumes"],
  a:0, why:"The hydroxyl group allows hydrogen bonding, which is far stronger than the dispersion forces available to alkanes." },

{ id:"a7-021", mod:"M7", topic:"Intermolecular forces", diff:3,
  q:"Carboxylic acids boil higher than alcohols of similar mass because they:",
  choices:["Form hydrogen-bonded dimers","Contain more carbon atoms","Ionise completely in the liquid","Have permanent ionic charges"],
  a:0, why:"Two hydrogen bonds link each pair of molecules into a dimer, effectively doubling the unit that must be vaporised." },

{ id:"a7-022", mod:"M7", topic:"Intermolecular forces", diff:3,
  q:"Esters boil lower than carboxylic acids of similar mass because esters:",
  choices:["Cannot donate a hydrogen bond","Have weaker covalent bonds","Are always smaller molecules","Contain no oxygen atoms"],
  a:0, why:"There is no O–H, so esters accept hydrogen bonds but cannot donate them to each other." },

{ id:"a7-023", mod:"M7", topic:"Solubility", diff:2,
  q:"Water solubility of alcohols decreases as the carbon chain lengthens because:",
  choices:["The non-polar chain dominates the molecule","The hydroxyl group is destroyed","Hydrogen bonding becomes entirely impossible","The molecules become ionic"],
  a:0, why:"The proportion of hydrophobic chain grows, so the single hydroxyl can no longer keep it dissolved." },

{ id:"a7-024", mod:"M7", topic:"Solubility", diff:3,
  q:"Which compound is most soluble in water?",
  choices:["Methanol","Butan-1-ol","Hexan-1-ol","Octan-1-ol"],
  a:0, why:"The shortest chain has the highest ratio of hydrogen-bonding hydroxyl to hydrophobic carbon." },

/* ── reactions of alkanes and alkenes ────────────────────── */
{ id:"a7-025", mod:"M7", topic:"Reactions of alkanes", diff:2,
  q:"Alkanes react with halogens in the presence of UV light by:",
  choices:["Free radical substitution","Electrophilic addition","Nucleophilic substitution","Condensation"],
  a:0, why:"UV homolytically splits the halogen, and the resulting radicals propagate a chain substitution." },

{ id:"a7-026", mod:"M7", topic:"Reactions of alkanes", diff:3,
  q:"Alkanes are relatively unreactive because their bonds are:",
  choices:["Strong, non-polar and saturated","Weak and highly polarised","Delocalised right across the whole chain","Ionic in character"],
  a:0, why:"C–C and C–H bonds are strong with little charge separation, so there is no site for a nucleophile or electrophile to attack." },

{ id:"a7-027", mod:"M7", topic:"Reactions of alkenes", diff:2,
  q:"Bromine water is decolourised by an alkene through:",
  choices:["Addition across the double bond","Substitution of a hydrogen","Oxidation to a carboxylic acid","Polymerisation of the alkene"],
  a:0, why:"The π electrons attack bromine, giving a colourless dibromoalkane — the standard test for unsaturation." },

{ id:"a7-028", mod:"M7", topic:"Reactions of alkenes", diff:3,
  q:"Adding water to ethene in the presence of acid catalyst produces:",
  choices:["Ethanol","Ethanal","Ethanoic acid","Ethane"],
  a:0, why:"Catalytic hydration adds H and OH across the double bond, the industrial route to ethanol." },

{ id:"a7-029", mod:"M7", topic:"Reactions of alkenes", diff:3,
  q:"Adding HBr to propene gives mainly 2-bromopropane because:",
  choices:["The more stable carbocation forms preferentially","Bromine always attacks the first carbon","Propene has no terminal carbon","The reaction is under thermodynamic control only"],
  a:0, why:"Markovnikov addition proceeds through the secondary carbocation, which is more stable than the primary one." },

{ id:"a7-030", mod:"M7", topic:"Reactions of alkenes", diff:3,
  q:"Hydrogenation of an alkene requires:",
  choices:["A nickel or platinum catalyst","Concentrated sulfuric acid catalyst","Ultraviolet light","Aqueous sodium hydroxide"],
  a:0, why:"The metal surface adsorbs and weakens H₂, allowing addition across the double bond at practical conditions." },

/* ── haloalkanes ─────────────────────────────────────────── */
{ id:"a7-031", mod:"M7", topic:"Haloalkanes", diff:2,
  q:"Haloalkanes react with aqueous hydroxide by:",
  choices:["Nucleophilic substitution","Electrophilic addition","Free radical substitution","Condensation polymerisation"],
  a:0, why:"The polar C–X bond leaves the carbon electron-poor, so hydroxide attacks and displaces the halide." },

{ id:"a7-032", mod:"M7", topic:"Haloalkanes", diff:3,
  q:"Reactivity of haloalkanes towards nucleophilic substitution increases in the order:",
  choices:["C–F < C–Cl < C–Br < C–I","C–I < C–Br < C–Cl < C–F","C–Cl < C–F < C–I < C–Br","All four react at the same rate"],
  a:0, why:"Bond strength falls down the group, and the weakest carbon–halogen bond breaks most readily." },

{ id:"a7-033", mod:"M7", topic:"Haloalkanes", diff:3,
  q:"Reacting a haloalkane with hot alcoholic KOH rather than aqueous KOH favours:",
  choices:["Elimination to form an alkene","Substitution to form an alcohol","Oxidation to a carboxylic acid","Addition of water across the chain"],
  a:0, why:"The solvent and temperature steer the hydroxide towards acting as a base rather than a nucleophile." },

/* ── alcohols and oxidation ──────────────────────────────── */
{ id:"a7-034", mod:"M7", topic:"Oxidation of alcohols", diff:2,
  q:"Oxidising a primary alcohol with excess acidified dichromate under reflux gives:",
  choices:["A carboxylic acid","An aldehyde only","A ketone","An ester"],
  a:0, why:"Reflux returns the volatile aldehyde to the flask, allowing oxidation to continue to the acid." },

{ id:"a7-035", mod:"M7", topic:"Oxidation of alcohols", diff:3,
  q:"To stop the oxidation of a primary alcohol at the aldehyde, the technique used is:",
  choices:["Distilling the product as it forms","Heating the mixture strongly under reflux","Adding excess oxidising agent","Cooling the mixture in ice"],
  a:0, why:"The aldehyde boils lower than the alcohol, so distilling removes it before further oxidation can occur." },

{ id:"a7-036", mod:"M7", topic:"Oxidation of alcohols", diff:2,
  q:"Oxidation of a secondary alcohol produces:",
  choices:["A ketone","An aldehyde","A carboxylic acid","An alkene"],
  a:0, why:"The carbonyl carbon has two alkyl groups and no hydrogen, so oxidation stops there." },

{ id:"a7-037", mod:"M7", topic:"Oxidation of alcohols", diff:3,
  q:"Tertiary alcohols resist oxidation because the carbinol carbon:",
  choices:["Has no hydrogen atom attached","Is shielded by the hydroxyl group","Carries a formal positive charge","Is bonded to two oxygen atoms"],
  a:0, why:"Oxidation requires removing an H from the carbon bearing the OH, and a tertiary carbon has none available." },

{ id:"a7-038", mod:"M7", topic:"Oxidation of alcohols", diff:3,
  q:"The colour change observed when acidified dichromate oxidises an alcohol is:",
  choices:["Orange to green","Purple to colourless","Green to orange","Colourless to purple"],
  a:0, why:"Cr₂O₇²⁻ is orange and is reduced to the green Cr³⁺ ion." },

{ id:"a7-039", mod:"M7", topic:"Alcohols", diff:3,
  q:"Which alcohol would give a ketone on oxidation?",
  choices:["Propan-2-ol","Propan-1-ol","2-methylpropan-2-ol","Methanol"],
  a:0, why:"It is the only secondary alcohol listed; the others are primary, tertiary and primary respectively." },

/* ── esters ──────────────────────────────────────────────── */
{ id:"a7-040", mod:"M7", topic:"Esterification", diff:2,
  q:"Esterification requires a carboxylic acid, an alcohol and:",
  choices:["A concentrated acid catalyst","A strong base such as sodium hydroxide","Ultraviolet light","A nickel catalyst"],
  a:0, why:"Concentrated H₂SO₄ catalyses the reaction and absorbs the water produced, shifting the equilibrium right." },

{ id:"a7-041", mod:"M7", topic:"Esterification", diff:3,
  q:"Esterification is carried out under reflux in order to:",
  choices:["Heat without losing volatile reactants","Remove the ester as it forms","Cool the reaction mixture down","Prevent the acid catalyst from decomposing"],
  a:0, why:"The vertical condenser returns evaporated material to the flask, allowing prolonged heating without loss." },

{ id:"a7-042", mod:"M7", topic:"Esterification", diff:3,
  q:"Ethanoic acid and propan-1-ol react to form:",
  choices:["Propyl ethanoate","Ethyl propanoate","Propyl propanoate","Ethyl ethanoate"],
  a:0, why:"The alcohol supplies the alkyl group named first, and the acid supplies the -oate portion." },

{ id:"a7-043", mod:"M7", topic:"Esters", diff:3,
  q:"Esterification is described as a condensation reaction because it:",
  choices:["Eliminates a water molecule","Requires cooling to proceed","Forms a solid product","Occurs only at low pressure"],
  a:0, why:"The OH from the acid and the H from the alcohol are lost together as water." },

{ id:"a7-044", mod:"M7", topic:"Esters", diff:3,
  q:"Acid hydrolysis of an ester produces:",
  choices:["A carboxylic acid and an alcohol","A soap and glycerol","An aldehyde and water","An alkene and a metal halide"],
  a:0, why:"It reverses esterification. Base hydrolysis instead gives the carboxylate salt, which is saponification." },

{ id:"a7-045", mod:"M7", topic:"Saponification", diff:3,
  q:"Saponification of a triglyceride with NaOH produces glycerol and:",
  choices:["Sodium salts of fatty acids","Free fatty acids","Long-chain primary alcohols","Sodium carbonate"],
  a:0, why:"Base hydrolysis gives the carboxylate salts, which are soap molecules." },

/* ── soaps and detergents ────────────────────────────────── */
{ id:"a7-046", mod:"M7", topic:"Soaps and detergents", diff:2,
  q:"A soap molecule cleans because it has:",
  choices:["A polar head and a non-polar tail","Two polar ends","An entirely non-polar structure","An overall positive charge"],
  a:0, why:"The tail dissolves grease while the head stays hydrated, forming micelles that lift dirt into the water." },

{ id:"a7-047", mod:"M7", topic:"Soaps and detergents", diff:3,
  q:"A micelle formed by soap in water has its:",
  choices:["Non-polar tails pointing inwards","Polar heads pointing inwards","Tails and heads randomly arranged","Charged heads buried in the grease"],
  a:0, why:"The hydrophobic tails cluster around the grease droplet while the charged heads face the surrounding water." },

{ id:"a7-048", mod:"M7", topic:"Soaps and detergents", diff:3,
  q:"Synthetic detergents work in hard water because their head groups:",
  choices:["Form soluble calcium salts","Carry no charge at all","Are much larger than soap heads","React with the hardness ions"],
  a:0, why:"Sulfonate heads give calcium salts that stay dissolved, so no scum precipitates." },

/* ── polymers ────────────────────────────────────────────── */
{ id:"a7-049", mod:"M7", topic:"Addition polymers", diff:2,
  q:"Addition polymerisation requires monomers containing:",
  choices:["A carbon–carbon double bond","A carboxyl and a hydroxyl group","An amine and an acid group","At least one halogen atom"],
  a:0, why:"The π bond opens to link monomers with no atoms lost, so the polymer's empirical formula matches the monomer." },

{ id:"a7-050", mod:"M7", topic:"Polymers", diff:2,
  q:"The monomer used to make polyethylene is:",
  choices:["Ethene","Ethane","Ethanol","Ethyne"],
  a:0, why:"Only the unsaturated ethene can undergo addition polymerisation." },

{ id:"a7-051", mod:"M7", topic:"Polymers", diff:3,
  q:"The monomer of polyvinyl chloride is:",
  choices:["Chloroethene","Chloroethane","Dichloroethene","Chloromethane"],
  a:0, why:"PVC comes from vinyl chloride, systematically named chloroethene." },

{ id:"a7-052", mod:"M7", topic:"Polymers", diff:3,
  q:"LDPE is more flexible than HDPE because its chains are:",
  choices:["Branched, so they pack loosely","Longer and more crystalline","Cross-linked into a network","Held together by hydrogen bonds"],
  a:0, why:"Branching prevents close packing, lowering density, crystallinity and rigidity." },

{ id:"a7-053", mod:"M7", topic:"Condensation polymers", diff:3,
  q:"Condensation polymerisation differs from addition in that it:",
  choices:["Eliminates a small molecule each time","Requires a double bond in the monomer","Produces only linear chains","Cannot form long polymers"],
  a:0, why:"Water or HCl is expelled at each linkage, so the repeating unit is lighter than the sum of the monomers." },

{ id:"a7-054", mod:"M7", topic:"Condensation polymers", diff:3,
  q:"Nylon-6,6 is formed from a diamine and:",
  choices:["A dicarboxylic acid","A diol","An alkene","A long-chain dihaloalkane"],
  a:0, why:"Amide linkages form between the amine and carboxyl groups, expelling water." },

{ id:"a7-055", mod:"M7", topic:"Polymers", diff:3,
  q:"Polyesters such as PET contain repeating linkages of the type:",
  choices:["–COO–","–CONH–","–O–O–","–C=C–"],
  a:0, why:"A diol and a diacid condense to give ester groups along the backbone." },

{ id:"a7-056", mod:"M7", topic:"Polymers", diff:3,
  q:"Thermosetting polymers cannot be remoulded because they are:",
  choices:["Extensively cross-linked","Made only from alkenes","Composed of short chains","Held by hydrogen bonds only"],
  a:0, why:"Covalent cross-links form a single rigid network, so the material degrades rather than softening on heating." },

/* ── biofuels and combustion ─────────────────────────────── */
{ id:"a7-057", mod:"M7", topic:"Fermentation", diff:2,
  q:"Fermentation of glucose by yeast produces ethanol and:",
  choices:["Carbon dioxide","Oxygen","Methane","Water vapour only"],
  a:0, why:"C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂, which is why fermentation vessels must vent gas." },

{ id:"a7-058", mod:"M7", topic:"Biofuels", diff:3,
  q:"Ethanol from sugar cane is described as carbon neutral in principle because:",
  choices:["The crop absorbs the CO₂ later released","Its combustion produces no CO₂","It burns without needing oxygen","Fermentation itself consumes carbon dioxide"],
  a:0, why:"The claim relies on a closed carbon cycle, though farming and processing emissions weaken it in practice." },

{ id:"a7-059", mod:"M7", topic:"Biofuels", diff:3,
  q:"Biodiesel is produced from vegetable oils by:",
  choices:["Transesterification with methanol","Fermentation with yeast and sugar","Fractional distillation","Addition of hydrogen"],
  a:0, why:"The triglyceride's glycerol backbone is exchanged for methyl groups, giving less viscous methyl esters." },

{ id:"a7-060", mod:"M7", topic:"Combustion", diff:3,
  q:"Complete combustion of ethanol, C₂H₅OH, requires how many moles of O₂ per mole of fuel?",
  choices:["3","2","4","1.5"],
  a:0, why:"C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O balances the two carbons and six hydrogens." },

/* ── amines, amides and acids ────────────────────────────── */
{ id:"a7-061", mod:"M7", topic:"Amines and amides", diff:3,
  q:"Amines are basic because the nitrogen atom:",
  choices:["Has a lone pair to accept a proton","Carries a permanent negative charge","Donates an electron to water","Forms hydrogen bonds with itself"],
  a:0, why:"The lone pair acts as a Brønsted base, giving substituted ammonium ions in acid." },

{ id:"a7-062", mod:"M7", topic:"Amines and amides", diff:3,
  q:"An amide linkage is formed between a carboxylic acid and:",
  choices:["An amine","An alcohol","An alkene","A haloalkane"],
  a:0, why:"Condensation expels water and forms the –CONH– group found in proteins and nylon." },

{ id:"a7-063", mod:"M7", topic:"Carboxylic acids", diff:2,
  q:"Carboxylic acids react with sodium carbonate to give a salt, water and:",
  choices:["Carbon dioxide","Hydrogen gas only","Oxygen","An ester"],
  a:0, why:"Effervescence with carbonate distinguishes carboxylic acids from the far weaker phenols and alcohols." },

{ id:"a7-064", mod:"M7", topic:"Carboxylic acids", diff:3,
  q:"Carboxylic acids are weak acids because they:",
  choices:["Ionise only partially in water","Contain no hydrogen atoms","Are insoluble in all solvents","React only with strong bases"],
  a:0, why:"An equilibrium is established, leaving most molecules unionised — ethanoic acid has Ka about 1.8 × 10⁻⁵." },

/* ── structure and reasoning ─────────────────────────────── */
{ id:"a7-065", mod:"M7", topic:"Structure", diff:3,
  q:"The bond angle around a carbon in an alkane is closest to:",
  choices:["109.5°","120°","180°","90°"],
  a:0, why:"Four bonding domains arrange tetrahedrally to minimise repulsion." },

{ id:"a7-066", mod:"M7", topic:"Structure", diff:3,
  q:"The bond angle around each carbon of a C=C double bond is closest to:",
  choices:["120°","109.5°","180°","90°"],
  a:0, why:"Three electron domains give a trigonal planar arrangement, which is also why alkenes cannot rotate about the double bond." },

{ id:"a7-067", mod:"M7", topic:"Reactions summary", diff:3,
  q:"Which reagent distinguishes an alkane from an alkene?",
  choices:["Bromine water","Sodium carbonate solution","Acidified dichromate","Universal indicator"],
  a:0, why:"Only the alkene decolourises bromine water rapidly in the absence of UV light." },

{ id:"a7-068", mod:"M7", topic:"Reactions summary", diff:3,
  q:"Which reagent distinguishes a carboxylic acid from an alcohol?",
  choices:["Sodium carbonate solution","Bromine water","A hot copper wire coil","Distilled water"],
  a:0, why:"Only the acid is strong enough to release CO₂ from a carbonate." },

{ id:"a7-069", mod:"M7", topic:"Reactions summary", diff:3,
  q:"A compound decolourises bromine water and, after hydration, gives a ketone on oxidation. It could be:",
  choices:["Propene","Ethene","Propane","Propan-1-ol"],
  a:0, why:"Markovnikov hydration of propene gives propan-2-ol, a secondary alcohol that oxidises to propanone." },

{ id:"a7-070", mod:"M7", topic:"Reactions summary", diff:3,
  q:"Ethanol can be converted to ethanoic acid in one step using:",
  choices:["Acidified dichromate under reflux","Concentrated sulfuric acid alone","Bromine water in sunlight","Aqueous sodium hydroxide"],
  a:0, why:"Full oxidation of the primary alcohol under reflux takes it past the aldehyde to the acid." },

{ id:"a7-071", mod:"M7", topic:"Reactions summary", diff:3,
  q:"Which sequence converts ethene into ethyl ethanoate?",
  choices:["Hydration, then esterification with ethanoic acid","Oxidation, then hydrogenation","Halogenation, then addition polymerisation","Fermentation, then saponification"],
  a:0, why:"Hydration gives ethanol, which then condenses with ethanoic acid under acid catalysis." },

{ id:"a7-072", mod:"M7", topic:"Polymers", diff:3,
  q:"Polymer chain length affects properties because longer chains give:",
  choices:["Greater entanglement and higher strength","Much weaker dispersion forces overall","Lower melting temperatures","Complete loss of flexibility"],
  a:0, why:"More contact area between chains means stronger cumulative dispersion forces and more physical entanglement." },

{ id:"a7-073", mod:"M7", topic:"Intermolecular forces", diff:3,
  q:"Which compound has the highest boiling point?",
  choices:["Propanoic acid","Propan-1-ol itself","Propanal","Butane"],
  a:0, why:"Dimer-forming carboxylic acids exceed hydrogen-bonding alcohols, which exceed dipole-only aldehydes and non-polar alkanes." },

{ id:"a7-074", mod:"M7", topic:"Nomenclature", diff:3,
  q:"The name of CH₃CH₂CHO is:",
  choices:["Propanal","Propanone","Propan-1-ol","Propanoic acid"],
  a:0, why:"A three-carbon chain ending in a terminal carbonyl takes the aldehyde suffix -al." },

{ id:"a7-075", mod:"M7", topic:"Nomenclature", diff:3,
  q:"The name of CH₃COCH₃ is:",
  choices:["Propanone","Propanal","Ethanoic acid","Propan-2-ol"],
  a:0, why:"The carbonyl sits on the middle carbon of three, making it the simplest ketone." }

];
