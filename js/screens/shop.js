/* Shop — power-ups, themes, avatars and supply crates. */
window.MQ = window.MQ || {};
MQ.Screens = MQ.Screens || {};

MQ.Screens.shop = function (view) {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;
  const shop = MQ.DATA.shop;
  const d = S.data;

  view.appendChild(U.el("h1", { text: "Shop" }));
  view.appendChild(U.el("p", { html:
    `You have <b>${d.coins.toLocaleString()}</b> 🔢 Primes. ` +
    "Primes come from answering questions — the payout is deliberately scarce, so the good items are a goal." }));

  /* ── power-ups ── */
  view.appendChild(U.el("h2", { text: "Power-ups" }));
  const puGrid = U.el("div", { class: "grid g3" });
  shop.powerups.forEach(p => {
    const owned = d.inventory[p.id] || 0;
    const afford = d.coins >= p.cost;
    puGrid.appendChild(U.el("div", { class: "shop-item" }, [
      U.el("div", { class: "row" }, [
        U.el("div", { class: "shop-ico", text: p.icon }),
        U.el("div", { class: "spacer" }),
        U.el("span", { class: "chip" + (owned ? " on" : ""), text: "×" + owned })
      ]),
      U.el("div", { class: "shop-name", text: p.name }),
      U.el("div", { class: "shop-desc", text: p.desc }),
      U.el("button", {
        class: "btn btn-sm " + (afford ? "btn-primary" : ""), disabled: !afford,
        text: p.cost + " 🔢",
        on: { click: () => buy(p.cost, () => {
          S.grantPowerup(p.id, 1);
          UI.toast({ icon: p.icon, kind: "good", text: `<b>${U.escapeHtml(p.name)}</b> purchased.` });
        }) }
      })
    ]));
  });
  view.appendChild(puGrid);

  /* ── crates ── */
  view.appendChild(U.el("h2", {}, [
    document.createTextNode("Supply crates"),
    U.el("span", { class: "h2-sub", text: "randomised contents" })
  ]));
  const crateGrid = U.el("div", { class: "grid g3" });
  shop.crates.forEach(c => {
    const locked = c.minLevel && d.level < c.minLevel;
    const afford = d.coins >= c.cost && !locked;
    crateGrid.appendChild(U.el("div", { class: "shop-item crate" }, [
      U.el("div", { class: "crate-box", text: c.icon }),
      U.el("div", { class: "shop-name", text: c.name }),
      U.el("div", { class: "shop-desc", text: c.desc }),
      U.el("button", {
        class: "btn btn-sm " + (afford ? "btn-primary" : ""), disabled: !afford,
        text: locked ? "🔒 Lv " + c.minLevel : c.cost + " 🔢",
        on: { click: () => buy(c.cost, () => openCrate(c)) }
      })
    ]));
  });
  view.appendChild(crateGrid);

  /* ── themes ── */
  view.appendChild(U.el("h2", { text: "Themes" }));
  const themeGrid = U.el("div", { class: "grid g3" });
  shop.themes.forEach(t => {
    const owned = S.ownsTheme(t.id);
    const active = d.profile.theme === t.id;
    const locked = t.minLevel && d.level < t.minLevel;
    const afford = d.coins >= t.cost && !locked;
    themeGrid.appendChild(U.el("div", { class: "shop-item" + (owned ? " owned" : "") }, [
      U.el("div", { class: "theme-dots" }, t.dots.map(c =>
        U.el("div", { class: "theme-dot", style: "background:" + c }))),
      U.el("div", { class: "shop-name", text: t.name }),
      U.el("div", { class: "shop-desc", text: t.desc }),
      owned
        ? U.el("button", {
            class: "btn btn-sm" + (active ? "" : " btn-primary"), disabled: active,
            text: active ? "Active" : "Equip",
            on: { click: () => { UI.applyTheme(t.id); MQ.Sound.equip(); UI.handleRoute(); } }
          })
        : U.el("button", {
            class: "btn btn-sm " + (afford ? "btn-primary" : ""), disabled: !afford,
            text: locked ? "🔒 Lv " + t.minLevel : t.cost + " 🔢",
            on: { click: () => buy(t.cost, () => {
              d.owned.themes.push(t.id);
              UI.applyTheme(t.id);
              MQ.Sound.unlock();
              MQ.FX.confetti(80);
              UI.toast({ icon: "🎨", kind: "good", text: `<b>${U.escapeHtml(t.name)}</b> unlocked and equipped.` });
            }) }
          })
    ]));
  });
  view.appendChild(themeGrid);

  /* ── avatars ── */
  view.appendChild(U.el("h2", { text: "Avatars" }));
  const avGrid = U.el("div", { class: "grid g4" });
  shop.avatars.forEach(a => {
    const owned = S.ownsAvatar(a.emoji);
    const active = d.profile.avatar === a.emoji;
    const locked = a.minLevel && d.level < a.minLevel;
    const afford = d.coins >= a.cost && !locked;
    avGrid.appendChild(U.el("div", { class: "shop-item" + (owned ? " owned" : "") }, [
      U.el("div", { class: "shop-ico", style: "text-align:center", text: a.emoji }),
      U.el("div", { class: "shop-name", style: "text-align:center", text: a.name }),
      a.note ? U.el("div", { class: "shop-desc", style: "text-align:center", text: a.note }) : null,
      owned
        ? U.el("button", {
            class: "btn btn-sm" + (active ? "" : " btn-primary"), disabled: active,
            text: active ? "Worn" : "Wear",
            on: { click: () => {
              d.profile.avatar = a.emoji;
              S.emit();
              MQ.Sound.equip();
              UI.handleRoute();
            } }
          })
        : U.el("button", {
            class: "btn btn-sm " + (afford ? "btn-primary" : ""), disabled: !afford,
            text: locked ? "🔒 Lv " + a.minLevel : a.cost + " 🔢",
            on: { click: () => buy(a.cost, () => {
              d.owned.avatars.push(a.emoji);
              d.profile.avatar = a.emoji;
              S.emit();
              MQ.Sound.unlock();
              UI.toast({ icon: a.emoji, kind: "good", text: `<b>${U.escapeHtml(a.name)}</b> unlocked.` });
            }) }
          })
    ]));
  });
  view.appendChild(avGrid);

  /** Spend, then run the effect. Purchases are asserted by `spendCoins`
      returning true — never by "coins went down", which stops being true the
      moment an achievement pays out mid-purchase. */
  function buy(cost, effect) {
    if (!S.spendCoins(cost)) {
      MQ.Sound.denied();
      return UI.toast({ icon: "🚫", kind: "bad", text: "Not enough Primes." });
    }
    MQ.Sound.purchase();
    effect();
    S.checkAchievements();
    UI.handleRoute();
  }

  function openCrate(crate) {
    const tiers = { crate_s: [1, 2, 120], crate_l: [3, 5, 400], crate_x: [6, 9, 1100] };
    const [lo, hi, coinBase] = tiers[crate.id] || [1, 2, 100];
    const n = U.randInt(lo, hi);
    const ids = MQ.DATA.shop.powerups.map(p => p.id).filter(id => id !== "revive");
    const got = {};
    for (let i = 0; i < n; i++) {
      const id = U.pick(ids);
      got[id] = (got[id] || 0) + 1;
      S.grantPowerup(id, 1);
    }
    const coins = U.randInt(Math.round(coinBase * 0.6), Math.round(coinBase * 1.6));
    S.addCoins(coins, true);

    // A chance at a locked avatar — the only way the expensive ones arrive early.
    let avatar = null;
    const chance = { crate_s: 0.04, crate_l: 0.16, crate_x: 0.4 }[crate.id] || 0;
    if (Math.random() < chance) {
      const locked = MQ.DATA.shop.avatars.filter(a => !S.ownsAvatar(a.emoji));
      if (locked.length) {
        avatar = U.pick(locked);
        S.data.owned.avatars.push(avatar.emoji);
      }
    }
    S.emit();

    MQ.Sound.open();
    setTimeout(() => (avatar ? MQ.Sound.rareDrop() : MQ.Sound.coinPile()), 350);
    MQ.FX.confetti(avatar ? 160 : 80);

    UI.modal(U.el("div", { class: "modal-center" }, [
      U.el("div", { class: "modal-big", text: crate.icon }),
      U.el("h2", { style: "justify-content:center", text: crate.name + " opened" }),
      U.el("div", { class: "grid", style: "text-align:left; margin:14px 0" },
        Object.entries(got).map(([id, count]) => {
          const p = MQ.DATA.shop.powerups.find(x => x.id === id);
          return U.el("div", { class: "row" }, [
            U.el("div", { style: "font-size:20px", text: p.icon }),
            U.el("div", { style: "font-weight:700", text: p.name }),
            U.el("div", { class: "spacer" }),
            U.el("div", { class: "chip on", text: "×" + count })
          ]);
        }).concat([
          U.el("div", { class: "row" }, [
            U.el("div", { style: "font-size:20px", text: "🔢" }),
            U.el("div", { style: "font-weight:700", text: "Primes" }),
            U.el("div", { class: "spacer" }),
            U.el("div", { class: "chip on", text: "+" + coins })
          ])
        ]).concat(avatar ? [
          U.el("div", { class: "row" }, [
            U.el("div", { style: "font-size:20px", text: avatar.emoji }),
            U.el("div", { style: "font-weight:700", text: avatar.name }),
            U.el("div", { class: "spacer" }),
            U.el("div", { class: "chip on", text: "RARE" })
          ])
        ] : [])),
      U.el("button", { class: "btn btn-primary btn-block", text: "Nice",
        on: { click: () => { UI.closeModal(); UI.handleRoute(); } } })
    ]), { sticky: true });
  }
};
