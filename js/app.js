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
  UI.route("achievements", view => CHEM.Screens.achievements(view));
  UI.route("settings",     view => CHEM.Screens.settings(view));

  /* chrome */
  U.$("#avatar-btn").addEventListener("click", () => CHEM.Screens.profileSheet());
  U.$("#settings-btn").addEventListener("click", () => UI.go("/settings"));
  U.$("#coin-pill").addEventListener("click", () => UI.go("/shop"));
  U.$("#streak-pill").addEventListener("click", () => UI.go("/progress"));

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
  }
})();
