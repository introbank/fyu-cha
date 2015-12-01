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
var Group = React.createFactory(require('./components/Group.react.js'));
var NotFound  = React.createFactory(require('./components/NotFound.react.js'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
    var body = React.renderToString(Top({}));
    var script = '/javascripts/top.js';
    res.render('main', {css: css, body: body, script: script});
});

app.get('/login', function(req, res) {
    var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
    var body = React.renderToString(Login({}));
    var script = '/javascripts/login.js';
    res.render('main', {css: css, body: body, script: script});
});

app.get('/signup', function(req, res) {
    var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
    var body = React.renderToString(Signup({}));
    var script = '/javascripts/signup.js';
    res.render('main', {css: css, body: body, script: script});
});

app.get('/users/:id', function(req, res) {
    var params = {id: req.params.id};
    var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
    var body   = React.renderToString(User({params: params}));
    var script = '/javascripts/user.js';
    var json   = JSON.stringify(params);
    res.render('main', {css: css, body: body, script: script, params: json});
});

app.get('/artists/:id', function(req, res) {
    var params = {id: req.params.id};
    var css = '<link media="only screen and (max-device-width:480px)" rel="stylesheet" href="/stylesheets/sp_style.css"><link media="screen and (min-device-width:481px)" rel="stylesheet" href="/stylesheets/tab_style.css">';
    //var css = '<link rel="stylesheet" href="/stylesheets/sp_style.css">';
    var body   = React.renderToString(Artist({params: params}));
    var script = '/javascripts/artist.js';
    var json   = JSON.stringify(params);
    res.render('main', {css: css, body: body, script: script, params: json});
});

app.get('/groups/:id', function(req, res) {
    var params = {id: req.params.id};
    var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
    var body   = React.renderToString(Group({params: params}));
    var script = '/javascripts/group.js';
    var json   = JSON.stringify(params);
    res.render('main', {css: css, body: body, script: script, params: json});
});

app.get('*', function(req, res) {
    var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
    var body = React.renderToString(NotFound({}));
    var script = '/javascripts/notfound.js';
    res.render('main', {css: css, body: body, script: script});
});

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);
