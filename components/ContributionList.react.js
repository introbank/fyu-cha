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
      // introbank
      introbankContributionQuery.equalTo("user", Parse.User.current());
    }
    else if (PageType.isUser(type)){
      var accountQuery = new Parse.Query('User');
      accountQuery.equalTo('username', id);
      // twitter
      twitterContributionQuery.matchesQuery("user", accountQuery);
      // introbank
      introbankContributionQuery.matchesQuery("user", accountQuery);
    }
    else{
      var accountQuery = new Parse.Query(type);
      // twitter
      twitterContributionQuery.equalTo(type.toLowerCase(), this.props.account);
      twitterContributionQuery.notEqualTo("user", null);

      // introbank
      introbankContributionQuery.equalTo(type.toLowerCase(), this.props.account);
      introbankContributionQuery.notEqualTo("user", null);
    }

    return {
      latestTwitterCbs: this.setupQuery(twitterContributionQuery),
      latestIntroCbs: this.setupQuery(introbankContributionQuery),
    };
  },

  setupQuery(query){
    query.include("artist");
    query.include("group");
    query.include("user");
    query.descending("createdAt");
    query.limit(100);
    return query; 
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
        <h2 className="fyuchaCommitsTitle">最近のふゅーちゃ！</h2>
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
