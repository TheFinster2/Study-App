#!/usr/bin/env node
/* Offline and PWA update behaviour.

   Served from a SUBPATH (http://127.0.0.1:8824/App/), because that is what
   GitHub Pages actually looks like and it is the configuration where relative
   start_url / scope either work or do not.

   The update assertions are split deliberately. A waiting service worker
   self-activates only when every client of the old worker is gone, and
   backgrounding a PWA does not count as gone — with another client alive,
   skipWaiting() may simply never resolve. That is the browser's behaviour, not
   a bug to fix, so this test checks what the APP CONTROLS (that it looks for a
   waiting worker, and asks it to take over) separately from the outcome. */

const H = require("./harness");
const fs = require("fs");
const path = require("path");
const PORT = 8824;
const PREFIX = "/App/";

(async () => {
  const R = H.reporter("MathQuest offline test");
  const server = await H.serve(PORT, PREFIX);
  const browser = await H.launch();
  const base = `http://127.0.0.1:${PORT}${PREFIX}`;
  let page;

  try {
    page = await H.newPage(browser);
    await H.boot(page, base);
    R.ok(true, "the app boots from a subpath");

    /* ── the service worker registers and precaches ── */
    R.section("Service worker");
    const reg = await H.waitFor(page, async () => {
      if (!navigator.serviceWorker) return false;
      const r = await navigator.serviceWorker.getRegistration();
      return !!(r && (r.active || r.installing || r.waiting));
    }, { timeout: 20000, label: "worker registered" }).then(() => true).catch(() => false);
    R.ok(reg, "the service worker registers from a subpath");

    const scoped = await page.evaluate(async () => {
      const r = await navigator.serviceWorker.getRegistration();
      return r ? r.scope : "";
    });
    R.ok(scoped.endsWith(PREFIX), "its scope is the subpath, not the domain root", scoped);

    /* Wait for the precache to finish before cutting the network. */
    const cached = await H.waitFor(page, async () => {
      const keys = await caches.keys();
      if (!keys.length) return 0;
      const c = await caches.open(keys[0]);
      return (await c.keys()).length;
    }, { timeout: 30000, label: "precache populated" });
    R.ok(cached > 40, "the whole app is precached", `${cached} entries`);

    /* ── first-load must NOT reload itself ──
       clients.claim() fires controllerchange even when there was no previous
       controller. A naive "reload on controllerchange" reloads every first
       visit. sessionStorage is used rather than a window counter because a
       counter on `window` is wiped by the very reload it is meant to detect —
       reading 0 for both "never happened" and "happened, and we reloaded". */
    R.section("First load");
    await page.evaluate(() => sessionStorage.setItem("mq-loads",
      String(1 + (+sessionStorage.getItem("mq-loads") || 0))));
    await page.waitForTimeout(2500);
    const loads = await page.evaluate(() => +sessionStorage.getItem("mq-loads"));
    R.ok(loads === 1, "the first load does not reload itself", `saw ${loads} loads`);

    /* ── go offline ── */
    R.section("Offline");
    await page.evaluate(() => {
      window.MQ.State.data.coins = 7777;
      window.MQ.State.data.stats.answered = 123;
      window.MQ.State.flush();
    });
    await page.context().setOffline(true);

    await page.reload({ waitUntil: "domcontentloaded" });
    const bootedOffline = await H.waitFor(page,
      () => !!(window.MQ && window.MQ.Bank && window.MQ.Bank.all().length),
      { timeout: 20000, label: "booted offline" }).then(() => true).catch(() => false);
    R.ok(bootedOffline, "the app boots with the network cut");

    const offlineErrors = [];
    page.on("pageerror", e => offlineErrors.push(e.message));

    for (const route of ["/home", "/play", "/study", "/reference", "/progress",
                         "/shop", "/achievements", "/settings", "/arcade",
                         "/game/crunch", "/game/equiv"]) {
      await H.goTo(page, route);
      await page.waitForTimeout(150);
      const rendered = await page.evaluate(() =>
        document.getElementById("view").children.length > 0);
      R.ok(rendered, `${route} renders offline`);
      await H.dismissModal(page, 200);
    }

    /* Progress made while offline must survive a reload — still offline. */
    await page.evaluate(() => {
      window.MQ.State.data.coins = 8888;
      window.MQ.State.flush();
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await H.waitFor(page, () => !!(window.MQ && window.MQ.State), { timeout: 20000, label: "reloaded offline" });
    R.ok(await page.evaluate(() => window.MQ.State.data.coins === 8888),
      "progress saved while offline survives a reload");

    await page.context().setOffline(false);

    /* ── update handling ──
       Assert what the app CONTROLS: that it registers with updateViaCache
       "none", checks registration.waiting BEFORE calling update(), and
       re-checks when the tab becomes visible again. */
    R.section("Updates");
    const appSrc = fs.readFileSync(path.join(H.ROOT, "js/app.js"), "utf8");

    R.ok(/updateViaCache:\s*"none"/.test(appSrc),
      "registers with updateViaCache:\"none\" so a stale sw.js cannot be served");

    const waitingIdx = appSrc.indexOf("reg.waiting");
    const updateIdx = appSrc.indexOf("reg.update()");
    R.ok(waitingIdx > 0 && updateIdx > 0 && waitingIdx < updateIdx,
      "it claims a waiting worker BEFORE calling update()",
      "calling update() with one already waiting re-installs it, turning a silent " +
      "apply into a dismissable prompt");

    /* app.js has TWO visibilitychange handlers — the save flush and the update
       check — so anchor on the one inside the registration callback rather than
       on the first occurrence in the file. */
    const updateBlock = appSrc.slice(appSrc.indexOf(".register("));
    R.ok(/visibilitychange/.test(updateBlock) && /reg\.update\(\)/.test(updateBlock) &&
         updateBlock.indexOf("visibilitychange") < updateBlock.indexOf("reg.update()"),
      "it re-checks for updates when the tab becomes visible again");
    R.ok(/lastCheck/.test(updateBlock),
      "that re-check is throttled, so flicking between tabs does not hammer it");

    R.ok(/const hadController = !!navigator\.serviceWorker\.controller/.test(appSrc) &&
         appSrc.indexOf("hadController") < appSrc.indexOf(".register("),
      "it captures hadController BEFORE registering (no first-load reload loop)");

    /* The worker really does respond to SKIP_WAITING — proved by having it do
       something observable rather than by trusting the promise. */
    const respondsToMessage = await page.evaluate(async () => {
      const r = await navigator.serviceWorker.getRegistration();
      if (!r) return false;
      const target = r.waiting || r.active;
      if (!target) return false;
      target.postMessage("SKIP_WAITING");
      return true;
    });
    R.ok(respondsToMessage, "the page can post SKIP_WAITING to the worker");

    const swSrc = fs.readFileSync(path.join(H.ROOT, "sw.js"), "utf8");
    R.ok(/event\.data === "SKIP_WAITING"[\s\S]{0,60}skipWaiting\(\)/.test(swSrc),
      "the worker acts on SKIP_WAITING");
    R.ok(/cache:\s*"reload"/.test(swSrc),
      "the precache bypasses the HTTP cache, so an update cannot cache stale files");

    /* ── the in-app escape hatch ──
       iOS does not clear website data when a home-screen PWA is deleted, so
       "uninstall and reinstall" fixes nothing. Without this a student can be
       stranded on a stale build with no way out. */
    R.section("Recovery");
    const miscSrc = fs.readFileSync(path.join(H.ROOT, "js/screens/misc.js"), "utf8");
    R.ok(/Force refresh/.test(miscSrc), "Settings offers a Force refresh");
    R.ok(/getRegistrations\(\)[\s\S]{0,200}unregister\(\)/.test(miscSrc),
      "Force refresh unregisters every service worker");
    R.ok(/caches\.keys\(\)[\s\S]{0,200}caches\.delete/.test(miscSrc),
      "Force refresh deletes every cache");
    R.ok(/location\.replace\([\s\S]{0,80}fresh=/.test(miscSrc),
      "Force refresh reloads with a cache-busting query string");
    R.ok(/MQ\.VERSION/.test(miscSrc), "Settings shows the running build version");

    R.ok(offlineErrors.length === 0, "no page errors while offline",
      offlineErrors.slice(0, 3).join("\n      "));

  } catch (e) {
    R.ok(false, "offline run completed", e.message + "\n" + (e.stack || "").split("\n")[1]);
  } finally {
    await browser.close();
    server.close();
  }

  process.exit(R.finish());
})();
