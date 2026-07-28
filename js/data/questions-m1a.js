/* Module 1 expansion A — Properties & Structure of Matter.
   Options are deliberately length-matched: the key must never be guessable from
   its length. Reasoning belongs in `why`, not in the correct choice. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.qM1A = [

/* ── mixtures and separation ─────────────────────────────── */
{ id:"a1-001", mod:"M1", topic:"Separation techniques", diff:1,
  q:"Which technique best separates sand from a sand–water mixture?",
  choices:["Filtration","Distillation","Chromatography","Electrolysis"],
  a:0, why:"Sand is insoluble, so it stays on the filter paper while water passes through as filtrate." },

{ id:"a1-002", mod:"M1", topic:"Separation techniques", diff:2,
  q:"Two miscible liquids with boiling points of 78 °C and 100 °C are best separated by:",
  choices:["Fractional distillation","Simple filtration","Decantation","Magnetic separation"],
  a:0, why:"A fractionating column gives repeated vaporisation–condensation cycles, which resolves boiling points this close far better than a single distillation." },

{ id:"a1-003", mod:"M1", topic:"Separation techniques", diff:2,
  q:"Separating funnel separation relies on a difference in:",
  choices:["Density and miscibility","Boiling point only","Particle size only","Magnetic susceptibility"],
  a:0, why:"Immiscible liquids form layers ordered by density, and the tap drains the lower layer first." },

{ id:"a1-004", mod:"M1", topic:"Separation techniques", diff:2,
  q:"Crystallisation separates a dissolved salt from solution by exploiting:",
  choices:["Solubility changing with temperature","A large difference in component boiling points","Differing magnetic behaviour","Particle size differences"],
  a:0, why:"Cooling a saturated solution lowers solubility, so the excess solute comes out as crystals while impurities stay dissolved." },

{ id:"a1-005", mod:"M1", topic:"Separation techniques", diff:3,
  q:"A student must recover pure water from seawater. The correct choice is:",
  choices:["Distillation","Filtration","Sieving","Decantation"],
  a:0, why:"Dissolved ions pass straight through filter paper. Only a phase change separates the solvent from dissolved solutes." },

{ id:"a1-006", mod:"M1", topic:"Separation techniques", diff:3,
  q:"Paper chromatography separates pigments primarily according to:",
  choices:["Relative affinity for mobile and stationary phases","Density of each pigment relative to the running solvent","Boiling point of each pigment","Ionic charge on each pigment"],
  a:0, why:"A component held strongly by the paper moves slowly; one that partitions into the solvent moves further, giving a characteristic Rf." },

{ id:"a1-007", mod:"M1", topic:"Separation techniques", diff:3,
  q:"In chromatography, a substance with a high Rf value:",
  choices:["Has greater affinity for the mobile phase","Is more strongly adsorbed to the paper","Must have the largest molar mass","Is necessarily the most polar component"],
  a:0, why:"Rf is spot distance over solvent-front distance, so travelling far means the mobile phase is winning the competition for that component." },

{ id:"a1-008", mod:"M1", topic:"Elements and compounds", diff:1,
  q:"Which of these is a compound rather than a mixture?",
  choices:["Carbon dioxide","Atmospheric air","Brass","Seawater"],
  a:0, why:"A compound has elements chemically bonded in fixed proportions. Air, brass and seawater vary in composition and are separable by physical means." },

{ id:"a1-009", mod:"M1", topic:"Elements and compounds", diff:2,
  q:"The clearest evidence that a sample is a mixture rather than a compound is that:",
  choices:["Its components separate by physical means","It contains more than one kind of element atom","It can undergo chemical reactions","It has a measurable density"],
  a:0, why:"Compounds need chemical change to break apart. Physical separability is the operational test for a mixture." },

{ id:"a1-010", mod:"M1", topic:"Elements and compounds", diff:2,
  q:"A homogeneous mixture is best described as one in which:",
  choices:["Composition is uniform throughout","Only one element is present","Components are chemically bonded","Two phases are always visible"],
  a:0, why:"Solutions are homogeneous — every sampled portion has the same composition, even though the components are not bonded." },

{ id:"a1-011", mod:"M1", topic:"Elements and compounds", diff:3,
  q:"A pure substance melts sharply at one temperature, whereas a mixture typically:",
  choices:["Melts over a range of temperatures","Melts at a much higher temperature","Cannot be melted at all","Melts and boils simultaneously"],
  a:0, why:"Impurities disrupt the lattice unevenly, depressing and broadening the melting point — the basis of melting-point purity testing." },

