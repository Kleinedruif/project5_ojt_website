var express = require('express');

module.exports = {
    // Renders certain view, with csrf, loggedIn and flash message already given.
    render: function(view, req, res, variables) {
        if (!variables) {
            variables = {};
        }
        
        var errors = req.flash('errors');
        if (errors) {
            errors = errors[0];
        }
        
        variables.__proto__ = { csrf: req.session.csrf, loggedIn: req.session.authenticated == true, msgCount: req.msgCount, message: req.flash('message'), errors: errors}
        
        res.render(view, variables);
    }
};




