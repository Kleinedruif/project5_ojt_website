var express = require('express');
var auth = require('../modules/auth');
var router = express.Router();
var partic = require('../repository/participants')

// User is now detault loggedIn

// GET home page.
// getChildInformation retrieves the dummydata or from api and stores it on the request
router.get('/', partic.getChildInformation, function(req, res, next) {   
    res.render('index', {pageRoute: 'index', mainActive: true, logedIn: true, childs: req.childList, selectedChild: req.selectedChild});
});

// GET data page with id, participants handles everything and renders the page
router.get('/deelnemers/:id/gegevens', partic.getChildPage);

router.get('/login', auth.requireNotLoggedIn, function(req, res, next) {
    
})

module.exports = router;
