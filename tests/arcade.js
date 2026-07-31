#!/usr/bin/env node
/* The arcade economy.

   The headline assertion is that playing the arcade leaves XP, level and
   Primes PROVABLY untouched. An endless runner paying even 1 XP/second beats
   studying, and the reference app nearly shipped one — so "earns nothing" is
   not a balance note, it is an invariant with a test. */

const H = require("./harness");
const PORT = 8823;

(async () => {
  const R = H.reporter("MathQuest arcade test");
  const server = await H.serve(PORT, "/");
  const browser = await H.launch();
  const base = `http://127.0.0.1:${PORT}/`;
  let page;

  try {
    page = await H.newPage(browser);
    await H.boot(page, base);

    /* ── a broke player is refused ── */
    R.section("Tickets");
    await H.seedSave(page, { coins: 10, level: 30 });
    await H.goTo(page, "/arcade/crush");
    const brokeDisabled = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".shop-item button")).every(b => b.disabled));
    R.ok(brokeDisabled, "a player without enough Primes cannot buy a ticket");

    const refused = await page.evaluate(() =>
      window.MQ.Arcade.buyTicket("crush", 5, 250));
    R.ok(!refused.ok && /Primes/.test(refused.reason), "buyTicket refuses and says why");
    R.ok(await page.evaluate(() => window.MQ.Arcade.timeLeft("crush") === 0),
      "no playtime is credited on a refused purchase");

    /* ── a purchase charges correctly ── */
    await H.seedSave(page, { coins: 5000 });
    const bought = await page.evaluate(() => {
      const before = window.MQ.State.data.coins;
      const r = window.MQ.Arcade.buyTicket("crush", 5, 250);
      return { r, before, after: window.MQ.State.data.coins,
               time: window.MQ.Arcade.timeLeft("crush") };
    });
    R.ok(bought.r.ok, "a ticket can be bought with enough Primes");
    R.ok(bought.before - bought.after === 250, "the ticket costs exactly its price",
      `${bought.before} → ${bought.after}`);
    R.ok(bought.time === 300, "5 minutes credits 300 seconds", `got ${bought.time}`);

    /* Tickets bank rather than expire — playtime you paid for is still there
       tomorrow, which is why they are stored as remaining seconds. */
    await page.evaluate(() => window.MQ.Arcade.buyTicket("crush", 15, 600));
    R.ok(await page.evaluate(() => window.MQ.Arcade.timeLeft("crush") === 1200),
      "a second ticket adds to the first rather than replacing it");

    /* ── the headline invariant ── */
    R.section("Playing earns nothing");
    await H.quiesce(page);
    for (const g of ["crush", "runner", "tower"]) {
      await page.evaluate(id => window.MQ.Arcade.buyTicket(id, 15, 0), g);
      const before = await H.snapshot(page);
      const beforeCoins = await page.evaluate(() => window.MQ.State.data.coins);

      await H.goTo(page, "/arcade/" + g + "/play");
      await page.waitForTimeout(400);
      await playArcade(page, g);
      await page.waitForTimeout(600);

      const after = await H.snapshot(page);
      const afterCoins = await page.evaluate(() => window.MQ.State.data.coins);
      R.ok(after.xp === before.xp, `${g}: XP is untouched`, `${before.xp} → ${after.xp}`);
      R.ok(after.level === before.level, `${g}: level is untouched`);
      R.ok(afterCoins === beforeCoins, `${g}: Primes are untouched`,
        `${beforeCoins} → ${afterCoins}`);
      R.ok(after.answered === before.answered, `${g}: no questions are recorded`);
      await H.dismissModal(page, 800);
      await H.goTo(page, "/arcade");
    }

    const achEarned = await page.evaluate(() => {
      const S = window.MQ.State;
      // Everything was pre-marked by quiesce(); nothing new may appear.
      return S.checkAchievements().length;
    });
    R.ok(achEarned === 0, "the arcade unlocks no achievements");

    /* ── the clock runs only on screen ── */
    R.section("The ticket clock");
    await page.evaluate(() => {
      window.MQ.State.data.arcade.tickets.tower = 600;
      window.MQ.State.flush();
    });
    await H.goTo(page, "/arcade/tower/play");
    await page.waitForTimeout(2600);
    const ticking = await page.evaluate(() => window.MQ.Arcade.timeLeft("tower"));
    R.ok(ticking < 600 && ticking > 590, "the clock runs while the game is on screen",
      `600 → ${ticking}`);

    await H.goTo(page, "/home");
    const parked = await page.evaluate(() => window.MQ.Arcade.timeLeft("tower"));
    await page.waitForTimeout(2500);
    const stillParked = await page.evaluate(() => window.MQ.Arcade.timeLeft("tower"));
    R.ok(stillParked === parked, "the clock stops the moment you leave the game",
      `${parked} → ${stillParked}`);

    /* ── high scores persist ── */
    R.section("High scores");
    await page.evaluate(() => window.MQ.Arcade.recordScore("crush", 4242));
    await page.evaluate(() => window.MQ.State.flush());
    await page.reload({ waitUntil: "domcontentloaded" });
    await H.waitFor(page, () => !!(window.MQ && window.MQ.Arcade), { label: "reloaded" });
    R.ok(await page.evaluate(() => window.MQ.Arcade.bestScore("crush") === 4242),
      "high scores survive a reload");
    const notBeaten = await page.evaluate(() => window.MQ.Arcade.recordScore("crush", 10));
    R.ok(!notBeaten, "a lower score does not overwrite the best");
    R.ok(await page.evaluate(() => window.MQ.Arcade.bestScore("crush") === 4242),
      "the best score is preserved");

    /* ── the UI says so ── */
    await H.goTo(page, "/arcade");
    R.ok(await page.evaluate(() => /earn nothing|no XP/i.test(document.body.innerText)),
      "the arcade tells the player it pays nothing, so it does not read as a bug");

    R.ok(page.errors.length === 0, "no console errors", page.errors.slice(0, 4).join("\n      "));
  } catch (e) {
    R.ok(false, "arcade run completed", e.message + "\n" + (e.stack || "").split("\n")[1]);
    if (page && page.errors.length) console.log("      " + page.errors.slice(0, 4).join("\n      "));
  } finally {
    await browser.close();
    server.close();
  }

  process.exit(R.finish());
})();

async function playArcade(page, id) {
  for (let i = 0; i < 25; i++) {
    await page.evaluate(gid => {
      if (gid === "crush") {
        const cells = Array.from(document.querySelectorAll(".crush-cell"));
        // Try a few adjacent swaps.
        for (let k = 0; k < 8; k += 2) {
          if (cells[k] && cells[k + 1]) { cells[k].click(); cells[k + 1].click(); }
        }
      } else if (gid === "runner") {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      } else if (gid === "tower") {
        ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].forEach(k =>
          document.dispatchEvent(new KeyboardEvent("keydown", { key: k })));
      }
    }, id);
    await page.waitForTimeout(60);
  }
}
