var request = require('request');
var api = require('../modules/api');

var messages = [];

module.exports = {
    getMessages: function(req, res, callback){     
        api.get('/messages/' + req.session.userid  + '?authToken=' + req.session.auth.auth_token, null, function(body){          
            var conversations = {};

            // Filter the conversations
            body.forEach(function(element) {
                if (conversations[element.sender_guid] != undefined && element.sender_guid != req.session.userid){
                     conversations[element.sender_guid].messages.push(element);
                } else if (conversations[element.receiver_guid] != undefined && element.receiver_guid != req.session.userid){
                     conversations[element.receiver_guid].messages.push(element);
                } else {
                    if (element.receiver_guid == req.session.userid){
                        conversations[element.sender_guid] = {name: element.sendFName + " " + element.sendLName, id: element.sender_guid, role: element.sendRole, messages: [element]};
                    } else {
                        conversations[element.receiver_guid] = {name: element.recFName + " " + element.recLName, id: element.receiver_guid, role: element.recRole, messages: [element]};
                    }               
                }
             
            }, this);
            
            return callback(conversations);
        }, function(error){
            // Token expires afther 1 day
            if (error.status_code === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('message retrieved failed', error);
            }
            return callback(null);
        });    
    },
    getContacts: function(req, res, callback){                    
        api.get('/messages/' + req.session.auth.role_name + '/contacts?authToken=' + req.session.auth.auth_token, null, function(body){
            callback(body);
        }, function(error){          
            // Token expires afther 1 day
            if (error.status_code === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('contactlist retrieved failed', error);
            }
            callback(null);
        });    
    },
    sendMessage: function(req, res, data){       
        // Callback is via socket connection
        api.post('/messages?authToken=' + req.session.auth.auth_token, null, data, function(body){
        }, function(error){
            if (error.status_code === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('message send failed', error);
            }
        });       
    }
};
