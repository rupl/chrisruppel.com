---
title: LilyPad Arduino LED Biking Jacket

summary: Using the LilyPad Arduino to build a LED turn-signal system into a jacket, increasing night time safety for bicyclists.

gallery:
- gridtype: col-3
- src: lilypad-arduino-biking-jacket-1.jpg
  alt: Materials for the jacket organized into piles. LilyPad Arduino, SparkFun silver-coated conductive thread, LilyPad LEDs, and LilyPad push buttons.
  comment: The electronic components for the jacket. You'll need a few other things not pictured, but these are the LilyPad components you need
  type: tall-half half
  bgpos: 50% 74%
- src: lilypad-arduino-biking-jacket-2.jpg
  alt: Chalk diagram drawn onto jacket.
  comment: My initial sketch that I used as a guide.
  type: tall-half half
- src: lilypad-arduino-biking-jacket-3.jpg
  alt: One row of LED aligned along chalk sketch.
  comment: Laying the LEDs out along the chalk sketch and gluing them to the jacket makes sewing much easier.
- src: lilypad-arduino-biking-jacket-4.jpg
  alt: Close-up of LEDs sewn into jacket. Individual stitches are visible.
  comment: Once the LEDs are sewn, they should be snugly in place and immovable when touched.
- src: lilypad-arduino-biking-jacket-5.jpg
  alt: Lit-up LED turn signal.
  comment: The AAA battery makes for a very bright turn signal.
- src: lilypad-arduino-biking-jacket-6.jpg
  alt: DIP N push button switches
  comment: These DIP switches were a great alternative to the LilyPad push buttons.
- src: lilypad-arduino-biking-jacket-7.jpg
  alt: Underside of DIP switch poking through jacket material.
  comment: Pushing the DIP switches through strong material can bend the legs so be careful and make a hole with the needle first.
- src: lilypad-arduino-biking-jacket-9.jpg
  alt: Zig-zag stitching pattern.
  comment: Since conductive thread is not elastic, using a zig-zag pattern allows the jacket material to bend and stretch without ripping any threads.
- src: lilypad-arduino-biking-jacket-8.jpg
  alt:
  comment: The finished product! The jacket is in hazard mode to display all lights simultaneously, so the turn signals' brightness is visibly decreased.
  type: wide
  bgpad: 60%

tags:
- lilypad
- arduino
- electronics
---

Ever since I found the LilyPad, I have had this project in mind. It was one of the first I found, developed by the designer of the LilyPad herself. As a beginner to both electronics and sewing, I thought it was a nice bar to set for myself in order to grok the process of building e-textiles. I made this particular jacket as a gift to my wife Karin since she bikes to work every day.

Here are some pictures of the jacket with some notes I jotted down during the project. Below the photos I included more details if you're interested in the actual construction and coding of the jacket.

{% include 'gallery.html' %}

I used [Leah Buechley's instructables.com tutorial](https://www.instructables.com/id/turn-signal-biking-jacket/) as my guide, and it is a great walk-through that I need not reproduce. If you want to build one for yourself, use her tutorial. Then you can revisit this post to see my modifications and code samples.

## Construction modifications

Per her recommendation I started with a sturdy windbreaker that had an inner fleece lining. It wasn't thick, but the lining makes sewing inside the jacket so much more sturdy, not to mention sightly. Sewing all the stitches neatly within the inner layer and only exposing thread at components' contact points makes for a great looking jacket that is a bit more weatherproof.

I ordered the SparkFun LilyPad buttons pictured in my materials photo, but ended up using DIP N push-button switches from my local electronics store instead. They have a softer pressure and a higher profile, making it easier to trigger the signals.

In addition to the fabric glue used to insulate the exposed electronics, I used a gel variant of superglue to secure all the components to the jacket before sewing. I found superglue to be better because it's stronger and it dries quite fast. Fast-drying glue meant I could glue things down and proceed to sew after just a couple minutes, instead of waiting the recommended two hours for the fabric glue.

## Code modifications

Unlike my normal environment of a web browser, this jacket has a mere two pushbuttons as an interface. That means there are four total states for the hardware. Using these wisely was a programming challenge, not from a syntax standpoint, but usability.

The original code that went with the project can [currently be found only on archive.org](https://web.archive.org/web/20150922011154/http://web.media.mit.edu/~leah/LilyPad/build/turn_signal_code.txt) but I have some similar code that I created with the original as reference.

Something I learned from Leah's code is using a read command within a `while` statement, which effectively pauses execution until specific input is received. This allows us to respond to both buttons being pushed, or just one. Here is an _incomplete example block_ showing this technique:

```clike
if (digitalRead(leftButton) == LOW) {

  // Listen for the same condition we just tested,
  // meaning we can wait for additional input until
  // the first button is released.
  while(digitalRead(leftButton) == LOW) {

    // If other button is detected, trigger hazard mode.
    if (digitalRead(rightButton) == LOW) {
      hazardMode = 1 - hazardMode;
      return;
    }
  }

  // ...other stuff
}
```

One customization I think made a very big difference was to [use pulse width modulation to fade the blinkers in and out](/blog/lilypad-arduino-light-sensor-pulse-width-modulation/#blinking-vs-fading-leds). I just wanted the blink cycle to look a bit fancier and this simple addition did the trick. The next _incomplete code block_ is inside a larger function which controls both driver indicators and blinkers when a button is pressed:

```clike
// Fade in blinker.
for (x = 0; x <= 255; x += 6) {
  analogWrite(blinker, x);
  delay(2);
}

// Blink rapidly a few times
digitalWrite(blinker, HIGH);
delay(100);
digitalWrite(blinker, LOW);
delay(75);
digitalWrite(blinker, HIGH);
delay(100);
digitalWrite(blinker, LOW);
delay(75);
digitalWrite(blinker, HIGH);
delay(100);
digitalWrite(blinker, LOW);
delay(75);
digitalWrite(blinker, HIGH);
delay(100);
digitalWrite(blinker, LOW);
delay(75);
digitalWrite(blinker, HIGH);
delay(100);

// Fade out blinker.
for (x = 255; x >= 0; x--) {
  analogWrite(blinker, x);
  delay(3);
}

// Blinker off completely.
digitalWrite(blinker, LOW);
```

The full code is a bit unwieldy to display here, but I have posted a [GitHub Gist with my entire source](https://gist.github.com/rupl/bf05d1ad40131a21f16fb24fbef9c0e3).

Building this jacket was a ton of fun in addition to being a great Arduino learning experience. Plus, Karin loved her gift and can't wait for the warm weather so she can start using it on her daily commute!
