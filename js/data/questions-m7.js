/* Module 7 — Organic Chemistry */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM7 = [
{ id:"m7-01", mod:"M7", topic:"Nomenclature", diff:1,
  q:"What is the IUPAC name of CH₃CH₂CH₂OH?",
  choices:["Propan-1-ol","Propan-2-ol","Propanal","Propanoic acid"],
  a:0, why:"Three carbons (prop-), single bonds (-an-), hydroxyl group (-ol) on carbon 1. Numbering starts from the end that gives the functional group the lowest locant." },

{ id:"m7-02", mod:"M7", topic:"Nomenclature", diff:2,
  q:"Name the compound CH₃CH(CH₃)CH₂CH₂CH₃.",
  choices:["2-methylpentane","3-methylpentane","2-methylbutane","2,3-dimethylbutane"],
  a:0, why:"The longest chain is 5 carbons (pentane) with a methyl branch. Numbering from the nearer end gives the branch position 2." },

{ id:"m7-03", mod:"M7", topic:"Nomenclature", diff:2,
  q:"What is the correct name for CH₃CH₂COOH?",
  choices:["Propanoic acid","Ethanoic acid","Propanal","Propan-1-ol"],
  a:0, why:"Three carbons including the carboxyl carbon, which is always carbon 1. The -COOH group gives the suffix -oic acid." },

{ id:"m7-04", mod:"M7", topic:"Nomenclature", diff:3,
  q:"Name the compound CH₃CH₂CHClCH₃.",
  choices:["2-chlorobutane","3-chlorobutane","1-chlorobutane","2-chloropropane"],
  a:0, why:"Four carbons in the chain. Numbering from the right places Cl on carbon 2; numbering from the left would give 3, so the lower locant wins." },

{ id:"m7-05", mod:"M7", topic:"Functional groups", diff:1,
  q:"Which functional group is present in an ester?",
  choices:["-COO-","-COOH","-OH","-NH₂"],
  a:0, why:"An ester has a carbonyl carbon bonded to an -O- that links to another carbon chain (R-COO-R'). A carboxylic acid has -COOH with an acidic hydrogen." },

{ id:"m7-06", mod:"M7", topic:"Isomers", diff:2,
  q:"How many structural isomers does C₄H₁₀ have?",
  choices:["2","3","4","1"],
  a:0, why:"Butane (straight chain) and 2-methylpropane (branched). Longer alkanes have far more: C₅H₁₂ has 3 and C₆H₁₄ has 5." },

{ id:"m7-07", mod:"M7", topic:"Isomers", diff:3,
  q:"Propan-1-ol and propan-2-ol are examples of:",
  choices:["Positional isomers","Chain isomers","Functional group isomers","Identical compounds"],
  a:0, why:"They share the same carbon skeleton and functional group but differ in where the -OH is attached. Propan-1-ol vs methoxyethane would be functional group isomers." },

{ id:"m7-08", mod:"M7", topic:"Intermolecular forces", diff:2,
  q:"Why does butan-1-ol have a much higher boiling point than butane?",
  choices:["The -OH group allows hydrogen bonding between molecules","Butan-1-ol has a considerably larger molar mass","Butane forms a rigid ionic lattice in the liquid state","Butan-1-ol is branched and so packs more tightly"],
  a:0, why:"Butane only has dispersion forces, while butan-1-ol also forms hydrogen bonds between the O-H groups — much stronger, so far more energy is needed to separate the molecules." },

{ id:"m7-09", mod:"M7", topic:"Intermolecular forces", diff:3,
  q:"Which has the highest boiling point?",
  choices:["Propanoic acid","Propan-1-ol","Propanal","Propane"],
  a:0, why:"Carboxylic acids form cyclic hydrogen-bonded dimers — effectively doubling the mass being separated. Alcohols hydrogen bond but not as a dimer; aldehydes are dipole–dipole only; propane only has dispersion." },

{ id:"m7-10", mod:"M7", topic:"Solubility", diff:2,
  q:"Why does the water solubility of primary alcohols decrease as the chain lengthens?",
  choices:["The non-polar hydrocarbon chain comes to dominate the polar -OH","The hydroxyl group is progressively lost as chains lengthen","Longer-chain alcohols behave as ionic compounds in water","Hydrogen bonding to water becomes stronger with chain length"],
  a:0, why:"Methanol and ethanol are fully miscible, but by hexan-1-ol the hydrophobic tail cannot be accommodated in the hydrogen-bonded water network." },

{ id:"m7-11", mod:"M7", topic:"Reactions of alkanes", diff:2,
  q:"Methane reacts with chlorine in UV light by:",
  choices:["Free radical substitution","Electrophilic addition","Nucleophilic substitution","Condensation polymerisation"],
  a:0, why:"UV homolytically splits Cl₂ into radicals (initiation), which propagate by abstracting H from methane. Alkanes are saturated, so addition is impossible." },

{ id:"m7-12", mod:"M7", topic:"Reactions of alkenes", diff:2,
  q:"Ethene decolourises bromine water. This reaction is:",
  choices:["Addition, forming 1,2-dibromoethane","Substitution, forming bromoethane and HBr","Oxidation, forming ethanol and hydrogen bromide","Combustion, forming carbon dioxide and water"],
  a:0, why:"The C=C π bond attacks Br₂, opening to give a saturated dibromo product. The loss of the orange bromine colour is the standard test for unsaturation." },

{ id:"m7-13", mod:"M7", topic:"Reactions of alkenes", diff:3,
  q:"Hydration of propene with dilute H₂SO₄ produces mainly:",
  choices:["Propan-2-ol","Propan-1-ol","Propanal","Propanoic acid"],
  a:0, why:"Markovnikov's rule: the H adds to the carbon already bearing more hydrogens, so -OH ends up on the middle carbon giving the secondary alcohol as the major product." },

{ id:"m7-14", mod:"M7", topic:"Haloalkanes", diff:2,
  q:"Reacting 1-chloropropane with aqueous NaOH produces:",
  choices:["Propan-1-ol, by nucleophilic substitution","Propene, by elimination of hydrogen chloride","Propanoic acid, by oxidation of the chloride","Propanal, by partial oxidation of the chain"],
  a:0, why:"OH⁻ is a good nucleophile and displaces the chloride leaving group. Hot, concentrated alcoholic KOH would instead favour elimination to give the alkene." },

{ id:"m7-15", mod:"M7", topic:"Oxidation of alcohols", diff:3,
  q:"Oxidising propan-1-ol with acidified K₂Cr₂O₇ under reflux gives:",
  choices:["Propanoic acid","Propanal only","Propanone","No reaction at all"],
  a:0, why:"Primary alcohols oxidise to aldehydes and then on to carboxylic acids. Reflux keeps everything in the flask so oxidation goes to completion; distilling off the aldehyde as it forms would stop at propanal." },

{ id:"m7-16", mod:"M7", topic:"Oxidation of alcohols", diff:2,
  q:"Which alcohol resists oxidation by acidified permanganate?",
  choices:["2-methylpropan-2-ol","Propan-1-ol","Propan-2-ol","2-methylpropan-1-ol"],
  a:0, why:"Tertiary alcohols have no hydrogen on the carbon bearing the -OH, so oxidation would require breaking a C-C bond. The purple colour of MnO₄⁻ persists." },

{ id:"m7-17", mod:"M7", topic:"Esterification", diff:2,
  q:"Ethanol and ethanoic acid react with a concentrated H₂SO₄ catalyst to form:",
  choices:["Ethyl ethanoate and water","Ethyl ethanol and hydrogen","Ethanal and water","Ethene and water"],
  a:0, why:"Esterification (Fischer): the alcohol supplies the alkyl group named first, the acid supplies the -oate part. Concentrated H₂SO₄ is both catalyst and dehydrating agent." },

{ id:"m7-18", mod:"M7", topic:"Esterification", diff:3,
  q:"Which combination produces methyl propanoate?",
  choices:["Methanol + propanoic acid","Propan-1-ol + methanoic acid","Methanol + propanol","Ethanol + ethanoic acid"],
  a:0, why:"The first word of an ester name comes from the alcohol (methanol → methyl), the second from the acid (propanoic acid → propanoate)." },

{ id:"m7-19", mod:"M7", topic:"Esterification", diff:2,
  q:"Why is a reflux condenser used during esterification?",
  choices:["To prevent loss of volatile reactants while heating for a long time","To speed the reaction up by raising the pressure inside the flask","To remove the water formed and so shift the equilibrium right","To purify the ester by separating it from the acid catalyst"],
  a:0, why:"Vapours condense and return to the flask, so the mixture can be heated for a long time without losing the volatile alcohol or ester. Esterification is a slow equilibrium reaction." },

{ id:"m7-20", mod:"M7", topic:"Saponification", diff:3,
  q:"Saponification is the reaction of a fat with:",
  choices:["A strong base, producing soap and glycerol","A strong acid, producing an ester and water","An alcohol, producing an ester and glycerol","Water alone, producing fatty acids and glycerol"],
  a:0, why:"NaOH hydrolyses the three ester linkages of a triglyceride, giving glycerol and three sodium salts of fatty acids — the soap." },

{ id:"m7-21", mod:"M7", topic:"Soaps and detergents", diff:2,
  q:"Soaps clean because their molecules have:",
  choices:["A non-polar tail for grease and a polar head for water","Two polar ends that both dissolve readily in water","A charged hydrocarbon tail that repels the grease","Only non-polar regions, which dissolve oils directly"],
  a:0, why:"The amphipathic structure lets soap form micelles: hydrocarbon tails point inward into the oil droplet and ionic heads face outward into water, suspending the grease." },

{ id:"m7-22", mod:"M7", topic:"Soaps and detergents", diff:3,
  q:"Soaps perform poorly in hard water because:",
  choices:["Ca²⁺ and Mg²⁺ form an insoluble scum with fatty acid anions","Hard water is too acidic and protonates the soap anion","Soap molecules decompose at temperatures above 20 °C","Hard water already contains synthetic detergent molecules"],
  a:0, why:"Calcium and magnesium salts of fatty acids are insoluble and precipitate as scum. Synthetic anionic detergents based on sulfonates form soluble calcium salts and avoid this." },

{ id:"m7-23", mod:"M7", topic:"Addition polymers", diff:2,
  q:"Which monomer produces polyvinyl chloride (PVC)?",
  choices:["Chloroethene","Ethene","Propene","Tetrafluoroethene"],
  a:0, why:"PVC is the addition polymer of chloroethene (vinyl chloride), CH₂=CHCl. The C=C opens and links repeatedly to give a saturated backbone." },

{ id:"m7-24", mod:"M7", topic:"Polymers", diff:3,
  q:"How do low-density and high-density polyethylene differ?",
  choices:["LDPE is branched, so weaker dispersion forces and lower melting point","LDPE has a considerably higher average molar mass than HDPE","HDPE retains double bonds along its polymer backbone","LDPE is a condensation polymer whereas HDPE is an addition polymer"],
  a:0, why:"Branching prevents chains from packing closely, so LDPE is less crystalline, more flexible and lower melting. HDPE's linear chains pack tightly, giving rigidity and strength." },

{ id:"m7-25", mod:"M7", topic:"Condensation polymers", diff:3,
  q:"Nylon and polyesters are condensation polymers because:",
  choices:["A small molecule such as water is eliminated at each linkage","They contain only carbon and hydrogen in their backbones","They form by opening the double bond of an alkene monomer","Each monomer carries exactly one reactive functional group"],
  a:0, why:"Two different functional groups (e.g. -COOH and -NH₂) join with the loss of H₂O. Each monomer needs two reactive groups so the chain can keep growing." },

{ id:"m7-26", mod:"M7", topic:"Polymers", diff:2,
  q:"Which polymer is a condensation polymer?",
  choices:["Nylon 6,6","Polystyrene","Polypropylene","Teflon"],
  a:0, why:"Nylon 6,6 forms amide links between a diamine and a dicarboxylic acid, releasing water. The other three are addition polymers of alkene monomers." },

{ id:"m7-27", mod:"M7", topic:"Combustion", diff:2,
  q:"Incomplete combustion of a hydrocarbon is a concern because it produces:",
  choices:["Carbon monoxide and soot","More energy than complete combustion","Only water vapour","Ozone"],
  a:0, why:"Limited oxygen gives CO (a toxic gas that binds haemoglobin) and carbon particulates, and releases less energy per mole of fuel than complete combustion." },

{ id:"m7-28", mod:"M7", topic:"Biofuels", diff:2,
  q:"Ethanol produced by fermentation of glucose is described as a renewable fuel because:",
  choices:["The CO₂ released was recently absorbed by the crop when growing","Its combustion releases no carbon dioxide into the atmosphere","It is refined from crude oil using a renewable catalyst","It contains considerably more energy per gram than petrol"],
  a:0, why:"The carbon cycles over a growing season rather than being released from fossil stores. Note that ethanol has a lower energy density than petrol (~30 kJ g⁻¹ vs ~48 kJ g⁻¹)." },

{ id:"m7-29", mod:"M7", topic:"Fermentation", diff:2,
  q:"The equation for the fermentation of glucose is:",
  choices:["C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂","C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O","C₂H₄ + H₂O → C₂H₅OH","2C₂H₅OH → C₄H₁₀ + O₂"],
  a:0, why:"Yeast enzymes anaerobically convert each glucose molecule into two ethanol molecules and two CO₂ molecules, typically at 25–37 °C." },

{ id:"m7-30", mod:"M7", topic:"Amines and amides", diff:3,
  q:"Which statement about amines is correct?",
  choices:["They are basic, as the nitrogen lone pair accepts a proton","They are acidic, since the N-H bond readily releases a proton","They cannot hydrogen bond with water molecules at all","They contain a carbonyl group bonded to the nitrogen"],
  a:0, why:"The lone pair on nitrogen accepts H⁺, forming an ammonium ion — the same reason ammonia is basic. Amides are far less basic because the lone pair is delocalised onto the carbonyl." },

{ id:"m7-31", mod:"M7", topic:"Acid reactions", diff:2,
  q:"Ethanoic acid reacts with sodium carbonate to give:",
  choices:["Sodium ethanoate, water and carbon dioxide","Ethanol, sodium carbonate and carbon dioxide","An ester, together with water and carbon dioxide","No reaction, as ethanoic acid is too weak"],
  a:0, why:"Carboxylic acids are strong enough acids to protonate carbonate: 2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂. Effervescence distinguishes acids from alcohols." },

{ id:"m7-32", mod:"M7", topic:"Structure", diff:3,
  q:"Why are alkanes described as saturated?",
  choices:["Every carbon–carbon bond is single, so no atoms can be added","They dissolve readily in water and other polar solvents","They contain only carbon atoms in their molecular structure","They react readily with bromine water in the dark"],
  a:0, why:"Each carbon is bonded to four other atoms — the maximum possible. Unsaturated compounds have double or triple bonds that can undergo addition reactions." }
];
