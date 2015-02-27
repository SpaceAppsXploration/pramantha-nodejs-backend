
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

var contexts = module.exports.contexts = {
  concept: load('context-concept.json')
};

var documentation = module.exports.documentation = {
  api: load('api-documentation.json')
}


