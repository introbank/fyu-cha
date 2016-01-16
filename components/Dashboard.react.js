var React  = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var AccountInfo   = require('./AccountInfo.react.js');
var UserMediaList       = require('./UserMediaList.react.js');
var FollowingList       = require('./FollowingList.react.js');
var UserSchedule   = require('./UserSchedule.react.js');
var ContributionList    = require('./ContributionList.react.js');
var FollowingLib = require('../lib/FollowingLib.js');

var Dashboard = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      activeTab: 'schedule',
      showSchedule: true,
      showData: false,
      showMedia: false,
      showFollow: false,
    };
  },

  observe() {
    var userQuery = new Parse.Query('User');
    userQuery.equalTo('objectId', Parse.User.current().id);
    var followingArtistQuery = FollowingLib.createArtistQuery(userQuery);
    var followingGroupQuery = FollowingLib.createGroupQuery(userQuery);
    return {
      user: ParseReact.currentUser,
      followingArtists: followingArtistQuery,
      followingGroups: followingGroupQuery,
    };
  },

  changeTab1() {
    this.setState({
      activeTab: 'schedule',
      showSchedule: true,
      showData: false,
      showMedia: false,
      showFollow: false,
    });
  },

  changeTab2() {
    this.setState({
      activeTab: 'data',
      showSchedule: false,
      showData: true,
      showMedia: false,
      showFollow: false,
    });
  },

  changeTab3() {
    this.setState({
      activeTab: 'media',
      showSchedule: false,
      showData: false,
      showMedia: true,
      showFollow: false,
    });
  },

  changeTab4() {
    this.setState({
      activeTab: 'follow',
      showSchedule: false,
      showData: false,
      showMedia: false,
      showFollow: true,
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
                {this.state.activeTab === 'schedule' ?
                  <a href="#" className="tab1 boR active" onClick={this.changeTab1}>スケジュール</a> :
                  <a href="#" className="tab1 boR" onClick={this.changeTab1}>スケジュール</a>
                }
              </li>
              <li id="label__tab2">
                {this.state.activeTab === 'data' ?
                  <a href="#" className="tab2 boR active" onClick={this.changeTab2}>ふゅーちゃ</a> :
                  <a href="#" className="tab2 boR" onClick={this.changeTab2}>ふゅーちゃ</a>
                }
              </li>
              <li id="label__tab3">
                {this.state.activeTab === 'media' ?
                  <a href="#" className="tab3 boR active" onClick={this.changeTab3}>画像/動画</a> :
                  <a href="#" className="tab3 boR" onClick={this.changeTab3}>画像/動画</a>
                }
              </li>
              <li id="label__tab4">
                {this.state.activeTab === 'follow' ?
                  <a href="#" className="tab4 active" onClick={this.changeTab4}>フォロー</a> :
                  <a href="#" className="tab4" onClick={this.changeTab4}>フォロー</a>
                }
              </li>
            </ul>
            {this.state.showMedia &&
              <div id="images" className="tab">
                <UserMediaList type="Dashboard" artists={this.data.followingArtists} groups={this.data.followingGroups} />
              </div>
            }
            {this.state.showFollow &&
              <FollowingList artists={this.data.followingArtists} groups={this.data.followingGroups} />
            }
            {this.state.showSchedule &&
              <UserSchedule artists={this.data.followingArtists} groups={this.data.followingGroups} />
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
