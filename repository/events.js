var request = require('request');
var api = require('../modules/api');

var messages = [];

module.exports = {
    getEvents: function(req, res, callback){     
        api.get('/events/?authToken=' + req.session.auth.auth_token, null, function(body){          
            return callback(body);
        }, function(error){
            // Token expires afther 1 day
            if (error.status_code === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('events retrieved failed', error);
            }
            return callback(null);
        });    
    }, getActivities: function(req, res, id, callback){     
        api.get('/events/' + id + '?status=active&authToken=' + req.session.auth.auth_token, null, function(body){          
            setDatePrototypes();
            var oldEvents = [];
            var upcommingEvents = [];
            var currentDate = new Date();
            
            // Convert all the dates
            body.forEach(function(eventDay){
                var date = new Date(eventDay.date); 
                var day = date.getDayName();
                var month = date.getMonthName();
                eventDay.date = day + " " + date.getDate() + " " + month;
                if (eventDay.activities != undefined) {
                    eventDay.activities.forEach(function(activity){ 
                        var date2 = new Date(activity.time); 
                        activity.time = date2.getHours() + ":" + date2.getMinutes();
                    });
                }
                
                // Split in old and upcommingEvents               
                if (currentDate > date){
                    oldEvents.push(eventDay);
                } else {
                    upcommingEvents.push(eventDay);
                }
            });
            
            return callback(oldEvents, upcommingEvents);
        }, function(error){
            // Token expires afther 1 day
            if (error.status_code === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('event activities retrieved failed', error);
            }
            return callback(null);
        });    
    },
};

setDatePrototypes = function(){
    var days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

    var months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

    // Set prototypes for easy access getting date
    Date.prototype.getMonthName = function(){
        return months[this.getMonth()];
    };
    Date.prototype.getDayName = function(){
        return days[this.getDay()];
    };
};
