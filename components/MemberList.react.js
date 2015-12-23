var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var MemberList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var Group = Parse.Object.extend("Group");
    var group = new Group();
    group.id = props.id
    var memberQuery = group.relation("members").query()

    return {
      members: memberQuery
    };
  },

  render() {
    return (
      <ul>
        {this.data.members.map(function(member) {
          return (
            <li>
              <a href={'/artists/' + member.twitterUsername}><img src={member.imageUrl} /></a>
              <h2>{member.name}</h2>
            </li>
          );
        })}
      </ul>
    );
  },

});

module.exports = MemberList;
