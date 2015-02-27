
var Router  = require('express').Router;

var router  = Router();

router.get('/', function(req, res, next) {
  return res.send({});
});

module.exports = router;