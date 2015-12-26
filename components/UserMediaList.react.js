var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var UserMediaList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var albumQuery = new Parse.Query('Album');
    var artists = [];
    for (var following of props.artists) {
      artists.push(following.artist);
    }
    albumQuery.containedIn('artist', artists);

    /*var groups = [];
    for (var following of props.groups) {
      groups.push(following.group)
    }
    albumQuery.containedIn('group', groups);*/

    var mediaMapQuery = new Parse.Query('AlbumMediaMap')
    mediaMapQuery.matchesQuery('album', albumQuery);
    mediaMapQuery.equalTo('isViewable', true);
    mediaMapQuery.include('media');
    mediaMapQuery.addDescending("createdAt");
    return {
      mediaMap: mediaMapQuery,
    };
  },

  render() {
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
