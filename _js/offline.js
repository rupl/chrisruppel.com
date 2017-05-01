(function () {
  "use strict";

  if (Modernizr.serviceworker) {
    // Get all Cache entries for this user.
    caches.keys().then(function(cacheNames) {
      // Define these just once instead of in the loop.
      var offlineContentList = $('#offline');
      var offlineContentEntry = $('#offline-content');
      var travelList = $('.trip-list');
      var travelContentEntries = $('.teaser--title');

      return Promise.all(
        // Loop through Cache entries.
        cacheNames.map(function(cacheName) {
          // Check if any have the offline article naming convention.
          if (cacheName.indexOf(OFFLINE_ARTICLE_PREFIX) !== -1) {
            // Extract the URL from cache name
            var cachedURL = cacheName.split('--')[1];

            // The cache name indicates that it was saved by the user.
            var cacheEntry = document.createElement('li');
            cacheEntry.innerHTML = '<a href="' + cachedURL + '">' + cacheName.split('/')[2].split('-').join(' ') + '</a>';

            // Append to DOM.
            if (!!offlineContentEntry) {
              console.info('Service Worker: found user-cached content ' + cacheName);
              offlineContentEntry.appendChild(cacheEntry);
            }

            // Set the offline box to display since we found something
            if (!!offlineContentList) {
              offlineContentList.classList.add('is-active');
            }

            // Set the Travel list to offline mode when Offline, but tag the
            // cached entries so they stay visible.
            if (!navigator.onLine && !!travelContentEntries) {
              travelList.classList.add('is-offline');
              var cachedEntry = $('.teaser--title[data-url="' + cachedURL + '"');
              if (!!cachedEntry) {
                cachedEntry.classList.add('is-cached');
              }
            }
          }
        })
      );
    });
  }
})();
