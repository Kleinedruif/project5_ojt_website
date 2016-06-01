$(document).ready(function() {
    bindIcons();
    getScore();   
});

function bindIcons(){
    $('.messageTeamleader').on('click', function(){
        var teamleaderId = $(this).attr('ref');
        location.href = '/berichten/' + teamleaderId;
    });
    
    $('.childInfoPage').on('click', function(){
        var childId = $(this).attr('ref');
        location.href = '/deelnemers/' + childId;
    });     
}

function getScore(){
     $('.scoreTD').each(function(index, object) {
        var childId = $(object).attr('ref');
        
          $.ajax({
            type: 'GET',
            url: '/ranglijst/' + childId,
            dataType: 'JSON'
        }).done(function(response) {
            if (response != null && response.length > 0){
                // Check if there is a thirt
                $(object).append(response[0].score);
                
                var imageName = null;
                switch(response[0].shirt){
                    case 'yellow': imageName = 'yellow'; break;
                    case 'dots': imageName = 'polkadot'; break;
                    case 'rainbow': imageName = 'rainbow'; break;
                    case 'white': imageName = 'white'; break;
                }
                
                if (imageName) $(object).append(" <img class='shirtImg rankingsPage' src='../images/shirts/" + imageName + ".svg.png'>");
                
                $('.rankingsPage').on('click', function(){
                    location.href = '/ranglijst/?deelnemer=' + childId;
                });
            }
        });       
    });
}