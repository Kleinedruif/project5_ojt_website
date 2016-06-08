$(document).ready(function() {
    bindSortButtons();
});

function bindSortButtons(){  
    var deelnemer = '';
    if (location.search.split('deelnemer=')[1] != undefined)
        deelnemer = location.search.split('deelnemer=')[1];

    $('#selectSort').on('change', function() {
        location.href = '/ranglijst?sorteer=' + this.value + '&geslacht=' + $('#selectGender option:selected').val() + "&deelnemer=" + deelnemer;
    });
    
    $('#selectGender').on('change', function() {
        location.href = '/ranglijst?sorteer=' + $('#selectSort option:selected').val() + '&geslacht=' + this.value + "&deelnemer=" + deelnemer;
    });
}
