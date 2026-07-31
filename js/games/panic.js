/* ⏱️ Table Panic — fill a grid against the clock.

   Four tables: the unit circle (exact sin/cos/tan), the derivative table, the
   integral table, and the log laws.

   Two things this mode must get right, both learned the hard way:

   · NET SCORING (§9.6). A grid with few possible answers per cell is partly
     guessable, so the score is max(0, right - wrong) and the time bonus is
     scaled by accuracy with a floor. Counting `right` alone paid well for
     random tapping.
   · A CONSTRAINED MIX (addendum C4). A randomly drawn board can come up
     almost all one answer, making "tap the same thing sixteen times" a
     legitimately perfect score. Boards are re-drawn until no single answer
     holds more than 40% of the cells. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};
MQ.DATA = MQ.DATA || {};

/* Each table is a list of rows: [prompt, answer]. The pool of options offered
   for every cell is the set of answers in the drawn board, shuffled — so the
   mode is a matching task, and a guess is worth 1/n rather than 1/2. */
MQ.DATA.panicTables = [
  { id:"unit-sin", topic:"MA-T1", name:"Unit circle · sin", cols:["Angle","sin"],
    rows:[["0","0"],["\\frac{pi}{6}","\\frac{1}{2}"],["\\frac{pi}{4}","\\frac{1}{\\sqrt{2}}"],
          ["\\frac{pi}{3}","\\frac{\\sqrt{3}}{2}"],["\\frac{pi}{2}","1"],
          ["\\frac{2pi}{3}","\\frac{\\sqrt{3}}{2}"],["\\frac{3pi}{4}","\\frac{1}{\\sqrt{2}}"],
          ["\\frac{5pi}{6}","\\frac{1}{2}"],["pi","0"],
          ["\\frac{7pi}{6}","-\\frac{1}{2}"],["\\frac{5pi}{4}","-\\frac{1}{\\sqrt{2}}"],
          ["\\frac{4pi}{3}","-\\frac{\\sqrt{3}}{2}"],["\\frac{3pi}{2}","-1"],
          ["\\frac{5pi}{3}","-\\frac{\\sqrt{3}}{2}"],["\\frac{7pi}{4}","-\\frac{1}{\\sqrt{2}}"],
          ["\\frac{11pi}{6}","-\\frac{1}{2}"]] },

  { id:"unit-cos", topic:"MA-T1", name:"Unit circle · cos", cols:["Angle","cos"],
    rows:[["0","1"],["\\frac{pi}{6}","\\frac{\\sqrt{3}}{2}"],["\\frac{pi}{4}","\\frac{1}{\\sqrt{2}}"],
          ["\\frac{pi}{3}","\\frac{1}{2}"],["\\frac{pi}{2}","0"],
          ["\\frac{2pi}{3}","-\\frac{1}{2}"],["\\frac{3pi}{4}","-\\frac{1}{\\sqrt{2}}"],
          ["\\frac{5pi}{6}","-\\frac{\\sqrt{3}}{2}"],["pi","-1"],
          ["\\frac{7pi}{6}","-\\frac{\\sqrt{3}}{2}"],["\\frac{5pi}{4}","-\\frac{1}{\\sqrt{2}}"],
          ["\\frac{4pi}{3}","-\\frac{1}{2}"],["\\frac{3pi}{2}","0"],
          ["\\frac{5pi}{3}","\\frac{1}{2}"],["\\frac{7pi}{4}","\\frac{1}{\\sqrt{2}}"],
          ["\\frac{11pi}{6}","\\frac{\\sqrt{3}}{2}"]] },

  { id:"unit-tan", topic:"MA-T1", name:"Unit circle · tan", cols:["Angle","tan"],
    rows:[["0","0"],["\\frac{pi}{6}","\\frac{1}{\\sqrt{3}}"],["\\frac{pi}{4}","1"],
          ["\\frac{pi}{3}","\\sqrt{3}"],["\\frac{pi}{2}","undefined"],
          ["\\frac{2pi}{3}","-\\sqrt{3}"],["\\frac{3pi}{4}","-1"],
          ["\\frac{5pi}{6}","-\\frac{1}{\\sqrt{3}}"],["pi","0"],
          ["\\frac{7pi}{6}","\\frac{1}{\\sqrt{3}}"],["\\frac{5pi}{4}","1"],
          ["\\frac{4pi}{3}","\\sqrt{3}"],["\\frac{3pi}{2}","undefined"],
          ["\\frac{5pi}{3}","-\\sqrt{3}"],["\\frac{7pi}{4}","-1"],
          ["\\frac{11pi}{6}","-\\frac{1}{\\sqrt{3}}"]] },

  { id:"derivs", topic:"MA-C2", name:"Derivative table", cols:["f(x)","f'(x)"],
    rows:[["x^n","nx^{n-1}"],["e^{x}","e^{x}"],["e^{kx}","ke^{kx}"],["ln x","\\frac{1}{x}"],
          ["ln f(x)","\\frac{f'(x)}{f(x)}"],["sin x","cos x"],["cos x","-sin x"],
          ["tan x","sec^2 x"],["sin kx","k cos kx"],["cos kx","-k sin kx"],
          ["\\sqrt{x}","\\frac{1}{2\\sqrt{x}}"],["\\frac{1}{x}","-\\frac{1}{x^2}"],
          ["a^{x}","a^{x}ln a"],["x e^{x}","e^{x}(1+x)"],
          ["(ax+b)^n","an(ax+b)^{n-1}"],["c (a constant)","0"]] },

  { id:"integrals", topic:"MA-C4", name:"Integral table", cols:["f(x)","int f(x) dx"],
    rows:[["x^n","\\frac{x^{n+1}}{n+1}"],["\\frac{1}{x}","ln|x|"],["e^{x}","e^{x}"],
          ["e^{ax}","\\frac{1}{a}e^{ax}"],["sin x","-cos x"],["cos x","sin x"],
          ["sin ax","-\\frac{1}{a}cos ax"],["cos ax","\\frac{1}{a}sin ax"],
          ["sec^2 x","tan x"],["(ax+b)^n","\\frac{(ax+b)^{n+1}}{a(n+1)}"],
          ["\\frac{f'(x)}{f(x)}","ln|f(x)|"],["\\sqrt{x}","\\frac{2}{3}x^{\\frac{3}{2}}"],
          ["\\frac{1}{x^2}","-\\frac{1}{x}"],["a^{x}","\\frac{a^{x}}{ln a}"],
          ["1","x"],["\\frac{1}{ax+b}","\\frac{1}{a}ln|ax+b|"]] },

  { id:"logs", topic:"MA-E1", name:"Index and log laws", cols:["Expression","Equals"],
    rows:[["log(xy)","log x + log y"],["log\\frac{x}{y}","log x - log y"],["log x^n","n log x"],
          ["log_a 1","0"],["log_a a","1"],["log_b a","\\frac{ln a}{ln b}"],
          ["a^m a^n","a^{m+n}"],["\\frac{a^m}{a^n}","a^{m-n}"],["(a^m)^n","a^{mn}"],
          ["a^{-n}","\\frac{1}{a^n}"],["a^{\\frac{1}{n}}","\\sqrt[n]{a}"],["a^0","1"],
          ["e^{ln x}","x"],["ln e^{x}","x"],["log\\frac{1}{x}","-log x"],["2^{10}","1024"]] },

  /* ── Extension 1 ── */
  { id:"invtrig", topic:"ME-T1", name:"Inverse trig facts", cols:["Item","Value"],
    rows:[["Range of sin^{-1}x","[-\\frac{pi}{2}, \\frac{pi}{2}]"],["Range of cos^{-1}x","[0, pi]"],
          ["Range of tan^{-1}x","(-\\frac{pi}{2}, \\frac{pi}{2})"],["Domain of sin^{-1}x","[-1, 1]"],
          ["Domain of tan^{-1}x","all real x"],["sin^{-1}x + cos^{-1}x","\\frac{pi}{2}"],
          ["\\frac{d}{dx}sin^{-1}x","\\frac{1}{\\sqrt{1-x^2}}"],
          ["\\frac{d}{dx}cos^{-1}x","-\\frac{1}{\\sqrt{1-x^2}}"],
          ["\\frac{d}{dx}tan^{-1}x","\\frac{1}{1+x^2}"],
          ["int\\frac{dx}{\\sqrt{a^2-x^2}}","sin^{-1}\\frac{x}{a} + c"],
          ["int\\frac{dx}{a^2+x^2}","\\frac{1}{a}tan^{-1}\\frac{x}{a} + c"],
          ["sin^{-1}(\\frac{1}{2})","\\frac{pi}{6}"],["cos^{-1}(0)","\\frac{pi}{2}"],
          ["tan^{-1}(1)","\\frac{pi}{4}"],["sin^{-1}(-1)","-\\frac{pi}{2}"],
          ["cos^{-1}(-1)","pi"]] },

  { id:"identities", topic:"ME-T2", name:"Further identities", cols:["Expression","Equals"],
    rows:[["sin(A+B)","sin A cos B + cos A sin B"],["sin(A-B)","sin A cos B - cos A sin B"],
          ["cos(A+B)","cos A cos B - sin A sin B"],["cos(A-B)","cos A cos B + sin A sin B"],
          ["tan(A+B)","\\frac{tan A + tan B}{1 - tan A tan B}"],["sin 2A","2 sin A cos A"],
          ["cos 2A","2cos^2 A - 1"],["tan 2A","\\frac{2tan A}{1 - tan^2 A}"],
          ["sin^2 x","\\frac{1 - cos 2x}{2}"],["cos^2 x","\\frac{1 + cos 2x}{2}"],
          ["sin x (t-formula)","\\frac{2t}{1+t^2}"],["cos x (t-formula)","\\frac{1-t^2}{1+t^2}"],
          ["tan x (t-formula)","\\frac{2t}{1-t^2}"],["R for a sin x + b cos x","\\sqrt{a^2+b^2}"],
          ["2sin A cos B","sin(A+B) + sin(A-B)"],["2sin A sin B","cos(A-B) - cos(A+B)"]] },

  { id:"vectors", topic:"ME-V1", name:"Vectors and projectiles", cols:["Quantity","Formula"],
    rows:[["|xi + yj|","\\sqrt{x^2+y^2}"],["\\vec{u} \\cdot \\vec{v} (components)","u_1v_1 + u_2v_2"],
          ["\\vec{u} \\cdot \\vec{v} (angle)","|\\vec{u}||\\vec{v}|cos theta"],
          ["Perpendicular test","\\vec{u} \\cdot \\vec{v} = 0"],
          ["Scalar projection","\\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{v}|}"],
          ["Vector projection","\\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{v}|^2}\\vec{v}"],
          ["Unit vector","\\frac{\\vec{u}}{|\\vec{u}|}"],["Midpoint of AB","\\frac{1}{2}(\\vec{a}+\\vec{b})"],
          ["Projectile x(t)","Vt cos theta"],["Projectile y(t)","Vt sin theta - \\frac{1}{2}gt^2"],
          ["Time of flight","\\frac{2V sin theta}{g}"],["Range","\\frac{V^2 sin 2theta}{g}"],
          ["Maximum height","\\frac{V^2 sin^2 theta}{2g}"],["Angle for maximum range","45 deg"],
          ["Speed at the apex","V cos theta"],["\\vec{u} \\cdot \\vec{u}","|\\vec{u}|^2"]] }
];

