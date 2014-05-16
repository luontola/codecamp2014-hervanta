'use strict';

var xml2js = require('xml2js');
var fs = require('fs');
var Q = require('q');
var _ = require('underscore');

function dedollarify(obj) {
    if (!_.isObject(obj)) {
        return obj;
    }
    if (_.isArray(obj)) {
        return _.map(obj, dedollarify);
    }
    if (obj.$) {
        obj = _.chain(obj)
            .extend(obj.$)
            .omit('$')
            .value();
    }
    _.keys(obj).map(function (key) {
        obj[key] = dedollarify(obj[key]);
    });
    return obj;
}

function readXmlDump(filename) {
    var deferred = Q.defer();
    fs.readFile(filename, "utf8", function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            xml2js.parseString(data, function (err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(dedollarify(result.jp_database));
                }
            });
        }
    });
    return deferred.promise;
}

var timetableDb = readXmlDump('data/LVM.xml');

timetableDb.then(function (db) {
    console.log("Finished reading timetables");
    //console.log(JSON.stringify(db, null, 2));
}).
    fail(function (err) {
        console.log("Failed to read timetables", err);
    });

exports.getStations = function () {
    return timetableDb.then(function (db) {
        return db.Station.map(function (station) {
            return {
                id: station.StationId,
                name: station.Name,
                x: parseFloat(station.X),
                y: parseFloat(station.Y)
            };
        });
    });
};
