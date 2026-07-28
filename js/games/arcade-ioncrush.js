/* Ion Crush — a match-three built on a grid of ion tiles.
   Swap two adjacent tiles; the swap only sticks if it makes a run of three or
   more. Clears cascade, and each cascade step scores more than the last.

   Runs of four or more forge a POWER TILE, which is what gives the game depth
   beyond "spot three in a row":
     ⚡ Charged  (run of 4)      — detonates its whole row and column
     ☢ Unstable (L or T shape)  — detonates the 3×3 around it
     ✳ Catalyst (run of 5+)     — dissolves every ion of one type on the board
   Power tiles detonate whenever they are cleared, and their blast can set off
   other power tiles, so a well-placed swap can chain across the entire board. */
window.CHEM = window.CHEM || {};
CHEM.ArcadeGames = CHEM.ArcadeGames || {};

CHEM.ArcadeGames.ioncrush = (function () {
  const U = CHEM.U;
  const SIZE = 8;

  const POWER = {
    beam: { glyph: "⚡", label: "Charged" },
    bomb: { glyph: "☢", label: "Unstable" },
    cat:  { glyph: "✳", label: "Catalyst" }
  };

  function start(stage, session) {
    const TILES = CHEM.DATA.crushTiles;
    let grid = [];            // grid[r][c] = tile index, or -1 while clearing
    let power = [];           // power[r][c] = null | "beam" | "bomb" | "cat"
    let drops = [];           // rows each tile fell on the last collapse, for the animation
    let selected = null;      // {r,c}
    let busy = false;
    let moves = 0, bestCascade = 0, combo = 0;
    let destroyed = false;
    let lastSwap = null;      // where the player acted, so power tiles spawn under the thumb

    const board = U.el("div", { class: "crush-board" });
    const comboChip = U.el("span", { class: "crush-combo", hidden: true });
    const statusLine = U.el("div", { class: "row tiny muted", style: "justify-content:center; gap:8px" }, [
      U.el("span", { class: "js-status", text: "Swap two neighbours to make a line of three." }),
      comboChip
    ]);
    stage.appendChild(board);
    stage.appendChild(statusLine);

    const cellNodes = [];

    /* ── board maths ────────────────────────────────────────── */
    const inBounds = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;
    const key = (r, c) => r + "," + c;
    const parse = k => k.split(",").map(Number);

    function randTile() { return Math.floor(Math.random() * TILES.length); }

    function blankGrids() {
      power = [];
      drops = [];
      for (let r = 0; r < SIZE; r++) {
        power[r] = new Array(SIZE).fill(null);
        drops[r] = new Array(SIZE).fill(0);
      }
    }

    /** Build a starting board that contains no pre-made matches. */
    function fillFresh() {
      grid = [];
      blankGrids();
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

    /** Every maximal run of 3+, as { cells:[[r,c]…], len, dir }. */
    function findRuns() {
      const runs = [];
      for (let r = 0; r < SIZE; r++) {
        let run = 1;
        for (let c = 1; c <= SIZE; c++) {
          const same = c < SIZE && grid[r][c] === grid[r][c - 1] && grid[r][c] >= 0;
          if (same) run++;
          else {
            if (run >= 3) {
              const cells = [];
              for (let k = c - run; k < c; k++) cells.push([r, k]);
              runs.push({ cells, len: run, dir: "h" });
            }
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
            if (run >= 3) {
              const cells = [];
              for (let k = r - run; k < r; k++) cells.push([k, c]);
              runs.push({ cells, len: run, dir: "v" });
            }
            run = 1;
          }
        }
      }
      return runs;
    }

    /** All cells in any run — the flat view used by the legality check. */
    function findMatches() {
      const hits = new Set();
      findRuns().forEach(run => run.cells.forEach(([r, c]) => hits.add(key(r, c))));
      return hits;
    }

    /** Does any single adjacent swap produce a match? */
    function hasMove() {
      const trySwap = (r1, c1, r2, c2) => {
        // A catalyst can always be cashed in, so its presence guarantees a move.
        if (power[r1][c1] === "cat" || power[r2][c2] === "cat") return true;
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

    /** Drop tiles into gaps and refill the top, recording how far each fell. */
    function collapse() {
      for (let r = 0; r < SIZE; r++) drops[r].fill(0);
      for (let c = 0; c < SIZE; c++) {
        let write = SIZE - 1;
        for (let r = SIZE - 1; r >= 0; r--) {
          if (grid[r][c] >= 0) {
            grid[write][c] = grid[r][c];
            power[write][c] = power[r][c];
            drops[write][c] = write - r;
            write--;
          }
        }
        // Everything above `write` is new and fell in from off the top together.
        const fresh = write + 1;
        for (let r = write; r >= 0; r--) {
          grid[r][c] = randTile();
          power[r][c] = null;
          drops[r][c] = fresh;
        }
      }
    }

    /* ── power tiles ────────────────────────────────────────── */

    /** Cells a detonating power tile takes with it. */
    function blast(kind, r, c) {
      const out = [];
      if (kind === "beam") {
        for (let i = 0; i < SIZE; i++) { out.push([r, i]); out.push([i, c]); }
      } else if (kind === "bomb") {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++)
          if (inBounds(r + dr, c + dc)) out.push([r + dr, c + dc]);
      } else if (kind === "cat") {
        const t = grid[r][c];
        for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++)
          if (grid[i][j] === t) out.push([i, j]);
      }
      return out;
    }

    /** Grow a clear-set by detonating every power tile it touches, chaining. */
    function detonateInto(hits) {
      const queue = [...hits];
      let blasts = 0;
      while (queue.length) {
        const k = queue.pop();
        const [r, c] = parse(k);
        const kind = power[r][c];
        if (!kind) continue;
        power[r][c] = null;              // consumed, so it cannot re-trigger
        blasts++;
        for (const [br, bc] of blast(kind, r, c)) {
          const bk = key(br, bc);
          if (!hits.has(bk)) { hits.add(bk); queue.push(bk); }
        }
      }
      return blasts;
    }

    /** Decide which power tiles this set of runs earns, keyed by cell. */
    function powerSpawns(runs) {
      const spawns = new Map();
      // A cell shared by a horizontal and a vertical run is an L or T join.
      const inH = new Set(), inV = new Set();
      runs.forEach(run => run.cells.forEach(([r, c]) =>
        (run.dir === "h" ? inH : inV).add(key(r, c))));

      runs.forEach(run => {
        const cells = run.cells.map(([r, c]) => key(r, c));
        const join = cells.find(k => inH.has(k) && inV.has(k));
        if (join) { spawns.set(join, "bomb"); return; }
        if (run.len >= 5) spawns.set(pickSpawn(cells), "cat");
        else if (run.len === 4) spawns.set(pickSpawn(cells), "beam");
      });
      return spawns;
    }

    /** Spawn where the player last acted if possible — it feels like their doing. */
    function pickSpawn(cells) {
      if (lastSwap && cells.includes(lastSwap)) return lastSwap;
      return cells[Math.floor(cells.length / 2)];
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

    function paint(clearing, animateDrop) {
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const btn = cellNodes[r][c];
          const t = grid[r][c];
          const tile = TILES[t];
          const kind = power[r][c];
          btn.innerHTML = tile
            ? (kind ? `<span class="crush-power">${POWER[kind].glyph}</span>` : U.formula(tile.sym))
            : "";
          btn.style.background = tile ? tile.colour : "transparent";
          btn.style.boxShadow = tile ? `0 3px 0 ${tile.glow}` : "none";
          btn.classList.toggle("sel", !!selected && selected.r === r && selected.c === c);
          btn.classList.toggle("popping", !!clearing && clearing.has(key(r, c)));
          btn.classList.toggle("charged", !!kind);
          btn.classList.remove("dropping");
          if (animateDrop && drops[r][c] > 0) {
            btn.style.setProperty("--d", drops[r][c]);
            // Restart the animation even if the class was just removed.
            void btn.offsetWidth;
            btn.classList.add("dropping");
          }
        }
      }
    }

    const status = msg => { U.$(".js-status", statusLine).textContent = msg; };

    function showCombo() {
      if (combo >= 2) {
        comboChip.hidden = false;
        comboChip.textContent = `Chain ×${combo}`;
        comboChip.classList.remove("bump");
        void comboChip.offsetWidth;
        comboChip.classList.add("bump");
      } else {
        comboChip.hidden = true;
      }
    }

    /** A score number that floats up from the middle of what was cleared. */
    function floatScore(cells, text) {
      if (!cells.size) return;
      let sr = 0, sc = 0;
      cells.forEach(k => { const [r, c] = parse(k); sr += r; sc += c; });
      const r = sr / cells.size, c = sc / cells.size;
      const pop = U.el("div", { class: "crush-pop", text });
      pop.style.left = ((c + 0.5) / SIZE * 100) + "%";
      pop.style.top = ((r + 0.5) / SIZE * 100) + "%";
      board.appendChild(pop);
      setTimeout(() => pop.remove(), 750);
    }

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
      // Swapping a catalyst cashes it in against whatever it was swapped with,
      // even when that makes no run — the classic "use it on the colour you want".
      if (power[r1][c1] === "cat" || power[r2][c2] === "cat") {
        const cr = power[r1][c1] === "cat" ? r1 : r2, cc = power[r1][c1] === "cat" ? c1 : c2;
        const tr = cr === r1 && cc === c1 ? r2 : r1, tc = cr === r1 && cc === c1 ? c2 : c1;
        grid[cr][cc] = grid[tr][tc];     // adopt the target colour, then detonate
        moves++;
        lastSwap = key(cr, cc);
        const hits = new Set([key(cr, cc)]);
        detonateInto(hits);
        CHEM.Sound.puCatalyst();
        busy = true;
        clearAndCascade(hits, 1);
        return;
      }

      const t1 = grid[r1][c1], t2 = grid[r2][c2];
      const p1 = power[r1][c1], p2 = power[r2][c2];
      grid[r1][c1] = t2; grid[r2][c2] = t1;
      power[r1][c1] = p2; power[r2][c2] = p1;

      /* Moving a charged or unstable tile sets it off, match or no match. Requiring
         the player to also line it up three-deep makes the reward for earning one
         feel worse than an ordinary match, which is exactly backwards. */
      if (p1 || p2) {
        moves++;
        lastSwap = key(r2, c2);
        const hits = new Set();
        if (p1) hits.add(key(r2, c2));   // p1 travelled to the second cell
        if (p2) hits.add(key(r1, c1));
        findRuns().forEach(run => run.cells.forEach(([r, c]) => hits.add(key(r, c))));
        const blasts = detonateInto(hits);
        CHEM.Sound.flip();
        busy = true;
        clearAndCascade(hits, 1, null, blasts);
        return;
      }

      if (findMatches().size === 0) {
        // Illegal swap — put it straight back.
        grid[r1][c1] = t1; grid[r2][c2] = t2;
        power[r1][c1] = p1; power[r2][c2] = p2;
        CHEM.Sound.mismatch();
        status("That swap doesn't make a match.");
        combo = 0;
        showCombo();
        paint();
        cellNodes[r1][c1].classList.add("shake");
        setTimeout(() => cellNodes[r1][c1].classList.remove("shake"), 350);
        return;
      }

      moves++;
      lastSwap = key(r2, c2);
      CHEM.Sound.flip();
      paint();
      busy = true;
      resolve(1);
    }

    /** Clear matches, collapse, and repeat while new matches appear. */
    function resolve(chain) {
      if (destroyed) return;
      const runs = findRuns();
      if (!runs.length) {
        busy = false;
        bestCascade = Math.max(bestCascade, chain - 1);
        if (chain === 1) { combo = 0; showCombo(); }
        if (!hasMove()) reshuffle();
        return;
      }

      const spawns = powerSpawns(runs);
      const hits = new Set();
      runs.forEach(run => run.cells.forEach(([r, c]) => hits.add(key(r, c))));
      const blasts = detonateInto(hits);

      // The tile that becomes a power tile survives the clear that created it.
      spawns.forEach((kind, k) => hits.delete(k));

      clearAndCascade(hits, chain, spawns, blasts);
    }

    function clearAndCascade(hits, chain, spawns, blasts) {
      if (!hits.size) { busy = false; return; }

      combo = Math.max(combo, chain);
      const gained = Math.round(hits.size * 10 * chain * (blasts ? 1.5 : 1));
      session.addScore(gained);
      floatScore(hits, "+" + gained);

      if (blasts) { CHEM.Sound.explode(); CHEM.FX.shake && CHEM.FX.shake(); }
      else if (chain > 1) CHEM.Sound.combo(chain * 3);
      else CHEM.Sound.match();

      if (spawns && spawns.size) {
        const kind = [...spawns.values()][0];
        status(`${POWER[kind].label} tile forged!  +${gained}`);
        CHEM.Sound.unlock();
      } else if (blasts) {
        status(`Chain reaction — ${blasts} detonation${blasts === 1 ? "" : "s"}!  +${gained}`);
      } else {
        status(chain > 1 ? `Cascade ×${chain}!  +${gained}` : `Cleared ${hits.size}  +${gained}`);
      }
      showCombo();

      paint(hits);
      setTimeout(() => {
        if (destroyed) return;
        hits.forEach(k => { const [r, c] = parse(k); grid[r][c] = -1; power[r][c] = null; });
        if (spawns) spawns.forEach((kind, k) => { const [r, c] = parse(k); power[r][c] = kind; });
        collapse();
        paint(null, true);
        setTimeout(() => resolve(chain + 1), 200);
      }, 190);
    }

    function reshuffle() {
      status("No moves left — reshuffling the board.");
      CHEM.Sound.nav();
      fillFresh();
      paint(null, true);
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
