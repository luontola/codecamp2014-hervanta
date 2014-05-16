'use strict';

var Q = require('q');
var express = require('express');

var server = express();

server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send("It's alive! Alive! ALIVE!");
});

server.start = function () {
    var port = 8080;
    return Q.ninvoke(server, 'listen', port)
        .then(function () {
            console.info("Server listening on port %s", port);
        });
};

module.exports = server;