/* ── atomic structure ────────────────────────────────────── */
{ id:"a1-012", mod:"M1", topic:"Atomic structure", diff:1,
  q:"The mass number of an atom equals:",
  choices:["Protons plus neutrons","Protons plus electrons","Neutrons minus protons","Protons only"],
  a:0, why:"Nucleons carry essentially all the mass; electrons are about 1/1836 the mass of a proton and are not counted." },

{ id:"a1-013", mod:"M1", topic:"Atomic structure", diff:1,
  q:"An atom of ³¹P has 15 protons. How many neutrons does it contain?",
  choices:["16","15","31","46"],
  a:0, why:"Neutrons = mass number − atomic number = 31 − 15 = 16." },

{ id:"a1-014", mod:"M1", topic:"Atomic structure", diff:2,
  q:"The ion ²⁷Al³⁺ contains:",
  choices:["13 protons, 14 neutrons, 10 electrons","13 protons, 14 neutrons, 13 electrons","10 protons, 17 neutrons, 10 electrons","13 protons, 27 neutrons, 16 electrons"],
  a:0, why:"Aluminium is element 13, so 27 − 13 = 14 neutrons. Losing three electrons from 13 leaves 10." },

{ id:"a1-015", mod:"M1", topic:"Atomic structure", diff:2,
  q:"Rutherford's gold-foil experiment was interpreted as showing that the atom has:",
  choices:["A small, dense, positively charged nucleus","A uniform positive sphere with embedded electrons","Electrons in fixed circular orbits only","No internal structure at all"],
  a:0, why:"Most alpha particles passed through undeflected, but a few reflected sharply — only a concentrated positive mass could produce that." },

{ id:"a1-016", mod:"M1", topic:"Atomic structure", diff:3,
  q:"Which observation from the gold-foil experiment most directly implied the nucleus is tiny?",
  choices:["The vast majority of particles passed straight through","A very small fraction were deflected almost straight back","Some particles were absorbed by the foil","The foil developed a measurable charge"],
  a:0, why:"Backscatter showed the nucleus is dense and positive; the overwhelming transmission showed it occupies almost none of the atom's volume." },

{ id:"a1-017", mod:"M1", topic:"Atomic structure", diff:3,
  q:"A key limitation of the Rutherford model was that it could not explain why:",
  choices:["Orbiting electrons do not spiral into the nucleus","Atoms have almost all their mass concentrated centrally","Alpha particles are deflected at all","Atoms are electrically neutral overall"],
  a:0, why:"Classical electrodynamics says an accelerating charge radiates energy, so the electron should lose energy and collapse inwards. Bohr's quantised orbits addressed this." },

/* ── isotopes ────────────────────────────────────────────── */
{ id:"a1-018", mod:"M1", topic:"Isotopes", diff:1,
  q:"Isotopes of the same element differ in:",
  choices:["Number of neutrons","Number of protons","Nuclear charge","Chemical symbol"],
  a:0, why:"Proton number defines the element. Varying the neutron count changes mass but leaves the electron configuration, and so the chemistry, essentially unchanged." },

{ id:"a1-019", mod:"M1", topic:"Isotopes", diff:2,
  q:"Chlorine's relative atomic mass of 35.5 is best explained by:",
  choices:["A weighted average of ³⁵Cl and ³⁷Cl abundances","Every chlorine atom having half a neutron","An experimental error in early measurements","Chlorine existing only as Cl₂ molecules"],
  a:0, why:"About 75% ³⁵Cl and 25% ³⁷Cl gives 0.75(35) + 0.25(37) ≈ 35.5. No individual atom has that mass." },

{ id:"a1-020", mod:"M1", topic:"Isotopes", diff:2,
  q:"An element has isotopes of mass 63 (69%) and 65 (31%). Its relative atomic mass is:",
  choices:["63.6","64.0","64.4","63.0"],
  a:0, why:"0.69(63) + 0.31(65) = 43.47 + 20.15 = 63.62." },

{ id:"a1-021", mod:"M1", topic:"Isotopes", diff:3,
  q:"Two isotopes of an element are chemically almost identical because they share the same:",
  choices:["Valence electron configuration","Number of neutrons held in the nucleus","Nuclear binding energy","Atomic mass"],
  a:0, why:"Chemical behaviour is governed by the outer electrons, which depend on proton number, not on neutron count." },

