$(document).ready(function() {
    console.log("ready!");
    storeSelectedChild();
    bindButtons();
});

// Make sure the selected child is stored
function storeSelectedChild(){
    var childName = $('#childName').text(); 
    
    // This id is retrieved when on data screen
    var childId = $('#childId').text();
    
    // Check if name needs to be stores
    if (childName != undefined && childName != null && childName != ''){
        localStorage.setItem("childName", childName);
    } 
    // Else retrieve the new name and show it
    else if (localStorage.getItem("childName") != undefined && localStorage.getItem("childName") != null){
        $('#selectedChild').text(localStorage.getItem("childName"));
    }
    
    // Store the id of selected child 
    if (childId != undefined && childId != null && childId != ''){
        localStorage.setItem("childId", childId);
    } 
}

function bindButtons(){
    // When navigated to data, check if an child is already selected, if it is then load that child, else load default
    $("#navData").on('click', function(){
        if (localStorage.getItem("childId") != undefined && localStorage.getItem("childId") != null){
            window.location.href = "/data/" + localStorage.getItem("childId");
        } else {
            window.location.href = "/data/"
        }
    });
}