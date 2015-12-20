var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var AccountInfo   = require('./AccountInfo.react.js');
var MediaList   = require('./MediaList.react.js');
var EventList   = require('./EventList.react.js');
var Follow       = require('./Follow.react.js');

var Group = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      showMedia: true,
      showData: false,
    };
  },

  observe() {
    var id = this.props.params.id;

    var groupQuery = new Parse.Query('Group');
    groupQuery.equalTo('twitterUsername', id);

    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    twitterContributionQuery.matchesQuery("group", groupQuery);
    twitterContributionQuery.include("user");

    return {
      user: ParseReact.currentUser,
      group: groupQuery,
      twitterCbs: twitterContributionQuery,
    };
  },

  changeTab1() {
    this.setState({showMedia: true, showData: false});
  },

  changeTab2() {
    this.setState({showMedia: false, showData: true});
  },

  render() {
    var group = null;
    if (this.data.group && this.data.group.length !== 0) {
      group = this.data.group[0];
    }

    if (group) {
      var totalFyucha = 0;
      return (
        <div id="wrapper">
          <Header />
          <Navigation />
          <div id="content">
            <AccountInfo account={group} />
            <div className="tabArea">
            	<div className="contents">
                <ul className="tabs">
                  <li id="label__tab1"><a href="#" className="tab1 boR" onClick={this.changeTab1}>動画/画像</a></li>
                  <li id="label__tab2"><a href="#" className="tab2" onClick={this.changeTab2}>データ</a></li>
                </ul>
                {this.state.showMedia &&
                <div id="tab1" className="tab">
                  <MediaList type="Group" id={this.props.params.id} />
                </div>
                }
                {this.state.showData &&
                <div id="tab2" class="tab">
                  <EventList type="Group" id={this.props.params.id} />
                </div>
                }
              </div>
            </div>

            <h3> follow </h3>
            <Follow account={group} />

            <h3>ふゅーちゃ！してる人たち</h3>
            {this.data.twitterCbs.map(function(twitterCb){
              totalFyucha += twitterCb.point;
              if (twitterCb.user){
                return(
                  <li>{twitterCb.user.username}さんが{twitterCb.type}して{twitterCb.point}ふゅーちゃ！</li>
                )
              }
            })}
            <p> トータル {totalFyucha} ふゅーちゃ！ されています </p>


          </div>
        </div>
      );
    } else {
      return (
        <div id="wrapper">
          <Header />
          <Navigation />
        </div>
      );
    }
  },

});

module.exports = Group;
