var React = require('react');
var Parse = require('parse/node');
var ParseReact = require('parse-react');
var {Link, RouteHandler} = require('react-router');
var {Navbar, NavBrand, Nav, NavItem} = require('react-bootstrap');

Parse.initialize('LID0MpbVk0JBivgVMSO6hXO5cQ3wBdlgvA8eEbES', 'VXP7SEeJtZs02Qch88qpi0olZZCoXxVRgM2dmCyO');

var App = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    return {
      user: ParseReact.currentUser,
    }
  },

  render() {
    return (
      <div>
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
        <RouteHandler {...this.props} />
      </div>
    );
  },

  logout() {
    Parse.User.logOut();
  },

});

module.exports = App;
