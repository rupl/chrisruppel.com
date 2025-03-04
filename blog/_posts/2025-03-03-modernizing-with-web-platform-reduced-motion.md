---
title: 'Modernizing with the Web Platform: Reduced Motion'
summary: Demonstrating how the modern Web Platform can simplify motion reduction on an old codebase.

video:
  width: 600px
  src: devilsgame-prefers-reduced-motion-media-query.mp4
  caption: A screencast showing enabling the `prefers-reduced-motion` CSS Media Query has a real-time effect on the web page, disabling all motion including CSS Transitions, CSS Animations, and animated GIFs.

syndication:
  - type: Mastodon
    href: https://mastodon.social/@rupl/114104410772329715

work-cta: true

tags:
- accessibility
- css
- javascript
- web platform
---

This is part two of a series about the power of the modern Web Platform. I wrote each article based on the learnings from a project built in 2018, then refreshed in 2024.

- Part 1: [Image performance](/blog/modernizing-with-web-platform-image-performance/)
- **Part 2: Reduced motion in CSS and images (this article)**
- Part 3: Web Share API
- Part 4: HTML5 Dialog for popups and status messages
- Part 5: Paywall-aware Service Worker and Cache storage


## History of DevilsGame

In 2018 I was hired to build a web prototype for what the client hoped to turn into iOS/Android apps down the road. It is billed as [DevilsGame, an immersive cyber novel](https://devilsgame.com) — different than an ebook, but ultimately long-form reading that takes advantage of its home on the web, with links to both real and fictional websites that bring the story to life.

I produced a PWA with paywalled content so people can begin reading for free, but have to purchase the entire story. The client was quite happy with it, but wanted to focus on native apps after it was feature-complete. A separate firm was hired to manage that effort, which proved to be expensive and slow-going compared to the agility of a website.

After several years they came back to me asking if we could invest even more in the PWA. The web platform had added some very nice capabilities in the mean time. So I gave the old codebase a solid audit and came back with a plan to improve performance, accessibility, and overall UX.

This article will focus on reducing motion for accessibility purposes.

## App-like navigation

The website originally used smoothState, a now-defunct jQuery plugin that can coax any multi-page website into feeling more like a single-page app (SPA). By preloading content with jQuery and replacing only parts of the DOM, smoothState allows a visitor to land on any URL and receive a full HTML response, but then navigate to further pages without full reloads.

A future article in this series will go into the details, but the need to preload in this manner was largely made unnecessary by the Service Worker and Cache storage that gets installed on first visit. So I removed smoothState and replaced it with the most basic of [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API):

```css
@view-transition {
  navigation: auto;
}
```

This combination of simple View Transitions, the PWA's cache, and the existing visual transitions that happen on each page load make for instant navigations that feel like an SPA. And we're down one whole JS library!

## Reducing motion via Media Query

The motion does make for a smooth-feeling navigation, but it can also be [harmful for people with vestibular disorders](https://www.a11yproject.com/posts/understanding-vestibular-disorders/) or simply undesireable if people would prefer not to see it.

Enter the [`prefers-reduced-motion` CSS Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

This setting is applied at the operating system level as an accessibility aid, passed onto the web browser in real time. You could use this media query to alter each definition of the CSS Transitions and Animations you've written, but it's far easier to write some really strong overrides when the media query is active:

```css
/**
 * Reduced motion via Media Query.
 */
@media (prefers-reduced-motion: reduce) {
  /* Disable smooth scrolling */
  html:focus-within {
    scroll-behavior: auto !important;
  }

  /* Disable all CSS Transitions and CSS Animations. */
  *,
  *::before,
  *::after {
    animation-delay: -1ms !important;
    animation-duration: 0.1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0.1ms !important;
    transition-delay: 0.1ms !important;
  }

  /* Disable all View Transitions */
  @view-transition {
    navigation: none;
  }
}
```

At the time of writing I couldn't find the exact source for this code, but I swear that it was an updated version of [Andy Bell's modern CSS reset](https://github.com/Andy-set-studio/modern-css-reset/blob/master/src/reset.css#L60-L73), which has a precursor to the more detailed version in the previous code block.

1. The first rule involving `scroll-behavior` cancels out the smooth-scrolling feature that browsers provide, including when you use the browser's search mechanism to jump around within the page.

2. The second rule targeting `*` and the pseudo-elements essentially flattens all transitions and animations, eliminating them in one fell swoop. I love it! It means you don't have to think about implemening this media query each time; instead you write your motion-oriented rules, and they get cancelled out when necessary. There is additional customization possible via the [`animation-fill-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode) property, which has a default value of `none`. But if your styles "expect" the animation to run and only make sense afterwards, you might want to select a different value such as `forwards` or `both`.

3. The third rule reverts the View Transitions and ensures that they no longer apply to the page. I only had one to override, but each one you defined will need to be reverted.

I'm not sure about all operating systems, but on a Mac this setting is respected in real-time in all major browsers. Open **System Settings &raquo; Accessibility &raquo; Reduce motion** and enable it, and on DevilsGame you instantly see many effects disappear: the background has a slow pulsing effect which goes away, the menu no longer has a sliding effect, and navigating between pages is also free of motion effects.

In this video I'm using Chrome's emulation of the media query to toggle the reduced-motion mode. However the effect is exactly the same, and you see how it changes real-time:

{% include 'video.html' %}



## Reducing motion via JavaScript settings

There's a second way to achieve reduced motion on DevilsGame via the settings page. Perhaps you just find this particular site's motion distracting, or don't yet know about the OS-level settings. The great part is that once the rules have been written for the CSS Media Query, you can replicate them for JS-powered settings.

The settings page is an HTML form which has some JavaScript event handlers attached to them. In a nutshell, if the `prefers-reduced-motion` media query is already enabled, then our JS will automatically disable the checkbox and show a message that we respect the existing preference. If the media query is not present, we toggle a data-attribute on the document root like so:

```js
animationCheckbox.addEventListener('change', (ev) => {
  // Add or remove the data attribute on the &lt;html> element.
  if (ev.target.checked) {
    root.removeAttribute('data-reduce-motion');
  } else {
    root.setAttribute('data-reduce-motion', '');
  }

  // Once setting has been adjusted, store the new value.
  window.localStorage.setItem('show_animations', ev.target.checked);
});
```

On each page load afterwards, our JS will look inside `window.localStorage` for the setting and re-apply the data attribute if necessary. With Service Worker caching this JS can execute more or less instantly on each page load, and the page never shows animations once the visitor has disabled them via JS.

The CSS to drive the JS-driven data attribute has to be altered slightly; one of the main reasons is that I used both pseudo-elements on `&lt;html>` itself in order to provide a background animation that persisted when smoothState used to replace the entire body tag. If you don't use the root tag for anything motion-related, you can duplicate the reduced-motion CSS from above without modifying it at all:

```css
/**
 * Reduced motion via JS-powered settings.
 *
 * Same exact behavior as MQ but with the JS-powered settings that look for the
 * data-reduce-motion attribute on the root element &lt;html>.
 */
html[data-reduce-motion] {
  /* repeat the contents of the media query block from before */
}
```

Even if the code has to be repeated, it still performs the same duty of eliminating motion without the need for authoring additional code on individual animations.


## Reduced motion within responsive images

One chapter of the story displays an animated graphic, and during the 2024 refresh another agency provided us with a new site logo which also had an animated variant. All of these graphics were displayed with `&lt;img>` tags originally. However, they also should respect the visitor's motion preferences.

To start, I wrapped all instances of `&lt;img>` with the `&lt;picture>` tag to allow for various sources to be available. The `&lt;source>` tag lets you specify a media query, a use-case often called "art direction" when you read introductory articles about the Picture element. The art direction use-case focuses almost solely on responsive web design contexts, where the size of the viewport is the important factor in choosing the right image.

However, any CSS Media Query will work here. Including `prefers-reduced-motion` media queries! Consider the following:

```html
  &lt;picture>
    &lt;source media="(prefers-reduced-motion: reduce)" srcset="/img/looping-ring-of-fire-static.png">
    &lt;img src="/img/looping-ring-of-fire-optimized.gif" alt="Animated ring of fire" loading="lazy">
  &lt;/picture>
```

When using the `&lt;picture>` tag, the browser will select the first `&lt;source>` whose conditions are met. That means we can show a static image to any visitor who prefers reduced motion.

_Side note: I have another article about using `&lt;picture>` to [swap out images for dark mode](/blog/picture-prefers-color-scheme-dark/). Read about it if you like!_

Respecting the JS-powered settings is less straightforward, but still possible. I wrote some JavaScript which finds any `&lt;source>` that uses the `prefers-reduced-motion` media query, and modifies it to be `(min-width: 0px)` instead. Since the viewport of all visual user-agents is larger than 0, it will always be picked over the default animated `src`:

```js
// If we found the JS-powered data attribute, process all &lt;source> tags so that
// their condition is guaranteed to be true.
if (window.localStorage.getItem('show_animations') !== 'false') {
  const sources = document.querySelectorAll('source[media*=prefers-reduced-motion]');
  sources.forEach(el => {
    el.setAttribute('media','(min-width: 0px)');
  });
}
```

**This code has a major caveat:** it assumes that the `&lt;source>` appears at before any other that might have a truthy media query. I was the sole author of this website's content and had a precise overview of the markup within. If your codebase is known to have lots of `&lt;picture>` tags with various sources, the JS might have to grow in complexity to ensure the reduced motion source gets picked, by deleting the others or re-ordering them so that it comes first.

## Motion eliminated!

With the three techniques outlined above, I was able to provide a completely motion-free experience to visitors without having to do any major overhaul of the existing markup or authored styles. My hope is that by demonstrating how I did this on a real-world project, that you can adapt the techniques for use in your existing work.

Accessibility work is vital, and it can't always wait until the next project where you have a fresh start. It's possible to integrate accessibility improvements into existing websites, and in some cases doesn't even require touching your existing code.
