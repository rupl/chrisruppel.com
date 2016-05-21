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
    var $goButton = $('.btn--back');

    if ($entry !== null && $goButton !== null) {
      // Create and insert 'Save Offline' button.
      var cacheButton = document.createElement('button');
      cacheButton.setAttribute('role', 'button');
      cacheButton.setAttribute('id', 'cache-button');
      cacheButton.classList.add('btn', 'btn--offline');

      // TODO: branch logic based on whether this page is already in the cache.
      //       The URL path is the key, so it's easy to look before processing
      //       the button.
      //
      //       Text/icon should change (Save => Update). When an entry is saved,
      //       or the cache is present, provide a Delete button.
      if (0) {
        cacheButton.innerText = 'Update saved article';
      } else {
        cacheButton.innerText = 'Save article offline';
      }

      // Insert button into DOM.
      $goButton.parentNode.insertBefore(cacheButton, $goButton.nextSibling);

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

        // Build an array of the page-specific resources right here.
        var pageResources = [currentPath];

        // Loop through any galleries and save images.
        var images = $$('.gallery img');
        Array.prototype.map.call(images, function (img) {
          pageResources.push(img.currentSrc);
        });

        // TODO: maps... somehow cache MapBox tiles?
        // TODO: photosphere assets (img/JS)

        // We're free to use Promises natively since SW spec has a dependency on
        // Promises support.
        caches.open('chrisruppel-offline--' + currentPath).then(function(cache) {
          cache.addAll(pageResources).then(function() {
            console.debug('Service Worker saved an entry offline: ' + currentPath);

            // Reset the UI
            blurAll();
            cacheButton.classList.remove('working');
            cacheButton.classList.add('saved');
            cacheButton.innerText = 'Article saved!';
            cacheButton.disabled = true;

            // Show notification confirming success
            displayMessage('Article is now available offline. Hope it comes in handy!');
          });
        });
      });
    }
  }
})(Modernizr);
