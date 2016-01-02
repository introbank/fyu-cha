var React  = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var AccountInfo   = require('./AccountInfo.react.js');
var UserMediaList       = require('./UserMediaList.react.js');
var FollowingList       = require('./FollowingList.react.js');
var ContributionList    = require('./ContributionList.react.js');
var Header       = require('./Header.react.js');
var Navigation   = require('./Navigation.react.js');

var User = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      activeTab: 'media',
      showMedia: true,
      showFollow: false,
      showData: false,
    };
  },

  createQuery(userQuery, col){
    var following = new Parse.Query('Following');
    following.matchesQuery("user", userQuery);
    following.include(col);
    following.notEqualTo(col, null);
    return following;
  },

  observe() {
    var id = this.props.params.id;
    var userQuery = new Parse.Query('User');
    userQuery.equalTo('username', id);
    var followingArtistQuery = this.createQuery(userQuery, "artist");
    var followingGroupQuery = this.createQuery(userQuery, "group");
    return {
      user: userQuery,
      followingArtists: followingArtistQuery,
      followingGroups: followingGroupQuery,
    };
  },

  changeTab1() {
    this.setState({
      activeTab: 'media',
      showMedia: true,
      showFollow: false,
      showData: false
    });
  },

  changeTab2() {
    this.setState({
      activeTab: 'follow',
      showMedia: false,
      showFollow: true,
      showData: false
    });
  },

  changeTab3() {
    this.setState({
      activeTab: 'data',
      showMedia: false,
      showFollow: false,
      showData: true
    });
  },

  render() {
    var user = null;
    if (this.data.user && this.data.user.length !== 0) {
      user = this.data.user[0];
    }

    if(user){
      return (
         <div id="wrapper">
          <Header />
          <Navigation />
            <div id="content">
            <AccountInfo account={user}/>
            <div className="tabArea">
              <div className="contents">
                <ul className="tabs">
                  <li id="label__tab1">
                    {this.state.activeTab === 'media' ?
                      <a href="#" className="tab1 boR active" onClick={this.changeTab1}>画像/動画</a> :
                      <a href="#" className="tab1 boR" onClick={this.changeTab1}>画像/動画</a>
                    }
                  </li>
                  <li id="label__tab2">
                    {this.state.activeTab === 'follow' ?
                      <a href="#" className="tab2 boR active" onClick={this.changeTab2}>フォロー</a> :
                      <a href="#" className="tab2 boR" onClick={this.changeTab2}>フォロー</a>
                    }
                  </li>
                  <li id="label__tab3">
                    {this.state.activeTab === 'data' ?
                      <a href="#" className="tab3 active" onClick={this.changeTab3}>ふゅーちゃ</a> :
                      <a href="#" className="tab3" onClick={this.changeTab3}>ふゅーちゃ</a>
                    }
                  </li>
                </ul>
                {this.state.showMedia &&
                  <div id="images" className="tab">
                    <UserMediaList artists={this.data.followingArtists} groups={this.data.followingGroups} />
                  </div>
                }
                {this.state.showFollow &&
                  <FollowingList artists={this.data.followingArtists} groups={this.data.followingGroups} />
                }
                {this.state.showData &&
                  <ContributionList type="User" id={user.username} />
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
    else{
      return(
        <div id="wrapper">
          <Header />
          <Navigation />
        </div>
      );
    }
  },

});

module.exports = User;
