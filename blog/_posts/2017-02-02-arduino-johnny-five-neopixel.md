---
title: Using Johnny Five to power NeoPixels

summary: Learning to program Arduino in the open. This experiment involved the Johnny Five platform, allowing me to power an Adafruit NeoPixel with JavaScript.

tags:
- arduino
- electronics
- johnny five
- javascript
---

Now that I have some basic electronics knowledge, I wanted to try something different on the coding side. Using the native Arduino C++ isn't too much of a leap, but the programming language I'm most fluent in is JavaScript, the language of the web.

Lucky for web developers, there is a fantastic platform available that has done all of the hard work for you called [Johnny Five](http://johnny-five.io) (J5, see what they did there?). Seriously, it was the fastest onboarding I've done while tinkering on Arduino.

To get started with Johnny Five, try the [excellent examples on the official website](http://johnny-five.io/examples/).

## Enter the NeoPixel

There is a fantastic line of products from AdaFruit called [NeoPixels](https://www.adafruit.com/category/168). NeoPixels come in many form factors, but underneath each product functions the same way: as a single strip of addressable LEDs. This makes it very simple to switch between form factors — for example from a 12 LED ring to 64 LED 8x8 matrix.

They are very popular because of their ease of use and myriad of applications. With popularity comes community support, meaning there are plenty of helper libraries to get you started quickly. J5 is no exception, and if you want to integrate with a web project of some sort, I recommend [node-pixel by ajfisher](https://github.com/ajfisher/node-pixel).

Before getting started with `node-pixel` make sure to follow the instructions to flash your Arduino with the proper firmware. I used the node.js module called [interchange](https://www.npmjs.com/package/nodebots-interchange) and it installed onto my Arduino Uno R3 without a hitch.

```
interchange install git+https://github.com/ajfisher/node-pixel -a uno --firmata
```

I didn't even have to specify a port. The library found my Arduino without any further configuration. Like I said, they have made it very easy to get started.

## Hello, World!

Let's get started using the most basic script possible with `node-pixel`. You tell the library about your hardware and it manages all the fine details. You'll need 3 wires to connect the NeoPixel: connect `VCC` and `GND` to their respective pins, and use a PWM-capable digital out as your data pin. The default is pin `6` and I have left it that way for my demo here.

After that you're ready to code! For those with a background in JavaScript, there is a familiar event listener syntax for both Johnny Five and `node-pixel`. Here's the most basic NeoPixel script to show the same color on all LEDs:

```js
pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;

board.on("ready", function() {
  // Define our hardware.
  // It's a 12px ring connected to pin 6.
  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 12}, ],
    gamma: 2.8,
  });

  // Just like DOM-ready for web developers.
  strip.on("ready", function() {
    // Set the entire strip to pink.
    strip.color('#903');

    // Send instructions to NeoPixel.
    strip.show();
  });

  // Allows for command-line experimentation!
  this.repl.inject({
    strip: strip
  });
});
```

Put this code into a file called `hello-neopixel.js` and then execute it on your command line like so:

```
node hello-neopixel.js
```

You should see all LEDs on your NeoPixel light up with a nice pink color. Try using the interactive REPL to change the color.

```js
strip.color('#930'); // nothing will happen yet
strip.show(); // strip should display orange!
```

For most commands, you have to treat them like a queue, and when you're done making changes you update the NeoPixel with the `strip.show()` command. However a few commands automatically trigger a refresh, such as `strip.off()` which turns the whole string of LEDs off.

## Updating single pixels

Showing one color is great, but the real fun is setting up custom patterns of lights or colors. Individually addressing a LED on your string is almost as easy.

```js
strip.pixel(0).color('#074'); // nothing will happen yet
strip.pixel(6).color('#074'); // nothing will happen yet
strip.show(); // first and seventh pixel should appear turquoise!
```

You can do this any number of times before sending the new instructions with `strip.show()`, meaning you can use `for` loops and other common programming tools to update the LEDs any way you see fit!

```js
strip.shift(1, pixel.FORWARD, true); // nothing will happen yet
strip.show(); // both turquoise pixels should shift clockwise
```

Repeat the `shift()` command (along with `show()` after each one) to see the pixels chase each other around the NeoPixel ring. Fun stuff!

<aside class="warning">
<p>Starting and stopping Arduino programs can get tedious, so I would <em>highly recommend</em> using <a href="https://www.npmjs.com/package/nodemon">nodemon</a> during development. If you're not familiar, it will auto-restart your script when you save new changes, meaning you don't have to use the REPL to get instant feedback.</p>
</aside>

## Pulling it all together

It's nice to experiment with the REPL, but I will combine all the individual transforms we just did into a tidy script. The end result is a pink ring with two turquoise pixels chasing each other clockwise around the ring:

```js
pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;

board.on("ready", function() {
  // Define our hardware.
  // It's a 12px ring connected to pin 6.
  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 12}, ],
    gamma: 2.8,
  });

  // Just like DOM-ready for web developers.
  strip.on("ready", function() {
    // Set the entire strip to pink.
    strip.color('#903');

    // Set first and seventh pixels to turquoise.
    strip.pixel(0).color('#074');
    strip.pixel(6).color('#074');

    // Display initial state.
    strip.show();

    // Loop the following command forever
    // at 12fps until Arduino powers down.
    var loop = setInterval(function () {
      // Shift all pixels clockwise
      strip.shift(1, pixel.FORWARD, true);
      strip.show();
    }, 1000 / 12);
  });
});
```

If all goes well, you should see something like this GIF. Johnny Five is alive!

<center><img src="{{ site.img-host }}/img/blog/neopixel-12r-chase.gif" alt="Animated GIF of the NeoPixel"></center>

In a future article, I'll take this to the next step: demonstrating how Johnny Five can respond to other events within a JavaScript application, allowing us to use our phones to interact with Arduino.
