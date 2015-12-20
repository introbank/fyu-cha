var React  = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');

var Following = React.createClass({
  mixins: [ParseReact.Mixin],

  createQuery(col){
    var following = new Parse.Query('Following');
    following.equalTo("user", Parse.User.current());
    following.include(col);
    following.notEqualTo(col, null);
    return following;
  },

  observe() {
    var followingArtistQuery = this.createQuery("artist");
    var followingGroupQuery = this.createQuery("group");
    return {
      followingArtists: followingArtistQuery,
      followingGroups: followingGroupQuery,
    };
  },


  render() {
    return(
      <div id="followList" className="tab">
        <div className="box">
          <h1>アーティスト</h1>
          <ul>
            {this.data.followingArtists && this.data.followingArtists.map(function (following) {
              return (
                <li>
                  <a href={'artists/' + following.artist.twitterUsername}><img src={following.artist.imageUrl} /></a>
                  <h2>{following.artist.name}</h2>
                </li>
              )
            })}
          </ul>
          <p className="cf"></p>
        </div>
        <div className="box">
          <h1>グループ</h1>
          <ul>
            {this.data.followingGroups && this.data.followingGroups.map(function (following) {
              return (
                <li>
                  <a href={'groups/' + following.group.twitterUsername}><img src={following.group.imageUrl} /></a>
                  <h2>{following.group.name}</h2>
                </li>
              )
            })}
          </ul>
          <p className="cf"></p>
        </div>
      </div>
    );
  },

});

module.exports = Following;
