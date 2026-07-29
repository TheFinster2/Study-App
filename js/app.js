/* Bootstrap: load the save, register routes, wire the chrome, start the app. */
(function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  S.load();

  // Apply saved preferences before the first paint of the UI.
  document.documentElement.dataset.theme =
    S.ownsTheme(S.data.profile.theme) ? S.data.profile.theme : "lab";
  CHEM.Sound.setEnabled(S.data.settings.sound);
  CHEM.FX.setReduced(!S.data.settings.motion);

  /* routes */
  UI.route("home",         view => CHEM.Screens.home(view));
  UI.route("play",         view => CHEM.Screens.play.screen(view));
  UI.route("game",   (view, args) => CHEM.Screens.play.dispatch(view, args));
  UI.route("study",  (view, args) => CHEM.Screens.study.screen(view, args));
  UI.route("progress",     view => CHEM.Screens.progress(view));
  UI.route("shop",         view => CHEM.Screens.shop(view));
  UI.route("arcade", (view, args) => CHEM.Arcade.screen(view, args));
  UI.route("achievements", view => CHEM.Screens.achievements(view));
  UI.route("settings",     view => CHEM.Screens.settings(view));

  /* chrome */
  U.$("#avatar-btn").addEventListener("click", () => CHEM.Screens.profileSheet());
  U.$("#settings-btn").addEventListener("click", () => UI.go("/settings"));
  U.$("#coin-pill").addEventListener("click", () => UI.go("/shop"));
  U.$("#streak-pill").addEventListener("click", () => UI.go("/progress"));

  // Persist immediately when the app is backgrounded or closed. `visibilitychange`
  // is the only event mobile browsers reliably fire before reclaiming a tab.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") S.flush();
  });
  window.addEventListener("pagehide", () => S.flush());

  // The first gesture anywhere unlocks the WebAudio context.
  const unlockAudio = () => { CHEM.Sound.click(); document.removeEventListener("pointerdown", unlockAudio); };
  document.addEventListener("pointerdown", unlockAudio);

  if (!location.hash) location.hash = "/home";

  UI.init();

  /* Welcome the player on a brand-new save. */
  if (S.data.stats.answered === 0 && Object.keys(S.data.history).length === 0) {
    setTimeout(() => {
      const box = U.el("div", { class: "modal-center" }, [
        U.el("div", { class: "modal-big", text: "⚗️" }),
        U.el("h2", { style: "justify-content:center", text: "Welcome to MoleQuest" }),
        U.el("p", { html:
          "A game-based trainer for <b>NSW HSC Chemistry</b>. Answer questions to earn XP and " +
          "<b>Moles</b> 🪙, level up, unlock lab skins, and take down the five Exam Bosses." }),
        U.el("div", { class: "grid", style: "text-align:left; margin:16px 0" }, [
          bullet("🎮", "Ten game modes", "Quizzes, equation balancing, a titration simulator, synthesis puzzles and more."),
          bullet("🃏", "Spaced repetition", "Flashcards resurface exactly when you're about to forget them."),
          bullet("🎯", "Adaptive questions", "Topics you miss come back more often until they stick."),
          bullet("🔥", "Daily streaks", "Show up every day for a growing XP bonus.")
        ]),
        U.el("button", {
          class: "btn btn-primary btn-block", text: "Let's react",
          on: { click: () => { UI.closeModal(); CHEM.Sound.win(); CHEM.FX.confetti(70); } }
        })
      ]);
      UI.modal(box, { sticky: true });
    }, 900);
  }

  function bullet(icon, title, desc) {
    return U.el("div", { class: "row", style: "gap:12px; align-items:flex-start" }, [
      U.el("div", { style: "font-size:22px", text: icon }),
      U.el("div", {}, [
        U.el("div", { style: "font-weight:700; font-size:13.5px", text: title }),
        U.el("div", { class: "tiny muted", text: desc })
      ])
    ]);
  }

  /* ── offline support ───────────────────────────────────────
     Registered only over http(s): service workers are unavailable on file://,
     and attempting it there throws. The app works fine either way. */
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      // Read this BEFORE registering: on a first visit there is no controller, and the
      // new worker's clients.claim() will fire controllerchange. That is not an update,
      // so it must not trigger a reload — otherwise every first load reloads itself.
      const hadController = !!navigator.serviceWorker.controller;

      /* updateViaCache:"none" keeps sw.js and anything it imports out of the browser's
         HTTP cache. The default ("imports") already bypasses it for the top-level
         script, but being explicit costs nothing and removes a whole class of
         "the server has v6 but the phone keeps installing v5" confusion. */
      navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(reg => {
        swReg = reg;

        /* A new worker may already be installed and waiting from a previous visit.
           `updatefound` fires once, when installation *starts* — it will never fire
           again for a worker that is already sitting in `waiting`, so without this
           the update is silently never applied and the app stays on the old version
           indefinitely. Applying it right at boot is safe: the session has only just
           started, so there is nothing in progress to interrupt.

           Re-checked over a short window rather than read once, because `reg.waiting`
           is not reliably populated by the time register() resolves — the browser
           attaches it a moment later. A single read found it most of the time and
           missed it perhaps one launch in four, and a miss is permanent: no event is
           ever coming for that worker.

           This has to finish BEFORE the app runs its own update check, not alongside
           it. Calling update() on a registration whose worker is already waiting makes
           Chromium install that same worker again, which fires `updatefound` — so a
           check racing the poll turned a silent, correct "apply the pending update"
           into a reload prompt that the user has to notice and accept, and dismissing
           it left them on the old version until the next launch, where the same thing
           happened again. That is the "updates take forever to arrive" symptom. */
        const claimDeadline = Date.now() + 2000;
        (function claimWaitingWorker() {
          if (reg.waiting && navigator.serviceWorker.controller) {
            applying = true;
            reg.waiting.postMessage("SKIP_WAITING");
            return;                       // controllerchange reloads the page
          }
          if (Date.now() < claimDeadline) { setTimeout(claimWaitingWorker, 200); return; }
          /* Nothing was pending from a previous visit. Only now go looking for a new
             version — anything found from here on arrives mid-session and gets the
             reload prompt rather than yanking the page out from under the player.
             Don't wait for the browser's own schedule: it only checks on a real
             navigation, and reopening an installed PWA usually just resumes the page. */
          checkForUpdate(true);
        })();

        reg.addEventListener("updatefound", () => {
          const incoming = reg.installing;
          if (!incoming) return;
          incoming.addEventListener("statechange", () => {
            // "installed" with an existing controller means an update is waiting,
            // rather than the very first install.
            if (incoming.state === "installed" && navigator.serviceWorker.controller && !applying) {
              offerUpdate(incoming);
            }
          });
        });
      }).catch(err => console.warn("Offline support unavailable:", err));

      // Coming back to the app is the natural moment to look for a new version.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") checkForUpdate();
      });

      let reloading = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || reloading) return;
        reloading = true;
        location.reload();
      });
    });
  }

  /* Kept module-wide so Settings can trigger a check by hand. */
  let swReg = null;
  let lastCheck = 0;
  let updateBar = null;
  // Set once a waiting worker has been told to take over, so the reload prompt does
  // not also appear for an update that is already being applied.
  let applying = false;

  /** Ask the server whether sw.js has changed. Throttled, since it is a network hit. */
  function checkForUpdate(force) {
    if (!swReg) return Promise.resolve("unsupported");
    const t = Date.now();
    if (!force && t - lastCheck < 60000) return Promise.resolve("throttled");
    lastCheck = t;
    return swReg.update()
      .then(() => (swReg.installing || swReg.waiting) ? "found" : "current")
      .catch(() => "offline");
  }
  CHEM.checkForUpdate = checkForUpdate;

  function offerUpdate(worker) {
    if (updateBar) return;                 // never stack two prompts
    updateBar = U.el("div", { class: "toast xp", style: "pointer-events:auto" }, [
      U.el("span", { class: "toast-ico", text: "⬆️" }),
      U.el("span", { text: "New version ready" }),
      U.el("button", {
        class: "btn btn-sm btn-primary", style: "margin-left:8px",
        text: "Reload",
        on: { click: () => worker.postMessage("SKIP_WAITING") }
      })
    ]);
    U.$("#toasts").appendChild(updateBar);
  }

  /* reveal the app */
  window.addEventListener("load", reveal);
  setTimeout(reveal, 1200);
  let revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    U.$("#boot").classList.add("gone");
    U.$("#topbar").hidden = false;
    U.$("#navbar").hidden = false;
    setTimeout(() => { const b = U.$("#boot"); if (b) b.remove(); }, 600);
    trackTopbarHeight();
  }

  /* Publish the sticky top bar's height as --topbar-h so anything else that wants to
     stick below it (the Pathway Puzzle track) lands in the right place. It is not a
     constant: the safe-area inset on a notched phone adds to it, and it changes on
     rotation, so measure rather than hardcode. */
  function trackTopbarHeight() {
    const bar = U.$("#topbar");
    if (!bar) return;
    const apply = () => {
      const h = Math.round(bar.getBoundingClientRect().height);
      if (h) document.documentElement.style.setProperty("--topbar-h", h + "px");
    };
    apply();
    if (window.ResizeObserver) new ResizeObserver(apply).observe(bar);
    else window.addEventListener("resize", apply);
  }
})();
