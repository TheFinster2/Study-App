/* Study — the spaced-repetition flashcard deck and the Reference Library. */
window.MQ = window.MQ || {};
MQ.Screens = MQ.Screens || {};

MQ.Screens.study = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  function screen(view, args) {
    if (args && args[0] === "deck") return review(view, args[1]);
    return picker(view);
  }

  function picker(view) {
    const due = S.dueCards();
    view.appendChild(U.el("h1", { text: "Study" }));
    view.appendChild(U.el("p", { html:
      `<b>${due.length}</b> card${due.length === 1 ? "" : "s"} due today across ` +
      `${MQ.Cards.all().length} in the deck. Cards resurface exactly when you are about to forget them.` }));

    view.appendChild(U.el("button", {
      class: "btn btn-primary btn-block", style: "margin-top:12px",
      disabled: !due.length,
      text: due.length ? `🗂️ Review ${Math.min(due.length, 20)} due cards` : "Nothing due — come back tomorrow",
      on: { click: () => UI.go("/study/deck/all") }
    }));

    /* Leitner distribution — a genuinely useful at-a-glance picture. */
    const boxes = [0, 0, 0, 0, 0];
    MQ.Cards.all().forEach(c => {
      const st = S.data.srs[c.id];
      boxes[(st ? st.box : 1) - 1]++;
    });
    view.appendChild(U.el("h2", {}, [
      document.createTextNode("Leitner boxes"),
      U.el("span", { class: "h2-sub", text: "1 / 2 / 4 / 8 / 16 days" })
    ]));
    view.appendChild(U.el("div", { class: "card" }, [
      U.el("div", { class: "grid g4" }, boxes.map((n, i) =>
        U.el("div", { class: "stat-tile" }, [
          U.el("div", { class: "stat-num", text: String(n) }),
          U.el("div", { class: "stat-lbl", text: "Box " + (i + 1) })
        ])
      )),
      U.el("p", { class: "tiny muted", style: "margin:10px 0 0", text:
        "A card moves up a box when you get it, and drops straight to box 1 when you miss it." })
    ]));

    view.appendChild(U.el("h2", { text: "Decks" }));
    const grid = U.el("div", { class: "grid g3" });
    MQ.Cards.decks().forEach(name => {
      const cards = MQ.Cards.inDeck(name);
      const dueHere = cards.filter(c => {
        const st = S.data.srs[c.id];
        return !st || U.daysBetween(st.due, U.dayKey()) >= 0;
      }).length;
      const card = U.el("button", { class: "game-card", style: "--gc:var(--glow-b)" }, [
        U.el("div", { class: "game-name", text: name }),
        U.el("div", { class: "game-desc", text: cards.length + " cards" }),
        U.el("div", { class: "game-foot" }, [
          dueHere ? U.el("span", { class: "chip on", text: dueHere + " due" })
                  : U.el("span", { class: "chip", text: "up to date" })
        ])
      ]);
      card.addEventListener("click", () => UI.go("/study/deck/" + encodeURIComponent(name)));
      grid.appendChild(card);
    });
    view.appendChild(grid);

    view.appendChild(U.el("h2", { text: "Reference" }));
    view.appendChild(U.el("button", {
      class: "btn btn-ghost btn-block", text: "📖 Reference Library — every formula, searchable",
      on: { click: () => UI.go("/reference") }
    }));
    view.appendChild(U.el("button", {
      class: "btn btn-ghost btn-block", style: "margin-top:8px",
      text: "🔖 Starred questions", on: { click: () => UI.go("/game/starred") }
    }));
  }

  /* ── the review session ────────────────────────────────────
     Flashcards are SELF-GRADED, so "Did you get it?" → "Yes" → XP is an
     infinite loop. Three gates (§9.8):
       1. a card pays at most once per day,
       2. only if it was genuinely DUE,
       3. only if it stayed on screen for MIN_READ_MS.
     And accuracy is reported to award() as paid ÷ deck size, never the
     self-reported figure. */
  function review(view, deckName) {
    const name = deckName ? decodeURIComponent(deckName) : "all";
    const pool = name === "all" ? S.dueCards() : S.dueCards(MQ.Cards.inDeck(name));
    if (!pool.length) {
      view.appendChild(U.el("div", { class: "empty" }, [
        U.el("div", { class: "empty-ico", text: "✅" }),
        U.el("h2", { style: "justify-content:center", text: "Nothing due here" }),
        U.el("p", { text: "This deck is up to date. Spaced repetition works best when you let it wait." }),
        U.el("button", { class: "btn btn-primary", text: "Back to Study", on: { click: () => UI.go("/study") } })
      ]));
      return;
    }

    const cards = U.sample(pool, Math.min(20, pool.length));
    S.markMode("study");
    S.touchStreak();

    let idx = 0, got = 0, paid = 0, flipped = false, shownAt = 0, finished = false;

    const shell = UI.gameShell("🗂️ " + (name === "all" ? "Due cards" : name), { backTo: "/study",
      help: "Tap the card to flip it, then say honestly whether you knew it. " +
            "A card pays XP at most once a day, and only if it was actually due — otherwise " +
            "\"Got it\" would be an infinite XP button." });
    view.appendChild(shell.root);

    const progChip = UI.chip("1 / " + cards.length);
    const paidChip = UI.chip("0 XP");
    [progChip, paidChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    UI.onLeave(() => document.removeEventListener("keydown", onKey));
    document.addEventListener("keydown", onKey);
    function onKey(e) {
      if (finished) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); const f = U.$(".fcard", stage); if (f) f.click(); }
      if (flipped && (e.key === "1" || e.key === "y")) grade(true);
      if (flipped && (e.key === "2" || e.key === "n")) grade(false);
    }

    function render() {
      stage.innerHTML = "";
      flipped = false;
      shownAt = performance.now();
      const card = cards[idx];
      progChip.textContent = (idx + 1) + " / " + cards.length;

      const st = S.cardState(card.id);
      const flipper = U.el("div", { class: "fcard" }, [
        U.el("div", { class: "fcard-inner" }, [
          U.el("div", { class: "fface" }, [
            U.el("div", { class: "fq math", html: U.math(card.q) }),
            U.el("div", { class: "fhint", text: "tap to reveal" })
          ]),
          U.el("div", { class: "fface fface-b" }, [
            U.el("div", { class: "fa math", html: U.math(card.a) }),
            U.el("div", { class: "fhint", text: card.deck })
          ])
        ])
      ]);
      flipper.addEventListener("click", () => {
        if (flipped) return;
        flipped = true;
        flipper.classList.add("flip");
        MQ.Sound.flip();
        buttons.hidden = false;
      });

      const leitner = U.el("div", { class: "leitner" },
        [1, 2, 3, 4, 5].map(b => U.el("div", { class: "lbox" + (b === st.box ? " on" : ""), text: String(b) })));

      const buttons = U.el("div", { class: "row", hidden: true, style: "justify-content:center; gap:10px" }, [
        U.el("button", { class: "btn", text: "✗ Missed it", on: { click: () => grade(false) } }),
        U.el("button", { class: "btn btn-primary", text: "✓ Got it", on: { click: () => grade(true) } })
      ]);

      stage.appendChild(flipper);
      stage.appendChild(leitner);
      stage.appendChild(buttons);
      stage.appendChild(U.el("div", { class: "tiny muted", style: "text-align:center",
        html: MQ.Bank.topicName(card.topic) + (MQ.DATA.tierOf(card.topic) === "ME" ? " · EXT" : "") }));
    }

    function grade(ok) {
      if (finished || !flipped) return;
      const card = cards[idx];
      const readLongEnough = performance.now() - shownAt >= UI.MIN_READ_MS;
      const eligible = S.cardXpEligible(card.id);

      if (ok) got++;
      if (ok && eligible && readLongEnough) {
        S.markCardXp(card.id);
        paid++;
        paidChip.textContent = paid * 8 + " XP";
      }
      S.reviewCard(card.id, ok);
      MQ.Sound[ok ? "correct" : "wrong"]();

      idx++;
      if (idx >= cards.length) return finish();
      render();
    }

    function finish() {
      if (finished) return;
      finished = true;
      document.removeEventListener("keydown", onKey);

      /* Report PAID cards over deck size, not the self-reported "got it" rate.
         Self-grading cannot be allowed to set its own accuracy. */
      const accuracy = cards.length ? paid / cards.length : 0;
      const mastered = Object.values(S.data.srs).filter(c => c.box >= 5).length;
      const got_ = UI.award({ xp: paid * 8, bonus: S.streakBonus(), accuracy, coins: paid * 2 });

      UI.results({
        title: "Review complete",
        correct: got, total: cards.length, xp: got_.xp, coins: got_.coins,
        extraStats: [["Paid cards", paid], ["Mastered", mastered], ["Deck", name === "all" ? "mixed" : name]],
        onAgain: () => UI.go("/study")
      });
    }

    render();
  }

  return { screen };
})();
