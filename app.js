'use strict';

var express = require('express');
var app     = express();
var React   = require('react');
var exphbs  = require('express-handlebars');
var path    = require('path');
var compression = require('compression');

require('node-jsx').install({harmony: true});

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var Top       = React.createFactory(require('./components/Top.react.js'));
var Login     = React.createFactory(require('./components/Login.react.js'));
var Signup    = React.createFactory(require('./components/Signup.react.js'));
var User   = React.createFactory(require('./components/User.react.js'));
var Artist = React.createFactory(require('./components/Artist.react.js'));
var ArtistList = React.createFactory(require('./components/ArtistList.react.js'));
var Group = React.createFactory(require('./components/Group.react.js'));
var GroupList = React.createFactory(require('./components/GroupList.react.js'));
var Registration = React.createFactory(require('./components/Registration.react.js'));
var NotFound = React.createFactory(require('./components/NotFound.react.js'));

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    var css = '<link media="only screen and (max-device-width:480px)" rel="stylesheet" href="/stylesheets/sp_style.css"><link media="screen and (min-device-width:481px)" rel="stylesheet" href="/stylesheets/tab_style.css">';
    //var css = '<link rel="stylesheet" href="/stylesheets/sp_style.css">';
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

app.get('/users/:id', function(req, res) {
    var params = {id: req.params.id};
    var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
    var body   = React.renderToString(User({params: params}));
    var script = '/javascripts/user.js';
    var json   = JSON.stringify(params);
    res.render('main', {css: css, body: body, script: script, params: json});
});

app.get('/artists', function(req, res) {
    var css = '<link media="only screen and (max-device-width:480px)" rel="stylesheet" href="/stylesheets/sp_style.css"><link media="screen and (min-device-width:481px)" rel="stylesheet" href="/stylesheets/tab_style.css">';
    var body   = React.renderToString(ArtistList({}));
    var script = '/javascripts/artist-list.js';
    res.render('main', {css: css, body: body, script: script});
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

app.get('/groups', function(req, res) {
    var css = '<link media="only screen and (max-device-width:480px)" rel="stylesheet" href="/stylesheets/sp_style.css"><link media="screen and (min-device-width:481px)" rel="stylesheet" href="/stylesheets/tab_style.css">';
    var body   = React.renderToString(GroupList({}));
    var script = '/javascripts/group-list.js';
    res.render('main', {css: css, body: body, script: script});
});

app.get('/groups/:id', function(req, res) {
    var params = {id: req.params.id};
    var css = '<link media="only screen and (max-device-width:480px)" rel="stylesheet" href="/stylesheets/sp_style.css"><link media="screen and (min-device-width:481px)" rel="stylesheet" href="/stylesheets/tab_style.css">';
    var body   = React.renderToString(Group({params: params}));
    var script = '/javascripts/group.js';
    var json   = JSON.stringify(params);
    res.render('main', {css: css, body: body, script: script, params: json});
});

app.get('/registration', function(req, res) {
    var css = '<link media="only screen and (max-device-width:480px)" rel="stylesheet" href="/stylesheets/sp_style.css"><link media="screen and (min-device-width:481px)" rel="stylesheet" href="/stylesheets/tab_style.css">';
    var body   = React.renderToString(Registration({}));
    var script = '/javascripts/group-list.js';
    res.render('main', {css: css, body: body, script: script});
});

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

app.use(passport.initialize());
app.use(passport.session());

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

var twitterToken;
var twitterTokenSecret;
var twitterProfile;

passport.use(new TwitterStrategy({
    consumerKey: 'em7M7qW6NoKhCf9PPGvaLWfmA',
    consumerSecret: 'IH4iEnUVPB7BaSFNUGzfuoGPN6FZawawTqbXs619zopyu9E36U',
    callbackURL: '/auth/twitter/callback'
  },
  function (token, tokenSecret, profile, done) {
    twitterToken = token;
    twitterTokenSecret = tokenSecret;
    twitterProfile = profile;
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/signup',
                                     failureRedirect: '/login' }));

app.get('/signup', function(req, res) {
  var css = '<link rel="stylesheet" href="/stylesheets/bootstrap.min.css">';
  var body = React.renderToString(Signup({}));
  var script = '/javascripts/signup.js';
  var params = {token: twitterToken, tokenSecret: twitterTokenSecret, username: twitterProfile.username, userId: twitterProfile.id, screenname: escape(twitterProfile.displayName), info: escape(twitterProfile['_json']['description']), imageUrl: twitterProfile['_json']['profile_image_url']};
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
