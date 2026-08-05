/* Precipitation Panic — fill in a solubility grid against the clock. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.precipitate = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  function start(root, cfg) {
    const c = Object.assign({ rows: 4, cols: 4, timeLimit: 150 }, cfg);
    S.markMode("precipitate");
    S.touchStreak();
    c.timeLimit = Math.round(c.timeLimit * S.difficulty().timeScale);
    CHEM.Sound.gameStart();

    const SOL = CHEM.DATA.solubility;

    /* Draw a board that actually discriminates. Sampling rows and columns independently
       can produce a sub-grid that is almost entirely one state — and on an all-precipitate
       board, marking every cell PPT is a genuinely perfect score, indistinguishable from
       knowing the solubility rules. (Measured: one such draw paid 363 XP for sixteen
       identical taps.) Re-draw until neither state holds more than 65% of the cells, so a
       single-answer strategy can never do better than mediocre. */
    let cations, anions;
    for (let attempt = 0; ; attempt++) {
      cations = U.sample(SOL.cations, c.rows);
      anions = U.sample(SOL.anions, c.cols);
      let soluble = 0;
      cations.forEach(ct => anions.forEach(an => { if (SOL.grid[ct.sym][an.sym]) soluble++; }));
      const frac = soluble / (c.rows * c.cols);
      if (frac >= 0.35 && frac <= 0.65) break;
      // The full table is near-balanced, so a valid draw is common; this is just a guard.
      if (attempt >= 60) break;
    }

    // marks[cation.sym][anion.sym] = null | "ppt" | "sol"
    const marks = {};
    cations.forEach(ct => { marks[ct.sym] = {}; anions.forEach(an => (marks[ct.sym][an.sym] = null)); });

    let timeLeft = c.timeLimit, timerId = null, checked = false, finished = false;

    const shell = UI.gameShell("Precipitation Panic", { tools: { notes: true },  confirmExit: true });
    root.appendChild(shell.root);
    const filledChip = UI.chip(`0 / ${c.rows * c.cols} filled`);
    const timerChip = U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft) });
    [filledChip, timerChip].forEach(n => shell.meta.appendChild(n));

    shell.body.appendChild(U.el("div", { class: "qcard" }, [
      U.el("div", { class: "qtag" }, [UI.chip("Module 5 · Solubility"), UI.chip("Module 8 · Analysis")]),
      U.el("p", { html:
        "Tap each cell to predict what happens when the two ions meet in solution. " +
        "Tap again to cycle: <b>blank → precipitate → soluble</b>. Fill the whole board, then check it." })
    ]));

    const table = U.el("table", { class: "ptable" });
    const grid = U.el("div", { class: "qcard" }, [table]);
    shell.body.appendChild(grid);

    const feedback = U.el("div");
    shell.body.appendChild(feedback);

    const checkBtn = U.el("button", {
      class: "btn btn-primary btn-block", text: "Check board",
      on: { click: () => check(false) }
    });
    shell.body.appendChild(checkBtn);

    const cellNodes = {};

    function build() {
      table.innerHTML = "";
      const head = U.el("tr", {}, [U.el("th", { text: "" })].concat(
        anions.map(an => U.el("th", { html: U.formula(an.sym) }))
      ));
      table.appendChild(head);

      cations.forEach(ct => {
        const tr = U.el("tr", {}, [U.el("th", { html: U.formula(ct.sym) })]);
        anions.forEach(an => {
          const btn = U.el("button", { class: "pcell", type: "button", text: "?" });
          btn.addEventListener("click", () => cycle(ct, an, btn));
          cellNodes[ct.sym + "|" + an.sym] = btn;
          tr.appendChild(U.el("td", {}, [btn]));
        });
        table.appendChild(tr);
      });
    }

    function cycle(ct, an, btn) {
      if (checked) return;
      const cur = marks[ct.sym][an.sym];
      const next = cur === null ? "ppt" : cur === "ppt" ? "sol" : null;
      marks[ct.sym][an.sym] = next;
      btn.classList.toggle("ppt", next === "ppt");
      btn.classList.toggle("sol", next === "sol");
      btn.textContent = next === "ppt" ? "PPT" : next === "sol" ? "SOL" : "?";
      if (next === "ppt") CHEM.Sound.precipitate(); else CHEM.Sound.tap();
      updateCount();
    }

    function updateCount() {
      let n = 0;
      cations.forEach(ct => anions.forEach(an => { if (marks[ct.sym][an.sym]) n++; }));
      filledChip.textContent = `${n} / ${c.rows * c.cols} filled`;
      return n;
    }

    /** `force` is used when the clock runs out — unfilled cells simply count as wrong. */
    function check(force) {
      if (checked) return;
      const filled = updateCount();
      if (!force && filled < c.rows * c.cols) {
        feedback.innerHTML = "";
        feedback.appendChild(U.el("div", { class: "feedback no", text: "Fill every cell before checking." }));
        CHEM.Sound.wrong();
        return;
      }
      checked = true;
      clearInterval(timerId);
      checkBtn.disabled = true;

      let right = 0;
      const misses = [];
      cations.forEach(ct => anions.forEach(an => {
        const soluble = SOL.grid[ct.sym][an.sym];
        const guess = marks[ct.sym][an.sym];
        const ok = (guess === "sol") === soluble;
        const btn = cellNodes[ct.sym + "|" + an.sym];
        btn.classList.add(ok ? "right" : "wrongc");
        if (ok) right++;
        else {
          btn.textContent = soluble ? "SOL" : "PPT";
          misses.push({ ct, an, soluble });
        }
      }));

      const total = c.rows * c.cols;
      const perfect = right === total;
      if (perfect) { CHEM.Sound.perfect(); CHEM.FX.confetti(100); S.bump("perfectPrecipitation"); }
      else { CHEM.Sound.wrong(); CHEM.FX.shake(); }

      feedback.innerHTML = "";
      if (misses.length) {
        const list = U.el("div", { class: "feedback no" }, [
          U.el("div", { html: `<b>${misses.length} cell${misses.length === 1 ? "" : "s"} wrong.</b> Review these:` })
        ]);
        misses.slice(0, 8).forEach(m => {
          const noteKey = m.ct.sym + "|" + m.an.sym;
          const extra = SOL.notes[noteKey] ? " — " + SOL.notes[noteKey] : "";
          list.appendChild(U.el("div", { class: "tiny", style: "margin-top:6px", html:
            `${U.formula(m.ct.sym)} + ${U.formula(m.an.sym)} → <b>${m.soluble ? "soluble" : "precipitate"}</b>${U.escapeHtml(extra)}` }));
        });
        feedback.appendChild(list);
      } else {
        feedback.appendChild(U.el("div", { class: "feedback ok", html:
          "<b>Flawless board.</b> Every solubility rule applied correctly." }));
      }

      finish(right, total, perfect);
    }

    function finish(right, total, perfect) {
      if (finished) return;
      finished = true;

      /* Score the NET result: every wrong cell cancels a right one. Guessing a
         two-state grid gets ~50% by chance, so raw `right` would pay out for
         random clicking. The speed bonus is also scaled by accuracy, otherwise
         filling the board blindly in four seconds is the optimal strategy.

         `net` alone is not sufficient. The board is a random sub-grid of the full
         solubility table, and while the whole table is near-balanced (25 soluble to
         23 insoluble) any given draw need not be. On a precipitate-heavy board,
         marking every cell PPT still nets positive — worth ~49 XP for knowing nothing.
         So pay only for the accuracy earned ABOVE the 50% chance baseline: `edge` is
         0 below the baseline and 1 at perfect, which zeroes any single-answer strategy
         however the sub-grid happens to fall. The baseline sits slightly above 50% because
         the board is only *near* balanced, so pure chance can drift a little past half. */
      const wrong = total - right;
      const accuracy = total ? right / total : 0;
      const net = Math.max(0, right - wrong);
      const edge = Math.max(0, (accuracy - 0.55) / 0.45);
      const timeBonus = accuracy >= 0.75 ? Math.max(0, timeLeft) * 1.2 * accuracy : 0;
      const xp = Math.round(net * 22 * edge + timeBonus + (perfect ? 80 : 0));
      const coins = Math.round(net * 4 * edge) + (perfect ? 70 : 0);

      S.progressDaily("precipitate", 1);
      if (perfect) S.bump("perfectRuns");
      const newBest = S.recordScore("precipitate", net);

      const got = UI.award({ xp, coins, bonus: S.streakBonus(), accuracy });
      setTimeout(() => UI.results({
        title: perfect ? "Flawless solubility board" : "Board checked",
        correct: right, total, xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Net score", `${right} − ${total - right}`],
          ["Time left", U.fmtTime(Math.max(0, timeLeft))],
          ["Speed bonus", "+" + Math.round(timeBonus)]
        ],
        onAgain: () => UI.handleRoute()
      }), 900);
    }

    build();
    timerId = setInterval(() => {
      timeLeft--;
      timerChip.textContent = U.fmtTime(Math.max(0, timeLeft));
      timerChip.classList.toggle("low", timeLeft <= 15);
      if (timeLeft <= 0) { clearInterval(timerId); check(true); }
    }, 1000);
    UI.onLeave(() => clearInterval(timerId));
  }

  return { start };
})();
