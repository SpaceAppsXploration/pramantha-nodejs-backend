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

      var n = doc['@id'].lastIndexOf("/");
      var label = doc['@id'].slice(n);
      var mission = doc['chronos:relMission'];
      var _id      = doc['_id'];

      /*exported['relatedMission'] = config.baseUrl + '/space/missions/' +
            utils.makeLabelFromTitle(mission['@id'].match(/http:\/\/api.pramantha.net\/data\/missions\/(.+)/)[1]);*/

      exported['url']        = config.baseUrl + '/space/events/' + label;
      exported['header']     = doc['chronos:eventHeader'];
      //exported['relatedMissions'] = doc['relMission'];
      exported['date']       = doc['chronos:eventdate'] != null ? doc['chronos:eventdate'].slice(0,10) : null;
      exported['content']    = doc['chronos:eventContent']['@value'];
      exported['image']      = doc['chronos:eventImageLink'] != null ? doc['chronos:eventImageLink']['@value'] : null;


      return cbMap(null, exported);

    }, function(errMap, docs) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? docs : docs[0]);
    });

  }

};
