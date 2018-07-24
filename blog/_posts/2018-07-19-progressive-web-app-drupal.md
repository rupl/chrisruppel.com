---
title: Progressive Web Apps for all Drupal sites

summary: Announcing a new Drupal module that enhances your existing site with drop-in support for Progressive Web App functionality.

tags:
- drupal
- javascript
- pwa
- service worker
---

Announcing a new Drupal module: [Progressive Web App](https://www.drupal.org/project/pwa)!

As the name suggests, it brings foundational aspects of a Progressive Web App (PWA) to any Drupal 7 site. With [almost one million Drupal 7 sites](https://www.drupal.org/project/usage/drupal) out there, the module aims to bring modern mobile functionality in the form of:

* **Offline support** — the module provides a modest Service Worker which adapts automatically to your Drupal site, providing an offline experience with very little configuration needed.
* **Add to Homescreen** — the module also provides a `manifest.json` with all the required metadata to warrant the homescreen prompt.

If that sounds interesting to you, go try the [PWA Drupal module](https://www.drupal.org/project/pwa). Or continue reading for more tech details.


## PWA precaching

The Service Worker is not too different from "my first SW" implementations, but we integrated it with Drupal's backend to provide it with some superpowers. Namely, with regards to precaching.

Typically any SW tutorial will have a block of code like this:

```js
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open('my-cache').then(function (cache) {
    return cache.addAll([
      /* an array of specific assets you'd like to cache */
    ]);
  });
});
```

In pretty much any CMS, knowing that array's contents ahead of time is a tall order. Especially if you're following best-practices for Drupal frontend performance and enabling CSS/JS aggregation to bundle your assets efficiently, which produces hashed filenames that are impossible to predict. 

Offering visibility to the Service Worker wasn't an option, so we went the other way and added a step to the server-side cache-clearing process which prepopulates the Service Worker with known assets by internally requesting the URLs you whitelist and extracting assets out of the DOM, then assembling them in the pre-cache automatically.

That means the `install` event should have a reasonable chance of caching a  usable page including CSS and JS, while only requiring a site admin to specify a list of URLs they want cached like so:

```
/
/about
/offline
```

All credit for this interesting solution goes to [Théodore "nod_" Biadala](https://read.theodoreb.net/2016/progressive-web-apps-for-the-masses.html) for his initial work in 2016 on this module.

## PWA `fetch` listener

If the pre-caching doesn't cover everything, the visitor's next few page loads will continue populating the cache using `staleWhileRevalidate` strategy, storing the latest copy of a file each time it's fetched.

Both the `install` and `fetch` listener use the `no-cors` mode to fetch assets, making it friendly to third-party requests. This means it can cache assets on your primary domain in addition to CDNs like Google Fonts.

Additionally, the `fetch` listener checks for the [`Save-Data` header](https://wicg.github.io/netinfo/#save-data-request-header-field), and avoids caching images when it is present. Data usage comes in many forms and while we don't provide server integration for the header, we try to respect it by not consuming too much cache space.


## Additional Service Worker features

For now, and probably the life of PWA 1.0, the Service Worker won't do a lot more than cache the assets you request by browsing around on the site.

We have intentionally avoided implementing more advanced features like push notifications and background sync, preferring to leave those to a dedicated module (see the [Future Plans](#future-plans) section below).


## Add to Homescreen

The module also provides a `manifest.json` with all the required metadata to permit the [Add to Homescreen](https://developer.mozilla.org/en-US/Apps/Progressive/Add_to_home_screen) prompt in eligible browsers. Although the goalposts for this prompt vary over time, the main two factors are a Service Worker and the manifest file.

Site admins can configure most of the manifest from the administration UI in Drupal. What can't be configured at the time of writing are the icons, but there's a Drupal hook in place to facilitate customizations of any metadata, including the icons. A brief example taken from our [official PWA API docs](https://cgit.drupalcode.org/pwa/tree/pwa.api.php?h=7.x-1.x):

```php
/**
 * Implements hook_pwa_manifest_alter().
 *
 * @param array &$manifest metadata for manifest.json
 */
function mytheme_pwa_manifest_alter(&$manifest) {
  // Change a string-based property.
  $manifest['theme_color'] = variable_get('mytheme_primary_color', '#0678BE');

  // Manually specify which icons will appear in the manifest.
  $manifest['icons'] = [
    [
      'src' => url(drupal_get_path('theme', 'mytheme') . '/assets/logo-512.png'),
      'sizes' => '512x512',
      'type' => 'image/png',
    ],
    [
      'src' => url(drupal_get_path('theme', 'mytheme') . '/assets/logo-192.png'),
      'sizes' => '192x192',
      'type' => 'image/png',
    ],
  ];
}
```

The nice part about this is that _any module in your website_ can make modifications to the manifest. The code sample above can be implemented in any Drupal module or theme to provide customizations while allowing other parts of the site the chance to modify or provide extra metadata.

I have seen manifests hardcoded into particular contrib themes, but that deters customization and makes modifications difficult. Often people might customize a file that comes with a theme, but the changes get overwritten the next time an update is downloaded. Other times, multiple modules/themes try to provide the manifest file and conflict with each other.

Offering a centralized API means that multiple modules and themes can co-exist by supplying only the metadata they require, and releasing control of the other metadata to the site admin.


## Measuring the impact of PWA Drupal module

While developing the module we took care to ensure that a website which already has a valid HTTPS connection should receive a very high [Lighthouse PWA Audit score](https://developers.google.com/web/tools/lighthouse/).

My hope is that we can continue keeping up with industry expectations for _Add to Homescreen_ and ensure that Drupal sites have an easy way to achieve it without maintaining extensive frontend knowledge.


## Leave no trace

The main bug that held up the official module release was **self-uninstallation of the Service Worker**. Since the SW takes over requests (and in some browsers) could live on forever, having a leftover influence on a website that no longer needs or wants the Service Worker can be a nuisiance at least and catastrophic at worst.

There are many reasons why a Service Worker might no longer be wanted but I'll list a few of the most common situations generated during our discussion about self-uninstallation:

* The contrib module is uninstalled
* The site is migrated to a new Drupal site without the module
* The site is migrated to a new CMS or tech stack entirely
* A domain is sold or otherwise transferred to a new owner

Particularly when the module itself is uninstalled, we shouldn't be leaving leftover Service Workers that have an influence on site behavior. Uninstalling a Drupal module means its functionality should go away. Completely.

I'm happy to report we [resolved this issue](https://www.drupal.org/project/pwa/issues/2913023) before shipping 1.0 and you can confidently install the module on a website with the expectation that uninstalling the module will also remove the SW from each visitor's browser whenever they return to your site, no matter how far in the future they return.


## Future plans

As I mentioned before, the PWA module will aim to work out of the box with minimal configuration. Hopefully by making this module available we can gather more data about how Drupal sites are used and provide more support for other Web Platform features when it makes sense to do so. If you have any questions or suggestions feel free to [file an issue on drupal.org](https://www.drupal.org/project/issues/pwa?text=&status=Open&priorities=All&categories=All&version=7.x&component=All).

There is work being done on a [Drupal 8 version of PWA](https://www.drupal.org/project/issues/pwa?text=&status=Open&priorities=All&categories=All&version=8.x&component=All), as well as a [Drupal 8 core issue to add a manifest.json](https://www.drupal.org/project/drupal/issues/2698127) (along with a similar API for making alterations).

If you'd like to get involved building a more advanced [Service Worker Drupal API](https://www.drupal.org/project/serviceworker) that would also be swell.
