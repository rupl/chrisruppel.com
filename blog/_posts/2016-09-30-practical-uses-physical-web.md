---
title: Practical uses for the Physical Web

tags:
- physical web
- service worker

summary: A glimpse of practical uses for Physical Web beacons that can benefit everyone.
---

The [Physical Web](https://google.github.io/physical-web/) is an exciting movement to me. The thought of being able to discover URLs simply by walking around is quite enticing.

## Practical Physical Web

Most examples I've seen on the web are quite cool, but lack "real-world" application. For instance, being able to control <abbr title="Internet of Things">IoT</abbr> devices, LED arrays, broadcasting one's own Twitter handle at a conf, and so forth.

Instead of the crazy nerdy stuff, I want to speculate about how the Physical Web will help normal folks on a day-to-day basis. The [Physical Web FAQ](https://google.github.io/physical-web/faq) has a few good examples in its first entry, but there are so many more. As with so many web development topics, a context I always start with is the restaurant business.

## Restaurants

Over the years when I have conducted <abbr title="Responsive Web Design">RWD</abbr> training, we relied on a restaurant use-case to help drive home content prioritization (among other things). Instead of a huge picture of steak plus an outdated PDF of the menu, we encouraged folks to place the most immediately and frequently asked questions in the top of the content hierarchy: opening hours, location, and menu. 

The Physical Web lets us take it one step further since we have extra information about the person: **we know they are standing at the storefront**. We know this because Physical Web beacons only operate when the user is approximately 10m away. That takes care of location and opening hours, leaving one common want: the menu.

Using a Physical Web beacon, a person can instantly have the menu as soon as they arrive. While not always necessary, it's nice to be able to browse for a second and decide on either sticking out the wait.

Or, if they're committed to eating here already, there could be a queueing system built into this beacon. Using a Service Worker, a simple sign-up could ping you when your number is up with a push notification. No more of those strange vibrating coasters they hand out at every restarant!

## Museums

Another great place for Physical Web beacons is museums. No matter the subject, museums typically have numerous placards detailing the history, function, or meaning of the particular item you're viewing in the exhibit.

I live in Freiburg, Germany. We have a relatively large tourist pull compared to the city's modest size, so many of the public information cards are displayed in four languages. Or if not translated directly they are accompanied by a QR code for the other languages besides German. Having scanned a few of these codes, I know from experience that they contain bare bones plain-text translations. Sometimes they're even word for word, which  makes for a terrible translation. At best it's awkward.

What if we could offload all the translation to an online service and have people just look at one unified URL, which can take the user's default phone language and translate it automatically? Now, in a place where one is a tourist, lack of network connectivity might be hindering. But for many museums this isn't a problem. And the sheer scale of a large museum means the payoff for an automatic localization system makes the idea much more enticing.

## Queueing at an office

I am a frequent visitor to the <em lang="de">Ausländerbehördeamt</em> (Immigration Office) in Freiburg. In late 2015 this went from being a mildly pleasant experience to a major time-suck, due to the tremendous influx of refugees.

Now, they have much more pressing issues than me, so I push any feelings of impatience as far out of my mind as possible and just wait my turn to be helped. But it really is inefficient having people show up as early as 7am just so they have to wait as long as four hours to be helped. The cap is often set at 80 numbers per day. The instructions at the machine are in German only.

People often wait a few hours and decide their place in line is not worth it. Or they have a job to attend, a kid to pick up from school, etc. So all of us foreigners who are all barely able to speak German coherently have to sit and wait while the staff works out that a particular number really has vacated their place in line.

Wouldn't it be nice if you could queue with your phone? Just like the museum placards, all instructions could be localized to your preferred language. And if the beacon detects you've disappeared for too long, it can just inform the queueing system? Add a cookie, and you could come and go as you pleased. The page could even give a rough estimate based on the average velocity so you know when to show up again.

## Endless uses

These are just a few examples off the top of my head based on real-world problems I experience. Can you think of any?
