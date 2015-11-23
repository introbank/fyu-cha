var Parse        = require('../lib/parse');

var IntrobankContribution = {
    createParseObjrct: function(){
        var Contribution = Parse.Object.extend('IntrobankContribution');
        return new Contribution();
    }

    saveData : function(user, target, type, point){
        targetCol = target.className.toLowerCase();
        var contrib = createParseObjrct();
        contrib.set('user', {"__type": "Pointer", "className":user.className, "objectId":user.id});
        contrib.set(targetCol, {"__type": "Pointer", "className":target.className, "objectId":target.id});
        contrib.set('point', point);
        contrib.set('type', type);
        return contrib.save(null);
    },

};

module.exports = IntrobankContribution;
