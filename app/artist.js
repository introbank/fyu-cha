var React     = require('react');
var Artist = require('../components/Artist.react.js');

var json      = document.getElementById('app').getAttribute('data-params');
var params    = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(Artist, {params: params}), mountNode);
