
var async    = require('async');
// var utils    = require('./utils');
var config   = require('../../config');
var ObjectID = require('mongodb').ObjectID;
var _        = require('underscore');

module.exports = function(config, opts) {

  var collection = opts.collection;
  var baseUrl    = config.baseUrl;

  return function exportDocs(docs, cb) {

    var arr  = Array.isArray(docs);
    docs = arr ? docs : [docs];

    return async.map(docs, function(doc, cbMap) {

      var exported = {}; //_.extend({}, doc);

      // var label = exported.label = concept['skos:prefLabel'].toLowerCase();
      // var url   = exported.url   = utils.genConceptURIFromLabel(baseUrl, label);
      // var group = exported.group = concept['chronos:group'];
      // var type  = exported.type  = concept['@type'];

      var keywords = doc['chronos:relKeyword'];
      var _id      = doc['_id'];

      exported['relatedConcepts'] = keywords.map(function(keyword) {
        var matches = keyword['@id'].match(/http:\/\/api.pramantha.net\/data\/keywords\/(.+)/);
        return matches ? config.baseUrl + '/concepts/c/' + matches[1] : null;
      });

      exported['url']        = doc['owl:sameAs'][0]['@value'];
      exported['chronosUrl'] = config.baseUrl + '/space/dbpediadocs/' + _id;
      exported['label']      = doc['skos:altLabel'];
      exported['group']      = 'dbpediadocs';
      exported['relatedMissions'] = doc['relMission'];

      return cbMap(null, exported);
            
    }, function(errMap, docs) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? docs : docs[0]);  
    });

  }

}
