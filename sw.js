// Service worker for the WPS Staff Hub.
//
// This does NOT cache anything or work offline — every request just goes
// straight to the network, same as if there were no service worker at all.
// Its only job is to exist and be registered, because iOS Safari only grants
// "installed" web apps (added to the Home Screen) protection from its
// aggressive local-storage clearing once the site has a real manifest.json
// *and* a controlling service worker. Without this, staff signed in and
// using the app as a Home Screen icon could get signed out as soon as they
// closed the app, regardless of how long the session is set to last.
//
// (An earlier version of this file tried to also cache vendor libraries
// for faster repeat opens on weak signal, but that caused "React is not
// defined" crashes for staff — the caching logic interfered with how the
// React/ReactDOM scripts loaded. Reverted back to this simple, reliable
// passthrough-only version; not worth the risk of breaking the app to get
// that speed-up. Also explicitly clears out any cache that earlier,
// broken version may have already created on someone's device.)

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
