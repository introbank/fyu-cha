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
      <Navbar>
        <NavBrand><a href="/">Introbank</a></NavBrand>
        <Nav navbar right onSelect={this.handleSelect}>
          {
            this.data.user
            ? <NavItem eventKey={'logout'}>ログアウト</NavItem>
            : <NavItem eventKey={'login'} href="/login">ログイン</NavItem>
          }
          {
            this.data.user
            ? null
            : <NavItem eventKey={'signup'} href="/singup">ユーザ登録</NavItem>
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
  },

});

module.exports = Header;
