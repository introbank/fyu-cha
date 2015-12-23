var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

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
      <div>
        <h2>
          <img src={this.props.group.imageUrl} width="20"/>
          {this.props.group.name}
        </h2>
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
      </div>
    );
  },

});

module.exports = MemberList;
