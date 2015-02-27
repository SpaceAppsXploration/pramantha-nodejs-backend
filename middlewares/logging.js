
var logger = process.app.get('logger');

module.exports = function(opts) {
  return function(req, res, next) {
    var then = Date.now();
    res.on('finish', function() {
      var code = res.statusCode;
      var now  = Date.now();
      if (code >= 300 && code < 400) {
        logger.trace('%s redirect to %s!', code, res.getHeader('Location'));
      }
      return logger.info('%s %s %s (%sms)', req.method, req.url, code, now - then);
    });
    return next();
  }
}