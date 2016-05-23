var express = require('express');
var router = express.Router();
var clientIo = require('socket.io-client');
var socketioJwt = require('socketio-jwt');
var ursa = require('ursa');
var fs = require('fs');

var auth = require('../modules/auth');
var config = require('../modules/config');
var messageController = require('../controllers/messageController');

module.exports = function(io) {   
    
    // Check all the incoming sockets and authorize them
    io.set('authorization', socketioJwt.authorize({
        secret: config.socket_secret,
        handshake: true
    }));
    
    // Socket connection to clients
    io.sockets.on('connection', function(socket) {
        messageController.addConnection(socket.client.request.decoded_token.userid, socket.id);      
        socket.on('disconnect', function(){
            messageController.removeConnection(socket.client.request.decoded_token.userid)
        });
    });

    // Create key object
    var key = ursa.createPublicKey(fs.readFileSync('./public_key.pem'));
    // Encrypt token
    var webToken = key.encrypt(config.socket_client_token, 'utf8', 'base64');

    // Create socket client for the server to connect to the api
    var socketClient = clientIo.connect('http://localhost:3000/', {query: 'token=' + webToken, reconnect: true, secure: true});

    // Socket evens
    socketClient.on('connect', function(){ console.log('Connect to api')
        socketClient.on('reconnect_attempt', function() {
            console.log('connect attempted');
        });
        
        socketClient.on('disconnect', function(){
            console.log('Disconnected from api');
        });  
        
        socketClient.on('event', function(){
            console.log('some event came in');
        });  

        socketClient.on('message', function(data){
            console.log('new message recieved');
            messageController.recieveMessage(io, data);
        }); 
    });
    
    return router;
}


