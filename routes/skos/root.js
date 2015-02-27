// http.//apis.pramantha.eu/concepts/divisions/divisions-label

// http.//apis.pramantha.eu/concepts/areas/division-code

// db.base.findOne({"chronos:code": "division-code"})


var Router  = require('express').Router;
var logging = require('../../logging');

var router  = Router();
var mongodb = process.app.get('mongodb');
var logger  = logging.createLogger({name: 'skos/root', type: 'route'});

router.get('/', function(req, res, next) {
  return mongodb.collection('base').findOne({"chronos:group": "STI"}, function(errFind, doc) {
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