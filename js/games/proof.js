/* 🪜 Proof Builder — assemble a proof or derivation from shuffled step cards.

   Chemistry built a synthesis route through a reaction graph; this builds an
   argument. Same validation shape: the puzzle declares its own step count and
   the game checks the assembled order against it.

   Two anti-farm details, both from the addendum:

   · C1 — NO PER-ITEM FLOOR, and the completion bonus is gated on EFFICIENCY
     (ideal steps ÷ steps actually spent, wrong placements included). Flailing
     does eventually solve a proof, so "solved it" cannot be what pays.
   · C2 — RESTART CARRIES ITS COST. The obvious exploit is "try everything,
     note what worked, restart, do it cleanly for full marks". So the wasted
     attempts AND the moves already taken are charged to the puzzle before the
     board clears. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.proof = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  function start(root, cfg) {
    const c = Object.assign({ modeId: "proof", title: "🪜 Proof Builder", rounds: 3, induction: false }, cfg);

    const pool = c.induction ? MQ.Proofs.inductions() : MQ.Proofs.general();
    if (!pool.length) {
      root.appendChild(U.el("div", { class: "empty" }, [
        U.el("div", { class: "empty-ico", text: "🫙" }),
        U.el("p", { text: "No puzzles available for that selection." })
      ]));
      return;
    }
    const puzzles = U.sample(pool, Math.min(c.rounds, pool.length));

    S.markMode(c.modeId);
    S.touchStreak();
    MQ.Sound.gameStart();

    let idx = 0, solved = 0, finished = false;
    let xpEarned = 0, coinsEarned = 0, penalty = 0;
    /* Carried ACROSS restarts — that is the whole point of tracking them here
       rather than inside renderPuzzle(). */
    let movesSpent = 0, idealMoves = 0, wastedTotal = 0, rushed = 0;

    const shell = UI.gameShell(c.title, { confirmExit: true,
      help: c.induction
        ? "Assemble the induction in order: base case, assumption, inductive step, conclusion. " +
          "Some cards are plausible but wrong. Restarting keeps the moves you have already spent."
        : "Put the steps of the proof in the right order. Some cards are plausible but wrong, " +
          "so you cannot finish by elimination. Restarting keeps the moves you have already spent." });
    root.appendChild(shell.root);

    const progChip = UI.chip("1 / " + puzzles.length);
    const scoreChip = UI.chip("0 XP");
    const movesChip = UI.chip("Moves 0");
    [progChip, movesChip, scoreChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    function render() {
      stage.innerHTML = "";
      const p = puzzles[idx];
      progChip.textContent = (idx + 1) + " / " + puzzles.length;
      idealMoves += p.steps.length;
      renderPuzzle(p, 0);
    }

    /**
     * `carried` is the number of moves already spent on THIS puzzle in earlier
     * attempts. It is passed through a restart rather than reset, so a restart
     * is a genuine cost and not a free undo.
     */
    function renderPuzzle(p, carried) {
      stage.innerHTML = "";
      let placed = [];
      let wasted = 0;
      let moves = carried;
      /* §9.5 rule 3, applied to a mode that is not question-shaped: you cannot
         READ and ORDER a set of proof steps in under half a second each. A
         puzzle assembled faster than that was not reasoned about, so it pays
         nothing — this is the gap a farming bot walked straight through,
         because efficiency scaling alone still pays something for flailing
         quickly across several puzzles. */
      const shownAt = performance.now();
      const minThinkMs = p.steps.length * (UI.MIN_READ_MS / 2);

      const goal = U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          U.el("span", { class: "chip", text: MQ.Bank.topicName(p.topic) }),
          UI.tierChip(p.topic),
          U.el("span", { class: "chip", text: "★".repeat(p.diff) }),
          U.el("span", { class: "chip", text: p.steps.length + " steps" })
        ]),
        U.el("div", { class: "qtext math", html: U.math(p.title) }),
        U.el("div", { class: "qsub", text: p.goal })
      ]);

      MQ.__current = { kind: "proof", order: p.steps.slice() };
      const slots = U.el("div", { class: "proof-slots" });
      const poolWrap = U.el("div", { class: "proof-pool" });

      /* The pool: the real steps plus every trap, shuffled together. Without
         the traps the last card is forced, and a proof you can finish by
         elimination teaches nothing. */
      const cards = U.shuffle(
        p.steps.map((text, i) => ({ text, order: i, trap: false }))
          .concat((p.traps || []).map(text => ({ text, order: -1, trap: true })))
      );
      const cardNodes = new Map();

      cards.forEach(card => {
        const node = U.el("button", { class: "proof-card math", type: "button", html: U.math(card.text) });
        node.addEventListener("click", () => place(card, node));
        cardNodes.set(card, node);
        poolWrap.appendChild(node);
      });

      function phaseLabel(i) {
        if (!p.phases) return null;
        const names = { base: "Base case", assume: "Assumption", step: "Inductive step", conclude: "Conclusion" };
        // Only label the FIRST card of each phase, so the run reads as blocks.
        if (i > 0 && p.phases[i] === p.phases[i - 1]) return null;
        return names[p.phases[i]] || null;
      }

      function redrawSlots() {
        slots.innerHTML = "";
        if (!placed.length) {
          slots.appendChild(U.el("div", { class: "muted tiny", text: "Tap the steps below, in order." }));
        }
        placed.forEach((card, i) => {
          const lbl = phaseLabel(i);
          if (lbl) slots.appendChild(U.el("div", { class: "proof-phase", text: lbl }));
          const row = U.el("button", { class: "proof-slot", type: "button" }, [
            U.el("span", { class: "step-n", text: String(i + 1) }),
            U.el("span", { class: "math", html: U.math(card.text) })
          ]);
          // Taking a card back is free, but the move it cost is not refunded.
          row.addEventListener("click", () => {
            if (i !== placed.length - 1) return;
            placed.pop();
            cardNodes.get(card).disabled = false;
            MQ.Sound.tap();
            redrawSlots();
          });
          slots.appendChild(row);
        });
      }

      function place(card, node) {
        if (node.disabled) return;
        moves++;
        movesChip.textContent = "Moves " + moves;

        const expectedIndex = placed.length;
        if (card.trap || card.order !== expectedIndex) {
          wasted++;
          penalty += 5;
          scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";
          MQ.Sound.stepWrong();
          MQ.FX.shake();
          node.classList.add("no");
          setTimeout(() => node.classList.remove("no"), 500);
          return;
        }

        placed.push(card);
        node.disabled = true;
        MQ.Sound.stepPlace();
        redrawSlots();

        if (placed.length === p.steps.length) complete();
      }

      function complete() {
        movesSpent += moves;
        wastedTotal += wasted;
        solved++;
        S.bump("proofsSolved");
        if (p.kind === "induction") S.bump("inductionsSolved");
        S.data.proofsSolved[p.id] = Date.now();
        S.recordAnswer(p.topic, wasted === 0, null);
        S.progressDaily(c.induction ? "proof" : "proof", 1);

        /* No floor. A perfect assembly pays full; a flailed one pays a
           fraction of it, scaled by how many wasted taps it took — and a
           puzzle rushed through faster than it could be read pays nothing
           at all, however efficient the click pattern happened to look. */
        const tooFast = performance.now() - shownAt < minThinkMs;
        if (tooFast) rushed++;
        const eff = p.steps.length / Math.max(p.steps.length, moves);
        const gain = tooFast ? 0 : Math.round(p.steps.length * 12 * p.diff * eff);
        xpEarned += gain;
        coinsEarned += Math.round(p.steps.length * 2 * eff);
        scoreChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

        if (p.kind === "induction") { MQ.Sound.dominoes(); setTimeout(() => MQ.Sound.qed(), 500); }
        else MQ.Sound.proofDone();
        MQ.FX.symbols(window.innerWidth / 2, window.innerHeight * 0.4, 26);
        slots.querySelectorAll(".proof-slot").forEach(n => n.classList.add("ok"));

        if (tooFast) {
          UI.toast({ icon: "⏱️", kind: "bad",
            text: "Assembled too fast to have been read — no XP awarded." });
        }
        stage.appendChild(U.el("div", { class: "feedback ok" }, [
          U.el("div", { html: `<b>${wasted === 0 ? "Assembled perfectly." : "Assembled."}</b> ` +
            `${moves} move${moves === 1 ? "" : "s"} for ${p.steps.length} steps` +
            (wasted ? ` — ${wasted} wrong placement${wasted === 1 ? "" : "s"}.` : ".") +
            ` +${gain} XP` }),
          U.el("div", { class: "row", style: "margin-top:12px" }, [
            U.el("button", {
              class: "btn btn-primary js-next",
              text: idx >= puzzles.length - 1 ? "See results" : "Next proof →",
              on: { click: () => { if (idx >= puzzles.length - 1) return finish(); idx++; render(); } }
            })
          ])
        ]));
        U.$(".js-next", stage).focus();
      }

      /* C2: the restart button. It exists because a wrong assembly can leave
         the board in a state the student wants to abandon — but it charges
         what has already been spent, so "probe, restart, run it clean" is
         never cheaper than getting it right first time. */
      const restart = U.el("button", {
        class: "btn btn-ghost btn-sm", text: "↻ Restart this proof",
        on: { click: () => {
          UI.confirmDialog("Restart this proof?",
            `The <b>${moves} move${moves === 1 ? "" : "s"}</b> you have already spent stay on the ` +
            `clock — restarting clears the board but not the cost.`,
            () => { MQ.Sound.swipe(); renderPuzzle(p, moves); }, "Restart");
        } }
      });

      redrawSlots();
      stage.appendChild(goal);
      stage.appendChild(U.el("h3", { text: "Your proof" }));
      stage.appendChild(slots);
      stage.appendChild(U.el("div", { class: "row" }, [
        U.el("h3", { text: "Available steps", style: "margin:0" }),
        U.el("div", { class: "spacer" }),
        restart
      ]));
      stage.appendChild(poolWrap);
      movesChip.textContent = "Moves " + moves;
    }

    function finish() {
      if (finished) return;
      finished = true;

      /* Efficiency, not completion. This is the number that stopped a flailing
         bot earning 83 XP in the reference app. */
      const efficiency = U.clamp(idealMoves / Math.max(1, movesSpent), 0, 1);
      const perfect = wastedTotal === 0 && solved === puzzles.length;
      if (perfect) { S.bump("perfectRuns"); MQ.Sound.perfect(); }

      const netXp = Math.max(0, xpEarned - penalty);
      const newBest = S.recordScore(c.modeId, Math.round(efficiency * 100));

      const got = UI.award({
        xp: netXp,
        bonus: Math.round(S.streakBonus() * efficiency),
        accuracy: efficiency,
        coins: coinsEarned + (perfect ? 40 : 0)
      });

      UI.results({
        title: perfect ? "Q.E.D." : "Proofs assembled",
        correct: solved, total: puzzles.length, xp: got.xp, coins: got.coins, newBest,
        extraStats: [
          ["Moves", movesSpent + " / " + idealMoves],
          ["Efficiency", Math.round(efficiency * 100) + "%"],
          rushed ? ["Rushed", rushed] : ["Misplaced", wastedTotal]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start };
})();

/* 🪜 Induction Builder — the Extension-only specialisation.

   It is the same engine with `induction: true`, which draws only from the
   induction puzzles and turns on the phase labels so the four stages read as
   distinct blocks rather than one undifferentiated list. Induction is the
   hardest thing in Extension 1 to learn from a textbook and the easiest to
   drill interactively, which is exactly why it gets its own entry point. */
MQ.Games.induction = (function () {
  function start(root, cfg) {
    return MQ.Games.proof.start(root, Object.assign({
      modeId: "induction", title: "🪜 Induction Builder", rounds: 3, induction: true
    }, cfg));
  }
  return { start };
})();
