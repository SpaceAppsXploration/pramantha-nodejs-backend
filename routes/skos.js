
var Router  = require('express').Router;

var router  = Router();

router.use('/areas',     require('./skos/areas'));
router.use('/subjects',  require('./skos/subjects'));
router.use('/root',      require('./skos/root'));
router.use('/divisions', require('./skos/divisions'));

module.exports = router;