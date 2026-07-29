/* Organic chemistry data: IUPAC naming bank + the reaction pathway graph. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

/* ── Naming bank (used by "Name That Compound") ─────────────────
   `struct` is a condensed structural formula rendered with subscripts.
   `distractors` are plausible wrong names for the multiple choice round. */
CHEM.DATA.naming = [
  { struct:"CH3CH2CH3", name:"Propane", family:"Alkane", diff:1,
    distractors:["Propene","Ethane","Butane"],
    why:"Three carbons (prop-) joined by single bonds (-ane)." },
  { struct:"CH3CH2CH2CH3", name:"Butane", family:"Alkane", diff:1,
    distractors:["Propane","But-1-ene","2-methylpropane"],
    why:"An unbranched four-carbon alkane." },
  { struct:"CH3CH(CH3)CH3", name:"2-methylpropane", family:"Alkane", diff:2,
    distractors:["Butane","2-methylbutane","1-methylpropane"],
    why:"Longest chain is three carbons with a methyl branch on C2. '1-methylpropane' would just be butane." },
  { struct:"CH2=CH2", name:"Ethene", family:"Alkene", diff:1,
    distractors:["Ethane","Ethyne","Propene"],
    why:"Two carbons with a double bond. No locant is needed — there is only one possible position." },
  { struct:"CH3CH=CH2", name:"Prop-1-ene", family:"Alkene", diff:2,
    distractors:["Prop-2-ene","Propane","Propyne"],
    why:"The double bond starts at carbon 1 when numbered from the nearer end. 'Prop-2-ene' is the same molecule named incorrectly." },
  { struct:"CH3CH2CH=CH2", name:"But-1-ene", family:"Alkene", diff:2,
    distractors:["But-2-ene","Butane","But-3-ene"],
    why:"Number from the end giving the double bond the lowest locant — 1, not 3." },
  { struct:"CH3CH=CHCH3", name:"But-2-ene", family:"Alkene", diff:2,
    distractors:["But-1-ene","Butane","But-3-ene"],
    why:"The double bond sits between carbons 2 and 3, so it takes the locant 2 from either end." },
  { struct:"CH3CH2OH", name:"Ethanol", family:"Alcohol", diff:1,
    distractors:["Methanol","Ethanal","Ethanoic acid"],
    why:"Two carbons plus a hydroxyl group. Ethan- + -ol." },
  { struct:"CH3CH2CH2OH", name:"Propan-1-ol", family:"Alcohol", diff:2,
    distractors:["Propan-2-ol","Propanal","Propan-3-ol"],
    why:"Primary alcohol — the -OH is on an end carbon, which takes number 1." },
  { struct:"CH3CH(OH)CH3", name:"Propan-2-ol", family:"Alcohol", diff:2,
    distractors:["Propan-1-ol","Propanone","Propanal"],
    why:"Secondary alcohol — the -OH carbon is attached to two other carbons." },
  { struct:"CH3C(CH3)(OH)CH3", name:"2-methylpropan-2-ol", family:"Alcohol", diff:3,
    distractors:["Butan-2-ol","2-methylpropan-1-ol","Butan-1-ol"],
    why:"Tertiary alcohol: the -OH carbon carries three alkyl groups, so it cannot be oxidised." },
  { struct:"CH3CH2CH2CH2OH", name:"Butan-1-ol", family:"Alcohol", diff:2,
    distractors:["Butan-2-ol","Butanal","Butanoic acid"],
    why:"Four carbons with the hydroxyl on the first." },
  { struct:"CH3CHO", name:"Ethanal", family:"Aldehyde", diff:2,
    distractors:["Ethanol","Ethanoic acid","Propanal"],
    why:"The -CHO group is always at the end of the chain and is carbon 1, so no locant is written." },
  { struct:"CH3CH2CHO", name:"Propanal", family:"Aldehyde", diff:2,
    distractors:["Propanone","Propan-1-ol","Propanoic acid"],
    why:"Three carbons ending in a -CHO group." },
  { struct:"CH3COCH3", name:"Propanone", family:"Ketone", diff:2,
    distractors:["Propanal","Propan-2-ol","Butanone"],
    why:"The carbonyl is on an internal carbon, making it a ketone (acetone)." },
  { struct:"CH3COOH", name:"Ethanoic acid", family:"Carboxylic acid", diff:1,
    distractors:["Methanoic acid","Ethanal","Ethanol"],
    why:"Two carbons in total, including the carboxyl carbon." },
  { struct:"HCOOH", name:"Methanoic acid", family:"Carboxylic acid", diff:2,
    distractors:["Ethanoic acid","Methanal","Methanol"],
    why:"A single carbon, which is the carboxyl carbon itself — formic acid." },
  { struct:"CH3CH2COOH", name:"Propanoic acid", family:"Carboxylic acid", diff:2,
    distractors:["Ethanoic acid","Propanal","Butanoic acid"],
    why:"Three carbons counting the -COOH carbon as number 1." },
  { struct:"CH3CH2CH2COOH", name:"Butanoic acid", family:"Carboxylic acid", diff:2,
    distractors:["Propanoic acid","Butanal","Butan-1-ol"],
    why:"Four carbons ending in a carboxyl group — the smell of rancid butter." },
  { struct:"CH3COOCH2CH3", name:"Ethyl ethanoate", family:"Ester", diff:2,
    distractors:["Ethyl methanoate","Methyl ethanoate","Ethanoic acid"],
    why:"Alcohol part named first as an alkyl group (ethyl), acid part second as -oate." },
  { struct:"HCOOCH3", name:"Methyl methanoate", family:"Ester", diff:3,
    distractors:["Methyl ethanoate","Ethyl methanoate","Methanoic acid"],
    why:"The single-carbon acid gives 'methanoate'; the methanol gives 'methyl'." },
  { struct:"CH3CH2COOCH3", name:"Methyl propanoate", family:"Ester", diff:3,
    distractors:["Propyl methanoate","Ethyl ethanoate","Methyl ethanoate"],
    why:"The acyl side has three carbons (propanoate); the alkyl side from methanol is methyl." },
  { struct:"CH3CH2Cl", name:"Chloroethane", family:"Haloalkane", diff:1,
    distractors:["1-chloropropane","Chloromethane","Ethanol"],
    why:"Halogen prefix on a two-carbon chain. No locant needed with only two carbons." },
  { struct:"CH3CHClCH3", name:"2-chloropropane", family:"Haloalkane", diff:2,
    distractors:["1-chloropropane","2-chlorobutane","Chloropropane"],
    why:"The chlorine sits on the middle carbon of a three-carbon chain." },
  { struct:"CH3CH2CH2Br", name:"1-bromopropane", family:"Haloalkane", diff:2,
    distractors:["2-bromopropane","1-bromobutane","Bromoethane"],
    why:"Number from the end nearer the substituent to give the lowest locant." },
  { struct:"CH3CH2NH2", name:"Ethanamine", family:"Amine", diff:3,
    distractors:["Ethanamide","Methanamine","Ethylamine acid"],
    why:"An amine has -NH₂ attached to a carbon chain: ethan- + -amine." },
  { struct:"CH3CONH2", name:"Ethanamide", family:"Amide", diff:3,
    distractors:["Ethanamine","Ethanoic acid","Propanamide"],
    why:"An amide has a carbonyl bonded to nitrogen: -CONH₂ gives the suffix -amide." },
  { struct:"CH2=CHCl", name:"Chloroethene", family:"Alkene", diff:2,
    distractors:["Chloroethane","1-chloropropene","Dichloroethene"],
    why:"The monomer of PVC — a chlorine substituted onto ethene." }
];

