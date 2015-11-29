var React  = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');

var Dashboard = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    var user = ParseReact.currentUser;
    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    twitterContributionQuery.equalTo("user", Parse.User.current());

    return {
      user: user,
      twitterCbs: twitterContributionQuery
    };
  },

   

  render() {

    return (
      <div>
        <h2>ダッシュボード</h2>
        <div>こんちには、{this.data.user.authData.twitter.screen_name}さん</div>
        <h3>TwitterContributions</h3>
        <p>あなたのTwitter上での貢献は以下のとおりです</p>
        <ul>
        {this.data.twitterCbs.map(function(twitterCb){
          if (twitterCb.artist){
            return(
              <li>{twitterCb.artist.name}(@{twitterCb.artist.twitterUsername})さんに{twitterCb.type}して{twitterCb.point}ふゅーちゃ！</li>
            )
          }
          else if(twitterCb.group){
            return (
              <li>{twitterCb.group.name}(@{twitterCb.group.twitterUsername})さんに{twitterCb.type}して{twitterCb.point}ふゅーちゃ！</li>
            )
          }
          })}
        </ul>
      </div>
    );
  },

});

module.exports = Dashboard;
