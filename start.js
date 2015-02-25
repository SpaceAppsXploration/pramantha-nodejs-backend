
var _        = require('underscore');
var express  = require('express');
var mongodb  = require('mongodb');
var url      = require('url');
var path     = require('path');
var http     = require('http');
var debug    = require('debug')('pramantha:start');
var async    = require('async');

var config = require('./config');
var app    = process.app = express();
var server = http.createServer(app);

app.set('json spaces', 2);

async.series(
  [

    function(cbSeries) {
      return mongodb.MongoClient.connect(config.mongoUrl, function(errConnect, db) {
        if (errConnect) {
          return cbSeries(errConnect);
        }
        debug('MongoDB\'s client has been initialized.');
        app.set('mongodb', db);
        return cbSeries();
      });
    }, 

    function(cbSeries) {
      app.use(require('./middlewares/logging')());
      return cbSeries();
    },

    function(cbSeries) {
      app.use('/helloworld', require('./routes/helloworld'));
      app.use('/concepts',   require('./routes/concepts'));
      debug('All routes have been set-up.');
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
    console.log('Listening on %s:%s', config.host, config.port);
    return null;
  }

);



