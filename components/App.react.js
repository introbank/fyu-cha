var React = require('react');
// var ParseReact = require('parse-react');

var App = React.createClass({
  // mixins: [ParseReact.Mixin],

  render: function() {
    return (
      <div>
        <h1>ダッシュボード</h1>
        <p>TODO: 最近のコントリビュート</p>
        <p>TODO: カレンダー</p>
      </div>
    );
  }

});

module.exports = App;
