
var Router  = require('express').Router;
var debug   = require('debug')('pramantha:hello');

var router  = Router();
var mongodb = process.app.get('mongodb');

router.get('/', function(req, res, next) {
  mongodb.collection('ontology').findOne({}, function(errFind, data) {
    res.send(data);
  });
});

module.exports = router;