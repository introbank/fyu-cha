var Parse;

var isNodeJs = typeof window === 'undefined';
if (isNodeJs) {
  Parse = require('parse/node').Parse;
} else {
  Parse = require('parse').Parse;
}

Parse.initialize('LID0MpbVk0JBivgVMSO6hXO5cQ3wBdlgvA8eEbES', 'VXP7SEeJtZs02Qch88qpi0olZZCoXxVRgM2dmCyO');
module.exports = Parse;