/* ── Reaction pathway graph (used by "Pathway Puzzle") ──────────
   Each edge: from → to, triggered by a reagent card.

   Two families, and deliberately no bridge between them: there is no
   carbon–carbon bond formation anywhere in the HSC course, so a C₂ compound can
   never become a C₃ one. Puzzles therefore stay inside one family. Reagents are
   generic (a reflux with dichromate oxidises any primary alcohol), so the C₃
   branch reuses most of the C₂ reagent cards rather than duplicating them. */
CHEM.DATA.pathwayNodes = {
  /* C₂ family, fed by fermentation */
  glucose:      { label:"Glucose",             sub:"C₆H₁₂O₆" },
  ethane:       { label:"Ethane",              sub:"CH₃CH₃" },
  ethene:       { label:"Ethene",              sub:"CH₂=CH₂" },
  chloroethane: { label:"Chloroethane",        sub:"CH₃CH₂Cl" },
  ethanol:      { label:"Ethanol",             sub:"CH₃CH₂OH" },
  ethanal:      { label:"Ethanal",             sub:"CH₃CHO" },
  ethanoic:     { label:"Ethanoic acid",       sub:"CH₃COOH" },
  ester:        { label:"Ethyl ethanoate",     sub:"CH₃COOCH₂CH₃" },
  dibromo:      { label:"1,2-dibromoethane",   sub:"CH₂BrCH₂Br" },
  polyethene:   { label:"Polyethene",          sub:"-(CH₂CH₂)ₙ-" },
  ethanoate:    { label:"Sodium ethanoate",    sub:"CH₃COONa" },
  ethanediol:   { label:"Ethane-1,2-diol",     sub:"HOCH₂CH₂OH" },
  pet:          { label:"Polyester (PET)",     sub:"-(OCH₂CH₂OOC…)ₙ-" },
  ethanamine:   { label:"Ethanamine",          sub:"CH₃CH₂NH₂" },
  ethanamide:   { label:"Ethanamide",          sub:"CH₃CONH₂" },

  /* C₃ family. Note that propan-1-ol cannot be reached from propene — hydration
     is Markovnikov, so it gives propan-2-ol — which is exactly the point of
     several of the puzzles. The 1-substituted chain is entered from propan-1-ol
     or 1-chloropropane instead. */
  propane:      { label:"Propane",             sub:"CH₃CH₂CH₃" },
  propene:      { label:"Propene",             sub:"CH₃CH=CH₂" },
  propan1ol:    { label:"Propan-1-ol",         sub:"CH₃CH₂CH₂OH" },
  propan2ol:    { label:"Propan-2-ol",         sub:"CH₃CH(OH)CH₃" },
  propanal:     { label:"Propanal",            sub:"CH₃CH₂CHO" },
  propanone:    { label:"Propanone",           sub:"CH₃COCH₃" },
  propanoic:    { label:"Propanoic acid",      sub:"CH₃CH₂COOH" },
  chloroprop1:  { label:"1-chloropropane",     sub:"CH₃CH₂CH₂Cl" },
  chloroprop2:  { label:"2-chloropropane",     sub:"CH₃CHClCH₃" },
  dibromoprop:  { label:"1,2-dibromopropane",  sub:"CH₃CHBrCH₂Br" },
  polypropene:  { label:"Polypropene",         sub:"-(CH₂CH(CH₃))ₙ-" },
  propylethanoate: { label:"Propyl ethanoate", sub:"CH₃COOCH₂CH₂CH₃" },
  ethylpropanoate: { label:"Ethyl propanoate", sub:"CH₃CH₂COOCH₂CH₃" },
  propanoate:   { label:"Sodium propanoate",   sub:"CH₃CH₂COONa" }
};

