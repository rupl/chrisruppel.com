var fs = require('fs');
var map = require('map-stream');
var togeojson = require('@mapbox/togeojson');
var DOMParser = require('xmldom').DOMParser;

var toGeoJson = function() {
  return map(function(file, cb) {
    var gulpError = false;

    try {
      var kml = new DOMParser().parseFromString(fs.readFileSync(file.path, 'utf8'));
      var converted = togeojson.kml(kml);
      file.contents = new Buffer(JSON.stringify(converted));
    } catch (err) {
      gulpError = err;
    }

    cb(gulpError, file);
  });
};

module.exports = toGeoJson;
