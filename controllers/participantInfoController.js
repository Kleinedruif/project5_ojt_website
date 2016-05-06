var participantRepo = require('../repository/participantsInfo');
var mainController = require('./mainController');

module.exports = {
    // Retrieve participants page
    getChildInformationPage: function(req, res, next){
        var childId = req.params.id;
        var childInformationList = participantRepo.getChildInformationList();
        var information;
        
        if (childId == '0'){
            // Check if id is already stored
            if (req.session.selectedChild !== undefined && req.session.selectedChild.id !== '0'){
                // Find the child with the id
                childInformationList.forEach(function(element) {
                    if (element.id == req.session.selectedChild.id){
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
                if (element.id == childId){
                    information = element;
                }
            }, this);
        }

        // Save the information in the session
        var name = information.firstName + " " + information.lastName;
        req.session.selectedChild = {id: childId, name: name};

        // Render the page
        // pageRoute - needed to show in menu bar what page is active
        // logedIn is if logedin or not to show login form or logout button
        // childlist shows the dropdown menu with all the childs, hold dummy data with name and id
        // information is array holding all the childs information
        // selectedChild is the child selected, holds name and id
        mainController.render('data', req, res, {pageRoute: 'data', data: information, childs: childInformationList });
    }
};


