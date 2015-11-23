var Parse        = require('../lib/parse');

var IntrobankContribution = {
    createParseObjrct: function(){
        var Contribution = Parse.Object.extend('IntrobankContribution');
        return new Contribution();
    }

    saveData : function(user, target, type, point){
        targetCol = target.className.toLowerCase();
        var contrib = createParseObjrct();
        contrib.set('user', user);
        contrib.set(targetCol, target);
        contrib.set('point', point);
        contrib.set('type', type);
        return contrib.save(null);
    },

};

module.exports = IntrobankContribution;
