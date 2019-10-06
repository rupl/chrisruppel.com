---
title: Offline Content list using microformats

summary: Build rich, informative offline content lists using the structured data in your microformatted HTML.

tags:
- offline
- javascript
- service worker
---

In a previous article, I detailed how my website visitors can [see an offline content list](/blog/service-worker-offline-content-list/) so they can find saved content quickly when they hit my offline page.

I recently saw Remy Sharp's [going offline with microformats](https://remysharp.com/2019/09/05/offline-listings) and had the same visceral reaction as [Jeremy](https://adactio.com/journal/15844).. it's "forehead-slappingly brilliant" and **exactly what microformats were intended for**.

I feel silly for not thinking of it before.

By using the HTML itself to populate an offline list, we skip any need for indexDB, localstorage, or my silly URL hack that I'd outlined in my article linked above. Just select what you need directly out of the HTML!

I've already implemented this on my offline page using title, URL, summary, and time published. But with enough microformatted data you could leverage tags, or selectively pull out rich content like images. The possibilities are endless!

I'm already loving how this looks on my [offline page](/offline). Save this article before visiting if you want to see it in action. 👇
