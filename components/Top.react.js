var React     = require('react');
var Parse      = require('../lib/parse');
var ParseReact = require('parse-react');
var Header    = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var Dashboard = require('./Dashboard.react.js');
var LP        = require('./LP.react.js');

var Top = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      serverSideRendering: true
    };
  },

  componentDidMount() {
    this.setState({serverSideRendering: false});
  },

  observe() {
    return {
      user: ParseReact.currentUser,
    }
  },

  render() {
    if (this.state.serverSideRendering) {
      return <div />;
    }

    return (
      <div id="wrapper">
        <Header />
        {this.data.user
          ?
          <div>
            <Navigation active="top" />
            <Dashboard />
          </div>
          :
          <div className="lp">
            <Navigation />
            <img src="/images/lp.jpg" alt="ファンのファンによるアイドルのためのサイト。ふゅーちゃ！は「アイドルを応援するファン」を応援しています。夢にむかって頑張るアイドルと、応援するファンのみんなで作るファンページです。" />
          </div>
        }
      </div>
    );
  },
});

module.exports = Top;
