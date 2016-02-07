var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Contribution = require('./Contribution.react.js');
var PageType = require('../lib/PageType.js');

var ContributionList = React.createClass({
  mixins: [ParseReact.Mixin],
  observe(props, state) {
    var type = props.type;
    var id = props.id;
    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    var introbankContributionQuery = new Parse.Query('IntrobankContribution');
    if (PageType.isDashboard(type)){
      // twitter
      twitterContributionQuery.equalTo("user", Parse.User.current());
      twitterContributionQuery.include("artist");
      twitterContributionQuery.include("group");
      twitterContributionQuery.descending("createdAt");
      // introbank
      introbankContributionQuery.equalTo("user", Parse.User.current());
      introbankContributionQuery.include("artist");
      introbankContributionQuery.include("group");
      introbankContributionQuery.descending("createdAt");
    }
    else if (PageType.isUser(type)){
      var accountQuery = new Parse.Query('User');
      accountQuery.equalTo('username', id);
      // twitter
      twitterContributionQuery.matchesQuery("user", accountQuery);
      twitterContributionQuery.include("group");
      twitterContributionQuery.include("artist");
      twitterContributionQuery.descending("createdAt");
      // introbank
      introbankContributionQuery.matchesQuery("user", accountQuery);
      introbankContributionQuery.include("artist");
      introbankContributionQuery.include("group");
      introbankContributionQuery.descending("createdAt");
    }
    else{
      var accountQuery = new Parse.Query(type);
      accountQuery.equalTo('twitterUsername', id);
      // twitter
      twitterContributionQuery.matchesQuery(type.toLowerCase(), accountQuery);
      twitterContributionQuery.include("user");
      twitterContributionQuery.descending("createdAt");

      // introbank
      introbankContributionQuery.matchesQuery(type.toLowerCase(), accountQuery);
      introbankContributionQuery.include("artist");
      introbankContributionQuery.include("group");
      introbankContributionQuery.descending("createdAt");
    }
    return {
      latestTwitterCbs: twitterContributionQuery.limit(100),
      latestIntroCbs: introbankContributionQuery.limit(100),
    };
  },

  createFyuchaData(){
    var fyuchaList = [];
    var totalFyucha = 0;
    this.data.latestTwitterCbs.map(function(twitterCb){
      totalFyucha += twitterCb.point;
      fyuchaList.push(twitterCb);
    });

    this.data.latestIntroCbs.map(function(introCb){
      totalFyucha += introCb.point;
      fyuchaList.push(introCb);
    });
    fyuchaList.sort(
      function(a, b){
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    );

    return {totalFyucha: totalFyucha, fyuchaList: fyuchaList};
  },

  render() {
    var data = this.createFyuchaData(); 
    var fyuchaList = [];
    data.fyuchaList.map(function(fyucha){
      fyuchaList.push((<Contribution type={this.props.type} fyucha={fyucha} key={fyucha.className + fyucha.objectId}/>));
    }, this);

    return (
      <div>
        <p className="fyuchaTotal">TOTAL<span className="fyuchaToalNumerals">{data.totalFyucha}</span></p>
        <h2 className="fyuchaCommitsTitle">最近のコミット</h2>
        <div className="fyuchaCommits">
        {data.fyuchaList.map(function(fyucha){
          return (
            <Contribution type={this.props.type} fyucha={fyucha} key={fyucha.className + fyucha.objectId}/>)
          }, this)
        }
        </div>
      </div>
    );
  },
});

module.exports = ContributionList;
