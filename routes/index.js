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
    var selectedChild = null;
    if (req.session.selectedChild != undefined){
        selectedChild = req.session.selectedChild
    }
    
    res.render('index', {pageRoute: 'index', mainActive: true, logedIn: true, childs: childList, selectedChild: selectedChild});
});

// GET data page with id.
router.get('/deelnemers/:id/gegevens', function(req, res, next) {    
    var childId = req.params.id;
        
    var information;
    if (childId == 0){
        // Check if id is already stored
        if (req.session.selectedChild != undefined && req.session.selectedChild.id != 0){
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
    
    var name = information.firstName + " " + information.lastName;
    req.session.selectedChild = {id: childId, name: name};
    
    res.render('data', {pageRoute: 'data', data: information, logedIn: true, childs: childList, selectedChild: req.session.selectedChild});
});

router.get('/login', auth.requireNotLoggedIn, function(req, res, next) {
    
})

module.exports = router;
