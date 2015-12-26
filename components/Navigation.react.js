var React      = require('react');

var Navigation = React.createClass({

  getDefaultProps() {
    return {
      active: 'none'
    };
  },

  render() {
    console.log(this.props.active);
    return (
      <div id="nav" className="cf">
        <ul>
          {this.props.active === 'top' ?
            <li className="active" onClick={this.top}>マイページ</li> :
            <li onClick={this.top}>マイページ</li>
          }
          {this.props.active === 'idol' ?
            <li className="active" onClick={this.artists}>アイドル</li> :
            <li onClick={this.artists}>アイドル</li>
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
