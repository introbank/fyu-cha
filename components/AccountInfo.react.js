var React      = require('react');
var Parse      = require('../lib/parse');
var Follow       = require('./Follow.react.js');
var AccountInfoLib = require('../lib/AccountInfoLib.js');

var AccountInfo = React.createClass({

  render() {
    return (
      <div className="mainInfo">
        {this.props.account &&
          <div className="contents">
            {this.props.account.className === '_User'
              ? <div />
              : <Follow account={this.props.account} />
            }
            <img src={AccountInfoLib.getImageUrl(this.props.account)} className="iconImage" />
            <h1>{AccountInfoLib.getAccountName(this.props.account)}</h1>
            <div>
              <p className="account">@{AccountInfoLib.getUsername(this.props.account)}</p>
            </div>
            <span>{this.props.account.info}</span>
          </div>
        }
      </div>
    );
  },

});

module.exports = AccountInfo;
