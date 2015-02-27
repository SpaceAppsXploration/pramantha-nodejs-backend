
var ObjectID = require('mongodb').ObjectID;
var async    = require('async');
var config   = require('../config');
var _        = require('underscore');
var globals  = require('../globals');

function regexifyConceptLabel(label) {
  if (typeof(label) != 'string') {
    throw new TypeError('Wrong type for argument `label`');
  }
  label = label.trim();                 // Trim
  label = label.replace(/\+/ig, '%20'); // Normalize spaces
  label = decodeURIComponent(label);    // Decode
  label = label.replace(/\(/g, '\\(');    // Replace ( with \(
  label = label.replace(/\)/g, '\\)');    // Replace ) with \)
  return new RegExp(label, 'i');
}

function setConceptAtIds(concepts) {
  var flattened = flatten(concepts);
  var concept   = null;
  var i         = null;
  var label     = null;
  var atId      = null;
  var atType    = null;
  var match     = null;
  for (i = 0, concept = flattened[i]; i < flattened.length; concept = flattened[++i]) {
    label  = concept['skos:prefLabel'];
    atId   = concept['@id'];
    atType = concept['@type'];
    delete concept['skos:scopeNote'];
    if (atId) {
      if (label) {
        label = label.toLowerCase();
        concept['skos:prefLabel'] = label;
        concept['@id'] = config.baseUrl + '/concepts/' + encodeURIComponent(label).replace(/(?:%20|%2B)/g, '+') + '#concept';
      } else {
        match = atId.match(/http:\/\/pramantha.eu\/[a-zA-Z0-9]+\/(.+)\/?/);
        if (match) {
          concept['@id'] = config.baseUrl + '/concepts/' + encodeURIComponent(match[1].toLowerCase()).replace(/(?:%20|%2B)/g, '+') + '#concept';
          match = null;
        } else {
          delete concept['@id'];
        }
      }
    }
  }
  return concepts;
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



function flatten(obj) {
  function isArray(x) {
    return Array.isArray(x);
  }
  function isObject(x) {
    return typeof(x) === 'object' && !isArray(x) && x != null;
  }
  function helper(x, r) {
    if (isObject(x)) {
      r.push(x);
      helper(_.values(x), r);
      return null;
    } else if (isArray(x)) {
      for (var i = 0; i < x.length; i++) {
        helper(x[i], r)
      }
      return null;
    } else {
      return null;
    }
  }
  var results = [];
  helper(obj, results);
  return results;
}


module.exports.regexifyConceptLabel = regexifyConceptLabel;
module.exports.setConceptAtIds      = setConceptAtIds;
module.exports.getBroaderConcept    = getBroaderConcept;
module.exports.getNarrowerConcepts  = getNarrowerConcepts;
module.exports.flatten              = flatten;