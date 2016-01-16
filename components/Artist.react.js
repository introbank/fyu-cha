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

    return {
      user: ParseReact.currentUser,
      artist: artistQuery,
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
      activeTab: 'follow',
      showSchedule: false,
      showData: false,
      showMedia: false,
      showGroup: true,
    });
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
                      <a href="#" className="tab3 active" onClick={this.changeTab3}>画像/動画</a> :
                      <a href="#" className="tab3" onClick={this.changeTab3}>画像/動画</a>
                    }
                  </li>
                </ul>
                {this.state.showMedia &&
                <div id="images" className="tab">
                  <MediaList type="Artist" id={this.props.params.id} />
                </div>
                }
                {this.state.showSchedule &&
                <div id="tab2" className="tab">
                  <Schedule type="Artist" account={artist} />
                </div>
                }
                {this.state.showData &&
                <div id="tab3" className="tab">
                  <ContributionList type="Artist" id={this.props.params.id} />
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
