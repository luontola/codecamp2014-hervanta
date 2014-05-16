'use strict';

var xml2js = require('xml2js');
var fs = require('fs');
var Q = require('q');


var readXmlDump = function (filename) {
    var deferred = Q.defer();
    fs.readFile(filename, "utf8", function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            xml2js.parseString(data, function (err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

var timetablesFile = 'data/LVM.xml';
var data = readXmlDump(timetablesFile);

data.then(function () {
    console.log("Finished reading timetables");
}).fail(function (err) {
    console.log("Failed to read timetables", err);
});

exports.getStations = function () {
    return data.then(function (d) {
        return d.jp_database.Station.map(function (station) {
            return {
                id: station.$.StationId,
                name: station.$.Name,
                x: station.$.X,
                y: station.$.Y
            };
        });
    });
};