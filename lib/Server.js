'use strict';

var dgram = require('dgram');
var util = require('util');
var events = require('events');

var decode = require('./decode');

var Server = function(port, host) {
    var server;
    events.EventEmitter.call(this);
    this.port = port;
    this.host = host;
    this._sock = dgram.createSocket('udp4');
    this._sock.bind(port);
    server = this;
    this._sock.on('message', function (msg, rinfo) {
        try {
            var decoded = decode(msg);
            // [<address>, <typetags>, <values>*]
        }
        catch (e) {
            console.log('can\'t decode incoming message: ' + e.message);
        }

        if (decoded) {
            server.emit('message', decoded, rinfo);
            server.emit(decoded[0], decoded, rinfo);

            if (decoded[0] == "#bundle") {
              for (var i = 2; i < decoded.length; i++) {
                server.emit(decoded[i][0], decoded[i], rinfo);
              }
            }
        }
    });
    this.kill = function() {
        this._sock.close();
    };
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;
