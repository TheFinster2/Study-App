/* Achievements, Settings and the profile sheet. */
window.CHEM = window.CHEM || {};
CHEM.Screens = CHEM.Screens || {};

/* ── achievements ──────────────────────────────────────────── */
CHEM.Screens.achievements = function (view) {
  const U = CHEM.U, S = CHEM.State;
  const d = S.data;
  const stats = S.achievementStats();
  const list = CHEM.DATA.achievements;
  const done = list.filter(a => d.achievements[a.id]).length;

  view.appendChild(U.el("h1", { text: "Achievements" }));
  view.appendChild(U.el("p", { html: `<b>${done}</b> of ${list.length} unlocked.` }));
  view.appendChild(U.el("div", { class: "bar", style: "margin-bottom:18px" }, [
    U.el("i", { style: `width:${U.pct(done, list.length)}%` })
  ]));

  const sorted = list.slice().sort((a, b) => {
    const au = !!d.achievements[a.id], bu = !!d.achievements[b.id];
    return au === bu ? 0 : au ? -1 : 1;
  });

  const grid = U.el("div", { class: "grid g2" });
  sorted.forEach(a => {
    const unlocked = !!d.achievements[a.id];
    let progress = null;
    if (!unlocked && a.goal) {
      try {
        const [cur, max] = a.goal(stats);
        if (max) progress = U.el("div", { class: "bar", style: "margin-top:6px" }, [
          U.el("i", { style: `width:${U.pct(cur, max)}%` })
        ]);
      } catch (e) { /* a goal that can't be computed just shows no bar */ }
    }
    grid.appendChild(U.el("div", { class: "ach " + (unlocked ? "done" : "locked") }, [
      U.el("div", { class: "ach-ico", text: unlocked ? a.icon : "🔒" }),
      U.el("div", { class: "ach-body" }, [
        U.el("div", { class: "ach-name", text: a.name }),
        U.el("div", { class: "ach-desc", text: a.desc }),
        progress
      ]),
      a.reward ? U.el("div", { class: "ach-rew", text: "+" + a.reward + "🪙" }) : null
    ]));
  });
  view.appendChild(grid);
};

