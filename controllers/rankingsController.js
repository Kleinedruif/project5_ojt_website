var rankingsRepo = require('../repository/rankings');
var mainController = require('./mainController');

module.exports = {
    getRankingsPage: function(req, res, next){        
        // Default values
        var sortOrder = 'aflopend';
        var sortGender = 'beide';
        var deelnemer = '';
        
        if (req.query.sorteer){ sortOrder = req.query.sorteer; }
        if (req.query.geslacht){ sortGender = req.query.geslacht; }
        if (req.query.deelnemer){ deelnemer = req.query.deelnemer; }

        // Retrieve rankings from repo and render it
        rankingsRepo.getSortedRankings(res, sortOrder, sortGender, deelnemer, req.session.auth.auth_token, function(rankings){
            mainController.render('ranking', req, res, {pageRoute: 'ranking', participantsRanking: rankings.participantsRanking, teamRanking: rankings.teamRanking, genderRanking: rankings.genderRanking, sortOrder: sortOrder, sortGender: sortGender});
        });
       
    },
    getRankings: function(req, res, next){
        rankingsRepo.getRankings(res, req.params.id, req.session.auth.auth_token, function(ranking){
           res.json(ranking); 
        });
    }
};