CHEM.DATA.reagents = [
  { id:"uv_cl2",     label:"Cl₂ + UV light",              sub:"free radical substitution" },
  { id:"crack",      label:"Cracking",                    sub:"high temp, catalyst" },
  { id:"naoh_aq",    label:"NaOH(aq), warm",              sub:"nucleophilic substitution" },
  { id:"koh_eth",    label:"KOH in ethanol, heat",        sub:"elimination" },
  { id:"steam_h3po4",label:"Steam, H₃PO₄ catalyst",       sub:"hydration" },
  { id:"h2_ni",      label:"H₂, Ni catalyst",             sub:"addition / hydrogenation" },
  { id:"br2",        label:"Br₂(aq)",                     sub:"addition across C=C" },
  { id:"polymerise", label:"High pressure + initiator",   sub:"addition polymerisation" },
  { id:"conc_h2so4_hot", label:"Conc. H₂SO₄, 170 °C",     sub:"dehydration" },
  { id:"hcl_pcl5",   label:"PCl₅ (or conc. HCl)",         sub:"substitution of -OH" },
  { id:"oxid_distil",label:"K₂Cr₂O₇/H⁺, distil off",      sub:"partial oxidation" },
  { id:"oxid_reflux",label:"K₂Cr₂O₇/H⁺, reflux",          sub:"full oxidation" },
  { id:"esterify",   label:"Ethanol + conc. H₂SO₄",       sub:"esterify — acid side" },
  { id:"naoh_neut",  label:"NaOH(aq), neutralise",        sub:"acid–base reaction" },
  { id:"yeast",      label:"Yeast, 30 °C, anaerobic",     sub:"fermentation" },
  /* The mirror of `esterify`: that card supplies the alcohol and so acts on an
     acid, this one supplies the acid and so acts on an alcohol. Both can make
     ethyl ethanoate, from opposite ends — which is the whole lesson in how an
     ester is named. */
  { id:"esterify_acid", label:"Ethanoic acid + conc. H₂SO₄", sub:"esterify — alcohol side" },
  { id:"hcl_add",    label:"HCl(g)",                      sub:"addition across C=C" },
  { id:"nh3_excess", label:"Excess NH₃, heat",            sub:"ammonia as a nucleophile" },
  { id:"terephthalic", label:"Benzene-1,4-dicarboxylic acid, heat", sub:"condensation polymerisation" }
];

