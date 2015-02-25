
var debug = require('debug')('pramantha:logging');

module.exports = function(opts) {
  return function(req, res, next) {
    var then = Date.now();
    res.on('finish', function() {
      var now = Date.now();
      return debug('%s %s %s (%sms)', req.method, req.url, res.statusCode, now - then);
    });
    return next();
  }
}