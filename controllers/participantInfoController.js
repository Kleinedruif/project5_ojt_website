var participantRepo = require('../repository/participantsInfo');
var mainController = require('./mainController');

module.exports = {
    // Retrieve participants page
    getChildInformationPage: function(req, res, next){
        var childId = parseInt(req.params.id);
        // Check if a id is stored when on childID = 0
        if (childId == 0 && req.session.selectedChild !== undefined && req.session.selectedChild.id != 0){
            childId = req.session.selectedChild.id;
        }
        // This needs to be retrieved from the session somewhere
        var hardcodeParentId = 4;
        
        participantRepo.getChildInformationList(hardcodeParentId, function(childInformationList){
            // Default firstchild of the list           
            var information;
            
            if (childInformationList != null){
                if (childId == 0){
                    // On id 0, take first child
                    information = childInformationList[0];
                } else {
                    // Retrieve the child by id from list
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
            // Render participantInfo page
            mainController.render('participantInfo', req, res, {pageRoute: 'participantInfo', data: information, childs: childInformationList });
        });    
    }
};


