---
title: "CSS Transforms Level 2: shorthand properties"

tags:
- css
- web standards
---

Ever since [I first dove into CSS Transforms](https://rupl.github.io/unfold/) I have often wished for one seemingly simple change: the ability to specify the transforms as their own properties. As I learned the syntax, I constantly made mistakes by directly using transform functions as CSS  properties. Like this:

```css
/*
 * Valid syntax for CSS Transforms Level 1
 */
.classic {
  transform: translate(45px) scale(1.333) rotate(45deg);
}

/*
 * Wrong syntax, but feels right
 */
.shorthand {
  translate: 45px;
  scale: 1.333;
  rotate: 45deg;
}
```


## Shorthand needed

It seems I wasn't the only one subconsciously wanting this shortcut. Sometime after [Lea Verou suggested](https://twitter.com/LeaVerou/status/487350702386479105) that it's a quirk of the syntax and not the developer mindset, a small addition to the CSS Transforms spec was developed: [CSS Transforms Level 2 (draft)](https://drafts.csswg.org/css-transforms-2/).

Although the spec is not remotely finalized, Chrome 53 has already shipped the feature behind the [Experimental Web Platform features](chrome://flags/#enable-experimental-web-platform-features) flag, so this new syntax can be tested today.

<iframe width="100%" height="220" src="/sandbox/css-transforms-level2-example1/" frameborder="0"></iframe>

<small class="caption">_[Example 1](/sandbox/css-transforms-level2-example1/), which uses the same CSS as the first example code block._</small>


## Simple but reliable transforms

Using these properties means they are applied in a standard order defined by the spec. Separate properties make authoring easier on us because the order of transforms can affect the outcome. But these new properties are applied in an intuitive order no matter what order we author them. [From the spec](https://drafts.csswg.org/css-transforms-2/#individual-transforms):

> The `translate`, `rotate`, and `scale` properties allow authors to specify simple transforms independently, in a way that maps to typical user interface usage, rather than having to remember the order in `transform` that keeps the actions of `transform()`, `rotate()` and `scale()` independent and acting in screen coordinates.

You might have noticed this if you've ever applied multiple transforms in an order that **doesn't** apply them independently:

```css
/*
 * Unintuitive order of transforms, first transform
 * affects later ones.
 */
.classic {
  transform: rotate(45deg) scale(1.333) translate(45px);
}

/*
 * Intuitive order of transforms, each transform
 * unaffected by the previous one.
 */
.classic-independent {
  transform: translate(45px) scale(1.333) rotate(45deg);
}

/*
 * Declarative syntax, so authoring order is ignored.
 */
.shorthand {
  rotate: 45deg;
  translate: 45px;
  scale: 1.333;
}
```

<iframe width="100%" height="250" src="/sandbox/css-transforms-level2-example2/" frameborder="0"></iframe>
<small class="caption">_[Example 2](/sandbox/css-transforms-level2-example2/), comparing two `transform` syntaxes to shorthand._</small>

In this case, the `.classic` transform rotates before translating, meaning the translation moves your element 45px to the right, **but at an angle of 45 degrees**. And it only becomes more complicated when there are animated 3D transforms involved...


## Using with CSS Transitions and Animations

Its strength really shines through when used with CSS Transitions or CSS Animations, when we often want to animate only one aspect of a transformation.

```css
/*
 * Animate using valid CSS Transforms Level 1 syntax.
 *
 * Must repeat the entire transformation instead of overwriting the specific
 * properties we are changing.
 */
.classic .transform {
  transform: translate(0, 0) scale(1.333) rotate3d(0, 1, 0, 45deg);
  animation:  classic 4s alternate infinite;
}

@keyframes classic {
  50% {
    transform: translate(0, 100px) scale(1.333) rotate3d(0, 1, 0, 45deg);
  }
}
```

Notice in the `.classic` CSS, we have to specify _the entire transform_ every time we want to alter it. If any of the transform functions are left out, the transform will appear broken. Not so simple to spot the one number that changes between the two `transform` values, is it?

```css
/*
 * CSS Transforms Level 2 syntax.
 *
 * Individual transform functions can be animated
 * without duplication of code!
 */
.shorthand .transform {
  scale: 1.333;
  transform: rotate3d(0, 1, 0, 45deg);
  animation: shorthand 4s alternate infinite;
}

@keyframes shorthand {
  50% {
    translate: 0 100px;
  }
}
```

With the shorthand, not only is there less duplication, but starting properties can be completely omitted since they naturally default to `0`. That leaves us with a clean, unambiguous definition of our animation.

<iframe width="100%" height="300" src="/sandbox/css-transforms-level2-example3/" frameborder="0"></iframe>
<small class="caption">_[Example 3](/sandbox/css-transforms-level2-example3/), classic, shorthand, and CSS Animations combined._</small>

At the time of writing, the shorthand syntax for 3D rotation is not supported even in Chrome. But I took the opportunity to mix everything together. The third example uses `transform: rotate3d()` to set the rotation, and yet the shorthand syntax in the animation keyframes _still_ intelligently applies the transforms in the proper order.


## Feature detection

[I've opened a PR](https://github.com/Modernizr/Modernizr/pull/2100) to detect these new properties in Modernizr, but in the mean time you can test by using CSS Supports:

```css
/*
 * Within your CSS files.
 */
@supports (translate: 45px) {
  translate: 45px;
}
```

Or if you'd rather use JavaScript, you've got a couple options:

```js
// Use CSS Supports via JS.
window.CSS.supports('(translate: 45px)');

// Explicitly check the CSSStyleDeclaration for the property.
typeof(document.querySelector('body').style.translate) !== 'undefined';
```

## Should I use this?

**No.** It's not even listed on caniuse yet ;)

But keep it in mind and someday simple transforms will be easier to author and more flexible to manipulate. Until then, just stick with the reliable syntax offered by the `transform` property.
