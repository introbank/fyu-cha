var React       = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var Header      = require('./Header.react.js');
var bootstrap   = require('react-bootstrap');
var setting     = require('../setting');

var Login = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState: function() {
    return {
      username: '',
      password: '',
      error: null
    };
  },


  observe() {
    return {
      user: ParseReact.currentUser
    };
  },

  componentWillMount() {
    if (this.data.user) {
      location.href = '/';
    }
  },

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  },
  
  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  },

  login() {
    var self = this;
    var username = this.state.username;
    var password = this.state.password;

    Parse.User.logIn(username, password, {
      success: function(user) {
        location.href = '/';
      },
      error: function(user, error) {
        alert("Error: " + error.code + " " + error.message);
        self.setState({
          error: true
        });
      }
    });
  },

  render() {
    if (this.state.serverSideRendering) {
      return <div />
    }

    return (
      <div id="wrapper">
        <Header />
        <div id="content">
          <div className="contents">
            <div className="signup">
              <h1>ログイン</h1>
              <form>
                <div className="label">Twitter アカウントを入力してください</div>
                  <input ref="password" type="text" onChange={this.handleUsernameChange} />
                <div className="label">ふゅーちゃ！パスワードを入力してください</div>
                  <input ref="password" type="password" onChange={this.handlePasswordChange} />
                <div className="submitButton" onClick={this.login}>
                  ログインしてマイページに行く
                </div>
              </form>
              {this.state.error &&
              <div>入力に誤りがあります</div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Login;
