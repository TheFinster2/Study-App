/* 🗼 Power Tower 2048 — 4×4 merge up the powers of 2.

   Awards no XP, no Primes and no achievements. It never calls UI.award(). */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.tower = (function () {
  const U = MQ.U, UI = MQ.UI;
  const N = 4;

  /* Tiles are labelled as powers of 2, because that is what they are and
     writing 2^11 is more informative than writing 2048. */
  const COLOURS = ["#2a3350","#39d6c8","#37c2e0","#6fa8ff","#7c5cff","#a86bff",
                   "#ff6bd6","#ff6b81","#ff9a4d","#ffcc55","#ffe98a","#b6ff2e"];

  function start(root) {
    const cab = MQ.Arcade.cabinet("tower", "🗼 Power Tower 2048", {
      help: "Swipe or use the arrow keys to slide every tile. Equal powers merge into the next " +
            "one up. The board is dead when no move changes anything." });
    root.appendChild(cab.root);

    let grid = [], score = 0, dead = false;

    const board = U.el("div", { class: "merge-board" });
    const pad = U.el("div", { class: "merge-pad" }, [
      U.el("div", { class: "row", style: "justify-content:center" },
        [U.el("button", { class: "btn btn-sm", text: "↑", on: { click: () => move(0, -1) } })]),
      U.el("div", { class: "row", style: "justify-content:center" }, [
        U.el("button", { class: "btn btn-sm", text: "←", on: { click: () => move(-1, 0) } }),
        U.el("button", { class: "btn btn-sm", text: "↓", on: { click: () => move(0, 1) } }),
        U.el("button", { class: "btn btn-sm", text: "→", on: { click: () => move(1, 0) } })
      ])
    ]);
    cab.body.appendChild(U.el("div", { class: "arcade-stage" }, [board, pad]));
    cab.body.appendChild(U.el("p", { class: "arcade-note",
      text: "No XP, no Primes, no achievements — a high score and nothing else." }));

    const tiles = [];
    for (let i = 0; i < N * N; i++) {
      const t = U.el("div", { class: "merge-tile empty" });
      tiles.push(t);
      board.appendChild(t);
    }

    function reset() {
      grid = new Array(N * N).fill(0);
      spawn(); spawn();
      paint();
    }

    function spawn() {
      const free = grid.map((v, i) => (v === 0 ? i : -1)).filter(i => i >= 0);
      if (!free.length) return false;
      grid[U.pick(free)] = Math.random() < 0.88 ? 1 : 2;    // exponent, not value
      return true;
    }

    /* One repaint for the whole board, with a per-cell cache. */
    const painted = new Array(N * N).fill(-1);
    function paint(force) {
      for (let i = 0; i < N * N; i++) {
        if (!force && painted[i] === grid[i]) continue;
        painted[i] = grid[i];
        const e = grid[i];
        const t = tiles[i];
        t.innerHTML = "";
        if (!e) { t.className = "merge-tile empty"; continue; }
        t.className = "merge-tile";
        t.style.background = COLOURS[Math.min(e, COLOURS.length - 1)];
        t.style.color = e >= 9 ? "#12203a" : "#fff";
        t.appendChild(U.el("div", { class: "merge-sym", html: "2<sup>" + e + "</sup>" }));
        t.appendChild(U.el("div", { class: "merge-num", text: String(Math.pow(2, e)) }));
      }
    }

    /** Slide and merge one line of exponents. Returns { line, gained, moved }. */
    function squash(line) {
      const vals = line.filter(v => v !== 0);
      const out = [];
      let gained = 0;
      for (let i = 0; i < vals.length; i++) {
        if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
          out.push(vals[i] + 1);
          gained += Math.pow(2, vals[i] + 1);
          i++;
        } else out.push(vals[i]);
      }
      while (out.length < N) out.push(0);
      const moved = out.some((v, i) => v !== line[i]);
      return { line: out, gained, moved };
    }

    function move(dx, dy) {
      if (dead || cab.isOver()) return;
      let moved = false, gained = 0;

      for (let k = 0; k < N; k++) {
        // Read the row or column in the direction of travel.
        const coords = [];
        for (let i = 0; i < N; i++) {
          coords.push(dx !== 0
            ? { r: k, c: dx > 0 ? N - 1 - i : i }
            : { r: dy > 0 ? N - 1 - i : i, c: k });
        }
        const line = coords.map(p => grid[p.r * N + p.c]);
        const res = squash(line);
        if (res.moved) moved = true;
        gained += res.gained;
        res.line.forEach((v, i) => { grid[coords[i].r * N + coords[i].c] = v; });
      }

      if (!moved) { MQ.Sound.mismatch(); return; }
      score += gained;
      cab.setScore(score);
      if (gained) MQ.Sound.merge(gained); else MQ.Sound.slide();
      spawn();
      paint();

      if (!anyMove()) {
        dead = true;
        MQ.Sound.lose();
        cab.stop("No moves left");
      }
    }

    function anyMove() {
      if (grid.includes(0)) return true;
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const v = grid[r * N + c];
          if (c + 1 < N && grid[r * N + c + 1] === v) return true;
          if (r + 1 < N && grid[(r + 1) * N + c] === v) return true;
        }
      }
      return false;
    }

    function onKey(e) {
      const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
                    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
      const m = map[e.key];
      if (!m) return;
      e.preventDefault();
      move(m[0], m[1]);
    }
    document.addEventListener("keydown", onKey);

    let touch = null;
    board.addEventListener("pointerdown", e => (touch = { x: e.clientX, y: e.clientY }));
    board.addEventListener("pointerup", e => {
      if (!touch) return;
      const dx = e.clientX - touch.x, dy = e.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1, 0);
      else move(0, dy > 0 ? 1 : -1);
    });

    cab.onEnd(reason => {
      document.removeEventListener("keydown", onKey);
      cab.gameOver(score, reason);
    });
    UI.onLeave(() => document.removeEventListener("keydown", onKey));

    reset();
  }

  return { start };
})();
