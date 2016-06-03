var request = require('request');
var api = require('../modules/api');

var messages = [];

module.exports = {
    getMessages: function(res, userid, authToken, callback){     
        api.get('/messages/' + userid  + '?authToken=' + authToken, null, function(body){          
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
        }, function(error){
            // Token expires afther 1 day
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('message retrieved failed', error);
            }
            return callback(null);
        });    
    },
    getContacts: function(res, role, authToken, callback){                    
        api.get('/messages/' + role + '/contacts?authToken=' + authToken, null, function(body){
            callback(body);
        }, function(error){          
            // Token expires afther 1 day
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('contactlist retrieved failed', error);
            }
            callback(null);
        });    
    },
    sendMessage: function(res, data, authToken){       
        // Callback is via socket connection
        api.post('/messages?authToken=' + authToken, null, data, function(body){
        }, function(error){
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('message send failed', error);
            }
        });       
    }
};
