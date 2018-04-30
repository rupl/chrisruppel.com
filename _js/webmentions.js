/*
 * Webmentions
 *
 * Queries our endpoint for webmentions when the appropriate markup is found on
 * the page.
 */
(function iife() {
  var wmContainer = $('.webmentions__list');
  var wmTarget = $('.webmentions__list[data-webmention-target]').dataset.webmentionTarget;
  var wmQuery = WEBMENTIONS_GET + '?target=' + wmTarget;

  // Clear out the no-js message.
  wmContainer.innerHTML = '<p class="webmentions__loading">Loading existing Webmentions...</p>';

  // Fetch existing Webmentions for this entry.
  var wm_fetch = fetch(wmQuery).then(function(response) {
    return response.json();
  });

  // Catch any errors fetching data from the endpoint
  wm_fetch.catch(function () {
    console.error('😢 Query to the Webmention endpoint failed.');
  });

  // Handle results of Webmention query.
  wm_fetch.then(function(data) {
    // Clear out the loading message.
    wmContainer.innerHTML = '';

    // Populate list with each Webmention.
    data.forEach(function (row) {
      var thisWebmention = document.createElement('article');
      thisWebmention.classList.add('p-comment');
      thisWebmention.classList.add('h-entry');
      thisWebmention.id = 'comment-' + row.id;
      thisWebmention.innerHTML = '<div class="e-content"><p>' + row.content + '</p></div><footer>Mentioned by <cite class="h-card p-author"><a class="u-url p-name" href="' + row.source + '">' + row.who + '</a></cite> at <time class="dt-published" datetime="' + row.at + '">' + row.at.split('T')[0] + '</time> <a href="#comment-'+ row.id +'" rel="bookmark" title="Permalink to this comment">#</a></footer>';
      wmContainer.appendChild(thisWebmention);
    });
  }).catch(function () {
    console.error('😢 Assembling Webmention markup failed.');
    wmContainer.innerHTML = '<p class="warning">Webmentions couldn\'t be fetched. Sorry!</p>';
  });

  // Listen for form input on Webmention submission
  var wmForm = $('.webmentions__submit');
  var wmInput = $('.webmentions__submit input[name="source"]');
  var wmSubmit = $('.webmentions__submit input[type="submit"]');
  var wmMsg = $('.webmentions__message');
  var wmReason = '';

  // Listen for submissions and validate before POSTing.
  wmForm.addEventListener('submit', wmValidate, false);

  /**
   * Validate and POST Webmention submissions.
   */
  function wmValidate(e) {
    // Always prevent default. We will manually POST to the endpoint using JS
    // and let the visitor stay on the page.
    e.preventDefault();

    // Check if URL is a valid format according to browser.
    if (wmInput.validity.valid) {
      wmMsg.innerHTML = '&nbsp;';
      wmMsg.classList.remove('is-active');
      wmMsg.classList.remove('is-error');

      // POST to our endpoint.
      wmSubmit.disabled = true;
      fetch(WEBMENTIONS_POST, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: 'target='+ wmTarget +'&source='+ wmInput.value
      }).then(function(response) {
        return {
          status: response.status,
          info: response.text().then(function(text) {wmReason = text;})
        };
      }).then(function(data) {
        if (data.status === 202) {
          wmMsg.innerHTML = 'Webmention was accepted for processing and should appear shortly.';
          wmMsg.classList.remove('is-error');
        }
        if (data.status === 400) {
          wmMsg.innerHTML = 'Webmention was rejected because: ' + wmReason;
          wmMsg.classList.add('is-error');
        }
        if (data.status === 500) {
          wmMsg.innerHTML = 'There was a server error. Seems like it was our fault.';
          wmMsg.classList.add('is-error');
        }

        // Show feedback
        wmMsg.classList.add('is-active');

        // Finally, re-enable form submissions
        wmSubmit.disabled = false;
      });
    }
  }
})();
