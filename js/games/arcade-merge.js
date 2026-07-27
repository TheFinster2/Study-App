/* Isotope 2048 — slide-and-merge on a 4×4 grid. Two identical nuclei fuse into
   the next element up the ladder. Arrow keys, WASD or swipe. */
window.CHEM = window.CHEM || {};
CHEM.ArcadeGames = CHEM.ArcadeGames || {};

CHEM.ArcadeGames.merge = (function () {
  const U = CHEM.U;
  const N = 4;

  function start(stage, session) {
    const LADDER = CHEM.DATA.mergeLadder;
    let cells = [];             // flat array of level index, or -1 for empty
    let score = 0, destroyed = false, best = 0;

    const board = U.el("div", { class: "merge-board" });
    const note = U.el("div", { class: "row tiny muted", style: "justify-content:center" }, [
      U.el("span", { class: "js-note", text: "Arrows / WASD / swipe to slide. Merge two of the same." })
    ]);
    stage.appendChild(board);
    stage.appendChild(note);

    const idx = (r, c) => r * N + c;

    function emptyCells() {
      const out = [];
      cells.forEach((v, i) => { if (v < 0) out.push(i); });
      return out;
    }

    function spawn() {
      const free = emptyCells();
      if (!free.length) return false;
      // 90% hydrogen, 10% helium — the usual 2048 weighting.
      cells[free[Math.floor(Math.random() * free.length)]] = Math.random() < 0.9 ? 0 : 1;
      return true;
    }

    function reset() {
      cells = new Array(N * N).fill(-1);
      score = 0;
      spawn(); spawn();
      session.setScore(0);
      paint();
    }

    /** Slide+merge one line (array of level indices). Returns {line, gained, moved}. */
    function slideLine(line) {
      const kept = line.filter(v => v >= 0);
      const out = [];
      let gained = 0;
      for (let i = 0; i < kept.length; i++) {
        if (i + 1 < kept.length && kept[i] === kept[i + 1] && kept[i] < LADDER.length - 1) {
          const merged = kept[i] + 1;
          out.push(merged);
          // Score grows steeply with how far up the ladder the merge is.
          gained += Math.round(Math.pow(2, merged + 1));
          i++;
        } else {
          out.push(kept[i]);
        }
      }
      while (out.length < N) out.push(-1);
      const moved = out.some((v, i) => v !== line[i]);
      return { line: out, gained, moved };
    }

    function move(dir) {
      if (destroyed || session.isOver()) return;
      let moved = false, gained = 0;

      for (let i = 0; i < N; i++) {
        // Read the row or column in the direction of travel.
        let line = [];
        for (let j = 0; j < N; j++) {
          if (dir === "left")  line.push(cells[idx(i, j)]);
          if (dir === "right") line.push(cells[idx(i, N - 1 - j)]);
          if (dir === "up")    line.push(cells[idx(j, i)]);
          if (dir === "down")  line.push(cells[idx(N - 1 - j, i)]);
        }
        const res = slideLine(line);
        gained += res.gained;
        if (res.moved) moved = true;
        for (let j = 0; j < N; j++) {
          if (dir === "left")  cells[idx(i, j)] = res.line[j];
          if (dir === "right") cells[idx(i, N - 1 - j)] = res.line[j];
          if (dir === "up")    cells[idx(j, i)] = res.line[j];
          if (dir === "down")  cells[idx(N - 1 - j, i)] = res.line[j];
        }
      }

      if (!moved) { CHEM.Sound.mismatch(); return; }

      score += gained;
      session.setScore(score);
      if (gained) {
        CHEM.Sound.match();
        const top = Math.max(...cells);
        if (top > best) {
          best = top;
          U.$(".js-note", note).textContent =
            `New element reached: ${LADDER[top].name} (${LADDER[top].sym})`;
          CHEM.Sound.unlock();
        }
      } else {
        CHEM.Sound.tap();
      }

      spawn();
      paint();
      if (!canMove()) {
        setTimeout(() => {
          if (!destroyed) session.gameOver(`Board full. Best element: ${LADDER[Math.max(...cells)].name}.`);
        }, 350);
      }
    }

    function canMove() {
      if (emptyCells().length) return true;
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const v = cells[idx(r, c)];
          if (c + 1 < N && cells[idx(r, c + 1)] === v) return true;
          if (r + 1 < N && cells[idx(r + 1, c)] === v) return true;
        }
      }
      return false;
    }

    function paint() {
      board.innerHTML = "";
      cells.forEach(v => {
        const el = LADDER[v];
        const tile = U.el("div", { class: "merge-tile" + (v < 0 ? " empty" : "") });
        if (el) {
          tile.style.background = el.colour;
          tile.appendChild(U.el("div", { class: "merge-sym", text: el.sym }));
          tile.appendChild(U.el("div", { class: "merge-num", text: String(Math.pow(2, v + 1)) }));
        }
        board.appendChild(tile);
      });
    }

    /* ── input ──────────────────────────────────────────────── */
    const KEYS = {
      ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
      KeyA: "left", KeyD: "right", KeyW: "up", KeyS: "down"
    };
    function onKey(e) {
      const dir = KEYS[e.code];
      if (!dir) return;
      e.preventDefault();
      move(dir);
    }
    document.addEventListener("keydown", onKey);

    let sx = 0, sy = 0;
    function onTouchStart(e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
    function onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    }
    board.addEventListener("touchstart", onTouchStart, { passive: true });
    board.addEventListener("touchend", onTouchEnd);

    /* On-screen arrows, so it's playable without a keyboard. */
    const pad = U.el("div", { class: "merge-pad" }, [
      U.el("button", { class: "btn btn-sm", text: "↑", on: { click: () => move("up") } }),
      U.el("div", { class: "row", style: "gap:6px; justify-content:center" }, [
        U.el("button", { class: "btn btn-sm", text: "←", on: { click: () => move("left") } }),
        U.el("button", { class: "btn btn-sm", text: "↓", on: { click: () => move("down") } }),
        U.el("button", { class: "btn btn-sm", text: "→", on: { click: () => move("right") } })
      ])
    ]);
    stage.appendChild(pad);

    reset();

    return {
      destroy() {
        destroyed = true;
        document.removeEventListener("keydown", onKey);
      }
    };
  }

  return { start };
})();
