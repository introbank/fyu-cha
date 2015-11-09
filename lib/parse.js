var Parse;

var setting = require('../setting');

var isNodeJs = typeof window === 'undefined';
if (isNodeJs) {
  Parse = require('parse/node').Parse;
} else {
  Parse = require('parse').Parse;
}

Parse.initialize(setting.parse.appId, setting.parse.jsKey);
module.exports = Parse;
