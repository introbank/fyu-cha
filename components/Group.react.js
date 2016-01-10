var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var AccountInfo   = require('./AccountInfo.react.js');
var MediaList   = require('./MediaList.react.js');
var Schedule   = require('./Schedule.react.js');
var ContributionList    = require('./ContributionList.react.js');
var Follow       = require('./Follow.react.js');
var AccountInfoLib = require('../lib/AccountInfoLib.js');

var Group = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      activeTab: 'media',
      showMedia: true,
      showMember: false,
      showSchedule: false,
      showData: false,
    };
  },

  observe(props, state) {
    var id = props.params.id;

    var groupQuery = new Parse.Query('Group');
    groupQuery.equalTo('twitterUsername', id);

    var artistQuery = new Parse.Query("Artist");
    artistQuery.matchesKeyInQuery('groups', 'objectId', groupQuery);

    return {
      user: ParseReact.currentUser,
      group: groupQuery,
      member: artistQuery,
    };
  },

  changeTab1() {
    this.setState({
      activeTab: 'media',
      showMedia: true,
      showMember: false,
      showSchedule: false,
      showData: false
    });
  },
  
  changeTab2() {
    this.setState({
      activeTab: 'member',
      showMedia: false,
      showMember: true,
      showSchedule: false,
      showData: false
    });
  },

  changeTab3() {
    this.setState({
      activeTab: 'schedule',
      showMedia: false,
      showMember: false,
      showSchedule: true,
      showData: false
    });
  },

  changeTab4() {
    this.setState({
      activeTab: 'data',
      showMedia: false,
      showMember: false,
      showSchedule: false,
      showData: true
    });
  },

  createMemberList(){
    return(
      <div id="followList" className="tab">
        <div className="box">
          <ul>
            {this.data.member.map(function (member) {
              if (!member) {
                return <div />;
              }
              var imageStyle = {backgroundImage:'url(' + AccountInfoLib.getImageUrl(member) + ')'};
              return (
                <li key={member.objectId} >
                  <a href={AccountInfoLib.getUrl(member)}>
                    <span style={imageStyle}></span>
                  </a>
                  <h2>{AccountInfoLib.getAccountName(member)}</h2>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
     );
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
                  <li id="label__tab1">
                    {this.state.activeTab === 'media' ?
                      <a href="#" className="tab1 boR active" onClick={this.changeTab1}>画像/動画</a> :
                      <a href="#" className="tab1 boR" onClick={this.changeTab1}>画像/動画</a>
                    }
                  </li>
                  <li id="label__tab2">
                    {this.state.activeTab === 'member' ?
                      <a href="#" className="tab2 boR active" onClick={this.changeTab2}>メンバー</a> :
                      <a href="#" className="tab2 boR" onClick={this.changeTab2}>メンバー</a>
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
                      <a href="#" className="tab4 " onClick={this.changeTab4}>ふゅーちゃ</a>
                    }
                  </li>
                </ul>
                {this.state.showMedia &&
                <div id="images" className="tab">
                  <MediaList type="Group" id={this.props.params.id} />
                </div>
                }
                {this.state.showMember &&
                <div id="tab2" className="tab">
                  {this.createMemberList(group)}
                </div>
                }
                {this.state.showSchedule &&
                <div id="tab3" className="tab">
                  <Schedule type="Group" account={group} />
                </div>
                }
                {this.state.showData &&
                <div id="tab4" className="tab">
                  <ContributionList type="Group" id={this.props.params.id} />
                </div>
                }
              </div>
            </div>
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
