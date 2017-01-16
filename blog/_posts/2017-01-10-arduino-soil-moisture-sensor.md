---
title: Arduino soil moisture sensor

summary: Learning how to program Arduino in the open. This experiment involved a soil moisture sensor and an Arduino Uno.

gallery:
- gridtype: col-2
- src: arduino-soil-moisture-sensor-1.jpg
  alt: Close-up of the sensor pins. They are temporarily connected using breadboard wires.
- src: arduino-soil-moisture-sensor-2.jpg
  alt: Close-up of the Arduino pins. The sensor is connected to 3.3V, GND, and the A0 analog input pin.
- src: arduino-soil-moisture-sensor-3.jpg
  alt: The soil moisture sensor embedded in a potted plant with temporary connections to an Arduino Uno.
  type: wide
  bgpad: 60%

syndication:
- type: Twitter
  href: https://twitter.com/rupl/status/820955689367601152

tags:
- arduino
- electronics
- gardening
---

I have a few friends interested in automated farming so when I ordered my latest batch of components I added a [SparkFun soil moisture sensor](https://www.sparkfun.com/products/13322) to my order. Here is what I learned while setting it up and getting my first reading.

## Connecting the sensor

I got my breakout board from SparkFun. They have nice embedded sensors that significantly reduce the work needed to get up and running. This breakout has three connections: `VCC`, `GND`, and `SIG`.

**`VCC` is the positive power terminal.** The sensor can accept both 3.3V and 5V power input. So any pin on the Arduino will be suitable as a power source. I used the `3.3V` power pin to get started.

**`GND` is the negative power terminal.** Look for `GND` on the Arduino, or alternatively you can set any pin as a negative terminal.

**`SIG` is the moisture reading.** The sensor outputs a signal based on two main factors: the input voltage and the moisture level of the soil. It should be hooked up to an analog pin in order to read the signal properly. In my photos and code samples I used analog `A0` pin to read the signal.

{% include gallery.html gallery=page.gallery %}

Once everything is connected you are ready to program the Arduino!

## Talking to plants

The code to get a reading is delightfully simple. Just initialize the `A0` pin as an input then do an `analogRead()`  to monitor the signal. Opening the [Arduino IDE serial plotter](/blog/arduino-serial-plotter-debugging/) will show you a real-time reading of your soil moisture.

```clike
const int soil = A0;

void setup() {
  pinMode(soil, INPUT);

  // initialize serial plotter
  Serial.begin(9600);
}

void loop() {
  // read value and send to plotter
  Serial.println(analogRead(soil));

  delay(50);
}
```

If you want to change the frequency of readings, adjust the `delay()` time.

One cool surprise: while looking at the plotter, I touched the plant and the signal changed. My body's electricity flowed through the plant, the dirt, and also the sensor! I definitely did not expect that to happen so it was fun to play around with the plotter signal to confirm that it was really happening.

## Adapting code for long-term use

The way this sensor is normally used, it's left embedded and a reading is taken every so often, e.g. once an hour. Powering the Arduino long-term is no problem, but [the docs for this sensor](https://cdn.sparkfun.com/datasheets/Sensors/Biometric/SparkFun_Soil_Moisture_Sensor.pdf) (PDF, 98KB) recommend that you only send power to the sensor when actively taking a reading of the soil moisture. Powering only during these short moments helps avoid corrosion caused by the constant flow of electricity between the two pads of the sensor.

To control whether the sensor receives power, you'll need to avoid using the 3.3V or 5V pins. Instead use a digital pin for power. Using a digital pin allows you to send temporary bursts of power to the sensor by controlling it in code. I moved my positive wire from the `3.3V` power pin to digital `12` pin.

Here is a new program which takes a reading once every minute. Change the `TIMER` variable to control the number of seconds between readings.

```clike
// Define our pins.
const int soil = A0;
const int power = 12;

// Define our timer.
const int TIMER = 60; // in seconds
const int RESET = TIMER - 1;
const int SENSOR_DELAY = 10; // in milliseconds
int counter;


void setup() {
  pinMode(soil, INPUT);
  pinMode(power, OUTPUT);

  // Start with sensor OFF
  digitalWrite(power, LOW);

  // Setup timer.
  counter = RESET;

  // Setup serial plotter.
  Serial.begin(9600);
}


void loop() {
  // If the counter is at the end of a cycle
  // take a new reading and reset counter.
  if (counter <= 0) {
    // Turn sensor ON and wait a moment.
    digitalWrite(power, HIGH);
    delay(SENSOR_DELAY);

    // Take reading, send to plotter.
    Serial.println(analogRead(soil));

    // Turn sensor OFF again.
    digitalWrite(power, LOW);

    // Start new countdown.
    counter = RESET;
  }

  // If counter isn't at the end yet, pause for
  // the same amount of time as if the sensor
  // had been activated to keep things in sync.
  else {
    delay(SENSOR_DELAY);
  }

  // Decrement counter and delay until next second.
  counter--;
  delay(1000 - SENSOR_DELAY);
}

```

The main program loop has a counter that starts at 59 and counts down to 0. When it reaches 0, it takes a reading and resets the counter. By only powering the moisture sensor for 10 milliseconds out of every minute, we are significantly delaying corrosion caused by excessive current.

Run the program, [open the Arduino IDE serial plotter](/blog/arduino-serial-plotter-debugging/), and go make yourself a tea. After a few minutes you should have your first few readings!

## Building on this sensor

After getting your first successful reading, the next step is to display the data somehow. This could be an LED display, notifications on your phone, or even a self-watering system that dispenses a few drops of water when the plant is in need of a drink. The sky's really the limit so use your imagination!
