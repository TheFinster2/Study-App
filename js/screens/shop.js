/* Shop — spend Moles on lab skins, avatars, power-ups and supply crates. */
window.CHEM = window.CHEM || {};
CHEM.Screens = CHEM.Screens || {};

CHEM.Screens.shop = function (view) {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;
  const d = S.data;
  const SHOP = CHEM.DATA.shop;

  view.appendChild(U.el("h1", { text: "Supply Store" }));
  view.appendChild(U.el("p", { html:
    `You have <b>${d.coins}</b> 🪙 Moles. Earn more by answering questions, clearing dailies and unlocking achievements.` }));

  /* ── power-ups ────────────────────────────────────────── */
  view.appendChild(U.el("h2", { text: "Power-ups" }));
  view.appendChild(U.el("div", { class: "grid g3" }, SHOP.powerups.map(p => {
    const owned = d.inventory[p.id] || 0;
    return U.el("div", { class: "shop-item" }, [
      U.el("div", { class: "row" }, [
        U.el("div", { class: "shop-ico", text: p.icon }),
        U.el("span", { class: "spacer" }),
        U.el("span", { class: "chip", text: "×" + owned })
      ]),
      U.el("div", { class: "shop-name", text: p.name }),
      U.el("div", { class: "shop-desc", text: p.desc }),
      U.el("button", {
        class: "btn btn-sm " + (d.coins >= p.cost ? "btn-primary" : ""),
        text: `${p.cost} 🪙`,
        disabled: d.coins < p.cost,
        on: { click: e => buy(p.cost, () => S.grantPowerup(p.id, 1), `${p.name} added to your kit.`, e.target) }
      })
    ]);
  })));

  /* ── crates ───────────────────────────────────────────── */
  view.appendChild(U.el("h2", { text: "Supply crates" }));
  view.appendChild(U.el("div", { class: "grid g3" }, SHOP.crates.map(c => {
    const levelLocked = c.minLevel && d.level < c.minLevel;
    return U.el("div", { class: "shop-item crate" }, [
      U.el("div", { class: "crate-box", text: c.icon }),
      U.el("div", { class: "shop-name", text: c.name }),
      U.el("div", { class: "shop-desc", text: c.desc }),
      U.el("button", {
        class: "btn btn-sm " + (!levelLocked && d.coins >= c.cost ? "btn-primary" : ""),
        text: levelLocked ? `🔒 Lv ${c.minLevel}` : `${c.cost} 🪙`,
        disabled: levelLocked || d.coins < c.cost,
        on: { click: e => openCrate(c, e.target) }
      })
    ]);
  })));

  /* ── themes ───────────────────────────────────────────── */
  view.appendChild(U.el("h2", { text: "Lab skins" }));
  view.appendChild(U.el("div", { class: "grid g2" }, SHOP.themes.map(t => {
    const owned = S.ownsTheme(t.id);
    const active = d.profile.theme === t.id;
    return U.el("div", { class: "shop-item" + (owned ? " owned" : "") }, [
      U.el("div", { class: "row" }, [
        U.el("div", { class: "theme-dots" }, t.dots.map(c =>
          U.el("div", { class: "theme-dot", style: "background:" + c }))),
        U.el("span", { class: "spacer" }),
        active ? U.el("span", { class: "chip on", text: "Active" }) : null
      ]),
      U.el("div", { class: "shop-name", text: t.name }),
      U.el("div", { class: "shop-desc", text: t.desc }),
      owned
        ? U.el("button", {
            class: "btn btn-sm" + (active ? "" : " btn-primary"),
            text: active ? "In use" : "Equip", disabled: active,
            on: { click: () => { UI.applyTheme(t.id); CHEM.Sound.equip(); UI.handleRoute(); } }
          })
        : U.el("button", {
            class: "btn btn-sm " + (!(t.minLevel && d.level < t.minLevel) && d.coins >= t.cost ? "btn-primary" : ""),
            text: (t.minLevel && d.level < t.minLevel) ? `🔒 Lv ${t.minLevel}` : `${t.cost} 🪙`,
            disabled: (t.minLevel && d.level < t.minLevel) || d.coins < t.cost,
            on: { click: e => buy(t.cost, () => {
              d.owned.themes.push(t.id);
              UI.applyTheme(t.id);
            }, `${t.name} unlocked and equipped.`, e.target) }
          })
    ]);
  })));

  /* ── avatars ──────────────────────────────────────────── */
  view.appendChild(U.el("h2", { text: "Avatars" }));
  view.appendChild(U.el("div", { class: "grid g4" }, SHOP.avatars.map(a => {
    const owned = S.ownsAvatar(a.emoji);
    const active = d.profile.avatar === a.emoji;
    const levelLocked = a.minLevel && d.level < a.minLevel;
    return U.el("div", { class: "shop-item" + (owned ? " owned" : "") }, [
      U.el("div", { class: "shop-ico", style: "text-align:center; font-size:36px", text: a.emoji }),
      U.el("div", { class: "shop-name", style: "text-align:center", text: a.name }),
      a.note ? U.el("div", { class: "shop-desc", style: "text-align:center", text: a.note }) : null,
      owned
        ? U.el("button", {
            class: "btn btn-sm" + (active ? "" : " btn-primary"),
            text: active ? "Worn" : "Wear", disabled: active,
            on: { click: () => {
              d.profile.avatar = a.emoji;
              S.emit();
              CHEM.Sound.equip();
              UI.handleRoute();
            } }
          })
        : U.el("button", {
            class: "btn btn-sm " + (!levelLocked && d.coins >= a.cost ? "btn-primary" : ""),
            text: levelLocked ? `🔒 Lv ${a.minLevel}` : `${a.cost} 🪙`,
            disabled: levelLocked || d.coins < a.cost,
            on: { click: e => buy(a.cost, () => {
              d.owned.avatars.push(a.emoji);
              d.profile.avatar = a.emoji;
            }, `${a.name} equipped.`, e.target) }
          })
    ]);
  })));

  /* ── helpers ──────────────────────────────────────────── */
  function buy(cost, apply, message, node) {
    if (!S.spendCoins(cost)) {
      CHEM.Sound.denied();
      UI.toast({ icon: "🪙", kind: "bad", text: "Not enough Moles." });
      return;
    }
    apply();
    S.emit();
    CHEM.Sound.purchase();
    if (node) CHEM.FX.burstAt(node, { count: 24, speed: 5, size: 4 });
    UI.toast({ icon: "✅", kind: "good", text: message });
    S.checkAchievements();
    UI.handleRoute();
  }

  function openCrate(crate, node) {
    if (!S.spendCoins(crate.cost)) {
      CHEM.Sound.denied();
      UI.toast({ icon: "🪙", kind: "bad", text: "Not enough Moles." });
      return;
    }
    CHEM.Sound.open();
    if (node) CHEM.FX.burstAt(node, { count: 50, speed: 8, size: 5 });

    const tier = { crate_s: 0, crate_l: 1, crate_x: 2 }[crate.id] || 0;
    const counts = [[1, 2], [3, 5], [6, 9]][tier];
    const payout = [[80, 340], [260, 900], [900, 2600]][tier];
    const avatarChance = [0, 0.22, 0.55][tier];

    const drops = [];
    for (let i = 0; i < U.randInt(counts[0], counts[1]); i++) {
      const p = U.pick(SHOP.powerups);
      S.grantPowerup(p.id, 1);
      drops.push(`${p.icon} ${p.name}`);
    }
    const coinDrop = U.randInt(payout[0], payout[1]);
    S.addCoins(coinDrop, true);
    drops.push(`🪙 ${coinDrop} Moles`);

    // Only avatars the player has actually earned the level for can drop.
    if (Math.random() < avatarChance) {
      const locked = SHOP.avatars.filter(a =>
        !S.ownsAvatar(a.emoji) && (!a.minLevel || d.level >= a.minLevel));
      if (locked.length) {
        const a = U.pick(locked);
        d.owned.avatars.push(a.emoji);
        drops.push(`${a.emoji} ${a.name} avatar`);
      }
    }

    S.emit();
    CHEM.FX.confetti(80);
    if (drops.some(t => t.includes("avatar"))) CHEM.Sound.rareDrop();
    else CHEM.Sound.coinPile();

    const box = U.el("div", { class: "modal-center" }, [
      U.el("div", { class: "modal-big", text: crate.icon }),
      U.el("h2", { text: "Crate opened!", style: "justify-content:center" }),
      U.el("div", { class: "grid", style: "margin:14px 0" },
        drops.map(t => U.el("div", { class: "card", style: "padding:10px", text: t }))),
      U.el("button", {
        class: "btn btn-primary btn-block", text: "Nice",
        on: { click: () => { UI.closeModal(); UI.handleRoute(); } }
      })
    ]);
    UI.modal(box, { sticky: true });
  }
};
