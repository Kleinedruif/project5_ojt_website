$(document).ready(function() {
    bindSortButton();
});

function bindSortButton(){
    
    $('#selectSort').on('change', function() {
        location.href = '/ranglijst/?sorteer=' + this.value + '&geslacht=' + $('#selectGender option:selected').val();
    });
    
    $('#selectGender').on('change', function() {
        location.href = '/ranglijst/?sorteer=' + $('#selectSort option:selected').val() + '&geslacht=' + this.value;
    });
}
