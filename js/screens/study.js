/* Study — Leitner flashcards and a quick-reference data sheet. */
window.CHEM = window.CHEM || {};
CHEM.Screens = CHEM.Screens || {};

CHEM.Screens.study = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  function screen(view, args) {
    const tab = args[0] || "cards";

    view.appendChild(U.el("h1", { text: "Study" }));
    const tabs = U.el("div", { class: "row", style: "margin-bottom:14px" }, [
      tabBtn("Flashcards", "cards", tab),
      tabBtn("Reference", "ref", tab)
    ]);
    view.appendChild(tabs);

    if (tab === "ref") reference(view);
    else cards(view);
  }

  function tabBtn(label, id, active) {
    return U.el("button", {
      class: "chip chip-btn" + (active === id ? " on" : ""),
      text: label,
      on: { click: () => UI.go("/study/" + id) }
    });
  }

  /* ── flashcards ─────────────────────────────────────────── */
  function cards(view) {
    const due = S.dueCards();
    const total = CHEM.Bank.activeCards().length;
    const mastered = Object.values(S.data.srs).filter(c => c.box >= 5).length;

    view.appendChild(U.el("div", { class: "grid g3" }, [
      stat(due.length, "Due now"), stat(mastered, "Mastered"), stat(total, "Total cards")
    ]));

    if (!due.length) {
      view.appendChild(U.el("div", { class: "empty" }, [
        U.el("div", { class: "empty-ico", text: "☕" }),
        U.el("h3", { text: "All caught up" }),
        U.el("p", { text: "No cards are due. Spaced repetition brings them back automatically — come back tomorrow, or drill the full deck anyway." }),
        U.el("button", {
          class: "btn btn-primary", text: "Review the whole deck",
          on: { click: () => session(view, U.shuffle(CHEM.Bank.activeCards()).slice(0, 20), true) }
        })
      ]));
      return;
    }

    view.appendChild(U.el("div", { class: "card", style: "margin-top:14px" }, [
      U.el("h3", { text: `${due.length} card${due.length === 1 ? "" : "s"} ready` }),
      U.el("p", { class: "tiny muted", text:
        "Cards move up a box each time you recall them and reset to box 1 when you miss. " +
        "Box 5 cards return every 16 days." }),
      U.el("button", {
        class: "btn btn-primary btn-block", text: "Start review",
        on: { click: () => session(view, U.shuffle(due).slice(0, 20), false) }
      })
    ]));

    /* deck breakdown by module */
    const byMod = {};
    CHEM.Bank.activeCards().forEach(c => {
      const b = (S.data.srs[c.id] || {}).box || 0;
      const m = byMod[c.mod] || (byMod[c.mod] = { total: 0, done: 0 });
      m.total++;
      if (b >= 5) m.done++;
    });

    view.appendChild(U.el("h2", { text: "Deck progress" }));
    const list = U.el("div", { class: "card" });
    Object.entries(byMod).sort().forEach(([mod, m]) => {
      list.appendChild(U.el("div", { class: "mastery-item" }, [
        U.el("div", { class: "mastery-badge", text: mod }),
        U.el("div", { class: "mastery-body" }, [
          U.el("div", { class: "mastery-name", text: CHEM.Bank.moduleName(mod) }),
          U.el("div", { class: "bar" }, [U.el("i", { style: `width:${U.pct(m.done, m.total)}%` })])
        ]),
        U.el("div", { class: "mastery-pct", text: `${m.done}/${m.total}` })
      ]));
    });
    view.appendChild(list);
  }

  function stat(n, l) {
    return U.el("div", { class: "card stat-tile" }, [
      U.el("div", { class: "stat-num", text: String(n) }),
      U.el("div", { class: "stat-lbl", text: l })
    ]);
  }

  function session(view, deck, freeReview) {
    S.markMode("flashcards");
    S.touchStreak();

    let i = 0, got = 0, missed = 0, xp = 0, paid = 0;
    view.innerHTML = "";

    const shell = UI.gameShell("Flashcards", { backTo: "/study" });
    view.appendChild(shell.root);
    const progChip = UI.chip(`1 / ${deck.length}`);
    shell.meta.appendChild(progChip);

    const stage = U.el("div", { class: "grid" });
    shell.body.appendChild(stage);

    function render() {
      const card = deck[i];
      const st = S.cardState(card.id);
      progChip.textContent = `${i + 1} / ${deck.length}`;
      stage.innerHTML = "";

      const inner = U.el("div", { class: "fcard-inner" }, [
        U.el("div", { class: "fface" }, [
          U.el("div", { class: "chip", text: CHEM.Bank.moduleName(card.mod) }),
          U.el("div", { class: "fq", html: U.formula(card.front) }),
          U.el("div", { class: "fhint", text: "Tap to reveal" })
        ]),
        U.el("div", { class: "fface fface-b" }, [
          U.el("div", { class: "fa", html: U.formula(card.back) })
        ])
      ]);
      const flipper = U.el("div", { class: "fcard" }, [inner]);
      stage.appendChild(flipper);

      const boxes = U.el("div", { class: "leitner" },
        [1, 2, 3, 4, 5].map(b => U.el("div", { class: "lbox" + (b === st.box ? " on" : ""), text: String(b) })));
      stage.appendChild(boxes);

      const rate = U.el("div", { class: "row", style: "justify-content:center; visibility:hidden" }, [
        U.el("button", { class: "btn", text: "😖 Missed it", on: { click: () => grade(false) } }),
        U.el("button", { class: "btn btn-primary", text: "✅ Got it", on: { click: () => grade(true) } })
      ]);
      stage.appendChild(rate);

      let revealed = false;
      const shownAt = performance.now();
      flipper.addEventListener("click", () => {
        revealed = !revealed;
        flipper.classList.toggle("flip", revealed);
        CHEM.Sound.flip();
        rate.style.visibility = revealed ? "visible" : "hidden";
      });

      function grade(ok) {
        /* Only pay for a card that was genuinely due, hasn't already paid today,
           and was actually on screen long enough to read. Self-grading can't be
           verified, so these three limits are what stop "Got it" spam. */
        const readLongEnough = performance.now() - shownAt >= UI.MIN_READ_MS;
        const payable = !freeReview && readLongEnough && S.cardXpEligible(card.id);
        if (!freeReview) { S.reviewCard(card.id, ok); if (payable) S.markCardXp(card.id); }
        if (ok) {
          got++;
          if (payable) { xp += 12; paid++; }
          CHEM.Sound.correct();
          CHEM.FX.burstAt(flipper, { count: 18, speed: 4, size: 3, shape: "circle" });
        } else {
          // Nothing for a miss — a self-reported failure shouldn't pay out.
          missed++;
          CHEM.Sound.wrong();
        }

        i++;
        if (i >= deck.length) return finish();
        render();
      }
    }

    function finish() {
      const earned = UI.award({
        xp, coins: paid * 2, bonus: S.streakBonus(),
        // Self-reported "Got it" is always 100%, so gate the bonus on cards that
        // actually qualified for payment instead.
        accuracy: deck.length ? paid / deck.length : 0
      });
      UI.results({
        title: "Review complete",
        correct: got, total: deck.length, xp: earned.xp, coins: earned.coins,
        extraStats: [["Missed", missed], ["Cards paid", paid]],
        onAgain: () => UI.go("/study")
      });
    }

    render();
  }

  /* ── reference sheet ────────────────────────────────────── */
  function reference(view, opts) {
    const D = CHEM.DATA;

    // Also rendered inside the in-game tool tray, where the intro line is just noise.
    if (!(opts && opts.compact)) view.appendChild(U.el("p", { text:
      "The tables you're expected to know or be handed. Skim these before a boss fight." }));

    view.appendChild(section("🔥 Flame test colours", table(
      ["Cation", "Flame colour"],
      D.flameTests.map(f => [U.formula(f.cation), f.colour])
    )));

    view.appendChild(section("🧫 Reaction with NaOH", table(
      ["Cation", "Observation"],
      D.hydroxideTests.map(f => [U.formula(f.cation), f.obs])
    )));

    view.appendChild(section("🌧️ Solubility rules", solubilityTable()));

    view.appendChild(section("🧪 Acid strengths (Ka / pKa)", table(
      ["Acid", "Ka", "pKa", "Note"],
      D.acidStrengths.map(a => [
        a.acid,
        typeof a.ka === "number" ? a.ka.toExponential(1) : a.ka,
        a.pka === null ? "—" : a.pka.toFixed(2),
        a.note
      ])
    )));

    view.appendChild(section("🎨 Indicators", table(
      ["Indicator", "pH range", "Acid", "Base", "Best for"],
      D.indicators.map(i => [i.name, i.range, i.acid, i.base, i.use])
    )));

    view.appendChild(section("🧭 Polyatomic ions", table(
      ["Name", "Formula", "Charge"],
      D.ions.filter(i => i.tier === 1).map(i => [i.name, U.formula(i.formula), i.charge > 0 ? "+" + i.charge : String(i.charge)])
    )));

    view.appendChild(section("📐 Formula sheet", U.el("div", { class: "grid g2" }, [
      refCard("Quantities", ["n = m / M", "n = c × V", "n = V / Vₘ  (Vₘ = 24.79 L mol⁻¹ at 25 °C, 100 kPa)", "N = n × 6.022 × 10²³"]),
      refCard("Solutions", ["c₁V₁ = c₂V₂", "ppm = mg L⁻¹", "% yield = actual / theoretical × 100"]),
      refCard("Acids & bases", ["pH = −log[H₃O⁺]", "pOH = −log[OH⁻]", "Kw = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴", "pH + pOH = 14", "[H₃O⁺] ≈ √(Ka × c)"]),
      refCard("Energy", ["q = mcΔT", "ΔH = −q / n", "ΔG = ΔH − TΔS", "c(water) = 4.18 J g⁻¹ K⁻¹"]),
      refCard("Gases", ["PV = nRT, R = 8.314 J K⁻¹ mol⁻¹", "P₁V₁/T₁ = P₂V₂/T₂", "T(K) = °C + 273.15"]),
      refCard("Equilibrium", ["K = [products]ᶜ / [reactants]ᵃ", "Q < K → shifts right", "Ksp = [Aⁿ⁺]ˣ[Bᵐ⁻]ʸ", "K depends only on temperature"])
    ])));
  }

  function refCard(title, lines) {
    return U.el("div", { class: "card" }, [
      U.el("h3", { text: title }),
      U.el("div", {}, lines.map(l => U.el("div", { class: "mono tiny", style: "padding:4px 0; color:var(--ink-dim)", html: U.formula(l) })))
    ]);
  }

  function section(title, body) {
    const wrap = U.el("div");
    wrap.appendChild(U.el("h2", { text: title }));
    wrap.appendChild(U.el("div", { class: "card", style: "overflow-x:auto" }, [body]));
    return wrap;
  }

  function table(headers, rows) {
    const t = U.el("table", { class: "ptable", style: "min-width:100%" });
    t.appendChild(U.el("tr", {}, headers.map(h => U.el("th", { text: h, style: "text-align:left" }))));
    rows.forEach(r => {
      t.appendChild(U.el("tr", {}, r.map(cell =>
        U.el("td", { style: "padding:7px 6px; border-top:1px solid var(--line); font-size:12.5px", html: String(cell) })
      )));
    });
    return t;
  }

  function solubilityTable() {
    const SOL = CHEM.DATA.solubility;
    const t = U.el("table", { class: "ptable", style: "min-width:100%" });
    t.appendChild(U.el("tr", {}, [U.el("th", { text: "" })].concat(
      SOL.anions.map(a => U.el("th", { html: U.formula(a.sym) }))
    )));
    SOL.cations.forEach(ct => {
      t.appendChild(U.el("tr", {}, [U.el("th", { html: U.formula(ct.sym), style: "text-align:left" })].concat(
        SOL.anions.map(an => {
          const sol = SOL.grid[ct.sym][an.sym];
          return U.el("td", {}, [U.el("div", {
            class: "pcell " + (sol ? "sol" : "ppt"),
            style: "cursor:default",
            text: sol ? "sol" : "ppt"
          })]);
        })
      )));
    });
    return t;
  }

  return { screen, reference };
})();
