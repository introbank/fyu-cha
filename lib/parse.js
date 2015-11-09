var Parse;

var setting = require('../setting');

var isNodeJs = typeof window === 'undefined';
if (isNodeJs) {
  Parse = require('parse/node').Parse;
} else {
  Parse = require('parse').Parse;
}

Parse.initialize(setting.appId, setting.jsKey);
module.exports = Parse;
