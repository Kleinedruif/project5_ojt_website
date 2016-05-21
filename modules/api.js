var request = require('request');
var config = require('../modules/config');

/**
 * Parse the url, adding host, api key, and chaning :id and other parameters in the url to the ones given in params
 */
var parseUrl = function(url, params) {
    var url = config.api_host + url;
    url = qm(url) + 'api_key=' + config.api_key;
    
    if (params !== undefined && params !== null) {
        var keys = Object.keys(params);
        
        for (key in keys) {
            if (url.indexOf(':' + key) > -1) {
                url = url.replace(':' + key, params[key]);      // Example: Replace :id in the url with the given id from the params
            }
        }
    }
    
    return url;
}

/**
 * Add a ? or a & to the end of the URL
 */
var qm = function(url) {
    if(url.indexOf('?') < 0) { 
        url += '?'; 
    }
    else{ 
        url += '&'; 
    }
    
    return url;
}

module.exports = {
    /**
     * Perform a GET request to the API.
     * 
     * api_route: URL that gets called on the API. in the form of: /team/:id/participants?gender=male
     * params: URL parameters that gets replaced in the URL: :id --> the value of "id" property in params object
     * success: Callback that gets called on a successful request. Parameter = response body
     * error: Callback that gets called when an error happened. Parameter = {status_code, error}
     */
    get: function(api_route, params, success, error) {
        var url = parseUrl(api_route, params);

        request({
            url: url,
            json: true
        }, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                success(body);                                      // Let the success callback handle the response
            } else {
                var message = '';
                if (body && body.message) {
                    message = body.message
                }
                error({                                             // Let the error callback handle the error
                    status_code: response.statusCode,
                    error: err,
                    message: message
                });
            }
        });
    },
    
    /**
     * Perform a POST request to the API.
     * 
     * api_route: URL that gets called on the API. in the form of: /team/:id/participants?gender=male
     * params: URL parameters that gets replaced in the URL: :id --> the value of "id" property in params object
     * form: The information that gets posted.
     * success: Callback that gets called on a successful request. Parameter = response body
     * error: Callback that gets called when an error happened. Parameter = {status_code, error}
     */
    post: function(api_route, params, form, success, error) {
        var url = parseUrl(api_route, params);
        
        request({
            url: url,
            method: "POST",
            json: true,
            method: 'POST',
            form: form
        }, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                success(body);                                      // Let the success callback handle the response
            } else {
                var message = '';
                if (body && body.message) {
                    message = body.message
                }
                error({                                             // Let the error callback handle the error
                    status_code: response.statusCode,
                    error: err,
                    message: message
                });
            }
        });
    }
}
