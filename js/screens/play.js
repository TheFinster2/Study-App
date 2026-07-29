/* Play — the arcade. Game cards, boss list, and the /game/<id> dispatcher. */
window.CHEM = window.CHEM || {};
CHEM.Screens = CHEM.Screens || {};

CHEM.Screens.play = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  const GAMES = [
    { id: "rapid", icon: "⚡", name: "Rapid Fire", colour: "#ffcc55",
      desc: "Two minutes. Endless questions. Streak multipliers up to ×3.",
      tag: "Timed", minLevel: 1 },
    { id: "drill", icon: "🎯", name: "Module Drill", colour: "#39d6c8",
      desc: "Pick a module and work through 15 adaptive questions, no clock.",
      tag: "Untimed", minLevel: 1 },
    { id: "balance", icon: "⚖️", name: "Balance Blitz", colour: "#7c5cff",
      desc: "Balance equations with a live atom tally. Lowest whole numbers only.",
      tag: "Puzzle", minLevel: 1 },
    { id: "ionmatch", icon: "🧩", name: "Ion Memory", colour: "#3fe08a",
      desc: "Concentration-style matching of polyatomic ions to their formulas.",
      tag: "Memory", minLevel: 1 },
    { id: "naming", icon: "🏷️", name: "Name That Compound", colour: "#ff8fb1",
      desc: "IUPAC nomenclature, both directions — structure to name and back.",
      tag: "Organic", minLevel: 2 },
    { id: "calc", icon: "🔢", name: "Calculation Crunch", colour: "#6fa8ff",
      desc: "Endless generated problems: moles, pH, dilutions, calorimetry, Ksp.",
      tag: "Numeric", minLevel: 2 },
    { id: "precipitate", icon: "🌧️", name: "Precipitation Panic", colour: "#8fd0ff",
      desc: "Fill a solubility grid before the clock runs out.",
      tag: "Timed", minLevel: 3 },
    { id: "titration", icon: "🧪", name: "Titration Lab", colour: "#ff6a4d",
      desc: "A real simulated titration — find the end point, then do the maths.",
      tag: "Simulation", minLevel: 4 },
    { id: "pathway", icon: "🔗", name: "Pathway Puzzle", colour: "#b8f03a",
      desc: "Build organic synthesis routes by picking the right reagents.",
      tag: "Organic", minLevel: 5 },
    { id: "survival", icon: "💀", name: "Survival", colour: "#ff4d6d",
      desc: "One life. The clock tightens and the questions get harder. How deep can you go?",
      tag: "Endless", minLevel: 6 },
    { id: "mistakes", icon: "🩹", name: "Mistake Rehab", colour: "#ff6b81",
      desc: "Only the questions you've got wrong, until you get them right.",
      tag: "Review", minLevel: 1 }
  ];

  function screen(view) {
    const lvl = S.data.level;

    view.appendChild(U.el("h1", { text: "Choose your experiment" }));
    view.appendChild(U.el("p", { text: "Every mode earns XP and Moles. Harder questions pay more." }));

    const grid = U.el("div", { class: "grid g2", style: "margin-top:16px" });
    GAMES.forEach(g => {
      const locked = lvl < g.minLevel;
      const card = U.el("button", {
        class: "game-card" + (locked ? " locked" : ""),
        style: `--gc:${g.colour}`,
        disabled: locked
      }, [
        U.el("div", { class: "game-ico", text: g.icon }),
        U.el("div", { class: "game-name", text: g.name }),
        U.el("div", { class: "game-desc", text: g.desc }),
        U.el("div", { class: "game-foot" }, [
          U.el("span", { class: "chip", text: g.tag }),
          bestChip(g.id),
          locked ? U.el("span", { class: "chip lock-tag", text: "🔒 Lv " + g.minLevel }) : null
        ])
      ]);
      if (!locked) card.addEventListener("click", () => {
        CHEM.Sound.click();
        UI.go("/game/" + g.id);
      });
      grid.appendChild(card);
    });
    view.appendChild(grid);

    function bestChip(id) {
      const key = id === "rapid" || id === "drill" || id === "mistakes" ? "quiz" : id;
      const best = S.data.scores[key];
      return best === undefined ? null : U.el("span", { class: "chip", text: "🏅 " + best });
    }

    /* boss list */
    view.appendChild(U.el("h2", {}, [
      document.createTextNode("Exam Bosses"),
      U.el("span", { class: "h2-sub", text: "beat one to unlock the next" })
    ]));

    const bossGrid = U.el("div", { class: "grid g2" });
    CHEM.Games.boss.list().forEach(({ boss, unlocked }) => {
      const beaten = !!S.data.bossesBeaten[boss.id];
      const card = U.el("button", {
        class: "game-card" + (unlocked ? "" : " locked"),
        style: "--gc:#ff6b81",
        disabled: !unlocked
      }, [
        U.el("div", { class: "game-ico", text: boss.icon }),
        U.el("div", { class: "game-name", text: boss.name }),
        U.el("div", { class: "game-desc", text: boss.abilityText }),
        U.el("div", { class: "game-foot" }, [
          U.el("span", { class: "chip", text: boss.mods.join(" · ") }),
          U.el("span", { class: "chip", text: "❤ " + boss.hp }),
          beaten ? U.el("span", { class: "chip on lock-tag", text: "✔ Defeated" })
                 : !unlocked ? U.el("span", { class: "chip lock-tag", text: "🔒 Locked" }) : null
        ])
      ]);
      if (unlocked) card.addEventListener("click", () => UI.go("/game/boss/" + boss.id));
      bossGrid.appendChild(card);
    });
    view.appendChild(bossGrid);

    /* arcade — pure fun, paid for with Moles, awards no XP */
    view.appendChild(U.el("h2", {}, [
      document.createTextNode("The Arcade"),
      U.el("span", { class: "h2-sub", text: "spend Moles, earn nothing but bragging rights" })
    ]));
    const arcadeGrid = U.el("div", { class: "grid g3" });
    CHEM.DATA.arcade.forEach(g => {
      const locked = lvl < (g.minLevel || 1);
      const credit = CHEM.Arcade.timeLeft(g.id);
      const card = U.el("button", {
        class: "game-card" + (locked ? " locked" : ""),
        style: `--gc:${g.colour}`, disabled: locked
      }, [
        U.el("div", { class: "game-ico", text: g.icon }),
        U.el("div", { class: "game-name", text: g.name }),
        U.el("div", { class: "game-desc", text: g.blurb }),
        U.el("div", { class: "game-foot" }, [
          credit > 0
            ? U.el("span", { class: "chip on", text: "🎟️ " + U.fmtTime(credit) })
            : U.el("span", { class: "chip", text: "from " + g.tickets[0].cost + " 🪙" }),
          locked ? U.el("span", { class: "chip lock-tag", text: "🔒 Lv " + g.minLevel }) : null
        ])
      ]);
      if (!locked) card.addEventListener("click", () => UI.go("/arcade/" + g.id));
      arcadeGrid.appendChild(card);
    });
    view.appendChild(arcadeGrid);
    view.appendChild(U.el("button", {
      class: "btn btn-ghost btn-block", style: "margin-top:10px",
      text: "🕹️ Open the Arcade",
      on: { click: () => UI.go("/arcade") }
    }));
  }

  /* ── dispatcher for #/game/<id>/<arg> ─────────────────────── */
  function dispatch(view, args) {
    const id = args[0];
    const arg = args[1];

    switch (id) {
      case "rapid":
        return CHEM.Games.quiz.start(view, {
          modeId: "quiz", title: "Rapid Fire", totalTime: 120, count: 25, dailyMode: "quiz"
        });

      case "drill":
        if (!arg) return modulePicker(view);
        return CHEM.Games.quiz.start(view, {
          modeId: "quiz", title: "Drill · " + CHEM.Bank.moduleName(arg),
          mods: [arg], count: 15, dailyMode: "quiz"
        });

      case "mistakes": {
        const qs = CHEM.Bank.mistakeQuestions();
        if (!qs.length) {
          view.appendChild(U.el("div", { class: "empty" }, [
            U.el("div", { class: "empty-ico", text: "🎉" }),
            U.el("h2", { text: "Nothing to fix", style: "justify-content:center" }),
            U.el("p", { text: "You have no outstanding mistakes. Go make some." }),
            U.el("button", { class: "btn btn-primary", text: "Back to games",
              on: { click: () => UI.go("/play") } })
          ]));
          return;
        }
        return CHEM.Games.quiz.start(view, {
          modeId: "quiz", title: "Mistake Rehab", questions: qs.slice(0, 15), adaptive: false
        });
      }

      case "balance":     return CHEM.Games.balance.start(view, { count: 8 });
      case "ionmatch":    return CHEM.Games.ionmatch.start(view, { pairs: 8 });
      case "naming":      return CHEM.Games.naming.start(view, { count: 12 });
      case "calc":        return CHEM.Games.calc.start(view, { count: 10 });
      case "titration":   return CHEM.Games.titration.start(view);
      case "pathway":     return CHEM.Games.pathway.start(view, { rounds: 5 });
      case "precipitate": return CHEM.Games.precipitate.start(view, { rows: 4, cols: 4, timeLimit: 150 });
      case "survival":    return CHEM.Games.survival.start(view);
      case "boss":        return CHEM.Games.boss.start(view, arg);
      default:            return UI.go("/play");
    }
  }

  function modulePicker(view) {
    view.appendChild(U.el("h1", { text: "Pick a module" }));
    view.appendChild(U.el("p", { text: "15 adaptive questions — the app favours topics you've missed before." }));

    const stats = CHEM.Bank.statsByModule();
    const grid = U.el("div", { class: "grid g2", style: "margin-top:14px" });

    [12, 11].forEach(year => {
      grid.appendChild(U.el("div", { class: "muted tiny", style: "grid-column:1/-1; margin-top:6px",
        text: year === 12 ? "YEAR 12 — HSC MODULES" : "YEAR 11 — FOUNDATION MODULES" }));
      stats.filter(m => m.year === year).forEach(m => {
        const card = U.el("button", { class: "game-card", style: "--gc:var(--glow-a)" }, [
          U.el("div", { class: "game-name", text: `${m.id} · ${m.short}` }),
          U.el("div", { class: "game-desc", text: m.name }),
          U.el("div", { class: "bar", style: "margin:6px 0" }, [U.el("i", { style: `width:${m.mastery}%` })]),
          U.el("div", { class: "game-foot" }, [
            U.el("span", { class: "chip", text: m.mastery + "% mastery" }),
            U.el("span", { class: "chip", text: m.total + " questions" })
          ])
        ]);
        card.addEventListener("click", () => UI.go("/game/drill/" + m.id));
        grid.appendChild(card);
      });
    });

    grid.appendChild(U.el("div", { style: "grid-column:1/-1" }, [
      U.el("button", { class: "btn btn-ghost btn-block", text: "Mixed — all modules",
        on: { click: () => CHEM.UI.go("/game/rapid") } })
    ]));
    view.appendChild(grid);
  }

  return { screen, dispatch, GAMES };
})();
