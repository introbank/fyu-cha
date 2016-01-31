require("babel-polyfill");
var React = require('react');
var HowTo = require('../components/HowTo.react.js');

var mountNode = document.getElementById('app');
React.render(React.createElement(HowTo), mountNode);
