$(document).ready(function() {

   $('#sendMsgBtn').on('click', function(){
        var sendTo = $('#sendToField').val();
        var msg = $('#msgField').val();
        var title = $('#sendTitleField').val();
        var csrf = $('#csrf').val();
        var data = {name: sendTo, title: title, msg: msg, _csrf: csrf};   
        
        $.ajax({
            type: 'POST',
            data: data,
            url: '/berichten/',
            dataType: 'JSON'
        }).done(function(response) {
            // Retrieve new csrf for next message
            $('#sendToField').val('');
            $('#csrf').val(response.csrf);
            $('#msgField').val('');
            $('#sendTitleField').val('');
        });
    });
});

function addNewMessage(message){
    $('#messageList').prepend("<li class='list-group-item'>" + message.sender_guid + ": " + message.title + " " + message.body + "</li>")
}