/* 🔁 Equivalence Engine.

   Chemistry's Balance Blitz showed a live per-element atom tally, so the game
   told you the truth as you typed. This is the same feel with a live NUMERIC
   EQUIVALENCE CHECK: rearrange or simplify the target, and the app evaluates
   both sides at several pseudo-random x values and reports whether they agree.

   That check is why this mode can accept `2sin(x)cos(x)` for `sin(2x)` — no
   string comparison ever will. See MQ.Expr.equivalent, and §6.5 for the four
   ways a naive version of it goes wrong.

   The live verdict is an OPTIONAL CRUTCH, and it follows the addendum's C3
   rule: the penalty LATCHES the moment it is first switched on and is never
   cleared for the rest of the run. Toggling it off before submitting used to
   refund the cost in the reference app, which made the crutch free. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

/* ── the task bank ─────────────────────────────────────────────
   `domain` matters. sqrt(x^2) equals x only for x >= 0, and
   arcsin(sin x) equals x only on [-pi/2, pi/2] — so every task declares
   the interval its equivalence is actually claimed on. */
MQ.DATA = MQ.DATA || {};
MQ.DATA.equivTasks = [
  {id:"eq-01",topic:"MA-F1",diff:1,domain:[-4,4],
   show:"(x + 3)^2",target:"(x+3)^2",ask:"Expand this bracket.",
   accept:"x^2 + 6x + 9",why:"(a+b)^2 = a^2 + 2ab + b^2 — the middle term is the one people drop."},
  {id:"eq-02",topic:"MA-F1",diff:1,domain:[-4,4],
   show:"(x - 5)(x + 2)",target:"(x-5)(x+2)",ask:"Expand and collect.",
   accept:"x^2 - 3x - 10",why:"Sum of the roots' negatives gives the x coefficient; their product gives the constant."},
  {id:"eq-03",topic:"MA-F1",diff:2,domain:[-4,4],
   show:"x^2 - 9",target:"x^2-9",ask:"Factorise fully.",
   accept:"(x-3)(x+3)",why:"A difference of two squares. Check by expanding: the cross terms cancel."},
  {id:"eq-04",topic:"MA-F1",diff:2,domain:[-4,4],
   show:"x^2 + 8x + 12",target:"x^2+8x+12",ask:"Factorise.",
   accept:"(x+2)(x+6)",why:"Two numbers multiplying to 12 and summing to 8."},
  {id:"eq-05",topic:"MA-F1",diff:2,domain:[-4,4],
   show:"x^2 - 6x + 1",target:"x^2-6x+1",ask:"Complete the square.",
   accept:"(x-3)^2 - 8",why:"Half of -6 is -3; (x-3)^2 overshoots by 9, so subtract 8 rather than 1."},
  {id:"eq-06",topic:"MA-F1",diff:2,domain:[1.5,6],
   show:"\\frac{x^2 - 1}{x - 1}",target:"(x^2-1)/(x-1)",ask:"Simplify (x != 1).",
   accept:"x + 1",why:"Factor the numerator and cancel. The domain still excludes x = 1 — there is a hole there."},
  {id:"eq-07",topic:"MA-T2",diff:2,domain:[0.3,2.8],
   show:"sin 2x",target:"sin(2x)",ask:"Write using the double angle formula.",
   accept:"2sin(x)cos(x)",why:"This is the identity that makes int sin x cos x dx tractable."},
  {id:"eq-08",topic:"MA-T2",diff:3,domain:[0.3,2.8],
   show:"cos 2x",target:"cos(2x)",ask:"Write in terms of sin x only.",
   accept:"1 - 2sin(x)^2",why:"From cos^2 - sin^2 with cos^2 = 1 - sin^2. This is the form used to integrate sin^2."},
  {id:"eq-09",topic:"MA-T1",diff:2,domain:[0.4,1.2],
   show:"1 - cos^2 x",target:"1-cos(x)^2",ask:"Simplify using the Pythagorean identity.",
   accept:"sin(x)^2",why:"Straight from sin^2 + cos^2 = 1."},
  {id:"eq-10",topic:"MA-T1",diff:2,domain:[0.4,1.2],
   show:"\\frac{sin x}{cos x}",target:"sin(x)/cos(x)",ask:"Write as a single function.",
   accept:"tan(x)",why:"The definition of tangent."},
  {id:"eq-11",topic:"MA-E1",diff:2,domain:[1.2,5],
   show:"ln x^3",target:"ln(x^3)",ask:"Bring the index out.",
   accept:"3ln(x)",why:"log a^n = n log a. The two agree for x > 0; ln x^3 is also defined for x < 0."},
  {id:"eq-12",topic:"MA-E1",diff:2,domain:[1.2,5],
   show:"ln x + ln 4",target:"ln(x)+ln(4)",ask:"Combine into one logarithm.",
   accept:"ln(4x)",why:"Adding logs multiplies the arguments."},
  {id:"eq-13",topic:"MA-E1",diff:2,domain:[1.2,5],
   show:"e^{2ln x}",target:"e^(2*ln(x))",ask:"Simplify to a power of x.",
   accept:"x^2",why:"e^{ln A} = A, so e^{2 ln x} = e^{ln x^2} = x^2."},
  {id:"eq-14",topic:"MA-C2",diff:2,domain:[-3,3],
   show:"\\frac{d}{dx}(x^4 - 2x^2)",target:"4x^3 - 4x",ask:"Differentiate.",
   accept:"4x^3 - 4x",why:"Term by term with the power rule."},
  {id:"eq-15",topic:"MA-C2",diff:3,domain:[-2,2],
   show:"\\frac{d}{dx}(2x+1)^3",target:"6*(2x+1)^2",ask:"Differentiate using the chain rule.",
   accept:"6(2x+1)^2",why:"3(2x+1)^2 times the inner derivative 2."},
  {id:"eq-16",topic:"MA-C2",diff:3,domain:[0.3,3],
   show:"\\frac{d}{dx}(x ln x)",target:"ln(x) + 1",ask:"Differentiate.",
   accept:"ln(x) + 1",why:"Product rule: (1)(ln x) + (x)(1/x)."},
  {id:"eq-17",topic:"MA-F1",diff:3,domain:[1.5,6],
   show:"\\frac{1}{x} + \\frac{1}{x+1}",target:"1/x + 1/(x+1)",ask:"Write as a single fraction.",
   accept:"(2x+1)/(x(x+1))",why:"Common denominator x(x+1); the numerator is (x+1) + x."},
  {id:"eq-18",topic:"MA-F1",diff:3,domain:[2,6],
   show:"\\frac{x}{x-1} - \\frac{1}{x-1}",target:"x/(x-1) - 1/(x-1)",ask:"Simplify.",
   accept:"1",why:"The numerators combine to x - 1, which cancels the denominator entirely."},
  {id:"eq-19",topic:"MA-E1",diff:2,domain:[0.5,3],
   show:"\\sqrt{x} \\times \\sqrt{x^3}",target:"sqrt(x)*sqrt(x^3)",ask:"Simplify to a single power.",
   accept:"x^2",why:"Add the fractional indices: \\frac{1}{2} + \\frac{3}{2} = 2."},
  {id:"eq-20",topic:"MA-C4",diff:3,domain:[-2,2],
   show:"int (6x^2 - 2) dx",target:"2x^3 - 2x",ask:"Antidifferentiate (take c = 0).",
   accept:"2x^3 - 2x",why:"Reverse power rule term by term. Differentiate back to check."},
  /* ── Extension 1 ── */
  {id:"eq-x1",topic:"ME-T2",diff:3,domain:[0.3,1.2],
   show:"sin(x + \\frac{pi}{2})",target:"sin(x + pi/2)",ask:"Simplify.",
   accept:"cos(x)",why:"Expand with the compound angle formula; the sine term vanishes."},
  {id:"eq-x2",topic:"ME-T2",diff:3,domain:[0.3,1.2],
   show:"\\frac{2tan x}{1 - tan^2 x}",target:"2tan(x)/(1-tan(x)^2)",ask:"Write as a single trig function.",
   accept:"tan(2x)",why:"The double angle formula for tangent."},
  {id:"eq-x3",topic:"ME-T2",diff:3,domain:[0.3,1.2],
   show:"sin^2 x",target:"sin(x)^2",ask:"Write in a form you could integrate.",
   accept:"(1 - cos(2x))/2",why:"Rearranged from cos 2x = 1 - 2sin^2 x. There is no reverse chain rule for a squared sine."},
  {id:"eq-x4",topic:"ME-T1",diff:3,domain:[-1.4,1.4],
   show:"sin^{-1}(sin x)",target:"asin(sin(x))",ask:"Simplify on -\\frac{pi}{2} <= x <= \\frac{pi}{2}.",
   accept:"x",why:"Only true INSIDE the principal range. Outside it the composition folds back — sin^{-1}(sin 3) is pi - 3."},
  {id:"eq-x5",topic:"ME-C2",diff:3,domain:[-0.7,0.7],
   show:"\\frac{d}{dx}tan^{-1}(2x)",target:"2/(1+4x^2)",ask:"Differentiate.",
   accept:"2/(1 + 4x^2)",why:"The standard derivative times the inner derivative 2, and the 2x squares inside."},
  {id:"eq-x6",topic:"ME-F2",diff:3,domain:[-3,3],
   show:"(x - 1)^3",target:"(x-1)^3",ask:"Expand fully.",
   accept:"x^3 - 3x^2 + 3x - 1",why:"Binomial coefficients 1, 3, 3, 1 with alternating signs."},
  {id:"eq-x7",topic:"ME-F1",diff:3,domain:[1.5,5],
   show:"\\frac{x^3 - 1}{x - 1}",target:"(x^3-1)/(x-1)",ask:"Simplify (x != 1).",
   accept:"x^2 + x + 1",why:"The difference-of-cubes factorisation."},
  {id:"eq-x8",topic:"ME-T2",diff:3,domain:[0.3,1.2],
   show:"cos^2 x - sin^2 x",target:"cos(x)^2 - sin(x)^2",ask:"Write as a single trig function.",
   accept:"cos(2x)",why:"The primary form of the cosine double angle identity."}
];