{ id:"a1-022", mod:"M1", topic:"Isotopes", diff:3,
  q:"A mass spectrum of a monatomic element shows peaks at m/z 24, 25 and 26 with relative heights 79 : 10 : 11. The relative atomic mass is closest to:",
  choices:["24.3","24.9","25.0","25.7"],
  a:0, why:"(79×24 + 10×25 + 11×26) / 100 = (1896 + 250 + 286)/100 = 24.32." },

/* ── emission spectra and electron configuration ─────────── */
{ id:"a1-023", mod:"M1", topic:"Emission spectra", diff:2,
  q:"A line emission spectrum arises when electrons:",
  choices:["Fall from higher to lower energy levels","Are removed from the atom entirely by heating","Move within a single energy level","Are shared between two nuclei"],
  a:0, why:"The photon carries exactly the energy gap between levels, and because gaps are quantised the emitted wavelengths are discrete lines." },

{ id:"a1-024", mod:"M1", topic:"Emission spectra", diff:2,
  q:"Emission spectra are described as an atomic 'fingerprint' because:",
  choices:["Each element has a unique set of energy gaps","All elements emit exactly the same set of wavelengths","The spectrum depends on sample mass","Only metals produce spectral lines"],
  a:0, why:"Energy-level spacings depend on nuclear charge and electron count, so the pattern of lines identifies the element uniquely." },

{ id:"a1-025", mod:"M1", topic:"Emission spectra", diff:3,
  q:"A transition emitting blue light rather than red corresponds to:",
  choices:["A larger energy gap between levels","A smaller energy gap between levels","A longer photon wavelength","A lower photon frequency"],
  a:0, why:"E = hf and blue light has higher frequency, so a bluer photon means a bigger drop in energy." },

{ id:"a1-026", mod:"M1", topic:"Electron configuration", diff:1,
  q:"The electron configuration of a neutral sulfur atom (Z = 16) is:",
  choices:["1s² 2s² 2p⁶ 3s² 3p⁴","1s² 2s² 2p⁶ 3s² 3p⁶","1s² 2s² 2p⁶ 3s¹ 3p⁵","1s² 2s² 2p⁴ 3s² 3p⁶"],
  a:0, why:"Sixteen electrons fill 1s, 2s, 2p and 3s (12 total), leaving four for the 3p subshell." },

{ id:"a1-027", mod:"M1", topic:"Electron configuration", diff:2,
  q:"The configuration of the Ca²⁺ ion is the same as that of:",
  choices:["Argon","Calcium","Potassium","Scandium"],
  a:0, why:"Calcium loses its two 4s electrons, leaving 18 electrons — the argon configuration. That stability is why the 2+ ion forms." },

{ id:"a1-028", mod:"M1", topic:"Electron configuration", diff:3,
  q:"Chromium adopts 3d⁵ 4s¹ rather than 3d⁴ 4s² because:",
  choices:["A half-filled d subshell is unusually stable","The 4s orbital is higher in energy than 3d","Chromium is not a transition metal","Electrons always fill d before s"],
  a:0, why:"Exchange energy in a half-filled set of parallel-spin d electrons outweighs the cost of promoting one 4s electron." },

{ id:"a1-029", mod:"M1", topic:"Electron configuration", diff:3,
  q:"Which species is NOT isoelectronic with neon?",
  choices:["Mg","N³⁻","F⁻","Na⁺"],
  a:0, why:"Neutral magnesium has 12 electrons. Mg²⁺ would be isoelectronic with neon, but the neutral atom is not." },

/* ── periodic trends ─────────────────────────────────────── */
{ id:"a1-030", mod:"M1", topic:"Periodic trends", diff:1,
  q:"Moving left to right across a period, atomic radius generally:",
  choices:["Decreases","Increases","Stays constant","Increases then decreases"],
  a:0, why:"Nuclear charge rises while electrons enter the same shell, so the increased attraction pulls the outer electrons inward." },

{ id:"a1-031", mod:"M1", topic:"Periodic trends", diff:1,
  q:"Down a group, first ionisation energy generally:",
  choices:["Decreases","Increases","Remains unchanged","Peaks in the middle"],
  a:0, why:"The outer electron sits in a shell further from the nucleus and is better shielded, so less energy is needed to remove it." },

