/* 📖 The Reference Library — the formula sheet, searchable.

   Reading it earns NOTHING. That is deliberate: it should be the thing you
   reach for when you are stuck, not another XP faucet. The only thing tracked
   is a count, so the "Looked It Up" achievement has something to fire on. */
window.MQ = window.MQ || {};
MQ.Screens = MQ.Screens || {};

MQ.Screens.reference = function (view, args) {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  if (args && args[0]) return sheet(args[0]);
  return index();

  function index() {
    view.appendChild(U.el("h1", { text: "Reference Library" }));
    view.appendChild(U.el("p", { text:
      "Every formula the course needs, on one screen each. Search across titles, " +
      "rows and notes — this reads the whole table, not just the headings." }));

    const search = U.el("input", {
      class: "ref-search", type: "search", placeholder: "Search — try \"chain rule\", \"z-score\", \"projectile\"",
      autocomplete: "off"
    });
    const results = U.el("div", { class: "grid g2", style: "margin-top:14px" });

    function draw(term) {
      results.innerHTML = "";
      const found = MQ.Reference.search(term);
      if (!found.length) {
        results.appendChild(U.el("div", { class: "empty", style: "grid-column:1/-1" }, [
          U.el("div", { class: "empty-ico", text: "🔍" }),
          U.el("p", { text: "Nothing matches that. Try a shorter word." })
        ]));
        return;
      }
      found.forEach(r => {
        const card = U.el("button", { class: "game-card", style: "--gc:var(--glow-a)" }, [
          U.el("div", { class: "game-ico", text: r.icon }),
          U.el("div", { class: "game-name", text: r.title }),
          U.el("div", { class: "game-desc", text: r.blurb }),
          U.el("div", { class: "game-foot" }, [
            U.el("span", { class: "chip", text: r.rows.length + " rows" }),
            r.tier === "ME" ? U.el("span", { class: "chip chip-ext", text: "EXT" }) : null
          ])
        ]);
        card.addEventListener("click", () => UI.go("/reference/" + r.id));
        results.appendChild(card);
      });
    }

    search.addEventListener("input", () => draw(search.value));
    view.appendChild(search);
    view.appendChild(results);
    draw("");
    setTimeout(() => search.focus(), 60);
  }

  function sheet(id) {
    const r = MQ.Reference.byId(id);
    if (!r) return UI.go("/reference");

    S.bump("referenceReads");
    // Reading reference material triggers an achievement CHECK but pays no XP.
    S.checkAchievements().forEach((a, i) => setTimeout(() => {
      MQ.Sound.achievement();
      UI.toast({ icon: a.icon, kind: "good", text: `<b>${U.escapeHtml(a.name)}</b> unlocked` });
    }, 400 + i * 800));

    const shell = UI.gameShell(r.icon + " " + r.title, { backTo: "/reference" });
    view.appendChild(shell.root);

    shell.body.appendChild(U.el("p", { text: r.blurb }));

    /* H5: on a long sheet the column headings scroll away, so they are pinned.
       --topbar-h is measured in app.js and republished on resize. */
    const table = U.el("table", { class: "ref-table" }, [
      U.el("thead", {}, [U.el("tr", {}, r.cols.map(h =>
        U.el("th", { class: "math", html: U.math(h) })))]),
      U.el("tbody", {}, r.rows.map(row =>
        U.el("tr", {}, row.map(cell =>
          U.el("td", { class: "math", html: U.math(cell) })))))
    ]);
    shell.body.appendChild(U.el("div", { class: "card" }, [
      U.el("div", { class: "ref-scroll" }, [table])
    ]));

    if (r.note) {
      shell.body.appendChild(U.el("div", { class: "feedback math", html: U.math(r.note) }));
    }

    shell.body.appendChild(U.el("p", { class: "arcade-note", style: "margin-top:8px",
      text: "Reading the reference sheets awards no XP — it is a tool, not a game mode." }));

    /* Straight to practice on the same material. */
    const topics = MQ.Bank.topics().filter(t => {
      const hay = (r.title + " " + r.blurb).toLowerCase();
      return hay.includes(t.short.toLowerCase()) || hay.includes(t.group.toLowerCase());
    });
    if (topics.length) {
      shell.body.appendChild(U.el("button", {
        class: "btn btn-primary btn-block",
        text: "🎯 Drill " + topics[0].short,
        on: { click: () => UI.go("/game/drill/" + topics[0].id) }
      }));
    }
  }
};
