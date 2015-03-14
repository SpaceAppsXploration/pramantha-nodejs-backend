/**
 * on 14/03/2015.
 */


var async    = require('async');
var utils    = require('../../utils/utils');
var config   = require('../../config');
var ObjectID = require('mongodb').ObjectID;
var _        = require('underscore');

module.exports = function(config, opts) {

  var collection = opts.collection;
  var baseUrl    = config.baseUrl;

  return function exportTargets(docs, cb) {

    var arr  = Array.isArray(docs);
    docs = arr ? docs : [docs];

    return async.map(docs, function(doc, cbMap) {

      var exported = {}; //_.extend({}, doc);

      var label = doc['@id'].slice(-32);
      //var keywords = doc['chronos:relKeyword'];
      var _id      = doc['_id'];

      /*exported['relatedMission'] = missions.map(function(mission) {
        var matches = mission['@id'].match(/http:\/\/api.pramantha.net\/data\/keywords\/(.+)/);
        return matches ? config.baseUrl + '/space/missions/' + matches[1] : null;
      });*/

      exported['url']        = config.baseUrl + '/space/events/' + label;
      exported['header']     = doc['chronos:eventHeader'];
      //exported['relatedMissions'] = doc['relMission'];
      exported['date']       = doc['chronos:eventdate'];
      exported['content']    = doc['chronos:eventContent'];
      exported['image']      = doc['chronos:eventImageLink']['@value'] ? doc['chronos:eventImageLink']['@value'] : null;


      return cbMap(null, exported);

    }, function(errMap, docs) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? docs : docs[0]);
    });

  }

};
