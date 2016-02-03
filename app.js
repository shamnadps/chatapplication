/*jslint node: true, indent: 2 */
'use strict';
var express = require('express');
var util = require('util');

var app = express();
app.set('name', "Leadin Chat Demo");
app.set('port', 8888);

var server = require('http').createServer(app);
app.use(require('morgan')('dev'));
//set cors headers
app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});


var users = new require('./users')();
var chats = new require('./chathistory')();

var wssServer = require('ws').Server({server: server, perMessageDeflate: false});
wssServer.on('connection', function(ws) {
    util.log("Connection from " + util.inspect(ws.upgradeReq.connection.remoteAddress));
    ws.send("Hello from Leadin chat. Set the nickname with the command /nick nickname before chatting away.");
    ws.on('message', function(msg) {
        if(msg[0] === '/') {
            chatProtocol.handleCommand(ws, msg);
        } else {
            if(ws.user) { //we know who this is
                chatProtocol.broadcast(ws.user.nick, msg);
            } else {
                util.log("Chat ignored from unidentified user");
            }  
        }               
    });
    ws.on('close', function(code, message) {
        var user = ws.user;
        user.online = false;
        util.log(user.nick + " dropped out.");
        chatProtocol.broadcast("_server", user.nick + " dropped out.");
    });
});
wssServer.on('error', function(err) {
    util.log("Websocket server error: " + util.inspect(err));
});

var chatProtocol = new require('./protocol')(wssServer, users, chats);

//REST routes
app.use(require('./routes')(users, chats).router);

util.log('Server started.');
server.listen(app.get('port'), function () {
  util.log('%s listening at %s', app.get('name'), app.get('port'));
});

