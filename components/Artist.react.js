var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var AccountInfo  = require('./AccountInfo.react.js');
var MediaList    = require('./MediaList.react.js');
var Schedule   = require('./Schedule.react.js');
var ContributionList    = require('./ContributionList.react.js');
var Follow       = require('./Follow.react.js');
var AccountInfoLib = require('../lib/AccountInfoLib.js');
var PageType = require('../lib/PageType.js');

var Artist = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      activeTab: 'schedule',
      showSchedule: true,
      showData: false,
      showMedia: false,
      showGroup: false,
    };
  },

  observe(props, state) {
    var id = props.params.id;

    var artistQuery = new Parse.Query('Artist');
    artistQuery.equalTo('twitterUsername', id);

    var groupQuery = new Parse.Query("Group");
    groupQuery.matchesKeyInQuery('members', 'objectId', artistQuery);


    return {
      user: ParseReact.currentUser,
      artist: artistQuery,
      group: groupQuery,
    };
  },

  changeTab1() {
    this.setState({
      activeTab: 'schedule',
      showSchedule: true,
      showData: false,
      showMedia: false,
      showGroup: false,
    });
  },

  changeTab2() {
    this.setState({
      activeTab: 'data',
      showSchedule: false,
      showData: true,
      showMedia: false,
      showGroup: false,
    });
  },

  changeTab3() {
    this.setState({
      activeTab: 'media',
      showSchedule: false,
      showData: false,
      showMedia: true,
      showGroup: false,
    });
  },

  changeTab4() {
    this.setState({
      activeTab: 'group',
      showSchedule: false,
      showData: false,
      showMedia: false,
      showGroup: true,
    });
  },

  createGroupList(){
    return(
      <div id="followList" className="tab">
        <div className="box">
          <ul>
            {this.data.group.map(function (group) {
              if (!group) {
                return <div />;
              }
              var imageStyle = {backgroundImage:'url(' + AccountInfoLib.getImageUrl(group) + ')'};
              return (
                <li key={group.objectId} >
                  <a href={AccountInfoLib.getUrl(group)}>
                    <span style={imageStyle}></span>
                  </a>
                  <h2>{AccountInfoLib.getAccountName(group)}</h2>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
     );
  },

  render() {
    var artist = null;
    if (this.data.artist && this.data.artist.length !== 0) {
      artist = this.data.artist[0];
    }

    if (artist) {
      var totalFyucha = 0;
      return (
        <div id="wrapper">
          <Header />
          <Navigation />
          <div id="content">
            <AccountInfo account={artist} />
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
                    {this.state.activeTab === 'group' ?
                      <a href="#" className="tab4 active" onClick={this.changeTab4}>グループ</a> :
                      <a href="#" className="tab4" onClick={this.changeTab4}>グループ</a>
                    }
                  </li>
                </ul>
                {this.state.showSchedule &&
                <div id="tab1" className="tab">
                  <Schedule type={PageType.Artist()} account={artist} />
                </div>
                }
                {this.state.showData &&
                <div id="tab2" className="tab">
                  <ContributionList type={PageType.Artist()} id={this.props.params.id} />
                </div>
                }
                {this.state.showMedia &&
                <div id="images" className="tab">
                  <MediaList type={PageType.Artist()} account={artist} />
                </div>
                }
                {this.state.showGroup &&
                <div id="tab4" className="tab">
                  {this.createGroupList(artist)}
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

module.exports = Artist;
