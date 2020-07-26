const CACHE = "dev";
const URL = ["index.html", "offline.html"];
const self = this;

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE).then((cache) => {
            return cache.addAll(URL);
        })
    );
});
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then(() => {
            return fetch(e.request).catch(() => caches.match("offline.html"));
        })
    );
});

self.addEventListener("activate", (e) => {
    const newCache = [];
    newCache.push(CACHE);
    e.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!newCache.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});