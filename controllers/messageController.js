var mainController = require('./mainController');
var messageRepo = require('../repository/messages');

// Stores all the connections and tokens
var connectionList = {};

module.exports = {
        
    // Add connection
    addConnection: function(userid, socketId){
        return connectionList[userid] = { socketId: socketId };
    },

    // Remove conection
    removeConnection: function(userid){
        return delete connectionList[userid]; 
    },

    // Get message page
    getMessagePage: function(){
        return function(req, res, next) {    
            messageRepo.getMessages(req.session.userid, function(messages){
                if (messages == null){
                    messages = [];
                }
                return mainController.render('messages', req, res, {pageRoute: 'messages', messages: messages });      
            });       
        };
    },

    // Get total message from users
    getMessageCount: function(){
        return function(req, res, next) {   
            // Needs to be unread messages eventually    
            req.msgCount = messageRepo.getMessageCount(req.session.userid);
            return next();        
        };
    },

    // When news messages comes in, this will handle it
    recieveMessage: function(io, data){
        var userid = data.receiver_guid;
        if (connectionList[userid] != undefined){
            // Retrieve socket id
            var socketId = connectionList[userid].socketId;
            if (io.sockets.connected[socketId]) {
                // Emit the message to the user with the id
                io.sockets.connected[socketId].emit('message', data);
            }
        }
    },

    // Send message to the server
    sendMessage: function(io){
        return function(req, res, next) {
            var errors = {};
            // Check if form filled corretly
            if (!req.body.hasOwnProperty('name') || req.body.name.trim() == '') {
                errors.name = 'Vul alstublieft een naam in.';
            }
            if (!req.body.hasOwnProperty('msg') || req.body.msg.trim() == '') {
                errors.message = 'Vul alstublieft een bericht in.';
            }
            
            if (!req.body.hasOwnProperty('title') || req.body.title.trim() == '') {
                errors.message = 'Vul alstublieft een title in.';
            }
            
            if (Object.keys(errors).length > 0) {
                req.flash('errors', errors);
                return res.redirect('/berichten');
            }
            
            // hardcode send to self id
            var hardcodeId = 4;
            var data = {senderId: req.session.userid, receiverId: hardcodeId, body: req.body.msg, title: req.body.title, date: Date.now()};
            // Create request
            //var data = {from: req.session.username, to: req.body.name, body: req.body.msg, date: Date.now()};
            // Temp
            //messageRepo.addMessage(data);
            
            // Send message to api via repo
            messageRepo.sendMessage(data);
            return res.json({msg: 'succes', csrf: req.session.csrf});   
        };
    }
}
