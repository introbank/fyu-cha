var React = require('react');
var Header = require('./Header.react.js');

var HowTo = React.createClass({

  getInitialState: function() {
    return {
      pageIndex: 0,
      images: ["/images/howto1.png", "/images/howto2.png", "/images/howto3.png"],
      backButtons: ["戻る", "戻る", "戻る"],
      nextButtons: ["次へ", "次へ", "フォローする"]
    };
  },

  handleBack() {
    if (this.state.pageIndex === 0) {
      return;
    }
    this.setState({pageIndex: this.state.pageIndex - 1});
  },

  handleNext() {
    if (this.state.pageIndex === 2) {
      location.href = '/artists';
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
          <div className="counter">
            {this.state.pageIndex + 1}ページ目/全3ページ
          </div>
          <div className="buttonToolBar">
            {this.state.pageIndex !== 0 &&
              <div className="backButton" onClick={this.handleBack}>
                {this.state.backButtons[this.state.pageIndex]}
              </div>
            }
            <div className="nextButton" onClick={this.handleNext}>
              {this.state.nextButtons[this.state.pageIndex]}
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = HowTo;
