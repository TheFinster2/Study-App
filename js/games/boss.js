/* Exam Boss — timed HP duels. Each boss is themed on a module and has a gimmick. */
window.CHEM = window.CHEM || {};
CHEM.Games = CHEM.Games || {};

CHEM.Games.boss = (function () {
  const U = CHEM.U, S = CHEM.State, UI = CHEM.UI;

  const BOSSES = [
    { id: "b5", icon: "⚖️", name: "Le Chatelier, the Shifting", mods: ["M5"],
      hp: 110, playerHp: 100, seconds: 25, ability: "heal",
      taunt: "Disturb me and I shall simply… shift.",
      abilityText: "Every 3rd question, the boss shifts equilibrium and heals 12 HP." },
    { id: "b6", icon: "🧪", name: "The Titration Titan", mods: ["M6"],
      hp: 130, playerHp: 100, seconds: 22, ability: "drain",
      taunt: "One drop too many and it's over.",
      abilityText: "A tighter clock — 22 seconds per question, dropping as its HP falls." },
    { id: "b7", icon: "🕸️", name: "Carbon the Chainmaster", mods: ["M7"],
      hp: 150, playerHp: 100, seconds: 25, ability: "double",
      taunt: "Every bond you break, I will reform.",
      abilityText: "Wrong answers hit you for double damage." },
    { id: "b8", icon: "👁️", name: "Spectra, the Unknown", mods: ["M8"],
      hp: 165, playerHp: 100, seconds: 25, ability: "obscure",
      taunt: "You will not know what you are looking at.",
      abilityText: "Module and topic labels are hidden — identify the chemistry yourself." },
    { id: "bf", icon: "📜", name: "The Final Paper", mods: ["M5", "M6", "M7", "M8"],
      hp: 240, playerHp: 100, seconds: 20, ability: "all",
      taunt: "Three hours. No reading time.",
      abilityText: "Every gimmick at once. Beat the other four bosses first." }
  ];

  function unlocked(boss, i) {
    if (i === 0) return true;
    if (boss.id === "bf") return BOSSES.slice(0, 4).every(b => S.data.bossesBeaten[b.id]);
    return !!S.data.bossesBeaten[BOSSES[i - 1].id];
  }

  function list() { return BOSSES.map((b, i) => ({ boss: b, unlocked: unlocked(b, i) })); }

  function start(root, bossId) {
    const boss = BOSSES.find(b => b.id === bossId) || BOSSES[0];
    const i = BOSSES.indexOf(boss);
    if (!unlocked(boss, i)) {
      UI.toast({ icon: "🔒", kind: "bad", text: "Defeat the previous boss first." });
      return UI.go("/play");
    }

    S.markMode("boss");
    S.touchStreak();

    const ability = boss.ability;
    const obscure = ability === "obscure" || ability === "all";
    const doubleDmg = ability === "double" || ability === "all";
    const heals = ability === "heal" || ability === "all";
    const drains = ability === "drain" || ability === "all";

    let bossHp = boss.hp, playerHp = boss.playerHp;
    let asked = 0, correct = 0, streak = 0, timerId = null;
    let questions = CHEM.Bank.draw(40, { mods: boss.mods, adaptive: false });
    let qIndex = 0, timeLeft = boss.seconds, finished = false, tookDamage = false;

    const shell = UI.gameShell("Boss: " + boss.name, { confirmExit: true });
    root.appendChild(shell.root);
    const timerChip = U.el("span", { class: "timer-ring", text: String(timeLeft) });
    shell.meta.appendChild(timerChip);

    const bossBar = U.el("i");
    const playerBar = U.el("i");
    const bossFace = U.el("div", { style: "font-size:44px; line-height:1", text: boss.icon });

    const hud = U.el("div", { class: "qcard" }, [
      U.el("div", { class: "row" }, [
        bossFace,
        U.el("div", { style: "flex:1; min-width:0" }, [
          U.el("div", { class: "row", style: "gap:6px" }, [
            U.el("b", { text: boss.name }),
            U.el("span", { class: "spacer" }),
            U.el("span", { class: "tiny muted js-bosshp", text: `${bossHp} / ${boss.hp}` })
          ]),
          U.el("div", { class: "hpbar enemy", style: "margin-top:6px" }, [bossBar])
        ])
      ]),
      U.el("p", { class: "tiny muted", style: "margin:10px 0 0", text: "“" + boss.taunt + "”" }),
      U.el("div", { class: "row", style: "margin-top:12px" }, [
        U.el("span", { text: "🧑‍🔬" }),
        U.el("div", { style: "flex:1" }, [U.el("div", { class: "hpbar" }, [playerBar])]),
        U.el("span", { class: "tiny muted js-playerhp", text: `${playerHp} / ${boss.playerHp}` })
      ]),
      U.el("p", { class: "tiny", style: "margin:10px 0 0; color:var(--warn)", text: "⚡ " + boss.abilityText })
    ]);
    shell.body.appendChild(hud);

    const stage = U.el("div");
    shell.body.appendChild(stage);

    function paintHp() {
      bossBar.style.width = U.clamp((bossHp / boss.hp) * 100, 0, 100) + "%";
      playerBar.style.width = U.clamp((playerHp / boss.playerHp) * 100, 0, 100) + "%";
      U.$(".js-bosshp", hud).textContent = `${Math.max(0, Math.round(bossHp))} / ${boss.hp}`;
      U.$(".js-playerhp", hud).textContent = `${Math.max(0, Math.round(playerHp))} / ${boss.playerHp}`;
    }
    paintHp();

    function questionTime() {
      if (!drains) return boss.seconds;
      // The Titan speeds up as it gets desperate.
      const frac = bossHp / boss.hp;
      return Math.max(12, Math.round(boss.seconds * (0.7 + frac * 0.3)));
    }

    function renderQuestion() {
      if (finished) return;
      if (qIndex >= questions.length) {
        questions = questions.concat(CHEM.Bank.draw(20, { mods: boss.mods, adaptive: false }));
      }
      const q = questions[qIndex];
      asked++;
      stage.innerHTML = "";

      const card = CHEM.QuizCore.buildCard(q, {
        showTags: !obscure,
        onAnswer: (chosen, ok, btn) => resolve(q, card, chosen, ok, btn)
      });
      stage.appendChild(card.node);

      timeLeft = questionTime();
      timerChip.textContent = String(timeLeft);
      timerChip.classList.remove("low");
      clearInterval(timerId);
      timerId = setInterval(() => {
        timeLeft--;
        timerChip.textContent = String(Math.max(0, timeLeft));
        timerChip.classList.toggle("low", timeLeft <= 5);
        if (timeLeft <= 3 && timeLeft > 0) CHEM.Sound.tick();
        if (timeLeft <= 0) {
          clearInterval(timerId);
          resolve(q, card, -1, false, null, true);
        }
      }, 1000);
    }

    function resolve(q, card, chosen, ok, btn, timedOut) {
      clearInterval(timerId);
      const fb = card.reveal(chosen);
      S.recordAnswer(q.mod, ok, q.id);

      if (ok) {
        correct++; streak++;
        S.noteStreak(streak);
        // Faster answers hit harder.
        const speed = U.clamp(timeLeft / questionTime(), 0, 1);
        const dmg = Math.round((9 + (q.diff || 1) * 5) * (1 + speed * 0.6) * (1 + Math.min(streak, 6) * 0.06));
        bossHp -= dmg;
        CHEM.Sound.hit();
        const r = bossFace.getBoundingClientRect();
        CHEM.FX.sparks(r.left + r.width / 2, r.top + r.height / 2, Math.PI * 1.5);
        CHEM.FX.floatText(r.right + 6, r.top, "−" + dmg, "var(--bad)");
        fb.appendChild(U.el("div", { class: "tiny", style: "margin-top:8px; color:var(--good)",
          text: `You deal ${dmg} damage.` }));
      } else {
        streak = 0;
        let dmg = Math.round(10 + (q.diff || 1) * 4);
        if (doubleDmg) dmg *= 2;
        if (timedOut) dmg = Math.round(dmg * 1.2);
        playerHp -= dmg;
        tookDamage = true;
        CHEM.Sound.explode();
        CHEM.FX.shake();
        fb.appendChild(U.el("div", { class: "tiny", style: "margin-top:8px; color:var(--bad)",
          text: `${timedOut ? "Out of time — " : ""}you take ${dmg} damage.` }));
      }

      if (heals && asked % 3 === 0 && bossHp > 0) {
        bossHp = Math.min(boss.hp, bossHp + 12);
        UI.toast({ icon: "⚖️", kind: "bad", text: "<b>Equilibrium shifts</b> — the boss recovers 12 HP." });
      }
      paintHp();

      if (bossHp <= 0) return setTimeout(() => end(true), 700);
      if (playerHp <= 0) return setTimeout(() => end(false), 700);

      const next = U.el("button", {
        class: "btn btn-primary", text: "Continue ⚔️",
        on: { click: () => { qIndex++; renderQuestion(); } }
      });
      fb.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [next]));
      next.focus();
    }

    function end(won) {
      if (finished) return;
      finished = true;
      clearInterval(timerId);

      const clutch = won && playerHp <= boss.playerHp * 0.1;
      const flawless = won && !tookDamage;

      if (won) {
        S.bump("bossWins");
        if (flawless) S.bump("flawlessBoss");
        if (clutch) S.bump("clutchWins");
        if (!S.data.bossesBeaten[boss.id]) {
          S.data.bossesBeaten[boss.id] = Date.now();
          S.save();
        }
      }

      const xp = won ? Math.round(220 + boss.hp * 1.2 + (flawless ? 200 : 0) + correct * 8) : Math.round(correct * 10);
      const coins = won ? Math.round(120 + boss.hp * 0.5 + (flawless ? 100 : 0)) : Math.round(correct * 3);
      const newBest = S.recordScore("boss_" + boss.id, won ? Math.round(playerHp) : 0);

      UI.award({ xp, coins });
      UI.results({
        title: won ? `${boss.name} defeated!` : "Defeated…",
        correct, total: asked, xp, coins, newBest,
        bonus: won ? 10 : -20,
        extraStats: [
          ["Your HP", Math.max(0, Math.round(playerHp))],
          ["Boss HP", Math.max(0, Math.round(bossHp))],
          [flawless ? "Flawless" : clutch ? "Clutch" : "Result", won ? "WIN" : "LOSS"]
        ],
        onAgain: () => UI.go("/game/boss/" + boss.id)
      });
    }

    UI.onLeave(() => clearInterval(timerId));
    renderQuestion();
  }

  return { start, list, BOSSES };
})();
