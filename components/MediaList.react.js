var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var MediaList = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      editMode: false,
      action: false,
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
    mediaMapQuery.addDescending("createdAt");
    return {
      user: ParseReact.currentUser,
      mediaMap: mediaMapQuery,
    };
  },

  switchEditMode(event) {
    this.setState({editMode: !this.state.editMode});
  },

  setIsViewable(mediaMap, isViewable) {
    ParseReact.Mutation.Set(mediaMap, {'isViewable': isViewable})
    .dispatch().then(this.setState({editMode: true}));
    console.log(this.state.action);
  },

  render() {
    if(this.state.editMode){ 
      return (
        <div>
          <div className="dashboardPhotosEditStartButton" type="button" onClick={this.switchEditMode}>保存</div>
          <div className="dashboardPhotos editnow">
          {this.data.mediaMap.map(function (mediaMap) {
            console.log(mediaMap.isViewable);
            return (
              <div className="dashboardPhoto">
              {mediaMap.isViewable 
              ? 
                <div className="dashboardPhotoEditButtonArea appear">
                  <div className="dashboardPhotoAppearButton" type="button" onClick={this.setIsViewable.bind(this, mediaMap, false)}>表示</div>
                  <div className="dashboardPhotoHideButton" type="button" onClick={this.setIsViewable.bind(this, mediaMap, false)}>非表示</div>
                </div>
              : 
                <div className="dashboardPhotoEditButtonArea hide">
                  <div className="dashboardPhotoAppearButton" type="button" onClick={this.setIsViewable.bind(this, mediaMap, true)}>表示</div>
                  <div className="dashboardPhotoHideButton" type="button" onClick={this.setIsViewable.bind(this, mediaMap, true)}>非表示</div>
                </div>
              }
                <img src={mediaMap.media.mediaUri} />
              </div>
            )}, this) 
          }
          </div>
        </div>
      )
    }
    else {
      return(
        <div>
          {this.data.user &&
            <div className="dashboardPhotosEditStartButton" onClick={this.switchEditMode}>編集</div>
          }
          <ul>
          {this.data.mediaMap.map(function (mediaMap) {
          return (
            <li>
              <img src={mediaMap.media.mediaUri} />
            </li>
          )}, this) 
          }
          </ul>
        </div>
      )
    }
  },
});

module.exports = MediaList;
