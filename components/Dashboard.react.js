var React  = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');

var Dashboard = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    return {
      user: ParseReact.currentUser
    };
  },

  render() {
    return (
      <div>
        <h2>ダッシュボード</h2>
        <div>こんちには、{this.data.user.authData.twitter.screen_name}さん</div>
      </div>
    );
  },

});

module.exports = Dashboard;
