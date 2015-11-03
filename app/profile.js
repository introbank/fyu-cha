var React = require('react');
var Profile = require('../components/Profile.react.js');

var json = document.getElementById('app').getAttribute('data-params');
var params = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(Profile, {params: params}), mountNode);
