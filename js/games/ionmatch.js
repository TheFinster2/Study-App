/* Ion Memory — concentration-style matching of ion names to formulas. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.ionmatch = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  function start(root, cfg) {
    const c = Object.assign({ pairs: 8, tier: 2 }, cfg);
    S.markMode("ionmatch");
    S.touchStreak();

    const pool = CHEM.DATA.ions.filter(i => i.tier <= c.tier);
    const chosen = U.sample(pool, c.pairs);

    const cards = U.shuffle(chosen.flatMap((ion, i) => ([
      { key: i, face: ion.name, kind: "name", ion },
      { key: i, face: ion.formula, kind: "formula", ion }
    ])));

    let flipped = [], matched = 0, moves = 0, misses = 0, locked = false;
    let seconds = 0, timerId = null, finished = false;

    const shell = UI.gameShell("Ion Memory", { confirmExit: true });
    root.appendChild(shell.root);

    const pairChip = UI.chip(`0 / ${c.pairs} pairs`);
    const moveChip = UI.chip("0 moves");
    const timeChip = U.el("span", { class: "timer-ring", text: "0:00" });
    [pairChip, moveChip, timeChip].forEach(n => shell.meta.appendChild(n));

    shell.body.appendChild(U.el("p", {
      class: "muted",
      text: "Flip two cards to pair each ion with its formula. Fewer moves and less time means more XP."
    }));

    const grid = U.el("div", { class: "mgrid" });
    shell.body.appendChild(grid);

    const hintSlot = U.el("div");
    shell.body.appendChild(hintSlot);

    timerId = setInterval(() => {
      seconds++;
      timeChip.textContent = U.fmtTime(seconds);
    }, 1000);
    UI.onLeave(() => clearInterval(timerId));

    const nodes = cards.map((card, i) => {
      const front = U.el("div", { class: "mface mface-front", html: U.formula(card.face) });
      const btn = U.el("button", { class: "mcard", type: "button", "aria-label": "hidden card" }, [
        U.el("div", { class: "mcard-inner" }, [
          U.el("div", { class: "mface mface-back", text: "⚗️" }),
          front
        ])
      ]);
      btn.addEventListener("click", () => flip(i));
      grid.appendChild(btn);
      return btn;
    });

    function flip(i) {
      if (locked) return;
      const node = nodes[i];
      if (node.classList.contains("flip") || node.classList.contains("done")) return;

      node.classList.add("flip");
      CHEM.Sound.flip();
      flipped.push(i);

      if (flipped.length === 2) {
        moves++;
        moveChip.textContent = moves + " moves";
        const [a, b] = flipped;
        const same = cards[a].key === cards[b].key && cards[a].kind !== cards[b].kind;

        if (same) {
          locked = true;
          setTimeout(() => {
            nodes[a].classList.add("done");
            nodes[b].classList.add("done");
            matched++;
            pairChip.textContent = `${matched} / ${c.pairs} pairs`;
            S.bump("ionsMatched");
            CHEM.Sound.match();
            CHEM.FX.burstAt(nodes[a], { count: 16, speed: 4, size: 3, shape: "circle" });

            const ion = cards[a].ion;
            hintSlot.innerHTML = "";
            hintSlot.appendChild(U.el("div", { class: "feedback ok", html:
              `<b>${U.escapeHtml(ion.name)}</b> = ${U.formula(ion.formula)} &middot; charge ${ion.charge > 0 ? "+" + ion.charge : ion.charge}` }));

            flipped = [];
            locked = false;
            if (matched === c.pairs) finish();
          }, 320);
        } else {
          locked = true;
          misses++;
          nodes[a].classList.add("miss");
          nodes[b].classList.add("miss");
          CHEM.Sound.mismatch();
          setTimeout(() => {
            [a, b].forEach(k => {
              nodes[k].classList.remove("flip", "miss");
            });
            flipped = [];
            locked = false;
          }, 850);
        }
      }
    }

    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(timerId);

      if (moves === c.pairs) CHEM.Sound.perfect();
      const perfect = moves === c.pairs;
      // Efficiency: perfect play = 1.0, sloppy play tails off.
      const efficiency = U.clamp(c.pairs / moves, 0.25, 1);
      const timeBonus = Math.max(0, 120 - seconds);
      const xp = Math.round(c.pairs * 22 * efficiency + timeBonus * 0.6) + S.streakBonus();
      const coins = Math.round(c.pairs * 4 * efficiency) + (perfect ? 60 : 0);

      S.progressDaily("ionmatch", 1);
      if (perfect) S.bump("perfectRuns");
      const newBest = S.recordScore("ionmatch", Math.round(efficiency * 100));

      const got = UI.award({ xp, coins });
      UI.results({
        title: perfect ? "Perfect memory!" : "Board cleared",
        correct: matched, total: c.pairs, xp: got.xp, coins: got.coins, newBest,
        bonus: perfect ? 10 : 0,
        extraStats: [["Moves", moves], ["Time", U.fmtTime(seconds)], ["Misses", misses]],
        onAgain: () => UI.handleRoute()
      });
    }
  }

  return { start };
})();
