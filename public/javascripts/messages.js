$(document).ready(function() {
    sendMessage();
    retrieveContacts();
    startChat();
    openChat();  
    scrollMessageListToButton();
});

function scrollMessageListToButton(){
    
    // Scroll downn to list
    $('#messageList').scrollTop($('#messageList')[0].scrollHeight);
}

function openChat(){
    $('.contactPanel').on('click', function(){
        var userid = $(this).attr('ref');
        location.href = '/berichten/' + userid;
    })
}

function startChat(){
    $('#startChat').on('click', function(){
        var role = $('#newContactList option:selected').attr('data-subtext');
        var contactId = $('#newContactList option:selected').val();
        var contactName = $('#newContactList option:selected').text();
        
        // Redirect to start new chat
        location.href = '/contacten/' + contactId + "?role=" + role + "&contactName=" + contactName;
    });
}

function retrieveContacts(){
    $.ajax({
        type: 'GET',
        url: '/contacten/',
        dataType: 'JSON'
    }).done(function(response) {
        response.list.forEach(function(element) {
            // Cant add yourself to the list
            if (element.userid != response.userid){
                // Add new contacts to list
                $('#newContactList').append("<option value='" + element.userid + "' data-subtext='" + element.name + "'>" + element.first_name + " " + element.last_name + "</option>");
                scrollMessageListToButton();
            }
        });

        // Refresh the list
        $('#newContactList').selectpicker('refresh');;
    });    
    
}

function sendMessage(){
    $('#sendMsgBtn').on('click', function(){
        var msg = $('#msgField').val();
        var csrf = $('#csrf').val();
        var data = {msg: msg, _csrf: csrf};   

        $.ajax({
            type: 'POST',
            data: data,
            url: '/berichten/',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg == 'succes'){
                $('#messageList').append("<div class='panel col-md-12 messagePanel'><div class='col-md-12 row panel-body message ownMessage'>" + msg + "</div></div>");
                $('#msgField').val('');
                scrollMessageListToButton();
            }
            // Retrieve new csrf for next message
            $('#csrf').val(response.csrf);
        });
    });
}

function addNewMessage(message){
    $('#messageList').append("<div class='panel col-md-12 messagePanel'><div class='col-md-12 row panel-body message recievedMessage'>" + message.body + "</div></div>");
}