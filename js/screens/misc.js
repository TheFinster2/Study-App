/* Achievements, Settings and the profile sheet. */
window.MQ = window.MQ || {};
MQ.Screens = MQ.Screens || {};

/* ── achievements ─────────────────────────────────────────── */
MQ.Screens.achievements = function (view) {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;
  const all = MQ.DATA.enabledAchievements();
  const done = all.filter(a => S.data.achievements[a.id]);

  view.appendChild(U.el("h1", { text: "Achievements" }));
  view.appendChild(U.el("p", { html:
    `<b>${done.length}</b> of <b>${all.length}</b> unlocked. ` +
    (MQ.DATA.hasExt() ? "" : "Extension 1 achievements are hidden on an Advanced-only build.") }));
  view.appendChild(U.el("div", { class: "bar", style: "margin-bottom:16px" },
    [U.el("i", { style: `width:${U.pct(done.length, all.length)}%` })]));

  const grid = U.el("div", { class: "grid g2" });
  // Unlocked first, then locked — the wall of grey is less discouraging that way.
  all.slice().sort((a, b) => (S.data.achievements[b.id] ? 1 : 0) - (S.data.achievements[a.id] ? 1 : 0))
    .forEach(a => {
      const unlocked = !!S.data.achievements[a.id];
      grid.appendChild(U.el("div", { class: "ach " + (unlocked ? "done" : "locked") }, [
        U.el("div", { class: "ach-ico", text: unlocked ? a.icon : "🔒" }),
        U.el("div", { class: "ach-body" }, [
          U.el("div", { class: "ach-name", text: a.name }),
          U.el("div", { class: "ach-desc", text: a.desc })
        ]),
        a.reward ? U.el("div", { class: "ach-rew", text: "+" + a.reward + " 🔢" }) : null
      ]));
    });
  view.appendChild(grid);
};

