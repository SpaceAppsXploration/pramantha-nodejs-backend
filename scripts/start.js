
var _        = require('underscore');
var express  = require('express');
var mongodb  = require('mongodb');
var url      = require('url');
var path     = require('path');
var http     = require('http');
var async    = require('async');
var logging  = require('../utils/logging');
var config   = require('../config');

var app    = express();
var server = http.createServer(app);
var opts   = {};
var logger = logging.createLogger({name: 'start', type: 'script'});

app.set('json spaces', 2);

async.series(
  [

    function(cbSeries) {
      return mongodb.MongoClient.connect(config.mongoUrl, function(errConnect, db) {
        if (errConnect) {
          return cbSeries(errConnect);
        }
        logger.trace('MongoDB\'s client has been initialized.');
        opts.db = db;
        return cbSeries();
      });
    }, 

    function(cbSeries) {
      app.use(require('../middlewares/logging')(config, opts));
      app.use(require('../middlewares/cors')(config, opts));
      return cbSeries();
    },

    function(cbSeries) {
      app.use('/', require('../routes/home')(config, opts));
      app.use('/concepts', require('../routes/concepts')(config, opts));
      app.use('/contexts', require('../routes/contexts')(config, opts));
      app.use('/apidocs',  require('../routes/apidocs')(config, opts));
      app.use('/space',    require('../routes/space')(config, opts));
      logger.trace('All routes have been set-up.');
      return cbSeries();
    },

    function(cbSeries) {
      return server.listen(config.port, config.host, cbSeries);
    }

  ], 

  function(errSeries) {
    if (errSeries) {
      throw errSeries;
    }
    logger.info('Listening on %s:%s', config.host, config.port);
    return null;
  }

);



