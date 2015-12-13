var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');

var ArtistList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
    var artistQuery = new Parse.Query('Artist');
    artistQuery.ascending('name');

    return {
      artist: artistQuery,
    };
  },

  render() {
    return (
      <div id="wrapper">
        <Header />
        <Navigation />
        <div id="content">
          <div className="tabArea">
            <div className="contents">
              <div id="tab2" className="tab">
                <div className="box">
                  <h1>アーティスト</h1>
                  {this.data.artist &&
                    <ul>
                      {this.data.artist.map(function (artist) {
                        return (
                          <li>
                            <a href={'artists/' + artist.twitterUsername}><img src={artist.imageUrl} /></a>
                            <h2>{artist.name}</h2>
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

module.exports = ArtistList;
