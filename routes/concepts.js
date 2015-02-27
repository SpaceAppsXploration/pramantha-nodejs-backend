
var Router  = require('express').Router;
var utils   = require('../utils/concepts');
var globals = require('../globals');
var logging = require('../logging');
var config  = require('../config');

var router     = Router();
var mongodb    = process.app.get('mongodb');
var collection = mongodb.collection('base'); 
var logger     = logging.createLogger({name: 'concepts', type: 'route'});

router.use(function(req, res, next) {
  res.set('Link', [
    '<' + config.baseUrl + '/jsonld/documentation>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"; type="application/ld+json"',
    '<' + config.baseUrl + '/jsonld/context-concept>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
  ].join(', '));
  res.set('Content-Type', 'application/json');
  return next();
});

router.get('/', function(req, res, next) {
  var query = {
    '$or': [
      {'@type': globals.RDF_CONCEPT_CLASS_URI},
      {'@type': globals.RDF_KEYWORD_CLASS_URI}
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
      return res.send(utils.setConceptAtIds(data));
    });
  });
});

// router.get('/', function(req, res, next) {
//   return collection.findOne({"chronos:group": "STI"}, function(errFind, doc) {
//     if (errFind) {
//       return next(errFind);
//     }
//     if (doc) {
//       return res.redirect(303, config.baseUrl + '/concepts/' + doc['skos:prefLabel']);
//       // return res.send(doc);  
//     } else {
//       return res.status(404).end();
//     }
//   });
// });

router.get('/:label', function(req, res, next) {
  var query = {
    '$or': [
      {'@type': globals.RDF_CONCEPT_CLASS_URI},
      {'@type': globals.RDF_KEYWORD_CLASS_URI}
    ],
    'skos:prefLabel': utils.regexifyConceptLabel(req.params.label)
  };
  return collection.findOne(query, function(errFind, doc) {
    if (errFind) {
      return next(errFind);
    }
    if (!doc) {
      return res.status(404).end();
    }
    return res.send(utils.setConceptAtIds(doc));
  });
});

router.get('/:label/ancestor', function(req, res, next) {
  var query = {
    '$or': [
      {'@type': globals.RDF_CONCEPT_CLASS_URI},
      {'@type': globals.RDF_KEYWORD_CLASS_URI}
    ],
    'skos:prefLabel': utils.regexifyConceptLabel(req.params.label)
  };
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
      if (!broader) {
        return res.status(404).end();
      }
      var location = config.baseUrl + '/concepts/' + encodeURIComponent(broader['skos:prefLabel']);
      // res.set('Content-Location', location);
      // res.send(broader);
      return res.redirect(303, location);
    });
  });
});

router.get('/:label/children', function(req, res, next) {
  var query = {
    '$or': [
      {'@type': globals.RDF_CONCEPT_CLASS_URI},
      {'@type': globals.RDF_KEYWORD_CLASS_URI}
    ],
    'skos:prefLabel': utils.regexifyConceptLabel(req.params.label)
  };
  return collection.findOne(query, function(errFind, doc) {
    if (errFind) {
      return next(errFind);
    }
    if (!doc) {
      return res.status(404).end();
    }
    return utils.getNarrowerConcepts(doc, collection, function(errGetBroader, narrower) {
      if (errGetBroader) {
        return next(errGetBroader);
      }
      if (!narrower) {
        return res.status(404).end();
      }
      return res.send(utils.setConceptAtIds(narrower));
    });
  });
});

module.exports = router;