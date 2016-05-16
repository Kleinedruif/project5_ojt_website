var express = require('express');
var router = express.Router();
var clientIo = require("socket.io-client");
var socketioJwt = require('socketio-jwt');
var nodeRSA = require('node-rsa');

var auth = require('../modules/auth');
var config = require('../modules/config');
var messageController = require('../controllers/messageController');
var mainController = require('../controllers/mainController');


module.exports = function(io) {   
    
    // Check all the incoming sockets and authorize them
    io.set('authorization', socketioJwt.authorize({
        secret: config.socket_secret,
        handshake: true
    }));
    
    // Socket connection to clients
    io.sockets.on('connection', function(socket) {
        messageController.addConnection(socket.client.request.decoded_token.username, socket.id);      
        socket.on('disconnect', function(){
            messageController.removeConnection(socket.client.request.decoded_token.username)
        });
    });
 
    //var privateKey= '-----BEGIN RSA PRIVATE KEY-----MIICWwIBAAKBgHh98Cf+1FvtAJUOe8bvhDRmgsla72QH8j2jBzQC7T6UpBy6GGdq44rbJoHDjN8X2aMBBDalloUs8TsbV7P1jDdbEK6R8mrMdShASf8J5bu1BSTjnem/zeepni2dv2+DVYN4yBJjmqddWcFGhY5k0Bp4ZuDu7ZYSf8uj7psgbFR1AgMBAAECgYBkR+xoXR5Ao6+oXrWFjDJrqiWPj69NgY+K3PRRxV3Oh8dOYVOOPtfB6ULTHP1Rb3giweXP1WDA1favSsJjdCmNd/Lxwf2da6Zgg5/GGCGNxUqYKxA3mZWSPr6wHeArD811oA3JCg01tN+N0e/ZZwKnxR4crGgdJlaifqxMD7ZEAQJBAOq5OJ0ljJ3om2i+qus+917WMLtLTzAZZ4YIJSi9uEkYbOMEaWMWOhzz6J+iHmBsAheHmzvPhyd+Im3W3UvcwZECQQCDafa4uhjJrZwwh+dYNrJujNW3o+tknRcirjgVaLRfvw2CmVa8YGHTyQjbKmyuRnA0FnV8bPBJTve8cafFYXKlAkALlhcAUtEtHkVFl1vSfuoxCTugkygWhLqCeDZ1W2AUY5tEXXxiQr+dnECYWKVNNyenR69W9XiDb4t9hoSn8P6xAkAet6sjHOTkZ39l3K6X8RkePC9MoLVKLGoXAjA72OCorMjkqSEcIU9cqNY4HJ+Q0QgzNLi7n98+04WW994mhhO9AkEAqRatRy9qNbHRY+3Mbbw28RF1mvK7023On/LBgDmrJmBUj8v4KnuibYRkgGdk6jkVcAwZpcor0bPqcUVYDjIOLA==-----END RSA PRIVATE KEY-----'; 
    //var publicKey  = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHh98Cf+1FvtAJUOe8bvhDRmgsla72QH8j2jBzQC7T6UpBy6GGdq44rbJoHDjN8X2aMBBDalloUs8TsbV7P1jDdbEK6R8mrMdShASf8J5bu1BSTjnem/zeepni2dv2+DVYN4yBJjmqddWcFGhY5k0Bp4ZuDu7ZYSf8uj7psgbFR1AgMBAAE=-----END PUBLIC KEY-----"; 
    
    // Create encription key and encypt the token
    var key = new nodeRSA(config.socket_client_private_key);
    var webToken = key.encryptPrivate(config.socket_client_token, 'base64');

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

        socketClient.on('message', function(msg){
            console.log('incoming msg: ' + msg);
            messageController.recieveMessage(io, msg);
        }); 
    });
    
    return router;
}