MQ.Games.panic = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  const tables = () => MQ.DATA.panicTables.filter(t => MQ.DATA.tierEnabled(t.topic));

  /* No single answer may occupy more than this share of the board. Without the
     constraint, "tap the same option every time" is occasionally a perfect
     score — which is a farm, not a skill. */
  const MAX_SHARE = 0.4;

  /** Draw `n` rows from a table with a constrained answer mix. Exported for tests. */
  function drawBoard(table, n) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const rows = U.sample(table.rows, Math.min(n, table.rows.length));
      const counts = {};
      rows.forEach(r => { counts[r[1]] = (counts[r[1]] || 0) + 1; });
      const worst = Math.max.apply(null, Object.values(counts));
      if (worst / rows.length <= MAX_SHARE) return rows;
    }
    // Fall back to the least-repetitive draw we can construct deterministically:
    // one row per distinct answer.
    const seen = new Set();
    const out = [];
    for (const r of U.shuffle(table.rows)) {
      if (seen.has(r[1])) continue;
      seen.add(r[1]);
      out.push(r);
      if (out.length >= n) break;
    }
    return out;
  }

  function start(root, cfg) {
    const c = Object.assign({ modeId: "panic", title: "⏱️ Table Panic", rows: 10, timeLimit: 150 }, cfg);

    const table = c.table
      ? MQ.DATA.panicTables.find(t => t.id === c.table) || U.pick(tables())
      : U.pick(tables());
    const rows = drawBoard(table, c.rows);
    // The option pool for every cell: the distinct answers on this board.
    const options = U.shuffle(Array.from(new Set(rows.map(r => r[1]))));

    S.markMode(c.modeId);
    S.touchStreak();
    const diffMode = S.difficulty();
    let timeLeft = Math.round(c.timeLimit * diffMode.timeScale);
    MQ.Sound.gameStart();

    const shell = UI.gameShell(c.title + " · " + table.name, { confirmExit: true,
      help: "Tap a cell, then pick its value from the list. Scoring is NET — every wrong " +
            "entry cancels a right one — and the time bonus needs at least 75% accuracy, " +
            "so tapping at random is worth nothing." });
    root.appendChild(shell.root);

    const filledChip = UI.chip("0 / " + rows.length);
    const timerChip = U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft) });
    [filledChip, timerChip].forEach(n => shell.meta.appendChild(n));

    const answers = new Array(rows.length).fill(null);
    let finished = false, activeCell = null;

    MQ.__current = { kind: "panic", rows: rows.map(r => r[1]) };
    const tbl = U.el("table", { class: "ptable" });
    const thead = U.el("thead", {}, [U.el("tr", {}, table.cols.map(h =>
      U.el("th", { class: "math", html: U.math(h) })))]);
    const tbody = U.el("tbody");
    const cellNodes = [];

    rows.forEach((row, i) => {
      const btn = U.el("button", { class: "pcell", type: "button", text: "—" });
      btn.addEventListener("click", () => openPicker(i, btn));
      cellNodes.push(btn);
      tbody.appendChild(U.el("tr", {}, [
        U.el("td", { class: "math", style: "padding:6px 8px", html: U.math(row[0]) }),
        U.el("td", {}, [btn])
      ]));
    });
    tbl.appendChild(thead);
    tbl.appendChild(tbody);
    shell.body.appendChild(U.el("div", { class: "ptable-wrap" }, [tbl]));

    const submitBtn = U.el("button", { class: "btn btn-primary btn-block", text: "Submit grid" });
    submitBtn.addEventListener("click", () => finish("Submitted"));
    shell.body.appendChild(submitBtn);

    const timerId = setInterval(() => {
      timeLeft--;
      timerChip.textContent = U.fmtTime(Math.max(0, timeLeft));
      timerChip.classList.toggle("low", timeLeft <= 15);
      if (timeLeft <= 10 && timeLeft > 5) MQ.Sound.tick();
      if (timeLeft <= 5 && timeLeft > 0) MQ.Sound.tickUrgent();
      if (timeLeft <= 0) { MQ.Sound.timeout(); finish("Time!"); }
    }, 1000);
    UI.onLeave(() => clearInterval(timerId));

    function openPicker(i, btn) {
      if (finished) return;
      activeCell = i;
      const box = U.el("div", {}, [
        U.el("h2", { class: "math", html: U.math(rows[i][0]) }),
        U.el("p", { class: "muted", text: "Pick its value." }),
        U.el("div", { class: "grid" }, options.map(opt =>
          U.el("button", { class: "choice", type: "button" }, [
            U.el("span", { class: "math", html: U.math(opt) })
          ])
        ).map((node, k) => {
          node.addEventListener("click", () => {
            answers[i] = options[k];
            btn.textContent = "";
            btn.appendChild(U.el("span", { class: "math", html: U.math(options[k]) }));
            btn.classList.add("filled");
            MQ.Sound.gridFill();
            UI.closeModal();
            refresh();
          });
          return node;
        })),
        U.el("button", { class: "btn btn-ghost btn-block", style: "margin-top:10px",
          text: "Clear this cell", on: { click: () => {
            answers[i] = null;
            btn.textContent = "—";
            btn.classList.remove("filled");
            UI.closeModal();
            refresh();
          } } })
      ]);
      UI.modal(box);
    }

    /* G1: one reflow for the whole board, not one per cell. The
       `void offsetWidth` idiom that restarts a CSS animation forces a
       synchronous layout, and inside a per-cell loop that is up to N forced
       layouts per repaint. */
    function refresh() {
      const filled = answers.filter(a => a !== null).length;
      filledChip.textContent = filled + " / " + rows.length;
      submitBtn.disabled = filled === 0;
    }
    refresh();

    function finish(reason) {
      if (finished) return;
      finished = true;
      clearInterval(timerId);
      UI.closeModal();

      let right = 0, wrong = 0;
      answers.forEach((a, i) => {
        if (a === null) return;
        const ok = a === rows[i][1];
        if (ok) right++; else wrong++;
        cellNodes[i].classList.add(ok ? "right" : "wrongc");
        cellNodes[i].disabled = true;
      });
      // Show the correct value in every cell that was wrong or left blank.
      answers.forEach((a, i) => {
        if (a === rows[i][1]) return;
        cellNodes[i].innerHTML = "";
        cellNodes[i].appendChild(U.el("span", { class: "math", html: U.math(rows[i][1]) }));
        cellNodes[i].disabled = true;
      });

      /* NET scoring. `right` alone rewards filling every cell at random. */
      const net = Math.max(0, right - wrong);
      const accuracy = rows.length ? right / rows.length : 0;
      const perfect = right === rows.length && wrong === 0;

      S.bump("gridsFilled");
      if (perfect) { S.bump("perfectGrids"); S.bump("perfectRuns"); MQ.Sound.perfect(); }
      S.recordAnswer(table.topic, perfect, null);
      S.progressDaily("panic", 1);

      // The time bonus needs real accuracy, with a hard floor at 75%.
      const timeBonus = accuracy >= 0.75 ? Math.round(timeLeft * 0.8 * accuracy) : 0;
      const newBest = S.recordScore(c.modeId, net);

      const got = UI.award({
        xp: net * 9, bonus: timeBonus, accuracy,
        coins: net * 2 + (perfect ? 30 : 0)
      });

      UI.results({
        title: reason === "Time!" ? "Out of time" : (perfect ? "Perfect grid" : "Grid submitted"),
        correct: right, total: rows.length, xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Net", right + " − " + wrong + " = " + net],
          ["Time left", U.fmtTime(Math.max(0, timeLeft))],
          ["Time bonus", timeBonus ? "+" + timeBonus : "none (<75%)"]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    return () => clearInterval(timerId);
  }

  return { start, drawBoard, tables, MAX_SHARE };
})();
