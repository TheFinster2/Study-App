/* Canvas particle effects: confetti, sparks, rising digits, floating XP.
   All of it disables itself under prefers-reduced-motion. */
window.MQ = window.MQ || {};

MQ.FX = (function () {
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let parts = [];
  let raf = null;
  let reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  if (canvas) { resize(); window.addEventListener("resize", resize); }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    parts = parts.filter(p => p.life > 0);

    for (const p of parts) {
      p.life--;
      p.vy += p.g;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;

      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life / p.fade);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
      } else if (p.shape === "ring") {
        ctx.strokeStyle = p.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.stroke();
      } else if (p.shape === "glyph") {
        ctx.font = "700 " + (p.size * 3.2) + "px system-ui, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.glyph, 0, 0);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
      }
      ctx.restore();
    }

    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }

  function start() { if (!raf && parts.length) raf = requestAnimationFrame(loop); }

  function themeColors() {
    const cs = getComputedStyle(document.documentElement);
    const grab = n => (cs.getPropertyValue(n) || "").trim() || "#39d6c8";
    return [grab("--glow-a"), grab("--glow-b"), grab("--good"), grab("--warn"), "#ffffff"];
  }

  function burst(x, y, opts) {
    if (!ctx || reduced) return;
    const o = opts || {};
    const n = o.count || 40;
    const colors = o.colors || themeColors();
    for (let i = 0; i < n; i++) {
      const angle = o.angle !== undefined ? o.angle + (Math.random() - 0.5) * (o.spread || 1.2)
                                          : Math.random() * Math.PI * 2;
      const speed = (o.speed || 6) * (0.4 + Math.random());
      parts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (o.lift || 0),
        g: o.gravity === undefined ? 0.22 : o.gravity,
        drag: o.drag || 0.985,
        size: (o.size || 5) * (0.5 + Math.random()),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: (o.life || 70) * (0.6 + Math.random() * 0.7),
        fade: 30,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        shape: o.shape || "square",
        glyph: o.glyphs ? o.glyphs[Math.floor(Math.random() * o.glyphs.length)] : null
      });
    }
    start();
  }

  /* Mathematical symbols, used instead of squares where the moment warrants it. */
  const GLYPHS = ["∫", "Σ", "π", "√", "∞", "θ", "Δ", "≠", "≤", "∂", "λ", "μ"];

  const api = {
    setReduced(v) { reduced = !!v; },

    /** Small pop at a screen point — correct answers. */
    pop(x, y) { burst(x, y, { count: 18, speed: 4.5, size: 4, life: 45, shape: "circle" }); },

    /** Full-width celebration rain. */
    confetti(strength) {
      if (reduced) return;
      const n = strength || 90;
      const w = window.innerWidth;
      const cols = themeColors();
      for (let i = 0; i < n; i++) {
        const glyph = Math.random() > 0.82;
        parts.push({
          x: Math.random() * w,
          y: -20 - Math.random() * 200,
          vx: (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 3,
          g: 0.12, drag: 0.995,
          size: 5 + Math.random() * 5,
          color: cols[Math.floor(Math.random() * 5)],
          life: 150 + Math.random() * 90, fade: 50,
          rot: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.25,
          shape: glyph ? "glyph" : (Math.random() > 0.4 ? "square" : "circle"),
          glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        });
      }
      start();
    },

    /** A shower of maths symbols — proofs, integrals, anything that "resolves". */
    symbols(x, y, n) {
      burst(x, y, { count: n || 22, speed: 5, size: 4, life: 80, gravity: 0.1,
                    shape: "glyph", glyphs: GLYPHS });
    },

    /** Rising motes — used when a limit converges or an area fills in. */
    rise(x, y) {
      if (reduced) return;
      const cols = themeColors();
      for (let i = 0; i < 26; i++) {
        parts.push({
          x: x + (Math.random() - 0.5) * 110,
          y: y + Math.random() * 30,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -1 - Math.random() * 2.2,
          g: -0.01, drag: 0.995,
          size: 2 + Math.random() * 6,
          color: cols[Math.floor(Math.random() * 3)],
          life: 90 + Math.random() * 60, fade: 40,
          rot: 0, spin: 0, shape: "ring"
        });
      }
      start();
    },

    /** Directional spark shower — hits in boss fights. */
    sparks(x, y, dir) {
      burst(x, y, { count: 26, angle: dir, spread: 1.6, speed: 8, size: 3,
                    life: 40, gravity: 0.35, shape: "circle" });
    },

    /** Floating "+25 XP" text at a screen position. */
    floatText(x, y, text, color) {
      const node = MQ.U.el("div", { class: "float-xp", text });
      node.style.left = x + "px";
      node.style.top = y + "px";
      if (color) node.style.color = color;
      document.body.appendChild(node);
      setTimeout(() => node.remove(), 1150);
    },

    /** Shake the main view — damage, wrong answers. */
    shake() {
      if (reduced) return;
      const v = document.getElementById("view");
      if (!v) return;
      v.classList.remove("screen-shake");
      void v.offsetWidth;
      v.classList.add("screen-shake");
      setTimeout(() => v.classList.remove("screen-shake"), 420);
    },

    /** Burst centred on an element. */
    burstAt(node, opts) {
      if (!node) return;
      const r = node.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, opts);
    }
  };

  return api;
})();
