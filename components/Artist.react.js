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
      showMedia: true,
      showSchedule: false,
      showData: false,
    };
  },

  observe(props, state) {
    var id = props.params.id;

    var artistQuery = new Parse.Query('Artist');
    artistQuery.equalTo('twitterUsername', id);

    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    twitterContributionQuery.matchesQuery("artist", artistQuery);
    twitterContributionQuery.include("user");

    return {
      user: ParseReact.currentUser,
      artist: artistQuery,
      twitterCbs: twitterContributionQuery,
    };
  },

  changeTab1() {
    this.setState({showMedia: true, showSchedule: false, showData: false});
  },

  changeTab2() {
    this.setState({showMedia: false, showSchedule: true, showData: false});
  },

  changeTab3() {
    this.setState({showMedia: false, showSchedule: false, showData: true});
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
                  <li id="label__tab1"><a href="#" className="tab1 boR" onClick={this.changeTab1}>アルバム</a></li>
                  <li id="label__tab2"><a href="#" className="tab2 boR" onClick={this.changeTab2}>スケジュール</a></li>
                  <li id="label__tab3"><a href="#" className="tab3" onClick={this.changeTab3}>ふゅーちゃ</a></li>
                </ul>
                {this.state.showMedia &&
                <div id="images" className="tab">
                  <MediaList type="Artist" id={this.props.params.id} />
                </div>
                }
                {this.state.showSchedule &&
                <div id="tab2" className="tab">
                  <Schedule type="Artist" id={this.props.params.id} />
                </div>
                }
                {this.state.showData &&
                <div id="tab3" class="tab">
                  <ContributionList type="Artist" id={this.props.params.id} />
                </div>
                }
              </div>
            </div>

            <h3> follow </h3>
            <Follow account={artist} />
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
