var React      = require('react');
var Parse      = require('../lib/parse');
var Follow       = require('./Follow.react.js');

var AccountInfo = React.createClass({

  render() {
    return (
      <div className="mainInfo">
        {this.props.account &&
          <div className="contents">
            {(this.props.account.className === 'Artist' || this.props.account.className === 'Group') &&
              <Follow account={this.props.account} />
            }
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
