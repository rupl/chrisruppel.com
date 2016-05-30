//
// Trip entry enhancements
//

//
// Permalink focus/blur
//
(function () {
  var entry_uid = document.querySelector('#uid');

  if (entry_uid) {
    // Highlight permalink when clicked/tapped
    document.querySelector('#uid').addEventListener('click', copyUid);
    document.querySelector('label[for=uid]').addEventListener('click', copyUid);
  }

  function copyUid() {
    document.querySelector('#uid').select();
  }
});

//
// Cache button. Depends on SW support
//
(function (Modernizr) {
  if (Modernizr.serviceworker) {
    var currentURL = window.location.href;
    var currentPath = window.location.pathname;
    var $entry = $('.h-entry--main');
    var $commentButton = $('#comments-link');

    // If there seems to be a connection, the entry has content, and the
    // location of the button can be targeted, create the cache button.
    if (navigator.onLine && $entry !== null && $commentButton !== null) {
      // Create cache button's basic properties.
      var cacheButton = document.createElement('button');
      cacheButton.setAttribute('id', 'cache-button');
      cacheButton.classList.add('btn', 'btn--offline');

      // Default text is to simply save article. In the pageCache Promise, this
      // text might be overridden with 'Update' text and attribute.
      cacheButton.innerText = 'Save article offline';

      //
      // Check the cache and alter the UI based on whether we find an entry.
      // Instead of looking for cache key, we match on the current URL to be
      // sure that we already have an actual cached copy of the page.
      //
      var pageCache = caches.match(currentURL);
      pageCache.then(function updateButtonText(response) {
        if (typeof response !== 'undefined') {
          cacheButton.innerText = 'Update saved article';
          cacheButton.dataset.state = 'update';
        }
      });

      // If something goes wrong looking up caches, catch the error and log it.
      pageCache.catch(function (error) {
        console.error(error);
      });

      // Insert button into DOM.
      $commentButton.parentNode.insertBefore(cacheButton, $commentButton);

      // It would be really slick to calculate the amount of data that would be
      // stored when the save button is pushed. Maybe this number is possible to
      // generate without incurring extra downloading.
      //
      // @see http://stackoverflow.com/questions/1310378/determining-image-file-size-dimensions-via-javascript

      // 'Save Offline' functionality.
      cacheButton.on('click', function(event) {
        event.preventDefault();

        // Set a 'working' class on the button to display interaction
        cacheButton.classList.add('working');

        // Build an array of the page-specific resources.
        var pageResources = [currentPath];

        // Loop through any gallery images and save to pageResources array.
        var images = $$('.gallery img');
        Array.prototype.map.call(images, function (img) {
          pageResources.push(img.currentSrc);
        });

        // TODO: maps... somehow cache MapBox tiles?
        // TODO: photosphere assets (img/JS)

        // Open cache and save current assets. If the cache already exists it is
        // overwriting the existing files.
        caches.open('chrisruppel-offline--' + currentPath).then(function(cache) {
          var updateCache = cache.addAll(pageResources);

          // Update UI to indicate progress.
          blurAll();
          cacheButton.classList.remove('working');
          cacheButton.classList.add('saved');
          cacheButton.innerText = 'Fetching content...';
          cacheButton.disabled = true;

          // Update UI to indicate success.
          updateCache.then(function() {
            // Set UI text based on whether the article was cached already or not.
            if (cacheButton.dataset.state === 'update') {
              cacheButton.innerText = 'Article updated!';
              displayMessage('Offline article has been updated. Glad it\'s useful!');
            } else {
              cacheButton.innerText = 'Article saved!';
              displayMessage('Article is now available offline. Hope it comes in handy!');
            }

            console.info('Service Worker saved an entry offline: ' + currentPath);
          });

          // Catch any errors and report.
          updateCache.catch(function (error) {
            console.error(error);
          })
        });
      });
    }
  }
})(Modernizr);