/* ── settings ─────────────────────────────────────────────── */
MQ.Screens.settings = function (view) {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;
  const d = S.data;

  view.appendChild(U.el("h1", { text: "Settings" }));

  /* difficulty */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Difficulty"),
    U.el("span", { class: "h2-sub", text: "scoring, not syllabus" })
  ]));
  const diffGrid = U.el("div", { class: "grid g3" });
  MQ.DATA.difficulties.forEach(m => {
    const active = d.settings.difficulty === m.id;
    diffGrid.appendChild(U.el("button", {
      class: "game-card" + (active ? "" : ""), style: "--gc:var(--glow-b)",
      on: { click: () => {
        d.settings.difficulty = m.id;
        S.emit();
        MQ.Sound.equip();
        UI.handleRoute();
      } }
    }, [
      U.el("div", { class: "game-ico", text: m.icon }),
      U.el("div", { class: "game-name", text: m.name }),
      U.el("div", { class: "game-desc", text: m.desc }),
      U.el("div", { class: "game-foot" }, [
        U.el("span", { class: "chip" + (active ? " on" : ""), text: active ? "Active" : "×" + m.xp + " XP" })
      ])
    ]));
  });
  view.appendChild(diffGrid);
  view.appendChild(U.el("p", { class: "tiny muted", style: "margin-top:8px", text:
    "This changes how hard the SCORING is. It is separate from which syllabus tier this build ships — " +
    "see the Build panel below." }));

  /* toggles */
  view.appendChild(U.el("h2", { text: "Preferences" }));
  const prefs = U.el("div", { class: "card" });
  prefs.appendChild(toggleRow("Sound effects", "Synthesised in the browser — no audio files.",
    d.settings.sound, on => {
      d.settings.sound = on;
      MQ.Sound.setEnabled(on);
      if (on) MQ.Sound.equip();
      S.save();
    }));
  prefs.appendChild(toggleRow("Motion and particles",
    "Turns off confetti, background drift and every decorative CSS animation.",
    d.settings.motion, on => {
      d.settings.motion = on;
      MQ.FX.setReduced(!on);
      // The setting has to reach CSS too, or only the JS particles go quiet.
      document.documentElement.dataset.motion = on ? "on" : "off";
      S.save();
    }));

  const vol = U.el("input", { type: "range", min: "0", max: "1", step: "0.05",
    value: String(d.settings.volume) });
  vol.addEventListener("input", () => {
    d.settings.volume = parseFloat(vol.value);
    MQ.Sound.setVolume(d.settings.volume);
    S.save();
  });
  vol.addEventListener("change", () => MQ.Sound.coin());
  prefs.appendChild(U.el("div", { class: "srow" }, [
    U.el("div", { class: "srow-body" }, [
      U.el("div", { style: "font-weight:700; font-size:13.5px", text: "Volume" }),
      U.el("div", { class: "tiny muted", text: "Applies to every cue." })
    ]),
    U.el("div", { style: "width:130px" }, [vol])
  ]));
  view.appendChild(prefs);

  /* ── build panel: which tier is shipping, and which version is running ──
     "What version am I actually on?" has to be answerable, or an update
     problem is undiagnosable. */
  view.appendChild(U.el("h2", { text: "Build" }));
  view.appendChild(U.el("div", { class: "card" }, [
    row("Syllabus tiers", MQ.DATA.TIERS.map(t => MQ.DATA.TIER_META[t].name).join(" + ")),
    row("Questions", MQ.Bank.all().length.toLocaleString()),
    row("Flashcards", String(MQ.Cards.all().length)),
    row("Generators", String(MQ.Gen.enabled().length)),
    row("App version", MQ.VERSION || "dev"),
    row("Service worker", navigator.serviceWorker && navigator.serviceWorker.controller
      ? "active" : "not controlling this page")
  ]));

  /* ── save data ── */
  view.appendChild(U.el("h2", { text: "Save data" }));
  view.appendChild(U.el("div", { class: "card grid" }, [
    U.el("p", { style: "margin:0", text:
      "Progress lives in this browser's local storage, so it does not follow you to another device. " +
      "Export it before you switch phones." }),
    U.el("button", { class: "btn btn-block", text: "⬇ Export save", on: { click: exportSave } }),
    U.el("button", { class: "btn btn-block", text: "⬆ Import save", on: { click: importSave } })
  ]));

  /* ── recovery ────────────────────────────────────────────────
     iOS does NOT clear website data when a home-screen PWA is deleted, so
     "uninstall and reinstall" does not reset anything and does not fetch a
     new version. Without an in-app escape hatch a student can be stuck on a
     stale build with no way out. */
  view.appendChild(U.el("h2", { text: "Troubleshooting" }));
  view.appendChild(U.el("div", { class: "card grid" }, [
    U.el("p", { style: "margin:0", text:
      "If the app seems stuck on an old version — a fix you were told about has not arrived — " +
      "this clears every cache and re-downloads the app. Your progress is not touched." }),
    U.el("button", { class: "btn btn-block", text: "🔄 Force refresh", on: { click: forceRefresh } }),
    U.el("button", { class: "btn btn-danger btn-block", text: "Reset all progress",
      on: { click: () => UI.confirmDialog("Reset everything?",
        "This deletes your level, XP, Primes, unlocks, flashcard progress and statistics. " +
        "It cannot be undone. Export a save first if you might want it back.",
        () => { S.reset(); MQ.Sound.explode(); UI.go("/home"); }, "Delete everything") } })
  ]));

  function row(label, value) {
    return U.el("div", { class: "srow" }, [
      U.el("div", { class: "srow-body" }, [
        U.el("div", { style: "font-weight:700; font-size:13.5px", text: label })
      ]),
      U.el("div", { class: "tiny muted", style: "text-align:right", text: value })
    ]);
  }

  function toggleRow(title, desc, value, onChange) {
    const sw = U.el("div", { class: "switch" + (value ? " on" : "") });
    sw.addEventListener("click", () => {
      const on = !sw.classList.contains("on");
      sw.classList.toggle("on", on);
      onChange(on);
    });
    return U.el("div", { class: "srow" }, [
      U.el("div", { class: "srow-body" }, [
        U.el("div", { style: "font-weight:700; font-size:13.5px", text: title }),
        U.el("div", { class: "tiny muted", text: desc })
      ]),
      sw
    ]);
  }

  function exportSave() {
    const json = S.exportSave();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = U.el("a", { href: url, download: `mathquest-save-${U.dayKey()}.json` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    MQ.Sound.purchase();
    UI.toast({ icon: "⬇", kind: "good", text: "Save exported." });
  }

  function importSave() {
    const input = U.el("input", { type: "file", accept: "application/json,.json" });
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const r = S.importSave(String(reader.result));
        if (!r.ok) {
          MQ.Sound.denied();
          return UI.toast({ icon: "🚫", kind: "bad", ms: 4000, text: U.escapeHtml(r.error) });
        }
        /* The save is written and further writes are LATCHED OFF, so the
           reload below cannot fire pagehide → flush → overwrite-with-old-state.
           That bug made imports appear to do nothing at all. */
        MQ.Sound.rareDrop();
        UI.toast({ icon: "⬆", kind: "good", text: "Save imported — reloading…" });
        setTimeout(() => location.reload(), 700);
      };
      reader.readAsText(file);
    });
    input.click();
  }

  async function forceRefresh() {
    MQ.Sound.open();
    UI.toast({ icon: "🔄", text: "Clearing caches…" });
    S.flush();
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (e) {
      console.warn("Force refresh partially failed", e);
    }
    // A cache-busting query string, so even a stubborn HTTP cache is bypassed.
    location.replace(location.pathname + "?fresh=" + Date.now() + location.hash);
  }
};

