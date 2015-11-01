var React  = require('react');
var Header = require('./Header.react.js');

var Dashboard = React.createClass({

  render() {
    return (
      <div>
        <Header />
        <h2>ダッシュボード</h2>
      </div>
    );
  },

});

module.exports = Dashboard;
