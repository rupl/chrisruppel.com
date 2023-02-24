---
title: "&lt;picture&gt; with prefers-color-scheme media query"

summary: Another way to adapt your media to dark mode.

tags:
- css
- web standards
---

Brad Frost [combined &lt;picture&gt; and the prefers-reduced-motion media query](http://bradfrost.com/blog/post/reducing-motion-with-the-picture-element/) to achieve delightfully simple and effective results. I immediately imagined the possibilites of using media queries that don't relate to the viewport size.

## Dark mode imagery

Why not use some other media queries in `&lt;picture>`?

```html
<picture>
  <source srcset="dark.jpg" media="(prefers-color-scheme: dark)">
  <img src="original.jpg">
</picture>
```

Let's see it in action:

<figure>
<picture>
  <source srcset="{{ site.img-host }}/img/picture-mq-dark.jpg" media="(prefers-color-scheme: dark)">
  <img src="{{ site.img-host }}/img/picture-mq-original.jpg">
</picture>
<figcaption><small class="caption"><code>&lt;picture&gt;</code> element with a <code>prefers-color-scheme</code> media query.</small></figcaption>
</figure>

<strong>Try it using your OS preferences for dark mode!</strong>

I applied some really minimal dark-mode CSS to this page to help visualize the effect. Maybe having this post public will give me the motivation to clean it up and make it site-wide 😜

The [WebKit blog](https://webkit.org/blog/8840/dark-mode-support-in-webkit/) has a similar example in their introductory post on dark mode support.

<style type="text/css">
  @media (prefers-color-scheme: dark) {
    html,main {
      background: #222;
      color: #ccc;
    }
    main code {
      color: #222;
      background: #666;
    }
    main .e-content a {
      color: #36f;
    }
  }
</style>
