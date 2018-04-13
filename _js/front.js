(function () {
  // Only do this if markup is requesting auto-updates.
  //
  // TODO: instead of using data-autoupdate="true" populate the attribute with
  //       the path that should be requested, then the data-attribute can serve
  //       as both a flag and the argument for a generic function.
  var blogList = $('#blog-list[data-autoupdate=true]');

  // For users with SW, fetch latest blog posts if available.
  // If user does not have SW, then they won't see cached HTML in the first place.
  if (Modernizr.serviceworker && !!blogList) {
    // TODO: use value of data-autoupdate in this `fetch()`
    fetch('/blog/latest/').then(function (data) {
      return data.text();
    }).then(function (text) {
      blogList.innerHTML = text;
      console.info('Updated latest blog posts successfully.');
    }).catch(function (error) {
      var warning = document.createElement('aside');
      warning.classList.add('warning');
      warning.innerHTML = '<p><em><strong>Note:</strong></em> This list might be slightly out of date.</p>';
      blogList.appendChild(warning);
      console.error(error);
    });
  }
})();