/* ── profile sheet ────────────────────────────────────────── */
MQ.Screens.profileSheet = function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;
  const d = S.data;
  const need = S.xpNeeded(d.level);

  const nameInput = U.el("input", { class: "numin", type: "text", value: d.profile.name,
    maxlength: "18", style: "font-size:16px" });
  nameInput.addEventListener("input", () => {
    d.profile.name = nameInput.value.slice(0, 18) || "Student";
    S.save();
  });

  const owned = MQ.DATA.shop.avatars.filter(a => S.ownsAvatar(a.emoji));
  const picker = U.el("div", { class: "emoji-pick" }, MQ.DATA.shop.avatars.map(a => {
    const have = S.ownsAvatar(a.emoji);
    const btn = U.el("button", {
      class: "emoji-opt" + (d.profile.avatar === a.emoji ? " on" : "") + (have ? "" : " lock"),
      text: a.emoji, title: have ? a.name : a.name + " — locked", disabled: !have
    });
    if (have) btn.addEventListener("click", () => {
      d.profile.avatar = a.emoji;
      S.emit();
      MQ.Sound.equip();
      UI.closeModal();
      MQ.Screens.profileSheet();
    });
    return btn;
  }));

  UI.modal(U.el("div", {}, [
    U.el("h2", { text: "Your profile" }),
    U.el("div", { class: "row", style: "margin-bottom:12px" }, [
      U.el("div", { style: "font-size:38px", text: d.profile.avatar }),
      U.el("div", { style: "flex:1; min-width:0" }, [
        U.el("div", { style: "font-weight:800", text: `Level ${d.level} · ${S.levelTitle(d.level)}` }),
        U.el("div", { class: "tiny muted", text: `${d.xpIntoLevel} / ${need} XP` +
          (d.prestige ? ` · ascended ${d.prestige}× (+${d.prestige * 12}% XP)` : "") })
      ])
    ]),
    U.el("div", { class: "bar", style: "margin-bottom:16px" },
      [U.el("i", { style: `width:${U.clamp((d.xpIntoLevel / need) * 100, 0, 100)}%` })]),
    U.el("h3", { text: "Name" }),
    nameInput,
    U.el("h3", { style: "margin-top:16px", text: `Avatar (${owned.length} of ${MQ.DATA.shop.avatars.length} owned)` }),
    picker,
    U.el("div", { class: "row", style: "margin-top:16px" }, [
      U.el("button", { class: "btn btn-ghost btn-sm", text: "Shop", on: { click: () => { UI.closeModal(); UI.go("/shop"); } } }),
      U.el("div", { class: "spacer" }),
      U.el("button", { class: "btn btn-primary", text: "Done", on: { click: UI.closeModal } })
    ])
  ]));
};
