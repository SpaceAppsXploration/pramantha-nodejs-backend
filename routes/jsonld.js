
var Router  = require('express').Router;
var config  = require('../config');
var jsonld  = require('../jsonld');

var router  = Router();

router.get('/:slug', function(req, res, next) {
  res.set('Content-Type', 'application/ld+json');
  var doc = jsonld[req.params.slug];
  if (doc) {
    res.send(doc);
  } else {
    res.status(404).end();
  }
});

module.exports = router;