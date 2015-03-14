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
  return encodeURIComponent(label.toLowerCase())
    .replace(' ', '_')
  ;
}

module.exports.encodeLabel             = encodeLabel;
module.exports.decodeLabel             = decodeLabel;
module.exports.regexpifyLabel          = regexpifyLabel;
module.exports.makeTitleFromPrefLabel  = makeTitleFromPrefLabel;