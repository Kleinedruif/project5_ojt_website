var request = require('request');
//var config = require('../modules/config');
var api = require('../modules/api');

module.exports = {
    // Return the list below
    getMessages: function(username){
        var hardcodeUserId = 4;
        
        // Waiting for functionalities from api
        api.get("/messages/" + hardcodeUserId, '', function(body){
            console.log('message retrieved succes', body);
        }, function(body){
            console.log('message retrieved failed', body);
        });    
        
        var filteredMessages = [];
        // Retrieve only messages with username
        messages.forEach(function(element) {
            if (element.to == username)
                filteredMessages.push(element);
        }, this);
        
        return filteredMessages.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });
    },
    // Add new message
    addMessage: function(msg){
        messages.push(msg);
    },
    // Get ammount of messages
    getMessageCount: function(username){
        var count = 0;
        messages.forEach(function(element) {
            if (element.to == username)
                count++;
        }, this);
        return count;
    }, sendMessage: function(data){     
        
        // Send message to api
        var url = "/message";
        api.post("/message", null, data, function(body){
            console.log('message send succes', body);
        }, function(body){
            console.log('message send failed', body);
        });       
    }
};
