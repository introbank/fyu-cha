require("babel-polyfill");
var React     = require('react');
var Registration = require('../components/Registration.react.js');

var mountNode = document.getElementById('app');
React.render(React.createElement(Registration), mountNode);
