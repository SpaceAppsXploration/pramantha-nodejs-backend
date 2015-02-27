var bunyan = require('bunyan');
var config = require('./config');

function createLogger(opts) {
  opts = opts || {};
  opts.level = opts.level || config.logLevel;
  return bunyan.createLogger(opts);
}

module.exports.createLogger = createLogger;