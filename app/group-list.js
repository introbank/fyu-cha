var React     = require('react');
var GroupList = require('../components/GroupList.react.js');

var json      = document.getElementById('app').getAttribute('data-params');
var params    = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(GroupList, {params: params}), mountNode);
