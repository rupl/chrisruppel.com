(function () {
  // Only do this if markup is requesting auto-updates.
  //
  // TODO: instead of using data-autoupdate="true" populate the attribute with
  //       the path that should be requested, then the data-attribute can serve
  //       as both a flag and the argument for a generic function.
  var calendar = $('#calendar[data-autoupdate=true]');

  // Load the contact form when an open slot is clicked.
  $$('.available').on('click', function () {
    $('.btn--mail').click();
  });

  // For users with SW, fetch latest calendar if available.
  // If user does not have SW, then they won't see cached HTML in the first place.
  if (Modernizr.serviceworker && !!calendar) {
    // TODO: use value of data-autoupdate in this `fetch()`
    fetch('/work/calendar/').then(function (data) {
      return data.text();
    }).then(function (text) {
      calendar.innerHTML = text;
      console.info('Updated calendar successfully.');
    }).catch(function (error) {
      var warning = document.createElement('aside');
      warning.classList.add('warning');
      warning.innerHTML = '<p><em><strong>Note:</strong></em> This calendar might be slightly out of date.</p>';
      calendar.appendChild(warning);
      console.error(error);
    });
  }
})();
