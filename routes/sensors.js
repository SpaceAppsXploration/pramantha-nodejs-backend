/**
 * on 16/03/2015.
 * Handles /sensors
 */

var Router         = require('express').Router;
var logging        = require('../utils/logging');
var globals        = require('../utils/globals');
var utils          = require('../utils/utils');
var ObjectID       = require('mongodb').ObjectID;
var exporterSensors= require('./sensors/exporter-sensors');
// var parametizer = require('./concepts/parametizer');


module.exports = function(config, opts) {

    var router = Router();
    var logger = logging.createLogger({name: '/sensors', type: 'route'});
    var collection = opts.db.collection('sensors');
    var exportSensors = exporterSensors(config, {collection: collection});
    // var parametize = parametizer(config, {collection: collection});

    router.use(function (req, res, next) {
        res.set('Content-Type', 'application/json');
        return next();
    });

    router.get('/', function (req, res, next) {
        res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
        res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts-entry.jsonld'});
        return res.send({
            welcome: "This is the Sensors API. You can explore space missions\' sensors in Chronos KB: >",
            collection: {
                doc: "This is the sensors collection. You can find out how sensors in space works.",
                url: config.baseUrl + '/sensors/c'
            }
        });
    });

    router.get('/c', function (req, res, next) {
        res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
        res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
        var query = {
            // query needs to return the whole sensors collection
            // 'chronos:relKeyword._id': {'$exists': true}
        };
        var options = {"_id": false};
        return collection.find(query, options, function (errFind, cursor) {
            if (errFind) {
                res.sendStatus(500);
                return logger.error(errFind);
            }
            return cursor.toArray(function (errToArray, data) {
                if (errToArray) {
                    res.sendStatus(500);
                    return logger.error(errToArray);
                }
                return exportSensors(data, function (errExport, exported) {
                    if (errExport) {
                        res.sendStatus(500);
                        return logger.error(errExport);
                    }
                    return res.send(exported);
                });
            });
        });
    });

    router.get('/c/:label', function(req, res, next) {
        res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
        res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts.jsonld'});
        logger.info(utils.decodeLabel(req.params.label))
        var query = {
          '@id': { '$regex' : utils.decodeLabel(req.params.label), '$options': 'i' },
          //'skos:prefLabel': utils.regexpifyLabel(utils.decodeLabel(req.params.label))
          // 'chronos:relKeyword._id': {'$exists': true}
        };
        var options = {"_id": false};
        return collection.findOne(query, options, function(errFind, doc) {
          if (errFind) {
            res.sendStatus(500);
            return logger.error(errFind);
          }
          if (!doc) {
            return res.sendStatus(404);
          }
          return exportSensors(doc, function(errExport, exported) {
            if (errExport) {
              res.sendStatus(500);
              return logger.error(errExport);
            }
            return res.send(exported);
          });
        });
      });

    return router

};


