
var express = require('express');
var _       = require('underscore');
var path    = require('path');
var fs      = require('fs');

module.exports = function(config, opts) {

  var router = express.Router();
  var dir    = path.join(__dirname, '..', 'contexts');
  var cache  = {};

  router.get('/:filename', function(req, res, next) {
    var filename = req.params.filename;
    var cached   = cache[filename];
    var pathname = path.join(dir, filename);
    if (cached) {
      return res.end(cached);
    } else {
      return fs.exists(pathname, function(exists) {
        if (!exists) {
          return res.status(404).end();
        }
        return fs.readFile(pathname, 'utf8', function(readErr, data) {
          if (readErr) {
            logger.error(readErr);
            return res.status(500).end();
          }
          data = cache[filename] = _.template(data)(config);
          res.set('Content-Type', 'application/ld+json');
          return res.end(data);
        });
      });
    }
  });

  return router;

}
