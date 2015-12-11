//
// Service Worker for chrisruppel.com
//
'use strict';

// Cache polyfill
importScripts('/js/cache-polyfill.js');

// Config
var SW = {
  cache_version: 'main_v1.1.2',
  offline_assets: [
    '/',
    '/work/',
    '/offline/',
    '/css/main.min.css',
    '/css/fonts.min.css',
    '/js/main.min.js'
  ]
};

//
// Installation
//
self.addEventListener('install', function installer (event) {
  event.waitUntil(
    caches
      .open(SW.cache_version)
      .then(function prefill(cache) {
        // Attempt to cache assets
        var cacheResult = cache.addAll(SW.offline_assets);

        // Report result
        if (!!cacheResult) {
          console.info('Service Worker: caching process was successful!');
        } else {
          console.error('Service Worker: caching process failed.');
        }

        return cacheResult;
      })
  );
});

//
// Activation. First-load and also when a new version of SW is detected.
//
self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in SW.cache_version.
  //
  // @see https://github.com/GoogleChrome/samples/blob/e4df12c8642381243b6c1710c41394d85b33d82f/service-worker/prefetch/service-worker.js#L96-L117
  var expectedCacheNames = [SW.cache_version];

  // If you want multiple caches use this...
  // var expectedCacheNames = Object.keys(SW.cache_version).map(function(key) {
  //   return SW.cache_version[key];
  // });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            // If this cache name isn't present in the array of "expected"
            // cache names, then delete it.
            console.info('Deleting old cache: ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

//
// Intercept requests
//
self.addEventListener('fetch', function(event) {
  // Build a hostname-free version
  var reqLocation = getLocation(event.request.url);
  var reqPath = reqLocation.pathname;

  // Catch offline requests to useless URLs and serve offline page instead.
  if (
    event.request.method === 'GET' &&
    event.request.headers.get('accept').includes('text/html') &&
    SW.offline_assets.indexOf(reqPath) === -1
  ) {
    event.respondWith(
      fetch(event.request).catch(function(error) {
        return caches.open(SW.cache_version).then(function(cache) {
          console.info('Serving offline page.');
          return cache.match('/offline/');
        });
      })
    );
  } else {
    // Fallback cache for generic assets.
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }

});

// @see http://stackoverflow.com/a/21553982/175551
function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);

  return match && {
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  }
}
