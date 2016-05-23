var rankingsRepo = require('../repository/rankings');
var mainController = require('./mainController');

module.exports = {
    // Retrieve ranking page
    getRankingsPage: function(req, res, next){
        // default values
        var sortOrder = 'aflopend';
        var sortGender = 'beide';
        // Retrieve sort order
        if (req.query.sorteer){ sortOrder = req.query.sorteer; }
        if (req.query.geslacht){ sortGender = req.query.geslacht; }

        // Retrieve rankings from repo and render it
        rankingsRepo.getSortedRankings(sortOrder, sortGender, function(rankings){
            mainController.render('ranking', req, res, {pageRoute: 'ranking', participantsRanking: rankings.participantsRanking, teamRanking: rankings.teamRanking, genderRanking: rankings.genderRanking, sortOrder: sortOrder, sortGender: sortGender});
        });
       
    }
};