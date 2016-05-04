var crypto = require('crypto');

var generateNewToken = function(req) {
    req.session.csrf = crypto.randomBytes(32).toString('hex');
}

module.exports = function(req, res, next) {
    if (req.method && req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
        if (!req.session.csrf || !req.body._csrf || req.body._csrf !== req.session.csrf) {
            // The CSRF token does not match or was not given. Ask user to submit form again.
            generateNewToken(req);
            req.flash('message', 'Vul alstublieft het formulier opnieuw in.');
            return res.redirect('back');
        }
        
        generateNewToken(req);
    }
    
    if (!req.session.csrf) {
        generateNewToken(req);
    }
    
    return next();
}
