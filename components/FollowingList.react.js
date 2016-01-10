var React  = require('react');

var Following = React.createClass({

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
              var imageStyle = {backgroundImage:'url(' + following.artist.imageUrl + ')'};
              return (
                <li key={following.objectId} >
                  <a href={'/artists/' + following.artist.twitterUsername}>
                    <span style={imageStyle}></span>
                  </a>
                  <h2>{following.artist.name}</h2>
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
              return (
                <li key={following.objectId} >
                  <a href={'/groups/' + following.group.twitterUsername}><img src={following.group.imageUrl} /></a>
                  <h2>{following.group.name}</h2>
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

module.exports = Following;
