/* Calculation Crunch — procedurally generated quantitative problems.
   Every question is generated fresh, so the bank never runs dry. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.calc = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  const COMPOUNDS = [
    { f: "NaCl",    M: 58.44 }, { f: "CaCO3",  M: 100.09 }, { f: "H2O",    M: 18.02 },
    { f: "CO2",     M: 44.01 }, { f: "NaOH",   M: 40.00 },  { f: "H2SO4",  M: 98.08 },
    { f: "KMnO4",   M: 158.03 },{ f: "C6H12O6",M: 180.16 }, { f: "NH3",    M: 17.03 },
    { f: "MgSO4",   M: 120.37 },{ f: "AgNO3",  M: 169.87 }, { f: "CuSO4",  M: 159.61 },
    { f: "Na2CO3",  M: 105.99 },{ f: "HCl",    M: 36.46 },  { f: "C2H5OH", M: 46.07 }
  ];

  const r = (lo, hi, dp) => {
    const v = lo + Math.random() * (hi - lo);
    return parseFloat(v.toFixed(dp === undefined ? 2 : dp));
  };

  const GENERATORS = [
    function molesFromMass() {
      const cpd = U.pick(COMPOUNDS);
      const m = r(5, 90, 1);
      return {
        topic: "The mole", diff: 1,
        q: `What amount, in mol, is present in ${m} g of ${cpd.f}? (M = ${cpd.M} g mol⁻¹)`,
        answer: m / cpd.M, unit: "mol",
        why: `n = m / M = ${m} / ${cpd.M} = ${U.sigFig(m / cpd.M, 3)} mol.`
      };
    },

    function massFromMoles() {
      const cpd = U.pick(COMPOUNDS);
      const n = r(0.15, 3.5, 2);
      return {
        topic: "The mole", diff: 1,
        q: `What is the mass, in grams, of ${n} mol of ${cpd.f}? (M = ${cpd.M} g mol⁻¹)`,
        answer: n * cpd.M, unit: "g",
        why: `m = n × M = ${n} × ${cpd.M} = ${U.sigFig(n * cpd.M, 4)} g.`
      };
    },

    function concentration() {
      const cpd = U.pick(COMPOUNDS);
      const m = r(2, 25, 2);
      const v = U.pick([100, 250, 500, 1000]);
      const n = m / cpd.M;
      return {
        topic: "Concentration", diff: 2,
        q: `${m} g of ${cpd.f} (M = ${cpd.M}) is dissolved to make ${v} mL of solution. What is the concentration in mol L⁻¹?`,
        answer: n / (v / 1000), unit: "mol L⁻¹",
        why: `n = ${m}/${cpd.M} = ${U.sigFig(n, 3)} mol. c = n/V = ${U.sigFig(n, 3)} / ${v / 1000} = ${U.sigFig(n / (v / 1000), 3)} mol L⁻¹.`
      };
    },

    function dilution() {
      const c1 = U.pick([0.5, 1.0, 2.0, 2.5, 5.0]);
      const c2 = parseFloat((c1 / U.randInt(4, 25)).toFixed(4));
      const v2 = U.pick([100, 250, 500]);
      return {
        topic: "Dilution", diff: 2,
        q: `What volume, in mL, of ${c1} mol L⁻¹ stock is needed to prepare ${v2} mL of ${c2} mol L⁻¹ solution?`,
        answer: (c2 * v2) / c1, unit: "mL",
        why: `c₁V₁ = c₂V₂ → V₁ = (${c2} × ${v2}) / ${c1} = ${U.sigFig((c2 * v2) / c1, 3)} mL.`
      };
    },

    function pHfromConc() {
      const c = parseFloat((Math.pow(10, -U.randInt(1, 5)) * U.randInt(1, 9)).toPrecision(2));
      return {
        topic: "pH", diff: 2,
        q: `A strong monoprotic acid has [H₃O⁺] = ${U.sci(c, 2)} mol L⁻¹. What is the pH? (2 d.p.)`,
        answer: -Math.log10(c), unit: "", tol: 0.01,
        why: `pH = −log₁₀(${U.sci(c, 2)}) = ${(-Math.log10(c)).toFixed(2)}.`
      };
    },

    function concFromPH() {
      const pH = r(1.5, 5.5, 2);
      return {
        topic: "pH", diff: 2,
        q: `A solution has pH = ${pH}. What is [H₃O⁺] in mol L⁻¹?`,
        answer: Math.pow(10, -pH), unit: "mol L⁻¹", tol: 0.03,
        why: `[H₃O⁺] = 10^(−pH) = 10^(−${pH}) = ${U.sci(Math.pow(10, -pH), 3)} mol L⁻¹.`
      };
    },

    function strongBasePH() {
      const c = U.pick([0.001, 0.005, 0.01, 0.02, 0.05, 0.1]);
      return {
        topic: "pH", diff: 3,
        q: `What is the pH of a ${c} mol L⁻¹ NaOH solution at 25 °C? (2 d.p.)`,
        answer: 14 + Math.log10(c), unit: "", tol: 0.01,
        why: `pOH = −log(${c}) = ${(-Math.log10(c)).toFixed(2)}; pH = 14.00 − ${(-Math.log10(c)).toFixed(2)} = ${(14 + Math.log10(c)).toFixed(2)}.`
      };
    },

    function weakAcidPH() {
      const acid = U.pick([
        { name: "ethanoic acid", ka: 1.8e-5 },
        { name: "methanoic acid", ka: 1.8e-4 },
        { name: "benzoic acid", ka: 6.3e-5 },
        { name: "hydrofluoric acid", ka: 7.2e-4 }
      ]);
      const c = U.pick([0.010, 0.050, 0.10, 0.20, 0.50]);
      const h = Math.sqrt(acid.ka * c);
      return {
        topic: "Weak acids", diff: 3,
        q: `What is the pH of a ${c} mol L⁻¹ solution of ${acid.name} (Ka = ${U.sci(acid.ka, 2)})? (2 d.p.)`,
        answer: -Math.log10(h), unit: "", tol: 0.02,
        why: `[H₃O⁺] = √(Ka × c) = √(${U.sci(acid.ka, 2)} × ${c}) = ${U.sci(h, 3)}; pH = ${(-Math.log10(h)).toFixed(2)}.`
      };
    },

    function gasVolume() {
      const n = r(0.2, 4, 2);
      return {
        topic: "Gas laws", diff: 2,
        q: `What volume, in litres, does ${n} mol of an ideal gas occupy at 25 °C and 100 kPa? (Vm = 24.79 L mol⁻¹)`,
        answer: n * 24.79, unit: "L",
        why: `V = n × Vm = ${n} × 24.79 = ${U.sigFig(n * 24.79, 4)} L.`
      };
    },

    function combinedGas() {
      const v1 = U.pick([250, 500, 750, 1000]);
      const t1 = U.pick([273, 293, 300, 310]);
      const t2 = t1 + U.randInt(30, 150);
      return {
        topic: "Gas laws", diff: 3,
        q: `A gas occupies ${v1} mL at ${t1} K. At constant pressure, what volume (mL) does it occupy at ${t2} K?`,
        answer: (v1 * t2) / t1, unit: "mL",
        why: `V₁/T₁ = V₂/T₂ → V₂ = ${v1} × ${t2} / ${t1} = ${U.sigFig((v1 * t2) / t1, 4)} mL.`
      };
    },

    function titration() {
      const cAcid = U.pick([0.0500, 0.1000, 0.1050, 0.2000]);
      const vAcid = r(15, 28, 2);
      const vBase = 25.00;
      const cBase = (cAcid * vAcid) / vBase;
      return {
        topic: "Titration", diff: 3,
        q: `${vBase} mL of NaOH required ${vAcid} mL of ${cAcid} mol L⁻¹ HCl to reach the end point. What is [NaOH] in mol L⁻¹? (1:1 ratio)`,
        answer: cBase, unit: "mol L⁻¹",
        why: `n(HCl) = ${(vAcid / 1000).toFixed(5)} × ${cAcid} = ${U.sci(cAcid * vAcid / 1000, 4)} mol. Same moles of NaOH in 0.02500 L → c = ${U.sigFig(cBase, 4)} mol L⁻¹.`
      };
    },

    function percentYield() {
      const theo = r(4, 40, 2);
      const actual = parseFloat((theo * r(0.45, 0.96, 3)).toFixed(2));
      return {
        topic: "Yield", diff: 1,
        q: `A reaction with a theoretical yield of ${theo} g produced ${actual} g of product. What is the percentage yield? (1 d.p.)`,
        answer: (actual / theo) * 100, unit: "%", tol: 0.01,
        why: `% yield = (${actual} / ${theo}) × 100 = ${((actual / theo) * 100).toFixed(1)}%.`
      };
    },

    function calorimetry() {
      const m = U.pick([100, 150, 200, 250]);
      const dT = r(5, 30, 1);
      return {
        topic: "Calorimetry", diff: 2,
        q: `How much energy, in kJ, is absorbed when ${m} g of water is heated by ${dT} °C? (c = 4.18 J g⁻¹ K⁻¹)`,
        answer: (m * 4.18 * dT) / 1000, unit: "kJ",
        why: `q = mcΔT = ${m} × 4.18 × ${dT} = ${U.sigFig(m * 4.18 * dT, 4)} J = ${U.sigFig((m * 4.18 * dT) / 1000, 3)} kJ.`
      };
    },

    function molarHeatCombustion() {
      const fuel = U.pick([
        { name: "ethanol", M: 46.07 }, { name: "methanol", M: 32.04 }, { name: "propan-1-ol", M: 60.10 }
      ]);
      const mass = r(0.4, 1.6, 2);
      const water = U.pick([200, 250]);
      const dT = r(12, 34, 1);
      const q = (water * 4.18 * dT) / 1000;
      const n = mass / fuel.M;
      return {
        topic: "Calorimetry", diff: 3,
        q: `Burning ${mass} g of ${fuel.name} (M = ${fuel.M}) heats ${water} g of water by ${dT} °C. What is the magnitude of the molar heat of combustion, in kJ mol⁻¹?`,
        answer: q / n, unit: "kJ mol⁻¹", tol: 0.02,
        why: `q = ${water} × 4.18 × ${dT} = ${U.sigFig(q, 4)} kJ. n = ${mass}/${fuel.M} = ${U.sigFig(n, 3)} mol. ΔHc = ${U.sigFig(q / n, 4)} kJ mol⁻¹ (negative, exothermic).`
      };
    },

    function ppm() {
      const mg = r(0.5, 40, 2);
      const L = U.pick([0.100, 0.250, 0.500, 1.00, 2.00]);
      return {
        topic: "Concentration", diff: 2,
        q: `A ${L} L water sample contains ${mg} mg of lead. What is the concentration in ppm?`,
        answer: mg / L, unit: "ppm",
        why: `ppm = mg per litre = ${mg} / ${L} = ${U.sigFig(mg / L, 3)} ppm.`
      };
    },

    function ksp() {
      const salt = U.pick([
        { f: "AgCl", ksp: 1.8e-10 }, { f: "BaSO4", ksp: 1.1e-10 },
        { f: "CaSO4", ksp: 4.9e-5 }, { f: "AgBr", ksp: 5.4e-13 }
      ]);
      return {
        topic: "Solubility", diff: 3,
        q: `${salt.f} has Ksp = ${U.sci(salt.ksp, 2)}. What is its molar solubility in pure water, in mol L⁻¹? (1:1 salt)`,
        answer: Math.sqrt(salt.ksp), unit: "mol L⁻¹", tol: 0.03,
        why: `Ksp = s² for a 1:1 salt, so s = √(${U.sci(salt.ksp, 2)}) = ${U.sci(Math.sqrt(salt.ksp), 3)} mol L⁻¹.`
      };
    },

    function percentComposition() {
      const cpd = U.pick([
        { f: "H2O",   el: "O",  mass: 16.00, M: 18.02 },
        { f: "CO2",   el: "C",  mass: 12.01, M: 44.01 },
        { f: "CaCO3", el: "Ca", mass: 40.08, M: 100.09 },
        { f: "NaCl",  el: "Na", mass: 22.99, M: 58.44 },
        { f: "NH3",   el: "N",  mass: 14.01, M: 17.03 }
      ]);
      return {
        topic: "Composition", diff: 2,
        q: `What is the percentage by mass of ${cpd.el} in ${cpd.f}? (M = ${cpd.M} g mol⁻¹, 1 d.p.)`,
        answer: (cpd.mass / cpd.M) * 100, unit: "%", tol: 0.01,
        why: `% = (${cpd.mass} / ${cpd.M}) × 100 = ${((cpd.mass / cpd.M) * 100).toFixed(1)}%.`
      };
    },

    function particles() {
      const cpd = U.pick(COMPOUNDS);
      const n = r(0.1, 2.5, 2);
      return {
        topic: "The mole", diff: 2,
        q: `How many formula units are in ${n} mol of ${cpd.f}? (Nₐ = 6.022 × 10²³)`,
        answer: n * 6.022e23, unit: "particles", tol: 0.02,
        why: `N = n × Nₐ = ${n} × 6.022 × 10²³ = ${U.sci(n * 6.022e23, 3)}.`
      };
    }
  ];

  function start(root, cfg) {
    const c = Object.assign({ count: 10, modeId: "calc" }, cfg);
    S.markMode("calc");
    S.touchStreak();

    let idx = 0, correct = 0, streak = 0, best = 0, xpEarned = 0, coins = 0, finished = false;
    let penalty = 0;

    const shell = UI.gameShell("Calculation Crunch", { tools: { notes: true, reference: true },  confirmExit: true });
    root.appendChild(shell.root);
    const progChip = UI.chip("1 / " + c.count);
    const streakChip = UI.chip("Streak 0");
    const xpChip = UI.chip("0 XP");
    [progChip, streakChip, xpChip].forEach(n => shell.meta.appendChild(n));

    const stage = U.el("div");
    shell.body.appendChild(stage);

    function render() {
      const prob = U.pick(GENERATORS)();
      progChip.textContent = `${idx + 1} / ${c.count}`;
      stage.innerHTML = "";

      const input = U.el("input", {
        class: "numin", type: "text", inputmode: "decimal",
        placeholder: "your answer", autocomplete: "off", spellcheck: "false"
      });
      const card = U.el("div", { class: "qcard" }, [
        U.el("div", { class: "qtag" }, [
          UI.chip("Calculations"), UI.chip(prob.topic), UI.chip("★".repeat(prob.diff))
        ]),
        U.el("div", { class: "qtext", html: U.formula(prob.q) }),
        U.el("div", { style: "margin-top:18px" }, [input]),
        UI.answerPad(input),
        U.el("div", { class: "unit-hint", text:
          (prob.unit ? "Answer in " + prob.unit : "Answer as a number") + " · use ×10ⁿ for powers of ten" })
      ]);

      const submit = U.el("button", { class: "btn btn-primary btn-block", text: "Submit", on: { click: check } });
      card.appendChild(U.el("div", { style: "margin-top:14px" }, [submit]));
      stage.appendChild(card);
      input.focus();
      input.addEventListener("keydown", e => { if (e.key === "Enter") check(); else CHEM.Sound.type(); });

      let done = false;
      function check() {
        if (done) return;
        if (!input.value.trim()) return;
        done = true;
        input.disabled = true;
        submit.disabled = true;

        const ok = U.numClose(input.value, prob.answer, prob.tol === undefined ? 0.02 : prob.tol);
        S.recordAnswer("M2", ok, null);

        if (ok) {
          correct++; streak++; best = Math.max(best, streak);
          S.noteStreak(best);
          S.bump("calcsCorrect");
          S.progressDaily("calc", 1);
          const gain = Math.round(16 * prob.diff * Math.min(2.5, 1 + streak * 0.12));
          xpEarned += gain; coins += 3 + prob.diff;
          CHEM.Sound.correct();
          CHEM.FX.burstAt(input, { count: 22, speed: 5, size: 4 });
          const rect = input.getBoundingClientRect();
          CHEM.FX.floatText(rect.right - 70, rect.top - 6, "+" + gain);
        } else {
          streak = 0;
          penalty += 10 * prob.diff;
          CHEM.Sound.wrong();
          CHEM.FX.shake();
        }
        streakChip.textContent = "Streak " + streak;
        xpChip.textContent = Math.max(0, xpEarned - penalty) + " XP";

        const shown = U.sci(prob.answer, 4);
        /* Say so when the digits are right and only the power of ten is wrong — that is
           what a student ends up entering when they can't type an exponent, and being
           told only "wrong" hides that they had the chemistry. */
        const pow = ok ? 0 : U.wrongPowerOfTen(input.value, prob.answer);
        const note = pow
          ? `<br><b>Right digits, wrong power of ten</b> — you were out by a factor of 10${pow > 0 ? "" : "⁻"}` +
            `${String(Math.abs(pow)).replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d])}. Use the ×10ⁿ key.`
          : "";
        const fb = U.el("div", { class: "feedback " + (ok ? "ok" : "no"), html:
          `<b>${ok ? "Correct." : `Answer: ${shown} ${U.escapeHtml(prob.unit)}`}</b>${note}<br>${U.formula(prob.why)}` });

        const next = U.el("button", {
          class: "btn btn-primary",
          text: idx >= c.count - 1 ? "See results" : "Next →",
          on: { click: () => { if (idx >= c.count - 1) return finish(); idx++; render(); } }
        });
        fb.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [next]));
        card.appendChild(fb);
        next.focus();
      }
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (correct === c.count) S.bump("perfectRuns");
      const newBest = S.recordScore("calc", correct);
      const got = UI.award({
        xp: Math.max(0, xpEarned - penalty), bonus: S.streakBonus(),
        accuracy: correct / c.count, coins
      });
      UI.results({
        title: "Calculations complete",
        correct, total: c.count, xp: got.xp, coins: got.coins, newBest,
        extraStats: [["Best streak", best], ["Wrong", `−${penalty} XP`]],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start };
})();
