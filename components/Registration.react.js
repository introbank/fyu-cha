var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');

var Registration = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var artistQuery = new Parse.Query('Artist');
    artistQuery.ascending('name');

    return {
      artist: artistQuery,
    };
  },

  render() {
    return (
      <div id="wrapper">
        <Header />
        <Navigation />
        <div id="content">
        </div>
      </div>
    );
  },

});

module.exports = Registration;
