
function encodeConceptLabel(label) {
  return encodeURIComponent(label.toLowerCase()).replace(/(?:%20|%2B)/g, '+');
}

function genConceptURIFromLabel(baseUrl, label) {
  return baseUrl 
    + '/concepts/c/'
    + encodeConceptLabel(label)
    + '#concept'
  ;
}

function genChildConceptsURIFromLabel(baseUrl, label) {
  return baseUrl 
    + '/concepts/c?ancestor='
    + encodeConceptLabel(label)
  ;
}

function genRegexpFromURIString(label) {
  if (typeof(label) != 'string') {
    throw new TypeError('Wrong type for argument `label`');
  }
  label = label.trim();                 // Trim
  label = label.replace(/\+/ig, '%20'); // Normalize spaces
  label = decodeURIComponent(label);    // Decode
  label = '^' + label;
  label = label.replace(/\(/g, '\\(');  // Replace ( with \(
  label = label.replace(/\)/g, '\\)');  // Replace ) with \)
  label = label + '$';
  return new RegExp(label, 'i');
}

function flattenConcepts(obj) {
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

module.exports.genRegexpFromURIString       = genRegexpFromURIString;
module.exports.genChildConceptsURIFromLabel = genChildConceptsURIFromLabel;
module.exports.genConceptURIFromLabel       = genConceptURIFromLabel;
module.exports.encodeConceptLabel           = encodeConceptLabel;