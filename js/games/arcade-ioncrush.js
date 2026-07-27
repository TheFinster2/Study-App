/* Ion Crush — a match-three built on a grid of ion tiles.
   Swap two adjacent tiles; the swap only sticks if it makes a run of three or
   more. Clears cascade, and each cascade step scores more than the last. */
window.CHEM = window.CHEM || {};
CHEM.ArcadeGames = CHEM.ArcadeGames || {};

CHEM.ArcadeGames.ioncrush = (function () {
  const U = CHEM.U;
  const SIZE = 8;

  function start(stage, session) {
    const TILES = CHEM.DATA.crushTiles;
    let grid = [];            // grid[r][c] = tile index, or -1 while clearing
    let selected = null;      // {r,c}
    let busy = false;
    let moves = 0, bestCascade = 0;
    let destroyed = false;

    const board = U.el("div", { class: "crush-board" });
    const statusLine = U.el("div", { class: "row tiny muted", style: "justify-content:center" }, [
      U.el("span", { class: "js-status", text: "Swap two neighbours to make a line of three." })
    ]);
    stage.appendChild(board);
    stage.appendChild(statusLine);

    const cellNodes = [];

    /* ── board maths ────────────────────────────────────────── */
    const inBounds = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

    function randTile() { return Math.floor(Math.random() * TILES.length); }

    /** Build a starting board that contains no pre-made matches. */
    function fillFresh() {
      grid = [];
      for (let r = 0; r < SIZE; r++) {
        grid[r] = [];
        for (let c = 0; c < SIZE; c++) {
          let t, guard = 0;
          do {
            t = randTile();
            guard++;
          } while (guard < 40 && createsRun(r, c, t));
          grid[r][c] = t;
        }
      }
      // A fresh board must also have at least one legal move.
      if (!hasMove()) fillFresh();
    }

    /** Would placing `t` at (r,c) complete a run of 3 with already-filled cells? */
    function createsRun(r, c, t) {
      return (grid[r][c - 1] === t && grid[r][c - 2] === t) ||
             (grid[r - 1] && grid[r - 1][c] === t && grid[r - 2] && grid[r - 2][c] === t);
    }

    /** All cells that are part of a horizontal or vertical run of 3+. */
    function findMatches() {
      const hits = new Set();
      for (let r = 0; r < SIZE; r++) {
        let run = 1;
        for (let c = 1; c <= SIZE; c++) {
          const same = c < SIZE && grid[r][c] === grid[r][c - 1] && grid[r][c] >= 0;
          if (same) run++;
          else {
            if (run >= 3) for (let k = c - run; k < c; k++) hits.add(r + "," + k);
            run = 1;
          }
        }
      }
      for (let c = 0; c < SIZE; c++) {
        let run = 1;
        for (let r = 1; r <= SIZE; r++) {
          const same = r < SIZE && grid[r][c] === grid[r - 1][c] && grid[r][c] >= 0;
          if (same) run++;
          else {
            if (run >= 3) for (let k = r - run; k < r; k++) hits.add(k + "," + c);
            run = 1;
          }
        }
      }
      return hits;
    }

    /** Does any single adjacent swap produce a match? */
    function hasMove() {
      const trySwap = (r1, c1, r2, c2) => {
        const a = grid[r1][c1], b = grid[r2][c2];
        grid[r1][c1] = b; grid[r2][c2] = a;
        const ok = findMatches().size > 0;
        grid[r1][c1] = a; grid[r2][c2] = b;
        return ok;
      };
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (c + 1 < SIZE && trySwap(r, c, r, c + 1)) return true;
          if (r + 1 < SIZE && trySwap(r, c, r + 1, c)) return true;
        }
      }
      return false;
    }

    /** Drop tiles into gaps and refill the top. */
    function collapse() {
      for (let c = 0; c < SIZE; c++) {
        let write = SIZE - 1;
        for (let r = SIZE - 1; r >= 0; r--) {
          if (grid[r][c] >= 0) grid[write--][c] = grid[r][c];
        }
        for (let r = write; r >= 0; r--) grid[r][c] = randTile();
      }
    }

    /* ── rendering ──────────────────────────────────────────── */
    function build() {
      board.innerHTML = "";
      cellNodes.length = 0;
      for (let r = 0; r < SIZE; r++) {
        cellNodes[r] = [];
        for (let c = 0; c < SIZE; c++) {
          const btn = U.el("button", { class: "crush-cell", type: "button" });
          btn.addEventListener("click", () => pick(r, c));
          board.appendChild(btn);
          cellNodes[r][c] = btn;
        }
      }
    }

    function paint(clearing) {
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const btn = cellNodes[r][c];
          const t = grid[r][c];
          const tile = TILES[t];
          btn.innerHTML = tile ? U.formula(tile.sym) : "";
          btn.style.background = tile ? tile.colour : "transparent";
          btn.style.boxShadow = tile ? `0 3px 0 ${tile.glow}` : "none";
          btn.classList.toggle("sel", !!selected && selected.r === r && selected.c === c);
          btn.classList.toggle("popping", !!clearing && clearing.has(r + "," + c));
        }
      }
    }

    const status = msg => { U.$(".js-status", statusLine).textContent = msg; };

    /* ── interaction ────────────────────────────────────────── */
    function pick(r, c) {
      if (busy || destroyed || session.isOver()) return;
      if (!selected) {
        selected = { r, c };
        CHEM.Sound.tap();
        paint();
        return;
      }
      if (selected.r === r && selected.c === c) { selected = null; paint(); return; }

      const adjacent = Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;
      if (!adjacent) { selected = { r, c }; CHEM.Sound.tap(); paint(); return; }

      const a = selected;
      selected = null;
      attemptSwap(a.r, a.c, r, c);
    }

    function attemptSwap(r1, c1, r2, c2) {
      const t1 = grid[r1][c1], t2 = grid[r2][c2];
      grid[r1][c1] = t2; grid[r2][c2] = t1;

      if (findMatches().size === 0) {
        // Illegal swap — put it straight back.
        grid[r1][c1] = t1; grid[r2][c2] = t2;
        CHEM.Sound.mismatch();
        status("That swap doesn't make a match.");
        paint();
        cellNodes[r1][c1].classList.add("shake");
        setTimeout(() => cellNodes[r1][c1].classList.remove("shake"), 350);
        return;
      }

      moves++;
      CHEM.Sound.flip();
      paint();
      busy = true;
      resolve(1);
    }

    /** Clear matches, collapse, and repeat while new matches appear. */
    function resolve(chain) {
      if (destroyed) return;
      const hits = findMatches();
      if (!hits.size) {
        busy = false;
        bestCascade = Math.max(bestCascade, chain - 1);
        if (!hasMove()) reshuffle();
        return;
      }

      // Later links in a cascade are worth progressively more.
      const gained = Math.round(hits.size * 10 * chain);
      session.addScore(gained);
      status(chain > 1 ? `Cascade ×${chain}!  +${gained}` : `Cleared ${hits.size}  +${gained}`);
      if (chain > 1) CHEM.Sound.combo(chain * 3); else CHEM.Sound.match();

      paint(hits);
      setTimeout(() => {
        if (destroyed) return;
        hits.forEach(key => {
          const [r, c] = key.split(",").map(Number);
          grid[r][c] = -1;
        });
        collapse();
        paint();
        setTimeout(() => resolve(chain + 1), 130);
      }, 180);
    }

    function reshuffle() {
      status("No moves left — reshuffling the board.");
      CHEM.Sound.nav();
      fillFresh();
      paint();
    }

    /* ── boot ───────────────────────────────────────────────── */
    build();
    fillFresh();
    paint();
    session.setScore(0);

    return {
      destroy() { destroyed = true; }
    };
  }

  return { start };
})();
