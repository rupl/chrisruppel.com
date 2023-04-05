---
title: Displaying a user's offline content list

summary: Learn how to display a list of user-saved articles when they return to your website while offline.

tags:
- offline
- javascript
- serviceworker
---

In a previous article, I detailed how I enabled my website visitors to [choose which of my articles to save offline](/blog/service-worker-offline-content/) so they can read them later without a connection. By and large that code is unchanged. I did tweak it by adding a Stale-While-Revalidate policy to the content, but overall it remains as the post describes.

If you're not familiar with Service Worker or the new Cache that accompanies it, I'd suggest reading this great [intro to Service Worker](https://www.smashingmagazine.com/2016/02/making-a-service-worker/).

## Offline content availability

After enabling users to selectively save content offline, I pumped my fist and considered it done. If people bookmark a saved article, their bookmark will always function, period.

But over time, I began to feel like it wasn't enough. I have a generic [Offline page](/offline/) that is primarily used by the Service Worker when an uncached URL is visited. I felt like adding the user's saved articles to this page is really helpful, showing them the right content in the moment of need.

<img width="317" height="558" src="{{ site.img-host }}/img/service-worker-offline-content-list-1.png" alt="Screenshot of an offline content list in Nexus 5X"/>

Luckily, there's not so much code needed to pull this off. The code below relies on the fact that all the user-saved caches have the same naming convention. All I have to do is loop through the caches and find any entries with the offline prefix:

```
chrisruppel-offline--/PATH/TO/ARTICLE
```

The other info in the cache entry name is the absolute path to the saved article. That means when I look these articles up, I can link directly to them with no further work.

```js
// Feature test for Service Worker
// (has an explicit dependency on Cache)
if (Modernizr.serviceworker) {

  // Get all Cache entries for this user.
  caches.keys().then(function(cacheNames) {

    // Define these DOM nodes just once
    // instead of in the loop.
    var offlineContentList = $('#offline');
    var offlineContentEntry = $('#offline-content');

    return Promise.all(

      // Loop through Cache entries.
      cacheNames.map(function(cacheName) {

        // Check if any have the offline article naming convention.
        if (cacheName.indexOf(OFFLINE_ARTICLE_PREFIX) !== -1) {

          // The cache name indicates that it was saved by the user.
          // Prepare a DOM element linking to the URL in the cache name.
          var cacheEntry = document.createElement('li');
          cacheEntry.innerHTML = '<a href="' + cacheName.split('--')[1] + '">' + cacheName.split('/')[2] + '</a>';

          // Append to DOM if the container is found.
          if (!!offlineContentEntry) {
            console.info('Service Worker: found user-cached content ' + cacheName);
            offlineContentEntry.appendChild(cacheEntry);
          }

          // Set the offline box to display since we found content to display.
          if (!!offlineContentList) {
            offlineContentList.classList.add('is-active');
          }
        }
      })
    );
  });
}
```

So in a nutshell, the on-page JS just looks in the cache for any entries using my predetermined naming convention, then loops through and creates links to each cache entry.

When a user saves an article, the code uses `caches.addAll` which will not fail unless all required assets are saved into the cache. That means these links are already verified as safe to display without having to peek inside them during the lookup phase.

## Improving usability

Now, I did cheat a bit. The links I created just use the URL slug of my article. Go look at the image and notice the URL-looking links. I'll wait.

Using such a simple system, the job falls on me to maintain descriptive enough URLs that a person could use to jog their memory. On a site with multiple editors, or user-generated content, my simple model might break down.

It can be remedied by keeping an [IndexedDB table](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase) that contains URLs and article titles. But for my personal site, I was happy to leave the URLs and keep the code very straightforward.

Really though, that's it! If you wanted to get really fancy, you could pull an image from your articles, or put the date it was saved (provided you stored it somewhere when saving!). But really I think a simple list is much, much better than nothing, so I'll save the incremental improvements for later.

Try it out by using the *Save Article Offline* button below, then temporarily disabling your network to see the Offline page. Let me know in the comments if you have any questions or ideas to improve the code!

<p><ins class="update" datetime="2017-11-13">I've implemented a second approach on my site which <a href="/blog/service-worker-offline-content-list-filter/">filters static HTML to show only cached content</a>. You can try it out on my <a href="/travel/">travel list</a>.</ins></p>

<p><ins class="update" datetime="2019-09-05">Remy Sharp built a similar, but much nicer formatted list on his <a href="https://remysharp.com/2019/09/05/offline-listings">offline page using the cached HTML itself</a>. Great idea!</ins></p>
