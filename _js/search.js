(function iife() {
  // Look for search box.
  const searchInput = $('input[name="search"]');
  const items = $$('.teaser--title');
  const searchSummary = $('#search-summary');

  /**
   * Read value of search bar and filter results accordingly.
   */
  function handleSearch() {
    // Set up our search term in lowercase
    let search = searchInput.value.toLowerCase();

    if (search) {
      // Convert NodeList to Array.
      const tripArray = [...items];

      // Filter arrays by processing the data-search attribute convert to lower,
      // and match each space-separated string.
      //
      // Ex: `compari gin` should match all entries that have "campari" and "gin",
      //     but it doesn't have to be exact — `campari not gin` will also match.
      const isMatching = tripArray.filter(trip => search.split(' ').every(term => trip.getAttribute('data-search').toLowerCase().indexOf(term.replace(/['’]/g,'')) !== -1));

      // Now diff the array and assume anything else failed to match.
      const matchSubset = new Set(isMatching);
      const notMatching = [...new Set(tripArray.filter(x => !matchSubset.has(x)))];

      // Remove/add classes as needed.
      isMatching.forEach(trip => trip.classList.remove('element-hidden'));
      notMatching.forEach(trip => trip.classList.add('element-hidden'));

      // Count results and display
      const numResults = isMatching.length;
      searchSummary.innerHTML = `Showing <strong>${numResults} trip${numResults === 1 ? '' : 's'}</strong>`;

      // Update URL
      history.pushState({s: search}, '', `/travel/list/?s=${search}`);
    } else {
      // Show all items
      items.forEach(trip => trip.classList.remove('trip--hidden'));
      searchSummary.innerHTML = '';

      // Update URL
      history.pushState({s: ''}, '', '/travel/list/');
    }
  }

  /**
   * If both search bar and a state exist, populate the search bar.
   */
  function populateSearch(ev) {
    if (searchInput) {
      searchInput.value = ev.state ? ev.state.s : '';
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
    const s = params.get('s');

    // Now populate the URL bar
    populateSearch({
      state: {
        s: s,
      },
    });

    // Manually run the event listener for the search bar since populating via
    // JS doesn't trigger `keyup` events.
    if (searchInput) {
      handleSearch();
    }
  });
})();
