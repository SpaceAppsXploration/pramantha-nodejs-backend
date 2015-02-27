
var Router  = require('express').Router;
var globals  = require('../globals');

var router  = Router();

router.get('/', function(req, res, next) {
  res.header('Content-Type', 'application/ld+json');
  return res.send(globals.CONTEXT_CONCEPTS);
});

module.exports = router;