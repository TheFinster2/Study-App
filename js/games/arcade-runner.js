/* Mole Runner — a side-scrolling endless runner on canvas.
   Jump beakers and burners, duck under fume clouds. Speed ramps with distance. */
window.CHEM = window.CHEM || {};
CHEM.ArcadeGames = CHEM.ArcadeGames || {};

CHEM.ArcadeGames.runner = (function () {
  const U = CHEM.U;

  function start(stage, session) {
    const wrap = U.el("div", { class: "runner-wrap" });
    const canvas = U.el("canvas", { class: "runner-canvas" });
    const hint = U.el("div", { class: "tiny muted", style: "text-align:center; margin-top:8px",
      text: "Space / ↑ / tap to jump (hold for higher) · ↓ to duck" });
    wrap.appendChild(canvas);
    stage.appendChild(wrap);
    stage.appendChild(hint);

    const ctx = canvas.getContext("2d");
    const W = 800, H = 260;          // internal resolution; CSS scales it
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const GROUND = H - 44;
    const player = { x: 90, y: GROUND, vy: 0, w: 30, h: 38, ducking: false, onGround: true };
    const GRAVITY = 0.62;
    const JUMP_V = -11.4;

    let obstacles = [], particles = [], clouds = [];
    let speed = 6.2, distance = 0, spawnIn = 60;
    let dead = false, destroyed = false, raf = null;
    let holdingJump = false, jumpHeld = 0;
    let flashUntil = 0;

    const theme = () => {
      const cs = getComputedStyle(document.documentElement);
      const g = n => (cs.getPropertyValue(n) || "").trim();
      return { a: g("--glow-a") || "#39d6c8", b: g("--glow-b") || "#7c5cff",
               ink: g("--ink") || "#eef3ff", bad: g("--bad") || "#ff6b81",
               dim: g("--ink-faint") || "#6a7b9c" };
    };

    /* ── input ──────────────────────────────────────────────── */
    function jump() {
      if (dead) { restart(); return; }
      if (player.onGround) {
        player.vy = JUMP_V;
        player.onGround = false;
        holdingJump = true;
        jumpHeld = 0;
        CHEM.Sound.puSkip();
      }
    }
    function duck(on) {
      if (dead) return;
      player.ducking = on;
    }

    function onKeyDown(e) {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") { e.preventDefault(); jump(); }
      if (e.code === "ArrowDown" || e.code === "KeyS") { e.preventDefault(); duck(true); }
    }
    function onKeyUp(e) {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") holdingJump = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") duck(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Touch: tap the top half to jump, hold the bottom half to duck.
    let touchY = 0;
    function onTouchStart(e) {
      const r = canvas.getBoundingClientRect();
      touchY = e.touches[0].clientY - r.top;
      if (touchY > r.height * 0.62) duck(true); else jump();
      e.preventDefault();
    }
    function onTouchEnd() { holdingJump = false; duck(false); }
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("mousedown", jump);
    canvas.addEventListener("mouseup", () => { holdingJump = false; });

    /* ── world ──────────────────────────────────────────────── */
    function spawn() {
      // Fume clouds float at head height and must be ducked under.
      const kind = Math.random() < 0.28 && distance > 400 ? "fume" : "solid";
      if (kind === "fume") {
        obstacles.push({ kind, x: W + 40, y: GROUND - 58, w: 58, h: 26 });
      } else {
        const tall = Math.random() < 0.35;
        obstacles.push({ kind, x: W + 40, y: GROUND, w: tall ? 26 : 34, h: tall ? 46 : 30,
                         icon: tall ? "flask" : "burner" });
      }
      // Gap shrinks as speed rises, but never below a jumpable distance.
      spawnIn = Math.max(34, Math.round((78 - speed * 3) + Math.random() * 40));
    }

    function reset() {
      obstacles = []; particles = []; clouds = [];
      speed = 6.2; distance = 0; spawnIn = 70;
      player.y = GROUND; player.vy = 0; player.onGround = true; player.ducking = false;
      dead = false;
      for (let i = 0; i < 6; i++) clouds.push({ x: Math.random() * W, y: 30 + Math.random() * 70, s: 0.3 + Math.random() * 0.5 });
      session.setScore(0);
    }

    function restart() {
      reset();
      CHEM.Sound.gameStart();
    }

    function die() {
      if (dead) return;
      dead = true;
      flashUntil = performance.now() + 220;
      CHEM.Sound.explode();
      for (let i = 0; i < 26; i++) {
        particles.push({ x: player.x + 14, y: player.y - 18,
                         vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 6,
                         life: 40 + Math.random() * 25 });
      }
      // Let the explosion play, then hand the score to the session shell.
      setTimeout(() => { if (!destroyed) session.gameOver(`You ran ${Math.round(distance)} m.`); }, 700);
    }

    /* ── loop ───────────────────────────────────────────────── */
    function step() {
      if (destroyed) return;
      const t = theme();

      if (!dead) {
        distance += speed * 0.12;
        speed = Math.min(15.5, 6.2 + distance * 0.0032);
        session.setScore(Math.floor(distance));

        // Variable jump height: holding the key briefly sustains the rise.
        if (holdingJump && jumpHeld < 11 && player.vy < 0) {
          player.vy -= 0.34;
          jumpHeld++;
        }
        player.vy += GRAVITY;
        player.y += player.vy;
        if (player.y >= GROUND) { player.y = GROUND; player.vy = 0; player.onGround = true; }

        if (--spawnIn <= 0) spawn();

        const ph = player.ducking && player.onGround ? 20 : player.h;
        const py = player.y - ph;
        for (const o of obstacles) {
          o.x -= speed;
          const hit = player.x + player.w - 6 > o.x && player.x + 6 < o.x + o.w &&
                      py + 4 < o.y && py + ph > o.y - o.h;
          if (hit) die();
        }
        obstacles = obstacles.filter(o => o.x > -80);
      }

      clouds.forEach(c => { c.x -= c.s; if (c.x < -60) { c.x = W + 40; c.y = 25 + Math.random() * 75; } });
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.28; p.life--; });
      particles = particles.filter(p => p.life > 0);

      draw(t);
      raf = requestAnimationFrame(step);
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      // sky glow
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(255,255,255,0.04)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // background clouds
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      clouds.forEach(c => {
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 34, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // ground
      ctx.strokeStyle = t.dim;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 2);
      ctx.lineTo(W, GROUND + 2);
      ctx.stroke();

      // ground speckle, scrolling to convey speed
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      const off = (distance * 8) % 40;
      for (let x = -off; x < W; x += 40) ctx.fillRect(x, GROUND + 10, 14, 2);

      // obstacles
      obstacles.forEach(o => {
        if (o.kind === "fume") {
          ctx.fillStyle = "rgba(180,140,255,0.55)";
          ctx.beginPath();
          ctx.ellipse(o.x + o.w / 2, o.y - o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(180,140,255,0.28)";
          ctx.beginPath();
          ctx.ellipse(o.x + o.w / 2 - 12, o.y - o.h / 2 - 6, o.w / 3, o.h / 2.6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (o.icon === "flask") {
          ctx.fillStyle = t.a;
          ctx.beginPath();
          ctx.moveTo(o.x + 9, o.y - o.h);
          ctx.lineTo(o.x + 17, o.y - o.h);
          ctx.lineTo(o.x + o.w, o.y);
          ctx.lineTo(o.x, o.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = t.bad;
          ctx.fillRect(o.x, o.y - o.h, o.w, o.h);
          ctx.fillStyle = "rgba(255,200,80,0.9)";
          ctx.beginPath();
          ctx.ellipse(o.x + o.w / 2, o.y - o.h - 5, 7, 10, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // player
      if (!dead || performance.now() < flashUntil) {
        const ph = player.ducking && player.onGround ? 20 : player.h;
        ctx.fillStyle = t.ink;
        roundRect(player.x, player.y - ph, player.w, ph, 7);
        ctx.fill();
        // goggles
        ctx.fillStyle = t.b;
        ctx.fillRect(player.x + player.w - 13, player.y - ph + 7, 9, 6);
      }

      // debris
      particles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.life / 60);
        ctx.fillStyle = t.bad;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
      });

      // distance readout
      ctx.fillStyle = t.dim;
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.floor(distance) + " m", W - 14, 26);

      if (dead) {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = t.ink;
        ctx.font = "800 26px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Crashed", W / 2, H / 2 - 4);
        ctx.font = "500 14px system-ui, sans-serif";
        ctx.fillStyle = t.dim;
        ctx.fillText("Tap or press space to run again", W / 2, H / 2 + 22);
      }
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    reset();
    raf = requestAnimationFrame(step);

    return {
      destroy() {
        destroyed = true;
        cancelAnimationFrame(raf);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("resize", resize);
      }
    };
  }

  return { start };
})();
