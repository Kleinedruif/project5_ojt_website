module.exports = {
    // Return the list below
    getMessages: function(username){
        var filteredMessages = [{}];
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
    addMessage: function(msg){
        messages.push(msg);
    },
    // Get ammount of messages (will be unread eventually)
    getMessageCount: function(username){
        var count = 0;
        messages.forEach(function(element) {
            if (element.to == username)
                count++;
        }, this);
        return count;
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
    
