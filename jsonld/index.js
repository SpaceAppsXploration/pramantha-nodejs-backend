
var config = require('../config');
var _      = require('underscore');
var fs     = require('fs');
var path   = require('path');

function load(filename) {
  var pathname = path.join(__dirname, filename);
  var content  = fs.readFileSync(pathname, 'utf8');
  var rendered = _.template(content)(config);
  var parsed   = JSON.parse(rendered);
  return parsed;
}

module.exports['context-documentation'] = load('context-documentation.json');
module.exports['context-generic']       = load('context-generic.json');
module.exports['context-concept']       = load('context-concept.json');
module.exports.documentation            = load('documentation.json');

