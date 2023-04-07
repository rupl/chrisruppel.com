module.exports = function() {
  const prod = process.env.ELEVENTY_ENV === 'production';

  return {
    'name': 'Chris Ruppel',
    'mode': prod ? 'prod' : 'debug',
    'url': prod ? 'https://chrisruppel.com' : 'http://localhost:8080',
    'img-host': prod ? 'https://assets.chrisruppel.com' : '',
    'license-url': 'https://github.com/rupl/chrisruppel.com/blob/main/LICENSE.md',
    'mapboxToken': process.env.MAPBOX_TOKEN,
    'webmention-url': 'https://webmention.io/chrisruppel.com/webmention',
    'webmention-token': process.env.WEBMENTION_IO_TOKEN,
    'array': [],
  };
};
