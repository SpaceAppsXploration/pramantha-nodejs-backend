
var Router  = require('express').Router;
var debug   = require('debug')('pramantha:concepts');

var router  = Router();

router.use('/areas',     require('./concepts/areas'));
router.use('/subjects',  require('./concepts/subjects'));
router.use('/root',      require('./concepts/root'));
router.use('/divisions', require('./concepts/divisions'));

module.exports = router;