var React      = require('react');

var Navigation = React.createClass({

  getDefaultProps() {
    return {
      active: 'none'
    };
  },

  render() {
    return (
      <div id="nav" className="cf">
        <ul>
          {this.props.active === 'top' ?
            <li className="boR active" onClick={this.top}>マイページ</li> :
            <li className="boR" onClick={this.top}>マイページ</li>
          }
          {this.props.active === 'idol' ?
            <li className="boR active" onClick={this.artists}>アイドル</li> :
            <li className="boR" onClick={this.artists}>アイドル</li>
          }
          {this.props.active === 'group' ?
            <li className="active" onClick={this.groups}>グループ</li> :
            <li onClick={this.groups}>グループ</li>
          }
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
