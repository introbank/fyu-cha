var React     = require('react');
var ArtistList = require('../components/ArtistList.react.js');

var json      = document.getElementById('app').getAttribute('data-params');
var params    = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(ArtistList, {params: params}), mountNode);
