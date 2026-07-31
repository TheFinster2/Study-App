/* ⚔️ Exam Bosses — HP duels with a per-question timer and a gimmick each.

   Beat one to unlock the next; all of them unlock The Final Paper, a mixed
   25-question gauntlet drawn from every enabled tier.

   The sixth boss is Extension-only and hides itself the same way Vector Lab
   and the Induction Builder do — via MQ.DATA.hasExt(), not a separate screen. */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.boss = (function () {
  const U = MQ.U, S = MQ.State, UI = MQ.UI;

  const BOSSES = [
    { id:"asymptote", icon:"📉", name:"The Asymptote", group:"Functions", hp:100, time:26,
      abilityText:"Heals 10% every third question — approaching full health without ever reaching it.",
      blurb:"It never quite dies on the first attempt. That is the joke." },
    { id:"radian", icon:"🔄", name:"Radian the Rotator", group:"Trig", hp:115, time:26,
      abilityText:"The answer options rotate position every 3 seconds.",
      blurb:"Read the answer, not the letter." },
    { id:"leibniz", icon:"📐", name:"Lord Leibniz", group:"Calculus", hp:130, time:24,
      abilityText:"Doubles the damage of your wrong answers.",
      blurb:"Notation is his; punishment is yours." },
    { id:"integrator", icon:"∫", name:"The Integrator", group:"Integration", hp:145, time:24,
      abilityText:"Hides the topic label. Its health bar is a shaded area that fills back in.",
      blurb:"You will not be told what you are integrating." },
    { id:"sigma", icon:"📊", name:"Sigma", group:"Statistics", hp:160, time:22,
      abilityText:"Randomises which of your power-ups are available each turn.",
      blurb:"Everything about this fight is a random variable." },
    { id:"inductor", icon:"🪜", name:"The Inductor", group:"Proof", hp:180, time:22, tier:"ME",
      abilityText:"Three phases mirroring base case, inductive step and conclusion. Fail a phase and you restart THAT PHASE, not the fight.",
      blurb:"It only has to work for k+1." }
  ];

  /** Bosses this build ships, with their unlock state. */
  function list() {
    const enabled = BOSSES.filter(b => !b.tier || MQ.DATA.TIERS.indexOf(b.tier) >= 0);
    return enabled.map((boss, i) => ({
      boss,
      unlocked: i === 0 || !!S.data.bossesBeaten[enabled[i - 1].id]
    }));
  }

  const allBeaten = () => list().every(e => S.data.bossesBeaten[e.boss.id]);
  const byId = id => BOSSES.find(b => b.id === id);

  function start(root, id) {
    if (id === "final") return finalPaper(root);
    const boss = byId(id);
    if (!boss) return UI.go("/play");

    const entry = list().find(e => e.boss.id === id);
    if (!entry || !entry.unlocked) {
      root.appendChild(U.el("div", { class: "empty" }, [
        U.el("div", { class: "empty-ico", text: "🔒" }),
        U.el("p", { text: "Beat the previous boss first." }),
        U.el("button", { class: "btn btn-primary", text: "Back to games", on: { click: () => UI.go("/play") } })
      ]));
      return;
    }

    S.markMode("boss");
    S.touchStreak();
    const diffMode = S.difficulty();
    MQ.Sound.bossIntro();

    const maxHp = boss.hp;
    const maxPlayer = 100;
    let bossHp = maxHp, playerHp = maxPlayer;
    let asked = 0, hits = 0, finished = false, tookDamage = false, revived = false;
    let phase = 1;                          // The Inductor only
    let phaseAsked = 0, phaseHits = 0;
    let shownAt = 0, card = null, question = null, rotateId = null;
    const perQ = Math.round(boss.time * diffMode.timeScale);
    let timeLeft = perQ, timerId = null;

    const shell = UI.gameShell(boss.icon + " " + boss.name, { confirmExit: true,
      help: `<b>${U.escapeHtml(boss.abilityText)}</b><br><br>` +
            "Correct answers damage the boss; wrong answers and timeouts damage you. " +
            "Adrenaline, if you own it, revives you once automatically." });
    root.appendChild(shell.root);

    const timerChip = U.el("span", { class: "timer-ring", text: U.fmtTime(timeLeft) });
    const phaseChip = boss.id === "inductor" ? UI.chip("Phase 1 / 3") : null;
    [phaseChip, timerChip].forEach(n => n && shell.meta.appendChild(n));

    const bossBar = U.el("i", { style: "width:100%" });
    const playerBar = U.el("i", { style: "width:100%" });
    const bossLabel = U.el("div", { class: "tiny muted", text: `${boss.name} · ${maxHp} HP` });
    const playerLabel = U.el("div", { class: "tiny muted", text: `You · ${maxPlayer} HP` });

    shell.body.appendChild(U.el("div", { class: "card" }, [
      U.el("div", { class: "row" }, [
        U.el("div", { style: "font-size:30px", text: boss.icon }),
        U.el("div", { style: "flex:1; min-width:0" }, [
          bossLabel,
          U.el("div", { class: "hpbar enemy", style: "margin-top:5px" }, [bossBar])
        ])
      ]),
      U.el("div", { class: "tiny muted", style: "margin-top:10px", text: boss.abilityText }),
      U.el("div", { style: "margin-top:12px" }, [
        playerLabel,
        U.el("div", { class: "hpbar", style: "margin-top:5px" }, [playerBar])
      ])
    ]));

    const stage = U.el("div");
    const puBar = U.el("div", { class: "powerups" });
    shell.body.appendChild(stage);
    shell.body.appendChild(puBar);

    UI.onLeave(() => {
      clearInterval(timerId);
      clearInterval(rotateId);
      document.removeEventListener("keydown", onKey);
    });
    document.addEventListener("keydown", onKey);
    function onKey(e) {
      if (!card || finished) return;
      const n = "1234".indexOf(e.key);
      if (n >= 0 && card.buttons[n] && !card.buttons[n].disabled) card.buttons[n].click();
    }

    function syncBars() {
      bossBar.style.width = U.clamp((bossHp / maxHp) * 100, 0, 100) + "%";
      playerBar.style.width = U.clamp((playerHp / maxPlayer) * 100, 0, 100) + "%";
      bossLabel.textContent = `${boss.name} · ${Math.max(0, Math.round(bossHp))} HP`;
      playerLabel.textContent = `You · ${Math.max(0, Math.round(playerHp))} HP`;
    }

    /* Sigma randomises which power-ups you may use each turn. */
    function renderPowerups() {
      puBar.innerHTML = "";
      const banned = diffMode.id === "nightmare" ? ["fifty", "skip"] : [];
      let defs = MQ.DATA.shop.powerups.filter(p =>
        p.id !== "revive" && p.id !== "double" && !banned.includes(p.id));
      if (boss.id === "sigma") defs = U.sample(defs, 2);

      defs.forEach(p => {
        const n = S.data.inventory[p.id] || 0;
        const b = U.el("button", { class: "pu", type: "button", title: p.desc, disabled: n <= 0 }, [
          U.el("span", { text: p.icon }), U.el("span", { text: p.name }),
          U.el("span", { class: "pu-n", text: "×" + n })
        ]);
        b.addEventListener("click", () => {
          if (!S.usePowerup(p.id)) return;
          if (p.id === "fifty") { MQ.Sound.puFifty(); card && card.fiftyFifty(); }
          if (p.id === "freeze") { MQ.Sound.puFreeze(); timeLeft += 15; timerChip.textContent = U.fmtTime(timeLeft); }
          if (p.id === "shield") { MQ.Sound.puShield(); UI.toast({ icon: "🛡️", text: "Buffer ready." }); }
          if (p.id === "insight") {
            MQ.Sound.puInsight();
            UI.toast({ icon: "🔍", ms: 5000, text: "<b>Insight:</b> " + U.escapeHtml(question.sub || question.topic) });
          }
          renderPowerups();
        });
        puBar.appendChild(b);
      });
    }

    function startClock() {
      clearInterval(timerId);
      timeLeft = perQ;
      timerChip.textContent = U.fmtTime(timeLeft);
      timerChip.classList.remove("low");
      timerId = setInterval(() => {
        timeLeft--;
        timerChip.textContent = U.fmtTime(Math.max(0, timeLeft));
        timerChip.classList.toggle("low", timeLeft <= 6);
        if (timeLeft <= 5 && timeLeft > 0) MQ.Sound.tickUrgent();
        if (timeLeft <= 0) { clearInterval(timerId); MQ.Sound.timeout(); resolve(false, true); }
      }, 1000);
    }

    function render() {
      clearInterval(rotateId);
      stage.innerHTML = "";
      const topics = MQ.Bank.groupTopics(boss.group);
      question = MQ.Bank.draw(1, { topics, adaptive: false })[0] || MQ.Bank.draw(1, { adaptive: false })[0];

      card = MQ.QuizCore.buildCard(question, {
        hideTopic: boss.id === "integrator",
        onAnswer: (chosen, ok) => resolve(ok, false, chosen)
      });
      stage.appendChild(card.node);
      shownAt = performance.now();
      startClock();
      renderPowerups();

      /* Radian's gimmick: the options physically move. Only the ORDER of the
         rendered buttons changes — the card's own mapping is untouched, so a
         rotation can never mark a correct answer wrong. */
      if (boss.id === "radian") {
        const wrap = card.node.querySelector(".choices");
        rotateId = setInterval(() => {
          if (finished) return;
          const nodes = Array.from(wrap.children);
          wrap.appendChild(nodes[0]);
          MQ.Sound.bossRotate();
        }, 3000);
      }
    }

    function resolve(ok, timedOut, chosen) {
      clearInterval(timerId);
      clearInterval(rotateId);
      if (finished) return;
      if (!timedOut) card.reveal(chosen);
      else card.disable();

      asked++;
      phaseAsked++;
      S.recordAnswer(question.topic, ok, question.id);
      const tooFast = performance.now() - shownAt < UI.MIN_READ_MS;

      if (ok && !tooFast) {
        hits++;
        phaseHits++;
        const dmg = 12 + (question.diff || 1) * 5;
        bossHp -= dmg;
        MQ.Sound.crit();
        MQ.FX.sparks(window.innerWidth / 2, window.innerHeight * 0.3, -Math.PI / 2);
      } else {
        if (S.data.inventory.shield > 0) {
          S.usePowerup("shield");
          MQ.Sound.shieldBlock();
          UI.toast({ icon: "🛡️", text: "<b>Buffer</b> absorbed the hit." });
        } else {
          // Lord Leibniz doubles the cost of being wrong.
          const base = 14 * diffMode.damage * (boss.id === "leibniz" ? 2 : 1);
          playerHp -= base;
          tookDamage = true;
          MQ.Sound.playerHurt();
          MQ.FX.shake();
        }
      }

      /* The Asymptote heals every third question — approaching full health
         without ever reaching it, because it heals a PROPORTION of the gap. */
      if (boss.id === "asymptote" && asked % 3 === 0 && bossHp > 0) {
        const gap = maxHp - bossHp;
        bossHp += gap * 0.35;
        MQ.Sound.asymptote();
        UI.toast({ icon: "📉", text: "The Asymptote closes 35% of the gap — but never reaches full." });
      }

      syncBars();

      /* The Inductor: three phases. Failing a phase restarts THAT PHASE. */
      if (boss.id === "inductor" && phaseAsked >= 4) {
        if (phaseHits >= 3) {
          phase++;
          phaseAsked = 0;
          phaseHits = 0;
          if (phase > 3) { bossHp = 0; }
          else {
            MQ.Sound.phaseUp();
            phaseChip.textContent = "Phase " + phase + " / 3";
            UI.toast({ icon: "🪜", kind: "good", ms: 3200,
              text: `<b>Phase ${phase - 1} holds.</b> ${phase === 2 ? "Now assume it for n = k." : "Now conclude."}` });
          }
        } else {
          phaseAsked = 0;
          phaseHits = 0;
          MQ.Sound.bossHeal();
          UI.toast({ icon: "↩️", kind: "bad", ms: 3200,
            text: `<b>Phase ${phase} fails.</b> Restart the phase — not the fight.` });
        }
        syncBars();
      }

      if (playerHp <= 0 && !revived && (S.data.inventory.revive || 0) > 0) {
        S.usePowerup("revive");
        revived = true;
        playerHp = maxPlayer * 0.4;
        MQ.Sound.puAdrenaline();
        UI.toast({ icon: "💉", kind: "good", ms: 3600, text: "<b>Adrenaline</b> — back on your feet at 40%." });
        syncBars();
      }

      const nextBtn = U.el("button", {
        class: "btn btn-primary js-next",
        text: bossHp <= 0 ? "Victory!" : playerHp <= 0 ? "See results" : "Continue →",
        on: { click: () => {
          if (bossHp <= 0) return finish(true);
          if (playerHp <= 0) return finish(false);
          render();
        } }
      });
      const fb = stage.querySelector(".feedback")
        || stage.appendChild(U.el("div", { class: "feedback " + (ok ? "ok" : "no") }, [
             U.el("div", { class: "math", html: timedOut ? "<b>Out of time.</b> " + U.math(question.why) : "" })
           ]));
      fb.appendChild(U.el("div", { class: "row", style: "margin-top:12px" }, [nextBtn]));
      nextBtn.focus();
    }

    function finish(won) {
      if (finished) return;
      finished = true;
      clearInterval(timerId);
      clearInterval(rotateId);
      document.removeEventListener("keydown", onKey);

      const accuracy = asked ? hits / asked : 0;
      if (won) {
        S.data.bossesBeaten[boss.id] = Date.now();
        S.bump("bossWins");
        if (!tookDamage) S.bump("flawlessBoss");
        if (playerHp <= maxPlayer * 0.15) S.bump("clutchWins");
        if (diffMode.id === "hard") S.bump("hardWins");
        if (diffMode.id === "nightmare") S.bump("nightmareWins");
        MQ.Sound.bossDefeat();
        MQ.FX.confetti(160);
      } else {
        MQ.Sound.lose();
      }

      const got = UI.award({
        xp: won ? Math.round(hits * 18 + 220) : Math.round(hits * 10),
        bonus: won ? 120 : 0, accuracy,
        coins: won ? 260 : Math.round(hits * 4)
      });

      /* H4: the title and the rank must not contradict each other. Both come
         from the same accuracy figure. */
      UI.results({
        title: won ? (tookDamage ? boss.name + " defeated" : boss.name + " defeated, untouched")
                   : "Defeated by " + boss.name,
        correct: hits, total: Math.max(asked, 1), xp: got.xp, coins: got.coins,
        newBest: won && S.recordScore("boss_" + boss.id, hits),
        extraStats: [
          ["Boss HP", Math.max(0, Math.round(bossHp))],
          ["Your HP", Math.max(0, Math.round(playerHp))],
          revived ? ["Revived", "yes"] : ["Questions", asked]
        ],
        onAgain: () => UI.handleRoute()
      });
    }

    syncBars();
    render();
    return () => { clearInterval(timerId); clearInterval(rotateId); };
  }

  /* ── The Final Paper ──────────────────────────────────────── */
  function finalPaper(root) {
    if (!allBeaten()) {
      root.appendChild(U.el("div", { class: "empty" }, [
        U.el("div", { class: "empty-ico", text: "🔒" }),
        U.el("h2", { style: "justify-content:center", text: "The Final Paper" }),
        U.el("p", { text: "Defeat every Exam Boss to unlock it." }),
        U.el("button", { class: "btn btn-primary", text: "Back to games", on: { click: () => UI.go("/play") } })
      ]));
      return;
    }

    /* A mixed 25-question gauntlet drawn from EVERY enabled tier, weighted
       towards the harder end — this is the exam, not a warm-up. */
    const questions = MQ.Bank.draw(25, { minDiff: 2, adaptive: false });
    return MQ.Games.quiz.start(root, {
      modeId: "final", title: "🎓 The Final Paper",
      questions: questions.length >= 20 ? questions : MQ.Bank.draw(25, { adaptive: false }),
      onFinish: r => {
        if (r.correct > (S.data.stats.finalPaperBest || 0)) {
          S.data.stats.finalPaperBest = r.correct;
          S.save();
        }
      }
    });
  }

  return { start, list, byId, allBeaten, BOSSES };
})();
