/* The arcade ticket economy and its screens.

   Tickets are stored as REMAINING SECONDS, not as an expiry timestamp: a
   ticket you bought and did not use should still be there tomorrow. The clock
   runs only while the game is actually on screen, which the ticket test
   asserts by backgrounding the tab mid-game.

   Nothing in this file calls UI.award(). That is the enforcement mechanism
   for "spend Primes, earn nothing but bragging rights" — see js/data/arcade.js. */
window.MQ = window.MQ || {};

MQ.Arcade = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  const game = id => MQ.DATA.arcade.find(g => g.id === id);

  /** Seconds of playtime remaining on a game's ticket. */
  function timeLeft(id) {
    return Math.max(0, Math.floor((S.data.arcade.tickets[id] || 0)));
  }

  /** Buy playtime. Returns { ok } or { ok:false, reason }. */
  function buyTicket(id, mins, cost) {
    if (S.data.coins < cost) return { ok: false, reason: "Not enough Primes." };
    if (!S.spendCoins(cost)) return { ok: false, reason: "Not enough Primes." };
    S.data.arcade.tickets[id] = (S.data.arcade.tickets[id] || 0) + mins * 60;
    S.emit();
    MQ.Sound.ticket();
    return { ok: true };
  }

  /** Spend a second of ticket time. Returns false when the ticket runs out. */
  function tick(id) {
    const left = timeLeft(id);
    if (left <= 0) return false;
    S.data.arcade.tickets[id] = left - 1;
    // Written on a debounce like everything else; flush happens on pagehide.
    S.save();
    return true;
  }

  function recordScore(id, score) {
    const prev = S.data.arcade.scores[id];
    const best = prev === undefined || score > prev;
    if (best) S.data.arcade.scores[id] = score;
    S.data.arcade.played[id] = (S.data.arcade.played[id] || 0) + 1;
    S.save();
    return best;
  }

  const bestScore = id => S.data.arcade.scores[id] || 0;

  /**
   * Shared chrome for an arcade cabinet. Runs the ticket clock, tears it down
   * on leave, and ends the session when the ticket expires.
   * Returns { root, body, hud, onEnd(fn), stop() }.
   */
  function cabinet(id, title, opts) {
    const o = opts || {};
    const g = game(id);
    const shell = UI.gameShell(title, { backTo: "/arcade/" + id, help: o.help });

    const scoreChip = UI.chip("Score 0");
    const bestChip = UI.chip("Best " + bestScore(id));
    const ticketChip = U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft(id)) });
    [scoreChip, bestChip, ticketChip].forEach(n => shell.meta.appendChild(n));

    let ended = false;
    const enders = [];
    let clock = setInterval(() => {
      if (ended) return;
      // The clock only advances while this screen is mounted AND visible.
      if (document.visibilityState === "hidden") return;
      if (!tick(id)) {
        ticketChip.textContent = "0:00";
        end("Ticket expired");
        return;
      }
      const left = timeLeft(id);
      ticketChip.textContent = U.fmtTime(left);
      ticketChip.classList.toggle("low", left <= 20);
    }, 1000);

    function end(reason) {
      if (ended) return;
      ended = true;
      clearInterval(clock);
      clock = null;
      enders.forEach(fn => { try { fn(reason); } catch (e) { /* ignore */ } });
    }

    UI.onLeave(() => { clearInterval(clock); ended = true; });

    return {
      root: shell.root, body: shell.body, meta: shell.meta,
      setScore(n) { scoreChip.textContent = "Score " + n; },
      colour: g.colour,
      onEnd(fn) { enders.push(fn); },
      isOver: () => ended,
      stop: end,
      /** The end-of-session card. Deliberately NOT UI.results — no XP path. */
      gameOver(score, reason) {
        const best = recordScore(id, score);
        MQ.Sound[best ? "rareDrop" : "lose"]();
        if (best) MQ.FX.confetti(90);
        UI.modal(U.el("div", { class: "modal-center" }, [
          U.el("div", { class: "modal-big", text: g.icon }),
          U.el("h2", { style: "justify-content:center", text: reason || "Game over" }),
          U.el("div", { class: "result-grid" }, [
            ["Score", score], ["Best", bestScore(id)], ["Ticket", U.fmtTime(timeLeft(id))]
          ].map(([l, v]) => U.el("div", { class: "result-cell" }, [
            U.el("div", { class: "result-num", text: String(v) }),
            U.el("div", { class: "result-lbl", text: l })
          ]))),
          best ? U.el("div", { class: "chip on", text: "🏅 New high score" }) : null,
          U.el("p", { class: "arcade-note", text: "Arcade games award no XP and no Primes — only bragging rights." }),
          U.el("div", { class: "row", style: "margin-top:8px" }, [
            U.el("button", { class: "btn btn-ghost btn-sm", text: "Leave",
              on: { click: () => { UI.closeModal(); UI.go("/arcade"); } } }),
            U.el("div", { class: "spacer" }),
            U.el("button", { class: "btn btn-primary js-again",
              text: timeLeft(id) > 0 ? "Play again" : "Buy more time",
              on: { click: () => {
                UI.closeModal();
                UI.go(timeLeft(id) > 0 ? "/arcade/" + id + "/play" : "/arcade/" + id);
              } } })
          ])
        ]), { sticky: true });
      }
    };
  }

  /* ── screens ──────────────────────────────────────────────── */

  function screen(view, args) {
    const id = args[0];
    if (!id) return lobby(view);
    if (args[1] === "play") return play(view, id);
    return booth(view, id);
  }

  function lobby(view) {
    view.appendChild(U.el("h1", { text: "The Arcade" }));
    view.appendChild(U.el("p", { html:
      "Three games, rented by the minute. They pay <b>no XP, no Primes and no achievements</b> — " +
      "only a high score. That is deliberate: a game that paid would beat studying." }));

    const grid = U.el("div", { class: "grid g3", style: "margin-top:16px" });
    MQ.DATA.arcade.forEach(g => {
      const locked = S.data.level < (g.minLevel || 1);
      const credit = timeLeft(g.id);
      const card = U.el("button", {
        class: "game-card arcade-booth" + (locked ? " locked" : ""),
        style: `--gc:${g.colour}`, disabled: locked
      }, [
        U.el("div", { class: "game-ico", text: g.icon }),
        U.el("div", { class: "game-name", text: g.name }),
        U.el("div", { class: "game-desc", text: g.blurb }),
        U.el("div", { class: "game-foot" }, [
          credit > 0 ? U.el("span", { class: "chip on", text: "🎟️ " + U.fmtTime(credit) })
                     : U.el("span", { class: "chip", text: "from " + g.tickets[0].cost + " 🔢" }),
          bestScore(g.id) ? U.el("span", { class: "chip", text: "🏅 " + bestScore(g.id) }) : null,
          locked ? U.el("span", { class: "chip lock-tag", text: "🔒 Lv " + g.minLevel }) : null
        ])
      ]);
      if (!locked) card.addEventListener("click", () => UI.go("/arcade/" + g.id));
      grid.appendChild(card);
    });
    view.appendChild(grid);
  }

  function booth(view, id) {
    const g = game(id);
    if (!g) return UI.go("/arcade");

    view.appendChild(U.el("div", { class: "arcade-hero", style: `--gc:${g.colour}` }, [
      U.el("div", { class: "arcade-hero-ico", text: g.icon }),
      U.el("div", {}, [U.el("h1", { text: g.name }), U.el("p", { text: g.blurb })])
    ]));

    const credit = timeLeft(id);
    view.appendChild(U.el("div", { class: "card" }, [
      U.el("div", { class: "row" }, [
        U.el("div", {}, [
          U.el("div", { class: "muted tiny", text: "TIME REMAINING" }),
          U.el("div", { style: "font-size:26px; font-weight:800", text: U.fmtTime(credit) })
        ]),
        U.el("div", { class: "spacer" }),
        U.el("div", { style: "text-align:right" }, [
          U.el("div", { class: "muted tiny", text: "HIGH SCORE" }),
          U.el("div", { style: "font-size:26px; font-weight:800", text: String(bestScore(id)) })
        ])
      ]),
      credit > 0
        ? U.el("button", { class: "btn btn-primary btn-block", style: "margin-top:14px",
            text: "▶ Play", on: { click: () => UI.go("/arcade/" + id + "/play") } })
        : U.el("p", { class: "muted", style: "margin-top:14px",
            text: "Buy some playtime below to start." })
    ]));

    view.appendChild(U.el("h2", { text: "Tickets" }));
    const grid = U.el("div", { class: "grid g3" });
    g.tickets.forEach(t => {
      const afford = S.data.coins >= t.cost;
      const card = U.el("div", { class: "shop-item" }, [
        U.el("div", { class: "shop-ico", text: "🎟️" }),
        U.el("div", { class: "shop-name", text: t.mins + " minutes" }),
        U.el("div", { class: "shop-desc", text: "Playtime is banked — it only counts down while you are actually playing." }),
        U.el("button", {
          class: "btn " + (afford ? "btn-primary" : ""), disabled: !afford,
          text: t.cost + " 🔢",
          on: { click: () => {
            const r = buyTicket(id, t.mins, t.cost);
            if (!r.ok) { MQ.Sound.denied(); return UI.toast({ icon: "🚫", kind: "bad", text: r.reason }); }
            UI.toast({ icon: "🎟️", kind: "good", text: `+${t.mins} minutes of ${U.escapeHtml(g.name)}.` });
            UI.handleRoute();
          } }
        })
      ]);
      grid.appendChild(card);
    });
    view.appendChild(grid);
    view.appendChild(U.el("p", { class: "arcade-note", style: "margin-top:16px",
      text: "Arcade games award no XP, no Primes and no achievements. Spend Primes, earn nothing but bragging rights." }));
  }

  function play(view, id) {
    if (timeLeft(id) <= 0) {
      view.appendChild(U.el("div", { class: "empty" }, [
        U.el("div", { class: "empty-ico", text: "🎟️" }),
        U.el("h2", { style: "justify-content:center", text: "No playtime left" }),
        U.el("p", { text: "Buy a ticket to play." }),
        U.el("button", { class: "btn btn-primary", text: "Buy a ticket",
          on: { click: () => UI.go("/arcade/" + id) } })
      ]));
      return;
    }
    const runner = { crush: MQ.Games.crush, runner: MQ.Games.runner, tower: MQ.Games.tower }[id];
    if (!runner) return UI.go("/arcade");
    return runner.start(view);
  }

  return { screen, timeLeft, buyTicket, tick, recordScore, bestScore, cabinet, game };
})();
