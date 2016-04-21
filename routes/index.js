var express = require('express');
var auth = require('../modules/auth');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', showRanking: true });
});

router.get('/data', function(req, res, next) {
    res.render('index', { title: 'Express', showData: true });
});

router.get('/login', auth.requireNotLoggedIn, function(req, res, next) {
    
})

module.exports = router;
