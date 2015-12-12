var React = require('react');
var Signup = require('../components/Signup.react.js');

var json      = document.getElementById('app').getAttribute('data-params');
var params    = JSON.parse(json);
var mountNode = document.getElementById('app');
React.render(React.createElement(Signup, {params: params}), mountNode);
