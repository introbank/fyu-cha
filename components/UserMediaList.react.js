var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var UserMediaList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var artists = [];
    for (var following of props.artists) {
      artists.push(following.artist);
    }
    var artistAlbumQuery = new Parse.Query('Album');
    artistAlbumQuery.containedIn('artist', artists);

    var groups = [];
    for (var following of props.groups) {
      groups.push(following.group)
    }
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

  render() {
    if (this.props.artists.length < 1 && this.props.groups.length < 1) {
      return (
        <div className="startButton" onClick={this.jump}>気になるアイドルをフォローする</div>
      );
    }
    return (
      <ul>
        {this.data.mediaMap.map(function (mediaMap) {
          return (
            <li>
              <img src={mediaMap.media.mediaUri} />
            </li>
          );
        })}
      </ul>
    );
  },

});

module.exports = UserMediaList;
