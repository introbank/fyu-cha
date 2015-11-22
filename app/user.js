var React = require('react');
var User = require('../components/User.react.js');

var json = document.getElementById('app').getAttribute('data-params');
var params = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(User, {params: params}), mountNode);
