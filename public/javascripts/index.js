$(document).ready(function() {
    console.log("ready!");

    var socketToken = $("#socketToken").html();
    console.log(socketToken);
    /*
    var username = sessionStorage.getItem('username');
    console.log(username);
    if (username == null){
        username = 'alwaysLoggedInOn!';
    }*/
    //var socket = io.connect({query: 'token=' + username, secure: true, reconneting: true});
// secure: true, 'force new connection': true

    if (socketToken != ''){
        var socket = io({query: 'token=' + socketToken, secure: true, reconneting: true});

        console.log(Date.now());

        socket.on('connect', function(){
            console.log('succes');
            // socket connected
            // similar behavior as an HTTP redirect
            //window.location.replace("/berichten/");
        });   

        socket.on('message', function(msg){
            console.log('incoming msg: ' + msg);
            var count = $("#msgCount").html();
            $("#msgCount").html() = counter++;
            alert('new message');
            // socket connected
            // similar behavior as an HTTP redirect
            //window.location.replace("/berichten/");
        }); 
        
        socket.on('error', function(reason){
            console.error('Unable to connect Socket.IO', reason);
        });
    }
});
