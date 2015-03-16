/**
 * on 15/03/2015.
 */

var Router         = require('express').Router;
//var logging        = require('../utils/logging');
//var globals        = require('../utils/globals');
var async    = require('async');
var utils    = require('../../utils/utils');
var config   = require('../../config');
var _        = require('underscore');


module.exports = function(config, opts) {

    var router = Router();
    //var logger = logging.createLogger({name: 'missions', type: 'route'});


    router.use(function (req, res, next) {
        res.set('Content-Type', 'application/json');
        return next();
    });

    router.get('/', function (req, res, next) {
        res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
        res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts-entry.jsonld'});
        return res.send({
            "entry point": "Welcome to Chronos APIs.",
            "Concepts API": {
                "doc": "A hierarchical taxonomy for space concepts.",
                "url": config.baseUrl + '/concepts/'
            },
            "Space API": {
                "doc": "Explore the linked resources about space activities",
                "url": config.baseUrl + '/space/'
            },
            "Sensors API": {
                "doc": "Explore the linked resources about space sensors",
                "url": config.baseUrl + '/sensors/'
            },
            "software by": "Pramantha Ltd, powered by Project Chronos"
        });
    });

    return router;

};