/* Balance Blitz — balance chemical equations against the clock.
   Any correctly balanced set of coefficients in lowest terms is accepted,
   not just the one stored in the data file. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.balance = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  /** Parse a formula such as "Al2(SO4)3" into { Al:2, S:3, O:12 }. */
  function parseFormula(f) {
    const stack = [{}];
    let i = 0;
    while (i < f.length) {
      const ch = f[i];
      if (ch === "(" || ch === "[") { stack.push({}); i++; }
      else if (ch === ")" || ch === "]") {
        const group = stack.pop();
        i++;
        let num = "";
        while (i < f.length && /\d/.test(f[i])) num += f[i++];
        const mult = num ? parseInt(num, 10) : 1;
        const top = stack[stack.length - 1];
        for (const [el, n] of Object.entries(group)) top[el] = (top[el] || 0) + n * mult;
      }
      else if (/[A-Z]/.test(ch)) {
        let el = ch; i++;
        while (i < f.length && /[a-z]/.test(f[i])) el += f[i++];
        let num = "";
        while (i < f.length && /\d/.test(f[i])) num += f[i++];
        const n = num ? parseInt(num, 10) : 1;
        const top = stack[stack.length - 1];
        top[el] = (top[el] || 0) + n;
      }
      else i++; // skip anything unexpected
    }
    return stack[0];
  }

  function tally(terms, coeffs) {
    const out = {};
    terms.forEach((t, i) => {
      const counts = parseFormula(t);
      const c = coeffs[i] || 0;
      for (const [el, n] of Object.entries(counts)) out[el] = (out[el] || 0) + n * c;
    });
    return out;
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  function start(root, cfg) {
    const c = Object.assign({ count: 8, totalTime: 0, modeId: "balance", diffMax: 3 }, cfg);
    S.markMode("balance");
    S.touchStreak();

    const pool = CHEM.DATA.equations.filter(e => e.diff <= c.diffMax);
    const set = U.sample(pool, c.count);

    let idx = 0, solved = 0, attempts = 0, xpEarned = 0, coins = 0, hintsUsed = 0;
    /* The live atom tally is a genuine crutch — with it up, balancing is arithmetic
       rather than chemistry — so it is opt-in and costs XP, mirroring the titration
       pH meter. `usedTally` is a LATCH: it is set the moment the table is switched on
       and never cleared, so peeking and then hiding it again does not restore the XP.
       Kept for the whole run rather than per equation, since one look teaches you the
       method for every equation after it. */
    let tallyOn = false, usedTally = false;
    let timeLeft = c.totalTime, timerId = null, finished = false;

    const shell = UI.gameShell("Balance Blitz", { confirmExit: true });
    root.appendChild(shell.root);

    const progChip = UI.chip("1 / " + set.length);
    const xpChip = UI.chip("0 XP");
    const timerChip = c.totalTime ? U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft) }) : null;
    [progChip, xpChip, timerChip].forEach(n => n && shell.meta.appendChild(n));

    const stage = U.el("div", { class: "qcard" });
    shell.body.appendChild(stage);

    if (c.totalTime) {
      timerId = setInterval(() => {
        timeLeft--;
        timerChip.textContent = U.fmtTime(Math.max(0, timeLeft));
        timerChip.classList.toggle("low", timeLeft <= 10);
        if (timeLeft <= 0) finish();
      }, 1000);
    }
    UI.onLeave(() => clearInterval(timerId));

    function render() {
      const eq = set[idx];
      const terms = eq.lhs.concat(eq.rhs);
      const inputs = [];
      stage.innerHTML = "";
      progChip.textContent = `${idx + 1} / ${set.length}`;

      stage.appendChild(U.el("div", { class: "qtag" }, [
        UI.chip(eq.topic), UI.chip("★".repeat(eq.diff)),
        UI.chip("Balance the equation")
      ]));

      const line = U.el("div", { class: "eqline" });
      terms.forEach((t, i) => {
        if (i === eq.lhs.length) line.appendChild(U.el("span", { class: "eqarrow", text: "→" }));
        else if (i > 0) line.appendChild(U.el("span", { class: "eqop", text: "+" }));

        const input = U.el("input", {
          class: "coeff", type: "text", inputmode: "numeric",
          value: "", "aria-label": "coefficient for " + t, maxlength: "2"
        });
        input.addEventListener("input", () => {
          input.value = input.value.replace(/\D/g, "").slice(0, 2);
          input.classList.remove("err");
          updateTally();
        });
        input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
        inputs.push(input);

        line.appendChild(U.el("span", { class: "eqterm" }, [
          input, U.el("span", { class: "formula", html: U.formula(t) })
        ]));
      });
      stage.appendChild(line);

      const tallyBox = U.el("div", { class: "tally", hidden: !tallyOn });
      const tallyBtn = U.el("button", {
        class: "btn btn-sm btn-ghost",
        text: tallyOn ? "🧮 Atom tally on (−25% XP)" : "🧮 Show atom tally (−25% XP)",
        on: { click: () => {
          tallyOn = !tallyOn;
          usedTally = true;                       // latched for the rest of the run
          tallyBox.hidden = !tallyOn;
          tallyBtn.textContent = tallyOn ? "🧮 Atom tally on (−25% XP)" : "🧮 Show atom tally (−25% XP)";
          CHEM.Sound.click();
          if (tallyOn) updateTally();
        } }
      });
      stage.appendChild(U.el("div", { class: "row", style: "justify-content:center" }, [tallyBtn]));
      stage.appendChild(tallyBox);

      const feedbackSlot = U.el("div");
      stage.appendChild(feedbackSlot);

      const hintBtn = U.el("button", {
        class: "btn btn-sm btn-ghost", text: "💡 Hint (−5 XP)",
        on: { click: () => {
          hintsUsed++;
          hintBtn.disabled = true;
          feedbackSlot.innerHTML = "";
          feedbackSlot.appendChild(U.el("div", { class: "feedback", html: `<b>Hint.</b> ${U.escapeHtml(eq.hint)}` }));
        } }
      });
      const checkBtn = U.el("button", { class: "btn btn-primary", text: "Check ✓", on: { click: check } });
      stage.appendChild(U.el("div", { class: "row", style: "margin-top:14px" }, [
        hintBtn, U.el("div", { class: "spacer" }), checkBtn
      ]));

      function coeffs() { return inputs.map(i => parseInt(i.value, 10) || 0); }

      function updateTally() {
        if (!tallyOn) return;
        const cs = coeffs();
        const left = tally(eq.lhs, cs.slice(0, eq.lhs.length));
        const right = tally(eq.rhs, cs.slice(eq.lhs.length));
        const els = Array.from(new Set(Object.keys(left).concat(Object.keys(right)))).sort();
        tallyBox.innerHTML = "";
        els.forEach(el => {
          const l = left[el] || 0, r = right[el] || 0;
          const balanced = l === r && l > 0;
          tallyBox.appendChild(U.el("div", { class: "tally-row " + (balanced ? "bal" : "unbal") }, [
            U.el("span", { class: "tally-el", text: el }),
            U.el("span", { class: "tally-side", text: String(l) }),
            U.el("span", { text: balanced ? "=" : "≠" }),
            U.el("span", { class: "tally-side", text: String(r) })
          ]));
        });
      }
      updateTally();

      function check() {
        const cs = coeffs();
        attempts++;

        if (cs.some(v => v <= 0)) {
          inputs.forEach((inp, i) => { if (cs[i] <= 0) inp.classList.add("err"); });
          CHEM.Sound.wrong();
          feedbackSlot.innerHTML = "";
          feedbackSlot.appendChild(U.el("div", { class: "feedback no", html:
            "<b>Every term needs a coefficient.</b> Use 1 where a species appears just once — a blank is not the same as a 1." }));
          return;
        }

        const left = tally(eq.lhs, cs.slice(0, eq.lhs.length));
        const right = tally(eq.rhs, cs.slice(eq.lhs.length));
        const els = new Set(Object.keys(left).concat(Object.keys(right)));
        const balanced = Array.from(els).every(el => (left[el] || 0) === (right[el] || 0));
        const simplest = cs.reduce((a, b) => gcd(a, b)) === 1;

        if (balanced && simplest) {
          solved++;
          const gain = 20 * eq.diff - (hintsUsed ? 5 : 0);
          xpEarned += Math.max(5, gain);
          coins += 4 + eq.diff * 2;
          S.bump("equationsBalanced");
          S.progressDaily("balance", 1);
          CHEM.Sound.balanced();
          CHEM.FX.burstAt(stage, { count: 30, speed: 6, size: 4 });
          xpChip.textContent = xpEarned + " XP";

          feedbackSlot.innerHTML = "";
          const fb = U.el("div", { class: "feedback ok", html:
            `<b>Balanced.</b> ${cs.join(" : ")} — mass is conserved on both sides.` });
          feedbackSlot.appendChild(fb);
          checkBtn.disabled = true;
          hintBtn.disabled = true;
          inputs.forEach(i => (i.disabled = true));

          const next = U.el("button", {
            class: "btn btn-primary", text: idx >= set.length - 1 ? "See results" : "Next equation →",
            on: { click: () => {
              if (idx >= set.length - 1) return finish();
              idx++; hintsUsed = 0; render();
            } }
          });
          fb.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [next]));
          next.focus();
        } else if (balanced && !simplest) {
          CHEM.Sound.wrong();
          feedbackSlot.innerHTML = "";
          feedbackSlot.appendChild(U.el("div", { class: "feedback no", html:
            "<b>Almost.</b> The atoms balance, but the coefficients share a common factor — reduce to the lowest whole numbers." }));
        } else {
          CHEM.Sound.wrong();
          CHEM.FX.shake();
          inputs.forEach(i => i.classList.add("err"));
          setTimeout(() => inputs.forEach(i => i.classList.remove("err")), 400);
          feedbackSlot.innerHTML = "";
          const off = Array.from(els).filter(el => (left[el] || 0) !== (right[el] || 0));
          feedbackSlot.appendChild(U.el("div", { class: "feedback no", html:
            `<b>Not balanced yet.</b> Check ${off.map(U.escapeHtml).join(", ")}.` }));
        }
      }

      inputs[0].focus();
    }

    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(timerId);
      const bonus = S.streakBonus();
      // Same shape as the titration meter: the penalty applies to the whole run once
      // the crutch has been touched, so it cannot be toggled off before submitting.
      const total = Math.round((xpEarned + bonus) * (usedTally ? 0.75 : 1));
      const newBest = S.recordScore("balance", solved);
      if (solved === set.length) S.bump("perfectRuns");
      const got = UI.award({ xp: total, coins });
      UI.results({
        title: "Balance Blitz complete",
        correct: solved, total: set.length, xp: got.xp, coins: got.coins, newBest,
        extraStats: [["Attempts", attempts], ["Daily bonus", "+" + bonus],
                     ["Atom tally", usedTally ? "used" : "no"]],
        onAgain: () => UI.handleRoute()
      });
    }

    render();
  }

  return { start, parseFormula, tally };
})();
