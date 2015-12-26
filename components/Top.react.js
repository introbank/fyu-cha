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

    if (!this.data.user) {
      location.href = '/lp.html';
    }

    return (
      <div>
        <Header />
        <Navigation active="top" />
        <Dashboard />
      </div>
    );
  },
});

module.exports = Top;
