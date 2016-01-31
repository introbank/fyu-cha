var React = require('react');
var Header = require('./Header.react.js');

var HowTo = React.createClass({

  getInitialState: function() {
    return {
      pageIndex: 0,
      images: ["/images/howto1.png", "/images/howto2.png", "/images/howto3.png"],
      buttons: ["次へ", "次へ", "トップへ"]
    };
  },

  handleNext() {
    if (this.state.pageIndex === 2) {
      location.href = '/';
      return;
    }
    this.setState({pageIndex: this.state.pageIndex + 1});
  },

  render() {
    return (
      <div id="wrapper">
        <Header />
        <div className="howto">
          <img onClick={this.handleNext} src={this.state.images[this.state.pageIndex]}/>
          <div className="nextButton" onClick={this.handleNext}>
            {this.state.buttons[this.state.pageIndex]}
          </div>
        </div>
      </div>
    );
  }

});

module.exports = HowTo;
