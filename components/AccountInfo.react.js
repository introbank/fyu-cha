var React      = require('react');
var Parse      = require('../lib/parse');

var AccountInfo = React.createClass({

  render() {
    return (
      <div className="mainInfo">
        <div className="contents">
          <img src={this.props.account.imageUrl} className="artistImage"></img>
          <h1>{this.props.account.name}</h1>
          <p className="artistAccount">@{this.props.account.twitterUsername}</p>
          <span>{this.props.account.info}</span>
        </div>
      </div>
    );
  },

});

module.exports = AccountInfo;
