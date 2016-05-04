var express = require('express');
var auth = require('../modules/auth');
var router = express.Router();

// User is now detault loggedIn

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


// pageRoute - needed to show in menu bar what page is active
// logedIn is if logedin or not to show login form or logout button
// childlist shows the dropdown menu with all the childs, hold dummy data with name and id
// childInformation is array holding dummy data with child information

// GET home page.
router.get('/', function(req, res, next) {
    render('index', req, res, { pageRoute: 'index', mainActive: true, logedIn: true, childs: childList, message: req.flash('message') });
});

// GET data page.
router.get('/deelnemers/gegevens', function(req, res, next) {   
    render('data', req, res, {pageRoute: 'data', data: childInformation[0], logedIn: true, childs: childList});
});

// GET data page with id.
router.get('/deelnemers/:id/gegevens', function(req, res, next) {    
    var childId = req.params.id;
    
    var information;
    // Find the child with the id
    childInformation.forEach(function(element) {
        if (element.id == childId){
            information = element;
        }
    }, this);
    
    render('data', req, res, {pageRoute: 'data', data: information, logedIn: true, childs: childList});
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
        // TODO check success
        
        req.flash('message', 'Login succesvol');
        res.redirect('/');
        return;
    });
});

router.get('/uitloggen', /*auth.requireLoggedIn??, */ function(req, res, next) {
    auth.logout(req);
    
    req.flash('message', 'U bent uitgelogd');
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
