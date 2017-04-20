---
title: Powering NeoPixels with Johnny Five and Socket.io

summary: Learning to program Arduino in the open. This experiment involved the Johnny Five platform and Socket.io, allowing me to power an Adafruit NeoPixel from my pet project bustashape.

tags:
- arduino
- electronics
- johnny five
- javascript
- bustashape
- web sockets
---

Shortly after getting Johnny Five running on my Arduino Uno, I found this excellent [article by Ricardo Filipe](http://blog.ricardofilipe.com/post/getting-started-arduino-johhny-five). He used Johnny Five and Socket.io to make a simple interface that controls a LED with red, blue, and green channels.

This was very exciting to me, because [bustashape](https://bustashape.com) also uses socket.io, and I have always had a pipe dream in my head, to free bustashape from the web and let it live in other less conventional displays, such as LED arrays. Same principle, but more fun!

Here's a video showing each step in the process. If you'd like, read below to see how I progressed to the final demo.

<div class="video-wrapper">
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/d0ymYJeW9wU" frameborder="0" allowfullscreen></iframe>
</div>

## Limit the canvas

Bustashape is an infinite blank canvas by default, but restricting a few parameters is all I needed to simulate the 8x8 matrix of my NeoPixel. Using a two-digit, base-8 coordinate system allows me to translate its position in space directly to the linear representation needed to display on the LED strip.

Some edge cases built into the code prevent drawing squares that wrap from the right to left edge of the array.

## Colors and overlap

The library we're using to draw LEDs accepts hex and RGB, the two most common color formats for the web. That means the color info passed between clients within bustashape is ready for use with LEDs. Easy.

Overlapping shapes is where it starts to get tricky. The shapes normally have four degrees of freedom: shape itself, position, rotation, and scale. I decided to remove all shapes but the square, and eliminated rotation and scale to make getting started easier. With only position in play, I can draw a 2x2 square on the LED array at any position.

Without rotation or scaling, occlusion (making squares overlap) also becomes relatively straightforward. Bustashape layers all shapes from old to new, so that newest ones are on top. By drawing the shapes on the LED array in the order they were originally created, the same occlusions that occur in the web interface are preserved on the LED array.

## Drawing frames

Up until this point, I'd been clearing the LED array and drawing all the data as a callback to any change made by a user. It would redraw when there was nothing to redraw, and at times when there was latency, the array would choke hard on the hundreds of backed up operations that were sent all at once.

Computers are designed to deal with amateur approaches like mine, but NeoPixels are less forgiving. Part of the reason is because the draw instructions are time-based. Clearing the array plus 64 instructions, many of which said "draw nothing" was too choppy. Even with one shape, the display would blink in an annoying fashion.

I moved the drawing operation from the network-bound callback to a throttled, continuously running process that was independent of the user input. With a more predictable schedule, the LED array never chokes on the data when too much gets sent; that excess is easily managed by the server. This made for much better animation with way fewer stutters and pauses.

At this point, I was pretty happy with the results, but the LED array had trouble drawing more than three shapes since every cycle meant it was wiping the array and drawing each frame completely. After that it would start to stutter and refresh very slowly. Even when it refreshed quickly, there was some flashing happening due to the way I was drawing frames.

## Frame buffer

As we so frequently hear with virtual DOMs like React, I needed to do less work by comparing the old state with the new, and _only drawing the differences between the two frames_. This offloads all the "thinking" to the server again, allowing me to send just two or three instructions per frame.

A side effect of this rewrite caused me to eliminate double-writes that were caused by shapes overlapping. By diffing the frames ahead of time, the NeoPixel is guaranteed to receive a max of one instruction per LED. Plus, without a full `clear`, the LEDs which remain lit in the next frame don't ever blink.

The end effect is much more fluid and more pleasing to the eye. The framerate is significantly higher and rivals the speed of a smartphone. Success!
