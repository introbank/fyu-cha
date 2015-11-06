var React     = require('react');
var Parse       = require('parse');
var ParseReact  = require('parse-react');
var Header    = require('./Header.react.js');
var Dashboard = require('./Dashboard.react.js');
var LP        = require('./LP.react.js');

var Top = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    return {
      user: ParseReact.currentUser
    };
  },

  render() {
    if (this.data.user) {
      // ログイン済みの場合
      return (
        <div>
          <Header />
          <Dashboard />
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <LP />
        </div>
      );
    }
  },

});

module.exports = Top;
