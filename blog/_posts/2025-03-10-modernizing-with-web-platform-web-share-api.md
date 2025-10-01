---
title: 'Modernizing with the Web Platform: Web Share API'
summary: Demonstrating how the modern Web Platform can simplify social sharing on an old codebase.

gallery:
  - src: dg-web-share-api-shared.jpeg
    alt: Preview of the URL devilsgame.com being shared via iMessage on iOS
    type: wide
    bgpad: 60%
  - caption: The final result of sharing in a chat app with a social preview image, the title, and the URL being displayed against a red background color which was specified in the PWA config.

gallery2:
  - gridtype: col-3
  - src: dg-web-share-api-desktop.jpeg
    alt: A screenshot of Web Share API being invoked on devilsgame.com via Safari on a Mac laptop
    bgpos: 50% 100%
    type: two-third tall-half
  - src: dg-web-share-api-phone.jpeg
    alt: A screenshot of Web Share API being invoked on devilsgame.com via Safari on an iPhone
    bgpos: 50% 100%
    type: one-third tall-half
  - caption: The first screenshot is desktop, the second is from my phone. In both cases, there is no option for traditional social networks because I don't have those apps installed on my devices. I do have messaging apps, email, and the general ability to copy to clipboard.

# syndication:
  # - type: Mastodon
    # href: https://mastodon.social/@rupl/XXX

work-cta: true

tags:
- css
- javascript
- pwa
- web platform
---

This is part three of a series about the power of the modern Web Platform. I wrote each article based on the learnings from a project built in 2018, then refreshed in 2024.

- Part 1: [Image performance](/blog/modernizing-with-web-platform-image-performance/)
- Part 2: [Reduced motion in CSS and images](/blog/modernizing-with-web-platform-reduced-motion/)
- **Part 3: Web Share API (this article)**
- Part 4: HTML5 Dialog for popups and status messages
- Part 5: Paywall-aware Service Worker and Cache storage


## History of DevilsGame

In 2018 I was hired to build a web prototype for what the client hoped to turn into iOS/Android apps down the road. It is billed as [DevilsGame, an immersive cyber novel](https://devilsgame.com) — different than an ebook, but ultimately long-form reading that takes advantage of its home on the web, with links to both real and fictional websites that bring the story to life.

I produced a Progressive Web App (PWA) with paywalled content so people can begin reading for free, but have to purchase the entire story. The client was quite happy with it, and after several years they came back to me asking if we could invest even more in the PWA. The web platform had added some very nice capabilities in the mean time. So I gave the old codebase a solid audit and came back with a plan to improve performance, accessibility, and overall UX.

This article will focus on private, performant sharing to any social network of your choice.

## Problems with social sharing widgets

If you install a Facebook like button, a Twitter/X embed, or other similar third-party social scripts, it's an invasion of privacy for every visitor who arrives on your website. Not only does their information get transmitted from your site, but as they browse around the web and load other sites' share buttons, they get followed around and their habits and interests get tracked. 

This phenomenon is called surveillance capitalism — the data taken about each visitor is the lifeblood of modern tech giants. They use it to show you ads, alter your search results, show you different types of posts, and generally attempt to manipulate your behavior to increase time spent using your device, and ultimately to spend money that lands in their pockets.

Each website that implements share buttons gets a small benefit from added reach and traffic, but the aggregate effect of all websites adding these invasive scripts gives the tech giants power that they shouldn't have.

## Web Share API, a more private alternative

Enter the Web Share API, a feature of modern browsers that lets you as a visitor share URLs and certain preformatted content to various social networks without exposing as much data to the social networks.

Another benefit is that by being a feature of the browser, each operating system can create the UX they want. So on iPhone you see something different than Android, but each one is consistent with the OS' overal look and feel. So it feels more familiar to all groups with zero effort on your part!

## Implementing Web Share API on public pages

On a public page it is a straightforward chunk of JavaScript to get things going. I start by leaving a blank spot in my HTML where the button will live. No sense in printing HTML for a button that might not even show up in certain contexts!

```html
&lt;div class="share-container">&lt;/div>
```

Now we start writing JavaScript. The first step is to perform a **feature test**. By checking for the Web Share API in the browser before continuing to build the button, we avoid doing unnecessary work, and ensure that whatever we do try to display will work as intended.

I strongly recommend feature testing for any browser API that is new, or relies on secure contexts (where the content is served with valid encryption via HTTPS). Web Share API does require a secure context, but the feature test is delightfully simple:

```js
// Check to see if Web Share API is available
if ('share' in navigator) {
  // Inside this block the Web Share API is guaranteed to exist and we can
  // perform our setup: build our button, attach an event listener, etc.
}
```

There will be numerous ways to build your button, but let's just pretend that you'd created one with an HTML ID `id="share"`. Given that ID, here's what your event listener will look like to invoke Web Share API:

```js
// Set up button
const shareButton = document.querySelector('#share');

// Set up content to be shared
const share_title = document.querySelector('title').innerText;
const share_text = document.querySelector('meta[property="og:description"]').getAttribute('content');
const share_url = window.location.href;

// Set up event listener.
shareButton.addEventListener('click', function() {
  navigator.share({
    title: share_title,
    text: share_text,
    url: share_url,
  })
  .then(() => {
    // Show some UX feedback if desired.
  })
  .catch(() => {
    // Show an error if desired.
  });
});
```

That's it! Once invoked, the device operating system will take over, showing your visitor a customized menu of sharing options based on what they have installed on the device. Someone who uses Facebook all the time will probably see that first in the list, while another might see Instagram, and still another might only have things like email or SMS available if they aren't the type to use social networks. Here's a couple screenshots from my laptop and phone respectively when I share URLs from DevilsGame:

{% include 'gallery.html', gallery: gallery2 %}

You'll notice that the icon is a generic URL or browser symbol. That's because in this example I didn't attach an image to share. However, most apps and social networks will generate an image as long as you have appropriate social meta tags embedded in each URL. Once I share in iMessage or Signal, I see something like this:

{% include 'gallery.html' %}


## Share the good news!

Using this native feature of the Web Platform, you can allow visitors to share to any social network of their choice, and other forms of communication such as messaging apps without compromising their privacy, nor the performance of your website.
