var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

var socketIo = require('socket.io');
var clientIo = require("socket.io-client");



// Custom modules
var config = require('./modules/config');
var csrf = require('./modules/csrf');

var app = express();

// Socket.io
var io = socketIo();
app.io = io;

var routes = require('./routes/index')(io);
var messages = require('./routes/messages')(io);

// This modules holds the helper functions for hbs
var helpers = require('./modules/hbs-helpers');

// Set the engine
app.engine("hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: helpers,
    partialsDir: "views/partials/",
    layoutsDir: "views/layouts/"
}));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('rvVMGxB3axNvTJ9wA3LKKA4X'));
app.use(session({secret: 'rvVMGxB3axNvTJ9wA3LKKA4X', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Validate CSRF token
app.use(csrf);

//// For testing purposes, user is always logged in.
// app.use(function(req, res, next) {
//     req.session.authenticated = true;
//     return next();
// });


app.use('/', routes);

// socket.io events
// app.io.sockets.on("connection", function(socket){
//     console.log("A user connected, add it to list");
//     console.log(socket.handshake.query.token);
//     console.log(socket.id);
//     socket.emit('succes', 'succes');
//     socket.on('disconnect', function(){console.log('remove it from list');});
// });

// var socketClient = clientIo.connect('http://localhost:3000', {reconnect: true});
// socketClient.connect('http://localhost:3000/socket.io/socket.io.js', {query: 'token=webserverToken'});
// //var socket = io.connect('http://localhost:3000/socket.io/socket.io.js', {query: 'token=mooietoken'});
// socketClient.on('connect', function(){ console.log('Connect to api')});
// socketClient.on('event', function(data){console.log('handle messages here')});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('De pagina is niet gevonden');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
