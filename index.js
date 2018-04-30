// Node/npm deps
var express = require('express');
var port = process.env.PORT || 5000;
var fs = require('fs');
var helmet = require('helmet');
var enforce = require('express-sslify');
var compression = require('compression');
var { Pool } = require('pg');
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
var DATABASE_WEBMENTIONS = process.env.DATABASE_WEBMENTIONS || 'test_webmentions';
var Microformats = require('microformat-node');
var fetch = require('node-fetch');

// Initialize app
var app = express();

// Default settings
//   @see https://helmetjs.github.io/docs/
app.use(helmet());

// HTTP header: Strict Transport Security
var hsts_days = 90;
app.use(helmet.hsts({
  maxAge: (hsts_days * 60 * 60 * 24 * 1000),
  includeSubdomains: true,
  preload: true
}));

// HTTP header: contentSecurityPolicy
app.use(helmet.contentSecurityPolicy({
  // Policy for chrisruppel.com
  directives:  {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'", "*.mapbox.com", "*.twitter.com", "*.twimg.com", "codepen.io", "*.codepen.io", "analytics.chrisruppel.com", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc:   ["'self'", "*.mapbox.com", "*.twitter.com", "*.twimg.com", "'unsafe-inline'"],
    imgSrc:     ["'self'", "*.mapbox.com", "*.twitter.com", "*.twimg.com", "assets.chrisruppel.com", "analytics.chrisruppel.com", "data:", "blob:"],
    connectSrc: ["'self'", "*.mapbox.com", "*.twitter.com", "*.twimg.com", "assets.chrisruppel.com"],
    fontSrc:    ["'self'", 'data:'],
    objectSrc:  ["youtube.com", "youtube-nocookie.com"],
    mediaSrc:   ["youtube.com", "youtube-nocookie.com"],
    frameSrc:   ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "codepen.io"],
    sandbox:    ['allow-scripts', 'allow-same-origin', 'allow-popups'],
  },

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

// Allow processing of HTML content when receiving webmentions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static Jekyll site
app.use(express.static(__dirname + '/_site'));

// Legacy redirects.
// app.get('/OLD_URL', function(req, res){ res.redirect(301, '/NEW_URL'); });
app.get('/portfolio/', function(req, res){ res.redirect(301, '/work/'); });

// Webmentions: Get all mentions for an entry
app.get('/webmentions/get/', async function (req, res) {
  try {
    if (req.query.target !== 'undefined') {
      const client = await pool.connect();
      const result = await client.query(
        `SELECT * FROM ${DATABASE_WEBMENTIONS} WHERE target=$1;`,
        [req.query.target]
      );
      res.status(200);
      res.send(result.rows);
      client.release();
    }
    else {
      throw new Error('target parameter was missing');
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send(`${err}`);
  }
});

// Webmentions: receive new webmentions
app.post('/webmentions/post/', async function (req, res) {
  try {
    if (req.body.source !== 'undefined' && req.body.target !== 'undefined') {
      const source = await fetch(req.body.source);
      const html = await source.text();
      const options = {};
      options.html = html;
      options.filter = ['h-entry'];

      // Parse source URL for microformats
      Microformats.get(options, async function(err, mf) {
        try {
          // Determine if source contains target
          var sourceContainsTarget = html.indexOf(req.body.target) !== -1;

          // If target was found, add to DB. The microformats are optional
          if (sourceContainsTarget) {
            var wmContent = mf.items[0].properties.content[0].value || '';
            var wmWho = mf.items[0].properties.author[0].value || 'someone';
            var wmAt = mf.items[0].properties.published[0] || 'NOW()';

            // Attempt DB insert.
            const client = await pool.connect();
            const result = await client.query(
              `INSERT INTO ${DATABASE_WEBMENTIONS} (target, source, who, at, content) VALUES ($1, $2, $3, $4, $5);`,
              [req.body.target, req.body.source, wmWho, wmAt, wmContent]
            ).catch(function () {
              throw new Error('Duplicate source URL: ' + req.body.source);
            });
            client.release();
          }
        } catch (err) {
          console.log(`${err}`);
        }
      });

      res.status(202);
      res.send();
    }
    // When the request didn't meet our requirements, send 400 BAD REQUEST.
    else {
      console.error(err);
      res.status(400);
      res.send();
    }
  }
  // When something went wrong with our code, send 500 INTERNAL ERROR.
  catch (err) {
    console.error(err);
    res.status(500);
    res.send();
  }
});

// 404 page — Generated by Jekyll
app.use(function(req, res, next) {
  res.status(404);
  res.sendFile(__dirname + '/_site/404/index.html');
});

// Listen for traffic
console.log('Express is listening for traffic on port ' + port);
app.listen(port);
