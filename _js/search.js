(function iife() {
  // Look for search box.
  const searchInput = $('input[name="search"]');
  // Collect the posts
  const items = [...$$('.search-item')];
  // User feedback.
  const searchSummary = $('#search-summary');

  /**
   * Read value of search bar and filter results accordingly.
   */
  function handleSearch() {
    // Set up our search term in lowercase
    let search = searchInput.value.toLowerCase();

    if (search) {
      // Filter arrays by processing the data-search attribute convert to lower,
      // and match each space-separated string.
      //
      // Ex: `compari gin` should match all entries that have "campari" and "gin",
      //     but it doesn't have to be exact — `campari not gin` will also match.
      const isMatching = items.filter(trip => search.split(' ').every(term => trip.getAttribute('data-search').toLowerCase().indexOf(term.replace(/['’]/g,'')) !== -1));

      // Now diff the array and assume anything else failed to match.
      const matchSubset = new Set(isMatching);
      const notMatching = [...new Set(items.filter(x => !matchSubset.has(x)))];

      // Remove/add classes as needed.
      isMatching.forEach(trip => trip.classList.remove('element-hidden'));
      notMatching.forEach(trip => trip.classList.add('element-hidden'));

      // Count results.
      const numResults = isMatching.length;

      // Display number of results.
      searchSummary.innerHTML = `Showing <strong>${numResults} result${numResults === 1 ? '' : 's'}</strong>`;

      // Update URL
      history.pushState({filter: search}, '', `${window.location.pathname}?filter=${search}`);
    } else {
      // Show all items
      items.forEach(trip => trip.classList.remove('element-hidden'));
      searchSummary.innerHTML = 'Showing all results.';

      // Update URL
      history.pushState({filter: ''}, '', `${window.location.pathname}`);
    }
  }

  /**
   * If both search bar and a state exist, populate the search bar.
   */
  function populateSearch(ev) {
    if (searchInput && ev.state) {
      searchInput.value = ev.state.filter;
    }
  }

  // If search box is found, setup the listeners.
  searchInput && searchInput.addEventListener('input', debounce(handleSearch, 150));

  // When the back button is used, update search bar
  window.addEventListener('popstate', (ev) => {
    populateSearch(ev);
    handleSearch();
  });

  // When page is loaded, check for a query and react to it.
  window.addEventListener('load', (ev) => {
    // First read the URL bar to see if search terms are present. This allows
    // for filtered lists to be shared via URL.
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');

    // Now populate the URL bar
    populateSearch({
      state: {
        filter: filter,
      },
    });

    // Manually run the event listener for the search bar since populating via
    // JS doesn't trigger `keyup` events.
    let initialSearch = searchInput.value.toLowerCase();
    if (searchInput && initialSearch) {
      handleSearch();
    }
  });
})();
