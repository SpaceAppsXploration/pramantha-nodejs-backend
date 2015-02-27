
var config = require('../config');

module.exports = function() {
  return function (req, res, next) {
    res.set('Link', [
      config.baseUrl + '/documentation; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
      config.baseUrl + '/context; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    ].join(',\n'));
    return next();
  }
}