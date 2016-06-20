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
                if (conversations == null){
                    conversations = [];
                }
                
                var chatId = req.params.id;
                var messages = [];

                if (conversations[chatId] != undefined){
                    messages = conversations[chatId].messages
                } else {
                    conversations[chatId] = {
						name: req.query.contact_naam, 
						id: req.query.contactId, 
						role: req.query.rol, 
						messages: [],
                        readOnly: false 
					};
                }                   
                    
                if (chatId == req.session.userid)
                    return res.redirect('/berichten');
                    
                req.session.chatId = chatId;  

				return mainController.render('messages', req, res, 
					{
						pageRoute: 'messages', 
						conversations: conversations, 
						messages: messages, 
						chatid: chatId, 
						ownid: req.session.userid,
						readOnly: false  
					}
				);
            });        
        };
    },

    // Get message page
    getMessagePage: function(){
        return function(req, res, next) {    
            messageRepo.getMessages(req, res, function(conversations){
                if (conversations == null) conversations = [];
                
                var chatId = null;
                var messages = [];

                if (conversations.length != 0){
					chatId = req.params.id != undefined ? req.params.id : Object.keys(conversations)[0];
                
                    var messages = [];
                    if (conversations[chatId] != undefined){
                        messages = conversations[chatId].messages
                    } 
                }
 
                if (chatId == req.session.userid) return res.redirect('/berichten');

                req.session.chatId = chatId;  

				return mainController.render('messages', req, res, {
					pageRoute: 'messages', 
					conversations: conversations, 
					messages: messages, 
					chatid: chatId, 
					ownid: req.session.userid,
					readOnly: false 
				});
            });
        };
    },
    
    getContactList: function(){
        return function(req, res, next) {    
            messageRepo.getContacts(req, res, function(contacts){
                if (contacts == null) contacts = [];
       
                res.json({
					list: contacts, 
					userid: req.session.userid
				});
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
        };
    }
}
