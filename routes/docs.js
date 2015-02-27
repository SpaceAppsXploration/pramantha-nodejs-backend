
var Router  = require('express').Router;
var config  = require('../config');
var jsonld  = require('../jsonld');

var router  = Router();

router.get('/api', function(req, res, next) {
  res.set('Content-Type', 'application/ld+json');
  return res.send(jsonld.documentation.api);
});

module.exports = router;