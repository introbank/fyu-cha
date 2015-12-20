var React      = require('react');
var Parse      = require('../lib/parse');

var Follow = React.createClass({
  follow(user, account){
    var Following = Parse.Object.extend('Following');
    var following = new Following();
    following.set("user", {"__type":"Pointer", "className": user.className, "objectId": user.objectId});
    var col = account.className.toLowerCase();
    following.set(col, {"__type":"Pointer", "className": account.className, "objectId": account.objectId});
    return following.save(null, {
      success: function(res){console.log(res.text);},
      error: function(error){console.log(error.text);}});
  },

  unfollow(following){
    return following.destroy();
  },

  render() {
    return (
      <div className="followInfo">
        {this.props.account && this.props.user &&
          <div className="follow_btn">
            <ul>
              <li><button className="btn" type="button" onClick={this.follow.bind(this, this.props.user, this.props.account)}>follow</button></li>
            </ul>
          </div>
        }
      </div>
    );
  },

});

module.exports = Follow;
