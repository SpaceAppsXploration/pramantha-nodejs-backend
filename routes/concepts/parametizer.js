
var _        = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var async    = require('async');
var utils    = require('./utils');

module.exports = function(config, opts) {

  var collection = opts.collection;

  return function(query, req, cb) {

    query = _.extend({}, query);

    var ancestorLabel = req.query.ancestor;
    var groupLabel    = req.query.group;

    if (groupLabel) {
      query['chronos:group'] = groupLabel;
    }

    return async.series([

      function(cbSeries) {
        if (!ancestorLabel) {
          return cbSeries();
        }
        var ancestorQuery = {
          '$or': [
            {'chronos:group': 'divisions'},
            {'chronos:group': 'keywords'},
            {'chronos:group': 'subjects'}
          ],
          'skos:prefLabel': utils.genRegexpFromURIString(ancestorLabel)
        };
        return collection.findOne(ancestorQuery, function(errFind, doc) {
          if (errFind) {
            return cbSeries(errFind);
          }
          if (!doc) {
            return cbSeries();
          }
          var group = doc['chronos:group'];
          if (group === 'divisions') {
            query['skos:broader._id'] = ObjectID(doc._id);
            return cbSeries();
          } else if (group === 'subjects') {
            query['skos:inScheme._id'] = ObjectID(doc['skos:topConceptOf']._id);
            return cbSeries();
          } else {
            query['_id'] = 'blorgh';
            return cbSeries();
          }
        });
      }

    ], function(errSeries) {
      return cb(errSeries, query);
    });

  }

}