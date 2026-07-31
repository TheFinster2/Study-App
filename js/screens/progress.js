/* Progress — mastery per topic, the XP heatmap, mistakes, and Ascension. */
window.MQ = window.MQ || {};
MQ.Screens = MQ.Screens || {};

MQ.Screens.progress = function (view) {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;
  const d = S.data;

  view.appendChild(U.el("h1", { text: "Progress" }));

  view.appendChild(U.el("div", { class: "grid g4" }, [
    tile(d.lifetimeXp.toLocaleString(), "Lifetime XP"),
    tile(d.stats.answered.toLocaleString(), "Answered"),
    tile(S.overallAccuracy() + "%", "Accuracy"),
    tile(d.stats.bestStreak, "Best streak")
  ]));

  /* ── the XP heatmap ── */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Last 12 weeks"),
    U.el("span", { class: "h2-sub", text: "XP per day" })
  ]));
  const heat = U.el("div", { class: "heat" });
  const today = new Date();
  const values = [];
  for (let i = 83; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    values.push({ key: U.dayKey(day), xp: d.history[U.dayKey(day)] || 0 });
  }
  const peak = Math.max(1, ...values.map(v => v.xp));
  values.forEach(v => {
    const lv = v.xp === 0 ? 0 : Math.min(4, Math.ceil((v.xp / peak) * 4));
    heat.appendChild(U.el("div", { class: "heat-day", data: { lv: String(lv) },
      title: `${v.key}: ${v.xp} XP` }));
  });
  view.appendChild(U.el("div", { class: "card" }, [heat]));

  /* ── mastery, every topic, grouped by tier ── */
  view.appendChild(U.el("h2", { text: "Mastery by topic" }));
  const stats = MQ.Bank.statsByTopic();
  MQ.DATA.TIERS.forEach(tier => {
    const rows = stats.filter(t => t.tier === tier);
    if (!rows.length) return;
    const card = U.el("div", { class: "card", style: "margin-bottom:12px" }, [
      U.el("div", { class: "row", style: "margin-bottom:6px" }, [
        U.el("h3", { style: "margin:0", text: MQ.DATA.TIER_META[tier].name }),
        U.el("div", { class: "spacer" }),
        U.el("span", { class: "chip" + (tier === "ME" ? " chip-ext" : ""),
          text: MQ.DATA.TIER_META[tier].chip })
      ])
    ]);
    rows.forEach(t => {
      const mt = S.masteryTier(t.mastery);
      card.appendChild(U.el("div", { class: "mastery-item" }, [
        U.el("div", { class: "mastery-badge", style: `color:${mt.colour}`, text: mt.icon }),
        U.el("div", { class: "mastery-body" }, [
          U.el("div", { class: "mastery-name", text: t.id + " · " + t.short }),
          U.el("div", { class: "bar" }, [U.el("i", { style: `width:${t.mastery}%` })]),
          U.el("div", { class: "tiny muted", style: "margin-top:4px",
            text: `${t.correct}/${t.seen} correct · ${t.total} questions available` })
        ]),
        U.el("div", { class: "mastery-pct", text: t.mastery + "%" })
      ]));
    });
    view.appendChild(card);
  });

  /* ── outstanding mistakes ── */
  const mistakes = MQ.Bank.mistakeQuestions().slice(0, 8);
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Outstanding mistakes"),
    U.el("span", { class: "h2-sub", text: d.mistakes.length + " total" })
  ]));
  if (!mistakes.length) {
    view.appendChild(U.el("div", { class: "card" }, [
      U.el("p", { style: "margin:0", text: "Nothing outstanding. Answer something wrong and it will appear here." })
    ]));
  } else {
    mistakes.forEach(q => {
      view.appendChild(U.el("div", { class: "wrongq" }, [
        U.el("div", { class: "q math", html: U.math(q.q) }),
        U.el("div", { class: "a math", html: "→ " + U.math(q.choices[q.a]) })
      ]));
    });
    view.appendChild(U.el("button", {
      class: "btn btn-primary btn-block", text: "🩹 Rehab these now",
      on: { click: () => UI.go("/game/mistakes") }
    }));
  }

  /* ── achievements shortcut ── */
  const total = MQ.DATA.enabledAchievements().length;
  const done = MQ.DATA.enabledAchievements().filter(a => d.achievements[a.id]).length;
  view.appendChild(U.el("h2", { text: "Achievements" }));
  view.appendChild(U.el("div", { class: "card" }, [
    U.el("div", { class: "row" }, [
      U.el("div", { style: "flex:1; min-width:0" }, [
        U.el("div", { class: "bar" }, [U.el("i", { style: `width:${U.pct(done, total)}%` })]),
        U.el("div", { class: "tiny muted", style: "margin-top:6px", text: `${done} of ${total} unlocked` })
      ]),
      U.el("button", { class: "btn btn-sm", text: "View all", on: { click: () => UI.go("/achievements") } })
    ])
  ]));

  /* ── ascension ── */
  view.appendChild(U.el("h2", { text: "Ascension" }));
  const canAscend = S.canPrestige();
  view.appendChild(U.el("div", { class: "card" }, [
    U.el("p", { html: canAscend
      ? "You have reached level 60. <b>Ascending</b> resets your level and XP but keeps every " +
        "unlock, achievement, flashcard box and statistic — and grants a permanent <b>+12% XP</b>, " +
        "which stacks with every ascension."
      : `Reach level 60 to Ascend. You are level <b>${d.level}</b>.` +
        (d.prestige ? ` You have ascended <b>${d.prestige}</b> time${d.prestige === 1 ? "" : "s"} — currently +${d.prestige * 12}% XP.` : "") }),
    U.el("button", {
      class: "btn " + (canAscend ? "btn-primary" : "") + " btn-block",
      disabled: !canAscend,
      text: canAscend ? "🔱 Ascend" : "🔒 Locked until level 60",
      on: { click: () => UI.confirmDialog("Ascend?",
        "Your level and XP reset to 1. Everything else stays, and you gain a permanent +12% XP.",
        () => {
          if (!S.doPrestige()) return;
          MQ.Sound.prestige();
          MQ.FX.confetti(200);
          UI.toast({ icon: "🔱", kind: "good", ms: 5000,
            text: `<b>Ascended.</b> Permanent bonus is now +${S.data.prestige * 12}% XP.` });
          UI.handleRoute();
        }, "Ascend") }
    })
  ]));

  function tile(num, label) {
    return U.el("div", { class: "card stat-tile" }, [
      U.el("div", { class: "stat-num", text: String(num) }),
      U.el("div", { class: "stat-lbl", text: label })
    ]);
  }
};