/* ── settings ──────────────────────────────────────────────── */
CHEM.Screens.settings = function (view) {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;
  const d = S.data;

  view.appendChild(U.el("h1", { text: "Settings" }));

  /* profile */
  const nameInput = U.el("input", {
    class: "numin", type: "text", value: d.profile.name, maxlength: "18",
    style: "text-align:left; font-size:15px; padding:10px 14px"
  });
  nameInput.addEventListener("change", () => {
    d.profile.name = nameInput.value.trim().slice(0, 18) || "Chemist";
    S.emit();
    UI.toast({ icon: "✅", text: "Name saved." });
  });

  view.appendChild(U.el("div", { class: "card" }, [
    U.el("h3", { text: "Profile" }),
    U.el("div", { class: "srow" }, [
      U.el("div", { class: "srow-body" }, [
        U.el("div", { text: "Display name" }),
        U.el("div", { class: "tiny muted", text: "Shown on the home screen." })
      ])
    ]),
    nameInput,
    U.el("div", { class: "srow", style: "margin-top:12px" }, [
      U.el("div", { class: "srow-body" }, [
        U.el("div", { text: "Avatar" }),
        U.el("div", { class: "tiny muted", text: "Unlock more in the Shop." })
      ])
    ]),
    U.el("div", { class: "emoji-pick" }, CHEM.DATA.shop.avatars.map(a => {
      const owned = S.ownsAvatar(a.emoji);
      const b = U.el("button", {
        class: "emoji-opt" + (d.profile.avatar === a.emoji ? " on" : "") + (owned ? "" : " lock"),
        text: owned ? a.emoji : "🔒", title: a.name, disabled: !owned
      });
      if (owned) b.addEventListener("click", () => {
        d.profile.avatar = a.emoji;
        S.emit();
        CHEM.Sound.click();
        UI.handleRoute();
      });
      return b;
    }))
  ]));

  /* appearance */
  view.appendChild(U.el("h2", { text: "Appearance" }));
  view.appendChild(U.el("div", { class: "card" }, [
    U.el("div", { class: "row" }, CHEM.DATA.shop.themes.map(t => {
      const owned = S.ownsTheme(t.id);
      return U.el("button", {
        class: "chip chip-btn" + (d.profile.theme === t.id ? " on" : ""),
        text: owned ? t.name : "🔒 " + t.name,
        disabled: !owned,
        on: { click: () => { UI.applyTheme(t.id); UI.handleRoute(); } }
      });
    }))
  ]));

  /* difficulty */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Difficulty"),
    U.el("span", { class: "h2-sub", text: "applies to every mode" })
  ]));
  view.appendChild(U.el("div", { class: "grid g3" }, CHEM.DATA.difficulties.map(diff => {
    const on = (d.settings.difficulty || "standard") === diff.id;
    const card = U.el("button", {
      class: "game-card" + (on ? "" : ""),
      style: `--gc:${diff.id === "nightmare" ? "#ff4d3d" : diff.id === "hard" ? "#ffab3d" : "var(--glow-a)"};` +
             (on ? "border-color:var(--accent)" : "")
    }, [
      U.el("div", { class: "game-ico", text: diff.icon }),
      U.el("div", { class: "game-name", text: diff.name }),
      U.el("div", { class: "game-desc", text: diff.desc }),
      U.el("div", { class: "game-foot" }, [
        U.el("span", { class: "chip" + (on ? " on" : ""), text: `×${diff.xp} XP` }),
        on ? U.el("span", { class: "chip on lock-tag", text: "Active" }) : null
      ])
    ]);
    card.addEventListener("click", () => {
      d.settings.difficulty = diff.id;
      S.save();
      CHEM.Sound.rankUp();
      UI.toast({ icon: diff.icon, kind: "good", text: `<b>${diff.name}</b> mode — ×${diff.xp} XP.` });
      UI.handleRoute();
    });
    return card;
  })));

  /* toggles */
  view.appendChild(U.el("h2", { text: "Preferences" }));
  const card = U.el("div", { class: "card" });
  card.appendChild(toggleRow("Sound effects", "Blips, fizzes and fanfares.", d.settings.sound, v => {
    d.settings.sound = v;
    CHEM.Sound.setEnabled(v);
    if (v) CHEM.Sound.click();
    S.save();
  }));
  card.appendChild(toggleRow("Particle effects", "Confetti, sparks and floating XP.", d.settings.motion, v => {
    d.settings.motion = v;
    CHEM.FX.setReduced(!v);
    S.save();
  }));

  /* volume */
  const vol = U.el("input", {
    type: "range", min: "0", max: "100", step: "5",
    value: String(Math.round((d.settings.volume ?? 0.8) * 100)),
    style: "width:140px; accent-color:var(--accent)"
  });
  const volLabel = U.el("b", { text: Math.round((d.settings.volume ?? 0.8) * 100) + "%" });
  vol.addEventListener("input", () => {
    const v = Number(vol.value) / 100;
    d.settings.volume = v;
    CHEM.Sound.setVolume(v);
    volLabel.textContent = vol.value + "%";
    S.save();
  });
  // Preview on release rather than on every drag step.
  vol.addEventListener("change", () => CHEM.Sound.coin());
  card.appendChild(U.el("div", { class: "srow" }, [
    U.el("div", { class: "srow-body" }, [
      U.el("div", { text: "Volume" }),
      U.el("div", { class: "tiny muted", text: "Master level for all sound effects." })
    ]),
    volLabel, vol
  ]));
  view.appendChild(card);

  function toggleRow(title, desc, value, onChange) {
    const sw = U.el("div", { class: "switch" + (value ? " on" : ""), role: "switch", tabindex: "0" });
    const flip = () => {
      value = !value;
      sw.classList.toggle("on", value);
      onChange(value);
    };
    sw.addEventListener("click", flip);
    sw.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    return U.el("div", { class: "srow" }, [
      U.el("div", { class: "srow-body" }, [
        U.el("div", { text: title }),
        U.el("div", { class: "tiny muted", text: desc })
      ]),
      sw
    ]);
  }

  /* data */
  view.appendChild(U.el("h2", { text: "Save data" }));
  view.appendChild(U.el("div", { class: "card" }, [
    U.el("p", { class: "tiny muted", text:
      "Progress is stored in this browser only. Export a backup if you switch devices or clear your browsing data." }),
    U.el("div", { class: "row" }, [
      U.el("button", { class: "btn btn-sm", text: "⬇ Export save", on: { click: exportSave } }),
      U.el("button", { class: "btn btn-sm", text: "⬆ Import save", on: { click: importSave } }),
      U.el("div", { class: "spacer" }),
      U.el("button", {
        class: "btn btn-sm btn-ghost", text: "Reset everything",
        style: "color:var(--bad)",
        on: { click: () => UI.confirmDialog(
          "Reset all progress?",
          "This permanently deletes your level, XP, Moles, unlocks and spaced-repetition history. It cannot be undone.",
          () => { S.reset(); UI.applyTheme("lab"); UI.toast({ icon: "🧹", text: "Progress cleared." }); UI.go("/home"); },
          "Delete everything"
        ) }
      })
    ])
  ]));

  function exportSave() {
    const blob = new Blob([JSON.stringify(S.data, null, 2)], { type: "application/json" });
    const a = U.el("a", { href: URL.createObjectURL(blob), download: `molequest-save-${U.dayKey()}.json` });
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    UI.toast({ icon: "⬇", kind: "good", text: "Save exported." });
  }

  function importSave() {
    const input = U.el("input", { type: "file", accept: "application/json", style: "display:none" });
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (!parsed || typeof parsed !== "object" || !parsed.profile) throw new Error("bad file");
          localStorage.setItem("molequest.save.v1", JSON.stringify(parsed));
          UI.toast({ icon: "⬆", kind: "good", text: "Save imported — reloading." });
          setTimeout(() => location.reload(), 700);
        } catch (e) {
          UI.toast({ icon: "⚠️", kind: "bad", text: "That file isn't a MoleQuest save." });
        }
      };
      reader.readAsText(file);
    });
    document.body.appendChild(input);
    input.click();
    setTimeout(() => input.remove(), 60000);
  }

  /* about */
  view.appendChild(U.el("h2", { text: "About" }));
  view.appendChild(U.el("div", { class: "card" }, [
    U.el("p", { class: "tiny muted", html:
      "<b>MoleQuest</b> covers the NSW HSC Chemistry syllabus (Modules 1–8, with the focus on Year 12 Modules 5–8). " +
      "It runs entirely offline in your browser — no account, no network, no tracking." }),
    U.el("p", { class: "tiny muted", html:
      `Question bank: <b>${CHEM.Bank.all().length}</b> multiple-choice questions, ` +
      `<b>${CHEM.DATA.equations.length}</b> equations, <b>${CHEM.DATA.flashcards.length}</b> flashcards, ` +
      `<b>${CHEM.DATA.naming.length}</b> named compounds, plus procedurally generated calculations.` })
  ]));
};

