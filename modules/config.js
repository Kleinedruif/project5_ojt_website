var apiconfig = {};

try {
    apiconfig = require('../config/api.json');
}
catch (error) {}

module.exports = {
    api_key: process.env.api_key || apiconfig.api_key || '',
    api_host: process.env.api_host || apiconfig.api_host || '',
    socket_secret: 'desecretmoethetzelfdezijnalsopdeinlogpostroute',
    socket_client_token:'VbMCxsAxBNtsJlr4keGpKSkp6Ov95gEqbJkxkdkKkEkpeDrpuEp5TiHf2bK0yo9wmwrK80ZzFWqIDt8UvMIAKnVhLddcaSy2TdRxhVqxF8Vrp7JWcweao9v3zUcqN73MUDofRHkVcBp4WnRJGdNkLc'
};
