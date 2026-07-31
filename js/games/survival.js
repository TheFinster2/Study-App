/* 💀 Survival — one life, a tightening clock, escalating difficulty.
   How deep can you go? */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.survival = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  function start(root) {
    S.markMode("survival");
    S.touchStreak();
    const diffMode = S.difficulty();
    MQ.Sound.gameStart();

    let depth = 0, correct = 0, xpEarned = 0, coinsEarned = 0;
    let finished = false, shownAt = 0, card = null, question = null;
    let perQuestion = 30 * diffMode.timeScale;
    let timeLeft = perQuestion, timerId = null;

    const shell = UI.gameShell("💀 Survival", { confirmExit: true,
      help: "One life. The clock shortens and the questions get harder with every correct answer. " +
            "One wrong answer or one timeout ends the run." });
    root.appendChild(shell.root);

    const depthChip = UI.chip("Depth 0");
    const scoreChip = UI.chip("0 XP");
    const timerChip = U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft) });
    [depthChip, scoreChip, timerChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div");
    shell.body.appendChild(stage);

    UI.onLeave(() => { clearInterval(timerId); document.removeEventListener("keydown", onKey); });
    document.addEventListener("keydown", onKey);
    function onKey(e) {
      if (!card || finished) return;
      const n = "1234".indexOf(e.key);
      if (n >= 0 && card.buttons[n] && !card.buttons[n].disabled) card.buttons[n].click();
    }

    function startClock() {
      clearInterval(timerId);
      timeLeft = perQuestion;
      timerChip.textContent = U.fmtTime(Math.ceil(timeLeft));
      timerChip.classList.remove("low");
      timerId = setInterval(() => {
        timeLeft--;
        timerChip.textContent = U.fmtTime(Math.max(0, Math.ceil(timeLeft)));
        timerChip.classList.toggle("low", timeLeft <= 5);
        if (timeLeft <= 5 && timeLeft > 0) MQ.Sound.tickUrgent();
        if (timeLeft <= 0) { MQ.Sound.timeout(); finish("Out of time"); }
      }, 1000);
    }

    function render() {
      stage.innerHTML = "";
      // Difficulty climbs with depth: easy questions first, then anything.
      const maxDiff = depth < 5 ? 1 : depth < 12 ? 2 : 3;
      const minDiff = depth < 12 ? 1 : 2;
      question = MQ.Bank.draw(1, { maxDiff, minDiff, adaptive: false })[0]
              || MQ.Bank.draw(1, { adaptive: false })[0];

      card = MQ.QuizCore.buildCard(question, {
        onAnswer: (chosen, ok) => answer(chosen, ok)
      });
      stage.appendChild(card.node);
      shownAt = performance.now();
      startClock();
    }

    function answer(chosen, ok) {
      clearInterval(timerId);
      card.reveal(chosen);
      S.recordAnswer(question.topic, ok, question.id);

      if (!ok) {
        MQ.Sound.wrong();
        MQ.FX.shake();
        setTimeout(() => finish("Wrong answer"), 900);
        return;
      }

      const tooFast = performance.now() - shownAt < UI.MIN_READ_MS;
      depth++;
      correct++;
      // XP per question grows with depth, so the deep runs are where the value is.
      xpEarned += tooFast ? 0 : Math.round(8 + depth * 2.5);
      coinsEarned += tooFast ? 0 : 2;
      // The clock tightens, with a hard floor so it stays humanly possible.
      perQuestion = Math.max(8 * diffMode.timeScale, perQuestion - 1.2);

      depthChip.textContent = "Depth " + depth;
      scoreChip.textContent = xpEarned + " XP";
      MQ.Sound.correct();
      if (depth % 10 === 0) {
        MQ.Sound.rankUp();
        UI.toast({ icon: "💀", kind: "xp", text: `<b>Depth ${depth}.</b> Still standing.` });
      }
      setTimeout(render, 700);
    }

    function finish(reason) {
      if (finished) return;
      finished = true;
      clearInterval(timerId);
      document.removeEventListener("keydown", onKey);

      if (depth > (S.data.stats.survivalBest || 0)) {
        S.data.stats.survivalBest = depth;
        S.save();
      }
      const newBest = S.recordScore("survival", depth);
      /* Survival ends on the first mistake, so "accuracy" here is depth-based:
         a run that ends at depth 0 gets no completion bonus at all. */
      const accuracy = U.clamp(depth / 15, 0, 1);
      const got = UI.award({
        xp: xpEarned, bonus: depth >= 10 ? S.streakBonus() : 0, accuracy,
        coins: coinsEarned + (depth >= 20 ? 50 : 0)
      });

      UI.results({
        title: reason,
        correct: depth, total: Math.max(depth + 1, 1), xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Depth", depth],
          ["Best ever", S.data.stats.survivalBest],
          ["Final clock", Math.round(perQuestion) + "s"]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
    return () => clearInterval(timerId);
  }

  return { start };
})();
