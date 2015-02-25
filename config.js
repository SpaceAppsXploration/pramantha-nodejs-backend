
var _ = require('underscore');

var config   = require('./config/config.json');
var defaults = require('./config/defaults.json');

module.exports = _.defaults(config, defaults);