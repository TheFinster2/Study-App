/* The Arcade catalogue. Three games rented with Primes in timed tickets.

   These award NO XP, NO Primes and NO achievements — only a high score.
   That is not a balance decision, it is a structural one: an endless runner
   paying even 1 XP/second beats studying, so the reference app nearly shipped
   a mode that made itself the optimal strategy.

   The rule is enforced by arcade code NEVER calling UI.award(). Everything
   else in the app funnels rewards through that one function, so "earns
   nothing" is checkable rather than merely intended — tests/arcade.js asserts
   XP, level and Primes are provably untouched by playing. */
window.MQ = window.MQ || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.arcade = [
  { id:"crush", icon:"🧮", name:"Prime Crush", colour:"#39d6c8", minLevel:3,
    blurb:"8×8 match-3 on number tiles. Line up three primes, or three of anything.",
    tickets:[{ mins:5, cost:250 }, { mins:15, cost:600 }, { mins:30, cost:1000 }] },
  { id:"runner", icon:"🏃", name:"Vector Runner", colour:"#ffcc55", minLevel:5,
    blurb:"An endless canvas runner. Jump the gaps, duck under the ceiling.",
    tickets:[{ mins:5, cost:250 }, { mins:15, cost:600 }, { mins:30, cost:1000 }] },
  { id:"tower", icon:"🗼", name:"Power Tower 2048", colour:"#7c5cff", minLevel:7,
    blurb:"4×4 merge up the powers of 2. Already a maths game; we just kept score.",
    tickets:[{ mins:5, cost:250 }, { mins:15, cost:600 }, { mins:30, cost:1000 }] }
];
