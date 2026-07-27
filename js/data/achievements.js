/* Achievements. Each `check` receives the live stats object and returns a boolean.
   `goal` (optional) drives the progress bar shown on the Achievements screen. */
window.CHEM = window.CHEM || {};
CHEM.DATA = CHEM.DATA || {};

CHEM.DATA.achievements = [
  { id:"first_steps", icon:"👣", name:"First Steps", reward:25,
    desc:"Answer your very first question.",
    check:s => s.answered >= 1, goal:s => [Math.min(s.answered,1), 1] },

  { id:"century", icon:"💯", name:"Century", reward:100,
    desc:"Answer 100 questions.",
    check:s => s.answered >= 100, goal:s => [Math.min(s.answered,100), 100] },

  { id:"half_k", icon:"🏛️", name:"Five Hundred Club", reward:300,
    desc:"Answer 500 questions.",
    check:s => s.answered >= 500, goal:s => [Math.min(s.answered,500), 500] },

  { id:"sharp", icon:"🎯", name:"Sharpshooter", reward:120,
    desc:"Reach 80% accuracy over at least 50 questions.",
    check:s => s.answered >= 50 && s.correct / s.answered >= 0.8 },

  { id:"surgeon", icon:"🩺", name:"Surgical Precision", reward:350,
    desc:"Reach 90% accuracy over at least 200 questions.",
    check:s => s.answered >= 200 && s.correct / s.answered >= 0.9 },

  { id:"streak10", icon:"⚡", name:"Chain Reaction", reward:80,
    desc:"Hit a 10-answer streak in a single run.",
    check:s => s.bestStreak >= 10, goal:s => [Math.min(s.bestStreak,10), 10] },

  { id:"streak25", icon:"🌋", name:"Runaway Reaction", reward:250,
    desc:"Hit a 25-answer streak in a single run.",
    check:s => s.bestStreak >= 25, goal:s => [Math.min(s.bestStreak,25), 25] },

  { id:"perfect", icon:"✨", name:"Analytically Pure", reward:150,
    desc:"Finish any run with 100% correct.",
    check:s => s.perfectRuns >= 1 },

  { id:"perfect5", icon:"🔮", name:"Five Nines", reward:400,
    desc:"Finish 5 perfect runs.",
    check:s => s.perfectRuns >= 5, goal:s => [Math.min(s.perfectRuns,5), 5] },

  { id:"daily3", icon:"📅", name:"Consistent", reward:100,
    desc:"Study 3 days in a row.",
    check:s => s.longestDayStreak >= 3, goal:s => [Math.min(s.longestDayStreak,3), 3] },

  { id:"daily7", icon:"🔥", name:"Week of Reflux", reward:250,
    desc:"Study 7 days in a row.",
    check:s => s.longestDayStreak >= 7, goal:s => [Math.min(s.longestDayStreak,7), 7] },

  { id:"daily30", icon:"🏆", name:"Thirty Day Titration", reward:1000,
    desc:"Study 30 days in a row.",
    check:s => s.longestDayStreak >= 30, goal:s => [Math.min(s.longestDayStreak,30), 30] },

  { id:"balance10", icon:"⚖️", name:"Conservation of Mass", reward:90,
    desc:"Balance 10 equations.",
    check:s => s.equationsBalanced >= 10, goal:s => [Math.min(s.equationsBalanced,10), 10] },

  { id:"balance50", icon:"🧮", name:"Stoichiometrist", reward:300,
    desc:"Balance 50 equations.",
    check:s => s.equationsBalanced >= 50, goal:s => [Math.min(s.equationsBalanced,50), 50] },

  { id:"ions20", icon:"🧩", name:"Ion Recall", reward:90,
    desc:"Match 20 ion pairs in Ion Memory.",
    check:s => s.ionsMatched >= 20, goal:s => [Math.min(s.ionsMatched,20), 20] },

  { id:"ions100", icon:"🗂️", name:"Polyatomic Prodigy", reward:300,
    desc:"Match 100 ion pairs.",
    check:s => s.ionsMatched >= 100, goal:s => [Math.min(s.ionsMatched,100), 100] },

  { id:"titrate5", icon:"🧫", name:"Steady Hand", reward:120,
    desc:"Complete 5 titrations within tolerance.",
    check:s => s.titrations >= 5, goal:s => [Math.min(s.titrations,5), 5] },

  { id:"titrate_perfect", icon:"💧", name:"One Drop", reward:250,
    desc:"Land a titration end point on the exact drop.",
    check:s => s.perfectTitrations >= 1 },

  { id:"path5", icon:"🔗", name:"Synthetic Route", reward:120,
    desc:"Solve 5 pathway puzzles.",
    check:s => s.pathways >= 5, goal:s => [Math.min(s.pathways,5), 5] },

  { id:"path_all", icon:"🗺️", name:"Total Synthesis", reward:400,
    desc:"Solve every pathway puzzle at least once.",
    check:s => s.pathwaysSolvedUnique >= (CHEM.DATA.pathwayPuzzles || []).length,
    goal:s => [s.pathwaysSolvedUnique, (CHEM.DATA.pathwayPuzzles || []).length] },

  { id:"name25", icon:"🏷️", name:"Nomenclature Nerd", reward:150,
    desc:"Correctly name 25 compounds.",
    check:s => s.namingCorrect >= 25, goal:s => [Math.min(s.namingCorrect,25), 25] },

  { id:"calc25", icon:"🔢", name:"Number Cruncher", reward:150,
    desc:"Solve 25 calculation problems.",
    check:s => s.calcsCorrect >= 25, goal:s => [Math.min(s.calcsCorrect,25), 25] },

  { id:"ppt_clean", icon:"🌧️", name:"Solubility Savant", reward:200,
    desc:"Clear a Precipitation Panic board with no mistakes.",
    check:s => s.perfectPrecipitation >= 1 },

  { id:"boss1", icon:"⚔️", name:"Giant Slayer", reward:200,
    desc:"Defeat your first Exam Boss.",
    check:s => s.bossWins >= 1 },

  { id:"boss_all", icon:"👹", name:"Boss Rush", reward:600,
    desc:"Defeat all five Exam Bosses.",
    check:s => s.bossesBeaten >= 5, goal:s => [Math.min(s.bossesBeaten,5), 5] },

  { id:"boss_flawless", icon:"🛡️", name:"Untouchable", reward:500,
    desc:"Defeat an Exam Boss without losing any health.",
    check:s => s.flawlessBoss >= 1 },

  { id:"cards25", icon:"🃏", name:"Card Shark", reward:150,
    desc:"Master 25 flashcards (reach box 5).",
    check:s => s.cardsMastered >= 25, goal:s => [Math.min(s.cardsMastered,25), 25] },

  { id:"cards_all", icon:"📚", name:"Deck Complete", reward:800,
    desc:"Master every flashcard in the deck.",
    check:s => s.cardsMastered >= (CHEM.DATA.flashcards || []).length,
    goal:s => [s.cardsMastered, (CHEM.DATA.flashcards || []).length] },

  { id:"lvl5", icon:"🥉", name:"Getting Serious", reward:100,
    desc:"Reach level 5.",
    check:s => s.level >= 5, goal:s => [Math.min(s.level,5), 5] },

  { id:"lvl10", icon:"🥈", name:"Double Digits", reward:300,
    desc:"Reach level 10.",
    check:s => s.level >= 10, goal:s => [Math.min(s.level,10), 10] },

  { id:"lvl20", icon:"🥇", name:"MoleQuest Legend", reward:1200,
    desc:"Reach level 20.",
    check:s => s.level >= 20, goal:s => [Math.min(s.level,20), 20] },

  { id:"module_master", icon:"🎓", name:"Module Master", reward:400,
    desc:"Reach 85% mastery in any one module.",
    check:s => Object.values(s.modules || {}).some(m => m.seen >= 20 && m.correct / m.seen >= 0.85) },

  { id:"all_modules", icon:"🧭", name:"Full Syllabus Sweep", reward:700,
    desc:"Answer at least 20 questions in every Year 12 module.",
    check:s => ["M5","M6","M7","M8"].every(k => (s.modules?.[k]?.seen || 0) >= 20),
    goal:s => [["M5","M6","M7","M8"].filter(k => (s.modules?.[k]?.seen || 0) >= 20).length, 4] },

  { id:"variety", icon:"🎲", name:"Jack of All Trades", reward:250,
    desc:"Play every game mode at least once.",
    check:s => Object.keys(s.modesPlayed || {}).length >= 8,
    goal:s => [Object.keys(s.modesPlayed || {}).length, 8] },

  { id:"rich", icon:"💰", name:"Well Funded", reward:0,
    desc:"Hold 2000 Moles at once.",
    check:s => s.peakCoins >= 2000, goal:s => [Math.min(s.peakCoins,2000), 2000] },

  { id:"stylist", icon:"🎨", name:"Interior Designer", reward:200,
    desc:"Unlock 3 lab skins.",
    check:s => s.themesOwned >= 3, goal:s => [Math.min(s.themesOwned,3), 3] },

  { id:"comeback", icon:"🩹", name:"Comeback Kid", reward:150,
    desc:"Win an Exam Boss fight with 10% health or less remaining.",
    check:s => s.clutchWins >= 1 },

  { id:"night_owl", icon:"🦉", name:"Night Owl", reward:120,
    desc:"Study between midnight and 4 a.m.",
    check:s => !!s.nightOwl },

  { id:"early_bird", icon:"🐦", name:"Early Bird", reward:120,
    desc:"Study between 5 a.m. and 7 a.m.",
    check:s => !!s.earlyBird },

  { id:"redemption", icon:"♻️", name:"Redemption Arc", reward:180,
    desc:"Clear 20 questions from your Mistakes list.",
    check:s => s.mistakesFixed >= 20, goal:s => [Math.min(s.mistakesFixed,20), 20] }
];
