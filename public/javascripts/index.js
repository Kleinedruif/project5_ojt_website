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
        console.log();
        var childId = $(object).attr('ref');
        
          $.ajax({
            type: 'GET',
            url: '/ranglijst/' + childId,
            dataType: 'JSON'
        }).done(function(response) {
            if (response != null && response.length > 0){
                // Check if there is a thirt
                $(object).append(response[0].score);
                
                var imgUrl = null;
                if (response[0].shirt == 'yellow'){
                    imgUrl = '../images/shirts/yellow.svg.png';
                } else if (response[0].shirt == 'dots'){
                    imgUrl = '../images/shirts/polkadot.svg.png';
                } else if (response[0].shirt == 'rainbow'){
                    imgUrl = '../images/shirts/rainbow.svg.png';
                } else if (response[0].shirt == 'white'){
                    imgUrl = '../images/shirts/white.svg.png';
                }
                
                if (imgUrl) $(object).append(" <img class='shirtImg rankingsPage' src='" + imgUrl + "'>");
                
                $('.rankingsPage').on('click', function(){
                    console.log('test');
                    location.href = '/ranglijst/?highlight=' + childId;
                });
            }
        });       
    });
}