/* The quiz engine — powers Rapid Fire, Topic Drill, Mistake Rehab, the
   bookmark deck, the daily challenge and The Final Paper. Also exports
   QuizCore.buildCard, which the boss fights reuse. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

/* ── the shared question card ──────────────────────────────── */
MQ.QuizCore = (function () {
  const U = MQ.U, S = MQ.State;
  const KEYS = ["A", "B", "C", "D", "E", "F"];

  /**
   * opts: { onAnswer(index, isCorrect, buttonEl), showTags, index, total, hideTopic }
   * Returns { node, reveal(chosen), buttons, disable(), fiftyFifty() }
   */
  function buildCard(q, opts) {
    const o = opts || {};

    const star = U.el("button", {
      class: "bookmark-btn" + (S.isBookmarked(q.id) ? " on" : ""),
      type: "button", title: "Star this question for review",
      text: S.isBookmarked(q.id) ? "★" : "☆"
    });
    star.addEventListener("click", e => {
      e.stopPropagation();
      const on = S.toggleBookmark(q.id);
      star.classList.toggle("on", on);
      star.textContent = on ? "★" : "☆";
      MQ.Sound.tap();
    });

    const tags = U.el("div", { class: "qtag" }, [
      o.total ? U.el("span", { class: "chip", text: `Q${o.index + 1} / ${o.total}` }) : null,
      // The Integrator boss hides the topic label — that is its whole gimmick.
      o.hideTopic ? U.el("span", { class: "chip", text: "???" })
                  : U.el("span", { class: "chip", text: MQ.Bank.topicName(q.topic) }),
      o.hideTopic ? null : MQ.UI.tierChip(q.topic),
      o.hideTopic ? null : U.el("span", { class: "chip", text: q.sub || "" }),
      U.el("span", { class: "chip", text: "★".repeat(q.diff || 1) }),
      star
    ]);

    const buttons = [];
    const choiceWrap = U.el("div", { class: "choices" });

    q.choices.forEach((text, i) => {
      const btn = U.el("button", { class: "choice", type: "button" }, [
        U.el("span", { class: "choice-key", text: KEYS[i] }),
        U.el("span", { class: "math", html: U.math(text) })
      ]);
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        o.onAnswer && o.onAnswer(i, i === q.a, btn);
      });
      buttons.push(btn);
      choiceWrap.appendChild(btn);
    });

    // See the test hook note in js/core/ui.js.
    MQ.__current = { kind: "quiz", answer: q.a, id: q.id };
    const node = U.el("div", { class: "qcard" }, [
      o.showTags === false ? null : tags,
      U.el("div", { class: "qtext math", html: U.math(q.q) }),
      choiceWrap
    ]);

    function disable() { buttons.forEach(b => (b.disabled = true)); }

    /** Mark the chosen answer and always show the correct one. */
    function reveal(chosen) {
      disable();
      buttons.forEach((b, i) => {
        if (i === q.a) b.classList.add("correct");
        else if (i === chosen) b.classList.add("wrong");
      });
      const ok = chosen === q.a;
      const fb = U.el("div", { class: "feedback " + (ok ? "ok" : "no") }, [
        U.el("span", { class: "math",
          html: `<b>${ok ? "Correct." : "Not quite."}</b> ` + U.math(q.why) })
      ]);
      node.appendChild(fb);
      return fb;
    }

    /** 50/50: dim two wrong options. */
    function fiftyFifty() {
      const wrong = buttons.map((b, i) => i).filter(i => i !== q.a && !buttons[i].disabled);
      U.shuffle(wrong).slice(0, Math.min(2, wrong.length)).forEach(i => {
        buttons[i].disabled = true;
        buttons[i].classList.add("dimmed");
      });
    }

    return { node, reveal, disable, buttons, fiftyFifty };
  }

  return { buildCard, KEYS };
})();

