// Server
var express = require('express');
var NODE_ENV = process.env.NODE_ENV || 'local';
var PORT = process.env.PORT || 5000;
var fs = require('fs');
var helmet = require('helmet');
var enforce = require('express-sslify');
var compression = require('compression');

// DB
var { Pool } = require('pg');
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
var DATABASE_WEBMENTIONS = process.env.DATABASE_WEBMENTIONS || 'test_webmentions';

// Microformats
var Microformats = require('microformat-node');
var fetch = require('node-fetch');
var jq = require('json-query');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

// Initialize app
var app = express();

// Default settings
//   @see https://helmetjs.github.io/docs/
app.use(helmet());

// HTTP header: Strict Transport Security
if (NODE_ENV === 'production') {
  var hsts_days = 90;
  app.use(helmet.hsts({
    maxAge: (hsts_days * 60 * 60 * 24 * 1000),
    includeSubdomains: true,
    preload: true
  }));
}

// HTTP header: contentSecurityPolicy
app.use(helmet.contentSecurityPolicy({
  // Policy for chrisruppel.com
  directives:  {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'", "*.mapbox.com", "codepen.io", "*.codepen.io", "analytics.chrisruppel.com", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc:   ["'self'", "*.mapbox.com", "'unsafe-inline'"],
    imgSrc:     ["'self'", "*.mapbox.com", "assets.chrisruppel.com", "analytics.chrisruppel.com", "data:", "blob:"],
    connectSrc: ["'self'", "*.mapbox.com", "assets.chrisruppel.com"],
    fontSrc:    ["'self'", 'data:'],
    objectSrc:  ["youtube.com", "youtube-nocookie.com"],
    mediaSrc:   ["youtube.com", "youtube-nocookie.com"],
    frameSrc:   ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "codepen.io"],
    sandbox:    ['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-forms'],
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
if (NODE_ENV === 'production') {
  app.use(enforce.HTTPS({trustProtoHeader: true}));
}

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
        `SELECT * FROM ${DATABASE_WEBMENTIONS} WHERE target=$1 ORDER BY published ASC;`,
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
      const options = {
        html: html,
        textFormat: 'normalised',
      };

      // Parse source URL for microformats
      Microformats.get(options, async function(err, mf) {
        try {
          // Determine if source contains target
          var sourceContainsTarget = html.indexOf(req.body.target) !== -1;

          // If target was found, extract desired data and add to DB.
          // The microformats are optional and hopefully fall back to either an
          // empty string or a generic word. Parsing code is very likely naïve.
          if (sourceContainsTarget) {
            // Title
            var wmTitle = jq('items[type=h-entry].properties.name[0]', {data:mf}).value || '';

            // Summary
            var tmpSummary = jq('items[type=h-entry].properties.summary[0]', {data:mf}).value;
            var tmpContent = jq('items[type=h-entry].properties.content[0].value', {data:mf}).value;
            var tmpTrimmedContent = [];
            if (tmpContent !== null) {
              tmpTrimmedContent = tmpContent.split(' ');
              tmpTrimmedContent.length = (tmpTrimmedContent.length > 36) ? 36 : tmpTrimmedContent.length;
            }
            var wmSummary = (!!tmpSummary) ? tmpSummary : entities.decode(tmpTrimmedContent.join(' ') + '&hellip;');

            // Who
            var entryAuthorName = jq('items[type=h-entry].properties.author[0].properties.name[0]', {data:mf}).value;
            var entryAuthorUrl = jq('items[type=h-entry].properties.author[0].properties.url[0]', {data:mf}).value;
            var hCardName = jq('items[type=h-card].properties.name[0]', {data:mf}).value;
            var hCardUrl = jq('items[type=h-card].properties.url[0]', {data:mf}).value;
            var wmAuthorName = (!!entryAuthorName) ? entryAuthorName : (hCardName) ? hCardName : 'someone';
            var wmAuthorUrl = (!!entryAuthorUrl) ? entryAuthorUrl : (hCardUrl) ? hCardUrl : '';

            // Publish date
            var wmPubdate = jq('items[type=h-entry].properties.published[0]', {data:mf}).value || 'NOW()';

            // Attempt DB insert.
            const client = await pool.connect();
            const result = await client.query(
              `INSERT INTO ${DATABASE_WEBMENTIONS} (target, source, title, summary, author_name, author_url, published) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
              [req.body.target, req.body.source, wmTitle, wmSummary, wmAuthorName, wmAuthorUrl, wmPubdate]
            ).catch(function () {
              throw new Error('Duplicate target/source combination: \ntarget: '+ req.body.target +'\nsource: '+ req.body.source);
            });
            client.release();
          }
          else {
            var errText = `Target URL (${req.body.target}) was not found within HTML response of Source URL (${req.body.source}).`;
            console.error(errText);
            res.status(400);
            res.send(errText);
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
console.log('Express is listening for traffic on port ' + PORT);
app.listen(PORT);
