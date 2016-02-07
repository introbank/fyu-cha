var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var AccountInfoLib = require('../lib/AccountInfoLib.js');
var PageType = require('../lib/PageType.js');

var Contribution = React.createClass({
  mixins: [ParseReact.Mixin],
  observe(props, state) {
  },

  render() {
    var fyucha = this.props.fyucha;
    if (PageType.isDashboard(this.props.type) || PageType.isUser(this.props.type) ){
      var account = null;
      if (fyucha.artist != null){
        account = fyucha.artist;
      }
      else if (fyucha.group != null){
        account = fyucha.group;
      }
      if (account == null) {
        return null;
      }
      return (
        <div className="fyuchaCommit" key={this.props.key}>
          <a href={AccountInfoLib.getUrl(account)}>
            <div className="fyuchaCommitUserArea">
              <div className="fyuchaCommitUserThumbnail">
                <img src={AccountInfoLib.getImageUrl(account)} alt={AccountInfoLib.getAccountName(account)} />
              </div>
              <p className="fyuchaCommitUserName">{AccountInfoLib.getAccountName(account)}</p>
              <p className="fyuchaCommitUserAccount">@{AccountInfoLib.getUsername(account)}</p>
            </div>
          </a>
          <div className="fyuchaCommitActionArea">
            <p className="fyuchaCommitActionText">{fyucha.type}</p>
            <div className="fyuchaCommitActionNumerals">{fyucha.point}</div>
          </div>
        </div>
      );
    }
    else{
      if (!fyucha.user) {
        return null;
      }
      else{
        return (
          <div className="fyuchaCommit" key={this.props.key}>
            <a href={AccountInfoLib.getUrl(fyucha.user)}>
              <div className="fyuchaCommitUserArea">
                <div className="fyuchaCommitUserThumbnail">
                  <img src={fyucha.user.imageUrl} alt={AccountInfoLib.getAccountName(fyucha.user)} />
                </div>
                <p className="fyuchaCommitUserName">{AccountInfoLib.getAccountName(fyucha.user)}</p>
                <p className="fyuchaCommitUserAccount">@{AccountInfoLib.getUsername(fyucha.user)}</p>
              </div>
            </a>
            <div className="fyuchaCommitActionArea">
              <p className="fyuchaCommitActionText">{fyucha.type}</p>
              <div className="fyuchaCommitActionNumerals">{fyucha.point}</div>
            </div>
          </div>
        );
      }
    }
  },

});

module.exports = Contribution;
