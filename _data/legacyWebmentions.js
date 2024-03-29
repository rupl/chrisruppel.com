// These were originally in a postgres DB that I maintained myself. When I tried
// to import them into webmention.io it didn't go well, and I got a lot of
// false negatives where it claimed the URLs didn't meet requirements for a
// proper webmention. So they've been reformatted to match the output of WM.io
// so that the two datasets can be merged on each build.
module.exports = [
  {
    'wm-id': 1,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/receiving-webmentions/',
    'wm-source': 'https://rupl.github.io/webmention-test/notes/6-receiving-webmentions.html',
    name: 'Receiving Webmentions',
    content: {
      text: 'My site is finally able to receive webmentions! This is a test reply from a GitHub Pages site just to show what it can look like with a reply that uses microformats.',
    },
    author: {
      type: 'card',
      name: 'Chris Ruppel',
      url: 'https://rupl.github.io/webmention-test/',
      photo: '',
    },
    published: '2018-04-30T21:36:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 11,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content/',
    'wm-source': 'https://adactio.com/links/14301',
    name: 'Offline Content with Service Worker — Chris Ruppel',
    content: {
      text: 'Offline Content with Service Worker — Chris Ruppel September 1st 2018 A step-by-step walkthrough of a really useful service worker pattern: allowing users to save articles for offline reading at the click of a button',
    },
    author: {
      type: 'card',
      name: 'Jeremy Keith',
      url: 'https://adactio.com/',
      photo: '',
    },
    published: '2018-09-01T16:51:22',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 2,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content/',
    'wm-source': 'https://una.im/save-offline/',
    name: '',
    content: {
      text: '',
    },
    author: {
      type: 'card',
      name: 'Una Kravets',
      url: 'https://una.im/',
      photo: '',
    },
    published: '2017-01-26T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 10,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/progressive-web-app-drupal/',
    'wm-source': 'https://realize.be/repost/1511',
    name: 'PWA for D7',
    content: {
      text: 'The PWA module for Drupal now has a Drupal 7 release nice!',
    },
    author: {
      type: 'card',
      name: 'realize.be',
      url: 'https://realize.be',
      photo: '',
    },
    published: '2018-07-19T15:39:04',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 3,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content/',
    'wm-source': 'https://github.com/pazguille/offline-first',
    name: '',
    content: {
      text: '',
    },
    author: {
      type: 'card',
      name: 'Guille Paz',
      url: '',
      photo: '',
    },
    published: '2016-06-07T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 4,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content-list/',
    'wm-source': 'https://github.com/pazguille/offline-first',
    name: '',
    content: {
      text: '',
    },
    author: {
      type: 'card',
      name: 'Guille Paz',
      url: '',
      photo: '',
    },
    published: '2016-10-11T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 5,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/arduino-soil-moisture-sensor/',
    'wm-source': 'https://bitknitting.wordpress.com/2017/07/',
    name: 'Moisture Puck – Firmware Evolved with Better Power Management',
    content: {
      text: 'One thing I noticed that was like “oh – right – duh” was the moisture sensor was being powered by the 3.3V pin of the Feather m0.  It was on all the time.  As noted by Chris Ruppel in his “Arduino soil moisture sensor” blog post, only send power to the sensor when actively taking a reading of the soil moisture. Powering only during these short moments helps avoid corrosion caused by the constant flow of electricity between the two pads of the sensor.',
    },
    author: {
      type: 'card',
      name: 'bitknitting',
      url: 'https://bitknitting.wordpress.com/',
      photo: '',
    },
    published: '2017-07-03T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 6,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/matomo-analytics/',
    'wm-source': 'https://adactio.com/journal/13853',
    name: 'Alternative analytics',
    content: {
      text: 'Contrary to the current consensual hallucination there are alternatives to Google Analytics. I haven’t tried Open Web Analytics. It looks a bit geeky but the nice thing about it is that you can set it up…',
    },
    author: {
      type: 'card',
      name: 'Jeremy Keith',
      url: 'https://adactio.com/',
      photo: '',
    },
    published: '2018-05-08T17:23:28',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 7,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/matomo-analytics/#comment-6',
    'wm-source': 'https://brid-gy.appspot.com/comment/twitter/adactio/993923206095560704/993946687398957057',
    name: '',
    content: {
      text: 'yup that\'s the one! plus the test your webmentions entry. Glad you found my write-up useful even if Matomo wasn\'t the right fit for you. I do like some of its GA-ish features especially client-side event…',
    },
    author: {
      type: 'card',
      name: 'Chris Ruppel',
      url: 'https://chrisruppel.com',
      photo: '',
    },
    published: '2018-05-08T20:12:11',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 8,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/easy-riders-day-1/',
    'wm-source': 'http://easyrider-tours.com/vietnam-easy-riders-day-1-nov-25-2015-in-da-lat-vietnam/',
    name: '',
    content: {
      text: '',
    },
    author: {
      type: 'card',
      name: 'easyrider-tours.com',
      url: 'http://easyrider-tours.com',
      photo: '',
    },
    published: '2018-05-12T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 48,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/brave-rewards-github-pages/',
    'wm-source': 'https://frogpoet.github.io/',
    name: '',
    content: {
      text: '',
    },
    author: {
      type: 'card',
      name: 'frogpoet',
      url: 'https://frogpoet.github.io',
      photo: '',
    },
    published: '2019-04-23T01:10:17',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 47,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/progressive-web-app-drupal/',
    'wm-source': 'https://twitter.com/rupl/status/1019938589990445056',
    name: '',
    content: {
      text: '🎉 Very proud to announce the #PWA module for #Drupal 7. Almost one million sites can now enjoy offline support and be added to homescreen',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/1019938589990445056',
      photo: '',
    },
    published: '2018-07-19T13:34:03',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 53,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/arduino-soil-moisture-sensor/',
    'wm-source': 'https://twitter.com/rupl/status/820955689367601152',
    name: '',
    content: {
      text: 'Talking to plants',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/820955689367601152',
      photo: '',
    },
    published: '2017-01-16T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 46,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/progressive-web-app-drupal/',
    'wm-source': 'https://twitter.com/drupal/status/1022806591488372737',
    name: '',
    content: {
      text: 'Discover how to enhance your existing #Drupal site with drop-in support for Progressive Web App functionality @rupl',
    },
    author: {
      type: 'card',
      name: '@drupal',
      url: 'https://twitter.com/drupal/status/1022806591488372737',
      photo: '',
    },
    published: '2018-07-27T13:31:43',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 45,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/progressive-web-app-drupal/',
    'wm-source': 'https://twitter.com/nazroll/status/1024216694003097601',
    name: '',
    content: {
      text: 'Progressive Web Apps for Drupal 7 sites',
    },
    author: {
      type: 'card',
      name: 'Nazrul Kamaruddin',
      url: 'https://twitter.com/nazroll/status/1024216694003097601',
      photo: '',
    },
    published: '2018-07-31T10:54:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 51,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/css-animation-border-radius/',
    'wm-source': 'https://twitter.com/rupl/status/787986342949089281',
    name: '',
    content: {
      text: 'Making my personal site more fun with border-radius and CSS animation',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/787986342949089281',
      photo: '',
    },
    published: '2016-10-17T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 50,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/debug-nonsecure-localhost-with-proxy/',
    'wm-source': 'https://twitter.com/rupl/status/740553359451639809',
    name: '',
    content: {
      text: 'I made a walkthrough for the least popular option network proxy',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/740553359451639809',
      photo: '',
    },
    published: '2016-06-08T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 52,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/lilypad-arduino-light-sensor-pulse-width-modulation/',
    'wm-source': 'https://twitter.com/rupl/status/809100980432289796',
    name: '',
    content: {
      text: '',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/809100980432289796',
      photo: '',
    },
    published: '2016-12-14T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 56,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/receiving-webmentions/',
    'wm-source': 'https://twitter.com/rupl/status/991259412621873153',
    name: '',
    content: {
      text: 'I now have self-hosted #webmentions on my site! It was a huge milestone for me because not only am I part of #indieweb but it allowed me to remove the last 3rd-party tracker from my codebase 🎉',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/991259412621873153',
      photo: '',
    },
    published: '2018-05-01T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 54,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/brave-payments/',
    'wm-source': 'https://twitter.com/rupl/status/923858036673966080',
    name: '',
    content: {
      text: 'Let me convince you that Brave Payments are the future of sustainable web publishing',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/923858036673966080',
      photo: '',
    },
    published: '2017-10-27T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 55,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/brave-payments-github-pages/',
    'wm-source': 'https://twitter.com/rupl/status/940925878518861827',
    name: '',
    content: {
      text: 'Got a slide deck or open-source tool on gh-pages? Collect Brave Payments using your root repo (http://YOU.github.io) — great way to earn a little extra while publishing freely-available content. Quick howto:',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/940925878518861827',
      photo: '',
    },
    published: '2017-12-13T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 57,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/visitors-in-freiburg/',
    'wm-source': 'https://twitter.com/rupl/status/649233730838659072',
    name: '',
    content: {
      text: '🌍 I had fun showing some friends from @FourKitchens little Freiburg:',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/649233730838659072',
      photo: '',
    },
    published: '2015-09-18T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 58,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/paris-with-emily/',
    'wm-source': 'https://twitter.com/rupl/status/651545255083380737',
    name: '',
    content: {
      text: 'Visiting my cousin Emily in Paris before heading to Bangkok. Now featuring photospheres compliments of @helior',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/651545255083380737',
      photo: '',
    },
    published: '2015-10-05T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 59,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/wat-pho/',
    'wm-source': 'https://twitter.com/rupl/status/653502973306232832',
    name: '',
    content: {
      text: '🌏 We visited Wat Pho purely by accident yesterday. It\'s unbelievably beautiful!',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/653502973306232832',
      photo: '',
    },
    published: '2015-10-12T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 60,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/chiang-mai-thailand/',
    'wm-source': 'https://twitter.com/rupl/status/656721689280012288',
    name: '',
    content: {
      text: '🌏 bye bye Chiang Mai! Next stop is the jungle somewhere',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/656721689280012288',
      photo: '',
    },
    published: '2015-10-20T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 63,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/longson-mui-ne/',
    'wm-source': 'https://twitter.com/rupl/status/669010393784696832',
    name: '',
    content: {
      text: '🌏 Beach time!',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/669010393784696832',
      photo: '',
    },
    published: '2015-11-24T04:31:17',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 62,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/big-knob-cave-lodge/',
    'wm-source': 'https://twitter.com/rupl/status/657949594668568577',
    name: '',
    content: {
      text: '🌏 Our first hike at Cave Lodge was up to a local mountain called Big Knob. Includes GPS plot of our hike!',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/657949594668568577',
      photo: '',
    },
    published: '2015-10-24T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 61,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/cave-lodge-thailand/',
    'wm-source': 'https://twitter.com/rupl/status/657836623594262528',
    name: '',
    content: {
      text: '🌏 We\'re at Cave Lodge the best home base for adventures in all of Thailand!',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/657836623594262528',
      photo: '',
    },
    published: '2015-10-24T00:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 64,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/ha-long-bay-vietnam/',
    'wm-source': 'https://twitter.com/rupl/status/675354232803880961',
    name: '',
    content: {
      text: 'Fell for our first major scam today thanks to some turd in Halong Bay. Had a fun day anyway so that guy can stick my dông wherever he wants',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/675354232803880961',
      photo: '',
    },
    published: '2015-12-11T04:39:17',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 85,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/resonate-music-streaming-coop/',
    'wm-source': 'https://twitter.com/rupl/status/1291380048377806849',
    name: '',
    content: {
      text: 'I joined @resonatecoop yesterday. I never signed up for any music streaming until now but this is the real deal. There\'s great music up there and this really feels like what the internet is supposed to be!',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/1291380048377806849',
      photo: '',
    },
    published: '2020-08-06T14:26:22',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 65,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/travel/blue-fire-kawah-ijen-java/',
    'wm-source': 'https://twitter.com/rupl/status/695638291220008960',
    name: '',
    content: {
      text: '🌏 We saw some serious nature yesterday: a sulphur-powered blue-flame volcano',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/695638291220008960',
      photo: '',
    },
    published: '2016-02-05T04:01:34',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 78,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/progressive-web-app-drupal/',
    'wm-source': 'https://twitter.com/chdugue/status/1023228502403948545',
    name: '',
    content: {
      text: 'Un module pour faciliter la conception d\'une #PWA avec #Drupal ? http://bit.ly/2vdBFwp - encore instable.',
    },
    author: {
      type: 'card',
      name: '@chdugue',
      url: 'https://twitter.com/chdugue/status/1023228502403948545',
      photo: '',
    },
    published: '2018-07-28T16:27:01',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 66,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/css-animation-border-radius/',
    'wm-source': 'https://twitter.com/css/status/811634604457230336',
    name: '',
    content: {
      text: 'Randomized border-radius animations',
    },
    author: {
      type: 'card',
      name: '@css',
      url: 'https://twitter.com/css/status/811634604457230336',
      photo: '',
    },
    published: '2016-12-21T18:09:10',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 67,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/css-transforms-level2-translate-scale-rotate/',
    'wm-source': 'https://twitter.com/keithjgrant/status/786935389210697730',
    name: '',
    content: {
      text: 'A look at the upcoming CSS transform shorthand properties: translate rotate & scale – @rupl',
    },
    author: {
      type: 'card',
      name: '@keithjgrant',
      url: 'https://twitter.com/keithjgrant/status/786935389210697730',
      photo: '',
    },
    published: '2016-10-14T15:23:55',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 68,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/css-animation-border-radius/',
    'wm-source': 'https://twitter.com/e4h/status/814488737354760192',
    name: '',
    content: {
      text: 'Creating irregular shapes with CSS border-radius',
    },
    author: {
      type: 'card',
      name: '@e4h',
      url: 'https://twitter.com/e4h/status/814488737354760192',
      photo: '',
    },
    published: '2016-12-29T13:10:07',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 69,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/arduino-humdity-temperature-lcd/',
    'wm-source': 'https://twitter.com/rupl/status/870265926054236160',
    name: '',
    content: {
      text: 'Prep work for our urban greenhouse installation at @HSBLivingLab',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/870265926054236160',
      photo: '',
    },
    published: '2017-06-01T12:09:17',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 70,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/css-animation-border-radius/',
    'wm-source': 'https://twitter.com/andybudd/status/810799043546845184',
    name: '',
    content: {
      text: 'Nice article by @rupl on using border radius to create a wobbly border effect.',
    },
    author: {
      type: 'card',
      name: '@andybudd',
      url: 'https://twitter.com/andybudd/status/810799043546845184',
      photo: '',
    },
    published: '2016-12-19T10:48:47',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 71,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content/',
    'wm-source': 'https://twitter.com/rngala/status/1038261405424726017',
    name: '',
    content: {
      text: 'Learn how to add content to the Service Worker cache at the request of the visitor and then serve it offline.',
    },
    author: {
      type: 'card',
      name: '@rngala',
      url: 'https://twitter.com/rngala/status/1038261405424726017',
      photo: '',
    },
    published: '2018-09-08T04:03:02',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 72,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/lilypad-arduino-biking-jacket/',
    'wm-source': 'https://twitter.com/rupl/status/822395504881373185',
    name: '',
    content: {
      text: 'the LilyPad is so great! My latest project:',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/822395504881373185',
      photo: '',
    },
    published: '2017-01-20T10:49:33',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 73,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/brave-payments/',
    'wm-source': 'https://twitter.com/SamuelSnopko/status/924167665773633536',
    name: '',
    content: {
      text: 'Really interesting concept to avoid ads on web.. @rupl thx for pointing out 😉 @brave',
    },
    author: {
      type: 'card',
      name: '@SamuelSnopko',
      url: 'https://twitter.com/SamuelSnopko/status/924167665773633536',
      photo: '',
    },
    published: '2017-10-28T07:55:21',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 49,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/picture-prefers-color-scheme-dark/',
    'wm-source': 'https://twitter.com/rupl/status/1133674548228972545',
    name: '',
    content: {
      text: 'Combine &amp;lt;picture&amp;gt; with prefers-color-scheme media query',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/1133674548228972545',
      photo: '',
    },
    published: '2019-05-29T10:01:34',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 74,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content-list/',
    'wm-source': 'https://twitter.com/rupl/status/790556526658330624',
    name: '',
    content: {
      text: '@davatron5000 @jaffathecake cache works even without SW installed. here\'s how I\'m doing it atm',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/790556526658330624',
      photo: '',
    },
    published: '2016-10-24T03:12:56',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 75,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content/',
    'wm-source': 'https://twitter.com/rlnorthcutt/status/739846819967045632',
    name: '',
    content: {
      text: 'Offline Content with Service Worker',
    },
    author: {
      type: 'card',
      name: '@rlnorthcutt',
      url: 'https://twitter.com/rlnorthcutt/status/739846819967045632',
      photo: '',
    },
    published: '2016-06-06T16:50:48',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 76,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/progressive-web-app-drupal/',
    'wm-source': 'https://twitter.com/thejimbirch/status/1021075151591477248',
    name: '',
    content: {
      text: 'Progressive Web Apps for all Drupal sites #Drupal',
    },
    author: {
      type: 'card',
      name: '@thejimbirch',
      url: 'https://twitter.com/thejimbirch/status/1021075151591477248',
      photo: '',
    },
    published: '2018-07-22T17:51:46',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 77,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/service-worker-offline-content/',
    'wm-source': 'https://twitter.com/huguesbrunelle/status/1040952633454985217',
    name: '',
    content: {
      text: 'Contenu hors-ligne avec un Service Worker',
    },
    author: {
      type: 'card',
      name: '@huguesbrunelle',
      url: 'https://twitter.com/huguesbrunelle/status/1040952633454985217',
      photo: '',
    },
    published: '2018-09-15T14:17:08',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 79,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/arduino-analog-signal-input-smoothing/',
    'wm-source': 'https://chrisruppel.com/blog/arduino-analog-signal-input-smoothing/',
    name: 'Arduino analog signals and input smoothing',
    content: {
      text: 'Stabilize inconsistent analog input signals with input smoothing. Some basic math operations help us collect more reliable data.',
    },
    author: {
      type: 'card',
      name: 'Chris Ruppel',
      url: 'https://chrisruppel.com',
      photo: '',
    },
    published: '2017-01-30T12:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 86,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/arduino-automated-greenhouse/',
    'wm-source': 'https://chrisruppel.com/blog/arduino-automated-greenhouse/',
    name: 'Building an automated greenhouse with Arduino',
    content: {
      name: 'Learning to program Arduino in the open. Building a small automated greenhouse using sensors and hobbyist-grade electronic components.',
    },
    author: {
      type: 'card',
      name: 'Chris Ruppel',
      url: 'https://chrisruppel.com',
      photo: '',
    },
    published: '2017-06-02T12:00:00',
    'wm-property': 'mention-of',
    'wm-private': false,
  },
  {
    'wm-id': 88,
    type: 'entry',
    'wm-target': 'https://chrisruppel.com/blog/brave-rewards/',
    'wm-source': 'https://twitter.com/rupl/status/923858036673966080',
    name: '',
    content: {
      text: 'Let me convince you that @Brave Payments are the future of sustainable web publishing',
    },
    author: {
      type: 'card',
      name: '@rupl',
      url: 'https://twitter.com/rupl/status/923858036673966080',
      photo: '',
    },
    published: '2021-02-25T10:31:44',
    'wm-property': 'mention-of',
    'wm-private': false,
  }
];
