var React       = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var Header      = require('./Header.react.js');
var setting     = require('../setting');

var Signup = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      error: null,
      complete: false,
      serverSideRendering: true
    };
  },

  componentWillMount() {
    if (this.data.user) {
      location.href = '/';
    }
  },

  componentDidMount() {
    this.setState({serverSideRendering: false});
  },

  observe() {
    return {
      user: ParseReact.currentUser
    };
  },

  signup() {
    var username = this.props.params.username;
    var password = this.refs.password.getValue();
    var userId = this.props.params.userId;
    var name = unescape(this.props.params.screenname);
    var info = unescape(this.props.params.info);
    var imageUrl = this.props.params.imageUrl;
    var consumerKey = 'em7M7qW6NoKhCf9PPGvaLWfmA';
    var consumerSecret = 'IH4iEnUVPB7BaSFNUGzfuoGPN6FZawawTqbXs619zopyu9E36U';
    var oauthToken = this.props.params.token;
    var oauthTokenSecret = this.props.params.tokenSecret;

    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("name", name);
    user.set("info", info);
    user.set("imageUrl", imageUrl);
    user.set("authData", {"twitter": {"id": userId,"screen_name": username, "consumer_key": consumerKey, "consumer_secret": consumerSecret, "auth_token": oauthToken, "auth_token_secret": oauthTokenSecret}});

    user.signUp(null, {
      success: function(user) {
        location.href = '/';
      },
      error: function(user, error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  },

  render() {
    if (this.state.serverSideRendering) {
      return <div />
    }

    return (
      <div>
        <Header />
        <h2>ユーザ登録</h2>
        {this.props.params.username}
        <form>
          <input type="password" label="Passwordを入力して下さい" />
          <input value="登録" type='submit' onClick={this.signup} />
        </form>
      </div>
    );
  }

});

module.exports = Signup;
