(function () {
  "use strict";

  // Get all Cache entries for this user.
  caches.keys().then(function(cacheNames) {
    // Define these just once instead of in the loop.
    var offlineContentList = $('#offline');
    var offlineContentEntry = $('#offline-content');

    return Promise.all(
      // Loop through Cache entries.
      cacheNames.map(function(cacheName) {
        // Check if any have the offline article naming convention.
        if (cacheName.indexOf(OFFLINE_ARTICLE_PREFIX) !== -1) {
          // The cache name indicates that it was saved by the user.
          var cacheEntry = document.createElement('li');
          cacheEntry.innerHTML = '<a href="' + cacheName.split('--')[1] + '">' + cacheName.split('/')[2] + '</a>';

          // Append to DOM.
          if (!!offlineContentEntry) {
            console.info('Service Worker: found user-cached content ' + cacheName);
            offlineContentEntry.appendChild(cacheEntry);
          }

          // Set the offline box to display since we found something
          if (!!offlineContentList) {
            offlineContentList.classList.add('is-active');
          }
        }
      })
    );
  });
})();
