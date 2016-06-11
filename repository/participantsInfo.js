var api = require('../modules/api');

module.exports = {
    getChildInformationList: function(req, res, callback){
        api.get('/user/' + req.session.userid + '/children?authToken=' + req.session.auth.auth_token, null, function(body){
            // Limit the list and format the dates
            body.forEach(function(participant) {
                var filteredNotes = [];
                if (participant.notes) {
                    var i = 0;
                    participant.notes.forEach(function(note) {
                        if (note.date) {
                            // Only show 5 notes
                            if (i++ > 5) return;
                            
                            filteredNotes.push(note);
                        }
                    });
                }
                if (filteredNotes.length > 0) {
                    filteredNotes.forEach(function(note) {
                        if (note.date.length === 24) {
                            // In:  2016-06-10T22:00:00.000Z
                            // Out: 2016-06-10 22:00:00
                            note.date = note.date.substring(0, note.date.length - 5).replace('T', ' ');
                        }
                    });
                }
                participant.notes = filteredNotes;
            });
            callback(body);
        }, function(error){        
            if (error.status_code === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                if (error.status_code === 500 && error.message === 'Deze token is niet valid') {
                    return res.redirect('/sessieAfgelopen');
                }
                console.log('user retrieved failed', error);
            }
            callback(null);
        });
    },
    
};
