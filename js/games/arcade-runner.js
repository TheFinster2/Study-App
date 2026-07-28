/* Mole Runner — a side-scrolling endless runner on canvas.
   Jump beakers and burners, duck under fume clouds. Speed ramps with distance.

   Pickups turn it from pure avoidance into something with decisions:
     🛡 Buffer    absorbs one hit, then breaks
     ⚡ Catalyst  a few seconds of smashing straight through obstacles
     ⚛ Electron   pure score, but usually placed somewhere awkward

   Two forgiveness rules do most of the work on feel: coyote time lets a jump
   land a few frames after running off an edge, and an early press is buffered
   so it fires the instant the player touches down. Without them a runner feels
   unresponsive in exactly the moments that matter most. */
window.CHEM = window.CHEM || {};
CHEM.ArcadeGames = CHEM.ArcadeGames || {};

CHEM.ArcadeGames.runner = (function () {
  const U = CHEM.U;

  function start(stage, session) {
    const wrap = U.el("div", { class: "runner-wrap" });
    const canvas = U.el("canvas", { class: "runner-canvas" });
    const hint = U.el("div", { class: "tiny muted", style: "text-align:center; margin-top:8px",
      text: "Space / ↑ / tap to jump (hold for higher) · ↓ to duck · grab 🛡 and ⚡" });
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
    const COYOTE = 6;                // frames of grace after leaving the ground
    const BUFFER = 8;                // frames an early jump press stays queued

    let obstacles = [], pickups = [], particles = [], clouds = [], props = [];
    let speed = 6.2, distance = 0, spawnIn = 60, pickupIn = 140;
    let dead = false, destroyed = false, raf = null;
    let holdingJump = false, jumpHeld = 0;
    let coyote = 0, buffered = 0;
    let flashUntil = 0;
    let shield = false, boostUntil = 0, invulnUntil = 0;
    let runPhase = 0, orbs = 0, nearMisses = 0;
    let shakeUntil = 0;

    const now = () => performance.now();
    const boosting = () => now() < boostUntil;

    const theme = () => {
      const cs = getComputedStyle(document.documentElement);
      const g = n => (cs.getPropertyValue(n) || "").trim();
      return { a: g("--glow-a") || "#39d6c8", b: g("--glow-b") || "#7c5cff",
               ink: g("--ink") || "#eef3ff", bad: g("--bad") || "#ff6b81",
               warn: g("--warn") || "#ffcc55", good: g("--good") || "#3fe08a",
               info: g("--info") || "#6fa8ff",
               dim: g("--ink-faint") || "#6a7b9c" };
    };

    /* ── input ──────────────────────────────────────────────── */
    function jump() {
      if (dead) { restart(); return; }
      buffered = BUFFER;               // remembered, then spent the moment it can be
      tryJump();
    }
    function tryJump() {
      if (buffered <= 0) return;
      if (!player.onGround && coyote <= 0) return;
      player.vy = JUMP_V;
      player.onGround = false;
      coyote = 0;
      buffered = 0;
      holdingJump = true;
      jumpHeld = 0;
      CHEM.Sound.puSkip();
      puff(player.x + 15, GROUND, 6, "rgba(255,255,255,0.5)");
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

    /* ── particles ──────────────────────────────────────────── */
    function puff(x, y, n, colour) {
      for (let i = 0; i < n; i++) {
        particles.push({ x, y, vx: (Math.random() - 0.3) * -2.4, vy: -Math.random() * 1.8,
                         life: 18 + Math.random() * 14, colour, size: 2 + Math.random() * 2 });
      }
    }

    /* ── world ──────────────────────────────────────────────── */
    function spawn() {
      // Fume clouds float at head height and must be ducked under.
      const kind = Math.random() < 0.28 && distance > 400 ? "fume" : "solid";
      if (kind === "fume") {
        obstacles.push({ kind, x: W + 40, y: GROUND - 58, w: 58, h: 26, passed: false });
      } else {
        const tall = Math.random() < 0.35;
        obstacles.push({ kind, x: W + 40, y: GROUND, w: tall ? 26 : 34, h: tall ? 46 : 30,
                         icon: tall ? "flask" : "burner", passed: false });
      }
      // Gap shrinks as speed rises, but never below a jumpable distance.
      spawnIn = Math.max(34, Math.round((78 - speed * 3) + Math.random() * 40));
    }

    function spawnPickup() {
      const roll = Math.random();
      // Buffers and catalysts are rare; electrons are the bread and butter.
      const kind = roll < 0.16 ? "shield" : roll < 0.30 ? "boost" : "orb";
      // Place them where they cost something: often mid-jump height.
      const high = Math.random() < 0.6;
      pickups.push({ kind, x: W + 30, y: high ? GROUND - 74 : GROUND - 26, r: 13, bob: Math.random() * 6 });
      pickupIn = Math.round(120 + Math.random() * 140);
    }

    function reset() {
      obstacles = []; pickups = []; particles = []; clouds = []; props = [];
      speed = 6.2; distance = 0; spawnIn = 70; pickupIn = 140;
      player.y = GROUND; player.vy = 0; player.onGround = true; player.ducking = false;
      dead = false; shield = false; boostUntil = 0; invulnUntil = 0;
      coyote = 0; buffered = 0; runPhase = 0; orbs = 0; nearMisses = 0;
      for (let i = 0; i < 6; i++)
        clouds.push({ x: Math.random() * W, y: 30 + Math.random() * 70, s: 0.3 + Math.random() * 0.5 });
      // Two parallax layers of lab silhouettes, the far one barely moving.
      for (let i = 0; i < 9; i++)
        props.push({ x: Math.random() * W, layer: i % 2, w: 24 + Math.random() * 46, h: 26 + Math.random() * 54 });
      session.setScore(0);
    }

    function restart() {
      reset();
      CHEM.Sound.gameStart();
    }

    function die() {
      if (dead) return;
      dead = true;
      flashUntil = now() + 220;
      CHEM.Sound.explode();
      for (let i = 0; i < 26; i++) {
        particles.push({ x: player.x + 14, y: player.y - 18,
                         vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 6,
                         life: 40 + Math.random() * 25, colour: null, size: 4 });
      }
      // Let the explosion play, then hand the score to the session shell.
      setTimeout(() => {
        if (!destroyed) session.gameOver(
          `You ran ${Math.round(distance)} m, collected ${orbs} electron${orbs === 1 ? "" : "s"}.`);
      }, 700);
    }

    /** A hit the player can survive: shield breaks, or the catalyst smashes through. */
    function absorb(o) {
      if (boosting()) {
        obstacles = obstacles.filter(x => x !== o);
        session.addScore(30);
        CHEM.Sound.explode();
        puff(o.x, o.y - o.h / 2, 10, null);
        return true;
      }
      if (shield) {
        shield = false;
        invulnUntil = now() + 900;
        obstacles = obstacles.filter(x => x !== o);
        CHEM.Sound.shieldBlock();
        shakeUntil = now() + 180;
        puff(player.x + 15, player.y - 20, 14, "rgba(120,220,255,0.8)");
        return true;
      }
      return now() < invulnUntil;
    }

    /* ── loop ───────────────────────────────────────────────── */
    function step() {
      if (destroyed) return;
      const t = theme();

      if (!dead) {
        distance += speed * 0.12;
        speed = Math.min(15.5, 6.2 + distance * 0.0032) * (boosting() ? 1.35 : 1);
        session.setScore(Math.floor(distance) + orbs * 25 + nearMisses * 5);

        // Variable jump height: holding the key briefly sustains the rise.
        if (holdingJump && jumpHeld < 11 && player.vy < 0) {
          player.vy -= 0.34;
          jumpHeld++;
        }
        const wasAir = !player.onGround;
        player.vy += GRAVITY;
        player.y += player.vy;
        if (player.y >= GROUND) {
          player.y = GROUND; player.vy = 0;
          if (wasAir) { puff(player.x + 6, GROUND, 7, "rgba(255,255,255,0.42)"); }
          player.onGround = true;
          coyote = COYOTE;
        } else if (player.onGround) {
          player.onGround = false;      // ran off something
          coyote = COYOTE;
        }
        if (!player.onGround && coyote > 0) coyote--;
        if (buffered > 0) { buffered--; tryJump(); }

        runPhase += speed * 0.06;
        if (player.onGround && Math.random() < 0.16)
          puff(player.x + 4, GROUND, 1, "rgba(255,255,255,0.22)");

        if (--spawnIn <= 0) spawn();
        if (--pickupIn <= 0) spawnPickup();

        const ph = player.ducking && player.onGround ? 20 : player.h;
        const py = player.y - ph;
        for (const o of obstacles.slice()) {
          o.x -= speed;
          const hit = player.x + player.w - 6 > o.x && player.x + 6 < o.x + o.w &&
                      py + 4 < o.y && py + ph > o.y - o.h;
          if (hit && !absorb(o)) die();
          // Squeaking past an obstacle is worth a little, so risk has a payoff.
          if (!o.passed && o.x + o.w < player.x) {
            o.passed = true;
            const gap = Math.abs((py + ph) - (o.y - o.h));
            if (gap < 16 && !boosting()) { nearMisses++; CHEM.Sound.tick(); }
          }
        }
        obstacles = obstacles.filter(o => o.x > -80);

        for (const p of pickups.slice()) {
          p.x -= speed;
          const dx = (player.x + player.w / 2) - p.x;
          const dy = (player.y - ph / 2) - p.y;
          if (dx * dx + dy * dy < (p.r + 20) * (p.r + 20)) {
            pickups = pickups.filter(x => x !== p);
            if (p.kind === "shield") { shield = true; CHEM.Sound.puShield(); }
            else if (p.kind === "boost") { boostUntil = now() + 4200; CHEM.Sound.puCatalyst(); }
            else { orbs++; CHEM.Sound.coin(); }
            puff(p.x, p.y, 8, t.a);
          }
        }
        pickups = pickups.filter(p => p.x > -40);
      }

      clouds.forEach(c => { c.x -= c.s; if (c.x < -60) { c.x = W + 40; c.y = 25 + Math.random() * 75; } });
      props.forEach(p => {
        p.x -= speed * (p.layer ? 0.34 : 0.16);
        if (p.x < -70) { p.x = W + Math.random() * 90; p.h = 26 + Math.random() * 54; }
      });
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.24; p.life--; });
      particles = particles.filter(p => p.life > 0);

      draw(t);
      raf = requestAnimationFrame(step);
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (now() < shakeUntil) ctx.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);

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

      // parallax lab silhouettes — far layer darker and slower
      props.forEach(p => {
        ctx.fillStyle = p.layer ? "rgba(255,255,255,0.075)" : "rgba(255,255,255,0.04)";
        ctx.fillRect(p.x, GROUND - p.h, p.w, p.h);
        ctx.fillRect(p.x + p.w * 0.3, GROUND - p.h - 9, p.w * 0.4, 9);
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
          // flickering burner flame
          const f = 8 + Math.sin(runPhase * 3 + o.x) * 3;
          ctx.fillStyle = "rgba(255,200,80,0.9)";
          ctx.beginPath();
          ctx.ellipse(o.x + o.w / 2, o.y - o.h - 5, 7, f, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // pickups, bobbing
      pickups.forEach(p => {
        const y = p.y + Math.sin(runPhase * 1.6 + p.bob) * 4;
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = p.kind === "shield" ? t.info : p.kind === "boost" ? t.warn : t.good;
        ctx.beginPath();
        ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = "#0b1220";
        ctx.font = "700 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.kind === "shield" ? "🛡" : p.kind === "boost" ? "⚡" : "⚛", p.x, y + 1);
        ctx.textBaseline = "alphabetic";
      });

      // player
      const blink = now() < invulnUntil && Math.floor(now() / 90) % 2 === 0;
      if ((!dead || now() < flashUntil) && !blink) {
        const ph = player.ducking && player.onGround ? 20 : player.h;
        // Squash on landing, stretch on the way up — cheap, and it reads instantly.
        const sy = player.onGround ? 1 : U.clamp(1 - player.vy * 0.012, 0.88, 1.12);
        const sx = 2 - sy;
        const cx = player.x + player.w / 2;
        ctx.save();
        ctx.translate(cx, player.y);
        ctx.scale(sx, sy);
        ctx.translate(-cx, -player.y);

        // legs, only while grounded
        if (player.onGround && !player.ducking) {
          ctx.strokeStyle = t.ink;
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          const swing = Math.sin(runPhase) * 7;
          ctx.beginPath();
          ctx.moveTo(cx - 4, player.y - 4); ctx.lineTo(cx - 4 + swing, player.y + 5);
          ctx.moveTo(cx + 4, player.y - 4); ctx.lineTo(cx + 4 - swing, player.y + 5);
          ctx.stroke();
        }
        ctx.fillStyle = boosting() ? t.warn : t.ink;
        roundRect(player.x, player.y - ph, player.w, ph, 7);
        ctx.fill();
        // goggles
        ctx.fillStyle = t.b;
        ctx.fillRect(player.x + player.w - 13, player.y - ph + 7, 9, 6);
        ctx.restore();

        // shield bubble
        if (shield) {
          ctx.strokeStyle = "rgba(120,220,255,0.85)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, player.y - ph / 2, 27, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // debris and dust
      particles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.life / 45);
        ctx.fillStyle = p.colour || t.bad;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;
      });

      // HUD
      ctx.fillStyle = t.dim;
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.floor(distance) + " m", W - 14, 26);
      if (orbs) { ctx.fillStyle = t.good; ctx.fillText("⚛ " + orbs, W - 14, 46); }
      if (boosting()) {
        const left = (boostUntil - now()) / 4200;
        ctx.fillStyle = t.warn;
        ctx.fillRect(14, 18, 90 * left, 6);
        ctx.font = "700 11px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("CATALYST", 14, 40);
      }

      ctx.restore();

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
