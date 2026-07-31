/* Canvas drawing: cartesian plots, curves, shaded areas, tangents,
   trapezoids, vectors, projectiles and normal curves.

   Read the Curve, the Calculus Lab and the Vector Lab all render through
   here, which is why the graph itself is infinitely generatable — the
   chemistry app needed 28 hand-drawn compounds for the equivalent mode.

   Colours are pulled from the live CSS custom properties, so every plot
   follows the player's theme without a per-theme code path. */
window.MQ = window.MQ || {};

MQ.Draw = (function () {
  const U = MQ.U;

  function themeColour(name, fallback) {
    const cs = getComputedStyle(document.documentElement);
    return (cs.getPropertyValue(name) || "").trim() || fallback;
  }

  function palette() {
    return {
      ink:   themeColour("--ink", "#eef3ff"),
      dim:   themeColour("--ink-dim", "#9fb0d0"),
      faint: themeColour("--ink-faint", "#6a7b9c"),
      line:  themeColour("--line", "rgba(255,255,255,.10)"),
      accent:themeColour("--accent", "#39d6c8"),
      glowA: themeColour("--glow-a", "#39d6c8"),
      glowB: themeColour("--glow-b", "#7c5cff"),
      good:  themeColour("--good", "#3fe08a"),
      bad:   themeColour("--bad", "#ff6b81"),
      warn:  themeColour("--warn", "#ffcc55"),
      info:  themeColour("--info", "#6fa8ff")
    };
  }

  /**
   * Size a canvas for the device pixel ratio and return a drawing context
   * with a world→screen mapping already installed.
   *
   * opts: { xmin, xmax, ymin, ymax, pad }
   * Returns { ctx, W, H, X(x), Y(y), invX(px), invY(py), P (palette) }
   */
  function frame(canvas, opts) {
    const o = opts || {};
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth || o.width || 320;
    const H = canvas.clientHeight || o.height || 220;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const pad = o.pad === undefined ? 8 : o.pad;
    const xmin = o.xmin === undefined ? -5 : o.xmin;
    const xmax = o.xmax === undefined ? 5 : o.xmax;
    const ymin = o.ymin === undefined ? -5 : o.ymin;
    const ymax = o.ymax === undefined ? 5 : o.ymax;

    const X = x => pad + ((x - xmin) / (xmax - xmin)) * (W - pad * 2);
    const Y = y => H - pad - ((y - ymin) / (ymax - ymin)) * (H - pad * 2);
    const invX = px => xmin + ((px - pad) / (W - pad * 2)) * (xmax - xmin);
    const invY = py => ymin + ((H - pad - py) / (H - pad * 2)) * (ymax - ymin);

    return { ctx, W, H, X, Y, invX, invY, xmin, xmax, ymin, ymax, P: palette() };
  }

  /** Grid, axes, ticks and labels. `step` in world units; 0 disables the grid. */
  function axes(f, opts) {
    const o = opts || {};
    const { ctx, P } = f;
    const stepX = o.stepX === undefined ? niceStep(f.xmax - f.xmin) : o.stepX;
    const stepY = o.stepY === undefined ? niceStep(f.ymax - f.ymin) : o.stepY;

    if (stepX > 0 && o.grid !== false) {
      ctx.strokeStyle = P.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(f.xmin / stepX) * stepX; x <= f.xmax; x += stepX) {
        ctx.moveTo(f.X(x), f.Y(f.ymin)); ctx.lineTo(f.X(x), f.Y(f.ymax));
      }
      for (let y = Math.ceil(f.ymin / stepY) * stepY; y <= f.ymax; y += stepY) {
        ctx.moveTo(f.X(f.xmin), f.Y(y)); ctx.lineTo(f.X(f.xmax), f.Y(y));
      }
      ctx.stroke();
    }

    ctx.strokeStyle = P.faint;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (f.ymin <= 0 && f.ymax >= 0) { ctx.moveTo(f.X(f.xmin), f.Y(0)); ctx.lineTo(f.X(f.xmax), f.Y(0)); }
    if (f.xmin <= 0 && f.xmax >= 0) { ctx.moveTo(f.X(0), f.Y(f.ymin)); ctx.lineTo(f.X(0), f.Y(f.ymax)); }
    ctx.stroke();

    if (o.labels !== false && stepX > 0) {
      ctx.fillStyle = P.faint;
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const y0 = U.clamp(f.Y(0), 4, f.H - 14);
      for (let x = Math.ceil(f.xmin / stepX) * stepX; x <= f.xmax; x += stepX) {
        if (Math.abs(x) < 1e-9) continue;
        ctx.fillText(labelFor(x, o.piLabels), f.X(x), y0 + 3);
      }
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const x0 = U.clamp(f.X(0), 16, f.W - 4);
      for (let y = Math.ceil(f.ymin / stepY) * stepY; y <= f.ymax; y += stepY) {
        if (Math.abs(y) < 1e-9) continue;
        ctx.fillText(U.fmtNum(U.sigFig(y, 3)), x0 - 4, f.Y(y));
      }
    }
    return f;
  }

  /** Axis labels in multiples of π, for trig graphs. */
  function labelFor(x, piLabels) {
    if (!piLabels) return U.fmtNum(U.sigFig(x, 3));
    const k = x / Math.PI;
    const r = Math.round(k * 12) / 12;
    if (Math.abs(k - r) > 1e-6) return U.fmtNum(U.sigFig(x, 2));
    if (Math.abs(r) < 1e-9) return "0";
    const sign = r < 0 ? "−" : "";
    const a = Math.abs(r);
    const den = [1, 2, 3, 4, 6, 12].find(d => Math.abs(a * d - Math.round(a * d)) < 1e-6) || 1;
    const num = Math.round(a * den);
    const top = num === 1 ? "π" : num + "π";
    return sign + (den === 1 ? top : top + "/" + den);
  }

  function niceStep(span) {
    const raw = span / 8;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    return (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  }

  /**
   * Plot y = f(x). Breaks the path at poles and at anything off-canvas, so
   * asymptotes read as gaps rather than as near-vertical lines joining
   * +inf to −inf — which is what a naive lineTo loop draws.
   */
  function curve(f, fn, opts) {
    const o = opts || {};
    const { ctx } = f;
    ctx.save();
    ctx.strokeStyle = o.colour || f.P.accent;
    ctx.lineWidth = o.width || 2.4;
    ctx.lineJoin = "round";
    if (o.dash) ctx.setLineDash(o.dash);

    const from = o.from === undefined ? f.xmin : o.from;
    const to = o.to === undefined ? f.xmax : o.to;
    const steps = o.steps || 420;
    const jumpLimit = (f.ymax - f.ymin) * 0.6;

    ctx.beginPath();
    let prevY = null, drawing = false;
    for (let i = 0; i <= steps; i++) {
      const x = from + ((to - from) * i) / steps;
      let y;
      try { y = fn(x); } catch (e) { y = NaN; }
      const onScreen = isFinite(y) && y >= f.ymin - jumpLimit && y <= f.ymax + jumpLimit;
      const jumped = prevY !== null && Math.abs(y - prevY) > jumpLimit;
      if (!onScreen || jumped) { drawing = false; prevY = isFinite(y) ? y : null; continue; }
      if (!drawing) { ctx.moveTo(f.X(x), f.Y(y)); drawing = true; }
      else ctx.lineTo(f.X(x), f.Y(y));
      prevY = y;
    }
    ctx.stroke();
    ctx.restore();
    return f;
  }

  /** Shade the region between a curve and the x-axis (or between two curves). */
  function shade(f, fn, a, b, opts) {
    const o = opts || {};
    const { ctx } = f;
    const base = o.under || (() => 0);
    ctx.save();
    ctx.fillStyle = o.colour || `color-mix(in srgb, ${f.P.accent} 28%, transparent)`;
    ctx.globalAlpha = o.alpha === undefined ? 0.32 : o.alpha;
    ctx.beginPath();
    const steps = o.steps || 160;
    for (let i = 0; i <= steps; i++) {
      const x = a + ((b - a) * i) / steps;
      const y = U.clamp(fn(x), f.ymin, f.ymax);
      if (i === 0) ctx.moveTo(f.X(x), f.Y(y)); else ctx.lineTo(f.X(x), f.Y(y));
    }
    for (let i = steps; i >= 0; i--) {
      const x = a + ((b - a) * i) / steps;
      ctx.lineTo(f.X(x), f.Y(U.clamp(base(x), f.ymin, f.ymax)));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return f;
  }

  /** Trapezoidal strips — the visual half of the trapezoidal-rule question. */
  function trapezoids(f, fn, a, b, n, opts) {
    const o = opts || {};
    const { ctx } = f;
    const h = (b - a) / n;
    ctx.save();
    ctx.strokeStyle = o.colour || f.P.warn;
    ctx.fillStyle = o.colour || f.P.warn;
    ctx.lineWidth = 1.4;
    for (let i = 0; i < n; i++) {
      const x0 = a + i * h, x1 = x0 + h;
      const y0 = fn(x0), y1 = fn(x1);
      ctx.globalAlpha = 0.16;
      ctx.beginPath();
      ctx.moveTo(f.X(x0), f.Y(0));
      ctx.lineTo(f.X(x0), f.Y(y0));
      ctx.lineTo(f.X(x1), f.Y(y1));
      ctx.lineTo(f.X(x1), f.Y(0));
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.85;
      ctx.stroke();
    }
    ctx.restore();
    return f;
  }

  /** A straight line through (px, py) with the given gradient. */
  function line(f, px, py, m, opts) {
    const o = opts || {};
    const { ctx } = f;
    ctx.save();
    ctx.strokeStyle = o.colour || f.P.warn;
    ctx.lineWidth = o.width || 2;
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath();
    ctx.moveTo(f.X(f.xmin), f.Y(py + m * (f.xmin - px)));
    ctx.lineTo(f.X(f.xmax), f.Y(py + m * (f.xmax - px)));
    ctx.stroke();
    ctx.restore();
    return f;
  }

  function point(f, x, y, opts) {
    const o = opts || {};
    const { ctx } = f;
    ctx.save();
    ctx.fillStyle = o.colour || f.P.warn;
    ctx.strokeStyle = o.ring || f.P.ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(f.X(x), f.Y(y), o.r || 5, 0, Math.PI * 2);
    ctx.fill();
    if (o.ring !== false) ctx.stroke();
    ctx.restore();
    return f;
  }

  function label(f, x, y, text, opts) {
    const o = opts || {};
    const { ctx } = f;
    ctx.save();
    ctx.fillStyle = o.colour || f.P.dim;
    ctx.font = (o.bold ? "700 " : "") + (o.size || 11) + "px system-ui, sans-serif";
    ctx.textAlign = o.align || "left";
    ctx.textBaseline = o.baseline || "bottom";
    ctx.fillText(text, f.X(x) + (o.dx || 0), f.Y(y) + (o.dy || 0));
    ctx.restore();
    return f;
  }

  /** An arrow from world (x0,y0) to (x1,y1) — vectors, projections, resultants. */
  function arrow(f, x0, y0, x1, y1, opts) {
    const o = opts || {};
    const { ctx } = f;
    const px0 = f.X(x0), py0 = f.Y(y0), px1 = f.X(x1), py1 = f.Y(y1);
    const ang = Math.atan2(py1 - py0, px1 - px0);
    const head = o.head || 9;
    ctx.save();
    ctx.strokeStyle = o.colour || f.P.accent;
    ctx.fillStyle = o.colour || f.P.accent;
    ctx.lineWidth = o.width || 2.6;
    ctx.lineCap = "round";
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath();
    ctx.moveTo(px0, py0);
    ctx.lineTo(px1 - Math.cos(ang) * head * 0.6, py1 - Math.sin(ang) * head * 0.6);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px1 - Math.cos(ang - 0.4) * head, py1 - Math.sin(ang - 0.4) * head);
    ctx.lineTo(px1 - Math.cos(ang + 0.4) * head, py1 - Math.sin(ang + 0.4) * head);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return f;
  }

  /** The standard normal curve with an optional shaded z-region. */
  function normalCurve(canvas, opts) {
    const o = opts || {};
    const f = frame(canvas, { xmin: -3.6, xmax: 3.6, ymin: -0.06, ymax: 0.46, pad: 10 });
    const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
    axes(f, { stepY: 0.1, grid: false, labels: false });

    if (o.from !== undefined || o.to !== undefined) {
      const a = o.from === undefined ? -3.6 : Math.max(-3.6, o.from);
      const b = o.to === undefined ? 3.6 : Math.min(3.6, o.to);
      shade(f, phi, a, b, { colour: f.P.accent, alpha: 0.4 });
    }
    curve(f, phi, { colour: f.P.accent, width: 2.6 });

    const { ctx, P } = f;
    ctx.fillStyle = P.faint;
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let z = -3; z <= 3; z++) {
      ctx.beginPath();
      ctx.strokeStyle = P.faint;
      ctx.moveTo(f.X(z), f.Y(0)); ctx.lineTo(f.X(z), f.Y(0) + 4);
      ctx.stroke();
      ctx.fillText(String(z), f.X(z), f.Y(0) + 6);
    }
    return f;
  }

  /** Bell-shaped helper reused by the statistics questions. */
  function normalPdf(x, mu, sd) {
    return Math.exp(-Math.pow((x - mu) / sd, 2) / 2) / (sd * Math.sqrt(2 * Math.PI));
  }

  /** Φ(z) — Abramowitz & Stegun 26.2.17, good to ~7.5e-8. Plenty for the HSC. */
  function normalCdf(z) {
    const s = z < 0 ? -1 : 1;
    const x = Math.abs(z) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t
                   + 0.254829592) * t * Math.exp(-x * x);
    return 0.5 * (1 + s * y);
  }

  /** Inverse of the above by bisection — used to build z-score questions backwards. */
  function normalInv(p) {
    let lo = -6, hi = 6;
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      if (normalCdf(mid) < p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /** Scatterplot with an optional least-squares line — the S2 questions use this. */
  function scatter(canvas, pts, opts) {
    const o = opts || {};
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const padX = (Math.max(...xs) - Math.min(...xs)) * 0.12 || 1;
    const padY = (Math.max(...ys) - Math.min(...ys)) * 0.16 || 1;
    const f = frame(canvas, {
      xmin: Math.min(...xs) - padX, xmax: Math.max(...xs) + padX,
      ymin: Math.min(...ys) - padY, ymax: Math.max(...ys) + padY, pad: 22
    });
    axes(f, {});
    if (o.line) line(f, 0, o.line.c, o.line.m, { colour: f.P.warn, width: 2 });
    pts.forEach(([x, y]) => point(f, x, y, { r: 3.6, colour: f.P.accent, ring: false }));
    return f;
  }

  /** Pearson's r, the regression line, and the means — one pass, no library. */
  function regression(pts) {
    const n = pts.length;
    const sx = pts.reduce((a, p) => a + p[0], 0);
    const sy = pts.reduce((a, p) => a + p[1], 0);
    const mx = sx / n, my = sy / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }
    const m = sxy / sxx;
    return { m, c: my - m * mx, r: sxy / Math.sqrt(sxx * syy), mx, my };
  }

  return { frame, axes, curve, shade, trapezoids, line, point, label, arrow,
           normalCurve, normalPdf, normalCdf, normalInv, scatter, regression,
           palette, niceStep, labelFor };
})();
