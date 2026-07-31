/* Home — the dashboard: hero, daily challenge, weekly quests, mastery, streak. */
window.MQ = window.MQ || {};
MQ.Screens = MQ.Screens || {};

MQ.Screens.home = function (view) {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;
  const d = S.data;

  /* ── hero ── */
  const weak = MQ.Bank.weakestTopic();
  view.appendChild(U.el("div", { class: "hero" }, [
    U.el("h1", { text: greeting() }),
    U.el("p", { html: d.stats.answered
      ? `You have answered <b>${d.stats.answered.toLocaleString()}</b> questions at ` +
        `<b>${S.overallAccuracy()}%</b> accuracy. ` +
        (weak ? `Weakest topic right now: <b>${U.escapeHtml(weak.short)}</b>.` : "")
      : "A game-based trainer for HSC Mathematics. Start anywhere — the app will work out what you need." }),
    U.el("div", { class: "row" }, [
      U.el("button", { class: "btn btn-primary", text: "⚡ Rapid Fire",
        on: { click: () => UI.go("/game/rapid") } }),
      weak
        ? U.el("button", { class: "btn", text: "🎯 Drill " + weak.short,
            on: { click: () => UI.go("/game/drill/" + weak.id) } })
        : U.el("button", { class: "btn", text: "🎮 All games", on: { click: () => UI.go("/play") } }),
      U.el("button", { class: "btn btn-ghost", text: "🗂️ Study", on: { click: () => UI.go("/study") } })
    ])
  ]));

  /* ── quick stats ── */
  const due = S.dueCards().length;
  view.appendChild(U.el("div", { class: "grid g4", style: "margin-top:16px" }, [
    tile(d.level, "Level"),
    tile(d.streak.count, "Day streak"),
    tile(S.overallAccuracy() + "%", "Accuracy"),
    tile(due, "Cards due")
  ]));

  /* ── daily challenge ── */
  const daily = S.daily();
  const spec = daily.spec;
  const modeName = {
    rapid: "Rapid Fire", equiv: "Equivalence Engine", match: "Match Pairs",
    curve: "Read the Curve", crunch: "Calculation Crunch", panic: "Table Panic",
    lab: "Calculus Lab", proof: "Proof Builder", vector: "Vector Lab"
  }[spec.mode] || spec.mode;

  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Daily challenge"),
    U.el("span", { class: "h2-sub", text: "same for everyone, all day" })
  ]));
  view.appendChild(U.el("div", { class: "card daily" }, [
    U.el("div", { class: "daily-ico", text: daily.claimed ? "✅" : "🎯" }),
    U.el("div", { class: "daily-body" }, [
      U.el("div", { style: "font-weight:800; font-size:14.5px",
        text: `${modeName} — ${spec.target} to complete` }),
      U.el("div", { class: "bar", style: "margin:8px 0 6px" },
        [U.el("i", { style: `width:${U.clamp((daily.progress / spec.target) * 100, 0, 100)}%` })]),
      U.el("div", { class: "tiny muted",
        text: `${daily.progress} / ${spec.target}  ·  reward ${spec.xp} XP + ${spec.reward} 🔢` })
    ]),
    daily.claimed
      ? U.el("span", { class: "chip on", text: "Claimed" })
      : daily.progress >= spec.target
        ? U.el("button", { class: "btn btn-primary btn-sm", text: "Claim", on: { click: () => {
            if (!S.claimDaily()) return;
            MQ.Sound.daily();
            MQ.FX.confetti(110);
            UI.toast({ icon: "🎁", kind: "good", text: `<b>Daily claimed</b> · +${spec.xp} XP` });
            UI.handleRoute();
          } } })
        : U.el("button", { class: "btn btn-sm", text: "Play", on: { click: () => UI.go("/game/" + spec.mode) } })
  ]));

  /* ── weekly quests ── */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Weekly quests"),
    U.el("span", { class: "h2-sub", text: S.weekKey() })
  ]));
  const qGrid = U.el("div", { class: "grid g3" });
  S.weeklyQuests().forEach(e => {
    qGrid.appendChild(U.el("div", { class: "card" }, [
      U.el("div", { class: "row" }, [
        U.el("div", { style: "font-size:22px", text: e.quest.icon }),
        U.el("div", { style: "flex:1; min-width:0" }, [
          U.el("div", { style: "font-weight:800; font-size:13.5px", text: e.quest.name }),
          U.el("div", { class: "tiny muted", text: e.quest.desc })
        ])
      ]),
      U.el("div", { class: "bar", style: "margin:10px 0 6px" },
        [U.el("i", { style: `width:${U.clamp((e.done / e.target) * 100, 0, 100)}%` })]),
      U.el("div", { class: "row" }, [
        U.el("span", { class: "tiny muted", text: `${e.done} / ${e.target}` }),
        U.el("div", { class: "spacer" }),
        e.claimed
          ? U.el("span", { class: "chip on", text: "Claimed" })
          : e.complete
            ? U.el("button", { class: "btn btn-sm btn-primary", text: `+${e.quest.xp} XP`, on: { click: () => {
                if (!S.claimQuest(e.quest.id)) return;
                MQ.Sound.quest();
                MQ.FX.confetti(90);
                UI.toast({ icon: e.quest.icon, kind: "good", text: `<b>${U.escapeHtml(e.quest.name)}</b> claimed.` });
                UI.handleRoute();
              } } })
            : U.el("span", { class: "chip", text: `+${e.quest.xp} XP` })
      ])
    ]));
  });
  view.appendChild(qGrid);

  /* ── topic mastery ── */
  const stats = MQ.Bank.statsByTopic();
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Topic mastery"),
    U.el("span", { class: "h2-sub", text: "confidence-weighted" })
  ]));
  const card = U.el("div", { class: "card" });
  stats.slice().sort((a, b) => b.mastery - a.mastery).slice(0, 8).forEach(t => {
    const tier = S.masteryTier(t.mastery);
    card.appendChild(U.el("div", { class: "mastery-item" }, [
      U.el("div", { class: "mastery-badge", style: `color:${tier.colour}`, text: tier.icon }),
      U.el("div", { class: "mastery-body" }, [
        U.el("div", { class: "mastery-name", text: t.id + " · " + t.short }),
        U.el("div", { class: "bar" }, [U.el("i", { style: `width:${t.mastery}%` })])
      ]),
      U.el("div", { class: "mastery-pct", text: t.mastery + "%" })
    ]));
  });
  card.appendChild(U.el("button", {
    class: "btn btn-ghost btn-block btn-sm", style: "margin-top:12px",
    text: "See every topic", on: { click: () => UI.go("/progress") }
  }));
  view.appendChild(card);

  /* ── the reference library, one tap away ── */
  view.appendChild(U.el("h2", { text: "Need a formula?" }));
  view.appendChild(U.el("button", {
    class: "btn btn-ghost btn-block", text: "📖 Open the Reference Library",
    on: { click: () => UI.go("/reference") }
  }));

  function tile(num, label) {
    return U.el("div", { class: "card stat-tile" }, [
      U.el("div", { class: "stat-num", text: String(num) }),
      U.el("div", { class: "stat-lbl", text: label })
    ]);
  }

  function greeting() {
    const h = new Date().getHours();
    const who = S.levelTitle(d.level);
    if (h < 5) return "Still up, " + who + "?";
    if (h < 12) return "Morning, " + who;
    if (h < 18) return "Afternoon, " + who;
    return "Evening, " + who;
  }
};
