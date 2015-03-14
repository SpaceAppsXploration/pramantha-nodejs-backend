/**
 * 14/03/2015.
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

      var label = doc['skos:prefLabel'];
      //var keywords = doc['chronos:relKeyword'];
      var _id      = doc['_id'];

      /*exported['relatedConcepts'] = keywords.map(function(keyword) {
        var matches = keyword['@id'].match(/http:\/\/api.pramantha.net\/data\/keywords\/(.+)/);
        return matches ? config.baseUrl + '/concepts/c/' + matches[1] : null;
      });*/

      exported['dbpedia']    = doc['owl:sameAs'][0]['@value'];
      exported['url']        = config.baseUrl + '/space/targets/' + utils.encodeLabel(label);
      exported['label']      = label;
      //exported['relatedMissions'] = doc['relMission'];
      exported['abstract']   = doc['chronos:abstract']['@value'];
      exported['wikiUrl']    = 'http://en.wikipedia.org/wiki/' + doc['chronos:slug'];
      exported['ontology']   = 'http://ontology.projectchronos.eu/solarsystem/' + doc['chronos:slug'];


      return cbMap(null, exported);

    }, function(errMap, docs) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? docs : docs[0]);
    });

  }

};