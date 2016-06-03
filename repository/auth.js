var api = require('../modules/api');
var routes = {
    login: '/user/login'
}

module.exports = {
    login: function(username, password, res, callback) {
        api.post(routes.login, null, {email: username, password}, 
            function(response) {
                callback(response);
            },
            function(error) {
                // Token expires afther 1 day
                if (error.statusCode === 417){
                    return res.redirect('/sessieAfgelopen');
                } 
                // When 5 times attempted in a short amount of time
                else if (error.statusCode === 429){
                    return res.render('index', {message: error.message})
                }
                callback(false);
            }
        );
    }
}
