/* 🎯 Vector Lab — Extension 1 only, and the second-best toy in the app.

   A projectile-motion canvas: drag the launch angle and speed to hit a target,
   then compute the exact range, time of flight or maximum height. It hides
   itself entirely when TIERS excludes "ME" — a genuine reward for being on the
   Extension tier rather than a difficulty gate.

   The target is placed FIRST and the launch parameters are derived from it
   (§9.9), which is what guarantees the target is always reachable and always
   on the canvas. Randomising angle and speed and hoping puts it off-screen. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.vector = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI, D = MQ.Draw;
  const G = 9.8;

  /**
   * Build a round. The TARGET DISTANCE is chosen first, then a reference
   * angle, and the speed that reaches it is derived — so a solution always
   * exists and always lands inside the drawn window.
   * Exported so the validator can generate rounds headlessly.
   */
  function buildRound(seed) {
    const rng = U.seededRandom(U.hash(String(seed)));
    const range = 40 + Math.floor(rng() * 120);            // 40–160 m, always on canvas
    const refAngle = 25 + Math.floor(rng() * 45);          // 25–69 deg, a sane launch
    const th = (refAngle * Math.PI) / 180;
    const V = Math.sqrt((range * G) / Math.sin(2 * th));
    const ask = ["range", "time", "height"][Math.floor(rng() * 3)];
    return { range, refAngle, V, ask };
  }

  const rangeOf = (V, deg) => (V * V * Math.sin((2 * deg * Math.PI) / 180)) / G;
  const timeOf = (V, deg) => (2 * V * Math.sin((deg * Math.PI) / 180)) / G;
  const heightOf = (V, deg) => Math.pow(V * Math.sin((deg * Math.PI) / 180), 2) / (2 * G);

  function start(root, cfg) {
    const c = Object.assign({ modeId: "vector", title: "🎯 Vector Lab", rounds: 3 }, cfg);

    if (!MQ.DATA.hasExt()) { UI.go("/play"); return; }

    S.markMode(c.modeId);
    S.touchStreak();
    MQ.Sound.gameStart();

    let round = 0, hits = 0, exact = 0, finished = false;
    let xpEarned = 0, coinsEarned = 0, penalty = 0;

    const shell = UI.gameShell(c.title, { confirmExit: true,
      help: "Set the launch angle and speed so the projectile lands on the target, then compute " +
            "the quantity asked for exactly. Landing close enough scores; landing dead centre " +
            "scores more. Air resistance is ignored, as it is in the syllabus." });
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
      stage.innerHTML = "";
      progChip.textContent = (round + 1) + " / " + c.rounds;

      const spec = buildRound(c.modeId + "-" + Date.now() + "-" + round + "-" + U.randInt(1, 1e9));
      let angle = 45, speed = Math.round(spec.V);
      let launched = false, landedAt = null;

      const canvas = U.el("canvas", { class: "plot tall" });
      const cap = U.el("div", { class: "plot-cap", text: "Set the angle and speed, then fire." });

      const aS = U.el("input", { type: "range", min: "10", max: "80", step: "1", value: "45" });
      const aO = U.el("output", { text: "45°" });
      const vS = U.el("input", { type: "range", min: "10", max: "60", step: "0.5", value: String(speed) });
      const vO = U.el("output", { text: U.fmtNum(speed) + " m/s" });

      const xmax = Math.max(spec.range * 1.35, 60);
      const ymax = Math.max(heightOf(60, 80), spec.range * 0.4);

      function trajectory(V, deg) {
        const th = (deg * Math.PI) / 180;
        return x => {
          const t = x / (V * Math.cos(th));
          return V * Math.sin(th) * t - 0.5 * G * t * t;
        };
      }

      function draw(progress) {
        const fr = D.frame(canvas, { xmin: -6, xmax, ymin: -ymax * 0.12, ymax, pad: 18 });
        D.axes(fr, { grid: true });

        // The target sits on the ground at the chosen range.
        const P = fr.P;
        fr.ctx.save();
        fr.ctx.fillStyle = P.warn;
        fr.ctx.globalAlpha = 0.9;
        fr.ctx.fillRect(fr.X(spec.range) - 9, fr.Y(0) - 4, 18, 8);
        fr.ctx.restore();
        D.label(fr, spec.range, 0, "target " + spec.range + " m",
          { dy: 20, align: "center", colour: P.warn, bold: true });

        const traj = trajectory(speed, angle);
        const flightX = rangeOf(speed, angle);
        const shown = progress === undefined ? flightX : flightX * progress;
        D.curve(fr, traj, { colour: P.accent, width: 2.4, from: 0, to: Math.max(0.01, shown), steps: 220 });

        // The launch velocity, drawn as the vector it is.
        const th = (angle * Math.PI) / 180;
        const s = Math.min(xmax * 0.18, 22);
        D.arrow(fr, 0, 0, s * Math.cos(th), s * Math.sin(th), { colour: P.good, width: 3 });

        if (progress !== undefined && progress > 0) {
          const px = flightX * progress;
          D.point(fr, px, Math.max(0, traj(px)), { r: 5, colour: P.bad });
        }
        if (landedAt !== null) D.point(fr, landedAt, 0, { r: 6, colour: P.bad });
      }
      repaint = () => draw(launched ? 1 : undefined);

      aS.addEventListener("input", () => {
        if (launched) return;
        angle = parseInt(aS.value, 10);
        aO.textContent = angle + "°";
        MQ.Sound.dragTick();
        draw();
      });
      vS.addEventListener("input", () => {
        if (launched) return;
        speed = parseFloat(vS.value);
        vO.textContent = U.fmtNum(speed) + " m/s";
        MQ.Sound.dragTick();
        draw();
      });

      const fireBtn = U.el("button", { class: "btn btn-primary btn-block", text: "🚀 Fire" });
      const askWrap = U.el("div", { class: "grid" });

      fireBtn.addEventListener("click", () => {
        if (launched) return;
        launched = true;
        fireBtn.disabled = aS.disabled = vS.disabled = true;
        MQ.Sound.launch();

        const landing = rangeOf(speed, angle);
        landedAt = landing;
        const err = Math.abs(landing - spec.range) / spec.range;
        const hit = err <= 0.05;
        const bull = err <= 0.01;

        /* One animation loop, torn down the moment it finishes or the screen
           changes. A rAF that outlives its screen is the leak UI.onLeave
           exists to catch, and an animated-graph app has a lot of them. */
        let t0 = null, raf = null;
        const step = ts => {
          if (t0 === null) t0 = ts;
          const p = Math.min(1, (ts - t0) / 900);
          draw(p);
          if (p < 1) raf = requestAnimationFrame(step);
          else {
            raf = null;
            if (hit) {
              MQ.Sound.hitTarget();
              MQ.FX.burstAt(canvas, { count: 30, speed: 6, shape: "circle" });
            } else {
              MQ.Sound.missTarget();
              MQ.FX.shake();
            }
            afterLaunch(hit, bull, landing);
          }
        };
        raf = requestAnimationFrame(step);
        UI.onLeave(() => {
          if (raf) cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
        });
      });

      function afterLaunch(hit, bull, landing) {
        S.bump("projectilesLanded");
        if (bull) S.bump("bullseyes");
        if (hit) hits++;
        cap.textContent = hit
          ? (bull ? `Dead centre — landed at ${U.fmtNum(U.sigFig(landing,4))} m.`
                  : `Hit — landed at ${U.fmtNum(U.sigFig(landing,4))} m.`)
          : `Missed — landed at ${U.fmtNum(U.sigFig(landing,4))} m, target was ${spec.range} m.`;

        if (hit) { xpEarned += bull ? 34 : 22; coinsEarned += bull ? 7 : 4; }
        else penalty += 8;
        scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

        /* Now the maths. The toy is the hook; this is the mode. */
        const asked = { range: "the range, in metres",
                        time: "the time of flight, in seconds",
                        height: "the maximum height, in metres" }[spec.ask];
        const answer = spec.ask === "range" ? rangeOf(speed, angle)
                     : spec.ask === "time" ? timeOf(speed, angle)
                     : heightOf(speed, angle);
        const formula = { range: "\\frac{V^2 sin 2theta}{g}",
                          time: "\\frac{2V sin theta}{g}",
                          height: "\\frac{V^2 sin^2 theta}{2g}" }[spec.ask];

        const input = U.el("input", { class: "numin", type: "text", autocomplete: "off",
          placeholder: "4 decimal places" });
        const submit = U.el("button", { class: "btn btn-primary btn-block", text: "Submit" });

        askWrap.appendChild(U.el("div", { class: "qcard" }, [
          U.el("div", { class: "qtext", text:
            `You launched at ${U.fmtNum(speed)} m/s and ${angle}°. Compute ${asked}.` }),
          U.el("div", { class: "qsub", text: "Take g = 9.8." })
        ]));
        askWrap.appendChild(input);
        askWrap.appendChild(submit);
        input.focus();

        submit.addEventListener("click", () => {
          const raw = input.value.trim();
          if (!raw) { input.classList.add("err"); setTimeout(() => input.classList.remove("err"), 400); return; }
          submit.disabled = input.disabled = true;
          const ok = U.numClose(raw, answer, 0.005);
          S.recordAnswer("ME-V1", ok, null);
          S.progressDaily("vector", 1);
          if (ok) {
            exact++;
            xpEarned += 30;
            coinsEarned += 6;
            MQ.Sound.correct();
          } else {
            penalty += 10;
            MQ.Sound.wrong();
          }
          scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

          askWrap.appendChild(U.el("div", { class: "feedback " + (ok ? "ok" : "no") }, [
            U.el("div", { class: "math", html:
              `<b>${ok ? "Correct." : "Not quite."}</b> ` + U.math(formula) +
              ` = ${U.fmtNum(U.sigFig(answer, 6))}. ` +
              U.math("Horizontal velocity is constant throughout; only the vertical component feels g.") }),
            U.el("div", { class: "row", style: "margin-top:12px" }, [
              U.el("button", {
                class: "btn btn-primary js-next",
                text: round >= c.rounds - 1 ? "See results" : "Next launch →",
                on: { click: () => { if (round >= c.rounds - 1) return finish(); round++; render(); } }
              })
            ])
          ]));
          U.$(".js-next", askWrap).focus();
        });
      }

      stage.appendChild(U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          U.el("span", { class: "chip", text: "Vectors" }),
          UI.tierChip("ME-V1"),
          U.el("span", { class: "chip on", text: "target " + spec.range + " m" })
        ]),
        U.el("div", { class: "qtext", text: "Hit the target, then do the maths." })
      ]));
      stage.appendChild(U.el("div", { class: "grid" }, [
        U.el("div", { class: "plot-wrap" }, [canvas]), cap,
        U.el("div", { class: "slider-row" }, [U.el("label", { text: "angle" }), aS, aO]),
        U.el("div", { class: "slider-row" }, [U.el("label", { text: "speed" }), vS, vO]),
        fireBtn
      ]));
      stage.appendChild(askWrap);
      requestAnimationFrame(() => draw());
    }

    function finish() {
      if (finished) return;
      finished = true;
      window.removeEventListener("resize", onResize);

      const accuracy = (hits + exact) / (c.rounds * 2);
      const perfect = hits === c.rounds && exact === c.rounds;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }
      const newBest = S.recordScore(c.modeId, hits + exact);

      const got = UI.award({
        xp: Math.max(0, xpEarned - penalty), bonus: S.streakBonus(), accuracy,
        coins: coinsEarned + (perfect ? 50 : 0)
      });

      UI.results({
        title: perfect ? "Perfect trajectory" : "Launches complete",
        correct: hits + exact, total: c.rounds * 2, xp: got.xp, coins: got.coins, newBest,
        extraStats: [["Targets hit", hits + "/" + c.rounds],
                     ["Calculations", exact + "/" + c.rounds],
                     ["Wrong", "−" + penalty + " XP"]],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start, buildRound, rangeOf, timeOf, heightOf };
})();
