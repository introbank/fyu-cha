var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var MemberList   = require('./MemberList.react.js');

var ArtistList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var groupQuery = new Parse.Query('Group');
    groupQuery.limit(1000);
    groupQuery.ascending('name');

    return {
      groups: groupQuery
    };
  },

  render() {
    return (
      <div id="wrapper">
        <Header />
        <Navigation active="idol" />
        <div id="content">
          <div className="tabArea">
            <div className="contents">
              <div id="followList" className="tab">
                <div className="box">
                  <h1>アイドル</h1>
                  {this.data.groups &&
                    this.data.groups.map(function (group) {
                      return (
                        <MemberList group={group} key={group.objectId} />
                      );
                    })
                  }
                  <p className="cf"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = ArtistList;
