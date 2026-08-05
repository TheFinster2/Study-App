/* Course coverage — content a school may not have taught yet.
   Each pack can be switched off in Settings → Course coverage.

   Nothing here changes how anything is scored: turning a topic off shrinks what you
   are asked, it never makes what remains pay more, and it never lowers an achievement
   target. Otherwise switching topics off would be the cheapest way to finish a
   collection, which is the same mistake as a per-item score floor.

   A pack can claim content four ways:
     mods    whole modules
     topics  question `topic` strings — must match exactly, and the validator checks it
     cards   flashcard ids — listed rather than pattern-matched, because "saponification"
             appears in the answer to a general ester-hydrolysis card that is core content
     naming  families in the Name That Compound bank
   The Pathway Puzzle graph uses a `tag` on the node/reagent instead, so a hidden
   compound disappears from the reaction network rather than just from the puzzle list. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.coverage = [
  {
    id: "year11", name: "Year 11 modules (1–4)", mod: "M1–M4",
    desc: "Everything from the preliminary course. Switch off to revise only the HSC modules.",
    mods: ["M1", "M2", "M3", "M4"]
  },

  /* ── Module 5 ── */
  {
    id: "oceanacid", name: "Ocean acidification", mod: "M5",
    desc: "The carbonate equilibrium in seawater and its effect on coral. A context topic some courses skip.",
    topics: ["Ocean acidification"],
    cards: ["f5-10"]
  },

  /* ── Module 6 ── */
  {
    id: "buffers", name: "Buffers", mod: "M6",
    desc: "Buffer systems, capacity and the Henderson–Hasselbalch relationship. Often the last part of the acids module.",
    topics: ["Buffers"],
    cards: ["f6-11", "h6-18", "h6-19", "h6-20"]
  },

  /* ── Module 7 ── */
  {
    id: "polymers", name: "Polymers and polyesters", mod: "M7",
    desc: "Addition polymerisation (polyethene, polypropene) and condensation polymerisation (PET). " +
          "Usually the last thing covered in the organic module.",
    topics: ["Polymers", "Addition polymers", "Condensation polymers"],
    cards: ["f7-11", "h7-20", "h7-21"]
  },
  {
    id: "soaps", name: "Soaps and detergents", mod: "M7",
    desc: "Saponification, micelles, and why soap fails in hard water.",
    topics: ["Soaps and detergents", "Saponification"],
    cards: ["f7-09", "f7-10", "h7-18", "h7-19"]
  },
  {
    id: "biofuels", name: "Biofuels and fermentation", mod: "M7",
    desc: "Fermentation to bioethanol, biodiesel, and whether either is really carbon neutral.",
    topics: ["Biofuels", "Fermentation"],
    cards: ["f7-13", "h7-24", "h7-25", "h7-26"]
  },
  {
    id: "aminesamides", name: "Amines and amides", mod: "M7",
    desc: "The nitrogen functional groups — naming, basicity, and the amide linkage.",
    topics: ["Amines and amides"],
    cards: ["f7-14"],
    naming: ["Amine", "Amide"]
  },

  /* ── Module 8 ── */
  {
    id: "nmr", name: "NMR spectroscopy", mod: "M8",
    desc: "¹H and ¹³C NMR — shifts, integration and splitting. Very commonly the final topic of the course.",
    topics: ["¹H NMR", "¹³C NMR"],
    cards: ["f8-11", "f8-12", "h8-17", "h8-18", "h8-19", "h8-20", "h8-21"]
  },
  {
    id: "msir", name: "Mass spectrometry and infrared", mod: "M8",
    desc: "Molecular ion peaks, isotope patterns, and reading an IR spectrum for functional groups.",
    topics: ["Mass spectrometry", "Infrared spectroscopy"],
    cards: ["f8-09", "h8-12", "h8-13"]
  },
  {
    id: "aas", name: "AAS and colorimetry", mod: "M8",
    desc: "Atomic absorption spectroscopy, colorimetry and Beer–Lambert calibration curves.",
    topics: ["AAS", "Colorimetry"],
    cards: ["f8-07", "f8-08", "h8-09", "h8-10", "h8-11"]
  },
  {
    id: "orgsynth", name: "Organic analysis and synthesis", mod: "M8",
    desc: "Identifying an unknown compound by combining techniques, and planning a synthesis route.",
    topics: ["Organic analysis", "Chemical synthesis"],
    cards: ["h8-30"]
  }
];
