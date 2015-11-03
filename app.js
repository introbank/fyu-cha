'use strict';

var express = require('express');
var app     = express();
var React   = require('react');
var exphbs  = require('express-handlebars');
var path    = require('path');

require('node-jsx').install({harmony: true});

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var Dashboard = React.createFactory(require('./components/Dashboard.react.js'));
var Login     = React.createFactory(require('./components/Login.react.js'));
var Signup    = React.createFactory(require('./components/Signup.react.js'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    var body = React.renderToString(Dashboard({}));
    var script = './';
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

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);

