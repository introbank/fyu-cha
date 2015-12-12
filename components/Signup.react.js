var React       = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var Header      = require('./Header.react.js');
var bootstrap   = require('react-bootstrap');
var Input       = bootstrap.Input;
var ButtonInput = bootstrap.ButtonInput;
var Button      = bootstrap.Button;
var Alert       = bootstrap.Alert;
var setting     = require('../setting');

var Signup = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    return {
      user: ParseReact.currentUser
    };
  },

  getInitialState() {
    return {
      error: null,
      complete: false,
    };
  },

  componentWillMount() {
    if (this.data.user) {
      location.href = '/';
    }
  },

  signup() {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.parse.com/1/users', true);
    xhr.setRequestHeader('X-Parse-Application-Id', setting.parse.appId);
    xhr.setRequestHeader('X-Parse-REST-API-Key', setting.parse.restKey);
    xhr.setRequestHeader('X-Parse-Revocable-Session', '1');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.response);
        self.setState({complete: true});
      } else {
        console.error('Error !');
        self.setState({error: true});
      }
    };

    var username = this.props.params.username;
    var password = this.refs.password.getValue();
    var userId = this.props.params.userId;
    var name = this.props.params.screenname;
    var info = this.props.params.info;
    var imageUrl = this.props.params.imageUrl;
    var consumerKey = 'em7M7qW6NoKhCf9PPGvaLWfmA';
    var consumerSecret = 'IH4iEnUVPB7BaSFNUGzfuoGPN6FZawawTqbXs619zopyu9E36U';
    var oauthToken = this.props.params.token;
    var oauthTokenSecret = this.props.params.tokenSecret;

    var data = '{"username":"' + username + '","password":"' + password + '","name":"' + name + '","info":"' + info + '","imageUrl":"' + imageUrl + '","authData": {"twitter": {"id": "' + userId + '","screen_name": "' + username + '","consumer_key": "' + consumerKey + '","consumer_secret": "' + consumerSecret + '","auth_token": "' + oauthToken + '","auth_token_secret": "' + oauthTokenSecret + '"}}}'
    xhr.send(data);
  },

  render() {
    return (
      <div>
        <Header />
        <h2>ユーザ登録</h2>
        <h2>ユーザーID: {this.props.params.username}</h2>
        {
          this.state.error
          ? <Alert bsStyle="danger">エラーが発生しました</Alert>
          : null
        }
        {
          this.state.complete
          ? <Alert bsStyle="success">ユーザ登録が完了しました。<a href="/login">こちら</a>からログインしてください</Alert>
          : null
        }
        <form>
          <Input ref="password" type="password" label="Password" />
          <ButtonInput value="登録" onClick={this.signup} />
        </form>
      </div>
    );
  }

});

module.exports = Signup;
