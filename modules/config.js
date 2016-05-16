var apiconfig = {};

try {
    apiconfig = require('../config/api.json');
}
catch (error) {}

module.exports = {
    api_key: process.env.api_key || apiconfig.api_key || '',
    api_host: process.env.api_host || apiconfig.api_host || '',
    socket_secret: 'desecretmoethetzelfdezijnalsopdeinlogpostroute',
    socket_client_private_key: '-----BEGIN RSA PRIVATE KEY-----MIICWwIBAAKBgHh98Cf+1FvtAJUOe8bvhDRmgsla72QH8j2jBzQC7T6UpBy6GGdq44rbJoHDjN8X2aMBBDalloUs8TsbV7P1jDdbEK6R8mrMdShASf8J5bu1BSTjnem/zeepni2dv2+DVYN4yBJjmqddWcFGhY5k0Bp4ZuDu7ZYSf8uj7psgbFR1AgMBAAECgYBkR+xoXR5Ao6+oXrWFjDJrqiWPj69NgY+K3PRRxV3Oh8dOYVOOPtfB6ULTHP1Rb3giweXP1WDA1favSsJjdCmNd/Lxwf2da6Zgg5/GGCGNxUqYKxA3mZWSPr6wHeArD811oA3JCg01tN+N0e/ZZwKnxR4crGgdJlaifqxMD7ZEAQJBAOq5OJ0ljJ3om2i+qus+917WMLtLTzAZZ4YIJSi9uEkYbOMEaWMWOhzz6J+iHmBsAheHmzvPhyd+Im3W3UvcwZECQQCDafa4uhjJrZwwh+dYNrJujNW3o+tknRcirjgVaLRfvw2CmVa8YGHTyQjbKmyuRnA0FnV8bPBJTve8cafFYXKlAkALlhcAUtEtHkVFl1vSfuoxCTugkygWhLqCeDZ1W2AUY5tEXXxiQr+dnECYWKVNNyenR69W9XiDb4t9hoSn8P6xAkAet6sjHOTkZ39l3K6X8RkePC9MoLVKLGoXAjA72OCorMjkqSEcIU9cqNY4HJ+Q0QgzNLi7n98+04WW994mhhO9AkEAqRatRy9qNbHRY+3Mbbw28RF1mvK7023On/LBgDmrJmBUj8v4KnuibYRkgGdk6jkVcAwZpcor0bPqcUVYDjIOLA==-----END RSA PRIVATE KEY-----',
    socket_client_token: 'a;wudbiuabwdlhbailucbvepsy9p483nfoushfb;jabyldlf3yb2hfbalskyfauvflhaslfyu372g'
};