CHEM.DATA.pathwayEdges = [
  { from:"glucose",      via:"yeast",           to:"ethanol" },
  { from:"ethane",       via:"uv_cl2",          to:"chloroethane" },
  { from:"ethane",       via:"crack",           to:"ethene" },
  { from:"chloroethane", via:"naoh_aq",         to:"ethanol" },
  { from:"chloroethane", via:"koh_eth",         to:"ethene" },
  { from:"ethene",       via:"steam_h3po4",     to:"ethanol" },
  { from:"ethene",       via:"h2_ni",           to:"ethane" },
  { from:"ethene",       via:"br2",             to:"dibromo" },
  { from:"ethene",       via:"polymerise",      to:"polyethene" },
  { from:"ethanol",      via:"conc_h2so4_hot",  to:"ethene" },
  { from:"ethanol",      via:"hcl_pcl5",        to:"chloroethane" },
  { from:"ethanol",      via:"oxid_distil",     to:"ethanal" },
  { from:"ethanol",      via:"oxid_reflux",     to:"ethanoic" },
  { from:"ethanal",      via:"oxid_reflux",     to:"ethanoic" },
  { from:"ethanoic",     via:"esterify",        to:"ester" },
  { from:"ethanoic",     via:"naoh_neut",       to:"ethanoate" },
  { from:"ethene",       via:"hcl_add",         to:"chloroethane" },
  { from:"ethanol",      via:"esterify_acid",   to:"ester" },
  { from:"dibromo",      via:"naoh_aq",         to:"ethanediol" },
  { from:"ethanediol",   via:"terephthalic",    to:"pet" },
  { from:"chloroethane", via:"nh3_excess",      to:"ethanamine" },
  { from:"ethanoic",     via:"nh3_excess",      to:"ethanamide" },

  /* C₃ branch */
  { from:"propane",      via:"crack",           to:"propene" },
  { from:"propene",      via:"h2_ni",           to:"propane" },
  { from:"propene",      via:"steam_h3po4",     to:"propan2ol" },   // Markovnikov
  { from:"propene",      via:"hcl_add",         to:"chloroprop2" }, // Markovnikov
  { from:"propene",      via:"br2",             to:"dibromoprop" },
  { from:"propene",      via:"polymerise",      to:"polypropene" },
  { from:"chloroprop1",  via:"naoh_aq",         to:"propan1ol" },
  { from:"chloroprop1",  via:"koh_eth",         to:"propene" },
  { from:"chloroprop2",  via:"naoh_aq",         to:"propan2ol" },
  { from:"chloroprop2",  via:"koh_eth",         to:"propene" },
  { from:"propan1ol",    via:"hcl_pcl5",        to:"chloroprop1" },
  { from:"propan1ol",    via:"conc_h2so4_hot",  to:"propene" },
  { from:"propan1ol",    via:"oxid_distil",     to:"propanal" },
  { from:"propan1ol",    via:"oxid_reflux",     to:"propanoic" },
  { from:"propan1ol",    via:"esterify_acid",   to:"propylethanoate" },
  { from:"propan2ol",    via:"hcl_pcl5",        to:"chloroprop2" },
  { from:"propan2ol",    via:"conc_h2so4_hot",  to:"propene" },
  /* A secondary alcohol stops at the ketone, so distilling and refluxing give
     the same product — unlike the primary alcohols above. */
  { from:"propan2ol",    via:"oxid_distil",     to:"propanone" },
  { from:"propan2ol",    via:"oxid_reflux",     to:"propanone" },
  { from:"propanal",     via:"oxid_reflux",     to:"propanoic" },
  { from:"propanoic",    via:"esterify",        to:"ethylpropanoate" },
  { from:"propanoic",    via:"naoh_neut",       to:"propanoate" }
];

