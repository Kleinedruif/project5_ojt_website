var request = require('request');

module.exports = {
    getAvatar: function(id, callback){     
		var url = 'http://omejoopstour.timohoff.nl/user/'+id+'.jpg';

        request(url, 
			function (err, response, body) {
				callback(response && response.statusCode==200 ? url : '/images/profile.png');
			}
		);
	}
}
