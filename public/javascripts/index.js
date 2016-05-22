$(document).ready(function() {
    var socketToken = $('#socketToken').html();

    if (socketToken != ''){
        // Host is not secure yet... connection is nog wss or secure is still on false
        var socket = io({query: 'token=' + socketToken, secure: true, reconneting: true});

        socket.on('connect', function(){
            //console.log('succes');
        });   

        socket.on('message', function(body){
            var count = $('#msgCount').html();
            $('#msgCount').html(parseInt(count) + 1)      
            
            if (typeof(addNewMessage) === typeof(Function)){
                console.log('New message added');
                addNewMessage(body);
            } else {
                alert('Nieuw bericht in inbox');
            }
        }); 
        
         socket.on('disconnect', function() {
            //console.log('Got disconnect!');
        });
        
        socket.on('error', function(reason){
            if (reason == 'Not authorized'){
                window.location.replace('/sessieAfgelopen/');
            } else {
                console.error('Unable to connect Socket.IO', reason);
            }
        });
    }
});
