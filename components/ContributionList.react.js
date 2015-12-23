var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var ContributionList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var type = props.type;
    var id = props.id;

    var accountQuery = new Parse.Query(type);
    accountQuery.equalTo('twitterUsername', id);

    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    twitterContributionQuery.matchesQuery(type.toLowerCase(), accountQuery);
    twitterContributionQuery.include("user");

    return {
      twitterCbs: twitterContributionQuery,
    };
  },

  render() {
    var totalFyucha = 0;
    var commits = (
      <div className="fyuchaCommits">
        {this.data.twitterCbs.map(function(twitterCb) {
          totalFyucha += twitterCb.point;
          return (
            <div className="fyuchaCommit">
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
        <div className="fyuchaGraph"></div>
        <h2 className="fyuchaCommitsTitle">最近のコミット</h2>
        {commits}
      </div>
    );
  },
});

module.exports = ContributionList;
