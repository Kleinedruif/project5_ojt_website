var eventsRepo = require('../repository/events');
var mainController = require('./mainController');
var api = require('../modules/api');

module.exports = {
    getEventsPage: function(req, res, next){
        // Retrieve all active evenets
        eventsRepo.getEvents(req, res, function(events){       
           
            if (events == null) return mainController.render('events', req, res, {pageRoute: 'events', eventMsg: "Er zijn geen activiteiten bescikbaar"});
            var currentEventId;
            
            for (var i = 0; i < events.length; i++) {
                if (events[i].status == 'active'){
                    currentEventId = events[i].guid;
                    break;
                } 
            }

            if (currentEventId != null){
                // Get the activities from an active evenets
                eventsRepo.getActivities(req, res, currentEventId, function(oldActivities, upcommingActivities){
                        // Render events page
                        return mainController.render('events', req, res, {pageRoute: 'events', oldActivities: oldActivities, upcommingActivities: upcommingActivities});
                });
            } else {
                mainController.render('events', req, res, {pageRoute: 'events', eventMsg: "Er zijn geen activiteiten bescikbaar"});
            }     
        });    
    }
};


