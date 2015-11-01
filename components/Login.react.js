var React = require('react');
var Header = require('./Header.react.js');

var Login = React.createClass({

  render: function() {
    return (
      <div>
        <Header />
        <h2>ログイン</h2>
      </div>
    );
  }

});

module.exports = Login;
