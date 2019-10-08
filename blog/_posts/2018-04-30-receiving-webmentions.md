---
title: Receiving Webmentions

summary: I've moved exclusively to Webmentions instead of using a more traditional commenting system. Respond to this entry by linking to it from your own website!

tags:
- indieweb
- privacy
- web standards
---

[Webmentions](https://webmention.net) are the "commenting system" of the IndieWeb, a set of conventions and web standards that allow more structured independent publishing on the web.

Although there's an official [W3C Recommendation](https://www.w3.org/TR/webmention/), I followed this [guide on GitHub](https://github.com/converspace/webmention/blob/master/README.md) to understand the requirements of the spec, and found some [code from Jeremy](https://adactio.com/journal/6495) to be quite helpful in helping me decide how to implement it on my own site.

My motivations for receiving Webmentions are to participate in [IndieWeb](https://indiewebify.me) and also to reduce my third-party tracking. I'd been relying on [webmention.io](https://webmention.io) to get started quickly, but they're also a third-party. By removing Disqus and replacing with self-hosted Webmentions, I have officially eliminated all 3rd party requests. Huzzah!

## My implementation

The nuts and bolts are often specific to your existing tech stack, but mine is a pretty common one for frontend developers: statically generated site, served by Express. I thought about [going with a Jekyll plugin like Lewis](https://lewisnyman.co.uk/blog/indie-web-camp-2015/), but in the end I decided to add a PostgreSQL DB to manage the Webmentions themselves, and manage them separately from my static site generator. I may want to switch generators in the future, and it's one less piece that has to be rebuilt at the time of migration.

Since I'm already using Express to serve my site, adding new endpoints is a snap. I added two routes: `webmentions/get` and `webmentions/post`. I suppose they could be combined into one but I'm a complete newbie to API design so maybe chime in below and tell me if my setup is completely daft 😁

### Endpoint for Submissions

Perhaps in the future I can get more nuanced with my logic, but for now my server can determine the following outcomes when you `POST` to the endpoint:

`202` — when the proper Header (`application/x-www-form-urlencoded`), plus a `target` and `source` are present in the Body of the request. Per the guidelines, it immediately returns the status code and does the actual processing of the submission asynchronously, as opposed to waiting until URL fetch, HTML parsing, and DB writes are finished.

`400` — when the request was well-formed, but there was a problem with the data. Most often it's because the target URL (my website) wasn't found within the HTML response of the source URL.

`500` — obviously sometimes things just go wrong. If you're [using the form](#webmentions) on my site, it will at least take responsibility for the error to avoid making visitors feel as if they've made a mistake.

In the interest of shipping a first version and not introducing too much complexity or opportunities for <abbr title="cross-site scripting">XSS</abbr>, I'm stripping HTML and only displaying plaintext versions of entries which link to my site. I relied on Glenn Jones' [microformat-node](https://github.com/glennjones/microformat-node) to parse URLs whose HTML contains `h-entry`. The library provides both structured and plaintext results so it made things safer while I get started. My <abbr title="Content Security Policy">CSP</abbr> _should_ handle many attacks, but better safe than sorry.

In the future I'd like to move to a richer format, preserving some markup or even allowing someone to choose what is displayed on my site (choose between: summary, trimmed `e-content`, or title).

To test my endpoint I used the ever-useful [Postman](https://www.getpostman.com/apps), which let me quickly assemble, edit, and save various `POST` requests to help me test the robustness of my server-side code.

### Listing my Webmentions

My `GET` endpoint simply returns an array of Webmentions for a given target. I use Jekyll to generate my site, and my include for webmentions contains the following data attribute:

```html
<div class="webmentions__list" data-webmention-target="{% raw %}{{ site.url }}{{ page.url }}{% endraw %}"></div>
```

From there I can just load the Webmentions via JS anytime that attribute is detected in the HTML, no matter the post type. You can see them below my navigation buttons at the end of each entry.

### Try it out

I'd love to see what my code can or can't handle so if you're set up to send Webmentions, give this URL a ping [using the form below](#webmentions).
