$(document).ready(function() {
    bindSortButtons();
});

function bindSortButtons(){  
    var highlight = '';
    if (location.search.split('highlight=')[1] != undefined)
        highlight = location.search.split('highlight=')[1];

    $('#selectSort').on('change', function() {
        location.href = '/ranglijst/?sorteer=' + this.value + '&geslacht=' + $('#selectGender option:selected').val() + "&highlight=" + highlight;
    });
    
    $('#selectGender').on('change', function() {
        location.href = '/ranglijst/?sorteer=' + $('#selectSort option:selected').val() + '&geslacht=' + this.value + "&highlight=" + highlight;
    });
}
