
var ObjectID = require('mongodb').ObjectID;
var async    = require('async');
var config   = require('./config');

function normalizeLabel(label) {
  if (typeof(label) != 'string') {
    throw new TypeError('Wrong type for argument `label`');
  }
  return decodeURIComponent(label.trim().replace(/\+/ig, '%20'));
}

function setConceptAtId(concepts) {
  var isArray = Array.isArray(concepts);
  concepts = isArray ? concepts : [concepts];
  for (var i = 0; i < concepts.length; i++) {
    var concept = concepts[i];
    concept['@id'] = config.baseUrl + '/concepts/' + encodeURIComponent(concept['skos:prefLabel']);
  }
  return isArray ? concepts : concepts[0];
}

function getBroaderConcept(concept, collection, cb) {
  switch(concept['chronos:group']) {
    case 'divisions': 
    case 'subjects':
      if (typeof(concept['skos:broader']) === 'object') {
        return collection.findOne({'_id': concept['skos:broader']._id}, cb);
      } else {
        return cb();
      }
    break;
    default: 
      return cb(new Error('Unsupported'));
    break;
  }
}

function getNarrowerConcepts(concept, collection, cb) {
  switch(concept['chronos:group']) {
    case 'divisions': 
    case 'STI':
      if (Array.isArray(concept['skos:narrower'])) {
        var query = {
          _id: {
            '$in': concept['skos:narrower'].map(function(item) {
              return item._id;
            })
          }
        }
        return collection.find(query, function(errFind, cursor) {
          if (errFind) {
            return cb(errFind);
          }
          return cursor.toArray(function(errToArray, data) {
            if (errToArray) {
              return cb(errToArray);
            }
            return cb(null, data);
          });
        });
      } else {
        return cb();
      }
    break;
    default: 
      return cb(new Error('Unsupported'));
    break;
  }
}

module.exports.normalizeLabel      = normalizeLabel;
module.exports.setConceptAtId      = setConceptAtId;
module.exports.getBroaderConcept   = getBroaderConcept;
module.exports.getNarrowerConcepts = getNarrowerConcepts;