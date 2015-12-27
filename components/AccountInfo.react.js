var React      = require('react');
var Parse      = require('../lib/parse');
var Follow       = require('./Follow.react.js');

var AccountInfo = React.createClass({


  render() {
    return (
      <div className="mainInfo">
        {this.props.account &&
          <div className="contents">
            <img src={this.props.account.imageUrl} className="iconImage" />
            <h1>{this.props.account.name}</h1>
            {this.props.account.className === '_User'
            ? <div>
                <p className="account">@{this.props.account.username}</p>
              </div>
            : <div>
                <Follow account={this.props.account} />
                <p className="account">@{this.props.account.twitterUsername}</p>
              </div>
            }
            <span>{this.props.account.info}</span>
          </div>
        }
      </div>
    );
  },

});

module.exports = AccountInfo;
