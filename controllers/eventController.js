var eventsRepo = require('../repository/events');
var mainController = require('./mainController');
var api = require('../modules/api');

module.exports = {
    getEventsPage: function(req, res, next){
       
        eventsRepo.getEvents(req, res, function(events){       
           
           var currentEventId;
           
           events.forEach(function(event){
               if (event.status == 'active'){
                   currentEventId = event.guid;
               }
           });
           
           if (currentEventId != null){
               eventsRepo.getActivities(req, res, currentEventId, function(activities){
                    // Render events page
                    mainController.render('events', req, res, {pageRoute: 'events', events: activities});
               });
           } else {
                // Render events page
                mainController.render('events', req, res, {pageRoute: 'events', eventMsg: "Er zijn geen activiteiten bescikbaar"});
        
           }          
        });    
    }
};


