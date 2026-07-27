/* Arcade session manager: ticket purchase, the play clock, and the shared shell
   every arcade game runs inside.

   Play time is bought with Moles and stored as seconds remaining, per game. The
   clock only runs while you are actually on the game screen, so leaving mid-session
   banks the rest for later. Nothing here awards XP or Moles — the arcade exists to
   spend the currency that studying earns, not to generate it. */
window.CHEM = window.CHEM || {};

CHEM.Arcade = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  const def = id => CHEM.DATA.arcade.find(g => g.id === id);

  function store() {
    const d = S.data;
    if (!d.arcade) d.arcade = { tickets: {}, scores: {}, played: {} };
    if (!d.arcade.tickets) d.arcade.tickets = {};
    if (!d.arcade.scores) d.arcade.scores = {};
    if (!d.arcade.played) d.arcade.played = {};
    return d.arcade;
  }

  const timeLeft = id => Math.max(0, Math.floor(store().tickets[id] || 0));

  function buy(id, ticket) {
    if (!S.spendCoins(ticket.cost)) {
      CHEM.Sound.denied();
      UI.toast({ icon: "🪙", kind: "bad", text: "Not enough Moles for that ticket." });
      return false;
    }
    const a = store();
    a.tickets[id] = (a.tickets[id] || 0) + ticket.secs;
    S.emit();
    CHEM.Sound.purchase();
    UI.toast({ icon: "🎟️", kind: "good",
      text: `<b>${ticket.label}</b> of ${U.escapeHtml(def(id).name)} added.` });
    return true;
  }

  /** Burn one second of credit. Returns the remaining seconds. */
  function tick(id) {
    const a = store();
    a.tickets[id] = Math.max(0, (a.tickets[id] || 0) - 1);
    // Persist about twice a minute rather than every tick.
    if (a.tickets[id] % 30 === 0) S.save();
    return a.tickets[id];
  }

  function recordScore(id, score) {
    const a = store();
    const best = a.scores[id] || 0;
    a.played[id] = (a.played[id] || 0) + 1;
    if (score > best) { a.scores[id] = score; S.save(); return true; }
    S.save();
    return false;
  }

  const bestScore = id => store().scores[id] || 0;

  /* ── the ticket booth ─────────────────────────────────────── */
  function booth(root, g) {
    const locked = S.data.level < (g.minLevel || 1);

    root.appendChild(U.el("div", { class: "qcard arcade-booth" }, [
      U.el("div", { class: "arcade-hero", style: `--gc:${g.colour}` }, [
        U.el("div", { class: "arcade-hero-ico", text: g.icon }),
        U.el("div", {}, [
          U.el("h2", { style: "margin:0", text: g.name }),
          U.el("p", { class: "muted", style: "margin:4px 0 0", text: g.blurb })
        ])
      ]),
      U.el("p", { class: "tiny muted", text: g.how }),
      U.el("div", { class: "row", style: "margin-top:6px" }, [
        UI.chip("🏆 Best " + bestScore(g.id)),
        UI.chip("🎟️ " + U.fmtTime(timeLeft(g.id)) + " credit"),
        UI.chip("No XP — pure fun")
      ])
    ]));

    if (locked) {
      root.appendChild(U.el("div", { class: "feedback no", html:
        `<b>Locked.</b> Reach level ${g.minLevel} to unlock ${U.escapeHtml(g.name)}.` }));
      return;
    }

    root.appendChild(U.el("h2", { text: "Buy play time" }));
    root.appendChild(U.el("div", { class: "grid g3" }, g.tickets.map(t => {
      const afford = S.data.coins >= t.cost;
      return U.el("div", { class: "shop-item" }, [
        U.el("div", { class: "shop-ico", text: "🎟️" }),
        U.el("div", { class: "shop-name", text: t.label }),
        U.el("div", { class: "shop-desc", text:
          `${Math.round(t.cost / (t.secs / 60))} Moles per minute` }),
        U.el("button", {
          class: "btn btn-sm " + (afford ? "btn-primary" : ""),
          text: `${t.cost} 🪙`, disabled: !afford,
          on: { click: () => { if (buy(g.id, t)) UI.handleRoute(); } }
        })
      ]);
    })));

    if (timeLeft(g.id) > 0) {
      root.appendChild(U.el("button", {
        class: "btn btn-primary btn-block", style: "margin-top:14px",
        text: `▶ Play — ${U.fmtTime(timeLeft(g.id))} left`,
        on: { click: () => launch(root, g) }
      }));
    } else {
      root.appendChild(U.el("p", { class: "tiny muted", style: "margin-top:14px", text:
        "Earn Moles by answering questions, clearing dailies and completing weekly quests." }));
    }
  }

  /* ── the play session ─────────────────────────────────────── */
  function launch(root, g) {
    root.innerHTML = "";
    const shell = UI.gameShell(g.name, { backTo: "/arcade" });
    root.appendChild(shell.root);

    const clockChip = U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft(g.id)) });
    const scoreChip = UI.chip("Score 0");
    const bestChip = UI.chip("Best " + bestScore(g.id));
    [scoreChip, bestChip, clockChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "arcade-stage" });
    shell.body.appendChild(stage);

    let score = 0, over = false, timerId = null;

    const session = {
      /** Games call this to report their running score. */
      setScore(n) {
        score = Math.max(0, Math.round(n));
        scoreChip.textContent = "Score " + score.toLocaleString();
      },
      addScore(n) { session.setScore(score + n); },
      get score() { return score; },
      isOver: () => over,
      /** A game ending (crash, no moves) — the clock keeps running so you can retry. */
      gameOver(detail) { showGameOver(detail); }
    };

    let api = null;
    try {
      api = CHEM.ArcadeGames[g.id].start(stage, session);
    } catch (e) {
      console.warn("Arcade game failed to start:", e);
      stage.appendChild(U.el("div", { class: "feedback no", text: "This game failed to load." }));
    }

    CHEM.Sound.gameStart();

    timerId = setInterval(() => {
      const left = tick(g.id);
      clockChip.textContent = U.fmtTime(left);
      clockChip.classList.toggle("low", left <= 20);
      if (left <= 5 && left > 0) CHEM.Sound.tickUrgent();
      if (left <= 0) endSession();
    }, 1000);

    function cleanup() {
      clearInterval(timerId);
      if (api && api.destroy) { try { api.destroy(); } catch (e) { /* ignore */ } }
    }
    UI.onLeave(() => { cleanup(); S.save(); });

    function showGameOver(detail) {
      const best = recordScore(g.id, score);
      if (best) { CHEM.Sound.rankUp(); CHEM.FX.confetti(50); } else CHEM.Sound.lose();
      bestChip.textContent = "Best " + bestScore(g.id);

      const box = U.el("div", { class: "modal-center" }, [
        U.el("div", { class: "modal-big", text: g.icon }),
        U.el("h2", { style: "justify-content:center", text: best ? "New high score!" : "Game over" }),
        detail ? U.el("p", { text: detail }) : null,
        U.el("div", { class: "result-grid" }, [
          cell(score.toLocaleString(), "Score"),
          cell(bestScore(g.id).toLocaleString(), "Best"),
          cell(U.fmtTime(timeLeft(g.id)), "Time left")
        ]),
        U.el("div", { class: "row" }, [
          U.el("button", {
            class: "btn btn-ghost btn-sm", text: "Back to arcade",
            on: { click: () => { UI.closeModal(); cleanup(); UI.go("/arcade"); } }
          }),
          U.el("div", { class: "spacer" }),
          timeLeft(g.id) > 0
            ? U.el("button", {
                class: "btn btn-primary", text: "Play again",
                on: { click: () => { UI.closeModal(); cleanup(); launch(root, g); } }
              })
            : null
        ])
      ]);
      UI.modal(box, { sticky: true });
    }

    function endSession() {
      if (over) return;
      over = true;
      cleanup();
      recordScore(g.id, score);
      CHEM.Sound.timeout();
      const box = U.el("div", { class: "modal-center" }, [
        U.el("div", { class: "modal-big", text: "🎟️" }),
        U.el("h2", { style: "justify-content:center", text: "Time's up" }),
        U.el("p", { text: "Your ticket has run out. Buy more play time, or go and earn some Moles." }),
        U.el("div", { class: "result-grid" }, [
          cell(score.toLocaleString(), "Score"),
          cell(bestScore(g.id).toLocaleString(), "Best"),
          cell(S.data.coins.toLocaleString(), "Moles")
        ]),
        U.el("div", { class: "row" }, [
          U.el("button", {
            class: "btn btn-ghost btn-sm", text: "Go study",
            on: { click: () => { UI.closeModal(); UI.go("/play"); } }
          }),
          U.el("div", { class: "spacer" }),
          U.el("button", {
            class: "btn btn-primary", text: "Buy more time",
            on: { click: () => { UI.closeModal(); UI.go("/arcade/" + g.id); } }
          })
        ])
      ]);
      UI.modal(box, { sticky: true });
    }

    function cell(n, l) {
      return U.el("div", { class: "result-cell" }, [
        U.el("div", { class: "result-num", text: String(n) }),
        U.el("div", { class: "result-lbl", text: l })
      ]);
    }
  }

  /* ── screens ──────────────────────────────────────────────── */
  function list(view) {
    view.appendChild(U.el("h1", { text: "The Arcade" }));
    view.appendChild(U.el("p", { html:
      "Spend your <b>Moles</b> on play time. These games are pure fun — they teach no " +
      "chemistry and award <b>no XP</b>, so your level always reflects real study." }));

    view.appendChild(U.el("div", { class: "grid g2", style: "margin-top:16px" },
      CHEM.DATA.arcade.map(g => {
        const locked = S.data.level < (g.minLevel || 1);
        const credit = timeLeft(g.id);
        const card = U.el("button", {
          class: "game-card" + (locked ? " locked" : ""),
          style: `--gc:${g.colour}`, disabled: locked
        }, [
          U.el("div", { class: "game-ico", text: g.icon }),
          U.el("div", { class: "game-name", text: g.name }),
          U.el("div", { class: "game-desc", text: g.blurb }),
          U.el("div", { class: "game-foot" }, [
            U.el("span", { class: "chip", text: "🏆 " + bestScore(g.id) }),
            credit > 0
              ? U.el("span", { class: "chip on", text: "🎟️ " + U.fmtTime(credit) })
              : U.el("span", { class: "chip", text: "from " + g.tickets[0].cost + " 🪙" }),
            locked ? U.el("span", { class: "chip lock-tag", text: "🔒 Lv " + g.minLevel }) : null
          ])
        ]);
        if (!locked) card.addEventListener("click", () => UI.go("/arcade/" + g.id));
        return card;
      })));

    view.appendChild(U.el("div", { class: "card", style: "margin-top:18px" }, [
      U.el("h3", { text: "Why does it cost Moles?" }),
      U.el("p", { class: "tiny muted", style: "margin:0", html:
        "Moles come from studying — correct answers, daily challenges and weekly quests. " +
        "The arcade is what you spend them on. Because these games award no XP, no amount " +
        "of playing them moves your level or your module mastery." })
    ]));
  }

  function screen(view, args) {
    const id = args[0];
    if (!id) return list(view);
    const g = def(id);
    if (!g) return UI.go("/arcade");

    view.appendChild(U.el("div", { class: "row", style: "margin-bottom:12px" }, [
      U.el("button", { class: "btn btn-sm btn-ghost", text: "← Arcade",
        on: { click: () => UI.go("/arcade") } })
    ]));
    // Always show the booth — it carries the Play button when there is credit,
    // so topping up mid-session is never more than one screen away.
    booth(view, g);
  }

  return { screen, list, timeLeft, bestScore, buy, def };
})();
