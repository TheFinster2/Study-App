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
    const cb = U.pick([0.1000, 0.1050, 0.0500, 0.2000]);   // standardised titrant

    /* Pick the TITRE first, then derive the unknown from it. Randomising both
       concentrations independently could put equivalence at up to 100 mL — past
       the burette's capacity, so the end point was literally unreachable.
       A real prac aims for a titre in the middle of the burette. */
    const targetTitre = 16 + Math.random() * 18;                       // 16–34 mL
    const ca = parseFloat(((cb * targetTitre) / va).toFixed(4));       // unknown analyte
    const vEq = (ca * va) / cb;                                        // exact, from the rounded ca

    let vb = 0, meterOn = false, ended = false, finished = false;
    let usedMeter = false;

    const shell = UI.gameShell("Titration Lab", { tools: { notes: true, reference: true },  confirmExit: true });
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

    const CAPACITY = 50.00; // matches the drawn burette

    function add(ml) {
      if (ended) return;
      if (vb >= CAPACITY) {
        UI.toast({ icon: "🚱", kind: "bad", text: "Burette empty — you've overshot badly." });
        CHEM.Sound.error();
        return;
      }
      vb = Math.min(CAPACITY, parseFloat((vb + ml).toFixed(2)));
      CHEM.Sound[ml <= 0.05 ? "drip" : "pour"]();
      paint();
    }

    let wasInRange = false;
    function paint() {
      const pH = pHat(sc, ca, va, cb, vb);
      // Audible cue the moment the indicator starts to turn — the real skill cue.
      const inRange = pH > sc.lo && pH < sc.hi;
      if (inRange && !wasInRange) CHEM.Sound.colourChange();
      wasInRange = inRange;
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

      if (perfect) { CHEM.Sound.endpoint(); CHEM.FX.bubbles(window.innerWidth / 2, window.innerHeight / 2); }
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
        UI.answerPad(input),
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

        /* Wait for the player before covering the screen. This used to call finish()
           straight from here, so the results modal opened over the working the instant
           the answer was submitted — the one part of the run worth reading, and the
           only chance to see where the number came from. Every other mode already
           gates its results behind a button; this one didn't. */
        const seeResults = U.el("button", {
          class: "btn btn-primary btn-block", text: "See results →",
          // Removed once used, so reviewing doesn't leave two buttons that both claim
          // to show the results — the floating one is the way back from here on.
          on: { click: () => { seeResults.remove(); finish(error, perfect, good, ok, calcOk); } }
        });
        card.appendChild(U.el("div", { style: "margin-top:14px" }, [seeResults]));
        seeResults.focus();
      }

      submit.addEventListener("click", submitAnswer);
      input.addEventListener("keydown", e => { if (e.key === "Enter") submitAnswer(); });
    }

    function finish(error, perfect, good, ok, calcOk) {
      if (finished) return;
      finished = true;

      // Missing the end point by more than half a millilitre earns nothing at all —
      // otherwise declaring immediately was a four-second XP faucet.
      let xp = perfect ? 220 : good ? 160 : ok ? 100 : 0;
      if (calcOk) xp += 90;
      if (usedMeter) xp = Math.round(xp * 0.7);

      const coins = (perfect ? 90 : good ? 60 : ok ? 35 : 0) + (calcOk ? 30 : 0);
      const accuracy = ((ok ? 1 : 0) + (calcOk ? 1 : 0)) / 2;

      if (ok) S.bump("titrations");
      if (perfect) S.bump("perfectTitrations");
      S.progressDaily("titration", 1);
      const newBest = S.recordScore("titration", Math.round(100 - Math.min(100, error * 100)));

      const got = UI.award({ xp, coins, bonus: S.streakBonus(), accuracy });
      UI.results({
        /* The end point and the calculation are scored separately, so the title has to
           name both — "Perfect titration" over a rank D because the arithmetic was
           wrong just reads as a bug. */
        title: perfect && calcOk ? "Perfect titration"
             : perfect ? "Perfect end point, wrong calculation"
             : ok && calcOk ? "Titration complete"
             : ok ? "Good titre, wrong calculation"
             : "Overshot",
        correct: (ok ? 1 : 0) + (calcOk ? 1 : 0), total: 2, xp: got.xp, coins: got.coins, newBest,
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
