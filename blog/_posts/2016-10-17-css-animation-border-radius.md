---
title: Using CSS to animate border-radius

summary: A fun little technique to add depth and subtlety to your design.

tags:
- css
- animation
---

My personal site, as with many, is a safe place to try out interesting ideas that most clients are reluctant to sign up for. While many of my experiments are engineering related, I do have a couple gems embedded in my CSS.

I added this effect to my footer a few months back and wanted to jot down the details because it has really grown on me and I don't see it very often in the wild.

## Creating irregular shapes

The feature of `border-radius` that we're exploiting is the second value you can pass in. Typically when we set the radius we just pass one value and it automatically copies the value for us:

```css
/*
 * Standard, evenly-rounded corners.
 */
.single-value {
  border-radius: 50px; /* 50px / 50px */
}

/*
 * The rounding will be 2x wider than it is tall.
 */
.double-value-wide {
  border-radius: 50px / 25px;
}

/*
 * The rounding will be 2x taller than it is wide.
 */
.double-value-tall {
  border-radius: 25px / 50px;
}

```

<iframe width="100%" height="220" src="/sandbox/css-animation-border-radius-example1/" frameborder="0"></iframe>

<small class="caption">_[Example 1](/sandbox/css-animation-border-radius-example1/), which uses the same CSS as the first example code block._</small>

You can see that when a second value is supplied, the first value is the horizontal radius and the second is vertical.

This is where things start getting interesting. I saw a great demo from [Tiffany Rayside](https://twitter.com/tmrdevelops) a few months back which uses this effect to its fullest, creating organic looking borders just by pairing large and small radii together. Here is her CodePen:

<p data-height="360" data-theme-id="light" data-slug-hash="VeRvKX" data-default-tab="result" data-user="tmrDevelops" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/tmrDevelops/pen/VeRvKX/">Imperfect Buttons</a> by Tiffany Rayside (<a href="https://codepen.io/tmrDevelops">@tmrDevelops</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://assets.codepen.io/assets/embed/ei.js"></script>

Combine this technique with the right typeface and you can really pull off the [hand-drawn vibe](https://malakahostel.com/about/). But what else can you do?

## Animating border-radius

I was trying to make my footer more personable and included my headshot, as one does. But how can I make it more interesting? I experimented with a few different radius combos but nothing was totally satisfying. Then I decided to try animating between a few states. Now that is something!

```css
.avatar-wobble {
  border-radius: 250px 750px 250px 750px /
                 750px 250px 750px 250px;
  animation: wobble 15s ease-in-out alternate infinite;
}

@keyframes wobble {
  50% {
    border-radius: 750px 550px 350px 750px /
                   350px 750px 550px 450px;
  }
  100% {
    border-radius: 750px 250px 750px 250px /
                   250px 750px 250px 750px;
  }
}
```

<img alt="my face"
  class="avatar-wobble"
  width="160" height="172.5"
  src="/static/chris-ruppel-2015@320.jpg">

<style type="text/css">
  img.avatar-wobble {
    float: left;
    margin: .1em 1em;
    border-radius: 250px 750px 250px 750px / 750px 250px 750px 250px;
    transform: rotate(-2deg);
    animation: wobble-article 12s ease-in-out alternate infinite;
  }

  @keyframes wobble-article {
    50% {
      border-radius: 750px 550px 350px 750px / 350px 750px 550px 450px;
    }
    100% {
      border-radius: 750px 250px 750px 250px / 250px 750px 250px 750px;
      transform: rotate(2deg);
    }
  }
</style>

By using `animation-direction: alternate` I get the benefit of running the animation forwards and backwards continuously, making it look a bit more random. The `100%` marker is the inverse of the initial starting point, and using `ease-in-out` as my timing function means it will briefly appear to pause at the two ends of the animation where it's more regular looking. But the middle chunk is pretty wobbly and creates a nice, subtle effect if you end up finding yourself unable to escape my gaze.

Unlike Tiffany's button effect, I stuck with high numbers to avoid creating any sharp corners. I wanted my avatar to be a nebulous blob at all times.

I originally triggered the effect on `:hover` with a short transition time, but mobile users were missing out on the fun. By using an animation with a long duration we get a continuous effect that is _just slow enough_ to make you question whether you're seeing things until you pause to watch.

Bingo.

## Adding even more randomness

I recently read about the [Cicada principle](https://www.sitepoint.com/the-cicada-principle-and-why-it-matters-to-web-designers/) which which uses `:nth-child` and prime numbers to simulate randomness on large groups of elements.

This principle was used on the [2016 UX London speakers page](http://2016.uxlondon.com/speakers) to accomplish this exact effect: irregular border radius settings applied semi-randomly to the various avatars. The designer even randomized the `:hover` state, meaning a wall of 20+ avatars has seemingly no duplicate effects applied to any of them. You could sit there and eventually find a pattern, but at a quick glance both the initial and hover states appear to be random.

Hopefully the simplicity of this technique unlocks other possibilities in your mind. If you have other examples please drop them in the comments!
