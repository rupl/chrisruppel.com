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
      var offlineContentFound = false;

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
                offlineContentFound = true;
              }
            }
          }
        })
      ).then(function () {
        if (offlineContentFound) {
          // Append a message telling the user the list was filtered. Give them
          // the option to remove the filter.
          var message = document.createElement('aside');
          message.id = 'travel-list-filter-message';
          message.classList.add('warning');
          message.innerHTML = '<p>This list has been reduced to show you only the stuff you personally have saved. <a href="#all" id="travel-list-show-all">Want to see it all?</a></p>';
          travelList.appendChild(message);

          // Set up listener for button to show all entries.
          var allButton = $('#travel-list-show-all');
          if (!!allButton) {
            allButton.on('click', function () {
              travelList.classList.remove('is-offline');
              message.parentNode.removeChild(message);
            });
          }
        }
      });
    });
  }
})();
