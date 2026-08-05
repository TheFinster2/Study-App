/* The in-game tool tray: calculator, working space and data sheet.

   It docks to the bottom of the screen rather than floating over the middle,
   because the one thing it must never do is hide the question. While it is open
   the view reserves matching space at the bottom, so everything above can still be
   scrolled clear of it, and opening it scrolls the question card into the gap.

   Scoring: the calculator and the working space are free — a student sits the HSC
   with a calculator and scrap paper, so neither is a crutch. The data sheet is a
   crutch, and follows the same rule as the atom tally and the pH meter: it costs
   XP, and the flag latches the moment it is opened so closing it again refunds
   nothing. */
window.CHEM = window.CHEM || {};

CHEM.Tools = (function () {
  const U = CHEM.U;

  /** −20% for the run, applied centrally in UI.award. */
  const REFERENCE_PENALTY = 0.8;

  let tray = null;          // the open tray, if any
  let usedReference = false;
  let enabled = [];         // tools this game offers, in tab order
  let launchers = {};

  function resetRun() { usedReference = false; }
  function referenceUsed() { return usedReference; }

  function close() {
    if (!tray) return;
    tray.root.remove();
    if (tray.launcher) tray.launcher.classList.remove("on");
    document.documentElement.style.removeProperty("--tray-h");
    document.body.classList.remove("tray-open");
    tray = null;
  }

  /**
   * Attach a tool bar to a game shell.
   * opts: { calc, notes, reference } — each a boolean, default calc only.
   */
  function attach(shell, opts) {
    const o = Object.assign({ calc: true, notes: false, reference: false }, opts);
    const bar = U.el("div", { class: "toolbar" });
    enabled = [];
    launchers = {};

    function launcher(id, icon, label, short) {
      const b = U.el("button", {
        class: "btn btn-sm tool-btn", type: "button",
        html: `<span class="tool-ico">${icon}</span> ${U.escapeHtml(label)}`
      });
      b.addEventListener("click", () => toggle(id));
      launchers[id] = b;
      // The tray's own tabs use the short form: three full labels plus a Close button
      // overflow 390px, and the active tab was the one getting clipped.
      enabled.push({ id: id, icon: icon, label: short || label });
      bar.appendChild(b);
      return b;
    }

    if (o.calc) launcher("calc", "🧮", "Calculator", "Calc");
    if (o.notes) launcher("notes", "✏️", "Working", "Working");
    if (o.reference) launcher("ref", "📋", "Data sheet", "Data");
    if (!bar.childNodes.length) return { referenceUsed };

    shell.body.parentNode.insertBefore(bar, shell.body);
    return { bar, referenceUsed };

    function toggle(id) {
      if (tray && tray.id === id) { close(); CHEM.Sound.click(); return; }
      close();
      open(id);
      CHEM.Sound.click();
    }
  }

  /* Notes survive being closed and reopened within a run, which is the whole point
     of a working space — you jot a line, check the question, come back to it. */
  let notesText = "";

  function open(id) {
    const body = U.el("div", { class: "tray-body" });

    const grip = U.el("button", {
      class: "tray-grip", type: "button", title: "Close", "aria-label": "Close tools"
    });

    /* Tabs live inside the tray, not in the page. The launcher row scrolls under the
       sticky top bar as soon as the question is brought into view, so switching from
       the calculator to the working space would otherwise mean scrolling back up
       first — with the tray covering half the screen. */
    const tabs = U.el("div", { class: "tray-tabs" }, enabled.map(t => {
      const b = U.el("button", {
        class: "tray-tab" + (t.id === id ? " on" : ""), type: "button",
        html: `<span class="tool-ico">${t.icon}</span> ${U.escapeHtml(t.label)}`
      });
      b.addEventListener("click", () => {
        if (t.id === id) return;
        close();
        open(t.id);
        CHEM.Sound.click();
      });
      return b;
    }));
    const head = U.el("div", { class: "tray-head" }, [
      tabs,
      U.el("div", { class: "spacer" }),
      U.el("button", { class: "btn btn-sm btn-ghost tray-x", text: "✕",
                       title: "Close", "aria-label": "Close tools", on: { click: close } })
    ]);
    const root = U.el("div", { class: "tray" }, [grip, head, body]);
    grip.addEventListener("click", close);
    const launcherBtn = launchers[id];

    if (id === "calc") buildCalc(body);
    else if (id === "notes") buildNotes(body);
    else buildReference(body);

    document.body.appendChild(root);
    document.body.classList.add("tray-open");
    if (launcherBtn) launcherBtn.classList.add("on");
    tray = { id, root, launcher: launcherBtn };

    const activeTab = tabs.querySelector(".tray-tab.on");
    if (activeTab && activeTab.scrollIntoView) activeTab.scrollIntoView({ inline: "nearest", block: "nearest" });

    // Reserve the space the tray covers so the question can be scrolled above it.
    requestAnimationFrame(() => {
      const h = root.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--tray-h", Math.round(h) + "px");
      revealQuestion(h);
    });
  }

  /* Put the question in the strip of screen the tray does not cover. Scrolling it to
     the very top would push a long stem off the top edge, so aim for the middle of
     what is left and clamp. */
  function revealQuestion(trayHeight) {
    const q = document.querySelector(".qtext, .qcard, .eqrow, .path-track");
    if (!q) return;
    const free = window.innerHeight - trayHeight;
    const r = q.getBoundingClientRect();
    if (r.top >= 8 && r.bottom <= free - 8) return;    // already fully visible
    const target = window.scrollY + r.top - Math.max(8, (free - r.height) / 2);
    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }

  /* ── calculator ──────────────────────────────────────────── */
  const KEYS = [
    ["C", "clear"], ["⌫", "back"], ["(", "ins"], [")", "ins"], ["÷", "ins"],
    ["log", "fn"], ["ln", "fn"], ["√", "fn"], ["^", "ins"], ["×", "ins"],
    ["7", "ins"], ["8", "ins"], ["9", "ins"], ["EE", "ee"], ["−", "ins"],
    ["4", "ins"], ["5", "ins"], ["6", "ins"], ["π", "ins"], ["+", "ins"],
    ["1", "ins"], ["2", "ins"], ["3", "ins"], ["Ans", "ins"], ["=", "eq"],
    ["0", "ins"], [".", "ins"], ["±", "neg"], ["x²", "sq"]
  ];

  let calcExpr = "";
  let calcAns = null;

  function buildCalc(body) {
    const out = U.el("div", { class: "calc-out" });
    const line = U.el("input", {
      class: "calc-line", type: "text", inputmode: "text", spellcheck: "false",
      autocomplete: "off", "aria-label": "Calculator expression", value: calcExpr
    });
    const result = U.el("div", { class: "calc-result", text: calcAns === null ? "" : U.sci(calcAns, 8) });
    out.appendChild(line);
    out.appendChild(result);

    function show() {
      calcExpr = line.value;
      const r = U.calc(calcExpr, calcAns);
      if (r.empty) { result.textContent = ""; result.classList.remove("bad"); return; }
      if (r.error) { result.textContent = r.error; result.classList.add("bad"); return; }
      result.textContent = "= " + U.sci(r.value, 8);
      result.classList.remove("bad");
    }

    function insert(text) {
      const start = line.selectionStart === null ? line.value.length : line.selectionStart;
      const end = line.selectionEnd === null ? start : line.selectionEnd;
      line.value = line.value.slice(0, start) + text + line.value.slice(end);
      const at = start + text.length;
      try { line.setSelectionRange(at, at); } catch (e) { /* ignore */ }
      show();
    }

    const pad = U.el("div", { class: "calc-pad" });
    KEYS.forEach(([label, kind]) => {
      const k = U.el("button", {
        class: "calc-key" + (kind === "eq" ? " eq" : "") +
               (/^[0-9.]$/.test(label) ? " num" : ""),
        type: "button", text: label
      });
      k.addEventListener("click", () => {
        CHEM.Sound.type();
        if (kind === "clear") { line.value = ""; show(); }
        else if (kind === "back") { line.value = line.value.slice(0, -1); show(); }
        else if (kind === "fn") insert(label === "√" ? "√(" : label + "(");
        else if (kind === "ee") insert("e");
        else if (kind === "sq") insert("^2");
        else if (kind === "neg") insert("-");
        else if (kind === "eq") {
          const r = U.calc(line.value, calcAns);
          if (r.error || r.empty) { show(); return; }
          calcAns = r.value;
          result.textContent = "= " + U.sci(r.value, 8);
          result.classList.remove("bad");
          CHEM.Sound.correct();
        } else insert(label);
        line.focus({ preventScroll: true });
      });
      pad.appendChild(k);
    });

    line.addEventListener("input", show);
    line.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const r = U.calc(line.value, calcAns);
      if (!r.error && !r.empty) calcAns = r.value;
      show();
    });

    body.appendChild(out);
    body.appendChild(pad);
    body.appendChild(U.el("div", { class: "tiny muted", style: "margin-top:8px; text-align:center",
      text: "EE gives ×10ⁿ · Ans reuses the last result · type directly if you prefer" }));
    show();
  }

  /* ── working space ───────────────────────────────────────── */
  function buildNotes(body) {
    const ta = U.el("textarea", {
      class: "notes-area", spellcheck: "false",
      placeholder: "Scratch working — nothing here is marked or submitted."
    });
    ta.value = notesText;
    ta.addEventListener("input", () => { notesText = ta.value; });
    body.appendChild(ta);
    body.appendChild(U.el("div", { class: "row", style: "margin-top:8px" }, [
      U.el("div", { class: "tiny muted", text: "Kept while this run lasts. Never marked." }),
      U.el("div", { class: "spacer" }),
      U.el("button", {
        class: "btn btn-sm btn-ghost", text: "Clear",
        on: { click: () => { ta.value = ""; notesText = ""; ta.focus(); } }
      })
    ]));
    ta.focus({ preventScroll: true });
  }

  /* ── data sheet ──────────────────────────────────────────── */
  function buildReference(body) {
    // Latched on open. Closing it again does not give the XP back.
    usedReference = true;
    body.appendChild(U.el("div", { class: "tray-warn tiny", text:
      "Data sheet open — this run pays 20% less XP. Opening it once is enough; closing it does not undo that." }));
    const holder = U.el("div", { class: "tray-ref" });
    body.appendChild(holder);
    try {
      CHEM.Screens.study.reference(holder, { compact: true });
    } catch (e) {
      holder.appendChild(U.el("p", { class: "muted", text: "The data sheet could not be loaded." }));
    }
  }

  return { attach, close, resetRun, referenceUsed, REFERENCE_PENALTY };
})();
