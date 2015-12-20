var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var Follow = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      isFollowing: null,
    };
  },

  observe(props, state) {
  var followingQuery = new Parse.Query("Following");
  var col = this.props.account.className.toLowerCase();
  followingQuery.equalTo("user", Parse.User.current());
  followingQuery.equalTo(col, {"__type":"Pointer", "className": this.props.account.className, "objectId": this.props.account.objectId});
  return {
      user: ParseReact.currentUser,
      following: followingQuery,
    };
  },

  createFollowingObj() {
    var Following = Parse.Object.extend('Following');
    var following = new Following();
    following.set("user", {"__type":"Pointer", "className": this.data.user.className, "objectId": this.data.user.objectId});
    var col = this.props.account.className.toLowerCase();
    following.set(col, {"__type":"Pointer", "className": this.props.account.className, "objectId": this.props.account.objectId});
    return following; 
  },

  follow() {
    var following = this.createFollowingObj();
    following.save();
    this.setState({isFollowing: true});
  },

  unfollow() {
    var Following = Parse.Object.extend('Following');
    var followings = [];
    this.data.following.map(function(follow){
      var following = new Following();
      following.id = follow.objectId;
      followings.push(following);
    });
    Parse.Object.destroyAll(followings);
    this.setState({isFollowing: false});
  },

  render() {
    var isFollowing = this.state.isFollowing;
    if (isFollowing == null){
      isFollowing = (this.data.following.length > 0);
    }
    return (
      <div className="followInfo">
        {isFollowing
          ?
          <div className="follow_btn">
            {this.props.account.name}さんを <button className="btn" type="button" onClick={this.unfollow}>unfollw</button>
          </div>
          :
          <div className="follow_btn">
            {this.props.account.name}さんを <button className="btn" type="button" onClick={this.follow}>follow</button>
          </div>
        }

      </div>
    );
  },

});

module.exports = Follow;
