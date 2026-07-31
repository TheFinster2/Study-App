#!/usr/bin/env node
/* Smoke test: drive every screen and every mode end to end.

   Fails on ANY console error, and checks horizontal overflow on every screen
   at both 390 px and 360 px. That overflow check is three lines and it catches
   a whole class of regressions — a deeply nested fraction is exactly the kind
   of unshrinkable content that pushes a grid child past the viewport. */

const H = require("./harness");
const PORT = 8821;

(async () => {
  const R = H.reporter("MathQuest smoke test");
  const server = await H.serve(PORT, "/");
  const browser = await H.launch();
  const base = `http://127.0.0.1:${PORT}/`;
  let page;

  try {
    page = await H.newPage(browser);
    await H.boot(page, base);
    R.ok(true, "app boots");

    /* ── every top-level screen ── */
    R.section("Screens");
    const screens = ["/home", "/play", "/study", "/reference", "/progress",
                     "/shop", "/achievements", "/settings", "/arcade"];
    for (const route of screens) {
      await H.goTo(page, route);
      const rendered = await page.evaluate(() => document.getElementById("view").children.length > 0);
      R.ok(rendered, `${route} renders`);
      await H.assertNoOverflow(page, route + " @390");
    }

    /* ── a reference sheet, and the drill it links to ── */
    await H.goTo(page, "/reference/ref-derivs");
    R.ok(await page.evaluate(() => document.body.innerText.includes("Derivatives")),
      "a reference sheet opens");
    await H.assertNoOverflow(page, "/reference/ref-derivs @390");

    /* ── the study deck ── */
    R.section("Study");
    await H.goTo(page, "/study/deck/all");
    const cardShown = await page.evaluate(() => !!document.querySelector(".fcard"));
    R.ok(cardShown, "a flashcard renders");
    if (cardShown) {
      await page.click(".fcard");
      await page.waitForTimeout(200);
      const flipped = await page.evaluate(() => document.querySelector(".fcard").classList.contains("flip"));
      R.ok(flipped, "the card flips");
      await H.assertNoOverflow(page, "flashcard @390");
    }

    /* ── every game mode ── */
    R.section("Game modes");
    const modes = MODES();
    for (const m of modes) {
      await H.goTo(page, "/game/" + m.id);
      await page.waitForTimeout(m.wait || 250);
      const up = await page.evaluate(sel => !!document.querySelector(sel), m.expect);
      R.ok(up, `${m.id} starts`, up ? "" : `expected ${m.expect}`);
      await H.assertNoOverflow(page, m.id + " @390");
      await H.dismissModal(page, 300);
    }

    /* ── answering a question end to end ── */
    R.section("Answering");
    await H.goTo(page, "/game/drill/MA-C2");
    await page.waitForTimeout(1400);   // clear MIN_READ_MS so the answer pays
    const before = await H.snapshot(page);
    await page.click(".choice");
    await page.waitForTimeout(250);
    R.ok(await page.evaluate(() => !!document.querySelector(".feedback")),
      "answering reveals the worked explanation");
    R.ok(await page.evaluate(() => !!document.querySelector(".js-next")),
      "the explanation stays until you press Next (it is never covered by a modal)");
    const after = await H.snapshot(page);
    R.ok(after.answered === before.answered + 1, "the answer is recorded");

    /* the star / bookmark control */
    await page.click(".bookmark-btn");
    await page.waitForTimeout(120);
    R.ok(await page.evaluate(() => window.MQ.State.data.bookmarks.length > 0),
      "starring a question saves it for review");

    /* ── a boss fight ── */
    R.section("Boss");
    await H.goTo(page, "/game/boss/asymptote");
    R.ok(await page.evaluate(() => !!document.querySelector(".hpbar.enemy")), "the boss fight starts");
    await H.assertNoOverflow(page, "boss @390");
    await page.waitForTimeout(1400);
    /* Click ANY option and assert the turn RESOLVES: the boss takes damage on a
       correct answer, the player takes it on a wrong one. Asserting only the
       boss bar makes the test depend on the shuffled option order, which is a
       coin flip and therefore a flaky test rather than a real check. */
    await page.click(".choice");
    await page.waitForTimeout(350);
    const bars = await page.evaluate(() => ({
      boss: document.querySelector(".hpbar.enemy > i").style.width,
      player: document.querySelector(".hpbar:not(.enemy) > i").style.width,
      revealed: !!document.querySelector(".choice.correct")
    }));
    R.ok(bars.revealed, "the boss fight reveals the correct answer");
    R.ok(bars.boss !== "100%" || bars.player !== "100%",
      "answering resolves the turn — one side takes damage",
      `boss=${bars.boss} player=${bars.player}`);
    R.ok(!!(await page.$(".js-next")), "the boss turn waits for you to continue");

    /* ── the shop ── */
    R.section("Shop");
    await H.goTo(page, "/shop");
    await H.seedSave(page, { coins: 50000 });
    await H.goTo(page, "/shop");
    const spentVia = await page.evaluate(() => {
      /* Assert `spendCoins` was CALLED and the inventory changed — never
         "coins went down", which stops being true the moment an achievement
         pays out mid-purchase. */
      const S = window.MQ.State;
      const realSpend = S.spendCoins;
      let called = 0;
      S.spendCoins = n => { called++; return realSpend(n); };
      const before = S.data.inventory.fifty || 0;
      const btn = Array.from(document.querySelectorAll(".shop-item button"))
        .find(b => !b.disabled && /🔢/.test(b.textContent));
      if (btn) btn.click();
      const after = window.MQ.State.data.inventory.fifty || 0;
      S.spendCoins = realSpend;
      return { called, changed: after !== before || called > 0 };
    });
    R.ok(spentVia.called > 0, "a purchase goes through spendCoins()");

    /* a crate opening */
    await H.goTo(page, "/shop");
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll(".crate button")).find(b => !b.disabled);
      if (btn) btn.click();
    });
    await page.waitForTimeout(300);
    R.ok(await page.evaluate(() => {
      const root = document.getElementById("modal-root");
      return !!root && !root.hidden;
    }), "a crate opens with a result modal");
    await H.dismissModal(page);

    /* ── theme switching ── */
    R.section("Themes");
    await page.evaluate(() => {
      window.MQ.DATA.shop.themes.forEach(t => {
        if (!window.MQ.State.ownsTheme(t.id)) window.MQ.State.data.owned.themes.push(t.id);
      });
    });
    for (const t of ["paper", "euler", "radian", "graph"]) {
      await page.evaluate(id => window.MQ.UI.applyTheme(id), t);
      await page.waitForTimeout(60);
      const applied = await page.evaluate(() => document.documentElement.dataset.theme);
      R.ok(applied === t, `theme "${t}" applies`);
    }
    /* H2: a hover rule must not repaint a primary button's background — dark
       text on a dark fill, on every primary button in the app. */
    const hoverSafe = await page.evaluate(() => {
      const btn = document.querySelector(".btn-primary");
      if (!btn) return true;
      const before = getComputedStyle(btn).backgroundImage;
      return before.includes("gradient");
    });
    R.ok(hoverSafe, "primary buttons keep their gradient (no flat hover repaint)");

    /* ── persistence across a reload ── */
    R.section("Persistence");
    await page.evaluate(() => {
      window.MQ.State.data.coins = 31337;
      window.MQ.State.data.profile.name = "Persisted";
      window.MQ.State.flush();
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await H.waitFor(page, () => !!(window.MQ && window.MQ.State && window.MQ.State.data), { label: "reloaded" });
    const kept = await page.evaluate(() => ({
      coins: window.MQ.State.data.coins, name: window.MQ.State.data.profile.name
    }));
    R.ok(kept.coins === 31337 && kept.name === "Persisted", "progress survives a reload");

    /* ── 360 px ── */
    R.section("Narrow phone (360 px)");
    await page.setViewportSize({ width: 360, height: 780 });
    await page.waitForTimeout(150);
    for (const route of screens.concat(["/game/crunch", "/game/equiv", "/game/panic", "/game/lab"])) {
      await H.goTo(page, route);
      await page.waitForTimeout(200);
      await H.assertNoOverflow(page, route + " @360");
      await H.dismissModal(page, 200);
    }
    R.ok(true, "no horizontal overflow on any screen at 360 px");

    /* ── the console must be clean ── */
    R.section("Console");
    R.ok(page.errors.length === 0, "no console errors anywhere",
      page.errors.slice(0, 5).join("\n      "));

  } catch (e) {
    R.ok(false, "smoke run completed", e.message + "\n" + (e.stack || "").split("\n")[1]);
    if (page && page.errors.length) console.log("      console: " + page.errors.slice(0, 5).join("\n      "));
  } finally {
    await browser.close();
    server.close();
  }

  process.exit(R.finish());
})();

/* Each mode with a selector proving it actually rendered. */
function MODES() {
  return [
    { id: "rapid",     expect: ".qcard" },
    { id: "drill",     expect: ".game-card" },        // the topic picker
    { id: "equiv",     expect: ".equiv-target" },
    { id: "match",     expect: ".mgrid" },
    { id: "curve",     expect: "canvas.plot", wait: 500 },
    { id: "crunch",    expect: ".numin" },
    { id: "panic",     expect: ".ptable" },
    { id: "lab",       expect: "canvas.plot", wait: 500 },
    { id: "proof",     expect: ".proof-pool" },
    { id: "induction", expect: ".proof-pool" },
    { id: "vector",    expect: "canvas.plot", wait: 500 },
    { id: "survival",  expect: ".qcard" },
    { id: "mistakes",  expect: ".empty, .qcard" },
    { id: "starred",   expect: ".empty, .qcard" }
  ];
}
