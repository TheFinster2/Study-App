/* 📈 Read the Curve.

   Given a DRAWN graph, pick the equation — and the reverse. Chemistry's
   equivalent mode (Name That Compound) needed 28 hand-authored structures.
   This needs none: the curve is rendered on a canvas from a generated
   function family, so the supply is genuinely endless.

   Every curve family declares a small parameter space and a label, and
   distractors are produced by perturbing exactly one parameter — which keeps
   them plausible AND keeps them the same structural complexity as the key.
   Distractors written as "simpler" versions of the answer are their own tell
   (brief §9.7): if three options are short and the fourth is elaborate,
   students pick the fourth without reading. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.curve = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI, D = MQ.Draw;

  /* Each family: label(p) renders the equation, f(p) evaluates it, and
     vary(p, rng) perturbs ONE parameter to make a distractor. */
  const FAMILIES = [
    { id:"line", topic:"MA-F1", win:[-5,5,-6,6],
      pick:rng => ({ m: pick(rng,[-3,-2,-1,1,2,3]), c: pick(rng,[-3,-2,-1,0,1,2,3]) }),
      label:p => `y = ${co(p.m)}x ${sg(p.c)}`,
      f:p => x => p.m * x + p.c,
      vary:(p,rng) => rng() < 0.5 ? { m: -p.m, c: p.c } : { m: p.m, c: p.c + pick(rng,[-2,-1,1,2]) } },

    { id:"parabola", topic:"MA-F1", win:[-5,5,-8,8],
      pick:rng => ({ a: pick(rng,[-2,-1,1,2]), h: int(rng,-2,2), k: int(rng,-4,4) }),
      label:p => `y = ${co(p.a)}(x ${sg(-p.h)})^2 ${sg(p.k)}`,
      f:p => x => p.a * Math.pow(x - p.h, 2) + p.k,
      vary:(p,rng) => rng() < 0.4 ? { a: -p.a, h: p.h, k: p.k }
                    : rng() < 0.7 ? { a: p.a, h: -p.h, k: p.k }
                                  : { a: p.a, h: p.h, k: p.k + pick(rng,[-3,-2,2,3]) } },

    { id:"cubic", topic:"MA-F1", win:[-3.2,3.2,-10,10],
      pick:rng => ({ a: pick(rng,[-1,1]), b: int(rng,1,4) }),
      label:p => `y = ${co(p.a)}x^3 ${sg(-p.a * p.b, "x")}`,
      f:p => x => p.a * (x * x * x - p.b * x),
      vary:(p,rng) => rng() < 0.5 ? { a: -p.a, b: p.b } : { a: p.a, b: p.b + pick(rng,[-1,1,2]) } },

    { id:"recip", topic:"MA-F1", win:[-6,6,-6,6],
      pick:rng => ({ a: pick(rng,[-3,-2,-1,1,2,3]), h: int(rng,-3,3) }),
      label:p => `y = \\frac{${p.a}}{x ${sg(-p.h)}}`,
      f:p => x => p.a / (x - p.h),
      vary:(p,rng) => rng() < 0.5 ? { a: -p.a, h: p.h } : { a: p.a, h: p.h + pick(rng,[-2,-1,1,2]) } },

    { id:"sqrt", topic:"MA-F1", win:[-6,6,-2,7],
      pick:rng => ({ a: pick(rng,[1,2]), h: int(rng,-3,2) }),
      label:p => `y = ${co(p.a)}\\sqrt{x ${sg(-p.h)}}`,
      f:p => x => (x >= p.h ? p.a * Math.sqrt(x - p.h) : NaN),
      vary:(p,rng) => rng() < 0.5 ? { a: p.a + 1, h: p.h } : { a: p.a, h: p.h + pick(rng,[-2,2]) } },

    { id:"abs", topic:"MA-F1", win:[-6,6,-4,8],
      pick:rng => ({ a: pick(rng,[-2,-1,1,2]), h: int(rng,-3,3), k: int(rng,-2,3) }),
      label:p => `y = ${co(p.a)}|x ${sg(-p.h)}| ${sg(p.k)}`,
      f:p => x => p.a * Math.abs(x - p.h) + p.k,
      vary:(p,rng) => rng() < 0.5 ? { a: -p.a, h: p.h, k: p.k } : { a: p.a, h: -p.h, k: p.k } },

    { id:"exp", topic:"MA-E1", win:[-3,3,-2,9],
      pick:rng => ({ a: pick(rng,[1,2,3]), k: pick(rng,[-1,1]), c: int(rng,0,3) }),
      label:p => `y = ${co(p.a)}e^{${p.k === 1 ? "" : "-"}x} ${sg(p.c)}`,
      f:p => x => p.a * Math.exp(p.k * x) + p.c,
      vary:(p,rng) => rng() < 0.5 ? { a: p.a, k: -p.k, c: p.c } : { a: p.a, k: p.k, c: p.c + pick(rng,[1,2]) } },

    { id:"log", topic:"MA-E1", win:[-2,8,-4,4],
      pick:rng => ({ h: int(rng,-1,3), a: pick(rng,[1,2]) }),
      label:p => `y = ${co(p.a)}ln(x ${sg(-p.h)})`,
      f:p => x => (x > p.h ? p.a * Math.log(x - p.h) : NaN),
      vary:(p,rng) => rng() < 0.5 ? { h: p.h + pick(rng,[-1,1,2]), a: p.a } : { h: p.h, a: -p.a } },

    { id:"sine", topic:"MA-T2", win:[0,6.4,-5,5], piLabels:true,
      pick:rng => ({ A: int(rng,1,3), n: int(rng,1,3), c: int(rng,-1,2) }),
      label:p => `y = ${co(p.A)}sin ${co(p.n)}x ${sg(p.c)}`,
      f:p => x => p.A * Math.sin(p.n * x) + p.c,
      vary:(p,rng) => rng() < 0.4 ? { A: p.A, n: p.n === 1 ? 2 : p.n - 1, c: p.c }
                    : rng() < 0.7 ? { A: p.A + 1, n: p.n, c: p.c }
                                  : { A: p.A, n: p.n, c: p.c + pick(rng,[-2,2]) } },

    { id:"cosine", topic:"MA-T2", win:[0,6.4,-5,5], piLabels:true,
      pick:rng => ({ A: int(rng,1,3), n: int(rng,1,3), c: int(rng,-1,2) }),
      label:p => `y = ${co(p.A)}cos ${co(p.n)}x ${sg(p.c)}`,
      f:p => x => p.A * Math.cos(p.n * x) + p.c,
      vary:(p,rng) => rng() < 0.5 ? { A: p.A, n: p.n === 1 ? 2 : p.n - 1, c: p.c }
                                  : { A: -p.A, n: p.n, c: p.c } },

    { id:"normal", topic:"MA-S3", win:[-4,4,-0.1,1.1],
      pick:rng => ({ mu: int(rng,-2,2), sd: pick(rng,[0.5,1,1.5]) }),
      label:p => `A normal curve with mu = ${p.mu} and sigma = ${U.fmtNum(p.sd)}`,
      f:p => x => Math.exp(-Math.pow((x - p.mu) / p.sd, 2) / 2),
      vary:(p,rng) => rng() < 0.5 ? { mu: p.mu + pick(rng,[-2,-1,1,2]), sd: p.sd }
                                  : { mu: p.mu, sd: p.sd === 1.5 ? 0.5 : p.sd + 0.5 } },

    /* ── Extension 1 ── */
    { id:"invtan", topic:"ME-T1", win:[-6,6,-2.4,2.4],
      pick:rng => ({ a: pick(rng,[1,2]), s: pick(rng,[-1,1]) }),
      label:p => `y = ${co(p.s)}${co(p.a) === "" ? "" : p.a}tan^{-1}x`.replace("1tan", "tan"),
      f:p => x => p.s * p.a * Math.atan(x),
      vary:(p,rng) => rng() < 0.5 ? { a: p.a, s: -p.s } : { a: p.a === 1 ? 2 : 1, s: p.s } },

    { id:"quartic", topic:"ME-F2", win:[-3,3,-8,10],
      pick:rng => ({ a: pick(rng,[-1,1]), b: int(rng,1,4) }),
      label:p => `y = ${co(p.a)}x^4 ${sg(-p.a * p.b, "x^2")}`,
      f:p => x => p.a * (Math.pow(x, 4) - p.b * x * x),
      vary:(p,rng) => rng() < 0.5 ? { a: -p.a, b: p.b } : { a: p.a, b: p.b + pick(rng,[-1,1,2]) } }
  ];

  /* Formatting helpers, so a coefficient of 1 prints as nothing. */
  function co(n) { return n === 1 ? "" : n === -1 ? "-" : String(n); }
  function sg(n, v) {
    if (n === 0) return "";
    const mag = Math.abs(n);
    return (n < 0 ? "- " : "+ ") + (mag === 1 && v ? "" : mag) + (v || "");
  }
  const int = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

  const families = () => FAMILIES.filter(f => MQ.DATA.tierEnabled(f.topic));

  /** Build one round. Exposed so the validator can generate rounds headlessly. */
  function buildRound(seed) {
    const rng = U.seededRandom(U.hash(String(seed)));
    const fam = families()[Math.floor(rng() * families().length)];
    const params = fam.pick(rng);
    const key = fam.label(params);

    // Distractors: perturb ONE parameter each, and reject any that renders
    // identically to the key or to another distractor.
    const labels = [key];
    const paramSets = [params];
    let guard = 0;
    while (labels.length < 4 && guard++ < 200) {
      const p2 = fam.vary(params, rng);
      const l2 = fam.label(p2);
      if (labels.includes(l2)) continue;
      labels.push(l2);
      paramSets.push(p2);
    }
    // If a family is too small to yield four distinct labels, fall back to
    // shifting the constant, which every family tolerates.
    let bump = 1;
    while (labels.length < 4) {
      const l = key + " + " + bump;
      if (!labels.includes(l)) { labels.push(l); paramSets.push(params); }
      bump++;
    }
    return { fam, params, key, labels, paramSets, reverse: rng() < 0.35 };
  }

  function start(root, cfg) {
    const c = Object.assign({ modeId: "curve", title: "📈 Read the Curve", count: 10 }, cfg);

    S.markMode(c.modeId);
    S.touchStreak();
    MQ.Sound.gameStart();

    let idx = 0, correct = 0, streak = 0, bestStreak = 0;
    let xpEarned = 0, coinsEarned = 0, penalty = 0, shownAt = 0, finished = false;

    const shell = UI.gameShell(c.title, { confirmExit: true,
      help: "Most rounds show a graph and ask for its equation. Some reverse it — " +
            "you get the equation and pick the matching graph. Every curve is drawn on the fly, " +
            "so you will not see the same one twice." });
    root.appendChild(shell.root);

    const progChip = UI.chip("1 / " + c.count);
    const scoreChip = UI.chip("0 XP");
    const streakChip = UI.chip("Streak 0");
    [progChip, scoreChip, streakChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    /* Every canvas draw is registered so a resize repaints them, and the
       listener is torn down on leave — a rAF or resize handler that outlives
       its screen is the leak UI.onLeave exists to prevent. */
    let painters = [];
    function repaint() { painters.forEach(fn => { try { fn(); } catch (e) { /* canvas gone */ } }); }
    window.addEventListener("resize", repaint);
    UI.onLeave(() => {
      window.removeEventListener("resize", repaint);
      document.removeEventListener("keydown", onKey);
      painters = [];
    });
    document.addEventListener("keydown", onKey);

    let buttons = [];
    function onKey(e) {
      if (finished) return;
      const n = "1234".indexOf(e.key);
      if (n >= 0 && buttons[n] && !buttons[n].disabled) buttons[n].click();
      if (e.key === "Enter") { const nx = U.$(".js-next", stage); if (nx) nx.click(); }
    }

    /** Draw a family's curve onto a canvas. */
    function paint(canvas, fam, params) {
      const [xmin, xmax, ymin, ymax] = fam.win;
      const f = D.frame(canvas, { xmin, xmax, ymin, ymax, pad: 16 });
      D.axes(f, { piLabels: fam.piLabels });
      D.curve(f, fam.fn ? fam.fn(params) : fam.f(params), { colour: f.P.accent, width: 2.6 });
      return f;
    }

    function render() {
      stage.innerHTML = "";
      painters = [];
      const round = buildRound(c.modeId + "-" + Date.now() + "-" + idx + "-" + U.randInt(1, 1e9));
      const { fam, params, key, labels, paramSets, reverse } = round;
      const order = U.shuffle(labels.map((l, i) => ({ l, p: paramSets[i], correct: i === 0 })));
      shownAt = performance.now();
      progChip.textContent = (idx + 1) + " / " + c.count;
      buttons = [];

      MQ.__current = { kind: "quiz", answer: order.findIndex(o => o.correct) };
      const tag = U.el("div", { class: "qtag" }, [
        U.el("span", { class: "chip", text: MQ.Bank.topicName(fam.topic) }),
        UI.tierChip(fam.topic),
        U.el("span", { class: "chip", text: reverse ? "equation → graph" : "graph → equation" })
      ]);

      const choiceWrap = U.el("div", { class: "choices" });
      let card;

      if (!reverse) {
        /* graph → equation */
        const canvas = U.el("canvas", { class: "plot" });
        const wrap = U.el("div", { class: "plot-wrap" }, [canvas]);
        card = U.el("div", { class: "qcard" }, [
          tag,
          U.el("div", { class: "qtext", text: "Which equation does this graph show?" }),
          wrap
        ]);
        painters.push(() => paint(canvas, fam, params));
        order.forEach((opt, i) => choiceWrap.appendChild(makeChoice(opt, i, true)));
      } else {
        /* equation → graph */
        card = U.el("div", { class: "qcard" }, [
          tag,
          U.el("div", { class: "qtext", text: "Which graph shows this equation?" }),
          U.el("div", { class: "equiv-target math", html: U.math(key) })
        ]);
        choiceWrap.className = "grid g2";
        order.forEach((opt, i) => {
          const canvas = U.el("canvas", { class: "plot short" });
          painters.push(() => paint(canvas, fam, opt.p));
          const btn = U.el("button", { class: "choice", type: "button",
            style: "flex-direction:column; align-items:stretch; gap:6px" }, [
            U.el("div", { class: "row" }, [
              U.el("span", { class: "choice-key", text: MQ.QuizCore.KEYS[i] })
            ]),
            U.el("div", { class: "plot-wrap" }, [canvas])
          ]);
          btn.addEventListener("click", () => answer(opt, btn, order, fam));
          buttons.push(btn);
          choiceWrap.appendChild(btn);
        });
      }

      function makeChoice(opt, i) {
        const btn = U.el("button", { class: "choice", type: "button" }, [
          U.el("span", { class: "choice-key", text: MQ.QuizCore.KEYS[i] }),
          U.el("span", { class: "math", html: U.math(opt.l) })
        ]);
        btn.addEventListener("click", () => answer(opt, btn, order, fam));
        buttons.push(btn);
        return btn;
      }

      card.appendChild(choiceWrap);
      stage.appendChild(card);
      // Paint after layout, so clientWidth is real.
      requestAnimationFrame(repaint);
    }

    function answer(opt, btn, order, fam) {
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (order[i].correct) b.classList.add("correct");
        else if (b === btn) b.classList.add("wrong");
      });

      const tooFast = performance.now() - shownAt < UI.MIN_READ_MS;
      const ok = opt.correct;
      S.recordAnswer(fam.topic, ok, null);

      if (ok) {
        correct++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        S.noteStreak(bestStreak);
        S.bump("curvesRead");
        S.progressDaily("curve", 1);
        const gain = tooFast ? 0 : Math.round(12 * Math.min(3, 1 + Math.floor(streak / 5) * 0.5));
        xpEarned += gain;
        coinsEarned += tooFast ? 0 : 3;
        MQ.Sound.correct();
        if (tooFast) UI.toast({ icon: "⏱️", kind: "bad", text: "Too fast to have read the graph — no XP." });
        MQ.FX.burstAt(btn, { count: 16, speed: 4, size: 3, shape: "circle" });
      } else {
        streak = 0;
        penalty += 7;
        MQ.Sound.wrong();
        MQ.FX.shake();
      }
      scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";
      streakChip.textContent = "Streak " + streak;

      const fb = U.el("div", { class: "feedback " + (ok ? "ok" : "no") }, [
        U.el("div", { class: "math", html: ok
          ? "<b>Correct.</b> " + U.math(order.find(o => o.correct).l)
          : "<b>Not quite.</b> It was " + U.math(order.find(o => o.correct).l) }),
        U.el("div", { class: "row", style: "margin-top:12px" }, [
          U.el("button", {
            class: "btn btn-primary js-next",
            text: idx >= c.count - 1 ? "See results" : "Next graph →",
            on: { click: () => { if (idx >= c.count - 1) return finish(); idx++; render(); } }
          })
        ])
      ]);
      stage.appendChild(fb);
      U.$(".js-next", stage).focus();
    }

    function finish() {
      if (finished) return;
      finished = true;
      window.removeEventListener("resize", repaint);
      document.removeEventListener("keydown", onKey);

      const accuracy = correct / c.count;
      const perfect = correct === c.count && c.count >= 5;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }
      const newBest = S.recordScore(c.modeId, correct);

      const got = UI.award({
        xp: Math.max(0, xpEarned - penalty), bonus: S.streakBonus(), accuracy,
        coins: coinsEarned + (perfect ? 25 : 0)
      });

      UI.results({
        title: "Curves read",
        correct, total: c.count, xp: got.xp, coins: got.coins, newBest,
        extraStats: [["Best streak", bestStreak], ["Wrong", "−" + penalty + " XP"],
                     ["Mode", "generated"]],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start, buildRound, FAMILIES };
})();
