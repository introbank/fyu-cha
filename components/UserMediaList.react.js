var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var AccountInfoLib = require('../lib/AccountInfoLib.js');
var FollowingLib = require('../lib/FollowingLib');

var UserMediaList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var artists = FollowingLib.getArtistList(props.artists);
    var artistAlbumQuery = new Parse.Query('Album');
    artistAlbumQuery.containedIn('artist', artists);

    var groups = FollowingLib.getGroupList(props.groups);
    var groupAlbumQuery = new Parse.Query('Album');
    groupAlbumQuery.containedIn('group', groups);

    var albumQuery = new Parse.Query.or(artistAlbumQuery, groupAlbumQuery);

    var mediaMapQuery = new Parse.Query('AlbumMediaMap')
    mediaMapQuery.matchesQuery('album', albumQuery);
    mediaMapQuery.equalTo('isViewable', true);
    mediaMapQuery.include('media');
    mediaMapQuery.addDescending("createdAt");
    return {
      mediaMap: mediaMapQuery,
    };
  },

  jump() {
    location.href = '/artists';
  },

  createAlbumAccountHash(){
    var albumAccountHash = {};
    for (var following of this.props.artists) {
      if (!following.artist) {
        continue;
      }
      var album = following.artist.album.objectId;
      albumAccountHash[album] = AccountInfoLib.getUrl(following.artist);
    }
    for (var following of this.props.groups) {
      if (!following.group) {
        continue;
      }
      var album = following.group.album.objectId;
      albumAccountHash[album] = AccountInfoLib.getUrl(following.group);
    }
    return albumAccountHash;
  },


  render() {
    var albumAccountHash = this.createAlbumAccountHash();
    if (this.props.artists.length < 1 && this.props.groups.length < 1) {
      return (
        <div>
        {this.props.type == "Dashboard" 
        ? <div className="startButton" onClick={this.jump}>気になるアイドルをフォローする</div>
        : <div>誰もフォローしていません</div>
        }
        </div>
      );
    }
    return (
      <ul>
        {this.data.mediaMap.map(function (mediaMap) {
          return (
            <li key={mediaMap.objectId}>
              <a href={albumAccountHash[mediaMap.album.objectId]}>
                <img src={mediaMap.media.mediaUri} />
              </a>
            </li>
          );
        })}
      </ul>
    );
  },

});

module.exports = UserMediaList;
