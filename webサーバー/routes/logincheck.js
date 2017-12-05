var Users = require('./dbModel.js').Users;

setInterval(logincheck, 90000);

function logincheck() {
    var past = new Date() - 90000;
    var query = {};
    query.loginflag = {$in:[1,2]};
    query.lastlogin = {$lt: past};
    Users.find(query, {loginflag:1,joinflag:1}, null, function(err, docs) {
        if (!err) {
            for (var i = 0; i < docs.length; i++) {
                docs[i].loginflag = 0;
                docs[i].joinflag = false;
                docs[i].save();
            }
        } else {
            console.log(err);
        }
    });
} 
