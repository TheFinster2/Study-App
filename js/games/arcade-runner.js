/* 🏃 Vector Runner — an endless canvas runner. Jump the gaps, duck the ceiling.

   Awards no XP, no Primes and no achievements. It never calls UI.award(). */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.runner = (function () {
  const U = MQ.U, UI = MQ.UI;

  function start(root) {
    const cab = MQ.Arcade.cabinet("runner", "🏃 Vector Runner", {
      help: "Tap the top half of the canvas (or press ↑ / Space) to jump, the bottom half " +
            "(or ↓) to duck. Speed climbs the longer you survive." });
    root.appendChild(cab.root);

    const W = 800, H = 300;
    const canvas = U.el("canvas", { class: "runner-canvas", width: String(W), height: String(H) });
    cab.body.appendChild(U.el("div", { class: "arcade-stage" },
      [U.el("div", { class: "runner-wrap" }, [canvas])]));
    cab.body.appendChild(U.el("div", { class: "row", style: "justify-content:center; gap:8px" }, [
      U.el("button", { class: "btn", text: "⤒ Jump", on: { click: () => jump() } }),
      U.el("button", { class: "btn", text: "⤓ Duck", on: { pointerdown: () => (ducking = true),
                                                           pointerup: () => (ducking = false),
                                                           pointerleave: () => (ducking = false) } })
    ]));
    cab.body.appendChild(U.el("p", { class: "arcade-note",
      text: "No XP, no Primes, no achievements — a high score and nothing else." }));

    const ctx = canvas.getContext("2d");
    const GROUND = H - 46;

    let score = 0, dist = 0, speed = 5.2;
    let py = GROUND, vy = 0, ducking = false, dead = false;
    let obstacles = [];
    let raf = null, last = 0, spawnIn = 60;

    function jump() {
      if (dead) return;
      if (py >= GROUND - 1) { vy = -13.5; MQ.Sound.jump(); }
    }

    function onKey(e) {
      if (e.key === "ArrowUp" || e.key === " " || e.key === "w") { e.preventDefault(); jump(); }
      if (e.key === "ArrowDown" || e.key === "s") { ducking = true; MQ.Sound.duck(); }
    }
    function onKeyUp(e) { if (e.key === "ArrowDown" || e.key === "s") ducking = false; }
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKeyUp);

    canvas.addEventListener("pointerdown", e => {
      const r = canvas.getBoundingClientRect();
      if ((e.clientY - r.top) / r.height < 0.55) jump();
      else { ducking = true; MQ.Sound.duck(); }
    });
    canvas.addEventListener("pointerup", () => (ducking = false));
    canvas.addEventListener("pointerleave", () => (ducking = false));

    function palette() { return MQ.Draw.palette(); }

    function spawn() {
      // Alternate ground obstacles (jump) and overhead bars (duck).
      const overhead = Math.random() < 0.38;
      obstacles.push(overhead
        ? { x: W + 20, y: GROUND - 74, w: 26, h: 40, kind: "over" }
        : { x: W + 20, y: GROUND - 34, w: 22 + Math.random() * 20, h: 34, kind: "ground" });
      spawnIn = Math.max(34, 80 - dist / 400) + Math.random() * 34;
    }

    function loop(ts) {
      if (cab.isOver()) return stop();
      if (!last) last = ts;
      last = ts;

      dist += speed;
      speed = Math.min(13, 5.2 + dist / 2600);
      score = Math.floor(dist / 12);
      cab.setScore(score);

      vy += 0.72;
      py = Math.min(GROUND, py + vy);
      if (py >= GROUND) vy = 0;

      if (--spawnIn <= 0) spawn();
      obstacles.forEach(o => (o.x -= speed));
      obstacles = obstacles.filter(o => o.x > -60);

      // Collision. Ducking halves the runner's height, which is the whole
      // point of the overhead bars.
      const rh = ducking && py >= GROUND ? 20 : 40;
      const rTop = py - rh, rBot = py, rL = 60, rR = 60 + 24;
      for (const o of obstacles) {
        if (o.x < rR && o.x + o.w > rL && o.y + o.h > rTop && o.y < rBot) {
          dead = true;
          MQ.Sound.crash();
          MQ.FX.shake();
          return stop("Crashed");
        }
      }

      draw(rh);
      raf = requestAnimationFrame(loop);
    }

    function draw(rh) {
      const P = palette();
      ctx.clearRect(0, 0, W, H);

      // A moving vector field in the background — decorative, and on theme.
      ctx.save();
      ctx.strokeStyle = P.line;
      ctx.lineWidth = 1;
      for (let gx = -((dist * 0.4) % 60); gx < W; gx += 60) {
        for (let gy = 40; gy < GROUND; gy += 60) {
          const ang = Math.sin((gx + dist) * 0.004 + gy * 0.02) * 1.2;
          ctx.beginPath();
          ctx.moveTo(gx, gy);
          ctx.lineTo(gx + Math.cos(ang) * 16, gy + Math.sin(ang) * 16);
          ctx.stroke();
        }
      }
      ctx.restore();

      ctx.strokeStyle = P.faint;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();

      ctx.fillStyle = P.warn;
      obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

      ctx.fillStyle = P.accent;
      ctx.fillRect(60, py - rh, 24, rh);
      // A little velocity arrow, because it is Vector Runner.
      ctx.strokeStyle = P.good;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(86, py - rh / 2);
      ctx.lineTo(106, py - rh / 2 - vy * 0.9);
      ctx.stroke();
    }

    function stop(reason) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKeyUp);
      cab.stop(reason || "Ticket expired");
    }

    cab.onEnd(reason => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKeyUp);
      cab.gameOver(score, reason);
    });

    UI.onLeave(() => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKeyUp);
    });

    raf = requestAnimationFrame(loop);
  }

  return { start };
})();
