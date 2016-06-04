var participantRepo = require('../repository/participantsInfo');
var mainController = require('./mainController');
var api = require('../modules/api');

module.exports = {
    getChildInformationPage: function(req, res, next){
        var childId = parseInt(req.params.id);

        // Check if a id is stored when on childID = 0
        if (childId == 0 && req.session.selectedChild !== undefined && req.session.selectedChild.id != 0){
            childId = req.session.selectedChild.id;
        }
        
        participantRepo.getChildInformationList(req, res, function(childInformationList){       
            var information;

            if (childInformationList != null && childInformationList.length > 0){
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


