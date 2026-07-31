/* UI shell: hash router, header sync, toasts, modals, shared game chrome —
   and THE REWARD PIPELINE, which every mode funnels XP and Primes through.

   Two conventions hold this app together:

   1. Every reward goes through UI.award(). Level-ups, achievement checks,
      toasts, confetti, the XP multiplier and the anti-farm accuracy gate all
      happen in exactly one function. No mode can forget them and no mode can
      bypass the anti-cheat — which is what makes the arcade's "earns nothing"
      rule structural rather than aspirational: arcade code simply never
      calls this.

   2. Every game gets its chrome from UI.gameShell() and registers teardown
      with UI.onLeave(). The router runs onLeave before swapping screens, and
      it is the only thing stopping setInterval timers and rAF loops leaking
      between modes. A maths app has far more of those than chemistry did —
      every animated graph is one. */
window.MQ = window.MQ || {};

MQ.UI = (function () {
  const U = MQ.U;
  const S = MQ.State;
  const routes = {};
  /* A LIST, not a single handler. onLeave() used to replace whatever was
     registered, so a mode that called it after its shared chrome already had
     silently cancelled the chrome's teardown — the arcade ticket clock kept
     draining playtime after you left the game. Accumulating is the only shape
     that is safe to call from more than one layer. */
  let cleanups = [];

  /** Runs below this accuracy earn no completion bonus at all. */
  const MIN_BONUS_ACCURACY = 0.5;
  /** Answers faster than this can't have involved reading the question. */
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

    // Run every registered teardown. One throwing must not strand the others,
    // and must not block navigation.
    cleanups.forEach(fn => {
      try { fn(); } catch (e) { console.warn("teardown failed", e); }
    });
    cleanups = [];

    const view = U.$("#view");
    if (view.childNodes.length) MQ.Sound.nav();
    view.innerHTML = "";
    const result = fn(view, args);
    if (typeof result === "function") cleanups.push(result);

    const navKey = ({ play: "play", game: "play", arcade: "play" })[name] || name;
    U.$$(".nav-item").forEach(a => a.classList.toggle("on", a.dataset.nav === navKey));

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    view.focus({ preventScroll: true });
  }

  /**
   * Register a teardown for the current screen: timers, listeners, rAF loops.
   * Handlers ACCUMULATE — calling this twice registers two, it does not replace
   * the first. Shared chrome and the mode using it both need one.
   */
  function onLeave(fn) { if (typeof fn === "function") cleanups.push(fn); }

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
    U.$("#streak-count").textContent = d.streak.count;
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
      U.el("span", { class: "toast-ico", text: o.icon || "📐" }),
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

    const box = U.el("div", { class: "modal" + (o.center ? " modal-center" : "") + (o.wide ? " modal-wide" : "") });
    if (typeof content === "string") box.innerHTML = content;
    else box.appendChild(content);
    root.appendChild(box);

    // Sticky modals (run results, crate openings) are dismissed by their own buttons.
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
    modal(U.el("div", {}, [
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
    ]));
  }

  /* ── the reward pipeline ─────────────────────────────────── */
  /**
   * opts: { xp, bonus, accuracy, coins, at (element), silent, raw }
   *
   * The accuracy gate below is the whole reason this is one function. The
   * original chemistry design paid XP for correct answers with no penalty
   * for wrong ones, so mashing any option and finishing the run earned
   * 35,097 XP/hour. Four fixes were needed, and this is the one that has to
   * live somewhere no mode can skip.
   */
  function award(opts) {
    const o = opts || {};

    let bonus = Math.max(0, o.bonus || 0);
    if (o.accuracy !== undefined) {
      const acc = U.clamp(o.accuracy, 0, 1);
      // Below 50% the completion bonus is withheld ENTIRELY, not scaled down.
      bonus = acc < MIN_BONUS_ACCURACY ? 0 : Math.round(bonus * acc);
    }

    // Difficulty and ascension multipliers apply here and nowhere else.
    const mult = o.raw ? 1 : S.xpMultiplier();
    const xp = Math.round((Math.max(0, o.xp || 0) + bonus) * mult);
    // Primes are deliberately scarcer than XP: payouts scale to 60%.
    const coins = Math.round((o.coins || 0) * (o.raw ? 1 : 0.6));

    if (coins) S.addCoins(coins, true);
    const res = xp ? S.addXP(xp) : { levelsGained: 0, newLevel: S.data.level };
    if (!xp && coins) S.emit();
    res.xp = xp;
    res.coins = coins;
    res.multiplier = mult;

    if (o.at && xp && !o.silent) {
      const r = o.at.getBoundingClientRect();
      MQ.FX.floatText(r.left + r.width / 2 - 20, r.top - 6, "+" + xp + " XP");
    }
    if (coins && !o.silent) MQ.Sound.coin();

    if (res.levelsGained > 0) {
      MQ.Sound.levelUp();
      MQ.FX.confetti(110);
      toast({
        icon: "🎉", kind: "xp", ms: 3600,
        text: `<b>Level ${res.newLevel}!</b> You are now ${S.levelTitle(res.newLevel)} &middot; +${30 * res.newLevel} 🔢`
      });
      if (res.newLevel >= S.MAX_LEVEL) {
        setTimeout(() => toast({
          icon: "🔱", kind: "good", ms: 5000,
          text: "<b>Level 60.</b> You can now Ascend from the Progress screen."
        }), 1200);
      }
    }

    S.checkAchievements().forEach((a, i) => {
      setTimeout(() => {
        MQ.Sound.achievement();
        MQ.FX.confetti(60);
        toast({
          icon: a.icon, kind: "good", ms: 3800,
          text: `<b>${U.escapeHtml(a.name)}</b> unlocked${a.reward ? ` &middot; +${a.reward} 🔢` : ""}`
        });
      }, 500 + i * 900);
    });

    syncHeader();
    return res;
  }

  /* ── shared game chrome ──────────────────────────────────── */
  /**
   * Returns { root, body, meta } — append the playfield to `body`,
   * status chips to `meta`.
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
            () => go(o.backTo || "/play"), "Quit");
        } else go(o.backTo || "/play");
      } }
    });
    const head = U.el("div", { class: "ghead" }, [
      back,
      U.el("div", { class: "gtitle", text: title }),
      meta
    ]);
    if (o.help) {
      head.insertBefore(U.el("button", {
        class: "btn btn-sm btn-ghost", text: "?", title: "How this mode works",
        on: { click: () => modal(U.el("div", {}, [
          U.el("h2", { text: title }),
          U.el("p", { html: o.help }),
          U.el("button", { class: "btn btn-primary btn-block", text: "Got it", on: { click: closeModal } })
        ])) }
      }), meta);
    }
    return { root: U.el("div", { class: "gshell" }, [head, body]), body, meta };
  }

  /** Grade a run. */
  function rank(accuracy, bonus) {
    const score = accuracy + (bonus || 0);
    if (score >= 97) return { rank: "S", cls: "rank-s", blurb: "Flawless. Band 6 energy." };
    if (score >= 88) return { rank: "A", cls: "rank-a", blurb: "Excellent — you know this cold." };
    if (score >= 75) return { rank: "B", cls: "rank-b", blurb: "Solid. Tighten up the tricky ones." };
    if (score >= 60) return { rank: "C", cls: "rank-c", blurb: "Getting there. Review your mistakes." };
    return { rank: "D", cls: "rank-d", blurb: "Rough run — try the flashcards for this topic." };
  }

  /**
   * End-of-run summary modal.
   * opts: { title, correct, total, xp, coins, extraStats:[[label,value]],
   *         newBest, onAgain, bonus }
   */
  function results(opts) {
    const o = opts;
    const acc = U.pct(o.correct, o.total);
    const r = rank(acc, o.bonus);
    const perfect = o.total > 0 && o.correct === o.total;

    if (perfect) { MQ.Sound.perfect(); MQ.FX.confetti(140); }
    else if (acc >= 60) { MQ.Sound.win(); MQ.FX.confetti(70); }
    else MQ.Sound.lose();

    const cells = [
      ["Correct", `${o.correct}/${o.total}`],
      ["Accuracy", acc + "%"],
      ["XP", "+" + o.xp]
    ].concat(o.extraStats || []);

    modal(U.el("div", { class: "modal-center" }, [
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
      o.coins ? U.el("p", { class: "muted", html: `Earned <b>${o.coins}</b> 🔢 Primes` }) : null,
      U.el("div", { class: "row", style: "margin-top:8px" }, [
        U.el("button", {
          class: "btn btn-ghost btn-sm", text: "Back to games",
          on: { click: () => { closeModal(); go("/play"); } }
        }),
        U.el("div", { class: "spacer" }),
        U.el("button", {
          class: "btn btn-primary js-again", text: "Play again",
          on: { click: () => { closeModal(); o.onAgain(); } }
        })
      ])
    ]), { sticky: true });
  }

  /** Standard chip used by games for score / lives / timer. */
  function chip(text, cls) { return U.el("span", { class: "chip " + (cls || ""), text }); }

  /** A tier badge — small EXT marker, present but not smug. */
  function tierChip(topic) {
    if (MQ.DATA.tierOf(topic) !== "ME") return null;
    return U.el("span", { class: "chip chip-ext", text: "EXT", title: "Mathematics Extension 1" });
  }

/* ── the test introspection hook ────────────────────────────────
   MQ.__current holds whatever the mode currently expects, so tests/exploit.js
   can drive an HONEST player as well as a farming one. Measuring only the
   farming bot proves nothing by itself: a mode tightened until it pays nobody
   would score a perfect zero and look like a pass.

   This is not a security hole. Anyone with a console can already call
   State.addXP() directly — a client-side app cannot defend against its own
   owner, and there is no leaderboard to protect. The anti-farm measures exist
   to stop LAZY IN-APP farming, which is the behaviour a student actually
   drifts into. */

  /* ── boot ────────────────────────────────────────────────── */
  function init() {
    window.addEventListener("hashchange", handleRoute);
    S.onChange(syncHeader);
    syncHeader();
    handleRoute();
  }

  return { route, go, init, handleRoute, syncHeader, applyTheme, toast, modal, closeModal,
           confirmDialog, award, gameShell, results, rank, chip, tierChip, onLeave, pulse,
           MIN_BONUS_ACCURACY, MIN_READ_MS };
})();
