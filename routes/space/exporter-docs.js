
var async    = require('async');
var utils    = require('../../utils/utils');
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

      var label         = doc['skos:altLabel'];
      var keywords      = doc['chronos:relKeyword'];
      var events        = 'chronos:relEvent' in doc ? doc['chronos:relEvent'] : null;
      var missions      = 'chronos:relMission' in doc ? doc['chronos:relMission'] : null;
      console.log(missions)
      var _id           = doc['_id'];
      exported['url']   = config.baseUrl + '/space/dbpediadocs/' + utils.encodeLabel(label);
      exported['label'] = label;

      if (!arr) {
        // this is /documents
          exported['relatedConcepts'] = keywords.map(function (keyword) {
              var matches = keyword['@id'].match(/http:\/\/api.pramantha.net\/data\/keywords\/(.+)/);
              return matches ? config.baseUrl + '/concepts/c/' + matches[1] : null;
          });


          if (events != null) {
              exported['relatedEvents'] = events.map(function (event) {
                  var matches = event['@id'].match(/http:\/\/api.pramantha.net\/data\/events\/(.+)/);
                  return matches ? config.baseUrl + '/space/events/' + matches[1] : null;
              });
          }
          if (missions != null) {
              exported['relatedMissions'] = missions.map(function (mission) {
                  var matches = mission['@id'].match(/http:\/\/api.pramantha.net\/data\/missions\/(.+)/);
                  return matches ? config.baseUrl + '/space/missions/' + matches[1] : null;
              });
          console.log(exported['relatedMissions'])
          }

          exported['dbpedia']         = doc['owl:sameAs'][0]['@value'];
          exported['abstract']        = doc['chronos:tagMeAbs'];
          exported['category']        = doc['chronos:dbpediaCategories'];
          exported['wikiUrl']         = 'http://en.wikipedia.org/wiki/' + label;
      }

      return cbMap(null, exported);
            
    }, function(errMap, docs) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? docs : docs[0]);  
    });

  }

}
