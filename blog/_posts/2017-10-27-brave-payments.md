---
title: Brave Payments

summary: Brave offers a new compensation model for web publishing. Instead of relying on third-party advertising, sites can be paid directly by visitors using digital currency.

gallery:
- gridtype: col-2
- src: brave-payments-1.png
  alt:
  type: wide
  bgpad: 65%
- caption: Screenshot of my Brave Payments settings, activated with a monthly budget of 50 BAT. Sites are listed according to how much of my budget they receive.

syndication:
- type: Twitter
  href: https://twitter.com/rupl/status/923858036673966080

tags:
- ads
- blockchain
- browsers
- privacy
- tracking
---

I'm a web developer so I've known for years how extensively individuals are tracked on the web. For a long time I assumed it was a necessary evil, but as tracking is revealed to be more and more extensive, enough is enough.

I have been using Brave for all of my regular browsing for months now. I first switched on my phone due to the massive speed improvement that comes with blocking JS and tracking. Their Shields settings make it extremely convenient to block first, and whitelist only when the content is really worth it.

As I got more accustomed to browsing the web without JS, I switched my desktop browser as well. It was an even bigger improvement! However, most websites these days will tell you they "need to show you ads" to exist, typically using invasive interstitials that are even worse than ads. Way to miss the point.

These sites just shrug off an increasingly important societal issue and justify their individual existences without considering the net effect. Luckily Brave have been working towards fixing the bigger problem in the form of **Brave Payments**.


## Brave ad replacement

I really want to focus on the Payments part, so if you're interested in the bigger picture you can read the [official roadmap for Brave ad replacement](https://www.brave.com/about-ad-replacement/). In a nutshell this is their plan to transition the web off of third-party ads:

1. Block third-party ads and tracking by default.
2. Opt-in to Brave Ads when a third-party component is blocked. When you view Brave Ads, you get paid a small portion of the proceeds from the ad sale.
3. Opt-in to Brave Payments and directly route your earnings back to publishers. You can also add additional funds to your BAT wallet to ensure payouts happen monthly.


## Basic Attention Token

Powering this new system is an [Ethereum-based token called <abbr title="Basic Attention Token">BAT</abbr>](https://basicattentiontoken.org/). Attention is quantified by Brave preferences, and is configurable by you!

- you choose which sites are included in your whitelist
- number of seconds viewing tab before attention is logged
- number of revisits before inclusion on whitelist

These simple metrics are applied to your browsing to create the payout list for each month. Combined with the monthly budget of your choosing, the time on each site is reported, and they receive their share of your budget. At the time of writing the configuration is simple, but more options can always be created. You are even free to suggest other options, since [Brave is open source](https://github.com/brave/).

Take a look at my payments screen for October. As long as you keep a balance in your wallet, it will automatically make payments each month:

{% include gallery.html gallery=page.gallery %}

As you can see, I spent a significant portion of my time this month learning Vue. Brave recognizes this and both CSS Tricks and the vue.js website will receive the _lion's share_ of my budget, provided they register with [Brave Publishers](https://brave.com/publishers/) to receive payments.

As a developer using open source software, I quite like the idea that documentation sites, which normally receive zero compensation from casual users, can start to receive some income from the barrage of traffic they get for offering popular, free resources on the web. I wrote up a quick guide to [verify Brave Payments on any GitHub Pages domain](/blog/brave-payments-github-pages/), which is very frequently used by open source projects to publish their docs.


## Better than 3rd-party advertising?

As a web developer with many years' experience deploying 3rd-party ads on an otherwise nice website, I am so excited to give this a try. I spent years advocating for frontend performance, and was [rewarded with clients](/work/) who sought to use my skills... only to cannibalize the performance gains by adding ever-greedier ads and tracking. It really made the work seem pointless at times.

Furthermore, without straying too far into the details, there is such a strong, pervasive negative side to ads that I feel that people are better off without them. The crappy UX of ad overload, battery drain on phones, security complications from third parties, privacy concerns, and psychological implications of immoral ads are a few major concerns I have.

A browser which actively blocks them by default will return some control to regular users who don't have time or expertise to install extensions and harden their personal security. And allowing people to set their own compensation budget makes for a more honest market whose value is derived from supply/demand instead of inflated startup valuations or over-competitive keyword bidding.

Finally, there's the issue of free, ad-supported services turning their users into the product. By blocking malicious trackers and directly paying websites, we skip the middleman. Unlike plain ad-blockers, which offer nothing to publishers in place of the blocked ads, Brave users can pay out of pocket. Now the publisher gets paid, the user is no longer the product, and content is once again king.


## How is privacy preserved?

Improving privacy, the most concerning of the above-listed issues, is a major goal of the Brave team. The way they preserve your privacy is by moving much of the machinery that is normally done by third parties (like Google) into Brave itself.

Normally when you view a website which features Google AdWords, during the page load there is a bidding process that occurs. Depending on what you searched for to arrive on the page, and what other advertisers have bid on certain keywords, Google determines which ads it will show you. But in the process it passes a lot of your personal information along to these bidders. Your page load is earning multiple people money, and you pay with your attention instead of directly with money. You actually do pay with money via battery energy and mobile data plan, but that's not related to the privacy issue.

Brave Ads prevent this ad brokering process between multiple outside parties from happening, and instead moves the process so it lives inside the browser itself. So your viewing habits are not shared with anyone, even Brave. 

Containing this process to the browser also means that someone with enough knowledge and know-how can customize their ad-brokering process. In the future I think we'll see this, with additional preferences available in the browser for what type of ads you want to promote or restrict. Again this is similar to today's Google ad prefs, but strictly within your control, and not used for additional tracking purposes.


## Sustainable self-publishing

Organizations who choose not to invade our lives with ads must always struggle to financially support their endeavor. The annual donation drive for Wikipedia is a well-known example. Just think, if every person browsing Wikipedia pitched in a few cents each month, I have no doubt their financial position would be much better.

Brave Payments isn't just designed for high-traffic websites, but also for small, independent publishers. As time goes on, we see larger and larger chunks of the web surrender their publishing process to walled gardens like Facebook and Twitter. I've also enjoyed these services for the reach they provide, and others have embraced these large social networks for the revenue that comes with increased exposure. It's almost too easy, so people surrender control of their content in the name of convenience.

However, the web was meant to be decentralized. Each person can control their own identity, content, discussions, and so forth. A personal domain name is the key upon which it all rests.

Brave Payments will put pressure on content creators to truly own their content. It's quite simple: unless you own the domain where the content is hosted, nobody can pay you! So if you're the type who writes long-form text on Medium, then Medium will collect your payments, not you. As it becomes more popular, Brave Payments will apply an ever-stronger financial incentive to decentralize content once again.


## Ok I'm sold, how do I start?

Eventually there will be two ways to fill your Brave wallet. One is to simply view Brave ads, but in reality this will not earn you a significant amount until the system is orders of magnitude more popular. Plus, the compensation mechanism is scheduled for a later release.

For now, you can fill your wallet by turning some fiat (USD, EUR, etc) into a popular cryptocurrency, and then sending it to your Brave wallet. As of October 2017 any of the currencies on Coinbase can be used to fund your Brave wallet. Just open the browser preferences, go to Payments section, and start by clicking the orange _Add funds..._ button to see your options.

Be aware that cryptocurrency requires some education to really grasp. There are many security and privacy issues that must be understood to protect your funds. Consider reading about them before converting a significant amount of money into digital currency. Converting a few bucks to try Brave Payments is not so risky, so if this is your first time buying don't overdo it.

Once you're up and running, come back to this page and re-read this article using Brave as your way of saying thanks 😊
