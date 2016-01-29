//
// Service Worker for chrisruppel.com
//
'use strict';

// Cache polyfill
importScripts('/js/cache-polyfill.js');

// Config
var SW = {
  cache_version: 'main_v1.3.1',
  offline_assets: [
    '/',
    '/offline/',
    '/work/',
    '/about/',
    '/about/site/',
    '/travel/list/',
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
            console.info('Service Worker: deleting old cache: ' + cacheName);
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
  // Build a hostname-free version of request path.
  var reqLocation = getLocation(event.request.url);
  var reqHost = reqLocation.hostname;
  var reqPath = reqLocation.pathname;

  // Consolidate some conditions for re-use.
  var requestIsHTML = event.request.headers.get('accept').includes('text/html');
  var requestIsAsset = /^(\/css\/|\/js\/)/.test(reqPath);

  // Offline HTML
  //
  // Intercept offline requests to uncached URLs and serve offline page instead.
  if (
    requestIsHTML &&
    event.request.method === 'GET' &&
    SW.offline_assets.indexOf(reqPath) === -1
  ) {
    // If the above conditional is met, the user loaded a URL that is not in our
    // SW cache, so just return the Offline content.
    event.respondWith(
      fetch(event.request).catch(function(error) {
        return caches.open(SW.cache_version).then(function(cache) {
          console.info('Fetch listener served offline page.');
          return cache.match('/offline/');
        });
      })
    );
  }

  // Stale While Revalidate
  //
  // SW will respond with cache if there's a hit, but look for a new version
  // in the background so that the next page load will be fresh.
  //
  // @see http://12devsofxmas.co.uk/2016/01/day-9-service-worker-santas-little-performance-helper/
  else if (requestIsHTML || requestIsAsset) {
    event.respondWith(returnFromCacheOrFetch(event.request));
  }

  // Uncaught
  //
  // This request fell through all our conditions and is being ignored by SW.
  // else {
  //   console.info('Fetch listener ignored ' + reqPath);
  // }
});

// Helper function to handle Fetch listener.
function returnFromCacheOrFetch(request) {
  // Build a hostname-free version of request path.
  var reqLocation = getLocation(request.url);
  var reqPath = reqLocation.pathname;

  var cachePromise = caches.open(SW.cache_version);
  var matchPromise = cachePromise.then(function(cache) {
    return cache.match(request);
  });

  return Promise.all([cachePromise, matchPromise]).then(function(promiseResults) {
    // When ES2015 isn't behind a flag anymore, move these two vars to an array
    // in the function signature to destructure the results of the Promise.
    var cache = promiseResults[0];
    var cacheResponse = promiseResults[1];

    // Kick off the update request in the background.
    var fetchPromise = fetch(request).then(function(fetchResponse) {
      // If the resource is unchanged, skip the caching process.
      if (fetchResponse.status !== 304) {
        // Cache the updated file and then return the response
        cache.put(request, fetchResponse.clone());
        console.info('Fetch listener updated ' + reqPath);
      }
      else {
        console.info('Fetch listener skipped ' + reqPath);
      }

      // Return response regardless of caching outcome.
      return fetchResponse;
    });

    // Return the cached response if we have it, otherwise wait for the
    // actual response to come back.
    return cacheResponse || fetchPromise;
  });
}


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
  };
}
