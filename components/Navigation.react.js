var React      = require('react');

var Navigation = React.createClass({

  render() {
    return (
      <div id="nav" className="cf">
        <ul>
            <li className="boR" onClick={this.top}>マイページ</li>
            <li className="boR" onClick={this.artists}>アイドル</li>
            <li onClick={this.groups}>グループ</li>
        </ul>
    </div>
    );
  },

  top() {
    location.href = '/';
  },

  artists() {
    location.href = '/artists';
  },

  groups() {
    location.href = '/groups';
  },

});

module.exports = Navigation;
