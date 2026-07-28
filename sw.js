/* MoleQuest service worker — precaches the whole app so it runs with no signal.
   Bump CACHE whenever any precached file changes; the old cache is then dropped
   on activate. Keep PRECACHE in sync with the files on disk (the content
   validator asserts this, so a missing entry fails the build check). */

const CACHE = "molequest-v5";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "assets/icon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/apple-touch-icon.png",
  "js/data/ions.js",
  "js/data/questions-y11.js",
  "js/data/questions-m5.js",
  "js/data/questions-m6.js",
  "js/data/questions-m7.js",
  "js/data/questions-m8.js",
  "js/data/questions-extra.js",
  "js/data/questions-extra2.js",
  "js/data/questions-m1a.js",
  "js/data/questions-m2a.js",
  "js/data/questions-m3a.js",
  "js/data/questions-m4a.js",
  "js/data/questions-m5a.js",
  "js/data/questions-m6a.js",
  "js/data/equations.js",
  "js/data/organic.js",
  "js/data/flashcards.js",
  "js/data/shop.js",
  "js/data/achievements.js",
  "js/data/arcade.js",
  "js/core/util.js",
  "js/core/audio.js",
  "js/core/fx.js",
  "js/core/state.js",
  "js/core/bank.js",
  "js/core/ui.js",
  "js/core/arcade.js",
  "js/games/quiz.js",
  "js/games/balance.js",
  "js/games/ionmatch.js",
  "js/games/naming.js",
  "js/games/calc.js",
  "js/games/titration.js",
  "js/games/pathway.js",
  "js/games/precipitate.js",
  "js/games/boss.js",
  "js/games/survival.js",
  "js/games/arcade-ioncrush.js",
  "js/games/arcade-runner.js",
  "js/games/arcade-merge.js",
  "js/screens/home.js",
  "js/screens/play.js",
  "js/screens/study.js",
  "js/screens/progress.js",
  "js/screens/shop.js",
  "js/screens/misc.js",
  "js/app.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      // cache:"reload" bypasses the HTTP cache so an update never precaches stale files.
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

/* The page asks us to take over immediately when the user accepts an update. */
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
    event.respondWith(
      caches.match("./index.html").then(hit => hit || fetch(req))
    );
    return;
  }

  // Everything else is a static asset: serve from cache, fall back to the network
  // and cache whatever we get so a partially-warmed cache heals itself.
  event.respondWith(
    caches.match(req).then(hit => {
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
