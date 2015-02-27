
var Router  = require('express').Router;
var globals  = require('../globals');
var jsonld   = require('../jsonld');

var router  = Router();

router.get('/concept', function(req, res, next) {
  res.header('Content-Type', 'application/ld+json');
  return res.send(jsonld.contexts.concept);
});

module.exports = router;