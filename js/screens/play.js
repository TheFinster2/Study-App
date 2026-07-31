/* Play — game cards, bosses, the arcade entry, and the #/game/<id> dispatcher. */
window.MQ = window.MQ || {};
MQ.Screens = MQ.Screens || {};

MQ.Screens.play = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  /* `tier:"ME"` hides a mode entirely on an Advanced-only build — it is not a
     locked card with a padlock, it simply does not exist. */
  const GAMES = [
    { id:"rapid", icon:"⚡", name:"Rapid Fire", colour:"#ffcc55", tag:"Timed", minLevel:1,
      desc:"Two minutes. Endless questions. Streak multipliers up to ×3." },
    { id:"drill", icon:"🎯", name:"Topic Drill", colour:"#39d6c8", tag:"Untimed", minLevel:1,
      desc:"Pick a topic and work through 15 adaptive questions, no clock." },
    { id:"equiv", icon:"🔁", name:"Equivalence Engine", colour:"#7c5cff", tag:"Algebra", minLevel:1,
      desc:"Rearrange an expression. The app checks your answer numerically, so ANY correct form counts." },
    { id:"match", icon:"🃏", name:"Match Pairs", colour:"#3fe08a", tag:"Memory", minLevel:1,
      desc:"Concentration: function ↔ derivative, expression ↔ factored form, identity ↔ equivalent." },
    { id:"curve", icon:"📈", name:"Read the Curve", colour:"#ff8fb1", tag:"Graphs", minLevel:2,
      desc:"A drawn graph, and four candidate equations. Sometimes reversed. Infinitely generated." },
    { id:"crunch", icon:"🔢", name:"Calculation Crunch", colour:"#6fa8ff", tag:"Numeric", minLevel:2,
      desc:"Endless generated problems across every topic. Type exact forms — pi/4, sqrt(2), ln(3)." },
    { id:"panic", icon:"⏱️", name:"Table Panic", colour:"#8fd0ff", tag:"Timed", minLevel:3,
      desc:"Fill the unit circle, the derivative table or the log laws before the clock runs out." },
    { id:"lab", icon:"📐", name:"Calculus Lab", colour:"#ff6a4d", tag:"Simulation", minLevel:4,
      desc:"Drag a tangent onto a curve, or the bounds of a shaded area — then do it exactly." },
    { id:"proof", icon:"🪜", name:"Proof Builder", colour:"#b8f03a", tag:"Reasoning", minLevel:5,
      desc:"Assemble a proof or derivation from shuffled step cards. Some cards are wrong." },
    { id:"vector", icon:"🎯", name:"Vector Lab", colour:"#a86bff", tag:"Projectiles", minLevel:4, tier:"ME",
      desc:"Set an angle and speed to hit a target, then compute the range, flight time or apex." },
    { id:"induction", icon:"⛓️", name:"Induction Builder", colour:"#ff3df0", tag:"Proof", minLevel:5, tier:"ME",
      desc:"Base case, assumption, inductive step, conclusion — in order, with the algebra to match." },
    { id:"survival", icon:"💀", name:"Survival", colour:"#ff4d6d", tag:"Endless", minLevel:6,
      desc:"One life. The clock tightens and the questions get harder. How deep can you go?" },
    { id:"mistakes", icon:"🩹", name:"Mistake Rehab", colour:"#ff6b81", tag:"Review", minLevel:1,
      desc:"Only the questions you have got wrong, until you get them right." },
    { id:"starred", icon:"🔖", name:"Starred Questions", colour:"#ffd24a", tag:"Review", minLevel:1,
      desc:"The questions you starred mid-run, back for another look." }
  ];

  const enabledGames = () => GAMES.filter(g => !g.tier || MQ.DATA.TIERS.indexOf(g.tier) >= 0);

  function screen(view) {
    const lvl = S.data.level;

    view.appendChild(U.el("h1", { text: "Choose your mode" }));
    view.appendChild(U.el("p", { text:
      "Every mode earns XP and Primes. Harder questions pay more, wrong answers cost, " +
      "and the completion bonus needs at least 50% accuracy." }));

    const grid = U.el("div", { class: "grid g2", style: "margin-top:16px" });
    enabledGames().forEach(g => {
      const locked = lvl < g.minLevel;
      const best = S.data.scores[g.id === "drill" || g.id === "mistakes" || g.id === "starred" ? "quiz" : g.id];
      const card = U.el("button", {
        class: "game-card" + (locked ? " locked" : ""),
        style: `--gc:${g.colour}`, disabled: locked
      }, [
        U.el("div", { class: "game-ico", text: g.icon }),
        U.el("div", { class: "game-name", text: g.name }),
        U.el("div", { class: "game-desc", text: g.desc }),
        U.el("div", { class: "game-foot" }, [
          U.el("span", { class: "chip", text: g.tag }),
          g.tier === "ME" ? U.el("span", { class: "chip chip-ext", text: "EXT" }) : null,
          best !== undefined ? U.el("span", { class: "chip", text: "🏅 " + best }) : null,
          locked ? U.el("span", { class: "chip lock-tag", text: "🔒 Lv " + g.minLevel }) : null
        ])
      ]);
      if (!locked) card.addEventListener("click", () => { MQ.Sound.click(); UI.go("/game/" + g.id); });
      grid.appendChild(card);
    });
    view.appendChild(grid);

    /* ── bosses ── */
    view.appendChild(U.el("h2", {}, [
      document.createTextNode("Exam Bosses"),
      U.el("span", { class: "h2-sub", text: "beat one to unlock the next" })
    ]));

    const bossGrid = U.el("div", { class: "grid g2" });
    MQ.Games.boss.list().forEach(({ boss, unlocked }) => {
      const beaten = !!S.data.bossesBeaten[boss.id];
      const card = U.el("button", {
        class: "game-card" + (unlocked ? "" : " locked"),
        style: "--gc:#ff6b81", disabled: !unlocked
      }, [
        U.el("div", { class: "game-ico", text: boss.icon }),
        U.el("div", { class: "game-name", text: boss.name }),
        U.el("div", { class: "game-desc", text: boss.abilityText }),
        U.el("div", { class: "game-foot" }, [
          U.el("span", { class: "chip", text: boss.group }),
          boss.tier === "ME" ? U.el("span", { class: "chip chip-ext", text: "EXT" }) : null,
          U.el("span", { class: "chip", text: "❤ " + boss.hp }),
          beaten ? U.el("span", { class: "chip on lock-tag", text: "✔ Defeated" })
                 : !unlocked ? U.el("span", { class: "chip lock-tag", text: "🔒 Locked" }) : null
        ])
      ]);
      if (unlocked) card.addEventListener("click", () => UI.go("/game/boss/" + boss.id));
      bossGrid.appendChild(card);
    });
    view.appendChild(bossGrid);

    const final = MQ.Games.boss.allBeaten();
    view.appendChild(U.el("button", {
      class: "btn " + (final ? "btn-primary" : "") + " btn-block", style: "margin-top:10px",
      disabled: !final,
      text: final ? "🎓 The Final Paper — 25 mixed questions"
                  : "🔒 The Final Paper — defeat every boss to unlock",
      on: { click: () => UI.go("/game/boss/final") }
    }));

    /* ── arcade ── */
    view.appendChild(U.el("h2", {}, [
      document.createTextNode("The Arcade"),
      U.el("span", { class: "h2-sub", text: "spend Primes, earn nothing but bragging rights" })
    ]));
    const arcadeGrid = U.el("div", { class: "grid g3" });
    MQ.DATA.arcade.forEach(g => {
      const locked = lvl < (g.minLevel || 1);
      const credit = MQ.Arcade.timeLeft(g.id);
      const card = U.el("button", {
        class: "game-card" + (locked ? " locked" : ""),
        style: `--gc:${g.colour}`, disabled: locked
      }, [
        U.el("div", { class: "game-ico", text: g.icon }),
        U.el("div", { class: "game-name", text: g.name }),
        U.el("div", { class: "game-desc", text: g.blurb }),
        U.el("div", { class: "game-foot" }, [
          credit > 0 ? U.el("span", { class: "chip on", text: "🎟️ " + U.fmtTime(credit) })
                     : U.el("span", { class: "chip", text: "from " + g.tickets[0].cost + " 🔢" }),
          locked ? U.el("span", { class: "chip lock-tag", text: "🔒 Lv " + g.minLevel }) : null
        ])
      ]);
      if (!locked) card.addEventListener("click", () => UI.go("/arcade/" + g.id));
      arcadeGrid.appendChild(card);
    });
    view.appendChild(arcadeGrid);
  }

  /* ── dispatcher for #/game/<id>/<arg> ─────────────────────── */
  function dispatch(view, args) {
    const id = args[0], arg = args[1];

    switch (id) {
      case "rapid":
        return MQ.Games.quiz.start(view, {
          modeId: "quiz", title: "⚡ Rapid Fire", totalTime: 120, count: 25, dailyMode: "rapid"
        });

      case "drill":
        if (!arg) return topicPicker(view);
        return MQ.Games.quiz.start(view, {
          modeId: "quiz", title: "🎯 Drill · " + MQ.Bank.topicName(arg),
          topics: [arg], count: 15
        });

      case "mistakes": {
        const qs = MQ.Bank.mistakeQuestions();
        if (!qs.length) return emptyState(view, "🎉", "Nothing to fix",
          "You have no outstanding mistakes. Go and make some.");
        return MQ.Games.quiz.start(view, {
          modeId: "quiz", title: "🩹 Mistake Rehab", questions: qs.slice(0, 15), adaptive: false
        });
      }

      case "starred": {
        const qs = MQ.Bank.bookmarkedQuestions();
        if (!qs.length) return emptyState(view, "🔖", "Nothing starred yet",
          "Tap the star on any question card during a run to save it here.");
        return MQ.Games.quiz.start(view, {
          modeId: "quiz", title: "🔖 Starred Questions", questions: qs.slice(0, 20), adaptive: false
        });
      }

      case "equiv":     return MQ.Games.equiv.start(view, { count: 6 });
      case "match":     return MQ.Games.match.start(view, { pairs: 8 });
      case "curve":     return MQ.Games.curve.start(view, { count: 10 });
      case "crunch":    return MQ.Games.crunch.start(view, { count: 10 });
      case "panic":     return MQ.Games.panic.start(view, { rows: 10, timeLimit: 150 });
      case "lab":       return MQ.Games.lab.start(view, { rounds: 4 });
      case "proof":     return MQ.Games.proof.start(view, { rounds: 3 });
      case "induction": return MQ.Games.induction.start(view, { rounds: 3 });
      case "vector":    return MQ.Games.vector.start(view, { rounds: 3 });
      case "survival":  return MQ.Games.survival.start(view);
      case "boss":      return MQ.Games.boss.start(view, arg);
      default:          return UI.go("/play");
    }
  }

  function emptyState(view, icon, title, body) {
    view.appendChild(U.el("div", { class: "empty" }, [
      U.el("div", { class: "empty-ico", text: icon }),
      U.el("h2", { style: "justify-content:center", text: title }),
      U.el("p", { text: body }),
      U.el("button", { class: "btn btn-primary", text: "Back to games",
        on: { click: () => UI.go("/play") } })
    ]));
  }

  function topicPicker(view) {
    view.appendChild(U.el("h1", { text: "Pick a topic" }));
    view.appendChild(U.el("p", { text:
      "15 adaptive questions. The app favours the ones you have missed before." }));

    const stats = MQ.Bank.statsByTopic();
    const grid = U.el("div", { class: "grid g2", style: "margin-top:14px" });

    MQ.DATA.TIERS.forEach(tier => {
      const meta = MQ.DATA.TIER_META[tier];
      grid.appendChild(U.el("div", { class: "muted tiny",
        style: "grid-column:1/-1; margin-top:6px; text-transform:uppercase; letter-spacing:.5px",
        text: meta.name }));
      stats.filter(t => t.tier === tier).forEach(t => {
        const card = U.el("button", { class: "game-card", style: "--gc:var(--glow-a)" }, [
          U.el("div", { class: "game-name", text: t.id + " · " + t.short }),
          U.el("div", { class: "game-desc", text: t.name }),
          U.el("div", { class: "bar", style: "margin:6px 0" }, [U.el("i", { style: `width:${t.mastery}%` })]),
          U.el("div", { class: "game-foot" }, [
            U.el("span", { class: "chip", text: t.mastery + "% mastery" }),
            U.el("span", { class: "chip", text: t.total + " questions" })
          ])
        ]);
        card.addEventListener("click", () => UI.go("/game/drill/" + t.id));
        grid.appendChild(card);
      });
    });

    grid.appendChild(U.el("div", { style: "grid-column:1/-1" }, [
      U.el("button", { class: "btn btn-ghost btn-block", text: "Mixed — every topic",
        on: { click: () => UI.go("/game/rapid") } })
    ]));
    view.appendChild(grid);
  }

  return { screen, dispatch, GAMES, enabledGames };
})();
