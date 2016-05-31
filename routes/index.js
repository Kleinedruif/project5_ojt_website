var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var auth = require('../modules/auth');
var config = require('../modules/config');

var mainController = require('../controllers/mainController');
var participantRepo = require('../repository/participantsInfo');

module.exports = function(io) {
    // Main page
    router.get('/', function(req, res, next) {
        if (req.session.authenticated) {
            participantRepo.getChildInformationList(req.session.userid, function(childInformationList){
                mainController.render('indexLoggedIn', req, res, { pageRoute: 'index', mainActive: true, childs: childInformationList, message: req.flash('message') });
            });
        } else {
            mainController.render('index', req, res, { pageRoute: 'index', mainActive: true, message: req.flash('message') });
        }    
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
            return res.redirect('/inloggen');
        }
        
        auth.login(req, req.body.username.trim(), req.body.password.trim(), function(success) {          
            if (!success) {
                req.flash('message', 'De combinatie van uw gebruikersnaam en wachtwoord kon niet gevonden worden.');
                return res.redirect('/inloggen');
            } else if (!auth.checkRole(req)){
                return res.redirect('/inloggen');
            }  
            
            req.session.username = req.body.username.trim();
            
            req.flash('message', 'U bent ingelogd.');

            // Create new token for socket connection and store it
            var token = jwt.sign({username: req.session.username, userid: req.session.userid}, config.socket_secret, { expiresIn: '1 days' });
            req.session.socketToken = token;

            return res.redirect('/');
        });
    });

    // Route to handle session ended
    router.get('/sessieAfgelopen', auth.requireLoggedIn, function(req, res, next) {
        auth.logout(req);
        
        req.flash('message', 'Uw sessie is verlopen, log opnieuw in.');
        res.redirect('/inloggen');
    });

    router.get('/uitloggen', auth.requireLoggedIn, function(req, res, next) {
        auth.logout(req);
        
        req.flash('message', 'U bent uitgelogd.');
        res.redirect('/');
    });

    return router;
}
