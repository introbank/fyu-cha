var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');

var GroupList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var groupQuery = new Parse.Query('Group');
    groupQuery.limit(1000);
    groupQuery.ascending('name');

    return {
      group: groupQuery,
    };
  },

  render() {
    return (
      <div id="wrapper">
        <Header />
        <Navigation active="group" />
        <div id="content">
          <div className="tabArea">
            <div className="contents">
              <div id="followList" className="tab">
                <div className="box">
                  <h1>グループ</h1>
                  {this.data.group &&
                    <ul>
                      {this.data.group.map(function (group) {
                        return (
                          <li>
                            <a href={'/groups/' + group.twitterUsername}><img src={group.imageUrl} /></a>
                            <h2>{group.name}</h2>
                          </li>
                        )
                      })}
                    </ul>
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

module.exports = GroupList;
