/* Pathway Puzzle — build an organic synthesis route by choosing reagents. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.pathway = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  const nodes = () => CHEM.DATA.pathwayNodes;
  const edges = () => CHEM.DATA.pathwayEdges;
  const reagentById = id => CHEM.DATA.reagents.find(r => r.id === id);

  function edgeFrom(from, via) {
    return edges().find(e => e.from === from && e.via === via);
  }

  /** Shortest number of steps from → to, or Infinity. */
  function shortest(from, to) {
    const seen = new Set([from]);
    let frontier = [from], depth = 0;
    while (frontier.length) {
      if (frontier.includes(to)) return depth;
      const next = [];
      for (const n of frontier) {
        for (const e of edges()) {
          if (e.from === n && !seen.has(e.to)) { seen.add(e.to); next.push(e.to); }
        }
      }
      frontier = next;
      depth++;
      if (depth > 12) break;
    }
    return Infinity;
  }

  function start(root, cfg) {
    const c = Object.assign({ rounds: 3 }, cfg);
    S.markMode("pathway");
    S.touchStreak();

    const puzzles = U.sample(CHEM.DATA.pathwayPuzzles, c.rounds);
    let round = 0, solved = 0, xpEarned = 0, coins = 0, totalWasted = 0, finished = false;

    const shell = UI.gameShell("Pathway Puzzle", { confirmExit: true });
    root.appendChild(shell.root);
    const progChip = UI.chip("1 / " + puzzles.length);
    const stepChip = UI.chip("0 steps");
    [progChip, stepChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    function render() {
      const p = puzzles[round];
      const optimal = shortest(p.start, p.target);
      let current = p.start;
      let path = [{ node: p.start }];
      let wasted = 0;
      let done = false;

      progChip.textContent = `${round + 1} / ${puzzles.length}`;
      stepChip.textContent = "0 steps";
      stage.innerHTML = "";

      const brief = U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          UI.chip("Module 7 · Synthesis"), UI.chip("★".repeat(p.diff)),
          UI.chip(`Target: ${optimal} step${optimal === 1 ? "" : "s"}`)
        ]),
        U.el("div", { class: "qtext", html:
          `Convert <b>${nodes()[p.start].label}</b> into <b>${nodes()[p.target].label}</b>.` }),
        U.el("p", { class: "tiny muted", text: "Pick reagents in order. A reagent that cannot react with your current compound costs you a step." })
      ]);
      stage.appendChild(brief);

      const track = U.el("div", { class: "path-track" });
      stage.appendChild(track);

      const pool = U.el("div", { class: "reagent-pool" });
      stage.appendChild(U.el("div", { class: "qcard" }, [
        U.el("h3", { text: "Reagents & conditions" }), pool
      ]));

      const feedback = U.el("div");
      stage.appendChild(feedback);

      function drawTrack() {
        track.innerHTML = "";
        path.forEach((step, i) => {
          if (i > 0) {
            track.appendChild(U.el("div", { class: "path-arrow" }, [
              U.el("span", { text: "──▶" }),
              U.el("small", { text: reagentById(step.via).label })
            ]));
          }
          const isTarget = step.node === p.target;
          const n = nodes()[step.node];
          track.appendChild(U.el("div", {
            class: "path-node" + (i === 0 ? " start" : "") + (isTarget ? " target" : ""),
            html: `${U.escapeHtml(n.label)}<br><small class="tiny muted">${U.formula(n.sub)}</small>`
          }));
        });
        if (current !== p.target) {
          track.appendChild(U.el("div", { class: "path-arrow" }, [U.el("span", { text: "──▶ ?" })]));
          track.appendChild(U.el("div", { class: "path-node target", html:
            `${U.escapeHtml(nodes()[p.target].label)}<br><small class="tiny muted">${U.formula(nodes()[p.target].sub)}</small>` }));
        }
      }

      function drawPool() {
        pool.innerHTML = "";
        CHEM.DATA.reagents.forEach(rg => {
          const b = U.el("button", { class: "reagent", type: "button", disabled: done }, [
            U.el("span", { html: U.formula(rg.label) }),
            U.el("small", { text: rg.sub })
          ]);
          b.addEventListener("click", () => apply(rg));
          pool.appendChild(b);
        });
      }

      function apply(rg) {
        if (done) return;
        const e = edgeFrom(current, rg.id);
        feedback.innerHTML = "";

        if (!e) {
          wasted++;
          totalWasted++;
          CHEM.Sound.noReaction();
          CHEM.FX.shake();
          feedback.appendChild(U.el("div", { class: "feedback no", html:
            `<b>No reaction.</b> ${U.formula(rg.label)} does not react with ${U.escapeHtml(nodes()[current].label)} to give a new product here.` }));
          stepChip.textContent = `${path.length - 1} steps · ${wasted} wasted`;
          return;
        }

        current = e.to;
        path.push({ node: e.to, via: rg.id });
        CHEM.Sound.reaction();
        drawTrack();
        stepChip.textContent = `${path.length - 1} steps${wasted ? " · " + wasted + " wasted" : ""}`;

        if (current === p.target) {
          done = true;
          solved++;
          drawPool();
          S.bump("pathways");
          S.data.pathwaysSolved[p.start + ">" + p.target] = true;
          S.progressDaily("pathway", 1);
          S.save();

          const steps = path.length - 1;
          const efficiency = optimal / steps;
          const gain = Math.round(60 * p.diff * efficiency) - wasted * 8;
          xpEarned += Math.max(15, gain);
          coins += Math.max(5, Math.round(18 * efficiency) - wasted * 2);

          CHEM.Sound.win();
          CHEM.FX.confetti(60);
          feedback.appendChild(U.el("div", { class: "feedback ok", html:
            `<b>Route complete in ${steps} step${steps === 1 ? "" : "s"}</b> (optimal ${optimal}). ${U.escapeHtml(p.note)}` }));

          const next = U.el("button", {
            class: "btn btn-primary",
            text: round >= puzzles.length - 1 ? "See results" : "Next puzzle →",
            on: { click: () => { if (round >= puzzles.length - 1) return finish(); round++; render(); } }
          });
          feedback.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [next]));
          next.focus();
        }
      }

      const resetBtn = U.el("button", {
        class: "btn btn-sm btn-ghost", text: "↺ Restart this route",
        on: { click: () => { if (!done) render(); } }
      });
      stage.appendChild(U.el("div", { class: "row" }, [resetBtn]));

      drawTrack();
      drawPool();
    }

    function finish() {
      if (finished) return;
      finished = true;
      const bonus = S.streakBonus();
      const xp = xpEarned + bonus;
      const newBest = S.recordScore("pathway", solved);
      if (solved === puzzles.length && totalWasted === 0) S.bump("perfectRuns");
      const got = UI.award({ xp, coins });
      UI.results({
        title: "Synthesis complete",
        correct: solved, total: puzzles.length, xp: got.xp, coins: got.coins, newBest,
        extraStats: [["Wasted reagents", totalWasted], ["Daily bonus", "+" + bonus]],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start, shortest };
})();
