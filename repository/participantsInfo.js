var api = require('../modules/api');

module.exports = {
    // Return the list below
    getChildInformationList: function(userid, callback){
        api.get('/user/' + userid + '/children', null, function(body){
            callback(body);
        }, function(body){
            console.log('user retrieved failed', body);
            callback(null);
        });
    }, 
};
