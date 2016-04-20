var express = require('express');
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


// rankingActive - shows what is active in menu bar
// logedIn is if logedin or not to show login form or logout button
// childlist shows the dropdown menu with all the childs, hold dummy data with name and id
// childInformation is array holding dummy data with child information

// GET home page.
router.get('/', function(req, res, next) {   
    res.render('index', {mainActive: true, logedIn: true, childs: childList});
});

// GET data page.
router.get('/data', function(req, res, next) {   
    res.render('data', {dataActive: true, data: childInformation[0], logedIn: true, childs: childList});
});

// GET data page with id.
router.get('/data/:id', function(req, res, next) {    
    var childId = req.params.id;
    
    var information;
    // Find the child with the id
    childInformation.forEach(function(element) {
        if (element.id == childId){
            information = element;
        }
    }, this);
    
    res.render('data', {dataActive: true, data: information, logedIn: true, childs: childList});
});

module.exports = router;
