var React  = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var AccountInfo   = require('./AccountInfo.react.js');
var FollowingList       = require('./FollowingList.react.js');
var Schedule   = require('./Schedule.react.js');
var ContributionList    = require('./ContributionList.react.js');

var Dashboard = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      showMedia: true,
      showFollow: false,
      showSchedule: false,
      showData: false,
    };
  },

  observe() {
    return {
      user: ParseReact.currentUser,
    };
  },

  changeTab1() {
    this.setState({showMedia: true, showFollow: false, showSchedule: false, showData: false});
  },

  changeTab2() {
    this.setState({showMedia: false, showFollow: true, showSchedule: false, showData: false});
  },

  changeTab3() {
    this.setState({showMedia: false, showFollow: false, showSchedule: true, showData: false});
  },

  changeTab4() {
    this.setState({showMedia: false, showFollow: false, showSchedule: false, showData: true});
  },

  render() {
    var account = null;
    if (this.data.user) {
      account = {'imageUrl': this.data.user.imageUrl, 'name': this.data.user.name,'twitterUsername': this.data.user.username,'info': this.data.user.info};
    }
    return (
      <div id="content">
        <AccountInfo account={account}/>
        <div className="tabArea">
          <div className="contents">
            <ul className="tabs">
              <li id="label__tab2"><a href="#" className="tab1 boR" onClick={this.changeTab2}>フォロー</a></li>
              <li id="label__tab3"><a href="#" className="tab1 boR" onClick={this.changeTab3}>スケジュール</a></li>
              <li id="label__tab4"><a href="#" className="tab1 boR" onClick={this.changeTab4}>ふゅーちゃ</a></li>
            </ul>
           
            {this.state.showFollow &&
              <FollowingList />
            }
            {this.state.showSchedule &&
              <Schedule type="Dashboard" id={this.data.user.username} />
            }
            {this.state.showData &&
            <div id="tab4" className="tab">
              <ContributionList type="Dashboard" id={this.data.user.username} />
            </div>
            }
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Dashboard;
