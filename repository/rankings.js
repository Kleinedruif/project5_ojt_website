var api = require('../modules/api');

module.exports = {
    getSortedRankings: function(res, sortOrder, sortGender, deelnemer, authToken, callback){   
        var defaultReturn = { participantsRanking: [], teamRanking: [], genderRanking: []};
                  
        api.get('/ranking?type=participants&authToken=' + authToken, null, function(body){
 
            // Sort all rankings           
            var rankings = filterRankings(body, sortGender, deelnemer);
            var teamRankings = rankings.team;
            var genderRankings = rankings.gender;
            var participantsRankings = rankings.participants;

            // Check if sort is set to 'aflopend'
            if (sortOrder == undefined || sortOrder == 'aflopend'){
                participantsRankings.sort(sort_by('score', true, parseInt));
                teamRankings.sort(sort_by('score', true, parseInt));
                genderRankings.sort(sort_by('score', true, parseInt));
            }
            else {
                participantsRankings.sort(sort_by('score', false, parseInt));
                teamRankings.sort(sort_by('score', false, parseInt));
                genderRankings.sort(sort_by('score', false, parseInt));
            }

            return callback({ participantsRanking: participantsRankings, teamRanking: teamRankings, genderRanking: genderRankings });         
        }, function(error){
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('ranking retrieved failed', error);   
            }  
                   
            return callback(defaultReturn);
        });                   
    },
    getRankings: function(res, id, authToken, callback){
        api.get('/ranking/' + id + '?authToken=' + authToken, null, function(body){
            callback(body);
        }, function(error){         
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('ranking retrieved failed', error);  
            }       
            return callback(null);
        });   
    }   
};

function filterRankings(rankings, gender, deelnemer){
    var participantsRankings = [];
    var teamRankings = [];
    var genderRankings = [{id: '1', name: 'Jongens', score: 0}, {id: '2', name: 'Meisjes', score: 0}];

    rankings.forEach(function(element) {
        // Check for what gender to sort in
        if (gender == 'beide' || (gender == 'jongens' && element.gender == '1') || (gender == 'meisjes' && element.gender == '2')){
            var highLightedDeelnemer = element.guid == deelnemer ? true : false;
            element.highLightedDeelnemer = highLightedDeelnemer;
            if (element.score == null || element.score == 0) element.score = 0;
            participantsRankings.push(element);

            // Calcultate score male/female
            if (element.gender == '1'){
                var genderScore1 = genderRankings[0].score + element.score;
                genderRankings[0].score = genderScore1;
            } else {
                var genderScore2 = genderRankings[1].score + element.score;
                genderRankings[1].score = genderScore2;
            }

            // Check if team is already added
            var team = checkIfTeamExists(teamRankings, element.team_guid);
            if (team === null){
                teamRankings.push({name: element.name, score: element.score, id: element.team_guid, highLightedDeelnemer: highLightedDeelnemer});
            } else {
                team.score = team.score + element.score;
            }
        }
    }, this);

    return {team: teamRankings, gender: genderRankings, participants: participantsRankings};
}

function checkIfTeamExists(rankings, id){
    for (var i = 0; i < rankings.length; i++) {
        if (rankings[i].id == id) {
            return rankings[i];
        }
    }
    return null;
}

// Sort a list
var sort_by = function(field, reverse, primer){
    var key = primer ?
        function(x) {return primer(x[field]);} :
        function(x) {return x[field];};

    // Check if ascending or descensing
    reverse = !reverse ? 1 : -1;

    // Check what value is bigger and return the results to the sort function
    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
};
