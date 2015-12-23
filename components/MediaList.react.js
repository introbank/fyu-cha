var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var MediaList = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      editMode: false,
    };
  },

  observe(props, state) {
    var type = props.type;
    var id = props.id;

    var accountQuery = new Parse.Query(type);
    accountQuery.equalTo('twitterUsername', id);

    var albumQuery = new Parse.Query('Album');
    albumQuery.matchesQuery(type.toLowerCase(), accountQuery);

    var mediaMapQuery = new Parse.Query('AlbumMediaMap')
    mediaMapQuery.matchesQuery('album', albumQuery);
    // editMode:: select all data, non editMode:: select viewable data
    if(!state.editMode){
      mediaMapQuery.equalTo('isViewable', true);
    }
    mediaMapQuery.include('media');

    return {
      user: ParseReact.currentUser,
      mediaMap: mediaMapQuery,
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
    return (
      <div>
          {this.data.user && 
            <div class="dashboardPhotosEditStartButton" onClick={this.switchEditMode}>編集</div>}
        <ul>
          {this.data.mediaMap.map(function (mediaMap) {
            return (
              <li>
                <img src={mediaMap.media.mediaUri} />
                {this.state.editMode && <button className="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, true)}>view</button>}
                {this.state.editMode && <button className="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, false)}>unview</button>}
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  },
});

module.exports = MediaList;
