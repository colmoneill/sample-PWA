const cacheName = 'sample-pwa';
const filesToCache = [
  '.',
  'main.js',
  'index.html',
  'assets/css/style.css',
  '/sample-pwa/',
  '/sample-pwa/main.js',
  '/sample-pwa/index.html',
  '/sample-pwa/assets/css/style.css',

];

/* Cache contents when Offline See Cache */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline, examine Cache Storage */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});