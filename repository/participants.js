module.exports = {
    // Retrieve participants page
    getChildPage: function(req, res, next){
        var childId = req.params.id;

        var information;
        if (childId == '0'){
            // Check if id is already stored
            if (req.session.selectedChild !== undefined && req.session.selectedChild.id !== '0'){
                // Find the child with the id
                childInformation.forEach(function(element) {
                    if (element.id == req.session.selectedChild.id){
                        information = element;
                    }
                }, this);
            }
            // When no id stored, no kind is selected so get the first
            else {
                information = childInformation[0];
            }
        } else {
            // Find the child with the id
            childInformation.forEach(function(element) {
                if (element.id == childId){
                    information = element;
                }
            }, this);
        }

        // Save the information in the session
        var name = information.firstName + " " + information.lastName;
        req.session.selectedChild = {id: childId, name: name};

        // Render the page
        // pageRoute - needed to show in menu bar what page is active
        // logedIn is if logedin or not to show login form or logout button
        // childlist shows the dropdown menu with all the childs, hold dummy data with name and id
        // information is array holding all the childs information
        // selectedChild is the child selected, holds name and id
        return res.render('data', {pageRoute: 'data', data: information, loggedIn: true, childs: childList, selectedChild: req.session.selectedChild});
    },
    // Retrieve the list and store the data in the request
    getChildInformation: function(req, res, next){
        // Check if it already exists in the session
        var selectedChild = null;
        if (req.session.selectedChild !== undefined){
            selectedChild = req.session.selectedChild;
        }

        // Store it on the request
        req.selectedChild = selectedChild;
        req.childList = childList;
        return next();
    },
    // Retrieving ranking page
    getRanking: function(sortOrder, sortGender){
        // Set default sort vaules
        //var sortOrder = 'oplopend';
       // var sortGender = 'beide';
        // Retrieve values from query filter
       // if (req.query.sorteer){ sortOrder = req.query.sorteer; }
       // if (req.query.geslacht){ sortGender = req.query.geslacht; }

        // Create rankings based on on score from individual rankings
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

        // Render the ranking page
        return { participantsRanking: participantsRankings, teamRanking: teamRankings, genderRanking: genderRankings, childs: childList }
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

// Dummy data
var childList = [{id: 1, name: 'Piet Verlouw'}, {id: 2, name: 'Geert Verlouw'}];
var childInformation = [{
    // general data
    id: 1,
    firstName: 'Piet',
    lastName: 'Verlouw',
    age: 12,
    startNumber: '12345',
    phoneNumber: '0612345678',
    adres: 'Achterstraat 22B',
    city: 'Den Bosch',
    postalCode: '1233EW',

    // private data
    medication: 'Ritalin',
    classifications: 'Diploma A & B',
    extra: 'Moeilijke slaper en kan last krijgen van heimwee. Als hij niet in slaap komt geef hem een glas water en het komt allemaal goed'
}, {
    // general data
    id: 2,
    firstName: 'Geert',
    lastName: 'Verlouw',
    age: 10,
    startNumber: '54321',
    phoneNumber: '0612345678',
    adres: 'Achterstraat 22B',
    city: 'Den Bosch',
    postalCode: '1233EW',

    // private data
    medication: '-',
    classifications: 'Diploma A en is bezig met B',
    extra: '-'
}];

// Dummy ranking data
var dummyRankings = [{name: 'Piet', gender: 'male', id: 1, score: 14, teamName: 'Team Geel', teamId: '1'},
    {name: 'Geert', gender: 'male', id: 2, score: 13, teamName: 'Team Geel', teamId: '1'},
    {name: 'Klaas', gender: 'male', id: 3, score: 9, teamName: 'Team Groen', teamId: '2'},
    {name: 'Anneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', gender: 'female', id: 4, score: 20, teamName: 'Team  Groen', teamId: '2'},
    {name: 'Myrthe', gender: 'female', id: 5, score: 18, teamName: 'Team Blauw', teamId: '3'},
    {name: 'Paula', gender: 'female', id: 6, score: 2, teamName: 'Team Blauw', teamId: '3'},
];
