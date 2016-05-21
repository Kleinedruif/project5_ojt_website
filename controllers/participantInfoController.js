var participantRepo = require('../repository/participantsInfo');
var mainController = require('./mainController');

module.exports = {
    // Retrieve participants page
    getChildInformationPage: function(req, res, next){
        var childId = req.params.id;
        
        // This needs to be retrieved from the session somewhere
        var hardcodeParentId = 4;
        
        participantRepo.getChildInformationList(hardcodeParentId, function(childInformationList){
            var information;
            
            if (childInformationList != null){
                if (childId == '0'){
                    // Check if id is already stored
                    if (req.session.selectedChild !== undefined && req.session.selectedChild.id !== '0'){
                        // Find the child with the id
                        childInformationList.forEach(function(element) {
                            if (element.guid == req.session.selectedChild.id){
                                information = element;
                            }
                        }, this);
                    } else {
                        // Default firstchild of the list
                        information = childInformationList[0];
                    }
                } else {
                    // Find the child with the id
                    childInformationList.forEach(function(element) {
                        if (element.guid == childId){
                            information = element;
                        }
                    }, this);
                }

                // Save the information in the session
                var name = information.first_name + " " + information.last_name;
                req.session.selectedChild = {id: childId, name: name};
            }
            // Render the page
            // pageRoute - needed to show in menu bar what page is active
            // logedIn is if logedin or not to show login form or logout button
            // childlist shows the dropdown menu with all the childs, hold dummy data with name and id
            // information is array holding all the childs information
            // selectedChild is the child selected, holds name and id
            mainController.render('participantInfo', req, res, {pageRoute: 'participantInfo', data: information, childs: childInformationList });
        });    
    }
};


