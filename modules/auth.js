var config = require('./config');

module.exports = {
    requireLoggedIn: function(req, res, next) {
        if (req.session.authenticated) {
            return next();
        }

        res.render('error', {message: 'You must be logged in to access this page.'});
    },

    requireNotLoggedIn: function(req, res, next) {
        if (!req.session.authenticated) {
            return next();
        }

        res.redirect('/');
    }
};
