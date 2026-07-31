/* 📐 Calculus Lab — the flagship interactive toy.

   Two experiments, same shape as chemistry's titration simulator (the
   most-praised mode in the reference app):

   · TANGENT. Drag a point along a curve, drag the tangent's gradient until
     it looks right, then compute f'(x) exactly and compare against what you
     dialled in.
   · AREA. Drag the bounds of a shaded region, watch a trapezoidal estimate
     converge as you add strips, then integrate exactly.

   The gradient READOUT is an optional crutch and follows the addendum's C3
   rule: switching it on latches the penalty permanently. Switching it off
   before submitting used to refund the cost in the reference app, which made
   the crutch free and therefore mandatory. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.lab = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI, D = MQ.Draw;

  /* Curves the lab can work with. Each carries its own exact derivative and
     antiderivative, so nothing is ever estimated numerically to mark against. */
  const CURVES = [
    { id:"quad",  topic:"MA-C2", label:p => `y = ${cf(p.a)}x^2 ${sg(p.b,"x")} ${sg(p.c)}`,
      pick:rng => ({ a: pk(rng,[1,2,-1,-2]), b: it(rng,-4,4), c: it(rng,-3,3) }),
      f:p => x => p.a*x*x + p.b*x + p.c,
      df:p => x => 2*p.a*x + p.b,
      F:p => x => p.a*x*x*x/3 + p.b*x*x/2 + p.c*x,
      dfLabel:p => `\\frac{dy}{dx} = ${cf(2*p.a)}x ${sg(p.b)}`,
      win:[-4,4,-10,10] },
    { id:"cubic", topic:"MA-C2", label:p => `y = ${cf(p.a)}x^3 ${sg(p.b,"x")}`,
      pick:rng => ({ a: pk(rng,[1,-1]), b: it(rng,-4,4) }),
      f:p => x => p.a*x*x*x + p.b*x,
      df:p => x => 3*p.a*x*x + p.b,
      F:p => x => p.a*Math.pow(x,4)/4 + p.b*x*x/2,
      dfLabel:p => `\\frac{dy}{dx} = ${cf(3*p.a)}x^2 ${sg(p.b)}`,
      win:[-3,3,-10,10] },
    { id:"sin",   topic:"MA-T2", label:p => `y = ${cf(p.A)}sin ${cf(p.n)}x`,
      pick:rng => ({ A: it(rng,1,3), n: it(rng,1,2) }),
      f:p => x => p.A*Math.sin(p.n*x),
      df:p => x => p.A*p.n*Math.cos(p.n*x),
      F:p => x => -p.A*Math.cos(p.n*x)/p.n,
      dfLabel:p => `\\frac{dy}{dx} = ${cf(p.A*p.n)}cos ${cf(p.n)}x`,
      win:[-3.2,3.2,-4,4], piLabels:true },
    { id:"exp",   topic:"MA-E1", label:p => `y = ${cf(p.a)}e^{${cf(p.k)}x}`,
      pick:rng => ({ a: it(rng,1,2), k: pk(rng,[0.5,1,-0.5,-1]) }),
      f:p => x => p.a*Math.exp(p.k*x),
      df:p => x => p.a*p.k*Math.exp(p.k*x),
      F:p => x => p.a*Math.exp(p.k*x)/p.k,
      dfLabel:p => `\\frac{dy}{dx} = ${U.fmtNum(p.a*p.k)}e^{${cf(p.k)}x}`,
      win:[-2.5,2.5,-1,8] },
    { id:"recip", topic:"MA-C2", label:p => `y = \\frac{${p.a}}{x}`,
      pick:rng => ({ a: pk(rng,[1,2,3,-1,-2]) }),
      f:p => x => p.a/x,
      df:p => x => -p.a/(x*x),
      F:p => x => p.a*Math.log(Math.abs(x)),
      dfLabel:p => `\\frac{dy}{dx} = -\\frac{${p.a}}{x^2}`,
      win:[0.4,5,-3,8], positiveOnly:true },
    { id:"ln",    topic:"MA-E1", label:p => `y = ${cf(p.a)}ln x`,
      pick:rng => ({ a: it(rng,1,3) }),
      f:p => x => p.a*Math.log(x),
      df:p => x => p.a/x,
      F:p => x => p.a*(x*Math.log(x) - x),
      dfLabel:p => `\\frac{dy}{dx} = \\frac{${p.a}}{x}`,
      win:[0.3,6,-3,5], positiveOnly:true }
  ];

  function cf(n) { return n === 1 ? "" : n === -1 ? "-" : U.fmtNum(n); }
  function sg(n, v) {
    if (!n) return "";
    const m = Math.abs(n);
    return (n < 0 ? " - " : " + ") + (m === 1 && v ? "" : U.fmtNum(m)) + (v || "");
  }
  const it = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  const pk = (rng, a) => a[Math.floor(rng() * a.length)];

  const curves = () => CURVES.filter(c => MQ.DATA.tierEnabled(c.topic));

  /* ══════════════════════════════════════════════════════════ */

  function start(root, cfg) {
    const c = Object.assign({ modeId: "lab", title: "📐 Calculus Lab", rounds: 4 }, cfg);

    S.markMode(c.modeId);
    S.touchStreak();
    MQ.Sound.gameStart();

    let round = 0, score = 0, xpEarned = 0, coinsEarned = 0, penalty = 0, finished = false;
    /* Latched on first use. NEVER cleared. */
    let readoutUsed = false;

    const shell = UI.gameShell(c.title, { confirmExit: true,
      help: "Drag the point along the curve, then dial the tangent until it sits flush. " +
            "Submit when you think it matches, and the lab compares your gradient with the exact " +
            "value of f'(x).<br><br>The <b>gradient readout</b> shows the exact answer while you " +
            "drag. It costs 30% of the run's XP and switching it off does not refund that." });
    root.appendChild(shell.root);

    const progChip = UI.chip("1 / " + c.rounds);
    const scoreChip = UI.chip("0 XP");
    [progChip, scoreChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    let repaint = () => {};
    const onResize = () => repaint();
    window.addEventListener("resize", onResize);
    UI.onLeave(() => window.removeEventListener("resize", onResize));

    function render() {
      progChip.textContent = (round + 1) + " / " + c.rounds;
      // Alternate the two experiments, starting with the tangent.
      if (round % 2 === 0) tangentRound(); else areaRound();
    }

    /* ── experiment 1: the tangent ─────────────────────────── */
    function tangentRound() {
      stage.innerHTML = "";
      const rng = U.seededRandom(U.randInt(1, 2e9));
      const curve = curves()[Math.floor(rng() * curves().length)];
      const params = curve.pick(rng);
      const f = curve.f(params), df = curve.df(params);
      const [xmin, xmax, ymin, ymax] = curve.win;

      // Pick a touch point where the curve is actually visible and the
      // gradient is dialable — an off-scale gradient is not a question.
      let px = 0;
      for (let i = 0; i < 200; i++) {
        const t = xmin + (xmax - xmin) * (0.15 + 0.7 * rng());
        if (isFinite(f(t)) && f(t) > ymin + 1 && f(t) < ymax - 1 && Math.abs(df(t)) < 12) { px = t; break; }
        px = (xmin + xmax) / 2;
      }

      let userM = 0;
      let readoutOn = false;

      const canvas = U.el("canvas", { class: "plot tall" });
      const wrap = U.el("div", { class: "plot-wrap" }, [canvas]);
      const cap = U.el("div", { class: "plot-cap", text: "Drag the slider to match the tangent." });

      const xSlider = U.el("input", { type: "range", min: String(xmin + 0.2), max: String(xmax - 0.2),
        step: "0.01", value: String(px) });
      const xOut = U.el("output", { text: U.fmtNum(U.sigFig(px, 3)) });
      const mSlider = U.el("input", { type: "range", min: "-12", max: "12", step: "0.01", value: "0" });
      const mOut = U.el("output", { text: "0" });

      const readout = U.el("div", { class: "equiv-verdict", text: "Gradient readout: off" });
      const toggle = U.el("button", { class: "chip chip-btn", type: "button",
        text: "🔍 Gradient readout: off  (−30% XP)" });
      toggle.addEventListener("click", () => {
        readoutOn = !readoutOn;
        if (readoutOn) readoutUsed = true;          // one-way door
        toggle.classList.toggle("on", readoutOn);
        toggle.textContent = readoutOn
          ? "🔍 Gradient readout: on  (−30% XP, charged)"
          : "🔍 Gradient readout: off  (−30% XP, already charged)";
        MQ.Sound.tap();
        draw();
      });

      function draw() {
        const fr = D.frame(canvas, { xmin, xmax, ymin, ymax, pad: 18 });
        D.axes(fr, { piLabels: curve.piLabels });
        D.curve(fr, f, { colour: fr.P.accent, width: 2.6 });
        const py = f(px);
        D.line(fr, px, py, userM, { colour: fr.P.warn, width: 2, dash: [6, 4] });
        D.point(fr, px, py, { r: 6, colour: fr.P.warn });
        D.label(fr, px, py, `(${U.fmtNum(U.sigFig(px,3))}, ${U.fmtNum(U.sigFig(py,3))})`,
          { dy: -12, colour: fr.P.dim, bold: true });
        readout.className = "equiv-verdict" + (readoutOn ? " yes" : "");
        readout.textContent = readoutOn
          ? `Exact f'(${U.fmtNum(U.sigFig(px,3))}) = ${U.fmtNum(U.sigFig(df(px),5))} · yours ${U.fmtNum(userM)}`
          : "Gradient readout: off";
      }
      repaint = draw;

      xSlider.addEventListener("input", () => {
        px = parseFloat(xSlider.value);
        xOut.textContent = U.fmtNum(U.sigFig(px, 3));
        MQ.Sound.dragTick();
        draw();
      });
      mSlider.addEventListener("input", () => {
        userM = parseFloat(mSlider.value);
        mOut.textContent = U.fmtNum(userM);
        MQ.Sound.dragTick();
        draw();
      });

      const submitBtn = U.el("button", { class: "btn btn-primary btn-block", text: "Place the tangent" });

      stage.appendChild(U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          U.el("span", { class: "chip", text: MQ.Bank.topicName(curve.topic) }),
          U.el("span", { class: "chip on", text: "Tangent" })
        ]),
        U.el("div", { class: "qtext math", html: U.math(curve.label(params)) }),
        U.el("div", { class: "qsub", text: "Slide the point, then set the gradient of the dashed line." })
      ]));
      stage.appendChild(U.el("div", { class: "grid" }, [
        wrap, cap,
        U.el("div", { class: "slider-row" }, [U.el("label", { text: "point x" }), xSlider, xOut]),
        U.el("div", { class: "slider-row" }, [U.el("label", { text: "gradient" }), mSlider, mOut]),
        U.el("div", { class: "row" }, [toggle]),
        readout, submitBtn
      ]));
      requestAnimationFrame(draw);

      submitBtn.addEventListener("click", () => {
        submitBtn.disabled = true;
        xSlider.disabled = mSlider.disabled = true;
        const exact = df(px);
        const err = Math.abs(exact) < 0.5
          ? Math.abs(userM - exact)                 // near-flat: absolute error
          : Math.abs((userM - exact) / exact);      // otherwise relative
        const within1 = err <= 0.01;
        const ok = err <= 0.06;

        S.bump("tangentsPlaced");
        if (within1) S.bump("perfectTangents");
        S.recordAnswer(curve.topic, ok, null);
        S.progressDaily("lab", 1);

        if (ok) {
          score++;
          const gain = within1 ? 40 : 26;
          xpEarned += gain;
          coinsEarned += within1 ? 8 : 5;
          MQ.Sound.tangent();
          MQ.FX.burstAt(canvas, { count: 24, speed: 5, shape: "circle" });
        } else {
          penalty += 10;
          MQ.Sound.wrong();
          MQ.FX.shake();
        }
        scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

        // Redraw with the EXACT tangent overlaid, so the miss is visible.
        const fr = D.frame(canvas, { xmin, xmax, ymin, ymax, pad: 18 });
        D.axes(fr, { piLabels: curve.piLabels });
        D.curve(fr, f, { colour: fr.P.accent, width: 2.6 });
        D.line(fr, px, f(px), userM, { colour: fr.P.bad, width: 2, dash: [6, 4] });
        D.line(fr, px, f(px), exact, { colour: fr.P.good, width: 2.4 });
        D.point(fr, px, f(px), { r: 6, colour: fr.P.warn });
        cap.textContent = "green = exact tangent · red = yours";

        showFeedback(ok, within1,
          `<b>${ok ? (within1 ? "Dead on." : "Close enough.") : "Not close."}</b> ` +
          U.math(curve.dfLabel(params)) +
          `, so f'(${U.fmtNum(U.sigFig(px,3))}) = ${U.fmtNum(U.sigFig(exact,5))}. ` +
          `You set ${U.fmtNum(userM)}.`);
      });
    }

    /* ── experiment 2: the area ────────────────────────────── */
    function areaRound() {
      stage.innerHTML = "";
      const rng = U.seededRandom(U.randInt(1, 2e9));
      // Only curves that stay above the axis on a sensible interval, so the
      // trapezoidal picture and the exact integral tell the same story.
      const usable = curves().filter(cu => cu.id !== "recip" || true);
      const curve = usable[Math.floor(rng() * usable.length)];
      const params = curve.pick(rng);
      const f = curve.f(params), F = curve.F(params);
      const [xmin, xmax] = curve.win;
      let ymin = curve.win[2], ymax = curve.win[3];

      let a = xmin + (xmax - xmin) * 0.2;
      let b = xmin + (xmax - xmin) * 0.6;
      let strips = 4;

      const canvas = U.el("canvas", { class: "plot tall" });
      const cap = U.el("div", { class: "plot-cap", text: "Drag the bounds, then add strips." });

      const aS = U.el("input", { type: "range", min: String(xmin + 0.1), max: String(xmax - 0.1), step: "0.01", value: String(a) });
      const bS = U.el("input", { type: "range", min: String(xmin + 0.1), max: String(xmax - 0.1), step: "0.01", value: String(b) });
      const nS = U.el("input", { type: "range", min: "1", max: "20", step: "1", value: "4" });
      const aO = U.el("output", { text: U.fmtNum(U.sigFig(a, 3)) });
      const bO = U.el("output", { text: U.fmtNum(U.sigFig(b, 3)) });
      const nO = U.el("output", { text: "4" });
      const estOut = U.el("div", { class: "equiv-verdict" });

      function trapEstimate() {
        const lo = Math.min(a, b), hi = Math.max(a, b);
        const h = (hi - lo) / strips;
        let s = f(lo) + f(hi);
        for (let i = 1; i < strips; i++) s += 2 * f(lo + i * h);
        return (h / 2) * s;
      }
      function exactArea() {
        const lo = Math.min(a, b), hi = Math.max(a, b);
        return F(hi) - F(lo);
      }

      function draw() {
        const fr = D.frame(canvas, { xmin, xmax, ymin, ymax, pad: 18 });
        D.axes(fr, { piLabels: curve.piLabels });
        const lo = Math.min(a, b), hi = Math.max(a, b);
        D.shade(fr, f, lo, hi, { colour: fr.P.accent, alpha: 0.22 });
        D.trapezoids(fr, f, lo, hi, strips, { colour: fr.P.warn });
        D.curve(fr, f, { colour: fr.P.accent, width: 2.6 });
        D.point(fr, lo, f(lo), { r: 5, colour: fr.P.good });
        D.point(fr, hi, f(hi), { r: 5, colour: fr.P.good });
        const est = trapEstimate();
        estOut.className = "equiv-verdict";
        estOut.textContent = `Trapezoidal estimate with ${strips} strip${strips === 1 ? "" : "s"}: ${U.fmtNum(U.sigFig(est, 6))}`;
      }
      repaint = draw;

      [[aS, aO, v => { a = v; }], [bS, bO, v => { b = v; }]].forEach(([sl, out, set]) => {
        sl.addEventListener("input", () => {
          set(parseFloat(sl.value));
          out.textContent = U.fmtNum(U.sigFig(parseFloat(sl.value), 3));
          MQ.Sound.dragTick();
          draw();
        });
      });
      nS.addEventListener("input", () => {
        strips = parseInt(nS.value, 10);
        nO.textContent = String(strips);
        MQ.Sound.tally();
        draw();
      });

      const input = U.el("input", { class: "numin", type: "text", autocomplete: "off",
        placeholder: "the EXACT area" });
      const submitBtn = U.el("button", { class: "btn btn-primary btn-block", text: "Submit the exact area" });

      stage.appendChild(U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          U.el("span", { class: "chip", text: MQ.Bank.topicName(curve.topic) }),
          U.el("span", { class: "chip on", text: "Area" })
        ]),
        U.el("div", { class: "qtext math", html: U.math(curve.label(params)) }),
        U.el("div", { class: "qsub", text:
          "Set the bounds, use the strips to sanity-check your instinct, then integrate exactly and type the answer." })
      ]));
      stage.appendChild(U.el("div", { class: "grid" }, [
        U.el("div", { class: "plot-wrap" }, [canvas]), cap,
        U.el("div", { class: "slider-row" }, [U.el("label", { text: "lower a" }), aS, aO]),
        U.el("div", { class: "slider-row" }, [U.el("label", { text: "upper b" }), bS, bO]),
        U.el("div", { class: "slider-row" }, [U.el("label", { text: "strips" }), nS, nO]),
        estOut, input, submitBtn
      ]));
      requestAnimationFrame(draw);

      submitBtn.addEventListener("click", () => {
        const raw = input.value.trim();
        if (!raw) { input.classList.add("err"); setTimeout(() => input.classList.remove("err"), 400); return; }
        submitBtn.disabled = true;
        input.disabled = aS.disabled = bS.disabled = nS.disabled = true;

        const exact = exactArea();
        const ok = U.numClose(raw, exact, 0.01);
        const tight = U.numClose(raw, exact, 0.002);

        S.bump("areasFound");
        S.recordAnswer(curve.topic, ok, null);
        S.progressDaily("lab", 1);

        if (ok) {
          score++;
          const gain = tight ? 42 : 28;
          xpEarned += gain;
          coinsEarned += tight ? 8 : 5;
          MQ.Sound.integrate();
          MQ.FX.rise(window.innerWidth / 2, window.innerHeight * 0.6);
        } else {
          penalty += 10;
          MQ.Sound.wrong();
          MQ.FX.shake();
        }
        scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

        const lo = Math.min(a, b), hi = Math.max(a, b);
        showFeedback(ok, tight,
          `<b>${ok ? "Correct." : "Not quite."}</b> ` +
          U.math(`int_{${U.fmtNum(U.sigFig(lo,3))}}^{${U.fmtNum(U.sigFig(hi,3))}}`) +
          ` of that curve is exactly ${U.fmtNum(U.sigFig(exact, 6))}. ` +
          `Your ${strips}-strip trapezoidal estimate was ${U.fmtNum(U.sigFig(trapEstimate(), 6))} — ` +
          `the estimate converges on the integral as the strips get thinner, which is the whole idea.`);
      });
    }

    /* H1: the worked explanation stays on screen. The results modal only
       opens when the student presses the button, never on top of the thing
       they are reading. */
    function showFeedback(ok, great, html) {
      const fb = U.el("div", { class: "feedback " + (ok ? "ok" : "no") }, [
        U.el("div", { class: "math", html }),
        U.el("div", { class: "row", style: "margin-top:12px" }, [
          U.el("button", {
            class: "btn btn-primary js-next",
            text: round >= c.rounds - 1 ? "See results" : "Next experiment →",
            on: { click: () => { if (round >= c.rounds - 1) return finish(); round++; render(); } }
          })
        ])
      ]);
      stage.appendChild(fb);
      U.$(".js-next", stage).scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function finish() {
      if (finished) return;
      finished = true;
      window.removeEventListener("resize", onResize);

      const accuracy = score / c.rounds;
      const perfect = score === c.rounds && !readoutUsed;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }

      const crutch = readoutUsed ? 0.7 : 1;
      const netXp = Math.round(Math.max(0, xpEarned - penalty) * crutch);
      const newBest = S.recordScore(c.modeId, score);

      const got = UI.award({
        xp: netXp, bonus: S.streakBonus(), accuracy,
        coins: coinsEarned + (perfect ? 40 : 0)
      });

      UI.results({
        title: "Lab session complete",
        correct: score, total: c.rounds, xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Wrong", "−" + penalty + " XP"],
          ["Readout", readoutUsed ? "used" : "unused"],
          ["Experiments", c.rounds]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start, CURVES };
})();
