//
// Service Worker for chrisruppel.com
//
'use strict';

// Cache polyfill
importScripts('/js/cache-polyfill.js');

// Config
var SW = {
  cache_version: 'v1::main',
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
  console.info("Service Worker: activated");
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
