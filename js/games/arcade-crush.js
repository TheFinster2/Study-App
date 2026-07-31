/* 🧮 Prime Crush — 8×8 match-3 on number tiles.

   Awards no XP, no Primes and no achievements. It never calls UI.award(). */
window.MQ = window.MQ || {};
MQ.Games = MQ.Games || {};

MQ.Games.crush = (function () {
  const U = MQ.U, UI = MQ.UI;
  const N = 8;

  /* Six tile kinds, each a small number with a colour. Primes are worth more,
     because at some point you have to justify the name. */
  const TILES = [
    { v: 2,  prime: true,  bg: "#39d6c8" },
    { v: 3,  prime: true,  bg: "#7c5cff" },
    { v: 5,  prime: true,  bg: "#ffcc55" },
    { v: 4,  prime: false, bg: "#ff6b81" },
    { v: 6,  prime: false, bg: "#6fa8ff" },
    { v: 9,  prime: false, bg: "#3fe08a" }
  ];

  function start(root) {
    const cab = MQ.Arcade.cabinet("crush", "🧮 Prime Crush", {
      help: "Swap two adjacent tiles to line up three or more of the same number. " +
            "Prime tiles are worth double. Your ticket only runs while you are on this screen." });
    root.appendChild(cab.root);

    let score = 0;
    let grid = [];
    let sel = null, busy = false;

    const board = U.el("div", { class: "crush-board" });
    const cells = [];
    cab.body.appendChild(U.el("div", { class: "arcade-stage" }, [board]));
    cab.body.appendChild(U.el("p", { class: "arcade-note",
      text: "No XP, no Primes, no achievements — a high score and nothing else." }));

    for (let i = 0; i < N * N; i++) {
      const btn = U.el("button", { class: "crush-cell", type: "button", data: { i } });
      btn.addEventListener("click", () => tap(i));
      cells.push(btn);
      board.appendChild(btn);
    }

    const idx = (r, c) => r * N + c;
    const rc = i => [Math.floor(i / N), i % N];

    /* Deal a board with no pre-existing matches, so the first move is the
       player's rather than a free cascade. */
    function deal() {
      do {
        grid = [];
        for (let i = 0; i < N * N; i++) grid.push(U.randInt(0, TILES.length - 1));
      } while (findMatches().length);
      paint();
    }

    function findMatches() {
      const hits = new Set();
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N - 2; c++) {
          const v = grid[idx(r, c)];
          if (v < 0) continue;
          let len = 1;
          while (c + len < N && grid[idx(r, c + len)] === v) len++;
          if (len >= 3) for (let k = 0; k < len; k++) hits.add(idx(r, c + k));
        }
      }
      for (let c = 0; c < N; c++) {
        for (let r = 0; r < N - 2; r++) {
          const v = grid[idx(r, c)];
          if (v < 0) continue;
          let len = 1;
          while (r + len < N && grid[idx(r + len, c)] === v) len++;
          if (len >= 3) for (let k = 0; k < len; k++) hits.add(idx(r + k, c));
        }
      }
      return Array.from(hits);
    }

    /* G1: paint the whole board in ONE pass with a per-cell cache, so an
       unchanged tile is never rewritten. The reflow idiom that restarts a CSS
       animation forces a synchronous layout, and one per cell is 64 of them
       per repaint. */
    const painted = new Array(N * N).fill(-2);
    function paint() {
      for (let i = 0; i < N * N; i++) {
        if (painted[i] === grid[i]) continue;
        painted[i] = grid[i];
        const t = TILES[grid[i]];
        const cell = cells[i];
        if (!t) { cell.style.background = "transparent"; cell.textContent = ""; continue; }
        cell.style.background = t.bg;
        cell.textContent = String(t.v);
      }
    }

    function tap(i) {
      if (busy || cab.isOver()) return;
      if (sel === null) {
        sel = i;
        cells[i].classList.add("sel");
        MQ.Sound.tap();
        return;
      }
      if (sel === i) { cells[i].classList.remove("sel"); sel = null; return; }

      const [r1, c1] = rc(sel), [r2, c2] = rc(i);
      const adjacent = Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
      cells[sel].classList.remove("sel");
      const from = sel;
      sel = null;
      if (!adjacent) { tap(i); return; }

      swap(from, i);
      if (!findMatches().length) {
        // Illegal move: put it back.
        swap(from, i);
        MQ.Sound.mismatch();
        cells[i].classList.add("shake");
        setTimeout(() => cells[i].classList.remove("shake"), 320);
        return;
      }
      paint();
      resolveCascades(0);
    }

    function swap(a, b) { const t = grid[a]; grid[a] = grid[b]; grid[b] = t; }

    function resolveCascades(depth) {
      const hits = findMatches();
      if (!hits.length) { busy = false; return; }
      busy = true;

      let gained = 0;
      hits.forEach(i => { gained += TILES[grid[i]].prime ? 20 : 10; });
      score += Math.round(gained * (1 + depth * 0.5));
      cab.setScore(score);
      MQ.Sound.crush();
      if (depth > 0) MQ.Sound.cascade(depth);

      hits.forEach(i => cells[i].classList.add("popping"));
      setTimeout(() => {
        hits.forEach(i => { grid[i] = -1; cells[i].classList.remove("popping"); });
        collapse();
        paint();
        setTimeout(() => resolveCascades(depth + 1), 120);
      }, 180);
    }

    function collapse() {
      for (let c = 0; c < N; c++) {
        const column = [];
        for (let r = N - 1; r >= 0; r--) {
          const v = grid[idx(r, c)];
          if (v >= 0) column.push(v);
        }
        while (column.length < N) column.push(U.randInt(0, TILES.length - 1));
        for (let r = N - 1, k = 0; r >= 0; r--, k++) grid[idx(r, c)] = column[k];
      }
    }

    cab.onEnd(reason => cab.gameOver(score, reason));
    deal();
  }

  return { start };
})();
