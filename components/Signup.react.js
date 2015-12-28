var React       = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var Header      = require('./Header.react.js');
var setting     = require('../setting');

var Signup = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState: function() {
    return {
      password: '',
      confirm: '',
      error: false
    };
  },

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

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  },

  handleConfirmChange(e) {
    this.setState({confirm: e.target.value});
  },

  signup() {
    if (this.state.password !== this.state.confirm) {
      this.setState({error: true});
      return;
    }

    var username = this.props.params.username;
    var password = this.state.password;
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
      <div id="wrapper">
        <Header />
        <div id="content">
          <div className="contents">
            <div className="signup">
              <h1>ユーザ登録</h1>
              <div className="box">
                <img src={this.props.params.imageUrl} className="iconImage" />
              </div>
              <div className="box name">
                <h2>{this.props.params.screenname}</h2>
                <p className="account">@{this.props.params.username}</p>
              </div>
              <div className="after" />
              <div className="label">新規パスワードを設定してください</div>
              <form>
                <input ref="password" type="password" onChange={this.handlePasswordChange} />
              </form>
              <div className="description">必ずTwitterアカウントとは別のパスワードを入力してください</div>
              <div className="label">確認のためもう一度入力してください</div>
              <form>
                <input ref="password" type="password" onChange={this.handleConfirmChange} />
              </form>
              <div className="submitButton" onClick={this.signup}>
                登録してマイページへ行く
              </div>
              {this.state.error &&
                <div>入力に誤りがあります</div>
              }
            </div>
          </div>
          Introbankは「<a href="/privacy.html" target="fyu-cha.privacy">プライバシーポリシー</a>
          」にしたがってお客様の情報を取り扱います。
        </div>
      </div>
    );
  }

});

module.exports = Signup;
