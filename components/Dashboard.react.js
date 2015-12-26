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
      activeTab: 'media',
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
    this.setState({
      activeTab: 'media',
      showMedia: true,
      showFollow: false,
      showSchedule: false,
      showData: false
    });
  },

  changeTab2() {
    this.setState({
      activeTab: 'follow',
      showMedia: false,
      showFollow: true,
      showSchedule: false,
      showData: false
    });
  },

  changeTab3() {
    this.setState({
      activeTab: 'schedule',
      showMedia: false,
      showFollow: false,
      showSchedule: true,
      showData: false
    });
  },

  changeTab4() {
    this.setState({
      activeTab: 'data',
      showMedia: false,
      showFollow: false,
      showSchedule: false,
      showData: true
    });
  },

  render() {
    return (
      <div id="content">
        <AccountInfo account={this.data.user}/>
        <div className="tabArea">
          <div className="contents">
            <ul className="tabs">
              <li id="label__tab1">
                {this.state.activeTab === 'media' ?
                  <a href="#" className="tab1 boR active" onClick={this.changeTab1}>画像/動画</a> :
                  <a href="#" className="tab1 boR" onClick={this.changeTab1}>画像/動画</a>
                }
              </li>
              <li id="label__tab2">
                {this.state.activeTab === 'follow' ?
                  <a href="#" className="tab2 boR active" onClick={this.changeTab2}>フォロー</a> :
                  <a href="#" className="tab2 boR" onClick={this.changeTab2}>フォロー</a>
                }
              </li>
              <li id="label__tab3">
                {this.state.activeTab === 'schedule' ?
                  <a href="#" className="tab3 boR active" onClick={this.changeTab3}>スケジュール</a> :
                  <a href="#" className="tab3 boR" onClick={this.changeTab3}>スケジュール</a>
                }
              </li>
              <li id="label__tab4">
                {this.state.activeTab === 'data' ?
                  <a href="#" className="tab4 active" onClick={this.changeTab4}>ふゅーちゃ</a> :
                  <a href="#" className="tab4" onClick={this.changeTab4}>ふゅーちゃ</a>
                }
              </li>
            </ul>
            {this.state.showFollow &&
              <FollowingList />
            }
            {this.state.showSchedule &&
              <Schedule type="Dashboard" id={this.data.user.username} />
            }
            {this.state.showData &&
              <ContributionList type="Dashboard" id={this.data.user.username} />
            }
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Dashboard;
