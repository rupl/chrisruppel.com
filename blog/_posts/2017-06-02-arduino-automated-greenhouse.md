---
title: Building an automated greenhouse with Arduino

summary: Learning to program Arduino in the open. Building a small, automated greenhouse using sensors and hobbyist-grade electronic components.

tags:
- arduino
- electronics
- gardening
---

My friend [Afra](http://afranoubarzadeh.se/) invited me to participate in a conference in Sweden involving sustainable urban greenhouse solutions. <em lang="sv">[Så Ett Frö](http://saettfro.com/vaxthus/)</em> (_Plant a Seed_) is a collaboration with [HSB Living Lab](https://www.hsb.se/hsblivinglab/), a 10-year-long experiment which uses technology to help build more sustainable housing building.

My job was to automate a small greenhouse using my budding Arduino skills. The main objective of <em lang="sv">Så Ett Frö</em> is education amongst grades 7-9. So for now we haven't spent time calculating economic value or carbon footprint. Future iterations will hopefully allow us to tackle these engineering issues which will make the greenhouse more sustainable.

## Building the frame

We know our strengths and working with wood wasn't one of them. Luckily Afra has a friend who is quite talented working with wood, so in an afternoon while we [debugged the LCD](/blog/arduino-humdity-temperature-lcd/), he was building the frame of our greenhouse. He used scrap wood from HSB Living Lab, and some used plexiglass that Afra obtained from the city that would have been thrown away.

In the end it was approximately 80x60x80 centimeters, roughly the shape of a classic PC tower. One of the small sides has a hinged door and all other entry points were created by drilling holes in either the plastic or notches in the wood.

## Arduino components

We used the following sensors to collect data from the greenhouse:

- [Air temperature/humidity sensor](/blog/arduino-humdity-temperature-lcd/)
- [Soil moisture sensor](/blog/arduino-soil-moisture-sensor/)

We planned to use the following components to control the environment in the greenhouse:

- Arduino Uno R3
- Peristaltic water pump
- LED lamps
- Ventilation fan
- Photosensor (future)
- Real-time clock module (future)
- Solar panels (future)
- <abbr title="liquid crystal display">LCD</abbr> for real-time data reporting

**Arduino is the center of the automation system.** It receives all the sensor data and responds by controlling most of the components.

**The water pump provides plants with water.** The watering is triggered by the soil moisture sensor, which can detect when the soil has become too dry. The pump can be quite small, and only has to run for very short periods of time to provide water to the plants. Unfortunately even a small pump requires an external power supply, because the Arduino can't handle the load of the motor when converted from 5V to 12V.

**The LED lamps provide a supplement to sunlight energy.** Of course, if there's sunlight available then it's preferential, but LED lamps can help out when the sun isn't shining as many hours during winter in places up north like Sweden. Ideally, we would use photosensors to detect light conditions instead of relying on timed schedules, but in cases where we only detect a few hours of light per day, the real-time clock can help guide the Arduino to turn LED lamps on for a few extra hours to hit a target light cycle.

**Ventilation fans help regulate air temperature and humidity.** Plants need air with CO<sub>2</sub> to grow properly, and their "waste" is good for humans to breathe. So it's nice to stir up the air every once in a while. This is something that could possibly be handled by enclosure design rather than a fan, reducing the energy footprint. But for our prototype, we included the fan since it was a simple solution.

**Real-time clock module helps keep regular schedules.** Arduinos cannot reliably keep time, so a small module with its own coin battery helps provide some continuity in cases where the Arduino momentarily loses power or receives code updates necessitating a reboot. We didn't include the clock in our prototype this time, but it's good to keep in mind for the future.

**Solar panels would ideally power the entire system.** Ensuring that the greenhouse is not using grid energy is one of the most important goals of creating a sustainable solution. If the system requires more energy than a reasonably sized solar panel the responsible solution is to reduce our energy consumption, rather than increase panel size. A battery would be required as well, but we haven't made any progress on integrating the panel yet, so this is a problem we'll tackle in the future.

**An <abbr title="liquid crystal display">LCD</abbr> allows someone to check conditions of the greenhouse.** While technically optional, it allows a novice grower to check on conditions and determine if changes need to be made to the system. It was also an appealing interactive component to our prototype since it was on display at a public event.

## Building manual

Now in its second year, <em lang="sv">Så Ett Frö</em> is accumulating knowledge by requiring that a manual be written once students are done building. The sharing of knowledge is the actual seed being planted!

Here's the [manual from the first year](http://saettfro.com/vaxthus/index.html), which includes detailed parts lists and instructions for how to build the entire structure.
