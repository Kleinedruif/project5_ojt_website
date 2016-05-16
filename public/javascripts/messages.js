$(document).ready(function() {

   $('#sendMsgBtn').on('click', function(){
        var sendTo = $('#sendToField').val();
        var msg = $('#msgField').val();
        var csrf = $('#csrf').val();
        var data = {name: sendTo, msg: msg, _csrf: csrf};   
        
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
        });
    });
});


function addNewMessage(message){
    $("#messageList").prepend("<li class='list-group-item'>" + message.from + ": " + message.msg + "</li>")
}