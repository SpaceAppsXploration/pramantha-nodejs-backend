/**
 * on 15/03/2015.
 */

var Router         = require('express').Router;
var logging        = require('../utils/logging');
var globals        = require('../utils/globals');


module.exports = function(config, opts) {

    var router = Router();
    var logger = logging.createLogger({name: 'missions', type: 'route'});


    router.use(function (req, res, next) {
        res.set('Content-Type', 'application/json');
        return next();
    });

    router.get('/', function (req, res, next) {
        res.links({'http://www.w3.org/ns/hydra/core#apiDocumentation': config.baseUrl + '/apidocs/concepts.jsonld'});
        res.links({'http://www.w3.org/ns/json-ld#context': config.baseUrl + '/contexts/concepts-entry.jsonld'});
        return res.send({
            concepts: config.baseUrl + '/concepts/',
            schemes: config.baseUrl + '/space/'
        });
    });

};