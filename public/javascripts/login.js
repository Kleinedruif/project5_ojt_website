$(document).ready(function() {       
    $('#username').on('input', function() {
        sessionStorage.setItem('username', $('#username').val());
    });
});