/* ── the quiz mode ─────────────────────────────────────────── */
MQ.Games.quiz = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  /**
   * cfg: { modeId, title, questions | topics | group, count, totalTime, lives,
   *        adaptive, dailyMode, hideTopic, onFinish, statKey }
   */
  function start(root, cfg) {
    const c = Object.assign({
      modeId: "quiz", title: "Quiz", count: 12, totalTime: 0, lives: 0, adaptive: true
    }, cfg);

    const questions = c.questions && c.questions.length
      ? c.questions
      : MQ.Bank.draw(c.count, { topics: c.topics, group: c.group, adaptive: c.adaptive });

    if (!questions.length) {
      root.appendChild(U.el("div", { class: "empty" }, [
        U.el("div", { class: "empty-ico", text: "🫙" }),
        U.el("p", { text: "No questions available for that selection." })
      ]));
      return;
    }

    S.markMode(c.modeId);
    S.touchStreak();
    const diffMode = S.difficulty();
    if (c.totalTime) c.totalTime = Math.round(c.totalTime * diffMode.timeScale);
    MQ.Sound.gameStart();

    let idx = 0, correct = 0, streak = 0, bestStreak = 0;
    let xpEarned = 0, coinsEarned = 0, lives = c.lives, doubled = false;
    let penalty = 0, shownAt = 0, rushed = 0, insightUsed = false;
    let timeLeft = c.totalTime, timerId = null, finished = false;

    const shell = UI.gameShell(c.title, { confirmExit: true,
      help: "Answer as many as you can. Wrong answers subtract XP, and answers " +
            "faster than 1.2 seconds pay nothing — the completion bonus is gated on accuracy, " +
            "so guessing through a run earns nothing at all." });
    root.appendChild(shell.root);

    const scoreChip  = UI.chip("0 XP");
    const streakChip = UI.chip("Streak 0");
    const livesChip  = c.lives ? UI.chip("❤️".repeat(lives)) : null;
    const timerChip  = c.totalTime ? U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft) }) : null;
    [scoreChip, streakChip, livesChip, timerChip].forEach(n => n && shell.meta.appendChild(n));

    const stage = U.el("div");
    const puBar = buildPowerupBar();
    shell.body.appendChild(stage);
    shell.body.appendChild(puBar.node);

    let card = null;

    if (c.totalTime) {
      timerId = setInterval(() => {
        timeLeft--;
        timerChip.textContent = U.fmtTime(Math.max(0, timeLeft));
        timerChip.classList.toggle("low", timeLeft <= 10);
        if (timeLeft <= 10 && timeLeft > 5) MQ.Sound.tick();
        if (timeLeft <= 5 && timeLeft > 0) MQ.Sound.tickUrgent();
        if (timeLeft <= 0) { MQ.Sound.timeout(); finish("Time!"); }
      }, 1000);
    }
    UI.onLeave(() => { clearInterval(timerId); document.removeEventListener("keydown", onKey); });
    document.addEventListener("keydown", onKey);

    function onKey(e) {
      if (!card || finished) return;
      const n = "1234".indexOf(e.key);
      if (n >= 0 && card.buttons[n] && !card.buttons[n].disabled) card.buttons[n].click();
      if (e.key === "Enter") {
        const next = U.$(".js-next", stage);
        if (next) next.click();
      }
    }

    function multiplier() { return Math.min(3, 1 + Math.floor(streak / 5) * 0.5); }

    function renderQuestion() {
      stage.innerHTML = "";
      const q = questions[idx];
      card = MQ.QuizCore.buildCard(q, {
        index: idx, total: c.totalTime ? 0 : questions.length,
        hideTopic: c.hideTopic,
        onAnswer: (chosen, isCorrect, btn) => answer(q, chosen, isCorrect, btn)
      });
      stage.appendChild(card.node);
      shownAt = performance.now();
      puBar.refresh();
    }

    function answer(q, chosen, isCorrect, btn) {
      const fb = card.reveal(chosen);
      S.recordAnswer(q.topic, isCorrect, q.id);

      // Answering faster than a human could read the question earns nothing.
      const tooFast = performance.now() - shownAt < UI.MIN_READ_MS;

      if (isCorrect) {
        correct++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        S.noteStreak(bestStreak);
        const base = 10 * (q.diff || 1);
        const gain = tooFast ? 0 : Math.round(base * multiplier() * (doubled ? 2 : 1));
        if (tooFast) rushed++;
        xpEarned += gain;
        coinsEarned += tooFast ? 0 : 2 + (q.diff || 1);
        MQ.Sound.correct();
        if (tooFast) UI.toast({ icon: "⏱️", kind: "bad", text: "Too fast to have read that — no XP awarded." });
        if (streak > 1 && streak % 5 === 0) {
          MQ.Sound.multiplier(Math.floor(streak / 5));
          UI.toast({ icon: "⚡", kind: "xp", text: `<b>${streak} streak!</b> ×${multiplier()} XP` });
          streakChip.classList.add("combo-flash");
          setTimeout(() => streakChip.classList.remove("combo-flash"), 420);
        }
        const r = btn.getBoundingClientRect();
        MQ.FX.pop(r.right - 24, r.top + r.height / 2);
        if (gain) MQ.FX.floatText(r.right - 60, r.top - 4, "+" + gain);
        if (c.dailyMode) S.progressDaily(c.dailyMode, 1);
      } else {
        if (S.data.inventory.shield > 0 && streak >= 3) {
          S.usePowerup("shield");
          MQ.Sound.shieldBlock();
          UI.toast({ icon: "🛡️", text: "<b>Buffer</b> absorbed that — streak saved." });
        } else {
          if (streak >= 5) MQ.Sound.comboBreak();
          streak = 0;
          // A wrong answer costs XP, so guessing through a run nets nothing.
          penalty += 6 * (q.diff || 1);
          if (lives > 0) {
            lives--;
            livesChip.textContent = "❤️".repeat(lives) || "💀";
          }
        }
        MQ.Sound.wrong();
        MQ.FX.shake();
      }

      scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";
      streakChip.textContent = "Streak " + streak;

      const isLast = !c.totalTime && idx >= questions.length - 1;
      const outOfLives = c.lives && lives <= 0;
      const nextBtn = U.el("button", {
        class: "btn btn-primary js-next",
        text: outOfLives || isLast ? "See results" : "Next question →",
        on: { click: () => {
          if (outOfLives || isLast) return finish(outOfLives ? "Out of lives" : null);
          idx++;
          if (idx >= questions.length) {
            // Endless (timed) modes top up the pool rather than ending early.
            questions.push(...MQ.Bank.draw(10, { topics: c.topics, group: c.group, adaptive: c.adaptive }));
          }
          renderQuestion();
        } }
      });
      fb.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [nextBtn]));
      nextBtn.focus();
    }

    function buildPowerupBar() {
      const node = U.el("div", { class: "powerups" });
      // Nightmare locks out the two power-ups that remove difficulty outright.
      const banned = diffMode.id === "nightmare" ? ["fifty", "skip"] : [];
      const defs = MQ.DATA.shop.powerups
        .filter(p => p.id !== "freeze" || c.totalTime)
        .filter(p => p.id !== "revive")
        .filter(p => !banned.includes(p.id));
      const btns = {};

      defs.forEach(p => {
        const count = U.el("span", { class: "pu-n", text: "×0" });
        const b = U.el("button", { class: "pu", type: "button", title: p.desc }, [
          U.el("span", { text: p.icon }), U.el("span", { text: p.name }), count
        ]);
        b.addEventListener("click", () => use(p.id, b));
        btns[p.id] = { b, count };
        node.appendChild(b);
      });

      function refresh() {
        defs.forEach(p => {
          const n = S.data.inventory[p.id] || 0;
          btns[p.id].b.disabled = n <= 0 || (p.id === "double" && doubled);
          btns[p.id].count.textContent = "×" + n;
        });
      }

      function use(id, btn) {
        if (!S.usePowerup(id)) return;
        if (id === "fifty") {
          MQ.Sound.puFifty();
          card && card.fiftyFifty();
          UI.toast({ icon: "✂️", text: "Two wrong options removed." });
        }
        if (id === "insight") {
          MQ.Sound.puInsight();
          insightUsed = true;
          const q = questions[idx];
          UI.toast({ icon: "🔍", ms: 6000, text: "<b>Insight:</b> " +
            U.escapeHtml(q.sub || "") + " — " + U.escapeHtml(MQ.Bank.topicFull(q.topic)) + "." });
        }
        if (id === "skip") {
          MQ.Sound.puSkip();
          UI.toast({ icon: "⏭️", text: "Skipped — streak preserved." });
          idx++;
          if (idx >= questions.length) return finish();
          renderQuestion();
        }
        if (id === "freeze") {
          MQ.Sound.puFreeze();
          timeLeft += 20;
          timerChip.textContent = U.fmtTime(timeLeft);
          UI.toast({ icon: "🧊", text: "+20 seconds." });
        }
        if (id === "shield") {
          MQ.Sound.puShield();
          UI.toast({ icon: "🛡️", text: "Buffer ready — it will absorb your next slip." });
        }
        if (id === "double") {
          MQ.Sound.puBoost();
          doubled = true;
          UI.toast({ icon: "✨", kind: "xp", text: "<b>Boost active</b> — double XP for this run." });
        }
        refresh();
        MQ.FX.burstAt(btn, { count: 14, speed: 4, size: 3, shape: "circle" });
      }

      return { node, refresh };
    }

    function finish(reason) {
      if (finished) return;
      finished = true;
      clearInterval(timerId);
      document.removeEventListener("keydown", onKey);

      // In timed modes the run ends mid-pool, so score against what was shown.
      const seen = c.totalTime ? Math.max(1, idx + 1) : Math.min(questions.length, idx + 1);
      const perfect = correct === seen && seen >= 5;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }
      if (diffMode.id === "hard") S.bump("hardWins");
      if (diffMode.id === "nightmare") S.bump("nightmareWins");
      if (c.statKey) S.bump(c.statKey, correct);

      const accuracy = seen ? correct / seen : 0;
      const netXp = Math.max(0, xpEarned - penalty);
      const newBest = S.recordScore(c.modeId, correct);

      const got = UI.award({
        xp: netXp, bonus: S.streakBonus(), accuracy,
        coins: coinsEarned + (perfect ? 30 : 0)
      });

      if (c.onFinish) c.onFinish({ correct, seen, accuracy, xp: got.xp });

      UI.results({
        title: reason || "Run complete",
        correct, total: seen, xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Best streak", bestStreak],
          ["Wrong", `−${penalty} XP`],
          insightUsed ? ["Insight", "used"] : (rushed ? ["Rushed", rushed] : ["Multiplier", "×" + multiplier()])
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    renderQuestion();
  }

  return { start };
})();
