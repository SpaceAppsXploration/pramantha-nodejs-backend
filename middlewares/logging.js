
var logging = require('../utils/logging');
var logger  = logging.createLogger({name: 'logger', type: 'middleware'});

module.exports = function(opts) {
  return function(req, res, next) {
    var then = Date.now();
    var url  = req.url;
    res.on('finish', function() {
      var code = res.statusCode;
      var now  = Date.now();
      var ct   = res.get('Content-Type');
      ct = ct ? ct.split(';')[0] : '';
      if (code >= 301 && code < 304) {
        logger.trace('%s redirect to %s!', code, res.getHeader('Location'));
      }
      return logger.info('%s %s %s (%sms) %s', req.method, url, code, now - then, ct);
    });
    return next();
  }
}