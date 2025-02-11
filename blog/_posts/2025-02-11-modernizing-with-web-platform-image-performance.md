---
title: 'Modernizing with the Web Platform: Image performance'
summary: Demonstrating how the modern Web Platform can drastically simplify and enrich an old codebase.

video:
  width: 600px
  src: intersection-observer-in-action.mp4
  caption: A screencast showing how all three popup images get lazy-loaded; two show up quite quickly, but one only loads after scrolling down the page and revealing the link which will trigger its popup.

syndication:
  - type: Mastodon
    href: https://mastodon.social/@rupl/113985477566108627

work-cta: true

tags:
- css
- javascript
- performance
- web platform
---

This is part one of a series about the power of the modern Web Platform. I wrote each article based on the learnings from a project built in 2018, then refreshed in 2024.

- **Part 1: Image performance (this article)**
- Part 2: Reduced motion in CSS and images
- Part 3: Web Share API
- Part 4: HTML5 Dialog for popups and status messages
- Part 5: Paywall-aware Service Worker and Cache storage


## History of DevilsGame

In 2018 I was hired to build a web prototype for what the client hoped to turn into iOS/Android apps down the road. It is billed as [DevilsGame, an immersive cyber novel](https://devilsgame.com) — different than an ebook, but ultimately long-form reading that takes advantage of its home on the web, with links to both real and fictional websites that bring the story to life.

I produced a PWA with paywalled content so people can begin reading for free, but have to purchase the entire story. The client was quite happy with it, but wanted to focus on native apps after it was feature-complete. A separate firm was hired to manage that effort, which proved to be expensive and slow-going compared to the agility of a website.

After several years they came back to me asking if we could invest even more in the PWA. The web platform had added some very nice capabilities in the mean time. So I gave the old codebase a solid audit and came back with a plan to improve performance, accessibility, and overall UX.

This article will focus on image performance.

## Improving image performance with `&lt;picture>`

During the initial build, I was given all the assets in PNG and had to do my best to rapidly build out the story, so I didn't pay much attention to image performance. During the rebuild it was obvious that images were a huge bottleneck to overall performance.

Many of the images would undoubtedly been better served as JPEG, but the branding of the story dictated that most content images did not appear as rectangles; instead they had random jagged edges. However, the vast improvements in browser-supported image formats meant this was an easy lift in 2024: I was able to export WebP images and in a few cases AVIF made the most sense. Both support alpha channels in addition to far superior compression, producing identical images using far fewer bytes.

This was essentially a find/replace within the codebase, wrapping the existing image tags with picture tags, and adding a source whose filename was derived from the original.

```html
&lt;!-- before -->
&lt;img src="/img/1/1-1_ClairePhone.png" alt="Claire looking at her BlackBerry">

&lt;!-- after -->
&lt;picture>
  &lt;source srcset="/img/1/1-1_ClairePhone.webp" type="image/webp">
  &lt;img src="/img/1/1-1_ClairePhone.png" alt="Claire looking at her BlackBerry">
&lt;/picture>
```

## Preloading lazy images

Ok, so the image payload has been reduced simply by offering smaller image formats to browsers who support them. Yay! However, they all load pretty eagerly, and what's more: most of them are behind the popups. So it might be the case that you load the image and then never view it!

That's a use-case for the [`loading="lazy"`](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes) attribute if I ever heard of one. It gets added directly to the `&lt;img>` tag like so:

```html
&lt;picture>
  &lt;source srcset="/img/1/1-1_ClairePhone.webp" type="image/webp">
  &lt;img loading="lazy" src="/img/1/1-1_ClairePhone.png" alt="Claire looking at her BlackBerry">
&lt;/picture>
```

However, I couldn't be totally satisfied yet. Lazy-loading images meant that the popup no longer showed content immediately when appearing, only starting to download once the modal was visible. I needed a way to pre-load images just before they're needed, so that the popup loads and renders once without any layout shift.

Enter the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API): a performant method to monitor whether specific parts of a webpage are visible within the viewport. Since the popups are driven by links peppered throughout the story, it makes sense to preload images once the particular link which triggers the popup becomes visible:

```js
/**
 * Define Intersection Observer
 */
function observePopupImages () {
  // All popup links have an href that begins with '#note'
  const popupLinks = document.querySelectorAll('a[href^="#note"]');

  // IntersectionObserver configuration. In plain english: each popup link has
  // to fully enter the viewport before it is considered visible.
  const options = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 1.0,
  };

  // Create the Intersection Observer with callback and options.
  // The callback is explained in the next code block.
  const observer = new IntersectionObserver(preloadPopupImages, options);

  // Assign the Intersection Observer to all popup links in the content area.
  popupLinks.forEach((el) => {
    observer.observe(el, options);
  });
}
```

The next block of code is the callback function which handles the preloading, by changing the `loading` value of each image element from `lazy` to `eager` once the popup link is visible within the viewport.

Note that the `isIntersecting` property is supplied by the IntersectionObserver API. All the tough computation is done by the browser!

```js
/**
 * Callback for Intersection Observer
 * 
 *  @array entries
 *    Holds an array of intersections that happened since last run.
 *  @object observer
 *    Holds the config for the Intersection Observer that you defined
 *    when creating it.
 */
function preloadPopupImages (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Find modal ID that the popup is pointing to.
      const modalId = entry.target.href.split('#')[1];

      // Find the images in that modal and set `loading="eager"`
      const imgs = document.querySelectorAll(`#${modalId} img`);
      imgs.forEach(el => {
        el.setAttribute('loading', 'eager');
      });
    }
  });
}
```

This is a pretty bare-bones callback since there's no downside if the callback runs more than once. If you needed to prevent re-runs it might get thornier, but this worked for my use-case.

Here's a video of the images loading only as needed. If you go frame by frame you see that even the first two images of Claire and Nathan load very quickly, but are indeed lazy. It's because those two popup links are not visible until the content slides into place. Later as the page scrolls, a third image `1-1_BBSE.webp` gets loaded as the "Passport" link finally enters the viewport from the bottom.

{% include 'video.html' %}

This behavior ensures that we only load images which might actually be seen, while avoiding the delay that would occur if we waited to preload individual images until the popup was actually displayed.

## Conclusion

Hopefully this can spark your imagination as you review older codebases that need to be revisited. What used to take a pile of JS now only requires a few lines, or just a few declarative attributes in HTML.

Stay tuned for the rest of this series!
