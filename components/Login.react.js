var React                = require('react');
var Parse                = require('parse/node').Parse;
var ParseReact           = require('parse-react');
var Header               = require('./Header.react.js');
var {Input, ButtonInput} = require('react-bootstrap');

var Login = React.createClass({

  render() {
    return (
      <div>
        <Header />
        <h2>ログイン</h2>
        <form>
          <Input type="email" label="Email Address" placeholder="Enter email" />
          <Input type="password" label="Password" />
          <ButtonInput value="ログイン" />
        </form>
      </div>
    );
  }

});

module.exports = Login;
