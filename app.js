'use strict';

var express     = require('express'),
    app         = express(),
    fs          = require('fs'),
    browserify  = require('browserify'),
    reactify    = require('reactify'),
    Handlebars  = require('handlebars'),
    React       = require('react'),
    Router      = require('react-router')
;

require('node-jsx').install({ harmony: true });
var routes = require('./routes')();

var template = Handlebars.compile(fs.readFileSync('./templates/index.hbs').toString());

app.get('/bundle.js', function(req, res) {
  res.setHeader('content-type', 'application/javascript');
  browserify('./browser')
    .transform({ harmony: true }, reactify)
    .bundle()
    .pipe(res)
  ;
});

app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
    res.send(template({
      markup: React.renderToString(React.createElement(Handler, {}))
    }));
  });
});

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);