{ id:"a1-032", mod:"M1", topic:"Periodic trends", diff:2,
  q:"Which atom has the largest first ionisation energy?",
  choices:["Neon","Sodium","Lithium","Fluorine"],
  a:0, why:"Ionisation energy rises across a period and peaks at the noble gas, whose full shell is hardest to disturb." },

{ id:"a1-033", mod:"M1", topic:"Periodic trends", diff:2,
  q:"Electronegativity is best described as an atom's tendency to:",
  choices:["Attract a shared electron pair in a bond","Lose electrons readily to form a stable cation","Emit light when heated strongly","Conduct electricity in solution"],
  a:0, why:"It is a bonding property, defined for atoms within a covalent bond, and it drives bond polarity." },

{ id:"a1-034", mod:"M1", topic:"Periodic trends", diff:2,
  q:"Which sequence lists the atoms in order of increasing atomic radius?",
  choices:["F < O < N < Be","Be < N < O < F","N < O < F < Be","O < F < Be < N"],
  a:0, why:"All are period 2, so radius decreases across the period: Be is largest and F smallest, giving F < O < N < Be." },

{ id:"a1-035", mod:"M1", topic:"Periodic trends", diff:3,
  q:"The first ionisation energy of aluminium is lower than that of magnesium because:",
  choices:["Aluminium's outer electron is in a higher-energy 3p orbital","Aluminium has a smaller effective nuclear charge than magnesium","Magnesium has more shielding electrons","Aluminium has a full outer shell"],
  a:0, why:"Magnesium loses a 3s electron; aluminium loses a 3p electron, which is higher in energy and more shielded, so it comes off more easily despite greater nuclear charge." },

{ id:"a1-036", mod:"M1", topic:"Periodic trends", diff:3,
  q:"Sulfur has a slightly lower first ionisation energy than phosphorus because:",
  choices:["Paired 3p electrons in sulfur repel one another","Sulfur has a smaller nuclear charge","Phosphorus has a full 3p subshell","Sulfur's outer electrons are closer to the nucleus"],
  a:0, why:"Phosphorus is 3p³ (half-filled, all unpaired). Sulfur's fourth 3p electron must pair up, and that pairing repulsion makes it easier to remove." },

{ id:"a1-037", mod:"M1", topic:"Periodic trends", diff:3,
  q:"A cation is always smaller than its parent atom mainly because:",
  choices:["Remaining electrons feel greater effective nuclear charge","The nucleus loses protons during ionisation","Neutrons are ejected along with electrons","Electron shells physically compress under external pressure"],
  a:0, why:"Fewer electrons share the same nuclear charge, and often an entire outer shell is lost, so the remaining cloud contracts sharply." },

/* ── bonding ─────────────────────────────────────────────── */
{ id:"a1-038", mod:"M1", topic:"Bonding", diff:1,
  q:"Ionic bonding is best described as:",
  choices:["Electrostatic attraction between oppositely charged ions","A shared pair of electrons between two atoms","Delocalised electrons moving freely throughout a rigid lattice","Weak attraction between temporary dipoles"],
  a:0, why:"Electrons transfer from metal to non-metal, and the resulting cations and anions are held in a lattice by Coulombic attraction." },

{ id:"a1-039", mod:"M1", topic:"Bonding", diff:1,
  q:"Metallic bonding involves:",
  choices:["Cations in a sea of delocalised electrons","Ions held in a fixed alternating lattice","Discrete molecules with shared pairs","Permanent dipoles aligning head to tail"],
  a:0, why:"Mobile delocalised electrons explain metals' conductivity, malleability and lustre in one model." },

{ id:"a1-040", mod:"M1", topic:"Bonding", diff:2,
  q:"Ionic compounds conduct electricity when molten but not when solid because:",
  choices:["Ions become mobile only in the liquid state","Electrons are released from the lattice on melting","Covalent bonds break during melting","The compound decomposes into metals"],
  a:0, why:"Conduction requires mobile charge carriers. In the solid lattice the ions are fixed in place; melting frees them to migrate." },

{ id:"a1-041", mod:"M1", topic:"Bonding", diff:2,
  q:"Which compound is most likely to be ionic?",
  choices:["Potassium chloride","Carbon dioxide","Methane","Phosphorus trichloride"],
  a:0, why:"A large electronegativity difference between a group 1 metal and a halogen favours electron transfer rather than sharing." },

