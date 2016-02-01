var _ = require('lodash');

exports = module.exports = function(wss, users, chathistory) {
    var _users = users;
    var _history = chathistory;
    var _wss = wss;
    
    function setUserNick(user, nick) {
        if(_users[user])
        user.nick = nick;
    }
    
    return {
        handleCommand: function(ws, msg) {
            var commandAndParmas = msg.split(' ', 2);
            if(commandAndParmas.length >= 2 && commandAndParmas[0].toLowerCase() === '/nick') {
                //check if nick is in use
                var user = _users.getUser(commandAndParmas[1]);
                if(user && user.ws) { //currently online, won't accept
                    ws.send(JSON.stringify({from: "server", error: "Nick in use"}));
                    return false;
                }
                //set or create user
                var msg;               
                if(ws.user) {
                    var oldNick = ws.user.nick;
                    _users.changeNick(oldNick, commandAndParmas[1]);
                    msg =  oldNick + " is now known as " + ws.user.nick;
                } else {
                    ws.user = _users.createUser(commandAndParmas[1]);
                    ws.user.ws = ws;
                    msg = "New user: " + ws.user.nick + " joined.";                    
                }
                this.broadcast("server", msg)              
            }    
        },
        broadcast: function(from, msg) {
            _history.add(from, msg);
            var chat = {from: from, message: msg};
            _.each(_wss.clients, function(client) {
                if(client.user && client.user.nick !== from) {
                    client.send(JSON.stringify(chat));
                }    
            });
        }
    }

    
};