MQ.Games.equiv = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI, E = MQ.Expr;

  const tasks = () => MQ.DATA.equivTasks.filter(t => MQ.DATA.tierEnabled(t.topic));

  function start(root, cfg) {
    const c = Object.assign({ modeId: "equiv", title: "🔁 Equivalence Engine", count: 6 }, cfg);

    const pool = U.sample(tasks(), c.count);
    if (!pool.length) {
      root.appendChild(U.el("div", { class: "empty" }, [U.el("p", { text: "No tasks available." })]));
      return;
    }

    S.markMode(c.modeId);
    S.touchStreak();
    MQ.Sound.gameStart();

    let idx = 0, solved = 0, firstTry = 0, attempts = 0, totalAttempts = 0;
    let xpEarned = 0, coinsEarned = 0, penalty = 0, shownAt = 0, finished = false;
    /* Latched the moment the live checker is first switched on. Never cleared. */
    let liveUsed = false;
    let liveOn = false;

    const shell = UI.gameShell(c.title, { confirmExit: true,
      help: "Rewrite the expression as asked. The app checks your answer by evaluating both " +
            "expressions at eight random values of x — so any correct rearrangement is accepted, " +
            "not just the one it had in mind.<br><br>The <b>live check</b> tells you whether you " +
            "have it right before you submit. It costs 25% of the run's XP, and switching it back " +
            "off does not refund that." });
    root.appendChild(shell.root);

    const progChip = UI.chip("1 / " + pool.length);
    const scoreChip = UI.chip("0 XP");
    [progChip, scoreChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    let input = null, submitBtn = null, verdict = null, task = null;

    UI.onLeave(() => document.removeEventListener("keydown", onKey));
    document.addEventListener("keydown", onKey);
    function onKey(e) {
      if (finished || e.key !== "Enter") return;
      e.preventDefault();
      const next = U.$(".js-next", stage);
      if (next) next.click();
      else if (submitBtn && !submitBtn.disabled) submitBtn.click();
    }

    function check(raw) {
      return E.equivalent(raw, task.target, {
        seed: task.id, domain: task.domain, samples: 8, minClean: 5
      });
    }

    function render() {
      stage.innerHTML = "";
      task = pool[idx];
      attempts = 0;
      shownAt = performance.now();
      progChip.textContent = (idx + 1) + " / " + pool.length;

      MQ.__current = { kind: "typed", answer: task.accept, id: task.id };
      const card = U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          U.el("span", { class: "chip", text: MQ.Bank.topicName(task.topic) }),
          UI.tierChip(task.topic),
          U.el("span", { class: "chip", text: "★".repeat(task.diff) })
        ]),
        U.el("div", { class: "qtext math", html: U.math(task.ask) }),
        U.el("div", { class: "equiv-target math", html: U.math(task.show) })
      ]);

      input = U.el("input", {
        class: "numin", type: "text", inputmode: "text",
        autocomplete: "off", autocapitalize: "off", spellcheck: "false",
        placeholder: "your equivalent expression"
      });
      verdict = U.el("div", { class: "equiv-verdict", text: "Type an expression." });
      const sampleTable = U.el("div", { class: "sample-table" });

      const toggle = U.el("button", {
        class: "chip chip-btn", type: "button",
        text: "🔍 Live check: off  (−25% XP)"
      });
      toggle.addEventListener("click", () => {
        liveOn = !liveOn;
        // One-way door: the cost is charged on first use and never refunded.
        if (liveOn) liveUsed = true;
        toggle.classList.toggle("on", liveOn);
        toggle.textContent = liveOn
          ? "🔍 Live check: on  (−25% XP" + (liveUsed ? ", charged" : "") + ")"
          : "🔍 Live check: off  (−25% XP, already charged)";
        MQ.Sound.tap();
        update();
      });

      function update() {
        const raw = input.value.trim();
        sampleTable.innerHTML = "";
        verdict.className = "equiv-verdict";

        if (!raw) { verdict.textContent = "Type an expression."; return; }
        const parsed = E.tryParse(raw);
        if (!parsed.ok) {
          verdict.classList.add("no");
          verdict.textContent = parsed.error;
          return;
        }
        if (!liveOn) {
          verdict.textContent = "Parsed. Submit when ready.";
          return;
        }

        const r = check(raw);
        if (r.equal) {
          verdict.classList.add("yes");
          verdict.textContent = "✓ Equivalent — agrees at all " + r.clean + " sample points.";
        } else if (r.reason === "undefined") {
          verdict.classList.add("no");
          verdict.textContent = "Undefined over too much of the interval to compare.";
        } else {
          verdict.classList.add("no");
          verdict.textContent = "✗ Not equivalent — they differ.";
          // Show WHERE they differ. That is the actual teaching moment.
          const x = r.at && r.at.x;
          if (x !== undefined) {
            [["x", "yours", "target"],
             [U.fmtNum(U.sigFig(x, 4)), U.fmtNum(U.sigFig(r.va, 5)), U.fmtNum(U.sigFig(r.vb, 5))]]
              .forEach((row, i) => row.forEach(cell =>
                sampleTable.appendChild(U.el("div", { class: i === 0 ? "hd" : (i === 1 ? "no" : ""), text: cell }))));
          }
        }
      }

      input.addEventListener("input", () => { MQ.Sound.type(); update(); });

      const pad = U.el("div", { class: "symbol-pad" },
        ["x", "^", "(", ")", "/", "*", "sin(", "cos(", "tan(", "ln(", "sqrt(", "pi"].map(sym =>
          U.el("button", { class: "sym", type: "button", text: sym, on: { click: () => {
            input.value += sym; input.focus(); update(); MQ.Sound.tap();
          } } })));

      submitBtn = U.el("button", { class: "btn btn-primary btn-block", text: "Submit" });
      submitBtn.addEventListener("click", submit);

      stage.appendChild(card);
      stage.appendChild(U.el("div", { class: "grid" },
        [U.el("div", { class: "row" }, [toggle]), input, verdict, sampleTable, pad, submitBtn]));
      input.focus();
    }

    function submit() {
      const raw = input.value.trim();
      if (!raw) return;
      attempts++;
      totalAttempts++;
      const tooFast = performance.now() - shownAt < UI.MIN_READ_MS;
      const r = check(raw);

      if (!r.equal) {
        MQ.Sound.notEquivalent();
        MQ.FX.shake();
        penalty += 6 * task.diff;
        scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";
        verdict.className = "equiv-verdict no";
        verdict.textContent = attempts >= 3
          ? "Not equivalent. Showing the answer."
          : "Not equivalent — try again. (" + (3 - attempts) + " left)";
        if (attempts >= 3) reveal(false);
        return;
      }

      solved++;
      if (attempts === 1) firstTry++;
      S.bump("equivalences");
      S.recordAnswer(task.topic, attempts === 1, null);
      S.progressDaily("equiv", 1);

      const base = 14 * task.diff;
      const gain = tooFast ? 0 : Math.round(base / attempts);
      xpEarned += gain;
      coinsEarned += tooFast ? 0 : 3 + task.diff;
      scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

      MQ.Sound.equivalent();
      MQ.FX.burstAt(submitBtn, { count: 22, speed: 5, shape: "glyph", glyphs: ["=", "≡", "✓"] });
      reveal(true, gain);
    }

    function reveal(ok, gain) {
      submitBtn.disabled = true;
      input.disabled = true;
      const fb = U.el("div", { class: "feedback " + (ok ? "ok" : "no") }, [
        U.el("div", { class: "math", html:
          `<b>${ok ? "Equivalent." : "One correct answer: "}</b>` +
          (ok ? "" : U.math(task.accept) + " &mdash; ") + U.math(task.why) }),
        gain ? U.el("div", { class: "tiny muted", style: "margin-top:6px", text: "+" + gain + " XP" }) : null,
        U.el("div", { class: "row", style: "margin-top:12px" }, [
          U.el("button", {
            class: "btn btn-primary js-next",
            text: idx >= pool.length - 1 ? "See results" : "Next →",
            on: { click: () => { if (idx >= pool.length - 1) return finish(); idx++; render(); } }
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

      const accuracy = firstTry / pool.length;
      const efficiency = totalAttempts ? pool.length / totalAttempts : 0;
      const perfect = firstTry === pool.length && pool.length >= 5 && !liveUsed;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }

      // The latched crutch cost, applied at the end where it is visible.
      const crutch = liveUsed ? 0.75 : 1;
      const netXp = Math.round(Math.max(0, xpEarned - penalty) * crutch);
      const newBest = S.recordScore(c.modeId, firstTry);

      const got = UI.award({
        xp: netXp, bonus: Math.round(S.streakBonus() * efficiency), accuracy,
        coins: coinsEarned + (perfect ? 40 : 0)
      });

      UI.results({
        title: "Engine complete",
        correct: firstTry, total: pool.length, xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Solved", solved + "/" + pool.length],
          ["Attempts", totalAttempts],
          ["Live check", liveUsed ? "used" : "unused"]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start };
})();
