var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var AccountInfo   = require('./AccountInfo.react.js');

var Artist = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      editMode: false,
      showMedia: true,
      showData: false,
      eventYear: '',
      eventMonth: '',
      eventDay: '',
      eventTitle: '',
      eventDetail: ''
    };
  },

  observe(props, state) {
    var id = props.params.id;

    var artistQuery = new Parse.Query('Artist');
    artistQuery.equalTo('twitterUsername', id);

    var albumQuery = new Parse.Query('Album');
    albumQuery.matchesQuery('artist', artistQuery);

    var mediaMapQuery = new Parse.Query('AlbumMediaMap')
    mediaMapQuery.matchesQuery('album', albumQuery);
    // editMode:: select all data, non editMode:: select viewable data
    if(!state.editMode){
      mediaMapQuery.equalTo('isViewable', true);
    }
    mediaMapQuery.include('media')

    var eventQuery = new Parse.Query('Event');
    eventQuery.ascending('date');
    eventQuery.matchesQuery('artists', artistQuery);

    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    twitterContributionQuery.matchesQuery("artist", artistQuery);
    twitterContributionQuery.include("user");

    return {
      user: ParseReact.currentUser,
      artist: artistQuery,
      mediaMap: mediaMapQuery,
      events: eventQuery,
      twitterCbs: twitterContributionQuery,
    };
  },

  switchEditMode(event) {
    this.setState({editMode: !this.state.editMode});
  },

  setIsViewable(mediaMapId, isViewable) {
    var AlbumMediaMap = Parse.Object.extend('AlbumMediaMap');
    var albumMediaMap = new AlbumMediaMap();
    albumMediaMap.id = mediaMapId;
    albumMediaMap.set('isViewable', isViewable);
    albumMediaMap.save(null, {
      success: function(res){console.log(res.text);},
      error: function(error){console.log(error.text);}
    });
  },

  changeTab1() {
    this.setState({showMedia: true, showData: false});
  },

  changeTab2() {
    this.setState({showMedia: false, showData: true});
  },

  handleEventYearChange: function(e) {
    this.setState({eventYear: e.target.value});
  },

  handleEventMonthChange: function(e) {
    this.setState({eventMonth: e.target.value});
  },

  handleEventDayChange: function(e) {
    this.setState({eventDay: e.target.value});
  },

  handleEventTitleChange: function(e) {
    this.setState({eventTitle: e.target.value});
  },

  handleEventDetailChange: function(e) {
    this.setState({eventDetail: e.target.value});
  },

  handleEventSubmit(e) {
    e.preventDefault();
    var year = this.state.eventYear;
    var month = this.state.eventMonth;
    var day = this.state.eventDay;
    var title = this.state.eventTitle.trim();
    var detail = this.state.eventDetail.trim();
    if (!year || !month || !day || !title || !detail) {
      return;
    }
    var Event = Parse.Object.extend('Event');
    var event = new Event();
    var date = new Date(year, month-1, day);
    event.set('date', date);
    event.set('title', title);
    event.set('detail', detail);
    var Artist = Parse.Object.extend('Artist');
    var artist = new Artist();
    artist.id = this.data.artist[0].id.objectId;
    var relation = event.relation('artists');
    relation.add(artist);
    event.save();
    this.setState({author: '', text: ''});
  },

  render() {
    var artist = null;
    if (this.data.artist && this.data.artist.length !== 0) {
      artist = this.data.artist[0];
    }

    if (artist) {
      return (

        <div id="wrapper">
          <Header />
          <Navigation />
          <div id="content">
            <AccountInfo account={artist} />
            <div className="tabArea">
            	<div className="contents">
                <ul className="tabs">
                  <li id="label__tab1"><a href="#" className="tab1 boR" onClick={this.changeTab1}>動画/画像</a></li>
                  <li id="label__tab2"><a href="#" className="tab2" onClick={this.changeTab2}>データ</a></li>
                </ul>
                {this.state.showMedia &&
                <div id="tab1" className="tab">
                  <p>
                    {this.data.user && <button className="btn" type="button" onClick={this.switchEditMode}>編集</button>}
                  </p>
                  <ul>
                  {this.data.mediaMap.map(function (mediaMap) {
                    return (
                      <li>
                        <img src={mediaMap.media.mediaUri} />
                        {this.state.editMode && <button className="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, true)}>view</button>}
                        {this.state.editMode && <button className="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, false)}>unview</button>}
                      </li>
                    )
                  }, this)}
                  </ul>
                </div>
                }
                {this.state.showData &&
                <div id="tab2" class="tab">
                  <form className="commentForm" onSubmit={this.handleEventSubmit}>
                    <input
                      type="text"
                      value={this.state.eventYear}
                      onChange={this.handleEventYearChange}
                    />
                    年
                    <input
                      type="text"
                      value={this.state.eventMonth}
                      onChange={this.handleEventMonthChange}
                    />
                    月
                    <input
                      type="text"
                      value={this.state.eventDay}
                      onChange={this.handleEventDayChange}
                    />
                    日　　　
                    <input
                      type="text"
                      placeholder="イベントタイトル"
                      value={this.state.eventTitle}
                      onChange={this.handleEventTitleChange}
                    />
                    <input
                      type="text"
                      placeholder="イベント詳細"
                      value={this.state.eventDetail}
                      onChange={this.handleEventDetailChange}
                    />
                    <input type="submit" value="登録" />
                  </form>
                  {this.data.events.map(function(event) {
                    var eventDate = new Date(event.date);
                    return (
                      <li>{event.title}
                        <ul>
                          <li>{eventDate.getMonth() + 1}月{eventDate.getDate()}日</li>
                          <li>{event.detail}</li>
                        </ul>
                      </li>
                    )
                  })}
                </div>
                }
              </div>
            </div>

            <h3>ふゅーちゃ！してる人たち</h3>
            <p>{this.data.twitterCbs.length}ふゅーちゃ！されています</p>
            {this.data.twitterCbs.map(function(twitterCb){
              if (twitterCb.user){
                return(
                  <li>{twitterCb.user.username}さんが{twitterCb.type}して{twitterCb.point}ふゅーちゃ！</li>
                )
              }
            })}

          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Header />
        </div>
      );
    }
  },

});

module.exports = Artist;
