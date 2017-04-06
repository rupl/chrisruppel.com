(function () {
  // Load the contact form when an open slot is clicked.
  $$('.available').on('click', function () {
    $('.btn--mail').click();
  });

  // For users with SW, fetch latest calendar if available.
  // If user does not have SW, then they won't see cached HTML in the first place.
  if (Modernizr.serviceworker) {
    fetch('/work/calendar/').then(function (data) {
      return data.text();
    }).then(function (text) {
      var calendar = $('#calendar');
      calendar.innerHTML = text;
      console.info('Updated calendar successfully.');
    }).catch(function (error) {
      console.error(error);
      var warning = document.createElement('p');
      warning.classList.add('warning');
      warning.innerHTML = '<em><strong>Note:</strong></em> The latest calendar could not be fetched.';
      $('#calendar').appendChild(warning);
    });
  }
})();
