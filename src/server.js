'use strict';

var Q = require('q');
var express = require('express');
var routes = require('./routes/index');
var path = require('path');
var timetables = require('./timetables');

var server = express();

server.get('/', function (req, res) {
  res.sendfile('index.html', {'root': __dirname + '/../public' });
});

server.get('/stations', function(req, res, next) {
    timetables.getStations().then(function(stations) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(stations));
    }).fail(next);
});

server.start = function () {
    var port = 8080;
    return Q.ninvoke(server, 'listen', port)
        .then(function () {
            console.info("Server listening on port %s", port);
        });
};

module.exports = server;
