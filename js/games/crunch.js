/* 🔢 Calculation Crunch — endless procedurally generated numeric practice.

   Every question comes from MQ.Gen, which picks its answer first and derives
   the inputs from it, so an unanswerable question cannot be generated. See the
   header of js/data/generators.js.

   Two anti-farm details worth naming:
   · There is NO per-question score floor. A floored award plus a completion
     bonus is exactly the farm the addendum's C1 describes — flailing does
     eventually land on an answer.
   · The completion bonus is gated on FIRST-ATTEMPT accuracy, not on
     "got there in the end". Resubmitting costs you. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.crunch = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI, E = MQ.Expr;

  const SYMBOLS = ["pi", "√", "^", "/", "(", ")", "e", "-"];

  function start(root, cfg) {
    const c = Object.assign({ modeId: "crunch", title: "🔢 Calculation Crunch", count: 10 }, cfg);

    S.markMode(c.modeId);
    S.touchStreak();
    MQ.Sound.gameStart();

    let idx = 0, correct = 0, firstTry = 0, attemptsThisQ = 0, totalAttempts = 0;
    let xpEarned = 0, coinsEarned = 0, penalty = 0, streak = 0, bestStreak = 0;
    let shownAt = 0, finished = false, item = null;

    const shell = UI.gameShell(c.title, { confirmExit: true,
      help: "Type the answer. You can enter exact forms — <code>pi/4</code>, " +
            "<code>sqrt(2)</code>, <code>3/8</code>, <code>ln(3)</code>, <code>e^2</code> — and the " +
            "preview shows how the app read what you typed. Wrong attempts cost XP, and only " +
            "first-attempt answers count towards the completion bonus." });
    root.appendChild(shell.root);

    const scoreChip = UI.chip("0 XP");
    const progChip = UI.chip("1 / " + c.count);
    const streakChip = UI.chip("Streak 0");
    [progChip, scoreChip, streakChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    UI.onLeave(() => document.removeEventListener("keydown", onKey));
    document.addEventListener("keydown", onKey);
    let submitBtn = null, input = null;

    function onKey(e) {
      if (finished) return;
      if (e.key === "Enter") {
        e.preventDefault();
        const next = U.$(".js-next", stage);
        if (next) next.click();
        else if (submitBtn && !submitBtn.disabled) submitBtn.click();
      }
    }

    function render() {
      stage.innerHTML = "";
      item = MQ.Gen.draw({});
      attemptsThisQ = 0;
      shownAt = performance.now();
      progChip.textContent = (idx + 1) + " / " + c.count;

      MQ.__current = { kind: "typed", answer: item.answer, gen: item.gen };
      const card = U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          U.el("span", { class: "chip", text: MQ.Bank.topicName(item.topic) }),
          UI.tierChip(item.topic),
          U.el("span", { class: "chip", text: "★".repeat(item.diff) }),
          U.el("span", { class: "chip", text: "generated" })
        ]),
        U.el("div", { class: "qtext math", html: U.math(item.prompt) }),
        item.hint ? U.el("div", { class: "qsub", text: item.hint }) : null
      ]);

      input = U.el("input", {
        class: "numin", type: "text", inputmode: "text",
        autocomplete: "off", autocapitalize: "off", spellcheck: "false",
        placeholder: item.answerType === "money" ? "e.g. 1234.56" : "your answer"
      });
      const preview = U.el("div", { class: "live-preview", text: " " });
      const unit = item.unit
        ? U.el("div", { class: "unit-hint", html: "Answer in " + U.math(item.unit) })
        : null;

      /* The live preview shows how the PARSER read the input. This is the single
         best affordance in a maths app: "3/4x" is genuinely ambiguous, and
         showing which reading was taken before the student commits removes a
         whole class of "but I typed the right answer" complaints. It reveals
         nothing about whether the answer is correct, so it carries no penalty. */
      function updatePreview() {
        const raw = input.value.trim();
        preview.className = "live-preview";
        if (!raw) { preview.textContent = " "; return; }
        const r = E.tryParse(raw);
        if (!r.ok) {
          preview.classList.add("bad");
          preview.textContent = r.error;
          return;
        }
        const v = E.evaluate(r.ast, {});
        if (!isFinite(v)) {
          preview.classList.add("bad");
          preview.textContent = "That doesn't evaluate to a number.";
          return;
        }
        preview.innerHTML = "= " + U.escapeHtml(U.fmtNum(U.sigFig(v, 8)));
      }
      input.addEventListener("input", () => { MQ.Sound.type(); updatePreview(); });

      const pad = U.el("div", { class: "symbol-pad" }, SYMBOLS.map(sym =>
        U.el("button", { class: "sym", type: "button", text: sym, on: { click: () => {
          input.value += sym === "√" ? "sqrt(" : sym;
          input.focus();
          updatePreview();
          MQ.Sound.tap();
        } } })));

      submitBtn = U.el("button", { class: "btn btn-primary btn-block", text: "Submit" });
      submitBtn.addEventListener("click", () => submit(preview));

      stage.appendChild(card);
      stage.appendChild(U.el("div", { class: "grid" }, [input, preview, unit, pad, submitBtn]));
      input.focus();
    }

    function isRight(raw) {
      if (item.answerType === "money") {
        // Money is exact to the cent, never within a percentage.
        const v = U.parseNum(raw);
        return v !== null && Math.abs(v - item.answer) < 0.005;
      }
      if (item.answerType === "integer") {
        const v = U.parseNum(raw);
        return v !== null && Math.abs(v - item.answer) < 1e-6;
      }
      return U.numClose(raw, item.answer, item.tol === undefined ? 0.005 : item.tol);
    }

    function submit(preview) {
      const raw = input.value.trim();
      if (!raw) { input.classList.add("err"); setTimeout(() => input.classList.remove("err"), 400); return; }

      attemptsThisQ++;
      totalAttempts++;
      const tooFast = performance.now() - shownAt < UI.MIN_READ_MS;
      const ok = isRight(raw);

      if (!ok) {
        MQ.Sound.wrong();
        MQ.FX.shake();
        input.classList.add("err");
        setTimeout(() => input.classList.remove("err"), 400);
        streak = 0;
        streakChip.textContent = "Streak 0";
        // Every wrong attempt costs, so resubmitting is never free.
        penalty += 5 * item.diff;
        scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";
        preview.classList.add("bad");
        preview.textContent = attemptsThisQ >= 3
          ? "Still not right. The answer is " + U.fmtNum(U.sigFig(item.answer, 6)) + "."
          : "Not right — try again.";
        if (attemptsThisQ >= 3) reveal(false);
        return;
      }

      correct++;
      if (attemptsThisQ === 1) firstTry++;
      streak++;
      bestStreak = Math.max(bestStreak, streak);
      S.noteStreak(bestStreak);
      S.bump("calcsCorrect");
      S.recordAnswer(item.topic, attemptsThisQ === 1, null);
      S.progressDaily("crunch", 1);

      // No floor. A first-attempt answer pays; a fourth attempt pays a fraction.
      const base = 10 * item.diff;
      const gain = tooFast ? 0 : Math.round(base / attemptsThisQ);
      xpEarned += gain;
      coinsEarned += tooFast ? 0 : 2 + item.diff;
      scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";
      streakChip.textContent = "Streak " + streak;

      MQ.Sound.correct();
      if (tooFast) UI.toast({ icon: "⏱️", kind: "bad", text: "Too fast to have worked that out — no XP awarded." });
      MQ.FX.burstAt(submitBtn, { count: 18, speed: 5, size: 4, shape: "circle" });
      reveal(true, gain);
    }

    /* H1: never cover the worked solution with a results overlay. The student
       reads the explanation, then chooses to move on. */
    function reveal(ok, gain) {
      submitBtn.disabled = true;
      input.disabled = true;
      const fb = U.el("div", { class: "feedback " + (ok ? "ok" : "no") }, [
        U.el("div", { class: "math", html:
          `<b>${ok ? "Correct." : "The answer was " + U.escapeHtml(U.fmtNum(U.sigFig(item.answer, 6))) + "."}</b> ` +
          U.math(item.why) }),
        gain ? U.el("div", { class: "tiny muted", style: "margin-top:6px",
          text: `+${gain} XP` + (attemptsThisQ > 1 ? ` (${U.ordinal(attemptsThisQ)} attempt)` : "") }) : null,
        U.el("div", { class: "row", style: "margin-top:12px" }, [
          U.el("button", {
            class: "btn btn-primary js-next",
            text: idx >= c.count - 1 ? "See results" : "Next question →",
            on: { click: () => {
              if (idx >= c.count - 1) return finish();
              idx++;
              render();
            } }
          })
        ])
      ]);
      stage.appendChild(fb);
      U.$(".js-next", stage).focus();
    }

    function finish() {
      if (finished) return;
      finished = true;
      document.removeEventListener("keydown", onKey);

      /* Score first-attempt accuracy, not "solved eventually". Without this,
         a bot that tries everything scores a full completion bonus. */
      const accuracy = c.count ? firstTry / c.count : 0;
      const efficiency = totalAttempts ? c.count / totalAttempts : 0;
      const perfect = firstTry === c.count && c.count >= 5;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }

      const netXp = Math.max(0, xpEarned - penalty);
      const newBest = S.recordScore(c.modeId, firstTry);

      const got = UI.award({
        xp: netXp,
        bonus: Math.round(S.streakBonus() * efficiency),
        accuracy,
        coins: coinsEarned + (perfect ? 30 : 0)
      });

      UI.results({
        title: "Crunch complete",
        correct: firstTry, total: c.count, xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Solved", correct + "/" + c.count],
          ["Attempts", totalAttempts],
          ["Efficiency", Math.round(efficiency * 100) + "%"]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start };
})();
