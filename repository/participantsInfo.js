var api = require('../modules/api');

module.exports = {
    // Return the list below
    getChildInformationList: function(req, res, callback){
        api.get('/user/' + req.session.userid + '/children/?authToken=' + req.session.auth.auth_token, null, function(body){
            callback(body);
        }, function(error){        
            if (error.statusCode === 417){
                return res.redirect('/sessieAfgelopen');
            } else {
                console.log('user retrieved failed', error);
            }
            callback(null);
        });
    }, 
};
