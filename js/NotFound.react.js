var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');

import { Router, Route, Link } from 'react-router'

var NotFound = React.createClass({
  mixins: [ParseReact.Mixin],

  render: function() {
    return (
      <div>
        <h1>ページが見つかりませんでした</h1>
        <Link href="/">トップへ</Link>
      </div>
    );
  },

});

module.exports = NotFound;
