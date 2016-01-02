var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var ContributionList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var type = props.type;
    var id = props.id;
    console.log(id);
    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    if (type == "Dashboard"){
      twitterContributionQuery.equalTo("user", Parse.User.current());
      twitterContributionQuery.include("artist");
      twitterContributionQuery.include("group");
      twitterContributionQuery.descending("createdAt");
    }
    if (type == "User"){
      var accountQuery = new Parse.Query('User');
      accountQuery.equalTo('username', id);
      twitterContributionQuery.matchesQuery("user", accountQuery);
      twitterContributionQuery.include("group");
      twitterContributionQuery.include("artist");
      twitterContributionQuery.descending("createdAt");
    }
    else{
      var accountQuery = new Parse.Query(type);
      accountQuery.equalTo('twitterUsername', id);
      twitterContributionQuery.matchesQuery(type.toLowerCase(), accountQuery);
      twitterContributionQuery.include("user");
      twitterContributionQuery.descending("createdAt");
    }
    return {
      latestTwitterCbs: twitterContributionQuery.limit(100),
    };
  },

  render() {
    var totalFyucha = 0;
    this.data.latestTwitterCbs.map(function(twitterCb){
    });

    if (this.props.type == "Dashboard" || "User" ){
      var commits = (
        <div className="fyuchaCommits">
          {this.data.latestTwitterCbs.map(function(twitterCb) {
            var account = null;
            if (twitterCb.artist != null){
              account = twitterCb.artist;
            }
            else if (twitterCb.group != null){
              account = twitterCb.group;
            }
            if (account == null) {
              return;
            }
            totalFyucha += twitterCb.point;
            return (
              <div className="fyuchaCommit" key={twitterCb.objectId}>
                <div className="fyuchaCommitUserArea">
                  <div className="fyuchaCommitUserThumbnail">
                    <img src={account.imageUrl} alt={account.name} />
                  </div>
                  <p className="fyuchaCommitUserName">{account.name}</p>
                  <p className="fyuchaCommitUserAccount">@{account.twitterUsername}</p>
                </div>
                <div className="fyuchaCommitActionArea">
                  <p className="fyuchaCommitActionText">{twitterCb.type}</p>
                  <div className="fyuchaCommitActionNumerals">{twitterCb.point}</div>
                </div>
              </div>
            );
          })}
        </div>
      )
      return (
        <div>
          <p className="fyuchaTotal">TOTAL<span className="fyuchaToalNumerals">{totalFyucha}</span></p>
          <h2 className="fyuchaCommitsTitle">最近のコミット</h2>
          {commits}
        </div>
      );
    }
    else{
      var commits = (
        <div className="fyuchaCommits">
          {this.data.latestTwitterCbs.map(function(twitterCb) {
            totalFyucha += twitterCb.point;
            if (!twitterCb.user) {
              return;
            }
            return (
              <div className="fyuchaCommit" key={twitterCb.objectId}>
                <div className="fyuchaCommitUserArea">
                  <div className="fyuchaCommitUserThumbnail">
                    <img src={twitterCb.user.imageUrl} alt={twitterCb.user.name} />
                  </div>
                  <p className="fyuchaCommitUserName">{twitterCb.user.name}</p>
                  <p className="fyuchaCommitUserAccount">@{twitterCb.user.username}</p>
                </div>
                <div className="fyuchaCommitActionArea">
                  <p className="fyuchaCommitActionText">{twitterCb.type}</p>
                  <div className="fyuchaCommitActionNumerals">{twitterCb.point}</div>
                </div>
              </div>
            );
          })}
        </div>
      )
      return (
        <div>
          <p className="fyuchaTotal">TOTAL<span className="fyuchaToalNumerals">{totalFyucha}</span></p>
          <h2 className="fyuchaCommitsTitle">最近のコミット</h2>
          {commits}
        </div>
      );
    }
  },
});

module.exports = ContributionList;
