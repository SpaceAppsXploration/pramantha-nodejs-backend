
var Router  = require('express').Router;
var debug   = require('debug')('pramantha:skos:subjects');

var router  = Router();
var mongodb = process.app.get('mongodb');

router.get('/', function(req, res, next) {
  return mongodb.collection('base').find({"chronos:group": "subjects"}, function(errFind, cursor) {
    if (errFind) {
      return next(errFind);
    }
    return cursor.toArray(function(errToArray, array) {
      if (errToArray) {
        return next(errToArray);
      }
      return res.send(array);
    });
  });
});

router.get('/:label', function(req, res, next) {
  var label = decodeURIComponent(req.params.label.trim().toLowerCase().replace(/\+/ig, ' '));
  var query = {
    "chronos:group": "subjects",
    "skos:prefLabel": label
  };
  debug('Looking for subjects with skos:prefLabel %s', label);
  return mongodb.collection('base').findOne(query, function(errFind, doc) {
    if (errFind) {
      return next(errFind);
    }
    if (doc) {
      return res.send(doc);
    } else {
      return res.status(404).end();
    }
  });
});

module.exports = router;