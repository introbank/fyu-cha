var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var Follow = React.createClass({
  mixins: [ParseReact.Mixin],

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


  getInitialState() {
    return {
      isFollowing: null,
      isWaiting: true,
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

 
  componentDidMount(){
    this.setState({isWaiting: false});
  },
  
  follow() {
    // if not login user, redirect for sign up page
    if (!this.data.user) {
      location.href = '/signup';
    }

    if(this.state.isFollowing || this.state.isWaiting){
      return;
    }
    this.setState({isWaiting: true});
    var following = this.createFollowingObj();
    following.save().then(
      this.refreshQueries(["following"])).then(this.setState({isFollowing: true, isWaiting: false}));
  },

  unfollow() {
    // if not login user, redirect for sign up page
    if (!this.data.user) {
      location.href = '/signup';
    }

    this.setState({isWaiting: true});
    var Following = Parse.Object.extend('Following');
    var followings = [];
    this.data.following.map(function(follow){
      var following = new Following();
      following.id = follow.objectId;
      followings.push(following);
    });
    Parse.Object.destroyAll(followings).then(
      this.refreshQueries(["following"])).then(this.setState({isWaiting: false, isFollowing:false}));
  },

  render() {
    var isFollowing = this.state.isFollowing;
    if (isFollowing == null){
      isFollowing = (this.data.following.length > 0);
    }

    if (this.state.isWaiting){
      return null; 
    }
    else{
      return (
        <div>
          {isFollowing
            ?
            <div className="followButton following" onClick={this.unfollow}>フォロー中</div>
            :
            <div className="followButton unfollowing" onClick={this.follow}>＋フォローする</div>
          }
        </div>
      );
      
    }
  },

});

module.exports = Follow;
