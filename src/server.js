'use strict';

var Q = require('q');
var express = require('express');
var path = require('path');
var timetables = require('./timetables');

var server = express();

server.use('/bower_components', express.static(__dirname + '/../bower_components'));
server.use('/public', express.static(__dirname + '/../public'));

server.get('/', function (req, res) {
    res.sendfile('index.html', {'root': __dirname + '/../public' });
});

function sendJsonResult(res, next, future) {
    future.then(function (data) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(data));
    }).fail(next);
}

server.get('/stations', function (req, res, next) {
    sendJsonResult(res, next, timetables.getStations());
});

server.get('/services', function (req, res, next) {
    var stationId = req.param('stationId');
    var time = req.param('time');
    if (time) {
        sendJsonResult(res, next, timetables.getNextServicesByStationId(stationId, time));
    } else {
        sendJsonResult(res, next, timetables.getServicesByStationId(stationId));
    }
});

server.start = function () {
    var port = 8080;
    return Q.ninvoke(server, 'listen', port)
        .then(function () {
            console.info("Server listening on port %s", port);
        });
};

module.exports = server;
