var mainController = require('./mainController');
var messageRepo = require('../repository/messages');
var request = require('request');

/*
var redis = require("redis"),
    client = redis.createClient();
*/
//https://github.com/NodeRedis/node_redis
//http://stackoverflow.com/questions/6186305/using-redis-giving-error
// Kan ook met redit maar dan moet er ook een redis server draaien
       /*
       
        // Promote this socket as master
        socket.on("I'm the master", function() {

            // Save the socket id to Redis so that all processes can access it.
            client.set("mastersocket", socket.id, function(err) {
            if (err) throw err;
                console.log("Master socket is now" + socket.id);
            });
        });

        socket.on("message to master", function(msg) {

            // Fetch the socket id from Redis
            client.get("mastersocket", function(err, socketId) {
            if (err) throw err;
                io.sockets.socket(socketId).emit(msg);
            });
        });
*/

// Stores all the connections and tokens
var connectionList = {};

// Add connection
exports.addConnection = function(username, socketId){
    return connectionList[username] = { socketId: socketId };
}

// Remove conection
exports.removeConnection = function(username){
    return delete connectionList[username]; 
}

// Get message page
exports.getMessagePage = function(){
    return function(req, res, next) {      
        return mainController.render('messages', req, res, {pageRoute: 'messages', messages: messageRepo.getMessages(req.session.username) });      
    };
};

// Get total message from users
exports.getMessageCount = function(){
    return function(req, res, next) {   
        // Needs to be unread messages eventually    
        req.msgCount = messageRepo.getMessageCount(req.session.username);
        return next();        
    };
};

exports.registerSocket = function(req){
    tokenList[req.session.socketToken] = { username: req.session.username };
}

// When news messages comes in, this will handle it
exports.recieveMessage = function(io, data){
    var nameTo = data.to;
    console.log('message recieved?');
    console.log(connectionList);
    if (connectionList[data.to] != undefined){
        console.log(connectionList[nameTo]);
        var socketId = connectionList[nameTo].socketId;
        if (io.sockets.connected[socketId]) {
            io.sockets.connected[socketId].emit('message', data.msg);
        }
    }
}

// Send message to the server
exports.sendMessage = function(io){
    return function(req, res, next) {
        
        console.log('to: ' + req.body.name);
        console.log('msg: ' + req.body.msg);
        
        var errors = {};
        if (!req.body.hasOwnProperty('name') || req.body.name.trim() == '') {
            errors.name = 'Vul alstublieft een naam in.';
        }
        if (!req.body.hasOwnProperty('msg') || req.body.msg.trim() == '') {
            errors.message = 'Vul alstublieft een bericht in.';
        }
        
        if (Object.keys(errors).length > 0) {
            req.flash('errors', errors);
            return res.redirect('/berichten');
        }
        
        var data = {from: req.session.username, to: req.body.name, msg: req.body.msg, date: Date.now()}
        messageRepo.addMessage(data);
        
        var url = "http://localhost:3000/message"
        request({
            url: url,
            method: "POST",
            json: true,  
            body: data
        }, function (error, response, body){
            console.log(response.body);
        });

        return res.redirect("/berichten");       
    };
};


