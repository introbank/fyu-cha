var React      = require('react');
var Parse      = require('../lib/parse');
var ParseReact = require('parse-react');
var Header     = require('./Header.react.js');
var bootstrap  = require('react-bootstrap');
var Alert      = bootstrap.Alert;

var NotFound = React.createClass({

  mixins: [ParseReact.Mixin],

  observe() {
    return {};
  },

  render() {
    return (
      <div>
        <Header />
        <Alert bsStyle="warning">
          <h2>ページが見つかりませんでした</h2>
        </Alert>
      </div>
    );
  },

});

module.exports = NotFound;
