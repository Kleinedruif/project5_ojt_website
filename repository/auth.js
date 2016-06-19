var api = require('../modules/api');
var routes = {
    login: '/user/login'
}

module.exports = {
    login: function(res, username, password, callback) {
        api.post(routes.login, null, {email: username, password}, 
            function(response) {
                callback(response);
            },
            function(error) {
                if (error.status_code === 500) {
                    console.log('Error connecting to the API or the API gave a status code 500:');
                    console.log(error);
                    return res.send('Er is iets foutgegaan op de server.');
                }
                // Token expires afther 1 day
                if (error.status_code === 417){
                    return res.redirect('/sessieAfgelopen');
                } 
                // When 5 times attempted in a short amount of time
                else if (error.status_code === 429){
                    return res.render('index', {message: error.message})
                }
                callback(false);
            }
        );
    }
}
