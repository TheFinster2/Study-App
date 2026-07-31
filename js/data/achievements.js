/* Achievements. `check(s)` receives State.achievementStats().

   Achievements that depend on Extension 1 content carry `tier:"ME"` and are
   filtered out of an Advanced-only build by enabledAchievements(). An
   Advanced-only player who can see permanently unobtainable achievements is
   a small thing that feels awful, and it is entirely avoidable. */
window.MQ = window.MQ || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.achievements = [

/* ── getting started ──────────────────────────────────────── */
{id:"a_first",   icon:"👣", name:"First Steps",       desc:"Answer your first question",           reward:20,   check:s=>s.answered>=1},
{id:"a_ten",     icon:"🔟", name:"Warmed Up",         desc:"Answer 10 questions",                  reward:40,   check:s=>s.answered>=10},
{id:"a_hundred", icon:"💯", name:"Century",           desc:"Answer 100 questions",                 reward:150,  check:s=>s.answered>=100},
{id:"a_500",     icon:"📚", name:"Five Hundred",      desc:"Answer 500 questions",                 reward:400,  check:s=>s.answered>=500},
{id:"a_1000",    icon:"🏛️", name:"Four Figures",      desc:"Answer 1,000 questions",               reward:800,  check:s=>s.answered>=1000},
{id:"a_2500",    icon:"🗿", name:"Two and a Half K",  desc:"Answer 2,500 questions",               reward:1600, check:s=>s.answered>=2500},
{id:"a_5000",    icon:"🌌", name:"Five Thousand",     desc:"Answer 5,000 questions",               reward:3500, check:s=>s.answered>=5000},

/* ── accuracy and streaks ─────────────────────────────────── */
{id:"a_str5",    icon:"⚡", name:"On a Roll",         desc:"Reach a 5-question streak",            reward:40,   check:s=>s.bestStreak>=5},
{id:"a_str15",   icon:"🔥", name:"Fifteen Straight",  desc:"Reach a 15-question streak",           reward:120,  check:s=>s.bestStreak>=15},
{id:"a_str30",   icon:"☄️", name:"Thirty Straight",   desc:"Reach a 30-question streak",           reward:350,  check:s=>s.bestStreak>=30},
{id:"a_str50",   icon:"🌠", name:"Unbroken",          desc:"Reach a 50-question streak",           reward:800,  check:s=>s.bestStreak>=50},
{id:"a_perfect", icon:"✨", name:"Flawless",          desc:"Finish a run with no mistakes",        reward:80,   check:s=>s.perfectRuns>=1},
{id:"a_perfect10",icon:"💫",name:"Ten Flawless",      desc:"Finish 10 perfect runs",               reward:400,  check:s=>s.perfectRuns>=10},
{id:"a_perfect30",icon:"🌟",name:"Thirty Flawless",   desc:"Finish 30 perfect runs",               reward:1200, check:s=>s.perfectRuns>=30},
{id:"a_acc80",   icon:"🎯", name:"Consistent",        desc:"80% accuracy over 200+ questions",     reward:400,  check:s=>s.answered>=200&&s.correct/s.answered>=0.8},
{id:"a_acc90",   icon:"🏹", name:"Surgical",          desc:"90% accuracy over 500+ questions",     reward:1000, check:s=>s.answered>=500&&s.correct/s.answered>=0.9},

/* ── daily habit ──────────────────────────────────────────── */
{id:"a_day3",    icon:"📅", name:"Three in a Row",    desc:"A 3-day streak",                       reward:60,   check:s=>s.longestDayStreak>=3},
{id:"a_day7",    icon:"🗓️", name:"A Full Week",       desc:"A 7-day streak",                       reward:180,  check:s=>s.longestDayStreak>=7},
{id:"a_day30",   icon:"📆", name:"A Full Month",      desc:"A 30-day streak",                      reward:900,  check:s=>s.longestDayStreak>=30},
{id:"a_day100",  icon:"🎖️", name:"Hundred Days",      desc:"A 100-day streak",                     reward:3000, check:s=>s.longestDayStreak>=100},
{id:"a_night",   icon:"🦉", name:"Night Owl",         desc:"Study between midnight and 4 a.m.",    reward:80,   check:s=>!!s.nightOwl},
{id:"a_early",   icon:"🐓", name:"Early Bird",        desc:"Study between 5 and 7 a.m.",           reward:80,   check:s=>!!s.earlyBird},
{id:"a_quest",   icon:"📜", name:"Quest Complete",    desc:"Claim a weekly quest",                 reward:100,  check:s=>s.questsDone>=1},
{id:"a_quest10", icon:"🧾", name:"Ten Quests",        desc:"Claim 10 weekly quests",               reward:600,  check:s=>s.questsDone>=10},

/* ── levels ───────────────────────────────────────────────── */
{id:"a_lv5",     icon:"🌱", name:"Level 5",           desc:"Reach level 5",                        reward:60,   check:s=>s.level>=5},
{id:"a_lv10",    icon:"🌿", name:"Level 10",          desc:"Reach level 10",                       reward:150,  check:s=>s.level>=10},
{id:"a_lv20",    icon:"🌳", name:"Band 5 Candidate",  desc:"Reach level 20",                       reward:500,  check:s=>s.level>=20},
{id:"a_lv30",    icon:"🏔️", name:"Band 6 Candidate",  desc:"Reach level 30",                       reward:1000, check:s=>s.level>=30},
{id:"a_lv45",    icon:"🗼", name:"Level 45",          desc:"Reach level 45",                       reward:2000, check:s=>s.level>=45},
{id:"a_lv60",    icon:"👑", name:"Level 60",          desc:"Reach the level cap",                  reward:5000, check:s=>s.level>=60},
{id:"a_asc1",    icon:"🔱", name:"Ascended",          desc:"Ascend once",                          reward:2000, check:s=>s.prestige>=1},
{id:"a_asc3",    icon:"🌠", name:"Thrice Ascended",   desc:"Ascend three times",                   reward:6000, check:s=>s.prestige>=3},

/* ── per-mode ─────────────────────────────────────────────── */
{id:"a_equiv1",  icon:"🔁", name:"Same Thing, Twice", desc:"Verify your first equivalence",        reward:40,   check:s=>s.equivalences>=1},
{id:"a_equiv50", icon:"⚖️", name:"Fifty Equivalences",desc:"Verify 50 expressions as equivalent",  reward:300,  check:s=>s.equivalences>=50},
{id:"a_equiv200",icon:"🧿", name:"Algebraically Fluent",desc:"Verify 200 equivalences",            reward:900,  check:s=>s.equivalences>=200},
{id:"a_pairs",   icon:"🃏", name:"Pair Work",         desc:"Match 50 pairs",                       reward:120,  check:s=>s.pairsMatched>=50},
{id:"a_pairs300",icon:"🎴", name:"Concentration",     desc:"Match 300 pairs",                      reward:600,  check:s=>s.pairsMatched>=300},
{id:"a_curve",   icon:"📈", name:"Curve Literate",    desc:"Read 50 graphs correctly",             reward:200,  check:s=>s.curvesRead>=50},
{id:"a_curve250",icon:"🗺️", name:"Cartographer",      desc:"Read 250 graphs correctly",            reward:800,  check:s=>s.curvesRead>=250},
{id:"a_calc",    icon:"🔢", name:"Number Cruncher",   desc:"Solve 50 generated calculations",      reward:200,  check:s=>s.calcsCorrect>=50},
{id:"a_calc300", icon:"🖩", name:"Calculation Engine",desc:"Solve 300 generated calculations",     reward:900,  check:s=>s.calcsCorrect>=300},
{id:"a_tangent", icon:"📐", name:"On a Tangent",      desc:"Place 25 tangents in the Calculus Lab",reward:250,  check:s=>s.tangentsPlaced>=25},
{id:"a_tangent_p",icon:"🎯",name:"Dead On",           desc:"Place 10 tangents within 1% of exact", reward:500,  check:s=>s.perfectTangents>=10},
{id:"a_area",    icon:"🟦", name:"Under the Curve",   desc:"Find 25 areas in the Calculus Lab",    reward:250,  check:s=>s.areasFound>=25},
{id:"a_grid",    icon:"⏱️", name:"Grid Filler",       desc:"Complete 10 Table Panic grids",        reward:200,  check:s=>s.gridsFilled>=10},
{id:"a_grid_p",  icon:"🧊", name:"Perfect Grid",      desc:"Complete a Table Panic grid with no errors",reward:300,check:s=>s.perfectGrids>=1},
{id:"a_proof",   icon:"🪜", name:"Q.E.D.",            desc:"Assemble your first proof",            reward:100,  check:s=>s.proofsSolved>=1},
{id:"a_proof20", icon:"📜", name:"Twenty Proofs",     desc:"Assemble 20 proofs",                   reward:500,  check:s=>s.proofsSolved>=20},
{id:"a_proof_all",icon:"🏛️",name:"Complete Works",    desc:"Solve every proof puzzle at least once",reward:1200,check:s=>s.proofsSolvedUnique>=MQ.Proofs.all().length},
{id:"a_survive10",icon:"💀",name:"Ten Deep",          desc:"Reach 10 questions in Survival",       reward:150,  check:s=>s.survivalBest>=10},
{id:"a_survive25",icon:"☠️",name:"Twenty-Five Deep",  desc:"Reach 25 questions in Survival",       reward:500,  check:s=>s.survivalBest>=25},
{id:"a_survive50",icon:"⚰️",name:"Fifty Deep",        desc:"Reach 50 questions in Survival",       reward:1500, check:s=>s.survivalBest>=50},
{id:"a_rehab",   icon:"🩹", name:"Self-Correcting",   desc:"Fix 25 previous mistakes",             reward:250,  check:s=>s.mistakesFixed>=25},
{id:"a_rehab100",icon:"🧬", name:"Nothing Sticks",    desc:"Fix 100 previous mistakes",            reward:900,  check:s=>s.mistakesFixed>=100},

/* ── bosses ───────────────────────────────────────────────── */
{id:"a_boss1",   icon:"⚔️", name:"First Blood",       desc:"Defeat an Exam Boss",                  reward:250,  check:s=>s.bossWins>=1},
{id:"a_boss_all",icon:"🛡️", name:"Boss Rush",         desc:"Defeat every Exam Boss",               reward:2000, check:s=>s.bossesBeaten>=(MQ.DATA.hasExt()?6:5)},
{id:"a_boss_flaw",icon:"🥷",name:"Untouchable",       desc:"Beat a boss without losing any health",reward:800,  check:s=>s.flawlessBoss>=1},
{id:"a_boss_clutch",icon:"🫀",name:"Clutch",          desc:"Win a boss fight on your last life",   reward:600,  check:s=>s.clutchWins>=1},
{id:"a_final",   icon:"🎓", name:"The Final Paper",   desc:"Score 20+ on The Final Paper",         reward:2500, check:s=>s.finalPaperBest>=20},

/* ── study and collection ─────────────────────────────────── */
{id:"a_card20",  icon:"🗂️", name:"Deck Builder",      desc:"Master 20 flashcards",                 reward:250,  check:s=>s.cardsMastered>=20},
{id:"a_card60",  icon:"📇", name:"Total Recall",      desc:"Master 60 flashcards",                 reward:800,  check:s=>s.cardsMastered>=60},
{id:"a_bookmark",icon:"🔖", name:"Notebook",          desc:"Star 15 questions for review",         reward:120,  check:s=>s.bookmarks>=15},
{id:"a_themes3", icon:"🎨", name:"Redecorated",       desc:"Own 3 themes",                         reward:200,  check:s=>s.themesOwned>=3},
{id:"a_themes_all",icon:"🖼️",name:"Full Palette",     desc:"Own every theme",                      reward:2000, check:s=>s.themesOwned>=MQ.DATA.shop.themes.length},
{id:"a_avatars8",icon:"🎭", name:"Wardrobe",          desc:"Own 8 avatars",                        reward:300,  check:s=>s.avatarsOwned>=8},
{id:"a_rich",    icon:"💰", name:"Prime Hoarder",     desc:"Hold 5,000 Primes at once",            reward:400,  check:s=>s.peakCoins>=5000},
{id:"a_modes",   icon:"🎮", name:"Sampler",           desc:"Play 8 different game modes",          reward:300,  check:s=>Object.keys(s.modesPlayed||{}).length>=8},
{id:"a_modes_all",icon:"🕹️",name:"Completionist",     desc:"Play every game mode",                 reward:900,  check:s=>Object.keys(s.modesPlayed||{}).length>=(MQ.DATA.hasExt()?13:11)},
{id:"a_ref",     icon:"📖", name:"Looked It Up",      desc:"Open 10 reference sheets",             reward:100,  check:s=>s.referenceReads>=10},

/* ── mastery ──────────────────────────────────────────────── */
{id:"a_mast1",   icon:"🥉", name:"Bronze Topic",      desc:"Reach 25% mastery in any topic",       reward:150,
 check:s=>MQ.Bank.topics().some(t=>s.masteryOf(t.id)>=25)},
{id:"a_mast_gold",icon:"🥇",name:"Gold Topic",        desc:"Reach 65% mastery in any topic",       reward:500,
 check:s=>MQ.Bank.topics().some(t=>s.masteryOf(t.id)>=65)},
{id:"a_mast_diamond",icon:"💎",name:"Diamond Topic",  desc:"Reach 92% mastery in any topic",       reward:1500,
 check:s=>MQ.Bank.topics().some(t=>s.masteryOf(t.id)>=92)},
{id:"a_mast_all",icon:"🏆", name:"Across the Board",  desc:"Reach 45% mastery in every topic",     reward:4000,
 check:s=>MQ.Bank.topics().every(t=>s.masteryOf(t.id)>=45)},
{id:"a_hard",    icon:"🔥", name:"Hard Mode",         desc:"Finish a run on Hard",                 reward:300,  check:s=>s.hardWins>=1},
{id:"a_nightmare",icon:"☠️",name:"Nightmare Mode",    desc:"Finish a run on Nightmare",            reward:900,  check:s=>s.nightmareWins>=1},

/* ══════════ Extension 1 only ══════════ */
{id:"a_ext1",    tier:"ME", icon:"🧩", name:"Extension Enrolled", desc:"Answer your first Extension 1 question", reward:60, check:s=>s.extAnswered>=1},
{id:"a_ext100",  tier:"ME", icon:"🧠", name:"Extended Range",     desc:"Answer 100 Extension 1 questions",       reward:400, check:s=>s.extAnswered>=100},
{id:"a_ext500",  tier:"ME", icon:"🎓", name:"Extension Scholar",  desc:"Answer 500 Extension 1 questions",       reward:1500,check:s=>s.extAnswered>=500},
{id:"a_ind1",    tier:"ME", icon:"🪜", name:"Base Case",          desc:"Complete an induction proof",            reward:150, check:s=>s.inductionsSolved>=1},
{id:"a_ind10",   tier:"ME", icon:"⛓️", name:"And So On, Forever", desc:"Complete 10 induction proofs",           reward:600, check:s=>s.inductionsSolved>=10},
{id:"a_ind_all", tier:"ME", icon:"♾️", name:"Every Domino",       desc:"Solve every induction puzzle",           reward:1200,
 check:s=>s.inductionsSolvedUnique>=MQ.Proofs.inductions().length},
{id:"a_vec1",    tier:"ME", icon:"➡️", name:"On Target",          desc:"Land your first projectile on the target",reward:150, check:s=>s.projectilesLanded>=1},
{id:"a_vec25",   tier:"ME", icon:"🎯", name:"Ballistics",         desc:"Land 25 projectiles on target",          reward:600, check:s=>s.projectilesLanded>=25},
{id:"a_bullseye",tier:"ME", icon:"🏹", name:"Bullseye",           desc:"Land 10 projectiles within 1% of dead centre",reward:900, check:s=>s.bullseyes>=10}
];

/** Achievements this build can actually award. */
MQ.DATA.enabledAchievements = (function () {
  let cached = null;
  return () => (cached || (cached = MQ.DATA.achievements.filter(
    a => !a.tier || MQ.DATA.TIERS.indexOf(a.tier) >= 0)));
})();
