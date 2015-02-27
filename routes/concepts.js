
var Router  = require('express').Router;
var utils   = require('../utils');
var globals = require('../globals');
var logging = require('../logging');

var router     = Router();
var mongodb    = process.app.get('mongodb');
var collection = mongodb.collection('base'); 
var logger     = logging.createLogger({name: 'concepts', type: 'route'});

router.get('/', function(req, res, next) {
  var query = {
    "$or": [
      {"@type": globals.RDF_CONCEPT_CLASS_URI},
      {"@type": globals.RDF_KEYWORD_CLASS_URI}
    ]
  };
  return collection.find(query, function(errFind, cursor) {
    if (errFind) {
      return next(errFind);
    }
    return cursor.toArray(function(errToArray, data) {
      if (errToArray) {
        return next(errToArray);
      }
      return res.send(data);
    });
  });
});

router.get('/:label', function(req, res, next) {
  var query = {
    "skos:prefLabel": utils.normalizeLabel(req.params.label)
  };
  logger.trace('Looking for skos:prefLabel %s', utils.normalizeLabel(req.params.label));
  return collection.findOne(query, function(errFind, doc) {
    if (errFind) {
      return next(errFind);
    }
    if (!doc) {
      return res.status(404).end();
    }
    return res.send(doc);
  });
});

router.get('/:label/ancestor', function(req, res, next) {
  var query = {
    "skos:prefLabel": utils.normalizeLabel(req.params.label)
  };
  logger.trace('Looking for skos:prefLabel %s', utils.normalizeLabel(req.params.label));
  return collection.findOne(query, function(errFind, doc) {

    if (errFind) {
      return next(errFind);
    }

    if (!doc) {
      return res.status(404).end();
    }

    return utils.getBroaderConcept(doc, collection, function(errGetBroader, broader) {
      if (errGetBroader) {
        return next(errGetBroader);
      }
      return res.redirect('http://example.com/' + broader['skos:prefLabel']);
    });
    
  });
});

module.exports = router;