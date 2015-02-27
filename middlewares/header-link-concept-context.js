
var config = require('../config');

module.exports = function() {
  return function (req, res, next) {
    res.links({
      'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concept'
    });
    return next();
  }
}