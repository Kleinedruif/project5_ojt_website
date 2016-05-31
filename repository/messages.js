var request = require('request');
var api = require('../modules/api');

var messages = [];

module.exports = {
    getMessages: function(userid, callback){     
        api.get('/messages/' + userid, null, function(body){          
            var conversations = {};

            // Filter the conversations
            body.forEach(function(element) {
                if (conversations[element.sender_guid] != undefined && element.sender_guid != userid){
                     conversations[element.sender_guid].messages.push(element);
                } else if (conversations[element.receiver_guid] != undefined && element.receiver_guid != userid){
                     conversations[element.receiver_guid].messages.push(element);
                } else {
                    if (element.receiver_guid == userid){
                        conversations[element.sender_guid] = {name: element.sendFName + " " + element.sendLName, id: element.sender_guid, role: element.sendRole, messages: [element]};
                    } else {
                        conversations[element.receiver_guid] = {name: element.recFName + " " + element.recLName, id: element.receiver_guid, role: element.recRole, messages: [element]};
                    }               
                }
             
            }, this);
            
            return callback(conversations);
        }, function(body){
            console.log('message retrieved failed', body);
            return callback(null);
        });    
    },
    getContacts: function(role, callback){                    
        api.get('/messages/' + role + '/contacts', null, function(body){
            callback(body);
        }, function(body){
            console.log('contactlist retrieved failed', body);
            callback(null);
        });    
    },
    sendMessage: function(data){       
        // Callback is via socket connection
        api.post('/messages/', null, data, function(body){
        }, function(body){
            console.log('message send failed', body);
        });       
    }
};
