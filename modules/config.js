var apiconfig = {};

try {
    apiconfig = require('../config/api.json');
}
catch (error) {}

module.exports = {
    api_key: process.env.api_key || apiconfig.api_key || '',
    api_host: process.env.api_host || apiconfig.api_host || ''
}
