var Parse = require('./parse');
var ParseReact   = require('parse-react');
var AccountInfoLib = require('./AccountInfoLib.js');

class ContributionLib {
  static Introbank(){
    return 'IntrobankContribution';
  }
  
  static Twitter(){
    return 'TwitterContribution';
  }

  static create(className, type, user, target, point){
    var col = AccountInfoLib.getColumnName(target);
    var data = {
      type: type,
      user: user,
      point: point,
    };
    data[col] = target;
    return new ParseReact.Mutation.Create(className, data);
  }

  static createAddScedule(user, target){
    var type = "add_schedule";
    var point = 5;
    return ContributionLib.create(ContributionLib.Introbank(), type, user, target, point);
  }

  static createEditScedule(user, target){
    var type = "edit_schedule";
    var point = 3;
    return ContributionLib.create(ContributionLib.Introbank(), type, user, target, point);
  }

}

module.exports = ContributionLib;
