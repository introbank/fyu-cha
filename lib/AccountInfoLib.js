class AccountInfoLib {

  static getAccountName(account){
    if (account.className === '_User'){
      return account.name;
    }
    else{
      return (account.displayName) ? account.displayName : account.name;
    }
  }

  static getImageUrl(account){
    if (account.className === '_User'){
      return account.imageUrl;
    }
    else{
      return (account.displayImageUrl) ? account.displayImageUrl : account.imageUrl;
    }
  }

  static getUsername(account){
    if (account.className === '_User'){
      return account.username;
    }
    else{
      return account.twitterUsername;
    } 
  }

  static getUrl(account){
    if (account.className === '_User'){
      return /users/ + account.username;
    }
    else{
      return "/" + account.className.toLowerCase() + "s/" + account.twitterUsername;
    } 
  }

}

module.exports = AccountInfoLib;
