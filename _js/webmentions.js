/*
 * Webmentions
 *
 * All code related to querying or submitting Webmentions.
 */
(function iife() {
  // Listen for form submissions and validate before POSTing.
  var wmSubmitForm = $('.webmentions__submit');
  if (wmSubmitForm) {
    wmSubmitForm.addEventListener('submit', wmSubmit);
  }

  /**
   * Validate and POST Webmention submissions.
   */
  function wmSubmit(e) {
    var wmEndpoint = $('#webmentions form').getAttribute('action');
    var wmTarget = $('.webmentions__submit input[name="target"]');
    var wmSource = $('.webmentions__submit input[name="source"]');
    var wmSubmit = $('.webmentions__submit input[type="submit"]');
    var wmMsg = $('.webmentions__message');
    var wmStatus = '';

    console.log('wmEndpoint', wmEndpoint);

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
      fetch(wmEndpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: 'target='+ wmTarget.value +'&source='+ wmSource.value
      }).then(function(response) {
        wmStatus = response.status;
        return response.json();
      }).then(function(status) {
        if (wmStatus === 201) {
          wmMsg.innerHTML = 'Webmention.io <a href="'+ status.location +'">is processing your submission</a>.';
          wmMsg.classList.remove('is-error');
        }
        if (wmStatus === 400) {
          wmMsg.innerHTML = 'Webmention was rejected because: ' + status.summary;
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
      });
    }
  }
})();
