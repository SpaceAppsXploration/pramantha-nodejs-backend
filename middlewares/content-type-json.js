
module.exports = function() {
  return function setContentTypeToJson(req, res, next) {
    res.set('Content-Type', 'application/json');
    return next();
  }
}