$(document).ready(function() {

    $('.messageBox').scrollTop($(document).height());

    $('#sendMsgBtn').on('click', function(){
        var msg = $('#msgField').val();
        var csrf = $('#csrf').val();
        var data = {msg: msg, _csrf: csrf};   
        
        $('#messageList').append("<div class='panel col-md-12 messagePanel'><div class='col-md-12 row panel-body message ownMessage'>" + msg + "</div></div>");
        
        $.ajax({
            type: 'POST',
            data: data,
            url: '/berichten/',
            dataType: 'JSON'
        }).done(function(response) {
            // Retrieve new csrf for next message
            $('#csrf').val(response.csrf);
            $('#msgField').val('');
        });
    });
    
    $('.contactPanel').on('click', function(){
        var userid = $(this).attr('ref');
        location.href = '/berichten/' + userid;
    })
    
    $.ajax({
        type: 'GET',
        url: '/contacten/',
        dataType: 'JSON'
    }).done(function(response) {
        // Loop over all elements
        response.list.forEach(function(element) {
            // Cant add yourself to the list
            if (element.userid != response.userid)
                // Add new contacts to list
                $('#newContactList').append("<option value='" + element.userid + "' data-subtext='" + element.name + "'>" + element.first_name + " " + element.last_name + "</option>");
        });

        // Refresh the list
        $('#newContactList').selectpicker('refresh');;
    });  
    
    $('#startChat').on('click', function(){
        var role = $('#newContactList option:selected').attr('data-subtext');
        var contactId = $('#newContactList option:selected').val();
        var contactName = $('#newContactList option:selected').text();
        
        // Redirect to start new chat
        location.href = '/contacten/' + contactId + "?role=" + role + "&contactName=" + contactName;
    });
    
   // addNewMessage({body: 'test', userid: 4, reciever});
;});

function addNewMessage(message){
    $('#messageList').append("<div class='panel col-md-12 messagePanel'><div class='col-md-12 row panel-body message recievedMessage'>" + message.body + "</div></div>");
}