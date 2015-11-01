'use strict';

var express = require('express');
var app     = express();
var React   = require('react');
var exphbs  = require('express-handlebars');

require('node-jsx').install({harmony: true});

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var Dashboard = React.createFactory(require('./components/Dashboard.react.js'));
var Login     = React.createFactory(require('./components/Login.react.js'));

app.get('/', function(req, res) {
    var body = React.renderToString(Dashboard({}));
    res.render('main', {body: body});
});

app.get('/login', function(req, res) {
    var body = React.renderToString(Login({}));
    res.render('main', {body: body});
});

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);

