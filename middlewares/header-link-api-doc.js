
var config = require('../config');

module.exports = function() {
  return function (req, res, next) {
    res.links({
      'http://www.w3.org/ns/hydra/core#apiDocumentation':  config.baseUrl + '/docs/api'
    });
    return next();
  }
}