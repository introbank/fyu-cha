var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var bootstrap    = require('react-bootstrap');
var FormControls = bootstrap.FormControls;
var Jumbotron    = bootstrap.Jumbotron;

var Group = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {editMode: false};
  },

  observe() {
    var id = this.props.params.id;

    var groupQuery = new Parse.Query('Group');
    groupQuery.equalTo('twitterUsername', id);

    var albumQuery = new Parse.Query('Album');
    albumQuery.matchesQuery('group', groupQuery);

    var mediaMapQuery = new Parse.Query('AlbumMediaMap')
    mediaMapQuery.matchesQuery('album', albumQuery);
    // editMode:: select all data, non editMode:: select viewable data
    if(!this.state.editMode){
      mediaMapQuery.equalTo('isViewable', true);
    }
    mediaMapQuery.include('media')

    var eventQuery = new Parse.Query('Event');
    eventQuery.matchesQuery('groups', groupQuery);

    return {
      user: ParseReact.currentUser,
      group: groupQuery,
      mediaMap: mediaMapQuery,
      events: eventQuery,
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
    var group = null;
    if (this.data.group && this.data.group.length !== 0) {
      group = this.data.group[0];
    }
    var media = [];
    if (this.data.mediaMap && this.data.mediaMap.length !== 0) {
      for (var i = 0; i < this.data.mediaMap.length; i++) {
        media.push(this.data.mediaMap[i].media.mediaUri)
      }
    }

    if (group) {
      return (
        <div>
          <Header />
          <h2>グループ</h2>
          <Jumbotron>
            <h3>{group.name}</h3>
            <p>{group.info}</p>
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
            <p>
              {this.data.user && <button class="btn" type="button" onClick={this.switchEditMode}>編集</button>}
            </p>
            {this.data.mediaMap.map(function (mediaMap) {
              return (
                <p>
                  <img src={mediaMap.media.mediaUri} height="150" />
                  <button class="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, true)}>view</button>
                  <button class="btn" type="button" onClick={this.setIsViewable.bind(this, mediaMap.objectId, false)}>unview</button>
                </p>
              )
            }, this)}
          </Jumbotron>
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <h2>グループ</h2>
        </div>
      );
    }
  },

});

module.exports = Group;