//
// Entry enhancements
//
// All entries regardless of category: travel, blog.
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
})();

// //
// // Web Share API
// //
// // Origin Trial is good until 2016-12-06
// //
// if (navigator.share !== undefined) {
//   // Create share button.
//   var shareButton = document.createElement('a');
//   shareButton.id = 'share';
//   shareButton.innerText = 'Share';
//   shareButton.classList.add('btn', 'btn--share');
//   $('.go').appendChild(shareButton);

//   // Set up event listener.
//   shareButton.addEventListener('click', function() {
//     navigator.share({
//       title: $('meta[property="og:title"]').content,
//       // text: $('meta[property="og:description"]').content,
//       url: window.location.href,
//     })
//     .then(function () { console.info('Web Share API: success!') })
//     .catch(function (error) { console.error('Web Share API: ', error) });
//   });
// }


//
// Cache button. Depends on SW support.
//
(function (Modernizr) {
  if (Modernizr.serviceworker) {
    var currentURL = window.location.href;
    var currentPath = window.location.pathname;
    var $entry = $('.entry--main');
    var $entryActions = $('.go');

    // If there seems to be a connection, the entry has content, and the
    // location of the button can be targeted, create the cache button.
    if (navigator.onLine && $entry !== null && $entryActions !== null) {
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
      $entryActions.appendChild(cacheButton);

      // It would be really slick to calculate the amount of data that would be
      // stored when the save button is pushed. Maybe this number is possible to
      // generate without incurring extra downloading.
      //
      // @see http://stackoverflow.com/questions/1310378/determining-image-file-size-dimensions-via-javascript

      // 'Save Offline' functionality.
      cacheButton.on('click', function(event) {
        event.preventDefault();

        // Update UI to indicate pending action.
        blurAll();
        cacheButton.classList.add('btn--working');
        cacheButton.innerText = 'Fetching content...';
        cacheButton.disabled = true;

        // Open cache. If cache already exists it overwrites existing files.
        caches.open(OFFLINE_ARTICLE_PREFIX + currentPath).then(function(cache) {
          // Collect mandatory page resources. If any of these fail, the user will
          // see an error. Less vital resources (like images) will be stored in
          // the cache in a later step.
          var pageContent = [currentPath];
          var addContent = cache.addAll(pageContent);

          // Update UI to indicate outcome of basic page content.
          addContent.then(function() {
            cacheButton.classList.remove('btn--working');
            cacheButton.classList.add('btn--success');

            // Provide feedback to user and log event in analytics.
            if (cacheButton.dataset.state === 'update') {
              cacheButton.innerText = 'Article updated!';
              displayMessage('Offline article has been updated. Glad it\'s useful!');
            } else {
              cacheButton.innerText = 'Article saved!';
              displayMessage('Article is now available offline. Hope it comes in handy!');
            }

            // Log the event.
            console.info('Service Worker: saved offline entry for ' + currentPath);
          });

          // Catch any errors and report. This is only for main HTML content so
          // failure means we didn't meet user expectations at all.
          addContent.catch(function (error) {
            // Update UI to indicate failure. boo.
            cacheButton.classList.remove('btn--working');
            cacheButton.classList.add('btn--failed');
            cacheButton.innerText = 'Couldn\'t save article';
            displayMessage('The article could not be saved offline. Refresh and try again?');

            // Log the event.
            console.error(error.message);
          });

          // Now save images to cache. We won't treat failure so strictly this
          // time because the HTML/CSS will always load and the basic content
          // is available offline.
          var pageResources = [];

          // Loop through any content images and save to pageResources array.
          $$('main img').forEach(function (img) {
            pageResources.push(img.currentSrc);
          });

          // TODO: maps... somehow cache MapBox tiles?
          // TODO: photosphere assets (img/JS)

          var addResources = cache.addAll(pageResources);

          addResources.then(function () {
            appendMessage('The images were saved.')
            console.info('Service Worker: images saved to cache.')
          });

          addResources.catch(function (error) {
            appendMessage('The images could\'t be saved.');
            console.error(error.message);
          });
        });
      });
    }
  }
})(Modernizr);
