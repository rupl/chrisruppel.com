// Node/npm deps
var express = require('express');
var port = process.env.PORT || 5000;
var fs = require('fs');
var helmet = require('helmet');
var enforce = require('express-sslify');
var compression = require('compression');

// Initialize app
var app = express();

// HTTP headers: hidePoweredBy, ieNoOpen, noSniff, frameguard, xssFilter
app.use(helmet());

// HTTP header: Strict Transport Security
var hsts_days = 90;
app.use(helmet.hsts({
  maxAge: (hsts_days * 60 * 60 * 24 * 1000),
  includeSubdomains: true,
  preload: true
}));

// HTTP header: contentSecurityPolicy
app.use(helmet.csp({
  // Policy for chrisruppel.com
  defaultSrc: ["'self'"],
  scriptSrc:  ["'self'", "*.disqus.com", "*.disquscdn.com", "*.mapbox.com", "*.google-analytics.com", "*.twitter.com", "'unsafe-eval'", "'unsafe-inline'"],
  styleSrc:   ["'self'", "*.disqus.com", "*.disquscdn.com", "*.mapbox.com", "*.google-analytics.com", "*.twitter.com", "*.twimg.com", "'unsafe-inline'"],
  imgSrc:     ["'self'", "*.disqus.com", "*.disquscdn.com", "*.mapbox.com", "*.google-analytics.com", "*.twitter.com", "*.twimg.com", "chrisruppel-assets-eu1.s3.amazonaws.com", "data:"],
  connectSrc: ["'self'", "*.disqus.com", "*.disquscdn.com", "*.mapbox.com", "*.google-analytics.com", "*.twitter.com", "*.twimg.com", "chrisruppel-assets-eu1.s3.amazonaws.com"],
  fontSrc:    ["'self'", 'data:'],
  objectSrc:  ["youtube.com"],
  mediaSrc:   ["youtube.com"],
  frameSrc:   ["disqus.com"],
  sandbox:    ['allow-scripts', 'allow-same-origin', 'allow-popups'],

  // Set to true if you only want browsers to report errors, not block them
  reportOnly: false,

  // Set to true if you want to blindly set all headers: Content-Security-Policy,
  // X-WebKit-CSP, and X-Content-Security-Policy.
  setAllHeaders: false,

  // Set to true if you want to disable CSP on Android.
  disableAndroid: false,

  // Set to true if you want to force buggy CSP in Safari 5.1 and below.
  safari5: false
}));

// Redirect HTTP to HTTPS on Heroku
app.use(enforce.HTTPS({trustProtoHeader: true}));

// Compress all responses
app.use(compression());

// Serve the static Jekyll site
app.use(express.static(__dirname + '/_site'));

// Legacy redirects.
// app.get('/OLD_URL', function(req, res){ res.redirect(301, '/NEW_URL'); });
app.get('/portfolio/', function(req, res){ res.redirect(301, '/work/'); });

// Listen for traffic
console.log('Express is listening for traffic on port ' + port);
app.listen(port);
