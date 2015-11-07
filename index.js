// Node/npm deps
var express = require('express');
var port = process.env.PORT || 5000;
var enforce = require('express-sslify');
var compression = require('compression');

// Initialize app
var app = express();

// Forse HTTPS on Heroku
app.use(enforce.HTTPS({trustProtoHeader: true}));

// Compress all responses
app.use(compression());

// Serve the static Jekyll site
app.use(express.static(__dirname + '/_site'));

// Listen for traffic
console.log('Express is listening for traffic.');
app.listen(port);
