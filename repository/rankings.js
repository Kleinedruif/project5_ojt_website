module.exports = {
    // Returns sorted rankings
    getSortedRankings: function(sortOrder, sortGender){
        var rankings = getRankings(dummyRankings, sortGender);
        var teamRankings = rankings.team;
        var genderRankings = rankings.gender;
        var participantsRankings = rankings.participants;

        // Check if sort is set to "aflopend"
        if (sortOrder !== undefined && sortOrder == "aflopend"){
            participantsRankings.sort(sort_by('score', false, parseInt));
            teamRankings.sort(sort_by('score', false, parseInt));
            genderRankings.sort(sort_by('score', false, parseInt));
        }
        // In al other cases sort ascending
        else {
            participantsRankings.sort(sort_by('score', true, parseInt));
            teamRankings.sort(sort_by('score', true, parseInt));
            genderRankings.sort(sort_by('score', true, parseInt));
        }
       
        return { participantsRanking: participantsRankings, teamRanking: teamRankings, genderRanking: genderRankings }
    }   
};

// Retrieve team rankings
function getRankings(rankings, gender){
    var participantsRankings = [];
    var teamRankings = [];
    var genderRankings = [{id: "male", name: "Jongens", score: 0}, {id: "female", name: "Meisjes", score: 0}];
    // Loop over all the individual participants
    rankings.forEach(function(element) {
        // Check for what gender to sort in
        if (gender == 'beide' || (gender == 'jongens' && element.gender == 'male') || (gender == 'meisjes' && element.gender == 'female')){
            // Add child to the list
            participantsRankings.push(element);

            // Calcultate score male/female
            if (element.gender == "male"){
                var genderScore1 = genderRankings[0].score + element.score;
                genderRankings[0].score = genderScore1;
            } else {
                var genderScore2 = genderRankings[1].score + element.score;
                genderRankings[1].score = genderScore2;
            }

            // Check if team is already added
            var team = checkIfTeamExists(teamRankings, element.teamId);
            if (team === null){
                // Push the new team to the list
                teamRankings.push({name: element.teamName, score: element.score, id: element.teamId});
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

// Dummy ranking data
var dummyRankings = [{name: 'Piet', gender: 'male', id: 1, score: 14, teamName: 'Team Geel', teamId: '1'},
    {name: 'Geert', gender: 'male', id: 2, score: 13, teamName: 'Team Geel', teamId: '1'},
    {name: 'Klaas', gender: 'male', id: 3, score: 9, teamName: 'Team Groen', teamId: '2'},
    {name: 'Anne', gender: 'female', id: 4, score: 20, teamName: 'Team  Groen', teamId: '2'},
    {name: 'Myrthe', gender: 'female', id: 5, score: 18, teamName: 'Team Blauw', teamId: '3'},
    {name: 'Paula', gender: 'female', id: 6, score: 2, teamName: 'Team Blauw', teamId: '3'},
    {name: 'Sam', gender: 'male', id: 7, score: 3, teamName: 'Team Geel', teamId: '1'},
    {name: 'Paul', gender: 'male', id: 8, score: 8, teamName: 'Team Geel', teamId: '1'},
    {name: 'Kees', gender: 'male', id: 9, score: 12, teamName: 'Team Groen', teamId: '2'},
    {name: 'Maria', gender: 'female', id: 10, score: 21, teamName: 'Team  Groen', teamId: '2'},
    {name: 'Myrthe', gender: 'female', id: 11, score: 22, teamName: 'Team Blauw', teamId: '3'},
    {name: 'Miep', gender: 'female', id: 12, score: 1, teamName: 'Team Blauw', teamId: '3'},
];
