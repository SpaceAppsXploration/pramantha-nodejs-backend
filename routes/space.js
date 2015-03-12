
var Router       = require('express').Router;
var logging      = require('../utils/logging');
var globals      = require('../utils/globals');
var utils        = require('../utils/utils');
var ObjectID     = require('mongodb').ObjectID;
var exporterDocs = require('./space/exporter-docs');
var exporterMiss = require('./space/exporter-missions');
// var parametizer = require('./concepts/parametizer');

module.exports = function(config, opts) {

  var router     = Router();
  var logger     = logging.createLogger({name: 'missions', type: 'route'});
  var collection = opts.db.collection('base');
  var exportDocs = exporterDocs(config, {collection: collection});
  var exportMiss = exporterMiss(config, {collection: collection});
  // var parametize = parametizer(config, {collection: collection});

  router.use(function(req, res, next) {
    res.set('Content-Type', 'application/json');
    return next();
  });

  // router.get('/', function(req, res, next) {
  //   res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
  //   res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts-entry.jsonld'});
  //   return res.send({
  //     concepts: config.baseUrl + '/concepts/c',
  //     schemes: config.baseUrl + '/concepts/schemes',
  //     scopes: config.baseUrl + '/concepts/scopes'
  //   });
  // });

  router.get('/missions', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'missions',
      // 'chronos:relKeyword._id': {'$exists': true}
    };
    return collection.find(query, function(errFind, cursor) {
      if (errFind) {
        res.sendStatus(500);
        return logger.error(errFind);
      }
      return cursor.toArray(function(errToArray, data) {
        if (errToArray) {
          res.sendStatus(500);
          return logger.error(errToArray);
        }
        return exportMiss(data, function(errExport, exported) {
          if (errExport) {
            res.sendStatus(500);
            return logger.error(errExport);
          }
          return res.send(exported);
        });
      });
    });
  });

  router.get('/missions/:label', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'missions',
      'skos:prefLabel': utils.regexpifyLabel(utils.decodeLabel(req.params.label))
      // 'chronos:relKeyword._id': {'$exists': true}
    };
    return collection.findOne(query, function(errFind, doc) {
      if (errFind) {
        res.sendStatus(500);
        return logger.error(errFind);
      }
      if (!doc) {
        return res.sendStatus(404);
      }
      return exportMiss(doc, function(errExport, exported) {
        if (errExport) {
          res.sendStatus(500);
          return logger.error(errExport);
        }
        return res.send(exported);
      });
    });
  });

  router.get('/dbpediadocs', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'dbpediadocs',
      // 'chronos:relKeyword._id': {'$exists': true}
    };
    return collection.find(query, function(errFind, cursor) {
      if (errFind) {
        res.sendStatus(500);
        return logger.error(errFind);
      }
      return cursor.toArray(function(errToArray, data) {
        if (errToArray) {
          res.sendStatus(500);
          return logger.error(errToArray);
        }
        return exportDocs(data, function(errExport, exported) {
          if (errExport) {
            res.sendStatus(500);
            return logger.error(errExport);
          }
          return res.send(exported);
        });
      });
    });
  });

  router.get('/dbpediadocs/:id', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'dbpediadocs',
      '_id': ObjectID(req.params.id)
      // 'chronos:relKeyword._id': {'$exists': true}
    };
    return collection.findOne(query, function(errFind, doc) {
      if (errFind) {
        res.sendStatus(500);
        return logger.error(errFind);
      }
      if (!doc) {
        return res.sendStatus(404);
      }
      return exportDocs(doc, function(errExport, exported) {
        if (errExport) {
          res.sendStatus(500);
          return logger.error(errExport);
        }
        return res.send(exported);
      });
    });
  });

  return router;

}