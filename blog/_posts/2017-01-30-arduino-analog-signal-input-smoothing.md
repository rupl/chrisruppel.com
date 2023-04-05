---
title: Arduino analog signals and input smoothing

summary: Stabilize inconsistent analog input signals with input smoothing. Some basic math operations help us collect more reliable data.

tags:
- arduino
- electronics
- debugging
---

I am a beginner with Arduino. While experimenting with various sensors I came to the point where I wanted to smooth analog input data in order to get more steady readings. Below is what I learned about _input smoothing_.

## Collecting wobbly input data

[While testing my light sensor](/blog/lilypad-arduino-light-sensor-pulse-width-modulation/) I noticed that it can produce some pretty inconsistent numbers on each measurement. While putting a tiny delay can stabilize things a bit, I wanted to make the sensor data a steady as possible.

I also have a [soil moisture sensor](/blog/arduino-soil-moisture-sensor/) which provides consistent readings when the signal is strong, but produces oscillations when the signal is on the low end of its range. Here's a screenshot of the plotter wavering about the 400 range:

<img src="{{ site.img-host }}/img/arduino-soil-moisture-sensor-oscillation.png" alt="Screenshot of Arduino Serial Plotter displaying a signal which oscillates between 430 and 490">

Both types of signal noise can be stabilized using _input smoothing_.

**By taking a measurement several times and blending the values into an average, we can collect more reliable data.** It comes at a very small cost: a few milliseconds are needed to collect the extra data.

Keep in mind that an Arduino can sample roughly at 500Hz. Even if we reduce our cycle by a factor of 10, that's still 50Hz which is good enough for movies and television to look smooth. So if you're reacting to something in real-time like an accelerometer or light sensor, it will still be plenty fast for an indicator LED to look smooth. In other scenarios like soil moisture readings, they are normally sent to a data logger so the lost milliseconds are not important at all.

I wrote my own code to do this, but later found an even better function in the [Arduino tutorial section](https://www.arduino.cc/en/Tutorial/Smoothing). I will use my own code here instead of reproducing theirs, but check both out and see which one suits you.

```clike
//
// Helper function to smooth out the light sensor data.
// Takes any number of readings and smoothes out the data to an average value.
//
// Returns 8-bit value (0-255).
//
int smooth(){
  int i;
  int value = 0;
  int numReadings = 10;

  for (i = 0; i < numReadings; i++){
    // Read light sensor data.
    value = value + analogRead(sensor);

    // 1ms pause adds more stability between reads.
    delay(1);
  }

  // Take an average of all the readings.
  value = value / numReadings;

  // Scale to 8 bits (0 - 255).
  value = value / 4;

  return value;
}
```

The `smooth` function can then be used within the original program instead of a direct call to `analogRead`.

The result is a more stable value with less noise. If you plug this into your original program, you will probably notice the output LED holds a more consistent brightness with less flicker. See the official smoothing tutorial for even more advanced methods of reducing noise in your sampling data.

Visual learners can easily oberve the effects by using the [**Serial Plotter** to graph data](/blog/arduino-serial-plotter-debugging/) both before and after input smoothing. 
