var express = require('express');
var router = express.Router();
var clientIo = require("socket.io-client");

var auth = require('../modules/auth');
var messageController = require('../controllers/messageController');
var mainController = require('../controllers/mainController');


module.exports = function(io, app) {
    
    //http://stackoverflow.com/questions/4753957/socket-io-authentication
    // console.log(app.cookie);
    // io.set('authorization', function (data, accept) {
    //     //console.log(data);
    //     // check if there's a cookie header
    //     if (data.headers.cookie) {
    //         // session id, as you specified in the Express setup.
    //         //data.sessionID = cookie.parse(data.headers["cookie"])["express.sid"];
    //     } else {
    //         // if there isn't, turn down the connection with a message
    //         // and leave the function.
    //         return accept('No cookie transmitted.', false);
    //     }
    //     // accept the incoming connection
    //     accept(null, true);
    // });
    
    // io.set('authorization', function (handshakeData, accept) {
    //     if (handshakeData.headers.cookie) {
    //         handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
    //         handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');
    //         if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
    //             return accept('Cookie is invalid.', false);
    //         }
    //     } else {
    //         return accept('No cookie transmitted.', false);
    //     } 
    //     accept(null, true);
    // });
    
    io.sockets.on('connection', function(socket) {
        messageController.addConnection(socket.handshake.query.token, socket.id);      
        console.log("Username: " + socket.handshake.query.token + " id: " + socket.id);
        socket.on('disconnect', function(){
            messageController.removeConnection(socket.handshake.query.token)
        });
    });
    
    // Create socket client for the server to connect to the api
    var socketClient = clientIo.connect('http://localhost:3000/', {query: 'token=webserverToken', reconnect: true});

    // Socket evens
    socketClient.on('connect', function(){ console.log('Connect to api')
        socketClient.on('reconnect_attempt', function() {
            console.log('connect attempted');
        });
        
        socketClient.on('disconnect', function(){
            console.log('Disconnected from api')
        });  

        socketClient.on('message', function(msg){
            console.log('incoming msg: ' + msg);
            messageController.recieveMessage(io, msg);
        }); 
    });
    
    return router;
}