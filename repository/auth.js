var api = require('../modules/api');
var routes = {
    login: '/user/login'
}

module.exports = {
    login: function(username, password, callback) {
        api.post(routes.login, null, {email: username, password}, 
            function(response) {
                callback(response);
            },
            function(error) {
                callback(false);
            }
        );
    }
}
