var React      = require('react');
var Parse      = require('../lib/parse');
var ParseReact = require('parse-react');
var bootstrap  = require('react-bootstrap');
var Navbar     = bootstrap.Navbar;
var NavBrand   = bootstrap.NavBrand;
var Nav        = bootstrap.Nav;
var NavItem    = bootstrap.NavItem;

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
        <span className="mainLogo"><a href="/">ふゅーちゃ</a></span>
        <span className="loginArea cf" onSelect={this.handleSelect}>
          <ul>
          {
            this.data.user
            ? <li className="mR10"><a eventKey={'logout'}>ログアウト</a></li>
          : <li className="mR10"><a eventKey={'login'} onClick={this.login}>ログイン</a></li>
          }
          {
            this.data.user
            ? <li><a eventKey={'user'} onClick={this.profile}>プロフィール</a></li>
          : <li><a eventKey={'signup'} onClick={this.signup}>ユーザ登録</a></li>
          }
          </ul>
        </span>
      </div>
    );
  },

  handleSelect(selected) {
    switch(selected) {
      case 'logout':
        this.logout();
        break;
    }
  },

  logout() {
    Parse.User.logOut();
    location.href = '/';
  },

  login() {
    location.href = '/login';
  },

  signup() {
    location.href = '/signup';
  },

  user() {
    console.log(this.data.user);
    location.href = '/users/' + this.data.user.username;
  },

});

module.exports = Header;
