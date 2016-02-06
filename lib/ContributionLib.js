var Parse = require('./parse');
var ParseReact   = require('parse-react');
var AccountInfoLib = require('./AccountInfoLib');

class ContributionLib = {
  static Introbank(){
    return 'IntrobankContribution';
  }
  
  static Twitter(){
    return 'TwitterContribution';
  }

  static create(className, type, user, target, point){
    var col = AccountInfoLib.getColumnName(target);
    {
      type: type,
      user: user,
      col: target,
      point: point,
    };
    return new ParseReact.Mutation.Create(className, data);
  }

  static createAddScedule(user, target){
    var type = "add_schedule";
    var point = 10;
    return ContributionLib.create(ContributionLib.Introbank(), type, user, point);
  }

}

module.exports = ContributionLib;
