var React      = require('react');
var Parse      = require('../lib/parse');
var ParseReact = require('parse-react');

var Header = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    return {
      user: ParseReact.currentUser,
    }
  },

  render() {
    return (
      <div id="header" className="cf">
        <span className="mainLogo" onClick={this.top}>ふゅーちゃ</span>
        <span className="loginArea cf">
          <ul>
          {
            this.data.user
            ? <li className="mR10" onClick={this.logout}>ログアウト</li>
          : <li className="mR10" onClick={this.login}>ログイン</li>
          }
          {
            this.data.user
            ? <li onClick={this.profile}>プロフィール</li>
          : <li onClick={this.signup}>ユーザ登録</li>
          }
          </ul>
        </span>
      </div>
    );
  },

  top() {
    location.href = '/';
  },

  logout() {
    Parse.User.logOut();
    location.href = '/';
  },

  login() {
    location.href = '/login';
  },

  signup() {
    location.href = '/auth/twitter';
  },

  profile() {
    location.href = '/users/' + this.data.user.username;
  },

});

module.exports = Header;
