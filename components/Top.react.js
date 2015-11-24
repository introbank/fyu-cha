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
    return {
      user: ParseReact.currentUser,
      artist: artistQuery
    };
  },

  render() {
    if (this.data.user) {
      // ログイン済みの場合
      return (
        <div>
          <Header />
          <Dashboard />
          {this.data.artist.map(function (artist) {
            return (
              <p><a href={'artists/' + artist.twitterUsername}>{artist.name}</a></p>
            )
          })}
        </div>
      );
    } else if (this.data.artist) {
      return (
        <div>
          <Header />
          <LP />
          {this.data.artist.map(function (artist) {
            return (
              <p><a href={'artists/' + artist.twitterUsername}>{artist.name}</a></p>
            )
          })}
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
