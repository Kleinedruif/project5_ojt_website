var api = require('../modules/api');

module.exports = {
    // Return the list below
    getChildInformationList: function(hardcodeParentId, callback){
        api.get("/user/" + hardcodeParentId + "/children", null, function(body){
            console.log('user retrieved succes');
            callback(body);
        }, function(body){
            console.log('user retrieved failed', body);
            callback(null);
        });
    }, 
};
