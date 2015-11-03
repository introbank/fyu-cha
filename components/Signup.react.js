var React       = require('react');
var Parse       = require('parse/node').Parse;
var ParseReact  = require('parse-react');
var Header      = require('./Header.react.js');
var bootstrap   = require('react-bootstrap');
var Input       = bootstrap.Input;
var ButtonInput = bootstrap.ButtonInput;
var Button      = bootstrap.Button;
var Codebird    = require("codebird");

var appId = 'LID0MpbVk0JBivgVMSO6hXO5cQ3wBdlgvA8eEbES';
var jsKey = 'VXP7SEeJtZs02Qch88qpi0olZZCoXxVRgM2dmCyO';
var restKey = 'NX4EsDtr6k1OsyN9BjBpHrJZUsZPUaaI1MO0Pzxm';
Parse.initialize(appId, jsKey);

var cb     = new Codebird;
var key    = "LYiT9cjdJgWypf2MJa7THyLKG";
var secret = "2jDPDPRm8Ieu3BfaksnekPn7Zri24Krs9xPClafEoQXKnga5Aj";
cb.setConsumerKey(key, secret);

var Signup = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    return {
      user: ParseReact.currentUser
    };
  },

  getPin() {
    cb.__call(
      "oauth_requestToken",
      {oauth_callback: "oob"},
      function (reply, rate, err) {
        if (err) {
          console.log("error response or timeout exceeded" + err.error);
        }
        if (reply) {
          cb.setToken(reply.oauth_token, reply.oauth_token_secret);
          cb.__call(
            "oauth_authorize",
            {},
            function (auth_url) {
              window.codebird_auth = window.open(auth_url);
            }
          );
        }
      }
    );
  },

  signup() {
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();
    var pin      = this.refs.pin.getValue();

    cb.__call(
      "oauth_accessToken",
      {oauth_verifier: pin},
      function (reply, rate, err) {
        if (err) {
          console.log("error response or timeout exceeded" + err.error);
          return;
        }

        if (!reply) {
          return;
        }

        cb.setToken(reply.oauth_token, reply.oauth_token_secret);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.parse.com/1/users', true);
        xhr.setRequestHeader('X-Parse-Application-Id', appId);
        xhr.setRequestHeader('X-Parse-REST-API-Key', restKey);
        xhr.setRequestHeader('X-Parse-Revocable-Session', '1');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log(xhr.response);
          } else {
            console.log('Error !');
            return;
          }
        };

        data = '{"username":"' + username + '","password":"' + password + '","authData": {"twitter": {"id": "' + reply.user_id + '","screen_name": "' + reply.screen_name + '","consumer_key": "LYiT9cjdJgWypf2MJa7THyLKG","consumer_secret": "2jDPDPRm8Ieu3BfaksnekPn7Zri24Krs9xPClafEoQXKnga5Aj","auth_token": "' + reply.oauth_token + '","auth_token_secret": "' + reply.oauth_token_secret + '"}}}'
        // $("#status").html = xhr.responseText;
        xhr.send(data);
        setTimeout(function() {
          Parse.User.logIn(username, password, {
            success: function(user) {
              console.log('success');
            },
            error: function(user, error) {
              console.log('error');
              return;
            }
          });
        }, 10000);
      }
    );
  },

  render() {
    return (
      <div>
        <Header />
        <h2>ユーザ登録</h2>
        <form>
          <Input ref="username" type="email" label="Email Address" placeholder="Enter email" />
          <Input ref="password" type="password" label="Password" />
          <Input ref="pin" type="text" label="PIN" />
          <ButtonInput value="PIN" onClick={this.getPin} />
          <ButtonInput value="登録" onClick={this.signup} />
        </form>
      </div>
    );
  },

});

module.exports = Signup;
