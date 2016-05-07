$(document).ready(function() {
    console.log("ready!");

    bindSortButton();
});

function bindSortButton(){
    $('#sortButton').on('click', function(){
        location.href = '/ranglijst/?sorteer=' + $('#selectSort option:selected').val() + '&geslacht=' + $('#selectGender option:selected').val();
    });
}
