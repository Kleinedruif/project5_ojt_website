var request = require('request');
var api = require('../modules/api');

var messages = [];

module.exports = {
    getEvents: function(req, res, callback){     
        api.get('/events/?authToken=' + req.session.auth.auth_token, null, function(body){          
           console.log(body);
            
            return callback(body);
        }, function(error){
            // Token expires afther 1 day
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('message retrieved failed', error);
            }
            return callback(null);
        });    
    }, getActivities: function(req, res, id, callback){     
        api.get('/events/' + id + '?status=active&authToken=' + req.session.auth.auth_token, null, function(body){          
            console.log(body);
            setDatePrototypes();
            
            // Convert all the dates
            body.forEach(function(eventDay){
                var date = new Date(eventDay.date); 
                var day = date.getDayName();
                var month = date.getMonthName();
                eventDay.date = day + " " + date.getDate() + " " + month;
                if (eventDay.activities != undefined)
                    eventDay.activities.forEach(function(activity){ 
                        var date2 = new Date(activity.time); 
                        activity.time = date2.getHours() + ":" + date2.getMinutes();
                    });
            });
            
            return callback(body);
        }, function(error){
            // Token expires afther 1 day
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('message retrieved failed', error);
            }
            return callback(null);
        });    
    },
};


setDatePrototypes = function(){
    var days = ['Zondag', 'Maandag', 'Disndag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

    var months = ['Januarie', 'Februarie', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
};
