/**
 * Gallery list: load more
 */
if ('content' in document.createElement('template')) {
  // All possible content is stored in this <template>
  var template = document.querySelector('#gallery-list');

  // If <template> is not supported, the browser will just show the date.
  // When everything is working, it can load more using the contents.
  if (template !== null) {
    var content = template.content.querySelectorAll('.teaser');
    var trip_list = document.querySelector('#trip-list');

    // Turn trips into real array.
    var trips = [];
    for (var i = content.length >>> 0; i--;) {
      trips[i] = content[i];
    }

    // Create a 'load more' link
    var loadmore = document.createElement('a');
    loadmore.classList.add('btn', 'btn--load');
    loadmore.textContent = 'Load More';
    document.querySelector('.go').appendChild(loadmore);

    // Click handler for 'load more' link
    loadmore.addEventListener('click', function loadMore () {
      var next_trip = trips.shift();
      // If there's content, load it.
      if (next_trip) {
        trip_list.appendChild(next_trip);
      }
      // If not, disable the button.
      else {
        loadmore.textContent = 'You reached the end!';
        loadmore.classList.add('disabled');
        loadmore.removeEventListener('click', loadMore);
      }
    });
  }
}
