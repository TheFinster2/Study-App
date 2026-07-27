/* Titration Lab — a simulated volumetric analysis.
   pH is modelled properly (strong/strong and weak/strong), the indicator changes
   colour over its real range, and the player must stop on the end point and then
   calculate the unknown concentration. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.titration = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;
  const KW = 1e-14;

  const SCENARIOS = [
    { id: "sasb", name: "Strong acid ↔ strong base",
      analyte: "HCl", titrant: "NaOH", weak: false, ka: null,
      indicator: "Bromothymol blue", lo: 6.0, hi: 7.6,
      loColour: "#f5e04a", hiColour: "#3d7dd8",
      note: "Equivalence at pH 7 — bromothymol blue straddles it neatly." },
    { id: "wasb", name: "Weak acid ↔ strong base",
      analyte: "CH₃COOH", titrant: "NaOH", weak: true, ka: 1.8e-5,
      indicator: "Phenolphthalein", lo: 8.3, hi: 10.0,
      loColour: "rgba(255,255,255,0.10)", hiColour: "#ff5aa0",
      note: "The salt hydrolyses, so equivalence sits above pH 7." },
    { id: "wasb2", name: "Weak acid ↔ strong base",
      analyte: "HCOOH", titrant: "KOH", weak: true, ka: 1.8e-4,
      indicator: "Phenolphthalein", lo: 8.3, hi: 10.0,
      loColour: "rgba(255,255,255,0.10)", hiColour: "#ff5aa0",
      note: "Methanoic acid is stronger than ethanoic — a shorter buffer region." }
  ];

  /** pH of the flask after adding vb mL of titrant. */
  function pHat(sc, ca, va, cb, vb) {
    const nA = ca * (va / 1000);
    const nB = cb * (vb / 1000);
    const vTot = (va + vb) / 1000;

    if (!sc.weak) {
      if (Math.abs(nA - nB) < 1e-12) return 7;
      if (nA > nB) return -Math.log10((nA - nB) / vTot);
      return 14 + Math.log10((nB - nA) / vTot);
    }

    const pKa = -Math.log10(sc.ka);
    if (nB <= 0) return -Math.log10(Math.sqrt(sc.ka * ca));
    if (nB < nA) {
      // Henderson–Hasselbalch through the buffer region.
      return pKa + Math.log10(nB / (nA - nB));
    }
    if (Math.abs(nA - nB) < 1e-12) {
      const cs = nA / vTot;
      const kb = KW / sc.ka;
      return 14 + Math.log10(Math.sqrt(kb * cs));
    }
    return 14 + Math.log10((nB - nA) / vTot);
  }

  /** Blend the indicator colour across its transition range. */
  function indicatorColour(sc, pH) {
    if (pH <= sc.lo) return sc.loColour;
    if (pH >= sc.hi) return sc.hiColour;
    const t = (pH - sc.lo) / (sc.hi - sc.lo);
    return `color-mix(in srgb, ${sc.hiColour} ${Math.round(t * 100)}%, ${sc.loColour})`;
  }

  function start(root) {
    S.markMode("titration");
    S.touchStreak();

    const sc = U.pick(SCENARIOS);
    const va = 25.00;
    const ca = parseFloat((0.05 + Math.random() * 0.15).toFixed(4)); // unknown analyte
    const cb = U.pick([0.1000, 0.1050, 0.0500, 0.2000]);             // standardised titrant
    const vEq = (ca * va) / cb;                                       // true equivalence volume

    let vb = 0, meterOn = false, ended = false, finished = false;
    let usedMeter = false;

    const shell = UI.gameShell("Titration Lab", { confirmExit: true });
    root.appendChild(shell.root);
    const volChip = UI.chip("0.00 mL");
    shell.meta.appendChild(volChip);

    const brief = U.el("div", { class: "qcard" }, [
      U.el("div", { class: "qtag" }, [
        UI.chip("Module 6 · Volumetric analysis"), UI.chip(sc.name), UI.chip(sc.indicator)
      ]),
      U.el("p", { html:
        `A <b>${va.toFixed(2)} mL</b> aliquot of ${sc.analyte} of <b>unknown</b> concentration is in the conical flask with ` +
        `${sc.indicator} indicator. The burette contains standardised <b>${cb.toFixed(4)} mol L⁻¹ ${sc.titrant}</b>. ` +
        `Add titrant until the indicator changes colour permanently, then declare the end point.` }),
      U.el("p", { class: "tiny muted", text: sc.note })
    ]);
    shell.body.appendChild(brief);

    /* apparatus */
    const buretFill = U.el("i");
    const buret = U.el("div", { class: "buret" }, [buretFill]);
    const flaskLiq = U.el("div", { class: "flask-liq" });
    const flask = U.el("div", { class: "flask" }, [
      U.el("div", { class: "flask-neck" }),
      U.el("div", { class: "flask-body" }, [flaskLiq])
    ]);
    const readout = U.el("div", { class: "ph-readout", text: "—" });

    const lab = U.el("div", { class: "qcard" }, [
      U.el("div", { class: "buret-wrap" }, [buret, flask]),
      readout,
      U.el("div", { class: "muted tiny", style: "text-align:center", text: "Volume delivered" })
    ]);
    shell.body.appendChild(lab);

    const controls = U.el("div", { class: "row" }, [
      U.el("button", { class: "btn", text: "+5.00 mL", on: { click: () => add(5) } }),
      U.el("button", { class: "btn", text: "+1.00 mL", on: { click: () => add(1) } }),
      U.el("button", { class: "btn", text: "+0.10 mL", on: { click: () => add(0.1) } }),
      U.el("button", { class: "btn", text: "+1 drop (0.05 mL)", on: { click: () => add(0.05) } })
    ]);
    shell.body.appendChild(controls);

    const meterBtn = U.el("button", {
      class: "btn btn-sm btn-ghost", text: "🔌 Connect pH meter (−30% XP)",
      on: { click: () => {
        meterOn = !meterOn;
        usedMeter = true;
        meterBtn.textContent = meterOn ? "🔌 pH meter on (−30% XP)" : "🔌 Connect pH meter (−30% XP)";
        paint();
      } }
    });
    const endBtn = U.el("button", {
      class: "btn btn-primary", text: "Declare end point",
      on: { click: declare }
    });
    shell.body.appendChild(U.el("div", { class: "row" }, [meterBtn, U.el("div", { class: "spacer" }), endBtn]));

    const resultSlot = U.el("div");
    shell.body.appendChild(resultSlot);

    function add(ml) {
      if (ended) return;
      vb = parseFloat((vb + ml).toFixed(2));
      if (vb > 60) vb = 60;
      CHEM.Sound.drop();
      paint();
    }

    function paint() {
      const pH = pHat(sc, ca, va, cb, vb);
      volChip.textContent = vb.toFixed(2) + " mL";
      // The burette starts full at 50.00 mL and empties as titrant is delivered.
      buretFill.style.height = U.clamp((1 - vb / 50) * 100, 0, 100) + "%";
      flaskLiq.style.background = indicatorColour(sc, pH);
      readout.textContent = meterOn ? "pH " + pH.toFixed(2) : vb.toFixed(2) + " mL";
    }
    paint();

    function declare() {
      if (ended) return;
      ended = true;
      controls.querySelectorAll("button").forEach(b => (b.disabled = true));
      endBtn.disabled = true;

      const error = Math.abs(vb - vEq);
      const perfect = error <= 0.05;
      const good = error <= 0.15;
      const ok = error <= 0.50;

      if (perfect) { CHEM.Sound.win(); CHEM.FX.bubbles(window.innerWidth / 2, window.innerHeight / 2); }
      else if (ok) CHEM.Sound.correct();
      else { CHEM.Sound.wrong(); CHEM.FX.shake(); }

      resultSlot.innerHTML = "";
      resultSlot.appendChild(U.el("div", { class: "feedback " + (ok ? "ok" : "no"), html:
        `<b>End point recorded at ${vb.toFixed(2)} mL.</b> The true equivalence volume was ` +
        `${vEq.toFixed(2)} mL — you were out by ${error.toFixed(2)} mL. ` +
        (perfect ? "That is within one drop. Textbook technique." :
         good ? "Well within normal titration tolerance." :
         ok ? "Acceptable, but a real titration would want closer than this." :
         "Overshooting like this is the most common source of titration error.") }));

      askCalculation(error, perfect, good, ok);
    }

    function askCalculation(error, perfect, good, ok) {
      const input = U.el("input", {
        class: "numin", type: "text", inputmode: "decimal", placeholder: "mol L⁻¹"
      });
      const card = U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtext", html:
          `Now calculate: using <b>your</b> titre of ${vb.toFixed(2)} mL of ${cb.toFixed(4)} mol L⁻¹ ${sc.titrant}, ` +
          `what is the concentration of the ${va.toFixed(2)} mL ${sc.analyte} aliquot? (1 : 1 stoichiometry)` }),
        U.el("div", { style: "margin-top:16px" }, [input]),
        U.el("div", { class: "unit-hint", text: "Answer in mol L⁻¹, 4 significant figures" })
      ]);
      const submit = U.el("button", { class: "btn btn-primary btn-block", text: "Submit calculation" });
      card.appendChild(U.el("div", { style: "margin-top:14px" }, [submit]));
      resultSlot.appendChild(card);
      input.focus();

      const expected = (cb * vb) / va; // graded against their own titre, as in a real prac
      let done = false;

      function submitAnswer() {
        if (done || !input.value.trim()) return;
        done = true;
        input.disabled = true;
        submit.disabled = true;

        const calcOk = U.numClose(input.value, expected, 0.02);
        S.recordAnswer("M6", calcOk, null);
        if (calcOk) CHEM.Sound.correct(); else CHEM.Sound.wrong();

        card.appendChild(U.el("div", { class: "feedback " + (calcOk ? "ok" : "no"), html:
          `<b>${calcOk ? "Correct." : "Answer: " + U.sigFig(expected, 4) + " mol L⁻¹"}</b><br>` +
          `n(${sc.titrant}) = ${cb} × ${(vb / 1000).toFixed(5)} L = ${(cb * vb / 1000).toExponential(3)} mol. ` +
          `Same number of moles of ${sc.analyte} in ${(va / 1000).toFixed(5)} L → ` +
          `c = ${U.sigFig(expected, 4)} mol L⁻¹. (True value: ${ca.toFixed(4)} mol L⁻¹.)` }));

        finish(error, perfect, good, ok, calcOk);
      }

      submit.addEventListener("click", submitAnswer);
      input.addEventListener("keydown", e => { if (e.key === "Enter") submitAnswer(); });
    }

    function finish(error, perfect, good, ok, calcOk) {
      if (finished) return;
      finished = true;

      let xp = 0;
      if (perfect) xp = 220; else if (good) xp = 160; else if (ok) xp = 100; else xp = 40;
      if (calcOk) xp += 90;
      if (usedMeter) xp = Math.round(xp * 0.7);
      xp += S.streakBonus();

      const coins = (perfect ? 90 : good ? 60 : ok ? 35 : 10) + (calcOk ? 30 : 0);

      if (ok) S.bump("titrations");
      if (perfect) S.bump("perfectTitrations");
      S.progressDaily("titration", 1);
      const newBest = S.recordScore("titration", Math.round(100 - Math.min(100, error * 100)));

      UI.award({ xp, coins });
      UI.results({
        title: perfect ? "Perfect titration" : ok ? "Titration complete" : "Overshot",
        correct: (ok ? 1 : 0) + (calcOk ? 1 : 0), total: 2, xp, coins, newBest,
        extraStats: [
          ["Titre", vb.toFixed(2) + " mL"],
          ["Error", error.toFixed(2) + " mL"],
          ["pH meter", usedMeter ? "used" : "no"]
        ],
        onAgain: () => UI.handleRoute()
      });
    }
  }

  return { start, pHat };
})();
