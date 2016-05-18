var mainController = require('./mainController');
var messageRepo = require('../repository/messages');
var request = require('request');

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

// // Register new socket afther being created
// exports.registerSocket = function(req){
//     tokenList[req.session.socketToken] = { username: req.session.username };
// }

// When news messages comes in, this will handle it
exports.recieveMessage = function(io, data){
    var nameTo = data.to;
    if (connectionList[data.to] != undefined){
        console.log(connectionList[nameTo]);
        var socketId = connectionList[nameTo].socketId;
        if (io.sockets.connected[socketId]) {
            io.sockets.connected[socketId].emit('message', data);
        }
    }
}

// Send message to the server
exports.sendMessage = function(io){
    return function(req, res, next) {
        var errors = {};
        // Check if form filled corretly
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
        
        // Create request
        var data = {from: req.session.username, to: req.body.name, msg: req.body.msg, date: Date.now()};
        // Temp
        messageRepo.addMessage(data);
        
        // Send message to api via repo
        messageRepo.sendMessage(data);
        return res.json({msg: 'succes', csrf: req.session.csrf});   
    };
};


