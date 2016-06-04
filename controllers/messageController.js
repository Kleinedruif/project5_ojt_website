var mainController = require('./mainController');
var messageRepo = require('../repository/messages');

// Stores all the connections and tokens
var connectionList = {};

module.exports = {
        
    // Add a socket connection
    addConnection: function(userid, socketId){
        return connectionList[userid] = { socketId: socketId };
    },

    // Remove a socket conection
    removeConnection: function(userid){
        return delete connectionList[userid]; 
    },

    newConverstation: function(){
         return function(req, res, next) {       
            messageRepo.getMessages(req, res, function(conversations){
                if (conversations == null || conversations.lenght == 0){
                    conversations = [];
                }
                
                var chatid = req.params.id;
                var messages = [];
                if (conversations[chatid] != undefined){
                    messages = conversations[chatid].messages
                } else {
                    conversations[chatid] = {name: req.query.contactName, id: req.query.contactId, role: req.query.role, messages: []};
                }               
                    
                req.session.chatId = chatid;  
                return mainController.render('messages', req, res, {pageRoute: 'messages', conversations: conversations, messages: messages, chatid: chatid, ownid: req.session.userid });      
            });        
        };
    },

    // Get message page
    getMessagePage: function(){
        return function(req, res, next) {    
            messageRepo.getMessages(req, res, function(conversations){
                if (conversations == undefined || conversations == null){
                    conversations = [];
                }
                
                var chatid = null;
                var messages = [];

                if (conversations.lenght != 0){
                    if (req.params.id != undefined){
                        chatid = req.params.id;
                    } else {
                        for (first in conversations) break;
                        chatid = first;
                    }
          
                
                    var messages = [];
                    if (conversations[chatid] != undefined){
                        messages = conversations[chatid].messages
                    } 
                }

                req.session.chatId = chatid;  
                return mainController.render('messages', req, res, {pageRoute: 'messages', conversations: conversations, messages: messages, chatid: chatid, ownid: req.session.userid });      
            });       
        };
    },
    
    getContactList: function(){
        return function(req, res, next) {    
            messageRepo.getContacts(req, res, function(contacts){
                if (contacts == null){
                    contacts = [];
                }
                var chatid;
       
                res.json({list: contacts, userid: req.session.userid});
           });       
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
            if (!req.body.hasOwnProperty('msg') || req.body.msg.trim() == '') {
                errors.message = 'Vul alstublieft een bericht in.';
            }

            if (Object.keys(errors).length > 0) {
                req.flash('errors', errors);
                return res.redirect('/berichten');
            }

            var data = {senderId: req.session.userid, receiverId: req.session.chatId, body: req.body.msg};
            
            // Send message to api via repo
            messageRepo.sendMessage(req, res, data);
            return res.json({msg: 'succes', csrf: req.session.csrf});   
        };
    }
}
