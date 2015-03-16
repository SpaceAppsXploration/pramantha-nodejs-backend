
var Router         = require('express').Router;
var logging        = require('../utils/logging');
var globals        = require('../utils/globals');
var utils          = require('../utils/utils');
var ObjectID       = require('mongodb').ObjectID;
var exporterDocs   = require('./space/exporter-docs');
var exporterMiss   = require('./space/exporter-missions');
var exporterTgts   = require('./space/exporter-targets');
var exporterEvents = require('./space/exporter-events');
// var parametizer = require('./concepts/parametizer');

/*
* CACHE
 */

var DBPEDIADOCS_CACHE = null;
var EVENTS_CACHE = null

module.exports = function(config, opts) {

  var router         = Router();
  var logger         = logging.createLogger({name: '/space', type: 'route'});
  var collection     = opts.db.collection('base');
  var exportDocs     = exporterDocs(config, {collection: collection});
  var exportMiss     = exporterMiss(config, {collection: collection});
  var exportTgts     = exporterTgts(config, {collection: collection});
  var exportEvents   = exporterEvents(config, {collection: collection});
  // var parametize = parametizer(config, {collection: collection});

  router.use(function(req, res, next) {
    res.set('Content-Type', 'application/json');
    return next();
  });

  router.get('/', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
     res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts-entry.jsonld'});
     return res.send({
       welcome: "This is the Space API. You can explore resources in Chronos KB: >",
       missions: config.baseUrl + '/space/missions',
       dbpediadocs: config.baseUrl + '/space/dbpediadocs',
       targets: config.baseUrl + '/space/targets',
       events: config.baseUrl + '/space/events'
     });
  });

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
    //logger.info(DBPEDIADOCS_CACHE)
    return DBPEDIADOCS_CACHE != null ? res.send(DBPEDIADOCS_CACHE) : collection.find(query, function(errFind, cursor) {
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
          DBPEDIADOCS_CACHE = exported;
          return res.send(exported);
        });
      });
    });
  });

  router.get('/dbpediadocs/:label', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'dbpediadocs',
      'skos:altLabel': utils.regexpifyLabel(utils.decodeLabel(req.params.label))
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

  router.get('/targets', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'targets',
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
        return exportTgts(data, function(errExport, exported) {
          if (errExport) {
            res.sendStatus(500);
            return logger.error(errExport);
          }
          return res.send(exported);
        });
      });
    });
  });

  router.get('/targets/:label', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'targets',
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
      return exportTgts(doc, function(errExport, exported) {
        if (errExport) {
          res.sendStatus(500);
          return logger.error(errExport);
        }
        return res.send(exported);
      });
    });
  });


  router.get('/events', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'events',
      // 'chronos:relKeyword._id': {'$exists': true}
    };
    var options = {'limit': 300}; // query are limited to 300 to not create TIMEOUT errors in the server
    return EVENTS_CACHE != null ? res.send(EVENTS_CACHE) : collection.find(query, {}, options, function(errFind, cursor) {
      if (errFind) {
        res.sendStatus(500);
        return logger.error(errFind);
      }
      return cursor.toArray(function(errToArray, data) {
        if (errToArray) {
          res.sendStatus(500);
          return logger.error(errToArray);
        }
        return exportEvents(data, function(errExport, exported) {
          if (errExport) {
            res.sendStatus(500);
            return logger.error(errExport);
          }
          EVENTS_CACHE = exported;
          return res.send(exported);
        });
      });
    });
  });

  router.get('/events/:label', function(req, res, next) {
    res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
    res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
    var query = {
      'chronos:group': 'events',
      '@id': 'http://api.pramantha.net/data/events/' + req.params.label
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
      return exportEvents(doc, function(errExport, exported) {
        if (errExport) {
          res.sendStatus(500);
          return logger.error(errExport);
        }
        return res.send(exported);
      });
    });
  });

  return router;

};

