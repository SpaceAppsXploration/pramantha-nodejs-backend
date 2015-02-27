
var Router  = require('express').Router;
var debug   = require('debug')('pramantha:skos');

var router  = Router();
var mongodb = process.app.get('mongodb');

// router.use('/areas',     require('./skos/areas'));
// router.use('/subjects',  require('./skos/subjects'));
// router.use('/root',      require('./skos/root'));
// router.use('/divisions', require('./skos/divisions'));

router.get('/', function(req, res, next) {
  res.send('CONCEPTS!');
});

module.exports = router;