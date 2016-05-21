var request = require('request');
//var config = require('../modules/config');
var api = require('../modules/api');

module.exports = {
    // Return the list below
    getMessages: function(username){
        
        api.get("/messages", '', function(body){
            console.log('message retrieved succes', body);
        }), function(body){
            console.log('message retrieved failed', body);
        };
        
        
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
        
        var url = "/message";
        api.post("/message", '', data, function(body){
            console.log('message send succes', body);
        }, function(body){
            console.log('message send failed', body);
        });
          
        // // Send reqeust to api
        // var url = config.api_host + "/message"
        // request({
        //     url: url,
        //     method: "POST",
        //     json: true,  
        //     body: data
        // }, function (error, response, body){
        //     if (error) {console.log("error with sending: ", oerr, response.body);}
        //     // else message send          
        // });
    }
};

var messages = [
    {from: 'geert', to: 'piet', msg: 'hoi1', date: 1462982483357},
    {from: 'geert', to: 'piet', msg: 'hoi2', date: 1462982483358},
    {from: 'geert', to: 'piet', msg: 'hoi3', date: 1462982483359},
    {from: 'geert', to: 'piet', msg: 'hoi4', date: 1462982483356},
    {from: 'geert', to: 'piet', msg: 'hoi5', date: 1462982483354},
    {from: 'geert', to: 'piet', msg: 'hoi6', date: 1462982483353},
];
    
