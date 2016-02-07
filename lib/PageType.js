class PageType {

  static Dashboard(){
    return "Dashboard";
  }

  static Group(){
    return "Group";
  }

  static Artist(){
    return "Artist";
  }

  static User(){
    return "User";
  }

  static isDashboard(type){
    return (type === PageType.Dashboard());
  }

  static isUser(type){
    return (type === PageType.User());
  }

  static isArtist(type){
    return (type === PageType.Artist());
  }

  static isGroup(type){
    return (type === PageType.Artist());
  }

}

module.exports = PageType;
