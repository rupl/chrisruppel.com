//
// Service Worker for chrisruppel.com
//
'use strict';

// Cache polyfill
importScripts('/js/cache-polyfill.js');

// Config
var SW = {
  cache_version: 'v1::template',
  offline_assets: [
    '/',
    '/offline/',
    '/css/main.min.css',
    '/js/main.min.js',
    '//fonts.googleapis.com/css?family=Oswald:400,300'
  ]
};

// Installation
self.addEventListener('install', function installer (event) {
  event.waitUntil(
    caches
      .open(SW.cache_version)
      .then(function prefill(cache) {
        // Attempt to cache assets
        var cacheResult = cache.addAll(SW.offline_assets);

        // Report result
        console.info((!!cacheResult ? '👍' : '👎') + ' Caching process was ' + (!!cacheResult ? 'successful!' : 'not successful :('));

        return cacheResult;
      })
  );
});

// Activation
self.addEventListener('activate', function(event) {
  console.log("SW activated");
});

// Intercept requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
