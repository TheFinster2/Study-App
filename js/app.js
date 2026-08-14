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

        /* Attached before anything else touches the registration, so no install can
           start and finish unnoticed. */
        reg.addEventListener("updatefound", () => {
          const incoming = reg.installing;
          if (!incoming) return;
          incoming.addEventListener("statechange", () => {
            // "installed" with an existing controller means an update is waiting,
            // rather than the very first install.
            if (incoming.state === "installed" && navigator.serviceWorker.controller) offerUpdate();
          });
        });

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
            /* Never hand over twice in a row. If this page load is itself the result
               of an update, applying whatever is waiting now would reload it again
               immediately — that is the flicker-then-double-refresh. Offer it instead:
               a second hand-over then needs a deliberate tap and cannot run away. */
            if (justUpdated()) offerUpdate();
            else applyUpdate(reg.waiting);
            return;
          }
          if (Date.now() < claimDeadline) { setTimeout(claimWaitingWorker, 200); return; }
          /* Nothing was pending from a previous visit. Only now go looking for a new
             version — anything found from here on arrives mid-session and gets the
             reload prompt rather than yanking the page out from under the player.
             Don't wait for the browser's own schedule: it only checks on a real
             navigation, and reopening an installed PWA usually just resumes the page.
             The exception is a page that has just applied an update: it is by
             definition current, so leave the network alone for a throttle window. */
          if (justUpdated()) lastCheck = Date.now();
          else checkForUpdate(true);
        })();
      }).catch(err => console.warn("Offline support unavailable:", err));

      // Coming back to the app is the natural moment to look for a new version.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") checkForUpdate();
      });

      let reloading = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || reloading) return;
        reloading = true;
        markUpdated();
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
  // Set when the player dismisses the prompt, so it stays dismissed for this session
  // instead of coming back on the next update check.
  let dismissed = false;

  /* An update-driven reload is recorded here so the page that comes back can tell
     itself apart from an ordinary launch. sessionStorage is exactly the right
     lifetime: it survives the reload and dies with the tab. The window is short —
     it only has to cover the boot sequence of the page that follows. */
  const UPDATED_KEY = "molequest:justUpdated";
  function markUpdated() {
    try { sessionStorage.setItem(UPDATED_KEY, String(Date.now())); } catch (e) {}
  }
  function justUpdated() {
    let t = 0;
    try { t = +sessionStorage.getItem(UPDATED_KEY) || 0; } catch (e) { return false; }
    return t > 0 && Date.now() - t < 30000;
  }

  /** Ask the server whether sw.js has changed. Throttled, since it is a network hit. */
  function checkForUpdate(force) {
    if (!swReg) return Promise.resolve("unsupported");
    if (applying) return Promise.resolve("found");
    if (force) dismissed = false;          // an explicit check wants to hear the answer

    /* A worker that is already installing or waiting IS the answer to "is there a new
       version?", and asking again is actively harmful: update() on a registration with
       a waiting worker makes Chromium install the very same script a second time. The
       worker the prompt is pointing at is left redundant — postMessage to it is
       discarded silently, so the Reload button stops doing anything — and the fresh
       one that replaces it can be claimed at the next boot, reloading a page that had
       only just reloaded. Since this runs on every visibilitychange, that churn
       repeated for as long as the app was open. Surface what is already there. */
    if (swReg.waiting) { offerUpdate(); return Promise.resolve("found"); }
    if (swReg.installing) return Promise.resolve("found");

    const t = Date.now();
    if (!force && t - lastCheck < 60000) return Promise.resolve("throttled");
    lastCheck = t;
    return swReg.update()
      .then(() => (swReg.installing || swReg.waiting) ? "found" : "current")
      .catch(() => "offline");
  }
  CHEM.checkForUpdate = checkForUpdate;

  /* Hand the page over to a waiting worker. Its activation fires controllerchange,
     which is what actually reloads us. The timer is the backstop: a worker can be
     made redundant by a later install, and a redundant worker swallows the message
     without ever activating, so the tap has to lead somewhere regardless. */
  function applyUpdate(worker) {
    if (applying) return;
    applying = true;
    const before = navigator.serviceWorker.controller;
    try { worker.postMessage("SKIP_WAITING"); }
    catch (e) { markUpdated(); location.reload(); return; }
    setTimeout(() => {
      // Still the same controller: the hand-over never happened. Reload anyway rather
      // than leaving the player looking at a prompt that did nothing.
      if (navigator.serviceWorker.controller === before) { markUpdated(); location.reload(); }
    }, 4000);
  }

  /* The prompt deliberately holds no reference to a worker. The one that was waiting
     when the bar appeared can be superseded by a later install, and a stale reference
     is indistinguishable from a broken button. Resolve the current waiting worker at
     tap time instead, and fall back to a plain reload if there is nothing to hand
     over to. */
  function offerUpdate() {
    if (updateBar || dismissed || applying) return;   // never stack two prompts
    const btn = U.el("button", {
      class: "btn btn-sm btn-primary", style: "margin-left:8px",
      text: "Reload"
    });
    btn.addEventListener("click", () => {
      btn.disabled = true;
      btn.textContent = "Updating…";
      const worker = swReg && swReg.waiting;
      if (worker) applyUpdate(worker);
      else { markUpdated(); location.reload(); }
    });
    updateBar = U.el("div", { class: "toast xp", style: "pointer-events:auto" }, [
      U.el("span", { class: "toast-ico", text: "⬆️" }),
      U.el("span", { text: "New version ready" }),
      btn,
      U.el("button", {
        class: "btn btn-sm btn-ghost", style: "margin-left:4px",
        text: "Later",
        on: { click: () => {
          dismissed = true;
          if (updateBar) { updateBar.remove(); updateBar = null; }
        } }
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
