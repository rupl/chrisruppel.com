---
title: A modern CSS Reset by Andy Bell

layout: link
link: https://hankchizljaw.com/wrote/a-modern-css-reset/

tags:
- css
- web platform
---

I love that this reset is so small and doesn't try to completely crush the default styles of browsers.

Also, I join the entire webdev community in a collective _oooh ahhh_ over the use of the `[class]` selector as a means for neutralizing styled lists, while leaving plain content alone.

We've all used a reset+unset by means of a container class, but this is just so much cleaner!

```css
/*
 * Lists within text content are left alone!
 * Your nav is ready for styling.
 */
ul[class] {
  margin: 0;
  padding: 0;
}
```
