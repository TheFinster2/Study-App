/* 🃏 Match Pairs — concentration over four pair types:
   function ↔ derivative, function ↔ integral, expression ↔ factored form,
   and identity ↔ equivalent form. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};
MQ.DATA = MQ.DATA || {};

MQ.DATA.matchPairs = [
  /* function ↔ derivative */
  {set:"Derivatives",topic:"MA-C2",a:"x^3",b:"3x^2"},
  {set:"Derivatives",topic:"MA-C2",a:"\\sqrt{x}",b:"\\frac{1}{2\\sqrt{x}}"},
  {set:"Derivatives",topic:"MA-C2",a:"\\frac{1}{x}",b:"-\\frac{1}{x^2}"},
  {set:"Derivatives",topic:"MA-E1",a:"e^{2x}",b:"2e^{2x}"},
  {set:"Derivatives",topic:"MA-E1",a:"ln x",b:"\\frac{1}{x}"},
  {set:"Derivatives",topic:"MA-T2",a:"sin x",b:"cos x"},
  {set:"Derivatives",topic:"MA-T2",a:"cos x",b:"-sin x"},
  {set:"Derivatives",topic:"MA-T2",a:"tan x",b:"sec^2 x"},
  {set:"Derivatives",topic:"MA-C2",a:"(2x+1)^3",b:"6(2x+1)^2"},
  {set:"Derivatives",topic:"MA-E1",a:"x e^{x}",b:"e^{x}(1+x)"},
  {set:"Derivatives",topic:"MA-E1",a:"ln(x^2+1)",b:"\\frac{2x}{x^2+1}"},
  {set:"Derivatives",topic:"MA-C2",a:"x^2 sin x",b:"2x sin x + x^2 cos x"},

  /* function ↔ integral */
  {set:"Integrals",topic:"MA-C4",a:"int x^4 dx",b:"\\frac{x^5}{5} + c"},
  {set:"Integrals",topic:"MA-C4",a:"int \\frac{1}{x^2} dx",b:"-\\frac{1}{x} + c"},
  {set:"Integrals",topic:"MA-E1",a:"int e^{3x} dx",b:"\\frac{1}{3}e^{3x} + c"},
  {set:"Integrals",topic:"MA-E1",a:"int \\frac{1}{x} dx",b:"ln|x| + c"},
  {set:"Integrals",topic:"MA-T2",a:"int sin 2x dx",b:"-\\frac{1}{2}cos 2x + c"},
  {set:"Integrals",topic:"MA-T2",a:"int cos 3x dx",b:"\\frac{1}{3}sin 3x + c"},
  {set:"Integrals",topic:"MA-T2",a:"int sec^2 x dx",b:"tan x + c"},
  {set:"Integrals",topic:"MA-C4",a:"int (3x+2)^4 dx",b:"\\frac{(3x+2)^5}{15} + c"},
  {set:"Integrals",topic:"MA-E1",a:"int \\frac{2x}{x^2+1} dx",b:"ln(x^2+1) + c"},
  {set:"Integrals",topic:"MA-C4",a:"int \\sqrt{x} dx",b:"\\frac{2}{3}x^{\\frac{3}{2}} + c"},

  /* expression ↔ factored form */
  {set:"Factorising",topic:"MA-F1",a:"x^2 - 16",b:"(x-4)(x+4)"},
  {set:"Factorising",topic:"MA-F1",a:"x^2 + 7x + 12",b:"(x+3)(x+4)"},
  {set:"Factorising",topic:"MA-F1",a:"x^2 - 5x + 6",b:"(x-2)(x-3)"},
  {set:"Factorising",topic:"MA-F1",a:"2x^2 + 5x - 3",b:"(2x-1)(x+3)"},
  {set:"Factorising",topic:"MA-F1",a:"x^3 - 8",b:"(x-2)(x^2+2x+4)"},
  {set:"Factorising",topic:"MA-F1",a:"x^2 - 4x + 4",b:"(x-2)^2"},
  {set:"Factorising",topic:"MA-F1",a:"3x^2 - 12",b:"3(x-2)(x+2)"},
  {set:"Factorising",topic:"MA-F1",a:"x^3 + x^2 - 2x",b:"x(x+2)(x-1)"},

  /* identity ↔ equivalent form */
  {set:"Identities",topic:"MA-T1",a:"1 + tan^2 theta",b:"sec^2 theta"},
  {set:"Identities",topic:"MA-T1",a:"1 - cos^2 theta",b:"sin^2 theta"},
  {set:"Identities",topic:"MA-T2",a:"2 sin x cos x",b:"sin 2x"},
  {set:"Identities",topic:"MA-T2",a:"2cos^2 x - 1",b:"cos 2x"},
  {set:"Identities",topic:"MA-E1",a:"log a + log b",b:"log(ab)"},
  {set:"Identities",topic:"MA-E1",a:"3 log x",b:"log x^3"},
  {set:"Identities",topic:"MA-E1",a:"e^{ln 5}",b:"5"},
  {set:"Identities",topic:"MA-F1",a:"(a+b)^2",b:"a^2 + 2ab + b^2"},

  /* graph feature ↔ equation */
  {set:"Graphs",topic:"MA-F1",a:"Vertex at (2, -1)",b:"y = (x-2)^2 - 1"},
  {set:"Graphs",topic:"MA-F1",a:"Asymptote x = 3",b:"y = \\frac{1}{x-3}"},
  {set:"Graphs",topic:"MA-T2",a:"Period \\frac{2pi}{3}",b:"y = sin 3x"},
  {set:"Graphs",topic:"MA-T2",a:"Amplitude 5",b:"y = 5 cos x"},
  {set:"Graphs",topic:"MA-E1",a:"Passes through (1, 0)",b:"y = ln x"},
  {set:"Graphs",topic:"MA-E1",a:"Asymptote y = 2",b:"y = e^{-x} + 2"},

  /* ── Extension 1 ── */
  {set:"Inverse trig",topic:"ME-C2",a:"\\frac{d}{dx}sin^{-1}x",b:"\\frac{1}{\\sqrt{1-x^2}}"},
  {set:"Inverse trig",topic:"ME-C2",a:"\\frac{d}{dx}tan^{-1}x",b:"\\frac{1}{1+x^2}"},
  {set:"Inverse trig",topic:"ME-C2",a:"int\\frac{dx}{\\sqrt{4-x^2}}",b:"sin^{-1}\\frac{x}{2} + c"},
  {set:"Inverse trig",topic:"ME-C2",a:"int\\frac{dx}{9+x^2}",b:"\\frac{1}{3}tan^{-1}\\frac{x}{3} + c"},
  {set:"Inverse trig",topic:"ME-T1",a:"Range [0, pi]",b:"y = cos^{-1}x"},
  {set:"Further identities",topic:"ME-T2",a:"sin(A+B)",b:"sin A cos B + cos A sin B"},
  {set:"Further identities",topic:"ME-T2",a:"cos(A+B)",b:"cos A cos B - sin A sin B"},
  {set:"Further identities",topic:"ME-T2",a:"\\frac{2t}{1+t^2}",b:"sin x, where t = tan\\frac{x}{2}"},
  {set:"Further identities",topic:"ME-T2",a:"\\frac{1-t^2}{1+t^2}",b:"cos x, where t = tan\\frac{x}{2}"},
  {set:"Combinatorics",topic:"ME-A1",a:"nCr(n,r)",b:"\\frac{n!}{r!(n-r)!}"},
  {set:"Combinatorics",topic:"ME-A1",a:"Arrangements in a circle",b:"(n-1)!"},
  {set:"Combinatorics",topic:"ME-A1",a:"Sum of the coefficients of (1+x)^n",b:"2^n"},
  {set:"Vectors",topic:"ME-V1",a:"|\\vec{u}| for 3i + 4j",b:"5"},
  {set:"Vectors",topic:"ME-V1",a:"\\vec{u} \\cdot \\vec{v} = 0",b:"Perpendicular"},
  {set:"Vectors",topic:"ME-V1",a:"Projectile range",b:"\\frac{V^2 sin 2theta}{g}"},
  {set:"Binomial",topic:"ME-S1",a:"Mean of Bin(n, p)",b:"np"},
  {set:"Binomial",topic:"ME-S1",a:"Variance of Bin(n, p)",b:"np(1-p)"}
];

