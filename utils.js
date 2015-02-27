
var ObjectID = require('mongodb').ObjectID;

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

module.exports.getBroaderConcept = getBroaderConcept;