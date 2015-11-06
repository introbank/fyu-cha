var React      = require('react');
var Parse      = require('parse');
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
      <Navbar>
        <NavBrand><a href="/">Introbank</a></NavBrand>
        <Nav navbar right onSelect={this.handleSelect}>
          {
            this.data.user
            ? <NavItem eventKey={'logout'}>ログアウト</NavItem>
            : <NavItem eventKey={'login'} onClick={this.login}>ログイン</NavItem>
          }
          {
            this.data.user
            ? <NavItem eventKey={'profile'} onClick={this.profile}>プロフィール</NavItem>
            : <NavItem eventKey={'signup'} onClick={this.signup}>ユーザ登録</NavItem>
          }
        </Nav>
      </Navbar>
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

  profile() {
    console.log(this.data.user);
    location.href = '/profile/' + this.data.user.username;
  },

});

module.exports = Header;
