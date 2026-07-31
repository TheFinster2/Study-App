/* ═══════════════════════════════════════════════════════════════
   The ONE place the Advanced / Extension 1 decision lives.

     MQ.DATA.TIERS = ["MA"];          Advanced only
     MQ.DATA.TIERS = ["MA", "ME"];    Advanced + Extension 1

   Every topic code is prefixed MA- or ME-, and Bank.all() filters on this
   array, so flipping it is the entire change. What follows from that:

   · The questions-me-*.js banks are simply not listed in index.html or in
     sw.js PRECACHE for an Advanced-only build.
   · Game modes are SHARED. Extension 1 content flows through the same
     Proof Builder, Calculation Crunch and so on. Only Vector Lab, the
     Induction Builder and the sixth boss are Extension-only, and they
     self-hide via MQ.DATA.hasExt() rather than living on separate screens.
   · Achievements referencing ME- topics are filtered out too — an
     Advanced-only player who can see permanently unobtainable achievements
     is a small thing that feels awful.
   · tests/validate.js asserts BOTH configurations pass, so an
     Advanced-only build can never reference an ME- id it isn't shipping.
     That check is the only thing stopping this toggle from rotting.

   Switching tiers changes the precached file list, so bump CACHE in sw.js
   when you change this line.
   ═══════════════════════════════════════════════════════════════ */
window.MQ = window.MQ || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.TIERS = ["MA", "ME"];

/** True when the Extension 1 tier is part of this build. */
MQ.DATA.hasExt = () => MQ.DATA.TIERS.indexOf("ME") >= 0;

/** The tier a topic code belongs to: "MA-C2" → "MA". */
MQ.DATA.tierOf = code => String(code || "").split("-")[0];

/** Is this topic code part of the current build? */
MQ.DATA.tierEnabled = code => MQ.DATA.TIERS.indexOf(MQ.DATA.tierOf(code)) >= 0;

MQ.DATA.TIER_META = {
  MA: { id: "MA", name: "Mathematics Advanced", short: "Advanced", chip: "ADV" },
  ME: { id: "ME", name: "Mathematics Extension 1", short: "Extension 1", chip: "EXT" }
};
