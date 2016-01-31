var Parse       = require('./parse');

class FollowingLib {

  static createQuery(userQuery, col){
    var following = new Parse.Query('Following');
    following.matchesQuery("user",  userQuery);
    following.include(col);
    following.notEqualTo(col, null);
    following.limit(1000);
    return following;
  }

  static createArtistQuery(userQuery){
    return FollowingLib.createQuery(userQuery, "artist");
  }

  static createGroupQuery(userQuery){
    return FollowingLib.createQuery(userQuery, "group");
  }

  static getArtistList(followingArtists){
    var artistList = [];
    for (var following of followingArtists) {
      if (!following.artist) {
        continue;
      }
      if (following.artist) {
        artistList.push(following.artist);
      }
    }
    return artistList;
  }

  static getGroupList(followingGroups){
    var groupList = [];
    for (var following of followingGroups) {
      if (!following.group) {
        continue;
      }
      if (following.group) {
        groupList.push(following.group);
      }
    }
    return groupList;
  }

}

module.exports = FollowingLib;
