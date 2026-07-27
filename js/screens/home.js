/* Home ("The Lab") — greeting, daily challenge, quick stats and module mastery. */
window.CHEM = window.CHEM || {};
CHEM.Screens = CHEM.Screens || {};

CHEM.Screens.home = function (view) {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;
  const d = S.data;

  const hour = new Date().getHours();
  const greet = hour < 5 ? "Still up?" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* hero */
  const hero = U.el("div", { class: "hero" }, [
    U.el("h1", { text: `${greet}, ${d.profile.name}` }),
    U.el("p", { html: d.streak.count > 0
      ? `You're on a <b>${d.streak.count}-day</b> streak. Keep the reaction going.`
      : "Answer one question today to start a streak." }),
    U.el("div", { class: "row" }, [
      U.el("button", {
        class: "btn btn-primary", text: "⚡ Quick session",
        on: { click: () => UI.go("/game/rapid") }
      }),
      U.el("button", {
        class: "btn", text: "🃏 Review due cards",
        on: { click: () => UI.go("/study") }
      })
    ])
  ]);
  view.appendChild(hero);

  /* daily challenge */
  const daily = S.daily();
  const spec = daily.spec;
  const modeNames = {
    quiz: "Rapid Fire", balance: "Balance Blitz", ionmatch: "Ion Memory",
    naming: "Name That Compound", calc: "Calculation Crunch",
    precipitate: "Precipitation Panic", titration: "Titration Lab", pathway: "Pathway Puzzle"
  };
  const complete = daily.progress >= spec.target;

  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Daily challenge"),
    U.el("span", { class: "h2-sub", text: "resets at midnight" })
  ]));

  const dailyCard = U.el("div", { class: "card daily" }, [
    U.el("div", { class: "daily-ico", text: daily.claimed ? "✅" : complete ? "🎁" : "🎯" }),
    U.el("div", { class: "daily-body" }, [
      U.el("h3", { text: `${modeNames[spec.mode]} — reach ${spec.target}` }),
      U.el("div", { class: "bar", style: "margin:8px 0 6px" }, [
        U.el("i", { style: `width:${U.clamp((daily.progress / spec.target) * 100, 0, 100)}%` })
      ]),
      U.el("div", { class: "tiny muted", text:
        `${daily.progress} / ${spec.target} · reward ${spec.reward} 🪙 + ${spec.xp} XP` })
    ]),
    daily.claimed
      ? U.el("span", { class: "chip on", text: "Claimed" })
      : complete
        ? U.el("button", {
            class: "btn btn-primary", text: "Claim",
            on: { click: e => {
              if (S.claimDaily()) {
                CHEM.Sound.win();
                CHEM.FX.burstAt(e.target, { count: 40, speed: 7 });
                UI.toast({ icon: "🎁", kind: "good", text: `<b>Daily complete!</b> +${spec.reward} 🪙 +${spec.xp} XP` });
                S.checkAchievements();
                UI.handleRoute();
              }
            } }
          })
        : U.el("button", {
            class: "btn", text: "Play",
            on: { click: () => UI.go("/game/" + dailyRoute(spec.mode)) }
          })
  ]);
  view.appendChild(dailyCard);

  function dailyRoute(mode) {
    return mode === "quiz" ? "rapid" : mode;
  }

  /* weekly quests */
  const quests = S.weeklyQuests();
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Weekly quests"),
    U.el("span", { class: "h2-sub", text: "resets Monday" })
  ]));
  view.appendChild(U.el("div", { class: "grid" }, quests.map(entry => {
    const q = entry.quest;
    return U.el("div", { class: "card daily" }, [
      U.el("div", { class: "daily-ico", text: entry.claimed ? "✅" : q.icon }),
      U.el("div", { class: "daily-body" }, [
        U.el("h3", { text: q.name }),
        U.el("div", { class: "bar", style: "margin:8px 0 6px" }, [
          U.el("i", { style: `width:${U.clamp((entry.done / entry.target) * 100, 0, 100)}%` })
        ]),
        U.el("div", { class: "tiny muted", text:
          `${q.desc} — ${entry.done} / ${entry.target} · ${q.coins} 🪙 + ${q.xp} XP` })
      ]),
      entry.claimed
        ? U.el("span", { class: "chip on", text: "Claimed" })
        : entry.complete
          ? U.el("button", {
              class: "btn btn-sm btn-primary", text: "Claim",
              on: { click: e => {
                if (S.claimQuest(q.id)) {
                  CHEM.Sound.quest();
                  CHEM.FX.burstAt(e.target, { count: 40, speed: 7 });
                  UI.toast({ icon: q.icon, kind: "good",
                    text: `<b>${U.escapeHtml(q.name)}</b> complete! +${q.coins} 🪙` });
                  S.checkAchievements();
                  UI.handleRoute();
                }
              } }
            })
          : U.el("span", { class: "chip", text: Math.round((entry.done / entry.target) * 100) + "%" })
    ]);
  })));

  /* stats */
  const acc = S.overallAccuracy();
  const due = S.dueCards().length;
  view.appendChild(U.el("h2", { text: "At a glance" }));
  view.appendChild(U.el("div", { class: "grid g4" }, [
    tile(d.stats.answered, "Questions"),
    tile(acc + "%", "Accuracy"),
    tile(d.stats.bestStreak, "Best streak"),
    tile(due, "Cards due")
  ]));

  function tile(num, lbl) {
    return U.el("div", { class: "card stat-tile" }, [
      U.el("div", { class: "stat-num", text: String(num) }),
      U.el("div", { class: "stat-lbl", text: lbl })
    ]);
  }

  /* module mastery */
  const stats = CHEM.Bank.statsByModule();
  const y12 = stats.filter(m => m.year === 12);
  const y11 = stats.filter(m => m.year === 11);

  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Module mastery"),
    U.el("span", { class: "h2-sub", text: "Year 12 focus" })
  ]));

  const masteryCard = U.el("div", { class: "card" });
  y12.concat(y11).forEach(m => {
    masteryCard.appendChild(U.el("div", { class: "mastery-item" }, [
      U.el("div", { class: "mastery-badge", text: m.id }),
      U.el("div", { class: "mastery-body" }, [
        U.el("div", { class: "mastery-name", text: m.short }),
        U.el("div", { class: "bar" }, [U.el("i", { style: `width:${m.mastery}%` })])
      ]),
      U.el("div", { class: "mastery-pct", text: m.mastery + "%" }),
      U.el("button", {
        class: "chip chip-btn", text: "Drill",
        on: { click: () => UI.go("/game/drill/" + m.id) }
      })
    ]));
  });
  view.appendChild(masteryCard);

  /* weak spots */
  const weak = stats.filter(m => m.seen >= 5).sort((a, b) => a.accuracy - b.accuracy)[0];
  if (weak && weak.accuracy < 75) {
    view.appendChild(U.el("h2", { text: "Suggested next" }));
    view.appendChild(U.el("div", { class: "card daily" }, [
      U.el("div", { class: "daily-ico", text: "🎯" }),
      U.el("div", { class: "daily-body" }, [
        U.el("h3", { text: weak.short }),
        U.el("p", { class: "tiny muted", style: "margin:0",
          text: `Your weakest module right now at ${weak.accuracy}% accuracy over ${weak.seen} questions.` })
      ]),
      U.el("button", { class: "btn btn-sm btn-primary", text: "Practise",
        on: { click: () => UI.go("/game/drill/" + weak.id) } })
    ]));
  }

  if (d.mistakes.length) {
    view.appendChild(U.el("div", { class: "card daily", style: "margin-top:12px" }, [
      U.el("div", { class: "daily-ico", text: "🩹" }),
      U.el("div", { class: "daily-body" }, [
        U.el("h3", { text: `${d.mistakes.length} question${d.mistakes.length === 1 ? "" : "s"} to fix` }),
        U.el("p", { class: "tiny muted", style: "margin:0",
          text: "Questions you've missed come back until you get them right." })
      ]),
      U.el("button", { class: "btn btn-sm", text: "Rehab", on: { click: () => UI.go("/game/mistakes") } })
    ]));
  }
};
