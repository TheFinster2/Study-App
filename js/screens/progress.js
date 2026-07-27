/* Progress — stats, activity heatmap, per-module breakdown and the mistakes list. */
window.CHEM = window.CHEM || {};
CHEM.Screens = CHEM.Screens || {};

CHEM.Screens.progress = function (view) {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;
  const d = S.data;

  view.appendChild(U.el("h1", { text: "Progress" }));

  /* headline stats */
  view.appendChild(U.el("div", { class: "grid g4" }, [
    tile(d.level, "Level"),
    tile(d.xp.toLocaleString(), "Total XP"),
    tile(S.overallAccuracy() + "%", "Accuracy"),
    tile(d.streak.longest, "Longest streak")
  ]));
  view.appendChild(U.el("div", { class: "grid g4", style: "margin-top:12px" }, [
    tile(d.stats.answered, "Answered"),
    tile(d.stats.correct, "Correct"),
    tile(Object.keys(d.achievements).length + "/" + CHEM.DATA.achievements.length, "Badges"),
    tile(Object.keys(d.bossesBeaten).length + "/5", "Bosses")
  ]));

  function tile(num, lbl) {
    return U.el("div", { class: "card stat-tile" }, [
      U.el("div", { class: "stat-num", text: String(num) }),
      U.el("div", { class: "stat-lbl", text: lbl })
    ]);
  }

  /* activity heatmap — last 16 weeks */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Activity"),
    U.el("span", { class: "h2-sub", text: "last 112 days" })
  ]));

  const heat = U.el("div", { class: "heat" });
  const today = new Date();
  let activeDays = 0;
  for (let i = 111; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    const key = U.dayKey(day);
    const xp = d.history[key] || 0;
    if (xp > 0) activeDays++;
    const lv = xp === 0 ? 0 : xp < 60 ? 1 : xp < 180 ? 2 : xp < 400 ? 3 : 4;
    heat.appendChild(U.el("div", {
      class: "heat-day", data: { lv: String(lv) },
      title: `${key}: ${xp} XP`
    }));
  }
  view.appendChild(U.el("div", { class: "card" }, [
    heat,
    U.el("div", { class: "tiny muted", style: "margin-top:10px", text:
      `${activeDays} active day${activeDays === 1 ? "" : "s"} in the last 16 weeks.` })
  ]));

  /* prestige */
  const atCap = d.level >= S.MAX_LEVEL;
  if (atCap || (d.prestige || 0) > 0) {
    view.appendChild(U.el("h2", { text: "Ascension" }));
    view.appendChild(U.el("div", { class: "card daily" }, [
      U.el("div", { class: "daily-ico", text: "🔱" }),
      U.el("div", { class: "daily-body" }, [
        U.el("h3", { text: (d.prestige || 0) > 0
          ? `Ascended ×${d.prestige} · +${Math.round(d.prestige * 12)}% XP forever`
          : "Ready to ascend" }),
        U.el("p", { class: "tiny muted", style: "margin:0", text:
          "Ascending resets your level and XP to 1 but keeps every unlock, achievement and " +
          "statistic — and grants a permanent +12% XP bonus, 2,500 Moles and 3 Catalysts." })
      ]),
      atCap
        ? U.el("button", {
            class: "btn btn-primary", text: "Ascend",
            on: { click: () => UI.confirmDialog(
              "Ascend to prestige " + ((d.prestige || 0) + 1) + "?",
              "Your level returns to 1 and your XP resets. You keep all avatars, skins, " +
              "achievements, flashcard progress and statistics, and gain a permanent " +
              "<b>+12% XP</b> bonus that stacks with every future ascension.",
              () => {
                if (S.doPrestige()) {
                  CHEM.Sound.prestige();
                  CHEM.FX.confetti(200);
                  UI.toast({ icon: "🔱", kind: "good", ms: 5000,
                    text: `<b>Ascended!</b> Prestige ${d.prestige} — +${Math.round(d.prestige * 12)}% XP forever.` });
                  S.checkAchievements();
                  UI.go("/home");
                }
              }, "Ascend") }
          })
        : U.el("span", { class: "chip", text: `Lv ${d.level} / ${S.MAX_LEVEL}` })
    ]));
  }

  /* module breakdown */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Module breakdown"),
    U.el("span", { class: "h2-sub", text: "mastery tiers" })
  ]));
  const modCard = U.el("div", { class: "card" });
  CHEM.Bank.statsByModule().forEach(m => {
    const tier = S.masteryTier(m.mastery);
    modCard.appendChild(U.el("div", { class: "mastery-item" }, [
      U.el("div", { class: "mastery-badge", text: m.id }),
      U.el("div", { class: "mastery-body" }, [
        U.el("div", { class: "mastery-name", text: `${m.short} · ${m.correct}/${m.seen} correct` }),
        U.el("div", { class: "bar" }, [U.el("i", { style: `width:${m.mastery}%` })])
      ]),
      U.el("div", { class: "mastery-pct", style: "color:" + tier.colour,
        text: tier.icon + " " + m.mastery + "%" })
    ]));
  });
  view.appendChild(modCard);
  view.appendChild(U.el("div", { class: "row tiny muted", style: "margin-top:8px; gap:10px" },
    CHEM.DATA.masteryTiers.slice(1).map(t =>
      U.el("span", { text: `${t.icon} ${t.name} ${t.at}%+` }))));
  view.appendChild(U.el("p", { class: "tiny muted", style: "margin-top:8px", text:
    "Mastery is weighted by how many questions you've attempted — a perfect run over three questions isn't mastery yet." }));

  /* personal bests */
  const scores = Object.entries(d.scores);
  if (scores.length) {
    view.appendChild(U.el("h2", { text: "Personal bests" }));
    const names = {
      quiz: "Quiz (correct in a run)", balance: "Balance Blitz (equations)",
      ionmatch: "Ion Memory (efficiency %)", naming: "Naming (correct)",
      calc: "Calculations (correct)", titration: "Titration (accuracy)",
      pathway: "Pathway (routes)", precipitate: "Precipitation (cells)"
    };
    const box = U.el("div", { class: "card" });
    scores.forEach(([k, v]) => {
      const label = names[k] || (k.startsWith("boss_")
        ? "Boss " + k.slice(5).toUpperCase() + " (HP remaining)" : k);
      box.appendChild(U.el("div", { class: "srow" }, [
        U.el("div", { class: "srow-body" }, [U.el("div", { text: label })]),
        U.el("b", { text: String(v) })
      ]));
    });
    view.appendChild(box);
  }

  /* mistakes */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Mistakes to fix"),
    U.el("span", { class: "h2-sub", text: d.mistakes.length + " outstanding" })
  ]));

  if (!d.mistakes.length) {
    view.appendChild(U.el("div", { class: "card" }, [
      U.el("p", { style: "margin:0", text: "Nothing outstanding. Missed questions land here until you answer them correctly." })
    ]));
  } else {
    view.appendChild(U.el("button", {
      class: "btn btn-primary btn-block", text: `🩹 Rehab ${Math.min(15, d.mistakes.length)} questions`,
      on: { click: () => UI.go("/game/mistakes") }
    }));
    const wrap = U.el("div", { style: "margin-top:12px" });
    d.mistakes.slice(0, 20).forEach(m => {
      const q = CHEM.Bank.byId(m.id);
      if (!q) return;
      wrap.appendChild(U.el("div", { class: "wrongq" }, [
        U.el("div", { class: "row", style: "gap:6px; margin-bottom:6px" }, [
          U.el("span", { class: "chip", text: CHEM.Bank.moduleName(q.mod) }),
          U.el("span", { class: "chip", text: q.topic }),
          U.el("span", { class: "chip", text: `missed ×${m.misses}` })
        ]),
        U.el("div", { class: "q", html: U.formula(q.q) }),
        U.el("div", { class: "a", html: "✔ " + U.formula(q.choices[q.a]) })
      ]));
    });
    view.appendChild(wrap);
  }

  view.appendChild(U.el("div", { class: "row", style: "margin-top:20px" }, [
    U.el("button", { class: "btn", text: "🏆 Achievements", on: { click: () => UI.go("/achievements") } }),
    U.el("button", { class: "btn btn-ghost", text: "⚙️ Settings", on: { click: () => UI.go("/settings") } })
  ]));
};
