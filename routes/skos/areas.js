// http.//apis.pramantha.eu/concepts/divisions/divisions-label

// http.//apis.pramantha.eu/concepts/areas/division-code

// db.base.findOne({"chronos:code": "division-code"})


var Router  = require('express').Router;
var debug   = require('debug')('pramantha:skos:areas');
var logging = require('../../logging');

var router  = Router();
var mongodb = process.app.get('mongodb');
var logger  = logging.createLogger({name: 'skos/areas', type: 'route'});

router.get('/', function(req, res, next) {
  return mongodb.collection('ontology').findOne({}, function(errFind, data) {
    if (errFind) {
      return next(errFind);
    }
    return res.send(data);
  });
});

module.exports = router;