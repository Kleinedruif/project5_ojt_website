var express = require('express');
var router = express.Router();

var auth = require('../modules/auth');
var messageController = require('../controllers/messageController');

module.exports = function() {    
    router.get('/', auth.requireLoggedIn, messageController.getContactList());  
    router.get('/:id', auth.requireLoggedIn, messageController.newConverstation()); 
       
    return router;
}
