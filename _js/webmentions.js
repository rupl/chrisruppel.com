/*
 * Webmentions
 *
 * Queries our endpoint for webmentions when the appropriate markup is found on
 * the page.
 */
(function iife() {
  var wm_container = $('.webmentions');
  var wm_target = $('.webmentions[data-webmention-target]').dataset.webmentionTarget;
  var wm_query = WEBMENTIONS_GET + '?target=' + wm_target;

  // Clear out the no-js message.
  wm_container.innerHTML = '<p class="webmentions__loading">Loading existing Webmentions...</p>';

  // Fetch existing Webmentions for this entry.
  var wm_fetch = fetch(wm_query).then(function(response) {
    return response.json();
  });

  // Catch any errors fetching data from the endpoint
  wm_fetch.catch(function () {
    console.error('😢 Query to the Webmention endpoint failed.');
  });

  // Handle results of Webmention query.
  wm_fetch.then(function(data) {
    // Clear out the loading message.
    wm_container.innerHTML = '';

    // Populate with each webmention.
    data.forEach(function (row) {
      var thisWebmention = document.createElement('article');
      thisWebmention.classList.add('p-comment');
      thisWebmention.classList.add('h-entry');
      thisWebmention.id = 'comment-' + row.id;
      thisWebmention.innerHTML = '<div class="e-content">' + row.content + '</div><footer>Mentioned by <cite class="h-card p-author"><a class="u-url p-name" href="' + row.source + '">' + row.who + '</a></cite> at <time class="dt-published" datetime="' + row.at + '">' + row.at.split('T')[0] + '</time> <a href="#comment-'+ row.id +'" rel="bookmark" title="Permalink to this comment">#</a></footer>';
      wm_container.appendChild(thisWebmention);
    });
  }).catch(function () {
    console.error('😢 Assembling Webmention markup failed.');
    wm_container.innerHTML = '<p class="warning">Webmentions couldn\'t be fetched. Sorry!</p>';
  });
})();
