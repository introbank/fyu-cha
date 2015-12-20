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
    return following.save(null, {
      success: function(res){console.log(res.text);},
      error: function(error){console.log(error.text);}});
  },

  unfollow() {
    var Following = Parse.Object.extend('Following');
    var followings = [];
    this.data.following.map(function(follow){
      var following = new Following();
      following.id = follow.objectId;
      followings.push(following);
    });
    Parse.Object.destroyAll(followings,{
      success: function(res){console.log(res.text);},
      error: function(error){console.log(error.description);}});
  },

  render() {
    console.log(this.data.following);
    return (
      <div className="followInfo">
        {this.data.user &&
          <div className="follow_btn">
            <ul>
              <li>{this.data.following}{this.props.account.name}さんを <button className="btn" type="button" onClick={this.follow}>follow</button></li>
              <li>{this.props.account.name}さんを <button className="btn" type="button" onClick={this.unfollow}>unfollow</button></li>
            </ul>
          </div>
        }
      </div>
    );
  },

});

module.exports = Follow;
