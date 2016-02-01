# README #


### Stupid and simple chat server for Leadin ###

### Install ###

* Install [NodeJS](https://nodejs.org)
* Install libraries: `npm install`
* Run: `node app.js`

By the default both the websocket server and REST API server listens on port 8888.

### How to use ###

This is very simple and stupid chat server without any persistence or authentication. Do not use in any real environment.

The server has two parts:
* websocket server
* REST API

#### Websocket Server ####

The websocket server relays all chat messages and allows user to change his nickname. Once you connect to the websocket server (e.g. ws://127.0.0.1:8888) it responds with the hello message. Before you can send any messages, register a nick name by sending `/nick nickname` command to the websocket server. If the nick is free i.e. nobody uses it right now, it assigned to you and you can start sending messages. Send any text data without leadin '/' character to be sent all other respondents.

*Note! You can take existing nick if that user is not currently online. Like I said, this server has no security!*

Messages from other users are in JSON format: `{"from": nickname,"message": message}`. Example:
{"from":"katti","message":"hello world"}

Server will send some updates like when new user joins or leaves. Server messages come from user '_server'. BTW, you cannot take a nick starting with the underscore.

#### REST API ####

The server exposes two REST API calls:
* GET /users - get list of all users and their online/offline status
* GET /history - get chat history

Both calls return JSON objects in form: `{errors: null, data: returned data}`