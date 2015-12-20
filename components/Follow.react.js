var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var Follow = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
  return {
      user: ParseReact.currentUser,
    };
  },

  follow() {
    var Following = Parse.Object.extend('Following');
    var following = new Following();
    following.set("user", {"__type":"Pointer", "className": this.data.user.className, "objectId": this.data.user.objectId});
    var col = this.props.account.className.toLowerCase();
    following.set(col, {"__type":"Pointer", "className": this.props.account.className, "objectId": this.props.account.objectId});
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
        {this.data.user &&
          <div className="follow_btn">
            <ul>
              <li>{this.props.account.name}さんを <button className="btn" type="button" onClick={this.follow}>follow</button></li>
            </ul>
          </div>
        }
      </div>
    );
  },

});

module.exports = Follow;
