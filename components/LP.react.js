var React     = require('react');
var bootstrap = require('react-bootstrap');
var Jumbotron = bootstrap.Jumbotron;

var LP = React.createClass({

  render() {
    return (
      <div>
        <Jumbotron>
          <h1>Introbank</h1>
          <p>未ログイン時に表示するページです。</p>
          <p>サイトの説明や楽しそうな雰囲気を伝えます。</p>
        </Jumbotron>
      </div>
    );
  },

});

module.exports = LP;
