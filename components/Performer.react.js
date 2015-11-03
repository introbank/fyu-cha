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
      performer: (new Parse.Query('Performer')).equalTo('twitterUsername', id),
    };
  },

  render() {
    var performer = null;
    if (this.data.performer && this.data.performer.length !== 0) {
      performer = this.data.performer[0];
    }

    if (performer) {
      return (
        <div>
          <Header />
          <h2>パフォーマー</h2>
          <Jumbotron>
            <h3>{performer.name}</h3>
            <p>{performer.info}</p>
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
