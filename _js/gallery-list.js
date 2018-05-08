/**
 * Gallery list: load more
 */
if ('content' in document.createElement('template')) {
  // All possible content is stored in this <template>
  var template = document.querySelector('#trip-list-lazyload');

  // If <template> is not supported, the browser will just show everything.
  // When everything is working, it can load more using the button.
  if (template !== null) {
    var content = template.content.querySelectorAll('.trip--teaser');
    var trip_list = document.querySelector('#trip-list');
    var trip_count = content.length - 1;
    var current_trip = 0;

    // Create a 'load more' link
    var loadmore = document.createElement('a');
    loadmore.classList.add('btn', 'btn--load');
    loadmore.textContent = 'Load More';
    document.querySelector('.go').appendChild(loadmore);

    // Click handler for 'load more' link
    loadmore.addEventListener('click', function loadMore() {
      // Every time we load more content, current_trip is incremented so that
      // the next click will yield a new piece of content. This button should
      // stop working and disable itself when the content runs out.
      if (current_trip <= trip_count) {

        // If there's still content, load it.
        var next_trip = document.importNode(content[current_trip++], true);

        // Add to DOM.
        trip_list.appendChild(next_trip);

        // Process gallery images
        var photos = next_trip.querySelectorAll('.photo');
        processGalleryPhotos(photos);

        // Log to analytics
        _paq.push(['trackEvent', 'TripListing', 'lazyload', 'more']);
      }

      // If there's no content, disable the button.
      else {
        loadmore.textContent = 'You reached the end!';
        loadmore.classList.add('btn--disabled');
        loadmore.removeEventListener('click', loadMore);

        // Log to analytics
        _paq.push(['trackEvent', 'TripListing', 'lazyload', 'all']);
      }
    });
  }
}
