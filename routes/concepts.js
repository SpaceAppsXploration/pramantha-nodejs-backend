
var Router      = require('express').Router;
var logging     = require('../utils/logging');
var globals     = require('../utils/globals');
var utils       = require('./concepts/utils');
var ObjecId     = require('mongodb').ObjectId;
var exporter    = require('./concepts/exporter');
var parametizer = require('./concepts/parametizer');

module.exports = function(config, opts) {

  var router     = Router();
  var logger     = logging.createLogger({name: 'concepts', type: 'route'});
  var collection = opts.db.collection('base');
  var exportt    = exporter(config, {collection: collection});
  var parametize = parametizer(config, {collection: collection});

  router.use(function(req, res, next) {
    res.set('Content-Type', 'application/json');
    return next();
  });

  router.get('/', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts-entry.jsonld'});
    return res.send({
      welcome: "This is the Concepts API (thanks to NASA-STI\'s Subjects and Categories) >",
      collection: {
          "doc": "Surf the hierarchical taxonomy for space concepts.",
          "url": config.baseUrl + '/concepts/c'
      },
      root: {
          "doc": "Start from root.",
          "url": config.baseUrl + '/concepts/root',
          "note": "not deployed yet"
      } //,
      //schemes: config.baseUrl + '/concepts/schemes',
      //scopes: config.baseUrl + '/concepts/scopes'
    });
  });

  router.get('/c', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      '$or': [
        {'chronos:group': 'divisions'},
        {'chronos:group': 'keywords'},
        {'chronos:group': 'subjects'}
      ]
    };
    return parametize(query, req, function(errParametize, query) {
      if(errParametize) {
        logger.error(errParametize);
        return res.sendStats(500);
      }
      return collection.find(query, function(errFind, cursor) {
        if (errFind) {
          return next(errFind);
        }
        return cursor.toArray(function(errToArray, data) {
          if (errToArray) {
            return next(errToArray);
          }
          return exportt(data, function(errExport, exported) {
            if (errExport) {
              logger.error(errExport);
              return res.sendStatus(500);
            }
            return res.send(exported);
          });
        });
      });
    });
  });

  router.get('/c/:label', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    res.links({'describedBy': config.baseUrl + '/contexts/bum.jsonld'});
    var query = {
      '$or': [
        {'chronos:group': 'divisions'},
        {'chronos:group': 'keywords'},
        {'chronos:group': 'subjects'}
      ],
      'skos:prefLabel': utils.genRegexpFromURIString(req.params.label)
    };
    return collection.findOne(query, function(errFind, doc) {
      if (errFind) {
        return next(errFind);
      }
      if (!doc) {
        return res.status(404).end();
      }
      
      return exportt(doc, function(errExport, exported) {
        if (errExport) {
            logger.error(errExport);
            return res.sendStatus(500);
          }
          return res.send(exported);
      });
    });
  });

  return router;

}