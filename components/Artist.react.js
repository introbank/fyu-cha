var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var bootstrap    = require('react-bootstrap');
var FormControls = bootstrap.FormControls;
var Jumbotron    = bootstrap.Jumbotron;

var Artist = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {editMode: false};
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
            <div className="mainInfo">
              <div className="contents">
                <img src={artist.imageUrl} className="artistImage"></img>
                <h1>{artist.name}</h1>
                <p className="artistAccount">@{artist.twitterUsername}</p>
                <span>{artist.info}</span>
              </div>
            </div>
            <div className="tabArea">
            	<div className="contents">
                <ul className="tabs">
                  <li id="label__tab1"><a href="#tab1" className="tab1 boR">動画/画像</a></li>
                  <li id="label__tab2"><a href="#tab2" className="tab2">データ</a></li>
                </ul>
                <div id="tab1" className="tab">
                  <p>
                    {this.data.user && <button className="btn" type="button" onClick={this.switchEditMode}>編集</button>}
                  </p>
                  {this.data.mediaMap.map(function (mediaMap) {
                    return (
                      <p>
                        <img src={mediaMap.media.mediaUri} />
                        {this.state.editMode && <button className="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, true)}>view</button>}
                        {this.state.editMode && <button className="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, false)}>unview</button>}
                      </p>
                    )
                  }, this)}
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
                <div id="tab2" class="tab">
                </div>
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
          <h2>アーティスト</h2>
        </div>
      );
    }
  },

});

module.exports = Artist;
