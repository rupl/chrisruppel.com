---
title: Moving to Matomo

summary: To eliminate third-party tracking on my website I have transitioned off Google Analytics and am now using Matomo.

tags:
- privacy
- javascript
- tracking
---

Around the time I published my thoughts on [Brave Payments](/blog/brave-payments/) I realized that despite my enthusiasm for a tracking-free web, I was still relying on multiple services that tracked my visitors. How rude!

I looked around for alternatives and found Piwik, which recently rebranded to [Matomo](https://matomo.org). It's a drop-in replacement for Google Analytics, or <abbr title="Google Analytics">GA</abbr> for short. However, it's a far more private option since the data stays within my domain.

For someone like me doing casual monitoring of their site traffic, the transition is quite simple. Of course if you're doing extensive monitoring then it will be more of an endeavor, but Matomo has a rich selection of paid plugins available to provide pretty much any function that Google provides.

Here are a few of the Matomo features I found delightful.

## Self-hosted domains

I set up an instance of Matomo completely separate from my main website, since the two tech stacks were quite different. Since I'm using CloudFlare as a CDN for my site, adding a new subdomain (`analytics.chrisruppel.com`) and pointing to my Matomo instance only took a few moments to get running.

It's not limited to single sites either. You can manage multiple unrelated websites within their admin interface. I also aliased another domain of mine to use the same Matomo instance. The magic of DNS means that both sites get to use first-party subdomains while pinging one physical server.

## Respecting DNT headers

One thing GA doesn't do is respect your **Do Not Track** header.

<abbr title="Do Not Track">DNT</abbr> is a setting in many web browsers that _theoretically_ allows people to opt-out of being tracked across the web. Except it's completely optional to respect the setting, and there's no way to enforce it across the web. As a consumer of the web, the only way to protect yourself from bad actors is to use a privacy-oriented browser like [Brave](https://brave.com) or [Tor](https://www.torproject.org) and block as much as you can locally.

However, people using Matomo to collect data can be good web citizens.

With one toggle in the settings Motomo honors the DNT preference of visitors. Look in **Privacy &raquo; Users opt-out** to change the setting. With DNT support enabled, even though the script might be fetched from the server, Matomo will not log visitors' activity in its database. If you want to take it even further, there is a setting to detect DNT on the client-side and avoid making any requests to Matomo.

With GA one would have to wrap the tracking code with custom JS to check the `navigator.doNotTrack` setting before initializing. However that's a difficult ask for non-coders, and it's nice that Matomo offers the option as part of the tracking code generator.

<aside class="info">
  <p>I respect your privacy. When you enable DNT, <strong>I will not log your visit at all</strong>.</p>
</aside>

## No-JS tracking

Modern GA has no option for tracking users with JS disabled. As absurd as it seems, yes there are people who do this, including myself. The web is just a lot faster that way, especially on a phone. I use Brave to browse with JS disabled by default.

Matomo can provide a `<noscript>` containing an image tag when the user has disabled JS. It will still respect the DNT header in this mode as well.

## Event tracking

I'd been collecting a few Events within GA and transitioning to Matomo was a snap:

```js
// GA
ga('send', 'event', 'Category', 'Action', 'Label', optionalValue);

// Matomo
_paq.push(['trackEvent', 'Category', 'Action', 'Name', optionalValue]);
```

Couldn't be much more similar, right? You can [read the official Matomo docs](https://matomo.org/docs/event-tracking/) if you're also implementing event tracking and want more info.

## Data protection regulations

Coming soon to an EU near you, the <abbr title="General Data Protection Regulation">GDPR</abbr> (in Germany it's called the <abbr lang="de" title="Datenschutz-Grundverordnung">DS-GVO</abbr>) means there are stricter laws governing what data you can store about a user. They also require you to remove data at the user's request. While of course Google will comply with the regulations, they're a gigantor company and have absolutely no excuse not to.

Despite their status as a relatively small open source project, Matomo are rolling out updates to facilitate the regulations in time for the May 25<sup>th</sup> deadline. If you're a web developer and need more info, [read more about GDPR at the official website](https://www.eugdpr.org).

<ins class="update" datetime="2018-05-10"><a href="https://matomo.org/changelog/matomo-3-5-0/">Matomo 3.5.0 has just been released</a> with a suite of tools to facilitate compliance with the GDPR.</ins>

## Give Matomo a spin

There's more to Matomo than what I've highlighted here. This project has a well-defined mission and is very thorough in delivering it. Matomo should be considered for any privacy-conscious website that wants to help stop the spread of third-party tracking.

[I donated a few bucks](https://matomo.org/donate/) as a way of saying thanks. Both for their hard work and also to help support ongoing compliance with complicated data-protection regulations.
