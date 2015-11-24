var React     = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var Header    = require('./Header.react.js');
var Dashboard = require('./Dashboard.react.js');
var LP        = require('./LP.react.js');

var Top = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    var artistQuery = new Parse.Query('Artist');
    var groupQuery = new Parse.Query('Group');
    return {
      user: ParseReact.currentUser,
      artist: artistQuery,
      group: groupQuery
    };
  },

  render() {
    if (this.data.user) {
      // ログイン済みの場合
      return (
        <div>
          <Header />
          <Dashboard />
          <h3>アーティスト</h3>
          <ul>
            {this.data.artist.map(function (artist) {
              return (
                <li><a href={'artists/' + artist.twitterUsername}>{artist.name}</a></li>
              )
            })}
          </ul>
          <h3>グループ</h3>
          <ul>
            {this.data.group.map(function (group) {
              return (
                <li><a href={'groups/' + group.twitterUsername}>{group.name}</a></li>
              )
            })}
          </ul>
        </div>
      );
    } else if (this.data.artist) {
      return (
        <div>
          <Header />
          <LP />
          <h3>アーティスト</h3>
          <ul>
            {this.data.artist.map(function (artist) {
              return (
                <li><a href={'artists/' + artist.twitterUsername}>{artist.name}</a></li>
              )
            })}
          </ul>
          <h3>グループ</h3>
          <ul>
            {this.data.group.map(function (group) {
              return (
                <li><a href={'groups/' + group.twitterUsername}>{group.name}</a></li>
              )
            })}
          </ul>
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
