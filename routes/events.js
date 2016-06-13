var express = require('express');
var router = express.Router();

var auth = require('../modules/auth');
var eventController = require('../controllers/eventController');

module.exports = function() {    
    router.get('/', auth.requireLoggedIn, eventController.getEventsPage);  
       
    return router;
}
