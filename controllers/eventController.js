var eventsRepo = require('../repository/events');
var mainController = require('./mainController');
var api = require('../modules/api');

module.exports = {
    getEventsPage: function(req, res, next){
       
        eventsRepo.getEvents(req, res, function(events){       
           
            if (events == null) return mainController.render('events', req, res, {pageRoute: 'events', eventMsg: "Er zijn geen activiteiten bescikbaar"});
            var currentEventId;
            
            events.forEach(function(event){
                // Pick an active event
                if (event.status == 'active'){
                    currentEventId = event.guid;
                }
            });
            
            if (currentEventId != null){
                eventsRepo.getActivities(req, res, currentEventId, function(oldActivities, upcommingActivities){
                        // Render events page
                        return mainController.render('events', req, res, {pageRoute: 'events', oldActivities: oldActivities, upcommingActivities: upcommingActivities});
                });
            } else {
                mainController.render('events', req, res, {pageRoute: 'events'});
            }     
        });    
    }
};


