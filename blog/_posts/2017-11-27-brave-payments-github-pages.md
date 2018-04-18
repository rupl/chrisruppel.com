---
title: Collecting Brave Payments on GitHub Pages

summary: Brave offers a new compensation model for web publishing, but people often publish on subdomains they don't directly control. Learn how to verify your USER.github.io domain with Brave Publishers.

syndication:
- type: Twitter
  href: https://twitter.com/rupl/status/940925878518861827

tags:
- browsers
- privacy
- ads
---

I'm a big fan of [Brave Payments](https://brave.com/publishers), a system I think will revolutionize how content is monetized on the web, bringing privacy and independence to a system that's currently dominated by a couple of big players.

If you've never heard of it, [read my take on Brave Payments](/blog/brave-payments).

## Publishing on GitHub Pages

I'm a web developer so publishing to my own blog is a time-honored tradition. But there are many tools available that often make publishing so easy and headache-free, it's often more convenient to use them. Other times it might even be in the best interest of your visitors to provide a URL other than a personal domain.

A good example is GitHub Pages, which let you create a static website for any repository hosted on GitHub. The hosting is free, reliable, and provides near instant updates. The URL structure is dictated by the repository name as follows:

<pre><code class="language-none"># Pattern:
https://github.com/<strong style="color: #ff33bb">USER</strong>/<strong style="color: #ff9911">REPO-SLUG</strong>/
https://<strong style="color: #ff33bb">USER</strong>.github.io/<strong style="color: #ff9911">REPO-SLUG</strong>/

# Real example:
https://github.com/<strong style="color: #ff33bb">rupl</strong>/<strong style="color: #ff9911">unfold</strong>/
https://<strong style="color: #ff33bb">rupl</strong>.github.io/<strong style="color: #ff9911">unfold</strong>/
</code></pre>

This simple convention allows anyone to find a GitHub Pages site if they know the repository URL (and it indeed exists). The most common use-case is providing docs and demos for open-source software.

However, there are other uses. People use GitHub Pages as a blogging service, and in my case I often develop and publish slide decks on GitHub Pages to accompany presentations at conferences. Since the slide decks get considerably more traffic than my personal blog, I thought I'd try to register for Brave Payments.

## Verify your content on GitHub Pages

Brave supports two methods of verification. One is based on DNS, but in this case the individual users don't control DNS, only GitHub can do that. We need to use the other method: uploading a file to prove we own the subdomain.

### Step 1: Register with Brave Publishers

Register your subdomain by following the instructions at the [Brave Payments portal](https://publishers.basicattentiontoken.org/). In this case you'll want to register `YOU.github.io` as the domain, where `YOU` is your GitHub username.

They will guide you through some account setup, then give you the choice of either DNS or file upload verification. We're using the file upload method.

### Step 2: Create root GitHub Pages site

GitHub allows people who [create a repo with the name `USER.github.io`](https://pages.github.com/#user-site) to control the root of their GitHub Pages space. It's static website hosting, so you can place files in any directory you want.

Create a repo called `YOU.github.io`. When I created mine, I also added an index file so casual visitors will have something to look at. If you've previously created the repository, then just continue to the next step.

### Step 3: Add Brave Payments verification file

Add a directory called `.well-known` — including the dot at the beginning — to the top-level of the repository. In the directory, put the file you received from Brave Publishers portal. It will only contain a few lines of text. Here is an example, but do NOT copy this text, you MUST use the unique file Brave provides you:

```none
This is a Brave Payments publisher verification file.

Domain: YOU.github.io
Token: 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

Make sure the file is named `brave-payments-verification.txt`

### Step 4: Bypass Jekyll

This step is optional, depending on your setup. In my case, I wanted bare-bones output so I added a `.nojekyll` file to [bypass Jekyll on GitHub Pages](https://github.com/blog/572-bypassing-jekyll-on-github-pages).

If you use your repository as an actual blog, you probably want to continue using Jekyll, and will instead need to add `.well-known` to your `_config.yml` as an included directory. [See docs for Jekyll config](https://jekyllrb.com/docs/configuration/).

### Step 5: wait for verification

Hopefully after a day or two, you'll see the verified publisher icon next to your site in the Brave interface. Congrats! You're helping create a more sustainable web by opting out of third-party advertising in favor of direct, private micro-payments for your content.

## Example repo

If you'd like to see a real example, look at my repository for [`rupl.github.io`](https://github.com/rupl/rupl.github.io).
