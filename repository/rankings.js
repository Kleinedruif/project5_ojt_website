var api = require('../modules/api');

module.exports = {
    // Returns sorted rankings
    getSortedRankings: function(sortOrder, sortGender, callback){   
        // To prevent undefined
        var defaultReturn = { participantsRanking: [], teamRanking: [], genderRanking: []};          
        api.get("/ranking?type=participants", null, function(body){
 
            // Sort all rankings           
            var rankings = getRankings(body, sortGender);
            var teamRankings = rankings.team;
            var genderRankings = rankings.gender;
            var participantsRankings = rankings.participants;

            // Check if sort is set to "aflopend"
            if (sortOrder == undefined || sortOrder == "aflopend"){
                participantsRankings.sort(sort_by('score', true, parseInt));
                teamRankings.sort(sort_by('score', true, parseInt));
                genderRankings.sort(sort_by('score', true, parseInt));
            }
            // In al other cases sort ascending
            else {
                participantsRankings.sort(sort_by('score', false, parseInt));
                teamRankings.sort(sort_by('score', false, parseInt));
                genderRankings.sort(sort_by('score', false, parseInt));
            }

            return callback({ participantsRanking: participantsRankings, teamRanking: teamRankings, genderRanking: genderRankings });
            
        }, function(body){
            console.log('ranking retrieved failed', body);
            
            return callback(defaultReturn);
        });                   
    }   
};

// Retrieve team rankings
function getRankings(rankings, gender){
    var participantsRankings = [];
    var teamRankings = [];
    var genderRankings = [{id: "1", name: "Jongens", score: 0}, {id: "2", name: "Meisjes", score: 0}];
    // Loop over all the individual participants
    rankings.forEach(function(element) {
        // Check for what gender to sort in
        if (gender == 'beide' || (gender == 'jongens' && element.gender == '1') || (gender == 'meisjes' && element.gender == '2')){
            // Add child to the list
            participantsRankings.push(element);

            // Calcultate score male/female
            if (element.gender == "1"){
                var genderScore1 = genderRankings[0].score + element.score;
                genderRankings[0].score = genderScore1;
            } else {
                var genderScore2 = genderRankings[1].score + element.score;
                genderRankings[1].score = genderScore2;
            }

            // Check if team is already added
            var team = checkIfTeamExists(teamRankings, element.team_guid);
            if (team === null){
                // Push the new team to the list
                teamRankings.push({name: element.team_guid, score: element.score, id: element.team_guid});
            } else {
                // Add extra scores
                team.score = team.score + element.score;
            }
        }
    }, this);

    // Return both scores
    return {team: teamRankings, gender: genderRankings, participants: participantsRankings};
}

// Check if team already exists in the list with the id
function checkIfTeamExists(rankings, id){
    // Loop over all the items
    for (var i = 0; i < rankings.length; i++) {
        // If id matches, return that team
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
