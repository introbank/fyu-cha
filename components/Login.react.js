var React       = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var Header      = require('./Header.react.js');
var bootstrap   = require('react-bootstrap');
var Input       = bootstrap.Input;
var ButtonInput = bootstrap.ButtonInput;
var Button      = bootstrap.Button;
var Alert       = bootstrap.Alert;

var Login = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      error: null,
    };
  },

  observe() {
    return {
      user: ParseReact.currentUser
    };
  },

  login() {
    var self = this;
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();

    Parse.User.logIn(username, password, {
      success: function(user) {
        // 更新するために無理やり発火してる
        self.setState({
          error: null
        });
      },
      error: function(user, error) {
        console.error(error);
        self.setState({
          error: error
        });
      }
    });
  },

  logout() {
    Parse.User.logOut();
  },

  render() {
    console.log('render', this.data.user);

    if (this.data.user) {
      return (
        <div>
          <Header />
          <Button onClick={this.logout}>ログアウト</Button>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <h2>ログイン</h2>
        {
          this.state.error
          ? <Alert bsStyle="danger">{this.state.error}</Alert>
          : null
        }
        <form>
          <Input ref="username" type="email" label="Email Address" placeholder="Enter email" />
          <Input ref="password" type="password" label="Password" />
          <ButtonInput value="ログイン" onClick={this.login} />
        </form>
      </div>
    );
  }

});

module.exports = Login;

