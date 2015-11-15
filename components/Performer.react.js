var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var bootstrap    = require('react-bootstrap');
var FormControls = bootstrap.FormControls;
var Jumbotron    = bootstrap.Jumbotron;

var Performer = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {editMode: false};
  },

  observe() {
    var id = this.props.params.id;
    var isViewable = this.state.editMode;

    var performerQuery = new Parse.Query('Performer');
    performerQuery.equalTo('twitterId', id);
    var albumQuery = new Parse.Query('Album');
    albumQuery.matchesQuery('performer', performerQuery);
    var mediaMapQuery = new Parse.Query('AlbumMediaMap')
    mediaMapQuery.matchesQuery('album', albumQuery);
    mediaMapQuery.equalTo('isViewable', isViewable);
    mediaMapQuery.include('media')

    return {
      performer: new Parse.Query('Performer').equalTo('twitterId', id),
      mediaMap: mediaMapQuery,
    };
  },

  switchEditMode(event) {
    this.setState({editMode: !this.state.editMode});
  },

  render() {
    var performer = null;
    if (this.data.performer && this.data.performer.length !== 0) {
      performer = this.data.performer[0];
    }
    var media = [];
    if (this.data.mediaMap && this.data.mediaMap.length !== 0) {
      for (var i = 0; i < this.data.mediaMap.length; i++) {
        media.push(this.data.mediaMap[i].media.mediaUri)
      }
    }

    if (performer) {
      return (
        <div>
          <Header />
          <h2>パフォーマー</h2>
          <Jumbotron>
            <h3>{performer.name}</h3>
            <p>{performer.info}</p>
            {media.map(function (image) {
              return <img src={image} height="150" />
            })}
            <p><button class="btn" type="button" onClick={this.switchEditMode}>編集</button></p>
          </Jumbotron>
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <h2>パフォーマー</h2>
        </div>
      );
    }
  },

});

module.exports = Performer;
