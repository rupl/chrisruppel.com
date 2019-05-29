/*
 * Webmentions
 *
 * All code related to querying or submitting Webmentions.
 */
(function iife() {
  // Load Webmentions for this URL on page load.
  webmentionsList();

  // Listen for form submissions and validate before POSTing.
  var wmSubmitForm = $('.webmentions__submit');
  if (wmSubmitForm) {
    wmSubmitForm.addEventListener('submit', wmSubmit);
  }

  /**
   * Validate and POST Webmention submissions.
   */
  function wmSubmit(e) {
    var wmTarget = $('.webmentions__submit input[name="target"]');
    var wmSource = $('.webmentions__submit input[name="source"]');
    var wmSubmit = $('.webmentions__submit input[type="submit"]');
    var wmMsg = $('.webmentions__message');
    var wmStatus = '';

    // Always prevent default when JS is enabled. We will manually POST to the
    // endpoint using JS and display any feedback to the visitor.
    e.preventDefault();

    // Check if URL is a valid format according to browser.
    if (wmSource.validity.valid) {
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
        body: 'target='+ wmTarget.value +'&source='+ wmSource.value
      }).then(function(response) {
        wmStatus = response.status;
        return response.text();
      }).then(function(reason) {
        if (wmStatus === 202) {
          wmMsg.innerHTML = 'Webmention was accepted for processing and should appear shortly.';
          wmMsg.classList.remove('is-error');
        }
        if (wmStatus === 400) {
          wmMsg.innerHTML = 'Webmention was rejected because: ' + reason;
          wmMsg.classList.add('is-error');
        }
        if (wmStatus === 404 || wmStatus === 500) {
          wmMsg.innerHTML = 'There was an internal server error. Our fault, not yours!';
          wmMsg.classList.add('is-error');
        }

        // Show feedback
        wmMsg.classList.add('is-active');

        // Re-enable form submissions
        wmSubmit.disabled = false;

        // Wait a moment and reload Webmentions in case the new one already
        // finished processing
        setTimeout(webmentionsList, 1000);

        // Log result to analytics
        _paq.push(['trackEvent', 'Webmentions', 'submit', window.location.pathname, wmStatus]);
      });
    }
  }

  /**
   * Load Webmentions.
   *
   * This function can be fired whenever we want to refresh the list.
   */
  function webmentionsList() {
    var wmlContainer = $('.webmentions__list');
    var wmlTargetSelector = $('[data-webmention-target]');

    // If there's no selector then stop.
    if (!wmlTargetSelector) {
      return;
    }

    var wmlTarget = wmlTargetSelector.dataset.webmentionTarget;
    var wmlQuery = WEBMENTIONS_GET + '?target=' + wmlTarget + '&timestamp=' + Date.now();

    // Clear out the no-js message.
    wmlContainer.innerHTML = '<p class="webmentions__loading">Loading existing Webmentions...</p>';

    // Fetch existing Webmentions for this entry.
    var wm_fetch = fetch(wmlQuery).then(function(response) {
      return response.json();
    });

    // Catch any errors fetching data from the endpoint
    wm_fetch.catch(function () {
      console.error('😢 Query to the Webmention endpoint failed.');
    });

    // Handle results of Webmention query.
    wm_fetch.then(function(data) {
      // Clear out the existing content.
      wmlContainer.innerHTML = '';

      if (data.length === 0) {
        var wmlEmpty = document.createElement('div');
        wmlEmpty.classList.add('webmentions__empty');
        wmlEmpty.innerHTML = '<p>There aren\'t any Webmentions for this entry yet. Be the first!</p>';
        wmlContainer.appendChild(wmlEmpty);
      }
      else {
        // Populate list with each Webmention.
        data.forEach(function (row) {
          var thisContent = '';
          var thisWebmention = document.createElement('article');
          thisWebmention.classList.add('p-comment');
          thisWebmention.classList.add('h-entry');
          thisWebmention.id = 'comment-' + row.id;
          thisContent += (row.title) ? '<h3><a href="'+ row.source +'">'+ htmlDecode(row.title) +'</a></h3>' : '';
          thisContent += (row.summary) ? '<div class="e-content"><p>' + htmlDecode(row.summary) + '</p></div>' : '';
          thisContent += '<footer>';
          thisContent += 'Mentioned by <cite class="h-card p-author"><a class="u-url p-name" href="' + (row.author_url || row.source) + '">' + htmlDecode(row.author_name) + '</a></cite> on <time class="dt-published" datetime="' + row.published + '">' + row.published.split('T')[0] + '</time>';
          thisContent += '<a href="#comment-'+ row.id +'" rel="bookmark" title="Permalink to this comment">#</a>';
          thisContent += '</footer>';
          thisWebmention.innerHTML = thisContent;
          wmlContainer.appendChild(thisWebmention);
        });
      }
    }).catch(function () {
      console.error('😢 Assembling Webmention markup failed.');
      wmlContainer.innerHTML = '<p class="warning">Webmentions couldn\'t be fetched.</p>';
    });
  }

  // @see https://stackoverflow.com/a/34064434
  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
})();
