var api = require('../modules/api');

module.exports = {
    // Return the list below
    getChildInformationList: function(res, userid, authToken, callback){
        api.get('/user/' + userid + '/children/?authToken=' + authToken, null, function(body){
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
