var React     = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var Header    = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var Dashboard = require('./Dashboard.react.js');
var LP        = require('./LP.react.js');

var Top = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
  },

  render() {
    return (
      <div>
        <Header />
        <Navigation />
        <Dashboard />
      </div>
    );
  },
});

module.exports = Top;
