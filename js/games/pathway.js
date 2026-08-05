/* Pathway Puzzle — build an organic synthesis route by choosing reagents. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.pathway = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  const nodes = () => CHEM.DATA.pathwayNodes;
  const reagentById = id => CHEM.DATA.reagents.find(r => r.id === id);

  /* Switching a coverage pack off in Settings has to remove its chemistry from the
     graph, not just from the puzzle list: otherwise `shortest` still routes through a
     compound the student was never taught, and the "target: N steps" chip promises a
     route they cannot see. Rebuilt at the start of every run, since the setting can
     change between runs. */
  let EDGES = null;
  const nodeOn = id => S.tagOn((nodes()[id] || {}).tag);
  const reagentOn = id => S.tagOn((reagentById(id) || {}).tag);

  function edges() {
    if (!EDGES) {
      EDGES = CHEM.DATA.pathwayEdges.filter(e =>
        nodeOn(e.from) && nodeOn(e.to) && reagentOn(e.via));
    }
    return EDGES;
  }

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
    const c = Object.assign({ rounds: 5 }, cfg);
    S.markMode("pathway");
    S.touchStreak();

    EDGES = null;                                   // coverage may have changed
    const available = CHEM.DATA.pathwayPuzzles.filter(p => nodeOn(p.start) && nodeOn(p.target));
    // Fewer puzzles than rounds is a shorter run, not a repeated one.
    const puzzles = U.sample(available, Math.min(c.rounds, available.length));
    let round = 0, solved = 0, xpEarned = 0, coins = 0, totalWasted = 0, finished = false;
    /* Route quality, tracked across the whole run: the ideal step count against what
       it actually took, wasted reagents included. Clicking every card until something
       reacts does eventually reach the target, so "solved" alone is not evidence of
       knowing anything — this is what the completion bonus is gated on. */
    let totalOptimal = 0, totalTaken = 0;
    /* Wasted picks are held per round rather than per attempt, so "Restart this route"
       clears the track but not the cost. The button exists to rescue a player who has
       wandered off-route, not to let one try all nineteen cards, note which reacted,
       and then walk the route cleanly for full marks. */
    const wastedByRound = [];

    const shell = UI.gameShell("Pathway Puzzle", { tools: { notes: true, reference: true },  confirmExit: true });
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
      if (wastedByRound[round] == null) wastedByRound[round] = 0;
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
        CHEM.DATA.reagents.filter(rg => reagentOn(rg.id)).forEach(rg => {
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
          wastedByRound[round]++;
          totalWasted++;
          CHEM.Sound.noReaction();
          CHEM.FX.shake();
          feedback.appendChild(U.el("div", { class: "feedback no", html:
            `<b>No reaction.</b> ${U.formula(rg.label)} does not react with ${U.escapeHtml(nodes()[current].label)} to give a new product here.` }));
          stepChip.textContent = `${path.length - 1} steps · ${wastedByRound[round]} wasted`;
          return;
        }

        current = e.to;
        path.push({ node: e.to, via: rg.id });
        CHEM.Sound.reaction();
        drawTrack();
        stepChip.textContent = `${path.length - 1} steps${wastedByRound[round] ? " · " + wastedByRound[round] + " wasted" : ""}`;

        if (current === p.target) {
          done = true;
          solved++;
          drawPool();
          S.bump("pathways");
          S.data.pathwaysSolved[p.start + ">" + p.target] = true;
          S.progressDaily("pathway", 1);
          S.save();

          const steps = path.length - 1;
          const wasted = wastedByRound[round];
          const efficiency = optimal / steps;
          totalOptimal += optimal;
          totalTaken += steps + wasted;
          /* No floor. There used to be a `Math.max(15, …)` here, which meant a run
             that clicked every reagent on every puzzle still banked the minimum on
             all five rounds — and it scored full accuracy, because it did finish
             them. Detours and dead ends now subtract all the way to nothing. */
          const gain = Math.round(60 * p.diff * efficiency) - wasted * 8;
          xpEarned += Math.max(0, gain);
          coins += Math.max(0, Math.round(18 * efficiency) - wasted * 2);

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

      /* Restarting is often the only way out: every polymer, ester and salt is a dead
         end with no outgoing reaction, so one wrong turn strands you. The button has
         to exist — but the steps already taken are charged to the round before the
         track is cleared, otherwise it is a free undo and the cheapest strategy
         becomes "react at random, restart, repeat until you have mapped the graph". */
      const resetBtn = U.el("button", {
        class: "btn btn-sm btn-ghost", text: "↺ Restart this route",
        on: { click: () => {
          if (done) return;
          wastedByRound[round] += path.length - 1;
          render();
        } }
      });
      stage.appendChild(U.el("div", { class: "row" }, [resetBtn]));

      drawTrack();
      drawPool();
    }

    function finish() {
      if (finished) return;
      finished = true;
      const newBest = S.recordScore("pathway", solved);
      if (solved === puzzles.length && totalWasted === 0) S.bump("perfectRuns");
      const quality = totalTaken ? totalOptimal / totalTaken : 0;
      const got = UI.award({ xp: xpEarned, coins, bonus: S.streakBonus(),
                             accuracy: (solved / puzzles.length) * quality });
      UI.results({
        title: "Synthesis complete",
        correct: solved, total: puzzles.length, xp: got.xp, coins: got.coins, newBest,
        extraStats: [["Wasted reagents", totalWasted],
                     ["Routes solved", `${solved}/${puzzles.length}`],
                     ["Route efficiency", Math.round(quality * 100) + "%"]],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start, shortest };
})();