/* ── profile sheet (from the avatar button) ────────────────── */
CHEM.Screens.profileSheet = function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;
  const d = S.data;
  const need = S.xpNeeded(d.level);

  const box = U.el("div", {}, [
    U.el("div", { class: "modal-center" }, [
      U.el("div", { style: "font-size:56px" , text: d.profile.avatar }),
      U.el("h2", { style: "justify-content:center", text: d.profile.name }),
      U.el("p", { text: `Level ${d.level} · ${S.levelTitle(d.level)}` }),
      U.el("div", { class: "bar" }, [U.el("i", { style: `width:${U.pct(d.xpIntoLevel, need)}%` })]),
      U.el("div", { class: "tiny muted", style: "margin-top:6px", text: `${d.xpIntoLevel} / ${need} XP to next level` })
    ]),
    U.el("div", { class: "result-grid" }, [
      cell(d.stats.answered, "Answered"),
      cell(S.overallAccuracy() + "%", "Accuracy"),
      cell(d.streak.count, "Day streak")
    ]),
    U.el("div", { class: "row" }, [
      U.el("button", { class: "btn btn-sm", text: "📈 Progress",
        on: { click: () => { UI.closeModal(); UI.go("/progress"); } } }),
      U.el("button", { class: "btn btn-sm", text: "🏆 Achievements",
        on: { click: () => { UI.closeModal(); UI.go("/achievements"); } } }),
      U.el("div", { class: "spacer" }),
      U.el("button", { class: "btn btn-sm btn-ghost", text: "⚙️",
        on: { click: () => { UI.closeModal(); UI.go("/settings"); } } })
    ])
  ]);

  function cell(n, l) {
    return U.el("div", { class: "result-cell" }, [
      U.el("div", { class: "result-num", text: String(n) }),
      U.el("div", { class: "result-lbl", text: l })
    ]);
  }

  UI.modal(box);
};
