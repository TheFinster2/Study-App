/* Shared harness for the Playwright tests: a static server, a browser, and the
   handful of helpers that stop the browser tests being flaky.

   Three of those helpers exist because of specific, expensive mistakes:

   · goTo() calls UI.go() directly rather than assigning location.hash.
     Assigning an UNCHANGED hash fires no hashchange, so the router never runs
     and the test hangs waiting for a screen that was never rendered.
   · dismissModal() polls for the modal instead of sleeping. Results modals
     open on a delay, so a naive "click the button" races the animation.
   · waitFor() polls for a condition with a deadline. A fixed waitForTimeout
     passes for weeks and then starts failing intermittently purely because
     the data banks got bigger and boot got slower. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const ROOT = path.join(__dirname, "..");
const EXECUTABLE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml", ".png": "image/png"
};

/**
 * Serve the app. `prefix` mounts it on a subpath — which is what GitHub Pages
 * actually looks like, and the configuration where relative start_url/scope
 * either work or do not.
 */
function serve(port, prefix) {
  const base = prefix || "/";
  const server = http.createServer((req, res) => {
    let url = decodeURIComponent(req.url.split("?")[0]);
    if (!url.startsWith(base)) { res.writeHead(404); return res.end("not found"); }
    url = url.slice(base.length);
    if (url === "" || url === "/") url = "index.html";
    const file = path.join(ROOT, url.replace(/^\/+/, ""));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end("not found");
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "Service-Worker-Allowed": base
    });
    res.end(fs.readFileSync(file));
  });
  return new Promise(resolve => server.listen(port, "127.0.0.1", () => resolve(server)));
}

async function launch() {
  return chromium.launch({ executablePath: EXECUTABLE, args: ["--no-sandbox"] });
}

/** A page that fails the test on ANY console error or page error. */
async function newPage(browser, opts) {
  const o = opts || {};
  const ctx = await browser.newContext({
    viewport: o.viewport || { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.errors = errors;
  return page;
}

/** Poll for a condition with a deadline. Never a fixed sleep. */
async function waitFor(page, fn, opts) {
  const o = opts || {};
  const deadline = Date.now() + (o.timeout || 15000);
  for (;;) {
    let v = false;
    try { v = await page.evaluate(fn); } catch (e) { v = false; }
    if (v) return v;
    if (Date.now() > deadline) throw new Error("waitFor timed out: " + (o.label || fn.toString().slice(0, 80)));
    await page.waitForTimeout(50);
  }
}

async function boot(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitFor(page, () => !!(window.MQ && window.MQ.UI && window.MQ.Bank && window.MQ.Bank.all().length),
    { label: "app booted" });
  // Dismiss the first-run welcome, which opens on a delay.
  await page.waitForTimeout(1100);
  await dismissModal(page);
}

/** Navigate by calling the router directly. */
async function goTo(page, route) {
  await page.evaluate(r => window.MQ.UI.go(r), route);
  await page.waitForTimeout(120);
}

/** Wait for a modal, then close it. Handles the delayed results overlay. */
async function dismissModal(page, timeout) {
  const deadline = Date.now() + (timeout || 3000);
  for (;;) {
    const open = await page.evaluate(() => {
      const root = document.getElementById("modal-root");
      return !!(root && !root.hidden);
    });
    if (open) {
      await page.evaluate(() => window.MQ.UI.closeModal());
      await page.waitForTimeout(80);
      return true;
    }
    if (Date.now() > deadline) return false;
    await page.waitForTimeout(60);
  }
}

/** Set the save file to a known state before measuring anything. */
async function seedSave(page, patch) {
  await page.evaluate(p => {
    const S = window.MQ.State;
    Object.assign(S.data, p);
    S.flush();
  }, patch);
}

/**
 * Silence every reward source except the one under test.
 *
 * Level-ups pay coins RAW, bypassing the payout multiplier, and one-off
 * achievement rewards are raw too. Both swamp a run's own award: a real
 * 25% payout change once measured as 1% because of exactly this. Pin the
 * level mid-range and pre-mark every achievement as earned.
 */
async function quiesce(page) {
  await page.evaluate(() => {
    const S = window.MQ.State;
    S.data.level = 30;
    S.data.xpIntoLevel = 0;
    window.MQ.DATA.achievements.forEach(a => { S.data.achievements[a.id] = 1; });
    S.data.coins = 100000;
    S.data.streak = { count: 0, lastDay: null, longest: 0 };
    S.flush();
  });
}

async function snapshot(page) {
  return page.evaluate(() => {
    const d = window.MQ.State.data;
    return { xp: d.lifetimeXp, level: d.level, coins: d.coins, answered: d.stats.answered };
  });
}

/** Horizontal overflow anywhere is a layout bug. Check at both phone widths. */
async function assertNoOverflow(page, label) {
  const over = await page.evaluate(() => {
    const de = document.documentElement;
    const widest = Array.from(document.querySelectorAll("body *"))
      .filter(el => el.getBoundingClientRect().width > de.clientWidth + 1)
      .slice(0, 3)
      .map(el => el.tagName + "." + (el.className || "").toString().slice(0, 40));
    return { scroll: de.scrollWidth, client: de.clientWidth, widest };
  });
  if (over.scroll > over.client + 1) {
    throw new Error(`horizontal overflow on ${label}: ${over.scroll} > ${over.client}` +
      (over.widest.length ? " — " + over.widest.join(", ") : ""));
  }
}

/* ── a tiny reporter ──────────────────────────────────────── */
function reporter(title) {
  let failures = 0, count = 0;
  console.log(title);
  return {
    ok(cond, label, detail) {
      count++;
      if (cond) { console.log("  ✓ " + label); return true; }
      failures++;
      console.log("  ✗ " + label + (detail ? "\n      " + detail : ""));
      return false;
    },
    info(label) { console.log("  · " + label); },
    section(name) { console.log("\n" + name); },
    finish() {
      console.log("\n" + "─".repeat(58));
      console.log(failures === 0 ? `✓ all ${count} checks passed` : `✗ ${failures} of ${count} checks FAILED`);
      return failures === 0 ? 0 : 1;
    },
    get failures() { return failures; }
  };
}

module.exports = { serve, launch, newPage, boot, goTo, waitFor, dismissModal,
                   seedSave, quiesce, snapshot, assertNoOverflow, reporter, ROOT };
