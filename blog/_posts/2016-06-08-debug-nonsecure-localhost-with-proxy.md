---
title: Debug non-secure localhost with a proxy

tags:
- debugging
- testing
- service worker

syndication:
- type: Twitter
  href: https://twitter.com/rupl/status/740553359451639809

summary: Certain new features of the Web Platform require a secure origin, complicating local development and testing. Use a network proxy to make testing localhost on real devices easy!
---

I've been experimenting with a Service Worker on this website. Service Worker is so powerful (and potentially dangerous) that it only functions within [Secure Contexts](https://www.w3.org/TR/secure-contexts/) served over HTTPS. One of the few exceptions is `localhost` which is whitelisted to make development easier.

### localhost + real device testing

While debugging and testing the new [offline content button](https://chrisruppel.com/blog/service-worker-offline-content/) on my posts, I came to the point where I wanted to try it out on a real device instead of solely relying on browser DevTools. I've got a few devices laying around, and normally it's good enough to connect to my local IP over wifi and begin testing.

This time the Service Worked failed to register, and the error was the same in multiple browsers: the Service Worker cannot be loaded from an insecure origin.

```
// Chrome 50
DOMException: Only secure origins are allowed (see: https://goo.gl/Y0ZkNV).

// Firefox 47
DOMException [SecurityError: "The operation is insecure.", code: 18]
```


Service Worker causes that system to break down unless the development server is running HTTPS, since the host is now an IP address instead of `localhost`. I don't have HTTPS set up on my laptop, so after a few failed attempts at testing, I realized the problem and set out to work around.


### Solutions

I thought I might be missing something so I put out a Twitter poll to see how people deal with testing Service Worker on real devices. Click the date to see the poll on twitter itself:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">How does everyone else manage Service Worker testing on real devices during local development? (sans HTTPS)</p><p>&mdash; Chris Ruppel (<a href="https://twitter.com/rupl">@rupl</a>) <a href="https://twitter.com/rupl/status/738164517599739909">June 2, 2016</a></p></blockquote>

The majority of folks said that they skip out on real devices entirely, just using DevTools. The folks who said "Other" didn't reply with the method they used, so the one solution I came up with was a network proxy.

Using a network proxy is a great way to accomplish many development tasks, including traffic analysis, <abbr title="Single point of failure">SPOF</abbr> simulation, and throttling. This testing use-case is the most simple of all, since nothing is being done to the proxied traffic except the re-routing itself.

The best part about using a proxy is that it is totally technology-agnostic. This solution works for any type of phone testing any type of website. There are many browser-specific solutions, but for flexible, reliable testing across _all_ mobile platforms, a proxy is the best method.

### Set up the network proxy

My favorite proxy is [Charles](https://www.charlesproxy.com/), a very comprehensive solution that covers any normal development need. If you're looking for a longer list check an older post of mine: [Throttled Thursdays](https://fourkitchens.com/blog/article/throttled-thursdays).

Once you have a proxy, all you need to do is turn it on! Note your computer's IP and the port that Charles is listening on.

Now on your device, connect to the same wifi as your development computer and set up a **Manual HTTP proxy**.

#### Android 4 and newer

1. Select **Settings » Wi-Fi** to see a list of networks.
2. Press and hold on your desired network, and select **Modify network**.
3. Select **Advanced options**, then under HTTP Proxy select **Manual**.
4. For **Proxy hostname** enter the IP of your development machine and the **Proxy port** that Charles is configured to use.

#### iOS 7 and newer

1. Select **Settings » Wi-Fi** to see a list of networks.
2. Tap the `(i)` icon, then under HTTP Proxy select **Manual**.
3. For **Server** enter the IP of your development machine and the **Port** that Charles is configured to use.

### Get testing

Once your device is configured, you can now access `localhost` in your browser! The first time you connect the proxy, Charles will ask if you trust each new connection, but you only have to confirm this once per device. Just keep Charles running until your testing is complete.

<aside class="warning">
<p>Remember to deactivate the proxy once you want to use the device for regular activities. If Charles isn't running or you switch networks, the phone will lose all connectivity until the proxy settings are disabled.</p>
</aside>
