var React     = require('react');
var Group = require('../components/Group.react.js');

var json      = document.getElementById('app').getAttribute('data-params');
var params    = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(Group, {params: params}), mountNode);
