var React      = require('react');
var Parse      = require('../lib/parse');

var AccountInfo = React.createClass({

  render() {
    return (
      <div className="mainInfo">
        {this.props.account &&
          <div className="contents">
            <img src={this.props.account.imageUrl} className="iconImage" />
            <h1>{this.props.account.name}</h1>
            <p className="account">@{this.props.account.twitterUsername}</p>
            <span>{this.props.account.info}</span>
          </div>
        }
      </div>
    );
  },

});

module.exports = AccountInfo;
