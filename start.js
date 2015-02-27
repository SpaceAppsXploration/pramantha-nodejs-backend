
var _        = require('underscore');
var express  = require('express');
var mongodb  = require('mongodb');
var url      = require('url');
var path     = require('path');
var http     = require('http');
var async    = require('async');
var logging  = require('./logging');

var config = require('./config');
var app    = process.app = express();
var server = http.createServer(app);
var logger = logging.createLogger({name: 'app'});

app.set('json spaces', 2);
app.set('logger', logger);

async.series(
  [

    function(cbSeries) {
      return mongodb.MongoClient.connect(config.mongoUrl, function(errConnect, db) {
        if (errConnect) {
          return cbSeries(errConnect);
        }
        logger.trace('MongoDB\'s client has been initialized.');
        app.set('mongodb', db);
        return cbSeries();
      });
    }, 

    function(cbSeries) {
      app.use(require('./middlewares/logging')());
      return cbSeries();
    },

    function(cbSeries) {
      app.use('/skos',     require('./routes/skos'));
      app.use('/concepts', require('./routes/concepts'));
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



