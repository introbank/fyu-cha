var React = require('react');
var Header = require('./Header.react.js');

var HowTo = React.createClass({

  render() {
    return (
      <div id="wrapper">
        <Header />
        <div className="howto">
          <img src="/images/howto1.png"/>
          <div className="nextButton">
            次へ
          </div>
        </div>
      </div>
    );
  }

});

module.exports = HowTo;
