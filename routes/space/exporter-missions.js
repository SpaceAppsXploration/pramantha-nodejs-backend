
var async    = require('async');
var utils    = require('../../utils/utils');
var config   = require('../../config');
var ObjectID = require('mongodb').ObjectID;
var _        = require('underscore');

module.exports = function(config, opts) {

  var collection = opts.collection;
  var baseUrl    = config.baseUrl;

  return function exportMiss(missions, cb) {

    var arr  = Array.isArray(missions);
    missions = arr ? missions : [missions];

    return async.map(missions, function(mission, cbMap) {

      var exported = {}; //_.extend({}, doc);

      var label = exported.label = mission['skos:prefLabel'];

      // var url   = exported.url   = utils.genConceptURIFromLabel(baseUrl, label);
      // var group = exported.group = concept['chronos:group'];
      // var type  = exported.type  = concept['@type'];

      // var keywords = doc['chronos:relKeyword'];
      // var _id      = doc['_id'];

      // exported['relatedConcepts'] = keywords.map(function(keyword) {
      //   var matches = keyword['@id'].match(/http:\/\/api.pramantha.net\/data\/keywords\/(.+)/);
      //   return matches ? config.baseUrl + '/concepts/c/' + matches[1] : null;
      // });

      exported['url']        = config.baseUrl + '/space/missions/' + utils.encodeLabel(label);
      exported['group']      = 'missions';

      return cbMap(null, exported);
            
    }, function(errMap, missions) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? missions : missions[0]);  
    });

  }

}
