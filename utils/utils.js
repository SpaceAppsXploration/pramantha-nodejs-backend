function encodeLabel(label) {
  return encodeURIComponent(label.toLowerCase())
    .replace(/(?:%20|%2B)/g, '+')
  ;
}

function decodeLabel(label) {
  return decodeURIComponent(label
    .trim()
    .replace(/\+/ig, '%20')
  );
}

function regexpifyLabel(label) {
  return new RegExp(label
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
  , 'i');
}

function makeTitleFromPrefLabel(label) {
  /*
  * works only to make wiki titles from "launches"
  * by passing the "skos:prefLabel" property.
  * For "missions" use "chronos:slug" or
  * for "dbpediadocs" use "skos:altLabel"
  * with encodeLabel
  */
  return encodeURIComponent(label.toLowerCase())
    .replace(' ', '_')
  ;
}

module.exports.encodeLabel             = encodeLabel;
module.exports.decodeLabel             = decodeLabel;
module.exports.regexpifyLabel          = regexpifyLabel;
module.exports.makeTitleFromPrefLabel  = makeTitleFromPrefLabel;