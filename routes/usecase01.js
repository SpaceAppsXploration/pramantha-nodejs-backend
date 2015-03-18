
var express = require('express');
var _       = require('underscore');
var path    = require('path');
var fs      = require('fs');
var async   = require('async');
var parser  = require('body-parser');
var request = require('request');

module.exports = function(config, opts) {

  var router = express.Router();
  var dir    = path.join(__dirname, '..', 'apidocs');
  var cache  = {};

  router.post('/', parser.json());
  router.post('/', parser.urlencoded({ extended: true }));

  router.post('/', function(req, res, next) {

    var text = req.body && req.body.text;

    if (!text) {
      return res.sendStatus(400);
    }

    return async.waterfall([

      function callTagMeAPI(waterCb) {
        return request(
          {
            url: 'http://tagme.di.unipi.it/tag',
            method: 'POST',
            form: {
              key: '816ea39c4c4da4bbe3eea482cf664ed9',
              text: text
            },
            json: true
          }, 
          function onResponse(reqErr, res, body) {
            if (reqErr) {
              return waterCb(reqErr);
            }
            if (res.statusCode != 200) {
              return waterCb(new Error('Bad response from TagMeAPI'));
            } 
            return waterCb(null, body);
          }
        );
      },

      function getWikiUrls(tagMeRes, waterCb) {
        return async.map(
          tagMeRes.annotations, 
          function mapAnnotation(a, mapCb) {
            return request(
              {
                useQuerystring: true,
                qs: {
                  action: 'query',
                  prop: 'info',
                  pageids: a.id,
                  inprop: 'url',
                  format: 'json',
                  'continue': ''
                },
                json: true,
                url: 'http://en.wikipedia.org/w/api.php'
              },
              function onResponse(reqErr, res, body) {
                if (reqErr) {
                  return mapCb(reqErr);
                }
                if (res.statusCode != 200) {
                  return mapCb(new Error('Bad response from wikipedia\'s API'));
                } 
                return mapCb(null, body['query']['pages'][a.id]['fullurl']);
              }
            );
          },
          waterCb
        );
      }

    ], function(waterErr, result) {
      if (waterErr) {
        return next(waterErr);
      }
      console.log('HERE');
      return res.send(result);
    });

  });

  return router;

}