{ id:"a1-042", mod:"M1", topic:"Bonding", diff:2,
  q:"Covalent network solids such as diamond have very high melting points because:",
  choices:["Strong covalent bonds extend through the whole structure","Delocalised electrons hold the whole rigid lattice together","Ionic attractions act between the layers","Hydrogen bonding links adjacent molecules"],
  a:0, why:"Melting requires breaking covalent bonds throughout a continuous three-dimensional network, not merely separating discrete molecules." },

{ id:"a1-043", mod:"M1", topic:"Bonding", diff:3,
  q:"Silicon dioxide has a far higher melting point than carbon dioxide because:",
  choices:["SiO₂ is a covalent network while CO₂ is molecular","Si–O bonds are ionic and C=O bonds are covalent","CO₂ has stronger dispersion forces than SiO₂","SiO₂ contains hydrogen bonds between units"],
  a:0, why:"Melting CO₂ only overcomes weak dispersion forces between small molecules; melting SiO₂ breaks a continuous network of strong Si–O bonds." },

{ id:"a1-044", mod:"M1", topic:"Bonding", diff:3,
  q:"Which best explains why graphite conducts electricity but diamond does not?",
  choices:["Graphite has delocalised electrons between its layers","Graphite contains free metal cations","Diamond's valence electrons are ionised far more easily","Diamond has a lower density than graphite"],
  a:0, why:"Each graphite carbon bonds to three others, leaving one electron per atom delocalised. In diamond all four valence electrons are localised in σ bonds." },

{ id:"a1-045", mod:"M1", topic:"Bonding", diff:3,
  q:"Lattice energy of an ionic solid increases most when:",
  choices:["Ionic charges increase and ionic radii decrease","Ionic charges decrease and radii increase","Only the number of ions in the formula increases","The melting point of the metal increases"],
  a:0, why:"Coulomb's law makes lattice energy proportional to the product of charges over the separation, so MgO greatly exceeds NaCl." },

/* ── intermolecular forces and polarity ──────────────────── */
{ id:"a1-046", mod:"M1", topic:"Polarity", diff:1,
  q:"A bond is polar when the two bonded atoms differ in:",
  choices:["Electronegativity","Atomic mass","Neutron number","Physical state"],
  a:0, why:"Unequal sharing pulls electron density towards the more electronegative atom, creating partial charges δ+ and δ−." },

{ id:"a1-047", mod:"M1", topic:"Polarity", diff:2,
  q:"Carbon dioxide is non-polar overall despite having polar bonds because:",
  choices:["Its linear shape cancels the bond dipoles","Carbon and oxygen have equal electronegativity","The molecule contains no lone pairs","It exists as a gas at room temperature"],
  a:0, why:"The two C=O dipoles are equal and point in opposite directions along a straight line, so the vector sum is zero." },

{ id:"a1-048", mod:"M1", topic:"Polarity", diff:2,
  q:"Which molecule is polar?",
  choices:["NH₃","CH₄","CO₂","BF₃"],
  a:0, why:"Ammonia is trigonal pyramidal with a lone pair, so its bond dipoles do not cancel. The other three are symmetrical." },

{ id:"a1-049", mod:"M1", topic:"Polarity", diff:3,
  q:"Both CCl₄ and CHCl₃ contain polar C–Cl bonds, yet only CHCl₃ is polar. This is because:",
  choices:["CCl₄ is tetrahedrally symmetrical so its dipoles cancel","C–H bonds are considerably more polar than any C–Cl bond is","CCl₄ contains a lone pair on carbon","CHCl₃ has a larger molar mass"],
  a:0, why:"Replacing one chlorine with hydrogen destroys the symmetry, so the dipoles no longer sum to zero." },

{ id:"a1-050", mod:"M1", topic:"Intermolecular forces", diff:1,
  q:"The weakest of the following intermolecular forces is:",
  choices:["Dispersion forces","Dipole–dipole forces","Hydrogen bonding","Ion–dipole forces"],
  a:0, why:"Dispersion arises from instantaneous, temporary dipoles, so it is weakest per interaction — though it grows large in big molecules." },

