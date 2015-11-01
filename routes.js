var React = require('react');
var {Route, DefaultRoute} = require('react-router');
var App = require('./components/App.react.js');
var Login = require('./components/Login.react.js');
var Dashborad = require('./components/Dashborad.react.js');

module.exports = function() {
  return (
    <Route name="app" path="/" handler={App}>
      <Route name="login" handler={Login} />
      <DefaultRoute handler={Dashborad} />
    </Route>
  );
};

