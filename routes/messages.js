var express = require('express');
var router = express.Router();

var auth = require('../modules/auth');
var messageController = require('../controllers/messageController');

module.exports = function(io) {    
    router.get('/', auth.requireLoggedIn, messageController.getMessagePage());
    router.get('/:id', auth.requireLoggedIn, messageController.getMessagePage());
        
    router.post('/', auth.requireLoggedIn, messageController.sendMessage(io));  
    
    return router;
}