{ id:"a1-051", mod:"M1", topic:"Intermolecular forces", diff:2,
  q:"Hydrogen bonding occurs when hydrogen is bonded directly to:",
  choices:["Nitrogen, oxygen or fluorine","Carbon, silicon or sulfur","Any halogen atom","Any element in period 3"],
  a:0, why:"Only N, O and F are electronegative and small enough to leave the hydrogen nucleus sufficiently exposed to a neighbouring lone pair." },

{ id:"a1-052", mod:"M1", topic:"Intermolecular forces", diff:2,
  q:"Boiling points increase down the alkane series mainly because:",
  choices:["Dispersion forces strengthen with more electrons","Molecules become progressively more polar up the series","Hydrogen bonding progressively develops","Covalent bonds become harder to break"],
  a:0, why:"Larger, more polarisable electron clouds give stronger instantaneous dipoles. The covalent bonds are not broken during boiling at all." },

{ id:"a1-053", mod:"M1", topic:"Intermolecular forces", diff:3,
  q:"Water's boiling point is anomalously high compared with H₂S because water:",
  choices:["Forms extensive hydrogen bonds","Has a greater molar mass","Is a larger molecule overall","Has stronger covalent O–H bonds"],
  a:0, why:"Sulfur is not electronegative enough for hydrogen bonding, so H₂S relies on weaker dipole–dipole forces despite being heavier." },

{ id:"a1-054", mod:"M1", topic:"Intermolecular forces", diff:3,
  q:"Ice is less dense than liquid water because hydrogen bonding:",
  choices:["Holds molecules in an open tetrahedral lattice","Pulls molecules closer together on freezing","Is destroyed completely in the solid state","Converts to covalent bonding at 0 °C"],
  a:0, why:"Each molecule hydrogen bonds to four others at fixed angles, creating hexagonal channels of empty space that liquid water does not maintain." },

{ id:"a1-055", mod:"M1", topic:"Intermolecular forces", diff:3,
  q:"Butane and propan-1-ol have similar molar masses, but the alcohol boils far higher because:",
  choices:["The –OH group allows hydrogen bonding","The alcohol has more electrons overall","Butane's chain is branched and compact","The alcohol contains an ionic bond"],
  a:0, why:"Hydrogen bonding between hydroxyl groups is far stronger than the dispersion forces available to butane." },

{ id:"a1-056", mod:"M1", topic:"Intermolecular forces", diff:3,
  q:"Which pair correctly matches a substance with its strongest intermolecular force?",
  choices:["HCl — dipole–dipole","CH₄ — hydrogen bonding","NaCl — dispersion forces","H₂O — dipole–dipole"],
  a:0, why:"HCl is polar but its hydrogen is not bonded to N, O or F. Methane is non-polar, water hydrogen bonds, and NaCl is ionic rather than molecular." },

/* ── allotropes and structure ────────────────────────────── */
{ id:"a1-057", mod:"M1", topic:"Allotropes", diff:1,
  q:"Allotropes are different:",
  choices:["Structural forms of the same element","Isotopes of the same element","Compounds of the same two elements","Ions carrying the same charge"],
  a:0, why:"Diamond, graphite and fullerenes are all pure carbon, differing only in how the atoms are bonded and arranged." },

{ id:"a1-058", mod:"M1", topic:"Allotropes", diff:2,
  q:"Graphite is soft and slippery because:",
  choices:["Weak dispersion forces allow layers to slide","Its covalent bonds are unusually weak and rather long","It contains mobile metal cations","Hydrogen bonds link adjacent sheets"],
  a:0, why:"Within a layer the covalent bonding is very strong; between layers only dispersion forces operate, so sheets shear easily." },

{ id:"a1-059", mod:"M1", topic:"Allotropes", diff:3,
  q:"Diamond is an excellent thermal conductor yet an electrical insulator because:",
  choices:["Vibrations travel readily but no charges are mobile","Its electrons move freely between the covalent layers","It contains ions that migrate when heated","Its covalent bonds break easily on heating"],
  a:0, why:"A stiff, light, highly ordered covalent lattice transmits lattice vibrations efficiently, but every valence electron is localised in a bond." },

{ id:"a1-060", mod:"M1", topic:"Structure and properties", diff:2,
  q:"A solid that is hard, brittle and conducts only when dissolved is most likely:",
  choices:["Ionic","Metallic","Covalent molecular","Covalent network"],
  a:0, why:"Brittleness comes from like-charged ions being forced together when layers shift; conduction on dissolving indicates mobile ions." },

