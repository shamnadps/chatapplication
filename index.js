var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 8080
    });

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});