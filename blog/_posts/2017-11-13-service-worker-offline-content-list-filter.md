---
title: Enhancing HTML with Service Worker Cache

summary: Using the Service Worker offline cache to progressively enhance static content.

tags:
- offline
- javascript
- serviceworker
---

In a previous article, I detailed how my website visitors can [see an offline content list](/blog/service-worker-offline-content-list/) so they can find saved content quickly when they hit my offline page. This post demonstrates an alternative approach to building the list manually, instead using a static list of content and hiding any uncached content.

If you're not familiar with Service Worker or the new Cache that accompanies it, I'd suggest reading this great [intro to Service Worker](https://www.smashingmagazine.com/2016/02/making-a-service-worker/).

## Filter static content with Cache

In my first post about creating an [offline content list](/blog/service-worker-offline-content-list/), the list itself was generated from the cache. But I also have a static list of travel entries which is updated each time the Service Worker either installs, or the visitor returns to the page.

Since it's always available even without the network, I thought it would be nice to filter the links so it contains only the entries which the visitor has manually saved. It's a much shorter then, and way more useful!

All I had to do was add a short snippet to my `offline.js` which does all client-side processing in the event no network connection is detected. Here is a _partial code snippet_ which demonstrates the technique. Many variables are referenced here, but were defined elsewhere in the file.

```js
cacheNames.map(function(cacheName) {
  // Check if any have the offline article naming convention.
  if (cacheName.indexOf(OFFLINE_ARTICLE_PREFIX) !== -1) {
    // Extract the URL from cache name. I decided to store each
    // saved article with the path in the cache name to make
    // processing like this much simpler.
    var cachedURL = cacheName.split('--')[1];

    // Set the Travel list to offline mode when Offline, but tag the
    // cached entries so they stay visible.
    if (!navigator.onLine && !!travelContentEntries) {
      travelList.classList.add('is-offline');
      var cachedEntry = $('.teaser--title[data-url="' + cachedURL + '"');
      if (!!cachedEntry) {
        cachedEntry.classList.add('is-cached');
      }
    }
  }
})

```

<small><a href="https://github.com/rupl/chrisruppel.com/blob/bf58b63ca893e5f66520df37ae27a995bad3f676/_js/offline.js">Full source available on GitHub</a></small>

So in a nutshell, the on-page JS just sets every entry to be disabled, then looks in the cache for user-saved entries using my predetermined naming convention. Armed with an array of cache names and corresponding URLs, it loops a second time and re-enables links that appear in the cache. I made this easy by adding a data-attribute containing the URL, which can be directly compared to the cache name which also contains the URL of the article.

Once a person has saved a couple articles, they will see this when visiting my site offline. I also included a message explaining that the list is truncated, with a link to display every entry:

<img width="317" height="558" src="{{ site.img-host }}/img/service-worker-offline-content-list-filter-1.png" alt="Screenshot of an offline content list in Nexus 5X"/>

For now, mine only alters the list when offline. However, the cache can be read any time and other enhancements could be useful even when a connection is available, for example to show an icon next to entries that will be available offline. 

Try it out by using the *Save Article Offline* button below, then visiting the [Offline page](/offline). Let me know in the comments if you have any questions or ideas to improve the code.
