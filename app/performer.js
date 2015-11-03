var React     = require('react');
var Performer = require('../components/Performer.react.js');

var json      = document.getElementById('app').getAttribute('data-params');
var params    = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(Performer, {params: params}), mountNode);
