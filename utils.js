
var ObjectID = require('mongodb').ObjectID;
var async    = require('async');

function normalizeLabel(label) {
  if (typeof(label) != 'string') {
    throw new TypeError('Wrong type for argument `label`');
  }
  return decodeURIComponent(label.trim().replace(/\+/ig, '%20'));
}

module.exports.normalizeLabel = normalizeLabel;





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

module.exports.getBroaderConcept   = getBroaderConcept;
module.exports.getNarrowerConcepts = getNarrowerConcepts;