/**
 * on 16/03/2015.
 */



var async    = require('async');
var utils    = require('../../utils/utils');
var config   = require('../../config');
var ObjectID = require('mongodb').ObjectID;
var _        = require('underscore');

module.exports = function(config, opts) {

  var collection = opts.collection;
  var baseUrl    = config.baseUrl;

  return function exportSensors(docs, cb) {

    var arr  = Array.isArray(docs);
    docs = arr ? docs : [docs];

    var label = null;

    return async.map(docs, function(doc, cbMap) {

      var exported = {};

        if (arr) {
            // this is /sensors
              label = doc['@id'].match(/http:\/\/api.pramantha.net\/data\/sensors\/(.+)/)[1];


              if(doc['@type'] == 'http://ontology.projectchronos.eu/subsystems/Spacecraft_Detector') {
                  exported['relies on'] = [];
                  for (var i=0; i < doc['spacecraft:embedSensor'].length; i++ ) {
                      sensor_i =  doc['spacecraft:embedSensor'][i].match(/http:\/\/api.pramantha.net\/data\/sensors\/(.+)/)[1];
                      exported['relies on'].push(config.baseUrl + '/sensors/c/' + utils.encodeLabel(sensor_i));
                  }

                  //exported['relies on'] = config.baseUrl + '/sensors/c/' + utils.encodeLabel(label);
                  exported['note'] = doc['rdfs:comment']
              }
              else {
                 if('spacecraft:isComponentOf' in doc) {
                     detector = doc['spacecraft:isComponentOf']['@id'].match(/http:\/\/api.pramantha.net\/data\/sensors\/(.+)/)[1]
                     exported['is a sensor of'] = config.baseUrl + '/sensors/c/' + utils.encodeLabel(detector);
                 }
              }

              exported['url']       = config.baseUrl + '/sensors/c/' + utils.encodeLabel(label);
              exported['name']      = doc['name'];
              if('fullName' in doc) exported['full name'] = doc['fullName'];
              if('chronos:relMission' in doc) exported['mission']   = config.baseUrl + '/space/missions/' + utils.encodeLabel(
                                                                     doc['chronos:relMission']['@id'].match(/http:\/\/api.pramantha.net\/data\/mission\/(.+)/)[1]);



              return cbMap(null, exported);

        }
        else {
                // this is /sensors/c/:label
                  label = doc['@id'].match(/http:\/\/api.pramantha.net\/data\/sensors\/(.+)/)[1];


                  if(doc['@type'] == 'http://ontology.projectchronos.eu/subsystems/Spacecraft_Detector') {
                      exported['relies on'] = [];
                      for (var i=0; i < doc['spacecraft:embedSensor'].length; i++ ) {
                          sensor_i =  doc['spacecraft:embedSensor'][i].match(/http:\/\/api.pramantha.net\/data\/sensors\/(.+)/)[1];
                          exported['relies on'].push(config.baseUrl + '/sensors/c/' + utils.encodeLabel(sensor_i));
                      }

                  }
                  else {
                      if('spacecraft:isComponentOf' in doc) {
                          detector = doc['spacecraft:isComponentOf']['@id'].match(/http:\/\/api.pramantha.net\/data\/sensors\/(.+)/)[1]
                          exported['is a sensor of'] = config.baseUrl + '/sensors/c/' + utils.encodeLabel(detector);
                      }
                     exported['is traversed by'] =  doc["sensor:isTraversedBy"]
                     exported['field of research'] =  doc["sensor:hasFieldOfResearch"]
                     exported['working principle'] =  doc["sensor:hasWorkingPrinciple"]
                     exported['detects'] =  doc["sensor:detects"]
                     exported['measures'] =  doc["sensor:measures"]
                     exported['has output'] =  doc["sensor:hasOutput"]
                  }

                  exported['url']       = config.baseUrl + '/sensors/c/' + utils.encodeLabel(label);
                  exported['name']      = doc['name'];
                  if('fullName' in doc) exported['full name'] = doc['fullName'];
                  if('chronos:relMission' in doc) exported['mission']   = config.baseUrl + '/space/missions/' + utils.encodeLabel(
                                                                            doc['chronos:relMission']['@id'].match(/http:\/\/api.pramantha.net\/data\/mission\/(.+)/)[1]);




                  return cbMap(null, exported);
        }



    }, function(errMap, docs) {
      if (errMap) {
        return cb(errMap);
      }
      return cb(null, arr ? docs : docs[0]);
    });

  }

}