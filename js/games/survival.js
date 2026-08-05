/* Survival — one life, no second chances. The clock tightens and the questions
   get harder the longer you last. Ends the moment you get one wrong. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.survival = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  /** Seconds allowed at a given depth — starts generous, floors at 6s. */
  function timeFor(depth, scale) {
    return Math.max(6, Math.round((20 - Math.floor(depth / 4)) * scale));
  }

  /** Difficulty ceiling rises with depth: 1★ early, all 3★ past question 20. */
  function maxDiffFor(depth) {
    if (depth < 6) return 1;
    if (depth < 12) return 2;
    return 3;
  }

  function start(root) {
    S.markMode("survival");
    S.touchStreak();

    const diff = S.difficulty();
    let depth = 0, xpEarned = 0, coins = 0, finished = false;
    let timerId = null, timeLeft = 0, card = null;
    let pool = [];

    const shell = UI.gameShell("Survival", { tools: { notes: true, reference: true },  confirmExit: true });
    root.appendChild(shell.root);
    const depthChip = UI.chip("Q0");
    const bestChip = UI.chip("Best " + (S.data.stats.survivalBest || 0));
    const timerChip = U.el("span", { class: "timer-ring", text: "—" });
    [depthChip, bestChip, timerChip].forEach(n => shell.meta.appendChild(n));

    shell.body.appendChild(U.el("div", { class: "qcard" }, [
      U.el("div", { class: "qtag" }, [
        UI.chip("All modules"), UI.chip(diff.icon + " " + diff.name), UI.chip("One life")
      ]),
      U.el("p", { style: "margin:0", html:
        "One wrong answer ends the run. The clock tightens every four questions and the " +
        "difficulty climbs as you go. How deep can you get?" })
    ]));

    const stage = U.el("div");
    shell.body.appendChild(stage);

    CHEM.Sound.gameStart();
    UI.onLeave(() => clearInterval(timerId));

    function nextQuestion() {
      if (finished) return;
      if (!pool.length) {
        pool = CHEM.Bank.draw(15, { maxDiff: maxDiffFor(depth), adaptive: false });
      }
      const q = pool.shift();
      depth++;
      depthChip.textContent = "Q" + depth;
      stage.innerHTML = "";

      card = CHEM.QuizCore.buildCard(q, {
        index: depth - 1,
        onAnswer: (chosen, ok, btn) => resolve(q, chosen, ok, btn)
      });
      stage.appendChild(card.node);

      clearInterval(timerId);
      timeLeft = timeFor(depth, diff.timeScale);
      timerChip.textContent = String(timeLeft);
      timerChip.classList.remove("low");
      timerId = setInterval(() => {
        timeLeft--;
        timerChip.textContent = String(Math.max(0, timeLeft));
        const low = timeLeft <= 4;
        timerChip.classList.toggle("low", low);
        if (low && timeLeft > 0) CHEM.Sound.tickUrgent();
        if (timeLeft <= 0) {
          clearInterval(timerId);
          CHEM.Sound.timeout();
          resolve(q, -1, false, null, true);
        }
      }, 1000);
    }

    function resolve(q, chosen, ok, btn, timedOut) {
      clearInterval(timerId);
      const fb = card.reveal(chosen);
      S.recordAnswer(q.mod, ok, q.id);

      if (ok) {
        // Deeper questions pay exponentially more — the risk/reward of pushing on.
        const gain = Math.round(12 * (q.diff || 1) * (1 + depth * 0.09));
        xpEarned += gain;
        coins += 2 + Math.floor(depth / 5);
        CHEM.Sound.correct();
        if (depth % 5 === 0) { CHEM.Sound.combo(depth); CHEM.FX.confetti(30); }
        if (btn) {
          const r = btn.getBoundingClientRect();
          CHEM.FX.pop(r.right - 24, r.top + r.height / 2);
          CHEM.FX.floatText(r.right - 60, r.top - 4, "+" + gain);
        }
        const next = U.el("button", {
          class: "btn btn-primary js-next", text: "Push on →",
          on: { click: nextQuestion }
        });
        fb.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [next]));
        next.focus();
      } else {
        CHEM.Sound.playerHurt();
        CHEM.FX.shake();
        fb.appendChild(U.el("div", { class: "tiny", style: "margin-top:8px; color:var(--bad)",
          text: timedOut ? "Out of time. The run ends here." : "Wrong answer. The run ends here." }));
        setTimeout(() => end(), 900);
      }
    }

    function end() {
      if (finished) return;
      finished = true;
      clearInterval(timerId);

      const survived = Math.max(0, depth - 1);
      const isBest = survived > (S.data.stats.survivalBest || 0);
      if (isBest) { S.data.stats.survivalBest = survived; S.save(); }
      S.recordScore("survival", survived);
      if (survived >= 20) S.bump("perfectRuns");

      // Survival ends on the first wrong answer, so accuracy is depth/(depth+1).
      const got = UI.award({ xp: xpEarned, coins, bonus: S.streakBonus(),
                             accuracy: depth ? survived / depth : 0 });
      UI.results({
        title: isBest ? "New survival record!" : "Run over",
        correct: survived, total: depth, xp: got.xp, coins: got.coins, newBest: isBest,
        bonus: Math.min(20, survived),
        extraStats: [
          ["Depth", "Q" + survived],
          ["Best ever", S.data.stats.survivalBest],
          ["Mode", diff.name]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    nextQuestion();
  }

  return { start, timeFor };
})();