/* `steps` is the shortest route, and the validator recomputes it from the graph
   rather than trusting it — a wrong number here means the chemistry above is
   wrong, not just the label. The game shows the computed value either way. */
CHEM.DATA.pathwayPuzzles = [
  /* ── C₂: the fermentation family ───────────────────────────── */
  { start:"ethene",  target:"ethanoic",   steps:2, diff:1, note:"Hydrate, then oxidise all the way." },
  { start:"ethane",  target:"ethanol",    steps:2, diff:1, note:"Two different two-step routes work." },
  { start:"ethanol", target:"dibromo",    steps:2, diff:1, note:"Make the alkene first." },
  { start:"ethene",  target:"chloroethane", steps:1, diff:1, note:"HCl adds straight across the double bond." },
  { start:"ethane",  target:"polyethene", steps:2, diff:2, note:"Crack it, then polymerise." },
  { start:"glucose", target:"ethanoic",   steps:2, diff:2, note:"Ferment, then reflux with dichromate." },
  { start:"ethane",  target:"dibromo",    steps:2, diff:2, note:"You need the C=C before bromine will add." },
  { start:"chloroethane", target:"polyethene", steps:2, diff:2, note:"Eliminate to the alkene first." },
  { start:"chloroethane", target:"ethanoic",  steps:2, diff:2, note:"Hydrolyse to the alcohol, then reflux." },
  { start:"ethanol", target:"ethanoate",  steps:2, diff:2, note:"Oxidise fully, then neutralise the acid." },
  { start:"ethanal", target:"ester",      steps:2, diff:2, note:"An aldehyde is only half-oxidised — finish the job first." },
  { start:"ethene",  target:"ester",      steps:2, diff:2, note:"Hydrate it, then esterify the alcohol directly. Going via the acid works but wastes a step." },
  { start:"glucose", target:"ester",      steps:2, diff:2, note:"Ferment, then esterify. The acid half comes from the reagent, not from your alcohol." },
  { start:"ethane",  target:"ethanal",    steps:3, diff:3, note:"Substitute, hydrolyse, then oxidise gently — distil the aldehyde off before it oxidises further." },
  { start:"glucose", target:"polyethene", steps:3, diff:3, note:"Ferment, dehydrate, polymerise." },
  { start:"glucose", target:"ethanoate",  steps:3, diff:3, note:"Fermentation feeds the whole chain." },
  { start:"ethane",  target:"ethanoate",  steps:4, diff:3, note:"Long haul — finish with a neutralisation." },

  /* ── C₂: diols, polyesters and the nitrogen branch ─────────── */
  { start:"ethene",  target:"ethanediol", steps:2, diff:2, note:"Add bromine across the C=C, then hydrolyse both halogens." },
  { start:"ethene",  target:"pet",        steps:3, diff:3, note:"The diol is one monomer; the dicarboxylic acid supplies the other. Condensation, not addition." },
  { start:"ethanol", target:"pet",        steps:4, diff:3, note:"Dehydrate first — the diol comes from the alkene, not from ethanol." },
  { start:"chloroethane", target:"ethanamine", steps:1, diff:1, note:"Ammonia is the nucleophile. Use excess so it stops at the primary amine." },
  { start:"ethene",  target:"ethanamine", steps:2, diff:2, note:"Ammonia needs a leaving group to displace, so make the haloalkane first." },
  { start:"ethanol", target:"ethanamide", steps:2, diff:2, note:"Oxidise to the acid, then let ammonia attack the carbonyl." },
  { start:"ethene",  target:"ethanamide", steps:3, diff:3, note:"Amides come from acids, and acids come from full oxidation." },

  /* ── C₃: Markovnikov, and why chain position matters ───────── */
  { start:"propene", target:"propan2ol",  steps:1, diff:1, note:"Hydration is Markovnikov: the -OH lands on the more substituted carbon." },
  { start:"propene", target:"dibromoprop", steps:1, diff:1, note:"Bromine adds across the double bond, one atom to each carbon." },
  { start:"propan1ol", target:"propanal", steps:1, diff:1, note:"Distil the aldehyde off as it forms, or it oxidises straight past you." },
  { start:"propan1ol", target:"propylethanoate", steps:1, diff:2, note:"One step. The alcohol is already the propyl half; ethanoic acid brings the acyl half." },
  { start:"propane", target:"polypropene", steps:2, diff:2, note:"Crack to the alkene, then addition polymerisation." },
  { start:"propane", target:"propan2ol",  steps:2, diff:2, note:"Crack, then hydrate — and hydration will not give you propan-1-ol." },
  { start:"propane", target:"chloroprop2", steps:2, diff:2, note:"Adding HCl to propene follows Markovnikov, so the chlorine takes the middle carbon." },
  { start:"propene", target:"propanone",  steps:2, diff:2, note:"A secondary alcohol oxidises to a ketone and stops there." },
  { start:"chloroprop2", target:"propanone", steps:2, diff:2, note:"Hydrolyse to the secondary alcohol, then oxidise." },
  { start:"chloroprop1", target:"propanoic", steps:2, diff:2, note:"Hydrolyse to the primary alcohol, then reflux — do not distil." },
  { start:"chloroprop1", target:"polypropene", steps:2, diff:2, note:"Eliminate to propene first." },
  { start:"propan2ol", target:"polypropene", steps:2, diff:2, note:"Dehydration gives the alkene whichever alcohol you start from." },
  { start:"propan1ol", target:"dibromoprop", steps:2, diff:2, note:"Dehydrate, then add bromine." },
  { start:"propanal", target:"propanoate", steps:2, diff:2, note:"Finish the oxidation, then neutralise." },
  { start:"propan1ol", target:"propanoate", steps:2, diff:2, note:"Straight through the acid." },
  { start:"propan1ol", target:"ethylpropanoate", steps:2, diff:3, note:"Compare with propyl ethanoate: here your alcohol becomes the acid half, and the reagent supplies the ethyl." },
  { start:"propan1ol", target:"chloroprop2", steps:2, diff:3, note:"You cannot move the chlorine along the chain. Go via the alkene and let Markovnikov place it." },
  { start:"propan1ol", target:"propanone",  steps:3, diff:3, note:"Dehydrate and re-hydrate to shift the -OH to the middle carbon, then oxidise." },
  { start:"propane", target:"propanone",   steps:3, diff:3, note:"Crack, hydrate, oxidise." },
  { start:"chloroprop1", target:"propanone", steps:3, diff:3, note:"Eliminate, re-add the water the other way round, then oxidise." }
];
