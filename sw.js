/* MathQuest service worker — precaches the whole app so it runs with no signal.

   BUMP `CACHE` ON EVERY CHANGE TO A PRECACHED FILE. Shipping a commit that
   changes four JS files without bumping means anyone already installed keeps
   serving the old code from cache — the fix in that commit can never reach
   them. tests/validate.js diffs PRECACHE against the files on disk and asserts
   the version matches MQ.VERSION, so drift fails the build rather than
   silently stranding users on an old build.

   Note that switching syllabus tiers changes the file list, so that also has
   to bump the cache. */

const CACHE = "mathquest-v1.0.0";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "assets/icon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/apple-touch-icon.png",

  "js/core/util.js",
  "js/core/expr.js",
  "js/core/draw.js",
  "js/core/audio.js",
  "js/core/fx.js",
  "js/data/tiers.js",
  "js/core/state.js",
  "js/core/bank.js",
  "js/core/ui.js",
  "js/core/arcade.js",

  "js/data/questions-ma-functions.js",
  "js/data/questions-ma-trig.js",
  "js/data/questions-ma-calculus.js",
  "js/data/questions-ma-integration.js",
  "js/data/questions-ma-financial.js",
  "js/data/questions-ma-statistics.js",
  "js/data/questions-ma-mixed.js",

  /* Extension 1 — remove these five entries for an Advanced-only build. */
  "js/data/questions-me-functions.js",
  "js/data/questions-me-trig.js",
  "js/data/questions-me-calculus.js",
  "js/data/questions-me-discrete.js",
  "js/data/questions-me-vectors.js",

  "js/data/generators.js",
  "js/data/flashcards.js",
  "js/data/proofs.js",
  "js/data/reference.js",
  "js/data/shop.js",
  "js/data/achievements.js",
  "js/data/arcade.js",

  "js/games/quiz.js",
  "js/games/equiv.js",
  "js/games/match.js",
  "js/games/curve.js",
  "js/games/crunch.js",
  "js/games/panic.js",
  "js/games/lab.js",
  "js/games/proof.js",
  "js/games/vector.js",
  "js/games/survival.js",
  "js/games/boss.js",
  "js/games/arcade-crush.js",
  "js/games/arcade-runner.js",
  "js/games/arcade-tower.js",

  "js/screens/home.js",
  "js/screens/play.js",
  "js/screens/study.js",
  "js/screens/reference.js",
  "js/screens/progress.js",
  "js/screens/shop.js",
  "js/screens/misc.js",
  "js/app.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      // cache:"reload" bypasses the HTTP cache, so an update never precaches
      // the stale copies it was meant to replace.
      .then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: "reload" }))))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The page asks us to take over immediately when it finds a waiting worker,
   or when the user accepts an update prompt. */
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations always resolve to the shell — routing is client-side via the hash.
  if (req.mode === "navigate") {
    event.respondWith(caches.match("./index.html").then(hit => hit || fetch(req)));
    return;
  }

  // Everything else: cache first, fall back to the network, and cache whatever
  // comes back so a partially-warmed cache heals itself.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
    })
  );
});
