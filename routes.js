var React = require('react'),
    {Route, DefaultRoute} = require('react-router'),
    App = require('./components/App.react.js')
;

module.exports = function() {
  return (
    <Route name="app" path="/" handler={App}>
    </Route>
  );
};

