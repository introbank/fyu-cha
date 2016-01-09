var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var AccountInfoLib = require('../lib/AccountInfoLib.js');

var MemberList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var Group = Parse.Object.extend("Group");
    var group = new Group();
    group.id = props.group.objectId;
    var memberQuery = group.relation("members").query()
    memberQuery.ascending('name');

    return {
      members: memberQuery
    };
  },

  render() {
    if (!this.data.members || this.data.members.length === 0) {
      return <div />;
    }
    return (
      <div key={this.props.key}>
        <h2>
          <a href={AccountInfoLib.getUrl(this.props.group)}>
            <img src={AccountInfoLib.getImageUrl(this.props.group)} width="20"/>
            {AccountInfoLib.getAccountName(this.props.group)}
          </a>
        </h2>
        <ul>
          {this.data.members.map(function(member) {
            return (
              <li key={member.objectId} >
                <a href={AccountInfoLib.getUrl(member)}><img src={AccountInfoLib.getImageUrl(member)} /></a>
                <h2>{AccountInfoLib.getAccountName(member)}</h2>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },

});

module.exports = MemberList;
