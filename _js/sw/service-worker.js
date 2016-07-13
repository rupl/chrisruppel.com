//
// Service Worker for chrisruppel.com
//
'use strict';

// Cache polyfill
importScripts('/js/cache-polyfill.js');

// Config
var OFFLINE_ARTICLE_PREFIX = 'chrisruppel-offline--';
var SW = {
  cache_version: 'main_v1.7.0',
  offline_assets: [
    '/',
    '/offline/',
    '/work/',
    '/about/',
    '/about/site/',
    '/travel/list/',
    '/css/main.min.css',
    '/css/fonts.min.css',
    '/js/main.min.js',
    '/static/chris-ruppel-2015@320.jpg',
    '/static/chris-ruppel-2015@640.jpg'
  ]
};


//
// Installation
//
self.addEventListener('install', function installer(event) {
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
          // Two conditions must be met in order to delete the cache:
          //
          // 1. It must NOT be found in the main SW cache list.
          // 2. It must NOT be prefixed with our offline article prefix.
          if (
            expectedCacheNames.indexOf(cacheName) === -1 &&
            cacheName.indexOf(OFFLINE_ARTICLE_PREFIX) === -1
          ) {
            // If this cache name isn't present in the array of "expected"
            // cache names, then delete it.
            console.info('Service Worker: deleting old cache ' + cacheName);
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
  var requestIsHTML = event.request.headers.get('accept').includes('text/html')
                   && event.request.method === 'GET';
  var requestIsAsset = /^(\/css\/|\/js\/|\/static\/)/.test(reqPath);
  var requestIsImage = /^(\/img\/)/.test(reqPath);


  // Saved articles, MVW pages, Offline
  //
  // First, we check to see if the user has explicitly cached this HTML content
  // or if the page is in the "minimum viable website" list defined in the main
  // SW.cache_version. If no cached page is found, we fallback to the network,
  // and finally if both of those fail, serve the "Offline" page.
  if (
    requestIsHTML
  ) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        // Show old content while revalidating URL in background if necessary.
        return staleWhileRevalidate(event.request, true);
      }).catch(function(error) {
        // When the cache is empty and the network also fails, we fall back to a
        // generic "Offline" page.
        return caches.match('/offline/');
      })
    );
  }

  // CSS/JS
  //
  // SW will respond with cache if there's a hit, but look for a new version
  // in the background so that the next page load will be fresh. We only want
  // to manage first-party assets for now.
  //
  // @see http://12devsofxmas.co.uk/2016/01/day-9-service-worker-santas-little-performance-helper/
  else if (requestIsAsset) {
    event.respondWith(staleWhileRevalidate(event.request, false));
  }

  // Images
  //
  // Use a simple Cache-then-Network strategy.
  else if (requestIsImage) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        // Look in the Cache and fall back to Network.
        // console.info('Fetch listener served image ' + reqPath);
        return response || fetch(event.request);
      })
    );
  }

  // Uncaught — mostly for debugging
  //
  // This request fell through all our conditions and is being ignored by SW.
  // else {
  //   console.info('Fetch listener ignored ' + reqPath);
  // }
});

// Stale While Revalidate
//
// Helper function to manage cache updates in the background.
function staleWhileRevalidate(request, updateUserCache) {
  updateUserCache = updateUserCache || false;

  // Build a hostname-free version of request path.
  var reqLocation = getLocation(request.url);
  var reqPath = reqLocation.pathname;

  // Open the default cache and look for this request. We have to restrict this
  // lookup to one cache because we want to make sure we don't add new entries
  // unless really necessary (third-party assets, unsaved content, etc).
  var defaultCachePromise = caches.open(SW.cache_version);
  var defaultMatchPromise = defaultCachePromise.then(function(cache) {
    return cache.match(request);
  });

  // Find any user-saved articles so we can update outdated content. We use a
  // different format than the default because we need to use the .has() method
  // before opening the cache. Using .open() directly causes many empty caches
  // to be created for each irrelevant request that runs the code.
  //
  // @TODO: patch this block so that checking the cache does not create empty
  //        caches. Currently, my code will create an empty cache for every URL
  //        visited which doesn't have a cache entry.
  if (updateUserCache) {
    var userCachePromise = caches.has(OFFLINE_ARTICLE_PREFIX + reqPath).then(function maybeOpenCache(cacheExists) {
      return caches.open(OFFLINE_ARTICLE_PREFIX + reqPath);
    }).catch(function () {
      console.error('No user cache entry for ' + reqPath);
    });
    var userMatchPromise = userCachePromise.then(function matchUserCache(cache) {
      console.info('cache', cache);
      return cache.match(request);
    });
  }

  return Promise.all([defaultCachePromise, defaultMatchPromise, userCachePromise, userMatchPromise]).then(function(promiseResults) {
    // When ES2015 isn't behind a flag anymore, move these vars to an array
    // in the function signature to destructure the results of the Promise.
    var defaultCache = promiseResults[0];
    var defaultResponse = promiseResults[1];
    var userCache = promiseResults[2];
    var userResponse = promiseResults[3];

    // Determine whether any cache holds data for this request.
    var requestIsInDefaultCache = typeof defaultResponse !== 'undefined';
    var requestIsInUserCache = typeof userResponse !== 'undefined';

    // Kick off the update request in the background.
    var fetchResponse = fetch(request).then(function(response) {
      // Determine whether this is first or third-party request.
      var requestIsFirstParty = response.type === 'basic';

      // IF the DEFAULT cache already has an entry for this asset,
      // AND the resource is in our control,
      // AND there was a valid response,
      // THEN update the cache with the new response.
      if (requestIsInDefaultCache && requestIsFirstParty && response.status === 200) {
        // Cache the updated file and then return the response
        defaultCache.put(request, response.clone());
        console.info('Fetch listener updated ' + reqPath);
      }

      // IF the USER cache already has an entry for this asset,
      // AND the resource is in our control,
      // AND there was a valid response,
      // AND the function options allow user cache updating,
      // THEN update the cache with the new response.
      else if (updateUserCache && requestIsInUserCache && requestIsFirstParty && response.status === 200) {
        // Cache the updated file and then return the response
        userCache.put(request, response.clone());
        console.info('Fetch listener updated ' + reqPath);
      } else {
        console.info('Fetch listener skipped ' + reqPath);
      }

      // Return response regardless of caching outcome.
      return response;
    });

    // Return any cached responses if we have one, otherwise wait for the
    // network response to come back.
    return defaultResponse || userResponse || fetchResponse;
  });
}

// Polyfill for window.location
//
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
