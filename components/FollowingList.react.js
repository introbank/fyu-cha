var React  = require('react');
var AccountInfoLib = require('../lib/AccountInfoLib.js');

var FollowingList = React.createClass({

  render() {
    return(
      <div id="followList" className="tab">
        <div className="box">
          <h1>アーティスト</h1>
          <ul>
            {this.props.artists.map(function (following) {
              if (!following.artist) {
                return <div />;
              }
              var imageStyle = {backgroundImage:'url(' + AccountInfoLib.getImageUrl(following.artist) + ')'};
              return (
                <li key={following.objectId} >
                  <a href={AccountInfoLib.getUrl(following.artist)}>
                    <span style={imageStyle}></span>
                  </a>
                  <h2>{AccountInfoLib.getAccountName(following.artist)}</h2>
                </li>
              )
            })}
          </ul>
          <p className="cf"></p>
        </div>
        <div className="box">
          <h1>グループ</h1>
          <ul>
            {this.props.groups.map(function (following) {
              if (!following.group) {
                return <div />;
              }
              var imageStyle = {backgroundImage:'url(' + AccountInfoLib.getImageUrl(following.group) + ')'};
              return (
                <li key={following.objectId} >
                  <a href={AccountInfoLib.getUrl(following.group)}>
                    <span style={imageStyle}></span>
                  </a>
                  <h2>{AccountInfoLib.getAccountName(following.group)}</h2>
                </li>
              )
            })}
          </ul>
          <p className="cf"></p>
        </div>
      </div>
    );
  },

});

module.exports = FollowingList;
