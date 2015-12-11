// Node/npm deps
var express = require('express');
var port = process.env.PORT || 5000;
var helmet = require('helmet');
var csp = require('helmet-csp');
var enforce = require('express-sslify');
var compression = require('compression');

// Initialize app
var app = express();

// HTTP headers: hidePoweredBy, hsts, ieNoOpen, noSniff, frameguard, xssFilter
app.use(helmet());

// HTTP header: contentSecurityPolicy
app.use(csp({
  // Policy for chrisruppel.com
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "*.disqus.com", "*.disquscdn.com", "*.mapbox.com", "*.google-analytics.com", "'unsafe-eval'"],
  styleSrc: ["'self'", "'unsafe-inline'", "*.disqus.com", "*.disquscdn.com", "*.mapbox.com"],
  imgSrc: ["'self'", "*.disqus.com", "*.disquscdn.com", "*.google-analytics.com", "*.mapbox.com", 'data:'],
  fontSrc: ["'self'", 'data:'],
  objectSrc: ["youtube.com"],
  mediaSrc: ["youtube.com"],
  frameSrc: ["disqus.com"],
  connectSrc: ["'self'", "*.google-analytics.com", "*.mapbox.com"],
  sandbox: ['allow-scripts', 'allow-same-origin'],

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

// Listen for traffic
console.log('Express is listening for traffic.');
app.listen(port);
