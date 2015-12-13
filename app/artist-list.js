var React     = require('react');
var ArtistList = require('../components/ArtistList.react.js');

var mountNode = document.getElementById('app');
React.render(React.createElement(ArtistList), mountNode);
