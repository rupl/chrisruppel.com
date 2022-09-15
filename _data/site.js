module.exports = function() {
  const prod = process.env.ELEVENTY_ENV === 'production';

  return {
    'name': 'Chris Ruppel',
    'debug': prod ? false : true,
    'development': prod ? false : true,
    'url': prod ? 'https://chrisruppel.com' : 'http://localhost:8080',
    'img-host': 'https://assets.chrisruppel.com',
    'license-url': 'https://github.com/rupl/chrisruppel.com/blob/master/LICENSE.md',
    'feedback-url': 'https://github.com/rupl/chrisruppel.com/issues/new?title=[Visitor+Feedback]+Your+title+here&body=Your+feedback+goes+here.+Thanks+for+taking+the+time+to+help+improve+my+website.&labels=Feedback',
    'mapboxToken': 'pk.eyJ1IjoicnVwbCIsImEiOiI3NDc5MWQ4ZWNjMTg1ZmZlYWQ5ZjMwMWVkNjI2MTJlZCJ9.Szn0ysZDc6AjmhKnxf8PkA',
    'webmention-url': 'https://webmention.io/chrisruppel.com/webmention',
    'webmention-token': 'iAxTpcBW1PpOtCOqHt2sBw',
    'array': [],
  };
};
