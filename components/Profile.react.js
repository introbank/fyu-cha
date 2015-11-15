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

    var userQuery = new Parse.Query('User');
    userQuery.equalTo('username', id);
    var contributionQuery = new Parse.Query('IntrobankContribution');
    contributionQuery.matchesQuery('user', userQuery);
    return {
      user: userQuery,
      contribution: contributionQuery,
    };
  },

  render() {
    var username;
    if (this.data.user && this.data.user[0]) {
      username = this.data.user[0].username;
    } else {
      username = '';
    }
    var contributions = [];
    if (this.data.contribution && this.data.contribution[0]) {
      for (var i = 0; i < this.data.contribution.length; i++) {
        contributions.push(this.data.contribution[i]);
      }
    }

    return (
      <div>
        <Header />
        <h2>プロフィール</h2>
        <form className="form-horizontal">
          <FormControls.Static label="username" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={username} />
        </form>
        {contributions.map(function (contribution) {
          console.log(contribution);
          return <p>{contribution.point}</p>
        })}
      </div>
    );
  },

});

module.exports = Profile;
