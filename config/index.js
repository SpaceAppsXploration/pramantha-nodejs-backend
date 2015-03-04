
var _ = require('underscore');

var config   = require('./config.json');
var defaults = require('./defaults.json');

module.exports = _.extend({}, defaults, config);