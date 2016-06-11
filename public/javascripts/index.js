$(document).ready(function() {
    bindIcons();
    getScore();   
});

function bindIcons(){
    $('.messageTeamleader').on('click', function(){
        var teamleaderId = $(this).attr('ref');
        if (teamleaderId != '')
            location.href = '/berichten/' + teamleaderId;
    });
    
    $('.childInfoPage').on('click', function(){
        var childId = $(this).attr('ref');
        if (childId != '')
            location.href = '/deelnemers/' + childId;
    });     
}

function getScore(){
     $('.individualScore').each(function(index, object) {
        var childId = $(object).attr('ref');
        if (childId != ''){
            $.ajax({
                type: 'GET',
                url: '/ranglijst/' + childId,
                dataType: 'JSON'
            }).done(function(response) {
                if (response != null){
                    // Check if there is a thirt
                    $(object).append("<span>"+response.score+"</span>");

                    if (response.shirt) $(object).append("<img ref='" + childId + "' class='shirtImg rankingsPage' src='../images/shirts/" + response.shirt + ".svg.png'>");
                    else $(object).append("<img ref='" + childId + "' class='shirtImg rankingsPage' src='../images/shirts/white.svg.png'>");
                    
                    $('#teamScore' + childId).append(response.team_score);
                    
                    $('.rankingsPage').on('click', function(){
                        location.href = '/ranglijst?deelnemer=' + childId;
                    });
                }
            });    
        }   
    });
}
