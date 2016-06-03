var authRepo = require('../repository/auth');

module.exports = {
    // The user must be logged in to access this route.
    requireLoggedIn: function(req, res, next) {
        if (req.session.authenticated) {
            return next();
        }

        res.render('error', {message: 'U moet ingelogd zijn om deze pagina te bezoeken.'});
    },
    
    // The user must not be logged in to access this route.
    requireNotLoggedIn: function(req, res, next) {
        if (!req.session.authenticated) {
            return next();
        }

        req.flash('message', 'U bent al ingelogd.');
        res.redirect('/');
    },
    
    // Try to login the user. Executes callback and as parameter returns successfulness of login.
    login: function(req, res, username, password, callback) {
        username = username.trim();
        password = password.trim();
        
        authRepo.login(username, password, res, function(authInfo) {
            var success = authInfo !== false;
            req.session.authenticated = success;
            req.session.auth = authInfo;            // session.auth contains authToken and role if authenticated, else it's false
            req.session.userid = authInfo.guid;

            callback(success);
        });
    },
    
    checkRole: function(req){
        if (req.session.auth.role_name !== 'ouder'){
            req.flash('message', 'Deze website kan alleen gebruikt worden door ouders.');
            return false;
        }  
        return true;
    },
    
    // Logs the user out.
    logout: function(req) {
        req.session.authenticated = false;
    }
};
