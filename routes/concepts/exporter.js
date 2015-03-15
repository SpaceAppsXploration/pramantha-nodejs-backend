
var async    = require('async');
var utils    = require('./utils');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(config, opts) {

  var collection = opts.collection;
  var baseUrl    = config.baseUrl;

  return function exportt(concepts, cb) {

    var arr  = Array.isArray(concepts);
    concepts = arr ? concepts : [concepts];

    return async.map(concepts, function(concept, cbMap) {

      var exported = {};

      var label = exported.label = concept['skos:prefLabel'].toLowerCase();
      var url   = exported.url   = utils.genConceptURIFromLabel(baseUrl, label);
      var group = exported.group = concept['chronos:group'];
      var type  = exported.type  = concept['@type'];

      var scopeNote = concept['skos:scopeNote'];

      if (Array.isArray(scopeNote) && scopeNote.length > 0) {
        exported.note = scopeNote[0]['@value'];        
      }
      
      var code  = exported.code = concept['chronos:code'];

      if (group === 'divisions') {
        exported.children = utils.genChildConceptsURIFromLabel(baseUrl, label);
      }

      return async.series([

        function(cbSeries) {
          if (group != 'subjects') { 
            return cbSeries();
          }
          exported.children = utils.genChildConceptsURIFromLabel(baseUrl, label);
          var query = {_id: ObjectID(concept['skos:broader']._id)};
          return collection.findOne(query, function(errFind, data) {
            if (errFind) { 
              return cbSeries(errFind); 
            }
            exported.ancestor = utils.genConceptURIFromLabel(baseUrl, data['skos:prefLabel']);
            return cbSeries();
          });
        }, 

        function(cbSeries) {
          if (group != 'keywords') {
            return cbSeries();
          }
          var query = {'skos:topConceptOf._id': ObjectID(concept['skos:inScheme']._id)};
          return collection.findOne(query, function(errFind, data) {
            if (errFind) { 
              return cbSeries(errFind); 
            }
            exported.ancestor = utils.genConceptURIFromLabel(baseUrl, data['skos:prefLabel']);
            return cbSeries();
          });
        }

      ], function(errSeries) {
        return cbMap(errSeries, exported);
      });
      
    }, function(errMap, concepts) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? concepts : concepts[0]);  
    });

  }

}
