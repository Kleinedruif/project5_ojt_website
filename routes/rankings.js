var express = require('express');
var router = express.Router();

var auth = require('../modules/auth');
var rankingsController = require('../controllers/rankingsController');

module.exports = function() {    
    router.get('/', auth.requireLoggedIn, rankingsController.getRankingsPage);
    router.get('/:id', auth.requireLoggedIn, rankingsController.getRankings);

    return router;
}
