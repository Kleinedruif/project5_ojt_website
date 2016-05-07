var express = require('express');
var auth = require('../modules/auth');
var router = express.Router();
var partic = require('../repository/participants');
var request = require('request');

// User is now detault loggedIn

// GET data page with id, participants handles everything and renders the page
router.get('/deelnemers/:id/gegevens', partic.getChildPage);

// The ranking page
router.get('/ranglijst/', partic.getChildInformation, function(req, res, next){
    var sortOrder = 'oplopend';
    var sortGender = 'beide';
    if (req.query.sorteer){ sortOrder = req.query.sorteer; }
    if (req.query.geslacht){ sortGender = req.query.geslacht; }
    
    var rankings = partic.getRanking(sortOrder, sortGender);
    console.log(rankings);
    render('ranking', req, res, {pageRoute: 'ranking', participantsRanking: rankings.participantsRanking, teamRanking: rankings.teamRanking, genderRanking: rankings.genderRanking, childs: req.childList, sortOrder: sortOrder, sortGender: sortGender, selectedChild: req.session.selectedChild});
});

router.get('/login', auth.requireNotLoggedIn, function(req, res, next) {

});

router.get('/', partic.getChildInformation, function(req, res, next) {
    render('index', req, res, { pageRoute: 'index', mainActive: true, childs: req.childList, selectedChild: req.selectedChild, message: req.flash('message') });
});

router.get('/inloggen', auth.requireNotLoggedIn, function(req, res, next) {
    render('login', req, res);
});

router.post('/inloggen', auth.requireNotLoggedIn, function(req, res, next) {
    //Form validation
    var errors = {};
    if (!req.body.hasOwnProperty('username') || req.body.username.trim() == '') {
        errors.username = 'Vul alstublieft een gebruikernaam in.';
    }
    if (!req.body.hasOwnProperty('password') || req.body.password.trim() == '') {
        errors.password = 'Vul alstublieft een wachtwoord in.';
    }
    
    if (Object.keys(errors).length > 0) {
        req.flash('errors', errors);
        res.redirect('/inloggen');
        return;
    }
    
    auth.login(req, req.body.username.trim(), req.body.password.trim(), function(success) {
        if (!success) {
            req.flash('message', 'De combinatie van uw gebruikersnaam en wachtwoord kon niet gevonden worden.');
            res.redirect('/inloggen');
            return;
        }
        
        req.flash('message', 'U bent ingelogd.');
        res.redirect('/');
        return;
    });
});

router.get('/uitloggen', auth.requireLoggedIn, function(req, res, next) {
    auth.logout(req);
    
    req.flash('message', 'U bent uitgelogd.');
    res.redirect('/');
});

// Renders certain view, with csrf, loggedIn and flash message already given.
var render = function(view, req, res, variables) {
    if (!variables) {
        variables = {};
    }
    
    var errors = req.flash('errors');
    if (errors) {
        errors = errors[0];
    }
    
    variables.__proto__ = { csrf: req.session.csrf, loggedIn: req.session.authenticated == true, message: req.flash('message'), errors: errors }
    
    res.render(view, variables);
}

module.exports = router;
