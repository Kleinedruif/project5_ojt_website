var express = require('express');
var auth = require('../modules/auth');
var router = express.Router();
var participantInfoController = require('../controllers/participantInfoController');
var rankingsController = require('../controllers/rankingsController');
var mainController = require('../controllers/mainController');
var request = require('request');

// User is now detault loggedIn

// GET data page with id, participants handles everything and renders the page
router.get('/deelnemers/:id/gegevens', auth.requireLoggedIn, participantInfoController.getChildInformationPage);

// The ranking page
router.get('/ranglijst/', auth.requireLoggedIn, rankingsController.getRankingsPage);

// Main page
router.get('/', function(req, res, next) {
    mainController.render('index', req, res, { pageRoute: 'index', mainActive: true, message: req.flash('message') });
});

router.get('/inloggen', auth.requireNotLoggedIn, function(req, res, next) {
    mainController.render('login', req, res);
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
    
    auth.login(req, res, req.body.username.trim(), req.body.password.trim(), function(success) {
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

module.exports = router;
