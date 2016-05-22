var apiconfig = {};
var socketconfig = {};
try {
    apiconfig = require('../config/api.json');
    socketconfig = require('../config/socket.json');
}
catch (error) {console.log('ERROR: Failed to load config files.');}

module.exports = {
    api_key: process.env.api_key || apiconfig.api_key || '',
    api_host: process.env.api_host || apiconfig.api_host || '',
    socket_secret: process.env.socket_secret || socketconfig.socket_secret || '', 
    socket_client_token: process.env.socket_client_token || socketconfig.socket_client_token || ''
};
