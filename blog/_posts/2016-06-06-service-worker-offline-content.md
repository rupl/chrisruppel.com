---
title: Offline Content with Service Worker
category: blog
layout: blog

tags:
- offline
- javascript
- service worker

summary: Learn how to add content to the Service Worker cache at the request of the visitor, then serve it offline.
---

I am proud to be offering a new feature on this site: offline content. At the moment, the majority of my content is in my [travel blog](/travel/). Although it's mostly pretty pictures, I wrote up a few of our more involved transport adventures and they quickly rose to the top of my analytics.

People are reading this travel info, but I know from experience that they probably **don't have access to it in the moment of need** when they're on the road, at a bus station, or in the mountains at a tiny immigration office.

With offline content they can! By making it opt-in, my site allows visitors to save content they care about while maintaining a small cache footprint.


### Service Worker basics

I already have HTTPS and a basic Service Worker on the site. If you need help with that process, [this article gets you started with a basic Service Worker](https://remysharp.com/2016/03/22/the-copy--paste-guide-to-your-first-service-worker). I wrote mine myself, but it works the same, allowing the common "shell" assets to be cached which dramatically speeds up return visits. I have a few basic pages cached. But all of my real content just showed a generic "you're offline" message.

Helpful tutorials on [caching strategy for HTML content](https://www.smashingmagazine.com/2016/02/making-a-service-worker/#html-content-implementing-a-network-first-strategy) have been written, but there's normally an assumption that they need to cache every page that is viewed. How much storage you're allowed is up to a browser, so my goal is to keep the cache as minimal as possible. I'd rather keep it small and avoid getting axed when the browser (or user) needs to free up memory on the device.

### Cache on user-interaction

Enter an innocent-looking entry in Jake Archibald's Offline Cookbook: [cache on user interaction](https://jakearchibald.com/2014/offline-cookbook/#on-user-interaction). Jake points out that although the Service Worker is separate from your page, its cache is accessible from within your page's JavaScript.

That means you can write a normal event listener in your application code and have it interact with the cache: reading, writing, it's up to you.

For the sake of clarity I've reduced the example to the fundamentals, skipping many necessary steps like populating the button text, inserting into DOM, etc.

```js
// Requires: SW support + internet connection (maybe?)
if ('serviceWorker' in navigator && navigator.onLine) {
  var currentPath = window.location.pathname;
  var cacheButton = document.createElement('button');

  // Event listener
  cacheButton.on('click', function(event) {
    // Build an array of the page-specific resources.
    var pageResources = [currentPath];

    // Open the unique cache for this URL.
    caches.open('offline-' + currentPath).then(function(cache) {
      var updateCache = cache.addAll(pageResources);

      // Update UI to indicate success.
      updateCache.then(function() {
        displayMessage('Article is now available offline.');
      });

      // Catch any errors and report.
      updateCache.catch(function (error) {
        displayMessage('Article could not be saved offline.');
      });
    });
  });
}
```

Note the feature test wrapping both the creation of the button and its event listener. If the user can't view content offline, it would be pretty annoying to tease them with a button, wouldn't it?

It's also worth noting that [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine) is only trustworthy when equal to `false`. Since we're crafting an offline experience, it's still worth including as a condition. If a visitor returns to an article while offline, the button offering to update the content should NOT appear.

### Collecting assets from the DOM

Jake's short example uses an endpoint to collect the necessary URLs and build the array for the cache, but I opted to collect everything straight from the DOM. The main reason was because of responsive images. The cache contents will by definition be used on the same device, so instead of caching all possibilities within the `srcset` of each image, I just grabbed the `currentSrc` of each one. I'm using Picturefill so that property exists whether the browser natively supports `<picture>` or not.

Building on the previous example, our `pageResources` will now contain the URL of each image that was visible when the button was pressed:

```js
// Build an array of the page-specific resources.
var pageResources = [currentPath];

// Loop through any gallery images
// and save to pageResources array.
var images = $('.gallery img').forEach(function (img) {
  pageResources.push(img.currentSrc);
});
```

<aside class="note">I'm using <a href="https://gist.github.com/paulirish/12fb951a8b893a454b32">bling.js</a> to iterate on a NodeList created by <code>querySelectorAll</code>. How you loop through your images is up to you.</aside>

Although not bulletproof, this compromise is reliable enough for my purposes. I get to cache the smallest amount of image data possible, and it's likely that the same image would be chosen on a revisit.

Maybe in the future I could add another `.catch()` to the Fetch listener for images which would serve up a generic SVG when there's a cache miss (perhaps the user rotated the device).


### Save or update the cache

Now, there's nothing wrong with just opening the cache every time and updating it. Code-wise, that is what happens. But in the interest of usability I wanted to acknowledge when the article was previously saved, and change the wording of my button and notification. It's pretty simple for an offline article: just look for the current URL using `caches.match()`.

```js
// During button setup look for the current URL within
// all caches. This URL's cache entry will be an HTML
// reponse containing the content we want to show.
var pageCache = caches.match(window.location.href);
pageCache.then(function updateButtonText(response) {
  // Check to see if the URL was found before updating
  // the UI within .then()
  if (typeof response !== 'undefined') {
    cacheButton.innerText = 'Update saved article';
    cacheButton.dataset.state = 'update';
  }
});
```

My initial logic only checked the existence of a cache key. It led my code to report false positives when the caching process had failed. Beware! It's possible for a cache key to be present without the assets being inside.

If you want to provide UI cues based on the existence of cached content, make sure you're checking for the exact URL(s) you need, and not just the cache key that holds them.

In the event listener, add a conditional that looks for the new data-attribute:

```js
// ...later on in the button's event listener we look
// for this data-attribute and adjust user feedback.
if (cacheButton.dataset.state === 'update') {
  cacheButton.innerText = 'Article updated!';
  displayMessage('Offline article has been updated.');
} else {
  cacheButton.innerText = 'Article saved!';
  displayMessage('Article is now available offline.');
}
```

Depending on the logic of your web page, it might make sense to fire off completely different save/update functions. But for simple caching of static content, the cache works the same whether its the first time or a repeat.

### Notify the visitor on success

Finally after the cache is updated, I fire off a notification and change the text of the button to indicate success. The button also becomes disabled to avoid hitting it twice on the same page load.

My notification is based on Heydon Pickering's [Practical ARIA example for alerts](http://heydonworks.com/practical_aria_examples/#offline-alert). This part isn't Service Worker specific, but I figured if I'm implementing alerts, I should do it in an accessible manner.

### Caching on first page load

The deal-breaker for this feature: _Does the cache work on the initial page load?_ If someone can't save it the first moment they find it, I have failed at my quest to provide reliable offline content.

In my testing, **I am indeed able to save the article on first load.** Just like the "app shell" assets of many popular Service Worker examples, you can prime the cache on the initial page load. Filling the cache in response to user action is no different than the Service Worker `install` event, which often fills the cache on the first page load.


### Version management

As with many Service Worker `activate` event listeners, there is a cleanup phase involved to remove old caches. Most examples use a cache name in their config, and use the `activate` event to delete any cache whose name doesn't match.

Since each visitor to my site could store a unique set of articles, I decided that each article should be saved into its own cache. All content caches have a common prefix, allowing the Service Worker to be updated without blowing away any caches that the user opted into.

```js
var OFFLINE_PREFIX = 'offline-';
var SW = {
  cache_version: 'main_v1.5.0',
}

self.addEventListener('activate', function(event) {
  var mainCache = [SW.cache_version];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Two conditions must be met to delete a cache:
          //
          // 1. It must NOT be found in the main SW cache list.
          // 2. It must NOT contain our offline prefix.
          if (
            mainCache.indexOf(cacheName) === -1 &&
            cacheName.indexOf(OFFLINE_PREFIX) === -1
          ) {
            // When it doesn't match any condition, delete it.
            console.info('SW: deleting ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

This isn't a perfect solution. When offline content is saved, the entire HTML document is stored instead of just the raw content. That means if the HTML and CSS were dramatically altered, the cached copy of the HTML might use the new CSS to style the page, causing problems until its cache is updated, which must be initiated by the user.

There are multiple ways to fix this. We could implement a _Stale While Revalidate_ strategy for offline content, showing the cached copy while attempting to update it in the background when a connection exists. While it doesn't fix the root problem, the site is allowed to update itself and stay reasonably current.

Or, we could prompt the user when newer content is available, perhaps by storing a timestamp in the document and comparing to the uncached page.

Another approach would be to store raw content (perhaps JSON), which is piped into the elusive _app shell_. That would avoid pairing stale HTML with fresh CSS/JS, guaranteeing that the page always works as intended. Depending on which framework your site uses this approach might even be the easiest option, but for my static website it involves more work. <small>(I also care deeply about serving HTML content, but let's not get into that now...)</small>


### Security issues

Shortly after deploying and proudly tweeting my success, I noticed that all my site's images had disappeared. It turned out to be a <abbr title="Cross Origin Resource Sharing">CORS</abbr> issue. Allowing articles to serve images offline meant that my new Service Worker was intercepting image requests which had previously been ignored by the Fetch listener. I was seeing errors like the following:

```wrap
Fetch API cannot load example.jpg. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'https://chrisruppel.com' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

It didn't matter beforehand because my image requests were being ignored by the fetch listener. But since the new Service Worker is listening for images, the request is now subject to CORS. And I hadn't specified the correct `Access-Control-Allow-Origin` header on my S3 bucket. Whoops.

To fix, I initially set it up to whitelist my domain, but it seemed to cause intermittent issues. Opening my bucket up to any origin made the caching process more reliable. Stepping through the data I collected during this process is its own post so maybe I will revisit the topic sometime.

If you have a resource which is not under your control, the Fetch API allows you to set `mode: 'no-cors'` and [receive the opaque response](https://jakearchibald.com/2015/thats-so-fetch/#no-cors-and-opaque-responses).


### 💾 Save this article for later

So... that's where I am with offline content. If your browser supports it, try the button below! As with many folks on the web, I am very excited to see what other super powers the Service Worker will bring to the web. If you have ideas for improvement or questions about how it works, please drop me a comment!
