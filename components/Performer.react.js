var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var bootstrap    = require('react-bootstrap');
var FormControls = bootstrap.FormControls;
var Jumbotron    = bootstrap.Jumbotron;

var Performer = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    var id = this.props.params.id;
    return {
      performer: (new Parse.Query('Performer')).equalTo('twitterId', id),
      media: (new Parse.Query('Media')).equalTo('twitterId', id),
    };
  },

  render() {
    var performer = null;
    var media = [];
    if (this.data.performer && this.data.performer.length !== 0) {
      performer = this.data.performer[0];
    }
    if (this.data.media && this.data.media.length !== 0) {
      for (var i = 0; i < this.data.media.length; i++) {
        media.push(this.data.media[i].mediaUri)
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
