var Users = require('./dbModel.js').Users;

setInterval(deletecheck, 86400000); // 1日おきにチェック
setInterval(fbdatacheck, 86400000);
setInterval(fbemailcheck, 86400000);

function deletecheck() {
    var now = new Date();
    Users.find({nickname:null,country:null,shortBio:null}, {validation:1}, null, function(err, docs) {
        if (!err) {
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].validation && docs[i].validation.issuedate) {
                    if (now - docs[i].validation.issuedate > 600000) { // 10分以上経ったもの
                        docs[i].remove();
                    }
                } else {
                    docs[i].remove();
                }
            }
        } else {
            console.log(err);
        }
    });
}

function fbdatacheck() {
    Users.find({fbdata:{$ne:null}}, {nickname:1}, null, function(err, docs) {
        if (!err) {
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].nickname) {
                    docs[i].fbdata = null;
                    docs[i].save();
                }
            }
        } else {
            console.log(err);
        }
    });
}

function fbemailcheck() {
    Users.find({email:{$ne:null},fbemail:{$ne:null}}, {fbemail:1}, null, function(err, docs) {
        if (!err) {
            for (var i = 0; i < docs.length; i++) {
                docs[i].fbemail = null;
                docs[i].save();
            }
        } else {
            console.log(err);
        }
    });
}
