---
title: Debugging Arduino sensors with the Serial Plotter

summary: Learning how to program Arduino in the open. This experiment involved a light sensor and Arduino IDE's Serial Plotter.

tags:
- arduino
- electronics
- debugging
---

I am a beginner with Arduino. While experimenting with various sensors I eventually came to the point where I wanted to smooth input data in order to get a more steady readings. I found this plotting tool within the Arduino IDE to help me.

## Debugging wobbly input data

Arduino IDE has a **Serial Plotter** which is a fantastic debugging tool to complement the raw logging monitor. The original **Serial Monitor** displays text data only, and while a stream of numbers can be quite useful, pictures are worth a thousand words, or numbers in this case.

As of version 1.6.6 the IDE comes with a built in plotter that accepts a stream of numbers from `Serial.println` and graphs them over time, auto-scaling the Y-axis to include your highest and lowest sample values.

<img src="{{ site.img-host }}/img/blog/arduino-serial-plotter.gif" alt="Screenshot of Arduino IDE v1.6.16 serial plotter."/>

As a visually-oriented person this made me so happy to find! If you're debugging analog sensor data, I'd highly recommend enabling the plotter to make sense of the readings. It also makes easy work of determining when you have unsteady input, as I had in my previous post. If the plotter shows inconsistent data, producing jagged lines, then perhaps it's time to try input smoothing to achieve a less noisy, smoother line in the plotter.