{ id:"a1-061", mod:"M1", topic:"Structure and properties", diff:2,
  q:"A substance with a very low melting point that does not conduct in any state is most likely:",
  choices:["Covalent molecular","Ionic","Metallic","Covalent network"],
  a:0, why:"Weak intermolecular forces melt easily, and neutral molecules provide no mobile charge carriers in any state." },

{ id:"a1-062", mod:"M1", topic:"Structure and properties", diff:3,
  q:"Metals are malleable rather than brittle because:",
  choices:["Layers of cations slide while delocalised electrons adapt","Their directional covalent bonds are free to rotate in place","Ionic repulsion prevents layers from moving","They contain no bonding electrons at all"],
  a:0, why:"The electron sea is non-directional, so displacing a layer does not create the like-charge contact that shatters an ionic lattice." },

{ id:"a1-063", mod:"M1", topic:"Structure and properties", diff:3,
  q:"Alloys are typically harder than the pure parent metal because:",
  choices:["Differently sized atoms disrupt layer sliding","The delocalised electrons become localised","Ionic bonds form between the two metals","The metallic lattice becomes fully covalent"],
  a:0, why:"Irregular atomic sizes obstruct the planes along which the lattice would otherwise slip, so the alloy resists deformation." },

/* ── shapes ──────────────────────────────────────────────── */
{ id:"a1-064", mod:"M1", topic:"Molecular shape", diff:2,
  q:"According to VSEPR, the shape of a molecule with four bonding pairs and no lone pairs is:",
  choices:["Tetrahedral","Trigonal planar","Bent","Trigonal pyramidal"],
  a:0, why:"Four electron domains repel to the maximum separation of 109.5°, giving a tetrahedron." },

{ id:"a1-065", mod:"M1", topic:"Molecular shape", diff:2,
  q:"Water is bent rather than linear because:",
  choices:["Two lone pairs on oxygen repel the bonding pairs","Oxygen forms two strong double bonds to the hydrogens","Hydrogen atoms repel one another strongly","The molecule contains a coordinate bond"],
  a:0, why:"Four electron domains give a tetrahedral arrangement, but only two are bonds — so the observed shape is bent, at about 104.5°." },

{ id:"a1-066", mod:"M1", topic:"Molecular shape", diff:3,
  q:"The bond angle in ammonia (107°) is smaller than in methane (109.5°) because:",
  choices:["Lone pair–bond pair repulsion exceeds bond pair–bond pair","Nitrogen is considerably more electronegative than carbon is","Ammonia contains one fewer atom","N–H bonds are shorter than C–H bonds"],
  a:0, why:"A lone pair is held closer to the nucleus and occupies more angular space, compressing the remaining bond angles." },

{ id:"a1-067", mod:"M1", topic:"Molecular shape", diff:3,
  q:"Which molecule has a trigonal planar shape?",
  choices:["BF₃","NH₃","H₂O","PCl₃"],
  a:0, why:"Boron in BF₃ has only three electron domains and no lone pair, so the fluorines lie at 120° in one plane." },

/* ── nomenclature and formulae ───────────────────────────── */
{ id:"a1-068", mod:"M1", topic:"Formulae and naming", diff:1,
  q:"The formula of magnesium nitrate is:",
  choices:["Mg(NO₃)₂","MgNO₃","Mg₂NO₃","Mg(NO₂)₂"],
  a:0, why:"Mg²⁺ needs two NO₃⁻ ions to balance charge, and the bracket shows the whole polyatomic ion is doubled." },

{ id:"a1-069", mod:"M1", topic:"Formulae and naming", diff:2,
  q:"The correct name for FeSO₄ is:",
  choices:["Iron(II) sulfate","Iron(III) sulfate","Iron(II) sulfite","Iron sulfide"],
  a:0, why:"Sulfate is SO₄²⁻, so a single iron must be 2+. Roman numerals are required because iron has more than one common oxidation state." },

{ id:"a1-070", mod:"M1", topic:"Formulae and naming", diff:2,
  q:"The formula of aluminium sulfate is:",
  choices:["Al₂(SO₄)₃","AlSO₄","Al₃(SO₄)₂","Al(SO₄)₃"],
  a:0, why:"Balancing 3+ against 2− requires two aluminium ions and three sulfate ions for a neutral formula unit." },

