var React     = require('react');
var Parse      = require('../lib/parse');
var ParseReact = require('parse-react');
var Header    = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');
var Dashboard = require('./Dashboard.react.js');
var LP        = require('./LP.react.js');

var Top = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      serverSideRendering: true
    };
  },

  componentDidMount() {
    this.setState({serverSideRendering: false});
  },

  observe() {
    return {
      user: ParseReact.currentUser,
    }
  },

  render() {
    if (this.state.serverSideRendering) {
      return <div />;
    }

    return (
      <div id="wrapper">
        <Header />
        {this.data.user
          ?
          <div>
            <Navigation active="top" />
            <Dashboard />
          </div>
          :
          <div className="lp">
            <Navigation />
            <img src="/images/lptop1.jpg" alt="夢に向かって頑張るアイドルと、応援するファンのみんなで作るファンページです。現在500以上のアイドルが登録されてます。あなたもふゅーちゃ！でファン活動を始めましょう。" />
            <img src="/images/lptop4.jpg" alt="登録総勢500以上のアイドルを応援するファンが集う日本最大規模のサイトです。応援しているアイドルやファンも盛り上がっているアイドルを探せるようになります。" />
            <img src="/images/lptop2.jpg" alt="自分のいつものアイドルへの貢献が目に見えるようになります。アイドルもあなたの貢献を見てくれるかもしれません。" />
            <img src="/images/lptop3.jpg" alt="イベント情報やライブのスケジュール、あらゆる情報がここに集まります。フォローしているアイドルのスケジュール等が集まり確認しやすくなります。" />
          </div>
        }
      </div>
    );
  },
});

module.exports = Top;
