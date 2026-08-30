/* myday console service worker.
 *
 * This exists for one reason: a page is only allowed to raise a real iOS
 * notification through a service worker, and the 15-minute reminder wants to be
 * a real notification rather than a banner inside the app.
 *
 * It has NO fetch handler, on purpose. A worker that answers fetches can serve a
 * cached copy of the app, and this app updates itself by fetching its own URL and
 * reading the build string out of it. A caching worker would strand the phone on
 * an old build with no way to push a fix. Do not add one.
 */
self.addEventListener('install',  function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(function (cs) {
    if (cs.length) return cs[0].focus();
    return self.clients.openWindow('./');
  }));
});
