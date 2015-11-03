var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var bootstrap    = require('react-bootstrap');
var FormControls = bootstrap.FormControls;

var Profile = React.createClass({
  mixins: [ParseReact.Mixin],

  observe() {
    var id = this.props.params.id;
    return {
      user: (new Parse.Query('User')).equalTo('username', id),
    };
  },

  render() {
    console.log('user', this.data.user);

    var username;
    if (this.data.user && this.data.user[0]) {
      username = this.data.user[0].username;
    } else {
      username = '';
    }

    return (
      <div>
        <Header />
        <h2>プロフィール</h2>
        <form className="form-horizontal">
          <FormControls.Static label="username" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={username} />
        </form>
      </div>
    );
  },

});

module.exports = Profile;
