var express = require('express');
var router = express.Router();

var auth = require('../modules/auth');
var participantInfoController = require('../controllers/participantInfoController');

module.exports = function() {    
    router.get('/:id', auth.requireLoggedIn, participantInfoController.getChildInformationPage);
       
    return router;
}
