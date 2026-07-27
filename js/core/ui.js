/* UI shell: hash router, header sync, toasts, modals, and the reward pipeline
   that every game funnels XP / coins / achievements through. */
window.CHEM = window.CHEM || {};

CHEM.UI = (function () {
  const U = CHEM.U;
  const S = CHEM.State;
  const routes = {};
  let currentCleanup = null;

  /** Runs below this accuracy earn no completion bonus at all. */
  const MIN_BONUS_ACCURACY = 0.5;
  /** Answers faster than this can't have involved reading the question, so they pay no XP. */
  const MIN_READ_MS = 1200;

  /* ── routing ─────────────────────────────────────────────── */
  function route(name, fn) { routes[name] = fn; }

  function go(path) {
    if (location.hash === "#" + path) handleRoute();
    else location.hash = path;
  }

  function parseHash() {
    const raw = (location.hash || "#/home").replace(/^#/, "");
    const parts = raw.split("/").filter(Boolean);
    return { name: parts[0] || "home", args: parts.slice(1) };
  }

  function handleRoute() {
    const { name, args } = parseHash();
    const fn = routes[name] || routes.home;

    if (typeof currentCleanup === "function") {
      try { currentCleanup(); } catch (e) { /* ignore */ }
    }
    currentCleanup = null;

    const view = U.$("#view");
    if (view.childNodes.length) CHEM.Sound.nav();
    view.innerHTML = "";
    const result = fn(view, args);
    if (typeof result === "function") currentCleanup = result;

    // Highlight the matching nav item; games map back to Play.
    const navKey = ({ play: "play", game: "play" })[name] || name;
    U.$$(".nav-item").forEach(a => a.classList.toggle("on", a.dataset.nav === navKey));

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    view.focus({ preventScroll: true });
  }

  /** Register a cleanup for the current screen (timers, listeners). */
  function onLeave(fn) { currentCleanup = fn; }

  /* ── header ──────────────────────────────────────────────── */
  function syncHeader() {
    const d = S.data;
    const need = S.xpNeeded(d.level);
    U.$("#avatar-emoji").textContent = d.profile.avatar;
    U.$("#lvl-badge").textContent = "Lv " + d.level;
    U.$("#lvl-title").textContent = S.levelTitle(d.level);
    U.$("#lvl-xp").textContent = `${d.xpIntoLevel} / ${need} XP`;
    U.$("#xpbar-fill").style.width = U.clamp((d.xpIntoLevel / need) * 100, 0, 100) + "%";

    const coinEl = U.$("#coin-count");
    if (coinEl.textContent !== String(d.coins)) {
      coinEl.textContent = d.coins;
      pulse(U.$("#coin-pill"));
    }
    const streakEl = U.$("#streak-count");
    streakEl.textContent = d.streak.count;
    U.$("#streak-pill").classList.toggle("hot", d.streak.count >= 3);
  }

  function pulse(node) {
    if (!node) return;
    node.classList.remove("bump");
    void node.offsetWidth;
    node.classList.add("bump");
  }

  function applyTheme(id) {
    document.documentElement.dataset.theme = id;
    S.data.profile.theme = id;
    S.save();
  }

  /* ── toasts ──────────────────────────────────────────────── */
  function toast(opts) {
    const o = typeof opts === "string" ? { text: opts } : opts;
    const node = U.el("div", { class: "toast " + (o.kind || "") }, [
      U.el("span", { class: "toast-ico", text: o.icon || "🔬" }),
      U.el("span", { html: o.text })
    ]);
    U.$("#toasts").appendChild(node);
    setTimeout(() => {
      node.classList.add("out");
      setTimeout(() => node.remove(), 320);
    }, o.ms || 2600);
  }

  /* ── modals ──────────────────────────────────────────────── */
  let escHandler = null;

  function modal(content, opts) {
    const o = opts || {};
    const root = U.$("#modal-root");
    closeModal();
    root.hidden = false;

    const box = U.el("div", { class: "modal" + (o.center ? " modal-center" : "") });
    if (typeof content === "string") box.innerHTML = content;
    else box.appendChild(content);
    root.appendChild(box);

    // Sticky modals (run results, crate openings) must be dismissed via their own buttons.
    if (!o.sticky) {
      root.onclick = e => { if (e.target === root) closeModal(); };
      escHandler = e => { if (e.key === "Escape") closeModal(); };
      document.addEventListener("keydown", escHandler);
    }
    return { box, close: closeModal };
  }

  function closeModal() {
    const root = U.$("#modal-root");
    root.hidden = true;
    root.innerHTML = "";
    root.onclick = null;
    if (escHandler) {
      document.removeEventListener("keydown", escHandler);
      escHandler = null;
    }
  }

  function confirmDialog(title, body, onYes, yesLabel) {
    const box = U.el("div", {}, [
      U.el("h2", { text: title }),
      U.el("p", { html: body }),
      U.el("div", { class: "row", style: "margin-top:16px" }, [
        U.el("button", { class: "btn btn-ghost", text: "Cancel", on: { click: closeModal } }),
        U.el("div", { class: "spacer" }),
        U.el("button", {
          class: "btn btn-primary", text: yesLabel || "Confirm",
          on: { click: () => { closeModal(); onYes(); } }
        })
      ])
    ]);
    modal(box);
  }

  /* ── the reward pipeline ─────────────────────────────────── */
  /**
   * Every game calls this instead of touching State directly, so level-ups,
   * achievement unlocks and their toasts/FX happen in exactly one place.
   * opts: { xp, coins, at (element for the floating number), silent }
   */
  function award(opts) {
    const o = opts || {};

    /* Completion bonuses are gated on accuracy, so a run of pure guessing pays
       nothing. Without this you could spam any answer, finish the run and still
       collect the daily-streak bonus — worth ~35,000 XP/hour of mindless clicking.
       `xp` itself is already earned per correct answer, minus wrong-answer
       penalties, so it needs no further scaling. */
    let bonus = Math.max(0, o.bonus || 0);
    if (o.accuracy !== undefined) {
      const acc = U.clamp(o.accuracy, 0, 1);
      bonus = acc < MIN_BONUS_ACCURACY ? 0 : Math.round(bonus * acc);
    }

    // Difficulty and prestige bonuses are applied here and nowhere else, so every
    // mode gets them consistently. Coins are deliberately scarcer than XP.
    const mult = o.raw ? 1 : S.xpMultiplier();
    const xp = Math.round((Math.max(0, o.xp || 0) + bonus) * mult);
    const coins = Math.round((o.coins || 0) * (o.raw ? 1 : 0.6));

    if (coins) S.addCoins(coins, true);
    const res = xp ? S.addXP(xp) : { levelsGained: 0 };
    if (!xp && coins) S.emit();
    res.xp = xp;
    res.coins = coins;
    res.multiplier = mult;

    if (o.at && xp && !o.silent) {
      const r = o.at.getBoundingClientRect();
      CHEM.FX.floatText(r.left + r.width / 2 - 20, r.top - 6, "+" + xp + " XP");
    }
    if (coins && !o.silent) CHEM.Sound.coin();

    if (res.levelsGained > 0) {
      CHEM.Sound.levelUp();
      CHEM.FX.confetti(110);
      toast({
        icon: "🎉", kind: "xp", ms: 3600,
        text: `<b>Level ${res.newLevel}!</b> You are now a ${S.levelTitle(res.newLevel)} &middot; +${30 * res.newLevel} 🪙`
      });
      if (res.newLevel >= S.MAX_LEVEL) {
        setTimeout(() => toast({
          icon: "🔱", kind: "good", ms: 5000,
          text: "<b>Level 60 reached.</b> You can now Ascend from the Progress screen."
        }), 1200);
      }
    }

    const unlocked = S.checkAchievements();
    unlocked.forEach((a, i) => {
      setTimeout(() => {
        CHEM.Sound.achievement();
        CHEM.FX.confetti(60);
        toast({
          icon: a.icon, kind: "good", ms: 3800,
          text: `<b>${U.escapeHtml(a.name)}</b> unlocked${a.reward ? ` &middot; +${a.reward} 🪙` : ""}`
        });
      }, 500 + i * 900);
    });

    syncHeader();
    return res;
  }

  /* ── shared game chrome ──────────────────────────────────── */
  /**
   * Standard header for a game screen.
   * Returns { root, body, meta } — append the playfield to `body`, status chips to `meta`.
   */
  function gameShell(title, opts) {
    const o = opts || {};
    const meta = U.el("div", { class: "gmeta" });
    const body = U.el("div", { class: "grid" });
    const back = U.el("button", {
      class: "btn btn-sm btn-ghost", text: "← Back",
      on: { click: () => {
        if (o.confirmExit) {
          confirmDialog("Quit this run?", "Your progress in this run will be lost.",
            () => go("/play"), "Quit");
        } else go(o.backTo || "/play");
      } }
    });
    const root = U.el("div", { class: "gshell" }, [
      U.el("div", { class: "ghead" }, [back, U.el("div", { class: "gtitle", text: title }), meta]),
      body
    ]);
    return { root, body, meta };
  }

  /** Grade a run. Returns { rank, cls, blurb }. */
  function rank(accuracy, bonus) {
    const score = accuracy + (bonus || 0);
    if (score >= 97) return { rank: "S", cls: "rank-s", blurb: "Flawless work. Band 6 energy." };
    if (score >= 88) return { rank: "A", cls: "rank-a", blurb: "Excellent — you know this cold." };
    if (score >= 75) return { rank: "B", cls: "rank-b", blurb: "Solid. Tighten up the tricky ones." };
    if (score >= 60) return { rank: "C", cls: "rank-c", blurb: "Getting there. Review your mistakes." };
    return { rank: "D", cls: "rank-d", blurb: "Rough run — try the flashcards for this topic." };
  }

  /**
   * End-of-run summary modal.
   * opts: { title, correct, total, xp, coins, extraStats:[[label,value]],
   *         bestScore, onAgain, mode }
   */
  function results(opts) {
    const o = opts;
    const acc = U.pct(o.correct, o.total);
    const r = rank(acc, o.bonus);
    const perfect = o.total > 0 && o.correct === o.total;

    if (perfect) { CHEM.Sound.win(); CHEM.FX.confetti(140); }
    else if (acc >= 60) { CHEM.Sound.win(); CHEM.FX.confetti(70); }
    else CHEM.Sound.lose();

    const cells = [
      ["Correct", `${o.correct}/${o.total}`],
      ["Accuracy", acc + "%"],
      ["XP", "+" + o.xp]
    ].concat(o.extraStats || []);

    const box = U.el("div", { class: "modal-center" }, [
      U.el("div", { class: "modal-big " + r.cls, text: r.rank }),
      U.el("h2", { class: "modal-center", text: o.title || "Run complete", style: "justify-content:center" }),
      U.el("p", { text: r.blurb }),
      o.newBest ? U.el("div", { class: "chip on", text: "🏅 New personal best!" }) : null,
      U.el("div", { class: "result-grid" }, cells.map(([lbl, val]) =>
        U.el("div", { class: "result-cell" }, [
          U.el("div", { class: "result-num", text: String(val) }),
          U.el("div", { class: "result-lbl", text: lbl })
        ])
      )),
      o.coins ? U.el("p", { class: "muted", html: `Earned <b>${o.coins}</b> 🪙 Moles` }) : null,
      U.el("div", { class: "row", style: "margin-top:8px" }, [
        U.el("button", {
          class: "btn btn-ghost btn-sm", text: "Back to games",
          on: { click: () => { closeModal(); go("/play"); } }
        }),
        U.el("div", { class: "spacer" }),
        U.el("button", {
          class: "btn btn-primary", text: "Play again",
          on: { click: () => { closeModal(); o.onAgain(); } }
        })
      ])
    ]);
    modal(box, { sticky: true });
  }

  /** Standard chip row used by games to show score / lives / timer. */
  function chip(text, cls) { return U.el("span", { class: "chip " + (cls || ""), text }); }

  /* ── boot ────────────────────────────────────────────────── */
  function init() {
    window.addEventListener("hashchange", handleRoute);
    S.onChange(syncHeader);
    syncHeader();
    handleRoute();
  }

  return { route, go, init, handleRoute, syncHeader, applyTheme, toast, modal, closeModal,
           confirmDialog, award, gameShell, results, rank, chip, onLeave, pulse,
           MIN_BONUS_ACCURACY, MIN_READ_MS };
})();