{ id:"a1-071", mod:"M1", topic:"Formulae and naming", diff:3,
  q:"Which formula is written incorrectly for the compound named?",
  choices:["Ammonium phosphate, NH₄PO₄","Sodium carbonate, Na₂CO₃","Calcium hydroxide, Ca(OH)₂","Potassium dichromate, K₂Cr₂O₇"],
  a:0, why:"Phosphate is PO₄³⁻, so three ammonium ions are needed: (NH₄)₃PO₄. The other three balance correctly." },

/* ── practical and measurement ───────────────────────────── */
{ id:"a1-072", mod:"M1", topic:"Practical skills", diff:2,
  q:"A student reports a mass as 12.3450 g using a balance reading to ±0.01 g. The main problem is:",
  choices:["Quoting more significant figures than the instrument supports","Using grams rather than kilograms","Recording a mass that is far too small for this balance to detect","Failing to convert to moles"],
  a:0, why:"Precision claimed must match instrument resolution; the balance can only justify 12.35 g." },

{ id:"a1-073", mod:"M1", topic:"Practical skills", diff:3,
  q:"Repeated measurements clustered tightly but far from the true value indicate:",
  choices:["High precision and low accuracy","High accuracy and low precision","Both high accuracy and high precision","A purely random error"],
  a:0, why:"Tight clustering is precision; being consistently off-target indicates a systematic error such as an uncalibrated instrument." },

{ id:"a1-074", mod:"M1", topic:"Practical skills", diff:3,
  q:"Which is a systematic rather than a random error?",
  choices:["A balance that reads 0.05 g high every time","Slight variation in reading a meniscus","Small draughts affecting the balance","Inconsistent timing by the experimenter"],
  a:0, why:"A systematic error shifts every reading in the same direction by a similar amount, so averaging more trials will not remove it." },

/* ── synthesis-style reasoning ───────────────────────────── */
{ id:"a1-075", mod:"M1", topic:"Structure and properties", diff:3,
  q:"A colourless solid melts at 801 °C, dissolves readily in water and the solution conducts strongly. It is most likely:",
  choices:["An ionic compound","A covalent network solid","A molecular solid","A pure metal"],
  a:0, why:"High melting point with conduction only after dissolving is the signature of an ionic lattice releasing mobile ions." },

{ id:"a1-076", mod:"M1", topic:"Structure and properties", diff:3,
  q:"A shiny solid conducts electricity as a solid and can be drawn into wire. Its bonding is:",
  choices:["Metallic","Ionic","Covalent network","Covalent molecular"],
  a:0, why:"Conduction in the solid state without melting points to delocalised electrons, and ductility confirms non-directional bonding." },

{ id:"a1-077", mod:"M1", topic:"Periodic trends", diff:2,
  q:"Which element is most reactive towards water?",
  choices:["Potassium","Sodium","Lithium","Magnesium"],
  a:0, why:"Reactivity of group 1 increases down the group as ionisation energy falls, so potassium loses its outer electron most readily of these." },

{ id:"a1-078", mod:"M1", topic:"Periodic trends", diff:3,
  q:"Across period 3 from sodium to chlorine, the oxides change from:",
  choices:["Basic through amphoteric to acidic","Acidic through neutral to basic","Neutral through acidic to basic","Amphoteric through basic to neutral"],
  a:0, why:"Metal oxides such as Na₂O are basic, Al₂O₃ is amphoteric, and non-metal oxides such as SO₃ and Cl₂O form acids in water." },

{ id:"a1-079", mod:"M1", topic:"Bonding", diff:3,
  q:"Which best explains why MgO has a much higher melting point than NaCl?",
  choices:["Mg²⁺ and O²⁻ carry double charges","Mg²⁺ is larger than Na⁺","MgO contains covalent character only","NaCl has a more complex lattice"],
  a:0, why:"Lattice energy scales with the product of the ionic charges, so 2+/2− attraction is roughly four times that of 1+/1− at similar separation." },

{ id:"a1-080", mod:"M1", topic:"Intermolecular forces", diff:2,
  q:"Iodine sublimes readily at low temperature because:",
  choices:["Only weak dispersion forces hold I₂ molecules together","The I–I covalent bond is unusually weak and easily broken","Iodine forms hydrogen bonds with itself","Iodine exists as separate ions in the solid"],
  a:0, why:"The strong covalent bond within I₂ is untouched by sublimation; only the weak forces between molecules must be overcome." }

];
