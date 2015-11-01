var React = require('react');
var Parse = require('parse/node');
var ParseReact = require('parse-react');
var {Navbar, NavBrand, Nav, NavItem} = require('react-bootstrap');

Parse.initialize('LID0MpbVk0JBivgVMSO6hXO5cQ3wBdlgvA8eEbES', 'VXP7SEeJtZs02Qch88qpi0olZZCoXxVRgM2dmCyO');

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
        <Nav>
          {
            this.data.user
            ? <NavItem eventKey={1} href="/login">ログイン</NavItem>
            : <NavItem eventKey={2} onClick={this.logout}>ログアウト</NavItem>
          }
        </Nav>
      </Navbar>
    );
  },

  logout() {
    Parse.User.logOut();
  },

});

module.exports = Header;
