/* Name That Compound — IUPAC nomenclature drill, both directions. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.naming = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  function buildRound(item, all, reverse) {
    if (!reverse) {
      const wrong = item.distractors.slice(0, 3);
      const opts = U.shuffle([item.name].concat(wrong));
      return {
        prompt: `What is the IUPAC name of this compound?`,
        display: item.struct,
        choices: opts,
        answer: opts.indexOf(item.name),
        why: item.why
      };
    }
    // Reverse mode: given the name, pick the structure.
    const others = U.sample(all.filter(x => x.name !== item.name), 3);
    const opts = U.shuffle([item.struct].concat(others.map(o => o.struct)));
    return {
      prompt: `Which structure is ${item.name}?`,
      display: null,
      choices: opts,
      answer: opts.indexOf(item.struct),
      why: item.why
    };
  }

  function start(root, cfg) {
    const c = Object.assign({ count: 12, modeId: "naming" }, cfg);
    S.markMode("naming");
    S.touchStreak();

    const all = CHEM.Bank.activeNaming();
    const items = U.sample(all, c.count);
    let idx = 0, correct = 0, streak = 0, best = 0, xpEarned = 0, coins = 0, finished = false;
    let penalty = 0, shownAt = 0;

    const shell = UI.gameShell("Name That Compound", { confirmExit: true });
    root.appendChild(shell.root);
    const progChip = UI.chip("1 / " + items.length);
    const streakChip = UI.chip("Streak 0");
    const xpChip = UI.chip("0 XP");
    [progChip, streakChip, xpChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div");
    shell.body.appendChild(stage);

    function render() {
      const item = items[idx];
      const reverse = Math.random() < 0.35;
      const round = buildRound(item, all, reverse);
      progChip.textContent = `${idx + 1} / ${items.length}`;
      stage.innerHTML = "";

      const card = U.el("div", { class: "qcard" }, [
        // The family (Alcohol, Ester, …) is deliberately NOT shown here — it gives
        // away the functional group. It's revealed in the feedback instead.
        U.el("div", { class: "qtag" }, [
          UI.chip("Module 7 · Organic"), UI.chip("★".repeat(item.diff))
        ]),
        U.el("div", { class: "qtext", text: round.prompt }),
        round.display
          ? U.el("div", {
              class: "formula",
              style: "text-align:center; font-size:clamp(22px,5vw,34px); margin:22px 0; letter-spacing:1px;",
              html: U.formula(round.display)
            })
          : null
      ]);

      const wrap = U.el("div", { class: "choices" });
      const btns = round.choices.map((text, i) => {
        const b = U.el("button", { class: "choice", type: "button" }, [
          U.el("span", { class: "choice-key", text: CHEM.QuizCore.KEYS[i] }),
          U.el("span", { html: U.formula(text) })
        ]);
        b.addEventListener("click", () => answer(i, b));
        wrap.appendChild(b);
        return b;
      });
      card.appendChild(wrap);
      stage.appendChild(card);
      shownAt = performance.now();

      function answer(chosen, btn) {
        btns.forEach((b, i) => {
          b.disabled = true;
          if (i === round.answer) b.classList.add("correct");
          else if (i === chosen) b.classList.add("wrong");
        });
        const ok = chosen === round.answer;
        // No question id: these rounds are generated, so they can't be replayed from the bank.
        S.recordAnswer("M7", ok, null);

        const tooFast = performance.now() - shownAt < UI.MIN_READ_MS;
        if (ok) {
          correct++; streak++; best = Math.max(best, streak);
          S.noteStreak(best);
          S.bump("namingCorrect");
          S.progressDaily("naming", 1);
          const gain = tooFast ? 0 : Math.round(12 * item.diff * Math.min(2.5, 1 + streak * 0.1));
          xpEarned += gain; coins += 3;
          CHEM.Sound.correct();
          const r = btn.getBoundingClientRect();
          CHEM.FX.pop(r.right - 24, r.top + r.height / 2);
          if (gain) CHEM.FX.floatText(r.right - 60, r.top - 4, "+" + gain);
        } else {
          streak = 0;
          penalty += 8 * item.diff;
          CHEM.Sound.wrong();
          CHEM.FX.shake();
        }
        streakChip.textContent = "Streak " + streak;
        xpChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

        const fb = U.el("div", { class: "feedback " + (ok ? "ok" : "no"), html:
          `<b>${ok ? "Correct." : `Answer: ${U.formula(round.choices[round.answer])}`}</b> ` +
          `${U.escapeHtml(round.why)}<br><span class="tiny muted">Functional group: ` +
          `${U.escapeHtml(item.family)}</span>` });
        const next = U.el("button", {
          class: "btn btn-primary",
          text: idx >= items.length - 1 ? "See results" : "Next →",
          on: { click: () => { if (idx >= items.length - 1) return finish(); idx++; render(); } }
        });
        fb.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [next]));
        card.appendChild(fb);
        next.focus();
      }
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (correct === items.length) S.bump("perfectRuns");
      const newBest = S.recordScore("naming", correct);
      const got = UI.award({
        xp: Math.max(0, xpEarned - penalty), bonus: S.streakBonus(),
        accuracy: correct / items.length, coins
      });
      UI.results({
        title: "Nomenclature run complete",
        correct, total: items.length, xp: got.xp, coins: got.coins, newBest,
        extraStats: [["Best streak", best], ["Wrong", `−${penalty} XP`]],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start };
})();