MQ.Games.match = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  const available = () => MQ.DATA.matchPairs.filter(p => MQ.DATA.tierEnabled(p.topic));
  const sets = () => {
    const seen = [];
    available().forEach(p => { if (!seen.includes(p.set)) seen.push(p.set); });
    return seen;
  };

  function start(root, cfg) {
    const c = Object.assign({ modeId: "match", title: "🃏 Match Pairs", pairs: 8 }, cfg);

    // Draw from ONE set, so the round is a coherent topic rather than a jumble.
    const set = c.set || U.pick(sets());
    let pool = available().filter(p => p.set === set);
    if (pool.length < 4) pool = available();
    const chosen = U.sample(pool, Math.min(c.pairs, pool.length));

    S.markMode(c.modeId);
    S.touchStreak();
    MQ.Sound.gameStart();

    const shell = UI.gameShell(c.title + " · " + set, { confirmExit: true,
      help: "Tap two cards to reveal them. Match each expression with its partner. " +
            "Every mismatch costs XP, so a run of blind tapping earns nothing." });
    root.appendChild(shell.root);

    const movesChip = UI.chip("Moves 0");
    const foundChip = UI.chip("0 / " + chosen.length);
    const timerChip = U.el("span", { class: "timer-ring", text: "0:00" });
    [foundChip, movesChip, timerChip].forEach(n => shell.meta.appendChild(n));

    /* Two cards per pair, shuffled together. */
    const cards = U.shuffle(chosen.flatMap((p, i) => [
      { pair: i, text: p.a, topic: p.topic },
      { pair: i, text: p.b, topic: p.topic }
    ]));

    const board = U.el("div", { class: "mgrid" });
    shell.body.appendChild(board);

    let flipped = [];
    let found = 0, moves = 0, mismatches = 0, locked = false, finished = false;
    let seconds = 0;
    const timerId = setInterval(() => {
      seconds++;
      timerChip.textContent = U.fmtTime(seconds);
    }, 1000);
    UI.onLeave(() => clearInterval(timerId));

    MQ.__current = { kind: "match", pairs: cards.map(c => c.pair) };
    const nodes = cards.map((card, i) => {
      const node = U.el("button", { class: "mcard", type: "button", data: { i } }, [
        U.el("div", { class: "mcard-inner" }, [
          U.el("div", { class: "mface mface-back", text: "?" }),
          U.el("div", { class: "mface mface-front math", html: U.math(card.text) })
        ])
      ]);
      node.addEventListener("click", () => flip(i, node));
      board.appendChild(node);
      return node;
    });

    function flip(i, node) {
      if (locked || finished) return;
      if (node.classList.contains("flip") || node.classList.contains("done")) return;

      node.classList.add("flip");
      MQ.Sound.flip();
      flipped.push({ i, node });
      if (flipped.length < 2) return;

      moves++;
      movesChip.textContent = "Moves " + moves;
      const [x, y] = flipped;

      if (cards[x.i].pair === cards[y.i].pair) {
        x.node.classList.add("done");
        y.node.classList.add("done");
        flipped = [];
        found++;
        foundChip.textContent = found + " / " + chosen.length;
        S.bump("pairsMatched");
        S.recordAnswer(cards[x.i].topic, true, null);
        MQ.Sound.match();
        MQ.FX.burstAt(y.node, { count: 14, speed: 4, size: 3, shape: "circle" });
        if (found === chosen.length) setTimeout(finish, 500);
      } else {
        mismatches++;
        S.recordAnswer(cards[x.i].topic, false, null);
        MQ.Sound.mismatch();
        locked = true;
        x.node.classList.add("miss");
        y.node.classList.add("miss");
        setTimeout(() => {
          [x, y].forEach(f => { f.node.classList.remove("flip", "miss"); });
          flipped = [];
          locked = false;
        }, 750);
      }
    }

    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(timerId);
      S.progressDaily("match", 1);

      /* Efficiency, not completion. A concentration board is ALWAYS finished
         eventually, so "found them all" cannot be what pays. */
      const perfectMoves = chosen.length;
      const efficiency = U.clamp(perfectMoves / Math.max(1, moves), 0, 1);
      const perfect = mismatches === 0;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }

      const xp = Math.max(0, Math.round(chosen.length * 16 * efficiency) - mismatches * 4);
      const timeBonus = seconds < chosen.length * 6 ? 25 : 0;
      const newBest = S.recordScore(c.modeId, Math.round(efficiency * 100));

      const got = UI.award({
        xp, bonus: timeBonus, accuracy: efficiency,
        coins: Math.round(chosen.length * 3 * efficiency) + (perfect ? 25 : 0)
      });

      UI.results({
        title: perfect ? "Flawless board" : "Board cleared",
        correct: chosen.length, total: chosen.length + mismatches,
        xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Moves", moves + " / " + perfectMoves],
          ["Mismatches", mismatches],
          ["Time", U.fmtTime(seconds)]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    return () => clearInterval(timerId);
  }

  return { start, sets };
})();
