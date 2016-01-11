var Parse       = require('./parse');

class FollowingLib {

  static createQuery(userQuery, col){
    console.log(userQuery);
    var following = new Parse.Query('Following');
    following.matchesKeyInQuery("user", "objectId", userQuery);
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

}

module.exports = FollowingLib;
