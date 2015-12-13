var React        = require('react');
var Parse        = require('../lib/parse');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');

var Registration = React.createClass({

  getInitialState() {
    return {
      artist: '',
      group: ''
    };
  },

  handleArtistChange: function(e) {
    this.setState({artist: e.target.value});
  },

  handleGroupChange: function(e) {
    this.setState({group: e.target.value});
  },

  submit() {
    var Artist = Parse.Object.extend('Artist');
    var artist = new Artist();
    artist.id = this.state.artist;

    var Group = Parse.Object.extend('Group');
    var group = new Group();
    group.id = this.state.group;

    var artistRelation = artist.relation('groups');
    artistRelation.add(group);
    artist.save();

    var groupRelation = group.relation('members');
    groupRelation.add(artist);
    group.save();
  },

  render() {
    return (
      <div id="wrapper">
        <Header />
        <Navigation />
        <form>
          <input type="text" placeholder="アーティストID" value={this.state.artist} onChange={this.handleArtistChange} />
          <input type="text" placeholder="グループID" value={this.state.group} onChange={this.handleGroupChange} />
        </form>
        <button value="登録" onClick={this.submit}>登録</button>
      </div>
    );
  },

});

module.exports = Registration;
