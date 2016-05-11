$(document).ready(function() {
    console.log("ready!");

    var username = sessionStorage.getItem('username');
    console.log(username);
    if (username == null){
        username = 'alwaysLoggedInOn!';
    }
    //var socket = io.connect({query: 'token=' + username, secure: true, reconneting: true});
// secure: true, 'force new connection': true

    var socket = io({query: 'token=' + username, secure: true, reconneting: true});

    console.log(Date.now());

    socket.on('connect', function(){
        console.log('succes');
        // socket connected
        // similar behavior as an HTTP redirect
        //window.location.replace("/berichten/");
    });   

    socket.on('message', function(msg){
        console.log('incoming msg: ' + msg);
        alert('new message');
        // socket connected
        // similar behavior as an HTTP redirect
        //window.location.replace("/berichten/");
    }); 
    
     socket.on('error', function(reason){
        console.error('Unable to connect Socket.IO', reason);
    });
});
