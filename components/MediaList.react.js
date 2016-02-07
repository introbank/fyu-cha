var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var ContributionLib = require('../lib/ContributionLib.js');

var MediaList = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      editMode: false,
    };
  },

  observe(props, state) {
    var type = props.type;

    var albumQuery = new Parse.Query('Album');
    albumQuery.equalTo(type.toLowerCase(), this.props.account);

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

  openEditMode(event){
    this.setState({editMode: true});
  },

  closeEditMode(event){
    this.setState({editMode: false});
    var contribution = ContributionLib.createEditAlbum(this.data.user, this.props.account);
    contribution.dispatch().then(
      function(result){
        console.log(result);
      },
      function(error){
        console.log(error);
      });
  },

  setIsViewable(mediaMap, isViewable) {
    var AlbumMediaMap = Parse.Object.extend('AlbumMediaMap');
    var albumMediaMap = new AlbumMediaMap();
    albumMediaMap.id = mediaMap.objectId;
    albumMediaMap.set('isViewable', isViewable);
    albumMediaMap.save().then(this.refreshQueries("mediaMap"));
  },


  render() {
    if(this.state.editMode){ 
      return (
        <div>
          <div className="dashboardPhotosEditStartButton" onClick={this.closeEditMode}>保<br />存</div>
          <div className="dashboardPhotos editnow">
          {this.data.mediaMap.map(function (mediaMap) {
            return (
              <div className="dashboardPhoto" key={mediaMap.objectId} >
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
            <div className="dashboardPhotosEditStartButton" onClick={this.openEditMode}>編<br />集</div>
          }
          <ul>
          {this.data.mediaMap.map(function (mediaMap) {
          return (
            <li key={mediaMap.objectId}>
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
