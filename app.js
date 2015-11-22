'use strict';

var express = require('express');
var app     = express();
var React   = require('react');
var exphbs  = require('express-handlebars');
var path    = require('path');

require('node-jsx').install({harmony: true});

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var Top       = React.createFactory(require('./components/Top.react.js'));
var Login     = React.createFactory(require('./components/Login.react.js'));
var Signup    = React.createFactory(require('./components/Signup.react.js'));
var User   = React.createFactory(require('./components/User.react.js'));
var Artist = React.createFactory(require('./components/Artist.react.js'));
var NotFound  = React.createFactory(require('./components/NotFound.react.js'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    var body = React.renderToString(Top({}));
    var script = '/top.js';
    res.render('main', {body: body, script: script});
});

app.get('/login', function(req, res) {
    var body = React.renderToString(Login({}));
    var script = '/login.js';
    res.render('main', {body: body, script: script});
});

app.get('/signup', function(req, res) {
    var body = React.renderToString(Signup({}));
    var script = '/signup.js';
    res.render('main', {body: body, script: script});
});

app.get('/users/:id', function(req, res) {
    var params = {id: req.params.id};
    var body   = React.renderToString(User({params: params}));
    var script = '/user.js';
    var json   = JSON.stringify(params);
    res.render('main', {body: body, script: script, params: json});
});

app.get('/artists/:id', function(req, res) {
    var params = {id: req.params.id};
    var body   = React.renderToString(Artist({params: params}));
    var script = '/artist.js';
    var json   = JSON.stringify(params);
    res.render('main', {body: body, script: script, params: json});
});

app.get('*', function(req, res) {
    var body = React.renderToString(NotFound({}));
    var script = '/notfound.js';
    res.render('main', {body: body, script: script});
});

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);
